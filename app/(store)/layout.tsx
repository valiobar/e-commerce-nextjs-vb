import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { categoryService } from "@/services/categoryService";
import { CategoriesDrawer } from "@/components/CategoriesDrawer";

const StoreLayout = async ({ children }: { children: ReactNode }) => {
  const categories = await categoryService.fetchCategories();

  return (
    <div className="flex-1 flex flex-col w-full">
      <CategoriesDrawer categories={categories} />
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default StoreLayout;
