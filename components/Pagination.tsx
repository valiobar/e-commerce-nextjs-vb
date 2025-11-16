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
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
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
