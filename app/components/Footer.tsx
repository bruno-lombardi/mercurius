"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className=" bg-white py-8 border-t border-gray-400">
      <div className="flex justify-center">
        <div className="container flex px-6 py-8">
          <div className="w-full mx-auto flex flex-wrap">
            <div className="flex w-full lg:w-1/2">
              <div className="px-3 md:px-0">
                <h3 className="font-bold text-gray-900">Sobre</h3>
                <p className="py-4">
                  Estou me mudando de casa e preciso vender alguns móveis e
                  eletrodomésticos. Todos os itens estão em excelente estado de
                  conservação. Entre em contato via WhatsApp para mais
                  informações, fotos adicionais ou para agendar uma visita.
                </p>
              </div>
            </div>
            <div className="flex w-full lg:w-1/2 lg:justify-end lg:text-right mt-6 md:mt-0">
              <div className="px-3 md:px-0">
                <h3 className="text-left font-bold text-gray-900">Contato</h3>
                <div className="py-4 mt-0">
                  <a
                    href="https://wa.me/5511957706296"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-900 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
                    </svg>
                    <span className="text-sm">WhatsApp: (11) 95770-6296</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Button */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <div className="container mx-auto px-6 flex justify-center">
          <Link
            href={session ? "/admin/dashboard" : "/admin/login"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{session ? "Dashboard" : "Painel Administrativo"}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
