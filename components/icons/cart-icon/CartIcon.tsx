"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import type { KeyboardEvent } from "react";
import "./CartIcon.css";

export const CartIcon = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const prevTotalItemsRef = useRef(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!mounted) {
      prevTotalItemsRef.current = totalItems;
      return;
    }

    // Trigger animation when count changes (increase or decrease)
    if (totalItems !== prevTotalItemsRef.current) {
      // Determine if we're adding or removing items
      const adding = totalItems > prevTotalItemsRef.current;
      setIsAdding(adding);

      // Force reflow to restart animation
      let rafId2: number;
      let timeoutId: NodeJS.Timeout;

      const rafId1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false);
          rafId2 = requestAnimationFrame(() => {
            setIsAnimating(true);
            // Reset animation state after animation completes
            timeoutId = setTimeout(() => {
              setIsAnimating(false);
            }, 800);
          });
        });
      });
      prevTotalItemsRef.current = totalItems;

      return () => {
        cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [totalItems, mounted]);

  const handleCartClick = () => {
    toggleCart();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCartClick();
    }
  };

  const displayItems = mounted ? totalItems : 0;

  return (
    <button
      onClick={handleCartClick}
      onKeyDown={handleKeyDown}
      className="btn btn-ghost btn-circle text-white hover:bg-white/20 cursor-pointer border-none hover:border-none"
      aria-label={`Shopping cart with ${displayItems} items`}
      tabIndex={0}
    >
      <div className="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={`inline-block h-5 w-5 stroke-white ${
            isAnimating ? "animate-pop" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {mounted && totalItems > 0 && (
          <span
            className={`badge badge-sm indicator-item text-white border-none ${
              isAnimating
                ? `animate-bounce-pop ${
                    isAdding ? "bg-green-500/60" : "bg-red-500/60"
                  }`
                : "bg-[var(--color-primary)]/60"
            }`}
          >
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
};
