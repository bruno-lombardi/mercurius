import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductNewForm from "./ProductNewForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novo Produto - Admin",
  description: "Adicionar novo produto ao catálogo",
};

export default async function NewProductPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-light text-neutral-900 tracking-tight">
                Novo Produto
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Adicione um novo produto ao catálogo
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductNewForm />
      </main>
    </div>
  );
}
