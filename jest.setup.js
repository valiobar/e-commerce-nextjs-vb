// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Set mock environment variables for API tests
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/test";
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-jwt-secret-key";
}
