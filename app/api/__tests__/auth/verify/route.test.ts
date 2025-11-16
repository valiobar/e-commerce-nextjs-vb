/**
 * @jest-environment node
 */
// Set environment variables before imports
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

import { GET } from "@/app/api/auth/verify/route";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { ADMIN_TOKEN_COOKIE_NAME } from "@/constants/auth";

// Mock dependencies
jest.mock("@/lib/db/mongodb");
jest.mock("@/models/User");
jest.mock("@/lib/jwt");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe("API /api/auth/verify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("verifies token and returns user data successfully", async () => {
    const mockDecoded = {
      userId: "user123",
      email: "admin@example.com",
      username: "admin",
    };

    const mockUser = {
      _id: "user123",
      email: "admin@example.com",
      username: "admin",
      password: "hashedPassword",
    };

    mockVerifyToken.mockReturnValue(mockDecoded);
    (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const cookies = new Map();
    cookies.set(ADMIN_TOKEN_COOKIE_NAME, "validToken123");
    const request = new NextRequest("http://localhost:3000/api/auth/verify", {
      headers: {
        cookie: `${ADMIN_TOKEN_COOKIE_NAME}=validToken123`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(mockVerifyToken).toHaveBeenCalledWith("validToken123");
    expect(mockConnectDB).toHaveBeenCalled();
    expect(mockUserModel.findById).toHaveBeenCalledWith("user123");
    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(true);
    expect(data.user).toEqual({
      id: "user123",
      email: "admin@example.com",
      username: "admin",
    });
  });

  it("returns 401 error when token is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/verify");

    const response = await GET(request);
    const data = await response.json();

    expect(mockVerifyToken).not.toHaveBeenCalled();
    expect(mockConnectDB).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 401 error when token is invalid", async () => {
    mockVerifyToken.mockReturnValue(null);

    const request = new NextRequest("http://localhost:3000/api/auth/verify", {
      headers: {
        cookie: `${ADMIN_TOKEN_COOKIE_NAME}=invalidToken`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(mockVerifyToken).toHaveBeenCalledWith("invalidToken");
    expect(mockConnectDB).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid or expired token");
  });

  it("returns 404 error when user not found", async () => {
    const mockDecoded = {
      userId: "nonexistent",
      email: "admin@example.com",
      username: "admin",
    };

    mockVerifyToken.mockReturnValue(mockDecoded);
    (mockUserModel.findById as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/auth/verify", {
      headers: {
        cookie: `${ADMIN_TOKEN_COOKIE_NAME}=validToken123`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(mockConnectDB).toHaveBeenCalled();
    expect(mockUserModel.findById).toHaveBeenCalledWith("nonexistent");
    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("returns 500 error when database connection fails", async () => {
    const mockDecoded = {
      userId: "user123",
      email: "admin@example.com",
      username: "admin",
    };

    mockVerifyToken.mockReturnValue(mockDecoded);
    mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

    const request = new NextRequest("http://localhost:3000/api/auth/verify", {
      headers: {
        cookie: `${ADMIN_TOKEN_COOKIE_NAME}=validToken123`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("returns 500 error when query fails", async () => {
    const mockDecoded = {
      userId: "user123",
      email: "admin@example.com",
      username: "admin",
    };

    mockVerifyToken.mockReturnValue(mockDecoded);
    (mockUserModel.findById as jest.Mock).mockRejectedValue(
      new Error("Query failed")
    );

    const request = new NextRequest("http://localhost:3000/api/auth/verify", {
      headers: {
        cookie: `${ADMIN_TOKEN_COOKIE_NAME}=validToken123`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});

