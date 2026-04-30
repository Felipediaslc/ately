import { cookies } from "next/headers";
import { verifyToken } from "@/app/server/auth/sign";
import { connectDB } from "../db/connect";
import { UserModel } from "../db/models/User";

export async function getUser() {
  const cookieStore = await cookies();

  // ✔ CORRETO: auth_token (não user_token)
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  // ✔ CORRETO: sub (não userId)
  if (!payload || !payload.sub) return null;

  await connectDB();

  const user = await UserModel.findById(payload.sub).lean();

  return user || null;
}