import { supabase } from "@/lib/supabase";

export type OrderItemInput = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderInput = {
  customerId: string;
  deliveryMethod: string;
  deliveryAddress: string;
  notes?: string;
  deliveryFee: number;
  items: OrderItemInput[];
};

export async function createOrder(input: CreateOrderInput) {
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const total = subtotal + input.deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: input.customerId,
      delivery_method: input.deliveryMethod,
      delivery_address: input.deliveryAddress,
      notes: input.notes || null,
      subtotal,
      delivery_fee: input.deliveryFee,
      total,
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    }))
  );

  if (itemsError) throw new Error(itemsError.message);

  return order;
}

export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items (*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function cancelCustomerOrder(orderId: string, customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ order_status: "cancelled" })
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .eq("order_status", "pending")
    .select("id, order_status")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
