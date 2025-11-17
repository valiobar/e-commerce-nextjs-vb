"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  itemsPerPage?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  basePath = "/",
  itemsPerPage = 12,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize search params string to prevent unnecessary re-renders
  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      // Show all pages if total is 3 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show exactly 3 page number buttons (no first/last page buttons)
      let startPage: number;
      let endPage: number;

      if (currentPage <= 2) {
        // Near the beginning: show pages 1-3
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        // Near the end: show last 3 pages
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        // In the middle: show current page with one before and one after
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Add ellipsis before if needed (only if not showing page 1)
      if (startPage > 1) {
        pages.push("...");
      }

      // Add exactly 3 page number buttons
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis after if needed (only if not showing last page)
      if (endPage < totalPages) {
        pages.push("...");
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Prefetch next and previous pages for faster navigation
  useEffect(() => {
    const buildPageUrl = (page: number) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("page", page.toString());
      return `${basePath}?${params.toString()}`;
    };

    // Prefetch next page
    if (currentPage < totalPages) {
      router.prefetch(buildPageUrl(currentPage + 1));
    }

    // Prefetch previous page
    if (currentPage > 1) {
      router.prefetch(buildPageUrl(currentPage - 1));
    }
  }, [currentPage, totalPages, basePath, searchParamsString, router]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParamsString);
    params.set("page", page.toString());
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const handleItemsPerPageChange = (limit: string) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("limit", limit);
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <select
          className="select select-bordered w-20 h-12"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(e.target.value)}
          aria-label="Items per page"
        >
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="24">24</option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="join">
        <button
          className={`join-item btn ${
            currentPage === 1 ? "bg-secondary text-white" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          tabIndex={0}
        >
          «
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <button
                key={`ellipsis-${index}`}
                className="join-item btn btn-disabled bg-secondary text-white"
                disabled
                aria-label="More pages"
              >
                ...
              </button>
            );
          }

          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;
          return (
            <button
              key={pageNumber}
              className={`join-item btn ${
                isActive ? "bg-secondary text-white" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
              tabIndex={0}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className={`join-item btn ${
            currentPage === totalPages ? "bg-secondary text-white" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          tabIndex={0}
        >
          »
        </button>
      </div>
      <select
        className="select select-bordered w-20 h-10"
        value={itemsPerPage}
        onChange={(e) => handleItemsPerPageChange(e.target.value)}
        aria-label="Items per page"
      >
        <option value="12">12</option>
        <option value="24">18</option>
        <option value="36">36</option>
        <option value="48">48</option>
      </select>
    </div>
  );
};
