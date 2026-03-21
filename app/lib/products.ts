import type { Product } from "@/app/types/product";

// 🔹 Tipo base (dados crus)
interface RawProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  installment?: string; // Parcelamento
  pixPrice?: number;    // Preço com Pix
}

// 🔹 Base de produtos
const allProducts: RawProduct[] = [
  {
    id: "1",
    title: "Terço de Madeira",
    price: 35,
    images: ["/image/produto01.png", "/image/produto01tras.png"],
    category: "terco",
    description: "Terço artesanal de madeira de alta qualidade.",
    installment: "ou 2x de R$ 17,50",
    pixPrice: 32
  },
  {
    id: "2",
    title: "Imagem de Santo",
    price: 75,
    images: ["/image/produto02.png", "/image/produto02tras.png"],
    category: "imagem",
    description: "Imagem religiosa para decoração ou presente.",
    installment: "ou 3x de R$ 25,00",
    pixPrice: 70
  },
  {
    id: "3",
    title: "Bíblia Sagrada",
    price: 150,
    images: ["/image/produto03.png", "/image/produto03.png"],
    category: "biblia",
    description: "Bíblia em capa dura com comentários detalhados.",
    installment: "ou 5x de R$ 30,00",
    pixPrice: 140
  },
  {
    id: "4",
    title: "Cruz de Madeira",
    price: 50,
    images: ["/image/produto04.png", "/image/produto04.png"],
    category: "cruz",
    description: "Cruz decorativa em madeira nobre.",
    installment: "ou 2x de R$ 25,00",
    pixPrice: 45
  },
  {
    id: "5",
    title: "Vela de Cera",
    price: 15,
    images: ["/image/produto05.png", "/image/produto05.png"],
    category: "vela",
    description: "Vela artesanal, longa duração.",
    installment: "ou 1x de R$ 15,00",
    pixPrice: 13
  },
  {
    id: "6",
    title: "Candelabro de Prata",
    price: 200,
    images: ["/image/produto06.png", "/image/produto06.png"],
    category: "decoracao",
    description: "Candelabro elegante em prata.",
    installment: "ou 8x de R$ 25,00",
    pixPrice: 185
  },
];

// 🔹 Função de transformação (Raw → Product)
function formatProduct(product: RawProduct): Product {
  return {
    ...product,
    categorySlug: product.category.toLowerCase().replace(/\s+/g, "-"),
  };
}

// 🔹 Todos os produtos (com filtros)
export async function getProducts(
  price?: string,
  category?: string
): Promise<Product[]> {
  return allProducts
    .filter((product) => {
      let matchPrice = true;
      if (price) {
        const [min, max] = price.split("-");
        matchPrice =
          max === "*"
            ? product.price >= Number(min)
            : product.price >= Number(min) &&
              product.price <= Number(max);
      }

      let matchCategory = true;
      if (category) {
        const queryCat = category.trim().toLowerCase().replace(/,+$/, "");
        matchCategory = product.category.toLowerCase() === queryCat;
      }

      return matchPrice && matchCategory;
    })
    .map(formatProduct);
}

// 🔹 Produtos em destaque (HOME)
export async function getFeaturedProducts(): Promise<Product[]> {
  return allProducts.slice(0, 4).map(formatProduct);
}

// 🔹 Produto individual
export async function getProductById(
  id: string
): Promise<Product | null> {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return null;

  const relatedProducts = allProducts
    .filter((p) => p.id !== id)
    .slice(0, 3)
    .map(formatProduct);

  return {
    ...formatProduct(product),
    relatedProducts,
  };
}