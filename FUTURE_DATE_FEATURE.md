# 🚀 Future Date Transaction Feature

## 📋 Overview

Fitur ini memungkinkan user untuk mencatat transaksi tidak hanya untuk masa lalu, tapi juga untuk masa depan (maksimal 1 tahun dari hari ini). Cocok untuk planning keuangan dan reminder pembayaran di masa depan.

## ✨ Fitur Utama

### 1. Manual Transaction Form

- ✅ Dapat input tanggal dari **1 tahun lalu** sampai **1 tahun ke depan**
- ✅ Validasi otomatis untuk range tanggal yang valid
- ✅ Pesan error yang jelas jika tanggal di luar range

### 2. Chat AI dengan Natural Language

User bisa chat dengan cara natural untuk transaksi masa depan:

#### Contoh Input Masa Depan:

```
✅ "Besok bayar tagihan 100rb"
✅ "Lusa bayar internet 300 ribu"
✅ "Minggu depan terima gaji 5 juta"
✅ "3 hari lagi bayar kos 1.5 juta"
```

#### Contoh Input Masa Lalu (tetap work):

```
✅ "Kemarin bayar makan 50rb"
✅ "2 hari lalu isi bensin 100rb"
✅ "Seminggu lalu belanja groceries 200rb"
```

#### Contoh Tanggal Spesifik:

```
✅ "Tanggal 15 bayar listrik 150rb"
✅ "Tgl 20 terima bonus 2 juta"
```

### 3. Multiple Transactions Support

Bisa input beberapa transaksi sekaligus dengan waktu yang berbeda:

```
✅ "Besok bayar listrik 150rb dan lusa bayar internet 300rb"
✅ "Kemarin makan 50rb, terus isi bensin 100rb"
```

## 🔧 Technical Changes

### 1. Schema Update (`lib/gemini.ts`)

```typescript
daysAgo: {
  type: SchemaType.NUMBER,
  description: "Positive untuk masa lalu, NEGATIVE untuk masa depan.
                0 = hari ini
                1 = kemarin
                -1 = besok
                -2 = lusa
                7 = seminggu lalu
                -7 = minggu depan"
}
```

### 2. Date Calculation

```typescript
// Support negative daysAgo untuk masa depan
const transactionDate = new Date();
transactionDate.setDate(transactionDate.getDate() - days);
// Negative days akan menambah hari (ke masa depan)
```

### 3. Validation Update

```typescript
// Old: Hanya sampai hari ini
if (selectedDate > today) throw new Error("...");

// New: Sampai 1 tahun ke depan
const oneYearAhead = new Date();
oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
if (selectedDate > oneYearAhead) throw new Error("...");
```

## 🎨 UI/UX Improvements

### Welcome Message Chat AI

Update message pembuka dengan contoh yang lebih lengkap termasuk masa depan:

```
"Halo! Saya asisten keuangan AI Anda. Ceritakan transaksi dengan bahasa natural:

🔸 'Bayar makan 50 ribu'
🔸 'Kemarin terima gaji 5 juta'
🔸 'Besok bayar tagihan 100rb'
🔸 'Tanggal 15 belanja groceries 200rb'

Bisa juga untuk masa depan! 💰"
```

### Date Display

Format yang user-friendly untuk berbagai kondisi:

- Masa lalu: "kemarin", "2 hari lalu", "seminggu lalu"
- Hari ini: "hari ini"
- Masa depan: "besok", "lusa", "3 hari lagi", "minggu depan"
- Tanggal spesifik: "tanggal 15"

## 📝 Use Cases

### 1. Financial Planning

```
User: "Minggu depan terima gaji 5 juta"
AI: ✅ Mencatat pemasukan untuk minggu depan
```

### 2. Bill Reminder

```
User: "Tanggal 20 bayar internet 300rb dan listrik 150rb"
AI: ✅ Mencatat 2 tagihan untuk tanggal 20
```

### 3. Future Budget

```
User: "Besok mau belanja groceries 200rb, lusa bayar kos 1.5 juta"
AI: ✅ Planning pengeluaran 2 hari ke depan
```

## ⚠️ Validations

1. **Range Validation**
   - Minimal: 1 tahun yang lalu
   - Maksimal: 1 tahun ke depan
2. **Error Messages**
   - "Transaksi tidak dapat dicatat untuk tanggal lebih dari 1 tahun yang lalu"
   - "Transaksi tidak dapat dicatat untuk tanggal lebih dari 1 tahun ke depan"

## 🧪 Testing Examples

### Test Case 1: Besok

```
Input: "Besok bayar listrik 100rb"
Expected: daysAgo = -1, Date = tomorrow
```

### Test Case 2: Lusa

```
Input: "Lusa bayar internet 300rb"
Expected: daysAgo = -2, Date = day after tomorrow
```

### Test Case 3: Minggu Depan

```
Input: "Minggu depan terima gaji 5 juta"
Expected: daysAgo = -7, Date = 7 days from now
```

### Test Case 4: Multiple Future

```
Input: "Besok bayar listrik 150rb dan lusa bayar internet 300rb"
Expected: 2 transactions dengan tanggal berbeda
```

## 🔄 Migration Notes

Tidak ada migration yang diperlukan. Feature ini backward compatible dengan data existing. Transaksi lama tetap valid dan tidak terpengaruh.

## 📚 Related Files

- `components/ManualTransactionModal.tsx` - Form manual transaction
- `components/ChatModal.tsx` - Chat AI interface
- `lib/gemini.ts` - AI parsing logic
- `app/api/parse-transaction/route.ts` - API endpoint

## 🎯 Future Enhancements

1. **Notification/Reminder** - Notif untuk transaksi yang akan datang
2. **Recurring Transactions** - Support transaksi berulang
3. **Calendar View** - Visualisasi transaksi masa depan di calendar
4. **Budget Forecast** - Prediksi budget berdasarkan transaksi scheduled

---

**Last Updated:** October 19, 2025
**Version:** 2.0.0
