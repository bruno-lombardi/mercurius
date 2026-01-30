"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface ProductFiltersProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  sortBy: string;
  showSold: boolean;
}

export default function ProductFilters({ categories, onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "todas",
    sortBy: "recentes",
    showSold: true,
  });

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6 mb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          {/* Categoria */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label htmlFor="category" className="text-xs uppercase tracking-wide font-semibold text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="block w-full md:w-52 px-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25rem',
                paddingRight: '2.5rem',
              }}
            >
              <option value="todas">Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label htmlFor="sortBy" className="text-xs uppercase tracking-wide font-semibold text-gray-700">
              Ordenar
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="block w-full md:w-52 px-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25rem',
                paddingRight: '2.5rem',
              }}
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="nome-az">Nome (A-Z)</option>
              <option value="nome-za">Nome (Z-A)</option>
            </select>
          </div>

          {/* Toggle Vendidos */}
          <div className="flex items-center gap-2">
            <label htmlFor="showSold" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  id="showSold"
                  checked={filters.showSold}
                  onChange={(e) => handleFilterChange("showSold", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-900 peer-focus:ring-offset-2 transition-all peer-checked:bg-gray-900"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                Mostrar vendidos
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export function filterAndSortProducts(products: Product[], filters: FilterState): Product[] {
  let filtered = [...products];

  // Filtrar por categoria
  if (filters.category !== "todas") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Filtrar vendidos
  if (!filters.showSold) {
    filtered = filtered.filter((p) => !p.sold);
  }

  // Ordenar
  switch (filters.sortBy) {
    case "recentes":
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case "antigos":
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      break;
    case "menor-preco":
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      });
      break;
    case "maior-preco":
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
        return priceB - priceA;
      });
      break;
    case "nome-az":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nome-za":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return filtered;
}
