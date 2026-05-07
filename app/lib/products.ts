import type { Product } from "@/app/types/product";

// 🔹 BASE URL (SSR safe)
function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

// 🔹 RAW TYPES (API / Mongo)
interface RawProduct {
  productId: string; // mock

  _id?: string; // mongo

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

  createdAt: string | Date;
  updatedAt: string | Date;
}

// 🔹 MOCK fallback (build seguro)
const now = new Date();

const allProducts: RawProduct[] = [
  {
    productId: "1",
    title: "Terço N. Senhora Aparecida",
    price: 35,
    images: ["/image/(1).png", "/image/(17).png"],
    category: "terco",
    description: "Terço artesanal de madeira.",
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
];

// 🔹 NORMALIZAÇÃO (REGRA ÚNICA DE ID)
function formatProduct(product: RawProduct): Product {
  const productId =
    product._id?.toString() ?? product.productId ?? "";

  return {
    productId,

    title: product.title,
    price: product.price,
    images: product.images,

    category: product.category,
    description: product.description,
    pixPrice: product.pixPrice,

    stock: product.stock,
    sold: product.sold,

    isUnique: product.isUnique,
    isHandmade: product.isHandmade,
    isLimited: product.isLimited,

    sku: product.sku,
    deliveryDays: product.deliveryDays,

    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),

    categorySlug: product.category
      .toLowerCase()
      .replace(/\s+/g, "-"),
  };
}

// 🔹 GET PRODUCTS
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data: RawProduct[] = await res.json();

    return data.map(formatProduct);
  } catch (error) {
    console.error("Erro getProducts:", error);
    return allProducts.map(formatProduct);
  }
}

// 🔹 FEATURED PRODUCTS
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch featured products");

    const data: RawProduct[] = await res.json();

    return data.slice(0, 4).map(formatProduct);
  } catch (error) {
    if (!isBuild) {
      console.error("Erro getFeaturedProducts:", error);
    }

    return allProducts.slice(0, 4).map(formatProduct);
  }
}

// 🔹 GET PRODUCT BY ID
export async function getProductById(
  id: string
): Promise<Product | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const product: RawProduct = await res.json();

    return formatProduct(product);
  } catch (error) {
    console.error("Erro getProductById:", error);
    return null;
  }
}