import Link from "next/link";

const CheckoutSuccessPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-success p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-success-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-primary">
          Order Placed Successfully!
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="btn btn-primary cursor-pointer"
            aria-label="Continue shopping"
            tabIndex={0}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
