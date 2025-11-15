"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";

interface AddToCartProps {
  product: Product;
  showContinueShoping?: boolean;
  showRemoveItem?: boolean;
}

export const AddToCart = ({
  product,
  showContinueShoping = true,
  showRemoveItem = true,
}: AddToCartProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.id === product.id)
  );
  const isInCart = !!cartItem;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
  };

  const handleRemoveItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handleAddToCart}
        className={`btn btn-lg w-full transition-all ${
          isInCart ? "btn-success" : "btn-primary btn-active"
        }`}
        aria-label={isInCart ? "Product in cart" : "Add product to cart"}
        tabIndex={0}
      >
        {isInCart ? (
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            In Cart{" "}
            {cartItem && cartItem.quantity > 1 && `(${cartItem.quantity})`}
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>
      {isInCart && (
        <>
          {showRemoveItem && (
            <button
              onClick={handleRemoveItem}
              className="btn btn-outline btn-error btn-lg w-full transition-all"
              aria-label="Remove one item from cart"
              tabIndex={0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Remove Item
            </button>
          )}
          {showContinueShoping && (
            <Link
              href="/"
              className="btn btn-outline btn-lg w-full transition-all"
              aria-label="Continue shopping"
              tabIndex={0}
            >
              Continue Shopping
            </Link>
          )}
        </>
      )}
    </div>
  );
};
