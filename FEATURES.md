# Fitur-Fitur Aplikasi AI Finance

## 📝 Daftar Fitur yang Telah Ditambahkan

### 1. 🗓️ Filter Transaksi 1 Tahun

- Sistem hanya menampilkan transaksi dalam **1 tahun terakhir**
- Transaksi yang lebih dari 1 tahun otomatis tidak ditampilkan
- Menghemat performa dan menjaga tampilan tetap relevan

### 2. 📅 Filter Per Bulan

- **Filter berdasarkan bulan**: Pilih bulan tertentu untuk melihat transaksi bulan tersebut
- **Filter berdasarkan tahun**: Pilih tahun tertentu untuk melihat transaksi tahun tersebut
- **Kombinasi bulan dan tahun**: Pilih bulan dan tahun spesifik (misalnya: Januari 2024)
- Transaksi akan di-filter berdasarkan periode yang dipilih
- **Saldo total TIDAK di-reset** - tetap menampilkan saldo keseluruhan sepanjang waktu

### 3. 🔍 Fitur Pencarian (Search)

Cari transaksi berdasarkan:

- **Deskripsi transaksi**: Cari berdasarkan catatan/deskripsi
- **Kategori**: Cari berdasarkan kategori (Food, Transport, Bills, dll)
- **Tipe transaksi**: Cari "income" atau "expense"
- **Jumlah**: Cari berdasarkan nominal transaksi

### 4. 💰 Perhitungan Otomatis

Sistem menghitung dan menampilkan:

- **Total Pemasukan**: Jumlah seluruh pemasukan dalam periode yang dipilih
- **Total Pengeluaran**: Jumlah seluruh pengeluaran dalam periode yang dipilih
- **Saldo Periode**: Selisih antara pemasukan dan pengeluaran dalam periode tersebut
- **Saldo Total**: Saldo keseluruhan yang tidak pernah di-reset (mencakup semua transaksi sepanjang waktu)

### 5. 🚫 Validasi Input Transaksi Manual

**Pembatasan Tanggal:**

- **TIDAK BISA** menambahkan transaksi untuk tanggal lebih dari **1 tahun yang lalu**
- **TIDAK BISA** menambahkan transaksi untuk tanggal di **masa depan**
- Input date picker otomatis dibatasi dengan atribut `min` dan `max`
- Validasi ganda: Di form (HTML5) dan di submit handler
- Pesan error jelas jika mencoba input tanggal invalid

**Pesan Error:**

- "Transaksi tidak dapat dicatat untuk tanggal lebih dari 1 tahun yang lalu"
- "Tanggal transaksi tidak boleh di masa depan"

**UI Helper:**

- Peringatan di bawah input tanggal: "⚠️ Hanya bisa mencatat transaksi dalam 1 tahun terakhir"

### 6. 🤖 Chat AI dengan Multiple Transactions (Accept All)

**Fitur Baru: Input Multiple Transaksi Sekaligus**

Sekarang Anda bisa menambahkan **beberapa transaksi sekaligus** melalui Chat AI!

**Cara Kerja:**

1. Ketik semua transaksi dalam satu pesan
2. AI akan mendeteksi dan mem-parsing semua transaksi
3. Sistem menampilkan daftar semua transaksi yang terdeteksi
4. Klik **"Accept All"** untuk menyimpan semua transaksi sekaligus
5. Atau klik **"Reject All"** jika ada yang salah

**Contoh Input Multiple Transaksi:**

```
Tadi bayar makan 50rb, terus isi bensin 100rb, sama beli pulsa 25rb
```

**Output AI:**

```
Saya mendeteksi 3 transaksi:

1. 💸 Pengeluaran Rp 50.000 - Food (Bayar makan)
2. 💸 Pengeluaran Rp 100.000 - Transport (Isi bensin)
3. 💸 Pengeluaran Rp 25.000 - Bills (Beli pulsa)

Apakah semua transaksi ini sudah benar?
```

**Contoh Lain:**

```
Hari ini belanja groceries 200 ribu dan bayar netflix 50 ribu
```

**Output:**

```
Saya mendeteksi 2 transaksi:

1. 💸 Pengeluaran Rp 200.000 - Food (Belanja groceries)
2. 💸 Pengeluaran Rp 50.000 - Entertainment (Bayar netflix)
```

**Keuntungan:**

- ⚡ **Lebih Cepat**: Input banyak transaksi dalam satu kali ketik
- 🎯 **Efisien**: Tidak perlu input satu-satu
- ✅ **Akurat**: AI mem-parsing setiap transaksi dengan detail
- 🔄 **Fleksibel**: Bisa Accept All atau Reject All

**Deteksi Otomatis:**
AI otomatis mendeteksi multiple transactions berdasarkan:

- Kata penghubung: "dan", "sama", "terus", "lalu", "juga", "plus", "serta"
- Jumlah kata transaksi (minimal 2 transaksi terdeteksi)

## 🎨 Tampilan UI

### Kartu Summary

Terdapat 3 kartu summary dengan warna berbeda:

1. **Kartu Hijau** 💵: Total Pemasukan
2. **Kartu Merah** 💸: Total Pengeluaran
3. **Kartu Ungu** 📊: Saldo Periode

### Kartu Saldo Utama

- **Warna Biru**: Menampilkan saldo total keseluruhan
- Label jelas: "Saldo Total (Tidak Di-reset)"
- Informasi bahwa saldo mencakup semua transaksi sepanjang waktu

## 🎯 Cara Penggunaan

### Pencarian Transaksi

1. Gunakan search box di bagian atas
2. Ketik kata kunci (deskripsi, kategori, nominal, atau tipe)
3. Hasil akan difilter secara real-time
4. Klik tombol X untuk menghapus pencarian

### Filter Periode

1. **Quick Filter**: Klik tombol Hari Ini, Minggu Ini, Bulan Ini, atau Semua
2. **Filter Bulan**: Pilih dari dropdown "Semua Bulan"
3. **Filter Tahun**: Pilih dari dropdown "Semua Tahun"
4. **Kombinasi**: Pilih bulan DAN tahun untuk periode spesifik
5. Klik "Reset Filter" untuk menghapus semua filter

### Melihat Summary

- Total pemasukan, pengeluaran, dan saldo periode ditampilkan otomatis
- Angka akan berubah sesuai dengan filter yang aktif
- Saldo total tetap menampilkan nilai keseluruhan (tidak terpengaruh filter)

### Menambah Transaksi Manual

1. Klik tombol **+** (biru) di pojok kanan bawah
2. Pilih tipe: **Pengeluaran** atau **Pemasukan**
3. Masukkan jumlah (Rupiah)
4. Pilih kategori dari dropdown
5. Pilih tanggal (**Hanya dalam 1 tahun terakhir**)
6. Opsional: Tambahkan deskripsi
7. Klik **Simpan**

**⚠️ Penting:**

- Tanggal harus dalam rentang 1 tahun terakhir
- Tidak bisa memilih tanggal masa depan
- Browser akan mencegah input tanggal invalid

### Menambah Transaksi via Chat AI

**Single Transaction:**

1. Klik tombol **💬** (ungu) di pojok kanan bawah
2. Ketik transaksi dalam bahasa natural
   - Contoh: "Bayar makan 50rb"
   - Contoh: "Terima gaji 5 juta"
3. AI akan mem-parsing dan meminta konfirmasi
4. Klik **✓ Benar** untuk menyimpan atau **✗ Salah** untuk reject

**Multiple Transactions (Accept All):**

1. Klik tombol **💬** (ungu) di pojok kanan bawah
2. Ketik **beberapa transaksi sekaligus** dalam satu pesan
   - Contoh: "Tadi bayar makan 50rb, isi bensin 100rb, sama beli pulsa 25rb"
   - Contoh: "Belanja groceries 200 ribu dan bayar netflix 50 ribu"
3. AI akan mendeteksi dan menampilkan **semua transaksi**
4. Review daftar transaksi yang terdeteksi
5. Klik **✓ Accept All** untuk menyimpan semua transaksi sekaligus
6. Atau klik **✗ Reject All** jika ada yang salah

**Tips Multiple Transactions:**

- Gunakan kata penghubung: "dan", "sama", "terus", "lalu", "juga"
- Pisahkan dengan koma (,) juga bisa
- AI akan otomatis parsing amount, category, dan description untuk setiap transaksi
- Semua transaksi akan menggunakan tanggal hari ini

## 🔄 Logika Saldo

### Saldo Total (Tidak Di-reset)

- Menghitung SEMUA transaksi sejak awal
- Tidak terpengaruh oleh filter periode, bulan, atau tahun
- Selalu menampilkan nilai akurat dari seluruh riwayat

### Saldo Periode

- Menghitung transaksi sesuai filter yang aktif
- Jika filter bulan: hanya transaksi bulan tersebut
- Jika filter tahun: hanya transaksi tahun tersebut
- Berguna untuk melihat performa finansial per periode

## 📊 Fitur Lainnya

### Grafik Pie Chart

- Menampilkan distribusi pengeluaran per kategori
- Ikut terfilter berdasarkan periode yang dipilih
- Menunjukkan persentase dan nominal

### Daftar Transaksi

- Menampilkan maksimal 50 transaksi terfilter
- Setiap transaksi menampilkan:
  - Icon kategori
  - Deskripsi atau nama kategori
  - Tanggal transaksi
  - Badge tipe (Pemasukan/Pengeluaran)
  - Nominal dengan format Rupiah
- Hover untuk melihat tombol hapus

## ⚡ Performa

### Optimasi

- Hanya load transaksi 1 tahun terakhir dari database
- Filter dan pencarian dilakukan di client-side (cepat)
- Limit 50 transaksi ditampilkan untuk performa optimal
- Saldo total dihitung sekali saat load

### Data Display

- Transaksi > 1 tahun: Tidak ditampilkan
- Transaksi ≤ 1 tahun: Ditampilkan dan bisa difilter
- Saldo total: Selalu akurat terlepas dari filter

### Input Validation

- **Date picker dibatasi** dengan atribut HTML5 `min` dan `max`
- **Validasi server-side** mencegah bypass validasi client
- **Error handling** yang jelas dan informatif

## 🔒 Keamanan & Validasi

### Validasi Tanggal Input Manual

1. **Client-Side Validation:**
   - HTML5 date input dengan `min` (1 tahun lalu) dan `max` (hari ini)
   - Browser modern otomatis mencegah pemilihan tanggal invalid
2. **Server-Side Validation:**

   - Pengecekan ulang saat submit form
   - Mencegah bypass validasi client-side
   - Menampilkan error message yang jelas

3. **UX Improvement:**
   - Peringatan visual di bawah input tanggal
   - Error message dalam Bahasa Indonesia
   - Feedback real-time saat ada kesalahan

### Mengapa Dibatasi 1 Tahun?

- **Performa:** Mengurangi beban database dan mempercepat loading
- **Relevansi:** Fokus pada data finansial yang masih relevan
- **Konsistensi:** Selaras dengan policy tampilan transaksi 1 tahun
- **Best Practice:** Sesuai dengan standar aplikasi finansial modern
