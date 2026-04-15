"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
import { getShipping } from "@/app/lib/shipping";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const FREE_SHIPPING_THRESHOLD = 200;

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    total,
    clearCart,
    isLoaded,
  } = useCart();

  const [cep, setCep] = React.useState("");
  const [cepState, setCepState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [shippingOptions, setShippingOptions] = React.useState<Array<{ label: string; price: number; days: string }>>([]);
  const [selectedShipping, setSelectedShipping] = React.useState<number | null>(null);
  const [shippingLocation, setShippingLocation] = React.useState("");

  const hasFreeShipping = total >= FREE_SHIPPING_THRESHOLD;

  const shippingCost = hasFreeShipping
    ? 0
    : selectedShipping !== null
    ? shippingOptions[selectedShipping]?.price ?? 0
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
      setShippingLocation("");
    }

    if (val.length === 8) {
      handleCalculate(formatted);
    }
  };

  const handleCalculate = async (cepValue?: string) => {
    if (cepState === "loading") return;

    const targetCep = cepValue || cep;

    setCepState("loading");
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingLocation("");

    const result = await getShipping(targetCep);

    if ("error" in result) {
      setCepState("error");
      return;
    }

    setShippingOptions([
      {
        label: result.label,
        price: result.price,
        days: "1 a 2 dias úteis",
      },
    ]);

    setSelectedShipping(0);
    setShippingLocation(`${result.neighborhood} - ${result.city} / ${result.state}`);
    setCepState("done");
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
      <h1 className="text-gray-600 text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
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
              <div className="shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-xl w-[72px] h-[72px] sm:w-[96px] sm:h-[96px]"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {formatPrice(item.price)}
                </p>

                {item.installment && (
                  <p className="text-xs text-gray-500">{item.installment}</p>
                )}
                {item.pixPrice && (
                  <p className="text-xs text-green-600 font-medium">
                    {formatPrice(item.pixPrice)} com Pix
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[28px] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    {/* Lixeira com área de toque maior para mobile */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Limpar carrinho: discreto, sem destaque visual */}
          <button
            onClick={clearCart}
            className="mt-2 w-auto text-gray-400 text-sm underline underline-offset-4 hover:text-gray-600 transition-colors self-start"
          >
            Limpar Carrinho
          </button>
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full lg:w-[360px] flex flex-col gap-4">

          {/* CEP */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-700">Calcular frete</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={handleCepChange}
                disabled={cepState === "loading"}
                maxLength={9}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleCalculate()}
                disabled={cep.replace(/\D/g, "").length !== 8 || cepState === "loading"}
                className="bg-green-600 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-1.5"
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
                Ainda não entregamos nessa região
              </p>
            )}

            {cepState === "done" && (
              <>
                {/* Apenas prazo + valor, sem nome da modalidade */}
                <div className="mt-3 flex flex-col gap-2">
                  {shippingOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border border-gray-100 rounded-xl px-3 py-2"
                    >
                      <span className="text-xs text-gray-500">{opt.days}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatPrice(opt.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Entrega para <strong>{shippingLocation}</strong>
                </p>
              </>
            )}
          </div>

          {/* RESUMO COM BREAKDOWN */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Frete</span>
              <span>
                {hasFreeShipping
                  ? "Grátis"
                  : selectedShipping !== null
                  ? formatPrice(shippingCost)
                  : "—"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <Link
  href={{
    pathname: "/checkout",
    query: {
      shippingPrice: shippingCost,
      shippingLabel: shippingOptions[selectedShipping ?? 0]?.label || "",
    },
  }}
>
  <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl">
    Finalizar Compra
  </button>
</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
