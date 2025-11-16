import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Cart } from "../Cart";
import { CartSidebar } from "../CartSidebar";
import type { CartItem } from "@/types/product";

// Mock Next.js navigation hook
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock Zustand store
jest.mock("@/store/cartStore");

const mockCloseCart = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();

const mockCartItems: CartItem[] = [
  {
    id: 1,
    title: "Test Product 1",
    description: "Description 1",
    price: 100,
    discountPercentage: 10,
    thumbnail: "/test1.jpg",
    quantity: 2,
  },
  {
    id: 2,
    title: "Test Product 2",
    description: "Description 2",
    price: 50,
    discountPercentage: 0,
    thumbnail: "/test2.jpg",
    quantity: 1,
  },
];

describe("Cart and CartSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  describe("Cart", () => {
    it("renders empty state, cart with items, prices, and handles all interactions", () => {
      (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          items: [],
          removeItem: mockRemoveItem,
          updateQuantity: mockUpdateQuantity,
          clearCart: mockClearCart,
          closeCart: mockCloseCart,
          getTotalItems: () => 0,
          getTotalPrice: () => 0,
        };
        return selector(state);
      });

      const { rerender } = render(<Cart />);

      // Test empty state
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Continue shopping")
      ).toBeInTheDocument();

      // Test cart with items
      (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          items: mockCartItems,
          removeItem: mockRemoveItem,
          updateQuantity: mockUpdateQuantity,
          clearCart: mockClearCart,
          closeCart: mockCloseCart,
          getTotalItems: () => 3,
          getTotalPrice: () => 250,
        };
        return selector(state);
      });

      rerender(<Cart />);

      // Test items rendering
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.getByText("Items (3)")).toBeInTheDocument();
      const totalPrices = screen.getAllByText("$250.00");
      expect(totalPrices).toHaveLength(2); // One in Items section, one in Total section
      expect(screen.getByLabelText("Proceed to checkout")).toBeInTheDocument();

      // Test price display with discounts
      expect(screen.getByText("$90.00")).toBeInTheDocument(); // 100 - 10%
      expect(screen.getByText("$100.00")).toBeInTheDocument(); // Original price with line-through

      // Test quantity controls
      const decreaseButtons = screen.getAllByLabelText("Decrease quantity");
      const increaseButtons = screen.getAllByLabelText("Increase quantity");

      fireEvent.click(decreaseButtons[0]);
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);

      fireEvent.click(increaseButtons[0]);
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);

      // Test item removal
      const removeButtons = screen.getAllByLabelText("Remove item");
      fireEvent.click(removeButtons[0]);
      expect(mockRemoveItem).toHaveBeenCalledWith(1);

      // Test clear cart
      const clearButton = screen.getByLabelText("Clear all items from cart");
      fireEvent.click(clearButton);
      expect(mockClearCart).toHaveBeenCalled();
    });
  });

  describe("CartSidebar", () => {
    it("shows/hides sidebar based on isOpen state and closes on pathname change and Escape key", () => {
      (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          items: [],
          isOpen: false,
          removeItem: mockRemoveItem,
          updateQuantity: mockUpdateQuantity,
          clearCart: mockClearCart,
          closeCart: mockCloseCart,
          getTotalItems: () => 0,
          getTotalPrice: () => 0,
        };
        return selector(state);
      });

      const { rerender } = render(<CartSidebar />);

      // Test closed state
      const sidebar = screen.getByRole("dialog");
      expect(sidebar).toHaveClass("w-0", "opacity-0", "pointer-events-none");

      // Test open state
      (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          items: [],
          isOpen: true,
          removeItem: mockRemoveItem,
          updateQuantity: mockUpdateQuantity,
          clearCart: mockClearCart,
          closeCart: mockCloseCart,
          getTotalItems: () => 0,
          getTotalPrice: () => 0,
        };
        return selector(state);
      });

      rerender(<CartSidebar />);

      expect(sidebar).toHaveClass("w-96", "opacity-100");
      expect(sidebar).not.toHaveClass("pointer-events-none");

      // Test Escape key closes cart
      fireEvent.keyDown(sidebar, { key: "Escape" });
      expect(mockCloseCart).toHaveBeenCalled();

      // Test close button
      const closeButton = screen.getByLabelText("Close cart");
      fireEvent.click(closeButton);
      expect(mockCloseCart).toHaveBeenCalledTimes(2);

      // Test pathname change closes cart (cart must be open for effect to run)
      mockCloseCart.mockClear();
      (usePathname as jest.Mock).mockReturnValue("/products");
      rerender(<CartSidebar />);
      // useEffect should call closeCart when pathname changes and cart is open
      expect(mockCloseCart).toHaveBeenCalled();
    });
  });
});

