"use client";

import { useState } from "react";

type CategoryItem = {
  category: string;
  value: number;
  count: number;
};

export default function CategoryTotalsAccordion({ categories }: { categories: CategoryItem[] }) {
  const [open, setOpen] = useState(false);

  const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-150 text-sm text-neutral-700"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </span>
            <div className="text-left">
              <div className="text-sm font-medium text-neutral-900">Valores por categoria</div>
              <div className="text-xs text-neutral-400">Clique para expandir</div>
            </div>
          </div>
          <div className={`text-neutral-500 transform transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </div>
        </button>

        {open && (
          <div className="mt-3 bg-white border border-neutral-100 rounded-lg p-3">
            {categories.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhum produto cadastrado.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {categories.map((c) => (
                  <li key={c.category} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                      <div className="text-sm text-neutral-700">{c.category}</div>
                      <div className="text-xs text-neutral-400">({c.count})</div>
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">{formatter.format(c.value)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
