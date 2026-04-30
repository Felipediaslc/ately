import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import type { OrderStatus } from "@/app/utils/getStatusConfig";
import { verifyToken, TokenPayload } from "@/app/server/auth/sign";

// =========================
// STATUS VALIDOS
// =========================
const validStatus: OrderStatus[] = [
  "pendente",
  "pago",
  "enviado",
  "entregue",
  "cancelado",
  "estornado",
];

// =========================
// CONTEXT
// =========================
type Context = {
  params: Promise<{ id: string }>;
};

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
// PATCH - UPDATE STATUS
// =========================
export async function PATCH(req: Request, context: Context) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    const body = await req.json();
    const status: OrderStatus = body?.status;

    if (!validStatus.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status inválido" },
        { status: 400 }
      );
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order._id.toString(),
        status: order.status,
      },
    });
  } catch (error) {
    console.error("ORDER STATUS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}