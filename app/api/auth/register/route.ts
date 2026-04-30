import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/server/db/connect";
import { UserModel } from "@/app/server/db/models/User";
import { OrderModel } from "@/app/server/db/models/Order";
import { signToken } from "@/app/server/auth/sign";

function createAuthResponse(token: string, message: string) {
  const response = NextResponse.json({ message });

  response.cookies.set("user_token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, address, orderId } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Dados obrigatórios" },
        { status: 400 }
      );
    }

    await connectDB();

    const emailNormalized = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({
      email: emailNormalized,
    });

    // ==============================
    // LOGIN (usuário já existe)
    // ==============================
    if (existingUser) {
      const isMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isMatch) {
        return NextResponse.json(
          { error: "Credenciais inválidas" },
          { status: 401 }
        );
      }

      const token = await signToken({
        sub: existingUser._id.toString(),
        email: existingUser.email,
        role: "user",
      });

      return createAuthResponse(
        token,
        "Login automático realizado"
      );
    }

    // ==============================
    // REGISTRO
    // ==============================
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email: emailNormalized,
      password: hashedPassword,
      address: address || {},
    });

    // vincular pedido
    if (orderId) {
      const order = await OrderModel.findById(orderId);

      if (order && !order.userId) {
        order.userId = user._id.toString();
        await order.save();
      }
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return createAuthResponse(
      token,
      "Conta criada com sucesso"
    );

  } catch (error) {
    console.error("Erro ao criar conta:", error);

    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}