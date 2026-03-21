export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];              // array de imagens
  category: string;
  categorySlug: string; 
  description?: string;
  installment?: string;
  pixPrice?: number;
  relatedProducts?: Product[];   // produtos relacionados
}