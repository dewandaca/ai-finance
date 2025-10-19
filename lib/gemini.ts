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
        "Number of days in the PAST the transaction occurred (positive number for past: 0 = today, 1 = yesterday, etc). Use NEGATIVE number for future dates (-1 = tomorrow, -2 = day after tomorrow). Can also be -7 for 'minggu depan' (next week). Defaults to 0 if not specified.",
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
              "Number of days in the PAST the transaction occurred (positive number for past: 0 = today, 1 = yesterday, etc). Use NEGATIVE number for future dates (-1 = tomorrow, -2 = day after tomorrow). Can also be -7 for 'minggu depan' (next week). Defaults to 0 if not specified.",
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
  systemInstruction: `Anda adalah asisten keuangan AI yang profesional dan TOLERAN terhadap typo/salah ketik. Tugas Anda adalah mengkonversi input bahasa natural pengguna (dalam Bahasa Indonesia atau Inggris) menjadi format JSON yang mendeskripsikan transaksi keuangan.

PENTING: Anda HARUS TOLERAN terhadap typo dan variasi kata:
- "bioskop" = "biosop" = "bioskob" = "bioskof" → Entertainment
- "soccer" = "socr" = "socer" = "futsal" → Entertainment  
- "nonton" = "noton" = "nnton" → Entertainment
- "makan" = "mkn" = "mkan" → Food
- "bensin" = "bensn" = "benzin" → Transport
- dll. Gunakan context dan similarity untuk mengerti maksud user!

Aturan:
1. Tentukan tipe (income/pemasukan atau expense/pengeluaran) berdasarkan konteks
2. Pilih kategori yang paling sesuai dari daftar yang tersedia (TOLERAN typo!)
3. Ekstrak jumlah nominal (konversi mata uang jika diperlukan, k = 1000, juta = 1000000)
4. Buat deskripsi yang ringkas dalam Bahasa Indonesia
5. DETEKSI WAKTU TRANSAKSI - PENTING! MASA DEPAN HARUS NEGATIVE!:
   
   MASA LALU (positive daysAgo):
   - "hari ini" = 0
   - "kemarin" = 1
   - "2 hari lalu" = 2
   - "seminggu lalu" = 7
   - "minggu lalu" = 7
   
   MASA DEPAN (WAJIB NEGATIVE daysAgo!):
   - "besok" = -1 (BUKAN 1!)
   - "lusa" = -2 (BUKAN 2!)
   - "besok lusa" = -2 (BUKAN 2!)
   - "3 hari lagi" = -3 (BUKAN 3!)
   - "minggu depan" = -7 (BUKAN 7!)
   - "seminggu lagi" = -7 (BUKAN 7!)
   
   TANGGAL SPESIFIK (gunakan specificDate):
   - "tanggal 15" → specificDate: 15
   - "tgl 20" → specificDate: 20
   - "15 oktober" → specificDate: 15
   - "pada tanggal 5" → specificDate: 5
   
   PRIORITAS:
   - Jika ada specificDate, abaikan daysAgo
   - Jika tidak disebutkan waktu sama sekali, set daysAgo = 0
   - INGAT! Masa depan = NEGATIVE, masa lalu = POSITIVE!
   
6. Respons HANYA dalam format JSON, tanpa teks tambahan

Kategori yang tersedia:
- Food (Makanan & Minuman) - termasuk resto, cafe, warung, dll
- Transport (Transportasi) - termasuk bensin, parkir, ojek, taksi
- Bills (Tagihan & Utilitas) - listrik, air, internet, pulsa, kos, laundry
- Salary (Gaji & Penghasilan) - gaji, bonus, THR
- Shopping (Belanja) - baju, elektronik, barang
- Entertainment (Hiburan) - bioskop, game, konser, olahraga (futsal/soccer/badminton), gym
- Transfer (Transfer Uang) - kasih ke orang, kirim uang
- Other (Lainnya) - yang tidak masuk kategori lain

Contoh:
- "Kasih adik 50 ribu" → expense, Transfer, 50000, "Transfer uang ke adik", daysAgo: 0
- "Kemarin bayar kos 1,2 juta" → expense, Bills, 1200000, "Bayar kos", daysAgo: 1
- "Besok bayar tagihan 100rb" → expense, Bills, 100000, "Bayar tagihan", daysAgo: -1 (NEGATIVE!)
- "Lusa mau bayar internet 300 ribu" → expense, Bills, 300000, "Bayar internet", daysAgo: -2 (NEGATIVE!)
- "Minggu depan terima gaji 5 juta" → income, Salary, 5000000, "Gaji bulanan", daysAgo: -7 (NEGATIVE!)
- "besok nonton biosop 50rb" → expense, Entertainment, 50000, "Nonton bioskop", daysAgo: -1 (NEGATIVE!)
- "lusa main socer 100k" → expense, Entertainment, 100000, "Main soccer", daysAgo: -2 (NEGATIVE!)
- "Tanggal 15 isi bensin 50k" → expense, Transport, 50000, "Isi bensin", specificDate: 15
- "Makan di resto 250k" → expense, Food, 250000, "Makan di restoran", daysAgo: 0`,
});

export const multiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: multiSchema,
  },
  systemInstruction: `Anda adalah asisten keuangan AI yang profesional dan TOLERAN terhadap typo/salah ketik. Tugas Anda adalah mengkonversi input bahasa natural pengguna yang berisi MULTIPLE/BANYAK transaksi menjadi array of transactions dalam format JSON.

PENTING: Anda HARUS TOLERAN terhadap typo dan variasi kata:
- "bioskop" = "biosop" = "bioskob" = "bioskof" → Entertainment
- "soccer" = "socr" = "socer" = "futsal" → Entertainment  
- "nonton" = "noton" = "nnton" → Entertainment
- dll. Gunakan context dan similarity untuk mengerti maksud user!

Aturan:
1. Deteksi SEMUA transaksi yang disebutkan dalam input
2. Untuk setiap transaksi, tentukan: amount, type (income/expense), category, description, daysAgo/specificDate
3. Ekstrak jumlah nominal (konversi: k=1000, juta=1000000, rb/ribu=1000)
4. DETEKSI WAKTU - PENTING! MASA DEPAN HARUS NEGATIVE!:
   
   MASA LALU (positive daysAgo):
   - "hari ini" = 0
   - "kemarin" = 1
   - "2 hari lalu" = 2
   - "seminggu lalu" / "minggu lalu" = 7
   
   MASA DEPAN (WAJIB NEGATIVE daysAgo!):
   - "besok" = -1 (BUKAN 1!)
   - "lusa" / "besok lusa" = -2 (BUKAN 2!)
   - "3 hari lagi" = -3 (BUKAN 3!)
   - "minggu depan" / "seminggu lagi" = -7 (BUKAN 7!)
   
   TANGGAL SPESIFIK (gunakan specificDate):
   - "tanggal 15" → specificDate: 15
   - "tgl 20" → specificDate: 20
   
   PRIORITAS:
   - Jika ada specificDate, abaikan daysAgo
   - Default daysAgo=0 jika tidak disebutkan
   - INGAT! Masa depan = NEGATIVE, masa lalu = POSITIVE!
   
5. Pilih kategori yang paling sesuai dari daftar yang tersedia (TOLERAN typo!)
6. Respons HANYA dalam format JSON array, tanpa teks tambahan

Kategori yang tersedia:
- Food (Makanan & Minuman) - termasuk resto, cafe, warung
- Transport (Transportasi) - bensin, parkir, ojek, taksi
- Bills (Tagihan & Utilitas) - listrik, air, internet, pulsa, kos, laundry
- Salary (Gaji & Penghasilan) - gaji, bonus, THR
- Shopping (Belanja) - baju, elektronik, barang
- Entertainment (Hiburan) - bioskop, game, konser, olahraga (futsal/soccer/badminton), gym
- Transfer (Transfer Uang) - kasih ke orang, kirim uang
- Other (Lainnya) - yang tidak masuk kategori lain

Contoh Input Multi-Transaksi:
"Tadi bayar makan 50rb, terus isi bensin 100rb, sama beli pulsa 25rb"
→ 3 transaksi: Food (50000, daysAgo:0), Transport (100000, daysAgo:0), Bills (25000, daysAgo:0)

"Tanggal 15 belanja groceries 200 ribu dan bayar netflix 50 ribu"
→ 2 transaksi: Food (200000, specificDate:15), Entertainment (50000, specificDate:15)

"Besok bayar listrik 150rb dan lusa bayar internet 300rb"
→ 2 transaksi: Bills (150000, daysAgo:-1), Bills (300000, daysAgo:-2) (NEGATIVE!)

"besok nonton biosop 50k dan lusa main socer 100k"
→ 2 transaksi: Entertainment (50000, daysAgo:-1), Entertainment (100000, daysAgo:-2) (NEGATIVE!)`,
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
    " trus ",
    " abis itu ",
    " setelah ",
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
    "mksh",
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
    "jelasin",
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

// Fungsi untuk menghitung tanggal berdasarkan specificDate atau daysAgo (support future dates)
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
    // Gunakan daysAgo (support negative for future dates)
    // Positive = past, Negative = future
    const date = new Date();
    date.setDate(date.getDate() - (daysAgo || 0)); // Negative daysAgo akan menambah hari
    return date.toISOString().split("T")[0];
  }
}

// Fungsi untuk format tanggal dalam bahasa Indonesia (support future dates)
export function formatTransactionTime(
  daysAgo?: number,
  specificDate?: number
): string {
  if (specificDate) {
    return `tanggal ${specificDate}`;
  }

  const days = daysAgo || 0;

  // Masa lalu (positive)
  if (days > 0) {
    if (days === 1) {
      return "kemarin";
    } else if (days === 7) {
      return "seminggu lalu";
    } else {
      return `${days} hari lalu`;
    }
  }
  // Masa depan (negative)
  else if (days < 0) {
    const absDays = Math.abs(days);
    if (absDays === 1) {
      return "besok";
    } else if (absDays === 2) {
      return "lusa";
    } else if (absDays === 7) {
      return "minggu depan";
    } else {
      return `${absDays} hari lagi`;
    }
  }
  // Hari ini (0)
  else {
    return "hari ini";
  }
}

// Fungsi untuk mendeteksi apakah input adalah transaksi yang valid
// LEBIH TOLERAN - menggunakan fuzzy matching dan similarity
export function isValidTransactionInput(text: string): boolean {
  const lowerText = text.toLowerCase();

  // Kata-kata kunci yang mengindikasikan transaksi (EXPANDED)
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
    "mkn",
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
    // Entertainment indicators
    "nonton",
    "noton",
    "bioskop",
    "biosop",
    "bioskob",
    "bioskof",
    "movie",
    "film",
    "main",
    "soccer",
    "socer",
    "socr",
    "futsal",
    "badminton",
    "gym",
    "fitness",
    "olahraga",
    "game",
    "konser",
    "concert",
    // Transport
    "bensin",
    "bensn",
    "benzin",
    "parkir",
    "ojek",
    "taksi",
    "taxi",
    "grab",
    "gojek",
    // Bills
    "listrik",
    "internet",
    "pulsa",
    "tagihan",
    "kos",
    "kontrakan",
    "wifi",
    "token",
    // Food
    "kopi",
    "minum",
    "cafe",
    "resto",
    "restoran",
    "warung",
    "jajan",
    // Shopping
    "baju",
    "sepatu",
    "elektronik",
    "hp",
    "laptop",
  ];

  // Pola angka (untuk nominal)
  const hasNumber = /\d/.test(text);

  // Cek apakah ada kata kunci transaksi dengan FUZZY MATCHING
  const hasTransactionKeyword = transactionKeywords.some((keyword) => {
    // Exact match
    if (lowerText.includes(keyword)) return true;

    // Fuzzy match - toleransi 1-2 karakter berbeda untuk kata > 4 huruf
    if (keyword.length > 4) {
      // Cek jika kata mirip (simple Levenshtein-like check)
      const words = lowerText.split(/\s+/);
      for (const word of words) {
        if (Math.abs(word.length - keyword.length) <= 2) {
          // Cek similarity sederhana
          let matchCount = 0;
          const minLen = Math.min(word.length, keyword.length);
          for (let i = 0; i < minLen; i++) {
            if (word[i] === keyword[i]) matchCount++;
          }
          // Jika 70% karakter cocok, anggap match
          if (matchCount / keyword.length >= 0.7) return true;
        }
      }
    }
    return false;
  });

  // Jika ada angka DAN kata kunci, atau jika ada angka dengan kata waktu (besok, lusa, etc)
  const timeKeywords = [
    "besok",
    "lusa",
    "kemarin",
    "hari ini",
    "minggu depan",
    "tanggal",
    "tgl",
  ];
  const hasTimeKeyword = timeKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // Return true jika:
  // 1. Ada transaction keyword DAN ada angka, ATAU
  // 2. Ada time keyword DAN ada angka (lebih permisif untuk future transactions)
  return (hasTransactionKeyword && hasNumber) || (hasTimeKeyword && hasNumber);
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
