export interface Product {
  _id: string;
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

  relatedProducts?: Product[];
}
