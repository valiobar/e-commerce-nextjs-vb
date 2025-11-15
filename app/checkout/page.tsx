"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { OrderSummary } from "@/components/OrderSummary";
import { ordersService } from "@/services/ordersService";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const total = getTotalPrice();

      // Create order in database
      await ordersService.createOrder({
        items,
        total,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      // Clear cart and redirect to success page
      clearCart();
      router.push("/checkout/success");
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">Checkout</h1>
        <p className="mb-8 text-gray-600">Your cart is empty</p>
        <Link href="/cart" className="btn btn-primary cursor-pointer">
          Go to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-primary">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Contact Information */}
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
              <legend className="fieldset-legend">Contact Information</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="firstName">
                    <span className="label-text font-medium">First Name</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="lastName">
                    <span className="label-text font-medium">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full sm:col-span-2">
                  <label className="label py-2" htmlFor="email">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full sm:col-span-2">
                  <label className="label py-2" htmlFor="phone">
                    <span className="label-text font-medium">Phone</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </fieldset>

            {/* Shipping Information */}
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
              <legend className="fieldset-legend">Shipping Address</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control w-full sm:col-span-2">
                  <label className="label py-2" htmlFor="address">
                    <span className="label-text font-medium">Address</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="city">
                    <span className="label-text font-medium">City</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="state">
                    <span className="label-text font-medium">State</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="zipCode">
                    <span className="label-text font-medium">Zip Code</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-2" htmlFor="country">
                    <span className="label-text font-medium">Country</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required
                    aria-required="true"
                  >
                    <option value="">Select Country</option>
                    <option value="BG">🇧🇬 Bulgaria</option>
                    <option value="SE">🇸🇪 Sweden</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="FR">🇫🇷 France</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="btn btn-outline flex-1 cursor-pointer"
                aria-label="Back to cart"
                tabIndex={0}
              >
                Back to Cart
              </Link>
              <button
                type="submit"
                className="btn btn-primary flex-1 cursor-pointer"
                disabled={isSubmitting}
                aria-label="Place order"
                tabIndex={0}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <OrderSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;
