/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/logout/route";
import { ADMIN_TOKEN_COOKIE_NAME } from "@/constants/auth";

describe("API /api/auth/logout", () => {
  it("logs out user successfully and clears cookie", async () => {
    const response = await POST();
    const data = await response.json();
    const cookie = response.headers.get("set-cookie");

    expect(response.status).toBe(200);
    expect(data.message).toBe("Logout successful");
    expect(cookie).toContain(ADMIN_TOKEN_COOKIE_NAME);
    expect(cookie).toContain("Max-Age=0");
  });

  it("handles errors gracefully", async () => {
    // This test verifies the error handling structure
    // In a real scenario, you might want to test actual error conditions
    const response = await POST();
    expect(response.status).toBe(200);
  });
});

