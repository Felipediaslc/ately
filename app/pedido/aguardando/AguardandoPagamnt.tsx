"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, ShoppingBag, Calendar, CheckCircle2, Loader2, Package, Lock } from "lucide-react";

type OrderData = {
  status: string;
  number: string;
  createdAt: string;
  items: {
    name: string;
    description: string;
    imageUrl?: string;
    total: number;
  }[];
};

const steps = [
  { label: "Pedido criado", icon: ShoppingBag },
  { label: "Aguardando pagamento", icon: Loader2 },
  { label: "Pagamento aprovado", icon: Lock },
  { label: "Pedido confirmado", icon: Package },
];

function getStepIndex(status: string) {
  switch (status) {
    case "aguardando": return 1;
    case "pago": return 2;
    case "confirmado": return 3;
    default: return 1;
  }
}

export default function AguardandoPedidoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState("aguardando");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);
  const orderLoaded = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    let isChecking = false;

    const checkStatus = async () => {
      if (isChecking) return;
      isChecking = true;

      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        const data = await res.json();

        setStatus(data.status);

        if (!orderLoaded.current) {
          orderLoaded.current = true;
          setOrder({
            status: data.status,
            number: data.number,
            createdAt: data.createdAt,
            items: data.items,
          });
        }

        if (data.status === "pago") {
          setTimeout(() => {
            router.push(`/pedido/sucesso?orderId=${orderId}`);
          }, 1200);
        }
      } finally {
        isChecking = false;
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId, router]);

  const handleCopy = () => {
    if (!order?.number) return;
    navigator.clipboard.writeText(order.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStep = getStepIndex(status);

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Pedido inválido</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">

      {/* HEADER */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">SD Ateliê</span>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock size={14} />
          Ambiente 100% seguro
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">

        {/* ÍCONE + TÍTULO */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag size={36} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              Estamos aguardando seu pagamento
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
            </h1>
            <p className="text-gray-500 mt-2 text-sm max-w-md">
              Seu pedido foi criado com sucesso! Assim que identificarmos o pagamento,
              você será redirecionado para a página de confirmação.
            </p>
          </div>
        </div>

        {/* DADOS DO PEDIDO */}
        {order && (
          <div className="border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Pedido realizado</p>
                <div className="flex items-center gap-2 font-semibold">
                  #{order.number}
                  <button onClick={handleCopy} className="text-gray-400 hover:text-black transition">
                    <Copy size={14} />
                  </button>
                  {copied && <span className="text-xs text-gray-500">Copiado!</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Data do pedido</p>
                <p className="font-semibold">{order.createdAt}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEPPER */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="text-center font-semibold mb-6">Status do pagamento</h2>
          <div className="flex items-start justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-gray-200 z-0" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              const done = i < activeStep;
              const active = i === activeStep;
              const pending = i > activeStep;

              return (
                <div key={i} className="flex flex-col items-center gap-2 z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${done ? "bg-black border-black text-white" : ""}
                      ${active ? "bg-white border-black text-black" : ""}
                      ${pending ? "bg-white border-gray-300 text-gray-300" : ""}
                    `}
                  >
                    {done ? (
                      <CheckCircle2 size={18} />
                    ) : active ? (
                      <Icon size={18} className="animate-spin" />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  <p className={`text-xs text-center font-medium leading-tight
                    ${done || active ? "text-black" : "text-gray-400"}
                  `}>
                    {step.label}
                  </p>
                  {active && (
                    <p className="text-xs text-gray-500">Verificando...</p>
                  )}
                  {done && i === 0 && order && (
                    <p className="text-xs text-gray-400">{order.createdAt}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PODE FECHAR? */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-base mb-1">Pode fechar esta página?</h3>
            <p className="text-sm text-gray-500">
              Sim! Assim que o pagamento for aprovado, enviaremos um e-mail
              e você será redirecionado automaticamente.
            </p>
          </div>
          <div className="w-20 h-20 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-black" />
          </div>
        </div>

        {/* RESUMO DO PEDIDO */}
        {order && order.items?.length > 0 && (
          <div className="border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Resumo do pedido</h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold">
                      {item.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPORTE */}
        <div className="flex items-start gap-3 border border-gray-200 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
              <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Precisa de ajuda?</p>
            <p className="text-sm text-gray-500">
              Fale com nosso suporte no WhatsApp:{" "}
              <a href="https://wa.me/5583987510636" className="text-black font-medium underline underline-offset-2">
                (83) 98751-0636 {/* ← troque pelo número real */}
              </a>
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
