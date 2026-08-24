import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";

// Mengambil semua produk yang aktif dari database.
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  // Kalau Supabase mengembalikan error,
  // hentikan proses dan kirim error ke pemanggil.
  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}