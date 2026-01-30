"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import ImageUpload from "@/app/components/ImageUpload";
import PriceDisplay from "@/app/components/PriceDisplay";

export default function ProductEditForm({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [previewPrice, setPreviewPrice] = useState<number>(0);
  const [previewDiscount, setPreviewDiscount] = useState<number>(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (!data.success) {
          setError("Produto não encontrado");
          return;
        }

        setProduct(data.data);
        setImages(data.data.images || []);
        setPreviewPrice(data.data.price || 0);
        setPreviewDiscount(data.data.discount || 0);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const updatedProduct = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      discount: formData.get("discount") ? parseFloat(formData.get("discount") as string) : undefined,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      condition: formData.get("condition") as string,
      dimensions: formData.get("dimensions") as string,
      images: images,
      sold: formData.get("sold") === "on",
    };

    // Decide entre PUT e PATCH: se o nome mudou, usamos PUT (gera/atualiza slug e revalida cache).
    const originalName = product?.name || "";
    const nameChanged = (updatedProduct.name || "").trim() !== originalName.trim();
    const method = nameChanged ? "PUT" : "PATCH";

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Erro ao atualizar produto");
        return;
      }

      setSuccess(true);

      // Se usamos PATCH o endpoint já retorna o produto atualizado em data.data
      if (method === "PATCH") {
        if (data.data) {
          setProduct(data.data);
          setImages(data.data.images || []);
        }
      } else {
        // PUT retorna apenas sucesso + slug; re-fetch o produto para atualizar o estado local
        try {
          const refetch = await fetch(`/api/products/${productId}`);
          const refetchJson = await refetch.json();
          if (refetchJson.success) {
            setProduct(refetchJson.data);
            setImages(refetchJson.data.images || []);
          }
        } catch (refetchErr) {
          // não falha a submissão por conta do re-fetch
          console.warn("Falha ao refetch o produto após PUT:", refetchErr);
        }
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar produto");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        <p className="mt-4 text-sm text-neutral-500">Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-red-800">Erro ao carregar produto</h3>
          <p className="text-sm text-red-700 mt-1">{error || "Produto não encontrado"}</p>
        </div>
      </div>
    );
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
            <p className="text-sm text-green-700 mt-1">Produto atualizado.</p>
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
                  defaultValue={product.name}
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
                    defaultValue={product.price}
                    onChange={(e) => setPreviewPrice(parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-neutral-700 mb-2">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue={product.discount || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPreviewDiscount(value === '' ? 0 : parseFloat(value) || 0);
                    }}
                    className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Deixe em branco para nenhum desconto</p>
                </div>
              </div>

              {/* Preview do Preço */}
              {previewPrice > 0 && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <p className="text-xs font-medium text-neutral-600 mb-2">Preview do Preço:</p>
                  <PriceDisplay 
                    price={previewPrice} 
                    discount={previewDiscount > 0 ? previewDiscount : undefined}
                    size="medium"
                  />
                </div>
              )}

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                  Categoria *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  required
                  defaultValue={product.category}
                  className="block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  placeholder="Ex: Móveis, Eletrodomésticos"
                />
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
                  defaultValue={product.description}
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
                  defaultValue={product.condition}
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
                  defaultValue={product.dimensions}
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

          {/* Status */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Status de Venda</h3>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="sold"
                name="sold"
                defaultChecked={product.sold}
                className="mt-1 h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded"
              />
              <div>
                <label htmlFor="sold" className="block text-sm font-medium text-neutral-900">
                  Marcar como vendido
                </label>
                <p className="text-sm text-neutral-500 mt-0.5">
                  O produto não aparecerá mais na lista de disponíveis
                </p>
              </div>
            </div>
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
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar Alterações
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
