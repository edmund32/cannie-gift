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
  userId: string | null,
  customerData: CustomerData
) {
  const customerRecord = {
    name: customerData.name,
    phone: customerData.phone,
    email: customerData.email ?? null,
    address: customerData.address ?? null,
    ...(userId ? { user_id: userId } : {}),
  };

  const { data, error } = await supabase
    .from("customers")
    .insert(customerRecord)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Mengambil profil customer dan membuatnya bila akun belum memilikinya.
export async function getOrCreateCustomerProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const existingCustomer = await getCustomerByUserId(user.id);

  if (existingCustomer) {
    return existingCustomer;
  }

  const metadata = user.user_metadata ?? {};
  const fallbackName = user.email?.split("@")[0] || "Customer";

  return createCustomerProfile(user.id, {
    name: typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name
      : fallbackName,
    phone: typeof metadata.phone === "string" ? metadata.phone : "",
    email: user.email,
    address: typeof metadata.address === "string" ? metadata.address : "",
  });
}

export async function createGuestCustomerProfile(customerData: CustomerData) {
  return createCustomerProfile(null, customerData);
}
