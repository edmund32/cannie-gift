import { supabase } from "@/lib/supabase";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};

type CartItemWithProduct = {
  id: string;
  cart_id: string;
  product_id: string | null;
  custom_bouquet_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: CartProduct | null;
};
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
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (cartError) {
    throw new Error(cartError.message);
  }

  if (!cart) {
    return [];
  }

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

  console.log("Cart items:", data);

  return (data ?? []) as unknown as CartItemWithProduct[];
}

/**
 * Mengubah quantity sebuah cart item.
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  // Kalau quantity kurang dari 1,
  // item tidak boleh disimpan dengan quantity 0.
  if (quantity < 1) {
    throw new Error("Quantity minimal adalah 1.");
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({
      quantity,
    })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}