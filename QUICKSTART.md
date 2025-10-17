# Quick Start 🚀

## 3 Langkah Setup Cepat

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment Variables

Buat file `.env.local` dan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key
```

**Cara mendapatkan credentials:**

- **Supabase**: Daftar di [supabase.com](https://supabase.com) → New Project → Settings → API
- **Gemini**: Kunjungi [ai.google.dev](https://ai.google.dev) → Get API Key

### 3️⃣ Setup Database

1. Login ke Supabase dashboard
2. Buka **SQL Editor**
3. Copy isi file `supabase/schema.sql`
4. Paste dan **Run**

### ✅ Run Application

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🎯 Test Features

1. **Register** akun baru (email + password)
2. **Add Manually** - Form transaksi tradisional
3. **Chat with AI** - Coba input:
   - "Spent $50 on groceries"
   - "Got salary 5000"
   - "Paid rent $1200"

---

**Butuh bantuan?** Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap.
