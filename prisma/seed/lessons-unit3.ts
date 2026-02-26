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

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Pernahkah kamu melihat suporter sepak bola melakukan gerakan "Mexican Wave" mendadak di stadion? Ribuan orang berdiri dan duduk bergantian, menciptakan gelombang raksasa yang mengitari tribun. Berdasarkan jenis arah getarannya, termasuk gelombang apakah ini?
**Penyelesaian:**
Ini adalah contoh **Gelombang Transversal**. Mengapa? Karena arah gangguan/getaran suporter adalah naik-turun (berdiri lalu duduk tegak lurus lantai), sementara jalar riak gelombangnya bergerak menyamping (horizontal) mengitari seluruh tribun stadion. 

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah stasiun pemantau tsunami laut mendeteksi gelombang transversal dengan jarak antara dua puncak yang berdekatan sejauh 12 meter. Gelombang tersebut memerlukan waktu 4 detik untuk melakukan satu getaran penuh. Hitunglah cepat rambat gelombang tsunami miniatur ini!
**Penyelesaian:**
Diketahui $\lambda = 12 \text{ m}$ dan periode $T = 4 \text{ s}$.
$$v = \frac{\lambda}{T} = \frac{12}{4} = 3 \text{ m/s}$$
Gelombang laut tersebut menjalar secepat 3 m/s.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Kabel listrik PLN tegangan tinggi membentang di antara dua tiang yang berjarak 60 meter. Tiba-tiba ada burung mendarat kuat dan memicu gelombang berjalan bolak-balik. Waktu yang dibutuhkan denyut gelombang untuk merambat dari tiang satu ke tiang lainnya adalah 1,5 detik. Jika berat tegang kabel sebesar 2.000 N, hitunglah frekuensi gelombangnya jika panjang satu gelombang penuh terukur sejauh 5 meter!
**Penyelesaian:**
Kecepatan rambat sinyal kabel:
$$v = \frac{s}{t} = \frac{60}{1,5} = 40 \text{ m/s}$$
Mencari Frekuensi dengan $v = \lambda \cdot f$:
$$40 = 5 \cdot f \implies f = \frac{40}{5} = 8 \text{ Hz}$$

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Seutas tali panjang horizontal digetarkan sehingga menghasilkan ujung gelombang dengan persamaan $y = 0,05 \sin \pi (8t - 2x)$, di mana $y$ dan $x$ dalam meter, dan $t$ dalam sekon. Tiga partikel di tali tersebut: Partikel A di $x=0$, Partikel B di $x=0,125 \text{ m}$, dan Partikel C di $x=0,25 \text{ m}$. Pada waktu $t=0,5 \text{ s}$, tentukan beda sudut fase antara partikel A dan C, lalu hitung rasio percepatan partikel B terhadap amplitudo getar maksimalnya!
**Penyelesaian:**
Persamaan gelombang $y = 0,05 \sin(8\pi t - 2\pi x)$.
1. Beda sudut fase $\Delta \phi$ antara A ($x=0$) dan C ($x=0,25$):
$$\Delta \phi = k \cdot \Delta x = 2\pi \times (0,25 - 0) = 2\pi \times \frac{1}{4} = \frac{\pi}{2} \text{ radian } (90^\circ)$$
2. Percepatan simpangan $a = -\omega^2 y$:
Di mana percepatan maksimum $a_{maks} = |-\omega^2 A|$.
Rasio $\frac{a_B}{a_{maks}} = \frac{-\omega^2 y_B}{\omega^2 A} = -\frac{y_B}{A}$.
Hitung simpangan patikel B pada $t=0,5 \text{ s}$ dan $x=0,125$:
$$y_B = 0,05 \sin \left(8\pi(0,5) - 2\pi(0,125)\right)$$
$$y_B = 0,05 \sin(4\pi - 0,25\pi) = 0,05 \sin(3,75\pi)$$
Sudut $3,75\pi$ setara dengan $-0,25\pi$ atau $-45^\circ$.
$$\sin(-45^\circ) = -\frac{1}{2}\sqrt{2} \approx -0,707$$
$$y_B = 0,05 \times (-0,707) \approx -0,0353$$
Rasio $= -\left(\frac{y_B}{A}\right) = -\left(\frac{-0,0353}{0,05}\right) = 0,707 = \frac{1}{2}\sqrt{2}$
Percepatan B sedang berada di $\approx 70,7\%$ dari batas maksimumnya.
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

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Pernahkah kamu menghirup gas helium dari balon pesta lalu suaramu tiba-tiba berubah cempreng seperti kartun Chipmunk? Mengapa fenomena ini tidak berhubungan dengan pita suaramu yang menyusut?
**Penyelesaian:**
Gas helium sangat ringan, memiliki massa jenis jauh lebih kecil dari gas nitrogen/oksigen di udara. Dalam medium gas yang ekstrem renggang, kecepatan rambat bunyi melonjak jauh lebih lambat (sebenarnya rambatnya hampir 3x lebih cepat, jadi $v$ naik tajam!). Karena rongga mulut dan leher kita panjang rahangnya tetap otomatis ($L$ sama), dan $f = v / \lambda$, lonjakan lambat gelombang menyebabkan frekuensi resonansi melonjak drastis yang membuat nada suaranya sangat tinggi/cempreng.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah sirine tanda bahaya memancarkan bunyi dengan nada dominan frekuensi $1.700 \text{ Hz}$. Jika kecepatan rambat gelombang bunyi di malam hari yang dingin itu adalah $340 \text{ m/s}$, berapakah panjang gelombang dari bunyi sirine tersebut?
**Penyelesaian:**
$$v = \lambda \cdot f \implies \lambda = \frac{v}{f}$$
$$\lambda = \frac{340}{1700} = \frac{1}{5} = 0,2 \text{ m} = 20 \text{ cm}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Kereta cepat melesat kencang menyalakan klakson dengan frekuensi $900 \text{ Hz}$ menempuh rute padat. Seseorang yang sedang duduk di stasiun mendengar klakson tersebut berubah menjadi $1.000 \text{ Hz}$ saat kereta mendekat dari jauh. Jika kecepatan suara di udara adalah $340 \text{ m/s}$, berapakah perkiraan laju kilometer per jam kereta cepat tersebut?
**Penyelesaian:**
Gunakan Efek Doppler pendengar diam ($v_p = 0$) dan sumber mendekat (Tanda - pembagi):
$$f_p = f_s \left( \frac{v}{v - v_s} \right)$$
$$1000 = 900 \left( \frac{340}{340 - v_s} \right)$$
$$\frac{10}{9} = \frac{340}{340 - v_s}$$
$$10(340 - v_s) = 9 \times 340$$
$$3400 - 10 v_s = 3060$$
$$10 v_s = 3400 - 3060 = 340$$
$$v_s = 34 \text{ m/s}$$
Konversi ke km/jam:
$v_s = 34 \times 3,6 = 122,4 \text{ km/jam}$.

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Sebuah garpu tala bergetar di mulut tabung resonansi vertikal. Perlahan-lahan air dituangkan ke dalam tabung. Resonansi keras pertama kali terdengar saat ketinggian udara di dalam tabung sepanjang $L_1 = 20 \text{ cm}$. Resonansi kedua memekakkan telinga terdengar lagi saat kita mengurangi ketinggian udara dengan memompa airnya hingga $L_2 = 60 \text{ cm}$. Terdapat bocoran kejelasan teori ujung bebas bahwa ada koreksi ujung bebas (*end correction* $\Delta L$) yang presisi. Hitunglah koreksi ujung bebas tabung tersebut dan frekuensi pasti garpu tala jika $v_{udara} = 340 \text{ m/s}$!
**Penyelesaian:**
Pada tabung terbuka sebelah (Pipa Organa Tertutup Air), resonansi ganjil berurutan:
Resonansi 1 (Nada Dasar $n=0$): $\frac{1}{4} \lambda = L_1 + \Delta L \dots (1)$
Resonansi 2 (Nada Atas Pertama $n=1$): $\frac{3}{4} \lambda = L_2 + \Delta L \dots (2)$
Kurangkan (2) dengan (1):
$$\frac{2}{4} \lambda = L_2 - L_1 = 60 - 20 = 40 \text{ cm}$$
$$\frac{1}{2} \lambda = 40 \implies \lambda = 80 \text{ cm} = 0,8 \text{ m}$$
Sekarang hitung $f$ garpu tala:
$$f = \frac{v}{\lambda} = \frac{340}{0,8} = 425 \text{ Hz}$$
Sekarang cari koreksi ujung bebas $\Delta L$:
$$\frac{1}{4} (80 \text{ cm}) = 20 \text{ cm} + \Delta L$$
$20 = 20 + \Delta L \implies \Delta L = 0 \text{ cm}$.
Ternyata koreksi ujung bebas nilainya mutlak nol koma pada setup eksperimen absolut ini.
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

## 4. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Saat malam berhujan lebat melaju di jalan tol, tumpahan lapisan tipis bensin dari bocoran sebuah bus terlihat di aspal membias jadi warna-warni cantik memukau bagai pelangi tersingkap lampu depan genangan basah. Mengapa terjadi demikian?
**Penyelesaian:**
Ini dinamakan **Interferensi Selaput Tipis**. Lapisan bensin amat dangkal memantulkan gelombang cahaya dari batas lapis luar bensin dan pantul balik dari air di bawahnya secara presisi orde nano. Akibat deviasi ketebalan mikroskopis, beberapa spektrum warna cahaya (seperti biru dan merah) saling tumpang tindih secara konstruktif (saling menguatkan satu sama lain), menciptakan pita warna asimetris di mata kita!

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah difraksi celah ganda Young memiliki jarak antarkisi sebesar $0,2 \text{ mm}$. Jarak layar proyeksi sejauh $1,5 \text{ m}$ dari celah sempit itu. Memancarkan cahaya hijau laser dan menciptakan beda jalur terang pusat ke terang pertama sebesar $4 \text{ mm}$. Berapakah muatan panjang gelombang nanometer cahaya hijau itu?
**Penyelesaian:**
Diketahui: $d = 0,2 \text{ mm} = 2 \times 10^{-4} \text{ m}$, $L = 1,5 \text{ m}$, $y_1 = 4 \text{ mm} = 4 \times 10^{-3} \text{ m}$, orde utama $n=1$.
$$y_n = \frac{n \times \lambda \times L}{d}$$
$$4 \times 10^{-3} = \frac{1 \times \lambda \times 1,5}{2 \times 10^{-4}}$$
$$4 \times 10^{-3} \times 2 \times 10^{-4} = 1,5 \lambda$$
$$8 \times 10^{-7} = 1,5 \lambda$$
$$\lambda = \frac{8}{1,5} \times 10^{-7} = 5,33 \times 10^{-7} \text{ m} = \textbf{533 nm}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Astronom amatir menatap bintang Sirius. Teropong teleskop reflektor portabel yang dia beli mengidap kendala Daya Urai Optik berlubang aperture 5 cm (Diameter D). Cahaya rona tengah malam meramban di sekitar 500 nm ($\lambda$). Jika dia menatap sistem konstelasi dua kawah di Bulan (jaraknya $380.000 \text{ km}$ dari Bumi), berapakah selisih panjang terdekat dua kawah bulan itu yang masih membaur pas batas sanggup dibedakan di lensa teleskop ini (Kriteria Rayleigh)?
**Penyelesaian:**
Sudut resolusi minimum (Daya Urai Kriteria Rayleigh):
$$\theta_m = 1,22 \frac{\lambda}{D}$$
$$\theta_m = 1,22 \times \frac{500 \times 10^{-9}}{0,05} = 1,22 \times 10^{-5} \text{ rad}$$
Rasio jarak minimum benda $d_m$ dibanding jarak Bulan ke Bumi $L$:
$$\theta_m = \frac{d_m}{L}$$
$$1,22 \times 10^{-5} = \frac{d_m}{380.000 \times 10^3 \text{ m}}$$
$$d_m = 1,22 \times 10^{-5} \times 3,8 \times 10^8 = 4,636 \times 10^3 \text{ m} = \textbf{4.636 meter}$$
Kawah di bulan harus bernilai selebar minimal ~4,6 km jarak dempetnya sebelum bisa diobservasi utuh!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Seberkas sinar putih alami jatuh tegak lurus mengarah pada kisi difraksi ultra renggang berkisar 5.000 goresan per cm. Di antara seluruh pancaran spektrum yang diterawang di sudut bentang layar, analisislah batas visibilitas irisan spektrum kasat mata kuning-hijau (dengan panjang pita $\lambda=550 \text{ nm}$) pada Orde $n=3$ ditintakan oleh kohesivitas Orde $n=4$ ungu ultra renggang ($\lambda=400 \text{ nm}$). Mungkinkah mata kita melihat dua warna ini tumpang tindih presisi padu di sudut difraksi ($\theta$) yang serupa?
**Penyelesaian:**
Jarak per goresan kisi $d = \frac{1}{N}$:
$$d = \frac{1}{5.000} \text{ cm} = 2 \times 10^{-4} \text{ cm} = 2 \times 10^{-6} \text{ m}$$
Cek sudut difraksi sinar terang orde ke-n:
$$d \sin \theta = n \lambda \implies \sin \theta = \frac{n \lambda}{d}$$
Umpan kuning-hijau pada orde 3 ($n=3, \lambda = 550 \text{ nm} = 5,5 \times 10^{-7} \text{ m}$):
$$\sin \theta_3 = \frac{3 \times 5,5 \times 10^{-7}}{2 \times 10^{-6}} = \frac{16,5 \times 10^{-7}}{20 \times 10^{-7}} = \frac{16,5}{20} = 0,825$$
Umpan ungu pada orde 4 ($n=4, \lambda = 400 \text{ nm} = 4 \times 10^{-7} \text{ m}$):
$$\sin \theta_4 = \frac{4 \times 4 \times 10^{-7}}{2 \times 10^{-6}} = \frac{16 \times 10^{-7}}{20 \times 10^{-7}} = \frac{16}{20} = 0,8$$
Kesimpulan $\sin \theta_3 \neq \sin \theta_4$ (karena $0,825 \neq 0,8$).
Posisi spektrum orde-4 ungu **tidak berhimpit secara linier** persis dengan orde-3 hijau-kuning! Warna tersebut akan terlihat beda posisi deviasi terpisah jauh.
    `
    },
];
