import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import type { OrderStatus } from "@/app/utils/getStatusConfig";
import { getUserFromRequest } from "@/app/lib/auth";

const validStatus: OrderStatus[] = [
  "pendente",
  "pago",
  "enviado",
  "entregue",
  "cancelado",
  "estornado",
];

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: Context) {
  try {
    // 🔐 AUTH
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // 📦 PARAMS (NOVO PADRÃO NEXT 16)
    const { id } = await context.params;

    // 📦 BODY
    const body = await req.json();
    const status: OrderStatus = body?.status;

    // ✅ valida status
    if (!validStatus.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status inválido" },
        { status: 400 }
      );
    }

    // 🧠 update
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

    // ✅ response padrão
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