import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    address: {
      zipCode: { type: String, required: true },
      street: { type: String },
      number: { type: String },
      complement: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String },
    },

    items: [
      {
        productId: { type: String, required: true },
        sku: { type: String },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],

    // 💰 Subtotal dos produtos (sem frete)
    subtotal: { type: Number, required: true },

    // 🚚 Frete
    shipping: {
      price: { type: Number, required: true },
      method: { type: String },
    },

    // 💵 Total final (subtotal + frete)
    total: { type: Number, required: true },

    // 💳 Método de pagamento
    paymentMethod: {
      type: String,
      enum: ["pix", "card"],
      required: true,
    },

    // 🔢 Parcelas (relevante apenas para cartão)
    installments: {
      type: Number,
      default: 1,
    },

    // 📦 Status do pedido
    status: {
      type: String,
      enum: ["pendente", "pago", "enviado", "entregue", "cancelado", "estornado"],
      default: "pendente",
    },

    // 💳 Futuro (Mercado Pago, etc)
    paymentId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = models.Order || model("Order", OrderSchema);