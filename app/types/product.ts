export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  categorySlug: string;

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

  relatedProducts?: Product[];
}
