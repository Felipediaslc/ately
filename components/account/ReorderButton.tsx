"use client";

import { useCart } from "@/app/context/cart/CartContext";

type Item = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string | null;
};

export function ReorderButton({ items }: { items: Item[] }) {
  const { addToCart } = useCart();

  const handleReorder = () => {
    items.forEach((item) => {
      addToCart(
        {
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image || "/placeholder.png",
        },
        item.quantity
      );
    });
  };

  return (
    <button
      onClick={handleReorder}
      className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
    >
      Comprar novamente
    </button>
  );
}