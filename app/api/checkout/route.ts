import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shipping, customer, orderId, paymentMethod, installments } = body;

    const preference = new Preference(client);

    type CheckoutItem = {
      productId: string;
      title: string;
      price: number;
      quantity: number;
    };

    // Lógica corrigida para evitar conflito de exclusão
    let paymentMethodsConfig = {};

    if (paymentMethod === "pix") {
      paymentMethodsConfig = {
        default_payment_method_id: "pix",
        excluded_payment_types: [
          { id: "ticket" },
          { id: "credit_card" },
          { id: "debit_card" }
        ],
        installments: 1,
      };
    } else {
      // Caso seja cartão (card)
      paymentMethodsConfig = {
        // 'account_money' é o saldo MP, 'bank_transfer' é o Pix
        excluded_payment_types: [
          { id: "ticket" }, 
          { id: "bank_transfer" }
        ],
        installments: installments || 1,
      };
    }

    const result = await preference.create({
      body: {
        items: items.map((item: CheckoutItem) => ({
          id: item.productId,
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
  success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/aguardando?orderId=${orderId}`,
  pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/aguardando?orderId=${orderId}`,
  failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedido/falha`,
},
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mercadopago`,
        payment_methods: paymentMethodsConfig,
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