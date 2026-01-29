import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { products } from "./data/products";

export default function Home() {
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
          Produtos de qualidade por preços justos
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
        <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
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

          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
            >
              <Link href={`/produto/${product.id}`}>
                <div className="relative">
                  <Image
                    className={`hover:scale-105 hover:shadow-lg transition-all duration-300 rounded-lg ${
                      product.sold ? "opacity-60" : ""
                    }`}
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    style={{ objectFit: "cover", aspectRatio: "1/1" }}
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
                  <p className={`font-semibold ${product.sold ? "text-gray-500 line-through" : "text-gray-900"}`}>
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
                <p className={`pt-1 font-bold text-lg ${product.sold ? "text-gray-500 line-through" : "text-gray-900"}`}>
                  R$ {product.price.toLocaleString("pt-BR")}
                </p>
                {product.sold && (
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    Produto já vendido
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-8" id="sobre">
        <div className="container py-8 px-6 mx-auto">
          <a
            className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl mb-8"
            href="#sobre"
          >
            Sobre
          </a>

          <p className="mt-8 mb-8">
            Estou me mudando de casa e preciso vender alguns móveis e
            eletrodomésticos que não vou levar comigo. Todos os produtos estão em
            excelente estado de conservação e foram bem cuidados.
            <br />
            <br />
            Para mais informações, fotos adicionais ou para agendar uma visita,
            entre em contato via WhatsApp. Aceito negociação em compras múltiplas!
          </p>
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
