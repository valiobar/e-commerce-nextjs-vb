"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

export const Breadcrumbs = () => {
  const pathname = usePathname();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const paths = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: "Home", href: "/", isActive: pathname === "/" },
    ];

    if (paths.length === 0) {
      return items;
    }

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;

      let label = path;
      if (path === "cart") {
        label = "Cart";
      } else if (path === "products") {
        label = "Products";
      } else if (!isNaN(Number(path))) {
        label = `Product ${path}`;
      } else {
        label = path.charAt(0).toUpperCase() + path.slice(1);
      }
      if (path !== "products") {
        items.push({
          label,
          href: currentPath,
          isActive: isLast,
        });
      }
    });

    return items;
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="breadcrumbs text-sm">
        <ul className="flex items-center gap-2 text-gray-500">
          {breadcrumbs.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm">
                {item.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className="text-gray-500"> / </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
