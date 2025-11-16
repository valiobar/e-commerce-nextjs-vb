import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "../ProductFilters";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockPrefetch = jest.fn();

describe("ProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      prefetch: mockPrefetch,
    });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("")
    );
  });

  describe("Rendering", () => {
    it("renders all selectors, options, default values, and displays current values from search params", () => {
      const { rerender } = render(<ProductFilters />);

      // Test default rendering
      const sortBySelect = screen.getByLabelText("Sort by");
      const orderSelect = screen.getByLabelText("Order");

      expect(sortBySelect).toBeInTheDocument();
      expect(orderSelect).toBeInTheDocument();
      expect(sortBySelect).toHaveValue("none");
      expect(orderSelect).toHaveValue("asc");
      expect(orderSelect).toBeDisabled();

      // Test all sort by options
      const sortByOptions = Array.from(
        sortBySelect.querySelectorAll("option")
      ) as HTMLOptionElement[];
      expect(sortByOptions).toHaveLength(5);
      expect(sortByOptions[0].value).toBe("none");
      expect(sortByOptions[1].value).toBe("title");
      expect(sortByOptions[2].value).toBe("price");
      expect(sortByOptions[3].value).toBe("discountPercentage");
      expect(sortByOptions[4].value).toBe("rating");

      // Test all order options
      const orderOptions = Array.from(
        orderSelect.querySelectorAll("option")
      ) as HTMLOptionElement[];
      expect(orderOptions).toHaveLength(2);
      expect(orderOptions[0].value).toBe("asc");
      expect(orderOptions[1].value).toBe("desc");

      // Test labels
      expect(screen.getByText("Sort by:")).toBeInTheDocument();
      expect(screen.getByText("Order:")).toBeInTheDocument();

      // Test displaying values from search params
      const searchParams = new URLSearchParams("?sortBy=price&order=desc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);
      rerender(<ProductFilters />);

      expect(screen.getByLabelText("Sort by")).toHaveValue("price");
      expect(screen.getByLabelText("Order")).toHaveValue("desc");
      expect(screen.getByLabelText("Order")).not.toBeDisabled();
    });
  });

  describe("Sort By Changes", () => {
    it("calls router.push with correct params, resets page to 1, preserves other params, and removes sortBy/order when selecting 'none'", () => {
      const { rerender } = render(<ProductFilters />);

      // Test basic sortBy change
      const sortBySelect = screen.getByLabelText("Sort by");
      fireEvent.change(sortBySelect, { target: { value: "price" } });

      let callArgs = mockPush.mock.calls[0];
      let url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("price");
      expect(url.get("page")).toBe("1");
      expect(callArgs[1]).toEqual({ scroll: false });

      // Test resetting page and preserving other params
      const searchParams1 = new URLSearchParams("?page=5&filter=active&sortBy=title");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Sort by"), {
        target: { value: "rating" },
      });

      callArgs = mockPush.mock.calls[0];
      url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("filter")).toBe("active");
      expect(url.get("sortBy")).toBe("rating");
      expect(url.get("page")).toBe("1");

      // Test removing sortBy and order when selecting 'none'
      const searchParams2 = new URLSearchParams("?sortBy=price&order=desc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Sort by"), {
        target: { value: "none" },
      });

      expect(mockPush).toHaveBeenCalledWith("/?page=1", { scroll: false });
    });

    it("uses custom basePath when provided", () => {
      render(<ProductFilters basePath="/products" />);

      const sortBySelect = screen.getByLabelText("Sort by");
      fireEvent.change(sortBySelect, { target: { value: "title" } });

      const callArgs = mockPush.mock.calls[0];
      expect(callArgs[0]).toContain("/products?");
      const url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("title");
      expect(url.get("page")).toBe("1");
    });
  });

  describe("Order Changes", () => {
    it("calls router.push with correct params, resets page to 1, preserves other params, and does not allow change when sortBy is 'none'", () => {
      const { rerender } = render(<ProductFilters />);

      // Test that order change is blocked when sortBy is 'none'
      const orderSelect = screen.getByLabelText("Order");
      expect(orderSelect).toBeDisabled();
      fireEvent.change(orderSelect, { target: { value: "desc" } });
      expect(mockPush).not.toHaveBeenCalled();

      // Test basic order change
      const searchParams1 = new URLSearchParams("?sortBy=price&order=asc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Order"), {
        target: { value: "desc" },
      });

      let callArgs = mockPush.mock.calls[0];
      let url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("price");
      expect(url.get("order")).toBe("desc");
      expect(url.get("page")).toBe("1");

      // Test resetting page and preserving other params
      const searchParams2 = new URLSearchParams(
        "?page=3&filter=active&sortBy=price&order=asc"
      );
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Order"), {
        target: { value: "desc" },
      });

      callArgs = mockPush.mock.calls[0];
      url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("filter")).toBe("active");
      expect(url.get("sortBy")).toBe("price");
      expect(url.get("order")).toBe("desc");
      expect(url.get("page")).toBe("1");
    });
  });

  describe("Order Selector State", () => {
    it("enables/disables order selector based on sortBy value and updates state when sortBy changes", () => {
      const { rerender } = render(<ProductFilters />);

      // Test disabled when sortBy is 'none'
      let orderSelect = screen.getByLabelText("Order");
      expect(orderSelect).toBeDisabled();

      // Test enabled when sortBy is set
      const searchParams1 = new URLSearchParams("?sortBy=price");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);
      rerender(<ProductFilters />);

      orderSelect = screen.getByLabelText("Order");
      expect(orderSelect).not.toBeDisabled();

      // Test disabled when changing back to 'none'
      const searchParams2 = new URLSearchParams("");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      rerender(<ProductFilters />);

      orderSelect = screen.getByLabelText("Order");
      expect(orderSelect).toBeDisabled();
    });
  });

  describe("Prefetching", () => {
    it("prefetches opposite order when sortBy is set, preserves params, uses custom basePath, and does not prefetch when sortBy is 'none'", async () => {
      // Test prefetching when sortBy is set (asc -> desc)
      const searchParams1 = new URLSearchParams("?sortBy=price&order=asc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);

      const { rerender } = render(<ProductFilters />);

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith("/?sortBy=price&order=desc&page=1");
      });

      // Test prefetching when order is desc (desc -> asc)
      const searchParams2 = new URLSearchParams("?sortBy=title&order=desc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPrefetch.mockClear();
      rerender(<ProductFilters />);

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith("/?sortBy=title&order=asc&page=1");
      });

      // Test prefetching with preserved search params
      const searchParams3 = new URLSearchParams(
        "?page=2&filter=active&sortBy=price&order=asc"
      );
      (useSearchParams as jest.Mock).mockReturnValue(searchParams3);
      mockPrefetch.mockClear();
      rerender(<ProductFilters />);

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalled();
        const callArgs = mockPrefetch.mock.calls[0][0];
        const url = new URLSearchParams(callArgs.split("?")[1]);
        expect(url.get("filter")).toBe("active");
        expect(url.get("sortBy")).toBe("price");
        expect(url.get("order")).toBe("desc");
        expect(url.get("page")).toBe("1");
      });

      // Test prefetching with custom basePath
      const searchParams4 = new URLSearchParams("?sortBy=rating&order=asc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams4);
      mockPrefetch.mockClear();
      render(<ProductFilters basePath="/products" />);

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith(
          "/products?sortBy=rating&order=desc&page=1"
        );
      });

      // Test no prefetching when sortBy is 'none'
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
      mockPrefetch.mockClear();
      render(<ProductFilters />);

      expect(mockPrefetch).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty search params, multiple params, and changing between sortBy values", () => {
      const { rerender } = render(<ProductFilters />);

      // Test empty search params
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
      rerender(<ProductFilters />);

      const sortBySelect = screen.getByLabelText("Sort by");
      expect(sortBySelect).toHaveValue("none");

      fireEvent.change(sortBySelect, { target: { value: "title" } });
      let callArgs = mockPush.mock.calls[0];
      let url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("title");
      expect(url.get("page")).toBe("1");

      // Test multiple search params
      const searchParams1 = new URLSearchParams(
        "?page=3&limit=24&filter=active&sortBy=price&order=desc"
      );
      (useSearchParams as jest.Mock).mockReturnValue(searchParams1);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Sort by"), {
        target: { value: "title" },
      });

      callArgs = mockPush.mock.calls[0];
      url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("limit")).toBe("24");
      expect(url.get("filter")).toBe("active");
      expect(url.get("sortBy")).toBe("title");
      expect(url.get("page")).toBe("1");
      expect(url.get("order")).toBe("desc"); // Order is preserved

      // Test changing from one sortBy to another and then changing order
      const searchParams2 = new URLSearchParams("?sortBy=price&order=asc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams2);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Sort by"), {
        target: { value: "title" },
      });

      callArgs = mockPush.mock.calls[0];
      url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("title");
      expect(url.get("page")).toBe("1");
      expect(url.get("order")).toBe("asc"); // Order is preserved

      const searchParams3 = new URLSearchParams("?sortBy=title&order=asc");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams3);
      mockPush.mockClear();
      rerender(<ProductFilters />);

      fireEvent.change(screen.getByLabelText("Order"), {
        target: { value: "desc" },
      });

      callArgs = mockPush.mock.calls[0];
      url = new URLSearchParams(callArgs[0].split("?")[1]);
      expect(url.get("sortBy")).toBe("title");
      expect(url.get("order")).toBe("desc");
      expect(url.get("page")).toBe("1");
    });
  });
});
