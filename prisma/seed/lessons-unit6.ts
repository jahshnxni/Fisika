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
    }
];
