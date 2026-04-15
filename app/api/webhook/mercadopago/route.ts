import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { OrderModel } from "@/app/server/db/models/Order";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // O Mercado Pago envia vários tipos de notificação, filtramos apenas pagamentos
    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: data.id });

    const status = paymentData.status;
    const orderId = paymentData.external_reference; // O ID que você enviou na Preference

    if (!orderId) {
      console.warn("Webhook recebido: Pagamento sem external_reference");
      return NextResponse.json({ received: true });
    }

    await connectDB();

    // Mapeamento de status para o seu Banco de Dados
    let dbStatus = "";

    if (status === 'approved') {
      dbStatus = "pago";
      console.log(`Pedido ${orderId}: Pagamento Aprovado!`);
    } 
    else if (status === 'refunded') {
      dbStatus = "estornado";
      console.log(`Pedido ${orderId}: Pagamento Estornado!`);
    }
    else if (status === 'cancelled') {
      dbStatus = "cancelado";
      console.log(`Pedido ${orderId}: Pagamento Cancelado!`);
    }

    // Se o status for um dos que queremos monitorar, atualizamos o banco
    if (dbStatus) {
      await OrderModel.findByIdAndUpdate(orderId, { status: dbStatus });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook MP:", error);
    // Retornamos 200/true mesmo no erro para o MP não ficar tentando reenviar infinitamente enquanto você debuga
    return NextResponse.json({ received: false }, { status: 200 });
  }
}