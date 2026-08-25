import { getCategories } from "@/services/categoryService";

export default async function TestCategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Categories Test
      </h1>

      <p className="mt-4">
        Total categories: {categories.length}
      </p>

      <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4">
        {JSON.stringify(categories, null, 2)}
      </pre>
    </main>
  );
}