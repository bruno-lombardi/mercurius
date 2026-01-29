"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/app/components/ImageUpload";

export default function ProductNewForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const newProduct = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      condition: formData.get("condition") as string,
      dimensions: formData.get("dimensions") as string,
      images: images,
      sold: false,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Erro ao criar produto");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar produto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Erro</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-800">Sucesso!</h3>
            <p className="text-sm text-green-700 mt-1">Produto criado. Redirecionando...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Informações Básicas */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  placeholder="Ex: Sofá Retrátil 3 Lugares"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    required
                    className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    required
                    className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    placeholder="Ex: Móveis, Eletrodomésticos"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-none"
                  placeholder="Descreva o produto, suas características e estado..."
                />
              </div>
            </div>
          </div>

          {/* Detalhes Adicionais */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Detalhes Adicionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-neutral-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  id="condition"
                  name="condition"
                  placeholder="Ex: Excelente, Bom, Regular"
                  className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-neutral-700 mb-2">
                  Dimensões
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  placeholder="Ex: 120 x 80 x 45 cm"
                  className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Imagens do Produto *</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Faça upload de até 5 imagens. A primeira será a imagem principal.
            </p>
            <ImageUpload images={images} onChange={setImages} maxImages={5} />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={saving || images.length === 0}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Produto
              </>
            )}
          </button>
          <Link
            href="/admin/dashboard"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-neutral-700 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
