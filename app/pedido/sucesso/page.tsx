export default function PedidoSucesso() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900">Pagamento confirmado!</h1>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        Seu pedido foi recebido e está sendo processado. Em breve você receberá mais detalhes por email.
      </p>
    </div>
  );
}