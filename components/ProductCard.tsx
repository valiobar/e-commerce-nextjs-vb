import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { AddToCart } from "./buttons/AddToCart";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Link href={`/products/${product.id}`} className="cursor-pointer">
      <div className="card bg-base-200 hover:bg-base-300 h-full w-full shadow-xl transition-transform hover:scale-105 p-5 cursor-pointer flex flex-col">
        <figure className="h-64 w-full overflow-hidden shrink-0">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={400}
            height={400}
            className="h-full w-full object-cover"
            priority={false}
          />
        </figure>
        <div className="card-body flex flex-col flex-1 p-0 pt-4">
          <div className="flex-1">
            <h2 className="card-title line-clamp-2 text-primary mb-2">
              {product.title}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="rating rating-sm">
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
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="badge badge-error">
                    -{product.discountPercentage.toFixed(0)}%
                  </span>
                </>
              )}
            </div>
            <div className="divider my-0"></div>
            <div>
              <AddToCart product={product} showContinueShoping={false} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
