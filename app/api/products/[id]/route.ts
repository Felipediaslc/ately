import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/server/db/models/Product";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // 🔥 CORREÇÃO AQUI
    const { id } = await context.params;

    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro GET product by id:", error);

    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}