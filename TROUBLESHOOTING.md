# 🔧 Troubleshooting Guide - AI Finance

## ❌ Masalah: Transaksi Tidak Terbaca di Rekomendasi AI

### Penyebab Utama:

1. **Missing SUPABASE_SERVICE_ROLE_KEY** - API tidak bisa bypass Row Level Security (RLS)
2. **User ID tidak valid** - ID yang dikirim tidak cocok dengan user di database
3. **Tidak ada transaksi di database** - User belum menambahkan transaksi

---

## ✅ Solusi 1: Tambahkan Service Role Key

### Langkah-langkah:

1. **Buka Supabase Dashboard**

   - Login ke [https://supabase.com](https://supabase.com)
   - Pilih project Anda

2. **Dapatkan Service Role Key**

   - Klik **Settings** (ikon gear di sidebar kiri)
   - Pilih **API**
   - Scroll ke bagian **Project API keys**
   - Copy **`service_role` key** (⚠️ JANGAN bagikan key ini ke publik!)

3. **Tambahkan ke `.env.local`**

   ```bash
   # Tambahkan baris ini ke file .env.local
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   # Start ulang
   npm run dev
   ```

---

## ✅ Solusi 2: Verifikasi User ID

### Cara Cek User ID:

1. **Login ke aplikasi**
2. **Buka Browser Console** (F12)
3. **Jalankan command ini di console:**

   ```javascript
   // Untuk cek session
   localStorage.getItem("sb-kpeykeqhdpyqdzabsycn-auth-token");
   ```

4. **Atau cek di Supabase Dashboard:**
   - Settings > Auth > Users
   - Lihat daftar user dan ID mereka

### Pastikan:

- User sudah login
- User ID yang dikirim ke API sama dengan user yang login
- Session belum expired

---

## ✅ Solusi 3: Tambahkan Transaksi

### Minimal 3 Transaksi Diperlukan

1. **Via Chat AI:**

   - Klik tombol "Chat AI" di dashboard
   - Ketik: "Bayar makan 50000"
   - Ketik: "Terima gaji 5000000"
   - Ketik: "Beli bensin 100000"

2. **Via Manual Input:**
   - Klik tombol "+" di dashboard
   - Isi form transaksi
   - Ulangi minimal 3x

---

## 🔍 Debug Mode

### Aktifkan Console Logging:

File sudah dilengkapi dengan debug logging. Untuk melihat:

1. **Jalankan dev server**

   ```bash
   npm run dev
   ```

2. **Buka aplikasi di browser**

3. **Klik "Rekomendasi AI"**

4. **Check Terminal/Console** untuk output:
   ```
   === DEBUGGING INFO ===
   User ID: xxx-xxx-xxx
   Min Transactions: 5
   Total transactions for user: 10
   Sample transaction: {...}
   Filtered transactions: 5
   === END DEBUG ===
   ```

### Interpretasi Output:

| Output                        | Artinya                 | Solusi                                   |
| ----------------------------- | ----------------------- | ---------------------------------------- |
| `Total transactions: 0`       | Tidak ada transaksi     | Tambah transaksi via Chat AI atau manual |
| `Error fetching transactions` | Masalah database/auth   | Cek service role key & RLS policy        |
| `User ID: undefined`          | User belum login        | Login ulang                              |
| `Sample transaction: {...}`   | Data ada, API berfungsi | ✅ Seharusnya bisa                       |

---

## 🛡️ Keamanan Row Level Security (RLS)

### Kenapa Perlu Service Role Key?

**Row Level Security (RLS)** di Supabase melindungi data user:

- Setiap user **hanya bisa lihat data mereka sendiri**
- Anon key **tidak bisa bypass RLS**
- Service role key **bisa bypass RLS** (untuk server-side operations)

### RLS Policies di Database:

```sql
-- Users can only see their own transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Masalah:**

- API route tidak punya `auth.uid()` karena berjalan di server
- Maka perlu **service role key** untuk bypass RLS

---

## 📝 Checklist Troubleshooting

Gunakan checklist ini untuk debug:

- [ ] **Environment Variables**

  - [ ] `NEXT_PUBLIC_SUPABASE_URL` ada di `.env.local`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada di `.env.local`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` ada di `.env.local` ⭐
  - [ ] `GEMINI_API_KEY` ada di `.env.local`

- [ ] **Database**

  - [ ] Tabel `transactions` sudah dibuat
  - [ ] RLS policies sudah aktif
  - [ ] Ada minimal 3 transaksi di database

- [ ] **Authentication**

  - [ ] User sudah register
  - [ ] User sudah login
  - [ ] Session masih aktif

- [ ] **Server**
  - [ ] Dev server running tanpa error
  - [ ] Tidak ada CORS error di console
  - [ ] API route bisa diakses

---

## 🔧 Quick Fixes

### Fix 1: Reset Database Connection

```bash
# Stop server
# Delete node_modules/.cache
rm -rf .next
# Restart
npm run dev
```

### Fix 2: Clear Browser Cache

```
1. Buka DevTools (F12)
2. Application > Storage > Clear site data
3. Refresh page
```

### Fix 3: Re-run Migration

```sql
-- Jalankan di Supabase SQL Editor
-- Reset RLS policies jika ada masalah
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;

CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 📞 Masih Bermasalah?

Jika sudah mengikuti semua langkah tapi masih error:

1. **Cek Terminal Output** - Lihat error message lengkap
2. **Cek Browser Console** - Lihat error dari frontend
3. **Cek Supabase Logs** - Dashboard > Logs untuk error database
4. **Screenshot Error** - Ambil screenshot error untuk debugging

### Informasi yang Dibutuhkan:

- Error message lengkap dari terminal
- Error message dari browser console
- Screenshot jika ada
- Langkah yang sudah dilakukan

---

## 💡 Tips Pencegahan

1. **Selalu gunakan .env.local**

   - Jangan commit ke git
   - Backup ke password manager

2. **Monitor Supabase Quota**

   - Free tier punya limit
   - Cek usage di dashboard

3. **Test dengan Data Dummy**

   - Tambah beberapa transaksi test
   - Hapus setelah testing

4. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

---

**Last Updated:** 18 Oktober 2025
