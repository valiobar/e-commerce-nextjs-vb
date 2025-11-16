/**
 * @jest-environment node
 */
// Set environment variables before imports
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

import { GET, PATCH } from "@/app/api/orders/[id]/route";
import { connectDB } from "@/lib/db/mongodb";
import { OrderModel } from "@/models/Order";
import type { Order } from "@/models/Order";

// Mock dependencies
jest.mock("@/lib/db/mongodb");
jest.mock("@/models/Order");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockOrderModel = OrderModel as jest.Mocked<typeof OrderModel>;

describe("API /api/orders/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  describe("GET", () => {
    it("returns order by id successfully", async () => {
      const mockOrder: Order = {
        _id: "order123",
        items: [
          {
            id: 1,
            title: "Test Product",
            description: "Test Description",
            price: 100,
            discountPercentage: 10,
            thumbnail: "/thumb.jpg",
            quantity: 2,
          },
        ],
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

      (mockOrderModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrder),
      });

      const request = new Request("http://localhost:3000/api/orders/order123");
      const params = Promise.resolve({ id: "order123" });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(mockConnectDB).toHaveBeenCalled();
      expect(mockOrderModel.findById).toHaveBeenCalledWith("order123");
      expect(response.status).toBe(200);
      expect(data._id).toBe(mockOrder._id);
      expect(data.firstName).toBe(mockOrder.firstName);
      expect(data.email).toBe(mockOrder.email);
      expect(data.total).toBe(mockOrder.total);
      expect(data.status).toBe(mockOrder.status);
    });

    it("returns 404 when order not found", async () => {
      (mockOrderModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const request = new Request("http://localhost:3000/api/orders/nonexistent");
      const params = Promise.resolve({ id: "nonexistent" });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Order not found" });
    });

    it("returns 500 error when database connection fails", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new Request("http://localhost:3000/api/orders/order123");
      const params = Promise.resolve({ id: "order123" });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch order" });
    });

    it("returns 500 error when query fails", async () => {
      (mockOrderModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error("Query failed")),
      });

      const request = new Request("http://localhost:3000/api/orders/order123");
      const params = Promise.resolve({ id: "order123" });
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch order" });
    });
  });

  describe("PATCH", () => {
    const mockOrder: Order = {
      _id: "order123",
      items: [],
      total: 100,
      status: "pending",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
        country: "USA",
      },
    };

    it("updates order status successfully", async () => {
      const updatedOrder: Order = {
        ...mockOrder,
        status: "processing",
      };

      (mockOrderModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedOrder),
      });

      const request = new Request("http://localhost:3000/api/orders/order123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "processing" }),
      });

      const params = Promise.resolve({ id: "order123" });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(mockConnectDB).toHaveBeenCalled();
      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "order123",
        { status: "processing" },
        { new: true }
      );
      expect(response.status).toBe(200);
      expect(data.status).toBe("processing");
    });

    it("updates multiple order fields successfully", async () => {
      const updateData = {
        status: "shipped",
        phone: "9876543210",
      };

      const updatedOrder: Order = {
        ...mockOrder,
        ...updateData,
      };

      (mockOrderModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedOrder),
      });

      const request = new Request("http://localhost:3000/api/orders/order123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const params = Promise.resolve({ id: "order123" });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "order123",
        updateData,
        { new: true }
      );
      expect(response.status).toBe(200);
      expect(data.status).toBe("shipped");
      expect(data.phone).toBe("9876543210");
    });

    it("returns 404 when order not found", async () => {
      (mockOrderModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const request = new Request("http://localhost:3000/api/orders/nonexistent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "processing" }),
      });

      const params = Promise.resolve({ id: "nonexistent" });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Order not found" });
    });

    it("returns 500 error when database connection fails", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new Request("http://localhost:3000/api/orders/order123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "processing" }),
      });

      const params = Promise.resolve({ id: "order123" });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update order" });
    });

    it("returns 500 error when update fails", async () => {
      (mockOrderModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error("Update failed")),
      });

      const request = new Request("http://localhost:3000/api/orders/order123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "processing" }),
      });

      const params = Promise.resolve({ id: "order123" });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update order" });
    });
  });
});

