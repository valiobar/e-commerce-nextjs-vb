import { useCartStore } from "@/store/cartStore";

const calculateDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};

export const OrderSummary = () => {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <div className="lg:col-span-1">
      <div className="card bg-base-200 sticky top-4 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary">Order Summary</h2>
          <div className="divider"></div>
          <div className="space-y-4">
            {items.map((item) => {
              const discountedPrice = calculateDiscountedPrice(
                item.price,
                item.discountPercentage
              );
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      ${(discountedPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="divider"></div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items ({totalItems})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
