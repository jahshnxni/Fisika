import { LessonData } from './units';

export const LESSONS_GELOMBANG: LessonData[] = [
    {
        title: "Gelombang Mekanik: Getaran yang Merambat",
        slug: "gelombang-mekanik",
        order: 1,
        skillSlug: "gelombang-mekanik",
        contentMdx: `
# 🌊 Gelombang Mekanik

Saat kamu melempar batu ke kolam, terbentuklah lingkaran-lingkaran riak di permukaan air. Menariknya, airnya **tidak berpindah** — yang berpindah hanya **gangguannya** (energinya). Inilah **gelombang**.

---

## 1. Pengertian Gelombang

**Gelombang** adalah getaran yang merambat melalui suatu medium, memindahkan **energi** tanpa memindahkan **materi**.

---

## 2. Jenis Gelombang Berdasarkan Arah Getar

### Gelombang Transversal
Arah getar **tegak lurus** arah rambat.

*Contoh:* Gelombang tali, gelombang permukaan air, gelombang cahaya.

### Gelombang Longitudinal
Arah getar **sejajar** arah rambat, membentuk **rapatan** dan **renggangan**.

*Contoh:* Gelombang bunyi, gelombang pada pegas (slinky).

---

## 3. Besaran-Besaran Gelombang

| Simbol | Nama | Satuan | Definisi |
|--------|------|--------|----------|
| $A$ | Amplitudo | m | Simpangan maksimum |
| $\\lambda$ | Panjang gelombang | m | Jarak satu gelombang penuh |
| $T$ | Periode | s | Waktu satu gelombang penuh |
| $f$ | Frekuensi | Hz | Jumlah gelombang per detik |
| $v$ | Cepat rambat | m/s | Kecepatan perambatan |

**Hubungan penting:**
$$f = \\frac{1}{T}$$
$$\\boxed{v = \\lambda \\cdot f = \\frac{\\lambda}{T}}$$

---

## 4. Persamaan Gelombang

Simpangan gelombang berjalan di titik $x$ pada waktu $t$:

$$\\boxed{y(x,t) = A \\sin\\left(2\\pi\\left(\\frac{t}{T} - \\frac{x}{\\lambda}\\right)\\right)}$$

Atau dalam bentuk bilangan gelombang ($k = 2\\pi/\\lambda$) dan frekuensi sudut ($\\omega = 2\\pi f$):

$$y(x,t) = A \\sin(\\omega t - kx)$$

---

## 5. Simulasi Gelombang

Atur amplitudo dan frekuensi, lalu amati gelombang transversal dan longitudinal!

<InteractiveComponent type="WaveSim" />

---

## 6. Contoh Soal

### 🌱 Level EASY
**Soal:** Gelombang pada tali memiliki frekuensi 5 Hz dan panjang gelombang 0,4 m. Berapa cepat rambat gelombang?

$$v = \\lambda \\cdot f = 0,4 \\times 5 = 2 \\text{ m/s}$$

---

### ⚔️ Level MEDIUM
**Soal:** Gelombang air laut memiliki jarak antar puncak 6 m. Seorang pengamat menghitung 10 puncak melewati tiang dalam 20 detik. Hitung cepat rambat gelombang!

$$\\lambda = 6 \\text{ m}, \\quad f = \\frac{10}{20} = 0,5 \\text{ Hz}$$
$$v = \\lambda f = 6 \\times 0,5 = 3 \\text{ m/s}$$

---

### 🔥 Level HOTS
**Soal:** Persamaan gelombang: $y = 0,02 \\sin(100\\pi t - 2\\pi x)$ (SI). Tentukan amplitudo, frekuensi, panjang gelombang, dan cepat rambat!

**Jawab:** Bandingkan dengan $y = A \\sin(\\omega t - kx)$:
- $A = 0,02$ m
- $\\omega = 100\\pi$ → $f = \\frac{\\omega}{2\\pi} = 50$ Hz
- $k = 2\\pi$ → $\\lambda = \\frac{2\\pi}{k} = 1$ m
- $v = \\lambda f = 1 \\times 50 = 50$ m/s
    `
    },
    {
        title: "Gelombang Bunyi: Suara yang Kita Dengar",
        slug: "gelombang-bunyi",
        order: 2,
        skillSlug: "gelombang-bunyi",
        contentMdx: `
# 🔊 Gelombang Bunyi

Mengapa petir terlihat lebih dulu sebelum terdengar? Mengapa suaramu terdengar aneh saat menghirup helium? Jawabannya ada di fisika gelombang bunyi!

---

## 1. Sifat Gelombang Bunyi

Bunyi adalah gelombang **longitudinal** yang membutuhkan **medium** untuk merambat.

| Properti | Keterangan |
|----------|------------|
| **Jenis** | Longitudinal (rapatan & renggangan) |
| **Medium** | Gas, cairan, padatan (TIDAK bisa di ruang hampa!) |
| **Kecepatan** | Udara ≈ 343 m/s, Air ≈ 1.500 m/s, Baja ≈ 5.100 m/s |
| **Frekuensi dengar** | 20 Hz – 20.000 Hz (manusia) |

### Klasifikasi Bunyi
- **Infrasonik**: $f < 20$ Hz (gajah, gempa)
- **Audiosonik**: $20 \\leq f \\leq 20.000$ Hz (manusia)
- **Ultrasonik**: $f > 20.000$ Hz (kelelawar, USG)

---

## 2. Cepat Rambat Bunyi

$$v = \\lambda \\cdot f$$

Kecepatan bunyi di udara bergantung pada **suhu**:
$$v = 331 + 0,6T$$
dimana $T$ dalam °C.

> Pada suhu 25°C: $v = 331 + 0,6(25) = 346$ m/s

---

## 3. Gelombang Stasioner (Berdiri)

Saat gelombang bunyi dipantulkan dalam ruang tertutup (pipa organ, seruling), terjadi **superposisi** yang membentuk gelombang stasioner.

### Pipa Tertutup (satu ujung tertutup):
Hanya harmonik ganjil yang muncul:
$$f_n = \\frac{(2n-1) \\cdot v}{4L}, \\quad n = 1, 2, 3, ...$$

### Pipa Terbuka (kedua ujung terbuka):
Semua harmonik muncul:
$$f_n = \\frac{n \\cdot v}{2L}, \\quad n = 1, 2, 3, ...$$

---

## 4. Simulasi Gelombang Berdiri

Lihat pola gelombang berdiri pada pipa dan atur harmoniknya!

<InteractiveComponent type="SoundSim" />

---

## 5. Efek Doppler

Saat sumber bunyi bergerak relatif terhadap pendengar, frekuensi yang terdengar berubah:

$$\\boxed{f' = f \\cdot \\frac{v \\pm v_p}{v \\mp v_s}}$$

Aturan tanda: mendekati (+/-), menjauhi (-/+).

---

## 6. Contoh Soal

### 🌱 Level EASY
**Soal:** Pipa organ terbuka panjang 0,5 m. Berapa frekuensi nada dasar? ($v = 340$ m/s)

$$f_1 = \\frac{v}{2L} = \\frac{340}{2 \\times 0,5} = 340 \\text{ Hz}$$

---

### ⚔️ Level MEDIUM
**Soal:** Mobil ambulans ($f = 800$ Hz) mendekati kamu dengan kecepatan 20 m/s. Berapa frekuensi yang kamu dengar? ($v = 340$ m/s)

$$f' = 800 \\times \\frac{340 + 0}{340 - 20} = 800 \\times \\frac{340}{320} = 850 \\text{ Hz}$$

---

### 🔥 Level HOTS
**Soal:** Seruling ($L = 30$ cm, terbuka) dimainkan bersamaan dengan pipa organ ($L = 40$ cm, tertutup satu ujung). Pada harmonik ke berapa mereka beresonansi (frekuensi sama)?

**Jawab:**
- Seruling: $f_n = \\frac{n \\cdot v}{2 \\times 0,3} = \\frac{5nv}{3}$
- Pipa organ: $f_m = \\frac{(2m-1) \\cdot v}{4 \\times 0,4} = \\frac{(2m-1)v}{1,6}$

Samakan: $\\frac{5n}{3} = \\frac{(2m-1)}{1,6}$
$8n = 3(2m-1)$ → Solusi terkecil: $n = 3, m = 5$ (harmonik ke-3 seruling = harmonik ke-9 pipa organ)
    `
    },
    {
        title: "Gelombang Cahaya dan Interferensi",
        slug: "interferensi-cahaya",
        order: 3,
        skillSlug: "gelombang-cahaya",
        contentMdx: `
# 🌈 Gelombang Cahaya & Interferensi

Thomas Young membuktikan cahaya adalah gelombang melalui eksperimen celah ganda yang legendaris pada tahun 1801.

---

## 1. Sifat Gelombang Cahaya

Cahaya adalah gelombang **elektromagnetik transversal** yang:
- **Tidak membutuhkan medium** (bisa merambat di ruang hampa)
- Kecepatan di vakum: $c = 3 \\times 10^8$ m/s
- Panjang gelombang tampak: $400-700$ nm

| Warna | $\\lambda$ (nm) |
|-------|----------------|
| Merah | 620–750 |
| Jingga | 590–620 |
| Kuning | 570–590 |
| Hijau | 495–570 |
| Biru | 450–495 |
| Ungu | 380–450 |

---

## 2. Interferensi Celah Ganda (Young)

Saat cahaya melewati dua celah sempit, terjadi **interferensi**:

### Interferensi Konstruktif (terang):
$$d \\sin\\theta = n\\lambda, \\quad n = 0, 1, 2, ...$$

### Interferensi Destruktif (gelap):
$$d \\sin\\theta = \\left(n + \\frac{1}{2}\\right)\\lambda$$

**Posisi terang di layar:**
$$\\boxed{y_n = \\frac{n \\lambda L}{d}}$$

Dimana:
- $d$ = jarak antar celah
- $L$ = jarak celah ke layar
- $n$ = orde interferensi

---

## 3. Simulasi Interferensi

Ubah panjang gelombang dan jarak celah, lalu amati pola interferensi!

<InteractiveComponent type="LightSim" />

---

## 4. Contoh Soal

### 🌱 Level EASY
**Soal:** Cahaya $\\lambda = 600$ nm melewati celah ganda dengan $d = 0,1$ mm. Layar berjarak $L = 2$ m. Berapa jarak terang pusat ke terang orde-1?

$$y_1 = \\frac{1 \\times 600 \\times 10^{-9} \\times 2}{0,1 \\times 10^{-3}} = \\frac{1,2 \\times 10^{-6}}{10^{-4}} = 0,012 \\text{ m} = 1,2 \\text{ cm}$$

---

### 🔥 Level HOTS
**Soal:** Dua sumber bunyi koheren berjarak 2 m memancarkan gelombang $f = 850$ Hz. Pada jarak berapa dari garis tengah pendengar akan mendengar keheningan pertama? ($v = 340$ m/s, jarak pendengar 10 m)

**Jawab:** $\\lambda = v/f = 0,4$ m. Gelap pertama: $d \\sin\\theta = \\lambda/2$
$$\\sin\\theta = \\frac{0,2}{2} = 0,1$$
$$y = L \\tan\\theta \\approx L \\sin\\theta = 10 \\times 0,1 = 1 \\text{ m}$$
    `
    },
];
