import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { ProductModel } from "@/app/server/db/models/Product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  await connectDB();

  const products = await ProductModel.find({
    title: { $regex: q, $options: "i" },
  })
    .limit(10)
    .select("title price images slug");

  return NextResponse.json({ results: products });
}