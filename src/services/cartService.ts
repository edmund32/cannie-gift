import { supabase } from "@/lib/supabase";

/**
 * Mengambil cart milik customer.
 * Kalau belum punya cart, buat cart baru.
 */
export async function getOrCreateCart(customerId: string) {
  // Cek apakah customer sudah memiliki cart.
  const { data: existingCart, error: fetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Kalau cart sudah ada, gunakan cart tersebut.
  if (existingCart) {
    return existingCart;
  }

  // Kalau belum ada, buat cart baru.
  const { data: newCart, error: createError } = await supabase
    .from("carts")
    .insert({
      customer_id: customerId,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  return newCart;
}

/**
 * Menambahkan produk ke cart.
 *
 * Kalau produk sudah ada di cart:
 * quantity akan bertambah 1.
 *
 * Kalau belum ada:
 * dibuat sebagai cart item baru dengan quantity 1.
 */
export async function addToCart(
  customerId: string,
  productId: string
) {
  // 1. Pastikan customer memiliki cart.
  const cart = await getOrCreateCart(customerId);

  // 2. Cek apakah produk sudah ada di cart.
  const { data: existingItem, error: findError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (findError) {
    throw new Error(findError.message);
  }

  // 3. Kalau produk sudah ada,
  // tambahkan quantity sebanyak 1.
  if (existingItem) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + 1,
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // 4. Kalau produk belum ada,
  // buat cart item baru.
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      cart_id: cart.id,
      product_id: productId,
      quantity: 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Mengambil semua item dari cart customer.
 *
 * Sekaligus mengambil data produk yang ada
 * di setiap cart item.
 */
export async function getCartItems(customerId: string) {
  // Cari cart milik customer.
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (cartError) {
    throw new Error(cartError.message);
  }

  // Kalau customer belum punya cart,
  // berarti cart masih kosong.
  if (!cart) {
    return [];
  }

  // Ambil item dari cart tersebut.
  // Sekaligus ambil informasi produknya.
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      cart_id,
      product_id,
      custom_bouquet_id,
      quantity,
      created_at,
      updated_at,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}