import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Create Supabase client for API routes (server-side)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kpeykeqhdpyqdzabsycn.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZXlrZXFoZHB5cWR6YWJzeWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDcwOTgsImV4cCI6MjA3NjI4MzA5OH0.mekdpbOT4SDBaA27Bq_omiXp-6vasRlauuDfl-rBWL0";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // PENTING: Gunakan service role key untuk bypass RLS
    // Pastikan menggunakan SUPABASE_SERVICE_ROLE_KEY, bukan anon key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("=== DEBUGGING INFO ===");
    console.log("User ID:", userId);
    console.log("Supabase URL:", supabaseUrl);
    console.log(
      "Using Service Key:",
      supabaseServiceKey.substring(0, 20) + "..."
    );

    // Ambil SEMUA transaksi user (tidak pakai limit)
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false });

    console.log("Total transactions for user:", transactions?.length || 0);
    console.log("Total transactions for user:", transactions?.length || 0);

    if (transactions && transactions.length > 0) {
      console.log("Sample transaction:", transactions[0]);
      console.log(
        "Date range:",
        transactions[transactions.length - 1]?.transaction_date,
        "to",
        transactions[0]?.transaction_date
      );
    }

    console.log("=== END DEBUG ===");

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json(
        { error: `Failed to fetch transactions: ${error.message}` },
        { status: 500 }
      );
    }

    if (!transactions || transactions.length < 3) {
      console.log(
        `Only ${
          transactions?.length || 0
        } transactions found, minimum 3 required`
      );

      return NextResponse.json(
        {
          recommendation:
            "# 📊 Analisis Keuangan Kamu\n\n## ❌ Belum Cukup Data Nih\n\nKamu baru punya **" +
            (transactions?.length || 0) +
            ' transaksi**, padahal minimal butuh **3 transaksi** buat kasih rekomendasi yang akurat dan berguna.\n\n---\n\n## 🤔 Kenapa Harus 3 Transaksi?\n\n💡 **Biar keliatan pola spending kamu** - Dari situ bisa tau kamu lebih sering belanja apa\n\n💡 **Rekomendasi jadi lebih on point** - Makin banyak data, makin tau gaya hidup kamu\n\n💡 **Bisa compare kategori** - Ngeliat distribusi duit kamu kemana aja\n\n---\n\n## 🚀 Yuk Tambahin Transaksi!\n\n### Via Chat AI 💬\nPaling gampang! Tinggal chat natural aja:\n- "Bayar makan 50rb"\n- "Kemarin gajian 5 juta"  \n- "Besok bayar kos 1.5 juta"\n\n### Via Form Manual ✏️\nKlik tombol **"+"** di dashboard, isi detail transaksinya\n\n---\n\n## 💰 Tips Manage Duit (Sambil Nunggu Data)\n\n### 📝 **Mulai Catat Konsisten**\nApapun transaksinya, sekecil apapun, catat! Jajan kopi 15rb? Catat. Ngevoucher game? Catat juga.\n\n### 💵 **Aturan 50/30/20**\nCoba apply formula klasik:\n- 50% → Kebutuhan (kos, makan, transport)\n- 30% → Keinginan (nongkrong, entertainment)  \n- 20% → Nabung & investasi\n\n### 🎯 **Prioritas Nabung**\nApapun kondisinya, usahain sisih 10-20% dari penghasilan. Build dana darurat minimal 3 bulan expenses.\n\n### ✂️ **Cut yang Gak Perlu**\nReview langganan bulanan (Netflix, Spotify, etc). Masih kepake semua? Kalo jarang, mending pause dulu.\n\n### 📱 **Masak > Gofood**\nMasak sendiri bisa hemat 50-70% dibanding order terus. Sesekali boleh lah, tapi jangan setiap hari.\n\n### 📈 **Mulai Belajar Investasi**\nGak harus langsung investasi gede. Mulai dari yang aman dulu, pelajarin dulu risikonya.\n\n---\n\n## ⏭️ Next Steps\n\nTambahin **' +
            (3 - (transactions?.length || 0)) +
            " transaksi lagi**, terus klik 'Analisis Ulang'. Nanti bakal dapet rekomendasi yang super personal! 🎯\n\n---\n\n*Data kamu aman kok, gak bakal dishare kemana-mana* 🔒",
        },
        { status: 200 }
      );
    }

    // Hitung statistik
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Hitung pengeluaran per kategori
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseByCategory[t.category] =
          (expenseByCategory[t.category] || 0) + Number(t.amount);
      });

    // Hitung rata-rata pengeluaran per bulan
    const monthsCount = Math.max(
      1,
      Math.ceil(
        (new Date().getTime() -
          new Date(
            transactions[transactions.length - 1].transaction_date
          ).getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    );

    const avgMonthlyExpense = totalExpense / monthsCount;
    const avgMonthlyIncome = totalIncome / monthsCount;

    // Format data untuk AI
    const transactionSummary = `
Total transaksi: ${transactions.length}
Periode: ${transactions[transactions.length - 1].transaction_date} sampai ${
      transactions[0].transaction_date
    } (${monthsCount} bulan)

RINGKASAN KEUANGAN:
- Total Pemasukan: Rp ${totalIncome.toLocaleString("id-ID")}
- Total Pengeluaran: Rp ${totalExpense.toLocaleString("id-ID")}
- Saldo: Rp ${(totalIncome - totalExpense).toLocaleString("id-ID")}
- Rata-rata Pemasukan per Bulan: Rp ${avgMonthlyIncome.toLocaleString("id-ID")}
- Rata-rata Pengeluaran per Bulan: Rp ${avgMonthlyExpense.toLocaleString(
      "id-ID"
    )}

PENGELUARAN PER KATEGORI:
${Object.entries(expenseByCategory)
  .sort((a, b) => b[1] - a[1])
  .map(
    ([category, amount]) =>
      `- ${category}: Rp ${amount.toLocaleString("id-ID")} (${(
        (amount / totalExpense) *
        100
      ).toFixed(1)}%)`
  )
  .join("\n")}

DETAIL 10 TRANSAKSI TERAKHIR:
${transactions
  .slice(0, 10)
  .map(
    (t) =>
      `- ${t.transaction_date}: ${
        t.type === "income" ? "💰 Pemasukan" : "💸 Pengeluaran"
      } Rp ${Number(t.amount).toLocaleString("id-ID")} - ${t.category} (${
        t.description
      })`
  )
  .join("\n")}
`;

    // Generate rekomendasi dengan Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: `Anda adalah financial advisor yang gaul dan relate dengan anak muda. Tugas Anda menganalisis data keuangan user dan kasih saran yang praktis, actionable, dan gak boring.

PERSONALITY & TONE:
- Bahasa santai tapi tetap informatif (kayak ngobrol sama temen yang ngerti soal duit)
- Gunakan istilah anak muda: "duit", "nabung", "jajan", "gajian", dll
- Emoji secukupnya buat bikin engaging (jangan berlebihan)
- Jujur tapi supportive - kalo boros ya bilang, tapi kasih solusi
- Avoid jargon keuangan yang ribet, pake bahasa sederhana

FORMAT MARKDOWN YANG RAPI:

# � Analisis Keuangan Kamu

## 📊 Overview Singkat
[2-3 kalimat ringkasan kondisi keuangan mereka - straightforward dan to the point]

---

## � Yang Aku Temuin

[List 3-5 insight penting dengan bullet points. Mix antara yang positif dan yang perlu improvement]

- ✅ **[Hal positif]**: [Penjelasan singkat kenapa ini bagus]
- ⚠️ **[Area yang perlu diperbaiki]**: [Kenapa ini penting + angka spesifik]
- 💡 **[Insight menarik]**: [Pattern atau temuan dari data mereka]

---

## 💪 Action Plan Kamu

### 1️⃣ [Judul Action #1]

**Kenapa penting:** [Penjelasan 1-2 kalimat relate ke data mereka]

**Langkah konkret:**
- ● [Action item super spesifik #1]
- ● [Action item super spesifik #2]  
- ● [Action item super spesifik #3]

**Target realistis:** [Angka konkret, misal: "Turunin pengeluaran Food 20% dari Rp X ke Rp Y"]

---

### 2️⃣ [Judul Action #2]

[Ulangi format yang sama, 3-4 action plans total]

---

## 🎯 Challenge 30 Hari

[Buat checklist yang bisa difollow dalam sebulan, konkret dan achievable]

**Week 1-2:**
- ● [Quick win yang bisa dilakuin hari ini]
- ● [Habit building action]

**Week 3-4:**  
- ● [Action yang butuh konsistensi]
- ● [Evaluasi progress]

---

## � Pesan Buat Kamu

[2-3 kalimat motivasi yang personal banget ke kondisi mereka. Jangan generic. Harus bikin mereka feel "wah ini beneran ngerti gue". End with positive vibes.]

---

*Rekomendasi ini based on data transaksi kamu. Makin sering update, makin akurat sarannya! 📈*

RULES PENTING:
✅ Line spacing yang cukup antar section (pake separator ---)
✅ Maksimal 750 kata total - singkat tapi padat
✅ Setiap rekomendasi HARUS ada angka dari data mereka (jangan asal)
✅ Bullet points pake emoji yang konsisten (✅⚠️💡📌 dll)
✅ Hindari wall of text - pecah jadi chunks yang gampang dibaca
✅ Setiap action harus bisa langsung diterapin besok
✅ Tone: supportive friend yang smart soal duit, bukan banker kaku
✅ Relate dengan lifestyle anak muda (gofood, subscription, hang out, dll)

CONTOH BAHASA YANG ANAK MUDA:
❌ JANGAN: "Optimalisasi alokasi dana untuk kategori..."  
✅ PAKE: "Coba kurangin budget jajan ya..."

❌ JANGAN: "Realisasikan saving ratio minimal..."
✅ PAKE: "Target nabung 20% dari gaji, konsisten sebulan dulu"

❌ JANGAN: "Identifikasi pengeluaran non-esensial..."
✅ PAKE: "Cek deh pengeluaran yang sebenernya bisa di-skip"`,
    });

    const prompt = `Berdasarkan data transaksi keuangan berikut, buatkan rekomendasi pengelolaan keuangan yang detail, personal, dan actionable:

${transactionSummary}

Berikan analisis mendalam dan rekomendasi konkret yang bisa langsung diterapkan oleh pengguna untuk memperbaiki kondisi keuangan mereka.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const recommendation = response.text();

    return NextResponse.json({ recommendation }, { status: 200 });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
