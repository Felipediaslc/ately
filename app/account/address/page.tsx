import { redirect } from "next/navigation";
import { getUser } from "@/app/server/auth/getUser";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { AddressForm } from "./AddressForm";

export default async function AddressPage() {
  const user = await getUser();

  if (!user) redirect("/");

  await connectDB();

  // 🔥 busca último pedido
  const lastOrder = await OrderModel.findOne({
    userId: user._id.toString(),
  })
    .sort({ createdAt: -1 })
    .lean();

  // 🔥 decide fonte do endereço
  const address = user.address?.zipCode
    ? user.address
    : lastOrder?.address || null;

  const isFromOrder = !user.address?.zipCode && !!lastOrder?.address;

  // 🔥 limpa dados (remove qualquer "Selecionar")
  const safeAddress = {
    street: address?.street || "",
    number: address?.number || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city?.toLowerCase?.().includes("selecion")
  ? ""
  : address?.city?.trim() || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Endereço</h1>
        <p className="text-sm text-gray-500">
          Gerencie seu endereço de entrega
        </p>
      </div>

      {/* 🔥 HINT */}
      {isFromOrder && (
        <p className="text-xs text-gray-400">
          Preenchido com base no seu último pedido
        </p>
      )}

      {/* FORM */}
      <AddressForm defaultValues={safeAddress} />
    </div>
  );
}