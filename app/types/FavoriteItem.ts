export interface FavoriteItem {
  id: string;
  sku?: string;  
  title: string;
  price: number;
  image: string;
  installment?: string;
  pixPrice?: number;
}