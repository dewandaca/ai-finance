import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.error(
        "Missing Supabase environment variables. Please check your .env.local file."
      );
    }
    // Return a dummy client for build time
    supabaseInstance = createClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export type Transaction = {
  id: string;
  user_id: string;
  created_at: string;
  transaction_date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string | null;
};
