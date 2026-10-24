// Official TKA Fisika Question Database & Generator
// Directly aligned with Pusmendik Kemendikdasmen syllabus and real 2025 TKA exam paper

export function generateAllQuestions() {
    const questions: any[] = [];

    // =========================================================================
    // 1. SOAL ASLI RESMI TKA FISIKA 2025 (PAKET 1) DENGAN DIAGRAM SVG REALISTIS
    // =========================================================================

    // Soal 1: Mikrometer Sekrup & Wadah Manik-Manik
    questions.push({
        questionMd: `### 📏 Soal Asli TKA 2025 - Pengukuran Presisi
**Elemen:** Kinematika | **Subelemen:** Pengukuran

Hega akan membuat wadah untuk tempat manik-manik yang berbentuk tabung dan terbuat dari karton bekas. Hega mengukur ketebalan dinding tabung dan diameter luar tabung dengan menggunakan mikrometer sekrup. Hasil pengukurannya sebagai berikut:

<div class="my-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-6 items-center justify-center">
  <div class="text-center">
    <div class="text-xs text-cyan-400 font-bold mb-2">PENGUKURAN 1: Diameter Luar Tabung</div>
    <svg width="220" height="110" viewBox="0 0 220 110" class="mx-auto rounded bg-slate-950 p-2 border border-slate-800">
      <rect x="10" y="35" width="100" height="40" fill="#334155" stroke="#94a3b8" />
      <line x1="20" y1="55" x2="110" y2="55" stroke="#cbd5e1" stroke-width="2" />
      <line x1="30" y1="40" x2="30" y2="55" stroke="#fff" /><text x="27" y="35" fill="#cbd5e1" font-size="10">0</text>
      <line x1="60" y1="40" x2="60" y2="55" stroke="#fff" /><text x="57" y="35" fill="#cbd5e1" font-size="10">5</text>
      <line x1="90" y1="40" x2="90" y2="55" stroke="#fff" /><text x="85" y="35" fill="#cbd5e1" font-size="10">10</text>
      <line x1="45" y1="55" x2="45" y2="68" stroke="#94a3b8" />
      <line x1="75" y1="55" x2="75" y2="68" stroke="#94a3b8" />
      <rect x="110" y="20" width="90" height="70" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      <line x1="110" y1="35" x2="135" y2="35" stroke="#f43f5e" stroke-width="2" /><text x="140" y="39" fill="#f43f5e" font-size="11" font-weight="bold">45</text>
      <line x1="110" y1="55" x2="135" y2="55" stroke="#38bdf8" stroke-width="2" /><text x="140" y="59" fill="#38bdf8" font-size="11" font-weight="bold">42 (sejajar)</text>
      <line x1="110" y1="75" x2="135" y2="75" stroke="#f43f5e" stroke-width="2" /><text x="140" y="79" fill="#f43f5e" font-size="11" font-weight="bold">40</text>
    </svg>
    <div class="text-[11px] text-slate-400 mt-1 font-mono">Bacaan: 10,0 mm + 0,42 mm = 10,42 mm</div>
  </div>

  <div class="text-center">
    <div class="text-xs text-amber-400 font-bold mb-2">PENGUKURAN 2: Ketebalan Dinding Tabung</div>
    <svg width="220" height="110" viewBox="0 0 220 110" class="mx-auto rounded bg-slate-950 p-2 border border-slate-800">
      <rect x="10" y="35" width="100" height="40" fill="#334155" stroke="#94a3b8" />
      <line x1="20" y1="55" x2="110" y2="55" stroke="#cbd5e1" stroke-width="2" />
      <line x1="40" y1="40" x2="40" y2="55" stroke="#fff" /><text x="37" y="35" fill="#cbd5e1" font-size="10">0</text>
      <rect x="100" y="20" width="100" height="70" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
      <line x1="100" y1="35" x2="125" y2="35" stroke="#94a3b8" /><text x="130" y="39" fill="#94a3b8" font-size="11">35</text>
      <line x1="100" y1="55" x2="125" y2="55" stroke="#f59e0b" stroke-width="2" /><text x="130" y="59" fill="#f59e0b" font-size="11" font-weight="bold">32 (sejajar)</text>
      <line x1="100" y1="75" x2="125" y2="75" stroke="#94a3b8" /><text x="130" y="79" fill="#94a3b8" font-size="11">25</text>
    </svg>
    <div class="text-[11px] text-slate-400 mt-1 font-mono">Bacaan: 0,0 mm + 0,32 mm = 0,32 mm</div>
  </div>
</div>

Berdasarkan hasil pengukuran tersebut, diameter dalam wadah adalah:
$$D_{\\text{dalam}} = D_{\\text{luar}} - 2 \\times t = 10{,}42 - 2(0{,}32) = 9{,}78\\text{ mm}$$
Manik-manik manakah yang dapat masuk ke dalam wadah tabung yang dibuat oleh Hega?`,
        options: JSON.stringify([
            "8,80 mm, 9,30 mm, dan 9,60 mm (semua < 9,78 mm)",
            "Hanya manik-manik berukuran 8,80 mm",
            "10,10 mm dan 10,30 mm",
            "9,60 mm dan 10,10 mm",
            "Semua ukuran manik-manik dapat masuk"
        ]),
        correctIndex: 0,
        explanationMd: `**Langkah Pengerjaan Resmi:**
1. Diameter luar tabung dari mikrometer: $10{,}0\\text{ mm} + 42 \\times 0{,}01\\text{ mm} = 10{,}42\\text{ mm}$.
2. Ketebalan dinding tabung: $0{,}0\\text{ mm} + 32 \\times 0{,}01\\text{ mm} = 0{,}32\\text{ mm}$.
3. Diameter dalam tabung berongga (dua sisi dinding):
   $$D_{\\text{dalam}} = D_{\\text{luar}} - 2(t) = 10{,}42 - 0{,}64 = 9{,}78\\text{ mm}$$
4. Manik-manik yang muat masuk harus memiliki $d \\le 9{,}78\\text{ mm}$, yaitu:
   - $8{,}80\\text{ mm} < 9{,}78\\text{ mm}$ (Masuk)
   - $9{,}30\\text{ mm} < 9{,}78\\text{ mm}$ (Masuk)
   - $9{,}60\\text{ mm} < 9{,}78\\text{ mm}$ (Masuk)`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Pengukuran", "Mikrometer"]),
        skillSlug: "pengukuran-angka-penting",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 2: Gerak Relatif Kapal Antarpulau
    questions.push({
        questionMd: `### 🧭 Soal Asli TKA 2025 - Gerak Relatif Perahu
**Elemen:** Kinematika | **Subelemen:** Gerak Lurus (Gerak Relatif)

Sebuah kapal bergerak dari pulau A menuju pulau B dengan jarak $10\\text{ km}$. Pulau B berada tepat di sebelah timur pulau A. Diketahui kapal berangkat dari pulau A pada pukul 08.00.

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-center">
  <svg width="340" height="140" viewBox="0 0 340 140" class="rounded bg-sky-950">
    <ellipse cx="60" cy="70" rx="35" ry="45" fill="#15803d" />
    <text x="50" y="75" fill="#fff" font-weight="bold" font-size="14">Pulau A</text>
    <ellipse cx="280" cy="70" rx="35" ry="45" fill="#15803d" />
    <text x="270" y="75" fill="#fff" font-weight="bold" font-size="14">Pulau B</text>
    <line x1="95" y1="70" x2="245" y2="70" stroke="#facc15" stroke-dasharray="6,4" stroke-width="2" />
    <text x="145" y="60" fill="#facc15" font-size="12" font-weight="bold">s = 10 km</text>
    <path d="M 120,95 L 200,95 M 190,90 L 200,95 L 190,100" stroke="#38bdf8" stroke-width="3" fill="none" />
    <text x="125" y="115" fill="#38bdf8" font-size="11">Arus: 2 km/jam ke Timur →</text>
  </svg>
</div>

Jika saat itu arus air laut bergerak dari arah barat ke timur dengan kecepatan $2\\text{ km}\\cdot\\text{jam}^{-1}$ dan kapal harus sampai tepat pukul 09.00 ($t = 1\\text{ jam}$), strategi apa yang harus diterapkan agar kapal datang tepat waktu?`,
        options: JSON.stringify([
            "Bergerak ke arah timur dengan kecepatan 8 km·jam⁻¹",
            "Bergerak ke arah timur dengan kecepatan 12 km·jam⁻¹",
            "Bergerak ke arah tenggara dengan kecepatan 10 km·jam⁻¹",
            "Bergerak ke arah barat dengan kecepatan 10 km·jam⁻¹",
            "Bergerak ke arah timur laut dengan kecepatan 10 km·jam⁻¹"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Kecepatan resultan kapal terhadap bumi yang ditargetkan:
   $$v_{\\text{target}} = \\frac{s}{t} = \\frac{10\\text{ km}}{1\\text{ jam}} = 10\\text{ km/jam ke arah Timur}$$
2. Karena arus air laut sudah mendorong ke arah timur sebesar $2\\text{ km/jam}$, maka:
   $$\\vec{v}_{\\text{target}} = \\vec{v}_{\\text{kapal}} + \\vec{v}_{\\text{arus}}$$
   $$10 = v_{\\text{kapal}} + 2 \\implies v_{\\text{kapal}} = 8\\text{ km/jam ke arah Timur}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Gerak Relatif"]),
        skillSlug: "gerak-lurus-relatif",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 3: Uji Coba Mobil & Interpretasi Grafik v-t
    questions.push({
        questionMd: `### 🏎️ Soal Asli TKA 2025 - Analisis Grafik v-t
**Elemen:** Kinematika | **Subelemen:** Gerak Lurus

Di sebuah jalan lurus pinggiran kota, dua mobil yaitu mobil A dan mobil B berangkat dari titik yang sama secara bersamaan ($t = 0$). Kombinasi kecepatan awal dan percepatannya ditunjukkan pada grafik kecepatan terhadap waktu berikut:

<div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-center">
  <svg width="320" height="180" viewBox="0 0 320 180" class="rounded bg-slate-950">
    <line x1="50" y1="150" x2="300" y2="150" stroke="#94a3b8" stroke-width="2" />
    <text x="290" y="170" fill="#94a3b8" font-size="12">t (s)</text>
    <line x1="50" y1="150" x2="50" y2="20" stroke="#94a3b8" stroke-width="2" />
    <text x="15" y="30" fill="#94a3b8" font-size="12">V(m/s)</text>
    <line x1="45" y1="95" x2="270" y2="95" stroke="#475569" stroke-dasharray="4,4" />
    <text x="25" y="100" fill="#cbd5e1" font-size="11">15</text>
    <line x1="45" y1="50" x2="270" y2="50" stroke="#475569" stroke-dasharray="4,4" />
    <text x="25" y="55" fill="#cbd5e1" font-size="11">25</text>
    <line x1="180" y1="155" x2="180" y2="50" stroke="#475569" stroke-dasharray="4,4" />
    <text x="175" y="170" fill="#cbd5e1" font-size="11">5</text>
    <line x1="50" y1="50" x2="280" y2="50" stroke="#38bdf8" stroke-width="3" />
    <text x="285" y="55" fill="#38bdf8" font-weight="bold" font-size="13">B (GLB)</text>
    <line x1="50" y1="95" x2="260" y2="25" stroke="#f43f5e" stroke-width="3" />
    <text x="245" y="20" fill="#f43f5e" font-weight="bold" font-size="13">A (GLBB)</text>
    <circle cx="180" cy="50" r="5" fill="#facc15" />
  </svg>
</div>

Berdasarkan grafik, kondisi manakah yang menggambarkan gerak dari mobil A dan B pada detik ke-5?`,
        options: JSON.stringify([
            "Pada detik ke-5, kecepatan kedua mobil sama.",
            "Kecepatan mobil A dan kecepatan mobil B selalu konstan.",
            "Pada detik ke-5, mobil A dan mobil B berada pada posisi yang sama.",
            "Mobil A akan menyalip mobil B pada detik ke-5.",
            "Percepatan kedua mobil pada detik ke-5 yaitu 25 m·s⁻²"
        ]),
        correctIndex: 0,
        explanationMd: `**Analisis Grafik:**
- Pada kurva $v-t$, titik potong kedua garis pada detik ke-5 ($t = 5\\text{ s}$) menunjukkan bahwa nilai ordinat kecepatan kedua mobil bernilai identik, yaitu $v_A = v_B = 25\\text{ m/s}$.
- Mobil A belum berada pada posisi yang sama karena luas di bawah kurva (jarak) mobil B ($25 \\times 5 = 125\\text{ m}$) lebih besar dari mobil A ($15(5) + \\frac{1}{2}(2)(5^2) = 100\\text{ m}$).`,
        difficulty: "EASY",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Grafik Gerak"]),
        skillSlug: "gerak-lurus-relatif",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 4: Uji Coba Mobil & Jarak Menyalip
    questions.push({
        questionMd: `### 🏁 Soal Asli TKA 2025 - Jarak Menyalip Dua Mobil
**Elemen:** Kinematika | **Subelemen:** Gerak Lurus

Berdasarkan grafik uji coba mobil A dan mobil B pada soal sebelumnya:
- Mobil B bergerak konstan $v_B = 25\\text{ m/s}$
- Mobil A bergerak GLBB dari $v_{0A} = 15\\text{ m/s}$ hingga mencapai $25\\text{ m/s}$ pada $t = 5\\text{ s}$ ($a_A = 2\\text{ m/s}^2$).

Mobil A akan menyusul mobil B setelah menempuh jarak ....`,
        options: JSON.stringify([
            "250 m",
            "150 m",
            "200 m",
            "300 m",
            "400 m"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Syarat menyusul adalah jarak tempuh kedua mobil sama ($s_A = s_B$):
   $$s_B = v_B \\cdot t = 25t$$
   $$s_A = v_{0A} t + \\frac{1}{2} a_A t^2 = 15t + \\frac{1}{2}(2)t^2 = 15t + t^2$$
2. Samakan kedua persamaan:
   $$15t + t^2 = 25t \\implies t^2 - 10t = 0 \\implies t(t - 10) = 0 \\implies t = 10\\text{ detik}$$
3. Jarak tempuh saat menyusul:
   $$s = 25 \\times 10 = \\mathbf{250\\text{ meter}}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Menyusul"]),
        skillSlug: "gerak-lurus-relatif",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 5: Gerak Vertikal Dua Roket Air
    questions.push({
        questionMd: `### 🚀 Soal Asli TKA 2025 - Roket Air Vertikal
**Elemen:** Kinematika | **Subelemen:** Gerak Vertikal

Sekelompok murid menerbangkan 2 buah roket air lurus ke atas pada waktu yang bersamaan dari lapangan.
- Roket A diluncurkan dengan kecepatan awal $v_{0A} = 40\\text{ m/s}$
- Roket B diluncurkan dengan kecepatan awal $v_{0B} = 50\\text{ m/s}$
Percepatan gravitasi Bumi $g = 10\\text{ m}\\cdot\\text{s}^{-2}$.

Berapakah perbedaan ketinggian kedua roket air setelah $3\\text{ detik}$ diluncurkan?`,
        options: JSON.stringify([
            "30 m",
            "50 m",
            "75 m",
            "105 m",
            "180 m"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Persamaan posisi gerak vertikal:
$$h(t) = v_0 t - \\frac{1}{2}gt^2$$
Selisih ketinggian kedua roket:
$$\\Delta h = h_B - h_A = \\left(v_{0B} t - \\frac{1}{2}gt^2\\right) - \\left(v_{0A} t - \\frac{1}{2}gt^2\\right)$$
$$\\Delta h = (v_{0B} - v_{0A}) \\cdot t = (50 - 40) \\times 3 = 10 \\times 3 = \\mathbf{30\\text{ meter}}$$
(Komponen gravitasi saling menghilangkan karena diluncurkan bersamaan!).`,
        difficulty: "EASY",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Gerak Vertikal"]),
        skillSlug: "gerak-lurus-relatif",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 7: Gerak Parabola Jump Shot Bola Basket
    questions.push({
        questionMd: `### 🏀 Soal Asli TKA 2025 - Parabola Jump Shot Basket
**Elemen:** Kinematika | **Subelemen:** Gerak Parabola

Adrian dan Bisma melakukan lemparan melompat (*jump shot*) dari jarak mendatar $x = 3\\text{ m}$ dari ring basket setinggi $h = 3{,}05\\text{ m}$. Bola dilepaskan pada sudut $50^\\circ$ dari horizontal dan dari ketinggian awal $y_0 = 2\\text{ m}$.
(Diketahui $\\sin 50^\\circ = 0{,}766$, $\\cos 50^\\circ = 0{,}643$, $g = 10\\text{ m/s}^2$).
- Pada percobaan pertama, keduanya menembak dengan $v_0 = 7{,}5\\text{ m/s}$ dan bola tepat masuk ke ring.
- Pada percobaan kedua, Bisma menembakkan bola dengan menurunkan kecepatan menjadi $v_0 = 6{,}5\\text{ m/s}$ dengan sudut tetap $50^\\circ$.

Kondisi apa yang akan terjadi pada tembakan Bisma jika dibandingkan dengan Adrian?`,
        options: JSON.stringify([
            "Bola Bisma jatuh lebih cepat dan gagal masuk karena kecepatannya lebih kecil.",
            "Kedua bola tetap masuk ke ring karena sudut dan tinggi awalnya tidak berubah.",
            "Bola Bisma dipastikan masih dapat masuk ke dalam ring karena sudutnya besar.",
            "Bola Bisma akan melengkung lebih tinggi sehingga justru lebih mudah masuk.",
            "Bola Adrian diperkirakan akan melewati ring karena kecepatannya terlalu besar."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Waktu untuk menempuh jarak mendatar $x = 3\\text{ m}$:
$$t = \\frac{x}{v_0 \\cos 50^\\circ} = \\frac{3}{6{,}5 \\times 0{,}643} \\approx 0{,}718\\text{ s}$$
Ketinggian bola Bisma saat $x = 3\\text{ m}$:
$$y = y_0 + v_0 \\sin 50^\\circ \\cdot t - \\frac{1}{2}gt^2$$
$$y = 2 + (6{,}5 \\times 0{,}766)(0{,}718) - 5(0{,}718)^2 = 2 + 3{,}57 - 2{,}58 = 2{,}99\\text{ m}$$
Karena ketinggian bola hanya $2{,}99\\text{ m}$ (di bawah tinggi ring $3{,}05\\text{ m}$), bola jatuh lebih pendek dan gagal masuk.`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Kinematika", "Gerak Parabola"]),
        skillSlug: "gerak-parabola-melingkar",
        unitSlug: "kinematika",
        category: "kinematika"
    });

    // Soal 8: Hukum Inersia Mobil Mengerem
    questions.push({
        questionMd: `### 🚗 Soal Asli TKA 2025 - Hukum Kelembaman Newton
**Elemen:** Dinamika | **Subelemen:** Hubungan Gaya dan Gerak (Hukum Newton)

Ketika sebuah mobil tiba-tiba mengerem mendadak, penumpang di dalamnya akan terdorong ke depan.

Di antara beberapa fenomena berikut ini yang menunjukkan penerapan hukum yang sama (Hukum I Newton / Kelembaman) adalah...`,
        options: JSON.stringify([
            "Sebuah buku akan tetap diam di atas meja sampai ada gaya yang menggerakkannya.",
            "Semakin besar gaya yang diberikan pada suatu benda, semakin besar percepatannya.",
            "Ketika mendayung perahu ke depan, air akan mendorong perahu ke belakang.",
            "Sebuah bola kasti yang dilempar vertikal ke atas oleh seseorang akan kembali jatuh ke tanah.",
            "Dibutuhkan gaya yang lebih besar untuk mempercepat truk dibandingkan mempercepat sepeda motor."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Penumpang terdorong ke depan karena mempertahankan keadaan awalnya (inersia / kelembaman / Hukum I Newton $\\Sigma F = 0$). Hal ini setara dengan buku yang tetap diam di atas meja selama tidak ada gaya luar yang mempengaruhinya.
- Pilihan B & E menerapkan Hukum II Newton ($F = ma$).
- Pilihan C menerapkan Hukum III Newton (aksi-reaksi).`,
        difficulty: "EASY",
        tags: JSON.stringify(["TKA 2025", "Dinamika", "Hukum Newton", "Inersia"]),
        skillSlug: "hukum-newton-gaya",
        unitSlug: "dinamika",
        category: "dinamika"
    });

    // Soal 9: Perahu Nelayan & Gaya Arus 2D
    questions.push({
        questionMd: `### ⛵ Soal Asli TKA 2025 - Perahu Nelayan di Laut
**Elemen:** Dinamika | **Subelemen:** Hubungan Gaya dan Gerak

Seorang nelayan menggunakan perahu motor bergerak dengan kecepatan konstan $6\\text{ m}\\cdot\\text{s}^{-1}$ ke arah utara. Tiba-tiba arus laut dari arah barat memberikan gaya horizontal sebesar $300\\text{ N}$ selama $4\\text{ detik}$ ke arah timur. Massa total perahu beserta muatan adalah $150\\text{ kg}$. Mesin tetap mempertahankan kecepatan ke utara konstan $6\\text{ m/s}$.

Setelah $4\\text{ detik}$ gaya arus bekerja, kondisi gerak perahu adalah ….`,
        options: JSON.stringify([
            "kecepatan resultannya 10 m·s⁻¹ dengan arah 53° ke timur dari utara, kemudian bergerak lurus dengan kecepatan konstan",
            "kecepatan resultannya 8 m·s⁻¹ dengan arah 45° ke timur dari utara, kemudian bergerak lurus dengan percepatan tetap",
            "kecepatan resultannya 10 m·s⁻¹ dengan arah 37° ke timur dari utara, kemudian bergerak lurus dan mengalami perlambatan",
            "kecepatan resultannya 12 m·s⁻¹ dengan arah 37° ke timur dari utara, kemudian bergerak lurus dengan percepatan konstan",
            "kecepatan resultannya 6 m·s⁻¹ dengan arah 45° ke timur dari utara, kemudian bergerak lurus dengan percepatan tetap"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Kecepatan ke timur (sumbu X) setelah 4 detik:
   $$a_x = \\frac{F}{m} = \\frac{300\\text{ N}}{150\\text{ kg}} = 2\\text{ m/s}^2$$
   $$v_x = a_x \\cdot t = 2 \\times 4 = 8\\text{ m/s}$$
2. Kecepatan resultan:
   $$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{8^2 + 6^2} = 10\\text{ m/s}$$
3. Arah terhadap utara:
   $$\\tan\\theta = \\frac{v_x}{v_y} = \\frac{8}{6} = \\frac{4}{3} \\implies \\theta = 53^\\circ \\text{ ke timur dari utara}$$
4. Setelah 4 detik arus berhenti mendorong, $\\Sigma F = 0$, perahu bergerak lurus beraturan (kecepatan konstan).`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Dinamika", "Resultan Gaya"]),
        skillSlug: "hukum-newton-gaya",
        unitSlug: "dinamika",
        category: "dinamika"
    });

    // Soal 10: Karateka Pemecah Hebel
    questions.push({
        questionMd: `### 🥋 Soal Asli TKA 2025 - Impuls Karateka Pemecah Hebel
**Elemen:** Dinamika | **Subelemen:** Momentum dan Impuls

Dalam pertunjukan bela diri, seorang atlet karate berhasil memecahkan tumpukan batu bata ringan (hebel) dengan pukulan cepat. Tumpukan batu bata dapat pecah meskipun hanya bersentuhan dengan tangan dalam waktu yang sangat singkat.

Penjelasan yang paling tepat untuk fenomena ini adalah ...`,
        options: JSON.stringify([
            "Gaya menjadi sangat besar karena perubahan momentum terjadi dalam waktu yang sangat singkat.",
            "Impuls yang kecil menyebabkan tumpukan batu bata pecah karena kecepatan pukulan sangat tinggi.",
            "Impuls yang diterima hebel menjadi kecil karena waktu sentuh sangat singkat.",
            "Tidak ada perubahan momentum, karena batu bata kondisi awalnya diam.",
            "Impuls yang besar terjadi karena gaya dan waktu sentuh yang besar."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Berdasarkan teorema impuls-momentum:
$$\\bar{F} = \\frac{\\Delta p}{\\Delta t}$$
Karena kecepatan tangan dihentikan seketika dalam waktu kontak $\\Delta t$ yang sangat singkat (orde milidetik), gaya sentuh rata-rata $\\bar{F}$ menjadi sangat besar hingga melampaui batas elastisitas dan ketahanan pecah batu bata.`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Dinamika", "Momentum", "Impuls"]),
        skillSlug: "momentum-impuls",
        unitSlug: "dinamika",
        category: "dinamika"
    });

    // Soal 11: Kunci Pas & Dinamika Rotasi
    questions.push({
        questionMd: `### 🔧 Soal Asli TKA 2025 - Dinamika Rotasi Kunci Pas
**Elemen:** Dinamika | **Subelemen:** Dinamika Rotasi

Sebuah kunci pas panjang $L = 20\\text{ cm} = 0{,}2\\text{ m}$ digunakan untuk mengencangkan baut dengan gaya $F = 15\\text{ N}$ membentuk sudut $37^\\circ$ terhadap posisi horizontal kunci pas.
Kunci pas dianggap batang homogen bermassa $m = 500\\text{ gram} = 0{,}5\\text{ kg}$ diputar di ujungnya.
(Diketahui $\\sin 37^\\circ = 0{,}6$ dan $\\cos 37^\\circ = 0{,}8$).

Berapakah percepatan sudut $\\alpha$ yang dihasilkan oleh gaya F tersebut?`,
        options: JSON.stringify([
            "270 rad·s⁻²",
            "180 rad·s⁻²",
            "360 rad·s⁻²",
            "1080 rad·s⁻²",
            "1440 rad·s⁻²"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Momen gaya (Torsi):
   $$\\tau = r \\cdot F \\sin 37^\\circ = 0{,}2 \\times 15 \\times 0{,}6 = 1{,}8\\text{ N}\\cdot\\text{m}$$
2. Momen inersia batang diputar di ujung:
   $$I = \\frac{1}{3} m L^2 = \\frac{1}{3}(0{,}5)(0{,}2)^2 = \\frac{0{,}02}{3} = \\frac{1}{150}\\text{ kg}\\cdot\\text{m}^2$$
3. Percepatan sudut:
   $$\\alpha = \\frac{\\tau}{I} = \\frac{1{,}8}{1/150} = 1{,}8 \\times 150 = \\mathbf{270\\text{ rad/s}^2}$$`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Dinamika Rotasi", "Torsi"]),
        skillSlug: "dinamika-rotasi",
        unitSlug: "dinamika",
        category: "dinamika"
    });

    // Soal 12: Kursi Hidrolik Dokter Gigi
    questions.push({
        questionMd: `### 💺 Soal Asli TKA 2025 - Hukum Pascal Kursi Dokter Gigi
**Elemen:** Fluida | **Subelemen:** Fluida Statis

Kursi dokter gigi dapat dinaikkan dan diturunkan dengan mudah menggunakan sistem hidrolik.
Beban yang dapat diangkat oleh piston besar adalah $F_2 = 540\\text{ N}$ dengan diameter $D_2 = 3\\text{ cm}$.

Berapakah gaya terkecil $F_1$ yang digunakan pada piston kecil yang berukuran $D_1 = 0{,}5\\text{ cm}$?`,
        options: JSON.stringify([
            "15 N",
            "90 N",
            "240 N",
            "3240 N",
            "19440 N"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Berdasarkan Hukum Pascal:
$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_1 = F_2 \\left(\\frac{D_1}{D_2}\\right)^2$$
$$F_1 = 540 \\times \\left(\\frac{0{,}5}{3}\\right)^2 = 540 \\times \\left(\\frac{1}{6}\\right)^2 = \\frac{540}{36} = \\mathbf{15\\text{ N}}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Fluida", "Hukum Pascal"]),
        skillSlug: "fluida-statis",
        unitSlug: "fluida",
        category: "fluida"
    });

    // Soal 13: Kapal Selam & Tangki Ballast
    questions.push({
        questionMd: `### 🚢 Soal Asli TKA 2025 - Tangki Ballast Kapal Selam
**Elemen:** Fluida | **Subelemen:** Fluida Statis (Archimedes)

Sebuah kapal selam bermassa $200{.}000\\text{ kg}$ berada di dasar laut dengan massa jenis rata-rata $1{.}250\\text{ kg}\\cdot\\text{m}^{-3}$.
Kapal selam memiliki komponen tangki ballast yang airnya dapat dipompa keluar untuk memperbesar volume udara.
Agar kapal selam dapat terapung mendekati permukaan laut (asumsikan massa jenis air laut $1{.}000\\text{ kg}\\cdot\\text{m}^{-3}$), perubahan volume yang harus dilakukan pada tangki ballast adalah ....`,
        options: JSON.stringify([
            "40 m³",
            "160 m³",
            "200 m³",
            "240 m³",
            "360 m³"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Volume kapal selam di dasar laut:
   $$V_1 = \\frac{m}{\\rho_1} = \\frac{200{.}000}{1{.}250} = 160\\text{ m}^3$$
2. Volume total agar melayang seimbang saat mendekati permukaan:
   $$V_2 = \\frac{m}{\\rho_{\\text{air}}} = \\frac{200{.}000}{1{.}000} = 200\\text{ m}^3$$
3. Perubahan volume tangki ballast yang diekspansi:
   $$\\Delta V = 200 - 160 = \\mathbf{40\\text{ m}^3}$$`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Fluida", "Archimedes", "Kapal Selam"]),
        skillSlug: "fluida-statis",
        unitSlug: "fluida",
        category: "fluida"
    });

    // Soal 14: Aerodinamika Sayap Burung
    questions.push({
        questionMd: `### 🦅 Soal Asli TKA 2025 - Prinsip Aerodinamika Sayap Burung
**Elemen:** Fluida | **Subelemen:** Fluida Dinamis (Bernoulli)

Sayap burung membantu burung terbang saat dibentangkan dan bergerak melawan arah angin. Berdasarkan fenomena aerodinamika, manakah penjelasan ilmiah yang tepat mengenai cara sayap menghasilkan gaya angkat?`,
        options: JSON.stringify([
            "Kecepatan udara di atas sayap lebih tinggi, menciptakan tekanan lebih rendah di atas sehingga timbul gaya angkat.",
            "Kecepatan udara di bawah sayap lebih tinggi dibanding di atas sayap.",
            "Tekanan udara di atas sayap lebih tinggi dibanding tekanan di bawah sayap.",
            "Sayap menghasilkan gaya angkat murni karena hambatan angin menahan sayap.",
            "Bentuk sayap tidak berpengaruh terhadap perubahan besar gaya angkat."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Berdasarkan Hukum Bernoulli:
1. Profil sayap yang melengkung di atas menyebabkan kelajuan udara di atas lebih besar ($v_{\\text{atas}} > v_{\\text{bawah}}$).
2. Tekanan fluida berbanding terbalik dengan kuadrat kelajuan, sehingga tekanan di atas lebih kecil ($P_{\\text{atas}} < P_{\\text{bawah}}$).
3. Selisih tekanan $(P_{\\text{bawah}} - P_{\\text{atas}})$ menghasilkan gaya angkat ke atas ($F_L$).`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Fluida", "Bernoulli", "Aerodinamika"]),
        skillSlug: "fluida-dinamis",
        unitSlug: "fluida",
        category: "fluida"
    });

    // Soal 15: Pipa PVC Organa Akustik
    questions.push({
        questionMd: `### 🎶 Soal Asli TKA 2025 - Akustik Pipa PVC Air
**Elemen:** Gelombang | **Subelemen:** Bunyi

Seorang siswa membuat alat musik dari pipa PVC sepanjang $80\\text{ cm}$ yang sebagian diisi air, sehingga tersisa kolom udara setinggi $40\\text{ cm} = 0{,}4\\text{ m}$ yang berfungsi sebagai pipa organa tertutup di salah satu ujungnya (permukaan air).
Diketahui cepat rambat bunyi di udara $v = 340\\text{ m}\\cdot\\text{s}^{-1}$.

Jika pipa menghasilkan nada dasar (harmonik pertama), berapa frekuensi bunyi yang dihasilkan?`,
        options: JSON.stringify([
            "212,5 Hz",
            "425,0 Hz",
            "637,5 Hz",
            "850 Hz",
            "1062,5 Hz"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Pada nada dasar pipa organa tertutup sepihak:
$$L = \\frac{1}{4} \\lambda \\implies \\lambda = 4L = 4(0{,}4\\text{ m}) = 1{,}6\\text{ m}$$
Frekuensi nada dasar:
$$f_0 = \\frac{v}{\\lambda} = \\frac{340\\text{ m/s}}{1{,}6\\text{ m}} = \\mathbf{212{,}5\\text{ Hz}}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Gelombang", "Bunyi", "Pipa Organa"]),
        skillSlug: "gelombang-bunyi",
        unitSlug: "gelombang",
        category: "gelombang"
    });

    // Soal 16: Fatamorgana Pembiasan Lapangan Panas
    questions.push({
        questionMd: `### ☀️ Soal Asli TKA 2025 - Pembiasan Cahaya & Fatamorgana
**Elemen:** Gelombang | **Subelemen:** Cahaya

Seseorang sedang dalam perjalanan melalui tanah lapang yang sangat panas terik. Ia melihat tanaman-tanaman pendek di seberang lapangan seolah tampak beriak seperti dalam gelombang air (fatamorgana).

Sesuai prinsip optik sifat cahaya, bagaimana penjelasan ilmiah dari fenomena ilusi tersebut?`,
        options: JSON.stringify([
            "Panas permukaan lapangan menyebabkan perbedaan kerapatan udara sehingga cahaya mengalami pembiasan bertingkat.",
            "Cahaya dari tanaman terlihat beriak seperti gelombang air karena tertiup angin kencang.",
            "Permukaan lapangan yang bergelombang menyebabkan pemantulan cahaya yang tidak teratur.",
            "Tanah lapang yang panas membuat tarikan gravitasi cahaya berbelok.",
            "Tanaman memancarkan gelombang inframerah yang membentuk bayangan air."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Panas dari permukaan lapangan memanaskan udara di dekat tanah, sehingga kerapatan udara di dekat tanah menjadi lebih rendah daripada lapisan udara di atasnya. Perbedaan kerapatan ini menciptakan gradien indeks bias ($n$), membelokkan (membiasakan) berkas cahaya yang datang dari objek secara melengkung ke atas, menimbulkan ilusi optik fatamorgana.`,
        difficulty: "EASY",
        tags: JSON.stringify(["TKA 2025", "Gelombang", "Cahaya", "Pembiasan"]),
        skillSlug: "gelombang-cahaya-optik",
        unitSlug: "gelombang",
        category: "gelombang"
    });

    // Soal 17: Hipermetropi Rina & Lensa Kacamata
    questions.push({
        questionMd: `### 👓 Soal Asli TKA 2025 - Koreksi Lensa Hipermetropi
**Elemen:** Gelombang | **Subelemen:** Cahaya & Alat Optik

Rina menderita hipermetropi (rabun dekat) dengan titik dekat mata $PP = 50\\text{ cm}$. Titik dekat mata normal adalah $s_n = 25\\text{ cm}$.
Strategi manakah yang tepat untuk membantu Rina membaca jelas?`,
        options: JSON.stringify([
            "Membuat kacamata berlensa cembung dengan kekuatan +2 Dioptri.",
            "Membuat kacamata berlensa cekung dengan kekuatan -2 Dioptri.",
            "Membaca buku dengan jarak lebih dekat dari 25 cm.",
            "Menggunakan kacamata silindris berkekuatan +4 Dioptri.",
            "Membuat kacamata berlensa cembung dengan kekuatan +0,5 Dioptri."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Rumus kekuatan lensa kacamata hipermetropi:
$$P = \\frac{100}{s_n} - \\frac{100}{PP} = \\frac{100}{25} - \\frac{100}{50} = 4 - 2 = \\mathbf{+2\\text{ Dioptri}}$$
Tanda positif menunjukkan lensa cembung (konvergen).`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Gelombang", "Alat Optik", "Hipermetropi"]),
        skillSlug: "gelombang-cahaya-optik",
        unitSlug: "gelombang",
        category: "gelombang"
    });

    // Soal 18: Variabel Percobaan Konduksi Kalor
    questions.push({
        questionMd: `### 🕯️ Soal Asli TKA 2025 - Variabel Percobaan Konduksi
**Elemen:** Kalor dan Termodinamika | **Subelemen:** Perpindahan Kalor

Dalam percobaan menyelidiki pengaruh panjang efektif logam terhadap daya konduksinya:
- Batang besi dipanaskan di salah satu ujung.
- Potongan lilin ditempelkan tiap interval jarak $5\\text{ cm}$ dari ujung yang dipanaskan.
- Waktu meleleh lilin dicatat dengan stopwatch.

Berdasarkan rancangan percobaan tersebut, apa variabel kontrol, variabel bebas, dan variabel terikat?`,
        options: JSON.stringify([
            "variabel kontrol = jenis logam, variabel bebas = jarak lilin dari sumber, variabel terikat = waktu melelehnya lilin",
            "variabel kontrol = jenis bahan, variabel bebas = daya konduksi, variabel terikat = panjang logam",
            "variabel kontrol = waktu meleleh lilin, variabel bebas = jenis bahan, variabel terikat = daya konduksi",
            "variabel kontrol = waktu meleleh lilin, variabel bebas = panjang logam, variabel terikat = jenis logam",
            "variabel kontrol = panjang logam, variabel bebas = jenis bahan, variabel terikat = daya konduksi"
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan Metodologi Sains:**
- Variabel Kontrol (dijaga konstan): Jenis logam (besi) dan luas penampangnya.
- Variabel Bebas (yang sengaja diubah): Jarak lilin dari sumber pemanas (panjang konduksi).
- Variabel Terikat (yang diukur sebagai respon): Waktu yang diperlukan lilin untuk meleleh.`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Kalor", "Eksperimen", "Variabel"]),
        skillSlug: "kalor-perpindahan",
        unitSlug: "kalor-termodinamika",
        category: "kalor-termodinamika"
    });

    // Soal 19: Evaluasi Prosedur Percobaan Konduksi
    questions.push({
        questionMd: `### ⚖️ Soal Asli TKA 2025 - Evaluasi Galat Prosedur Percobaan
**Elemen:** Kalor dan Termodinamika | **Subelemen:** Perpindahan Kalor

Dari rancangan percobaan konduksi kalor lilin pada batang besi pada soal sebelumnya, apa salah satu kelemahan metodologis yang dapat menyebabkan data waktu meleleh menjadi tidak akurat?`,
        options: JSON.stringify([
            "Jenis lilin dan ukuran lilin tidak dipastikan sama sehingga tidak homogen.",
            "Jenis logam yang tidak diganti-ganti sehingga menyebabkan tidak ada pembanding.",
            "Penempatan sumber panas di ujung logam menyebabkan kalor tidak menyebar secara merata.",
            "Pengukuran waktu menggunakan stopwatch sulit dilakukan.",
            "Panjang keseluruhan logam tidak diukur sehingga tidak dapat dibandingkan."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Lilin mencair ketika menerima kalor laten lebur $Q = m \\cdot L$. Jika ukuran (massa $m$) atau jenis lilin tidak seragam (tidak homogen), lilin yang berukuran lebih kecil akan mencair lebih cepat meskipun laju kalornya sama, sehingga merusak validitas data waktu leleh.`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Kalor", "Metode Ilmiah"]),
        skillSlug: "kalor-perpindahan",
        unitSlug: "kalor-termodinamika",
        category: "kalor-termodinamika"
    });

    // Soal 20: Gas Ideal Pemampatan Silinder
    questions.push({
        questionMd: `### 💨 Soal Asli TKA 2025 - Hukum Boyle-Gay Lussac Gas Ideal
**Elemen:** Kalor dan Termodinamika | **Subelemen:** Gas Ideal

Gas ideal di dalam tabung silinder memiliki volume awal $V_1 = 2\\text{ liter}$, suhu $T_1 = 300\\text{ K}$, dan tekanan $P_1 = 1\\text{ atmosfer}$.
Jika gas dimampatkan hingga volumenya menjadi $V_2 = 1\\text{ liter}$ dengan suhu dinaikkan menjadi $2\\text{ kali semula}$ ($T_2 = 2T_1 = 600\\text{ K}$), maka tekanan akhirnya $P_2$ adalah ....`,
        options: JSON.stringify([
            "4 atmosfer",
            "0,5 atmosfer",
            "1 atmosfer",
            "2 atmosfer",
            "6 atmosfer"
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Gunakan persamaan gabungan gas ideal:
$$\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$$
$$\\frac{(1\\text{ atm})(2\\text{ L})}{T_1} = \\frac{P_2 (1\\text{ L})}{2T_1}$$
$$2 = \\frac{P_2}{2} \\implies P_2 = 2 \\times 2 = \\mathbf{4\\text{ atmosfer}}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Gas Ideal", "Boyle-Gay Lussac"]),
        skillSlug: "gas-ideal",
        unitSlug: "kalor-termodinamika",
        category: "kalor-termodinamika"
    });

    // Soal 21: Mesin Kalor Efisiensi & Penghematan Kalor
    questions.push({
        questionMd: `### ⚙️ Soal Asli TKA 2025 - Efisiensi Mesin Kalor Carnot
**Elemen:** Kalor dan Termodinamika | **Subelemen:** Termodinamika

Sebuah mesin kalor menyerap kalor dari sumber panas, menghasilkan usaha $W = 600\\text{ J}$ tiap siklus dengan efisiensi awal $30\\%$.
Setelah diperbaiki, efisiensi mesin naik menjadi $50\\%$.
Agar mesin tetap menghasilkan usaha yang sama ($W = 600\\text{ J}$), bagaimana kebutuhan kalor masuk ($Q_1$) setelah diperbaiki?`,
        options: JSON.stringify([
            "Membutuhkan kalor 40% lebih sedikit.",
            "Membutuhkan kalor 40% lebih banyak.",
            "Membutuhkan kalor 75% kalor lebih sedikit.",
            "Membutuhkan kalor 25% kalor lebih banyak.",
            "Membutuhkan kalor 50% kalor lebih sedikit."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Kalor masuk awal:
   $$Q_{1a} = \\frac{W}{\\eta_1} = \\frac{600\\text{ J}}{0{,}3} = 2{.}000\\text{ J}$$
2. Kalor masuk setelah diperbaiki:
   $$Q_{1b} = \\frac{W}{\\eta_2} = \\frac{600\\text{ J}}{0{,}5} = 1{.}200\\text{ J}$$
3. Penghematan kalor:
   $$\\Delta Q_1 = 2{.}000 - 1{.}200 = 800\\text{ J}$$
   $$\\% \\text{ penghematan} = \\frac{800}{2{.}000} \\times 100\\% = \\mathbf{40\\% \\text{ lebih sedikit}}$$`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Termodinamika", "Siklus Mesin"]),
        skillSlug: "termodinamika-carnot",
        unitSlug: "kalor-termodinamika",
        category: "kalor-termodinamika"
    });

    // Soal 22: Pemanasan Global & Energi Kinetik Partikel Udara
    questions.push({
        questionMd: `### 🌡️ Soal Asli TKA 2025 - Analisis Suhu Pemanasan Global
**Elemen:** Kalor dan Termodinamika | **Subelemen:** Pemanasan Global

Pengukuran suhu rata-rata tahunan Kota X (2005 - 2025) menunjukkan tren kenaikan dari $27{,}0^\\circ\\text{C}$ ke $29{,}6^\\circ\\text{C}$ seiring bertambahnya emisi kendaraan, pendingin ruangan (AC), dan berkurangnya $40\\%$ ruang hijau.
Manakah pernyataan berikut yang secara fisika benar menjelaskan fenomena ini?`,
        options: JSON.stringify([
            "Kenaikan suhu udara mencerminkan peningkatan energi kinetik rata-rata partikel gas di atmosfer.",
            "Emisi gas rumah kaca menurunkan kapasitas serap energi termal bumi.",
            "Penurunan ruang hijau meningkatkan laju evaporasi yang memanaskan udara.",
            "Energi kinetik partikel udara menurun karena panas tertahan di tanah.",
            "Kenaikan suhu tidak berhubungan dengan ketidakseimbangan radiasi permukaan bumi."
        ]),
        correctIndex: 0,
        explanationMd: `**Pembahasan:**
Dalam teori kinetik gas dan termodinamika, suhu mutlak berbanding lurus dengan energi kinetik rata-rata partikel: $\\bar{E}_k = \\frac{3}{2} k_B T$. Peningkatan suhu global secara langsung merefleksikan peningkatan energi kinetik rata-rata molekul udara di atmosfer bumi akibat terperangkapnya radiasi termal oleh gas rumah kaca.`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Pemanasan Global", "Energi Kinetik"]),
        skillSlug: "pemanasan-global",
        unitSlug: "kalor-termodinamika",
        category: "kalor-termodinamika"
    });

    // Soal 23: Printer Elektrostatik Medan Listrik Nol
    questions.push({
        questionMd: `### ⚡ Soal Asli TKA 2025 - Titik Medan Listrik Nol Printer Laser
**Elemen:** Kelistrikan | **Subelemen:** Listrik Statis

Dalam sistem printer elektrostatik, dua elektroda muatan negatif dipasang sejajar untuk mengarahkan partikel toner:
- $Q_1 = -4\\ \\mu\\text{C}$ diletakkan pada posisi $x = 0$
- $Q_2 = -9\\ \\mu\\text{C}$ diletakkan pada posisi $x = 8\\text{ cm}$

Di manakah letak suatu titik di sepanjang sumbu-x yang memiliki kuat medan listrik total sama dengan nol?`,
        options: JSON.stringify([
            "Di sebelah kanan Q₁, yaitu pada x = 3,2 cm.",
            "Di sebelah kiri Q₁, yaitu pada x = -3,2 cm.",
            "Tepat di antara kedua muatan, yaitu pada x = 4 cm.",
            "Di sebelah kanan Q₁, yaitu pada x = 4,8 cm.",
            "Di sebelah kanan Q₂, yaitu pada x = 11,2 cm."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Karena kedua muatan bertanda sama (sama-sama negatif), medan listrik akibat kedua muatan berlawanan arah di daerah **di antara kedua muatan**:
$$E_1 = E_2 \\implies k \\frac{|Q_1|}{x^2} = k \\frac{|Q_2|}{(8 - x)^2}$$
$$\\frac{4}{x^2} = \\frac{9}{(8 - x)^2}$$
Tarik akar:
$$\\frac{2}{x} = \\frac{3}{8 - x} \\implies 16 - 2x = 3x \\implies 5x = 16 \\implies x = \\mathbf{3{,}2\\text{ cm}}$$
Titik berada di sebelah kanan $Q_1$ pada jarak $x = 3{,}2\\text{ cm}$.`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Kelistrikan", "Medan Listrik", "Printer"]),
        skillSlug: "listrik-statis",
        unitSlug: "kelistrikan",
        category: "kelistrikan"
    });

    // Soal 24: Modifikasi Rangkaian Resistor Arus Sama
    questions.push({
        questionMd: `### 🔌 Soal Asli TKA 2025 - Modifikasi Rangkaian Resistor DC
**Elemen:** Kelistrikan | **Subelemen:** Rangkaian Arus Searah

Perhatikan dua rangkaian listrik:
- **Rangkaian A:** Dua resistor $6\\ \\Omega$ dirangkai seri dengan tegangan sumber $12\\text{ V}$.
  $$I_A = \\frac{12\\text{ V}}{6 + 6\\ \\Omega} = 1\\text{ A}$$
- **Rangkaian B:** Dua resistor $3\\ \\Omega$ dirangkai paralel dengan tegangan sumber $6\\text{ V}$.
  $$I_B = \\frac{6\\text{ V}}{1{,}5\\ \\Omega} = 4\\text{ A}$$

Agar besar arus listrik pada Rangkaian B sama nilainya dengan Rangkaian A ($I_B = 1\\text{ A}$), modifikasi apa yang tepat dilakukan pada Rangkaian B?`,
        options: JSON.stringify([
            "Ubah susunan resistor Rangkaian B menjadi seri.",
            "Ubah sumber tegangan rangkaian A menjadi 6 V.",
            "Tambah satu resistor 6 Ω secara paralel pada Rangkaian A.",
            "Ganti tegangan sumber Rangkaian B menjadi 12 V.",
            "Tambah satu resistor 3 Ω secara seri pada Rangkaian B."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
Arus pada rangkaian A adalah $I_A = \\frac{12}{12} = 1\\text{ A}$.
Agar arus rangkaian B juga bernilai $I_B = 1\\text{ A}$ dengan tegangan tetap $6\\text{ V}$:
$$R'_B = \\frac{V_B}{I} = \\frac{6\\text{ V}}{1\\text{ A}} = 6\\ \\Omega$$
Rangkaian B memiliki dua buah resistor $3\\ \\Omega$. Jika kedua resistor disusun secara **seri**:
$$R'_B = 3\\ \\Omega + 3\\ \\Omega = 6\\ \\Omega \\implies I_B = \\frac{6}{6} = 1\\text{ A}$$`,
        difficulty: "NORMAL",
        tags: JSON.stringify(["TKA 2025", "Kelistrikan", "Rangkaian DC", "Hukum Ohm"]),
        skillSlug: "rangkaian-dc-daya",
        unitSlug: "kelistrikan",
        category: "kelistrikan"
    });

    // Soal 25: Audit Tagihan Listrik Rumah Tangga
    questions.push({
        questionMd: `### ⚡ Soal Asli TKA 2025 - Optimalisasi Tagihan Listrik
**Elemen:** Kelistrikan | **Subelemen:** Rangkaian Arus Searah (Energi & Daya)

Diberikan data penggunaan peralatan elektronik dari sebuah keluarga:
- **AC:** $1{.}000\\text{ W}$, pemakaian $8\\text{ jam/hari}$, $30\\text{ hari/bulan}$
- **Kulkas:** $150\\text{ W}$, pemakaian $24\\text{ jam/hari}$, $30\\text{ hari/bulan}$
- **Mesin Cuci:** $350\\text{ W}$, pemakaian $1\\text{ jam/hari}$, $8\\text{ hari/bulan}$
- **Setrika:** $300\\text{ W}$, pemakaian $1\\text{ jam/hari}$, $12\\text{ hari/bulan}$
- **Televisi:** $100\\text{ W}$, pemakaian $5\\text{ jam/hari}$, $30\\text{ hari/bulan}$

Tarif listrik berlaku $\\text{Rp}1{.}500/\\text{kWh}$. Total tagihan saat ini mencapai $\\text{Rp}554{.}100$.
Keluarga tersebut ingin agar total biaya listrik bulanan **turun di bawah Rp375.000,00**.
Keputusan terbaik apa yang dapat diambil untuk mencapai target tersebut?`,
        options: JSON.stringify([
            "Mengurangi penggunaan AC menjadi 4 jam per hari.",
            "Mengurangi durasi menonton televisi 1 jam per hari dan mesin cuci 1 hari per bulan.",
            "Mengurangi durasi menonton TV menjadi 2 jam per hari.",
            "Tidak menggunakan mesin cuci sama sekali.",
            "Mengurangi frekuensi menyetrika menjadi 4 hari per bulan."
        ]),
        correctIndex: 0,
        explanationMd: `**Penurunan Solusi:**
1. Batas energi maksimum untuk tagihan $\\le \\text{Rp}375{.}000$:
   $$E_{\\max} = \\frac{375{.}000}{1{.}500} = 250\\text{ kWh}$$
2. Konsumsi energi AC mula-mula:
   $$E_{\\text{AC}} = \\frac{1{.}000 \\times 8 \\times 30}{1{.}000} = 240\\text{ kWh}$$
3. Jika AC dikurangi menjadi 4 jam per hari:
   $$E'_{\\text{AC}} = \\frac{1{.}000 \\times 4 \\times 30}{1{.}000} = 120\\text{ kWh} \\quad (\\text{Hemat } 120\\text{ kWh})$$
4. Total energi baru $= 369{,}4 - 120 = 249{,}4\\text{ kWh} \\le 250\\text{ kWh}$.
   Total tagihan baru $= 249{,}4 \\times \\text{Rp}1{.}500 = \\mathbf{\\text{Rp}374{.}100}$ (Berhasil di bawah Rp375.000!).`,
        difficulty: "HARD",
        tags: JSON.stringify(["TKA 2025", "Kelistrikan", "Daya", "Tarif Listrik"]),
        skillSlug: "rangkaian-dc-daya",
        unitSlug: "kelistrikan",
        category: "kelistrikan"
    });

    // =========================================================================
    // 2. SOAL LATIHAN PROGRESIF TKA UNTUK SETIAP SKILL (EASY, NORMAL, HARD, EXTREME)
    // =========================================================================

    const extraTemplates = [
        // Jangka Sorong
        {
            q: "Jangka sorong memiliki skala utama 3,4 cm dan garis nonius ke-7 berhimpit lurus dengan skala utama (ketelitian 0,01 cm). Berapakah hasil pengukuran yang tepat?",
            opts: ["3,47 cm", "3,40 cm", "3,74 cm", "3,11 cm", "4,10 cm"],
            ans: 0,
            exp: "Hasil = SU + (SN x 0,01 cm) = 3,4 cm + 0,07 cm = 3,47 cm.",
            diff: "EASY",
            skill: "pengukuran-angka-penting",
            unit: "kinematika"
        },
        // Aturan Angka Penting
        {
            q: "Panjang balok 15,25 cm (4 AP) dan lebar balok 4,2 cm (2 AP). Luas balok menurut kaidah angka penting adalah...",
            opts: ["64 cm²", "64,05 cm²", "64,1 cm²", "64,0 cm²", "65 cm²"],
            ans: 0,
            exp: "15,25 x 4,2 = 64,05 cm². Karena faktor pengali paling sedikit memiliki 2 AP (4,2 cm), dibulatkan menjadi 2 AP yaitu 64 cm².",
            diff: "NORMAL",
            skill: "pengukuran-angka-penting",
            unit: "kinematika"
        },
        // GLBB Pengereman
        {
            q: "Sebuah mobil melaju dengan kecepatan 20 m/s kemudian direm mendadak dengan perlambatan tetap 4 m/s² hingga berhenti. Berapakah jarak pengereman yang ditempuh mobil?",
            opts: ["50 m", "25 m", "80 m", "100 m", "40 m"],
            ans: 0,
            exp: "vt² = v0² - 2as => 0 = 20² - 2(4)s => 8s = 400 => s = 50 meter.",
            diff: "EASY",
            skill: "gerak-lurus-relatif",
            unit: "kinematika"
        },
        // Melingkar Beraturan
        {
            q: "Sebuah partikel bergerak melingkar beraturan dengan jari-jari 0,5 m dan periode 0,2 detik. Percepatan sentripetal partikel adalah...",
            opts: ["50π² m/s²", "10π² m/s²", "25π² m/s²", "100π² m/s²", "5π² m/s²"],
            ans: 0,
            exp: "ω = 2π / T = 2π / 0,2 = 10π rad/s. asp = ω² r = (10π)² (0,5) = 100π² x 0,5 = 50π² m/s².",
            diff: "NORMAL",
            skill: "gerak-parabola-melingkar",
            unit: "kinematika"
        },
        // Hukum II Newton Balok bertingkat
        {
            q: "Dua benda m1 = 2 kg dan m2 = 3 kg dihubungkan tali pada bidang datar licin ditarik gaya F = 15 N pada m2. Tegangan tali penghubung T adalah...",
            opts: ["6 N", "9 N", "10 N", "15 N", "3 N"],
            ans: 0,
            exp: "a = F / (m1 + m2) = 15 / 5 = 3 m/s². T = m1 x a = 2 x 3 = 6 N.",
            diff: "NORMAL",
            skill: "hukum-newton-gaya",
            unit: "dinamika"
        },
        // Tumbukan Lenting Sempurna
        {
            q: "Dua bola identik bermassa sama m bergerak berlawanan arah dengan kecepatan v dan -v bertumbukan lenting sempurna. Kecepatan masing-masing bola setelah tumbukan adalah...",
            opts: ["-v dan v (saling bertukar kecepatan)", "0 dan 0", "2v dan -2v", "v/2 dan -v/2", "v dan -v"],
            ans: 0,
            exp: "Pada tumbukan lenting sempurna massa identik, kedua partikel bertukar kecepatan seutuhnya.",
            diff: "NORMAL",
            skill: "momentum-impuls",
            unit: "dinamika"
        },
        // Momen Inersia Silinder Pejal
        {
            q: "Sebuah silinder pejal bermassa 4 kg dan jari-jari 20 cm menggelinding murni tanpa slip. Momen inersia silinder pejal terhadap sumbu simetrinya adalah...",
            opts: ["0,08 kg·m²", "0,16 kg·m²", "0,04 kg·m²", "0,8 kg·m²", "0,02 kg·m²"],
            ans: 0,
            exp: "I = 1/2 m R² = 0,5 x 4 x (0,2)² = 2 x 0,04 = 0,08 kg·m².",
            diff: "EASY",
            skill: "dinamika-rotasi",
            unit: "dinamika"
        },
        // Pipa U Dua Fluida
        {
            q: "Pipa U diisi air (massa jenis 1000 kg/m³). Salah satu pipa dituangi minyak setinggi 10 cm sehingga selisih tinggi permukaan air adalah 8 cm. Massa jenis minyak tersebut adalah...",
            opts: ["800 kg/m³", "750 kg/m³", "850 kg/m³", "900 kg/m³", "600 kg/m³"],
            ans: 0,
            exp: "ρ_minyak x h_minyak = ρ_air x h_air => ρ_minyak x 10 = 1000 x 8 => ρ_minyak = 800 kg/m³.",
            diff: "NORMAL",
            skill: "fluida-statis",
            unit: "fluida"
        },
        // Venturimeter Tanpa Manometer
        {
            q: "Sebuah venturimeter memiliki penampang besar A1 = 10 cm² dan penampang kecil A2 = 5 cm². Jika perbedaan ketinggian cairan h = 15 cm (g = 10 m/s²), kelajuan fluida di penampang besar adalah...",
            opts: ["1,0 m/s", "2,0 m/s", "1,5 m/s", "3,0 m/s", "0,5 m/s"],
            ans: 0,
            exp: "v1 = √[ (2 g h) / ((A1/A2)² - 1) ] = √[ (2 x 10 x 0,15) / (2² - 1) ] = √[ 3 / 3 ] = 1,0 m/s.",
            diff: "EXTREME",
            skill: "fluida-dinamis",
            unit: "fluida"
        },
        // Taraf Intensitas Bunyi
        {
            q: "Sebuah sumber bunyi menghasilkan taraf intensitas 60 dB. Jika 100 sumber bunyi identik dibunyikan serentak, taraf intensitas total menjadi...",
            opts: ["80 dB", "70 dB", "90 dB", "160 dB", "600 dB"],
            ans: 0,
            exp: "TI_total = TI1 + 10 log(n) = 60 + 10 log(100) = 60 + 20 = 80 dB.",
            diff: "NORMAL",
            skill: "gelombang-bunyi",
            unit: "gelombang"
        },
        // Cacat Mata Miopi
        {
            q: "Seorang penderita miopi memiliki titik jauh (Punctum Remotum) 2 meter. Kekuatan kacamata yang harus digunakan agar dapat melihat benda jauh adalah...",
            opts: ["-0,5 Dioptri", "-2 Dioptri", "-1 Dioptri", "+0,5 Dioptri", "+2 Dioptri"],
            ans: 0,
            exp: "P = -100 / PR(cm) = -100 / 200 = -0,5 Dioptri (lensa cekung).",
            diff: "EASY",
            skill: "gelombang-cahaya-optik",
            unit: "gelombang"
        },
        // Asas Black Pencampuran
        {
            q: "Air bermassa 200 g bersuhu 80°C dicampur dengan air bermassa 100 g bersuhu 20°C dalam wadah terisolasi. Suhu akhir campuran adalah...",
            opts: ["60°C", "50°C", "40°C", "65°C", "55°C"],
            ans: 0,
            exp: "Q_lepas = Q_terima => 200 x c x (80 - T) = 100 x c x (T - 20) => 2(80 - T) = T - 20 => 160 - 2T = T - 20 => 3T = 180 => T = 60°C.",
            diff: "NORMAL",
            skill: "kalor-perpindahan",
            unit: "kalor-termodinamika"
        },
        // Usaha Gas Isobarik
        {
            q: "Gas ideal memuai secara isobarik pada tekanan konstan 2 x 10⁵ Pa dari volume 1 m³ menjadi 3 m³. Usaha yang dilakukan oleh gas adalah...",
            opts: ["4 x 10⁵ J", "2 x 10⁵ J", "6 x 10⁵ J", "8 x 10⁵ J", "1 x 10⁵ J"],
            ans: 0,
            exp: "W = P x ΔV = (2 x 10⁵) x (3 - 1) = 4 x 10⁵ Joule.",
            diff: "EASY",
            skill: "termodinamika-carnot",
            unit: "kalor-termodinamika"
        },
        // Gaya Coulomb Tiga Titik
        {
            q: "Dua muatan titik +4 μC dan +9 μC terpisah sejauh 50 cm di udara. Muatan ketiga q ditempatkan di antara kedua muatan agar tidak mengalami gaya Coulomb. Jarak muatan q dari muatan +4 μC adalah...",
            opts: ["20 cm", "25 cm", "30 cm", "15 cm", "35 cm"],
            ans: 0,
            exp: "√q1 / x = √q2 / (50 - x) => 2/x = 3/(50 - x) => 100 - 2x = 3x => 5x = 100 => x = 20 cm.",
            diff: "NORMAL",
            skill: "listrik-statis",
            unit: "kelistrikan"
        },
        // Jembatan Wheatstone
        {
            q: "Empat hambatan R1 = 2 Ω, R2 = 4 Ω, R3 = 3 Ω, R4 = 6 Ω dirangkai jembatan Wheatstone dengan galvanometer di tengah. Jika R1 x R4 = R2 x R3 (2 x 6 = 4 x 3 = 12), besar arus yang melalui galvanometer adalah...",
            opts: ["0 A (seimbang)", "1 A", "2 A", "0,5 A", "3 A"],
            ans: 0,
            exp: "Karena perkalian silang hambatan sama (R1 R4 = R2 R3), jembatan Wheatstone dalam keadaan setimbang sehingga beda potensial nol dan arus galvanometer = 0.",
            diff: "EXTREME",
            skill: "rangkaian-dc-daya",
            unit: "kelistrikan"
        }
    ];

    for (const t of extraTemplates) {
        questions.push({
            questionMd: t.q,
            options: JSON.stringify(t.opts),
            correctIndex: t.ans,
            explanationMd: t.exp,
            difficulty: t.diff,
            tags: JSON.stringify(["TKA Latihan", t.unit, t.diff]),
            skillSlug: t.skill,
            unitSlug: t.unit,
            category: t.unit
        });
    }

    return questions;
}
