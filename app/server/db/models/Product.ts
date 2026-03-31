import  { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String , required: true }],
    category: { type: String, required: true },
    description: { type: String },

    pixPrice: { type: Number },

    stock: { type: Number, required: true },
    sold: { type: Number, default: 0 },

    isUnique: { type: Boolean, default: false },
    isHandmade: { type: Boolean, default: false },
    isLimited: { type: Boolean, default: false },

    sku: { type: String },
    deliveryDays: { type: Number },
  },
  {
    timestamps: true, // 🔥 cria createdAt e updatedAt automático
  }
);

export const ProductModel =
  models.Product || model("Product", ProductSchema);