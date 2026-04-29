import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { getUserFromRequest } from "@/app/lib/auth";
import mongoose from "mongoose";

// 🔧 helpers padrão
function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function fail(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// 🔐 valida admin
async function requireAdmin(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") return null;
  return user;
}

// 🧠 valida ObjectId
function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

type Context = {
  params: Promise<{ id: string }>;
};

//
// 🔵 GET
//
export async function GET(req: Request, context: Context) {
  const { id } = await context.params;

  if (!isValidId(id)) {
    return fail("ID inválido", 400);
  }

  const user = await requireAdmin(req);
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();

    const order = await OrderModel.findById(id).lean();

    if (!order) {
      return fail("Pedido não encontrado", 404);
    }

    return ok({
      ...order,
      _id: order._id.toString(),
    });
  } catch (error) {
    console.error("GET order error:", error);
    return fail("Erro ao buscar pedido");
  }
}

//
// 🔴 DELETE
//
export async function DELETE(req: Request, context: Context) {
  const { id } = await context.params;

  if (!isValidId(id)) {
    return fail("ID inválido", 400);
  }

  const user = await requireAdmin(req);
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();

    const deleted = await OrderModel.findByIdAndDelete(id);

    if (!deleted) {
      return fail("Pedido não encontrado", 404);
    }

    return ok({ message: "Pedido removido com sucesso" });
  } catch (error) {
    console.error("DELETE order error:", error);
    return fail("Erro ao deletar pedido");
  }
}