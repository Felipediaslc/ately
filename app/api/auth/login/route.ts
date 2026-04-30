import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/server/db/connect";
import { UserModel } from "@/app/server/db/models/User";
import { signToken } from "@/app/server/auth/sign";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
if (!email || !password) {
  return NextResponse.json(
    { error: "Missing credentials" },
    { status: 400 }
  );
}
    await connectDB();

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      role: "user",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}