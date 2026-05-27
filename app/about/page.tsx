import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#FAF7F2] text-gray-900 font-serif">
      {/* HERO */}
      <section className="max-w-[700px] mx-auto px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 text-center">
        <div className="mb-7 flex justify-center">
          <Image
            src="/image/logo.jpeg"
            alt="DS Atelier"
            width={180}
            height={52}
            className="object-contain"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </div>

        <h1 className="text-[clamp(24px,4vw,38px)] font-normal leading-snug tracking-tight">
          Mais do que produtos.
          <br />
          <em className="text-fuchsia-600 not-italic">
            Peças com significado.
          </em>
        </h1>

        <p className="mt-5 text-[clamp(13px,1.8vw,15px)] text-gray-500 leading-relaxed max-w-md mx-auto">
          Cada item carrega uma história, um cuidado especial e um propósito.
          Aqui, nada é feito por acaso.
        </p>

        <div className="mt-7 mx-auto w-10 h-px bg-fuchsia-400 opacity-50" />
      </section>

      {/* HISTÓRIA + IMAGEM */}
      <section className="max-w-[680px] mx-auto px-6 pb-12 sm:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div>
            <span className="block text-[11px] tracking-widest font-bold uppercase text-fuchsia-600 font-sans mb-4">
              Nossa história
            </span>

            <p className="text-gray-600 leading-relaxed">
              Tudo começou de forma simples, dentro de casa, com dedicação,
              paciência e muito carinho em cada detalhe.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              As peças são produzidas manualmente por{" "}
              <strong className="text-gray-900 font-semibold">
                Socorro Dias
              </strong>
              , que transforma materiais em algo único, com identidade e
              propósito.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Não é produção em massa. Não é algo genérico. Cada criação carrega
              tempo, cuidado e intenção.
            </p>
          </div>

          <div className="relative w-full h-[200px] sm:h-[260px] rounded-2xl overflow-hidden border border-fuchsia-100">
            <Image
              src="/image/banner02Mobile.png"
              alt="Artesanato feito por Socorro Dias"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="px-6 pb-12 sm:pb-14">
        <div className="max-w-[680px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 17l4-8 4 4 4-6 4 8" />
                </svg>
              ),
              title: "Feito à mão",
              text: "Cada peça é produzida manualmente, com atenção em cada detalhe.",
            },
            {
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ),
              title: "Peças únicas",
              text: "Muitas criações são exclusivas ou feitas em pequenas quantidades.",
            },
            {
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c026d3"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              ),
              title: "Com propósito",
              text: "Mais do que estética, buscamos significado em cada produto.",
            },
          ].map(({ icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 text-center border border-fuchsia-50 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-9 h-9 rounded-full bg-fuchsia-50 flex items-center justify-center mx-auto mb-4">
                {icon}
              </div>
              <h3 className="font-sans text-[13px] font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="font-sans text-[13px] text-gray-500 leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESSO */}
      <section className="max-w-[480px] mx-auto px-6 pb-12 sm:pb-14 text-center">
        <span className="block text-[11px]  font-bold tracking-widest uppercase text-fuchsia-600 font-sans mb-4">
          Como tudo é feito
        </span>

        <p className="text-[clamp(13px,1.8vw,15px)] text-gray-600 leading-relaxed">
          O processo começa com a escolha cuidadosa dos materiais e segue com um
          trabalho manual feito com calma, respeitando o tempo de cada peça.
        </p>

        <p className="mt-4 text-[clamp(13px,1.8vw,15px)] text-gray-600 leading-relaxed">
          Cada detalhe é pensado para garantir qualidade, beleza e durabilidade,
          sem perder a essência artesanal.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-16 sm:pb-20">
        <div className="mx-auto w-10 h-px bg-fuchsia-400 opacity-40 mb-7" />

        <p className="text-[clamp(15px,2vw,17px)] text-gray-900 italic mb-5">
          Pronto para conhecer nossas peças?
        </p>

        <Link
          href="/products"
          className="inline-block bg-fuchsia-600 text-white px-8 py-3 rounded-full text-[13px] font-medium font-sans tracking-wide hover:bg-fuchsia-700 transition-colors duration-200"
        >
          Explorar as peças
        </Link>
      </section>
    </main>
  );
}
