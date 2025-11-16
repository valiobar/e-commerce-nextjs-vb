"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback, useMemo } from "react";
import type { SortByOption, OrderOption } from "@/types/sorting";

interface ProductFiltersProps {
  basePath?: string;
}

export const ProductFilters = ({ basePath = "/" }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize search params string to prevent unnecessary re-renders
  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const currentSortBy = (searchParams.get("sortBy") || "none") as SortByOption;
  const currentOrder = (searchParams.get("order") || "asc") as OrderOption;

  const handleSortByChange = useCallback(
    (sortBy: SortByOption) => {
      const params = new URLSearchParams(searchParamsString);
      if (sortBy === "none") {
        params.delete("sortBy");
        params.delete("order");
      } else {
        params.set("sortBy", sortBy);
      }
      // Reset to page 1 when sorting changes
      params.set("page", "1");
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    },
    [searchParamsString, router, basePath]
  );

  const handleOrderChange = useCallback(
    (order: OrderOption) => {
      const params = new URLSearchParams(searchParamsString);
      if (currentSortBy === "none") {
        return; // Don't allow order change when no sorting is selected
      }
      params.set("order", order);
      // Reset to page 1 when order changes
      params.set("page", "1");
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    },
    [searchParamsString, router, basePath, currentSortBy]
  );

  // Prefetch common filter combinations
  useEffect(() => {
    if (currentSortBy === "none") return;

    const prefetchUrl = (sortBy: SortByOption, order: OrderOption) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("sortBy", sortBy);
      params.set("order", order);
      params.set("page", "1");
      router.prefetch(`${basePath}?${params.toString()}`);
    };

    // Prefetch opposite order for current sortBy
    prefetchUrl(currentSortBy, currentOrder === "asc" ? "desc" : "asc");
  }, [currentSortBy, currentOrder, searchParamsString, router, basePath]);

  return (
    <div className="flex items-center justify-start gap-3 py-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          className="select select-bordered select-sm w-30 h-10"
          value={currentSortBy}
          onChange={(e) => handleSortByChange(e.target.value as SortByOption)}
          aria-label="Sort by"
        >
          <option value="none">None</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="discountPercentage">Discount</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Order:</label>
        <select
          className="select select-bordered select-sm w-30 h-10"
          value={currentOrder}
          onChange={(e) => handleOrderChange(e.target.value as OrderOption)}
          aria-label="Order"
          disabled={currentSortBy === "none"}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};
