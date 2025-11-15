import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default StoreLayout;

