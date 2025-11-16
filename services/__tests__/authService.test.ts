import { authService } from "../authService";
import type { AdminUser } from "@/store/adminAuthStore";

// Mock global fetch
global.fetch = jest.fn();

const mockUser: AdminUser = {
  id: "1",
  email: "admin@test.com",
  username: "admin",
};

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("logs in and handles all error scenarios", async () => {
      const mockResponse = {
        message: "Login successful",
        user: mockUser,
      };

      // Test successful login
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.login("admin", "password123");
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "admin", password: "password123" }),
      });
      expect(result).toEqual(mockResponse);

      // Test error with message
      const mockErrorResponse = {
        error: "Invalid credentials",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      await expect(
        authService.login("admin", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");

      // Test error without message
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(authService.login("admin", "password")).rejects.toThrow(
        "Login failed"
      );

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(authService.login("admin", "password")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("logout", () => {
    it("logs out and handles errors", async () => {
      // Test successful logout
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await authService.logout();
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
      });

      // Test API error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(authService.logout()).rejects.toThrow("Logout failed");

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(authService.logout()).rejects.toThrow("Network error");
    });
  });

  describe("checkAuth", () => {
    it("returns authentication status and handles errors", async () => {
      // Test authenticated user
      const authenticatedResponse = {
        authenticated: true,
        user: mockUser,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => authenticatedResponse,
      });

      const authResult = await authService.checkAuth();
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/verify", {
        method: "GET",
        credentials: "include",
      });
      expect(authResult).toEqual(authenticatedResponse);
      expect(authResult.authenticated).toBe(true);

      // Test unauthenticated user
      const unauthenticatedResponse = {
        authenticated: false,
        user: mockUser,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => unauthenticatedResponse,
      });

      const unauthResult = await authService.checkAuth();
      expect(unauthResult.authenticated).toBe(false);

      // Test error with message
      const mockErrorResponse = {
        error: "Not authenticated",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      await expect(authService.checkAuth()).rejects.toThrow(
        "Not authenticated"
      );

      // Test error without message
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(authService.checkAuth()).rejects.toThrow(
        "Not authenticated"
      );

      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(authService.checkAuth()).rejects.toThrow("Network error");
    });
  });
});

