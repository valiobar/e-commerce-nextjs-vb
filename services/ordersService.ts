import type { Order } from "@/models/Order";

type CreateOrderParams = Omit<
  Order,
  "_id" | "status" | "createdAt" | "updatedAt"
>;

export const ordersService = {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderParams): Promise<Order> {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    return res.json();
  },

  /**
   * Fetch orders by user ID
   */
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const res = await fetch(`/api/orders?userId=${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    return res.json();
  },

  /**
   * Fetch a single order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch order");
    }

    return res.json();
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update order");
    }

    return res.json();
  },

  /**
   * Get total revenue from all orders
   */
  async getTotalRevenue(): Promise<number> {
    const res = await fetch("/api/orders?totalRevenue=true");

    if (!res.ok) {
      throw new Error("Failed to fetch total revenue");
    }

    const data = await res.json();
    return data.totalRevenue;
  },
};
