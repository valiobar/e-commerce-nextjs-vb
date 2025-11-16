import { render, screen, fireEvent } from "@testing-library/react";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "../ProductCard";
import type { Product } from "@/types/product";

// Mock Zustand store
jest.mock("@/store/cartStore");

const mockAddItem = jest.fn();
const mockUpdateQuantity = jest.fn();

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "Test Description",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  brand: "Test Brand",
  category: "Test Category",
  thumbnail: "/test-thumbnail.jpg",
  images: ["/test1.jpg", "/test2.jpg"],
  reviews: [],
};

describe("ProductCard and AddToCart Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product information and handles add to cart interactions", () => {
    // Test product not in cart
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    const { rerender } = render(<ProductCard product={mockProduct} />);

    // Test product card rendering
    const productLink = screen.getByRole("link");
    expect(productLink).toHaveAttribute("href", "/products/1");

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$90.00")).toBeInTheDocument(); // 100 - 10%
    expect(screen.getByText("$100.00")).toBeInTheDocument(); // Original price
    expect(screen.getByText("-10%")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();

    const productImage = screen.getByAltText("Test Product");
    expect(productImage).toHaveAttribute("src", "/test-thumbnail.jpg");

    // Test AddToCart button when product not in cart
    const addToCartButton = screen.getByLabelText("Add product to cart");
    expect(addToCartButton).toBeInTheDocument();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();

    // Test adding product to cart
    fireEvent.click(addToCartButton);
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);

    // Test product in cart
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [
          {
            ...mockProduct,
            quantity: 1,
          },
        ],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    rerender(<ProductCard product={mockProduct} />);

    // Test button state when product is in cart
    const inCartButton = screen.getByLabelText("Product in cart");
    expect(inCartButton).toBeInTheDocument();
    expect(screen.getByText("In Cart")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remove one item from cart")
    ).toBeInTheDocument();
    expect(screen.getByText("Remove Item")).toBeInTheDocument();

    // Test removing item from cart
    const removeButton = screen.getByLabelText("Remove one item from cart");
    fireEvent.click(removeButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 0);

    // Test product in cart with quantity > 1
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [
          {
            ...mockProduct,
            quantity: 3,
          },
        ],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    rerender(<ProductCard product={mockProduct} />);

    expect(screen.getByText("In Cart (3)")).toBeInTheDocument();
  });

  it("renders product without discount correctly", () => {
    const productWithoutDiscount: Product = {
      ...mockProduct,
      id: 2,
      discountPercentage: 0,
      rating: 3.2,
    };

    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    render(<ProductCard product={productWithoutDiscount} />);

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.queryByText("$90.00")).not.toBeInTheDocument();
    expect(screen.queryByText("-10%")).not.toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });
});
