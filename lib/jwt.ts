import jwt from "jsonwebtoken";

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
}

const JWT_EXPIRES_IN = "7d"; // 7 days for admin sessions

/**
 * Generate a JWT token for an authenticated user
 * @param userId - User's MongoDB _id
 * @param email - User's email
 * @param username - User's username
 * @returns JWT token string
 */
export const generateToken = (
  userId: string,
  email: string,
  username: string
): string => {
  const payload: TokenPayload = {
    userId,
    email,
    username,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded token payload if valid, null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
};

/**
 * Decode a JWT token without verification (for debugging only)
 * @param token - JWT token string
 * @returns Decoded token payload or null
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
