import { supabase } from "../lib/supabase";

type CustomerData = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

// Membuat profile customer berdasarkan user Auth yang sedang login.
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