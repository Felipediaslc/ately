export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  categorySlug: string;
  description?: string;
  installment?: string;
  pixPrice?: number;
  badge?: "Peça única" | "Edição limitada" | "Feito à mão";
  stock?: "in_stock" | "low_stock" | "out_of_stock";
  sku?: string;
  deliveryDays?: number;
  relatedProducts?: Product[];
}

