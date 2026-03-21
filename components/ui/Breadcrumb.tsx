"use client";

import Link from "next/link";

interface Props {
  productName?: string;   // Nome do produto
  categoryName?: string;  // Categoria do produto
  categorySlug?: string;  // Slug pra link
}

export default function Breadcrumb({ productName, categoryName, categorySlug }: Props) {
  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home */}
        <li>
          <Link href="/" className="hover:text-fuchsia-900 transition-colors">
            Home
          </Link>
        </li>

        <li className="text-gray-400">{' > '}</li>

        {/* Produtos */}
        <li>
          <Link href="/products" className="hover:text-fuchsia-900 transition-colors">
            Produtos
          </Link>
        </li>

        {/* Categoria */}
        {categoryName && categorySlug && (
          <>
            <li className="text-gray-400">{' > '}</li>
            <li>
              <Link
                href={`/products/category/${categorySlug}`}
                className="hover:text-fuchsia-900 transition-colors font-medium"
              >
                {categoryName}
              </Link>
            </li>
          </>
        )}

        {/* Produto atual */}
        {productName && (
          <>
            <li className="text-gray-400">{' > '}</li>
            <li className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none">
              {productName}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}