import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { ProductModel } from "@/app/server/db/models/Product";
import { getUserFromRequest } from "@/app/lib/auth";

// 🔧 helper de resposta padrão
function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function fail(message: string, status = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// 🔐 validação centralizada
async function requireAdmin(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

// 🔵 GET - LISTAR PRODUTOS
export async function GET(req: Request) {
  const user = await requireAdmin(req);

  if (!user) {
    return fail("Unauthorized", 401);
  }

  try {
    await connectDB();

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return ok(products);
  } catch (error) {
    console.error("GET /admin/products error:", error);
    return fail("Erro ao buscar produtos");
  }
}

// 🟢 POST - CRIAR PRODUTO
export async function POST(req: Request) {
  const user = await requireAdmin(req);

  if (!user) {
    return fail("Unauthorized", 401);
  }

  try {
    await connectDB();

    const body = await req.json();

    // validação mínima
    if (!body.title || !body.price) {
      return fail("Dados inválidos", 400);
    }

    const product = await ProductModel.create(body);

    return ok(product);
  } catch (error) {
    console.error("POST /admin/products error:", error);
    return fail("Erro ao criar produto");
  }
}