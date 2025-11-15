import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { UserModel } from "@/models/User";
import { comparePassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";
import { ADMIN_TOKEN_COOKIE_NAME } from "@/constants/auth";

interface LoginRequest {
  username: string;
  password: string;
}

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const POST = async (request: Request) => {
  try {
    await connectDB();

    const body = (await request.json()) as LoginRequest;
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await UserModel.findOne({ username: username.trim() });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.username);

    // Create response with user data (without password)
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
    response.cookies.set(ADMIN_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
