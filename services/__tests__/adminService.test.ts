import { getDashboardStats } from "../adminService";
import type { DashboardStats } from "../adminService";
import type { Order } from "@/models/Order";
import { OrderModel } from "@/models/Order";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/db/mongodb";

// Mock database connection
jest.mock("@/lib/db/mongodb", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

// Mock Order model
jest.mock("@/models/Order", () => ({
  OrderModel: {
    countDocuments: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn(),
    getTotalRevenue: jest.fn(),
  },
}));

// Mock User model
jest.mock("@/models/User", () => ({
  UserModel: {
    countDocuments: jest.fn(),
  },
}));

describe("adminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDashboardStats", () => {
    it("returns dashboard statistics for different scenarios and handles errors", async () => {
      const mockOrders: Order[] = [
        {
          _id: "order1",
          userId: "user1",
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
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "order2",
          userId: "user2",
          items: [],
          total: 200,
          status: "delivered",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "0987654321",
          shippingAddress: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Test successful fetch with data
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockOrders),
      };
      (OrderModel.find as unknown as jest.Mock).mockReturnValue(mockFindChain);
      (OrderModel.countDocuments as jest.Mock).mockResolvedValue(50);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(25);
      (OrderModel.getTotalRevenue as jest.Mock).mockResolvedValue(5000.5);

      const result = await getDashboardStats();

      const expectedStats: DashboardStats = {
        totalOrders: 50,
        totalUsers: 25,
        totalRevenue: 5000.5,
        recentOrders: mockOrders,
      };

      expect(result).toEqual(expectedStats);
      expect(OrderModel.countDocuments).toHaveBeenCalled();
      expect(UserModel.countDocuments).toHaveBeenCalled();
      expect(OrderModel.find).toHaveBeenCalled();
      expect(mockFindChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockFindChain.limit).toHaveBeenCalledWith(5);
      expect(mockFindChain.lean).toHaveBeenCalled();
      expect(OrderModel.getTotalRevenue).toHaveBeenCalled();

      // Test zero values
      const mockFindChainZero = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      };
      (OrderModel.find as unknown as jest.Mock).mockReturnValue(
        mockFindChainZero
      );
      (OrderModel.countDocuments as jest.Mock).mockResolvedValue(0);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(0);
      (OrderModel.getTotalRevenue as jest.Mock).mockResolvedValue(0);

      const zeroResult = await getDashboardStats();
      expect(zeroResult).toEqual({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: [],
      });

      // Test limited recent orders (max 5)
      const limitedOrders: Order[] = Array.from({ length: 3 }, (_, i) => ({
        _id: `order${i + 1}`,
        userId: `user${i + 1}`,
        items: [],
        total: 100 * (i + 1),
        status: "pending" as const,
        firstName: "John",
        lastName: "Doe",
        email: `user${i + 1}@example.com`,
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
      }));

      const mockFindChainLimited = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(limitedOrders),
      };
      (OrderModel.find as unknown as jest.Mock).mockReturnValue(
        mockFindChainLimited
      );
      (OrderModel.countDocuments as jest.Mock).mockResolvedValue(10);
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(5);
      (OrderModel.getTotalRevenue as jest.Mock).mockResolvedValue(1500);

      const limitedResult = await getDashboardStats();
      expect(limitedResult.recentOrders).toHaveLength(3);
      expect(limitedResult.totalOrders).toBe(10);
      expect(limitedResult.totalUsers).toBe(5);
      expect(limitedResult.totalRevenue).toBe(1500);

      // Test database connection error
      (connectDB as jest.Mock).mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      await expect(getDashboardStats()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
