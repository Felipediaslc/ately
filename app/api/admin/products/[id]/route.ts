import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/server/db/connect";
import { ProductModel } from "@/app/server/db/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken, TokenPayload } from "@/app/server/auth/sign";
import mongoose from "mongoose";

// =========================
// CLOUDINARY CONFIG
// =========================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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
// AUTH ADMIN
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
// GET - PRODUCT BY ID
// =========================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin();
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();

    const product = await ProductModel.findById(id).lean();

    if (!product) return fail("Produto não encontrado", 404);

    return ok({ ...product, _id: product._id.toString() });
  } catch (error) {
    console.error("GET product error:", error);
    return fail("Erro ao buscar produto");
  }
}

// =========================
// PUT - UPDATE PRODUCT
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin();
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();

    const body = await req.json();

    if (!body.title || typeof body.price !== "number") {
      return fail("Dados inválidos", 400);
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        title: body.title,
        price: body.price,
        images: Array.isArray(body.images) ? body.images : [],
        category: body.category,
        description: body.description,
        pixPrice: body.pixPrice,
        stock: body.stock,
        sku: body.sku,
        deliveryDays: body.deliveryDays,
        isUnique: body.isUnique,
        isHandmade: body.isHandmade,
        isLimited: body.isLimited,
      },
      { new: true }
    ).lean();

    if (!updatedProduct) {
      return fail("Produto não encontrado", 404);
    }

    return ok(updatedProduct);
  } catch (error) {
    console.error("PUT product error:", error);
    return fail("Erro ao atualizar produto");
  }
}

// =========================
// DELETE - REMOVE PRODUCT
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin();
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();

    const product = await ProductModel.findById(id);

    if (!product) return fail("Produto não encontrado", 404);

    // deletar imagens cloudinary
    if (product.images?.length) {
      for (const imageUrl of product.images) {
        try {
          const urlParts = imageUrl.split("/");
          const fileWithFolder = urlParts.slice(-2).join("/");
          const publicId = fileWithFolder.split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Erro ao deletar imagem:", err);
        }
      }
    }

    await ProductModel.findByIdAndDelete(id);

    return ok({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("DELETE product error:", error);
    return fail("Erro ao deletar produto");
  }
}