import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "../Pagination";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockPrefetch = jest.fn();

describe("Pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      prefetch: mockPrefetch,
    });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("?page=1")
    );
  });

  describe("Rendering", () => {
    it("renders pagination controls correctly based on totalPages", () => {
      const { rerender } = render(
        <Pagination currentPage={1} totalPages={5} />
      );

      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Items per page")).toBeInTheDocument();

      rerender(<Pagination currentPage={1} totalPages={1} />);

      expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Items per page")).toBeInTheDocument();
    });

    it("renders all page numbers when totalPages <= 7", () => {
      render(<Pagination currentPage={1} totalPages={5} />);

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 3")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
    });

    it("renders ellipsis when totalPages > 7 and currentPage <= 3", () => {
      render(<Pagination currentPage={2} totalPages={10} />);

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      expect(screen.getByLabelText("More pages")).toBeInTheDocument();
    });

    it("renders ellipsis when totalPages > 7 and currentPage >= totalPages - 2", () => {
      render(<Pagination currentPage={9} totalPages={10} />);

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 6")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      expect(screen.getByLabelText("More pages")).toBeInTheDocument();
    });

    it("renders ellipsis on both sides when currentPage is in the middle", () => {
      render(<Pagination currentPage={5} totalPages={10} />);

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 6")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      const ellipsis = screen.getAllByLabelText("More pages");
      expect(ellipsis).toHaveLength(2);
    });

    it("highlights the current page with aria-current", () => {
      render(<Pagination currentPage={3} totalPages={5} />);

      const currentPageButton = screen.getByLabelText("Go to page 3");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");

      // Verify other pages don't have aria-current
      const otherPageButton = screen.getByLabelText("Go to page 1");
      expect(otherPageButton).not.toHaveAttribute("aria-current", "page");
    });
  });

  describe("Navigation", () => {
    it("calls router.push with correct page for page number, next, and previous buttons, preserves search params, and does not call router.push for invalid actions", () => {
      const searchParams1 = new URLSearchParams("?page=1&filter=test");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);

      const { rerender } = render(
        <Pagination currentPage={1} totalPages={5} basePath="/products" />
      );

      // Test clicking a page number with preserved search params
      const page2Button = screen.getByLabelText("Go to page 2");
      fireEvent.click(page2Button);
      expect(mockPush).toHaveBeenCalledWith("/products?page=2&filter=test", {
        scroll: false,
      });

      // Test clicking next button
      const searchParams2 = new URLSearchParams("?page=2");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPush.mockClear();

      rerender(<Pagination currentPage={2} totalPages={5} />);
      const nextButton = screen.getByLabelText("Next page");
      fireEvent.click(nextButton);
      expect(mockPush).toHaveBeenCalledWith("/?page=3", { scroll: false });

      // Test clicking previous button
      const searchParams3 = new URLSearchParams("?page=3");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams3);
      mockPush.mockClear();

      rerender(<Pagination currentPage={3} totalPages={5} />);
      const prevButton = screen.getByLabelText("Previous page");
      fireEvent.click(prevButton);
      expect(mockPush).toHaveBeenCalledWith("/?page=2", { scroll: false });

      // Test preserving multiple search params when clicking page number
      const searchParams4 = new URLSearchParams(
        "?page=1&sort=price&filter=active"
      );
      (useSearchParams as jest.Mock).mockReturnValue(searchParams4);
      mockPush.mockClear();

      rerender(<Pagination currentPage={1} totalPages={5} />);
      const page2ButtonWithParams = screen.getByLabelText("Go to page 2");
      fireEvent.click(page2ButtonWithParams);
      expect(mockPush).toHaveBeenCalledWith(
        "/?page=2&sort=price&filter=active",
        { scroll: false }
      );

      // Test that clicking current page doesn't call router.push
      mockPush.mockClear();
      rerender(<Pagination currentPage={3} totalPages={5} />);
      const currentPageButton = screen.getByLabelText("Go to page 3");
      fireEvent.click(currentPageButton);
      expect(mockPush).not.toHaveBeenCalled();

      // Test that clicking disabled previous button doesn't call router.push
      rerender(<Pagination currentPage={1} totalPages={5} />);
      const disabledPrevButton = screen.getByLabelText("Previous page");
      expect(disabledPrevButton).toBeDisabled();
      fireEvent.click(disabledPrevButton);
      expect(mockPush).not.toHaveBeenCalled();

      // Test that clicking disabled next button doesn't call router.push
      rerender(<Pagination currentPage={5} totalPages={5} />);
      const disabledNextButton = screen.getByLabelText("Next page");
      expect(disabledNextButton).toBeDisabled();
      fireEvent.click(disabledNextButton);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Items per page", () => {
    it("renders items per page selector with correct value, calls router.push when changing, resets to page 1, and preserves search params", () => {
      const { rerender } = render(
        <Pagination currentPage={1} totalPages={5} itemsPerPage={24} />
      );

      // Test rendering with correct value
      const select = screen.getByLabelText("Items per page");
      expect(select).toHaveValue("24");

      // Test basic change functionality
      const searchParams1 = new URLSearchParams("?page=3&limit=12");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);

      rerender(<Pagination currentPage={3} totalPages={5} itemsPerPage={12} />);

      const select1 = screen.getByLabelText("Items per page");
      fireEvent.change(select1, { target: { value: "24" } });

      expect(mockPush).toHaveBeenCalledWith("/?page=1&limit=24", {
        scroll: false,
      });

      // Test reset to page 1 and preserving search params
      const searchParams2 = new URLSearchParams("?page=5&limit=12");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPush.mockClear();

      rerender(
        <Pagination currentPage={5} totalPages={10} itemsPerPage={12} />
      );

      const select2 = screen.getByLabelText("Items per page");
      fireEvent.change(select2, { target: { value: "36" } });

      expect(mockPush).toHaveBeenCalledWith("/?page=1&limit=36", {
        scroll: false,
      });

      // Test preserving multiple search params
      const searchParams3 = new URLSearchParams("?page=2&limit=12&sort=name");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams3);
      mockPush.mockClear();

      rerender(<Pagination currentPage={2} totalPages={5} itemsPerPage={12} />);

      const select3 = screen.getByLabelText("Items per page");
      fireEvent.change(select3, { target: { value: "24" } });

      expect(mockPush).toHaveBeenCalledWith("/?page=1&limit=24&sort=name", {
        scroll: false,
      });
    });
  });

  describe("Prefetching", () => {
    it("prefetches next and previous pages when available", () => {
      const searchParams1 = new URLSearchParams("?page=2");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);

      const { rerender } = render(
        <Pagination currentPage={2} totalPages={5} basePath="/products" />
      );

      expect(mockPrefetch).toHaveBeenCalledWith("/products?page=3");
      expect(mockPrefetch).toHaveBeenCalledWith("/products?page=1");

      const searchParams2 = new URLSearchParams("?page=3");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPrefetch.mockClear();

      rerender(
        <Pagination currentPage={3} totalPages={5} basePath="/products" />
      );

      expect(mockPrefetch).toHaveBeenCalledWith("/products?page=4");
      expect(mockPrefetch).toHaveBeenCalledWith("/products?page=2");
    });

    it("does not prefetch when on first or last page", () => {
      const searchParams1 = new URLSearchParams("?page=5");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);

      const { rerender } = render(
        <Pagination currentPage={5} totalPages={5} />
      );

      expect(mockPrefetch).not.toHaveBeenCalledWith(
        expect.stringContaining("page=6")
      );
      expect(mockPrefetch).toHaveBeenCalledWith(
        expect.stringContaining("page=4")
      );

      const searchParams2 = new URLSearchParams("?page=1");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPrefetch.mockClear();

      rerender(<Pagination currentPage={1} totalPages={5} />);

      expect(mockPrefetch).not.toHaveBeenCalledWith(
        expect.stringContaining("page=0")
      );
      expect(mockPrefetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2")
      );
    });

    it("prefetches with preserved search params", () => {
      const searchParams = new URLSearchParams(
        "?page=2&sort=price&filter=active"
      );
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(<Pagination currentPage={2} totalPages={5} />);

      expect(mockPrefetch).toHaveBeenCalledWith(
        "/?page=3&sort=price&filter=active"
      );
      expect(mockPrefetch).toHaveBeenCalledWith(
        "/?page=1&sort=price&filter=active"
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper aria-labels, aria-current, and tabIndex on all interactive elements", () => {
      render(<Pagination currentPage={3} totalPages={5} />);

      const prevButton = screen.getByLabelText("Previous page");
      const nextButton = screen.getByLabelText("Next page");
      const page1Button = screen.getByLabelText("Go to page 1");
      const currentPageButton = screen.getByLabelText("Go to page 3");
      const itemsPerPageSelect = screen.getByLabelText("Items per page");

      // Check aria-labels
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(page1Button).toBeInTheDocument();
      expect(currentPageButton).toBeInTheDocument();
      expect(itemsPerPageSelect).toBeInTheDocument();

      // Check aria-current on current page
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
      expect(page1Button).not.toHaveAttribute("aria-current", "page");

      // Check tabIndex on interactive elements
      expect(prevButton).toHaveAttribute("tabIndex", "0");
      expect(nextButton).toHaveAttribute("tabIndex", "0");
      expect(page1Button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Edge cases", () => {
    it("handles edge cases: out of bounds, empty search params, and custom basePath", () => {
      // Test out of bounds
      const { rerender } = render(
        <Pagination currentPage={1} totalPages={5} />
      );
      const prevButton = screen.getByLabelText("Previous page");
      expect(prevButton).toBeDisabled();

      // Test empty search params
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
      rerender(<Pagination currentPage={1} totalPages={5} />);
      const page2Button = screen.getByLabelText("Go to page 2");
      fireEvent.click(page2Button);
      expect(mockPush).toHaveBeenCalledWith("/?page=2", { scroll: false });

      // Test custom basePath
      const searchParams = new URLSearchParams("?page=1");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);
      mockPush.mockClear();

      rerender(
        <Pagination currentPage={1} totalPages={5} basePath="/custom" />
      );
      const page2ButtonCustom = screen.getByLabelText("Go to page 2");
      fireEvent.click(page2ButtonCustom);
      expect(mockPush).toHaveBeenCalledWith("/custom?page=2", {
        scroll: false,
      });
    });
  });
});
