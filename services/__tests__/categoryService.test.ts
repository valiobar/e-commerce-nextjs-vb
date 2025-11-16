import { categoryService } from "../categoryService";

// Mock global fetch
global.fetch = jest.fn();

describe("categoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCategories", () => {
    it("fetches categories successfully", async () => {
      const mockCategories = [
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "home-decoration",
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await categoryService.fetchCategories();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products/category-list",
        { cache: "no-store" }
      );
      expect(result).toEqual(mockCategories);
    });

    it("handles API errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(categoryService.fetchCategories()).rejects.toThrow(
        "Failed to fetch categories: 500 Internal Server Error"
      );
    });

    it("handles network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(categoryService.fetchCategories()).rejects.toThrow(
        "Network error"
      );
    });

    it("handles unknown errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce("Unknown error");

      await expect(categoryService.fetchCategories()).rejects.toThrow(
        "Failed to fetch categories: Network error"
      );
    });
  });
});
