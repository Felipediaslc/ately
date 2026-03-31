import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/server/db/models/Product";

// 🔹 GET (listar produtos)
export async function GET() {
  try {
    await connectDB();

    const products = await ProductModel.find().sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
  console.error("ERRO REAL:", error);
  return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
}
}

// 🔹 POST (criar produto)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await ProductModel.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}