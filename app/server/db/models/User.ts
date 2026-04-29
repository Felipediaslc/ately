import mongoose, { Schema, models } from "mongoose";

const AddressSchema = new Schema(
  {
    zipCode: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: AddressSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//garantia extra de índice
UserSchema.index({ email: 1 }, { unique: true })

export const UserModel =
  models.User || mongoose.model("User", UserSchema);