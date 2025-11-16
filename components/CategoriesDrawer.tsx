"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCategoriesStore } from "@/store/categoriesStore";
import type { KeyboardEvent } from "react";

interface CategoriesDrawerProps {
  categories: string[];
}

const formatCategoryName = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const CategoriesDrawer = ({ categories }: CategoriesDrawerProps) => {
  const isOpen = useCategoriesStore((state) => state.isOpen);
  const closeCategories = useCategoriesStore((state) => state.closeCategories);

  useEffect(() => {
    const handleScroll = () => {
      // Close drawer when scrolling starts
      if (isOpen) {
        //   closeCategories();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, closeCategories]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      closeCategories();
    }
  };

  const handleCategoryClick = () => {
    closeCategories();
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      {/* Categories Drawer */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 z-[60] ${
          isOpen
            ? "w-full sm:w-80 opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Categories"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-base-content">
            Categories
          </h2>
          <button
            onClick={closeCategories}
            className="btn btn-sm btn-circle cursor-pointer text-base-content hover:text-secondary transition-colors"
            aria-label="Close categories"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="menu gap-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/category/${category}`}
                  className="text-base-content hover:bg-base-200 rounded-lg p-3"
                  onClick={handleCategoryClick}
                >
                  {formatCategoryName(category)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
