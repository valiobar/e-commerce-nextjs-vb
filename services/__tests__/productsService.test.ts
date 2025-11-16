import { productsService } from "../productsService";
import type { Product, ProductsResponse } from "@/types/product";

// Mock global fetch
global.fetch = jest.fn();

describe("productsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchProducts", () => {
    it("fetches products with pagination and handles errors", async () => {
      const mockResponse: ProductsResponse = {
        products: [
          {
            id: 1,
            title: "Test Product 1",
            description: "Description 1",
            price: 100,
            discountPercentage: 10,
            rating: 4.5,
            stock: 10,
            brand: "Brand 1",
            category: "Category 1",
            thumbnail: "/thumb1.jpg",
            images: ["/img1.jpg"],
            reviews: [],
          },
        ],
        total: 1,
        skip: 0,
        limit: 20,
      };

      // Test default pagination
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const defaultResult = await productsService.fetchProducts();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products?limit=20&skip=0",
        { cache: "no-store" }
      );
      expect(defaultResult).toEqual(mockResponse);

      // Test custom pagination and skip calculation
      const customResponse: ProductsResponse = {
        products: [],
        total: 0,
        skip: 20,
        limit: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => customResponse,
      });

      const customResult = await productsService.fetchProducts({
        page: 3,
        limit: 10,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products?limit=10&skip=20",
        { cache: "no-store" }
      );
      expect(customResult).toEqual(customResponse);

      // Test error handling
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(productsService.fetchProducts()).rejects.toThrow(
        "Failed to fetch products"
      );
    });
  });

  describe("fetchProduct", () => {
    it("fetches product by ID and handles errors", async () => {
      const mockProduct: Product = {
        id: 1,
        title: "Test Product",
        description: "Test Description",
        price: 100,
        discountPercentage: 10,
        rating: 4.5,
        stock: 10,
        brand: "Test Brand",
        category: "Test Category",
        thumbnail: "/thumb.jpg",
        images: ["/img1.jpg"],
        reviews: [],
      };

      // Test successful fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await productsService.fetchProduct("1");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/products/1",
        { cache: "no-store" }
      );
      expect(result).toEqual(mockProduct);

      // Test product not found (404)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const notFoundResult = await productsService.fetchProduct("999");
      expect(notFoundResult).toBeNull();

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const errorResult = await productsService.fetchProduct("1");
      expect(errorResult).toBeNull();
    });
  });
});

