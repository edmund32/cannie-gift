import { supabase } from "../lib/supabase";

type CustomerData = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

// Mengambil customer berdasarkan user_id dari Supabase Auth.
export async function getCustomerByUserId(userId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Membuat customer profile baru.
export async function createCustomerProfile(
  userId: string,
  customerData: CustomerData
) {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      user_id: userId,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email ?? null,
      address: customerData.address ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}