import { NextRequest, NextResponse } from "next/server";
import { parseTransactionText } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input: text is required" },
        { status: 400 }
      );
    }

    const parsed = await parseTransactionText(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in parse-transaction API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to parse transaction";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
