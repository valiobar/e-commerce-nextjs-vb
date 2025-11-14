"use client";

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit);
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
  };

  const getPageNumbers = () => {
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
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center gap-4">
        <label className="label">
          <span className="label-text">Items per page:</span>
        </label>
        <select
          className="select select-bordered w-24"
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
    <div className="flex flex-col items-center gap-4">
      <div className="join flex justify-center">
        <button
          className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          «
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <button
                key={`ellipsis-${index}`}
                className="join-item btn btn-disabled"
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
              className={`join-item btn ${isActive ? "btn-active" : ""}`}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className={`join-item btn ${
            currentPage === totalPages ? "btn-disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          »
        </button>
      </div>
      <div className="flex items-center justify-center gap-4">
        <label className="label">
          <span className="label-text">Items per page:</span>
        </label>
        <select
          className="select select-bordered w-24"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(e.target.value)}
          aria-label="Items per page"
        >
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="24">24</option>
        </select>
      </div>
    </div>
  );
};
