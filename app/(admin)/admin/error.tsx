"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const AdminError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-error mb-4">
        Admin Dashboard Error
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        {error.message || "An error occurred while loading the dashboard."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={reset}
          className="btn btn-primary cursor-pointer"
          aria-label="Try again"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="btn btn-outline cursor-pointer"
          aria-label="Go to admin dashboard"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminError;

