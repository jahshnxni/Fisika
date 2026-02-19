import { LessonData } from './units';

export const LESSONS_SUHU_KALOR: LessonData[] = [
    {
        title: "Suhu dan Termometer: Mengukur Panas",
        slug: "suhu-dan-termometer",
        order: 1,
        skillSlug: "suhu-termometer",
        contentMdx: `
# 🌡️ Suhu dan Termometer

Saat kamu demam, dokter mengukur suhumu dengan termometer. Tapi apa sebenarnya **suhu**? Dan mengapa ada Celsius, Fahrenheit, dan Kelvin?

---

## 1. Pengertian Suhu

**Suhu** adalah besaran yang menyatakan **tingkat energi kinetik rata-rata** partikel penyusun suatu benda.

> Benda panas = partikelnya bergerak **cepat**
> Benda dingin = partikelnya bergerak **lambat**

---

## 2. Skala Suhu

| Skala | Titik Beku Air | Titik Didih Air | Digunakan di |
|-------|---------------|-----------------|-------------|
| **Celsius (°C)** | 0°C | 100°C | International (sains) |
| **Fahrenheit (°F)** | 32°F | 212°F | Amerika Serikat |
| **Kelvin (K)** | 273 K | 373 K | Fisika (suhu mutlak) |
| **Reamur (°R)** | 0°R | 80°R | Jarang dipakai |

### Rumus Konversi:

$$\\boxed{\\frac{°C}{5} = \\frac{°F - 32}{9} = \\frac{K - 273}{5} = \\frac{°R}{4}}$$

Konversi spesifik:
$$°F = \\frac{9}{5} \\cdot °C + 32$$
$$K = °C + 273,15$$
$$°R = \\frac{4}{5} \\cdot °C$$

> **0 Kelvin = Nol Mutlak** = suhu terendah yang mungkin, di mana partikel benar-benar berhenti bergerak.

---

## 3. Simulasi Konversi Suhu

Geser slider dan lihat konversi real-time antar skala suhu!

<InteractiveComponent type="ThermometerSim" />

---

## 4. Contoh Soal

### 🌱 Level EASY
**Soal:** Suhu tubuh normal manusia = 37°C. Berapa dalam Fahrenheit dan Kelvin?

$$°F = \\frac{9}{5} \\times 37 + 32 = 66,6 + 32 = 98,6°F$$
$$K = 37 + 273 = 310 \\text{ K}$$

---

### ⚔️ Level MEDIUM
**Soal:** Pada suhu berapa skala Celsius dan Fahrenheit menunjukkan **angka yang sama**?

$$°C = °F = x$$
$$x = \\frac{9}{5}x + 32$$
$$5x = 9x + 160$$
$$-4x = 160$$
$$x = -40$$

Jadi pada **-40°**, kedua skala menunjukkan angka yang sama!

---

### 🔥 Level HOTS
**Soal:** Sebuah termometer tak bernama X memiliki skala 20°X pada titik beku air dan 150°X pada titik didih air. Jika suatu benda menunjukkan 85°X, berapa suhunya dalam °C?

$$\\frac{°C - 0}{100 - 0} = \\frac{°X - 20}{150 - 20}$$
$$\\frac{°C}{100} = \\frac{85 - 20}{130} = \\frac{65}{130} = 0,5$$
$$°C = 50°C$$
    `
    },
    {
        title: "Pemuaian: Benda Membesar karena Panas",
        slug: "pemuaian",
        order: 2,
        skillSlug: "pemuaian",
        contentMdx: `
# 🔥 Pemuaian Termal

Mengapa rel kereta api diberi celah? Mengapa jembatan punya sambungan pemuaian? Karena hampir semua benda **bertambah besar** saat dipanaskan!

---

## 1. Pengertian Pemuaian

**Pemuaian** adalah pertambahan dimensi (panjang, luas, volume) benda akibat kenaikan suhu.

Penyebab: saat suhu naik, partikel bergetar lebih kuat → jarak antar partikel bertambah → benda mengembang.

---

## 2. Pemuaian Panjang (Zat Padat)

$$\\boxed{\\Delta L = L_0 \\cdot \\alpha \\cdot \\Delta T}$$
$$L = L_0 (1 + \\alpha \\Delta T)$$

| Simbol | Keterangan | Satuan |
|--------|------------|--------|
| $\\Delta L$ | Pertambahan panjang | m |
| $L_0$ | Panjang awal | m |
| $\\alpha$ | Koefisien muai panjang | /°C |
| $\\Delta T$ | Perubahan suhu | °C |

**Koefisien muai panjang beberapa logam:**
| Material | $\\alpha$ (/°C) |
|----------|---------------|
| Aluminium | $24 \\times 10^{-6}$ |
| Baja | $12 \\times 10^{-6}$ |
| Tembaga | $17 \\times 10^{-6}$ |
| Kaca | $9 \\times 10^{-6}$ |

## 3. Pemuaian Luas ($\\beta = 2\\alpha$)

$$\\Delta A = A_0 \\cdot \\beta \\cdot \\Delta T$$

## 4. Pemuaian Volume ($\\gamma = 3\\alpha$)

$$\\Delta V = V_0 \\cdot \\gamma \\cdot \\Delta T$$

---

## 5. Simulasi Pemuaian

Panaskan batang logam dan lihat perubahan panjangnya secara real-time!

<InteractiveComponent type="ExpansionSim" />

---

## 6. Contoh Soal

### 🌱 Level EASY
**Soal:** Batang baja panjang 2 m dipanaskan dari 20°C ke 120°C. Berapa pertambahan panjangnya? ($\\alpha = 12 \\times 10^{-6}$ /°C)

$$\\Delta L = 2 \\times 12 \\times 10^{-6} \\times 100 = 2,4 \\times 10^{-3} \\text{ m} = 2,4 \\text{ mm}$$

---

### ⚔️ Level MEDIUM
**Soal:** Cincin baja (diameter 5 cm) harus dipasang ke poros dengan diameter 5,01 cm. Berapa kenaikan suhu yang diperlukan?

$$\\Delta d = 0,01 \\text{ cm}$$
$$\\Delta T = \\frac{\\Delta d}{d_0 \\cdot \\alpha} = \\frac{0,01}{5 \\times 12 \\times 10^{-6}} = \\frac{0,01}{6 \\times 10^{-5}} \\approx 167°C$$

---

### 🔥 Level HOTS
**Soal:** Sebuah jam bandul menggunakan batang kuningan ($\\alpha = 19 \\times 10^{-6}$/°C). Pada 20°C jam tepat. Berapa detik jam ini terlambat per hari pada suhu 35°C?

**Jawab:** Periode bandul $T = 2\\pi\\sqrt{L/g}$. Jika $L$ bertambah, $T$ juga bertambah → jam melambat.
$$\\frac{\\Delta T}{T} \\approx \\frac{1}{2}\\alpha \\Delta T_{suhu} = \\frac{1}{2}(19 \\times 10^{-6})(15) = 1,425 \\times 10^{-4}$$

Dalam sehari (86.400 detik):
$$\\Delta t = 86.400 \\times 1,425 \\times 10^{-4} \\approx 12,3 \\text{ detik}$$
    `
    },
    {
        title: "Kalor, Asas Black, dan Perpindahan Kalor",
        slug: "kalor-asas-black",
        order: 3,
        skillSlug: "kalor-asas-black",
        contentMdx: `
# 🔥 Kalor dan Perpindahan Kalor

## 1. Pengertian Kalor

**Kalor** ($Q$) adalah energi yang berpindah karena perbedaan suhu.

$$\\boxed{Q = m \\cdot c \\cdot \\Delta T}$$

| Simbol | Keterangan | Satuan |
|--------|------------|--------|
| $Q$ | Kalor | Joule (J) atau kalori (kal) |
| $m$ | Massa | kg |
| $c$ | Kalor jenis | J/(kg·°C) |
| $\\Delta T$ | Perubahan suhu | °C |

> **1 kalori = 4,186 Joule** (Hukum Joule)

---

## 2. Asas Black (Kekekalan Energi Kalor)

> *"Kalor yang dilepas benda panas = Kalor yang diserap benda dingin"*

$$\\boxed{Q_{lepas} = Q_{serap}}$$
$$m_1 \\cdot c_1 \\cdot (T_1 - T_c) = m_2 \\cdot c_2 \\cdot (T_c - T_2)$$

Dimana $T_c$ = suhu campuran akhir (kesetimbangan termal).

---

## 3. Perpindahan Kalor

Ada 3 cara kalor berpindah:

| Cara | Mekanisme | Contoh |
|------|-----------|--------|
| **Konduksi** | Partikel bergetar → energi diteruskan | Sendok logam panas saat di panci |
| **Konveksi** | Fluida panas naik, dingin turun | Angin darat dan laut |
| **Radiasi** | Gelombang elektromagnetik | Panas matahari sampai ke Bumi |

### Laju Konduksi:
$$\\frac{Q}{t} = \\frac{k \\cdot A \\cdot \\Delta T}{L}$$

---

## 4. Simulasi Perpindahan Kalor

Visualisasikan konduksi, konveksi, dan radiasi!

<InteractiveComponent type="HeatTransferSim" />

---

## 5. Contoh Soal

### 🌱 Level EASY
**Soal:** 500 gram air ($c = 4200$ J/kg·°C) dipanaskan dari 25°C ke 75°C. Berapa kalor yang diserap?

$$Q = 0,5 \\times 4200 \\times (75 - 25) = 0,5 \\times 4200 \\times 50 = 105.000 \\text{ J} = 105 \\text{ kJ}$$

---

### ⚔️ Level MEDIUM
**Soal:** 200 gram air bersuhu 80°C dicampur dengan 300 gram air bersuhu 20°C. Berapa suhu campurannya?

$$m_1 c(T_1 - T_c) = m_2 c(T_c - T_2)$$
$$200(80 - T_c) = 300(T_c - 20)$$
$$16.000 - 200T_c = 300T_c - 6.000$$
$$22.000 = 500T_c$$
$$T_c = 44°C$$

---

### 🔥 Level HOTS
**Soal:** Bola besi 100 gram bersuhu 200°C dimasukkan ke 300 gram air bersuhu 20°C di wadah tembaga 50 gram bersuhu 20°C. Hitung suhu akhir! ($c_{besi}=450$, $c_{air}=4200$, $c_{tembaga}=390$ J/kg·°C)

$$Q_{lepas} = Q_{serap}$$
$$m_{Fe}c_{Fe}(200-T) = m_{air}c_{air}(T-20) + m_{Cu}c_{Cu}(T-20)$$
$$0,1(450)(200-T) = 0,3(4200)(T-20) + 0,05(390)(T-20)$$
$$45(200-T) = 1260(T-20) + 19,5(T-20)$$
$$9000 - 45T = 1279,5T - 25590$$
$$34590 = 1324,5T$$
$$T \\approx 26,1°C$$
    `
    },
];
