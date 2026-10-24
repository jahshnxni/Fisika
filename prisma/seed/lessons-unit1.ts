import { LessonData } from './units';

export const LESSONS_UNIT1: LessonData[] = [
    {
        title: "Pengukuran Presisi & Angka Penting",
        slug: "pengukuran-presisi-mikrometer",
        order: 1,
        skillSlug: "pengukuran-angka-penting",
        contentMdx: `
# 📏 Pengukuran Presisi & Aturan Angka Penting

Dalam rekayasa teknik dan sains modern, kesalahan pengukuran sekecil seperseratus milimeter ($0{,}01\\text{ mm}$) dapat menyebabkan komponen mesin macet atau tabung presisi bocor. Pada materi ini, kita mempelajari bagaimana mikrometer sekrup dan jangka sorong digunakan untuk menghasilkan pengukuran yang akurat dan dapat dipertanggungjawabkan secara ilmiah.

---

## 1. Alat Ukur Panjang & Ketelitian

Tiga instrumen utama dalam pengukuran panjang laboratorium fisika:
1. **Mistar / Penggaris:** Skala terkecil $1\\text{ mm} = 0{,}1\\text{ cm}$. Ketelitian $= 0{,}5\\text{ mm}$.
2. **Jangka Sorong (Vernier Caliper):** Skala nonius membagi $1\\text{ mm}$ menjadi 10 atau 20 bagian. Ketelitian $= 0{,}1\\text{ mm}$ atau $0{,}05\\text{ mm}$.
3. **Mikrometer Sekrup:** Menggunakan prinsip ulir berpresisi tinggi. Satu putaran penuh bidal (thimble) memajukan poros geser sebesar $0{,}5\\text{ mm}$, dengan skala putar dibagi 50 skala.
   $$\\text{Ketelitian} = \\frac{0{,}5\\text{ mm}}{50} = 0{,}01\\text{ mm}$$

### Cara Membaca Mikrometer Sekrup:
$$\\boxed{\\text{Hasil Bacaan} = \\text{Skala Utama (SU)} + (\\text{Skala Nonius (SN)} \\times 0{,}01\\text{ mm})}$$

---

## 2. Aturan Angka Penting (AP)

1. **Semua angka bukan nol** adalah AP (contoh: $12{,}34\\text{ g} \\rightarrow 4\\text{ AP}$).
2. **Angka nol di antara angka bukan nol** adalah AP (contoh: $20{,}05\\text{ cm} \\rightarrow 4\\text{ AP}$).
3. **Angka nol di depan angka bukan nol** BUKAN AP (contoh: $0{,}0035\\text{ m} \\rightarrow 2\\text{ AP}$).
4. **Angka nol di belakang koma desimal** setelah angka bukan nol adalah AP (contoh: $8{,}80\\text{ mm} \\rightarrow 3\\text{ AP}$).
5. **Operasi Perkalian/Pembagian:** Hasil memiliki jumlah angka penting yang sama dengan faktor yang memiliki AP paling sedikit.
6. **Operasi Penjumlahan/Pengurangan:** Hasil hanya boleh memiliki satu angka taksiran (posisi desimal paling tidak teliti).

---

## 3. Simulasi Interaktif: Mikrometer Sekrup & Jangka Sorong

Gunakan simulasi interaktif di bawah ini untuk mencoba menggeser bidal mikrometer sekrup dan jangka sorong secara real-time!

<InteractiveComponent type="MicrometerVernierSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar (Direct Reading)
**Soal:** Sebuah pelat logam diukur ketebalannya menggunakan mikrometer sekrup. Skala utama menunjukkan $4{,}5\\text{ mm}$ dan garis skala putar yang sejajar lurus dengan garis utama adalah angka $38$. Berapakah tebal pelat logam tersebut?

**Penyelesaian:**
$$SU = 4{,}50\\text{ mm}$$
$$SN = 38 \\times 0{,}01\\text{ mm} = 0{,}38\\text{ mm}$$
$$x = 4{,}50\\text{ mm} + 0{,}38\\text{ mm} = \\mathbf{4{,}88\\text{ mm}}$$

---

### 🟡 Level 2: Menengah (Operasi Angka Penting)
**Soal:** Sebuah lempeng persegi panjang diukur menggunakan jangka sorong. Didapatkan panjang $p = 12{,}45\\text{ cm}$ (4 AP) dan lebar $l = 3{,}2\\text{ cm}$ (2 AP). Tentukan luas lempeng tersebut sesuai aturan angka penting!

**Penyelesaian:**
$$\\text{Luas} = p \\times l = 12{,}45 \\times 3{,}2 = 39{,}84\\text{ cm}^2$$
Karena pengali paling sedikit memiliki **2 Angka Penting** ($3{,}2\\text{ cm}$), hasil harus dibulatkan menjadi 2 AP:
$$\\text{Luas} = \\mathbf{40\\text{ cm}^2} \\quad \\text{atau} \\quad \\mathbf{4{,}0 \\times 10^1\\text{ cm}^2}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Kontekstual dengan Gambar)
*(Diadaptasi langsung dari Soal Resmi TKA Fisika Paket 1 No. 1)*

**Stimulus Kasus:**
Hega akan membuat wadah untuk tempat manik-manik yang berbentuk tabung dan terbuat dari karton bekas. Hega mengukur ketebalan dinding tabung dan diameter luar tabung dengan menggunakan mikrometer sekrup:
- **Pengukuran 1 (Diameter Luar):** Skala utama menunjukkan $10{,}0\\text{ mm}$ (garis bawah $0{,}5$ belum lewat), skala nonius berhimpit pada garis $42$. 
  $$D_{\\text{luar}} = 10{,}00\\text{ mm} + 0{,}42\\text{ mm} = 10{,}42\\text{ mm}$$
- **Pengukuran 2 (Ketebalan Tabung):** Skala utama menunjukkan $0{,}0\\text{ mm}$, garis skala putar berhimpit pada angka $32$.
  $$t_{\\text{dinding}} = 0{,}00\\text{ mm} + 0{,}32\\text{ mm} = 0{,}32\\text{ mm}$$

Tabung memiliki dinding di kedua sisinya (kiri dan kanan), sehingga diameter dalam tabung wadah adalah:
$$D_{\\text{dalam}} = D_{\\text{luar}} - 2 \\times t_{\\text{dinding}}$$
$$D_{\\text{dalam}} = 10{,}42\\text{ mm} - 2(0{,}32\\text{ mm}) = 10{,}42 - 0{,}64 = \\mathbf{9{,}78\\text{ mm}}$$

**Pertanyaan TKA:**
Manik-manik hanya dapat masuk ke dalam wadah tabung jika diameter manik-manik **lebih kecil atau sama dengan** diameter dalam wadah ($d_{\\text{manik}} \\le 9{,}78\\text{ mm}$).
Dari pilihan:
- $\\square\\ 8{,}80\\text{ mm} \\rightarrow \\mathbf{MASUK} \\quad (8{,}80 < 9{,}78)$
- $\\square\\ 9{,}30\\text{ mm} \\rightarrow \\mathbf{MASUK} \\quad (9{,}30 < 9{,}78)$
- $\\square\\ 9{,}60\\text{ mm} \\rightarrow \\mathbf{MASUK} \\quad (9{,}60 < 9{,}78)$
- $\\square\\ 10{,}10\\text{ mm} \\rightarrow \\text{TIDAK MASUK} \\quad (10{,}10 > 9{,}78)$
- $\\square\\ 10{,}30\\text{ mm} \\rightarrow \\text{TIDAK MASUK} \\quad (10{,}30 > 9{,}78)$

Jawaban benar adalah **8,80 mm, 9,30 mm, dan 9,60 mm**.
`
    },
    {
        title: "Gerak Lurus GLB/GLBB & Gerak Relatif",
        slug: "gerak-lurus-relatif-grafik",
        order: 2,
        skillSlug: "gerak-lurus-relatif",
        contentMdx: `
# 🚗 Kinematika Gerak Lurus & Gerak Relatif

Kinematika menganalisis gerak benda tanpa mempedulikan penyebab geraknya. Pada kehidupan nyata, objek sering bergerak dalam kerangka acuan yang juga bergerak (seperti kapal di atas arus laut atau dua mobil balap yang saling memacu kecepatan).

---

## 1. Persamaan Inti GLB dan GLBB

### Gerak Lurus Beraturan (GLB): Kecepatan Konstan ($a = 0$)
$$s = v \\cdot t$$

### Gerak Lurus Berubah Beraturan (GLBB): Percepatan Konstan ($a = \\text{konstan}$)
1. $$v_t = v_0 + a \\cdot t$$
2. $$s = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2$$
3. $$v_t^2 = v_0^2 + 2 a \\cdot s$$

### Gerak Relatif Vektor:
Kecepatan perahu terhadap tanah/bumi (resultan) adalah penjumlahan vektor kecepatan mesin perahu terhadap air $\\vec{v}_{p/a}$ dengan kecepatan arus air terhadap tanah $\\vec{v}_{a/t}$:
$$\\vec{v}_{p/t} = \\vec{v}_{p/a} + \\vec{v}_{a/t}$$

---

## 2. Simulasi Interaktif: Navigasi Kapal di Arus Laut

Cobalah ubah kecepatan kapal atau arus laut pada simulasi interaktif di bawah ini:

<InteractiveComponent type="RelativeMotionBoatSim" />

---

## 3. Simulasi Interaktif: Balapan Mobil & Grafik v-t

Perhatikan grafik $v-t$ dua mobil yang saling mengejar. Luas daerah di bawah kurva $v-t$ menyatakan **jarak tempuh**!

<InteractiveComponent type="MotionGraphRaceSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah mobil bergerak dari keadaan diam dengan percepatan tetap $2\\text{ m/s}^2$ selama $6\\text{ detik}$. Berapakah kecepatan akhir dan jarak yang ditempuh mobil?

**Penyelesaian:**
$$v_t = v_0 + at = 0 + (2)(6) = \\mathbf{12\\text{ m/s}}$$
$$s = v_0 t + \\frac{1}{2}at^2 = 0 + \\frac{1}{2}(2)(6^2) = \\mathbf{36\\text{ meter}}$$

---

### 🟡 Level 2: Menengah (Gerak Relatif Perahu - Soal Asli TKA No. 2)
**Soal:** Sebuah kapal berangkat pukul 08.00 dari pulau A menuju pulau B yang berjarak $10\\text{ km}$ tepat di sebelah timur. Kapal harus tiba tepat pukul 09.00 ($t = 1\\text{ jam}$). Arus laut mengalir ke timur dengan laju $2\\text{ km/jam}$. Strategi apa yang harus diterapkan nakhoda kapal?

**Penyelesaian:**
1. Kecepatan resultan yang dibutuhkan kapal menuju timur:
   $$v_{\\text{target}} = \\frac{s}{t} = \\frac{10\\text{ km}}{1\\text{ jam}} = 10\\text{ km/jam ke arah Timur}$$
2. Karena arus air laut sudah membantu mendorong ke arah Timur dengan laju $v_{\\text{arus}} = 2\\text{ km/jam}$, maka:
   $$v_{\\text{target}} = v_{\\text{kapal}} + v_{\\text{arus}}$$
   $$10\\text{ km/jam} = v_{\\text{kapal}} + 2\\text{ km/jam} \\implies v_{\\text{kapal}} = \\mathbf{8\\text{ km/jam ke arah Timur}}$$
**Jawaban TKA:** E. Bergerak ke arah timur dengan kecepatan $8\\text{ km}\\cdot\\text{jam}^{-1}$.

---

### 🔴 Level 3: Level Asli TKA (HOTS Uji Coba Mobil & Grafik v-t - Soal No. 3 & 4)
**Soal:** Mobil A dan B berangkat bersamaan ($t=0$).
- Mobil B bergerak GLB dengan kecepatan konstan $v_B = 25\\text{ m/s}$.
- Mobil A bergerak GLBB dari $v_0 = 15\\text{ m/s}$ dan pada $t = 5\\text{ s}$ kecepatannya mencapai $25\\text{ m/s}$.
Percepatan mobil A:
$$a_A = \\frac{25 - 15}{5} = 2\\text{ m/s}^2$$

**Analisis:**
1. Pada detik ke-5 ($t=5\\text{ s}$), kecepatan kedua mobil sama-sama $25\\text{ m/s}$ (garis berpotongan), namun posisi belum sama karena mobil B menempuh jarak $s_B = 25 \\times 5 = 125\\text{ m}$, sedangkan mobil A menempuh $s_A = 15(5) + \\frac{1}{2}(2)(5^2) = 75 + 25 = 100\\text{ m}$.
2. Mobil A akan **menyalip** mobil B saat jarak tempuh keduanya sama ($s_A = s_B$):
   $$15t + \\frac{1}{2}(2)t^2 = 25t \\implies 15t + t^2 = 25t \\implies t^2 - 10t = 0 \\implies t = 10\\text{ detik}$$
   Jarak tempuh saat menyusul:
   $$s = v_B \\cdot t = 25 \\times 10 = \\mathbf{250\\text{ meter}}$$
`
    },
    {
        title: "Gerak Lengkung & Lintasan Parabola",
        slug: "gerak-parabola-aplikasi",
        order: 3,
        skillSlug: "gerak-parabola-melingkar",
        contentMdx: `
# 🏀 Dinamika Gerak Parabola dalam Olahraga

Gerak peluru atau parabola merupakan perpaduan dua gerak independen:
1. **Sumbu X (Horizontal):** Gerak Lurus Beraturan (GLB) tanpa hambatan udara.
2. **Sumbu Y (Vertikal):** Gerak Lurus Berubah Beraturan (GLBB) dipengaruhi percepatan gravitasi bumi ($g$).

---

## 1. Persamaan Gerak Parabola

Kecepatan awal diuraikan menjadi:
$$v_{0x} = v_0 \\cos\\theta$$
$$v_{0y} = v_0 \\sin\\theta$$

Posisi benda pada setiap saat $t$:
$$x(t) = v_{0x} \\cdot t = (v_0 \\cos\\theta) \\cdot t$$
$$y(t) = y_0 + v_{0y} \\cdot t - \\frac{1}{2} g t^2 = y_0 + (v_0 \\sin\\theta) \\cdot t - \\frac{1}{2} g t^2$$

---

## 2. Simulasi Interaktif: Jump Shot Bola Basket (Adrian vs Bisma)

Eksplorasi simulasi tembakan bola basket dengan sudut $50^\\circ$ ke ring setinggi $3{,}05\\text{ m}$ sejauh $3\\text{ m}$:

<InteractiveComponent type="BasketballProjectileSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah bola ditendang dengan kecepatan awal $20\\text{ m/s}$ pada sudut elevasi $30^\\circ$ ($g = 10\\text{ m/s}^2$). Berapakah waktu yang dibutuhkan bola untuk mencapai titik tertinggi?

**Penyelesaian:**
Di titik tertinggi, $v_y = 0$:
$$v_y = v_0 \\sin\\theta - gt_p = 0 \\implies t_p = \\frac{v_0 \\sin 30^\\circ}{g} = \\frac{20(0{,}5)}{10} = \\mathbf{1{,}0\\text{ detik}}$$

---

### 🟡 Level 2: Menengah (Jangkauan Maksimum)
**Soal:** Tentukan jangkauan mendatar maksimum sebuah peluru jika ditembakkan dari tanah dengan laju $50\\text{ m/s}$ pada sudut $45^\\circ$ ($g = 10\\text{ m/s}^2$).

**Penyelesaian:**
$$R = \\frac{v_0^2 \\sin 2\\theta}{g} = \\frac{50^2 \\sin(90^\\circ)}{10} = \\frac{2500 \\times 1}{10} = \\mathbf{250\\text{ meter}}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Basket Adrian vs Bisma - Soal No. 7)
**Soal:** Adrian dan Bisma melepaskan bola dari titik yang sama berjarak mendatar $x = 3\\text{ m}$ dari ring basket setinggi $h_{\\text{ring}} = 3{,}05\\text{ m}$. Bola dilepas dari ketinggian $y_0 = 2\\text{ m}$ dengan sudut elevasi $\\theta = 50^\\circ$ (diketahui $\\sin 50^\\circ = 0{,}766$, $\\cos 50^\\circ = 0{,}643$).
- Adrian menembakkan dengan $v_0 = 7{,}5\\text{ m/s}$ dan bola tepat masuk ke ring.
- Bisma menembakkan dengan menurunkan kecepatan menjadi $v_0 = 6{,}5\\text{ m/s}$ dengan sudut tetap $50^\\circ$.
Kondisi apa yang akan terjadi pada tembakan Bisma?

**Analisis Matematis:**
1. Waktu tempuh bola Bisma mencapai jarak $x = 3\\text{ m}$:
   $$t = \\frac{x}{v_0 \\cos 50^\\circ} = \\frac{3}{6{,}5 \\times 0{,}643} = \\frac{3}{4{,}18} \\approx 0{,}718\\text{ s}$$
2. Ketinggian bola Bisma saat $x = 3\\text{ m}$:
   $$y = y_0 + v_0 \\sin 50^\\circ \\cdot t - \\frac{1}{2}gt^2$$
   $$y = 2 + (6{,}5 \\times 0{,}766)(0{,}718) - 5(0{,}718)^2$$
   $$y = 2 + 3{,}57 - 2{,}58 = 2{,}99\\text{ m}$$
   Karena $2{,}99\\text{ m} < 3{,}05\\text{ m}$ (tinggi ring), bola Bisma berada di bawah bibir ring basket (jatuh lebih pendek dan gagal masuk).
**Jawaban TKA:** C. Bola Bisma jatuh lebih cepat dan gagal masuk karena kecepatannya lebih kecil.
`
    }
];
