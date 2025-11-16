import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/ProductDetails";
import { productsService } from "@/services/productsService";

// Enable static generation with revalidation for product pages
export const revalidate = 300; // Revalidate every 5 minutes

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await productsService.fetchProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
};

export default ProductPage;
