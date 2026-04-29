import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { OrderModel } from "@/app/server/db/models/Order";
import { ProductModel } from "@/app/server/db/models/Product";
import { getUser } from "@/app/server/auth/getUser";

// 🔌 conexão
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

// 🔹 types
type ItemInput = {
  productId: string;
  quantity: number;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
};

type Address = {
  zipCode: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
};

type Body = {
  customer: Customer;
  address: Address;
  items: ItemInput[];
  shipping: {
    price: number;
    method?: string;
  };
  paymentMethod: "pix" | "card";
  installments?: number;
};

export async function POST(req: Request) {
  try {
    await connectDB();
const user = await getUser();
    const body: Body = await req.json();

    const {
      customer,
      address,
      items,
      shipping,
      paymentMethod,
      installments,
    } = body;

    // 🔐 normalização
    const email = customer.email?.toLowerCase().trim();

    // 🔐 validação base
    if (
      !customer.name ||
      !email ||
      !customer.phone ||
      !address.zipCode ||
      !Array.isArray(items) ||
      items.length === 0 ||
      shipping?.price == null ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // 🔐 valida itens
    for (const item of items) {
      if (!item.productId || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Item inválido" },
          { status: 400 }
        );
      }
    }

    // 🛑 idempotência simples
    const recentOrder = await OrderModel.findOne({
      "customer.email": email,
      createdAt: {
        $gte: new Date(Date.now() - 30 * 1000),
      },
    });

    if (recentOrder) {
      return NextResponse.json(
        { error: "Pedido duplicado. Aguarde alguns segundos." },
        { status: 429 }
      );
    }

    // 🔍 buscar produtos
    const productIds = items.map((i) => i.productId);

    const products = await ProductModel.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    // 💣 build seguro do pedido
    let subtotal = 0;

    const itemsWithData = items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`Produto não encontrado: ${item.productId}`);
      }

      const price =
        paymentMethod === "pix" && product.pixPrice != null
          ? product.pixPrice
          : product.price;

      const numericPrice = Number(price);
      const quantity = Number(item.quantity);

      if (isNaN(numericPrice) || isNaN(quantity)) {
        throw new Error(`Valor inválido no produto ${item.productId}`);
      }

      subtotal += numericPrice * quantity;

      return {
        productId: product._id.toString(),
        title: product.title,
        price: numericPrice,
        quantity,
        image: product.images?.[0] ?? null,
      };
    });

    // 🚚 frete seguro
    const shippingPrice = Number(shipping.price || 0);

    // 💰 total final (server-side authority)
    const total = subtotal + shippingPrice;

    // 💾 salvar pedido
    const order = await OrderModel.create({
      customer: {
        ...customer,
        email,
      },
      address,
      items: itemsWithData,
      subtotal,
      shipping: {
        price: shippingPrice,
        method: shipping.method || "Entrega",
      },
      total,
      paymentMethod,
      installments: installments ?? 1,
      status: "pendente",
      createdAt: new Date(),
      // 👇 AQUI É A CONEXÃO
  userId: user ? user._id.toString() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order._id.toString(),
      },
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