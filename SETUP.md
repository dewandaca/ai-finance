# Setup Guide - Finance with AI

## Langkah-langkah Setup Detail

### 1. Setup Supabase Database

#### A. Buat Project Baru di Supabase

1. Kunjungi [supabase.com](https://supabase.com) dan login/register
2. Klik "New Project"
3. Isi detail project:z
   - Name: `finance-ai` (atau nama lain)
   - Database Password: (pilih password yang kuat)
   - Region: Pilih region terdekat dengan lokasi Anda
4. Tunggu hingga project selesai dibuat (~2 menit)

#### B. Jalankan Database Schema

1. Di dashboard Supabase, klik "SQL Editor" di sidebar kiri
2. Klik "New query"
3. Copy seluruh isi file `supabase/schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" untuk mengeksekusi
6. Anda akan melihat pesan sukses jika berhasil

#### C. Dapatkan Credentials

1. Klik "Settings" (⚙️) di sidebar
2. Klik "API" di menu settings
3. Copy 2 nilai berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (string panjang)

### 2. Setup Gemini AI

1. Kunjungi [ai.google.dev](https://ai.google.dev)
2. Klik "Get API key" di bagian atas
3. Login dengan Google account Anda
4. Klik "Create API key"
5. Pilih project (atau buat project baru)
6. Copy API key yang dihasilkan

### 3. Konfigurasi Environment Variables

1. Buka file `.env.local` di root folder project
2. Isi dengan credentials yang sudah Anda dapatkan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
GEMINI_API_KEY=AIzaSy...
```

3. Save file

### 4. Install Dependencies & Run

```bash
# Install dependencies (jika belum)
npm install

# Run development server
npm run dev
```

### 5. Test Aplikasi

1. Buka browser ke `http://localhost:3000`
2. Klik "Sign up" untuk membuat akun baru
3. Isi email dan password (minimal 6 karakter)
4. Setelah register, Anda akan diarahkan ke dashboard
5. Test fitur:
   - Klik "Add Manually" untuk menambah transaksi manual
   - Klik "Chat with AI" untuk menambah dengan natural language

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi**:

- Pastikan file `.env.local` ada di root folder
- Pastikan semua variable terisi dengan benar
- Restart development server dengan `npm run dev`

### Error: "Failed to parse transaction"

**Solusi**:

- Pastikan GEMINI_API_KEY sudah benar
- Periksa quota API Gemini Anda
- Coba input yang lebih jelas, contoh: "Spent $50 on food"

### Error: "Failed to fetch" atau CORS error

**Solusi**:

- Periksa apakah Supabase project URL benar
- Periksa RLS policies sudah dibuat dengan benar
- Cek koneksi internet Anda

### Database error: "relation does not exist"

**Solusi**:

- Jalankan ulang `supabase/schema.sql` di SQL Editor
- Pastikan tidak ada error saat menjalankan SQL

### Authentication tidak berfungsi

**Solusi**:

- Pastikan email confirmation dimatikan di Supabase:
  - Go to Authentication > Settings
  - Scroll ke "Email Confirmation"
  - Toggle "Enable email confirmations" ke OFF (untuk development)

## Fitur-fitur yang Dapat Ditambahkan

Berikut beberapa ide pengembangan lebih lanjut:

1. **Export Data**: Export transaksi ke CSV/Excel
2. **Budget Planning**: Set monthly budget per kategori
3. **Recurring Transactions**: Transaksi berulang otomatis
4. **Multi-currency**: Support berbagai mata uang
5. **Notifications**: Reminder untuk catat transaksi
6. **Receipt Upload**: Upload dan parse foto struk
7. **Sharing**: Share dashboard dengan keluarga
8. **Analytics**: Lebih banyak insights dan prediksi
9. **Goals**: Set savings goals
10. **Tags**: Tag kustom untuk transaksi

## Production Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Klik "New Project"
4. Import repository dari GitHub
5. Tambahkan environment variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
6. Klik "Deploy"
7. Tunggu proses deployment selesai
8. Website Anda live!

### Catatan Production

- Enable email confirmation di Supabase untuk production
- Gunakan domain kustom (opsional)
- Setup monitoring dan error tracking (Sentry, LogRocket, dll)
- Backup database secara berkala

## Support & Contribution

Jika Anda menemukan bug atau ingin contribute:

1. Buat issue di GitHub repository
2. Fork repository
3. Buat pull request dengan perubahan Anda

---

**Happy coding! 🚀**
