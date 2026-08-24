// Import fungsi untuk membuat Supabase client.
import { createClient } from "@supabase/supabase-js";

// Mengambil URL project dari .env.local.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Mengambil Publishable Key dari .env.local.
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Membuat dan export Supabase client.
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);