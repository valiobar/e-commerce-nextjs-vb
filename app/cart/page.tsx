"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-[var(--color-primary)]">
          Your Cart
        </h1>
        <p className="mb-8 text-gray-600">Your cart is empty</p>
        <Link href="/" className="btn btn-primary cursor-pointer">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="btn btn-ghost btn-sm cursor-pointer"
          aria-label="Clear all items from cart"
          tabIndex={0}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discountedPrice =
              item.price - (item.price * item.discountPercentage) / 100;

            return (
              <div key={item.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      href={`/products/${item.id}`}
                      className="cursor-pointer"
                    >
                      <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.id}`}
                        className="cursor-pointer"
                      >
                        <h2 className="card-title hover:link text-[var(--color-primary)]">
                          {item.title}
                        </h2>
                      </Link>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xl font-bold text-[var(--color-accent)]">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-ghost btn-sm btn-circle cursor-pointer"
                        aria-label="Remove item"
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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="btn btn-sm btn-circle cursor-pointer"
                          aria-label="Decrease quantity"
                          tabIndex={0}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="btn btn-sm btn-circle cursor-pointer"
                          aria-label="Increase quantity"
                          tabIndex={0}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--color-accent)]">
                          ${(discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-base-100 sticky top-4 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-[var(--color-primary)]">
                Order Summary
              </h2>
              <div className="divider"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="card-actions mt-4">
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
                  className="btn btn-outline btn-block cursor-pointer"
                  aria-label="Continue shopping"
                  tabIndex={0}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
