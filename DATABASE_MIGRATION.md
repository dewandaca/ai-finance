# Update Database Amount Limit

## Masalah

Database tidak bisa menyimpan transaksi ratusan juta rupiah karena kolom `amount` dibatasi ke `NUMERIC(10, 2)` yang maksimal 99.999.999,99 (99 juta).

## Solusi

Mengubah tipe data kolom `amount` menjadi `NUMERIC(15, 2)` yang mendukung hingga 9.999.999.999.999,99 (hampir 10 triliun).

## Cara Menjalankan Migrasi

### Opsi 1: Melalui Supabase Dashboard (Direkomendasikan)

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy-paste isi file `supabase/migrations/001_update_amount_limit.sql`
6. Klik **Run** untuk menjalankan migrasi

### Opsi 2: Melalui Supabase CLI

```bash
# Pastikan Supabase CLI sudah terinstall
supabase db push
```

## Perubahan Schema

### Sebelum:

```sql
amount NUMERIC(10, 2) -- Maksimal: 99.999.999,99 (99 juta)
```

### Sesudah:

```sql
amount NUMERIC(15, 2) -- Maksimal: 9.999.999.999.999,99 (hampir 10 triliun)
```

## Testing

Setelah migrasi, coba catat transaksi dengan nominal:

- ✅ Rp 100.000.000 (100 juta)
- ✅ Rp 500.000.000 (500 juta)
- ✅ Rp 1.000.000.000 (1 miliar)
- ✅ Rp 10.000.000.000 (10 miliar)

## Note

Perubahan ini hanya mempengaruhi database. Tidak ada perubahan kode aplikasi yang diperlukan karena JavaScript/TypeScript secara native mendukung angka besar ini.
