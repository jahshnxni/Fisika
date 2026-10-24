import { LessonData } from './units';

export const LESSONS_UNIT4: LessonData[] = [
    {
        title: "Gelombang Bunyi, Resonansi & Pipa Organa",
        slug: "akustik-pipa-organa",
        order: 1,
        skillSlug: "gelombang-bunyi",
        contentMdx: `
# 🎵 Gelombang Bunyi & Akustik Pipa Organa

Bunyi adalah gelombang mekanik longitudinal yang merambat melalui medium elastis (padat, cair, gas). Fenomena resonansi pada kolom udara pipa organa merupakan dasar dari alat musik tiup seperti suling, klarinet, dan pipa organ gereja.

---

## 1. Parameter Gelombang Bunyi

Persamaan umum cepat rambat gelombang:
$$v = \\lambda \\cdot f \\implies f = \\frac{v}{\\lambda}$$
Dimana:
- $v$ = Cepat rambat bunyi di udara (rata-rata $340\\text{ m/s}$)
- $\\lambda$ = Panjang gelombang [m]
- $f$ = Frekuensi getaran [Hz]

---

## 2. Pipa Organa Tertutup (Satu Ujung Tertutup)

Jika sebuah pipa PVC sebagian diisi air, permukaan air bertindak sebagai **ujung tertutup** (terbentuk simpul simpangan / rapat partikel), sedangkan ujung atas tempat dipukulnya pipa bertindak sebagai **ujung terbuka** (terbentuk perut simpangan).

### Panjang Kolom Udara pada Mode Nada:
- **Nada Dasar (Harmonik ke-1):**
  $$L = \\frac{1}{4} \\lambda_0 \\implies \\lambda_0 = 4L$$
  $$\\boxed{f_0 = \\frac{v}{\\lambda_0} = \\frac{v}{4L}}$$
- **Nada Atas ke-1 (Harmonik ke-3):**
  $$L = \\frac{3}{4} \\lambda_1 \\implies f_1 = \\frac{3v}{4L} = 3f_0$$
- **Perbandingan frekuensi:** $f_0 : f_1 : f_2 = 1 : 3 : 5 : \\dots$

---

## 3. Simulasi Interaktif: Pipa PVC & Synthesizer Frekuensi

Dengarkan dan visualisasikan gelombang stasioner pada pipa PVC dengan menggeser ketinggian air:

<InteractiveComponent type="OrganPipeAcousticSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah garputala bergetar dengan frekuensi $680\\text{ Hz}$. Jika cepat rambat bunyi di udara $340\\text{ m/s}$, berapakah panjang gelombang bunyi di udara?

**Penyelesaian:**
$$\\lambda = \\frac{v}{f} = \\frac{340\\text{ m/s}}{680\\text{ Hz}} = \\mathbf{0{,}5\\text{ meter} = 50\\text{ cm}}$$

---

### 🟡 Level 2: Menengah (Efek Doppler)
**Soal:** Mobil ambulans bergerak dengan kelajuan $20\\text{ m/s}$ membunyikan sirene $640\\text{ Hz}$ mendekati pendengar diam. Jika cepat rambat bunyi $340\\text{ m/s}$, berapa frekuensi yang didengar pendengar?

**Penyelesaian:**
$$f_p = \\frac{v \\pm v_p}{v \\mp v_s} f_s = \\frac{340 + 0}{340 - 20} (640) = \\frac{340}{320} \\times 640 = \\mathbf{680\\text{ Hz}}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Pipa PVC Terisi Air - Soal No. 15)
**Soal:** Seorang siswa melakukan percobaan membuat alat musik sederhana dari pipa PVC yang diisi air. Ia memukul bagian atas pipa untuk menghasilkan bunyi. Panjang total pipa adalah $80\\text{ cm}$ dan sebagian diisi air sehingga hanya tersisa kolom udara setinggi $40\\text{ cm} = 0{,}4\\text{ m}$ yang berfungsi sebagai kolom udara terbuka di salah satu ujungnya. Diketahui bahwa cepat rambat bunyi di udara adalah $v = 340\\text{ m/s}$. Jika pipa menghasilkan nada dasar (harmonik pertama), berapa frekuensi bunyi yang dihasilkan?

**Langkah Penurunan Solusi:**
1. Karena salah satu ujung tertutup oleh permukaan air dan ujung atas terbuka, sistem ini adalah **pipa organa tertutup sepihak**.
2. Pada nada dasar (harmonik pertama):
   $$L = \\frac{1}{4} \\lambda \\implies \\lambda = 4 \\times L = 4 \\times 0{,}4\\text{ m} = 1{,}6\\text{ m}$$
3. Frekuensi nada dasar:
   $$f = \\frac{v}{\\lambda} = \\frac{340\\text{ m/s}}{1{,}6\\text{ m}} = \\mathbf{212{,}5\\text{ Hz}}$$

**Jawaban TKA:** A. $212{,}5\\text{ Hz}$.
`
    },
    {
        title: "Sifat Cahaya, Fatamorgana & Alat Optik",
        slug: "pembiasan-dan-kacamata",
        order: 2,
        skillSlug: "gelombang-cahaya-optik",
        contentMdx: `
# 👁️ Cahaya: Fenomena Fatamorgana & Optika Mata

Cahaya merambat lurus dalam medium homogen, namun mengalami pembiasan (refraksi) ketika melewati medium dengan indeks bias berbeda. Prinsip ini menjelaskan ilusi optik alamiah seperti fatamorgana di jalan terik hingga koreksi kelainan refraksi mata manusia.

---

## 1. Hukum Pembiasan & Ilusi Fatamorgana

Hukum Snellius pembiasan:
$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$$
- Kerapatan udara bergantung pada suhu: Udara panas memiliki kerapatan partikel lebih rendah, sehingga **indeks biasnya lebih kecil** ($n_{\\text{panas}} < n_{\\text{dingin}}$).
- Di atas tanah lapang yang terpapar matahari terik, lapisan udara tepat di atas aspal/tanah sangat panas ($n$ kecil), sedangkan lapisan di atasnya lebih sejuk ($n$ lebih besar).
- Sinar cahaya dari langit atau objek pohon merambat dari lapisan sejuk ke panas menjauhi garis normal, hingga sudut datang melampaui sudut kritis dan mengalami **Pemantulan Internal Total (Total Internal Reflection)**.
- Mata pengamat menerima sinar yang melengkung ini dan otak memproyeksikannya sebagai garis lurus, sehingga tanaman seolah tampak berada di atas permukaan air beriak.

---

## 2. Cacat Mata Hipermetropi (Rabun Dekat)

Pada mata hipermetropi:
- Titik dekat mata ($PP$) menjauh lebih besar dari titik dekat normal ($s_n = 25\\text{ cm}$).
- Bayangan benda dekat jatuh **di belakang retina**.
- Diperlukan kacamata **lensa cembung (positif)** untuk mengkonvergensikan berkas cahaya sebelum masuk ke mata:
  $$\\boxed{P = \\frac{100}{s_n} - \\frac{100}{PP}}$$
  Dimana $P$ dalam Dioptri (D), $s_n$ dan $PP$ dalam cm.

---

## 3. Simulasi Interaktif: Ray Tracing Fatamorgana & Koreksi Lensa

<InteractiveComponent type="MirageRefractionSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Berkas cahaya merambat dari udara ($n=1$) ke dalam air ($n=1{,}33$) dengan sudut datang $30^\\circ$. Apakah berkas cahaya dibiaskan mendekati atau menjauhi garis normal?

**Penyelesaian:**
Karena $n_{\\text{air}} > n_{\\text{udara}}$ (medium lebih rapat), sudut bias $\\theta_2 < \\theta_1$. Cahaya dibiaskan **mendekati garis normal**.

---

### 🟡 Level 2: Menengah (Ilusi Fatamorgana - Soal Asli TKA No. 16)
**Soal:** Seseorang berjalan melalui tanah lapang yang sangat panas dan melihat tanaman pendek di seberang lapangan seolah tampak dalam gelombang air beriak. Setelah didekati ternyata hanyalah ilusi. Bagaimana penjelasan ilmiah dari fenomena ini?

**Pembahasan TKA:**
Permukaan tanah yang sangat terik memanaskan udara di dekatnya. Terjadi gradien suhu yang menyebabkan perbedaan kerapatan udara (udara dekat tanah renggang dengan indeks bias rendah). Berkas cahaya dari pohon mengalami pembiasan bertingkat dan pemantulan internal, menghasilkan ilusi optik fatamorgana.
**Jawaban TKA:** D. Panas permukaan lapangan menyebabkan perbedaan kerapatan udara sehingga cahaya mengalami pembiasan.

---

### 🔴 Level 3: Level Asli TKA (HOTS Evaluasi Strategi Hipermetropi - Soal No. 17)
**Soal:** Rina menderita hipermetropi dengan titik dekat $PP = 50\\text{ cm}$ ($s_n = 25\\text{ cm}$). Dokter meresepkan lensa kacamata. Evaluasi tepat/tidak tepat dari 3 strategi berikut:
1. *Membuat kacamata dengan kekuatan +2 dioptri.*
2. *Membaca dengan jarak lebih dari 50 cm.*
3. *Menggunakan kacamata temannya yang terbuat dari lensa cekung.*

**Analisis Matematis & Fisika:**
1. **Kekuatan Lensa:**
   $$P = \\frac{100}{s_n} - \\frac{100}{PP} = \\frac{100}{25} - \\frac{100}{50} = 4 - 2 = \\mathbf{+2\\text{ Dioptri}}$$
   $\\rightarrow$ Strategi 1: **TEPAT**.
2. **Jarak Baca:**
   Karena titik dekat mata Rina adalah $50\\text{ cm}$, jika ia membaca dengan jarak lebih dari $50\\text{ cm}$ (misal $60\\text{ cm}$), matanya mampu memfokuskan bayangan ke retina tanpa kacamata.
   $\\rightarrow$ Strategi 2: **TEPAT**.
3. **Lensa Cekung:**
   Lensa cekung adalah lensa negatif untuk penderita miopi (rabun jauh). Jika digunakan oleh penderita hipermetropi, bayangan akan semakin terlempar ke belakang retina!
   $\\rightarrow$ Strategi 3: **TIDAK TEPAT**.
`
    }
];
