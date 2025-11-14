import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">Product Not Found</h1>
      <p className="mb-8 text-gray-600">
        The product you're looking for doesn't exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

