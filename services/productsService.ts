import type { Product, ProductsResponse } from "@/types/product";

const API_BASE_URL = "https://dummyjson.com";

interface FetchProductsParams {
  page?: number;
  limit?: number;
}

export const productsService = {
  /**
   * Fetch paginated list of products
   */
  async fetchProducts({
    page = 1,
    limit = 20,
  }: FetchProductsParams = {}): Promise<ProductsResponse> {
    const skip = (page - 1) * limit;
    const url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
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

      return res.json();
    } catch {
      return null;
    }
  },
};
