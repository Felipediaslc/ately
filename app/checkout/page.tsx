"use client";
import { Suspense } from "react";
import React from "react";
import { useCart } from "@/app/context/cart/CartContext";
import { useSearchParams,  useRouter } from "next/navigation";




const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const inputCls =
  "block w-full bg-white px-4 py-[11px] text-sm text-zinc-900 placeholder:text-zinc-400 " +
  "rounded-[14px] outline-none transition-all duration-200 " +
  "border-[1.5px] border-zinc-200 hover:border-zinc-300 " +
  "focus:border-green-500 focus:ring-[3px] focus:ring-green-500/15 focus:bg-[#f9fefb] " +
  "[&[data-filled=true]]:border-zinc-200 [&[data-filled=true]]:bg-green-50/60";

const selectCls =
  "block w-full bg-white px-4 py-[11px] text-sm text-zinc-900 appearance-none " +
  "rounded-[14px] outline-none transition-all duration-200 " +
  "border-[1.5px] border-green-900 hover:border-zinc-300 " +
  "focus:border-zinc-500 focus:ring-[3px] focus:ring-green-500/15";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <p className="text-[10px] tracking-[0.14em] text-zinc-600 font-bold uppercase whitespace-nowrap">
        {children}
      </p>
      <div className="flex-1 h-px bg-zinc-300" />
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      data-filled={value.trim().length > 0 ? "true" : "false"}
      className={inputCls}
    />
  );
}

function CheckoutContent() {
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();
const router = useRouter();
  const shippingPrice = Number(searchParams.get("shippingPrice") || 0);
  const shippingMethod = searchParams.get("shippingLabel") || "Entrega padrão";

  const shipping = {
    price: shippingPrice,
    method: shippingMethod,
  };

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
    country: "Brasil",
  });

  const [paymentMethod, setPaymentMethod] =
    React.useState<"pix" | "card">("pix");
  const [installments, setInstallments] = React.useState(1);
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [cepStatus, setCepStatus] = React.useState<"" | "ok" | "error">("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCepInput = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    set("cep", d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
    setCepStatus("");
  };

  const fetchCEP = async () => {
    const cleaned = form.cep.replace(/\D/g, "");
    if (cleaned.length !== 8) {
      setCepStatus("error");
      return;
    }

    setLoadingCep(true);
    setCepStatus("");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error();

      setForm((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));

      setCepStatus("ok");
    } catch {
      setCepStatus("error");
    } finally {
      setLoadingCep(false);
    }
  };

  const totalNormal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPix = cartItems.reduce(
    (s, i) => s + (i.pixPrice ?? i.price) * i.quantity,
    0
  );

  const finalProductsTotal = paymentMethod === "pix" ? totalPix : totalNormal;
  const finalTotal = finalProductsTotal + shipping.price;
  const economy = totalNormal - totalPix;
  const canInstall = finalTotal >= 80;

  // ✅ HANDLESUBMIT CORRIGIDO
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.cep) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);

      const customer = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };

      const address = {
  zipCode: form.cep,
  street: form.street,
  number: form.number,
  complement: form.complement,
  neighborhood: form.neighborhood,

  city: form.city?.trim() || "",
  state: form.state?.trim() || "",
  country: form.country,
};

      // ✅ Payload limpo para o Zod/MongoDB — só productId e quantity
      const itemsForOrder = cartItems.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      }));

      // ✅ Payload rico para o Mercado Pago — title e price necessários
      const itemsForCheckout = cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: Number(item.quantity),
        price:
          paymentMethod === "pix" ? (item.pixPrice ?? item.price) : item.price,
      }));

      // ✅ shipping.price garantido como number
      const shippingPayload = {
        price: Number(shipping.price),
        method: shipping.method,
      };

      // 1️⃣ Cria o pedido no MongoDB
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          address,
          items: itemsForOrder,
          shipping: shippingPayload,
          paymentMethod,
          installments,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        console.error("Erro /api/orders:", orderData);
        alert("Erro ao criar pedido");
        return;
      }

      const orderId = orderData.orderId;

      // 2️⃣ Cria a preferência no Mercado Pago
      const mpRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsForCheckout,
          shipping: shippingPayload,
          customer,
          orderId,
          paymentMethod,
          installments,
        }),
      });

      const mpData = await mpRes.json();

      if (!mpRes.ok) {
        console.error("Erro /api/checkout:", mpData);
        alert("Erro ao processar pagamento");
        return;
      }

      clearCart();
    window.open(`/pedido/aguardando?orderId=${orderId}`, "_blank");
    window.location.href = mpData.url;
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro ao finalizar pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* ── FORMULÁRIO ── */}
      <div className="flex-1 min-w-0 space-y-8">
        {/* CLIENTE */}
        <section>
          <SectionLabel>Dados do Cliente</SectionLabel>
          <div className="space-y-3">
            <Input
              placeholder="Nome completo"
              value={form.name}
              onChange={(v) => set("name", v)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(v) => set("email", v)}
            />
            <Input
              placeholder="Telefone"
              value={form.phone}
              onChange={(v) => set("phone", v)}
            />
          </div>
        </section>

        {/* ENDEREÇO */}
        <section>
          <SectionLabel>Endereço de Entrega</SectionLabel>
          <div className="space-y-3">
            <div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="CEP"
                    value={form.cep}
                    onChange={handleCepInput}
                    maxLength={9}
                  />
                </div>
                <button
                  onClick={fetchCEP}
                  disabled={loadingCep}
                  className="shrink-0 h-[44px] px-5 bg-green-600 hover:bg-green-700 disabled:opacity-55 text-white text-sm font-medium rounded-[14px] transition-colors duration-200 flex items-center gap-2"
                >
                  {loadingCep ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                  ) : (
                    "Buscar"
                  )}
                </button>
              </div>
              {cepStatus === "ok" && (
                <p className="text-[11px] text-green-600 mt-1 pl-1">
                  Endereço encontrado ✓
                </p>
              )}
              {cepStatus === "error" && (
                <p className="text-[11px] text-red-500 mt-1 pl-1">
                  CEP inválido ou não encontrado
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Rua / Av."
                  value={form.street}
                  onChange={(v) => set("street", v)}
                />
              </div>
              <div style={{ width: "7rem" }}>
                <Input
                  placeholder="Número"
                  value={form.number}
                  onChange={(v) => set("number", v)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Complemento (opcional)"
                  value={form.complement}
                  onChange={(v) => set("complement", v)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Bairro"
                  value={form.neighborhood}
                  onChange={(v) => set("neighborhood", v)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cidade"
                  value={form.city}
                  onChange={(v) => set("city", v)}
                />
              </div>
              <div style={{ width: "5rem" }}>
                <Input
                  placeholder="UF"
                  value={form.state}
                  onChange={(v) => set("state", v)}
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PAGAMENTO */}
        <section>
          <SectionLabel>Pagamento</SectionLabel>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(["pix", "card"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`relative p-4 rounded-2xl text-left transition-all duration-200 border-[1.5px] ${
                  paymentMethod === method
                    ? "border-green-500 bg-green-50/70 shadow-[0_0_0_3px_rgba(34,197,94,0.13)]"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
                }`}
              >
                <span
                  className={`block text-[10px] mb-1 font-semibold tracking-[0.1em] uppercase ${
                    paymentMethod === method ? "text-green-600" : "text-zinc-400"
                  }`}
                >
                  {method === "pix" ? "Com desconto" : "Parcelável"}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    paymentMethod === method ? "text-green-700" : "text-zinc-600"
                  }`}
                >
                  {method === "pix" ? "PIX" : "Cartão"}
                </span>
                {paymentMethod === method && (
                  <span className="absolute top-3 right-3 w-[7px] h-[7px] rounded-full bg-green-500" />
                )}
              </button>
            ))}
          </div>

          {paymentMethod === "card" &&
            (canInstall ? (
              <div className="relative">
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className={selectCls}
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}x de {formatPrice(finalTotal / n)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="w-3.5 h-3.5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 bg-zinc-50 px-4 py-3 rounded-[14px] border-[1.5px] border-zinc-100">
                Parcelamento disponível em ate 12x • condições variam conforme o
                cartão
              </p>
            ))}
        </section>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white py-[14px] rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            )}
            {isSubmitting ? "Processando..." : "Finalizar Pedido"}
          </button>
          <p className="text-[14px] text-zinc-400 text-center">
            🔒 Seus dados estão protegidos • Pagamento 100% seguro
          </p>
        </div>
      </div>

      {/* ── RESUMO ── */}
      <aside className="w-full lg:w-[280px] h-fit">
        <div className="bg-[#FFFFFFFF] border-[1.5px] border-zinc-200 rounded-[22px] p-6 space-y-4">
          <SectionLabel>Resumo</SectionLabel>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-start gap-3 text-sm"
              >
                <span className="text-zinc-500 line-clamp-2 flex-1 leading-snug">
                  {item.title}
                  {item.quantity > 1 && (
                    <span className="text-zinc-400"> ×{item.quantity}</span>
                  )}
                </span>
                <span className="text-zinc-800 font-semibold shrink-0">
                  {formatPrice(
                    (paymentMethod === "pix"
                      ? (item.pixPrice ?? item.price)
                      : item.price) * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          {shipping.price > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">{shipping.method}</span>
              <span className="text-zinc-700 font-medium">
                {formatPrice(shipping.price)}
              </span>
            </div>
          )}

          <div className="h-px bg-zinc-500" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-500">Total</span>
            <span className="text-[22px] font-bold text-zinc-600">
              {formatPrice(finalTotal)}
            </span>
          </div>

          {paymentMethod === "pix" && economy > 0 && (
            <div className="bg-green-100 rounded-[14px] px-4 py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              <p className="text-green-800 text-xs font-semibold">
                Você economizou {formatPrice(economy)} no PIX
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}