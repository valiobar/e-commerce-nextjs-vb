import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "../Breadcrumbs";

// Mock Next.js navigation hook
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Breadcrumbs", () => {
  it("returns null when pathname is root", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    const { container } = render(<Breadcrumbs />);

    expect(container.firstChild).toBeNull();
  });

  it("renders breadcrumbs with correct labels, hrefs, and excludes products path", () => {
    (usePathname as jest.Mock).mockReturnValue("/cart");

    const { rerender } = render(<Breadcrumbs />);

    // Test cart path
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    const homeLink = screen.getByText("Home").closest("a");
    const cartLink = screen.getByText("Cart").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
    expect(cartLink).toHaveAttribute("href", "/cart");

    // Test numeric path (product ID)
    (usePathname as jest.Mock).mockReturnValue("/products/123");
    rerender(<Breadcrumbs />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Product 123")).toBeInTheDocument();
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    const productLink = screen.getByText("Product 123").closest("a");
    expect(productLink).toHaveAttribute("href", "/products/123");

    // Test custom path with capitalization
    (usePathname as jest.Mock).mockReturnValue("/about");
    rerender(<Breadcrumbs />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    const aboutLink = screen.getByText("About").closest("a");
    expect(aboutLink).toHaveAttribute("href", "/about");

    // Test nested path
    (usePathname as jest.Mock).mockReturnValue("/checkout/success");
    rerender(<Breadcrumbs />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    const checkoutLink = screen.getByText("Checkout").closest("a");
    const successLink = screen.getByText("Success").closest("a");
    expect(checkoutLink).toHaveAttribute("href", "/checkout");
    expect(successLink).toHaveAttribute("href", "/checkout/success");
  });
});
