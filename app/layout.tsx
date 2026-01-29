import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "./components/SessionProvider";
import { Analytics } from '@vercel/analytics/next';

const workSans = Work_Sans({
  weight: ["200", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "Móveis e Eletrodomésticos - Venda",
  description: "Móveis e eletrodomésticos à venda - Mudança de casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${workSans.variable} font-sans antialiased bg-white text-gray-600`}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
