import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/server/db/models/Product";


export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const price = searchParams.get("price");
    const category = searchParams.get("category");

    
    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (price) {
      const [min, max] = price.split("-");

      filter.price =
        max === "*"
          ? { $gte: Number(min) }
          : { $gte: Number(min), $lte: Number(max) };
    }

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .lean(); // 🔥 performance

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro GET products:", error);

    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
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
    console.error("Erro POST product:", error);

    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}