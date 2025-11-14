import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/ProductDetails";
import type { Product } from "@/types/product";

const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
};

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

