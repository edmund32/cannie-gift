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

export async function createCategory(name: string, description: string) {
  const { data, error } = await supabase.from("categories").insert({ name, description: description || null }).select().single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function updateCategory(id: string, name: string, description: string) {
  const { data, error } = await supabase.from("categories").update({ name, description: description || null }).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteCategory(id: string) {
  const { count, error: productsError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (productsError) throw new Error(productsError.message);
  if ((count ?? 0) > 0) {
    throw new Error("Kategori masih digunakan oleh produk.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
