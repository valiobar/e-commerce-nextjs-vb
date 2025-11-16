import type { Product, ProductsResponse } from "@/types/product";
import type { SortByOption, OrderOption } from "@/types/sorting";

const API_BASE_URL = "https://dummyjson.com";

interface FetchProductsParams {
  page?: number;
  limit?: number;
  sortBy?: SortByOption;
  order?: OrderOption;
}

export const productsService = {
  /**
   * Fetch paginated list of products with optional sorting
   */
  async fetchProducts({
    page = 1,
    limit = 20,
    sortBy,
    order = "asc",
  }: FetchProductsParams = {}): Promise<ProductsResponse> {
    const skip = (page - 1) * limit;
    let url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;

    if (sortBy && sortBy !== "none") {
      url += `&sortBy=${sortBy}&order=${order}`;
    }

    try {
      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch products: ${res.status} ${res.statusText}`
        );
      }

      const data: ProductsResponse = await res.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch products: Network error");
    }
  },

  /**
   * Fetch a single product by ID
   */
  async fetchProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return null;
      }

      const data: Product = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};
