import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { verifyToken, TokenPayload } from "@/app/server/auth/sign";

// =========================
// HELPERS
// =========================
function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function fail(message: string, status = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// =========================
// AUTH ADMIN (PADRÃO FINAL)
// =========================
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  const user = await verifyToken<TokenPayload>(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

// =========================
// GET - LIST ORDERS
// =========================
export async function GET() {
  const user = await requireAdmin();

  if (!user) {
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