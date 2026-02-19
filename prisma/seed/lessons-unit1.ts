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

### 🌱 Level EASY
**Soal:** Seekor ikan berenang di kedalaman 5 m dalam danau. Jika $\\rho_{air} = 1000 \\text{ kg/m}^3$ dan $g = 10 \\text{ m/s}^2$, hitung tekanan hidrostatis pada ikan!

**Penyelesaian:**
$$P_h = \\rho \\cdot g \\cdot h = 1000 \\times 10 \\times 5 = 50.000 \\text{ Pa} = 50 \\text{ kPa}$$

---

### ⚔️ Level MEDIUM
**Soal:** Sebuah kapal selam mengalami tekanan hidrostatis sebesar $P_h = 2.000.000 \\text{ Pa}$. Di kedalaman berapa kapal selam tersebut? ($g = 10 \\text{ m/s}^2$, $\\rho_{air laut} = 1025 \\text{ kg/m}^3$)

**Penyelesaian:**
$$h = \\frac{P_h}{\\rho \\cdot g} = \\frac{2.000.000}{1025 \\times 10} = \\frac{2.000.000}{10.250} \\approx 195,1 \\text{ m}$$

Kapal selam berada di kedalaman **sekitar 195 meter**.

---

### 🔥 Level HOTS
**Soal:** Wadah A (tabung sempit) dan Wadah B (kolam lebar) diisi air setinggi 2 m. Di mana tekanan di dasar lebih besar?

**Jawab:** **SAMA!** Perhatikan rumus $P_h = \\rho g h$. Tidak ada variabel luas ($A$) di dalam rumus! Tekanan hanya bergantung pada kedalaman, bukan volume atau bentuk wadah. Ini disebut **Paradoks Hidrostatis**.

> **Mengapa paradoks?** Karena secara intuitif, kita mengira kolam yang lebih besar pasti punya tekanan lebih besar. Padahal tidak — karena gaya total memang lebih besar di kolam lebar, tetapi luasnya juga lebih besar, sehingga **tekanan** (gaya per luas) tetap sama!
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

### 🌱 Level EASY
**Soal:** Piston kecil memiliki luas $A_1 = 5 \\text{ cm}^2$ dan ditekan dengan gaya $F_1 = 100 \\text{ N}$. Piston besar memiliki luas $A_2 = 50 \\text{ cm}^2$. Berapa gaya yang dihasilkan piston besar?

**Penyelesaian:**
$$F_2 = F_1 \\times \\frac{A_2}{A_1} = 100 \\times \\frac{50}{5} = 100 \\times 10 = 1000 \\text{ N}$$

---

### ⚔️ Level MEDIUM
**Soal:** Sebuah dongkrak harus mengangkat mobil dengan berat $W = 15.000 \\text{ N}$. Diameter piston besar = 30 cm, diameter piston kecil = 3 cm. Berapa gaya minimum yang harus diberikan?

**Penyelesaian:**
$$A_1 = \\pi r_1^2 = \\pi (1,5)^2 = 2,25\\pi \\text{ cm}^2$$
$$A_2 = \\pi r_2^2 = \\pi (15)^2 = 225\\pi \\text{ cm}^2$$
$$\\frac{A_2}{A_1} = \\frac{225\\pi}{2,25\\pi} = 100$$
$$F_1 = \\frac{F_2}{100} = \\frac{15.000}{100} = 150 \\text{ N}$$

---

### 🔥 Level HOTS
**Soal:** Pada sebuah rem hidrolik mobil, gaya pada pedal rem = 50 N. Luas piston master silinder = 4 cm² dan luas piston pada tiap kaliper rem = 16 cm². Jika ada 4 kaliper rem (satu per roda), berapa total gaya pengereman?

**Analisis:**
$$F_{per\\ kaliper} = 50 \\times \\frac{16}{4} = 200 \\text{ N}$$
$$F_{total} = 4 \\times 200 = 800 \\text{ N}$$

> Catatan: Dalam sistem nyata, ada master silinder ganda yang membagi tekanan ke roda depan dan belakang secara independen — ini adalah fitur keselamatan!
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

### 🌱 Level EASY
**Soal:** Sebuah benda bermassa 0,5 kg dicelupkan seluruhnya ke dalam air ($\\rho = 1000 \\text{ kg/m}^3$). Volume benda = $400 \\text{ cm}^3 = 4 \\times 10^{-4} \\text{ m}^3$. Hitung gaya apung!

**Penyelesaian:**
$$F_a = \\rho_f \\cdot g \\cdot V = 1000 \\times 10 \\times 4 \\times 10^{-4} = 4 \\text{ N}$$

Bandingkan dengan berat benda: $W = m \\cdot g = 0,5 \\times 10 = 5 \\text{ N}$

Karena $W > F_a$, benda **tenggelam**.

---

### ⚔️ Level MEDIUM
**Soal:** Balok kayu ($\\rho = 600 \\text{ kg/m}^3$) dimasukkan ke air ($\\rho = 1000 \\text{ kg/m}^3$). Berapa persen volume yang terendam?

**Penyelesaian:**
$$\\frac{V_{terendam}}{V_{total}} = \\frac{\\rho_{benda}}{\\rho_{fluida}} = \\frac{600}{1000} = 0,6 = 60\\%$$

Artinya 60% balok terendam dan 40% muncul di atas permukaan.

---

### 🔥 Level HOTS
**Soal:** Es batu terapung di gelas berisi air. Saat es mencair seluruhnya, apakah permukaan air dalam gelas akan naik, turun, atau tetap?

**Jawab:** **TETAP!**

Saat terapung, es memindahkan air seberat dirinya:
$$m_{es} \\cdot g = \\rho_{air} \\cdot g \\cdot V_{terendam}$$
$$V_{terendam} = \\frac{m_{es}}{\\rho_{air}}$$

Saat es mencair menjadi air, volumenya:
$$V_{cair} = \\frac{m_{es}}{\\rho_{air}}$$

Keduanya **sama persis**, sehingga level air tetap!
    `
    },
];
