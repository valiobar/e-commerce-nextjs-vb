"use client";

import { useCategoriesStore } from "@/store/categoriesStore";

export const CategoriesButton = () => {
  const isOpen = useCategoriesStore((state) => state.isOpen);
  const openCategories = useCategoriesStore((state) => state.openCategories);

  return (
    <button
      onClick={openCategories}
      className="btn btn-ghost p-0 text-white hover:text-white/90 hover:bg-white/10 cursor-pointer"
      aria-label="Categories"
      aria-expanded={isOpen}
    >
      Categories
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};
