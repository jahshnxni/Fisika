# 🚀 Panduan Deployment Vercel & Migrasi Database

## Kenapa Harus Pakai Postgres? (Bukan SQLite)

Saat ini aplikasi kita memakai **SQLite** (file `dev.db`).
- **SQLite** itu seperti file Excel. Disimpan di dalam folder project.
- **Vercel** itu "Serverless". Artinya, setiap kali ada orang buka web kamu, Vercel "menyewa" komputer kosong sebentar, menaruh kode kamu di situ, menjalankannya, lalu **menghapus** semuanya setelah selesai.

**Masalahnya:**
Kalau kamu pakai SQLite di Vercel:
1. User login / daftar.
2. Data disimpan ke `dev.db`.
3. Vercel mematikan server (sleep).
4. **File `dev.db` di-reset/hilang.**
5. Saat user balik lagi, data mereka hilang. 😱

**Solusinya: Postgres (Vercel Postgres)**
- **Postgres** adalah database server yang hidup terpisah di cloud (internet).
- Web Vercel kamu hanya akan "menelpon" ke server database untuk simpan/ambil data.
- Walaupun server web Vercel mati-hidup, **data di server database tetap aman**.

---

## Langkah-Langkah Deployment

### 1. Upload Kode ke GitHub
Vercel mengambil kode langsung dari GitHub.
1. Buat repository baru di [GitHub.com](https://github.com/new).
2. Push kode kamu ke sana (lihat cara di bawah kalau belum pernah).

### 2. Buat Project di Vercel
1. Buka [Vercel Dashboard](https://vercel.com).
2. Klik **Add New...** -> **Project**.
3. Pilih repository GitHub yang barusan dibuat.
4. Klik **Import**.

### 3. Buat Database (Di Dalam Vercel)
1. Setelah project dibuat, masuk ke tab **Storage**.
2. Klik **Connect Store** -> **Postgres** -> **Create New**.
3. Pilih region (misal: Singapore/bawah).
4. Setelah jadi, klik tombol **.env.local** di halaman database, lalu **Copy Snippet**.
5. Minta bantuan saya untuk update kodingan dengan data ini.

### 4. Update Environment Variables
Di menu **Settings** -> **Environment Variables** di Vercel, pastikan ada:
- `GEMINI_API_KEY`: (Copy dari file .env kamu)
- `GROQ_API_KEY`: (Copy dari file .env kamu)
- `NEXTAUTH_SECRET`: (Isi text acak apa saja, misal: `rahasia12345`)
- `NEXTAUTH_URL`: (Vercel biasanya otomatis, tapi bisa diisi `https://nama-web-kamu.vercel.app`)

### 5. Update Kodingan (Migrasi ke Postgres)
*Bagian ini saya akan bantu lakukan otomatis setelah kamu siap.*
Kita perlu mengubah `prisma/schema.prisma` dari `sqlite` menjadi `postgresql` agar kompatibel dengan database baru.


## 1. Prerequisites
- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)

## 2. Push Code to GitHub
1. Initialize git (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Push your code:
   ```bash
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin master
   ```

## 3. Set Up Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. **Configure Project:**
   - Framework Preset: `Next.js` (default)
   - Root Directory: `./` (default)
   - **Environment Variables**:
     - `GEMINI_API_KEY`: Your Google Gemini key
     - `GROQ_API_KEY`: Your Groq key (Recommended fallback)
     - `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`)
     - `NEXTAUTH_URL`: Note: Vercel sets this automatically, but you can set `https://your-project.vercel.app` after deployment.

## 4. Database Migration (The Important Part!)

### Option A: Vercel Postgres (Easiest)
1. In your Vercel project dashboard, go to **Storage** tab.
2. Click **Create Database** -> **Postgres** -> **Create**.
3. Once created, go to **Settings** -> **Environment Variables**.
4. Vercel automatically adds `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

### Option B: Update Code for Postgres
You need to change `prisma/schema.prisma` to use Postgres instead of SQLite.

**1. Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL") // uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // uses direct connection
}
```

**2. Update `package.json` build script:**
Change standard build to also generate client:
```json
"scripts": {
  "build": "prisma generate && next build",
  ...
}
```

**3. Push changes to GitHub.**
Vercel will automatically redeploy.

**4. Run Migrations on Vercel:**
You can modify the build command in Vercel settings to:
`prisma migrate deploy && next build`
OR connect to the database locally and run:
`npx prisma migrate deploy` (setup local .env with the Vercel DB URL)

## 5. Google Auth (Production)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth Client ID.
3. Add your Vercel domain (e.g., `https://physica-mastery.vercel.app`) to:
   - **Authorized JavaScript origins**
   - **Authorized redirect URIs** (append `/api/auth/callback/google`)
4. Copy the Client ID/Secret to Vercel Environment Variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

---
> **Note:** If you want to keep developing locally with SQLite but deploy with Postgres, you can keep separate schema files or use environment variables to switch (advanced), but it's often easier to switch fully to Postgres (runs on Vercel) or use a local Postgres container.
