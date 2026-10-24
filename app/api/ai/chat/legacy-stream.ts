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

import { buildCavemanSystemContext, ConversationTurn } from "@/lib/ai/caveman-memory";

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
    // 1. Build Caveman Memory Compressed Context
    const { enhancedPrompt, compressedMessages } = buildCavemanSystemContext(
        systemPrompt,
        messages as ConversationTurn[],
        topic
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
        const chunks = responseText.match(/.{1,35}/gs) || [responseText];
        for (const chunk of chunks) {
            yield chunk;
            await new Promise(r => setTimeout(r, 12));
        }
        return;
    }

    // 6. Failover to Built-in Physica Offline Physics Knowledge Engine
    console.log(`[streamAI] Using built-in Physica Physics Knowledge Engine (Always-on offline fallback)`);
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    function generateSmartResponse(query: string): string {
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
    const fallbackChunks = smartAnswer.match(/.{1,35}/gs) || [smartAnswer];
    for (const chunk of fallbackChunks) {
        yield chunk;
        await new Promise(r => setTimeout(r, 12));
    }
}
