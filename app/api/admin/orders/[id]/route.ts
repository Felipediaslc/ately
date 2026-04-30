import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { verifyToken, TokenPayload } from "@/app/server/auth/sign";
import mongoose from "mongoose";

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

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =========================
// AUTH ADMIN (PADRÃO NOVO)
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
// GET ORDER
// =========================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidId(id)) {
    return fail("ID inválido", 400);
  }

  const user = await requireAdmin();
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

// =========================
// DELETE ORDER
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidId(id)) {
    return fail("ID inválido", 400);
  }

  const user = await requireAdmin();
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