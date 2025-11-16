import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useCategoriesStore } from "@/store/categoriesStore";
import { CategoriesDrawer } from "../CategoriesDrawer";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
});

// Mock Zustand store
jest.mock("@/store/categoriesStore");

const mockCloseCategories = jest.fn();

describe("CategoriesDrawer", () => {
  const mockCategories = ["beauty", "fragrances", "furniture", "groceries"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when categories array is empty", () => {
    (useCategoriesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        const state = {
          isOpen: true,
          closeCategories: mockCloseCategories,
        };
        return selector(state);
      }
    );

    const { container } = render(<CategoriesDrawer categories={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders drawer with categories, shows/hides based on isOpen state, formats category names, and handles all interactions", () => {
    // Test closed state
    (useCategoriesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        const state = {
          isOpen: false,
          closeCategories: mockCloseCategories,
        };
        return selector(state);
      }
    );

    const { rerender } = render(
      <CategoriesDrawer categories={mockCategories} />
    );

    // Test closed state classes
    const drawer = screen.getByRole("dialog", { name: "Categories" });
    expect(drawer).toHaveClass("w-0", "opacity-0", "pointer-events-none");
    expect(drawer).toHaveClass("-translate-x-full");

    // Test open state
    (useCategoriesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        const state = {
          isOpen: true,
          closeCategories: mockCloseCategories,
        };
        return selector(state);
      }
    );

    rerender(<CategoriesDrawer categories={mockCategories} />);

    // Test open state classes
    expect(drawer).toHaveClass("w-full", "sm:w-80", "opacity-100");
    expect(drawer).toHaveClass("translate-x-0");
    expect(drawer).not.toHaveClass("pointer-events-none");

    // Test header rendering
    expect(screen.getByText("Categories")).toBeInTheDocument();
    const closeButton = screen.getByLabelText("Close categories");
    expect(closeButton).toBeInTheDocument();

    // Test category name formatting
    expect(screen.getByText("Beauty")).toBeInTheDocument();
    expect(screen.getByText("Fragrances")).toBeInTheDocument();
    expect(screen.getByText("Furniture")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();

    // Test category links
    const beautyLink = screen.getByText("Beauty").closest("a");
    expect(beautyLink).toHaveAttribute("href", "/category/beauty");

    const fragrancesLink = screen.getByText("Fragrances").closest("a");
    expect(fragrancesLink).toHaveAttribute("href", "/category/fragrances");

    // Test accessibility attributes
    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(drawer).toHaveAttribute("aria-label", "Categories");
    expect(drawer).toHaveAttribute("tabIndex", "-1");

    // Test close button click
    fireEvent.click(closeButton);
    expect(mockCloseCategories).toHaveBeenCalledTimes(1);

    // Test Escape key closes drawer
    fireEvent.keyDown(drawer, { key: "Escape" });
    expect(mockCloseCategories).toHaveBeenCalledTimes(2);

    // Test category link click closes drawer
    mockCloseCategories.mockClear();
    fireEvent.click(beautyLink!);
    expect(mockCloseCategories).toHaveBeenCalledTimes(1);

    // Test other keys don't close drawer
    fireEvent.keyDown(drawer, { key: "Enter" });
    expect(mockCloseCategories).toHaveBeenCalledTimes(1);
  });

  it("formats category names correctly from slugs", () => {
    (useCategoriesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        const state = {
          isOpen: true,
          closeCategories: mockCloseCategories,
        };
        return selector(state);
      }
    );

    const categoriesWithHyphens = [
      "skin-care",
      "home-decoration",
      "mens-shirts",
    ];

    render(<CategoriesDrawer categories={categoriesWithHyphens} />);

    expect(screen.getByText("Skin Care")).toBeInTheDocument();
    expect(screen.getByText("Home Decoration")).toBeInTheDocument();
    expect(screen.getByText("Mens Shirts")).toBeInTheDocument();
  });

  it("handles scroll event listener cleanup", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    (useCategoriesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        const state = {
          isOpen: true,
          closeCategories: mockCloseCategories,
        };
        return selector(state);
      }
    );

    const { unmount } = render(
      <CategoriesDrawer categories={mockCategories} />
    );

    // Verify scroll listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    // Unmount component
    unmount();

    // Verify scroll listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

