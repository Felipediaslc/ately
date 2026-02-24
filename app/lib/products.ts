import { Product } from "../types/product"

export async function getProducts(price?: string): Promise<Product[]> {
  // Simulação de banco
  const allProducts: Product[] = [
    { id: "1", title: "Terço de Madeira", price: 35, image: "/image/produto01.png" },
    { id: "2", title: "Imagem de Santo", price: 75, image: "/image/produto02.png" },
    { id: "3", title: "Bíblia Sagrada", price: 150, image: "/image/produto03.png" },
    { id: "4", title: "Cruz de Madeira", price: 50, image: "/image/produto04.png" },
    { id: "5", title: "Vela de Cera", price: 15, image: "/image/produto05.png" },
    { id: "6", title: "Candelabro de Prata", price: 200, image: "/image/produto06.png" },
  ]

  if (!price) return allProducts

  const [min, max] = price.split("-")

  return allProducts.filter(product => {
    if (max === "*") {
      return product.price >= Number(min)
    }

    return (
      product.price >= Number(min) &&
      product.price <= Number(max)
    )
  })
}