"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ShoppingCart, Check, Loader2, Truck, RotateCcw } from "lucide-react";

import { FavoriteButton } from "@/components/product/FavoriteButton";
import { QuantitySelector } from "@/components/filters/QuantitySelector";
import { useCart } from "@/app/context/cart/CartContext";
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

const stockConfig = {
  in_stock: { label: "Em estoque", color: "bg-green-500", text: "text-green-700" },
  low_stock: { label: "Últimas unidades", color: "bg-yellow-400", text: "text-yellow-700" },
  out_of_stock: { label: "Esgotado", color: "bg-red-500", text: "text-red-700" },
};

export default function ProductDetails({ product }: Props) {
  const { addToCart } = useCart();

  const autoplay: ReturnType<typeof Autoplay> = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  type BtnState = "idle" | "loading" | "done";
  const [cartState, setCartState] = React.useState<BtnState>("idle");
  const [relatedStates, setRelatedStates] = React.useState<Record<string, BtnState>>({});
  const [quantity, setQuantity] = React.useState(1);

  const mainImage = product.images?.[0] || "/image/produto01.png";
  const stock = product.stock ? stockConfig[product.stock] : null;

  const handleAddToCart = () => {
    if (cartState !== "idle") return;
    setCartState("loading");
    addToCart(
      { id: product.id, title: product.title, price: product.price, image: mainImage },
      quantity
    );
    setTimeout(() => {
      setCartState("done");
      setTimeout(() => setCartState("idle"), 2000);
    }, 1200);
  };

  const formattedRelatedProducts: RelatedProduct[] =
    product.relatedProducts?.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.images?.[0] || "/image/produto01.png",
    })) || [];

  const handleBuyRelated = (p: RelatedProduct) => {
    if (relatedStates[p.id] && relatedStates[p.id] !== "idle") return;
    setRelatedStates((prev) => ({ ...prev, [p.id]: "loading" }));
    addToCart({ ...p }, 1);
    setTimeout(() => {
      setRelatedStates((prev) => ({ ...prev, [p.id]: "done" }));
      setTimeout(() => setRelatedStates((prev) => ({ ...prev, [p.id]: "idle" })), 2000);
    }, 1200);
  };

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { if (emblaApi) emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const scrollPrev = () => emblaApi?.scrollPrev();

  const formatPrice = (val: number | string) =>
    typeof val === "number" ? val.toFixed(2).replace(".", ",") : val;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Galeria */}
      <div className="lg:w-1/2 flex flex-col gap-4">
        <div
          className="overflow-hidden rounded-2xl bg-[#FFFFFFFF] shadow-sm border border-gray-100"
          ref={emblaRef}
        >
          <div className="flex">
            {product.images?.map((src, idx) => (
              <div
                key={idx}
                className="min-w-full flex-shrink-0 relative h-[380px] lg:h-[480px] group overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`${product.title} - ${idx + 1}`}
                  fill
                  className="object-contain bg-[#FFFFFFFF] transition-transform duration-500 group-hover:scale-105"
                />
                <FavoriteButton
  product={{
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.images?.[0] || "",
    installment: product.installment,
    pixPrice: product.pixPrice,
  }}
/>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={scrollPrev}
            className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex gap-2">
            {product.images?.map((src, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedIndex === idx ? "border-fuchsia-600" : "border-gray-200"
                }`}
              >
                <Image
                  src={src}
                  alt={`thumb-${idx}`}
                  width={80}
                  height={80}
                  className="object-contain bg-[#FFFFFFFF]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info do Produto */}
      <div className="lg:w-1/2 flex flex-col">

        {/* Badge */}
        {product.badge && (
          <span className="self-start mb-3 text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-[#FFFFFFFF] text-gray-500">
            {product.badge}
          </span>
        )}

        <h1 className="text-[1.6rem] font-semibold text-gray-900 leading-snug mb-2">
          {product.title}
        </h1>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-400 mb-4">REF: {product.sku}</p>
        )}

        {/* Estoque */}
        {stock && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${stock.color} ${product.stock === "in_stock" || product.stock === "low_stock" ? "animate-pulse" : ""}`} />
            <span className={`text-xs font-medium ${stock.text}`}>{stock.label}</span>
          </div>
        )}

        <div className="flex flex-col gap-1 pb-5 border-b border-gray-200 mb-5">
          <p className="text-[2.4rem] font-bold text-[#1a2e4a] leading-none">
            R$ {formatPrice(product.price)}
          </p>
          {product.installment && (
            <p className="text-sm font-medium text-purple-600 mt-1">{product.installment}</p>
          )}
          {product.pixPrice && (
            <p className="text-sm text-gray-500 mt-0.5">
              R$ {formatPrice(product.pixPrice)} com Pix
            </p>
          )}
        </div>

        {product.description && (
          <div className="pb-5 border-b border-gray-200 mb-5">
            <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <label htmlFor="qty" className="text-sm text-gray-700">Quantidade:</label>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={cartState !== "idle" || product.stock === "out_of_stock"}
          className={
            "w-full max-w-[520px] text-white font-bold text-lg py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 " +
            (cartState === "done" ? "bg-emerald-500" : "bg-green-600 hover:bg-green-700") +
            " disabled:opacity-90 disabled:cursor-not-allowed"
          }
        >
          {cartState === "idle" && <><ShoppingCart size={20} />{product.stock === "out_of_stock" ? "Produto Esgotado" : "Adicionar ao carrinho"}</>}
          {cartState === "loading" && <><Loader2 size={20} className="animate-spin" />Incluindo...</>}
          {cartState === "done" && <><Check size={20} />Adicionado!</>}
        </button>

        {/* Bloco de confiança */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Truck size={16} className="shrink-0" />
            <span className="text-xs">
              Entrega em até{" "}
              <strong className="text-gray-700">{product.deliveryDays ?? 7} dias úteis</strong>
            </span>
          </div>
          <div className="w-px h-6 bg-[#FFFFFFFF]" />
          <div className="flex items-center gap-2 text-gray-500">
            <RotateCcw size={16} className="shrink-0" />
            <span className="text-xs">
              <strong className="text-gray-700">30 dias</strong> para troca
            </span>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {formattedRelatedProducts.length > 0 && (
          <div className="mt-7">
            <h2 className="text-base font-bold text-gray-900 mb-3">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {formattedRelatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FFFFFFFF] border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="w-full flex justify-center items-center p-4 bg-[#FFFFFFFF]">
                    <div className="relative w-full aspect-square max-h-[120px]">
                      <Image src={p.image} alt={p.title} fill className="object-contain" />
                    </div>
                  </div>
                  <div className="px-3 pb-3 flex flex-col gap-1 flex-1">
                    <p className="text-xs text-gray-700 line-clamp-2 leading-snug flex-1">{p.title}</p>
                    <p className="text-sm font-bold text-green-600 mt-1">R$ {formatPrice(p.price)}</p>
                    <button
                      onClick={() => handleBuyRelated(p)}
                      disabled={relatedStates[p.id] && relatedStates[p.id] !== "idle"}
                      className={
                        "w-full mt-1 text-white text-xs font-semibold px-2 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 " +
                        (relatedStates[p.id] === "done" ? "bg-emerald-500" : "bg-green-600 hover:bg-green-700") +
                        " disabled:opacity-90 disabled:cursor-not-allowed"
                      }
                    >
                      {(!relatedStates[p.id] || relatedStates[p.id] === "idle") && "Comprar"}
                      {relatedStates[p.id] === "loading" && <><Loader2 size={12} className="animate-spin" />Incluindo...</>}
                      {relatedStates[p.id] === "done" && <><Check size={12} />Incluído!</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}