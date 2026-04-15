import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { OrderModel } from "@/app/server/db/models/Order";
import { ProductModel } from "@/app/server/db/models/Product"; // ajusta o caminho se precisar

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      customer,
      address,
      items,
      subtotal,
      shipping,
      paymentMethod,
      installments,
    } = body;

    const isEmpty = (v: unknown) =>
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "");

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !address?.zipCode ||
      !items?.length ||
      isEmpty(subtotal) ||
      shipping?.price == null ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // ✅ CORREÇÃO 2 — Idempotência
    // Bloqueia pedido duplicado do mesmo email nos últimos 30 segundos
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentOrder = await OrderModel.findOne({
      "customer.email": customer.email,
      createdAt: { $gte: thirtySecondsAgo },
    });

    if (recentOrder) {
      return NextResponse.json(
        { error: "Pedido duplicado. Aguarde alguns segundos." },
        { status: 429 }
      );
    }

    // ✅ CORREÇÃO 3 — Recalcular total no backend (fonte única de verdade)
    // Busca os preços reais dos produtos no banco, ignora o que veio do front
  




   const productSkus = items.map((i: { sku: string }) => i.sku).filter(Boolean);
const products = await ProductModel.find({ sku: { $in: productSkus } });

const recalculatedSubtotal = items.reduce(
  (sum: number, item: { sku: string; quantity: number }) => {
    const product = products.find((p) => p.sku === item.sku);



        if (!product) return sum;

        const price =
          paymentMethod === "pix" && product.pixPrice
            ? product.pixPrice
            : product.price;

        return sum + price * item.quantity;
      },
      0
    );

    const recalculatedTotal = recalculatedSubtotal + shipping.price;

    const order = await OrderModel.create({
      customer,
      address,
      items,
      subtotal: recalculatedSubtotal, // ✅ sempre do banco
      shipping,
      total: recalculatedTotal,       // ✅ sempre do banco
      paymentMethod,
      installments,
      status: "pendente",
    });

    return NextResponse.json(
      { success: true, orderId: order._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    return NextResponse.json(
      { error: "Erro interno ao criar pedido" },
      { status: 500 }
    );
  }
}