import { connectDB } from "@/lib/db/mongodb";
import { OrderModel, type Order } from "@/models/Order";
import { UserModel } from "@/models/User";

export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
}

/**
 * Get dashboard statistics for admin panel
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await connectDB();

  const [totalOrders, totalUsers, recentOrders, totalRevenue] =
    await Promise.all([
      OrderModel.countDocuments(),
      UserModel.countDocuments(),
      OrderModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      OrderModel.getTotalRevenue(),
    ]);

  return {
    totalOrders,
    totalUsers,
    totalRevenue,
    recentOrders: recentOrders as Order[],
  };
};
