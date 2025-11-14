import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card bg-base-100 h-full w-full shadow-xl transition-transform hover:scale-105">
        <figure className="h-64 w-full overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title line-clamp-2">{product.title}</h2>
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
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
        </div>
      </div>
    </Link>
  );
};

