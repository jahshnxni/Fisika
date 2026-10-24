import { LessonData } from './units';

export const LESSONS_UNIT6: LessonData[] = [
    {
        title: "Listrik Statis & Titik Medan Listrik Nol",
        slug: "medan-listrik-printer-elektrostatik",
        order: 1,
        skillSlug: "listrik-statis",
        contentMdx: `
# ⚡ Listrik Statis & Aplikasi Printer Elektrostatik

Interaksi antar muatan listrik statis menjadi landasan teknologi mutakhir seperti penyaring udara presipitator elektrostatik, mesin fotokopi xerografi, dan printer laser elektrostatik.

---

## 1. Hukum Coulomb & Kuat Medan Listrik

### 1. Gaya Coulomb
$$F = k \\frac{|q_1 \\cdot q_2|}{r^2}$$
Dimana $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.

### 2. Kuat Medan Listrik $\\vec{E}$:
Medan listrik adalah vektor gaya per satuan muatan uji positif:
$$\\vec{E} = k \\frac{q}{r^2} \\hat{r}$$
- Arah garis medan: **Keluar dari muatan positif**, dan **masuk menuju muatan negatif**.

### Syarat Kuat Medan Nol Antara Dua Muatan Negatif:
Jika dua muatan bertanda sama (misal sama-sama negatif, $Q_1 < 0$ dan $Q_2 < 0$), maka medan listrik $\\vec{E}_1$ (menuju $Q_1$) dan $\\vec{E}_2$ (menuju $Q_2$) memiliki arah yang berlawanan di daerah **di antara kedua muatan**!
$$E_1 = E_2 \\implies k \\frac{|Q_1|}{x^2} = k \\frac{|Q_2|}{(d - x)^2}$$
$$\\boxed{\\frac{\\sqrt{|Q_1|}}{x} = \\frac{\\sqrt{|Q_2|}}{d - x}}$$

---

## 2. Simulasi Interaktif: Sistem Elektroda Printer Laser

Lihat bagaimana medan listrik di antara dua elektroda $-4\\ \\mu\\text{C}$ dan $-9\\ \\mu\\text{C}$ saling meniadakan di titik $x = 3{,}2\\text{ cm}$:

<InteractiveComponent type="ElectrostaticPrinterSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Dua muatan titik $+2\\ \\mu\\text{C}$ dan $+8\\ \\mu\\text{C}$ berjarak $30\\text{ cm}$. Di manakah titik yang memiliki medan listrik nol dari muatan pertama?

**Penyelesaian:**
$$\\frac{\\sqrt{2}}{x} = \\frac{\\sqrt{8}}{30 - x} = \\frac{2\\sqrt{2}}{30 - x} \\implies 30 - x = 2x \\implies 3x = 30 \\implies x = \\mathbf{10\\text{ cm}}$$

---

### 🟡 Level 2: Menengah (Gaya Coulomb Tiga Muatan)
**Soal:** Tiga muatan diletakkan segaris. Hitung gaya total pada muatan tengah jika kedua muatan ujung simetris.
Hasil gaya resultan adalah nol karena kedua gaya Coulomb memiliki besar sama dan arah berlawanan.

---

### 🔴 Level 3: Level Asli TKA (HOTS Printer Elektrostatik - Soal No. 23)
**Soal:** Dalam sistem printer elektrostatik, dua elektroda dipasang sejajar pada kertas cetak untuk mengarahkan partikel toner.
- Elektroda 1 bermuatan $Q_1 = -4\\ \\mu\\text{C}$ di posisi $x = 0$.
- Elektroda 2 bermuatan $Q_2 = -9\\ \\mu\\text{C}$ di posisi $x = 8\\text{ cm}$.
Di manakah letak titik di sepanjang sumbu-x yang memiliki kuat medan listrik total sama dengan nol?

**Langkah Penurunan Solusi:**
1. Karena kedua muatan **sama-sama negatif**, vektor medan listrik akibat $Q_1$ mengarah ke kiri (menuju $Q_1$) dan akibat $Q_2$ mengarah ke kanan (menuju $Q_2$) hanya pada rentang **di antara kedua muatan ($0 < x < 8\\text{ cm}$)**.
2. Persamaan medan nol:
   $$E_1 = E_2 \\implies k \\frac{|Q_1|}{x^2} = k \\frac{|Q_2|}{(8 - x)^2}$$
   $$\\frac{4}{x^2} = \\frac{9}{(8 - x)^2}$$
3. Tarik akar pada kedua sisi persamaan:
   $$\\frac{2}{x} = \\frac{3}{8 - x}$$
   $$2(8 - x) = 3x \\implies 16 - 2x = 3x \\implies 5x = 16 \\implies x = \\mathbf{3{,}2\\text{ cm}}$$
   Titik ini berada di sebelah kanan $Q_1$ pada jarak $x = 3{,}2\\text{ cm}$.

**Jawaban TKA:** B. Di sebelah kanan $Q_1$, yaitu pada $x = 3{,}2\\text{ cm}$.
`
    },
    {
        title: "Rangkaian DC, Hukum Ohm & Audit Tagihan Listrik",
        slug: "rangkaian-hambatan-tarif-listrik",
        order: 2,
        skillSlug: "rangkaian-dc-daya",
        contentMdx: `
# 💡 Rangkaian Arus Searah DC & Optimasi Energi

Hukum-hukum kelistrikan arus searah tidak hanya digunakan untuk menganalisis rangkaian resistor di laboratorium, tetapi juga sangat krusial dalam manajemen konsumsi energi listrik rumah tangga agar hemat biaya dan ramah lingkungan.

---

## 1. Hukum Kelistrikan & Resistor

### Hukum Ohm:
$$V = I \\cdot R \\implies I = \\frac{V}{R}$$

### Susunan Resistor:
- **Seri:** Hambatan bertambah besar, arus listrik sama.
  $$R_{\\text{total}} = R_1 + R_2$$
- **Paralel:** Hambatan mengecil, tegangan sama.
  $$\\frac{1}{R_{\\text{total}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$$

---

## 2. Energi, Daya Listrik & Tagihan PLN

Daya listrik:
$$P = V \\cdot I = I^2 \\cdot R = \\frac{V^2}{R} \\quad [\\text{Watt}]$$
Energi listrik dalam kiloWatt-hour (kWh):
$$E\\ (\\text{kWh}) = \\frac{\\text{Daya (W)} \\times \\text{Jam/Hari} \\times \\text{Hari/Bulan}}{1{.}000}$$
$$\\text{Biaya Bulanan} = \\sum E_i \\times \\text{Tarif per kWh}$$

---

## 3. Simulasi Interaktif: Modifikasi Sirkuit DC & Kalkulator Tagihan Listrik

Uji coba rangkaian resistor dan simulasi penghematan beban listrik keluarga:

<InteractiveComponent type="DCCircuitBillingSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah lampu $60\\text{ W}$ menyala $10\\text{ jam}$ sehari selama 30 hari. Berapa energi listrik yang dikonsumsi dalam kWh?

**Penyelesaian:**
$$E = \\frac{60 \\times 10 \\times 30}{1{.}000} = \\frac{18{.}000}{1{.}000} = \\mathbf{18\\text{ kWh}}$$

---

### 🟡 Level 2: Menengah (Modifikasi Rangkaian - Soal Asli TKA No. 24)
**Soal:** Perhatikan dua rangkaian listrik:
- **Rangkaian A:** Dua resistor $6\\ \\Omega$ dirangkai seri dengan tegangan sumber $V_A = 12\\text{ V}$.
  $$R_A = 6 + 6 = 12\\ \\Omega \\implies I_A = \\frac{12\\text{ V}}{12\\ \\Omega} = 1\\text{ A}$$
- **Rangkaian B:** Dua resistor $3\\ \\Omega$ dirangkai paralel dengan tegangan sumber $V_B = 6\\text{ V}$.
  $$R_B = \\frac{3 \\times 3}{3 + 3} = 1{,}5\\ \\Omega \\implies I_B = \\frac{6\\text{ V}}{1{,}5\\ \\Omega} = 4\\text{ A}$$
Agar besar arus listrik pada kedua rangkaian nilainya sama ($I_B = I_A = 1\\text{ A}$), bagaimana cara modifikasi yang tepat?

**Pembahasan TKA:**
Agar $I_B = \\frac{6}{R'_B} = 1\\text{ A}$, maka hambatan total rangkaian B harus dijadikan $R'_B = 6\\ \\Omega$.
Kedua resistor awal pada rangkaian B bernilai $3\\ \\Omega$. Jika susunannya **diubah menjadi seri**:
$$R'_B = 3\\ \\Omega + 3\\ \\Omega = 6\\ \\Omega \\implies I_B = \\frac{6\\text{ V}}{6\\ \\Omega} = 1\\text{ A}$$
**Jawaban TKA:** C. Ubah susunan resistor Rangkaian B menjadi seri.

---

### 🔴 Level 3: Level Asli TKA (HOTS Audit Tagihan Listrik - Soal No. 25)
**Soal:** Diberikan data penggunaan listrik keluarga (tarif $\\text{Rp}1{.}500/\\text{kWh}$):
- **AC:** $1{.}000\\text{ W} \\times 8\\text{ jam} \\times 30\\text{ hari} = 240\\text{ kWh}$
- **Kulkas:** $150\\text{ W} \\times 24\\text{ jam} \\times 30\\text{ hari} = 108\\text{ kWh}$
- **Mesin Cuci:** $350\\text{ W} \\times 1\\text{ jam} \\times 8\\text{ hari} = 2{,}8\\text{ kWh}$
- **Setrika:** $300\\text{ W} \\times 1\\text{ jam} \\times 12\\text{ hari} = 3{,}6\\text{ kWh}$
- **Televisi:** $100\\text{ W} \\times 5\\text{ jam} \\times 30\\text{ hari} = 15\\text{ kWh}$
Total energi awal:
$$E_{\\text{total}} = 240 + 108 + 2{,}8 + 3{,}6 + 15 = 369{,}4\\text{ kWh}$$
Total biaya awal $= 369{,}4 \\times \\text{Rp}1{.}500 = \\mathbf{\\text{Rp}554{.}100}$.
Keluarga ingin agar tagihan tetap di bawah **Rp375.000 / bulan** (energi maksimum $< \\frac{375{.}000}{1{.}500} = 250\\text{ kWh}$, butuh pemangkasan $\\ge 119{,}4\\text{ kWh}$). Keputusan terbaik apa yang dapat diambil?

**Evaluasi Pilihan TKA:**
- Jika penggunaan AC dikurangi menjadi $4\\text{ jam/hari}$:
  $$E_{\\text{AC baru}} = \\frac{1{.}000 \\times 4 \\times 30}{1{.}000} = 120\\text{ kWh}$$
  Penghematan energi $= 240 - 120 = 120\\text{ kWh}$.
  Total energi baru $= 369{,}4 - 120 = 249{,}4\\text{ kWh}$.
  Total biaya baru $= 249{,}4 \\times \\text{Rp}1{.}500 = \\mathbf{\\text{Rp}374{.}100}$ (Berhasil di bawah Rp375.000!).
- Pilihan lain (TV, mesin cuci, setrika) hanya memangkas $1 - 6\\text{ kWh}$, jauh dari target penghematan yang dibutuhkan.

**Jawaban TKA:** A. Mengurangi penggunaan AC menjadi 4 jam per hari.
`
    },
    {
        title: "Kemagnetan & Gaya Lorentz",
        slug: "kemagnetan-gaya-lorentz-siklotron",
        order: 3,
        skillSlug: "kemagnetan-lorentz",
        contentMdx: `
# 🧲 Medan Magnet & Gaya Lorentz: Prinsip Siklotron

Gaya magnetik (Gaya Lorentz) adalah interaksi elektromagnetik dasar yang mengendalikan pembelokan partikel bermuatan dalam akselerator partikel (siklotron), spektrometer massa laboratorium, dan medan magnet sabuk Van Allen bumi.

---

## 1. Persamaan Vektor Gaya Lorentz

Partikel bermuatan $q$ yang bergerak dengan vektor kecepatan $\\vec{v}$ di dalam medan magnet seragam $\\vec{B}$ mengalami gaya:
$$\\vec{F}_L = q (\\vec{v} \\times \\vec{B})$$
Besar gaya Lorentz:
$$F_L = |q| \\cdot v \\cdot B \\cdot \\sin\\theta$$
Dimana $\\theta$ adalah sudut apit antara vektor kecepatan $\\vec{v}$ dan arah medan magnet $\\vec{B}$.

### Kaidah Tangan Kanan (Muatan Positif):
- **Ibu Jari:** Arah vektor kecepatan $\\vec{v}$
- **Empat Jari Telunjuk - Kelingking:** Arah vektor medan magnet $\\vec{B}$
- **Telapak Tangan:** Arah dorongan Gaya Lorentz $\\vec{F}_L$
> *(Catatan: Untuk elektron / muatan negatif, arah gaya Lorentz berlawanan dengan arah telapak tangan).*

---

## 2. Orbit Melingkar Partikel dalam Medan Magnet

Jika kecepatan partikel tegak lurus terhadap medan magnet ($\\theta = 90^\\circ \\implies \\sin 90^\\circ = 1$), gaya Lorentz selalu tegak lurus kecepatan, sehingga **tidak mengubah kelajuan dan tidak melakukan usaha ($W = 0$)**. Gaya Lorentz berperan sebagai **gaya sentripetal ($F_c$)**:
$$F_L = F_c \\implies q v B = \\frac{m v^2}{R}$$
$$\\boxed{R = \\frac{m v}{q B}}$$

### Frekuensi Siklotron & Periode Orbit:
$$T = \\frac{2\\pi R}{v} = \\frac{2\\pi m}{q B}$$
$$f = \\frac{q B}{2\\pi m}$$
Frekuensi siklotron tidak bergantung pada kecepatan atau jari-jari orbit partikel!

---

## 3. Simulasi Interaktif: Lintasan Melingkar Gaya Lorentz

Uji coba variasi kecepatan muatan $v$, kuat medan magnet $B$, jenis muatan ($+q$ atau $-q$), serta orientasi medan magnet (masuk $\\otimes$ atau keluar $\\odot$ bidang):

<InteractiveComponent type="MagneticLorentzSim" />

---

## 4. Pembahasan Animasi Interaktif Ala Manim (MathJax)

Lihat visualisasi vektor gerak melingkar siklotron dengan Manim Engine:

<InteractiveComponent type="ManimSolutionViewer" />

---

## 5. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Sebuah proton ($q = 1{,}6 \\times 10^{-19}\\text{ C}$) bergerak dengan kelajuan $2 \\times 10^6\\text{ m/s}$ tegak lurus medan magnet $0{,}5\\text{ Tesla}$. Hitung besar gaya Lorentz yang dialami proton!

**Penyelesaian:**
$$F_L = q v B = (1{,}6 \\times 10^{-19}) \\times (2 \\times 10^6) \\times 0{,}5 = \\mathbf{1{,}6 \\times 10^{-13}\\text{ N}}$$

---

### 🟡 Level 2: Menengah (Jari-Jari Orbit Spektrometer Massa)
**Soal:** Partikel alfa ($m = 6{,}64 \\times 10^{-27}\\text{ kg}$, $q = 3{,}2 \\times 10^{-19}\\text{ C}$) ditembakkan ke dalam medan magnet $B = 1{,}5\\text{ T}$ dengan kelajuan $4 \\times 10^5\\text{ m/s}$. Tentukan jari-jari lintasan lingkaran partikel!

**Penyelesaian:**
$$R = \\frac{m v}{q B} = \\frac{(6{,}64 \\times 10^{-27}) \\times (4 \\times 10^5)}{(3{,}2 \\times 10^{-19}) \\times 1{,}5} = \\frac{2{,}656 \\times 10^{-21}}{4{,}8 \\times 10^{-19}} \\approx \\mathbf{5{,}53\\text{ mm}}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Spektrometer Pemisah Isotop)
**Soal:** Dua isotop ion positif bermuatan sama $+q$ dipercepat oleh beda potensial listrik yang sama $V$ sebelum memasuki medan magnet homogen $B$ tegak lurus. Jika massa isotop 1 adalah $m_1$ dan isotop 2 adalah $m_2$, tentukan perbandingan jari-jari lintasan keduanya ($R_1 / R_2$)!

**Langkah Analisis:**
1. Energi kinetik dari medan potensial listrik:
   $$E_k = q V = \\frac{1}{2} m v^2 \\implies v = \\sqrt{\\frac{2 q V}{m}}$$
2. Substitusi ke rumus jari-jari lintasan:
   $$R = \\frac{m v}{q B} = \\frac{m \\sqrt{\\frac{2 q V}{m}}}{q B} = \\frac{1}{B} \\sqrt{\\frac{2 m V}{q}}$$
3. Perbandingan jari-jari kedua isotop:
   $$\\frac{R_1}{R_2} = \\sqrt{\\frac{m_1}{m_2}}$$
Jari-jari deteksi berbanding lurus dengan akar massa partikel, membuktikan prinsip kerja **spektrometer massa presisi**.
`
    }
];
