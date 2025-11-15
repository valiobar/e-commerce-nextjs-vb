import { Schema, model, models, type Model } from "mongoose";
import type { CartItem } from "@/types/product";

export interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

const CartItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    items: {
      type: [CartItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: false },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);
OrderSchema.statics.getTotalRevenue = async function (): Promise<number> {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

interface OrderModelStatics extends Model<Order> {
  getTotalRevenue(): Promise<number>;
}

// Ensure the static method is available on cached models
if (
  models.Order &&
  !(models.Order as unknown as OrderModelStatics).getTotalRevenue
) {
  (models.Order as unknown as OrderModelStatics).getTotalRevenue = OrderSchema
    .statics.getTotalRevenue as () => Promise<number>;
}

export const OrderModel = (models.Order ||
  model<Order, OrderModelStatics>(
    "Order",
    OrderSchema
  )) as unknown as OrderModelStatics;
