import { cookies } from "next/headers";
import { verifyToken } from "./verify";
import { connectDB } from "../db/connect";
import { UserModel } from "../db/models/User";

export async function getUser() {
const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.userId) return null;
 
  await connectDB();

  const user = await UserModel.findById(payload.userId).lean();

  return user || null;
}