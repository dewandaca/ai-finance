"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Transaction } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { format, subDays, startOfDay } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await checkUser();
      await fetchTransactions();
    };
    init();

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    setUser(session.user);
  };

  const fetchTransactions = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("transaction_date", { ascending: false })
        .limit(50);

      if (error) throw error;

      setTransactions(data || []);

      // Calculate balance
      const total = (data || []).reduce((acc, t) => {
        return t.type === "income"
          ? acc + Number(t.amount)
          : acc - Number(t.amount);
      }, 0);
      setBalance(total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!deleteConfirm) {
      // Show confirmation
      setDeleteConfirm(id);
      return;
    }

    if (deleteConfirm !== id) {
      // Different transaction, show new confirmation
      setDeleteConfirm(id);
      return;
    }

    // Confirmed, proceed with deletion
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh transactions
      await fetchTransactions();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction. Please try again.");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Filter transactions based on period
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = startOfDay(now);

    return transactions.filter((t) => {
      const transactionDate = new Date(t.transaction_date);

      switch (periodFilter) {
        case "today":
          return transactionDate >= today;
        case "week":
          const weekAgo = startOfDay(subDays(now, 7));
          return transactionDate >= weekAgo;
        case "month":
          const monthAgo = startOfDay(subDays(now, 30));
          return transactionDate >= monthAgo;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate balance for filtered transactions
  const filteredBalance = filteredTransactions.reduce((acc, t) => {
    return t.type === "income"
      ? acc + Number(t.amount)
      : acc - Number(t.amount);
  }, 0);

  // Calculate expense distribution for filtered period
  const getChartData = () => {
    const recentExpenses = filteredTransactions.filter(
      (t) => t.type === "expense"
    );

    const categoryTotals: Record<string, number> = {};
    recentExpenses.forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || "#6b7280",
    }));
  };

  const chartData = getChartData();

  // Get period label in Indonesian
  const getPeriodLabel = () => {
    switch (periodFilter) {
      case "today":
        return "Hari Ini";
      case "week":
        return "Minggu Ini (7 Hari)";
      case "month":
        return "Bulan Ini (30 Hari)";
      case "all":
      default:
        return "Semua";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Finance AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {user?.email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
              title={darkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "today" as const, label: "Hari Ini", icon: "📅" },
                { value: "week" as const, label: "Minggu Ini", icon: "📆" },
                { value: "month" as const, label: "Bulan Ini", icon: "🗓️" },
                { value: "all" as const, label: "Semua", icon: "📊" },
              ] as const
            ).map((period) => (
              <button
                key={period.value}
                onClick={() => setPeriodFilter(period.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  periodFilter === period.value
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:scale-105"
                }`}
              >
                <span className="mr-1">{period.icon}</span>
                {period.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-100 text-sm font-medium">
                💰 Saldo {periodFilter === "all" ? "Total" : getPeriodLabel()}
              </p>
              {periodFilter !== "all" && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Filter Aktif
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              Rp{" "}
              {(periodFilter === "all"
                ? balance
                : filteredBalance
              ).toLocaleString("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>
            {periodFilter !== "all" && (
              <p className="text-blue-200 text-xs md:text-sm">
                Total Keseluruhan: Rp {balance.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </motion.div>

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 mb-8 shadow-xl border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                Pengeluaran per Kategori
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {getPeriodLabel()}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `Rp ${value.toLocaleString("id-ID")}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-xl border border-slate-100 dark:border-slate-700 mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📝</span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Transaksi {getPeriodLabel()}
            </h3>
          </div>
          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💸</div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Belum ada transaksi untuk periode ini
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                  Klik tombol + untuk menambahkan
                </p>
              </div>
            ) : (
              filteredTransactions.slice(0, 20).map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 md:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group hover:shadow-md"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-600 rounded-xl flex items-center justify-center text-xl md:text-2xl">
                      {CATEGORY_ICONS[
                        transaction.category as keyof typeof CATEGORY_ICONS
                      ] || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-white truncate">
                        {transaction.description || transaction.category}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {format(
                          new Date(transaction.transaction_date),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div
                      className={`font-bold text-sm md:text-base ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}Rp{" "}
                      {Number(transaction.amount).toLocaleString("id-ID")}
                    </div>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all p-1.5 md:p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Hapus transaksi"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showAddModal && (
            <ManualTransactionModal
              onClose={() => {
                setShowAddModal(false);
                fetchTransactions();
              }}
            />
          )}
          {showChatModal && (
            <ChatModal
              onClose={() => {
                setShowChatModal(false);
                fetchTransactions();
              }}
            />
          )}
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={cancelDelete}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
                  Hapus Transaksi?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                  Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini
                  tidak dapat dibatalkan.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 py-3 px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(deleteConfirm)}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                  >
                    Hapus
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-row md:flex-col gap-2 z-40"
        >
          {/* Chat AI Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChatModal(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center group relative transition-all"
            title="Chat dengan AI"
          >
            <span className="text-xl md:text-2xl">💬</span>
            <span className="hidden md:block absolute right-16 bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat AI
            </span>
          </motion.button>

          {/* Add Manual Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center group relative transition-all"
            title="Tambah Manual"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-7 md:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden md:block absolute right-16 bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Tambah
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// Import modal components (we'll create these next)
import ManualTransactionModal from "@/components/ManualTransactionModal";
import ChatModal from "@/components/ChatModal";
