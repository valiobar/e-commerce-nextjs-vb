"use client";

import {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  KeyboardEvent,
  startTransition,
} from "react";
import { useCartStore } from "@/store/cartStore";
import "./CartIcon.css";

export const CartIcon = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalItemsRef = useRef(0);

  useLayoutEffect(() => {
    startTransition(() => {
      setMounted(true);
      prevTotalItemsRef.current = totalItems;
    });
  }, [totalItems]);

  useEffect(() => {
    if (!mounted) {
      prevTotalItemsRef.current = totalItems;
      return;
    }

    if (totalItems > prevTotalItemsRef.current) {
      setIsAnimating(false);
      let timeoutId: NodeJS.Timeout;
      const rafId = requestAnimationFrame(() => {
        setIsAnimating(true);
        timeoutId = setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      });
      prevTotalItemsRef.current = totalItems;
      return () => {
        cancelAnimationFrame(rafId);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
    
    prevTotalItemsRef.current = totalItems;
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
      className="btn btn-ghost btn-circle text-white hover:bg-white/20"
      aria-label={`Shopping cart with ${displayItems} items`}
      tabIndex={0}
    >
      <div className={`indicator ${isAnimating ? "animate-pop" : ""}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-white"
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
            className={`badge badge-sm badge-primary indicator-item ${
              isAnimating ? "animate-bounce-in" : ""
            }`}
          >
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
};

