export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};