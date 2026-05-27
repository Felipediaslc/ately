import { NextResponse } from "next/server";
import mongoose from "mongoose";

import {connectDB} from "@/app/server/db/connect";
import {OrderModel} from "@/app/server/db/models/Order";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type OrderIt = {
    title?: string;
    description?: string;
    image?: string; 
    price?: number; 
    quantity?: number   
    }



export async function GET(_: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: order.status,
      number: order._id,
      createdAt: new Date(order.createdAt).toLocaleDateString("pt-BR"),
      items: order.items.map((item:OrderIt ) => ({
        name: item.title || "Produto",
        description: item.description || "Produto do pedido",
        imageUrl: item.image || "",
        total: (item.price || 0) * (item.quantity || 1),
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);

    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}