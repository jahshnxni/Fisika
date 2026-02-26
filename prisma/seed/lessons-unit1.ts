import { LessonData } from './units';

export const LESSONS_FLUIDA_STATIS: LessonData[] = [
    {
        title: "Kedalaman dan Tekanan Hidrostatis",
        slug: "konsep-hidrostatis",
        order: 1,
        skillSlug: "tekanan-hidrostatis",
        contentMdx: `
# 🌊 Misteri Kedalaman Lautan

Pernahkah kamu menonton film tentang kapal selam? Semakin dalam kapal menyelam, lunas kapal akan berbunyi *kredak-kredek* seolah diremas oleh tangan raksasa. Siapa tangan raksasa itu?

Itulah **Tekanan Hidrostatis** ($P_h$) — tekanan yang diakibatkan oleh berat fluida di atas suatu titik.

---

## 1. Pengertian Tekanan

Sebelum membahas tekanan hidrostatis, kita harus paham dulu apa itu **tekanan**.

**Tekanan** adalah gaya yang bekerja tegak lurus per satuan luas bidang.

$$P = \\frac{F}{A}$$

Dimana:
- $P$ = Tekanan (Pa atau $N/m^2$)
- $F$ = Gaya (Newton)
- $A$ = Luas bidang ($m^2$)

> **Analogi:** Mengapa paku bisa menembus kayu? Karena luas ujung paku *sangat kecil*, sehingga tekanan menjadi *sangat besar*, meskipun gayanya kecil!

---

## 2. Konsep Tekanan Hidrostatis

Bayangkan kamu sedang menggendong 1 teman di punggungmu. Berat? Tentu. Sekarang bayangkan kamu berada di dasar tumpukan 10 orang. Pasti jauh lebih berat!

Sama halnya dengan air. Saat kamu menyelam, kamu **"menggendong"** seluruh air yang ada di atasmu. Semakin dalam = semakin banyak air = semakin besar tekanan.

**Tekanan Hidrostatis** adalah tekanan yang disebabkan oleh berat kolom fluida di atas suatu titik dalam fluida tersebut.

---

## 3. Penurunan Rumus (Step-by-Step)

Mari kita turunkan rumusnya dari prinsip dasar:

**Langkah 1:** Tekanan = Gaya per Luas:
$$P = \\frac{F}{A}$$

**Langkah 2:** Gaya yang dimaksud adalah **berat air** di atas titik tersebut:
$$F = W = m \\cdot g$$

**Langkah 3:** Massa diperoleh dari massa jenis dan volume:
$$m = \\rho \\cdot V$$

**Langkah 4:** Volume kolom air berbentuk silinder:
$$V = A \\cdot h$$

**Langkah 5:** Substitusi semua:
$$P = \\frac{F}{A} = \\frac{m \\cdot g}{A} = \\frac{\\rho \\cdot V \\cdot g}{A} = \\frac{\\rho \\cdot A \\cdot h \\cdot g}{A}$$

Luas $A$ saling menghilangkan! Sehingga:

### 👑 Rumus Emas Tekanan Hidrostatis:
$$\\boxed{P_h = \\rho \\cdot g \\cdot h}$$

Dimana:
| Simbol | Nama | Satuan | Keterangan |
|--------|------|--------|------------|
| $P_h$ | Tekanan hidrostatis | Pa ($N/m^2$) | Tekanan akibat kolom fluida |
| $\\rho$ | Massa jenis fluida | $kg/m^3$ | Air = 1000, Raksa = 13600, Minyak ≈ 800 |
| $g$ | Percepatan gravitasi | $m/s^2$ | Bumi ≈ 9,8 atau 10 |
| $h$ | Kedalaman | $m$ | Diukur dari permukaan fluida |

---

## 4. Tekanan Total (Absolut)

Di permukaan bumi, kita sudah menanggung tekanan atmosfer! Jadi tekanan total di kedalaman $h$ adalah:

$$\\boxed{P_{total} = P_0 + \\rho \\cdot g \\cdot h}$$

Dimana $P_0 = 1 \\text{ atm} = 101.325 \\text{ Pa} \\approx 10^5 \\text{ Pa}$

> **Fakta Menarik:** Di kedalaman 10 m di air, tekanan totalnya sudah **2 atm** — dua kali tekanan di permukaan! Itulah mengapa penyelam harus naik perlahan untuk menghindari *decompression sickness*.

---

## 5. Sifat-Sifat Tekanan Hidrostatis

1. **Berbanding lurus dengan kedalaman** — makin dalam, makin besar
2. **Tidak bergantung pada bentuk wadah** (Paradoks Hidrostatis)
3. **Bergantung pada massa jenis fluida** — raksa memberikan tekanan lebih besar dari air pada kedalaman yang sama
4. **Tekanan di titik setinggi sama selalu sama** dalam fluida yang sama

---

## 6. Simulasi Interaktif

Buktikan sendiri! Geser kedalaman dan jenis fluida, lalu lihat bagaimana tekanan berubah:

<InteractiveComponent type="RealisticHydrostatic" />

---

## 7. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi Konsep)
**Soal:** Apabila seorang penyelam turun lebih dalam ke dasar laut, bagian telinganya akan terasa sakit. Berdasarkan konsep tekanan hidrostatis, jelaskan fenomena ini!
**Penyelesaian:**
Menurut rumus $P_h = \\rho \\cdot g \\cdot h$, tekanan berbanding lurus dengan kedalaman ($h$). Semakin dalam menyelam, semakin banyak kolom air di atas penyelam, sehingga tekanan air yang menekan gendang telinga semakin besar, menyebabkan rasa sakit.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Seekor ikan berenang di kedalaman 15 m. Jika $\\rho_{air} = 1000 \\text{ kg/m}^3$ dan $g = 10 \\text{ m/s}^2$, hitung tekanan hidrostatis pada ikan!
**Penyelesaian:**
$$P_h = \\rho \\cdot g \\cdot h = 1000 \\times 10 \\times 15 = 150.000 \\text{ Pa} = 150 \\text{ kPa}$$

---

### 🔥 Level HARD (Konteks Nyata)
**Soal:** Sebuah bendungan air tawar ($\\rho = 1000 \\text{ kg/m}^3$) tingginya 50 m. Tentukan tekanan mutlak di dasar bendungan jika tekanan permukaan $P_0 = 101 \\text{ kPa}$!
**Penyelesaian:**
$$P_h = 1000 \\times 10 \\times 50 = 500.000 \\text{ Pa} = 500 \\text{ kPa}$$
$$P_{total} = P_0 + P_h = 101 + 500 = 601 \\text{ kPa}$$

---

### 💀 Level EXTREME (UTBK)
**Soal:** Pipa U diisi air ($\\rho = 1 \\text{ g/cm}^3$) dan minyak ($\\rho = 0,8 \\text{ g/cm}^3$). Jika selisih tinggi permukaan air pada kedua kaki pipa adalah 4 cm, berapa tinggi kolom minyak?
**Penyelesaian (Keseimbangan Pipa U):**
$$P_1 = P_2$$
$$\\rho_{minyak} \\cdot h_{minyak} = \\rho_{air} \\cdot \\Delta h_{air}$$
$$0,8 \\cdot h_{minyak} = 1 \\cdot 4$$
$$h_{minyak} = \\frac{4}{0,8} = 5 \\text{ cm}$$
    `
    },
    {
        title: "Hukum Pascal: Si Pengganda Gaya",
        slug: "konsep-pascal",
        order: 1,
        skillSlug: "hukum-pascal",
        contentMdx: `
# 🔧 Hukum Pascal: Si Pengganda Gaya

Pernah lihat dongkrak mobil di bengkel? Dengan tenaga tangan saja, mekanik bisa mengangkat mobil 2 ton! Bagaimana mungkin?

Rahasianya ada pada **Hukum Pascal** — salah satu prinsip paling praktis dalam fisika.

---

## 1. Bunyi Hukum Pascal

> *"Tekanan yang diberikan pada fluida dalam ruang tertutup akan diteruskan ke segala arah dengan sama besar."*
> — Blaise Pascal (1623–1662)

Artinya: jika kamu menekan air di satu titik, tekanan itu akan **merata ke seluruh bagian** fluida.

---

## 2. Penurunan Rumus Dongkrak Hidrolik

Bayangkan 2 tabung dengan diameter berbeda yang dihubungkan oleh pipa berisi fluida:

- **Piston kecil:** Luas penampang $A_1$, ditekan dengan gaya $F_1$
- **Piston besar:** Luas penampang $A_2$, menghasilkan gaya $F_2$

Menurut Pascal, tekanan di kedua sisi harus sama:

$$P_1 = P_2$$

$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2}$$

Sehingga gaya di piston besar:

$$\\boxed{F_2 = F_1 \\times \\frac{A_2}{A_1}}$$

> **Kunci:** Jika luas piston besar 10× lipat piston kecil, maka gayanya juga **berlipat 10×**!

---

## 3. Prinsip Kekekalan Energi

Apakah ini melanggar hukum fisika? **TIDAK!**

Perhatikan bahwa usaha (energi) harus tetap sama:

$$W_1 = W_2$$
$$F_1 \\cdot d_1 = F_2 \\cdot d_2$$

Artinya, piston kecil harus ditekan **jarak yang lebih jauh** untuk menghasilkan gaya besar pada piston besar yang bergerak **jarak pendek**.

$$d_2 = d_1 \\times \\frac{A_1}{A_2}$$

> **Analogi:** Seperti tuas/pengungkit — kamu "menukar" jarak dengan gaya!

---

## 4. Simulasi Dongkrak Hidrolik

Coba tekan piston kecil dan lihat bagaimana gaya diteruskan ke piston besar secara real-time!

<InteractiveComponent type="PascalSim" />

---

## 5. Aplikasi dalam Kehidupan

| No | Aplikasi | Cara Kerja |
|----|----------|------------|
| 1 | **Dongkrak Hidrolik** | Pompa tangan → piston besar mengangkat mobil |
| 2 | **Rem Hidrolik** | Pedal rem → tekanan diteruskan ke piringan semua roda |
| 3 | **Kursi Dokter Gigi** | Pompa kaki → kursi naik |
| 4 | **Mesin Press Industri** | Gaya kecil → tekanan super besar untuk mencetak logam |
| 5 | **Excavator** | Joystick kecil → lengan besar bergerak |

---

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep)
**Soal:** Mengapa hukum Pascal hanya berlaku secara efektif untuk cairan (seperti oli dan air) dan tidak digunakan dengan udara pada sistem dongkrak hidrolik?
**Penyelesaian:**
Menurut hukum Pascal, tekanan diteruskan ke segala arah. Namun, cairan bersifat *incompressible* (tidak bisa dimampatkan), sehingga tenaga yang diberikan langsung diteruskan 100%. Udara bersifat kompresibel, sehingga jika ditekan, energi tersebut akan "terserap" untuk memampatkan udara terlebih dahulu, bukan mengangkat beban.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah dongkrak hidrolik memiliki dua piston. Piston kecil memiliki luas $A_1 = 10 \\text{ cm}^2$ dan diberi gaya $F_1 = 50 \\text{ N}$. Jika luas piston besar adalah $A_2 = 250 \\text{ cm}^2$, berapakah gaya angkat $F_2$?
**Penyelesaian:**
$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2}$$
$$F_2 = F_1 \\times \\frac{A_2}{A_1} = 50 \\times \\frac{250}{10} = 1250 \\text{ N}$$

---

### 🔥 Level HARD (Konteks Sehari-hari/Aplikasi)
**Soal:** Di bengkel cuci mobil, pompa lift hidrolik harus mengangkat mobil seberat $15.000 \\text{ N}$. Piston besar memiliki diameter 40 cm, sedangkan kompresor udara menekan piston kecil berdiameter 4 cm. Tentukan tekanan udara minimum dari kompresor! (Gunakan $\\pi=3,14$)
**Penyelesaian:**
Jari-jari $r_2 = 20 \\text{ cm} = 0,2 \\text{ m}$.
Luas piston besar $A_2 = \\pi (0,2)^2 = 0,04\\pi \\text{ m}^2 \\approx 0,1256 \\text{ m}^2$.
Tekanan kompresor sama dengan fluida $P_1 = P_2$:
$$P_2 = \\frac{F_2}{A_2} = \\frac{15.000}{0,1256} \\approx 119.426 \\text{ Pa} \\approx 1,2 \\text{ atm}$$

---

### 💀 Level EXTREME (UTBK)
**Soal:** Sebuah sistem rem hidrolik di mana pedal rem memberikan gaya $F$ pada silinder utama perbandingan tuas lengan pedal 1:4. Silinder utama berjari-jari $r$, dan tekanan diteruskan ke 4 roda yang masing-masing memiliki rem cakram dengan silinder yang berjari-jari $2r$. Hitung rasio total gaya jepit pada keempat roda terhadap gaya injak $F$ pedal pengemudi!
**Penyelesaian:**
1. Tuas mekanis melipatgandakan gaya: Gaya di silinder utama $F_{in} = 4F$.
2. Transmisi gaya hidrolik pada 1 roda ($F_{out}$ vs $F_{in}$):
   $$\\frac{F_{in}}{A_1} = \\frac{F_{out}}{A_2} \\implies F_{out} = F_{in} \\times \\frac{\\pi(2r)^2}{\\pi r^2} = F_{in} \\times 4$$
3. Karena ada 4 roda, gaya total mobil $F_{total} = 4 \\times F_{out}$.
   $$F_{out} = 4F \\times 4 = 16F$$
   $$F_{total} = 4 \\times 16F = 64F$$
Rasio total adalah 64:1! Kaki manusia dikalikan 64 kali lipat.
    `
    },
    {
        title: "Hukum Archimedes: Terapung atau Tenggelam?",
        slug: "konsep-archimedes",
        order: 1,
        skillSlug: "hukum-archimedes",
        contentMdx: `
# ⚓ Hukum Archimedes: Terapung atau Tenggelam?

Legenda mengatakan Archimedes berlari telanjang sambil berteriak **"EUREKA!"** setelah menemukan hukum ini di bak mandi. Apa yang ia temukan?

---

## 1. Bunyi Hukum Archimedes

> *"Setiap benda yang dicelupkan ke dalam fluida akan mendapat gaya ke atas (gaya apung) yang besarnya sama dengan berat fluida yang dipindahkan."*
> — Archimedes (287–212 SM)

$$\\boxed{F_a = \\rho_f \\cdot g \\cdot V_{tercelup}}$$

Dimana:
| Simbol | Keterangan | Satuan |
|--------|------------|--------|
| $F_a$ | Gaya apung (ke atas) | Newton (N) |
| $\\rho_f$ | Massa jenis fluida | $kg/m^3$ |
| $g$ | Percepatan gravitasi | $m/s^2$ |
| $V_{tercelup}$ | Volume benda yang tercelup | $m^3$ |

---

## 2. Penurunan Rumus

Gaya apung muncul karena **perbedaan tekanan** antara bagian bawah dan atas benda:

$$F_a = P_{bawah} \\cdot A - P_{atas} \\cdot A$$
$$F_a = \\rho_f \\cdot g \\cdot h_{bawah} \\cdot A - \\rho_f \\cdot g \\cdot h_{atas} \\cdot A$$
$$F_a = \\rho_f \\cdot g \\cdot (h_{bawah} - h_{atas}) \\cdot A$$
$$F_a = \\rho_f \\cdot g \\cdot \\Delta h \\cdot A$$

Karena $\\Delta h \\cdot A = V_{tercelup}$:

$$F_a = \\rho_f \\cdot g \\cdot V_{tercelup}$$

---

## 3. Tiga Kondisi Benda dalam Fluida

| Kondisi | Syarat | Penjelasan |
|---------|--------|------------|
| **🔝 Terapung** | $\\rho_{benda} < \\rho_{fluida}$ | $F_a > W$ → benda naik sampai sebagian muncul |
| **➡️ Melayang** | $\\rho_{benda} = \\rho_{fluida}$ | $F_a = W$ → benda diam di posisinya |
| **🔽 Tenggelam** | $\\rho_{benda} > \\rho_{fluida}$ | $F_a < W$ → benda jatuh ke dasar |

**Rumus Fraksi Terendam** (untuk benda terapung):
$$\\frac{V_{terendam}}{V_{total}} = \\frac{\\rho_{benda}}{\\rho_{fluida}}$$

---

## 4. Simulasi Interaktif

Ubah massa jenis benda dan fluida, lalu lihat apa yang terjadi — terapung, melayang, atau tenggelam?

<InteractiveComponent type="ArchimedesSim" />

---

## 5. Mengapa Kapal Baja Bisa Terapung?

Baja memiliki $\\rho = 7.800 \\text{ kg/m}^3$ — 7,8× lebih berat dari air! Tapi kapal berbentuk **rongga kosong** (hull).

Volume total kapal sangat besar, sehingga:
$$\\rho_{rata-rata\\ kapal} = \\frac{m_{baja} + m_{udara}}{V_{total}} \\approx 200-300 \\text{ kg/m}^3$$

Ini jauh di bawah $\\rho_{air} = 1000 \\text{ kg/m}^3$, sehingga kapal **terapung**!

---

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Mengapa manusia jauh lebih mudah mengapung saat berenang di Laut Mati dibandingkan di kolam renang air tawar biasa?
**Penyelesaian:**
Berdasarkan Hukum Archimedes, gaya apung ($F_a$) sebanding langsung dengan massa jenis fluida ($\\rho_f$). Kolam renang air tawar memiliki $\\rho_{air} \\approx 1000 \\text{ kg/m}^3$, sedangkan Laut Mati adalah danau hipersalin (sangat asin) dengan $\\rho_{asin} > 1240 \\text{ kg/m}^3$. Karena massa jenis air di Laut Mati jauh lebih besar, gaya angkat yang bekerja pada benda di dalamnya juga berkali-kali lipat lebih kuat, sehingga manusia seakan "didorong" ke permukaan!

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah balok kayu bervolume $0,004 \\text{ m}^3$ dicelupkan ke dalam air ($\\rho = 1000 \\text{ kg/m}^3$). Ternyata 3/4 bagian dari balok tersebut terendam di bawah permukaan air. Berapakah massa balok kayu tersebut? ($g = 10 \\text{ m/s}^2$)
**Penyelesaian:**
Volume terendam $V_{terendam} = \\frac{3}{4} \\times 0,004 = 0,003 \\text{ m}^3$.
Syarat benda terapung: Berat balok = Gaya Apung
$$W = F_a$$
$$m \\cdot g = \\rho_{air} \\cdot g \\cdot V_{terendam}$$
$$m = 1000 \\times 0,003 = 3 \\text{ kg}$$
Massa balok tersebut adalah 3 kg.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Di pelabuhan, sebuah kapal tongkang kosong bermassa $150.000 \\text{ kg}$ akan memuat batu bara. Volume maksimum badan kapal yang aman tercelup air tanpa membuat kapal tenggelam adalah $500 \\text{ m}^3$. Jika massa jenis air sungai (tempat pelabuhan) adalah $1000 \\text{ kg/m}^3$, berapa metrik ton berat batu bara maksimal yang boleh diangkut?
**Penyelesaian:**
Syarat terapung maksimum: 
Berat total (Kapal + Beban) = Gaya Apung Maksimal
$$(m_{kapal} + m_{batubara}) \\cdot g = \\rho_{air} \\cdot g \\cdot V_{tercelup\\_maks}$$
$$150.000 + m_{batubara} = 1000 \\times 500$$
$$150.000 + m_{batubara} = 500.000$$
$$m_{batubara} = 500.000 - 150.000 = 350.000 \\text{ kg}$$
Dalam metrik ton (1 ton = 1000 kg), batas aman kargo adalah **350 ton batu bara**.

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Sebongkah es (massa jenis $0,9 \\text{ g/cm}^3$) terapung dalam bejana air (massa jenis $1 \\text{ g/cm}^3$). Di atas bongkahan es tersebut diletakkan sebuah koin logam seberat $W_{koin} = 0,2 \\text{ N}$. Akibatnya, bongkahan es bergerak turun hingga permukaan atas rata dan sejajar dengan permukaan air. Jika kemudian koin diambil perlahan, es akan naik dan muncul sebanyak 20% bagian dari volumenya di atas permukaan air. Berapa cm³ volume total bongkahan es tersebut? ($g=10 \\text{ m/s}^2$)
**Penyelesaian:**
**Keadaan 1** (Ada Koin, es tenggelam $100\\%$):
$$W_{es} + W_{koin} = F_{a(total)}$$
$$\\rho_{es} \\cdot V_{es} \\cdot g + 0,2 = \\rho_{air} \\cdot V_{es} \\cdot g$$
Konversi satuan: $1 \\text{ g/cm}^3 = 1000 \\text{ kg/m}^3$ dan $0,9 \\text{ g/cm}^3 = 900 \\text{ kg/m}^3$.
$$900 \\cdot V_{es} \\cdot 10 + 0,2 = 1000 \\cdot V_{es} \\cdot 10$$
$$9000 V_{es} + 0,2 = 10000 V_{es}$$
$$0,2 = 1000 V_{es} \\implies V_{es} = \\frac{0,2}{1000} = 2 \\times 10^{-4} \\text{ m}^3$$

Konversikan kembali dari meter kubik ke sentimeter kubik:
$$V_{es} = 2 \\times 10^{-4} \\times 10^6 \\text{ cm}^3 = 200 \\text{ cm}^3$$

Volume total bongkahan es tersebut tepat $200 \\text{ cm}^3$.
    `
    },
];
