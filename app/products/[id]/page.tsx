import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/ProductDetails";
import { productsService } from "@/services/productsService";

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
