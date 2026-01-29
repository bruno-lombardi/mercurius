# 👥 Sistema de Usuários com MongoDB

## 📋 Visão Geral

Sistema completo de autenticação com MongoDB, pronto para produção:

- ✅ Collection `users` no MongoDB
- ✅ Autenticação via banco de dados (não mais hardcoded)
- ✅ Senhas criptografadas com bcrypt
- ✅ Suporte a múltiplos usuários
- ✅ Roles (admin/user)
- ✅ Usuários ativos/inativos
- ✅ Scripts de gerenciamento

## 🚀 Setup Inicial

### 1. Criar Usuário Admin

```bash
npm run setup-admin
```

Isso criará um usuário admin com:
- Username: `admin`
- Senha: `admin123` (ou valor de `ADMIN_PASSWORD` no .env.local)
- Email: `admin@mercurius.com` (ou valor de `ADMIN_EMAIL`)

### 2. Customizar Credenciais (Opcional)

Adicione ao `.env.local` **antes** de rodar o setup:

```env
ADMIN_PASSWORD=MinhaS3nhaF0rte
ADMIN_EMAIL=seu-email@exemplo.com
```

Depois execute:
```bash
npm run setup-admin
```

## 🔐 Gerenciamento de Usuários

### Alterar Senha

```bash
npm run change-password <username> <nova-senha>
```

**Exemplo:**
```bash
npm run change-password admin minhaNovasenha123
```

### Adicionar Novo Usuário Admin (via MongoDB)

Você pode criar novos usuários diretamente via código ou MongoDB Compass:

```javascript
{
  username: "bruno",
  email: "bruno@exemplo.com",
  name: "Bruno Lombardi",
  passwordHash: "$2b$10$...", // Use npm run generate-password
  role: "admin",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

Ou use a função helper:

```typescript
import { createUser } from '@/lib/users';

await createUser({
  username: 'bruno',
  email: 'bruno@exemplo.com',
  name: 'Bruno Lombardi',
  password: 'senha123',
  role: 'admin'
});
```

## 📁 Estrutura da Collection

### Collection: `users`

```typescript
{
  _id: ObjectId,
  username: string,        // Único
  email: string,           // Único
  name: string,
  passwordHash: string,    // Bcrypt hash
  role: 'admin' | 'user',
  active: boolean,         // true/false
  createdAt: Date,
  updatedAt: Date
}
```

### Índices Criados

- `username` (único)
- `email` (único)

## 🛠️ Funções Disponíveis

### `lib/users.ts`

```typescript
// Buscar usuário por username
await getUserByUsername('admin');

// Buscar usuário por email
await getUserByEmail('admin@mercurius.com');

// Criar novo usuário
await createUser({
  username: 'novo',
  email: 'novo@exemplo.com',
  name: 'Novo Usuário',
  password: 'senha123',
  role: 'admin'
});

// Verificar senha
await verifyPassword('senha123', user.passwordHash);

// Alterar senha
await updateUserPassword(userId, 'novaSenha');

// Desativar usuário
await deactivateUser(userId);
```

## 🔒 Autenticação Atualizada

O arquivo `auth.ts` agora:

1. ✅ Busca usuários no MongoDB
2. ✅ Verifica se usuário está ativo
3. ✅ Valida senha com bcrypt
4. ✅ Adiciona `role` à sessão
5. ✅ Logs detalhados para debug

## 📝 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Setup Admin | `npm run setup-admin` | Cria usuário admin inicial |
| Mudar Senha | `npm run change-password <user> <senha>` | Altera senha de usuário |
| Gerar Hash | `npm run generate-password <senha>` | Gera hash bcrypt |
| Testar Senha | `npm run test-password` | Testa hashes do .env.local |

## 🎯 Próximos Passos

### 1. Executar Setup
```bash
npm run setup-admin
```

### 2. Remover Variáveis Antigas do .env.local
Você pode remover (não são mais necessárias):
- ~~`ADMIN_USERNAME`~~
- ~~`ADMIN_PASSWORD_HASH`~~

Mantenha apenas:
```env
MONGODB_URI=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
```

### 3. Testar Login
```bash
npm run dev
# Acesse: http://localhost:3000/admin/login
# Login: admin / admin123 (ou sua senha customizada)
```

## 🚢 Deploy em Produção

### Vercel

1. **Adicione variáveis de ambiente:**
```
MONGODB_URI=sua-connection-string
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=<gere-novo-secret>
```

2. **Após deploy, crie o admin:**
```bash
# Localmente com .env.local apontando para produção
npm run setup-admin

# Ou via MongoDB Compass/Atlas direto na collection users
```

## 🔐 Segurança

### ✅ Implementado
- Senhas com bcrypt (salt rounds: 10)
- Índices únicos para username/email
- Usuários ativos/inativos
- Validação de credenciais
- Role-based access (admin/user)

### 🎯 Recomendações Adicionais
- [ ] Rate limiting no login
- [ ] Two-factor authentication (2FA)
- [ ] Log de tentativas de login
- [ ] Recuperação de senha por email
- [ ] Expiração de sessão configurável

## 🆘 Troubleshooting

### Erro: "Usuário não encontrado"
```bash
# Verifique se o usuário existe
npm run setup-admin
```

### Erro: "Username or email already exists"
```bash
# Use change-password para alterar senha
npm run change-password admin novaSenha
```

### Ver todos os usuários (MongoDB Shell)
```javascript
use mercurius
db.users.find({}, { passwordHash: 0 })
```

## 📚 Referências

- [NextAuth.js Credentials Provider](https://authjs.dev/guides/providers/credentials)
- [bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
