import { API_BASE_URL } from "@/constants/api";

export const categoryService = {
  /**
   * Fetch all product category slugs
   * Returns an array of category slugs (e.g., ["beauty", "fragrances", "furniture"])
   */
  async fetchCategories(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/category-list`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch categories: ${res.status} ${res.statusText}`
        );
      }

      const data: string[] = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch categories: Network error");
    }
  },
};
