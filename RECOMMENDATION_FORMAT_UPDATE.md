# 🎨 Recommendation Format Update

## 📋 Overview

Update format rekomendasi AI agar lebih menarik, mudah dibaca, dan menggunakan bahasa yang relate dengan anak muda. Focus pada line spacing yang baik, struktur yang rapi, dan tone yang santai tapi tetap informatif.

## ✨ What's Changed

### 1. Tone & Language

**Before:**

- Formal dan kaku
- "Optimalisasi alokasi dana..."
- "Realisasikan saving ratio..."
- Terdengar seperti banker

**After:**

- Santai dan relatable
- "Coba kurangin budget jajan ya..."
- "Target nabung 20% dari gaji..."
- Seperti ngobrol sama temen yang ngerti soal duit

### 2. Line Spacing & Structure

#### Before (Cramped):

```markdown
## Rekomendasi

1. Kurangi pengeluaran
   Pengeluaran Anda tinggi...
   Langkah: bla bla
2. Tambah pemasukan
```

#### After (Better Spacing):

```markdown
## 💪 Action Plan Kamu

### 1️⃣ Kurangi Pengeluaran Food

**Kenapa penting:** Spending food kamu Rp 2 juta (40% total expense)

**Langkah konkret:**

- [ ] Masak sendiri minimal 4x seminggu
- [ ] Limit Gofood cuma weekend

**Target realistis:** Turunin 20% jadi Rp 1.6 juta

---

### 2️⃣ [Next action]
```

### 3. Emoji Usage

**Strategic placement untuk visual hierarchy:**

- 💰 💵 → Money related
- 📊 📈 → Analytics & data
- ✅ ⚠️ → Status indicators
- 💡 🔍 → Insights
- 🎯 🚀 → Goals & actions
- 📱 ✂️ → Lifestyle actions

**DON'T overuse:**
❌ "Hai! 👋 Yuk 🚀 kita 💪 mulai 🎯 atur 💰 keuangan! 🔥"
✅ "Hai! Yuk mulai atur keuangan kamu 💰"

### 4. Vocabulary Update

| Old (Formal)        | New (Casual)      |
| ------------------- | ----------------- |
| Optimalisasi        | Maksimalin        |
| Realisasikan        | Lakuin / Apply    |
| Alokasi dana        | Budget / Duit     |
| Saving ratio        | Persentase nabung |
| Non-esensial        | Yang gak perlu    |
| Konsumsi            | Jajan / Belanja   |
| Revenue             | Pemasukan / Cuan  |
| Expenditure         | Pengeluaran       |
| Transaksi finansial | Transaksi duit    |

## 🎨 New Format Structure

### Main Sections with Proper Spacing:

```markdown
# 💰 Analisis Keuangan Kamu

## 📊 Overview Singkat

[2-3 kalimat straightforward]

---

## 🔍 Yang Aku Temuin

- ✅ **[Positif]**: Explanation
- ⚠️ **[Perlu fix]**: Explanation
- 💡 **[Insight]**: Explanation

---

## 💪 Action Plan Kamu

### 1️⃣ [Action Title]

**Kenapa penting:** [1-2 kalimat]

**Langkah konkret:**

- [ ] Specific action 1
- [ ] Specific action 2

**Target realistis:** [Angka konkret]

---

### 2️⃣ [Next Action]

[Repeat format]

---

## 🎯 Challenge 30 Hari

**Week 1-2:**

- [ ] Quick wins
- [ ] Habit building

**Week 3-4:**

- [ ] Consistency actions
- [ ] Progress check

---

## 💭 Pesan Buat Kamu

[Personal motivational message]

---

_Note di akhir_
```

## 📝 Writing Guidelines

### DO ✅

- Gunakan "kamu" instead of "Anda"
- Sertakan angka konkret dari data user
- Buat action items yang super specific
- Mix antara supportive dan honest
- Relate dengan lifestyle (Gofood, Netflix, dll)
- Line break yang cukup antar section
- Emoji yang konsisten dan tidak berlebihan

### DON'T ❌

- Jargon keuangan yang ribet
- Wall of text tanpa spacing
- Generic advice tanpa data
- Terlalu banyak emoji
- Tone yang menggurui
- Panjang lebih dari 750 kata

## 🎯 Example Comparisons

### Example 1: Opening

**Before:**

```
Setelah menganalisis data transaksi Anda, dapat disimpulkan bahwa
kondisi keuangan Anda memerlukan optimalisasi pada beberapa aspek...
```

**After:**

```
## 📊 Overview Singkat

Jadi gini, dari Rp 5 juta pemasukan kamu, pengeluaran udah Rp 4.5 juta
(90%!). Sisanya cuma Rp 500rb. Tabungan masih tipis nih, tapi tenang,
ada cara buat improve!
```

### Example 2: Recommendations

**Before:**

```
## Rekomendasi
1. Optimalisasi pengeluaran kategori Food & Beverage
   Pengeluaran pada kategori ini mencapai 45% dari total...
```

**After:**

```
## 💪 Action Plan Kamu

### 1️⃣ Kurangin Spending Makanan/Minuman

**Kenapa penting:** Duit buat makan/minum kamu Rp 2.25 juta (45% dari
total expense). Ini terbesar dan bisa dikurangin tanpa ngorbanin kualitas
hidup.

**Langkah konkret:**
- [ ] Meal prep Minggu → hemat 40% dari Gofood
- [ ] Limit kafe cuma 2x seminggu (save Rp 400rb/bulan)
- [ ] Bawa tumblr → skip beli minuman di luar

**Target realistis:** Turunin 25% jadi Rp 1.7 juta dalam 1 bulan
```

### Example 3: Closing

**Before:**

```
## Pesan Motivasi
Tetap semangat dalam mengelola keuangan Anda. Dengan disiplin dan
konsistensi, tujuan finansial Anda akan tercapai.
```

**After:**

```
## 💭 Pesan Buat Kamu

Kamu udah mulai track keuangan, itu langkah pertama yang paling susah!
Sekarang tinggal konsisten aja. Gak usah perfect dari awal, progress
kecil setiap hari itu lebih valuable daripada gak mulai-mulai. You got
this! 💪

---

*Rekomendasi ini based on data transaksi kamu. Makin sering update,
makin akurat sarannya! 📈*
```

## 💅 CSS Styling Updates

Updated prose styling untuk better line spacing:

```tsx
className="prose prose-blue dark:prose-invert max-w-none prose-sm
  prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-4
  prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-0
  prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5
  prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
  prose-p:mb-3 prose-p:leading-relaxed
  prose-ul:my-3 prose-ul:space-y-2
  prose-li:my-1 prose-li:leading-relaxed
  prose-hr:my-5
  prose-strong:font-semibold"
```

Key improvements:

- Proper spacing between headings (`mb-3`, `mt-4`)
- Paragraph line height (`leading-relaxed`)
- List item spacing (`space-y-2`)
- HR margin for clear sections (`my-5`)

## 🧪 Testing Checklist

- [ ] Spacing terlihat jelas antar section
- [ ] Emoji tidak berlebihan
- [ ] Bahasa santai tapi tetap informatif
- [ ] Angka konkret dari data user
- [ ] Action items specific dan actionable
- [ ] Total panjang < 750 kata
- [ ] Personal dan tidak generic
- [ ] Mobile responsive
- [ ] Dark mode friendly

## 📚 Related Files

- `app/api/get-recommendations/route.ts` - AI system instruction
- `components/RecommendationModal.tsx` - UI styling

## 🎯 Impact

### User Engagement

- ✅ Lebih mudah dibaca karena spacing yang baik
- ✅ Lebih relate karena bahasa yang santai
- ✅ Lebih actionable karena step yang jelas
- ✅ Lebih personal karena pakai data mereka

### Readability Score

- Before: Formal, kadang intimidating
- After: Friendly, approachable, engaging

---

**Last Updated:** October 19, 2025
**Version:** 2.0.0
