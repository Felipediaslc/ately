import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";

export async function getAdminKpis() {
  await connectDB();

  const [totalOrders, revenueAgg, pendingOrders, recentOrders] = await Promise.all([
    OrderModel.countDocuments(),

    OrderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),

    OrderModel.countDocuments({ status: "pendente" }),

    // 4. últimos 5 pedidos
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const revenue = revenueAgg?.[0]?.total || 0;

  return {
    totalOrders,
    revenue,
    pendingOrders,
    recentOrders,
  };
}