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
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to create order: ${res.status}`
        );
      }

      const data: Order = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create order: Network error");
    }
  },

  /**
   * Fetch orders by user ID
   */
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const res = await fetch(`/api/orders?userId=${userId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch orders: ${res.status}`
        );
      }

      const data: Order[] = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch orders: Network error");
    }
  },

  /**
   * Fetch a single order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${orderId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch order: ${res.status}`
        );
      }

      const data: Order = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch order: Network error");
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update order: ${res.status}`
        );
      }

      const data: Order = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update order: Network error");
    }
  },

  /**
   * Get total revenue from all orders
   */
  async getTotalRevenue(): Promise<number> {
    try {
      const res = await fetch("/api/orders?totalRevenue=true");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch total revenue: ${res.status}`
        );
      }

      const data = await res.json();
      return data.totalRevenue ?? 0;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch total revenue: Network error");
    }
  },
};
