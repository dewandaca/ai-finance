# Fitur Chat AI - Panduan Lengkap

## 🎯 Fitur Utama

### 1. **Deteksi Tanggal Transaksi**

Chat AI sekarang dapat memahami berbagai format waktu dalam bahasa natural:

#### Contoh Penggunaan:

**Format Tanggal Spesifik (BARU!):**

- ✅ "Tanggal 15 isi bensin 50 ribu"
- ✅ "Tgl 20 bayar kos 1.5 juta"
- ✅ "Pada tanggal 5 terima gaji 5 juta"
- ✅ "Tanggal 10 beli groceries 200rb"

**Format Relatif:**

- ✅ "Kemarin bayar makan 50 ribu"
- ✅ "2 hari lalu beli pulsa 25rb"
- ✅ "3 hari yang lalu isi bensin 100 ribu"
- ✅ "Seminggu lalu bayar netflix 50rb"
- ✅ "Minggu lalu terima gaji 5 juta"
- ✅ "Bayar kos 1.5 juta" (default: hari ini)

#### Format yang Didukung:

- **Tanggal Spesifik**: "tanggal 15", "tgl 20", "pada tanggal 5" → Menggunakan bulan dan tahun sekarang
- **Hari ini**: Tidak perlu menyebutkan waktu
- **Kemarin**: "kemarin", "yesterday"
- **X hari lalu**: "2 hari lalu", "3 hari yang lalu", dll
- **Seminggu lalu**: "seminggu lalu", "minggu lalu"

#### Logika Tanggal Spesifik:

- Jika tanggal yang disebutkan **belum lewat** di bulan ini → Menggunakan bulan ini
- Jika tanggal yang disebutkan **sudah lewat** di bulan ini → Menggunakan bulan ini
- Jika tanggal yang disebutkan **lebih besar dari hari ini** → Asumsikan bulan lalu

**Contoh (Hari ini: 18 Oktober):**

- "Tanggal 15 bayar makan 50rb" → 15 Oktober (bulan ini)
- "Tanggal 25 beli pulsa 20rb" → 25 September (bulan lalu, karena 25 Oktober belum terjadi)
- "Tanggal 10 isi bensin 100rb" → 10 Oktober (bulan ini)

### 2. **Multiple Transactions**

Catat beberapa transaksi sekaligus dalam satu pesan:

#### Contoh:

- ✅ "Kemarin bayar makan 50rb, terus isi bensin 100rb, sama beli pulsa 25rb"
- ✅ "2 hari lalu belanja groceries 200 ribu dan bayar netflix 50 ribu"
- ✅ "Tadi beli kopi 15rb, parkir 5rb, plus makan siang 45rb"

### 3. **Deteksi Chat yang Tidak Relevan**

AI akan memberikan respons yang informatif jika input tidak berhubungan dengan transaksi:

#### Respons untuk Input Tidak Valid:

Jika Anda mengirim pesan yang tidak mengandung informasi transaksi (tidak ada kata kunci transaksi atau nominal), AI akan memberikan feedback dengan berbagai variasi respons yang natural:

- "Hmm, aku kurang nangkep maksudnya nih..."
- "Waduh, aku gak terlalu paham yang kamu maksud..."
- "Maaf ya, aku masih bingung sama maksudnya..."

### 4. **Pertanyaan Tentang Aplikasi**

Tanyakan tentang aplikasi ini dan AI akan menjelaskan dengan cara yang variatif dan tidak text book:

#### Contoh Pertanyaan:

- "Ini app apa?"
- "Ini aplikasi buat apa?"
- "Jelaskan app ini"
- "Fungsi app ini apa?"

#### AI akan menjawab dengan gaya yang berbeda-beda, contoh:

- "Jadi gini, ini tuh kayak asisten pribadi kamu buat ngatur duit! Gampang banget..."
- "Oh ini? Simple aja sih, basically platform buat kamu yang males ribet..."
- "Nah ini tuh aplikasi keuangan tapi gak boring kayak yang lain..."

### 5. **Casual Chat**

AI juga bisa merespons sapaan dan percakapan casual:

#### Respons untuk:

- **Sapaan**: "Halo", "Hai", "Hi"
- **Kabar**: "Apa kabar?", "Gimana kabar?"
- **Terima kasih**: "Terima kasih", "Thanks"
- **Pamit**: "Bye", "Sampai jumpa"

## 📝 Tips Penggunaan

### Format Transaksi yang Baik:

1. **Sertakan nominal**: Selalu sebutkan jumlah uangnya
2. **Gunakan kata kunci**: bayar, beli, terima, dapat, dll
3. **Tambahkan konteks waktu** (opsional):
   - Tanggal spesifik: "tanggal 15", "tgl 20"
   - Relatif: "kemarin", "2 hari lalu", dll
4. **Jelaskan kategori secara implisit**: makan, bensin, kos, gaji, dll

### Contoh Format yang Sempurna:

```
[Waktu (opsional)] + [Kata Kunci] + [Item] + [Nominal]
```

**Contoh dengan Tanggal Spesifik:**

- "Tanggal 15 bayar makan 50 ribu"
- "Tgl 20 beli pulsa 25rb"
- "Pada tanggal 5 terima gaji 5 juta"
- "Tanggal 10 isi bensin 100 ribu"

**Contoh dengan Waktu Relatif:**

- "Kemarin bayar makan 50 ribu"
- "2 hari lalu beli pulsa 25rb"
- "Terima gaji 5 juta" (hari ini)
- "Isi bensin 100 ribu seminggu lalu"

## 🎨 Fitur UI

### Konfirmasi Transaksi

Setelah AI mendeteksi transaksi, akan muncul konfirmasi dengan:

- ✅ Ikon sesuai tipe (💰 pemasukan, 💸 pengeluaran)
- ✅ Nominal dalam format rupiah
- ✅ Kategori transaksi
- ✅ Informasi waktu (hari ini, kemarin, X hari lalu)
- ✅ Deskripsi transaksi

### Tombol Konfirmasi

- **✓ Benar**: Simpan transaksi
- **✗ Salah**: Batalkan dan coba lagi

### Multiple Transactions

Untuk transaksi ganda, akan ada tombol:

- **✓ Accept All (X)**: Terima semua transaksi
- **✗ Reject All**: Tolak semua transaksi

## 🔍 Kategori Transaksi

AI dapat mendeteksi kategori secara otomatis:

| Kategori          | Contoh Kata Kunci                           |
| ----------------- | ------------------------------------------- |
| **Food**          | makan, groceries, makanan, restoran         |
| **Transport**     | bensin, parkir, transportasi, grab, gojek   |
| **Bills**         | kos, pulsa, listrik, air, internet, netflix |
| **Salary**        | gaji, bonus, thr                            |
| **Shopping**      | belanja, beli (barang umum)                 |
| **Entertainment** | nonton, bioskop, game                       |
| **Transfer**      | transfer, kirim uang, kasih                 |
| **Other**         | lainnya                                     |

## 🚀 Contoh Penggunaan Lengkap

### Scenario 1: Single Transaction dengan Tanggal Spesifik (BARU!)

```
User: "Tanggal 15 isi bensin 50k"
AI: "Saya mendeteksi: 💸 Pengeluaran sebesar Rp 50.000
     untuk kategori Transport (tanggal 15).
     Deskripsi: 'Isi bensin'. Apakah ini sudah benar?"
[✓ Benar] [✗ Salah]
```

### Scenario 2: Single Transaction dengan Waktu Relatif

```
User: "Kemarin bayar kos 1.5 juta"
AI: "Saya mendeteksi: 💸 Pengeluaran sebesar Rp 1.500.000
     untuk kategori Bills (kemarin).
     Deskripsi: 'Bayar kos'. Apakah ini sudah benar?"
[✓ Benar] [✗ Salah]
```

### Scenario 3: Multiple Transactions dengan Tanggal Spesifik

```
User: "Tanggal 10 bayar makan 50rb, isi bensin 100rb, beli pulsa 25rb"
AI: "Saya mendeteksi 3 transaksi:

1. 💸 Pengeluaran Rp 50.000 - Food (Bayar makan) - tanggal 10
2. 💸 Pengeluaran Rp 100.000 - Transport (Isi bensin) - tanggal 10
3. 💸 Pengeluaran Rp 25.000 - Bills (Beli pulsa) - tanggal 10

Apakah semua transaksi ini sudah benar?"
[✓ Accept All (3)] [✗ Reject All]
```

### Scenario 4: Multiple Transactions dengan Waktu Relatif

```
User: "2 hari lalu bayar makan 50rb, isi bensin 100rb, beli pulsa 25rb"
AI: "Saya mendeteksi 3 transaksi:

1. 💸 Pengeluaran Rp 50.000 - Food (Bayar makan) - 2 hari lalu
2. 💸 Pengeluaran Rp 100.000 - Transport (Isi bensin) - 2 hari lalu
3. 💸 Pengeluaran Rp 25.000 - Bills (Beli pulsa) - 2 hari lalu

Apakah semua transaksi ini sudah benar?"
[✓ Accept All (3)] [✗ Reject All]
```

### Scenario 5: Pertanyaan Tentang App

```
User: "Ini app apa sih?"
AI: "Jadi gini, ini tuh kayak asisten pribadi kamu buat ngatur duit!
     Gampang banget, tinggal chat aja mau catat pengeluaran atau pemasukan.
     Misal 'bayar makan 50rb' langsung aku tangkap dan simpan..."
```

### Scenario 6: Input Tidak Valid

```
User: "asdfghjkl"
AI: "Hmm, aku kurang nangkep maksudnya nih. Bisa lebih spesifik gak?
     Misalnya: 'bayar makan 50rb' atau 'terima gaji 5jt' 🤔"
```

## 💡 Catatan Penting

1. **Validasi Tanggal**:

   - Tidak bisa mencatat transaksi lebih dari 1 tahun yang lalu
   - Tidak bisa mencatat transaksi di masa depan

2. **Format Angka**:

   - Mendukung: ribu, rb, k, juta, jt
   - Contoh: 50rb = 50.000, 5jt = 5.000.000

3. **Bahasa**:

   - Mendukung Bahasa Indonesia dan Inggris
   - AI akan merespons sesuai bahasa yang digunakan

4. **Multiple Transactions**:
   - Semua transaksi dalam satu pesan akan menggunakan tanggal yang sama
   - Jika tidak disebutkan waktu spesifik, default adalah hari ini

## 🎯 Best Practices

✅ **DO:**

- Gunakan kalimat natural dan jelas
- Sebutkan nominal dengan jelas
- Tambahkan konteks waktu jika transaksi bukan hari ini
- Konfirmasi hasil deteksi sebelum menyimpan

❌ **DON'T:**

- Jangan gunakan singkatan yang tidak umum
- Jangan lupa sebutkan nominal
- Jangan input tanggal lebih dari 1 tahun lalu
- Jangan gunakan format tanggal yang kompleks (gunakan bahasa natural)

---

**Happy Tracking! 💰✨**
