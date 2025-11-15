"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CartIcon } from "@/components/icons/CartIcon";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`navbar bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg px-3 flex flex-row justify-between sticky z-50 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isScrolled
            ? "py-2 scale-[0.85] opacity-80 origin-top mt-3 top-5 rounded-3xl"
            : "py-5 scale-100 top-0 rounded-none"
        }`}
      >
        <div className="flex-1 flex-direction-row">
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold text-white hover:text-white/90"
            aria-label="E-Commerce Store Home"
          >
            E-Commerce Store
          </Link>
        </div>
        <div className="flex-none flex items-center gap-4">
          <Link
            href="/about"
            className="btn btn-ghost text-white hover:text-white/90 hover:bg-white/10"
            aria-label="About Us"
          >
            About
          </Link>
          <CartIcon />
        </div>
      </div>
    </>
  );
};
