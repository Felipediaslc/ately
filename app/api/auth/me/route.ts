import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/server/auth/verify";
import { connectDB } from "@/app/server/db/connect";
import { UserModel } from "@/app/server/db/models/User";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(token);

    if (!payload?.sub) {
      return NextResponse.json({ user: null });
    }

    const user = await UserModel.findById(payload.sub).lean();

    return NextResponse.json({
      user: user
        ? {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}