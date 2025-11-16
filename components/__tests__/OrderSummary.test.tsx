import { render, screen } from "@testing-library/react";
import { useCartStore } from "@/store/cartStore";
import { OrderSummary } from "../OrderSummary";
import type { CartItem } from "@/types/product";

// Mock Zustand store
jest.mock("@/store/cartStore");

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

describe("OrderSummary", () => {
  it("renders empty state and order summary with items, prices, and totals", () => {
    // Test empty cart
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        getTotalItems: () => 0,
        getTotalPrice: () => 0,
      };
      return selector(state);
    });

    const { rerender } = render(<OrderSummary />);

    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Items (0)")).toBeInTheDocument();
    const emptyPrices = screen.getAllByText("$0.00");
    expect(emptyPrices).toHaveLength(2); // One in Items section, one in Total section
    expect(screen.getByText("Free")).toBeInTheDocument();

    // Test cart with items
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: mockCartItems,
        getTotalItems: () => 3,
        getTotalPrice: () => 250,
      };
      return selector(state);
    });

    rerender(<OrderSummary />);

    // Test items rendering
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(screen.getByText("Qty: 1")).toBeInTheDocument();

    // Test discounted prices (100 - 10% = 90, * 2 = 180)
    expect(screen.getByText("$180.00")).toBeInTheDocument();
    // Test non-discounted price (50 * 1 = 50)
    expect(screen.getByText("$50.00")).toBeInTheDocument();

    // Test totals
    const totalPrices = screen.getAllByText("$250.00");
    expect(totalPrices).toHaveLength(2); // One in Items section, one in Total section
    expect(screen.getByText("Items (3)")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();

    // Test images
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "/test1.jpg");
    expect(images[0]).toHaveAttribute("alt", "Test Product 1");
    expect(images[1]).toHaveAttribute("src", "/test2.jpg");
    expect(images[1]).toHaveAttribute("alt", "Test Product 2");
  });
});
