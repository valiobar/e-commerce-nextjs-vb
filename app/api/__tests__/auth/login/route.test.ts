/**
 * @jest-environment node
 */
// Set environment variables before imports
process.env.MONGODB_URI = "mongodb://localhost:27017/test";

import { POST } from "@/app/api/auth/login/route";
import { connectDB } from "@/lib/db/mongodb";
import { UserModel } from "@/models/User";
import { comparePassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";
import { ADMIN_TOKEN_COOKIE_NAME } from "@/constants/auth";

// Mock dependencies
jest.mock("@/lib/db/mongodb");
jest.mock("@/models/User");
jest.mock("@/lib/password");
jest.mock("@/lib/jwt");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockComparePassword = comparePassword as jest.MockedFunction<
  typeof comparePassword
>;
const mockGenerateToken = generateToken as jest.MockedFunction<
  typeof generateToken
>;

describe("API /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  it("logs in user successfully with valid credentials", async () => {
    const mockUser = {
      _id: "user123",
      email: "admin@example.com",
      username: "admin",
      password: "hashedPassword",
    };

    (mockUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockComparePassword.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("mockToken123");

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();
    const cookie = response.headers.get("set-cookie");

    expect(mockConnectDB).toHaveBeenCalled();
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      username: "admin",
    });
    expect(mockComparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(mockGenerateToken).toHaveBeenCalledWith(
      "user123",
      "admin@example.com",
      "admin"
    );
    expect(response.status).toBe(200);
    expect(data.message).toBe("Login successful");
    expect(data.user).toEqual({
      id: "user123",
      email: "admin@example.com",
      username: "admin",
    });
    expect(cookie).toContain(ADMIN_TOKEN_COOKIE_NAME);
    expect(cookie).toContain("mockToken123");
  });

  it("trims username when searching for user", async () => {
    const mockUser = {
      _id: "user123",
      email: "admin@example.com",
      username: "admin",
      password: "hashedPassword",
    };

    (mockUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockComparePassword.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("mockToken123");

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "  admin  ",
        password: "password123",
      }),
    });

    await POST(request);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      username: "admin",
    });
  });

  it("returns 400 error when username is missing", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Username and password are required");
    expect(mockUserModel.findOne).not.toHaveBeenCalled();
  });

  it("returns 400 error when password is missing", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Username and password are required");
    expect(mockUserModel.findOne).not.toHaveBeenCalled();
  });

  it("returns 401 error when user not found", async () => {
    (mockUserModel.findOne as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "nonexistent",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid username or password");
    expect(mockComparePassword).not.toHaveBeenCalled();
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("returns 401 error when password is incorrect", async () => {
    const mockUser = {
      _id: "user123",
      email: "admin@example.com",
      username: "admin",
      password: "hashedPassword",
    };

    (mockUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockComparePassword.mockResolvedValue(false);

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "wrongPassword",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid username or password");
    expect(mockComparePassword).toHaveBeenCalled();
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("returns 500 error when database connection fails", async () => {
    mockConnectDB.mockRejectedValue(new Error("Database connection failed"));

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("returns 500 error when query fails", async () => {
    (mockUserModel.findOne as jest.Mock).mockRejectedValue(
      new Error("Query failed")
    );

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});
