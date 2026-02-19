import { LessonData } from './units';

export const LESSONS_TERMODINAMIKA: LessonData[] = [
    {
        title: "Hukum I Termodinamika: Kekekalan Energi",
        slug: "hukum-termodinamika-1",
        order: 1,
        skillSlug: "hukum-1-termodinamika",
        contentMdx: `
# ⚡ Hukum I Termodinamika

Hukum I Termodinamika adalah **hukum kekekalan energi** yang diterapkan pada sistem termal. Energi tidak bisa diciptakan atau dimusnahkan — hanya bisa diubah bentuknya.

---

## 1. Bunyi Hukum I Termodinamika

> *"Perubahan energi dalam sistem sama dengan kalor yang masuk dikurangi usaha yang dilakukan sistem."*

$$\\boxed{\\Delta U = Q - W}$$

| Simbol | Nama | Keterangan |
|--------|------|------------|
| $\\Delta U$ | Perubahan energi dalam | Energi kinetik dan potensial partikel gas |
| $Q$ | Kalor | Positif jika masuk ke sistem |
| $W$ | Usaha | Positif jika dilakukan oleh sistem |

### Energi Dalam Gas Ideal:
$$U = \\frac{f}{2} n R T$$

Dimana $f$ = derajat kebebasan (monoatomik: 3, diatomik: 5).

---

## 2. Usaha Gas

Usaha yang dilakukan gas saat volume berubah:

$$\\boxed{W = \\int P \\, dV}$$

Untuk tekanan konstan (isobarik):
$$W = P \\cdot \\Delta V$$

> **Secara grafis:** Usaha = **luas daerah di bawah kurva** pada diagram P-V!

---

## 3. Simulasi Hukum I Termodinamika

Atur kalor (Q) dan usaha (W), lalu lihat bagaimana energi dalam gas berubah secara real-time!

<InteractiveComponent type="GasPistonSim" />

---

## 4. Contoh Soal

### 🌱 Level EASY
**Soal:** Gas menerima kalor 500 J dan melakukan usaha 200 J. Berapa perubahan energi dalam?

$$\\Delta U = Q - W = 500 - 200 = 300 \\text{ J}$$

---

### ⚔️ Level MEDIUM
**Soal:** 2 mol gas ideal monoatomik ($f = 3$) dipanaskan pada tekanan konstan 1 atm. Volume berubah dari 10 L menjadi 15 L. Hitung $W$, $\\Delta U$, dan $Q$!

$$W = P \\Delta V = 101.325 \\times 5 \\times 10^{-3} = 506,6 \\text{ J}$$
$$\\Delta U = \\frac{f}{2} n R \\Delta T$$

Dari $P \\Delta V = nR \\Delta T$:
$$\\Delta T = \\frac{P \\Delta V}{nR} = \\frac{506,6}{2 \\times 8,314} = 30,5 \\text{ K}$$
$$\\Delta U = \\frac{3}{2} \\times 2 \\times 8,314 \\times 30,5 = 760 \\text{ J}$$
$$Q = \\Delta U + W = 760 + 506,6 = 1266,6 \\text{ J}$$

---

### 🔥 Level HOTS
**Soal:** Argon (monoatomik) menjalani proses siklik A→B→C→A pada diagram P-V. A(2L, 3 atm), B(5L, 3 atm), C(5L, 1 atm). Hitung usaha netto dan efisiensi siklus!

**Jawab:** 
- A→B (isobarik): $W_{AB} = 3 \\times 101.325 \\times 3 \\times 10^{-3} = 912 \\text{ J}$
- B→C (isokhorik): $W_{BC} = 0$
- C→A (linear): $W_{CA} = \\frac{1}{2}(1+3)(101.325)(2-5) \\times 10^{-3} = -608 \\text{ J}$
- $W_{netto} = 912 + 0 - 608 = 304 \\text{ J}$
    `
    },
    {
        title: "Proses Termodinamika dan Diagram P-V",
        slug: "proses-termodinamika",
        order: 2,
        skillSlug: "proses-termodinamika",
        contentMdx: `
# 📊 Proses-Proses Termodinamika

Ada 4 proses termodinamika utama. Setiap proses memiliki kondisi khusus yang menyederhanakan perhitungan.

---

## 1. Empat Proses Utama

| Proses | Kondisi | $W$ | $Q$ | $\\Delta U$ |
|--------|---------|-----|-----|------------|
| **Isotermal** | $T = \\text{konstan}$ | $nRT\\ln\\frac{V_2}{V_1}$ | $W$ | $0$ |
| **Isobarik** | $P = \\text{konstan}$ | $P\\Delta V$ | $nC_p\\Delta T$ | $nC_v\\Delta T$ |
| **Isokhorik** | $V = \\text{konstan}$ | $0$ | $nC_v\\Delta T$ | $Q$ |
| **Adiabatik** | $Q = 0$ | $-\\Delta U$ | $0$ | $-W$ |

---

## 2. Proses Isotermal ($T$ konstan)

$$PV = nRT = \\text{konstan}$$
$$P_1 V_1 = P_2 V_2$$

Pada diagram P-V, graf berbentuk **hiperbola**.

$$W = nRT \\ln\\frac{V_2}{V_1}$$

Karena $T$ konstan → $\\Delta U = 0$ → $Q = W$ (semua kalor dikonversi menjadi usaha).

---

## 3. Proses Adiabatik ($Q = 0$)

Tidak ada pertukaran kalor dengan lingkungan:

$$PV^\\gamma = \\text{konstan}$$
$$TV^{\\gamma-1} = \\text{konstan}$$

Dimana $\\gamma = C_p / C_v$:
- Monoatomik: $\\gamma = 5/3 \\approx 1,67$
- Diatomik: $\\gamma = 7/5 = 1,4$

---

## 4. Simulasi Diagram P-V

Lihat bagaimana masing-masing proses terlihat di diagram P-V!

<InteractiveComponent type="PVDiagramSim" />

---

## 5. Contoh Soal

### 🌱 Level EASY
**Soal:** Gas ideal menjalani proses isokhorik (volume tetap). Jika tekanan naik dari 1 atm ke 3 atm, apakah ada usaha yang dilakukan gas?

$$W = P \\Delta V = P \\times 0 = 0$$

**Tidak ada usaha!** Semua kalor masuk menjadi kenaikan energi dalam.

---

### ⚔️ Level MEDIUM
**Soal:** 1 mol gas ideal menjalani proses isotermal pada 300 K. Volume berubah dari 2 L ke 8 L. Hitung usaha gas!

$$W = nRT \\ln\\frac{V_2}{V_1} = 1 \\times 8,314 \\times 300 \\times \\ln\\frac{8}{2}$$
$$W = 2494,2 \\times \\ln 4 = 2494,2 \\times 1,386 = 3457 \\text{ J}$$

---

### 🔥 Level HOTS
**Soal:** Gas helium (monoatomik, $\\gamma = 5/3$) pada 27°C dan 1 atm dikompresi adiabatik hingga volumenya menjadi $1/8$ volume awal. Berapa suhu akhir?

$$TV^{\\gamma-1} = \\text{konstan}$$
$$T_1 V_1^{\\gamma-1} = T_2 V_2^{\\gamma-1}$$
$$300 \\times V_1^{2/3} = T_2 \\times \\left(\\frac{V_1}{8}\\right)^{2/3}$$
$$300 = T_2 \\times \\left(\\frac{1}{8}\\right)^{2/3} = T_2 \\times \\frac{1}{4}$$
$$T_2 = 1200 \\text{ K} = 927°C$$
    `
    },
    {
        title: "Siklus Carnot dan Hukum II Termodinamika",
        slug: "siklus-carnot",
        order: 3,
        skillSlug: "hukum-2-carnot",
        contentMdx: `
# ♻️ Hukum II Termodinamika & Siklus Carnot

Hukum I mengatakan energi kekal. Tapi mengapa kita tidak bisa membuat mesin dengan efisiensi 100%? Jawabannya ada di **Hukum II Termodinamika**.

---

## 1. Bunyi Hukum II Termodinamika

### Pernyataan Kelvin-Planck:
> *"Tidak mungkin membuat mesin kalor yang mengubah SELURUH kalor menjadi usaha tanpa efek lain."*

### Pernyataan Clausius:
> *"Kalor tidak dapat mengalir secara spontan dari benda dingin ke benda panas."*

> Kedua pernyataan ini **ekuivalen** — keduanya mengatakan hal yang sama dengan cara berbeda!

---

## 2. Mesin Kalor

Mesin kalor menyerap kalor $Q_H$ dari reservoir panas, menghasilkan usaha $W$, dan membuang kalor $Q_C$ ke reservoir dingin.

$$W = Q_H - Q_C$$

**Efisiensi mesin kalor:**
$$\\boxed{\\eta = \\frac{W}{Q_H} = 1 - \\frac{Q_C}{Q_H}}$$

> Karena $Q_C > 0$ (hukum II), maka $\\eta < 100\\%$ SELALU!

---

## 3. Siklus Carnot — Mesin Paling Efisien

Siklus Carnot terdiri dari 4 proses:
1. **Ekspansi isotermal** pada $T_H$ (menyerap $Q_H$)
2. **Ekspansi adiabatik** (suhu turun dari $T_H$ ke $T_C$)
3. **Kompresi isotermal** pada $T_C$ (membuang $Q_C$)
4. **Kompresi adiabatik** (suhu naik dari $T_C$ ke $T_H$)

**Efisiensi Carnot (maksimum yang mungkin):**

$$\\boxed{\\eta_{Carnot} = 1 - \\frac{T_C}{T_H}}$$

> Catatan: $T$ harus dalam **Kelvin**!

---

## 4. Simulasi Siklus Carnot

Visualisasikan siklus Carnot pada diagram P-V dan atur efisiensinya!

<InteractiveComponent type="CarnotSim" />

---

## 5. Entropi

**Entropi** ($S$) adalah ukuran ketidakteraturan sistem:

$$\\Delta S = \\frac{Q}{T}$$

Hukum II dalam konteks entropi:
> *"Entropi total alam semesta selalu bertambah untuk proses spontan."*

$$\\Delta S_{alam} \\geq 0$$

---

## 6. Contoh Soal

### 🌱 Level EASY
**Soal:** Mesin kalor menyerap 1000 J dan membuang 600 J. Berapa efisiensinya?

$$\\eta = 1 - \\frac{Q_C}{Q_H} = 1 - \\frac{600}{1000} = 0,4 = 40\\%$$

---

### ⚔️ Level MEDIUM
**Soal:** Mesin Carnot beroperasi antara reservoir 527°C dan 27°C. Berapa efisiensi maksimumnya?

$$T_H = 527 + 273 = 800 \\text{ K}$$
$$T_C = 27 + 273 = 300 \\text{ K}$$
$$\\eta = 1 - \\frac{300}{800} = 1 - 0,375 = 0,625 = 62,5\\%$$

---

### 🔥 Level HOTS
**Soal:** Pembangkit listrik tenaga uap beroperasi pada suhu uap 550°C dan suhu kondensor 50°C. Jika daya pembangkit = 500 MW, berapa laju pembuangan kalor minimum ke lingkungan?

$$\\eta_{maks} = 1 - \\frac{323}{823} = 0,607$$
$$P_{output} = \\eta \\times \\frac{Q_H}{t}$$
$$\\frac{Q_H}{t} = \\frac{500}{0,607} = 823,7 \\text{ MW}$$
$$\\frac{Q_C}{t} = 823,7 - 500 = 323,7 \\text{ MW}$$

> Lebih dari 300 MW dibuang sebagai panas limbah! Inilah mengapa pembangkit membutuhkan **menara pendingin** raksasa.
    `
    },
];
