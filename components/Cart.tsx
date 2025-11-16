"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export const Cart = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const handleDecreaseQuantity = (itemId: number, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity - 1);
  };

  const handleIncreaseQuantity = (itemId: number, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId);
  };

  return (
    <>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/"
              onClick={closeCart}
              className="btn btn-primary cursor-pointer"
              aria-label="Continue shopping"
              tabIndex={0}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => {
              const discountedPrice =
                item.price - (item.price * item.discountPercentage) / 100;

              return (
                <div key={item.id} className="card bg-base-200 shadow-md">
                  <div className="card-body p-4">
                    <div className="flex gap-4">
                      <Link
                        href={`/products/${item.id}`}
                        onClick={closeCart}
                        className="shrink-0 cursor-pointer"
                      >
                        <div className="h-20 w-20 overflow-hidden rounded-lg">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.id}`}
                          onClick={closeCart}
                          className="block cursor-pointer"
                        >
                          <h3 className="font-semibold text-sm hover:link truncate text-primary">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-accent">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {item.discountPercentage > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleDecreaseQuantity(item.id, item.quantity)
                              }
                              className="btn btn-xs btn-circle cursor-pointer"
                              aria-label="Decrease quantity"
                              tabIndex={0}
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleIncreaseQuantity(item.id, item.quantity)
                              }
                              className="btn btn-xs btn-circle cursor-pointer"
                              aria-label="Increase quantity"
                              tabIndex={0}
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-accent">
                              ${(discountedPrice * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="btn btn-ghost btn-xs btn-circle cursor-pointer"
                              aria-label="Remove item"
                              tabIndex={0}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-accent p-4 bg-base-200">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Items ({totalItems})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="divider my-0"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Link
                href="/checkout"
                className="btn btn-primary btn-block cursor-pointer"
                aria-label="Proceed to checkout"
                tabIndex={0}
              >
                Checkout
              </Link>
              <Link
                href="/"
                onClick={closeCart}
                className="btn btn-outline btn-block cursor-pointer"
                aria-label="Continue shopping"
                tabIndex={0}
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="btn btn-ghost btn-sm cursor-pointer"
                aria-label="Clear all items from cart"
                tabIndex={0}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
