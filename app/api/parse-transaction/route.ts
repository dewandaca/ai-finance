import { NextRequest, NextResponse } from "next/server";
import {
  parseTransactionText,
  detectCasualChat,
  detectMultipleTransactions,
  parseMultipleTransactions,
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
