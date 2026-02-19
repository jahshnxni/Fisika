import { LessonData } from './units';

export const LESSONS_FLUIDA_DINAMIS: LessonData[] = [
    {
        title: "Debit dan Persamaan Kontinuitas",
        slug: "persamaan-kontinuitas",
        order: 1,
        skillSlug: "debit-kontinuitas",
        contentMdx: `
# 🚰 Debit dan Persamaan Kontinuitas

Pernahkah kamu mencubit ujung selang air? Air langsung menyemprot lebih kencang! Kenapa?

Jawabannya ada di **Persamaan Kontinuitas** — hukum yang menjelaskan mengapa air mengalir lebih cepat di pipa sempit.

---

## 1. Pengertian Debit

**Debit** ($Q$) adalah volume fluida yang mengalir per satuan waktu:

$$\\boxed{Q = \\frac{V}{t} = A \\cdot v}$$

| Simbol | Nama | Satuan |
|--------|------|--------|
| $Q$ | Debit aliran | $m^3/s$ |
| $V$ | Volume fluida | $m^3$ |
| $t$ | Waktu | sekon (s) |
| $A$ | Luas penampang pipa | $m^2$ |
| $v$ | Kecepatan aliran | $m/s$ |

---

## 2. Fluida Ideal

Untuk menurunkan hukum fluida dinamis, kita asumsikan fluida bersifat **ideal**:
1. **Incompressible** — tidak bisa dimampatkan ($\\rho$ konstan)
2. **Non-viscous** — tidak ada gesekan internal
3. **Steady flow** — aliran tunak (kecepatan di setiap titik konstan terhadap waktu)
4. **Irrotational** — tidak berotasi

---

## 3. Penurunan Persamaan Kontinuitas

Bayangkan pipa yang bagian kirinya lebar dan kanan sempit. Dalam waktu $\\Delta t$:

- Di bagian lebar: volume masuk = $A_1 \\cdot v_1 \\cdot \\Delta t$
- Di bagian sempit: volume keluar = $A_2 \\cdot v_2 \\cdot \\Delta t$

Karena fluida incompressible, volume masuk = volume keluar:

$$A_1 \\cdot v_1 \\cdot \\Delta t = A_2 \\cdot v_2 \\cdot \\Delta t$$

$$\\boxed{A_1 \\cdot v_1 = A_2 \\cdot v_2 = Q = \\text{konstan}}$$

> **Kesimpulan:** Di pipa sempit, air mengalir **lebih cepat**. Di pipa lebar, air mengalir **lebih lambat**.

---

## 4. Simulasi Persamaan Kontinuitas

Lihat secara visual bagaimana kecepatan partikel fluida berubah saat pipa menyempit!

<InteractiveComponent type="ContinuitySim" />

---

## 5. Contoh Soal Bertingkat

### 🌱 Level EASY
**Soal:** Air mengalir melalui pipa dengan luas penampang $A_1 = 10 \\text{ cm}^2$ dengan kecepatan $v_1 = 2 \\text{ m/s}$. Jika pipa menyempit menjadi $A_2 = 5 \\text{ cm}^2$, berapa kecepatan air di bagian sempit?

**Penyelesaian:**
$$A_1 v_1 = A_2 v_2$$
$$v_2 = \\frac{A_1 v_1}{A_2} = \\frac{10 \\times 2}{5} = 4 \\text{ m/s}$$

---

### ⚔️ Level MEDIUM
**Soal:** Pipa berdiameter 6 cm disambung ke pipa berdiameter 2 cm. Jika debit air = $600 \\text{ cm}^3/\\text{s}$, hitung kecepatan air di masing-masing pipa!

**Penyelesaian:**
$$A_1 = \\pi (3)^2 = 9\\pi \\text{ cm}^2 \\approx 28,27 \\text{ cm}^2$$
$$A_2 = \\pi (1)^2 = \\pi \\text{ cm}^2 \\approx 3,14 \\text{ cm}^2$$
$$v_1 = \\frac{Q}{A_1} = \\frac{600}{28,27} \\approx 21,2 \\text{ cm/s}$$
$$v_2 = \\frac{Q}{A_2} = \\frac{600}{3,14} \\approx 191 \\text{ cm/s}$$

---

### 🔥 Level HOTS
**Soal:** Air dari keran dengan diameter 1,2 cm jatuh vertikal. Pada jarak 10 cm di bawah keran, diameter aliran menyempit menjadi 0,8 cm. Mengapa air "mengerucut" saat jatuh?

**Jawab:** Saat air jatuh, gravitasi mempercepatnya ($v$ naik). Menurut persamaan kontinuitas $A_1 v_1 = A_2 v_2$, jika $v$ naik maka $A$ harus turun — sehingga aliran air menyempit!
    `
    },
    {
        title: "Hukum Bernoulli: Tekanan vs Kecepatan",
        slug: "persamaan-bernoulli",
        order: 2,
        skillSlug: "hukum-bernoulli",
        contentMdx: `
# ✈️ Hukum Bernoulli: Mengapa Pesawat Bisa Terbang?

Hukum Bernoulli adalah salah satu persamaan paling penting dalam fisika fluida. Dengan hukum ini, kita bisa menjelaskan mengapa pesawat terbang, mengapa atap rumah bisa terbang saat badai, dan mengapa semprotan parfum bekerja!

---

## 1. Bunyi Hukum Bernoulli

> *"Pada fluida yang mengalir, di mana kecepatannya besar, tekanannya kecil — dan sebaliknya."*
> — Daniel Bernoulli (1700–1782)

---

## 2. Penurunan Persamaan Bernoulli

Dengan menggunakan **hukum kekekalan energi** pada fluida yang mengalir:

$$W_{total} = \\Delta E_k + \\Delta E_p$$

Setelah penurunan lengkap (work-energy theorem):

$$\\boxed{P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2}$$

Atau dalam bentuk ringkas:

$$\\boxed{P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{konstan}}$$

| Suku | Nama | Keterangan |
|------|------|------------|
| $P$ | Tekanan statis | Tekanan fluida saat diam |
| $\\frac{1}{2}\\rho v^2$ | Tekanan dinamis | Energi kinetik per volume |
| $\\rho g h$ | Tekanan potensial | Energi potensial per volume |

---

## 3. Kasus Khusus

### Pipa Horizontal ($h_1 = h_2$):
$$P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2$$

> Jika $v$ naik → $P$ turun. Inilah mengapa sayap pesawat bisa menghasilkan **gaya angkat**!

### Fluida Diam ($v = 0$):
$$P_1 + \\rho g h_1 = P_2 + \\rho g h_2$$

Kembali ke **tekanan hidrostatis**!

---

## 4. Mengapa Pesawat Bisa Terbang?

Bentuk sayap pesawat dirancang agar:
- **Bagian atas** membulat → udara mengalir lebih cepat → tekanan **rendah**
- **Bagian bawah** rata → udara mengalir lebih lambat → tekanan **tinggi**

Selisih tekanan ini menghasilkan **gaya angkat** (lift):
$$F_{lift} = (P_{bawah} - P_{atas}) \\times A_{sayap}$$

---

## 5. Simulasi Hukum Bernoulli

Lihat bagaimana tekanan dan kecepatan fluida berubah di dalam pipa!

<InteractiveComponent type="BernoulliSim" />

---

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY
**Soal:** Air mengalir dalam pipa horizontal. Di titik A, $v_A = 2 \\text{ m/s}$ dan $P_A = 150.000 \\text{ Pa}$. Di titik B, $v_B = 4 \\text{ m/s}$. Hitung $P_B$! ($\\rho = 1000 \\text{ kg/m}^3$)

**Penyelesaian:**
$$P_A + \\frac{1}{2}\\rho v_A^2 = P_B + \\frac{1}{2}\\rho v_B^2$$
$$150.000 + \\frac{1}{2}(1000)(4) = P_B + \\frac{1}{2}(1000)(16)$$
$$150.000 + 2.000 = P_B + 8.000$$
$$P_B = 144.000 \\text{ Pa}$$

---

### ⚔️ Level MEDIUM
**Soal:** Tangki air berisi air setinggi 3 m. Di dinding tangki terdapat lubang kecil. Berapa kecepatan air yang keluar dari lubang? (Asumsi: lubang kecil, $g = 10 \\text{ m/s}^2$)

**Penyelesaian (Teorema Toricelli):**
$$v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 3} = \\sqrt{60} \\approx 7,75 \\text{ m/s}$$

---

### 🔥 Level HOTS
**Soal:** Saat badai kencang, angin bertiup dengan kecepatan 40 m/s di atas atap rumah. Di bawah atap, udara relatif diam. Jika luas atap = 100 m², hitung gaya angkat pada atap! ($\\rho_{udara} = 1,2 \\text{ kg/m}^3$)

**Analisis:**
$$\\Delta P = \\frac{1}{2}\\rho v^2 = \\frac{1}{2}(1,2)(1600) = 960 \\text{ Pa}$$
$$F = \\Delta P \\times A = 960 \\times 100 = 96.000 \\text{ N} = 9,6 \\text{ ton}$$

Wajar atap bisa terbang saat badai!
    `
    },
    {
        title: "Toricelli dan Venturimeter",
        slug: "toricelli-venturimeter",
        order: 3,
        skillSlug: "toricelli-venturi",
        contentMdx: `
# 🏗️ Teorema Toricelli & Venturimeter

## 1. Teorema Toricelli

Teorema Toricelli adalah **aplikasi khusus** dari Hukum Bernoulli untuk menghitung kecepatan fluida yang keluar dari lubang di bawah permukaan.

### Penurunan Rumus

Tinjau tangki besar berisi air dengan lubang kecil di ketinggian $h$ di bawah permukaan:

- **Permukaan air** (titik 1): $P_1 = P_0$ (atm), $v_1 \\approx 0$ (tangki besar), $h_1 = h$
- **Lubang** (titik 2): $P_2 = P_0$, $v_2 = ?$, $h_2 = 0$

Bernoulli:
$$P_0 + 0 + \\rho g h = P_0 + \\frac{1}{2}\\rho v_2^2 + 0$$
$$\\rho g h = \\frac{1}{2}\\rho v_2^2$$

$$\\boxed{v = \\sqrt{2gh}}$$

> **Artinya:** Kecepatan air keluar dari lubang **sama dengan** kecepatan benda jatuh bebas dari ketinggian $h$!

---

## 2. Simulasi Toricelli

Lihat bagaimana air mengalir dari lubang pada ketinggian berbeda:

<InteractiveComponent type="ToricelliSim" />

---

## 3. Venturimeter

Venturimeter adalah alat untuk mengukur **kecepatan aliran** fluida di dalam pipa, berdasarkan prinsip Bernoulli.

### Cara Kerja:
Pipa yang dibuat menyempit → kecepatan naik → tekanan turun → selisih tekanan diukur dengan manometer (pipa U berisi cairan).

### Rumus:
$$v_1 = A_2 \\sqrt{\\frac{2 \\rho_m g \\Delta h}{\\rho_f (A_1^2 - A_2^2)}}$$

Dimana:
- $\\rho_m$ = massa jenis cairan manometer
- $\\Delta h$ = selisih tinggi di pipa U
- $\\rho_f$ = massa jenis fluida yang diukur

---

## 4. Contoh Soal

### 🌱 Level EASY
**Soal:** Lubang di dinding tangki berada 1,8 m di bawah permukaan air. Berapa kecepatan air keluar? ($g = 10 \\text{ m/s}^2$)

$$v = \\sqrt{2 \\times 10 \\times 1,8} = \\sqrt{36} = 6 \\text{ m/s}$$

---

### ⚔️ Level MEDIUM
**Soal:** Tangki silinder berisi air setinggi 5 m. Lubang di dasar tangki berdiameter 2 cm. Berapa debit air yang keluar?

$$v = \\sqrt{2 \\times 10 \\times 5} = 10 \\text{ m/s}$$
$$A = \\pi (0,01)^2 = \\pi \\times 10^{-4} \\text{ m}^2$$
$$Q = A \\cdot v = \\pi \\times 10^{-4} \\times 10 = \\pi \\times 10^{-3} \\approx 3,14 \\times 10^{-3} \\text{ m}^3/\\text{s}$$

---

### 🔥 Level HOTS
**Soal:** Dari mana jangkauan horizontal semprotan air paling jauh jika lubang dibuat pada ketinggian $h$ dari dasar tangki yang tingginya $H$?

**Jawab:** Jangkauan horizontal $x = v \\cdot t$ dimana $v = \\sqrt{2g(H-h)}$ dan waktu jatuh $t = \\sqrt{2h/g}$.
$$x = \\sqrt{2g(H-h)} \\cdot \\sqrt{\\frac{2h}{g}} = 2\\sqrt{h(H-h)}$$

Maksimum saat $\\frac{dx}{dh} = 0$, yaitu $h = \\frac{H}{2}$. **Lubang di tengah-tengah tangki menghasilkan jangkauan terjauh!**
    `
    },
];
