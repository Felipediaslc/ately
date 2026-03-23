"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/cart/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  MapPin,
  Loader2,
  CheckCircle2,
  Truck,
} from "lucide-react";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

// Valor mínimo para frete grátis — ajuste conforme sua regra de negócio
const FREE_SHIPPING_THRESHOLD = 200;

//  Substitua pela sua API real de frete (ex: Melhor Envio, Correios)
async function fetchShippingOptions(
  cep: string
): Promise<{ label: string; price: number; days: string }[]> {
  await new Promise((r) => setTimeout(r, 1400));
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length !== 8) throw new Error("CEP inválido");
  return [
    { label: "PAC", price: 18.9, days: "5 a 8 dias úteis" },
    { label: "SEDEX", price: 32.5, days: "1 a 3 dias úteis" },
  ];
}

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    total,
    clearCart,
    isLoaded,
  } = useCart();

  // Estados de frete
  const [cep, setCep] = React.useState("");
  const [cepState, setCepState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [shippingOptions, setShippingOptions] = React.useState<
    { label: string; price: number; days: string }[]
  >([]);
  const [selectedShipping, setSelectedShipping] = React.useState<number | null>(null);

  const hasFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = hasFreeShipping
    ? 0
    : selectedShipping !== null
    ? (shippingOptions[selectedShipping]?.price ?? 0)
    : 0;
  const grandTotal = total + shippingCost;

  const missingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    const formatted = val.length > 5 ? `${val.slice(0, 5)}-${val.slice(5)}` : val;
    setCep(formatted);
    if (cepState !== "idle") {
      setCepState("idle");
      setShippingOptions([]);
      setSelectedShipping(null);
    }
  };

  const handleCalculate = async () => {
    if (cepState === "loading") return;
    setCepState("loading");
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const options = await fetchShippingOptions(cep);
      setShippingOptions(options);
      setSelectedShipping(0);
      setCepState("done");
    } catch {
      setCepState("error");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingCart size={48} className="text-gray-300" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Seu carrinho está vazio!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs">
          Adicione produtos e volte aqui para finalizar sua compra.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Meu Carrinho
      </h1>

      {/* INDICADOR DE FRETE GRÁTIS */}
      <div className="mb-6 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
        {hasFreeShipping ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={18} className="shrink-0" />
            <span className="text-sm font-semibold">
              Parabéns! Você ganhou <strong>frete grátis</strong> neste pedido 🎉
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Truck size={17} className="shrink-0" />
              <span className="text-sm">
                Faltam{" "}
                <strong className="text-green-600">{formatPrice(missingForFree)}</strong>{" "}
                para você ganhar <strong>frete grátis</strong>!
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

        {/* LISTA DE ITENS */}
        <div className="w-full flex-1 flex flex-col gap-4">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* IMAGEM */}
              <div className="shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover w-[72px] h-[72px] sm:w-[96px] sm:h-[96px]"
                />
              </div>

              {/* INFO + CONTROLES */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {formatPrice(item.price)}
                </p>

                {/* LINHA: quantidade + subtotal + lixeira */}
                <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                  {/* QUANTIDADE */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[28px] text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* SUBTOTAL + LIXEIRA */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 leading-none mb-0.5">
                        Subtotal
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-800 hover:text-gray-600 transition p-1"
                      aria-label="Remover item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* LIMPAR CARRINHO */}
          <button
            onClick={clearCart}
            className="mt-2 w-full sm:w-auto self-start bg-gray-100 text-gray-600 text-sm px-6 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Limpar Carrinho
          </button>
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full lg:w-[360px] lg:sticky lg:top-6 flex flex-col gap-4">

          {/* CALCULAR FRETE */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-green-600 shrink-0" />
              <h3 className="text-sm font-semibold text-gray-700">Calcular frete</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
                maxLength={9}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 transition"
              />
              <button
                onClick={handleCalculate}
                disabled={cep.replace(/\D/g, "").length !== 8 || cepState === "loading"}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                {cepState === "loading" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  "Calcular"
                )}
              </button>
            </div>

            {cepState === "error" && (
              <p className="text-xs text-red-500 mt-2">
                CEP não encontrado. Verifique e tente novamente.
              </p>
            )}

            {/* OPÇÕES DE ENTREGA */}
            {cepState === "done" && (
              <div className="mt-3 flex flex-col gap-2">
                {hasFreeShipping ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-3 py-2.5">
                    <CheckCircle2 size={15} />
                    <span className="text-xs font-semibold">Frete grátis aplicado!</span>
                  </div>
                ) : (
                  shippingOptions.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center justify-between gap-3 border rounded-xl px-3 py-2.5 cursor-pointer transition ${
                        selectedShipping === idx
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping === idx}
                          onChange={() => setSelectedShipping(idx)}
                          className="accent-green-600"
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.days}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-800 shrink-0">
                        {formatPrice(opt.price)}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RESUMO DO PEDIDO */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-5">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete</span>
                <span>
                  {hasFreeShipping ? (
                    <span className="text-green-600 font-semibold">Grátis</span>
                  ) : cepState === "done" && selectedShipping !== null ? (
                    formatPrice(shippingCost)
                  ) : (
                    <span className="text-gray-400 italic text-xs">calcule acima</span>
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="flex justify-between text-base font-bold mb-6">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold text-sm shadow hover:shadow-md transition-all">
              Finalizar Compra
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
