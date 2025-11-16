import Link from "next/link";

const CategoryNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-primary">
        Category Not Found
      </h1>
      <p className="mb-8 text-lg text-base-content/70">
        The category you're looking for doesn't exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default CategoryNotFound;
