import Link from "next/link";

export default function PedidoFalha() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">Pagamento não aprovado</h1>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        Houve um problema com seu pagamento. Tente novamente ou use outro método de pagamento.
      </p>
      <Link href="/cart" className="mt-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition">
        Voltar ao carrinho
      </Link>
    </div>
  );
}