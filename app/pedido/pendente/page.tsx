import Link from "next/link";



export default function PedidoPendente() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
        <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">Pagamento pendente</h1>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        Seu pagamento está sendo processado. Você receberá uma confirmação por email em breve.
      </p>
      <Link href="/cart" className="mt-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition">
  Voltar ao carrinho
</Link>
    </div>
  );
}