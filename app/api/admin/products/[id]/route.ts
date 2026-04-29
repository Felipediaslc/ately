import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { ProductModel } from "@/app/server/db/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest } from "@/app/lib/auth";
import mongoose from "mongoose";

// 🔧 CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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

//
// 🔵 GET - BUSCAR PRODUTO
//
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin(req);
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin(req);
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();
    const body = await req.json();
    if (!body.title || typeof body.price !== "number") return fail("Dados inválidos", 400);

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

    if (!updatedProduct) return fail("Produto não encontrado", 404);
    return ok(updatedProduct);
  } catch (error) {
    console.error("PUT product error:", error);
    return fail("Erro ao atualizar produto");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidId(id)) return fail("ID inválido", 400);

  const user = await requireAdmin(req);
  if (!user) return fail("Unauthorized", 401);

  try {
    await connectDB();
    const product = await ProductModel.findById(id);
    if (!product) return fail("Produto não encontrado", 404);

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