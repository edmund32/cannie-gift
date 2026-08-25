import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/category";

// Mengambil semua kategori dari database.
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Kalau terjadi error, kirim error ke pemanggil.
  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}