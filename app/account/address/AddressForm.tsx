"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  defaultValues: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export function AddressForm({ defaultValues }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    await fetch("/api/account/address", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    // 🔥 atualiza tudo
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input name="street" defaultValue={defaultValues.street} placeholder="Rua"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <input name="number" defaultValue={defaultValues.number} placeholder="Número"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <input name="neighborhood" defaultValue={defaultValues.neighborhood} placeholder="Bairro"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <input name="city" defaultValue={defaultValues.city} placeholder="Cidade"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <input name="state" defaultValue={defaultValues.state} placeholder="Estado"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <input name="zipCode" defaultValue={defaultValues.zipCode} placeholder="CEP"
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium"
      >
        {loading ? "Salvando..." : "Salvar endereço"}
      </button>
    </form>
  );
}