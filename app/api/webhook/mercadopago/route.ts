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

    // ✅ só processa pagamento
    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    // ✅ segurança básica
    if (!data?.id) {
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

    // ✅ mapping completo de status
    let dbStatus = "";

    if (status === "approved") dbStatus = "pago";
    if (status === "pending") dbStatus = "pendente";
    if (status === "refunded") dbStatus = "estornado";
    if (status === "cancelled") dbStatus = "cancelado";

    // ✅ update seguro (idempotente)
    if (dbStatus && order.status !== dbStatus) {
      order.status = dbStatus;
      await order.save();
    }

    // ✉️ EMAILS (somente aprovado)
    if (status === "approved") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const format = (v: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(v);

      const totalFormatado = format(order.total);

      const formattedItems = order.items
        .map(
          (item: OrderItem) =>
            `${item.title} x${item.quantity} — ${format(item.price)}<br/>`
        )
        .join("");

      const endereco = `
${order.address.street}, ${order.address.number}
${order.address.neighborhood}
${order.address.city} - ${order.address.state}
`;

      // 📩 CLIENTE
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

        order.emailClientSent = true;
        await order.save();
      }

      // 📩 ADMIN
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

        order.emailAdminSent = true;
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook MP:", error);
    return NextResponse.json({ received: true });
  }
}