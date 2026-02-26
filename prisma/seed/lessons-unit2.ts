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

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Pernahkah kamu menyiram tanaman menggunakan selang air, lalu kamu memencet/menutup setengah ujung selang dengan jarimu? Air tiba-tiba menyemprot lebih kencang dan jauh. Mengapa demikian?
**Penyelesaian:**
Menurut **Persamaan Kontinuitas** ($Q = A \cdot v$), debit air ($Q$) yang mengalir dalam selang adalah konstan. Jika kita menutup sebagian ujung selang, luas penampang ujung selang ($A$) menjadi jauh lebih kecil. Agar hasil kali $A \cdot v$ tetap sama, maka kecepatan aliran air ($v$) harus meningkat drastis.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Air mengalir melalui pipa utama dengan diameter penampang 8 cm pada kecepatan 2 m/s. Pipa ini ujungnya menyempit menjadi 4 cm. Berapakah kecepatan air pada bagian yang menyempit tersebut?
**Penyelesaian:**
Mencari perbandingan luas dari diameter ($A \propto D^2$):
$$v_1 D_1^2 = v_2 D_2^2$$
$$2 \times 8^2 = v_2 \times 4^2$$
$$2 \times 64 = v_2 \times 16$$
$$128 = 16 v_2 \implies v_2 = 8 \text{ m/s}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Pemadam kebakaran menggunakan selang besar berdiameter 10 cm untuk memompa air sabun dari truk penampung bertekanan tinggi. Kecepatan air di dalam selang ini adalah 5 m/s. Di ujung selang terdapat *nozzle* (mulut semprotan) berukuran diameter 2,5 cm. Berapa liter air yang disemprotkan setiap detiknya, dan berapakah kecepatan pancaran air saat keluar dari *nozzle* pemadam tersebut? (Gunakan $\pi \approx 3,14$)
**Penyelesaian:**
1. Kecepatan semprotan ($v_2$):
$$v_1 D_1^2 = v_2 D_2^2$$
$$5 \times 10^2 = v_2 \times (2,5)^2$$
$$500 = v_2 \times 6,25 \implies v_2 = \frac{500}{6,25} = 80 \text{ m/s}$$
2. Debit pancaran dalam liter/detik ($1 \text{ m}^3 = 1000 \text{ L}$):
$$Q = A_1 \cdot v_1 = \pi \left(\frac{D_1}{2}\right)^2 \cdot v_1$$
$$Q = 3,14 \times (0,05 \text{ m})^2 \times 5 \text{ m/s}$$
$$Q = 3,14 \times 0,0025 \times 5 = 0,03925 \text{ m}^3/\text{s} = 39,25 \text{ L/s}$$

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Darah mengalir melalui aorta (pembuluh nadi utama) dengan jari-jari rongga 1 cm pada kecepatan rata-rata $30 \text{ cm/s}$. Aorta tersebut kemudian bercabang menjadi sekumpulan jutaan pembuluh kapiler yang paralel. Jari-jari 1 pembuluh kapiler sangat kecil, yaitu $4 \times 10^{-4} \text{ cm}$. Jika kita menginginkan kecepatan darah di dalam kapiler menurun drastis menjadi hanya $0,05 \text{ cm/s}$ agar pertukaran oksigen optimal, maka berapa total jumlah pembuluh kapiler dalam seluruh susunan organ tersebut?
**Penyelesaian:**
Hukum Kontinuitas dengan $n$ cabang identik:
$$Q_{aorta} = n \times Q_{kapiler}$$
$$A_{aorta} \cdot v_{aorta} = n \left( A_{kapiler} \cdot v_{kapiler} \right)$$
$$\pi r_{aorta}^2 \cdot v_{aorta} = n \left( \pi r_{kapiler}^2 \cdot v_{kapiler} \right)$$
Coret $\pi$:
$$(1)^2 \times 30 = n \left( (4 \times 10^{-4})^2 \times 0,05 \right)$$
$$30 = n \times (16 \times 10^{-8}) \times 0,05$$
$$30 = n \times 0,8 \times 10^{-8}$$
$$n = \frac{30}{0,8 \times 10^{-8}} = \frac{30}{8 \times 10^{-9}} = 3,75 \times 10^9$$
Artinya terdapat $3.750.000.000$ (3,75 miliar) pembuluh kapiler yang menerima aliran darah!
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

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Mengapa saat dua kereta api cepat berpapasan berlawanan arah, gerbong-gerbongnya terasa seperti saling "menyedot" atau tertarik ke arah satu sama lain?
**Penyelesaian:**
Ini adalah contoh nyata **Efek Bernoulli**. Saat dua kereta lewat berdekatan, celah sempit di antara keduanya dilewati oleh udara yang bergerak sangat cepat. Menurut Hukum Bernoulli, kecepatan udara yang tinggi menghasilkan tekanan yang rendah. Karena tekanan di celah antara dua kereta lebih rendah daripada tekanan udara di luar kereta, maka muncul gaya dorong dari luar yang menekan kedua gerbong ke arah dalam (saling mendekat).

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Di dalam suatu pipa mendatar, air mengalir dengan kecepatan $v_A = 2 \text{ m/s}$ pada tekanan $P_A = 200.000 \text{ Pa}$. Pada penampang lain yang menyempit, kecepatan air menjadi $v_B = 6 \text{ m/s}$. Berapakah tekanan air pada pipa yang menyempit tersebut ($P_B$)? (Massa jenis air = $1000 \text{ kg/m}^3$)
**Penyelesaian:**
Karena pipa mendatar ($h_A = h_B$), energi potensial hilang:
$$P_A + \frac{1}{2}\rho v_A^2 = P_B + \frac{1}{2}\rho v_B^2$$
$$200.000 + \frac{1}{2}(1000)(2^2) = P_B + \frac{1}{2}(1000)(6^2)$$
$$200.000 + 2000 = P_B + 18000$$
$$202.000 = P_B + 18000$$
$$P_B = 184.000 \text{ Pa} = 184 \text{ kPa}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Angin puting beliung tiba-tiba berhembus kencang mendatar dengan kecepatan 40 m/s menembus bagian atas datar dari atap seng sebuah rumah. Di dalam rumah, jendela dan pintu tertutup rapat sehingga udara diasumsikan stagnan ($v_{dalam} = 0$). Jika massa jenis udara $1,2 \text{ kg/m}^3$ dan luas atap adalah $150 \text{ m}^2$, berapakah gaya angkat total (Lift Force) yang berusaha menerbangkan atap rumah tersebut?
**Penyelesaian:**
Beda tekanan $\Delta P = P_{dalam} - P_{luar} = \frac{1}{2} \rho v_{angin}^2$.
$$\Delta P = \frac{1}{2} \times 1,2 \times (40)^2$$
$$\Delta P = 0,6 \times 1600 = 960 \text{ Pa} \text{ (atau } N/m^2 \text{)}$$
Gaya Angkat $F = \Delta P \times A$:
$$F = 960 \times 150 = 144.000 \text{ N}$$
Gaya sebesar 144.000 Newton ini setara dengan daya angkat untuk menerbangkan beban sekitar 14,4 Ton! Ini menjelaskan mengapa atap sering beterbangan saat terjadi badai besar.

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Air mengalir ke atas melalui pipa miring yang elevasinya naik setinggi 4 meter. Di bagian bawah (ketinggian $h_1=0$), pipa memiliki luas penampang $A_1 = 40 \text{ cm}^2$ dan air mengalir dengan tekanan $P_1 = 3 \times 10^5 \text{ Pa}$ serta kelajuan $v_1 = 5 \text{ m/s}$. Di bagian atas ($h=4 \text{m}$), luas penampang menyempit menjadi $A_2 = 10 \text{ cm}^2$. Tentukan kerja yang dilakukan tekanan per satuan volume fluida ($\Delta P$), dan hitunglah tekanan $P_2$ di ujung atas pipa miring tersebut! ($g=10 \text{ m/s}^2, \rho=1000 \text{ kg/m}^3$)
**Penyelesaian:**
1. Kecepatan di titik tinggi:
$$A_1 v_1 = A_2 v_2 \implies 40 \times 5 = 10 \times v_2 \implies v_2 = 20 \text{ m/s}$$
2. Hukum Bernoulli dengan elevasi:
$$P_1 + \frac{1}{2}\rho v_1^2 + \rho g h_1 = P_2 + \frac{1}{2}\rho v_2^2 + \rho g h_2$$
$$300.000 + \frac{1}{2}(1000)(25) + 0 = P_2 + \frac{1}{2}(1000)(400) + (1000)(10)(4)$$
$$300.000 + 12.500 = P_2 + 200.000 + 40.000$$
$$312.500 = P_2 + 240.000$$
$$P_2 = 72.500 \text{ Pa}$$
Meskipun didorong sekuat 300 kPa, tekanannya rontok menjadi hanya 72,5 kPa karena air dipaksa menanjak (buang energi potensial) dan menyemprot jauh lebih cepat (buang tekanan hidrodinamis)!
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

## 4. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Sebuah tangki menara penampung air mengalami kebocoran di dasar dinding karena karat. Mengingat tinggi permukaan air dari lubang bocoran sangat besar (10 meter), mengapa air memancar keluar dengan sangat deras?
**Penyelesaian:**
Menurut Teorema Toricelli ($v = \\sqrt{2gh}$), kecepatan air keluar dari lubang berbanding lurus dengan akar kedalaman ($h$) dari permukaan air. Karena kedalaman air dari permukaan sangat jauh (10 meter), tekanan potensial yang berubah menjadi energi kinetik memancar sangat besar sehingga menghasilkan aliran air yang amat deras (sekitar 14 m/s).

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Tangki silinder berisi air setinggi 5 m. Lubang kebocoran di dekat dasar tangki berdiameter 2 cm. Jika pipa tersebut diasumsikan bocor sempurna tanpa hambatan dan $g=10 \\text{ m/s}^2$, hitung debit air awal yang keluar dari lubang!
**Penyelesaian:**
1. Kecepatan pancaran (Toricelli):
$$v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 5} = \\sqrt{100} = 10 \\text{ m/s}$$
2. Luas penampang lubang ($r = 1 \\text{ cm} = 0,01 \\text{ m}$):
$$A = \\pi (0,01)^2 = \\pi \\times 10^{-4} \\text{ m}^2$$
3. Debit pancaran:
$$Q = A \\cdot v = \\pi \\times 10^{-4} \\times 10 = \\pi \\times 10^{-3} \\text{ m}^3\\text{/s} \\approx 3,14 \\text{ Liter/detik}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Venturimeter tanpa manometer (pipa menyempit tanpa cairan raksa uji) dipasang pada jalur pipa PDAM. Luas penampang pipa utama $A_1 = 20 \\text{ cm}^2$ dan luas leher penyempitan $A_2 = 10 \\text{ cm}^2$. Beda ketinggian air pada tabung ukur vertikal di atas pipa utama adalah $\\Delta h = 15 \\text{ cm}$ ($0,15 \\text{ m}$). Berapa kecepatan akhir air yang mendistribusi ke perumahan melewati pipa utama ($v_1$)? ($g=10 \\text{ m/s}^2$)
**Penyelesaian:**
Persamaan Venturimeter tanpa manometer:
$$v_1 = A_2 \\sqrt{\\frac{2g \\Delta h}{A_1^2 - A_2^2}}$$
Masukkan angka:
$$v_1 = 10 \\sqrt{\\frac{2 \\times 10 \\times 0,15}{20^2 - 10^2}}$$
$$v_1 = 10 \\sqrt{\\frac{3}{400 - 100}} = 10 \\sqrt{\\frac{3}{300}}$$
$$v_1 = 10 \\sqrt{\\frac{1}{100}} = 10 \\times \\frac{1}{10} = 1 \\text{ m/s}$$
Air mendistribusi secara rapi ke perumahan warga pada kelajuan 1 meter/detik.

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Tangki silinder berdiri vertikal tingginya $H$ dipenuhi air. Sebuah lubang kecil dibuat pada jarak $y$ dari dasar tangki. Jangkauan pancaran air horizontal yang mengenai lantai diukur dari kaki tangki adalah $x$. Jika kita ingin supaya $x$ ini mencapai rentang yang paling jauh sekalipun lantai dibuat miring mendaki dengan pelana sudut $30^\\circ$, analisis posisi $y$ ideal untuk letak lubang! Namun soal ini meminta nilai ekstrem jangkauan pada lantai Datar, maka carilah perbandingan antara jangkauan $x$ maksimal terhadap tinggi total tangki $H$!
**Penyelesaian:**
Kita analisis pancaran proyektil (gerak parabola).
Kecepatan horizontal awal $v_x = \\sqrt{2g(H-y)}$.
Waktu yang terpakai untuk jatuh jarak vertikal $y$:
$$y = \\frac{1}{2}gt^2 \\implies t = \\sqrt{\\frac{2y}{g}}$$
Jarak jangkauan horizontal $x$:
$$x = v_x \\cdot t = \\sqrt{2g(H-y)} \\times \\sqrt{\\frac{2y}{g}} = \\sqrt{4y(H-y)} = 2\\sqrt{Hy - y^2}$$
Batas ekstrem maksimal fungsi kuadrat di dalam akar terjadi jika turunannya nol, atau $y = \\frac{H}{2}$.
Masukkan $y = \\frac{H}{2}$:
$$x_{maks} = 2\\sqrt{H(\\frac{H}{2}) - (\\frac{H}{2})^2} = 2\\sqrt{\\frac{H^2}{2} - \\frac{H^2}{4}} = 2\\sqrt{\\frac{H^2}{4}} = 2 \\times \\frac{H}{2} = H$$
Rasio antara jangkauan maksimal dan tinggi tangki adalah **1 : 1**. Pancaran terjauh tepat sama dengan tinggi tangki itu sendiri.
    `
    },
    {
        title: "Aerodinamika: Menembus Batas Langit",
        slug: "aerodinamika",
        order: 4,
        skillSlug: "aerodinamika",
        contentMdx: `
# 🦅 Aerodinamika: Mengapa Burung Besi Bisa Terbang?

Aerodinamika adalah studi tentang bagaimana gas (terutama udara) berinteraksi dengan benda padat yang bergerak melaluinya. Bidang inilah yang menyumbangkan sayap pada umat manusia untuk bisa menaklukkan langit dengan pesawat jet!

---

## 1. Gaya Aerodinamis pada Pesawat

Pesawat dapat terbang dan bermanuver di udara karena dikendalikan oleh **empat gaya mekanik** utama:

1. **GAYA ANGKAT (LIFT)**: Mendorong pesawat ke atas (melawan gravitasi), dihasilkan oleh aliran udara pada sayap pesawat (Airfoil).
2. **GAYA BERAT (WEIGHT)**: Bobot massa pesawat dan isinya yang ditarik secara vertikal oleh gravitasi bumi ke bawah.
3. **GAYA DORONG (THRUST)**: Mendorong pesawat maju (ke depan), dihasilkan oleh dorongan mesin jet baling-baling atau roket.
4. **GAYA HAMBAT (DRAG)**: Gaya gesek/resistansi alami udara yang menahan laju sayap dan badan pesawat mundur ke belakang.

> **Syarat Terbang Pesawat Stabil (Jelajah):**
> *Lift = Weight* dan *Thrust = Drag*.

---

## 2. Airfoil dan Hukum Bernoulli

**Airfoil** adalah bentuk penampang melintang dari sebuah sayap pesawat terbang (atau baling-baling). Bentuk tetesan air matanya sengaja didesain melengkung cembung di bagian atas, dan cukup rata di bagian bawah.

Akibat desain airfoil, aliran udara terpecah menjadi dua jalur (atas dan bawah).
Sesuai **Hukum Bernoulli**, udara yang melintasi lengkungan *cembung atas* sayap menempuh lintasan lebih panjang pada waktu yang sama, sehingga harus **mengalir lebih cepat** ($v_{atas}$ tinggi).
Akibatnya, tekanan udara bagian atas menjadi **rendah** ($P_{atas}$ kecil).

Sebaliknya, letak udara di bawah sayap mengalir **lebih lambat**, sehingga tekanannya **lebih tinggi**. Perbedaan tekanan ($\\Delta P = P_{bawah} - P_{atas}$) inilah yang menendang sayap dari bawah ke atas dengan raksasa, menghasilkan *Lift Force*.

$$F_{lift} = \\frac{1}{2} \\rho (v_{atas}^2 - v_{bawah}^2) \\times A_{sayap}$$

---

## 3. Angle of Attack (Sudut Serang)

Pesawat modern tidak melulu bergantung mutlak pada bentuk asimetri Airfoil, namun juga bergantung pada **Angle of Attack (AOA)**. Ini adalah sudut yang dibentuk antara profil sayap dengan arah angin horizontal mendatar.

Semakin menengadah sayap pesawat (menekuk flaps), semakin tinggi turbulensi yang dibanting ke bawah, sehingga daya angkat ke atas makin melenting tinggi sesuai kaidah Hukum Newton III (Aksi-Reaksi). Namun AOA jika terlalu curam tajam akan memecah aliran pelapis udara dan menyebabkan **Stall** (Pesawat kehilangan daya angkat dan anjlok jatuh bebas).

---

## 4. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Sebuah mobil Formula 1 (F1) dimodifikasi dengan lengkungan spoiler besar berbentuk sayap terbalik (Inverted Airfoil). Spoiler cembung mendominasi bagian bawah bodi belakang, sedangkan bagian atas ratanya bergesekan udara. Mengapa mobil F1 butuh sayap terbalik alih-alih sayap pesawat terbang?
**Penyelesaian:**
Sayap pesawat dirancang mengangkat ke udara. Pembalap F1 tentu enggan terbang bebas keluar jalur darat saat mengebut 300 km/jam! Spoiler sayap terbalik dengan bagian bawah cembung mengakibatkan tekanan udara di *kolong roda belakang terdorong jauh lebih rendah*. Perbedaan dengan tekanan dari atap langit yang lebih pekat menekan keras bodi mobil menempel lekat mampat di tanah aspal. Fenomena ini melahirkan gaya kuat **Downforce** agar roda dapat menapak cengkeram menikung anti selip layaknya laba-laba raksasa yang tidak terhempas inersia.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah helikopter purwarupa menggunakan sayap pesawat kecil dengan luas keseluruhan $A = 50 \\text{ m}^2$. Udara menggesek permukaan bawah sayap $v_{bawah} = 200 \\text{ m/s}$ dan menggesek kurva atap sayap dengan kelajuan $v_{atas} = 250 \\text{ m/s}$. Apabila rapatan udara $\\rho = 1 \\text{ kg/m}^3$, hitung besaran gaya angkat maksimum (Lift Force) sayap!
**Penyelesaian:**
Mencari selisih percepatan Bernoulli:
$$F_{lift} = \\frac{1}{2} \\rho \\left(v_{atas}^2 - v_{bawah}^2\\right) \\times A$$
$$F_{lift} = \\frac{1}{2} (1) \\left(250^2 - 200^2\\right) \\times 50$$
$$F_{lift} = 25 \\times (62.500 - 40.000)$$
$$F_{lift} = 25 \\times 22.500 = 562.500 \\text{ N}$$
Gaya angkat sebesar 562,5 kilonewton ini dapat mendaratkan helikopter vertikal dengan aman!

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Pesawat komersial Airbus A330 massanya 200.000 kg mendatar membelah lapisan atmosfer tenang. Total dari seluruh jaringan rentang bilah sayap adalah 300 meter persegi. Kecepatan jelajah aliran partikel di bawah permukaan lambung sayap adalah $200 \\text{ m/s}$, sementara konstanta massa udara di sana $\\rho = 1,2 \\text{ kg/m}^3$. Berapa selisih kelajuan aliran udara menukik membujur di sisi tajuk atas sayap agar daya angkat sayap persis dapat mempertahankan Airbus terapung diam secara isobarik ($F_{lift}$ ideal mengimbangi berat)? Asumsikan $g=10 \\text{ m/s}^2$. 
**Penyelesaian:**
Syarat terapung diam seimbang (cruising) $F_{lift} = m \\cdot g$:
$$F_{lift} = 200.000 \\times 10 = 2.000.000 \\text{ N}$$
Lalu masuk hukum angkat:
$$2.000.000 = \\frac{1}{2} \\rho (v_{atas}^2 - v_{bawah}^2) \\times A$$
$$2.000.000 = \\frac{1}{2} \\times 1,2 \\times (v_{atas}^2 - 200^2) \\times 300$$
$$2.000.000 = 0,6 \\times 300 \\times (v_{atas}^2 - 40.000)$$
$$2.000.000 = 180 \\times (v_{atas}^2 - 40.000)$$
$$11.111,11 = v_{atas}^2 - 40.000$$
$$51.111,11 = v_{atas}^2 \\implies v_{atas} = \\sqrt{51.111,11} \\approx 226,07 \\text{ m/s}$$
Udara di atas sayap harus ngebut 226 m/s agar Airbus raksasa ini tetap mantap tidak terhempas gravitasi!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Aliran pelapis sayap turbulensi *(Boundary Layer)* pesawat mengalami separasi pemutusan pusaran dari *trailing edge*. Model matematik koefisien gaya angkat $C_L$ dapat dirumuskan $C_L = 2 \\pi (\\alpha + \\alpha_0)$ di mana $\\alpha$ adalah *Angle of Attack* dalam radian. Sebuah drone layang ultra-ringan mematok $\\alpha = 0,05 \\text{ rad}$, $\\alpha_0 = 0,01 \\text{ rad}$, $\\rho_{u} = 1,25 \\text{ kg/m}^3$, luas sayap penampang $2 \\text{ m}^2$, berbobot 5 kg ($g=10$). Asumsi gaya angkat diprediksi standar dinamis: $F_L = \\frac{1}{2} \\rho v^2 A C_L$. Pada kecepatan $v$ berapakah (minimal jelajah *take-off* darat) drone udara ini bisa memijakkan rodanya lepas landas mendaki dari karpet beton basah?
**Penyelesaian:**
1. Hitung Koefisien Daya Angkat $C_L$:
$$C_L = 2 \\pi (0,05 + 0,01) = 2 \\pi (0,06) = 0,12\\pi$$
(gunakan nilai aproksimasi $\\pi \\approx 3,14 \\implies C_L \\approx 0,3768$).
2. Syarat lepas landas (*take-off*), gaya tarik vertikal minimal harus membasmi beban massa total:
$$F_L = m \\cdot g = 50 \\text{ N}$$
3. Masukkan daya angkat model aeronautik ekstrem:
$$50 = \\frac{1}{2} \\times 1,25 \\times v^2 \\times 2 \\times 0,3768$$
$$50 = 1,25 \\times 0,3768 \\times v^2$$
$$50 \\approx 0,471 \\times v^2$$
$$v^2 = \\frac{50}{0,471} \\approx 106,1$$
$$v = \\sqrt{106,1} \\approx 10,3 \\text{ m/s}$$
Alhasil, dengan sudut menengadah tak kentara 0,05 radian saja, asalkan meluncur dengan kelajuan kilat $10,3 \\text{ m/s}$, angin sayap berhasil meraih daya angkat mantap seratus persen unuk terbang merengkuh langit!
    `
    }
];
