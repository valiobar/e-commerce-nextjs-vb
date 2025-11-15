import { Schema, model, models } from "mongoose";
import type { CartItem } from "@/types/product";

export interface Order {
  _id?: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    items: {
      type: [Schema.Types.Mixed],
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
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = models.Order || model<Order>("Order", OrderSchema);
