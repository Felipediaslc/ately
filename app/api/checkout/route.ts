import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Adicionado 'installments' na captura dos dados
    const { items, shipping, customer, orderId, paymentMethod, installments } = body;

    const preference = new Preference(client);

    type CheckoutItem = {
      title: string;
      price: number;
      quantity: number;
    };

    const result = await preference.create({
      body: {
        items: items.map((item: CheckoutItem) => ({
          id: item.title,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "BRL",
        })),
        shipments: {
          cost: shipping.price,
          mode: "not_specified",
        },
        payer: {
          name: customer.name,
          email: customer.email,
        },
        external_reference: orderId,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/pendente`,
        },

        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mercadopago`,
        payment_methods: {
          excluded_payment_types: [
            { id: "ticket" } // Remove boleto
          ],
          // Define o máximo de parcelas permitido para esta transação
          installments: installments || 1,
          // Se for Pix, já abre a tela do Pix direto
          default_payment_method_id: paymentMethod === "pix" ? "pix" : undefined,
        },
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência MP:", error);
    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento" },
      { status: 500 }
    );
  }
}