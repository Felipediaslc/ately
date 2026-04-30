import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/server/db/connect";
import { AdminModel } from "@/app/server/db/models/Admin";
import { signToken } from "@/app/server/auth/sign";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }
    await connectDB();

    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, admin.password);

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await signToken({
      sub: admin._id.toString(),
      email: admin.email,
      role: "admin",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
