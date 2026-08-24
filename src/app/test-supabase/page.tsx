import { getProducts } from "@/services/productService";

export default async function TestSupabasePage() {
  try {
    // Mengambil products melalui service.
    const products = await getProducts();

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Supabase Connection Test
        </h1>

        <p className="mt-4">
          Berhasil mengambil data dari Supabase! 🎉
        </p>

        <p className="mt-2">
          Total products: {products.length}
        </p>

        <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">
          {JSON.stringify(products, null, 2)}
        </pre>
      </main>
    );
  } catch (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Supabase Connection Error
        </h1>

        <pre className="mt-4 whitespace-pre-wrap">
          {error instanceof Error
            ? error.message
            : "Unknown error"}
        </pre>
      </main>
    );
  }
}