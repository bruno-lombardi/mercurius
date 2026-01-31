import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PriceDisplay from "@/app/components/PriceDisplay";
import ImageCarousel from "@/app/components/ImageCarousel";
import PickupLocationMap from "@/app/components/PickupLocationMap";
import { getProductBySlug, getProducts } from "@/lib/products";
import type { Metadata } from "next";

// Revalida a cada 60 segundos (ISR)
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: `${product.name} - R$ ${product.price.toLocaleString("pt-BR")}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  return (
    <div className="bg-white text-gray-600">
      <Header />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </nav>

      {/* Product Details */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Product Image Carousel */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <ImageCarousel images={product.images} productName={product.name} />
            {product.images.length > 1 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Deslize para ver mais fotos
                </p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 px-4">
            {/* Sold Badge at Top */}
            {product.sold && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow">
                    VENDIDO
                  </div>
                  <p className="text-red-800 font-semibold">
                    Este produto já foi vendido
                  </p>
                </div>
              </div>
            )}

            <h1
              className={`text-4xl font-bold mb-4 ${product.sold ? "text-gray-500" : "text-gray-900"}`}
            >
              {product.name}
            </h1>

            <div className="mb-6">
              {product.sold ? (
                <span className="text-4xl font-bold text-gray-500 line-through">
                  R$ {product.price.toLocaleString("pt-BR")}
                </span>
              ) : (
                <PriceDisplay 
                  price={product.price} 
                  discount={product.discount}
                  size="large"
                />
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-sm font-semibold text-gray-700 w-32">
                  Estado:
                </span>
                <span className="text-sm text-gray-600">
                  {product.condition}
                </span>
              </div>
              {product.dimensions && (
                <div className="flex items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 w-32">
                    Dimensões:
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.dimensions}
                  </span>
                </div>
              )}
              <div className="flex items-center mb-2">
                <span className="text-sm font-semibold text-gray-700 w-32">
                  Categoria:
                </span>
                <span className="text-sm text-gray-600">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-700 w-32">
                  Entrega:
                </span>
                <span className="text-sm text-gray-600 font-semibold">
                  Somente Retirada
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
            {/* Pickup Location Info with Map Accordion */}
            <PickupLocationMap />

            {/* Contact Button */}
            <div className="flex gap-4">
              {!product.sold ? (
                <a
                  href={`https://wa.me/5511957706296?text=Olá! Tenho interesse no produto: ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
                  </svg>
                  Entrar em Contato
                </a>
              ) : (
                <div className="flex-1 bg-gray-400 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-75">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Produto Indisponível
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {product.sold ? (
                  <>
                    ❌ Este produto já foi vendido e não está mais disponível.
                  </>
                ) : (
                  <>
                    💬 Entre em contato via WhatsApp para mais informações,
                    fotos adicionais ou para agendar uma visita!
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-6 py-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Produtos Relacionados
          </h2>
          <div className="flex flex-wrap -mx-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="w-full md:w-1/3 px-4 mb-8"
              >
                <Link href={`/produto/${relatedProduct.slug}`}>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                          src={relatedProduct.image || relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          width={400}
                          height={400}
                          className="hover:scale-105 transition-all duration-300"
                          style={{ objectFit: "cover", aspectRatio: "1/1" }}
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400,400))}`}
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                  </div>
                  <div className="pt-3">
                    <p className="text-gray-900 font-semibold">
                      {relatedProduct.name}
                    </p>
                    <p className="text-gray-900 font-bold text-lg">
                      R$ {relatedProduct.price.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
