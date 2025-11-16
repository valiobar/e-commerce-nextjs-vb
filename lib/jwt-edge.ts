/**
 * Edge-compatible JWT verification for Next.js middleware
 * This is a simplified version that works in Edge runtime
 */

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env.local"
  );
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  exp?: number;
  iat?: number;
}

/**
 * Simple JWT verification for Edge runtime
 * Decodes and checks expiration manually
 * Note: This does NOT verify the signature, only decodes and checks expiration
 * Full signature verification happens in API routes using jsonwebtoken
 * @param token - JWT token string to verify
 * @returns Decoded token payload if valid, null if invalid
 */
export const verifyTokenEdge = (token: string): TokenPayload | null => {
  try {
    // Split token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url) - Edge compatible
    const payload = parts[1];
    // Convert base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Decode using atob (available in Edge runtime)
    const decodedString = atob(base64);
    const decoded = JSON.parse(decodedString) as TokenPayload;

    // Check expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    // Basic validation - check required fields
    if (!decoded.userId || !decoded.email || !decoded.username) {
      return null;
    }

    return decoded;
  } catch {
    // Token is invalid or malformed
    return null;
  }
};
