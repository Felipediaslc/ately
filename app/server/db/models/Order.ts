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
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pendente", "pago", "enviado"],
      default: "pendente",
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = models.Order || model("Order", OrderSchema);