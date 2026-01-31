"use client";

import { useState } from "react";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import Link from "next/link";
import PriceDisplay from "./PriceDisplay";
import ProductFilters, { filterAndSortProducts, type FilterState } from "./ProductFilters";
import type { Product } from "@/types/product";

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "todas",
    sortBy: "recentes",
    showSold: true,
  });

  // Extrai categorias únicas
  const categories = Array.from(new Set(initialProducts.map((p) => p.category))).sort();

  // Aplica filtros e ordenação
  const filteredProducts = filterAndSortProducts(initialProducts, filters);

  return (
    <>
      <ProductFilters categories={categories} onFilterChange={setFilters} />

      {/* Contador de resultados */}
      <div className="container mx-auto px-6 mb-6">
        <p className="text-sm text-gray-600">
          {filteredProducts.length === 0 ? (
            "Nenhum produto encontrado"
          ) : (
            <>
              <strong className="font-semibold text-gray-900">{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "produto" : "produtos"}
            </>
          )}
        </p>
      </div>

      {/* Product Cards */}
      <div className="container mx-auto flex items-center flex-wrap pb-12">
        {filteredProducts.length === 0 ? (
          <div className="w-full text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-gray-300 stroke-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <div>
                <p className="text-base font-medium text-gray-700 mb-1">
                  Nenhum produto encontrado
                </p>
                <p className="text-sm text-gray-500">
                  Ajuste os filtros para ver mais produtos
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
            >
              <Link href={`/produto/${product.slug}`}>
                <div className="relative">
                  <Image
                    className={`hover:scale-105 hover:shadow-lg transition-all duration-300 rounded-lg ${
                      product.sold ? "opacity-60" : ""
                    }`}
                    src={product.image || product.images[0]}
                    alt={product.name}
                    width={400}
                    height={400}
                    style={{ objectFit: "cover", aspectRatio: "1/1" }}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400,400))}`}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">
                    {product.category}
                  </span>

                  {/* Sold Badge */}
                  {product.sold && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transform rotate-[-5deg]">
                        VENDIDO
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-3 flex items-center justify-between">
                  <p
                    className={`font-semibold ${product.sold ? "text-gray-500 line-through" : "text-gray-900"}`}
                  >
                    {product.name}
                  </p>
                  <svg
                    className="h-6 w-6 fill-current text-gray-500 hover:text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
                  </svg>
                </div>
                <div className="pt-1">
                  {product.sold ? (
                    <p className="font-bold text-lg text-gray-500 line-through">
                      R$ {product.price.toLocaleString("pt-BR")}
                    </p>
                  ) : (
                    <PriceDisplay
                      price={product.price}
                      discount={product.discount}
                      size="small"
                    />
                  )}
                </div>
                {product.sold && (
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    Produto já vendido
                  </p>
                )}
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
