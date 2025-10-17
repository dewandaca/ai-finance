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
  },
  required: ["amount", "type", "category", "description"],
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
5. Respons HANYA dalam format JSON, tanpa teks tambahan

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
- "Kasih adik 50 ribu" → expense, Transfer, 50000, "Transfer uang ke adik"
- "Bayar kos 1,2 juta" → expense, Bills, 1200000, "Bayar kos"
- "Terima gaji 5 juta" → income, Salary, 5000000, "Gaji bulanan"
- "Beli groceries 75 ribu" → expense, Food, 75000, "Belanja bahan makanan"
- "Makan di resto 250k" → expense, Food, 250000, "Makan di restoran"
- "Isi bensin 100rb" → expense, Transport, 100000, "Isi bensin"
- "Nonton bioskop 50000" → expense, Entertainment, 50000, "Nonton bioskop"`,
});

export type ParsedTransaction = {
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
};

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

  return null;
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
