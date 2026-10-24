import { LessonData } from './units';

export const LESSONS_UNIT3: LessonData[] = [
    {
        title: "Fluida Statis, Pascal & Prinsip Archimedes",
        slug: "pascal-archimedes",
        order: 1,
        skillSlug: "fluida-statis",
        contentMdx: `
# 🌊 Fluida Statis: Hukum Pascal & Prinsip Archimedes

Fluida statis adalah fluida (cairan atau gas) dalam keadaan diam seimbang. Dua hukum agung yang mendasari aplikasi teknologi hidrolik dan perkapalan adalah **Hukum Pascal** dan **Hukum Archimedes**.

---

## 1. Hukum Pascal: Multiplikasi Gaya

Tekanan yang diberikan pada fluida dalam ruang tertutup diteruskan ke segala arah dengan sama besar tanpa berkurang.
$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_1 = F_2 \\left(\\frac{A_1}{A_2}\\right) = F_2 \\left(\\frac{D_1}{D_2}\\right)^2$$
> **Aplikasi Medis:** Kursi pasien dokter gigi yang beratnya ratusan Newton dapat dinaikkan hanya dengan injakan pedal kecil oleh dokter gigi berkat rasio luas penampang piston hidrolik!

---

## 2. Hukum Archimedes & Kapal Selam

Benda yang tercelup sebagian atau seluruhnya ke dalam fluida akan mengalami gaya ke atas ($F_A$) yang besarnya sama dengan berat fluida yang dipindahkan:
$$F_A = \\rho_f \\cdot g \\cdot V_{\\text{tercelup}}$$

### Mekanisme Mengapung & Menyelam Kapal Selam:
- Kapal selam memiliki **tangki ballast** (ballast tank).
- Untuk **menyelam ke dasar**, tangki diisi air laut sehingga massa jenis total kapal selam $\\rho_{\\text{kapal}} > \\rho_{\\text{air laut}}$ ($W > F_A$).
- Untuk **terapung kembali ke permukaan**, air di tangki ballast dipompa keluar digantikan udara bertekanan, sehingga volume air yang dipindahkan menghasilkan $\\rho_{\\text{kapal}} = \\rho_{\\text{air laut}}$.
  $$\\Delta V = \\frac{m}{\\rho_{\\text{air laut}}} - \\frac{m}{\\rho_{\\text{kapal dasar}}}$$

---

## 3. Simulasi Interaktif: Kursi Hidrolik Dokter Gigi

<InteractiveComponent type="HydraulicDentistChairSim" />

---

## 4. Simulasi Interaktif: Tangki Ballast Kapal Selam

<InteractiveComponent type="SubmarineBallastSim" />

---

## 5. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar (Tekanan Hidrostatis)
**Soal:** Hitung tekanan hidrostatis pada kedalaman $5\\text{ m}$ di bawah permukaan air danau ($\\rho = 1000\\text{ kg/m}^3, g = 10\\text{ m/s}^2$).

**Penyelesaian:**
$$P_h = \\rho g h = 1000 \\times 10 \\times 5 = \\mathbf{50{.}000\\text{ Pa} = 50\\text{ kPa}}$$

---

### 🟡 Level 2: Menengah (Kursi Dokter Gigi - Soal Asli TKA No. 12)
**Soal:** Kursi dokter gigi dinaik-turunkan dengan sistem hidrolik. Beban yang diangkat oleh piston besar adalah $F_2 = 540\\text{ N}$ dengan diameter $D_2 = 3\\text{ cm}$. Berapakah gaya terkecil $F_1$ yang diperlukan pada piston kecil yang berdiameter $D_1 = 0{,}5\\text{ cm}$?

**Penyelesaian:**
Berdasarkan Hukum Pascal:
$$\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_1 = F_2 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2$$
$$F_1 = 540\\text{ N} \\times \\left(\\frac{0{,}5\\text{ cm}}{3\\text{ cm}}\\right)^2 = 540 \\times \\left(\\frac{1}{6}\\right)^2 = 540 \\times \\frac{1}{36} = \\mathbf{15\\text{ N}}$$
**Jawaban TKA:** A. $15\\text{ N}$.

---

### 🔴 Level 3: Level Asli TKA (HOTS Kapal Selam - Soal No. 13)
**Soal:** Sebuah kapal selam bermassa $m = 200{.}000\\text{ kg}$ berada di dasar laut dengan massa jenis rata-rata $1{.}250\\text{ kg/m}^3$. Agar kapal selam dapat terapung mendekati permukaan laut (massa jenis air laut $\\rho_{\\text{air}} = 1{.}000\\text{ kg/m}^3$), berapakah perubahan volume yang harus dilakukan pada tangki ballast kapal selam?

**Langkah Penurunan Solusi:**
1. Volume kapal selam saat di dasar laut:
   $$V_1 = \\frac{m}{\\rho_1} = \\frac{200{.}000\\text{ kg}}{1{.}250\\text{ kg/m}^3} = 160\\text{ m}^3$$
2. Agar dapat terapung mendekati permukaan (melayang tepat seimbang sebelum keluar), massa jenis total harus menjadi $1{.}000\\text{ kg/m}^3$:
   $$V_2 = \\frac{m}{\\rho_2} = \\frac{200{.}000\\text{ kg}}{1{.}000\\text{ kg/m}^3} = 200\\text{ m}^3$$
3. Perubahan volume tangki ballast yang harus diekspansi (ditiup udara mengeluarkan air):
   $$\\Delta V = V_2 - V_1 = 200\\text{ m}^3 - 160\\text{ m}^3 = \\mathbf{40\\text{ m}^3}$$

**Jawaban TKA:** A. $40\\text{ m}^3$.
`
    },
    {
        title: "Fluida Dinamis, Bernoulli & Aerodinamika",
        slug: "kontinuitas-bernoulli",
        order: 2,
        skillSlug: "fluida-dinamis",
        contentMdx: `
# 💨 Fluida Dinamis & Prinsip Aerodinamika Sayap

Mengapa burung dan pesawat berbobot puluhan ton bisa terangkat melayang di udara? Jawabannya terletak pada hukum kekekalan massa dan energi mekanik fluida: **Persamaan Kontinuitas** dan **Persamaan Bernoulli**.

---

## 1. Persamaan Kontinuitas (Kekekalan Massa)

Untuk fluida tak termampatkan (incompressible), debit aliran $Q$ di setiap penampang adalah konstan:
$$Q = A_1 \\cdot v_1 = A_2 \\cdot v_2$$
> **Implikasi:** Bila luas penampang pipa mengecil ($A_2 < A_1$), kelajuan aliran bertambah cepat ($v_2 > v_1$).

---

## 2. Hukum Bernoulli & Gaya Angkat Sayap (Airfoil)

Kekekalan energi per satuan volume sepanjang garis arus fluida:
$$P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{konstan}$$

### Cara Kerja Sayap Burung dan Pesawat:
Bentuk penampang sayap (airfoil) memiliki permukaan atas yang lebih melengkung dibanding permukaan bawah yang relatif datar.
1. Aliran udara di atas sayap harus menempuh jarak lengkung yang lebih jauh, sehingga kecepatannya lebih tinggi: $v_{\\text{atas}} > v_{\\text{bawah}}$.
2. Menurut Hukum Bernoulli, kecepatan tinggi menghasilkan tekanan statis yang lebih rendah: $P_{\\text{atas}} < P_{\\text{bawah}}$.
3. Perbedaan tekanan ini menciptakan **gaya angkat netto ke atas (Lift Force)**:
   $$F_{\\text{angkat}} = (P_{\\text{bawah}} - P_{\\text{atas}}) \\cdot A = \\frac{1}{2} \\rho A (v_{\\text{atas}}^2 - v_{\\text{bawah}}^2)$$

---

## 3. Simulasi Interaktif: Sayap Burung di Terowongan Angin

Perhatikan bagaimana partikel udara mengalir lebih cepat di atas sayap dan menghasilkan perbedaan tekanan warna (merah vs biru):

<InteractiveComponent type="BirdWingAerodynamicsSim" />

---

## 4. Contoh Soal 3 Level Terstruktur

### 🟢 Level 1: Dasar (Kontinuitas)
**Soal:** Air mengalir dalam pipa berdiameter $4\\text{ cm}$ dengan kelajuan $2\\text{ m/s}$. Berapakah kelajuan air saat memasuki bagian pipa berdiameter $2\\text{ cm}$?

**Penyelesaian:**
$$A_1 v_1 = A_2 v_2 \\implies v_2 = v_1 \\left(\\frac{D_1}{D_2}\\right)^2 = 2 \\times \\left(\\frac{4}{2}\\right)^2 = 2 \\times 4 = \\mathbf{8\\text{ m/s}}$$

---

### 🟡 Level 2: Menengah (Teorema Torricelli)
**Soal:** Sebuah tangki air bocor pada lubang kecil $5\\text{ m}$ di bawah permukaan air bebas ($g = 10\\text{ m/s}^2$). Hitung kelajuan semburan air!

**Penyelesaian:**
$$v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 5} = \\sqrt{100} = \\mathbf{10\\text{ m/s}}$$

---

### 🔴 Level 3: Level Asli TKA (HOTS Multi-Pilihan Sayap Burung - Soal No. 14)
**Soal:** Sayap pada burung membantu burung untuk beraktivitas terbang. Sayap yang dibentangkan dan gerakan melawan arah angin membuat burung terangkat terbang. Saat terbang, bentuk sayap burung dapat berubah sesuai kondisi. Berdasarkan fenomena tersebut, bagaimana penjelasan ilmiah mengenai sayap membantu burung terbang? (Pilihan benar lebih dari satu).

**Evaluasi Setiap Pernyataan TKA:**
- $\\checkmark$ **Saat udara mengalir di atas dan bawah sayap, kecepatan udara di atas lebih tinggi.** (BENAR, karena kelengkungan atas lebih panjang).
- $\\times$ *Rendahnya kecepatan aliran udara di bawah sayap, menghasilkan tekanan yang lebih rendah.* (SALAH, menurut Bernoulli kecepatan rendah menghasilkan tekanan **lebih tinggi**).
- $\\checkmark$ **Perbedaan tekanan menciptakan gaya angkat yang memungkinkan burung tetap terbang.** (BENAR, $F = (P_{\\text{bawah}} - P_{\\text{atas}})A$).
- $\\times$ *Gerakan melawan arah angin menciptakan hambatan sehingga burung dapat terbang.* (SALAH, hambatan/drag adalah gaya yang menahan, bukan penyebab terangkat).
- $\\checkmark$ **Bentuk sayap berubah untuk menghasilkan perubahan gaya angkat.** (BENAR, burung mengubah kurvatur/camber dan sudut serang untuk bermanuver).

**Pilihan Benar:** Pernyataan 1, 3, dan 5.
`
    }
];
