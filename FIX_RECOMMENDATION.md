# 🔧 Fix: Transaksi Tidak Terbaca di Rekomendasi AI

## ❌ Masalah

Ketika mengklik "Rekomendasi AI", transaksi tidak terbaca meskipun sudah ada data di database.

## ✅ Penyebab

**Missing `SUPABASE_SERVICE_ROLE_KEY`** di file `.env.local`

API route memerlukan **Service Role Key** untuk bypass Row Level Security (RLS) dan membaca data transaksi user dari server-side.

---

## 🚀 Solusi Lengkap (5 Menit)

### Step 1: Dapatkan Service Role Key dari Supabase

1. **Login ke Supabase Dashboard**

   ```
   https://supabase.com/dashboard
   ```

2. **Pilih Project Anda**

   - Pilih project: `kpeykeqhdpyqdzabsycn` (atau nama project Anda)

3. **Buka Settings > API**

   - Klik icon **⚙️ Settings** di sidebar kiri
   - Pilih **API** dari menu

4. **Copy Service Role Key**

   - Scroll ke bagian **Project API keys**
   - Cari baris **`service_role`** (bukan anon!)
   - Klik **Reveal** untuk melihat key
   - Klik **Copy** untuk copy key

   **⚠️ PENTING:** Service role key sangat sensitif! Jangan share atau commit ke git!

---

### Step 2: Tambahkan ke `.env.local`

1. **Buka file `.env.local`** di root project

2. **Tambahkan baris ini:**

   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
   ```

   _(Replace dengan service role key yang Anda copy)_

3. **File `.env.local` lengkap seharusnya seperti ini:**

   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://kpeykeqhdpyqdzabsycn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Service Role Key (untuk API routes)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Gemini AI Configuration
   GEMINI_API_KEY=AIzaSyCWWHWRS-KT6tEPbC98qIgpleSGw9ENZVU
   ```

4. **Save file**

---

### Step 3: Restart Development Server

1. **Stop server** (jika sedang running)

   - Tekan `Ctrl+C` di terminal

2. **Start ulang server**

   ```bash
   npm run dev
   ```

3. **Tunggu sampai muncul:**
   ```
   ✓ Ready in 2s
   - Local: http://localhost:3000
   ```

---

### Step 4: Test Rekomendasi AI

1. **Buka aplikasi** di browser: `http://localhost:3000`

2. **Login** dengan akun Anda

3. **Pastikan ada minimal 3 transaksi:**

   - Jika belum ada, tambahkan via Chat AI atau manual input
   - Contoh via Chat AI:
     - "Bayar makan 50000"
     - "Terima gaji 5000000"
     - "Beli bensin 100000"

4. **Klik tombol "Rekomendasi AI" 🎯**

5. **Pilih jumlah transaksi** (5, 10, atau 20 data)

6. **Tunggu beberapa detik** - AI akan menganalisis

7. **✅ Seharusnya muncul rekomendasi lengkap!**

---

## 🔍 Verifikasi Berhasil

### Di Terminal (saat klik Rekomendasi AI):

```
=== DEBUGGING INFO ===
User ID: xxx-xxx-xxx-xxx
Min Transactions: 5
Supabase URL: https://kpeykeqhdpyqdzabsycn.supabase.co
Using Service Key: eyJhbGciOiJIUzI1NiIs...
Total transactions for user: 10
Sample transaction: { id: '...', amount: 50000, ... }
Filtered transactions: 5
=== END DEBUG ===
```

### Di Browser:

- ✅ Muncul rekomendasi lengkap dengan markdown formatting
- ✅ Ada analisis kondisi keuangan
- ✅ Ada rekomendasi konkret
- ✅ Ada rencana aksi 30 hari

---

## ❌ Troubleshooting

### Error: "Failed to fetch transactions"

**Solusi:**

- Pastikan service role key sudah benar
- Restart server setelah update `.env.local`
- Cek RLS policies di Supabase (seharusnya sudah OK)

### Error: "Data Tidak Mencukupi"

**Solusi:**

- Tambah minimal 3 transaksi
- Pastikan transaksi ada di database (cek di Supabase Dashboard > Table Editor > transactions)

### Error: "User ID required"

**Solusi:**

- Logout, lalu login ulang
- Clear browser cache
- Cek session di localStorage (F12 > Application > Local Storage)

### Masih "0 transactions" di log

**Solusi:**

1. Cek di Supabase Dashboard > Table Editor
2. Filter by your user_id
3. Pastikan transaksi ada
4. Jika tidak ada, tambah via Chat AI

---

## 📋 Checklist

Gunakan checklist ini untuk memastikan semua sudah benar:

- [ ] ✅ Service role key sudah ditambahkan ke `.env.local`
- [ ] ✅ Server sudah di-restart setelah update env
- [ ] ✅ User sudah login
- [ ] ✅ Minimal 3 transaksi sudah ada di database
- [ ] ✅ Debug log muncul di terminal saat klik Rekomendasi AI
- [ ] ✅ "Total transactions for user" > 0 di log
- [ ] ✅ Rekomendasi muncul di UI

---

## 🔐 Keamanan

### ⚠️ JANGAN:

- ❌ Commit `.env.local` ke git
- ❌ Share service role key ke public
- ❌ Screenshot service role key
- ❌ Paste service role key di chat/forum

### ✅ LAKUKAN:

- ✅ Simpan service role key di password manager
- ✅ Tambahkan `.env.local` ke `.gitignore` (sudah otomatis)
- ✅ Rotate key jika bocor (di Supabase Dashboard)
- ✅ Gunakan environment variables untuk production

---

## 🎉 Selesai!

Jika sudah mengikuti semua langkah, **Rekomendasi AI seharusnya sudah berfungsi!**

### Next Steps:

1. Test dengan berbagai jumlah transaksi (5, 10, 20)
2. Coba "Input Manual" untuk jumlah custom
3. Gunakan "Analisis Ulang" untuk rekomendasi baru
4. Copy rekomendasi untuk disimpan

---

**Need Help?** Baca `TROUBLESHOOTING.md` untuk panduan lengkap debugging.

**Last Updated:** 18 Oktober 2025
