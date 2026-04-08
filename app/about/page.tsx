import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#FAF7F2] text-gray-900">

      {/* HERO */}
      <section className="max-w-[1100px] mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Mais do que produtos.
          <br /> Peças com significado.
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
          Cada item carrega uma história, um cuidado especial e um propósito.
          Aqui, nada é feito por acaso.
        </p>
      </section>

      {/* 🔥 HISTÓRIA + IMAGEM (LADO A LADO) */}
      <section className="max-w-[1100px] mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">

        {/* TEXTO */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Nossa história</h2>

          <p className="text-gray-700 leading-relaxed">
            Tudo começou de forma simples, dentro de casa, com dedicação,
            paciência e muito carinho em cada detalhe.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            As peças são produzidas manualmente por{" "}
            <span className="font-semibold text-gray-900">
              Socorro Dias
            </span>, que transforma materiais em algo único,
            com identidade e propósito.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Não é produção em massa. Não é algo genérico. Cada criação carrega
            tempo, cuidado e intenção.
          </p>
        </div>

        {/* IMAGEM */}
        <div className="relative w-full h-[350px] sm:h-[420px] rounded-2xl overflow-hidden">
          <Image
            src="/image/banner02Mobile.png"
            alt="Artesanato feito por Socorro Dias"
            fill
            className="object-cover"
          />
        </div>

      </section>

      {/* 🔥 DIFERENCIAIS (AGORA EM CARDS) */}
      <section className="bg-[#FAF7F2] py-16">
        <div className="max-w-[1000px] mx-auto px-4 grid sm:grid-cols-3 gap-6">

          <div className="bg-[#FFFFFFFF] backdrop-blur rounded-2xl p-6  hover:-translate-y-1 transition text-center">
            <h3 className="font-semibold mb-2">Feito à mão</h3>
            <p className="text-sm text-gray-600">
              Cada peça é produzida manualmente, com atenção em cada detalhe.
            </p>
          </div>

          <div className="bg-[#FFFFFFFF]  rounded-2xl p-6  hover:-translate-y-1 transition text-center">
            <h3 className="font-semibold mb-2">Peças únicas</h3>
            <p className="text-sm text-gray-600">
              Muitas criações são exclusivas ou feitas em pequenas quantidades.
            </p>
          </div>

          <div className="bg-[#FFFFFFFF]  rounded-2xl p-6  hover:-translate-y-1 transition text-center">
            <h3 className="font-semibold mb-2">Com propósito</h3>
            <p className="text-sm text-gray-600">
              Mais do que estética, buscamos significado em cada produto.
            </p>
          </div>

        </div>
      </section>

      {/* PROCESSO */}
      <section className="max-w-[900px] mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold mb-4">Como tudo é feito</h2>

        <p className="text-gray-700 leading-relaxed">
          O processo começa com a escolha cuidadosa dos materiais e segue
          com um trabalho manual feito com calma, respeitando o tempo de cada peça.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          Cada detalhe é pensado para garantir qualidade, beleza e durabilidade,
          sem perder a essência artesanal.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-xl font-semibold mb-4">
          Pronto para conhecer nossas peças?
        </h2>

        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          Explorar as peças
        </Link>
      </section>

    </main>
  );
}