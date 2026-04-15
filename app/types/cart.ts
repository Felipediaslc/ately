export interface CartItem {
  id: string;
  sku?: string; 
  title: string;
  price: number;
  image: string;
  quantity: number;
  installment?: string;
  pixPrice?: number;
}