import type { Product } from "@/app/types/product";

interface RawProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  pixPrice?: number;

  stock: number;
  sold: number;

  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;

  sku?: string;
  deliveryDays?: number;

  createdAt: Date;
  updatedAt: Date;
}

const now = new Date();

const allProducts: RawProduct[] = [
  {
    id: "1",
    title: "Terço de Madeira",
    price: 35,
    images: ["/image/(1).png", "/image/(17).png"],
    category: "terco",
    description: "Terço artesanal de madeira de alta qualidade.",
    pixPrice: 32,

    stock: 10,
    sold: 2,

    isUnique: false,
    isHandmade: true,
    isLimited: false,

    sku: "TRC-001",
    deliveryDays: 5,

    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    title: "Imagem de Santo",
    price: 75,
    images: ["/image/produto02.png", "/image/produto02tras.png"],
    category: "imagem",
    description: "Imagem religiosa para decoração ou presente.",
    pixPrice: 70,

    stock: 1,
    sold: 5,

    isUnique: true,
    isHandmade: false,
    isLimited: false,

    sku: "IMG-002",
    deliveryDays: 5,

    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    title: "Bíblia Sagrada",
    price: 150,
    images: ["/image/produto03.png", "/image/produto03.png"],
    category: "biblia",
    description: "Bíblia em capa dura com comentários detalhados.",
    pixPrice: 140,

    stock: 3,
    sold: 8,

    isUnique: false,
    isHandmade: false,
    isLimited: true,

    sku: "BIB-003",
    deliveryDays: 7,

    createdAt: now,
    updatedAt: now,
  },
  {
    id: "4",
    title: "Cruz de Madeira",
    price: 50,
    images: ["/image/produto04.png", "/image/produto04.png"],
    category: "cruz",
    description: "Cruz decorativa em madeira nobre.",
    pixPrice: 45,

    stock: 6,
    sold: 3,

    isUnique: false,
    isHandmade: true,
    isLimited: false,

    sku: "CRZ-004",
    deliveryDays: 5,

    createdAt: now,
    updatedAt: now,
  },
  {
    id: "5",
    title: "Vela de Cera",
    price: 15,
    images: ["/image/produto05.png", "/image/produto05.png"],
    category: "vela",
    description: "Vela artesanal, longa duração.",
    pixPrice: 13,

    stock: 20,
    sold: 10,

    isUnique: false,
    isHandmade: true,
    isLimited: false,

    sku: "VEL-005",
    deliveryDays: 3,

    createdAt: now,
    updatedAt: now,
  },
  {
    id: "6",
    title: "Candelabro de Prata",
    price: 200,
    images: ["/image/produto06.png", "/image/produto06.png"],
    category: "decoracao",
    description: "Candelabro elegante em prata.",
    pixPrice: 185,

    stock: 0,
    sold: 12,

    isUnique: false,
    isHandmade: false,
    isLimited: true,

    sku: "CAN-006",
    deliveryDays: 10,

    createdAt: now,
    updatedAt: now,
  },
];

function formatProduct(product: RawProduct): Product {
  return {
    ...product,
    categorySlug: product.category.toLowerCase().replace(/\s+/g, "-"),
  };
}

export async function getProducts(price?: string, category?: string): Promise<Product[]> {
  return allProducts
    .filter((product) => {
      let matchPrice = true;
      if (price) {
        const [min, max] = price.split("-");
        matchPrice =
          max === "*"
            ? product.price >= Number(min)
            : product.price >= Number(min) && product.price <= Number(max);
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

export async function getFeaturedProducts(): Promise<Product[]> {
  return allProducts.slice(0, 4).map(formatProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return null;

  const relatedProducts = allProducts
    .filter((p) => p.id !== id)
    .slice(0, 3)
    .map(formatProduct);

  return { ...formatProduct(product), relatedProducts };
}