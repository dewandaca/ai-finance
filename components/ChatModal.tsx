"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Props {
  onClose: () => void;
}

type Message = {
  id: string;
  role: "user" | "assistant" | "confirmation" | "multi-confirmation";
  content: string;
  parsedData?: {
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
  };
  multiParsedData?: Array<{
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
  }>;
  answered?: boolean; // Track if confirmation has been answered
};

export default function ChatModal({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Halo! Saya asisten keuangan AI Anda. Ceritakan transaksi Anda dengan bahasa natural, misalnya 'Bayar makan 50 ribu' atau 'Terima gaji 5 juta'. Saya akan membantu mencatatnya! 💰",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call API to parse transaction
      const response = await fetch("/api/parse-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse transaction");
      }

      // Cek apakah ini casual chat
      if (data.isCasualChat) {
        const casualMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, casualMessage]);
        setLoading(false);
        return;
      }

      // Cek apakah ini multiple transactions
      if (
        data.isMultiple &&
        data.transactions &&
        data.transactions.length > 0
      ) {
        let confirmContent = `Saya mendeteksi ${data.transactions.length} transaksi:\n\n`;
        data.transactions.forEach(
          (
            txn: {
              amount: number;
              type: "income" | "expense";
              category: string;
              description: string;
            },
            index: number
          ) => {
            confirmContent += `${index + 1}. ${
              txn.type === "income" ? "💰" : "💸"
            } ${
              txn.type === "income" ? "Pemasukan" : "Pengeluaran"
            } Rp ${txn.amount.toLocaleString("id-ID")} - ${txn.category} (${
              txn.description
            })\n`;
          }
        );
        confirmContent += `\nApakah semua transaksi ini sudah benar?`;

        const multiConfirmMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "multi-confirmation",
          content: confirmContent,
          multiParsedData: data.transactions,
        };

        setMessages((prev) => [...prev, multiConfirmMessage]);
        setLoading(false);
        return;
      }

      // Add confirmation message for single transaction
      const confirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "confirmation",
        content: `Saya mendeteksi: ${data.type === "income" ? "💰" : "💸"} ${
          data.type === "income" ? "Pemasukan" : "Pengeluaran"
        } sebesar Rp ${data.amount.toLocaleString("id-ID")} untuk kategori ${
          data.category
        }. Deskripsi: "${data.description}". Apakah ini sudah benar?`,
        parsedData: data,
      };

      setMessages((prev) => [...prev, confirmMessage]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Maaf, saya tidak bisa memahami itu. ${errorMsg}. Bisakah Anda coba pakai kalimat lain? Contoh: "Bayar makan 50 ribu" atau "Terima gaji 3 juta"`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.parsedData || message.answered) return;

    // Mark message as answered immediately
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, answered: true } : m))
    );

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from("transactions").insert({
        user_id: session.user.id,
        amount: message.parsedData.amount,
        type: message.parsedData.type,
        category: message.parsedData.category,
        description: message.parsedData.description,
        transaction_date: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;

      const successMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ Transaksi berhasil dicatat! Ada yang lain?`,
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Gagal menyimpan transaksi: ${errorMsg}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (messageId: string) => {
    // Mark message as answered immediately
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, answered: true } : m))
    );

    const rejectMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "Tidak masalah! Silakan ceritakan transaksi Anda lagi dengan kata-kata yang berbeda, atau Anda bisa gunakan form manual.",
    };
    setMessages((prev) => [...prev, rejectMessage]);
  };

  const handleAcceptAll = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (
      !message?.multiParsedData ||
      message.answered ||
      message.multiParsedData.length === 0
    )
      return;

    // Mark message as answered immediately
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, answered: true } : m))
    );

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      // Validasi tanggal untuk semua transaksi
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const today = new Date();
      const transactionDate = new Date().toISOString().split("T")[0];
      const selectedDate = new Date(transactionDate);

      if (selectedDate < oneYearAgo) {
        throw new Error(
          "Transaksi tidak dapat dicatat untuk tanggal lebih dari 1 tahun yang lalu"
        );
      }

      if (selectedDate > today) {
        throw new Error("Tanggal transaksi tidak boleh di masa depan");
      }

      // Insert all transactions
      const transactionsToInsert = message.multiParsedData.map((txn) => ({
        user_id: session.user.id,
        amount: txn.amount,
        type: txn.type,
        category: txn.category,
        description: txn.description,
        transaction_date: transactionDate,
      }));

      const { error } = await supabase
        .from("transactions")
        .insert(transactionsToInsert);

      if (error) throw error;

      const successMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ Berhasil mencatat ${message.multiParsedData.length} transaksi! Ada yang lain?`,
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Gagal menyimpan transaksi: ${errorMsg}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed top-4 bottom-4 right-4 md:w-[420px] w-[calc(100%-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Chat dengan AI 💬
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Ceritakan transaksi Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : message.role === "confirmation" ||
                        message.role === "multi-confirmation"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-2 border-yellow-400 dark:border-yellow-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>

                  {/* Single Transaction Confirmation */}
                  {message.role === "confirmation" &&
                    message.parsedData &&
                    !message.answered && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleConfirm(message.id)}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium py-2 px-3 rounded-lg transition"
                        >
                          ✓ Benar
                        </button>
                        <button
                          onClick={() => handleReject(message.id)}
                          disabled={loading}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium py-2 px-3 rounded-lg transition"
                        >
                          ✗ Salah
                        </button>
                      </div>
                    )}

                  {/* Multiple Transactions Confirmation */}
                  {message.role === "multi-confirmation" &&
                    message.multiParsedData &&
                    !message.answered && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleAcceptAll(message.id)}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium py-2 px-3 rounded-lg transition"
                        >
                          ✓ Accept All ({message.multiParsedData.length})
                        </button>
                        <button
                          onClick={() => handleReject(message.id)}
                          disabled={loading}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium py-2 px-3 rounded-lg transition"
                        >
                          ✗ Reject All
                        </button>
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-3 py-2">
                <div className="flex space-x-1.5">
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Bayar makan 50rb..."
              disabled={loading}
              className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
            >
              Kirim
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
