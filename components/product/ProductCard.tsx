

import Image from "next/image";
import { QuantitySelector } from "@/components/filters/SortSelect";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import Link from "next/link";

interface Props {
  product: {
    id: string;
    image: string;
    title: string;
    price: number;
  };
}

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div
        className="
    group 
    bg-white 
    rounded-2xl 
    shadow-sm 
    hover:shadow-md 
    transition 
    overflow-hidden
    flex 
    flex-col
  "
        style={{ height: "100%" }}
      >
        <div className="relative w-full aspect-[3/4] bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
          <FavoriteButton />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-sm font-medium line-clamp-2 h-[40px]">
            {product.title}
          </h3>

          <div className="mt-auto">
            <p className="text-xl font-semibold">R$ {product.price}</p>
            <p className="text-xs text-gray-500">ou 1x sem juros</p>

            <div className="flex items-center gap-2 mt-4">
              <QuantitySelector />
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition-all duration-200 hover:scale-105">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
