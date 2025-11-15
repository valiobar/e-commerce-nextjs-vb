import type { AdminUser } from "@/store/adminAuthStore";

interface LoginResponse {
  message: string;
  user: AdminUser;
}

interface VerifyResponse {
  authenticated: boolean;
  user: AdminUser;
}

interface AuthErrorResponse {
  error: string;
}

export const authService = {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = (await response.json()) as LoginResponse | AuthErrorResponse;

    if (!response.ok) {
      throw new Error("error" in data ? data.error : "Login failed");
    }

    return data as LoginResponse;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  /**
   * Verify authentication status
   */
  async checkAuth(): Promise<VerifyResponse> {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      credentials: "include",
    });

    const data = (await response.json()) as VerifyResponse | AuthErrorResponse;

    if (!response.ok) {
      throw new Error("error" in data ? data.error : "Not authenticated");
    }

    return data as VerifyResponse;
  },
};
