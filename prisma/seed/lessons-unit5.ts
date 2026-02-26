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

## 4. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Sebuah ketel panci presto tebal berbahan die-cast aluminium ditutup rapat lalu dipanaskan dengan api kompor beringas. Panci tersebut tidak mengizinkan sedetik pun udara tumpah ruah keluar ataupun mengembang ukurannya secara fisik. Bagaimana Hukum I Termodinamika menganalisis ke mana perginya ribuan Joule energi dari kompor tersebut?
**Penyelesaian:**
Karena gas tidak bisa mengembang (Volume Konstan / Isokhorik), maka **gas tidak melakukan Usaha sama sekali** ($W = 0$).
Berdasarkan Hukum I ($\\Delta U = Q - W$):
$$\\Delta U = Q - 0 \\implies \\Delta U = Q$$
Artinya, **100% dari seluruh hantaman kalor api kompor** ($Q$) digunakan secara lurus total untuk mendongkrak **Energi Dalam gas** ($\\Delta U$), yang segera bergejolak menaikkan suhu dan tekanan panci hingga batasan ledaknya sebelum sumbat pengaman berbunyi bersiul bising melepaskan tekanan uap!

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sistem gas ideal monoatomik dalam silinder dipanaskan dari luar hingga menyerap kalor sebesar $1.500 \\text{ J}$. Gas tersebut memuai dan mendorong piston berat sejauh membebaskan usaha senilai $800 \\text{ J}$ ke lingkungan. Berapakah lonjakan energi dalam sistem gas tersebut?
**Penyelesaian:**
Hukum I Termodinamika: $\\Delta U = Q - W$.
Karena sistem **menyerap kalor**, maka $Q = +1500 \\text{ J}$.
Karena sistem **melakukan usaha**, maka $W = +800 \\text{ J}$.
$$\\Delta U = 1500 - 800 = 700 \\text{ J}$$
Energi dalam sistem bertambah sebesar 700 Joule.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Dalam silinder mesin diesel sebuah truk tambang besar, sebuah piston memamapatkan paksa 0,5 mol udara (dianggap gas ideal diatomik bernilai derajat kebebasan $f=5$) dari volume lapang 12 Liter menjadi volume sesak mampat 4 Liter pada tekanan isobarik konstan $\\sim 10$ atm ($1 \\text{ atm} = 101.300 \\text{ Pa}$). Karena pendinginan radiator canggih ekstra cepat, mesin diesel ini pada siklus itu sukses membuang kalor ke knalpot menara sebesar $12.000 \\text{ Joule}$. Hitunglah perubahan suhu campuran kabut solar tersebut! ($R = 8,314 \\text{ J/(mol}\\cdot\\text{K)}$).
**Penyelesaian:**
1. Hitung Usaha saat Kompresi (Volume turun, $W$ negatif):
$$W = P \\cdot \\Delta V = 10 \\times 101.300 \\times (4 - 12) \\times 10^{-3} \\text{ m}^3$$
$$W = 1.013.000 \\times (-0,008) = -8.104 \\text{ Joule}$$ (Sistem menerima usaha).
2. Sistem Membuang kalor ($Q$ negatif):
$$Q = -12.000 \\text{ J}$$
3. Hitung $\\Delta U$ dengan Hukum I:
$$\\Delta U = Q - W = -12.000 - (-8.104) = -12.000 + 8.104 = -3.896 \\text{ Joule}$$
4. Hubungkan $\\Delta U$ dengan suhu (Gas Diatomik, $f=5$):
$$\\Delta U = \\frac{5}{2} n R \\Delta T$$
$$-3.896 = \\frac{5}{2} (0,5) (8,314) \\Delta T$$
$$-3.896 = 2,5 \\times 0,5 \\times 8,314 \\times \\Delta T = 10,3925 \\times \\Delta T$$
$$\\Delta T = \\frac{-3.896}{10,3925} \\approx -374,8 \\text{ K}\\text{ (atau }^\\circ\\text{C)}$$
Truk raksasa secara fantastis memelorotkan suhu $375^\\circ\\text{C}$ dalam sekejap kompresi injeksi berkat buangan kalor masif di siklus ini luar biasa!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Suatu sistem termodinamis 2 mol gas Helium ($\\gamma = \\frac{5}{3}$) menjalani siklus sirkular searah jarum jam A $\\rightarrow$ B $\\rightarrow$ C $\\rightarrow$ A pada diagram Tekanan ($P$) vs Volume ($V$).
- Titik A: $(2 \\text{ m}^3, 100 \\text{ kPa})$
- Titik B: $(4 \\text{ m}^3, 100 \\text{ kPa})$
- Titik C: $(4 \\text{ m}^3, 50 \\text{ kPa})$
Asumsikan trajektori balik lintasan dari C kembali ke titik start A berupa **garis lurus miring murni** bergradien diagonal miring di plot P-V. Hitunglah energi kalor rasio *netto* ($Q_{net}$) selama satu putaran siklus penuh dan pastikan apakah diagram ini berlaku selayaknya Mesin Kalor (membantu) atau Mesin Pendingin (membebani resapan)?
**Penyelesaian:**
Untuk siklus utuh yang tertutup (kembali merapat ke titik start), selisih state awal dan akhir adalah nol, alias temperatur sama rupa, sehingga pertambahan energi dalam netto dalam satu putaran adalah NOL mutlak: $\\Delta U_{siklus} = 0$.
Hukum I mendaulat: $\\Delta U_{siklus} = Q_{net} - W_{net} = 0$, artinya $Q_{net} = W_{net}$.
Jadi untuk memecat nilai kalor netto putaran, kita cukup menghitung Luas Area Bangun Datar yang dilingkupi siklus murni!
Tiga titik graf tersebut:
A(2, 100)
B(4, 100) → Garis A-B Isobarik datar mendatar (Lebar 2)
C(4, 50) → Garis B-C Isokhorik anjlok tegak (Tinggi 50)
Garis C ke A kembali berbentuk miring lurus, menutup area tersebut dan takdirnya membentuk **Segitiga Siku-siku**!
Luas Segitiga P-V:
$$W_{net} = \\frac{1}{2} \\times \\text{Alas} \\times \\text{Tinggi}$$
$$W_{net} = \\frac{1}{2} \\times \\Delta V_{AB} \\times \\Delta P_{BC}$$
$$W_{net} = \\frac{1}{2} \\times (4 - 2) \\text{ m}^3 \\times (100 - 50) \\text{ kPa}$$
$$W_{net} = \\frac{1}{2} \\times 2 \\times 50 \\text{ kPa} \\cdot \\text{m}^3 = 50 \\text{ kJ}$$
Karena perputaran area siklus bersifat ke kanan maju layaknya jam (searah jarum jam = Ekspansi mendatar lebih tinggi derajat usahanya dari Kompresi balik miring C-A), maka W adalah POSITIF.
Artinya $Q_{net} = +50 \\text{ kJ}$. Karena kalor sistem bernilai positif, mesin ini adalah reaktor pendorong Mesin Kalor ideal yang menyumbangkan energi $50.000 \\text{ Joule}$ usai sekali melingkar!
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

## 5. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Pernahkah kamu memompa ban sepeda dengan pompa tangan tabung silinder konvensional? Ketika kamu menekan gagang tuasnya rapat-rapat kuat secepat kilat (sangat cepat hitungan sepersekian detik), pangkal ujung tabung pompa itu sekilas teraba lekas panas seketika! Kenapa begitu? Proses termodinamika apa yang terjadi dadakan begini?
**Penyelesaian:**
Ini dinamakan **Proses Adiabatik** mendadak. Udara di dalam tangki tidak sempat bertukar kalor santai atau membocorkan nafas ke dinding luar karena kamu memampatkannya (mengkompresinya) kelewat cepat bagai kilat kilas ($Q=0$). Karena kamu secara mekanikal *MEMBERI USAHA* yang amat sadis ke gas pompa, maka $-\\Delta U = W_{kompresi}$, energi kinetik partikel membengkak beringas tanpa jalan keluar, mendongkrak suhunya menjadi gila gilaan panas dalam tempo nol detik!

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah gas ideal bervolume $4 \\text{ Liter}$ ditekan perlahan-lahan di dalam piston pada suhu konstan yang amat sangat dijaga ekuilibrium lamban $27^\\circ\\text{C}$ hingga merangkak mengerut memadat menjadi volume sempit $1 \\text{ Liter}$. Jika usaha mekanikal paksa yang wajib dikerahkan dari tangan hidrolik luas eksternal adalah senilai $5.500 \\text{ Joule}$, berapakah nilai pelepasan kalor lingkungan proses tersebut? ($\\ln 4 = 1,386$)
**Penyelesaian:**
Kata kunci: **Suhu Konstan (Isotermal)**. Maka $\\Delta U = 0$, artinya Hukum I menyumbat perlawanan menjadi murni $Q = W$.
Karena volume menyusut/ditekan, sistem gas **Menerima Usaha** dari sistem luar. Konvensi tanda: $W = -5.500 \\text{ J}$.
Oleh sebab $Q = W$, maka $Q = -5.500 \\text{ J}$.
Tanda negatif mutlak mengartikan bahwa gas secara telaten membocorkan (Melepas/Membuang) kalor pendingin sebesar $5.500 \\text{ Joule}$ ke lingkungan udara sekitarnya agar suhunya stabil tidak menderita meledak panas selama terus dijepit kencang.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Seorang ilmuwan mengisi tabung piston isobarik berlapis dinding isolator dengan $5 \\text{ mol}$ gas Neon murni (monoatomik) bersuhu sejuk $20^\\circ\\text{C}$ di padang salju bertekanan persis 1 atmosfer standar. Piston hidrolik itu lalu dibiarkan mengisap asupan pelebur batubara sebesar $3.117 \\text{ Joule}$ secara lamban bertahap menjaga kestabilannya. Hitunglah usaha muai (Work done) mekanik yang sanggup dicambuk gas Neon mulia tersebut mendesak tuas engkol tersebut melengkak naik! ($R = 8,314 \\text{ J/(mol}\\cdot\\text{K)}$)
**Penyelesaian:**
Proses bertekanan sama: **Isobarik**. Perbedaan Usaha dan Kalor gas monoatomik adalah membelah $C_p$ (Kapasitas tekanan).
Untuk gas monoatomik:
Energi Dalam: $\\Delta U = \\frac{3}{2} n R \\Delta T$.
Usaha Berekspansi: $W = P \\cdot \\Delta V = n R \\Delta T$.
Kalor Masuk Isobarik: $Q = \\Delta U + W = \\frac{3}{2} n R \\Delta T + \\frac{2}{2} n R \\Delta T = \\frac{5}{2} n R \\Delta T$.
Mencari nilai kombo misteri pelik perkalian $(n R \\Delta T)$ tanpa butuh mengukur suhunya:
$$\\frac{5}{2} (n R \\Delta T) = Q \\implies (n R \\Delta T) = \\frac{2}{5} Q$$
Usaha Gas mendesak:
$$W = (n R \\Delta T) = \\frac{2}{5} \\times 3.117 = 0,4 \\times 3.117 = 1.246,8 \\text{ Joule}$$
Tuas mekanik dikatrol paksa ke udara mencungkel usaha murni $1,24 \\text{ kJ}$ energi potensial!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Sepasang kubus mesin identik berpelindung baja gahar memuat masing-masing gas diatomik Nitrogen (A) dan gas monoatomik Argon (B), mulanya asik tidur bersanding rileks berdampingan tepat pada sepasang suhu awal mutlak berseri $T_0$ dan volume seragam $V_0$. Mendadak tuas pelatuk raksasa menginterupsi Adiabatik Ekspansi Cepat menyentak mereka secara hampa panas menuju ekstensi pelonggaran ruang tiga lipat sejagat ($V_f = 3V_0$). Tentukan rasio perbandingan fraksional eksak (desimal murni) suhu pasca-kaget mesin Nitrogen versus Mesin Argon, manakah termometer yang anjlok paling brutal krisis dingin?
**Penyelesaian:**
Hukum Proses Adiabatik meronta: $T \\cdot V^{\\gamma - 1} = \\text{Konstan}$.
Atau $T_f = T_0 \\left( \\frac{V_0}{V_f} \\right)^{\\gamma - 1}$.
Gas Nitrogen (Diatomik) $\\implies f = 5 \\implies \\gamma_A = \\frac{C_p}{C_v} = \\frac{7}{5} = 1,4$.
Gas Argon (Monoatomik) $\\implies f = 3 \\implies \\gamma_B = \\frac{C_p}{C_v} = \\frac{5}{3} \\approx 1,67$.
Suhu akhir Nitrogen $T_A$:
$$T_A = T_0 \\left( \\frac{1}{3} \\right)^{1,4 - 1} = T_0 \\left( \\frac{1}{3} \\right)^{0,4} = T_0 \\cdot 3^{-0,4}$$
Suhu akhir Argon $T_B$:
$$T_B = T_0 \\left( \\frac{1}{3} \\right)^{\\frac{5}{3} - 1} = T_0 \\left( \\frac{1}{3} \\right)^{\\frac{2}{3}} = T_0 \\cdot 3^{-0,667}$$
Mencari rasio kubu perbandingan:
$$\\frac{T_A}{T_B} = \\frac{T_0 \\cdot 3^{-0,4}}{T_0 \\cdot 3^{-2/3}} = \\frac{3^{-2/5}}{3^{-2/3}}$$
Gunakan sifat murni pangkat: $x^a / x^b = x^{a-b}$.
$$\\frac{T_A}{T_B} = 3^{-\\frac{2}{5} - (-\\frac{2}{3})} = 3^{-\\frac{6}{15} + \\frac{10}{15}} = 3^{\\frac{4}{15}}$$
Hitung pelan kasar pangkat mutlak $3^{0,266} \\approx 1,34$.
Rasionya memuncak positif $1,34$!
Maknanya apa? Tubuh suhu Nitrogen Nitrogen 1,3 kali lebih luhur/hangat berbanding jomplangnya kubus Argon yang kiamat paling krisis merana terpuruk menderita kedinginan dahsyat (karena $\\gamma$ monoatomik mencuri persentase energi termal yang drastis fatal dari peranti usaha partikel telanjang).
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

## 6. Contoh Soal Bertingkat

### 🌱 Level EASY (Literasi & Konsep Dasar)
**Soal:** Para ilmuwan antariksa merancang satelit stasiun pengamatan kosmik bertenaga mesin Uap. Namun, mesin kalor canggih secanggih apa pun tidak pernah mematok efisiensi 100% dan pasti memuntahkan panas pembuangan sisanya tak rela, apalagi dibatasi Hukum termal abadi II. Jika di alam mikroskopis kita bisa dengan keajabian sihir ciptakan tandon "Reservoir Buang" yang bertemperatur persis Mutlak $0 \\text{ Kelvin}$, bisakah mesin Carnot tembus 100%?
**Penyelesaian:**
Menurut perhitungan matematika murni ($\\eta = 1 - \\frac{T_c}{T_H}$), JIKA kita mampu memangku reservoir berdarah dingin $0 \\text{ Kelvin}$, maka perpecahannya $1 - 0 = 100\\%$. **TAPI SECARA ALAMIAH DAN PRAKTIK HARAM HUKUMNYA!** Hukum Ketiga Termodinamika mengharamkan keras mustahilnya ada benda mati/gas meraih kedinginan absolut sejati NOL Kelvin. Mesin ajaib itu hanya angan-angan fiksi di buku dongeng Fisika. Oleh sebab tidak mampunya tandon eksis di titik mutlak nol, tidak satupun mesin kalor di alam jagat raya sejagat ini yang mampu tembus nilai murtad efisiensi 100 persen mutlak!

---

### ⚔️ Level NORMAL (Numerasi Standar)
**Soal:** Sebuah mesin motor otoped bensin konvensional sanggup meniru profil grafik ideal Mesin Kalor Carnot. Tungku ruang bakar bensin melonjak hingga suhu dewa $727^\\circ\\text{C}$ dan pipa pembuangan knalpot disambar angin pasrah membuang sisa napas ke rawa bersuhu biasa kamar $27^\\circ\\text{C}$. Berapakah rentang persentase maksimal kasta efisiensi idaman yang diraih otoped fiksi bensin tersebut di muka jalan aspal?
**Penyelesaian:**
Ingat WAJIB seragam konversi suhu ke KELVIN (Tambah 273)!
$T_H = 727 + 273 = 1000 \\text{ K}$.
$T_C = 27 + 273 = 300 \\text{ K}$.
$$\\eta = 1 - \\frac{T_C}{T_H}$$
$$\\eta = 1 - \\frac{300}{1000} = 1 - 0,3 = 0,70$$
Otoped tersebut hanya sanggup mendaur daya angkat maksimal efisiensi setara $70\\%$.

---

### 🔥 Level HARD (Konteks Kehidupan Sehari-hari/Aplikasi)
**Soal:** Sebotol reaktor pendingin udara cerdas ciptakan hawa Kutub untuk kulkas (Mesin Carnot bertindak **terbalik** sebagai Mesin Pendingin). Koefisien Kinerja/Performansi Mesin Kulkas ini ditaksir mendulang rating mulia $C_p = 5$. Motor kompresor listrik mencolok daya tegangan yang setia menyetrika usaha masuk sebesar 2 Kilojoule dalam durasi sekejap. Sanggupkah kulkas ajaib ini memeras mengusir seberapa banyak Kalor (Joule) lari lepas paksa meronta dari bongkah daging yang membeku mendem di kulkas kompartemen?
**Penyelesaian:**
Rumus performansi mutlak Kulkas (Koefisien Prestasi $C_p$):
$$C_p = \\frac{Q_C}{W}$$
Catat: $Q_c$ ini adalah jumlah pahala Kedinginan yang sanggup dicabut/diekskresi oleh mesin dari benda dingin daging kabin pertiwi ($Q_c$ ditarik ke dalam selimut hangat pipa isap mesin) terhadap modal listrik ($W$) kompresor PLN.
$$5 = \\frac{Q_C}{2.000 \\text{ J}}$$
$$Q_C = 5 \\times 2.000 = 10.000 \\text{ Joule}$$
Mesin pendingit berkhasiat menyedot $10 \\text{ kJ}$ kalori uap panas paksa dari daging bongkah itu. Hebatnya, kalor tendang akhir mampir ke teralis panas belakang kulkas buangan raksasa adalah memuntahkan $Q_H = W + Q_C = 2000 + 10000 = 12.000 \\text{ Joule}$ merebus dapur di sekitarnya!

---

### 💀 Level EXTREME (Tipe UTBK / Analisis Kompleks)
**Soal:** Sebuah mesin Carnot ideal melingkari tandon reservoir suhu atas ekstrem $T_H = 900 \\text{ K}$ dan reservoir buang resapan di $T_C = 300 \\text{ K}$. Sang Insinyur bosan akan efisiensi purba mesinnya, direktur memaksa mandor menaikkan standar kasta performa Mesin ini membengkak drastis sebesar tepat **10% ekstra tambahan poin unit angka mutlak murni dari nilai fraksional efisiensi dasarnya itu** (misal jika semula 40%, bos mengemis memaksa wajib menyentuh 50%). Sayangnya, tabung knalpot reservoir buang C di $300 \\text{ K}$ mampat mati dilas paten dan haram disentuh untuk direkontruksi (Suhu pembuangan $T_C$ paten menguncup mati). Berapakah suhu reaktor api naga baru ($T_{H\\ baru}$) yang wajib diledakkan rekayasawan agar mengabulkan tirani 10% ini?
**Penyelesaian:**
1. Hitung basis efisiensi awal usang mesin klasik:
$$\\eta_1 = 1 - \\frac{T_C}{T_H} = 1 - \\frac{300}{900} = 1 - \\frac{1}{3} = \\frac{2}{3} \\approx 66,67\\%$$
2. Titah bos memaksa mendongkrak $+10\\%$ flat margin ekstra angka muti absolut:
Bukan dikali $1,1$ (relatif), namun ditambahkan $+ 0,10$ flat linear limit:
$$\\eta_{baru} = \\eta_1 + 10\\% = \\frac{2}{3} + 0,1 = \\frac{2}{3} + \\frac{1}{10} = \\frac{20}{30} + \\frac{3}{30} = \\frac{23}{30}$$
$$(\\text{yang bermakna } \\approx 76,67\\%)$$
3. Masuk racik resep rumus dewa Carnot idaman dengan target gila baru (sedangkan memori buangan $T_C$ dilarang mengubah silsilah $300 \\text{ K}$):
$$\\eta_{baru} = 1 - \\frac{T_C}{T_{H\\ baru}}$$
$$\\frac{23}{30} = 1 - \\frac{300}{T_{H\\ baru}}$$
Pindah ruaskan memecah pelik tanda negatif:
$$\\frac{300}{T_{H\\ baru}} = 1 - \\frac{23}{30}$$
$$\\frac{300}{T_{H\\ baru}} = \\frac{30}{30} - \\frac{23}{30} = \\frac{7}{30}$$
Lakukan kali silang membongkar pilar:
$$7 \\times T_{H\\ baru} = 300 \\times 30$$
$$7 \\times T_{H\\ baru} = 9000$$
$$T_{H\\ baru} = \\frac{9000}{7} \\approx 1.285,7 \\text{ K}$$
Insinyur miskin menangis darah karena membongkar rombak dapur pacu baja reaktornya membentak mendidih harus beroperasi pada panggangan lava gila  $1.285 \\text{ Kelvin}$ (sekitar $\\sim 1012^\\circ\\text{C}$) demi mendulang sisa kasta efisiensi sepuluh poin pelit itu!
    `
    },
];
