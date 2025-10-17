# 🤖 Panduan Chat AI - Multiple Transactions

## 🎯 Fitur Baru: Accept All Multiple Transactions

Aplikasi AI Finance sekarang mendukung **input multiple transaksi sekaligus** melalui Chat AI dengan fitur **Accept All**!

---

## 📝 Cara Menggunakan

### 1️⃣ Single Transaction (Seperti Biasa)

**Input:**

```
Bayar makan 50rb
```

**AI Response:**

```
Saya mendeteksi: 💸 Pengeluaran sebesar Rp 50.000 untuk kategori Food.
Deskripsi: "Bayar makan". Apakah ini sudah benar?

[✓ Benar]  [✗ Salah]
```

### 2️⃣ Multiple Transactions (BARU!)

**Input:**

```
Tadi bayar makan 50rb, terus isi bensin 100rb, sama beli pulsa 25rb
```

**AI Response:**

```
Saya mendeteksi 3 transaksi:

1. 💸 Pengeluaran Rp 50.000 - Food (Bayar makan)
2. 💸 Pengeluaran Rp 100.000 - Transport (Isi bensin)
3. 💸 Pengeluaran Rp 25.000 - Bills (Beli pulsa)

Apakah semua transaksi ini sudah benar?

[✓ Accept All (3)]  [✗ Reject All]
```

**Klik "Accept All"** → Semua 3 transaksi langsung tersimpan! ✅

---

## 💡 Contoh-Contoh Multiple Transactions

### Contoh 1: Pengeluaran Harian

```
Input: Hari ini belanja groceries 200 ribu dan bayar netflix 50 ribu

Output:
1. 💸 Pengeluaran Rp 200.000 - Food (Belanja groceries)
2. 💸 Pengeluaran Rp 50.000 - Entertainment (Bayar netflix)
```

### Contoh 2: Mixed Income & Expense

```
Input: Terima gaji 5 juta lalu bayar kos 1,2 juta sama beli makan 100rb

Output:
1. 💰 Pemasukan Rp 5.000.000 - Salary (Terima gaji)
2. 💸 Pengeluaran Rp 1.200.000 - Bills (Bayar kos)
3. 💸 Pengeluaran Rp 100.000 - Food (Beli makan)
```

### Contoh 3: Aktivitas Belanja

```
Input: Belanja baju 300rb, sepatu 500rb, dan tas 250rb

Output:
1. 💸 Pengeluaran Rp 300.000 - Shopping (Belanja baju)
2. 💸 Pengeluaran Rp 500.000 - Shopping (Belanja sepatu)
3. 💸 Pengeluaran Rp 250.000 - Shopping (Belanja tas)
```

### Contoh 4: Transfer & Pembayaran

```
Input: Transfer adik 200rb, bayar listrik 150rb, isi token 100rb

Output:
1. 💸 Pengeluaran Rp 200.000 - Transfer (Transfer adik)
2. 💸 Pengeluaran Rp 150.000 - Bills (Bayar listrik)
3. 💸 Pengeluaran Rp 100.000 - Bills (Isi token)
```

---

## 🔍 Cara AI Mendeteksi Multiple Transactions

AI akan mendeteksi multiple transactions jika:

### ✅ Kata Penghubung Terdeteksi:

- **"dan"** → "Bayar makan 50rb **dan** isi bensin 100rb"
- **"sama"** → "Belanja 200rb **sama** bayar listrik 150rb"
- **"terus"** → "Beli pulsa 50rb **terus** transfer 100rb"
- **"lalu"** → "Makan 75rb **lalu** nonton bioskop 50rb"
- **"kemudian"** → "Bayar kos 1 juta **kemudian** bayar wifi 200rb"
- **"juga"** → "Isi bensin 100rb **juga** bayar parkir 5rb"
- **"plus"** → "Beli groceries 300rb **plus** bayar netflix 50rb"
- **"serta"** → "Belanja 200rb **serta** makan 50rb"
- **Koma (,)** → "Bayar makan 50rb**,** isi bensin 100rb**,** beli pulsa 25rb"

### ✅ Minimal 2 Kata Transaksi:

Kata-kata seperti: `bayar`, `beli`, `buat`, `kasih`, `transfer`, `isi`, `kirim`, `terima`, `dapat`, `jual`, `gaji`, `bonus`, `makan`, `belanja`

---

## 🎨 UI/UX Features

### Single Transaction

- Background: **Kuning** (border kuning)
- Tombol: `✓ Benar` dan `✗ Salah`
- Confirm 1 transaksi

### Multiple Transactions

- Background: **Kuning** (border kuning)
- Tombol: `✓ Accept All (N)` dan `✗ Reject All`
- N = jumlah transaksi yang terdeteksi
- Daftar transaksi ditampilkan dengan numbering

---

## ⚙️ Technical Details

### Parsing Engine

- **Single**: Menggunakan `model` dengan schema single transaction
- **Multiple**: Menggunakan `multiModel` dengan schema array transactions
- **Detection**: Fungsi `detectMultipleTransactions()` menganalisis input

### Validation

- ✅ Semua transaksi menggunakan **tanggal hari ini**
- ✅ Validasi 1 tahun diterapkan
- ✅ Tidak bisa input tanggal masa depan
- ✅ Semua kategori valid sesuai sistem

### Database

- **Batch Insert**: Semua transaksi disimpan dalam 1 query
- **Atomic Operation**: Semua sukses atau semua gagal
- **Performance**: Lebih efisien daripada insert satu-satu

---

## 📊 Categories yang Didukung

AI akan otomatis mengkategorikan transaksi ke:

1. **Food** - Makanan & Minuman
2. **Transport** - Transportasi
3. **Bills** - Tagihan & Utilitas
4. **Salary** - Gaji & Penghasilan
5. **Shopping** - Belanja
6. **Entertainment** - Hiburan
7. **Transfer** - Transfer Uang
8. **Other** - Lainnya

---

## 🚀 Keuntungan Accept All

### ⚡ Kecepatan

- Input 1 kali untuk banyak transaksi
- Tidak perlu ketik berulang-ulang
- Hemat waktu signifikan

### 🎯 Akurasi

- AI parsing setiap transaksi dengan detail
- Amount, category, description otomatis ter-assign
- Konsisten dan akurat

### ✅ Kemudahan

- Cukup 1 klik untuk simpan semua
- Review sebelum accept
- Bisa reject all jika ada yang salah

### 📝 Natural Language

- Ketik seperti berbicara sehari-hari
- Tidak perlu format khusus
- Fleksibel dan user-friendly

---

## ⚠️ Tips & Best Practices

### ✅ DO:

- Gunakan kata penghubung yang jelas ("dan", "sama", "terus")
- Sebutkan nominal untuk setiap transaksi
- Pisahkan dengan koma jika perlu
- Gunakan bahasa yang natural

**Contoh Bagus:**

```
Bayar makan 50rb, isi bensin 100rb, sama beli pulsa 25rb
```

### ❌ DON'T:

- Jangan input terlalu banyak transaksi sekaligus (max 5-10)
- Jangan lupa sebutkan nominal setiap transaksi
- Jangan campurkan dengan obrolan casual

**Contoh Kurang Bagus:**

```
Tadi aku bayar makan di resto yang enak banget terus isi bensin sama beli pulsa
```

(Terlalu banyak kata filler)

---

## 🔧 Troubleshooting

### Masalah: AI tidak mendeteksi multiple transactions

**Solusi:**

- Pastikan ada kata penghubung ("dan", "sama", dll)
- Gunakan koma untuk memisahkan
- Pastikan minimal 2 transaksi terdeteksi

### Masalah: Parsing tidak akurat

**Solusi:**

- Gunakan bahasa yang lebih jelas
- Sebutkan nominal dengan jelas (50rb, 100 ribu, 1 juta)
- Hindari kata-kata ambigu

### Masalah: Accept All gagal

**Solusi:**

- Cek koneksi internet
- Pastikan autentikasi masih valid
- Refresh halaman dan coba lagi

---

## 📱 Contoh Skenario Real

### Skenario 1: Setelah Belanja Bulanan

```
User: Tadi belanja supermarket 500rb, bayar parkir 5rb, sama makan di food court 75rb

AI: Saya mendeteksi 3 transaksi:
1. 💸 Pengeluaran Rp 500.000 - Shopping (Belanja supermarket)
2. 💸 Pengeluaran Rp 5.000 - Transport (Bayar parkir)
3. 💸 Pengeluaran Rp 75.000 - Food (Makan di food court)

User: *klik Accept All*

AI: ✅ Berhasil mencatat 3 transaksi! Ada yang lain?
```

### Skenario 2: Hari Gajian

```
User: Terima gaji 7 juta lalu bayar kos 1,5 juta, listrik 200rb, dan wifi 300rb

AI: Saya mendeteksi 4 transaksi:
1. 💰 Pemasukan Rp 7.000.000 - Salary (Terima gaji)
2. 💸 Pengeluaran Rp 1.500.000 - Bills (Bayar kos)
3. 💸 Pengeluaran Rp 200.000 - Bills (Bayar listrik)
4. 💸 Pengeluaran Rp 300.000 - Bills (Bayar wifi)

User: *klik Accept All*

AI: ✅ Berhasil mencatat 4 transaksi! Ada yang lain?
```

---

## 🎓 Summary

Fitur **Chat AI Multiple Transactions dengan Accept All** membuat pencatatan keuangan menjadi:

- ⚡ **Super cepat** - 1 input untuk banyak transaksi
- 🎯 **Akurat** - AI parsing otomatis
- ✅ **Mudah** - Cukup 1 klik Accept All
- 🔄 **Fleksibel** - Review sebelum save
- 💬 **Natural** - Bahasa sehari-hari

**Happy tracking your finances! 💰📊**
