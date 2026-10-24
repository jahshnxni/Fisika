/**
 * app/api/ai/chat/legacy-stream.ts
 * Gemini / Groq fallback streaming for when OPENAI_API_KEY is not set.
 * Tries Gemini first (rotating API keys), then falls back to Groq.
 */

type Message = { role: "user" | "assistant"; content: string };

export async function* streamAI(
    systemPrompt: string,
    messages: Message[]
): AsyncGenerator<string> {
    // ── Try Gemini first ─────────────────────────────────────────────────────
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        try {
            const mod: any = await eval('import("@google/genai")');
            const GoogleGenAI = mod.GoogleGenAI;
            if (GoogleGenAI) {
                const ai = new GoogleGenAI({ apiKey: geminiKey });
                const history = messages.slice(0, -1).map(m => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.content }],
                }));
                const lastMsg = messages[messages.length - 1]?.content || "";
                const chat = ai.chats.create({
                    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
                    history,
                    config: { systemInstruction: systemPrompt, temperature: 0.7 },
                });
                const stream = await chat.sendMessageStream({ message: lastMsg });
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) yield text;
                }
                return;
            }
        } catch (e: any) {
            console.warn("[legacy-stream] Gemini failed:", e.message?.slice(0, 80));
        }
    }

    // ── Groq fallback ────────────────────────────────────────────────────────
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
        try {
            const groqMod: any = await eval('import("groq-sdk")');
            const Groq = groqMod.default;
            if (Groq) {
                const groq = new Groq({ apiKey: groqKey });
                const groqMessages = [
                    { role: "system" as const, content: systemPrompt },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                ];
            const stream = await groq.chat.completions.create({
                model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
                messages: groqMessages,
                stream: true,
                max_tokens: 3000,
                temperature: 0.7,
            });
            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) yield text;
            }
            return;
        } catch (e: any) {
            console.warn("[legacy-stream] Groq failed:", e.message?.slice(0, 80));
        }
    }

    // ── Built-in Physica Expert Tutor Fallback (Offline Intelligence) ─────
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    function generateSmartResponse(query: string): string {
        if (query.includes("mikrometer") || query.includes("jangka sorong") || query.includes("ukur") || query.includes("penting")) {
            return `### 📏 Pengukuran Presisi & Kaidah Angka Penting (TKA Kinematika)

Alat ukur panjang memiliki tingkat ketelitian berbeda sesuai kegunaannya:
1. **Mikrometer Sekrup**: Ketelitian $0{,}01\\text{ mm}$ ($0{,}001\\text{ cm}$). Terdiri dari **skala utama** (pada selubung tetap, skala $0{,}5\\text{ mm}$) dan **skala nonius / putar** (50 skala, $0{,}01\\text{ mm}$ per putaran).
   $$\\text{Hasil} = \\text{Skala Utama} + (\\text{Skala Nonius} \\times 0{,}01\\text{ mm})$$
2. **Jangka Sorong**: Ketelitian $0{,}1\\text{ mm}$ atau $0{,}05\\text{ mm}$.
3. **Kaidah Angka Penting**:
   - Angka bukan nol adalah angka penting.
   - Angka nol di antara angka bukan nol adalah angka penting.
   - Penjumlahan/pengurangan: hasilnya hanya boleh mengandung satu angka taksiran.
   - Perkalian/pembagian: jumlah angka penting hasil sama dengan jumlah AP paling sedikit.

💡 **Aplikasi Nyata TKA (Studi Kasus Hega - Tabung Manik-manik):**
Saat mengukur tabung untuk manik-manik:
$$\\text{Diameter Dalam} = \\text{Diameter Luar} - 2 \\times \\text{Ketebalan Dinding}$$
Jika diameter luar $10{,}32\\text{ mm}$ dan tebal dinding $0{,}36\\text{ mm}$, maka diameter dalam tabung adalah:
$$D_{\\text{dalam}} = 10{,}32 - 2(0{,}36) = 10{,}32 - 0{,}72 = 9{,}60\\text{ mm}$$
Manik-manik yang bisa masuk harus berdiameter $\\le 9{,}60\\text{ mm}$ (misal $8{,}80\\text{ mm}$, $9{,}30\\text{ mm}$, dan $9{,}60\\text{ mm}$).`;
        }

        if (query.includes("relatif") || query.includes("kapal") || query.includes("arus") || query.includes("gerak lurus") || query.includes("grafik") || query.includes("mobil")) {
            return `### 🚗 Gerak Lurus & Kecepatan Relatif (TKA Kinematika)

**1. Konsep Kecepatan Relatif Vektor:**
Kecepatan kapal terhadap daratan/pantai ($\\vec{v}_{\\text{resultan}}$) merupakan penjumlahan vektor antara kecepatan kapal terhadap air ($\\vec{v}_{\\text{kapal}}$) dan kecepatan arus air terhadap daratan ($\\vec{v}_{\\text{arus}}$):
$$\\vec{v}_{\\text{tanah}} = \\vec{v}_{\\text{kapal}} + \\vec{v}_{\\text{arus}}$$

💡 **Contoh TKA Soal Kapal (Pulau A ke B sejauh 10 km ke Timur dalam 1 jam):**
- Waktu tempuh yang diinginkan: $t = 1\\text{ jam}$ ($08.00 - 09.00$).
- Kecepatan resultan yang dibutuhkan ke arah timur:
  $$v_{\\text{butuh}} = \\frac{s}{t} = \\frac{10\\text{ km}}{1\\text{ jam}} = 10\\text{ km/jam}\\text{ ke Timur}$$
- Karena arus laut sudah mendorong ke arah timur sebesar $v_{\\text{arus}} = 2\\text{ km/jam}$, maka strategi mesin kapal:
  $$v_{\\text{kapal}} = v_{\\text{butuh}} - v_{\\text{arus}} = 10 - 2 = 8\\text{ km/jam ke arah Timur!}$$

**2. Interpretasi Grafik $v-t$ (Kecepatan terhadap Waktu):**
- **Kemiringan kurva (Gradien)** = Percepatan ($a = \\frac{\\Delta v}{\\Delta t}$).
- **Luas area di bawah grafik** = Jarak tempuh / Perpindahan ($s = \\int v\\,dt$).
- Saat dua kendaraan saling menyusul dari titik berangkat yang sama: **Luas area di bawah grafik kedua kendaraan harus tepat sama ($s_A = s_B$)**!`;
        }

        if (query.includes("basket") || query.includes("parabola") || query.includes("jump shot") || query.includes("roket")) {
            return `### 🏀 Gerak Parabola & Gerak Vertikal (TKA Kinematika)

Gerak Parabola merupakan perpaduan dua gerak independen yang tegak lurus:
1. **Sumbu Horizontal ($X$)**: Gerak Lurus Beraturan (GLB) tanpa percepatan ($a_x = 0$):
   $$v_x = v_0 \\cos\\theta$$
   $$x = (v_0 \\cos\\theta) \\cdot t$$
2. **Sumbu Vertikal ($Y$)**: Gerak Lurus Berubah Beraturan (GLBB) dipengaruhi gravitasi ($g = -10\\text{ m/s}^2$):
   $$v_y(t) = v_0 \\sin\\theta - g t$$
   $$y(t) = y_0 + (v_0 \\sin\\theta) \\cdot t - \\frac{1}{2} g t^2$$

💡 **Analisis TKA Kasus Basket Adrian & Bisma ($x = 3\\text{ m}, \\theta = 50^\\circ$):**
- Waktu bola mencapai jarak ring $x$: $t = \\frac{x}{v_0 \\cos\\theta}$.
- Jika kecepatan awal $v_0$ diturunkan dari $7{,}5\\text{ m/s}$ menjadi $6{,}5\\text{ m/s}$:
  1. Komponen horizontal $v_x$ lebih kecil, sehingga bola membutuhkan waktu $t$ lebih lama untuk mencapai $x = 3\\text{ m}$.
  2. Selama waktu yang lebih lama tersebut, gravitasi menarik bola ke bawah lebih banyak ($-\\frac{1}{2}gt^2$), sehingga ketinggian bola di titik $x = 3\\text{ m}$ menjadi jauh lebih rendah dari ring basket ($< 3{,}05\\text{ m}$).
  3. **Kesimpulan**: Bola Bisma jatuh lebih cepat dan gagal masuk ke dalam ring!`;
        }

        if (query.includes("pascal") || query.includes("hidrolik") || query.includes("dokter gigi") || query.includes("kursi")) {
            return `### 🩺 Hukum Pascal & Sistem Hidrolik Kursi Dokter Gigi (TKA Fluida)

**Bunyi Hukum Pascal:**
> *"Tekanan yang diberikan pada zat cair dalam ruang tertutup akan diteruskan sama besar ke segala arah."*

$$P_1 = P_2 \\implies \\frac{F_1}{A_1} = \\frac{F_2}{A_2}$$

Karena penampang piston berbentuk lingkaran ($A = \\frac{1}{4}\\pi D^2$):
$$\\frac{F_1}{D_1^2} = \\frac{F_2}{D_2^2} \\implies F_1 = F_2 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2$$

💡 **Contoh Soal TKA Asli:**
- Beban kursi dokter gigi: $F_2 = 540\\text{ N}$, diameter piston besar $D_2 = 3\\text{ cm}$.
- Diameter piston kecil injakan kaki: $D_1 = 0{,}5\\text{ cm}$.
- Gaya terkecil yang diperlukan:
  $$F_1 = 540 \\times \\left(\\frac{0{,}5}{3}\\right)^2 = 540 \\times \\left(\\frac{1}{6}\\right)^2 = 540 \\times \\frac{1}{36} = 15\\text{ N}$$
Hanya dengan tenaga $15\\text{ N}$ (setara menekan benda seberat $1{,}5\\text{ kg}$), dokter gigi dapat mengangkat pasien berbobot $540\\text{ N}$!`;
        }

        if (query.includes("archimedes") || query.includes("kapal selam") || query.includes("ballast") || query.includes("apung")) {
            return `### 🚢 Hukum Archimedes & Tangki Ballast Kapal Selam (TKA Fluida)

**Prinsip Hukum Archimedes:**
> *"Benda yang dicelupkan sebagian atau seluruhnya ke dalam fluida akan mengalami gaya ke atas sebesar berat fluida yang dipindahkan."*

$$F_A = \\rho_{\\text{fluida}} \\cdot g \\cdot V_{\\text{tercelup}}$$

**Kondisi Benda dalam Air:**
- **Tenggelam**: $\\rho_{\\text{benda}} > \\rho_{\\text{fluida}}$ (Gaya berat $W > F_A$).
- **Melayang**: $\\rho_{\\text{benda}} = \\rho_{\\text{fluida}}$ (Gaya berat $W = F_A$).
- **Terapung**: $\\rho_{\\text{benda}} < \\rho_{\\text{fluida}}$.

💡 **Aplikasi Tangki Ballast Kapal Selam:**
Kapal selam bermassa $m = 200.000\\text{ kg}$ di dasar laut memiliki $\\rho_{\\text{kapal}} = 1.250\\text{ kg/m}^3$:
$$V_1 = \\frac{m}{\\rho} = \\frac{200.000}{1.250} = 160\\text{ m}^3$$
Agar kapal dapat melayang/terapung mendekati permukaan di air laut ($\\rho = 1.000\\text{ kg/m}^3$), volume kapal efektif harus menjadi:
$$V_2 = \\frac{m}{\\rho_{\\text{air}}} = \\frac{200.000}{1.000} = 200\\text{ m}^3$$
**Perubahan volume tangki ballast**:
$$\\Delta V = V_2 - V_1 = 200 - 160 = 40\\text{ m}^3$$
Air laut dipompa keluar dan digantikan udara bertekanan sebesar $40\\text{ m}^3$!`;
        }

        if (query.includes("bernoulli") || query.includes("sayap") || query.includes("burung") || query.includes("pesawat") || query.includes("dinamis")) {
            return `### 🦅 Hukum Bernoulli & Aerodinamika Sayap Burung/Pesawat (TKA Fluida)

**Asas Bernoulli:**
$$P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{konstan}$$

Untuk penampang sayap (airfoil) dengan beda ketinggian $\\Delta h \\approx 0$:
$$P_{\\text{bawah}} - P_{\\text{atas}} = \\frac{1}{2}\\rho (v_{\\text{atas}}^2 - v_{\\text{bawah}}^2)$$

**Penjelasan Ilmiah Sayap Membantu Terbang:**
1. Penampang atas sayap lebih melengkung, sehingga aliran udara di bagian atas mengalir lebih cepat ($v_{\\text{atas}} > v_{\\text{bawah}}$).
2. Berdasarkan Bernoulli, kecepatan tinggi menghasilkan tekanan yang lebih rendah ($P_{\\text{atas}} < P_{\\text{bawah}}$).
3. Perbedaan tekanan $(\\Delta P)$ antara sisi bawah dan atas menghasilkan **Gaya Angkat (Lift Force)** ke atas:
   $$F_{\\text{angkat}} = \\Delta P \\cdot A = \\frac{1}{2}\\rho A (v_{\\text{atas}}^2 - v_{\\text{bawah}}^2)$$
4. Burung secara dinamis mengubah bentuk sayapnya (sudut serang / camber) untuk mengatur besar gaya angkat saat lepas landas, melayang, atau mendarat.`;
        }

        if (query.includes("termodinamika") || query.includes("carnot") || query.includes("mesin kalor") || query.includes("efisiensi")) {
            return `### ⚙️ Termodinamika & Efisiensi Mesin Kalor (TKA Kalor)

**Hukum I Termodinamika:**
$$\\Delta U = Q - W$$
- $Q$ (+) jika sistem menyerap kalor, (-) jika melepas kalor.
- $W$ (+) jika sistem melakukan usaha ekspansi, (-) jika menerima usaha kompresi.

**Mesin Kalor Carnot:**
Efisiensi mesin kalor didefinisikan sebagai rasio usaha yang dihasilkan terhadap kalor masukan dari reservoir panas:
$$\\eta = \\frac{W}{Q_1} \\implies Q_1 = \\frac{W}{\\eta}$$

💡 **Studi Kasus TKA Soal No 21:**
- Mesin mula-mula efisiensi $\\eta_1 = 30\\% = 0{,}3$, usaha $W = 600\\text{ J}$:
  $$Q_1 = \\frac{600}{0{,}3} = 2.000\\text{ J}$$
- Setelah diperbaiki, efisiensi meningkat menjadi $\\eta_2 = 50\\% = 0{,}5$. Usaha tetap $W = 600\\text{ J}$:
  $$Q_1' = \\frac{600}{0{,}5} = 1.200\\text{ J}$$
- Penghematan kalor masuk:
  $$\\Delta Q_1 = 2.000 - 1.200 = 800\\text{ J}$$
  $$\\text{Persentase} = \\frac{800}{2.000} \\times 100\\% = 40\\% \\text{ lebih sedikit!}$$`;
        }

        if (query.includes("listrik statis") || query.includes("printer") || query.includes("toner") || query.includes("medan listrik")) {
            return `### ⚡ Listrik Statis & Printer Elektrostatik (TKA Kelistrikan)

**1. Kuat Medan Listrik Muatan Titik:**
$$E = k \\frac{|q|}{r^2}$$
- Arah medan listrik muatan positif: **menjauhi muatan**.
- Arah medan listrik muatan negatif: **menuju muatan**.

**2. Titik dengan Medan Listrik Total Nol ($E_{\\text{total}} = 0$):**
- Jika kedua muatan **sejenis** (sama-sama negatif atau sama-sama positif), titik $E=0$ pasti terletak **di antara kedua muatan**.
- Pada titik tersebut, besar $E_1 = E_2$:
  $$k \\frac{|q_1|}{x^2} = k \\frac{|q_2|}{(d - x)^2} \\implies \\frac{\\sqrt{|q_1|}}{x} = \\frac{\\sqrt{|q_2|}}{d - x}$$

💡 **Contoh Soal TKA Printer Laser (Elektroda $q_1 = -4\\,\\mu\\text{C}$ di $x=0$, $q_2 = -9\\,\\mu\\text{C}$ di $x=8\\text{ cm}$):**
$$\\frac{\\sqrt{4}}{x} = \\frac{\\sqrt{9}}{8 - x} \\implies \\frac{2}{x} = \\frac{3}{8 - x}$$
$$2(8 - x) = 3x \\implies 16 - 2x = 3x \\implies 5x = 16 \\implies x = 3{,}2\\text{ cm}$$
Maka titik medan nol berada **di sebelah kanan $q_1$ pada posisi $x = 3{,}2\\text{ cm}$**!`;
        }

        if (query.includes("daya") || query.includes("tarif") || query.includes("kwh") || query.includes("pln") || query.includes("rekening")) {
            return `### 💡 Daya, Energi Listrik & Optimasi Tagihan Rumah Tangga (TKA Kelistrikan)

**Rumus Energi Listrik:**
$$W = P \\cdot t \\quad (\\text{Watt}\\cdot\\text{jam} = \\text{Wh})$$
Untuk konversi ke kiloWatt-hour (kWh):
$$\\text{Energi (kWh)} = \\frac{P\\,(\\text{Watt}) \\times t\\,(\\text{jam})}{1.000}$$

$$\\text{Biaya Bulanan} = \\sum \\text{kWh per alat} \\times \\text{Tarif per kWh}$$

💡 **Strategi Penghematan Efektif (Kasus Target Tagihan < Rp 375.000):**
- AC mengonsumsi daya tertinggi ($1.000\\text{ W}$). Penggunaan $8\\text{ jam/hari}$ selama 30 hari = $240\\text{ kWh}$ (Biaya = $240 \\times 1.500 = \\text{Rp } 360.000$).
- Mengurangi penggunaan AC dari $8\\text{ jam}$ menjadi $4\\text{ jam/hari}$ menghemat $120\\text{ kWh}$ = **hemat Rp 180.000/bulan**, cara paling signifikan untuk memangkas biaya listrik di bawah batas anggaran!`;
        }

        // Generic intelligent tutor reply
        return `### 🧠 Pembahasan Tutor Fisika TKA

Halo! Pertanyaan kamu sangat menarik. Di dalam kurikulum Tes Kemampuan Akademik (TKA) Fisika jenjang SMA:

1. **Pemahaman Fisis Terlebih Dahulu**:
   Fisika bukan sekadar menghafal rumus, melainkan memahami bagaimana alam semesta beroperasi di kehidupan nyata—mulai dari gaya gesek saat mengerem, perbedaan kerapatan udara pada fatamorgana, hingga prinsip Bernoulli pada sayap burung.
2. **Identifikasi Besaran**:
   Tuliskan selalu besaran yang diketahui dan dicari beserta satuan Standar Internasional (SI):
   - Massa ($m$ dalam kg)
   - Kecepatan ($v$ dalam m/s)
   - Waktu ($t$ dalam detik)
   - Gaya ($F$ dalam Newton)
3. **Pilih Persamaan yang Tepat**:
   Gunakan hukum kekekalan (energi, momentum) atau persamaan gerak yang menghubungkan besaran tersebut.

Ketik topik atau soal spesifik yang sedang kamu pelajari (misal: *mikrometer sekrup, gerak parabola basket, sistem hidrolik pascal, roket air, efisiensi carnot, atau medan listrik*) untuk mendapatkan penjelasan step-by-step beserta penurunan rumusnya! ✨`;
    }

    const smartAnswer = generateSmartResponse(lower);
    const chunks = smartAnswer.match(/.{1,40}/gs) || [smartAnswer];
    for (const chunk of chunks) {
        yield chunk;
        await new Promise(r => setTimeout(r, 15));
    }
}
