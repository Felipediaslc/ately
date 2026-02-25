"use client";

export default function TickerBar() {
  const messages = [
    "JOÃO PESSOA E REGIÃO: ENTREGA EM 2 DIAS ÚTEIS",
    "DESCONTO NO PIX",
    "FRETE GRÁTIS ACIMA DE R$199",
    "PARCELAMENTO EM ATÉ 10X",
  ];

  return (
    <div className=" w-full overflow-hidden bg-fuchsia-400 text-gray-950">
      
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