"use client";

import React from "react";
import { useCart } from "@/app/context/cart/CartContext";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [loadingCep, setLoadingCep] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 🔥 VIA CEP REAL
  const fetchAddressByCEP = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, "");

    if (cleaned.length !== 8) return;

    setLoadingCep(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error("CEP inválido");

      setForm((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
    } catch {
      alert("CEP inválido ou não encontrado");
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.cep) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-3xl font-bold text-green-600">
          Pedido realizado com sucesso 🎉
        </h1>
        <p className="text-gray-500">
          Em breve você receberá mais detalhes por email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

      {/* FORMULÁRIO */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md space-y-4">

        <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>

        <input
          placeholder="Nome completo"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        {/* CEP */}
        <div className="flex gap-2">
          <input
            placeholder="CEP"
            value={form.cep}
            onChange={(e) => handleChange("cep", e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            onClick={() => fetchAddressByCEP(form.cep)}
            className="bg-green-600 text-white px-4 rounded-xl"
          >
            {loadingCep ? "..." : "Buscar"}
          </button>
        </div>

        {/* ENDEREÇO */}
        <input
          placeholder="Rua"
          value={form.street}
          onChange={(e) => handleChange("street", e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        {/* Número + Complemento */}
        <div className="flex gap-2">
          <input
            placeholder="Número"
            value={form.number}
            onChange={(e) => handleChange("number", e.target.value)}
            className="w-28 border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Complemento (opcional)"
            value={form.complement}
            onChange={(e) => handleChange("complement", e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3"
          />
        </div>

        <input
          placeholder="Bairro"
          value={form.neighborhood}
          onChange={(e) => handleChange("neighborhood", e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        />

        <div className="flex gap-2">
          <input
            placeholder="Cidade"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Estado"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="w-24 border rounded-xl px-4 py-3"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold mt-4"
        >
          Finalizar Pedido
        </button>
      </div>

      {/* RESUMO */}
      <div className="w-full lg:w-[350px] bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

        <div className="space-y-3 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.title}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t my-4" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}