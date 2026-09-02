export type GuestCartItem = {
  productId: string;
  quantity: number;
};

const GUEST_CART_KEY = "cannie-guest-cart";

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(GUEST_CART_KEY);
    return storedCart ? (JSON.parse(storedCart) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function addGuestCartItem(productId: string) {
  const cart = getGuestCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ productId, quantity: 1 });

  saveGuestCart(cart);
}

export function updateGuestCartItem(productId: string, quantity: number) {
  const updatedCart = getGuestCart()
    .map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    )
    .filter((item) => item.quantity > 0);

  saveGuestCart(updatedCart);
}

export function removeGuestCartItem(productId: string) {
  saveGuestCart(getGuestCart().filter((item) => item.productId !== productId));
}
