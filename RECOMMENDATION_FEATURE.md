# 💡 Fitur Rekomendasi AI

## Deskripsi

Fitur Rekomendasi AI adalah fitur baru yang memungkinkan pengguna mendapatkan saran pengelolaan keuangan yang personal dan detail berdasarkan transaksi mereka.

## Cara Kerja

1. **User mengklik tombol Rekomendasi AI** (ikon 💡 di floating action button)
2. **Modal rekomendasi terbuka** dengan tampilan awal yang menarik
3. **User klik "Dapatkan Rekomendasi"**
4. **AI menganalisis transaksi** dalam 3 bulan terakhir meliputi:
   - Total pemasukan dan pengeluaran
   - Distribusi pengeluaran per kategori
   - Rata-rata pengeluaran bulanan
   - Pattern transaksi
5. **AI memberikan rekomendasi** dalam format yang detail namun mudah dibaca

## Fitur Utama

### 📊 Analisis Mendalam

- Menganalisis semua transaksi user dalam 3 bulan terakhir
- Menghitung statistik keuangan (total income, expense, rata-rata, dll)
- Mengidentifikasi kategori pengeluaran terbesar
- Mendeteksi pola spending

### 💡 Rekomendasi Personal

AI memberikan rekomendasi yang mencakup:

- **Analisis Kondisi Keuangan**: Evaluasi kondisi keuangan saat ini
- **Temuan Penting**: 3-5 insight penting dari data transaksi
- **Rekomendasi Utama**: 3-5 saran konkret dengan langkah-langkah action
- **Rencana Aksi 30 Hari**: Checklist yang bisa diikuti
- **Pesan Motivasi**: Pesan yang disesuaikan dengan kondisi user

### 🎯 Format yang Mudah Dibaca

- Menggunakan Markdown dengan emoji
- Struktur yang jelas dan organized
- Bahasa Indonesia yang natural dan mudah dipahami
- Tidak terlalu panjang (maksimal 800 kata)
- Fokus pada actionable advice

### 🔄 Fitur Tambahan

- **Refresh Rekomendasi**: Update rekomendasi kapan saja
- **Copy to Clipboard**: Salin rekomendasi untuk disimpan
- **Responsive Design**: Tampilan optimal di semua device
- **Dark Mode Support**: Nyaman dilihat dalam mode gelap

## Teknologi yang Digunakan

- **Google Gemini 2.0 Flash**: Model AI yang powerful untuk analisis
- **React Markdown**: Rendering markdown dengan styling yang bagus
- **Framer Motion**: Animasi smooth untuk UX yang lebih baik
- **Tailwind CSS**: Styling yang responsive dan modern

## Use Case

### Contoh 1: User dengan Pengeluaran Tinggi di Kategori Food

AI akan merekomendasikan:

- Mengurangi makan di luar, lebih banyak masak di rumah
- Set budget untuk kategori food
- Track pengeluaran food lebih ketat
- Target: Reduce food expense by 20% dalam 30 hari

### Contoh 2: User dengan Income > Expense tapi Tidak Ada Saving

AI akan merekomendasikan:

- Buat automatic saving setiap terima gaji
- Pisahkan rekening untuk saving
- Set saving goal yang realistis
- Mulai investasi kecil-kecilan

### Contoh 3: User dengan Data Transaksi Minim

AI akan memberikan:

- Tips umum pengelolaan keuangan
- Motivasi untuk mulai catat transaksi konsisten
- Penjelasan manfaat tracking keuangan

## File yang Terlibat

1. **`app/api/get-recommendations/route.ts`**: API endpoint untuk generate rekomendasi
2. **`components/RecommendationModal.tsx`**: Modal component untuk menampilkan rekomendasi
3. **`app/dashboard/page.tsx`**: Dashboard yang sudah ditambahkan tombol rekomendasi

## Keunggulan

✅ **Personal & Specific**: Berdasarkan data transaksi real user, bukan tips generic
✅ **Actionable**: Langkah konkret yang bisa langsung diterapkan
✅ **Detail tapi Readable**: Bahasa yang mudah dipahami dengan struktur jelas
✅ **Motivational**: Memberikan motivasi positif untuk improve
✅ **Data-Driven**: Semua saran didukung oleh data transaksi
✅ **Easy to Use**: Hanya perlu 1 klik untuk dapat rekomendasi
✅ **Modern UI/UX**: Tampilan menarik dengan animasi smooth

## Future Improvements

- [ ] Export rekomendasi ke PDF
- [ ] Notifikasi reminder untuk review rekomendasi bulanan
- [ ] Tracking progress dari rekomendasi sebelumnya
- [ ] Compare kondisi keuangan month-over-month
- [ ] Rekomendasi investasi berdasarkan profile risk
- [ ] Gamification: badge/achievement untuk financial goals
