import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
