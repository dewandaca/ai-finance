import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey && typeof window === "undefined") {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    amount: {
      type: SchemaType.NUMBER,
      description: "The numeric value of the transaction.",
    },
    type: {
      type: SchemaType.STRING,
      enum: ["income", "expense"],
      description: "Whether this is income or expense",
    },
    category: {
      type: SchemaType.STRING,
      enum: [
        "Food",
        "Transport",
        "Bills",
        "Salary",
        "Shopping",
        "Entertainment",
        "Transfer",
        "Other",
      ],
      description: "The category of the transaction",
    },
    description: {
      type: SchemaType.STRING,
      description: "A concise summary of the transaction.",
    },
    daysAgo: {
      type: SchemaType.NUMBER,
      description:
        "Number of days ago the transaction occurred (0 = today, 1 = yesterday, etc). Defaults to 0 if not specified.",
      nullable: true,
    },
    specificDate: {
      type: SchemaType.NUMBER,
      description:
        "Specific date (day of month) if mentioned (e.g., 'tanggal 15' = 15). Only extract if user mentions specific date number.",
      nullable: true,
    },
  },
  required: ["amount", "type", "category", "description"],
};

const multiSchema = {
  type: SchemaType.OBJECT,
  properties: {
    transactions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          amount: {
            type: SchemaType.NUMBER,
            description: "The numeric value of the transaction.",
          },
          type: {
            type: SchemaType.STRING,
            enum: ["income", "expense"],
            description: "Whether this is income or expense",
          },
          category: {
            type: SchemaType.STRING,
            enum: [
              "Food",
              "Transport",
              "Bills",
              "Salary",
              "Shopping",
              "Entertainment",
              "Transfer",
              "Other",
            ],
            description: "The category of the transaction",
          },
          description: {
            type: SchemaType.STRING,
            description: "A concise summary of the transaction.",
          },
          daysAgo: {
            type: SchemaType.NUMBER,
            description:
              "Number of days ago the transaction occurred (0 = today, 1 = yesterday, etc). Defaults to 0 if not specified.",
            nullable: true,
          },
          specificDate: {
            type: SchemaType.NUMBER,
            description:
              "Specific date (day of month) if mentioned (e.g., 'tanggal 15' = 15). Only extract if user mentions specific date number.",
            nullable: true,
          },
        },
        required: ["amount", "type", "category", "description"],
      },
    },
  },
  required: ["transactions"],
};

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: `Anda adalah asisten keuangan AI yang profesional. Tugas Anda adalah mengkonversi input bahasa natural pengguna (dalam Bahasa Indonesia atau Inggris) menjadi format JSON yang mendeskripsikan transaksi keuangan.

Aturan:
1. Tentukan tipe (income/pemasukan atau expense/pengeluaran) berdasarkan konteks
2. Pilih kategori yang paling sesuai dari daftar yang tersedia
3. Ekstrak jumlah nominal (konversi mata uang jika diperlukan, k = 1000, juta = 1000000)
4. Buat deskripsi yang ringkas dalam Bahasa Indonesia
5. DETEKSI WAKTU TRANSAKSI:
   - Relatif: "kemarin"=1, "2 hari lalu"=2, "seminggu lalu"=7, dsb → set daysAgo
   - Tanggal Spesifik: "tanggal 15", "tgl 20", "15 oktober", "pada tanggal 5" → set specificDate (hanya angka tanggalnya)
   - Jika ada specificDate, abaikan daysAgo
   - Jika tidak disebutkan waktu sama sekali, set daysAgo = 0
6. Respons HANYA dalam format JSON, tanpa teks tambahan

Kategori yang tersedia:
- Food (Makanan & Minuman)
- Transport (Transportasi)
- Bills (Tagihan & Utilitas)
- Salary (Gaji & Penghasilan)
- Shopping (Belanja)
- Entertainment (Hiburan)
- Transfer (Transfer Uang)
- Other (Lainnya)

Contoh:
- "Kasih adik 50 ribu" → expense, Transfer, 50000, "Transfer uang ke adik", daysAgo: 0
- "Kemarin bayar kos 1,2 juta" → expense, Bills, 1200000, "Bayar kos", daysAgo: 1
- "Tanggal 15 isi bensin 50k" → expense, Transport, 50000, "Isi bensin", specificDate: 15
- "Tgl 20 beli groceries 75 ribu" → expense, Food, 75000, "Belanja bahan makanan", specificDate: 20
- "Pada tanggal 5 terima gaji 5 juta" → income, Salary, 5000000, "Gaji bulanan", specificDate: 5
- "Makan di resto 250k" → expense, Food, 250000, "Makan di restoran", daysAgo: 0`,
});

export const multiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: multiSchema,
  },
  systemInstruction: `Anda adalah asisten keuangan AI yang profesional. Tugas Anda adalah mengkonversi input bahasa natural pengguna yang berisi MULTIPLE/BANYAK transaksi menjadi array of transactions dalam format JSON.

Aturan:
1. Deteksi SEMUA transaksi yang disebutkan dalam input
2. Untuk setiap transaksi, tentukan: amount, type (income/expense), category, description, daysAgo/specificDate
3. Ekstrak jumlah nominal (konversi: k=1000, juta=1000000, rb/ribu=1000)
4. DETEKSI WAKTU:
   - Relatif: "kemarin"=1, "2 hari lalu"=2, "seminggu lalu"=7 → set daysAgo
   - Tanggal Spesifik: "tanggal 15", "tgl 20" → set specificDate (hanya angka tanggalnya)
   - Jika ada specificDate, abaikan daysAgo
   - Default daysAgo=0 jika tidak disebutkan
5. Pilih kategori yang paling sesuai dari daftar yang tersedia
6. Respons HANYA dalam format JSON array, tanpa teks tambahan

Kategori yang tersedia:
- Food (Makanan & Minuman)
- Transport (Transportasi)
- Bills (Tagihan & Utilitas)
- Salary (Gaji & Penghasilan)
- Shopping (Belanja)
- Entertainment (Hiburan)
- Transfer (Transfer Uang)
- Other (Lainnya)

Contoh Input Multi-Transaksi:
"Tadi bayar makan 50rb, terus isi bensin 100rb, sama beli pulsa 25rb"
→ 3 transaksi: Food (50000, daysAgo:0), Transport (100000, daysAgo:0), Bills (25000, daysAgo:0)

"Tanggal 15 belanja groceries 200 ribu dan bayar netflix 50 ribu"
→ 2 transaksi: Food (200000, specificDate:15), Entertainment (50000, specificDate:15)`,
});

export type ParsedTransaction = {
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  daysAgo?: number;
  specificDate?: number;
};

export type MultiParsedTransactions = {
  transactions: ParsedTransaction[];
};

// Fungsi untuk mendeteksi apakah input mengandung multiple transactions
export function detectMultipleTransactions(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Kata-kata yang mengindikasikan multiple transactions
  const multiIndicators = [
    " dan ",
    " sama ",
    " terus ",
    " lalu ",
    " kemudian ",
    " juga ",
    " plus ",
    ", ",
    " serta ",
  ];

  // Kata-kata transaksi
  const transactionWords = [
    "bayar",
    "beli",
    "buat",
    "kasih",
    "transfer",
    "isi",
    "kirim",
    "terima",
    "dapat",
    "jual",
    "gaji",
    "bonus",
    "makan",
    "belanja",
  ];

  // Hitung berapa kali kata transaksi muncul
  let transactionCount = 0;
  transactionWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}`, "gi");
    const matches = lowerText.match(regex);
    if (matches) transactionCount += matches.length;
  });

  // Cek apakah ada indikator multiple dan lebih dari 1 transaksi
  const hasMultiIndicator = multiIndicators.some((indicator) =>
    lowerText.includes(indicator)
  );

  return hasMultiIndicator && transactionCount >= 2;
}

// Fungsi untuk mendeteksi chat casual (bukan transaksi)
export function detectCasualChat(text: string): string | null {
  const lowerText = text.toLowerCase().trim();

  // Deteksi sapaan
  const greetings = ["halo", "hai", "hello", "hi", "hei", "hey"];
  if (greetings.some((g) => lowerText === g || lowerText.startsWith(g + " "))) {
    const responses = [
      "Hai juga! Ada transaksi yang mau dicatat? 😊",
      "Halo! Mau cerita soal transaksi apa hari ini?",
      "Hai! Yuk ceritain pengeluaran atau pemasukan kamu",
      "Hei! Siap bantu catat keuangan kamu nih 💰",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Deteksi kabar
  const kabarPatterns = [
    "apa kabar",
    "apakabar",
    "how are you",
    "kabar",
    "gimana kabar",
  ];
  if (kabarPatterns.some((p) => lowerText.includes(p))) {
    const responses = [
      "Baik dong! Kamu gimana? Ada transaksi yang perlu dicatat? 😄",
      "Alhamdulillah baik! Yuk cerita soal keuangan kamu hari ini",
      "Baik-baik aja! Nah sekarang kita fokus ke keuangan kamu yuk",
      "Good! Btw ada pengeluaran atau pemasukan yang mau dicatat?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Deteksi terima kasih
  const thanksPatterns = [
    "terima kasih",
    "terimakasih",
    "makasih",
    "thanks",
    "thank you",
    "thx",
    "mksh"
  ];
  if (thanksPatterns.some((p) => lowerText.includes(p))) {
    const responses = [
      "Sama-sama! Senang bisa bantu 😊",
      "Sip! Kapan-kapan catat transaksi lagi ya",
      "No problem! Ada lagi yang mau dicatat?",
      "Oke! Nanti kalau ada transaksi lagi langsung chat aja ya",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Deteksi penutupan/pamit
  const goodbyePatterns = [
    "bye",
    "dadah",
    "sampai jumpa",
    "see you",
    "selamat tinggal",
    "sampai nanti",
    "sampai jumpa lagi",
    "bye bye",
    "babay",
  ];
  if (goodbyePatterns.some((p) => lowerText.includes(p))) {
    const responses = [
      "Oke sampai jumpa! Jaga keuangan ya 👋",
      "Bye! Semangat atur keuangannya",
      "See you! Jangan lupa catat transaksi terus ya",
      "Dadah! Nanti balik lagi kalau ada transaksi baru",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Deteksi pertanyaan tentang app/web ini
  const aboutAppPatterns = [
    "ini app apa",
    "ini aplikasi apa",
    "ini web apa",
    "ini website apa",
    "ini buat apa",
    "fungsi app ini",
    "kegunaannya apa",
    "apa gunanya",
    "jelaskan app ini",
    "apa itu app ini",
    "untuk apa ini",
    "app ini ngapain",
    "web ini buat apa",
    "web ini buat ngapain",
    "web ini untuk apa",
    "gmna sih cara",
    "gimana sih cara",
    "bagaimana cara",
    "cara kerja",
    "gmna caranya",
    "gimana caranya",
    "gmna cara",
    "gimana cara",

    
  ];
  if (aboutAppPatterns.some((p) => lowerText.includes(p))) {
    const responses = [
      "Jadi gini, ini tuh kayak asisten pribadi kamu buat ngatur duit! Gampang banget, tinggal chat aja mau catat pengeluaran atau pemasukan. Misal 'bayar makan 50rb' langsung aku tangkap dan simpan. Nanti semua data keuangan kamu bisa diliat di dashboard. Praktis kan? 💸",
      "Oh ini? Simple aja sih, basically platform buat kamu yang males ribet nyatet uang keluar masuk. Cukup ngobrol santai kayak gini, cerita 'tadi belanja 100rb' atau 'dapet gaji 5 juta', auto kesimpen deh. Plus ada dashboard yang bikin kamu tau kemana aja duit kamu pergi. Jadi lebih aware soal finansial! 📊",
      "Nah ini tuh aplikasi keuangan tapi gak boring kayak yang lain. Konsepnya conversational gitu, jadi kamu tinggal chat natural aja. Mau catat pengeluaran? Tinggal bilang 'bayar kos 1.5jt kemarin' langsung oke. Terus nanti bisa tracking semua transaksi di dashboard. Intinya bikin manage duit jadi gak ribet dan lebih fun! 🎯",
      "Sederhananya gini, ini web finance tracker yang pake AI. Bedanya sama yang lain, kamu gak perlu isi form yang ribet-ribet. Chat aja santai kayak lagi ngobrol, misal 'isi bensin 150k tadi pagi' atau '2 hari lalu bayar netflix', aku langsung ngerti dan catat. Dashboard-nya juga enak diliat buat monitor cashflow kamu. Cocok buat yang pengen tracking keuangan tapi gak mau pusing! 💰",
      "Jadi begini bro/sis, ini platform smart finance management. Fitur utamanya chat AI kayak gini yang bisa detect transaksi dari obrolan natural. Kamu tinggal cerita aja 'tadi belanja groceries 200rb' atau 'kemarin terima bonus 1jt', langsung tercatat rapi. Nanti ada summary lengkap di dashboard-nya. Konsepnya bikin pencatatan keuangan jadi lebih human dan gak membosankan! 📱✨",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return null;
}

// Fungsi untuk menghitung tanggal transaksi berdasarkan daysAgo
export function calculateTransactionDate(daysAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

// Fungsi untuk menghitung tanggal berdasarkan specificDate atau daysAgo
export function getTransactionDate(
  daysAgo?: number,
  specificDate?: number
): string {
  const today = new Date();

  if (specificDate) {
    // Jika specificDate disebutkan, gunakan bulan dan tahun sekarang
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDay = today.getDate();

    // Jika tanggal yang disebutkan lebih besar dari hari ini di bulan ini,
    // asumsikan itu bulan lalu
    let targetMonth = currentMonth;
    let targetYear = currentYear;

    if (specificDate > currentDay) {
      // Tanggal di bulan lalu
      targetMonth = currentMonth - 1;
      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear = currentYear - 1;
      }
    }

    // PERBAIKAN: Gunakan format YYYY-MM-DD langsung untuk menghindari timezone issue
    const monthStr = String(targetMonth + 1).padStart(2, "0"); // +1 karena month 0-indexed
    const dateStr = String(specificDate).padStart(2, "0");
    return `${targetYear}-${monthStr}-${dateStr}`;
  } else {
    // Gunakan daysAgo (default 0)
    const date = new Date();
    date.setDate(date.getDate() - (daysAgo || 0));
    return date.toISOString().split("T")[0];
  }
}

// Fungsi untuk format tanggal dalam bahasa Indonesia
export function formatTransactionTime(
  daysAgo?: number,
  specificDate?: number
): string {
  if (specificDate) {
    return `tanggal ${specificDate}`;
  }

  const days = daysAgo || 0;
  if (days === 0) {
    return "hari ini";
  } else if (days === 1) {
    return "kemarin";
  } else if (days === 7) {
    return "seminggu lalu";
  } else {
    return `${days} hari lalu`;
  }
}

// Fungsi untuk mendeteksi apakah input adalah transaksi yang valid
export function isValidTransactionInput(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Kata-kata kunci yang mengindikasikan transaksi
  const transactionKeywords = [
    "bayar",
    "beli",
    "belanja",
    "buat",
    "kasih",
    "kirim",
    "transfer",
    "isi",
    "terima",
    "dapat",
    "gaji",
    "bonus",
    "jual",
    "makan",
    "beli",
    "shopping",
    "spent",
    "paid",
    "received",
    "income",
    "expense",
    "pengeluaran",
    "pemasukan",
    "keluar",
    "masuk",
  ];

  // Pola angka (untuk nominal)
  const hasNumber = /\d/.test(text);

  // Cek apakah ada kata kunci transaksi DAN ada angka
  const hasTransactionKeyword = transactionKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  return hasTransactionKeyword && hasNumber;
}

export async function parseTransactionText(
  text: string
): Promise<ParsedTransaction> {
  try {
    const result = await model.generateContent(text);
    const response = result.response;
    const jsonText = response.text();
    const parsed = JSON.parse(jsonText);

    return parsed as ParsedTransaction;
  } catch (error) {
    console.error("Error parsing transaction:", error);
    throw new Error(
      "Failed to parse transaction. Please try rephrasing or use the manual form."
    );
  }
}

export async function parseMultipleTransactions(
  text: string
): Promise<MultiParsedTransactions> {
  try {
    const result = await multiModel.generateContent(text);
    const response = result.response;
    const jsonText = response.text();
    const parsed = JSON.parse(jsonText);

    return parsed as MultiParsedTransactions;
  } catch (error) {
    console.error("Error parsing multiple transactions:", error);
    throw new Error(
      "Failed to parse multiple transactions. Please try rephrasing or use the manual form."
    );
  }
}
