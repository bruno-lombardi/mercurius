import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import { getProducts } from "@/lib/products";
import type { Metadata } from "next";

// Revalida a cada 30 segundos (ISR)
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Vendendo Tudo - Móveis e Eletrodomésticos em São Paulo",
  description: "Estou de mudança e criei essa página para divulgar móveis e eletrodomésticos dos quais estou me desfazendo. Retirada em Jundiaí - São Paulo.",
};

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-white text-gray-600">
      <Header />

      {/* Hero Banner */}
      <section
        className="w-full mx-auto flex pt-12 md:pt-0 md:items-center bg-cover bg-center"
        style={{
          maxWidth: "1600px",
          height: "32rem",
          backgroundImage:
        "url('/imagens/sala.jpeg')",
        }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col w-full lg:w-1/2 justify-center items-start px-6 tracking-wide">
        <h1 className="text-white text-4xl my-4 font-bold">
          Móveis e Eletrodomésticos
        </h1>
        <p className="text-xl text-white mb-4">
          Vendo diversos itens em ótimo estado.
        </p>
        <a
          className="text-xl inline-block no-underline border-b-2 border-white leading-relaxed text-white hover:text-black hover:bg-white hover:border-black px-2 transition-all duration-300 ease-in-out active:scale-95"
          href="#produtos"
        >
          ver produtos
        </a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-white py-8" id="produtos">
        <div className="container mx-auto pt-4">
          <nav className="w-full z-30 top-0 px-6 py-1">
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
              <a
                className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl"
                href="#produtos"
              >
                Produtos
              </a>
            </div>
          </nav>

          <ProductGrid initialProducts={products} />
        </div>
      </section>

      {/* Pickup Location Banner */}
      <section className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Informações de Retirada
            </h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <svg
                className="w-5 h-5 text-gray-600 flex-shrink-0"
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
              <p className="text-base">
                <strong>Apenas retirada no local</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-base">
                Horto Santo Antônio, Jundiaí - SP
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
