"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/cart/CartContext";
import { QuantitySelector } from "@/components/filters/QuantitySelector";
import { FavoriteButton } from "@/components/product/FavoriteButton";

interface Props {
  product: {
    productId: string;
    sku?: string;

    images: string[];

    title: string;
    price: number;
    pixPrice?: number;

    stock: number;
    isUnique: boolean;
    isHandmade: boolean;
    isLimited: boolean;
  };
}
const FALLBACK_IMAGE = "/image/logo.jpeg";
export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  type BtnState = "idle" | "loading" | "done";
  const [btnState, setBtnState] = useState<BtnState>("idle");
  const image = product.images?.[0] || FALLBACK_IMAGE;
  let stockLabel = "";
  let stockColor = "";

  if (product.stock === 0) {
    stockLabel = "Esgotado";
    stockColor = "bg-red-500";
  } else if (product.stock <= 3) {
    stockLabel = "Últimas unidades";
    stockColor = "bg-yellow-400";
  } else {
    stockLabel = "Em estoque";
    stockColor = "bg-green-500";
  }

  const handleAddToCart = () => {
    if (btnState !== "idle" || product.stock === 0) return;

    const safeQuantity = quantity < 1 ? 1 : quantity;

    setBtnState("loading");

    addToCart(
      {
        productId: product.productId, // ← era _id
        sku: product.sku,
        title: product.title,
        price: product.price,
        image: image,
        images: product.images,
        pixPrice: product.pixPrice,
      },
      safeQuantity,
    );

    setTimeout(() => {
      setBtnState("done");
      setTimeout(() => setBtnState("idle"), 1500);
    }, 800);
  };
  console.log("📦 CARD PRODUCT:", product.productId, product.images);
  return (
    <div className="group bg-[#FFFFFF] rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Imagem */}
      <div className="relative w-full aspect-[3/4] bg-[#FFFFFF]">
        <Link
          href={`/products/${product.productId}`}
          className="block w-full h-full"
        >
          {" "}
          {/* ← era _id */}
          <Image
            src={image}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>

        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton product={product} />
        </div>

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.isUnique && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              Peça única
            </span>
          )}
          {product.isHandmade && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              Feito à mão
            </span>
          )}
          {product.isLimited && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              Edição limitada
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <Link
          href={`/products/${product.productId}`} // ← era _id
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-fuchsia-700"
        >
          {product.title}
        </Link>

        {/* ESTOQUE */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${stockColor}`} />
          <span>{stockLabel}</span>
        </div>

        <p className="text-lg font-semibold text-gray-900">
          R$ {product.price.toFixed(2)}
        </p>

        {product.pixPrice && (
          <p className="text-xs text-green-600 font-medium">
            R$ {product.pixPrice.toFixed(2)} no Pix
          </p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <QuantitySelector value={quantity} onChange={setQuantity} />

          <button
            onClick={handleAddToCart}
            disabled={btnState !== "idle" || product.stock === 0}
            className={
              "flex-1 text-white text-sm py-2 rounded-lg transition " +
              (btnState === "done"
                ? "bg-emerald-500"
                : "bg-green-600 hover:bg-green-700") +
              " disabled:opacity-90"
            }
          >
            {product.stock === 0
              ? "Esgotado"
              : btnState === "idle"
                ? "Comprar"
                : btnState === "loading"
                  ? "..."
                  : "Adicionado"}
          </button>
        </div>
      </div>
    </div>
  );
}
