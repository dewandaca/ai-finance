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
            "# 📊 Rekomendasi Pengelolaan Keuangan\n\n## ❌ Data Tidak Mencukupi\n\nAnda hanya memiliki **" +
            (transactions?.length || 0) +
            ' transaksi**, sedangkan minimal **3 transaksi** diperlukan untuk memberikan rekomendasi yang akurat dan bermakna.\n\n### 💡 Mengapa Minimal 3 Transaksi?\n\n1. **Pola Keuangan** - Kita perlu melihat pola pengeluaran dan pemasukan Anda\n2. **Analisis Akurat** - Data yang lebih banyak menghasilkan rekomendasi yang lebih tepat\n3. **Kategori Beragam** - Agar bisa melihat distribusi pengeluaran Anda\n\n### 🚀 Cara Menambah Transaksi:\n\n1. **Gunakan Chat AI** 💬\n   - Ceritakan transaksi dengan bahasa natural\n   - Contoh: "Bayar makan 50 ribu" atau "Terima gaji 5 juta"\n\n2. **Input Manual** ✏️\n   - Klik tombol "+" di dashboard\n   - Isi form transaksi dengan lengkap\n\n### 💰 Tips Umum Pengelolaan Keuangan:\n\n1. **Mulai Mencatat Transaksi**\n   - Catat semua pemasukan dan pengeluaran secara konsisten\n   - Jangan lewatkan transaksi sekecil apapun\n\n2. **Buat Anggaran**\n   - Gunakan aturan 50/30/20 (50% kebutuhan, 30% keinginan, 20% tabungan)\n   - Sesuaikan dengan kondisi keuangan Anda\n\n3. **Prioritaskan Tabungan**\n   - Sisihkan minimal 10-20% dari pendapatan\n   - Bangun dana darurat 3-6 bulan pengeluaran\n\n4. **Kurangi Pengeluaran yang Tidak Perlu**\n   - Review langganan bulanan\n   - Masak di rumah lebih sering\n\n5. **Investasi untuk Masa Depan**\n   - Mulai belajar tentang investasi\n   - Mulai dari yang kecil dan aman\n\n**Tambahkan minimal ' +
            (3 - (transactions?.length || 0)) +
            " transaksi lagi**, lalu coba analisis ulang untuk mendapatkan rekomendasi yang personal! 🎯",
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
      systemInstruction: `Anda adalah seorang ahli keuangan profesional yang berpengalaman dalam memberikan saran pengelolaan keuangan personal. Tugas Anda adalah menganalisis data transaksi pengguna dan memberikan rekomendasi yang:

1. DETAIL namun MUDAH DIBACA - gunakan bahasa yang ramah dan tidak terlalu formal
2. SPESIFIK untuk kondisi keuangan pengguna - jangan generik
3. ACTIONABLE - berikan langkah konkret yang bisa dilakukan
4. REALISTIS - sesuai dengan kondisi keuangan pengguna
5. POSITIF namun JUJUR - motivasi tanpa menutupi masalah

Format rekomendasi Anda dalam Markdown dengan struktur:

# 📊 Rekomendasi Pengelolaan Keuangan

## 🔍 Analisis Kondisi Keuangan Anda

[Berikan analisis singkat tentang kondisi keuangan mereka - apakah sehat, perlu perbaikan, dll. Sertakan angka spesifik]

## 💡 Temuan Penting

[Highlight 3-5 temuan penting dari analisis, bisa positif atau area yang perlu diperbaiki. Gunakan emoji dan bullet points]

## ✅ Rekomendasi Utama

### 1. [Judul Rekomendasi]
**Mengapa:** [Penjelasan singkat kenapa ini penting berdasarkan data mereka]

**Langkah konkret:**
- [Action item 1]
- [Action item 2]
- [Action item 3]

**Target:** [Target yang realistis, contoh: "Kurangi pengeluaran X sebesar Y% dalam Z bulan"]

[Ulangi untuk 3-5 rekomendasi utama]

## 🎯 Rencana Aksi 30 Hari

[Berikan checklist konkret yang bisa dilakukan dalam 30 hari ke depan]

- [ ] [Aksi 1]
- [ ] [Aksi 2]
- [ ] [Aksi 3]
- [ ] [Aksi 4]
- [ ] [Aksi 5]

## 💪 Pesan Motivasi

[Berikan pesan motivasi yang personal berdasarkan kondisi keuangan mereka]

---

**Catatan:** Rekomendasi ini dibuat berdasarkan data transaksi Anda. Update secara berkala untuk hasil yang lebih akurat.

PENTING:
- Gunakan bahasa Indonesia yang natural dan mudah dipahami
- Sertakan emoji yang relevan untuk membuat lebih menarik
- Berikan angka konkret dari data transaksi mereka
- Fokus pada solusi praktis yang bisa langsung diterapkan
- Jangan terlalu panjang - maksimal 800 kata
- Pastikan setiap rekomendasi didukung oleh data transaksi yang ada`,
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
