import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Admin",
  description: "Área administrativa - Faça login para continuar",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
