"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Cart } from "@/components/Cart";
import type { KeyboardEvent } from "react";

export const CartSidebar = () => {
  const pathname = usePathname();
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  useEffect(() => {
    if (isOpen) {
      closeCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      closeCart();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden border-l border-gray-200 z-50 ${
          isOpen
            ? "w-full sm:w-96 opacity-100 translate-x-0"
            : "w-0 opacity-0 translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-accent shrink-0">
          <h2 className="text-lg font-semibold text-primary">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="btn btn-sm btn-circle cursor-pointer text-primary hover:text-secondary transition-colors"
            aria-label="Close cart"
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
        <Cart />
      </div>
    </>
  );
};
