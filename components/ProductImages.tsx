"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductImagesProps {
  product: Product;
}

export const ProductImages = ({ product }: ProductImagesProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.images[selectedImageIndex] || product.thumbnail}
          alt={product.title}
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded border-2 cursor-pointer ${
                selectedImageIndex === index
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              aria-label={`View ${product.title} image ${index + 1}`}
              tabIndex={0}
            >
              <Image
                src={image}
                alt={`${product.title} ${index + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
