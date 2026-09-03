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

// Mengambil satu produk berdasarkan ID.
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // Kalau produk tidak ditemukan, kembalikan null.
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(error.message);
  }

  return data;
}

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(input: Pick<Product, "category_id" | "name" | "description" | "price" | "image_url" | "is_active">) {
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<Pick<Product, "category_id" | "name" | "description" | "price" | "image_url" | "is_active">>) {
  const { data, error } = await supabase.from("products").update(input).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.rpc("delete_product_as_admin", {
    product_uuid: id,
  });
  if (error) throw new Error(error.message);
}
