import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { ProductFilters } from "@/components/ProductFilters";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { productsService } from "@/services/productsService";
import { categoryService } from "@/services/categoryService";
import type { SortByOption, OrderOption } from "@/types/sorting";

// Enable static generation with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: string;
  }>;
}

const formatCategoryName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const searchParamsData = await searchParams;

  // Verify category exists
  const categories = await categoryService.fetchCategories();
  if (!categories.includes(slug)) {
    notFound();
  }

  const currentPage = searchParamsData.page
    ? parseInt(searchParamsData.page, 10)
    : 1;

  const itemsPerPage = searchParamsData.limit
    ? parseInt(searchParamsData.limit, 10)
    : ITEMS_PER_PAGE;
  const sortBy = searchParamsData.sortBy as SortByOption | undefined;
  const order = searchParamsData.order as OrderOption | undefined;

  let data;
  try {
    data = await productsService.fetchProductsByCategory({
      category: slug,
      page: currentPage,
      limit: itemsPerPage,
      ...(sortBy && sortBy !== "none" && { sortBy, order: order || "asc" }),
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error(
      "Failed to load products. Please try again later or refresh the page."
    );
  }

  const totalPages = Math.ceil(data.total / itemsPerPage);
  const categoryName = formatCategoryName(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-primary">{categoryName}</h1>
      <ProductFilters basePath={`/category/${slug}`} />
      {data.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70">
            No products found in this category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/category/${slug}`}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
