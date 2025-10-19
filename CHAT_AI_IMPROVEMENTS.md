# 🚀 Chat AI Improvements

## Tanggal: 19 Oktober 2025

### 🐛 Bug Fixes & Improvements

#### 1. **Fix Negative Days for Future Dates** ✅

**Problem:**

- Saat user bilang "besok", "lusa", "minggu depan" → sistem menampilkan **-1 hari, -2 hari, -7 hari** (SALAH!)
- Seharusnya: "besok", "lusa", "minggu depan"

**Root Cause:**

- AI kadang tidak konsisten mengikuti instruksi negative value untuk masa depan
- System instruction kurang explicit tentang aturan negative/positive

**Solution:**

```typescript
// Updated system instruction dengan penekanan LEBIH JELAS:
MASA DEPAN (WAJIB NEGATIVE daysAgo!):
- "besok" = -1 (BUKAN 1!)
- "lusa" = -2 (BUKAN 2!)
- "besok lusa" = -2 (BUKAN 2!)
- "3 hari lagi" = -3 (BUKAN 3!)
- "minggu depan" = -7 (BUKAN 7!)
- "seminggu lagi" = -7 (BUKAN 7!)

PRIORITAS:
- Jika ada specificDate, abaikan daysAgo
- Jika tidak disebutkan waktu sama sekali, set daysAgo = 0
- INGAT! Masa depan = NEGATIVE, masa lalu = POSITIVE!
```

**Testing Examples:**

- ✅ "besok nonton bioskop 50rb" → daysAgo: **-1** → display: "**besok**"
- ✅ "lusa bayar internet 100k" → daysAgo: **-2** → display: "**lusa**"
- ✅ "minggu depan terima gaji 5jt" → daysAgo: **-7** → display: "**minggu depan**"

---

#### 2. **Improve AI Tolerance for Typos & Variations** 🧠

**Problem:**

- AI terlalu sensitif dan tidak mengerti typo:
  - "nonton **biosop**" → tidak mengerti (seharusnya bioskop)
  - "main **socer**" → tidak mengerti (seharusnya soccer)
  - "ikut mini **socer**" → tidak mengerti

**Solution:**

##### A. Enhanced System Instruction

```typescript
PENTING: Anda HARUS TOLERAN terhadap typo dan variasi kata:
- "bioskop" = "biosop" = "bioskob" = "bioskof" → Entertainment
- "soccer" = "socr" = "socer" = "futsal" → Entertainment
- "nonton" = "noton" = "nnton" → Entertainment
- "makan" = "mkn" = "mkan" → Food
- "bensin" = "bensn" = "benzin" → Transport
- dll. Gunakan context dan similarity untuk mengerti maksud user!
```

##### B. Expanded Entertainment Category

```typescript
Kategori Entertainment sekarang mencakup:
- Bioskop (dengan semua typo variants)
- Olahraga: futsal, soccer, badminton, gym, dll
- Konser, game, dll
```

##### C. Improved `isValidTransactionInput` Function

**Before:**

- Hanya exact match dengan keyword list
- Terlalu strict

**After:**

```typescript
- Fuzzy matching dengan 70% similarity threshold
- Expanded keyword list (100+ keywords)
- Support untuk entertainment, transport, food, bills, shopping
- Toleransi 1-2 karakter berbeda untuk kata > 4 huruf
```

**Keyword List Expansion:**

```typescript
Entertainment: nonton,
  noton,
  bioskop,
  biosop,
  bioskob,
  movie,
  main,
  soccer,
  socer,
  futsal,
  gym,
  game,
  konser;

Transport: bensin, bensn, benzin, parkir, ojek, taksi, grab;

Food: makan, mkn, kopi, cafe, resto, warung, jajan;

Bills: listrik, internet, pulsa, tagihan, kos, wifi;

Shopping: baju, sepatu, elektronik, hp, laptop;
```

**Testing Examples:**

- ✅ "besok nonton **biosop** 50k" → Entertainment ✓
- ✅ "lusa main **socer** 100k" → Entertainment ✓
- ✅ "ikut mini **socer** 75rb" → Entertainment ✓
- ✅ "bayar **bensn** 150k" → Transport ✓
- ✅ "**mkn** di resto 80k" → Food ✓

---

### 📊 Impact

#### Before:

- ❌ "besok nonton biosop" → tampil sebagai "-1 hari" (confusing!)
- ❌ "lusa main socer" → AI tidak mengerti (rejected)
- ❌ User frustration dengan typo

#### After:

- ✅ "besok nonton biosop" → tampil sebagai "**besok**" (clear!)
- ✅ "lusa main socer" → AI mengerti sebagai Entertainment
- ✅ Better user experience dengan typo tolerance

---

### 🔧 Files Modified

1. **`lib/gemini.ts`**

   - Updated `model` system instruction (single transaction)
   - Updated `multiModel` system instruction (multiple transactions)
   - Improved `isValidTransactionInput()` with fuzzy matching
   - Expanded keyword lists

2. **Impact on Components:**
   - `components/ChatModal.tsx` - No changes needed (auto benefits)
   - `app/api/parse-transaction/route.ts` - No changes needed (auto benefits)

---

### 🧪 Testing Scenarios

**Masa Depan (Future Dates):**

```
✅ "besok bayar listrik 100k"
✅ "lusa mau belanja 200rb"
✅ "minggu depan terima gaji 5jt"
✅ "3 hari lagi bayar kos 1.5jt"
```

**Typo Tolerance:**

```
✅ "nonton biosop besok 50k"
✅ "main socer lusa 100k"
✅ "isi bensn tadi 150k"
✅ "mkn di resto 80k"
✅ "noton film kemarin 45rb"
```

**Multiple Transactions:**

```
✅ "besok nonton biosop 50k dan lusa main socer 100k"
✅ "tadi mkn 30k, isi bensn 150k, sama beli pulsa 50k"
```

---

### 💡 Next Steps (Optional Future Improvements)

1. **Advanced NLP:**

   - Implement proper Levenshtein distance algorithm
   - Add word2vec or embedding-based similarity

2. **Learning System:**

   - Track user corrections
   - Adapt to user's personal vocabulary

3. **Bahasa Indonesia Slang:**

   - Support for: "gocap" (50k), "seceng" (100k), dll
   - Regional variations

4. **Multi-language Support:**
   - Better English support
   - Mixed language (Bahasa + English)

---

### 📝 Notes

- System prompt changes will take effect immediately (no rebuild needed)
- AI model (gemini-2.0-flash-exp) will now be more context-aware
- Fuzzy matching threshold set to 70% (can be tuned if needed)
- All existing functionality remains backward compatible

---

**Tested & Verified:** ✅
**Ready for Production:** ✅
