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

## 4. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Seringkali kita merasa kedinginan saat menyentuh gagang pintu gagang logam dibandingkan saat menyentuh pintu kayunya, padahal keduanya berada di ruangan yang sama ber-AC selama berjam-jam. Apakah suhu gagang logam benar-benar lebih rendah dari pintu kayu tersebut?
**Penyelesaian:**
Secara **suhu objektif**, **TIDAK**. Karena berada di ruangan yang sama berjam-jam termal ekuilibrium terpenuhi (suhu logam = suhu kayu = suhu ruangan). Namun, tangan manusia tidak mendeteksi suhu absolut, melainkan kecepatan merambatnya kalor. Logam adalah konduktor panas yang luar biasa baik, jadi saat disentuh, logam merampas kalor dari tangan kita jauh lebih cepat daripada kayu (isolator). Hilangnya kalor secara menghentak di jari inilah yang diterjemahkan neuron otak sebagai rasa "dingin".

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Suhu tubuh normal manusia adalah sekitar 37°C. Berapa nilai suhu ini jika diukur oleh dokter yang terbiasa menggunakan skala termometer Fahrenheit dan ilmuwan yang memakai Kelvin?
**Penyelesaian:**
Konversi ke Fahrenheit:
$$^\\circ\\text{F} = \\left(\\frac{9}{5} \\times 37\\right) + 32 = 66,6 + 32 = 108,6^\\circ\\text{F}$$
*(Catatan: Rumus demam biasa di US adalah di atas 100°F).*
Konversi ke Kelvin (Suhu Mutlak):
$$K = 37 + 273,15 = 310,15 \\text{ K}$$

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Seorang ilmuwan menciptakan termometer skala baru bernama "Skala X". Ketika dicelupkan ke dalam es yang sedang mencair (pada tekanan 1 atm), termometer ini menunjukkan angka $-20^\\circ\\text{X}$. Ketika dicelupkan ke dalam air yang mendidih (1 atm), ia menunjuk angka $130^\\circ\\text{X}$. Pada hari yang sangat terik, BMKG melaporkan suhu udara menyentuh $40^\\circ\\text{C}$. Berapakah angka yang tertera di termometer skala X pada hari itu?
**Penyelesaian:**
Rentang suhu Celcius: $0^\\circ\\text{C}$ sampai $100^\\circ\\text{C}$ (selisih 100).
Rentang suhu X: $-20^\\circ\\text{X}$ sampai $130^\\circ\\text{X}$ (selisih $130 - (-20) = 150$).
Perbandingan interpolasi linear:
$$\\frac{T_C - T_{C,\\ min}}{T_{C,\\ max} - T_{C,\\ min}} = \\frac{T_X - T_{X,\\ min}}{T_{X,\\ max} - T_{X,\\ min}}$$
$$\\frac{40 - 0}{100 - 0} = \\frac{T_X - (-20)}{150}$$
$$\\frac{40}{100} = \\frac{T_X + 20}{150}$$
$$0,4 \\times 150 = T_X + 20$$
$$60 = T_X + 20 \\implies T_X = 60 - 20 = 40^\\circ\\text{X}$$
Wah, secara kebetulan pada saat suhu 40°C, termometer X juga menunjukkan angka 40°X!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Dua termometer identik raksa dikalibrasi berbeda: Skala Celcius ($^\\circ\\text{C}$) dan Skala Fahrenheit ($^\\circ\\text{F}$). Terdapat satu suhu ekstrem rahasia di mana angka pada layar digital skala Celcius bernilai tepat **sepertiga (1/3)** dari angka di layar Fahrenheit. Tentukanlah suhu berapakah terjadinya perbandingan langka ini (nyatakan dalam derajat Celcius), dan cek apakah pada suhu itu air berwujud es, cair, atau gas (uap)?
**Penyelesaian:**
Kita diberikan petunjuk rasio: $T_C = \\frac{1}{3} T_F$, atau $T_F = 3 T_C$.
Gunakan rumus konversi absolut keduanya:
$$T_C = \\frac{5}{9} (T_F - 32)$$
$$T_C = \\frac{5}{9} (3 T_C - 32)$$
Kalikan kedua ruas dengan 9:
$$9 T_C = 5 (3 T_C - 32)$$
$$9 T_C = 15 T_C - 160$$
$$160 = 15 T_C - 9 T_C$$
$$160 = 6 T_C$$
$$T_C = \\frac{160}{6} = \\frac{80}{3} \\approx 26,67^\\circ\\text{C}$$
Pada nilai sekitar **26,67°C** (suhu kamar normal tropis), di mana wujud air masih berbentuk **Cair (liquid)**. Coba tes, Fahrenheitnya: $\\frac{9}{5}(26,67) + 32 = 80^\\circ\\text{F}$. Memang benar $26,67 \\times 3 = 80$.
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

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Saat malam hari yang sunyi, asbes atap rumah atau pagar besi seringkali mengeluarkan bunyi "tuk-tuk" secara misterius, padahal tidak ada siapa-siapa di luar. Apakah ini peristiwa hantu? Jelaskan dengan Fisika!
**Penyelesaian:**
Sama sekali tidak horor! Ini adalah fenomena murni penyusutan termal (kebalikan dari pemuaian). Saat siang hari yang panas terik, jaring baja pada atap maupun pagar menyerap kalor dan memuai bertambah panjang. Begitu malam tiba dan suhu lingkungan merosot drastis turun, baja melepaskan kalor dan menyusut kembali ke ukuran aslinya. Karena ujung-ujung asbes/baja dipaku engsel kencang, pengerutan paksa itu membuat besi bergesekan mendadak menekan engsel yang bunyinya terekam jelas di kesepian malam sebagai "tuk-tuk".

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah rel kereta baja panjangnya $50 \\text{ m}$ pada saat dipasang di malam hari dengan suhu $20^\\circ\\text{C}$. Di siang bolong, terik mentari bisa memanggang aspal lintasan rel hingga suhunya tembus $50^\\circ\\text{C}$. Jika koefisien muai panjang baja $\\alpha = 1,2 \\times 10^{-5} /^\\circ\\text{C}$, berapakah pertambahan panjang batang rel tersebut di siang hari?
**Penyelesaian:**
$$\\Delta L = L_0 \\cdot \\alpha \\cdot \\Delta T$$
$$\\Delta L = 50 \\times (1,2 \\times 10^{-5}) \\times (50 - 20)$$
$$\\Delta L = 50 \\times 1,2 \\times 10^{-5} \\times 30$$
$$\\Delta L = 1500 \\times 1,2 \\times 10^{-5} = 1800 \\times 10^{-5} = 0,018 \\text{ m}$$
Rel memanjang sebesar 0,018 meter atau 1,8 milimeter (Inilah mengapa sambungan rel disisakan gap celah kecil agar tidak melengkung bertabrakan).

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Sebuah botol semprot parfum mewah dari kaca borosilikat ($\\alpha_{kaca} = 3 \\times 10^{-6} /^\\circ\\text{C}$) bervolume $100 \\text{ cm}^3$ pada suhu $20^\\circ\\text{C}$. Botol ini **dipenuhi meluber** dengan cairan alkohol harum murni padat (koefisien muai volume $\\gamma_{alkohol} = 110 \\times 10^{-5} /^\\circ\\text{C}$). Botol tersebut tidak sengaja tertinggal pada laci dasbor mobil yang terparkir langsung di bawah sengatan matahari selama 4 jam hingga suhunya tercatat mematangkan mencapai $60^\\circ\\text{C}$. Berapa mililiter volume parfum mahal tersebut yang akan muntah tumpah ruah keluar dari botol gelas kaca yang memuai tidak serempak?
**Penyelesaian:**
Pemuaian ini adalah selisih tumpang tindih muai ruang kaca membesar dikurangi cairan yang meledak ruah volume membesar.
Volume botol ($V_0$) dan parfum sama yaitu $100 \\text{ cm}^3$, $\\Delta T = 60 - 20 = 40^\\circ\\text{C}$.
1. Perlu diingat, untuk kaca karena berupa ruangan tiga dimensi: Koefisien volume benda padat $\\gamma_{kaca} = 3 \\times \\alpha = 3 \\times (3 \\times 10^{-6}) = 9 \\times 10^{-6} /^\\circ\\text{C}$.
2. Hitung volume tumpahan (Delta V cairan dikurangi Delta V kaca pelapis):
$$V_{tumpah} = \\Delta V_{cairan} - \\Delta V_{kaca}$$
$$V_{tumpah} = V_0 \\cdot \\Delta T \\cdot (\\gamma_{alkohol} - \\gamma_{kaca})$$
$$V_{tumpah} = 100 \\times 40 \\times (1.100 \\times 10^{-6} - 9 \\times 10^{-6})$$
$$V_{tumpah} = 4000 \\times (1.091 \\times 10^{-6})$$
$$V_{tumpah} = 4.364.000 \\times 10^{-6} = 4,364 \\text{ cm}^3 \\text{ (atau mililiter)}$$
Sekitar 4,3 mL parfum terbuang merembes sia-sia.

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Sebuah pendulum kubus masif yang berdimensi amat besar terbuat dari material seng padat dengan panjang rusuk diukur $s_0$ pada suhu ruang harian referensi $T_0$. Karena perancangan amat sangat terisolasi ekstrim misal di kawah meteor terik Venus, pendulum bersuhu luar biasa tinggi yang membengkak luas dan tebalnya tak menentu. Tunjukkan bahwa jika kubus dipanaskan sampai titik $\\Delta T$ tertentu yang rawan, perbandingan fraksional **Peningkatan Luas Permukaan** dengan **Peningkatan Volume** mutlak (aproksimasi binomial) bergantung asimtotis dengan nilai $\\frac{3}{2}$ tebal awal sisinya tanpa melibatkan suhu kalibrasi absolutnya secara signifikan!
**Penyelesaian:**
Luas permukaan awal kubus: $A_0 = 6 \\cdot s_0^2$.
Volume awal kubus: $V_0 = s_0^3$.
Pemuaian luas sisi kubus ($\\beta = 2\\alpha$):
$\\Delta A = A_0 \\cdot 2\\alpha \\cdot \\Delta T = 6 \\cdot s_0^2 \\cdot 2\\alpha \\cdot \\Delta T = 12 s_0^2 \\cdot \\alpha \\cdot \\Delta T$.
Pemuaian volume kubus raksasa ($\\gamma = 3\\alpha$):
$\\Delta V = V_0 \\cdot 3\\alpha \\cdot \\Delta T = s_0^3 \\cdot 3\\alpha \\cdot \\Delta T$.
Lalu kita cari rasio perbandingan keduanya eksak:
$$\\frac{\\Delta V}{\\Delta A} = \\frac{3 s_0^3 \\alpha \\Delta T}{12 s_0^2 \\alpha \\Delta T}$$
$$\\frac{\\Delta V}{\\Delta A} = \\frac{3}{12} \\times \\frac{s_0^3}{s_0^2} = \\frac{1}{4} s_0$$
Ternyata rasio perturbasi dimensi makro dari pendulum itu bernilai tetap mutlak $0,25 s_0$ jika kita meninjau selisih nilai murni meter perseginya, murni linier dengan ukuran geometri awal tanpa terpengaruh oleh besaran fluktuasi interstelarnya ($\\Delta T$)!
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

## 5. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Angin laut selalu berhembus menyejukkan pesisir pantai di siang hari bolong yang terik. Mengapa arah aliran angin selalu terjadi spontan merambak dari arah perairan laut dalam menuju ke hamparan daratan pantai, bukan sebaliknya?
**Penyelesaian:**
Ini membuktikan mekanisme perpindahan kalor tipe **Konveksi Alamiah**. Di siang hari, padatan pasir/tanah daratan lebih dominan rakus mendidih menyerap kalor radiasi matahari, menyebabkan lapisan atmosfer persis di atas daratan memuai, densitasnya turun jadi ringan, dan terangkat vertikal ke awan biru. Tekanan udara panas kosong di dataran tersedot diisi buru-buru oleh stok gas cadangan udara sejuk basah yang mendem berat berdiam tenang menaungi laut. Injeksi udara sejuk berlari membantai mengisi ruang hampa ini terasa menyapu dahi kita sebagai embusan angin laut yang mendamaikan jiwa.

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah kompor merebus $500 \\text{ gram}$ ($0,5 \\text{ kg}$) air pegunungan bersuhu $25^\\circ\\text{C}$ hingga mendidih membulak pada suhu $100^\\circ\\text{C}$. Jika kalor jenis air murni $c_{air} = 4.200 \\text{ J/kg}^\\circ\\text{C}$, berapakah takaran energi kalor (Joule) total yang di-infuskan kompor ke dalam panci tanpa sisa isolasi hambatan?
**Penyelesaian:**
Kalor serap ($Q$) dengan massa jenis langsung:
$$Q = m \\cdot c \\cdot \\Delta T$$
$$Q = 0,5 \\times 4.200 \\times (100 - 25)$$
$$Q = 2.100 \\times 75 = 157.500 \\text{ Joule} = 157,5 \\text{ kJ}$$
Energi sebesar ini cukup untuk membakar kalori segelas manis bobba instan di saluran pencernaan lambung.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Ibu meminum segelas susu hangat favoritnya $M_{susu} = 200 \\text{ gram}$ pada suhu $80^\\circ\\text{C}$ yang baru mendidih diaduk (kalor jenis susu setara air $c \\approx 1 \\text{ kal/g}^\\circ\\text{C}$). Mengingat lidahnya sangat alergi melepuh luka panas, dia memecahkan balok es kristal koktail kulkas bermassa $M_{es} = 50 \\text{ gram}$ pada kedinginan murni $0^\\circ\\text{C}$, langsung tenggelam dijatuhkan utuh ke gelas susu lantas dia diamkan hingga es kristal musnah cair selaras. Jika kalor lebur diam es adalah konstan $L_{es} = 80 \\text{ kal/gram}$, di suhu berapakah tegakan susu ini bisa diteguk mantap Ibu?
**Penyelesaian:**
Asas Black! Di kubu *Panas*: Susu merosot melepaskan kalor. Di kubu *Dingin*: Es bukan hanya memanaskan diri, dia WAJIB bayar utang "kalor lebur" dulu untuk menyulap badan bekunya pecah padat menjadi wujud cair di lautan susu itu.
$$Q_{lepas} = Q_{serap}$$
$$Q_{susu\\ dingin} = Q_{lebur\\ es} + Q_{air\\ es\\ naik}$$
$$m_s \\cdot c_s \\cdot (T_s - T_a) = (m_{es} \\cdot L_{es}) + m_{es} \\cdot c_{air} \\cdot (T_a - T_0)$$
$$200 \\times 1 \\times (80 - T_a) = (50 \\times 80) + 50 \\times 1 \\times (T_a - 0)$$
$$16.000 - 200 T_a = 4.000 + 50 T_a$$
Pindahkan $T_a$ semua saling memeluk ke kanan:
$$16.000 - 4.000 = 200 T_a + 50 T_a$$
$$12.000 = 250 T_a$$
$$T_a = \\frac{12.000}{250} = 48^\\circ\\text{C}$$
Susu coklat sempurna dengan kehangatan peluk termal 48°C tersaji mantap tanpa menodai lidah!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Cangkir radiator baja pendingin disepuh dua jenis lempeng plat lapis kembar bertumpuk koaksial A dan B. Konduktivitas termal material logaritma $A$ bernilai meriam 3 kali lebih bengis ganas merambat lambung $B$ ($k_A = 3k_B$). Ketebalan lempeng pelapis tembaga $A$ dua pertiga memakan daging plat seng $B$ ($L_A = \\frac{2}{3}L_B$). Terdapat tungku pijar ujung plat A disambar hawa setan meronta $200^\\circ\\text{C}$ dan ujung plat kutub B menapak cium lautan es membeku $0^\\circ\\text{C}$. Anggap luas irisan keping kembar koaksial ini pasak absolut setara. Hitunglah suhu tempel mematikan (Temperature Junction) yang terukir pedih di batas sempit tepat di mana kulit logam keping A direkatkan beringas lengket di dada plat pelindung es B!
**Penyelesaian:**
Syarat Konduksi Lapis Seri Tunggal (Laju aliran kalor wajib statis menerbangkan keping A mampir antre ke peron keping B): $H_A = H_B$.
Batas Suhu Menempel = $T_x$.
$$\\frac{k_A \\cdot A_{area} \\cdot (T_{api} - T_x)}{L_A} = \\frac{k_B \\cdot A_{area} \\cdot (T_x - T_{es})}{L_B}$$
Coret Luas pelindung ($A_{area}$ sama mutlak menempel tumpuk):
$$\\frac{(3k_B)(200 - T_x)}{(\\frac{2}{3}L_B)} = \\frac{k_B(T_x - 0)}{L_B}$$
Amankan singkir $k_B$ dan $L_B$:
$$\\frac{3(200 - T_x)}{\\frac{2}{3}} = T_x$$
Banting peluru matriks membagi pecahan di ruas bawah dengan dikalikan terbalik naik membumbung:
$$3 \\times \\frac{3}{2} \\times (200 - T_x) = T_x$$
$$\\frac{9}{2} (200 - T_x) = T_x$$
Kalikan kepingan pertarungan dengan 2 semua bebas belenggu pecahan:
$$9 (200 - T_x) = 2 T_x$$
$$1800 - 9 T_x = 2 T_x$$
$$1800 = 11 T_x$$
$$T_x = \\frac{1800}{11} \\approx 163,63^\\circ\\text{C}$$
Luar biasa ngeri, plat penyekat tipis berwujud es ternyata tak sanggup mendinginkan gerbang masuk tembaga. Sendi rekatan sambungannya terbakar matang di atas $160^\\circ\\text{C}$ memanggil neraka kalor.
    `
    },
];
