import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/server/db/connect";
import { ProductModel } from "@/app/server/db/models/Product";
import { verifyToken, TokenPayload   } from "@/app/server/auth/sign";

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

// 🔐 valida admin (SISTEMA NOVO)
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  const user = await verifyToken<TokenPayload >(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

// 🔵 GET - LISTAR PRODUTOS
export async function GET() {
  const user = await requireAdmin();

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
  const user = await requireAdmin();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  try {
    await connectDB();

    const body = await req.json();
       
    if (!body.title || !body.price) {
      return fail("Dados inválidos", 400);
    }
  
    const product = await ProductModel.create(body);

   
console.log(product);

    return ok(product);
  } catch (error) {
    console.error("POST /admin/products error:", error);
    return fail("Erro ao criar produto");
  }
}