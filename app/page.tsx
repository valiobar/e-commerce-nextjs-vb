import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import type { ProductsResponse } from "@/types/product";
import { ITEMS_PER_PAGE } from "@/constants/pagination";

const fetchProducts = async (
  page: number = 1,
  limit: number = ITEMS_PER_PAGE
): Promise<ProductsResponse> => {
  const skip = (page - 1) * limit;
  const res = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

interface HomeProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const itemsPerPage = params.limit
    ? parseInt(params.limit, 10)
    : ITEMS_PER_PAGE;
  const data = await fetchProducts(currentPage, itemsPerPage);
  const totalPages = Math.ceil(data.total / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Products</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
