import { ordersService } from "../ordersService";
import type { Order } from "@/models/Order";
import type { CartItem } from "@/types/product";

// Mock global fetch
global.fetch = jest.fn();

const mockCartItem: CartItem = {
  id: 1,
  title: "Test Product",
  description: "Test Description",
  price: 100,
  discountPercentage: 10,
  thumbnail: "/thumb.jpg",
  quantity: 2,
};

const mockOrder: Order = {
  _id: "order123",
  userId: "user123",
  items: [mockCartItem],
  total: 180,
  status: "pending",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "1234567890",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ordersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    it("creates order and handles errors", async () => {
      const orderData = {
        userId: "user123",
        items: [mockCartItem],
        total: 180,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
      };

      // Test successful creation
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const result = await ordersService.createOrder(orderData);
      expect(global.fetch).toHaveBeenCalledWith("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      expect(result).toEqual(mockOrder);

      // Test API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Failed to create order" }),
      });

      await expect(ordersService.createOrder(orderData)).rejects.toThrow(
        "Failed to create order"
      );

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(ordersService.createOrder(orderData)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getOrdersByUserId", () => {
    it("fetches orders by user ID and handles different scenarios", async () => {
      const mockOrders: Order[] = [mockOrder];

      // Test successful fetch with orders
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const result = await ordersService.getOrdersByUserId("user123");
      expect(global.fetch).toHaveBeenCalledWith("/api/orders?userId=user123");
      expect(result).toEqual(mockOrders);

      // Test empty array when no orders found
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const emptyResult = await ordersService.getOrdersByUserId("user456");
      expect(emptyResult).toEqual([]);

      // Test error handling
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Failed to fetch orders" }),
      });

      await expect(ordersService.getOrdersByUserId("user123")).rejects.toThrow(
        "Failed to fetch orders"
      );
    });
  });

  describe("getOrderById", () => {
    it("fetches order by ID and handles errors", async () => {
      // Test successful fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const result = await ordersService.getOrderById("order123");
      expect(global.fetch).toHaveBeenCalledWith("/api/orders/order123");
      expect(result).toEqual(mockOrder);

      // Test order not found (404)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Failed to fetch order" }),
      });

      await expect(ordersService.getOrderById("nonexistent")).rejects.toThrow(
        "Failed to fetch order"
      );

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(ordersService.getOrderById("order123")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("updates order status for all status types and handles errors", async () => {
      const statuses: Order["status"][] = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      // Test all status types
      for (const status of statuses) {
        const updatedOrder: Order = {
          ...mockOrder,
          status,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => updatedOrder,
        });

        const result = await ordersService.updateOrderStatus(
          "order123",
          status
        );

        expect(global.fetch).toHaveBeenCalledWith("/api/orders/order123", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });
        expect(result.status).toBe(status);
      }

      // Test error handling
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Failed to update order" }),
      });

      await expect(
        ordersService.updateOrderStatus("order123", "processing")
      ).rejects.toThrow("Failed to update order");
    });
  });

  describe("getTotalRevenue", () => {
    it("fetches total revenue and handles different scenarios", async () => {
      // Test successful fetch with revenue
      const mockResponse = {
        totalRevenue: 5000.5,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ordersService.getTotalRevenue();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/orders?totalRevenue=true"
      );
      expect(result).toBe(5000.5);

      // Test zero revenue
      const zeroResponse = {
        totalRevenue: 0,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => zeroResponse,
      });

      const zeroResult = await ordersService.getTotalRevenue();
      expect(zeroResult).toBe(0);

      // Test error handling
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Failed to fetch total revenue" }),
      });

      await expect(ordersService.getTotalRevenue()).rejects.toThrow(
        "Failed to fetch total revenue"
      );
    });
  });
});
