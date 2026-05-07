export interface Product {
  productId: string; // ← era _id
  title: string;
  price: number;
  images: string[];
  category: string;
  categorySlug?: string;

  description?: string;
  pixPrice?: number;

  stock: number;
  sold: number;

  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;

  sku?: string;
  deliveryDays?: number;

  createdAt: string;
  updatedAt: string;

 relatedProducts?: Pick<Product, "productId" | "title" | "price" | "images">[];
}