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
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed: Network error");
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData ? errorData.error : "Logout failed"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Logout failed: Network error");
    }
  },

  /**
   * Verify authentication status
   */
  async checkAuth(): Promise<VerifyResponse> {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
      });

      const data = (await response.json()) as
        | VerifyResponse
        | AuthErrorResponse;

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Not authenticated");
      }

      return data as VerifyResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Authentication check failed: Network error");
    }
  },
};
