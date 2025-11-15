"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[selectedImageIndex] || product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                  aria-label={`View ${product.title} image ${index + 1}`}
                  tabIndex={0}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="mt-2 text-gray-600">{product.brand}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <input
                  key={i}
                  type="radio"
                  name={`rating-${product.id}`}
                  className="mask mask-star-2 bg-orange-400"
                  checked={i + 1 === Math.round(product.rating)}
                  readOnly
                />
              ))}
            </div>
            <span className="text-lg">{product.rating.toFixed(1)}</span>
            <span className="text-gray-500">({product.stock} in stock)</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="badge badge-error badge-lg">
                    -{product.discountPercentage.toFixed(0)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="divider"></div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p>
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg w-full"
            aria-label="Add product to cart"
            tabIndex={0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
