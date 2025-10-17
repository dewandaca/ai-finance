"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Props {
  onClose: () => void;
  userId: string;
}

type Message = {
  id: string;
  role: "assistant" | "user" | "recommendation";
  content: string;
};

export default function RecommendationModal({ onClose, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Halo! Saya akan menganalisis transaksi keuangan Anda dan memberikan rekomendasi yang personal. Pilih berapa banyak transaksi yang ingin dianalisis (minimal 3 transaksi):",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [manualCount, setManualCount] = useState<string>("3");
  const [showManualInput, setShowManualInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGetRecommendation = async (minTransactions: number) => {
    if (minTransactions < 3) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Minimal 3 transaksi diperlukan untuk memberikan rekomendasi yang akurat dan bermakna. Silakan tambahkan lebih banyak transaksi terlebih dahulu, lalu coba lagi!",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "Analisis " + minTransactions + " transaksi terakhir saya",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setShowManualInput(false);

    try {
      const response = await fetch("/api/get-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, minTransactions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendapatkan rekomendasi");
      }

      const recommendationMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "recommendation",
        content: data.recommendation,
      };

      setMessages((prev) => [...prev, recommendationMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Maaf, terjadi kesalahan: " + errorMsg + ". Silakan coba lagi!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    const count = parseInt(manualCount);
    if (isNaN(count) || count < 3) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Jumlah transaksi minimal adalah 3. Silakan masukkan angka yang valid!",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }
    handleGetRecommendation(count);
  };

  const hasRecommendation = messages.some((m) => m.role === "recommendation");

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
        className="fixed top-4 bottom-4 right-4 md:w-[480px] w-[calc(100%-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Rekomendasi AI
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Saran keuangan personal untuk Anda
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={
                  "flex " +
                  (message.role === "user" ? "justify-end" : "justify-start")
                }
              >
                {message.role === "recommendation" ? (
                  <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-4 border-2 border-blue-200 dark:border-purple-500">
                    <div className="prose prose-blue dark:prose-invert max-w-none prose-sm text-slate-800 dark:text-slate-100">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-purple-600 flex gap-2">
                      <button
                        onClick={() =>
                          navigator.clipboard
                            .writeText(message.content)
                            .then(() => alert("Tersalin!"))
                        }
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                      >
                        Salin
                      </button>
                      <button
                        onClick={() => setShowManualInput(true)}
                        className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-white text-xs font-medium rounded-lg transition"
                      >
                        Analisis Ulang
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      "max-w-[85%] rounded-2xl px-3 py-2 " +
                      (message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white")
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                )}
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
        {!hasRecommendation && !loading && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
            {showManualInput ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={manualCount}
                    onChange={(e) => setManualCount(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleManualSubmit()
                    }
                    min="3"
                    placeholder="Jumlah transaksi (min: 3)"
                    className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    onClick={handleManualSubmit}
                    disabled={loading}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
                  >
                    Analisis
                  </button>
                </div>
                <button
                  onClick={() => setShowManualInput(false)}
                  className="w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Kembali ke opsi cepat
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Pilih jumlah transaksi:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleGetRecommendation(count)}
                      className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      {count} data
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowManualInput(true)}
                  className="w-full px-3 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-sm font-medium rounded-lg transition"
                >
                  Input Manual
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
