import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/server/db/connect";
import { AdminModel } from "@/app/server/db/models/Admin";

export async function GET() {
  await connectDB();

  const hash = await bcrypt.hash("123456", 10);

  await AdminModel.deleteMany({}); // 👈 limpa tudo

  await AdminModel.create({
    email: "admin@diascode.com",
    password: hash,
    role: "admin",
  });

  return NextResponse.json({
    message: "Admin recriado",
  });
}
