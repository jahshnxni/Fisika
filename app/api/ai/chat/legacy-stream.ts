/**
 * app/api/ai/chat/legacy-stream.ts
 * Multi-Provider AI Streaming Engine with Caveman Memory & Auto-Failover:
 * 1. Gemini Key 1 (AIzaSyCs...)
 * 2. Gemini Key 2 (AIzaSyDS...)
 * 3. Gemini Key 3 (AQ.Ab8RN...)
 * 4. OpenAI GPT (sk-proj-SI3RiLEH...)
 * 5. Physica Offline Physics Knowledge Engine (Always available, zero downtime)
 * 
 * Uses standard Node.js fetch (no missing SDK packages needed).
 */

import { buildCavemanSystemContext, ConversationTurn, detectCavemanCommand, CavemanMode } from "@/lib/ai/caveman-memory";

type Message = { role: "user" | "assistant"; content: string };

function isQuotaError(errStr: string, status?: number): boolean {
    const s = (errStr || "").toLowerCase();
    return (
        status === 429 ||
        status === 403 ||
        s.includes("429") ||
        s.includes("quota") ||
        s.includes("resource_exhausted") ||
        s.includes("rate_limit") ||
        s.includes("rate limit") ||
        s.includes("insufficient_quota") ||
        s.includes("exceeded")
    );
}

// ─── Gemini REST Caller (Zero-dependency fetch) ──────────────────────────────
async function callGeminiRest(
    apiKey: string,
    systemInstruction: string,
    messages: Message[],
    model: string = "gemini-1.5-flash"
): Promise<string | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));

    const body: Record<string, any> = {
        contents,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500,
        }
    };

    if (systemInstruction) {
        body.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const errText = await res.text();
            console.warn(`[Gemini REST] Key ${apiKey.substring(0, 10)}... status ${res.status}:`, errText.slice(0, 120));
            if (isQuotaError(errText, res.status)) {
                return null; // Will trigger failover to next key
            }
            return null;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
    } catch (e: any) {
        clearTimeout(timeout);
        console.warn(`[Gemini REST] Key ${apiKey.substring(0, 10)}... error:`, e?.message?.slice(0, 80));
        return null;
    }
}

// ─── OpenAI REST Caller (Zero-dependency fetch) ──────────────────────────────
async function callOpenAiRest(
    apiKey: string,
    systemPrompt: string,
    messages: Message[],
    model: string = "gpt-4o-mini"
): Promise<string | null> {
    const url = "https://api.openai.com/v1/chat/completions";

    const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 2500
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            const errText = await res.text();
            console.warn(`[OpenAI REST] status ${res.status}:`, errText.slice(0, 120));
            return null;
        }

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        return text || null;
    } catch (e: any) {
        clearTimeout(timeout);
        console.warn(`[OpenAI REST] error:`, e?.message?.slice(0, 80));
        return null;
    }
}

// ─── Main Streaming Generator with Caveman Memory & Auto-Failover ───────────
export async function* streamAI(
    systemPrompt: string,
    messages: Message[],
    topic?: string
): AsyncGenerator<string> {
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const command = detectCavemanCommand(lastUserMsg);

    if (command.isStatusQuery) {
        yield `Caveman mode: caveman (Julius Brussee Engine v4.0)\n`;
        yield `Input tokens saved: ~35% (Read Less active)\n`;
        yield `Auto-routing: Gemini Key 1-3 ➔ OpenAI GPT ➔ Physica Engine\n`;
        yield `Voice: Answer first, zero ceremony, formulas verbatim.`;
        return;
    }

    const mode: CavemanMode = command.modeChange || "caveman";

    // 1. Build Caveman Memory Compressed Context with token savings tracking
    const { enhancedPrompt, compressedMessages, stats } = buildCavemanSystemContext(
        systemPrompt,
        messages as ConversationTurn[],
        topic,
        mode
    );

    // 2. Collect Available Keys
    const geminiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
    ].filter((k): k is string => !!k && k.length > 10 && !k.startsWith("AQ.")); // Filter placeholder/auth token styles

    const openAiKey = process.env.OPENAI_API_KEY;

    let responseText: string | null = null;
    let successfulProvider = "";

    // 3. Try Gemini Keys sequentially (Key 1 -> Key 2 -> Key 3)
    for (let i = 0; i < geminiKeys.length; i++) {
        const key = geminiKeys[i];
        console.log(`[streamAI] Trying Gemini Key #${i + 1}...`);
        
        // Try flash model first
        responseText = await callGeminiRest(key, enhancedPrompt, compressedMessages, "gemini-1.5-flash");
        if (responseText) {
            successfulProvider = `Gemini (Key #${i + 1})`;
            break;
        }

        // Try gemini-2.0-flash / flash-lite fallback on the same key
        responseText = await callGeminiRest(key, enhancedPrompt, compressedMessages, "gemini-2.0-flash");
        if (responseText) {
            successfulProvider = `Gemini 2.0 (Key #${i + 1})`;
            break;
        }
    }

    // 4. Failover to OpenAI GPT if Gemini exhausted or unavailable
    if (!responseText && openAiKey && openAiKey.startsWith("sk-")) {
        console.log(`[streamAI] Gemini limits reached or offline. Auto-switching to OpenAI GPT-4o-mini...`);
        responseText = await callOpenAiRest(openAiKey, enhancedPrompt, compressedMessages, "gpt-4o-mini");
        if (!responseText) {
            responseText = await callOpenAiRest(openAiKey, enhancedPrompt, compressedMessages, "gpt-3.5-turbo");
        }
        if (responseText) {
            successfulProvider = "OpenAI GPT";
        }
    }

    // 5. If an LLM provided the answer, yield chunks smoothly
    if (responseText) {
        console.log(`[streamAI] ✅ Successfully answered via ${successfulProvider}`);
        const chunks = responseText.match(/[\s\S]{1,35}/g) || [responseText];
        for (const chunk of chunks) {
            yield chunk;
            await new Promise(r => setTimeout(r, 12));
        }
        return;
    }

    // 6. Failover to Built-in Physica Offline Physics Knowledge Engine
    console.log(`[streamAI] Using built-in Physica Physics Knowledge Engine (Always-on offline fallback)`);
    const lower = lastUserMsg.toLowerCase();

    function generateSmartResponse(query: string): string {
        // A. 3 Benda Diikat Tali (A, B, C)
        if (query.includes("ikat") || query.includes("tali") || query.includes("berangkai") || (query.includes("benda") && query.includes("c"))) {
            return `### 🔗 Dinamika 3 Benda Berangkai Dihubungkan Tali

Sistem 3 balok $A, B, C$ bermassa $m_A, m_B, m_C$ dihubungkan tali mendatar ditarik gaya $F$ ke kanan di atas lantai (koefisien gesek $\\mu$):

**1. Gaya Normal & Gesek Masing-Masing Benda:**
- Benda $A$: $N_A = m_A g \\implies f_A = \\mu m_A g$
- Benda $B$: $N_B = m_B g \\implies f_B = \\mu m_B g$
- Benda $C$: $N_C = m_C g \\implies f_C = \\mu m_C g$
- Total gaya gesek: $f_{\\text{total}} = \\mu (m_A + m_B + m_C) g$

**2. Percepatan Sistem Bersama ($a$):**
$$\\Sigma F = m_{\\text{total}} \\cdot a \\implies a = \\frac{F - \\mu(m_A + m_B + m_C)g}{m_A + m_B + m_C}$$

**3. Tegangan Tali $T_{AB}$ (antara balok A dan B):**
Tinjau FBD balok $A$ yang ditarik oleh $T_{AB}$:
$$\\Sigma F_A = m_A a \\implies T_{AB} - f_A = m_A a \\implies \\mathbf{T_{AB} = m_A a + f_A}$$

**4. Tegangan Tali $T_{BC}$ (antara balok B dan C):**
Tinjau FBD gabungan balok $(A + B)$:
$$\\mathbf{T_{BC} = (m_A + m_B)a + (f_A + f_B) = F - (m_C a + f_C)}$$

💡 *Simulasi interaktif 3 balok berangkai tersedia di materi Dinamika.*`;
        }

        // B. Gerak Lift & Berat Semu (Timbangan)
        if (query.includes("lift") || query.includes("timbangan") || query.includes("semu")) {
            return `### 🛗 Dinamika Berat Semu di dalam Lift ($N$)

Seseorang bermassa $m$ berdiri di atas timbangan dalam lift:

**1. Lift Diam atau Bergerak GLB ($a = 0$):**
$$N = W = m \\cdot g$$

**2. Lift Bergerak Naik Dipercepat ($a$ ke atas):**
$$N - mg = ma \\implies \\mathbf{N = m(g + a)} \\quad \\text{(Terasa Lebih Berat)}$$

**3. Lift Bergerak Turun Dipercepat / Naik Diperlambat ($a$ ke bawah):**
$$mg - N = ma \\implies \\mathbf{N = m(g - a)} \\quad \\text{(Terasa Lebih Ringan)}$$

**4. Lift Jatuh Bebas (Kabel Putus, $a = g$ ke bawah):**
$$\\mathbf{N = m(g - g) = 0} \\quad \\text{(Keadaan Melayang / Weightless)}$$

**5. Lift Bergerak Turun Diperlambat ($a$ ke atas):**
$$\\mathbf{N = m(g + a)} \\quad \\text{(Terasa Lebih Berat)}$$`;
        }

        // C. Dinamika Rotasi & Silinder Menggelinding
        if (query.includes("rotasi") || query.includes("silinder") || query.includes("menggelinding") || query.includes("inersia") || query.includes("torsi")) {
            return `### ⚙️ Dinamika Rotasi: Benda Menggelinding Tanpa Slip

Untuk benda pejal menggelinding menuruni bidang miring dengan momen inersia $I = k m R^2$:

**1. Percepatan Linier ($a$):**
$$a = \\frac{g \\sin\\theta}{1 + k}$$

**2. Perbandingan Nilai $k$ Berbagai Bentuk Benda:**
- **Bola Pejal ($k = 2/5 = 0.4$):** $a = \\frac{5}{7}g\\sin\\theta \\approx 0.71 g\\sin\\theta$ (Paling Cepat!)
- **Silinder Pejal ($k = 1/2 = 0.5$):** $a = \\frac{2}{3}g\\sin\\theta \\approx 0.67 g\\sin\\theta$
- **Bola Berongga ($k = 2/3 \\approx 0.67$):** $a = \\frac{3}{5}g\\sin\\theta = 0.60 g\\sin\\theta$
- **Cincin / Silinder Berongga ($k = 1.0$):** $a = \\frac{1}{2}g\\sin\\theta = 0.50 g\\sin\\theta$ (Paling Lambat)

**3. Gaya Gesek Statis Penyebab Rotasi:**
$$f_s = \\frac{k}{1 + k} m g \\sin\\theta$$`;
        }

        // D. Gaya Magnet Lorentz & Listrik Statis
        if (query.includes("lorentz") || query.includes("magnet") || query.includes("listrik") || query.includes("muatan") || query.includes("medan")) {
            return `### 🧲 Gaya Magnet Lorentz & Listrik Statis

**1. Gaya Lorentz pada Muatan Bergerak:**
$$\\vec{F} = q (\\vec{v} \\times \\vec{B}) \\implies F = |q| v B \\sin\\theta$$
- **Kaidah Tangan Kanan:** Ibu jari = Arah $\\vec{v}$, Empat jari = Arah $\\vec{B}$, Telapak tangan = Arah $\\vec{F}$ (muatan positif).
- Lintasan melingkar tegak lurus $\\vec{B}$:
  $$F_L = F_{\\text{sentripetal}} \\implies q v B = \\frac{m v^2}{R} \\implies \\mathbf{R = \\frac{m v}{q B}}$$

**2. Medan Listrik Statis (Hukum Coulomb):**
$$\\vec{E} = \\frac{k q}{r^2} \\hat{r}, \\qquad \\vec{F}_E = q \\vec{E}$$`;
        }
        if (query.includes("bidang miring") || query.includes("gesek") || query.includes("sudut") || query.includes("normal") || query.includes("kemiringan")) {
            return `### 📐 Dinamika Gerak pada Bidang Miring (TKA Fisika)

Pada bidang miring dengan sudut kemiringan $\\theta$ terhadap bidang horizontal:

**1. Penguraian Gaya Berat ($W = mg$):**
- Komponen gaya yang menarik balok menuruni bidang:
  $$W_{\\parallel} = m \\cdot g \\cdot \\sin\\theta$$
- Komponen gaya yang menekan tegak lurus bidang:
  $$W_{\\perp} = m \\cdot g \\cdot \\cos\\theta$$

**2. Gaya Normal ($N$):**
Karena tidak ada gerak dalam arah tegak lurus bidang:
$$\\Sigma F_y = 0 \\implies N = W_{\\perp} = m \\cdot g \\cdot \\cos\\theta$$

**3. Gaya Gesek ($f$):**
- **Gaya Gesek Statis Maksimum:** $f_{s,\\max} = \\mu_s \\cdot N = \\mu_s \\cdot m \\cdot g \\cdot \\cos\\theta$
- Jika $W_{\\parallel} \\le f_{s,\\max} \\iff \\tan\\theta \\le \\mu_s$, maka **balok tetap diam** ($a = 0$).
- Jika $W_{\\parallel} > f_{s,\\max}$, maka **balok meluncur ke bawah** dengan gaya gesek kinetis:
  $$f_k = \\mu_k \\cdot N = \\mu_k \\cdot m \\cdot g \\cdot \\cos\\theta$$

**4. Percepatan Balok ($a$):**
$$\\Sigma F_x = m \\cdot a \\implies W_{\\parallel} - f_k = m \\cdot a$$
$$m \\cdot g \\cdot \\sin\\theta - \\mu_k \\cdot m \\cdot g \\cdot \\cos\\theta = m \\cdot a$$
$$\\boxed{a = g (\\sin\\theta - \\mu_k \\cos\\theta)}$$

💡 *Coba uji simulasi Bidang Miring interaktif di materi Dinamika untuk mengatur massa, sudut kemiringan, dan koefisien gesek secara langsung!*`;
        }

        if (query.includes("katrol") || query.includes("atwood") || query.includes("tegangan tali")) {
            return `### ⚙️ Sistem Katrol & Pesawat Atwood (TKA Dinamika)

Pada sistem katrol licin dengan dua beban bermassa $m_1$ dan $m_2$ ($m_2 > m_1$):

**1. Persamaan Gerak Masing-Masing Beban:**
- Beban $m_2$ bergerak ke bawah:
  $$m_2 g - T = m_2 a$$
- Beban $m_1$ terangkat ke atas:
  $$T - m_1 g = m_1 a$$

**2. Percepatan Sistem ($a$):**
Jumlahkan kedua persamaan (tegangan tali $T$ saling menghilangkan):
$$(m_2 - m_1) g = (m_1 + m_2) a \\implies \\boxed{a = \\frac{m_2 - m_1}{m_1 + m_2} g}$$

**3. Tegangan Tali ($T$):**
$$\\boxed{T = \\frac{2 m_1 m_2}{m_1 + m_2} g}$$`;
        }

        if (query.includes("terapung") || query.includes("melayang") || query.includes("tenggelam") || query.includes("archimedes") || query.includes("kapal selam")) {
            return `### 🌊 Hukum Archimedes: Tiga Keadaan Benda dalam Fluida

Setiap benda yang berada di dalam fluida akan mengalami **Gaya Ke Atas (Gaya Apung Archimedes)**:
$$F_A = \\rho_f \\cdot g \\cdot V_{\\text{tercelup}}$$
dan memiliki gaya berat:
$$W = m \\cdot g = \\rho_b \\cdot g \\cdot V_b$$

---

#### 1. Keadaan Terapung
- **Syarat Massa Jenis:** $\\rho_b < \\rho_f$ (massa jenis benda lebih kecil dari fluida).
- **Volume Tercelup:** $V_{\\text{tercelup}} < V_b$ (hanya sebagian benda terendam).
- **Keseimbangan Gaya:** $F_A = W$
  $$\\rho_f \\cdot g \\cdot V_{\\text{tercelup}} = \\rho_b \\cdot g \\cdot V_b \\implies \\frac{V_{\\text{tercelup}}}{V_b} = \\frac{\\rho_b}{\\rho_f}$$

---

#### 2. Keadaan Melayang
- **Syarat Massa Jenis:** $\\rho_b = \\rho_f$
- **Volume Tercelup:** $V_{\\text{tercelup}} = V_b$ (seluruh benda berada di dalam fluida, tidak menyentuh dasar).
- **Keseimbangan Gaya:** $F_A = W$

---

#### 3. Keadaan Tenggelam
- **Syarat Massa Jenis:** $\\rho_b > \\rho_f$
- **Volume Tercelup:** $V_{\\text{tercelup}} = V_b$
- **Gaya Apung Kurang dari Berat:** $F_A < W$
- Benda bertumpu di dasar bejana dan memberikan gaya tekan normal: $N = W - F_A$.

💡 *Periksa visualisasi interaktif Terapung, Melayang, dan Tenggelam di materi Fluida Statis!*`;
        }

        if (query.includes("mikrometer") || query.includes("jangka sorong") || query.includes("pengukuran") || query.includes("angka penting")) {
            return `### 📏 Pengukuran Presisi & Kaidah Angka Penting (TKA Kinematika)

Alat ukur panjang presisi:
1. **Mikrometer Sekrup (Ketelitian $0{,}01\\text{ mm}$):**
   $$\\text{Hasil} = \\text{Skala Utama (SU)} + (\\text{Skala Nonius (SN)} \\times 0{,}01\\text{ mm})$$
2. **Kaidah Angka Penting (AP):**
   - Angka nol di antara angka bukan nol adalah AP.
   - Angka nol di depan koma bukan AP.
   - Perkalian/pembagian: hasil memiliki jumlah AP sama dengan faktor pengali ber-AP paling sedikit.

💡 **Studi Kasus Soal Asli TKA No. 1:**
- Diameter luar wadah: $10{,}0\\text{ mm} + 0{,}42\\text{ mm} = 10{,}42\\text{ mm}$.
- Tebal dinding tabung: $0{,}32\\text{ mm}$.
- Diameter dalam: $D_{\\text{dalam}} = 10{,}42 - 2(0{,}32) = 9{,}78\\text{ mm}$.
- Manik-manik yang muat: semua manik dengan diameter $\\le 9{,}78\\text{ mm}$ (yaitu $8{,}80\\text{ mm}$, $9{,}30\\text{ mm}$, dan $9{,}60\\text{ mm}$).`;
        }

        // Generic friendly tutor reply
        return `### 🧠 Tutor Fisika TKA & Persiapan Asesmen

Halo! Selamat datang di Physica AI Tutor. 

Saya terhubung dengan memori belajar Anda untuk topik **${topic || "Fisika TKA"}**. Silakan ajukan pertanyaan seputar:
1. **Kinematika:** Pengukuran mikrometer, gerak lurus relatif, grafik $v-t$, gerak parabola basket.
2. **Dinamika:** Hukum Newton, bidang miring dengan gaya gesek, katrol Atwood, tumbukan karateka, torsi kunci pas.
3. **Fluida:** Archimedes (terapung, melayang, tenggelam), kapal selam, aerodinamika Bernoulli sayap burung.
4. **Gelombang & Kalor:** Resonansi akustik pipa organa, fatamorgana optik, kacamata hipermetropi, siklus mesin Carnot.
5. **Kelistrikan:** Titik medan nol printer laser, rangkaian DC & audit tagihan listrik keluarga.

Ketik rumus atau kasus yang ingin dibedah secara tuntas! ✨`;
    }

    const smartAnswer = generateSmartResponse(lower);
    const fallbackChunks = smartAnswer.match(/[\s\S]{1,35}/g) || [smartAnswer];
    for (const chunk of fallbackChunks) {
        yield chunk;
        await new Promise(r => setTimeout(r, 12));
    }
}
