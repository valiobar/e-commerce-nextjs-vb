import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-[var(--color-primary)]">
        Product Not Found
      </h1>
      <p className="mb-8 text-gray-600">
        The product you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn btn-primary cursor-pointer">
        Back to Home
      </Link>
    </div>
  );
}
