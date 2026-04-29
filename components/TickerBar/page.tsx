"use client";

export default function TickerBar() {
  const messages = [
    "JOÃO PESSOA E CABEDELO ",
    "DESCONTO NO PIX",
    "FRETE GRÁTIS ACIMA DE R$200,00",
    "PARCELAMENTO EM ATÉ 12x • CONDIÇÕES VARIAM CONFORME O CARTÃO",
    "PRODUÇÃO SOB ENCOMENDA • PRAZO DE 15 A 30 DIAS ÚTEIS • PRONTA ENTREGA EM ATÉ 2 DIAS ÚTEIS",
  ];

  return (
    <div className=" w-full overflow-hidden bg-fuchsia-600 font-bold text-gray-50">
      
      {/* Container do slide */}
      <div className="relative flex">
        
        {/* Track animado */}
        <div className="ticker-track flex whitespace-nowrap">
          
          {/* Loop duplicado pra infinito */}
          {[...messages, ...messages].map((msg, i) => (
            <span
              key={i}
              className="mx-6 py-2 text-xs  tracking-wide sm:text-xs md:text-xs font-Instrument-Sans"
            >
              {msg}
            </span>
          ))}

        </div>
      </div>
    </div>
  );
}