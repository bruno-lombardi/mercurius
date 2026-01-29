# Dashboard Administrativo - Guia de Configuração

Este guia explica como configurar e usar o dashboard administrativo do Mercurius.

## 🔐 Configuração de Autenticação

### 1. Gerar SECRET para NextAuth

Execute no PowerShell:
```powershell
npm install -g openssl
openssl rand -base64 32
```

Ou use um gerador online: https://generate-secret.vercel.app/32

### 2. Configurar .env.local

Adicione as seguintes variáveis ao seu `.env.local`:

```env
# MongoDB (já configurado)
MONGODB_URI=mongodb+srv://...

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$rBV2Oe4Y7qYs5gYJvXvDLOrQ3uVKZk8PxvVHN4dqvX/H4L.QqmwVa
```

### 3. Gerar Hash de Senha Personalizada

Para criar uma senha diferente de "admin123":

```bash
# Gera hash para senha personalizada
npm run generate-password "minhasenha123"

# Copie o hash gerado e adicione ao .env.local
ADMIN_PASSWORD_HASH=<hash-gerado>
```

## 📊 Usando o Dashboard

### Acessar o Dashboard

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse: http://localhost:3000/admin/login

3. **Credenciais padrão:**
   - Usuário: `admin`
   - Senha: `admin123`

### Funcionalidades Disponíveis

#### 1. **Dashboard Principal** (`/admin/dashboard`)
- Visão geral de estatísticas:
  - Total de produtos
  - Produtos disponíveis
  - Produtos vendidos
- Lista de todos os produtos com:
  - Imagem miniatura
  - Nome, categoria e preço
  - Status (Disponível/Vendido)
  - Ações (Editar/Ver)

#### 2. **Gerenciar Produtos**
- ✅ **Ver lista** de produtos
- 🔜 **Editar** produtos (próxima etapa)
- 🔜 **Marcar como vendido** (próxima etapa)
- 🔜 **Adicionar novo** produto (próxima etapa)
- 🔜 **Deletar** produtos (próxima etapa)

## 🔒 Segurança

### Proteção de Rotas

- Todas as rotas `/admin/*` (exceto `/admin/login`) estão protegidas
- Middleware verifica autenticação automaticamente
- Redirecionamento para login se não autenticado

### Boas Práticas

1. **Altere a senha padrão** antes do deploy em produção
2. **Use senha forte** (mínimo 12 caracteres)
3. **Mantenha NEXTAUTH_SECRET seguro** (nunca commite no Git)
4. **Em produção**, configure `NEXTAUTH_URL` com seu domínio

### Para Produção na Vercel

Adicione as variáveis de ambiente no Vercel Dashboard:

1. Acesse: Settings → Environment Variables
2. Adicione:
   ```
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   NEXTAUTH_SECRET=<gere-uma-nova-chave>
   ADMIN_USERNAME=seu-usuario
   ADMIN_PASSWORD_HASH=<hash-da-sua-senha>
   ```

## 🎨 Estrutura do Dashboard

```
app/
  admin/
    login/
      page.tsx          # Página de login
    dashboard/
      page.tsx          # Dashboard principal
      LogoutButton.tsx  # Botão de logout
    products/
      [id]/
        edit/
          page.tsx      # 🔜 Editar produto
      new/
        page.tsx        # 🔜 Criar produto
api/
  auth/
    [...nextauth]/
      route.ts          # API do NextAuth
  products/             # APIs já criadas
auth.ts                 # Configuração NextAuth
middleware.ts           # Proteção de rotas
```

## 🚀 Próximos Passos

1. ✅ Autenticação configurada
2. ✅ Dashboard básico criado
3. 🔜 Criar formulário de edição de produtos
4. 🔜 Implementar toggle de "vendido"
5. 🔜 Adicionar formulário para novos produtos
6. 🔜 Implementar exclusão de produtos

## 🐛 Troubleshooting

### Erro: "NEXTAUTH_SECRET não definido"
- Verifique se `.env.local` tem a variável `NEXTAUTH_SECRET`
- Reinicie o servidor após adicionar

### Erro: "Credenciais inválidas"
- Verifique usuário e senha no `.env.local`
- Use o script `generate-password` para criar novo hash

### Erro: "Cannot find module ./LogoutButton"
- Aguarde o TypeScript recarregar
- Reinicie o VS Code se necessário
- Execute `npm run dev` novamente

### Redirecionamento infinito
- Limpe cookies do navegador
- Verifique se `NEXTAUTH_URL` está correto
- Em desenvolvimento, deve ser `http://localhost:3000`
