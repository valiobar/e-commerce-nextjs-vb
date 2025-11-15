import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { OrderModel, type Order } from "@/models/Order";

type CreateOrderRequest = Omit<Order, "_id" | "createdAt" | "updatedAt">;

export const GET = async (request: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {};

    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    await connectDB();

    const body = (await request.json()) as CreateOrderRequest;
    const order = new OrderModel(body);
    await order.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
};
