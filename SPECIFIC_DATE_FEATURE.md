# 📅 Fitur Tanggal Spesifik - Chat AI

## 🎯 Fitur Baru!

Chat AI sekarang mendukung **tanggal spesifik** selain format waktu relatif seperti "kemarin" atau "2 hari lalu".

## 💡 Cara Penggunaan

### Format yang Didukung:

```
"tanggal [angka]"
"tgl [angka]"
"pada tanggal [angka]"
"tgl. [angka]"
```

### Contoh Penggunaan:

```
✅ "Tanggal 15 isi bensin 50 ribu"
✅ "Tgl 20 bayar kos 1.5 juta"
✅ "Pada tanggal 5 terima gaji 5 juta"
✅ "Tanggal 10 beli groceries 200rb"
✅ "Tgl 25 bayar listrik 150 ribu"
```

## 🧮 Logika Perhitungan Tanggal

AI menggunakan **bulan dan tahun sekarang** untuk menghitung tanggal transaksi:

### Contoh (Hari ini: 18 Oktober 2025)

| Input                           | Hasil Tanggal     | Penjelasan                                        |
| ------------------------------- | ----------------- | ------------------------------------------------- |
| "Tanggal 15 bayar makan 50rb"   | 15 Oktober 2025   | Tanggal 15 sudah lewat di bulan ini               |
| "Tanggal 10 isi bensin 100rb"   | 10 Oktober 2025   | Tanggal 10 sudah lewat di bulan ini               |
| "Tanggal 18 beli pulsa 20rb"    | 18 Oktober 2025   | Hari ini                                          |
| "Tanggal 25 bayar netflix 50rb" | 25 September 2025 | Tanggal 25 Oktober belum terjadi, jadi bulan lalu |
| "Tanggal 30 belanja 200rb"      | 30 September 2025 | Tanggal 30 Oktober belum terjadi, jadi bulan lalu |

### Aturan Sederhana:

- **Jika tanggal ≤ hari ini**: Gunakan bulan ini
- **Jika tanggal > hari ini**: Gunakan bulan lalu

## 🎬 Demo Interaksi

### Contoh 1: Single Transaction

```
👤 User: "Tanggal 15 isi bensin 50k"

🤖 AI: "Saya mendeteksi: 💸 Pengeluaran sebesar Rp 50.000
      untuk kategori Transport (tanggal 15).
      Deskripsi: 'Isi bensin'. Apakah ini sudah benar?"

      [✓ Benar] [✗ Salah]
```

### Contoh 2: Multiple Transactions

```
👤 User: "Tanggal 10 bayar makan 50rb, isi bensin 100rb, beli pulsa 25rb"

🤖 AI: "Saya mendeteksi 3 transaksi:

      1. 💸 Pengeluaran Rp 50.000 - Food (Bayar makan) - tanggal 10
      2. 💸 Pengeluaran Rp 100.000 - Transport (Isi bensin) - tanggal 10
      3. 💸 Pengeluaran Rp 25.000 - Bills (Beli pulsa) - tanggal 10

      Apakah semua transaksi ini sudah benar?"

      [✓ Accept All (3)] [✗ Reject All]
```

### Contoh 3: Mix dengan Kategori Berbeda

```
👤 User: "Tgl 5 terima gaji 5 juta"

🤖 AI: "Saya mendeteksi: 💰 Pemasukan sebesar Rp 5.000.000
      untuk kategori Salary (tanggal 5).
      Deskripsi: 'Gaji bulanan'. Apakah ini sudah benar?"

      [✓ Benar] [✗ Salah]
```

## 🔄 Kombinasi dengan Format Lain

Anda masih bisa menggunakan format waktu relatif:

| Format               | Contoh                           | Hasil      |
| -------------------- | -------------------------------- | ---------- |
| **Tanggal Spesifik** | "Tanggal 15 bayar makan 50rb"    | 15 Oktober |
| **Kemarin**          | "Kemarin bayar makan 50rb"       | 17 Oktober |
| **X Hari Lalu**      | "2 hari lalu bayar makan 50rb"   | 16 Oktober |
| **Seminggu Lalu**    | "Seminggu lalu bayar makan 50rb" | 11 Oktober |
| **Hari Ini**         | "Bayar makan 50rb"               | 18 Oktober |

## ⚠️ Validasi & Batasan

### ✅ Valid:

- Tanggal 1-31 (sesuai jumlah hari dalam bulan)
- Maksimal 1 tahun ke belakang
- Tidak boleh tanggal masa depan (di bulan sekarang)

### ❌ Akan Error:

```
"Tanggal 32 bayar makan 50rb"  → Invalid (tidak ada tanggal 32)
"Tanggal 15 tahun lalu..."      → Invalid (lebih dari 1 tahun)
```

## 🎨 Fitur UI

### Pesan Konfirmasi:

- Menampilkan "tanggal X" alih-alih "X hari lalu"
- Emoji sesuai tipe transaksi (💰 pemasukan, 💸 pengeluaran)
- Format rupiah yang mudah dibaca
- Informasi kategori dan deskripsi

### Tombol Aksi:

- **✓ Benar**: Simpan ke database dengan tanggal yang benar
- **✗ Salah**: Batalkan dan input ulang

## 💪 Keunggulan

1. **Lebih Presisi**: Catat transaksi di tanggal spesifik
2. **Lebih Natural**: "Tanggal 15" lebih mudah dari "3 hari lalu"
3. **Fleksibel**: Bisa mix dengan format relatif
4. **Otomatis**: AI menghitung bulan/tahun secara cerdas

## 📝 Tips Penggunaan

### ✅ DO:

- Gunakan format "tanggal [angka]" untuk presisi
- Sebutkan tanggal yang valid (1-31)
- Kombinasi dengan nominal dan kategori yang jelas

### ❌ DON'T:

- Jangan pakai tanggal invalid (misal: tanggal 32)
- Jangan lupa sebutkan nominal uang
- Jangan pakai tanggal lebih dari 1 tahun lalu

## 🚀 Contoh Kasus Nyata

### Skenario: Lupa Catat Transaksi Beberapa Hari

```
Hari ini tanggal 18, tapi kemarin lupa catat transaksi tanggal 12-15:

👤 "Tanggal 12 bayar makan 50rb"
👤 "Tanggal 13 isi bensin 100rb"
👤 "Tanggal 14 beli pulsa 25rb"
👤 "Tanggal 15 bayar netflix 50rb"

✅ Semua tercatat di tanggal yang tepat!
```

### Skenario: Multiple Transactions di Tanggal yang Sama

```
👤 "Tanggal 10 bayar makan 50rb, isi bensin 100rb, beli groceries 200rb"

✅ Semua 3 transaksi tercatat dengan tanggal 10 Oktober!
```

## 🎯 Kesimpulan

Fitur tanggal spesifik membuat Chat AI lebih powerful untuk mencatat transaksi dengan presisi tinggi. Tidak perlu lagi menghitung "berapa hari yang lalu", cukup sebutkan tanggalnya!

---

**Happy Tracking! 💰📅✨**
