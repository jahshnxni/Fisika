// ─── Physics Topic Knowledge Base ───
// This is the structured knowledge the AI uses to teach each topic.

export interface TopicKnowledge {
    slug: string;
    name: string;
    icon: string;
    coreFormulas: string[];
    keyConcepts: string[];
    commonMistakes: string[];
    misconceptions: string[];
    realWorldExamples: string[];
    solvePattern: string; // step-by-step pattern for solving
}

export const TOPIC_KNOWLEDGE: Record<string, TopicKnowledge> = {
    "fluida-statis": {
        slug: "fluida-statis",
        name: "Fluida Statis",
        icon: "🌊",
        coreFormulas: [
            "P_h = ρ·g·h (tekanan hidrostatis)",
            "P_total = P_0 + ρ·g·h (tekanan absolut)",
            "F₁/A₁ = F₂/A₂ (Hukum Pascal)",
            "F_a = ρ_f·g·V_tercelup (Hukum Archimedes)",
            "P = F/A (definisi tekanan)",
        ],
        keyConcepts: [
            "Tekanan hidrostatis berbanding lurus dengan kedalaman",
            "Paradoks hidrostatis: tekanan tidak bergantung bentuk wadah",
            "Hukum Pascal: tekanan diteruskan sama besar ke segala arah",
            "Hukum Archimedes: gaya apung = berat fluida yang dipindahkan",
            "Terapung: ρ_benda < ρ_fluida, Melayang: ρ_benda = ρ_fluida, Tenggelam: ρ_benda > ρ_fluida",
            "Manometer: mengukur tekanan gas menggunakan kolom cairan",
        ],
        commonMistakes: [
            "Mencampur tekanan absolut vs gauge (lupa P_0)",
            "Salah menentukan kedalaman h (mengukur dari dasar, bukan dari permukaan)",
            "Salah arah gaya apung (ke bawah, padahal ke atas)",
            "Mengira tekanan bergantung pada volume/bentuk wadah",
            "Lupa mengonversi satuan (cm² ke m², g/cm³ ke kg/m³)",
            "Salah tanda pada persamaan dongkrak hidrolik",
        ],
        misconceptions: [
            "'Kalor' dan 'suhu' itu sama → BEDA! Kalor = energi, Suhu = ukuran",
            "'Benda berat pasti tenggelam' → SALAH! Kapal baja terapung karena ρ rata-rata < ρ air",
            "'Tekanan di dasar kolam lebih besar dari tabung' → SALAH! Paradoks hidrostatis",
        ],
        realWorldExamples: [
            "Dongkrak hidrolik mobil (Pascal)",
            "Rem hidrolik (Pascal)",
            "Kapal selam (tekanan hidrostatis)",
            "Balon udara panas (Archimedes di udara)",
            "Manometer U pada tabung gas LPG",
        ],
        solvePattern: `1. **Diketahui**: Tulis semua data (ρ, g, h, A, F, dll.)
2. **Ditanya**: Identifikasi besaran yang dicari
3. **Prinsip**: Pilih hukum/rumus yang tepat (Hidrostatik/Pascal/Archimedes)
4. **Rumus**: Tulis rumus yang relevan
5. **Substitusi**: Masukkan angka, perhatikan SATUAN
6. **Hitung**: Kerjakan operasi, perhatikan TANDA
7. **Cek Satuan**: Pastikan satuan hasil benar
8. **Interpretasi**: Apa artinya secara fisik?`,
    },

    "fluida-dinamis": {
        slug: "fluida-dinamis",
        name: "Fluida Dinamis",
        icon: "💨",
        coreFormulas: [
            "Q = A·v (debit aliran)",
            "A₁·v₁ = A₂·v₂ (persamaan kontinuitas)",
            "P + ½ρv² + ρgh = konstan (persamaan Bernoulli)",
            "v = √(2gh) (kecepatan Torricelli)",
        ],
        keyConcepts: [
            "Fluida ideal: tak termampatkan, tak kental, aliran stasioner",
            "Kontinuitas: luas kecil → kecepatan besar",
            "Bernoulli: kecepatan besar → tekanan kecil",
            "Aplikasi: venturimeter, tabung pitot, gaya angkat pesawat",
        ],
        commonMistakes: [
            "Salah membedakan kecepatan vs debit",
            "Salah memilih titik referensi Bernoulli",
            "Lupa suku energi potensial (ρgh) saat ketinggian berbeda",
            "Bingung arah aliran vs arah gaya tekanan",
            "Mengabaikan syarat fluida ideal",
        ],
        misconceptions: [
            "'Tekanan tinggi = kecepatan tinggi' → SALAH! Bernoulli: tekanan BERBANDING TERBALIK dengan kecepatan",
            "'Air keluar dari lubang = debit' → SALAH! Debit = A·v, bukan hanya kecepatan",
        ],
        realWorldExamples: [
            "Selang air: ujung diruncingkan → air menyembur",
            "Gaya angkat sayap pesawat (Bernoulli)",
            "Karburator mobil (venturi)",
            "Atap rumah terbang saat badai (Bernoulli)",
        ],
        solvePattern: `1. **Diketahui**: Data aliran (A, v, P, h, ρ)
2. **Ditanya**: Besaran yang dicari
3. **Gambar**: Sketsa aliran dengan titik 1 dan titik 2
4. **Pilih prinsip**: Kontinuitas? Bernoulli? Torricelli?
5. **Tulis rumus** dan eliminasi suku yang nol
6. **Substitusi & hitung**
7. **Cek**: Apakah jawaban masuk akal secara fisik?`,
    },

    "gelombang": {
        slug: "gelombang",
        name: "Gelombang",
        icon: "〰️",
        coreFormulas: [
            "v = λ·f (hubungan fundamental)",
            "T = 1/f (periode dan frekuensi)",
            "v = √(F/μ) (gelombang pada tali)",
            "y = A·sin(ωt - kx) (persamaan gelombang)",
            "f_n = n·f₁ (harmonik ke-n)",
        ],
        keyConcepts: [
            "Gelombang transversal: arah getar ⊥ arah rambat (tali, EM)",
            "Gelombang longitudinal: arah getar // arah rambat (bunyi)",
            "Superposisi: gelombang bisa bertumpuk (interferensi)",
            "Gelombang stasioner: ujung tetap vs ujung bebas",
            "Resonansi: frekuensi alami = frekuensi sumber → amplitudo maks",
        ],
        commonMistakes: [
            "Salah konversi periode ↔ frekuensi (T = 1/f, bukan T = f)",
            "Bingung fase: simpangan vs kecepatan vs percepatan",
            "Salah menentukan panjang gelombang dari grafik",
            "Campur gelombang berjalan vs gelombang stasioner",
            "Lupa bedakan ujung tetap (simpul) vs ujung bebas (perut)",
        ],
        misconceptions: [
            "'Gelombang memindahkan materi' → SALAH! Yang pindah adalah energi, bukan medium",
            "'Amplitudo besar = cepat' → SALAH! Amplitudo tentang energi, bukan kecepatan rambat",
        ],
        realWorldExamples: [
            "Gelombang laut (transversal)",
            "Bunyi speaker (longitudinal)",
            "Resonansi jembatan (Tacoma Narrows)",
            "Senar gitar (gelombang stasioner)",
        ],
        solvePattern: `1. **Diketahui**: λ, f, T, v, A, ω, k
2. **Ditanya**: Besaran yang dicari
3. **Hubungan**: Gunakan v = λf, T = 1/f
4. **Persamaan gelombang**: y = A sin(ωt ± kx)  
5. **Substitusi & hitung**
6. **Cek satuan**: Hz, m, m/s, rad/s`,
    },

    "suhu-kalor": {
        slug: "suhu-kalor",
        name: "Suhu dan Kalor",
        icon: "🌡️",
        coreFormulas: [
            "Q = m·c·ΔT (kalor sensibel)",
            "Q = m·L (kalor laten)",
            "Q_lepas = Q_terima (Asas Black)",
            "ΔL = L₀·α·ΔT (pemuaian panjang)",
            "H = kA·ΔT/L (laju konduksi)",
        ],
        keyConcepts: [
            "Suhu = ukuran derajat panas, Kalor = energi yang berpindah karena ΔT",
            "Konversi: °C ↔ °F ↔ K ↔ °R",
            "Kalor jenis: energi per kg per °C untuk menaikkan suhu",
            "Kalor laten: energi per kg untuk mengubah wujud (tanpa ΔT)",
            "Asas Black: Q_lepas + Q_terima = 0 (sistem terisolasi)",
            "3 cara perpindahan: konduksi, konveksi, radiasi",
        ],
        commonMistakes: [
            "Salah tanda Q (lepas negatif, terima positif)",
            "Mencampur suhu dan kalor (suhu ≠ energi)",
            "Lupa kalor laten saat ada perubahan wujud",
            "Salah konversi Celcius ke Kelvin (K = C + 273, bukan C + 273,15)",
            "Mengabaikan massa saat menghitung Q",
        ],
        misconceptions: [
            "'Benda dingin tidak punya kalor' → SALAH! Semua benda punya energi internal",
            "'Susu panas + es langsung campuran' → SALAH! Ada tahap: es mencair (kalor laten) + naik suhu",
        ],
        realWorldExamples: [
            "Memasak air (kalor sensibel + laten)",
            "AC dan kulkas (perpindahan kalor)",
            "Thermos (meminimalkan konduksi, konveksi, radiasi)",
            "Bimetal pada setrika otomatis (pemuaian)",
        ],
        solvePattern: `1. **Diketahui**: m, c, L, T_awal, T_akhir
2. **Ditanya**: Kalor? Suhu akhir? Massa?
3. **Cek perubahan wujud**: Ada titik lebur/didih terlewati?
4. **Jika ada**: Q = Q_sensibel + Q_laten (tiap tahap)
5. **Asas Black**: Q_lepas = -Q_terima
6. **Substitusi & hitung**
7. **Cek**: Suhu akhir logis? (antara T cold dan T hot)`,
    },

    "termodinamika": {
        slug: "termodinamika",
        name: "Termodinamika",
        icon: "⚙️",
        coreFormulas: [
            "ΔU = Q - W (Hukum I Termodinamika)",
            "W = P·ΔV (usaha pada proses isobar)",
            "W = nRT·ln(V₂/V₁) (usaha isotermal)",
            "PV = nRT (gas ideal)",
            "η = 1 - T_c/T_h (efisiensi Carnot)",
        ],
        keyConcepts: [
            "Hukum I: energi dalam = kalor - usaha (ΔU = Q - W)",
            "Proses isotermal: T konstan → ΔU = 0 → Q = W",
            "Proses isobar: P konstan → W = PΔV",
            "Proses isokhorik: V konstan → W = 0 → ΔU = Q",
            "Proses adiabatik: Q = 0 → ΔU = -W",
            "Diagram P-V: luas di bawah kurva = usaha",
        ],
        commonMistakes: [
            "Salah tanda W dan Q (konvensi: W positif = oleh gas, Q positif = masuk)",
            "Salah baca diagram P-V (lupa luas = usaha)",
            "Salah menentukan jenis proses (isoterm vs adiabatik)",
            "Mencampur gas ideal vs gas nyata",
            "Lupa konversi kPa·L ke Joule",
        ],
        misconceptions: [
            "'Mesin dengan efisiensi 100%' → MUSTAHIL menurut Hukum II",
            "'Adiabatik = isotermal' → BEDA! Adiabatik Q=0, isotermal ΔT=0",
        ],
        realWorldExamples: [
            "Mesin mobil (siklus Otto)",
            "PLTU (siklus Rankine)",
            "Kulkas dan AC (mesin kalor terbalik)",
            "Pompa ban (proses adiabatik → udara panas)",
        ],
        solvePattern: `1. **Identifikasi proses**: Isoterm? Isobar? Isokhorik? Adiabatik?
2. **Diketahui**: P, V, T, n, Q, W
3. **Gunakan**: PV = nRT untuk data yang kurang
4. **Hukum I**: ΔU = Q - W, dengan syarat khusus proses
5. **Hitung usaha**: Dari diagram P-V atau rumus proses
6. **Cek tanda**: W > 0 (gas berekspansi), Q > 0 (kalor masuk)`,
    },
};

// Helper: resolve topic from slug
export function findTopicKnowledge(slug?: string): TopicKnowledge | null {
    if (!slug) return null;
    const lower = slug.toLowerCase();
    for (const [key, topic] of Object.entries(TOPIC_KNOWLEDGE)) {
        if (lower.includes(key) || lower.includes(topic.name.toLowerCase())) {
            return topic;
        }
    }
    return null;
}

export function getAllTopicSlugs(): string[] {
    return Object.keys(TOPIC_KNOWLEDGE);
}
