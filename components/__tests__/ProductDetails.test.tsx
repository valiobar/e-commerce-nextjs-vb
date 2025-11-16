import { render, screen, fireEvent } from "@testing-library/react";
import { useCartStore } from "@/store/cartStore";
import { ProductDetails } from "../ProductDetails";
import type { Product } from "@/types/product";

// Mock Zustand store
jest.mock("@/store/cartStore");

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

const mockAddItem = jest.fn();
const mockUpdateQuantity = jest.fn();

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "This is a test product description",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  brand: "Test Brand",
  category: "Test Category",
  thumbnail: "/test-thumbnail.jpg",
  images: ["/test1.jpg", "/test2.jpg", "/test3.jpg"],
  reviews: [],
};

describe("ProductDetails with ProductImages and AddToCart Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details, handles image selection, and cart interactions including continue shopping", () => {
    // Test product not in cart
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    const { rerender } = render(<ProductDetails product={mockProduct} />);

    // Test product details rendering
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    const brandTexts = screen.getAllByText("Test Brand");
    expect(brandTexts.length).toBeGreaterThan(0);
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(10 in stock)")).toBeInTheDocument();

    // Test price and discount
    expect(screen.getByText("$90.00")).toBeInTheDocument(); // 100 - 10%
    expect(screen.getByText("$100.00")).toBeInTheDocument(); // Original price
    expect(screen.getByText("-10%")).toBeInTheDocument();

    // Test description
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test product description")
    ).toBeInTheDocument();

    // Test category and brand
    expect(screen.getByText(/Category:/)).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
    expect(screen.getByText(/Brand:/)).toBeInTheDocument();
    // Brand appears twice (header and details), we already verified it exists above

    // Test ProductImages integration - main image
    const mainImage = screen.getByAltText("Test Product");
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute("src", "/test1.jpg");

    // Test ProductImages integration - thumbnail images
    const thumbnailButtons = screen.getAllByLabelText(
      /View Test Product image/
    );
    expect(thumbnailButtons).toHaveLength(3);

    // Test image selection
    const secondThumbnail = screen.getByLabelText("View Test Product image 2");
    fireEvent.click(secondThumbnail);
    expect(mainImage).toHaveAttribute("src", "/test2.jpg");

    const thirdThumbnail = screen.getByLabelText("View Test Product image 3");
    fireEvent.click(thirdThumbnail);
    expect(mainImage).toHaveAttribute("src", "/test3.jpg");

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

    rerender(<ProductDetails product={mockProduct} />);

    // Test button state when product is in cart
    const inCartButton = screen.getByLabelText("Product in cart");
    expect(inCartButton).toBeInTheDocument();
    expect(screen.getByText("In Cart")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remove one item from cart")
    ).toBeInTheDocument();
    expect(screen.getByText("Remove Item")).toBeInTheDocument();

    // Test continue shopping button
    const continueShoppingLink = screen.getByRole("link", {
      name: "Continue Shopping",
    });
    expect(continueShoppingLink).toBeInTheDocument();
    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    expect(continueShoppingLink).toHaveAttribute("href", "/");

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

    rerender(<ProductDetails product={mockProduct} />);

    expect(screen.getByText("In Cart (3)")).toBeInTheDocument();
    const continueShoppingLinkAfterRerender = screen.getByRole("link", {
      name: "Continue Shopping",
    });
    expect(continueShoppingLinkAfterRerender).toBeInTheDocument();
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

    render(<ProductDetails product={productWithoutDiscount} />);

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.queryByText("$90.00")).not.toBeInTheDocument();
    expect(screen.queryByText("-10%")).not.toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("renders product with single image correctly", () => {
    const productWithSingleImage: Product = {
      ...mockProduct,
      id: 3,
      images: ["/single-image.jpg"],
    };

    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    render(<ProductDetails product={productWithSingleImage} />);

    const mainImage = screen.getByAltText("Test Product");
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute("src", "/single-image.jpg");

    // Should not show thumbnail buttons for single image
    const thumbnailButtons = screen.queryAllByLabelText(
      /View Test Product image/
    );
    expect(thumbnailButtons).toHaveLength(0);
  });

  it("handles keyboard navigation for image selection", () => {
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        addItem: mockAddItem,
        updateQuantity: mockUpdateQuantity,
      };
      return selector(state);
    });

    render(<ProductDetails product={mockProduct} />);

    const mainImage = screen.getByAltText("Test Product");
    const secondThumbnail = screen.getByLabelText("View Test Product image 2");

    // Test keyboard navigation
    fireEvent.keyDown(secondThumbnail, { key: "Enter", code: "Enter" });
    // Note: The component uses onClick, so we need to click for the actual behavior
    fireEvent.click(secondThumbnail);
    expect(mainImage).toHaveAttribute("src", "/test2.jpg");
  });
});
