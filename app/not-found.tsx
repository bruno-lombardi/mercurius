import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-gray-700 p-6">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
        <p className="text-base mb-6">
          Desculpe — a página que você procura não existe ou pode ter sido
          removida.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-3 text-white rounded-md bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 shadow-md hover:shadow-lg transition-transform transition-colors duration-200 ease-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
