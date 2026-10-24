import { LessonData } from './units';

export const LESSONS_UNIT2: LessonData[] = [
    {
        title: "Hukum Newton & Resultan Gaya 2D",
        slug: "hukum-newton-vektor",
        order: 1,
        skillSlug: "hukum-newton-gaya",
        contentMdx: `
# ⚓ Dinamika Hukum Newton & Gerak Benda 2D

Dinamika mempelajari gaya sebagai penyebab perubahan gerak benda. Sir Isaac Newton merumuskan tiga hukum fundamental gerak yang melandasi mekanika klasik dan rekayasa navigasi laut modern.

---

## 1. Tiga Pilar Hukum Newton

### 1. Hukum I Newton (Hukum Kelembaman / Inersia)
$$\\Sigma \\vec{F} = 0 \\implies \\vec{a} = 0$$
Benda yang diam akan tetap diam, dan benda yang bergerak lurus beraturan akan terus bergerak dengan kecepatan konstan selama tidak ada resultan gaya luar yang bekerja padanya.
> **Fenomena:** Saat mobil direm mendadak, tubuh penumpang tersentak ke depan mempertahankan keadaan geraknya. Ini setara dengan buku yang tetap diam di atas meja sampai ada gaya yang mendorongnya.

### 2. Hukum II Newton (Dinamika Percepatan)
$$\\Sigma \\vec{F} = m \\vec{a} \\implies \\vec{a} = \\frac{\\Sigma \\vec{F}}{m}$$

### 3. Hukum III Newton (Aksi - Reaksi)
$$\\vec{F}_{\\text{aksi}} = -\\vec{F}_{\\text{reaksi}}$$

---

## 2. Simulasi Interaktif: Bidang Miring Kasar & Diagram Gaya Bebas (FBD)

Dinamika benda pada bidang miring melibatkan dekomposisi gaya berat menjadi komponen sejajar ($W_\\parallel = mg\\sin\\theta$) dan tegak lurus ($W_\\perp = mg\\cos\\theta$). Anda dapat menggeser sudut kemiringan $\\theta$, mengubah massa $m$, dan mengaktifkan gaya gesek kinetis/statis:

<InteractiveComponent type="InclinedPlaneSim" />

---

## 3. Simulasi Interaktif: Sistem Katrol Atwood Dua Beban

Katrol mengubah arah gaya tegangan tali. Pada katrol Atwood licin dengan massa $m_1$ dan $m_2$, percepatan sistem dan tegangan tali dihitung dengan:
$$a = \\frac{|m_1 - m_2|}{m_1 + m_2}g, \\qquad T = \\frac{2m_1 m_2}{m_1 + m_2}g$$

<InteractiveComponent type="PulleySystemSim" />

---

## 4. Simulasi Interaktif: Perahu Nelayan & Gaya Arus Laut

Perhatikan simulasi perahu nelayan bermassa $150\\text{ kg}$ yang berlayar ke utara $6\\text{ m/s}$ lalu terkena dorongan arus laut sebesar $300\\text{ N}$ ke arah timur selama $4\\text{ detik}$:

<InteractiveComponent type="FishingBoatForceSim" />

---

## 5. Pembahasan Animasi Interaktif Ala Manim (MathJax)

Saksikan visualisasi penurunan rumus langkah-demi-langkah dengan animasi vektor Manim:

<InteractiveComponent type="ManimSolutionViewer" />

---

## 6. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah balok kayu bermassa $5\\text{ kg}$ berada di atas lantai licin ditarik dengan gaya mendatar $20\\text{ N}$. Hitung percepatan balok!

**Penyelesaian:**
$$a = \\frac{F}{m} = \\frac{20\\text{ N}}{5\\text{ kg}} = \\mathbf{4\\text{ m/s}^2}$$

---

### 🟡 Level 2: Menengah (Hukum Kelembaman - Soal Asli TKA No. 8)
**Soal:** Ketika sebuah mobil tiba-tiba mengerem, penumpang di dalamnya akan terdorong ke depan. Di antara fenomena berikut, manakah yang menerapkan hukum Newton yang sama (Hukum I Newton)?
- A. Semakin besar gaya diberikan, semakin besar percepatan.
- B. Saat mendayung perahu ke depan, air mendorong ke belakang.
- C. Sebuah buku akan tetap diam di atas meja sampai ada gaya yang menggerakkannya.
- D. Bola kasti dilempar vertikal jatuh kembali ke tanah.
- E. Butuh gaya lebih besar untuk mempercepat truk daripada motor.

**Pembahasan:**
Penumpang terdorong ke depan akibat sifat **kelembaman (inersia / Hukum I Newton)**, yaitu kecenderungan benda mempertahankan keadaan geraknya. Fenomena C (buku tetap diam jika tidak ada gaya) merupakan pernyataan langsung dari Hukum I Newton.
**Jawaban TKA:** C. Sebuah buku akan tetap diam di atas meja sampai ada gaya yang menggerakkannya.

---

### 🔴 Level 3: Level Asli TKA (HOTS Perahu Nelayan di Laut - Soal No. 9)
**Soal:** Perahu bermassa $m = 150\\text{ kg}$ melaju ke arah utara dengan kelajuan konstan $v_y = 6\\text{ m/s}$. Tiba-tiba arus laut dari barat memberi gaya $F_x = 300\\text{ N}$ ke timur selama $t = 4\\text{ detik}$. Mesin perahu tetap mempertahankan kelajuan ke utara $6\\text{ m/s}$. Bagaimana kondisi gerak perahu setelah $4\\text{ detik}$ gaya arus bekerja?

**Langkah Analisis:**
1. **Percepatan ke arah timur (sumbu X):**
   $$a_x = \\frac{F_x}{m} = \\frac{300\\text{ N}}{150\\text{ kg}} = 2\\text{ m/s}^2$$
2. **Kecepatan ke timur setelah 4 detik:**
   $$v_x = v_{0x} + a_x t = 0 + (2\\text{ m/s}^2)(4\\text{ s}) = 8\\text{ m/s}$$
3. **Kecepatan resultan perahu:**
   $$v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = \\mathbf{10\\text{ m/s}}$$
4. **Arah sudut terhadap sumbu utara:**
   $$\\tan\\theta = \\frac{v_x}{v_y} = \\frac{8}{6} = \\frac{4}{3} \\implies \\theta = \\mathbf{53^\\circ \\text{ ke timur dari utara}}$$
5. Setelah $t = 4\\text{ s}$, gaya arus berhenti bekerja (hanya mesin yang bekerja konstan), sehingga resultan gaya menjadi nol dan perahu **bergerak lurus dengan kecepatan konstan $10\\text{ m/s}$**.

**Jawaban TKA:** A. kecepatan resultannya $10\\text{ m/s}$ dengan arah $53^\\circ$ ke timur dari utara, kemudian bergerak lurus dengan kecepatan konstan.
`
    },
    {
        title: "Momentum, Impuls & Teorema Tumbukan",
        slug: "impuls-tumbukan",
        order: 2,
        skillSlug: "momentum-impuls",
        contentMdx: `
# 🥋 Momentum, Impuls & Gaya Kontak Ekstrem

Mengapa karateka bisa memecahkan tumpukan bata hebel tebal tanpa melukai tangannya? Mengapa mobil modern didesain dengan *crumple zone* (zona remuk)? Keduanya berakar pada hukum fisika yang sama: **Teorema Impuls-Momentum**.

---

## 1. Definisi Fisika

### Momentum Linear: Ukuran kesukaran menghentikan benda
$$\\vec{p} = m \\vec{v} \\quad [\\text{kg}\\cdot\\text{m/s}]$$

### Impuls: Hasil kali gaya rata-rata dengan selang waktu sentuh
$$\\vec{I} = \\int \\vec{F} dt = \\bar{F} \\cdot \\Delta t \\quad [\\text{N}\\cdot\\text{s}]$$

### Teorema Impuls-Momentum:
$$\\vec{I} = \\Delta \\vec{p} = m \\vec{v}_t - m \\vec{v}_0$$
$$\\bar{F} = \\frac{\\Delta \\vec{p}}{\\Delta t}$$

> **Kunci Konsep TKA:** Jika perubahan momentum $\\Delta p$ bernilai tetap, maka semakin singkat waktu sentuh $\\Delta t$, gaya kontak $\\bar{F}$ akan menjadi **sangat besar secara berlipat ganda**! Sebaliknya, memperpanjang $\\Delta t$ (seperti airbag mobil) akan memperkecil gaya benturan.

---

## 2. Simulasi Interaktif: Pukulan Karateka Pemecah Hebel

Coba atur waktu kontak $\\Delta t$ pukulan dan perhatikan bagaimana kurva gaya impuls $F(t)$ melompat drastis hingga melampaui batas hancur hebel!

<InteractiveComponent type="KarateImpulseSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah bola bermassa $0{,}2\\text{ kg}$ dilempar dengan kelajuan $10\\text{ m/s}$. Berapakah momentum bola tersebut?

**Penyelesaian:**
$$p = m \\cdot v = 0{,}2\\text{ kg} \\times 10\\text{ m/s} = \\mathbf{2\\text{ kg}\\cdot\\text{m/s}}$$

---

### 🟡 Level 2: Menengah (Gaya Kontak Helm)
**Soal:** Pengendara motor bermassa kepala $5\\text{ kg}$ mengalami perubahan kecepatan dari $20\\text{ m/s}$ menjadi $0\\text{ m/s}$. Tanpa helm waktu henti $0{,}01\\text{ s}$, dengan helm berbusa waktu henti menjadi $0{,}1\\text{ s}$. Berapa perbandingan gaya yang diterima kepala?

**Penyelesaian:**
$$\\Delta p = 5 \\times 20 = 100\\text{ kg}\\cdot\\text{m/s}$$
$$F_{\\text{tanpa}} = \\frac{100}{0{,}01} = 10{.}000\\text{ N}$$
$$F_{\\text{helm}} = \\frac{100}{0{,}1} = 1{.}000\\text{ N}$$
Gaya kontak berkurang hingga **10 kali lipat**!

---

### 🔴 Level 3: Level Asli TKA (HOTS Karate Pemecah Bata - Soal No. 10)
**Soal:** Dalam sebuah pertunjukan bela diri, seorang atlet karate berhasil memecahkan tumpukan batu bata ringan (hebel) dengan pukulan cepat. Tumpukan batu bata dapat pecah meskipun hanya bersentuhan dengan tangan dalam waktu singkat. Penjelasan yang paling tepat untuk fenomena ini adalah...

**Pembahasan TKA:**
Berdasarkan hubungan:
$$\\bar{F} = \\frac{\\Delta p}{\\Delta t}$$
Tangan atlet datang dengan kelajuan sangat tinggi (momentum besar) dan dihentikan seketika saat menyentuh permukaan bata sehingga waktu sentuh $\\Delta t$ sangat kecil (dalam orde milidetik). Akibat $\\Delta t \\to 0$, gaya impulsif rata-rata $\\bar{F}$ melonjak sangat tinggi melebihi tegangan patah (breaking stress) batu bata, menyebabkannya hancur berkeping-keping.
**Jawaban TKA:** B. Gaya menjadi sangat besar karena perubahan momentum terjadi dalam waktu yang sangat singkat.
`
    },
    {
        title: "Dinamika Rotasi, Torsi & Momen Inersia",
        slug: "torsi-momen-inersia",
        order: 3,
        skillSlug: "dinamika-rotasi",
        contentMdx: `
# 🔩 Dinamika Rotasi: Torsi & Momen Inersia

Jika gaya menyebabkan percepatan linear pada gerak translasi, maka **Momen Gaya (Torsi)** menyebabkan percepatan sudut pada gerak rotasi!

---

## 1. Konsep Dasar Rotasi

### Momen Gaya (Torsi) $\\tau$:
$$\\vec{\\tau} = \\vec{r} \\times \\vec{F} \\implies \\tau = r \\cdot F \\sin\\theta$$
Dimana:
- $r$ = lengan gaya (jarak poros ke titik tangkap gaya) [m]
- $F$ = besar gaya [N]
- $\\theta$ = sudut antara vektor lengan $r$ dan arah gaya $F$

### Momen Inersia $I$: Ukuran kelembaman benda berotasi
- Batang homogen panjang $L$ diputar di salah satu ujungnya (seperti kunci pas):
  $$I = \\frac{1}{3} m L^2$$

### Hukum II Newton untuk Rotasi:
$$\\boxed{\\Sigma \\tau = I \\cdot \\alpha}$$
Dimana $\\alpha$ adalah percepatan sudut ($\\text{rad/s}^2$).

---

## 2. Simulasi Interaktif: Kunci Pas Pengencang Baut

Simulasikan kunci pas mekanik sepanjang $20\\text{ cm}$ yang ditarik gaya $15\\text{ N}$ pada sudut $37^\\circ$:

<InteractiveComponent type="WrenchTorqueSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah pintu ditarik tegak lurus ($\\theta = 90^\\circ$) dengan gaya $20\\text{ N}$ pada jarak $0{,}8\\text{ m}$ dari engsel. Berapakah torsi yang dihasilkan?

**Penyelesaian:**
$$\\tau = r \\cdot F \\sin 90^\\circ = 0{,}8 \\times 20 \\times 1 = \\mathbf{16\\text{ N}\\cdot\\text{m}}$$

---

### 🟡 Level 2: Menengah (Momen Inersia Batang)
**Soal:** Sebuah batang bermassa $3\\text{ kg}$ dan panjang $2\\text{ m}$ diputar di ujungnya. Hitung momen inersia batang!

**Penyelesaian:**
$$I = \\frac{1}{3} m L^2 = \\frac{1}{3}(3)(2^2) = \\mathbf{4\\text{ kg}\\cdot\\text{m}^2}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Kunci Pas - Soal No. 11)
**Soal:** Sebuah kunci pas digunakan untuk memutar baut. Agar optimal mengencangkan baut, diperlukan gaya $F = 15\\text{ N}$ membentuk sudut $37^\\circ$ terhadap posisi horizontal kunci pas yang panjangnya $20\\text{ cm} = 0{,}2\\text{ m}$. Kunci pas dianggap batang homogen bermassa $500\\text{ gram} = 0{,}5\\text{ kg}$ diputar di ujung baut. Berapakah percepatan sudut $\\alpha$ yang dihasilkan? (Diketahui $\\sin 37^\\circ = 0{,}6$ dan $\\cos 37^\\circ = 0{,}8$).

**Langkah Penurunan Solusi:**
1. **Hitung Torsi (Momen Gaya) $\\tau$:**
   $$\\tau = r \\cdot F \\sin 37^\\circ = (0{,}2\\text{ m})(15\\text{ N})(0{,}6) = 1{,}8\\text{ N}\\cdot\\text{m}$$
2. **Hitung Momen Inersia Batang terhadap Poros Ujung:**
   $$I = \\frac{1}{3} m L^2 = \\frac{1}{3}(0{,}5\\text{ kg})(0{,}2\\text{ m})^2 = \\frac{1}{3}(0{,}5)(0{,}04) = \\frac{0{,}02}{3} = \\frac{1}{150}\\text{ kg}\\cdot\\text{m}^2$$
3. **Hitung Percepatan Sudut $\\alpha$:**
   $$\\Sigma \\tau = I \\alpha \\implies \\alpha = \\frac{\\tau}{I} = \\frac{1{,}8}{\\frac{1}{150}} = 1{,}8 \\times 150 = \\mathbf{270\\text{ rad/s}^2}$$

**Jawaban TKA:** B. $270\\text{ rad}\\cdot\\text{s}^{-2}$.
`
    }
];
