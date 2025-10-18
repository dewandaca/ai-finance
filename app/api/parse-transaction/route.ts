import { NextRequest, NextResponse } from "next/server";
import {
  parseTransactionText,
  detectCasualChat,
  detectMultipleTransactions,
  parseMultipleTransactions,
  isValidTransactionInput,
} from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input: text is required" },
        { status: 400 }
      );
    }

    // Cek apakah ini casual chat (bukan transaksi)
    const casualResponse = detectCasualChat(text);
    if (casualResponse) {
      return NextResponse.json(
        { isCasualChat: true, message: casualResponse },
        { status: 200 }
      );
    }

    // Cek apakah input terlihat seperti transaksi yang valid
    if (!isValidTransactionInput(text)) {
      const notUnderstoodResponses = [
        "Hmm, aku kurang nangkep maksudnya nih. Bisa lebih spesifik gak? Misalnya: 'bayar makan 50rb' atau 'terima gaji 5jt' 🤔",
        "Waduh, aku gak terlalu paham yang kamu maksud. Coba kasih info yang lebih jelas yuk, contoh: 'kemarin beli pulsa 25 ribu' 😅",
        "Maaf ya, aku masih bingung sama maksudnya. Bisa dijelasin lagi dengan lebih detail? Kayak 'tadi isi bensin 100rb' gitu 💭",
        "Agak susah nih aku ngerti. Tolong kasih tau dengan format yang lebih jelas dong, misal: '2 hari lalu bayar netflix 50rb' 🙏",
        "Sorry, aku gak mudeng deh sama input ini. Coba pake kalimat yang lebih spesifik ya, contoh: 'belanja groceries 200 ribu' 😊",
      ];
      return NextResponse.json(
        {
          isCasualChat: true,
          message:
            notUnderstoodResponses[
              Math.floor(Math.random() * notUnderstoodResponses.length)
            ],
        },
        { status: 200 }
      );
    }

    // Cek apakah ini multiple transactions
    const isMultiple = detectMultipleTransactions(text);

    if (isMultiple) {
      // Parse multiple transactions
      const multiParsed = await parseMultipleTransactions(text);
      return NextResponse.json({
        isMultiple: true,
        transactions: multiParsed.transactions,
      });
    } else {
      // Parse single transaction
      const parsed = await parseTransactionText(text);
      return NextResponse.json(parsed);
    }
  } catch (error) {
    console.error("Error in parse-transaction API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to parse transaction";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
