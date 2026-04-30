import { NextResponse } from "next/server";
import { connectDB } from "@/app/server/db/connect";
import { getUser } from "@/app/server/auth/getUser";
import { UserModel } from "@/app/server/db/models/User";

export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const { street, number, neighborhood, city, state, zipCode } = body;

    await connectDB();

    await UserModel.findByIdAndUpdate(user._id, {
      address: {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
      },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Erro ao salvar endereço" }, { status: 500 });
  }
}