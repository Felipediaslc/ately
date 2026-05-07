export interface FavoriteItem {
  productId: string; // ← era _id
  sku?: string;  
  title: string;
  price: number;
  images?: string[];
  installment?: string;
  pixPrice?: number;
}