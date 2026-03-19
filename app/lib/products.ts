import type { Product } from "@/app/types/product";

export async function getProducts(
  price?: string,
  category?: string
): Promise<Product[]> {
  const allProducts: Product[] = [
    { id: "1", title: "Terço de Madeira", price: 35, image: "/image/produto01.png", category: "terco" },
    { id: "2", title: "Imagem de Santo", price: 75, image: "/image/produto02.png", category: "imagem" },
    { id: "3", title: "Bíblia Sagrada", price: 150, image: "/image/produto03.png", category: "biblia" },
    { id: "4", title: "Cruz de Madeira", price: 50, image: "/image/produto04.png", category: "cruz" },
    { id: "5", title: "Vela de Cera", price: 15, image: "/image/produto05.png", category: "vela" },
    { id: "6", title: "Candelabro de Prata", price: 200, image: "/image/produto06.png", category: "decoracao" },
  ];

  return allProducts.filter((product) => {
    // 🔹 Filtro por preço
    let matchPrice = true;
    if (price) {
      const [min, max] = price.split("-");
      matchPrice =
        max === "*"
          ? product.price >= Number(min)
          : product.price >= Number(min) && product.price <= Number(max);
    }

    // 🔹 Filtro por categoria (ignora maiúsculas/minúsculas, espaços e vírgulas)
    let matchCategory = true;
    if (category) {
      const queryCat = category.trim().toLowerCase().replace(/,+$/, ""); // remove vírgulas finais
      matchCategory = product.category.toLowerCase() === queryCat;
    }

    return matchPrice && matchCategory;
  });
}