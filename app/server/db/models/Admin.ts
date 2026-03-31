import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hash bcrypt
  },
  {
    timestamps: true,
  }
);

export const AdminModel = models.Admin || model("Admin", AdminSchema);