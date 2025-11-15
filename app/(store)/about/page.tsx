import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our e-commerce store and our mission",
};

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          About Us
        </h1>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-4 text-[var(--color-primary)]">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in 2020, our e-commerce store was born from a simple idea:
              to make quality products accessible to everyone, everywhere. What
              started as a small online shop has grown into a trusted
              destination for thousands of customers worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe that shopping should be easy, enjoyable, and
              transparent. That&apos;s why we&apos;ve built our platform with
              customer satisfaction at its core, offering a seamless shopping
              experience from browsing to delivery.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-4 text-[var(--color-primary)]">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our mission is to provide exceptional products and outstanding
              customer service while maintaining the highest standards of
              quality and integrity. We are committed to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Offering a curated selection of high-quality products</li>
              <li>Providing fast, reliable shipping and delivery</li>
              <li>Ensuring customer satisfaction with every purchase</li>
              <li>
                Maintaining competitive prices without compromising quality
              </li>
              <li>Supporting sustainable and ethical business practices</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-4 text-[var(--color-primary)]">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
                  Quality First
                </h3>
                <p className="text-gray-600">
                  We carefully select every product in our catalog to ensure it
                  meets our high standards for quality and durability.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
                  Customer Focus
                </h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We listen to feedback and
                  continuously improve our services based on your needs.
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We embrace new technologies and trends to enhance your
                  shopping experience and stay ahead of the curve.
                </p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  We conduct business with honesty, transparency, and respect
                  for our customers, partners, and the environment.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-4 text-[var(--color-primary)]">
              Why Choose Us?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[var(--color-primary)]">
                    Wide Selection
                  </h3>
                  <p className="text-gray-600">
                    Browse through thousands of products across multiple
                    categories, all in one convenient place.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[var(--color-primary)]">
                    Secure Shopping
                  </h3>
                  <p className="text-gray-600">
                    Your personal and payment information is protected with
                    industry-leading security measures.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[var(--color-primary)]">
                    24/7 Support
                  </h3>
                  <p className="text-gray-600">
                    Our customer support team is available around the clock to
                    assist you with any questions or concerns.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-[var(--color-primary)]">
                    Easy Returns
                  </h3>
                  <p className="text-gray-600">
                    Not satisfied? Our hassle-free return policy makes it easy
                    to return or exchange items within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Get in Touch
            </h2>
            <p className="mb-4 text-lg">
              Have questions or feedback? We&apos;d love to hear from you!
            </p>
            <div className="space-y-2 text-lg">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                support@ecommercestore.com
              </p>
              <p>
                <span className="font-semibold">Phone:</span> +1 (555) 123-4567
              </p>
              <p>
                <span className="font-semibold">Address:</span> 123 Commerce
                Street, Business City, BC 12345
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
