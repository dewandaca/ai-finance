export const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Salary",
  "Shopping",
  "Entertainment",
  "Transfer",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Bills: "#ef4444",
  Salary: "#10b981",
  Shopping: "#ec4899",
  Entertainment: "#8b5cf6",
  Transfer: "#6366f1",
  Other: "#6b7280",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: "🍔",
  Transport: "🚗",
  Bills: "📄",
  Salary: "💰",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Transfer: "💸",
  Other: "📦",
};
