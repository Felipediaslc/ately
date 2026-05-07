import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import { OrderModel } from "@/app/server/db/models/Order";
import { ProductModel } from "@/app/server/db/models/Product";
import { getUser } from "@/app/server/auth/getUser";

// 🔌 DB CONNECTION
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

// 🛡️ SCHEMA
const OrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),

  address: z.object({
    zipCode: z.string().min(1),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }),

  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),

  shipping: z.object({
    price: z.number().min(0),
    method: z.string().optional(),
  }),

  paymentMethod: z.enum(["pix", "card"]),

  installments: z.number().int().positive().optional(),
});

type OrderInput = z.infer<typeof OrderSchema>;

// 🔥 helper: valida ObjectId
const isObjectId = (id: string) =>
  /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getUser();

    const raw = await req.json();

    console.log("RAW BODY:", JSON.stringify(raw, null, 2));

    const parsed = OrderSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Payload inválido",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const body: OrderInput = parsed.data;

    // ============================
    // 🔥 ANTI-DUPLICATE ORDER
    // ============================
    const email = body.customer.email.toLowerCase().trim();

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

    // ============================
    // 🔥 PRODUCT IDS (FIX REAL)
    // ============================
    const productIds = body.items.map((i) => i.productId);

    const validProductIds = productIds.filter(isObjectId);

    if (validProductIds.length === 0) {
      return NextResponse.json(
        { error: "Nenhum productId válido (ObjectId)" },
        { status: 400 }
      );
    }

    // ============================
    // 🔥 FIND PRODUCTS
    // ============================
    const products = await ProductModel.find({
      _id: { $in: validProductIds },
    });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    let subtotal = 0;

    // ============================
    // 🔥 BUILD ITEMS
    // ============================
    const itemsWithData = body.items
      .map((item) => {
        const product = productMap.get(item.productId);

        if (!product) return null;

        const price =
          body.paymentMethod === "pix" && product.pixPrice != null
            ? product.pixPrice
            : product.price;

        subtotal += Number(price) * item.quantity;

        return {
          productId: product._id.toString(),
          title: product.title,
          price: Number(price),
          quantity: item.quantity,
          image: product.images?.[0] ?? null,
        };
      })
      .filter(Boolean);

    // ============================
    // SHIPPING / TOTAL
    // ============================
    const shippingPrice = Number(body.shipping.price || 0);
    const total = subtotal + shippingPrice;

    // ============================
    // ADDRESS VALIDATION
    // ============================
    const city = body.address.city?.trim();
    const state = body.address.state?.trim();
    const country = body.address.country?.trim();

    if (!city || city === "Selecionar") {
      return NextResponse.json(
        { error: "Cidade inválida" },
        { status: 400 }
      );
    }

    if (!state || state === "Selecionar") {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    const safeAddress = {
      zipCode: body.address.zipCode,
      street: body.address.street?.trim() || "",
      number: body.address.number?.trim() || "",
      complement: body.address.complement?.trim() || "",
      neighborhood: body.address.neighborhood?.trim() || "",
      city,
      state,
      country: country || "BR",
    };

    // ============================
    // CREATE ORDER
    // ============================
    const order = await OrderModel.create({
      customer: {
        ...body.customer,
        email,
      },
      address: safeAddress,
      items: itemsWithData,
      subtotal,
      shipping: {
        price: shippingPrice,
        method: body.shipping.method || "Entrega",
      },
      total,
      paymentMethod: body.paymentMethod,
      installments: body.installments ?? 1,
      status: "pendente",
      createdAt: new Date(),
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