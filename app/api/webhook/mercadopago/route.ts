import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { OrderModel } from "@/app/server/db/models/Order";
import { emailTemplate, emailAdminTemplate } from "@/app/lib/email/template";
import { connectDB } from "@/app/server/db/connect";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { type, data } = body;

    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: data.id });

    const status = paymentData.status;
    const orderId = paymentData.external_reference;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json({ received: true });
    }

    // 🔄 status mapping
    let dbStatus = "";

    if (status === "approved") dbStatus = "pago";
    if (status === "refunded") dbStatus = "estornado";
    if (status === "cancelled") dbStatus = "cancelado";

    if (dbStatus && order.status !== dbStatus) {
      await OrderModel.findByIdAndUpdate(orderId, { status: dbStatus });
    }

    // ✉️ EMAILS SOMENTE SE APROVADO
    if (status === "approved") {
      // 👇 CRIA RESEND AQUI (SAFE)
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const totalFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(order.total);

      const formattedItems = order.items
        .map(
          (item: OrderItem) =>
            `${item.title} x${item.quantity} — R$ ${item.price}<br/>`
        )
        .join("");

      const endereco = `
${order.address.street}, ${order.address.number}
${order.address.neighborhood}
${order.address.city} - ${order.address.state}
`;

      // CLIENTE
      if (!order.emailClientSent) {
        await resend.emails.send({
          from: "SD Ateliê <onboarding@resend.dev>",
          to: order.customer.email,
          subject: "Seu pedido foi confirmado 💚",
          html: emailTemplate({
            nome: order.customer.name,
            pedidoId: order._id.toString(),
            lista_de_produtos: formattedItems,
            pagamento: order.paymentMethod === "pix" ? "PIX" : "Cartão",
            total: totalFormatado,
            endereco,
            contato: "sdatelie.religioso@gmail.com",
          }),
        });

        await OrderModel.findByIdAndUpdate(orderId, {
          emailClientSent: true,
        });
      }

      // ADMIN
      if (!order.emailAdminSent) {
        await resend.emails.send({
          from: "SD Ateliê <onboarding@resend.dev>",
          to: "SEU_EMAIL_AQUI@gmail.com",
          subject: `Novo pedido pago - ${order._id}`,
          html: emailAdminTemplate({
            nome: order.customer.name,
            pedidoId: order._id.toString(),
            lista_de_produtos: formattedItems,
            pagamento: order.paymentMethod === "pix" ? "PIX" : "Cartão",
            total: totalFormatado,
            endereco,
          }),
        });

        await OrderModel.findByIdAndUpdate(orderId, {
          emailAdminSent: true,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook MP:", error);
    return NextResponse.json({ received: true });
  }
}