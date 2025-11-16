import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navigation } from "../Navigation";

// Mock CartIcon to avoid needing cart store setup
jest.mock("@/components/icons/cart-icon/CartIcon", () => ({
  CartIcon: () => <div data-testid="cart-icon">Cart Icon</div>,
}));

describe("Navigation", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
      configurable: true,
    });
  });

  it("renders navigation links and handles scroll state changes", async () => {
    const { container } = render(<Navigation />);

    // Test navigation links
    const homeLink = screen.getByLabelText("E-Commerce Store Home");
    const aboutLink = screen.getByLabelText("About Us");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();

    // Test initial state (not scrolled)
    const navbar = container.querySelector(".navbar");
    expect(navbar).toHaveClass("scale-100", "top-0", "rounded-none");
    expect(navbar).not.toHaveClass("scale-[0.85]", "opacity-80");

    // Test scroll > 50px
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 100,
      configurable: true,
    });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navbar).toHaveClass(
        "scale-[0.85]",
        "opacity-80",
        "origin-top",
        "mt-3",
        "top-5",
        "rounded-3xl"
      );
      expect(navbar).not.toHaveClass("scale-100", "rounded-none");
    });

    // Test scroll back to top
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
      configurable: true,
    });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navbar).toHaveClass("scale-100", "top-0", "rounded-none");
      expect(navbar).not.toHaveClass("scale-[0.85]", "opacity-80");
    });
  });
});
