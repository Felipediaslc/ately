"use client";

import Link from "next/link";

interface Props {
  productName?: string;
  categoryName?: string;
  categorySlug?: string;
}

export default function Breadcrumb({
  productName,
  categoryName,
  categorySlug,
}: Props) {
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
        {categoryName && (
          <>
            <li className="text-gray-400">{' > '}</li>

            {/* 🔥 Se tiver produto → categoria é link */}
            {productName ? (
              <li>
                <Link
                  href={`/products/category/${categorySlug}`}
                  className="hover:text-fuchsia-900 transition-colors font-medium"
                >
                  {categoryName}
                </Link>
              </li>
            ) : (
              /* 🔥 Se NÃO tiver produto → categoria é página atual */
              <li className="text-gray-700 font-medium">
                {categoryName}
              </li>
            )}
          </>
        )}

        {/* Produto */}
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