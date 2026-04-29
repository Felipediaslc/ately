import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { getUserFromRequest } from "@/app/lib/auth";

// helpers padrão
function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function fail(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user || user.role !== "admin") {
    return fail("Unauthorized", 401);
  }

  try {
    await connectDB();

    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .lean();

    const formatted = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    }));

    return ok(formatted);

  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return fail("Erro ao buscar pedidos");
  }
}