import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import DeleteProductButton from "./DeleteProductButton";
import CategoryTotalsAccordion from "./CategoryTotalsAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Admin",
  description: "Painel de administração de produtos",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const products = await getProducts();

  const stats = {
    total: products.length,
    available: products.filter((p) => !p.sold).length,
    sold: products.filter((p) => p.sold).length,
  };

  // Calcula o valor total dos produtos (considerando desconto)
  const calcTotalValue = (items: typeof products) =>
    items.reduce((acc, p) => {
      const finalPrice =
        p.discount && p.discount > 0
          ? p.price * (1 - p.discount / 100)
          : p.price;
      return acc + (finalPrice || 0);
    }, 0);

  const availableValue = calcTotalValue(products.filter((p) => !p.sold));
  const soldValue = calcTotalValue(products.filter((p) => p.sold));
  const totalValue = availableValue + soldValue;

  // Calcula valor por categoria (considerando desconto) e quantidade
  const categoryMap = new Map<string, { value: number; count: number }>();
  products.forEach((p) => {
    const finalPrice =
      p.discount && p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
    const cat = p.category || "Sem categoria";
    const prev = categoryMap.get(cat) || { value: 0, count: 0 };
    prev.value += finalPrice || 0;
    prev.count += 1;
    categoryMap.set(cat, prev);
  });

  const categoriesTotals = Array.from(categoryMap.entries()).map(
    ([category, { value, count }]) => ({
      category,
      value,
      count,
    }),
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-neutral-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Olá, {session.user?.name || "Admin"} 👋
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Ver Site
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Products Card */}
          <div className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    Total
                  </p>
                  <p className="text-4xl font-light text-neutral-900 mb-1">
                    {stats.total}
                  </p>
                  <p className="text-xs text-neutral-400">
                    produtos cadastrados
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <p className="mt-2 text-sm text-neutral-700 flex items-center gap-2 flex-1">
                  Valor total:
                  <span className="ml-2 text-base font-semibold text-neutral-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalValue)}
                  </span>
                  <span
                    className="ml-2 text-neutral-400"
                    title="Os valores exibidos já consideram descontos aplicados aos produtos"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 9h1v4H9V9z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </p>
                {/* Accordion with per-category totals (client component) */}
                <CategoryTotalsAccordion categories={categoriesTotals} />
              </div>
            </div>
          </div>

          {/* Available Products Card */}
          <div className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Disponíveis
                </p>
                <p className="text-4xl font-light text-neutral-900 mb-1">
                  {stats.available}
                </p>
                <p className="text-xs text-neutral-400">prontos para venda</p>
                <p className="mt-2 text-sm text-neutral-700">
                  Valor total:
                  <span className="ml-2 text-base font-semibold text-neutral-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(availableValue)}
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Sold Products Card */}
          <div className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-neutral-300 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Vendidos
                </p>
                <p className="text-4xl font-light text-neutral-900 mb-1">
                  {stats.sold}
                </p>
                <p className="text-xs text-neutral-400">já foram vendidos</p>
                <p className="mt-2 text-sm text-neutral-700">
                  Valor total:
                  <span className="ml-2 text-base font-semibold text-neutral-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(soldValue)}
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-light text-neutral-900">Produtos</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Gerencie seu inventário
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-all duration-200 hover:shadow-md"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo Produto
            </Link>
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="border-b border-neutral-200 last:border-b-0 p-4 hover:bg-neutral-50 transition-colors duration-200"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                    <Image
                      src={product.image || product.images[0]}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 truncate">
                      {product.name} {product._id}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg font-light text-neutral-900">
                        R$ {product.price.toLocaleString("pt-BR")}
                      </p>
                      {product.discount && product.discount > 0 && (
                        <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {product.sold ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                          Vendido
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Disponível
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/produto/${product.slug}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                      >
                        Ver
                      </Link>
                      <div className="inline-flex items-center justify-center px-3 py-1.5 border border-neutral-300 rounded-lg bg-white">
                        <DeleteProductButton
                          productId={product._id?.toString() || ""}
                          productName={product.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                          <Image
                            src={product.image || product.images[0]}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-500">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">
                          R$ {product.price.toLocaleString("pt-BR")}
                        </span>
                        {product.discount && product.discount > 0 && (
                          <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.sold ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                          Vendido
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Disponível
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="inline-flex items-center text-neutral-700 hover:text-neutral-900 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Editar
                        </Link>
                        <Link
                          href={`/produto/${product.slug}`}
                          target="_blank"
                          className="inline-flex items-center text-neutral-700 hover:text-neutral-900 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Ver
                        </Link>
                        <DeleteProductButton
                          productId={product._id?.toString() || ""}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
