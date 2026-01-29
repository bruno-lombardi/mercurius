import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByUsername, verifyPassword } from "@/lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH] Tentativa de login:", {
            username: credentials?.username,
            hasPassword: !!credentials?.password,
          });

          if (!credentials?.username || !credentials?.password) {
            console.log("[AUTH] Credenciais vazias");
            return null;
          }

          // Busca usuário no banco de dados
          const user = await getUserByUsername(credentials.username as string);

          if (!user) {
            console.log("[AUTH] Usuário não encontrado");
            return null;
          }

          // Verifica se usuário está ativo
          if (!user.active) {
            console.log("[AUTH] Usuário inativo");
            return null;
          }

          // Verifica senha
          const isValid = await verifyPassword(
            credentials.password as string,
            user.passwordHash
          );

          console.log("[AUTH] Senha válida?", isValid);

          if (!isValid) {
            console.log("[AUTH] Senha incorreta");
            return null;
          }

          console.log("[AUTH] Login bem-sucedido!", {
            id: user._id,
            name: user.name,
            role: user.role,
          });

          return {
            id: user._id as string,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("[AUTH] Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona role ao token na primeira vez
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona role à sessão
      if (session.user) {
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
