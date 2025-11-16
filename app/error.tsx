"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
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
            href="/"
            className="btn btn-outline cursor-pointer"
            aria-label="Go to home page"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
