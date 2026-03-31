"use client";

import React from "react";
import { useCart } from "@/app/context/cart/CartContext";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const inputClass =
  "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 " +
  "outline-none focus:outline-none transition-all duration-150 " +
  "hover:border-zinc-400 " +
  "focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:bg-white";

const selectClass =
  "w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm bg-zinc-50 text-zinc-900 " +
  "appearance-none cursor-pointer outline-none focus:outline-none " +
  "transition-all duration-150 " +
  "hover:border-zinc-400 " +
  "focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:bg-white";

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

  const [paymentMethod, setPaymentMethod] = React.useState<"pix" | "card">("pix");
  const [installments, setInstallments] = React.useState(1);
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const finalTotal = paymentMethod === "pix" ? total * 0.9 : total;
  const getInstallmentValue = (n: number) => finalTotal / n;

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.cep) {
      alert("Preencha os campos obrigatórios");
      return;
    }
    const orderPayload = {
      customer: form,
      items: cartItems,
      total: finalTotal,
      paymentMethod,
      installments,
    };
    console.log("ORDER:", orderPayload);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600">
          Pedido realizado com sucesso 🎉
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base">
          Em breve você receberá mais detalhes por email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row gap-6 lg:gap-8">

      {/* RESUMO MOBILE */}
      <div className="w-full lg:hidden bg-white p-4 rounded-2xl shadow-sm border border-zinc-200">
        <h2 className="text-base font-semibold mb-3 text-zinc-800">Resumo do Pedido</h2>
        <div className="space-y-2 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <span className="line-clamp-1 text-zinc-600">{item.title}</span>
              <span className="shrink-0 font-medium text-zinc-800">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 my-3" />
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {paymentMethod === "pix" && (
          <div className="flex justify-between text-green-600 text-sm">
            <span>Desconto Pix</span>
            <span>-10%</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-zinc-900 mt-1">
          <span>Total Final</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-zinc-200 space-y-4">

        <div>
          <h2 className="text-base font-semibold text-zinc-800 mb-3">Dados do Cliente</h2>
          <div className="space-y-3">
            <input placeholder="Nome completo" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} />
            <input placeholder="Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} />
            <input placeholder="Telefone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-800 mb-3">Endereço de Entrega</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input placeholder="CEP" value={form.cep} onChange={(e) => handleChange("cep", e.target.value)} className={inputClass} />
              <button
                onClick={() => fetchAddressByCEP(form.cep)}
                className="shrink-0 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 rounded-xl text-sm font-medium transition-all duration-150 shadow-sm hover:shadow"
              >
                {loadingCep ? "..." : "Buscar"}
              </button>
            </div>

            <input placeholder="Rua" value={form.street} onChange={(e) => handleChange("street", e.target.value)} className={inputClass} />

            <div className="flex gap-2">
              <input placeholder="Número" value={form.number} onChange={(e) => handleChange("number", e.target.value)} className={`${inputClass} w-28`} />
              <input placeholder="Complemento" value={form.complement} onChange={(e) => handleChange("complement", e.target.value)} className={inputClass} />
            </div>

            <input placeholder="Bairro" value={form.neighborhood} onChange={(e) => handleChange("neighborhood", e.target.value)} className={inputClass} />

            <div className="flex gap-2">
              <input placeholder="Cidade" value={form.city} onChange={(e) => handleChange("city", e.target.value)} className={inputClass} />
              <input placeholder="UF" value={form.state} onChange={(e) => handleChange("state", e.target.value)} className={`${inputClass} w-20`} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-800 mb-3">Forma de Pagamento</h2>
          <div className="space-y-2">

            <button
              type="button"
              onClick={() => setPaymentMethod("pix")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-150 text-left ${
                paymentMethod === "pix"
                  ? "border-green-600 bg-green-50 ring-2 ring-green-600/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "pix" ? "border-green-600" : "border-zinc-300"
              }`}>
                {paymentMethod === "pix" && <span className="w-2 h-2 rounded-full bg-green-600" />}
              </span>
              <span className={paymentMethod === "pix" ? "text-zinc-900 font-medium" : "text-zinc-600"}>
                Pix
              </span>
              <span className="ml-auto text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                10% off
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-150 text-left ${
                paymentMethod === "card"
                  ? "border-green-600 bg-green-50 ring-2 ring-green-600/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "card" ? "border-green-600" : "border-zinc-300"
              }`}>
                {paymentMethod === "card" && <span className="w-2 h-2 rounded-full bg-green-600" />}
              </span>
              <span className={paymentMethod === "card" ? "text-zinc-900 font-medium" : "text-zinc-600"}>
                Cartão de Crédito
              </span>
            </button>

            {paymentMethod === "card" && (
              <div className="relative mt-1">
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className={selectClass}
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}x de {formatPrice(getInstallmentValue(n))}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 mt-2 shadow-sm hover:shadow-md"
        >
          Finalizar Pedido
        </button>
      </div>

      {/* RESUMO DESKTOP */}
      <div className="hidden lg:block w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 h-fit">
        <h2 className="text-base font-semibold text-zinc-800 mb-4">Resumo do Pedido</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2 text-zinc-600">
            <span className="line-clamp-1">{item.title}</span>
            <span className="shrink-0 font-medium text-zinc-800 ml-2">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
        <div className="border-t border-zinc-200 my-4" />
        <div className="flex justify-between text-sm text-zinc-600 mb-1">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        {paymentMethod === "pix" && (
          <div className="flex justify-between text-green-600 text-sm mb-1">
            <span>Desconto Pix</span>
            <span>-10%</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-zinc-900 mt-2">
          <span>Total Final</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

    </div>
  );
}