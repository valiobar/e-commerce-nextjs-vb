import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { ProductFilters } from "@/components/ProductFilters";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { productsService } from "@/services/productsService";
import type { SortByOption, OrderOption } from "@/types/sorting";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: string;
  }>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const itemsPerPage = params.limit
    ? parseInt(params.limit, 10)
    : ITEMS_PER_PAGE;
  const sortBy = params.sortBy as SortByOption | undefined;
  const order = params.order as OrderOption | undefined;

  const data = await productsService.fetchProducts({
    page: currentPage,
    limit: itemsPerPage,
    ...(sortBy && sortBy !== "none" && { sortBy, order: order || "asc" }),
  });
  const totalPages = Math.ceil(data.total / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-primary">Products</h1>
      <ProductFilters basePath="/" />
      <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
};

export default Home;
