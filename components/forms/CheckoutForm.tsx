import { FormEvent } from "react";
import Link from "next/link";

export interface CheckoutFormData {
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

interface CheckoutFormProps {
  formData: CheckoutFormData;
  error: string | null;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const CheckoutForm = ({
  formData,
  error,
  isSubmitting,
  onInputChange,
  onSubmit,
}: CheckoutFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
  );
};

