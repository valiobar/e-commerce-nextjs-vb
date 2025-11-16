/**
 * @jest-environment node
 */
// Set environment variables before imports
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

import { GET, POST } from "@/app/api/orders/route";
import { connectDB } from "@/lib/db/mongodb";
import { OrderModel } from "@/models/Order";
import type { Order } from "@/models/Order";

// Mock dependencies
jest.mock("@/lib/db/mongodb");
jest.mock("@/models/Order");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockOrderModel = OrderModel as jest.Mocked<typeof OrderModel>;

describe("API /api/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  describe("GET", () => {
    it("returns all orders when no query params are provided", async () => {
      const mockOrders: Order[] = [
        {
          _id: "order1",
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
        },
      ];

      (mockOrderModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockOrders),
        }),
      });

      const request = new Request("http://localhost:3000/api/orders");
      const response = await GET(request);
      const data = await response.json();

      expect(mockConnectDB).toHaveBeenCalled();
      expect(mockOrderModel.find).toHaveBeenCalledWith({});
      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrders);
    });

    it("returns orders filtered by userId when userId query param is provided", async () => {
      const mockOrders: Order[] = [
        {
          _id: "order1",
          userId: "user123",
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
        },
      ];

      (mockOrderModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockOrders),
        }),
      });

      const request = new Request(
        "http://localhost:3000/api/orders?userId=user123"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockOrderModel.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrders);
    });

    it("returns total revenue when totalRevenue query param is true", async () => {
      (mockOrderModel.aggregate as jest.Mock).mockResolvedValue([
        { _id: null, total: 5000 },
      ]);

      const request = new Request(
        "http://localhost:3000/api/orders?totalRevenue=true"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockOrderModel.aggregate).toHaveBeenCalledWith([
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      expect(response.status).toBe(200);
      expect(data).toEqual({ totalRevenue: 5000 });
    });

    it("returns zero revenue when no orders exist", async () => {
      (mockOrderModel.aggregate as jest.Mock).mockResolvedValue([]);

      const request = new Request(
        "http://localhost:3000/api/orders?totalRevenue=true"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ totalRevenue: 0 });
    });

    it("returns empty array when no orders found", async () => {
      (mockOrderModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([]),
        }),
      });

      const request = new Request("http://localhost:3000/api/orders");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("returns 500 error when database connection fails", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new Request("http://localhost:3000/api/orders");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch orders" });
    });

    it("returns 500 error when query fails", async () => {
      (mockOrderModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockRejectedValue(new Error("Query failed")),
        }),
      });

      const request = new Request("http://localhost:3000/api/orders");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch orders" });
    });
  });

  describe("POST", () => {
    const mockOrderData = {
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

    it("creates a new order successfully", async () => {
      const savedOrder: Order = {
        _id: "newOrder123",
        ...mockOrderData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSave = jest.fn().mockResolvedValue(savedOrder);
      const mockInstance = {
        save: mockSave,
        toObject: jest.fn().mockReturnValue(savedOrder),
        ...savedOrder,
      };
      (mockOrderModel as unknown as jest.Mock).mockImplementation(() => mockInstance);

      const request = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockOrderData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(mockConnectDB).toHaveBeenCalled();
      expect(mockOrderModel).toHaveBeenCalledWith(mockOrderData);
      expect(mockSave).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(data._id).toBe("newOrder123");
      expect(data.firstName).toBe("John");
      expect(data.total).toBe(180);
    });

    it("creates order with userId when provided", async () => {
      const orderDataWithUserId = {
        ...mockOrderData,
        userId: "user123",
      };

      const savedOrder: Order = {
        _id: "newOrder123",
        ...orderDataWithUserId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSave = jest.fn().mockResolvedValue(savedOrder);
      const mockInstance = {
        save: mockSave,
        toObject: jest.fn().mockReturnValue(savedOrder),
        ...savedOrder,
      };
      (mockOrderModel as unknown as jest.Mock).mockImplementation(() => mockInstance);

      const request = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDataWithUserId),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(mockOrderModel).toHaveBeenCalledWith(orderDataWithUserId);
      expect(response.status).toBe(201);
      expect(data.userId).toBe("user123");
    });

    it("returns 500 error when database connection fails", async () => {
      mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

      const request = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockOrderData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create order" });
    });

    it("returns 500 error when order save fails", async () => {
      const mockSave = jest
        .fn()
        .mockRejectedValue(new Error("Validation error"));
      (mockOrderModel as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        toObject: jest.fn(),
      }));

      const request = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockOrderData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create order" });
    });
  });
});

