export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">E-Commerce Store</h3>
            <p className="text-white/90 text-sm">
              Your one-stop destination for quality products at unbeatable
              prices. We bring you the best shopping experience with a wide
              selection of premium items.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <address className="text-white/90 text-sm not-italic space-y-2">
              <p>123 Commerce Street</p>
              <p>Suite 456</p>
              <p>New York, NY 10001</p>
              <p className="pt-2">
                <a
                  href="mailto:info@ecommercestore.com"
                  className="hover:text-white underline cursor-pointer"
                  aria-label="Email us at info@ecommercestore.com"
                >
                  info@ecommercestore.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+1234567890"
                  className="hover:text-white underline cursor-pointer"
                  aria-label="Call us at +1 (234) 567-890"
                >
                  +1 (234) 567-890
                </a>
              </p>
            </address>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company Motto</h4>
            <p className="text-white/90 text-sm italic">
              &quot;Quality Products, Exceptional Service, Unmatched Value&quot;
            </p>
            <p className="text-white/80 text-xs pt-4">
              © 2025 E-Commerce Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
