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

  const baseButtonClass =
    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent";
  const activeButtonClass =
    "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center gap-3">
        <label className="text-sm text-gray-700 font-medium">
          Items per page:
        </label>
        <select
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-1">
        <button
          className={baseButtonClass}
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
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-sm text-gray-500"
                aria-label="More pages"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;
          return (
            <button
              key={pageNumber}
              className={`${baseButtonClass} ${
                isActive ? activeButtonClass : "text-gray-700 bg-white"
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
          className={baseButtonClass}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          tabIndex={0}
        >
          »
        </button>
      </div>
      <div className="flex items-center justify-center gap-3">
        <label className="text-sm text-gray-700 font-medium">
          Items per page:
        </label>
        <select
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
    </div>
  );
};
