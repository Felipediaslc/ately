export interface CartItem {
  productId: string; // ← era _id
  sku?: string; 
  title: string;
  price: number;
   image?: string;
  images?: string[];
  quantity: number;
  installment?: string;
  pixPrice?: number;
}