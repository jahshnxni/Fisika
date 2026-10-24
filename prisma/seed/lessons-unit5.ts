import { LessonData } from './units';

export const LESSONS_UNIT5: LessonData[] = [
    {
        title: "Perpindahan Kalor Konduksi & Desain Percobaan",
        slug: "konduksi-kalor-eksperimen",
        order: 1,
        skillSlug: "kalor-perpindahan",
        contentMdx: `
# 🔬 Perpindahan Kalor Konduksi & Metodologi Ilmiah

Perpindahan kalor secara konduksi adalah transfer energi termal melalui tumbukan antar molekul dan elektron bebas tanpa disertai perpindahan massa medium perantara. Dalam sains, merancang eksperimen konduksi membutuhkan pemahaman mendalam tentang **variabel bebas, variabel terikat, variabel kontrol, dan sumber galat sistematik**.

---

## 1. Hukum Fourier untuk Konduksi Termal

Laju perpindahan kalor konduksi (daya hantar panas $H$ atau $P$):
$$H = \\frac{Q}{t} = \\frac{k \\cdot A \\cdot \\Delta T}{L}$$
Dimana:
- $H = \\frac{Q}{t}$ = Laju kalor / daya konduksi (Watt atau J/s)
- $k$ = Konduktivitas termal bahan ($\\text{W/m}\\cdot\\text{K}$)
- $A$ = Luas penampang batang ($m^2$)
- $\\Delta T$ = Selisih suhu kedua ujung ($K$ atau $^\\circ C$)
- $L$ = Panjang efektif batang logam ($m$)

> **Hubungan Kunci:** Daya konduksi berbanding terbalik dengan panjang lintasan ($H \\propto \\frac{1}{L}$). Semakin jauh jarak titik dari sumber api, semakin lama waktu yang dibutuhkan lilin/mentega untuk meleleh!

---

## 2. Simulasi Interaktif: Batang Logam & Tetesan Lilin

<InteractiveComponent type="HeatConductionRodSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Batang tembaga memiliki luas penampang $2\\text{ cm}^2$ dan panjang $50\\text{ cm}$. Jika selisih suhu kedua ujungnya $100\\text{ K}$ dan $k = 400\\text{ W/m}\\cdot\\text{K}$, hitung laju aliran kalor!

**Penyelesaian:**
$$H = \\frac{k A \\Delta T}{L} = \\frac{400 \\times (2 \\times 10^{-4}) \\times 100}{0{,}5} = \\frac{8}{0{,}5} = \\mathbf{16\\text{ Watt}}$$

---

### 🟡 Level 2: Menengah (Variabel Percobaan - Soal Asli TKA No. 18)
**Soal:** Pada percobaan menyelidiki pengaruh panjang efektif logam terhadap daya konduksinya:
- Sebatang besi diletakkan horizontal dipanaskan di salah satu ujung.
- Potongan kecil lilin ditempelkan tiap jarak $5\\text{ cm}$.
- Waktu meleleh lilin dicatat dengan stopwatch.
Tentukan variabel kontrol, variabel bebas, dan variabel terikat percobaan ini!

**Pembahasan TKA:**
- **Variabel Kontrol** (dijaga tetap): Jenis logam yang digunakan (sama-sama besi) dan luas penampangnya.
- **Variabel Bebas** (yang sengaja diubah/divariasikan): Jarak lilin dari sumber pemanas (panjang lintasan logam).
- **Variabel Terikat** (yang diamati/diukur sebagai akibat): Waktu melelehnya lilin pada setiap titik.

**Jawaban TKA:** C. variabel kontrol = jenis logam, variabel bebas = jarak lilin dari sumber, variabel terikat = waktu melelehnya lilin.

---

### 🔴 Level 3: Level Asli TKA (HOTS Evaluasi Prosedur - Soal No. 19)
**Soal:** Dari rancangan percobaan konduksi kalor lilin di atas, apa salah satu kelemahan metodologi yang akan menyebabkan data tidak akurat?
- A. Jenis lilin dan ukuran lilin tidak dipastikan sama sehingga tidak homogen.
- B. Jenis logam tidak diganti-ganti.
- C. Penempatan sumber panas di ujung menyebabkan kalor tidak merata.
- D. Pengukuran waktu menggunakan stopwatch sulit dilakukan.
- E. Panjang keseluruhan logam tidak diukur.

**Pembahasan TKA:**
Waktu meleleh lilin sangat bergantung pada kalor yang dibutuhkan untuk melelehkannya: $Q = m \\cdot L_{\\text{lebur}}$. Jika potongan lilin/mentega tidak seragam massa dan ukurannya (tidak homogen), lilin yang lebih kecil akan meleleh lebih cepat meskipun laju kalornya sama.
**Jawaban TKA:** A. Jenis lilin dan ukuran lilin tidak dipastikan sama sehingga tidak homogen.
`
    },
    {
        title: "Pemanasan Global & Kesetimbangan Radiasi Bumi",
        slug: "efek-rumah-kaca-anomali",
        order: 2,
        skillSlug: "pemanasan-global",
        contentMdx: `
# 🌍 Pemanasan Global, Gas Rumah Kaca & Energi Termal

Bumi menerima radiasi gelombang pendek dari matahari dan memancarkannya kembali ke luar angkasa dalam bentuk radiasi inframerah gelombang panjang. Ketidakseimbangan fluks energi ini memicu pemanasan global.

---

## 1. Mekanisme Efek Rumah Kaca & Deforestasi

1. **Radiasi Masuk vs Keluar:** Gas rumah kaca ($CO_2, CH_4, N_2O$) menyerap radiasi inframerah yang dipancarkan permukaan bumi dan meradiasikannya kembali ke bumi, menahan panas di atmosfer.
2. **Kenaikan Suhu & Energi Kinetik Gas:** Suhu mutlak gas berbanding lurus dengan energi kinetik rata-rata partikel gas:
   $$\\bar{E}_k = \\frac{3}{2} k_B T$$
   Kenaikan suhu atmosfer menandakan peningkatan langsung energi kinetik rata-rata molekul udara.
3. **Peran Ruang Terbuka Hijau (RTH):** Tumbuhan mendinginkan lingkungan melalui proses **transpirasi dan evaporasi**. Penurunan 40% area hijau menghilangkan mekanisme pendinginan alami permukaan kota.

---

## 2. Simulasi Interaktif: Keseimbangan Energi & Tren Suhu Kota

<InteractiveComponent type="GlobalWarmingEnergySim" />

---

## 3. Contoh Soal Level Asli TKA (HOTS Multi-Pilihan - Soal No. 22)
**Soal:** Grafik menunjukkan tren kenaikan suhu rata-rata tahunan Kota X dari $27{,}0^\\circ\\text{C}$ (2005) ke $29{,}6^\\circ\\text{C}$ (2025). Pada periode yang sama, terjadi peningkatan drastis kendaraan bermotor, AC, dan penurunan 40% ruang hijau. Pilihlah semua pernyataan yang benar! (Jawaban benar lebih dari satu).

**Evaluasi Pernyataan TKA:**
- $\\checkmark$ **Grafik menunjukkan tren kenaikan suhu yang dapat disebabkan oleh peningkatan energi termal di lingkungan akibat aktivitas manusia.** (BENAR).
- $\\times$ *Emisi kendaraan dan AC menyebabkan peningkatan kalor laten di udara yang mengurangi efek rumah kaca.* (SALAH, emisi justru meningkatkan gas rumah kaca dan kalor sensibel lingkungan).
- $\\checkmark$ **Penurunan area hijau menyebabkan berkurangnya pendinginan alami akibat proses transpirasi dan evaporasi.** (BENAR).
- $\\checkmark$ **Kenaikan suhu udara dalam jangka panjang menunjukkan adanya ketidakseimbangan antara energi yang diserap dan dipancarkan kembali oleh permukaan bumi.** (BENAR, radiasi masuk > radiasi keluar).
- $\\checkmark$ **Peningkatan suhu udara berarti peningkatan energi kinetik rata-rata partikel udara di atmosfer.** (BENAR, $\\bar{E}_k = \\frac{3}{2} k_B T$).

**Pilihan Benar:** Pernyataan 1, 3, 4, dan 5.
`
    },
    {
        title: "Teori Kinetik Gas Ideal & Pemampatan Silinder",
        slug: "persamaan-gas-ideal",
        order: 3,
        skillSlug: "gas-ideal",
        contentMdx: `
# 🎈 Teori Kinetik Gas Ideal

Gas ideal adalah model teoretis di mana partikel gas dianggap berupa partikel titik bermassa yang tidak saling berinteraksi kecuali saat tumbukan lenting sempurna.

---

## 1. Persamaan Keadaan Gas Ideal

$$\\boxed{P \\cdot V = n \\cdot R \\cdot T = N \\cdot k_B \\cdot T}$$
Untuk massa gas tetap dalam ruang tertutup:
$$\\boxed{\\frac{P_1 \\cdot V_1}{T_1} = \\frac{P_2 \\cdot V_2}{T_2}}$$
Dimana suhu **HARUS** dinyatakan dalam satuan mutlak **Kelvin (K)**!

---

## 2. Simulasi Interaktif: Tabung Gas Piston Silinder

<InteractiveComponent type="GasIdealCylinderSim" />

---

## 3. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar
**Soal:** Gas pada volume $4\\text{ L}$ dan suhu konstan ditekan sehingga volumenya menjadi $2\\text{ L}$. Jika tekanan awal $1\\text{ atm}$, berapakah tekanan akhir?

**Penyelesaian:**
$$P_1 V_1 = P_2 V_2 \\implies 1 \\times 4 = P_2 \\times 2 \\implies P_2 = \\mathbf{2\\text{ atm}}$$

---

### 🟡 Level 2: Menengah (Kecepatan Efektif Partikel)
**Soal:** Jika suhu gas ideal dinaikkan menjadi 4 kali semula, berapakah perbandingan kelajuan efektif partikel $v_{\\text{rms}}$ gas?

**Penyelesaian:**
$$v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} \\propto \\sqrt{T} \\implies \\frac{v_2}{v_1} = \\sqrt{4} = \\mathbf{2\\text{ kali semula}}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Pemampatan Gas Ideal - Soal No. 20)
**Soal:** Gas ideal di dalam tabung memiliki volume awal $V_1 = 2\\text{ liter}$, suhu awal $T_1 = 300\\text{ K}$, dan tekanan awal $P_1 = 1\\text{ atmosfer}$. Jika gas dimampatkan hingga volumenya menjadi $V_2 = 1\\text{ liter}$ dengan suhu dinaikkan menjadi $2\\text{ kali semula}$ ($T_2 = 2 T_1 = 600\\text{ K}$), maka tekanan akhirnya $P_2$ adalah...

**Langkah Penurunan Solusi:**
Gunakan hukum Boyle-Gay Lussac:
$$\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$$
$$\\frac{(1\\text{ atm})(2\\text{ liter})}{T_1} = \\frac{P_2 (1\\text{ liter})}{2 T_1}$$
Coret $T_1$ pada kedua sisi:
$$2 = \\frac{P_2}{2} \\implies P_2 = 2 \\times 2 = \\mathbf{4\\text{ atmosfer}}$$

**Jawaban TKA:** D. $4\\text{ atmosfer}$.
`
    },
    {
        title: "Termodinamika & Efisiensi Siklus Carnot",
        slug: "efisiensi-mesin-carnot",
        order: 4,
        skillSlug: "termodinamika-carnot",
        contentMdx: `
# ⚙️ Hukum Termodinamika & Efisiensi Siklus Mesin

Mesin kalor menyerap energi panas dari reservoir suhu tinggi ($T_1$), mengubah sebagian menjadi usaha mekanik ($W$), dan membuang sisa kalor ($Q_2$) ke reservoir suhu rendah ($T_2$).

---

## 1. Efisiensi Mesin Kalor

Berdasarkan Hukum Kekekalan Energi:
$$W = Q_1 - Q_2$$
Efisiensi termal mesin kalor:
$$\\eta = \\frac{W}{Q_1} = \\frac{Q_1 - Q_2}{Q_1} = 1 - \\frac{Q_2}{Q_1}$$
Jika efisiensi mesin ditingkatkan dengan usaha $W$ yang konstan:
$$Q_1 = \\frac{W}{\\eta}$$

---

## 2. Simulasi Interaktif: Diagram P-V & Aliran Kalor Mesin Carnot

<InteractiveComponent type="CarnotEngineCycleSim" />

---

## 3. Contoh Soal Level Asli TKA (HOTS Penghematan Kalor Mesin - Soal No. 21)
**Soal:** Sebuah mesin kalor menyerap kalor dari sumber panas, menghasilkan usaha $W = 600\\text{ J}$ tiap siklus dengan efisiensi awal $\\eta_1 = 30\\% = 0{,}3$. Setelah beberapa waktu, mesin diperbaiki sehingga efisiensinya naik menjadi $\\eta_2 = 50\\% = 0{,}5$. Agar mesin tetap menghasilkan usaha yang sama ($W = 600\\text{ J}$), bagaimana kebutuhan kalor masuk ($Q_1$) setelah diperbaiki?

**Langkah Penurunan Solusi:**
1. **Kalor masuk awal ($Q_{1a}$):**
   $$Q_{1a} = \\frac{W}{\\eta_1} = \\frac{600\\text{ J}}{0{,}3} = 2{.}000\\text{ Joule}$$
2. **Kalor masuk setelah diperbaiki ($Q_{1b}$):**
   $$Q_{1b} = \\frac{W}{\\eta_2} = \\frac{600\\text{ J}}{0{,}5} = 1{.}200\\text{ Joule}$$
3. **Penghematan kalor masuk:**
   $$\\Delta Q_1 = Q_{1a} - Q_{1b} = 2{.}000 - 1{.}200 = 800\\text{ Joule}$$
4. **Persentase penurunan kalor masuk:**
   $$\\% = \\frac{\\Delta Q_1}{Q_{1a}} \\times 100\\% = \\frac{800}{2{.}000} \\times 100\\% = \\mathbf{40\\% \\text{ lebih sedikit}}$$

**Jawaban TKA:** B. Membutuhkan kalor 40% lebih sedikit.
`
    }
];
