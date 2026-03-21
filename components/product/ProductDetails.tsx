"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ShoppingCart, Check, Loader2 } from "lucide-react";

import { FavoriteButton } from "@/components/product/FavoriteButton";
import type { Product as AppProduct } from "@/app/types/product";

export interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface Props {
  product: AppProduct;
}

export default function ProductDetails({ product }: Props) {
  const autoplay: ReturnType<typeof Autoplay> = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Estados dos botões de carrinho
  type BtnState = "idle" | "loading" | "done";
  const [cartState, setCartState] = React.useState<BtnState>("idle");
  const [relatedStates, setRelatedStates] = React.useState<Record<string, BtnState>>({});

  const handleAddToCart = () => {
    if (cartState !== "idle") return;
    setCartState("loading");
    setTimeout(() => {
      setCartState("done");
      setTimeout(() => setCartState("idle"), 2000);
    }, 1200);
  };

  const handleBuyRelated = (id: string) => {
    if (relatedStates[id] && relatedStates[id] !== "idle") return;
    setRelatedStates((prev) => ({ ...prev, [id]: "loading" }));
    setTimeout(() => {
      setRelatedStates((prev) => ({ ...prev, [id]: "done" }));
      setTimeout(() => setRelatedStates((prev) => ({ ...prev, [id]: "idle" })), 2000);
    }, 1200);
  };

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const scrollPrev = () => emblaApi?.scrollPrev();

  const formattedRelatedProducts: RelatedProduct[] | undefined =
    product.relatedProducts?.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.images?.[0] || "/image/produto01.png",
    }));

  const formatPrice = (val: number | string) =>
    typeof val === "number" ? val.toFixed(2).replace(".", ",") : val;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Coluna Esquerda: Galeria ── */}
        <div className="lg:w-1/2 flex flex-col gap-4">

          {/* Imagem principal */}
          <div
            className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100"
            ref={emblaRef}
          >
            <div className="flex">
              {product.images.map((src, idx) => (
                <div
                  key={idx}
                  className="min-w-full flex-shrink-0 relative h-[380px] lg:h-[480px] group overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={`${product.title} - ${idx + 1}`}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnails centralizadas com seta < à esquerda */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={scrollPrev}
              className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex gap-2">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedIndex === idx
                      ? "border-fuchsia-600"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`thumb-${idx}`}
                    width={80}
                    height={80}
                    className="object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Coluna Direita: Info — pixel-perfect igual ao modelo ── */}
        <div className="lg:w-1/2 flex flex-col">

          {/* Título — sem hr abaixo, só espaço */}
          <h1 className="text-[1.6rem] font-semibold text-gray-900 leading-snug mb-4">
            {product.title}
          </h1>

          {/* Bloco de preços — hr só abaixo */}
          <div className="flex flex-col gap-1 pb-5 border-b border-gray-200 mb-5">
            {/* Preço — azul navy, grande e bold como no modelo */}
            <p className="text-[2.4rem] font-bold text-[#1a2e4a] leading-none">
              R$ {formatPrice(product.price)}
            </p>
            {/* Parcelamento — roxo */}
            {product.installment && (
              <p className="text-sm font-medium text-purple-600 mt-1">
                {product.installment}
              </p>
            )}
            {/* Pix — cinza, sem riscado */}
            {product.pixPrice && (
              <p className="text-sm text-gray-500 mt-0.5">
                R$ {formatPrice(product.pixPrice)} com Pix
              </p>
            )}
          </div>

          {/* Descrição — cinza claro, hr abaixo */}
          {product.description && (
            <div className="pb-5 border-b border-gray-200 mb-5">
              <p className="text-sm text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantidade */}
          <div className="flex items-center gap-3 mb-5">
            <label htmlFor="qty" className="text-sm text-gray-700">
              Quantidade:
            </label>
            <select
              id="qty"
              defaultValue={1}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Botão — igual ao modelo: bordas médias, não muito redondas, largura total */}
          <button
            onClick={handleAddToCart}
            disabled={cartState !== "idle"}
            className={"w-full max-w-[520px] text-white font-bold text-lg py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 " + (cartState === "done" ? "bg-emerald-500" : "bg-green-600 hover:bg-green-700") + " disabled:opacity-90 disabled:cursor-not-allowed"}
          >
            {cartState === "idle" && <><ShoppingCart size={20} />Adicionar ao carrinho</>}
            {cartState === "loading" && <><Loader2 size={20} className="animate-spin" />Incluindo...</>}
            {cartState === "done" && <><Check size={20} />Adicionado!</>}
          </button>

          {/* ── Produtos Relacionados ── */}
          {formattedRelatedProducts && formattedRelatedProducts.length > 0 && (
            <div className="mt-7">
              <h2 className="text-base font-bold text-gray-900 mb-3">
                Produtos Relacionados
              </h2>

              <div className="flex gap-3">
                {formattedRelatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="w-full flex justify-center items-center p-5 min-h-[130px] bg-white">
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={110}
                        height={110}
                        className="object-contain"
                      />
                    </div>
                    <div className="px-3 pb-3 flex flex-col gap-1">
                      <p className="text-xs text-gray-700 line-clamp-2 leading-snug">
                        {p.title}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-sm font-bold text-green-600 whitespace-nowrap">
                          R$ {formatPrice(p.price)}
                        </p>
                        <button
                          onClick={() => handleBuyRelated(p.id)}
                          disabled={relatedStates[p.id] && relatedStates[p.id] !== "idle"}
                          className={("flex-shrink-0 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 ") + (relatedStates[p.id] === "done" ? "bg-emerald-500" : "bg-green-600 hover:bg-green-700") + " disabled:opacity-90 disabled:cursor-not-allowed"}
                        >
                          {(!relatedStates[p.id] || relatedStates[p.id] === "idle") && "Comprar"}
                          {relatedStates[p.id] === "loading" && <><Loader2 size={12} className="animate-spin" />Incluindo...</>}
                          {relatedStates[p.id] === "done" && <><Check size={12} />Incluído!</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
