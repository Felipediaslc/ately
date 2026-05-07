import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ProductModel } from "@/app/server/db/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await ProductModel.find()
      .select(
        "title price images category categorySlug pixPrice stock sold isUnique isHandmade isLimited sku deliveryDays createdAt updatedAt"
      )
      .lean()
      .limit(100) // 🔥 proteção contra explosão de dados
      .sort({ createdAt: -1 });

    const normalized = products.map((p) => {
     const images =
  Array.isArray(p.images)
    ? p.images.filter(
        (img: unknown): img is string =>
          typeof img === "string" && img.trim() !== ""
      )
    : [];

      return {
        productId: p._id.toString(),
        title: p.title,
        price: p.price,
        images: images.length > 0 ? images : ["/image/logo.jpeg"],
        category: p.category,
        categorySlug: p.categorySlug,
        pixPrice: p.pixPrice,
        stock: p.stock,
        sold: p.sold,
        isUnique: p.isUnique,
        isHandmade: p.isHandmade,
        isLimited: p.isLimited,
        sku: p.sku,
        deliveryDays: p.deliveryDays,
        createdAt: p.createdAt?.toISOString?.() ?? null,
        updatedAt: p.updatedAt?.toISOString?.() ?? null,
      };
    });

    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Erro GET products:", error);

    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}