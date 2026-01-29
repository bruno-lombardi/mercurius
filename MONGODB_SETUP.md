# Configuração MongoDB na Vercel

Este guia explica como configurar o MongoDB Atlas através da loja de integrações da Vercel.

## Passos para Configuração

### 1. Adicionar Integração MongoDB na Vercel

1. Acesse seu projeto na [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Integrations**
3. Procure por "MongoDB Atlas" ou acesse: https://vercel.com/integrations/mongodbatlas
4. Clique em **Add Integration**
5. Selecione o projeto `mercurius`
6. Autorize a integração com sua conta MongoDB Atlas
7. A Vercel criará automaticamente:
   - Um cluster MongoDB (se você não tiver um)
   - Um database user
   - A variável de ambiente `MONGODB_URI`

### 2. Configurar Localmente

Após adicionar a integração na Vercel:

1. No Dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Copie o valor da variável `MONGODB_URI`
3. Crie um arquivo `.env.local` na raiz do projeto:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mercurius?retryWrites=true&w=majority
```

4. Cole o valor copiado

### 3. Migrar Dados Iniciais

Após configurar o `.env.local`, execute o script de migração:

```bash
npm run migrate
```

Este script irá:
- Conectar ao MongoDB
- Limpar dados existentes (se houver)
- Inserir todos os produtos do arquivo `app/data/products.ts`

### 4. Testar a API

#### Listar todos os produtos
```bash
# Local
curl http://localhost:3000/api/products

# Produção (após deploy)
curl https://seu-projeto.vercel.app/api/products
```

#### Buscar um produto específico
```bash
curl http://localhost:3000/api/products/1
```

#### Criar um novo produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "9",
    "name": "Mesa de Jantar",
    "price": 800,
    "description": "Mesa de jantar para 6 pessoas",
    "category": "móveis",
    "images": ["https://images.unsplash.com/photo-1..."],
    "sold": false
  }'
```

#### Atualizar um produto
```bash
curl -X PUT http://localhost:3000/api/products/<mongodb_id> \
  -H "Content-Type: application/json" \
  -d '{"sold": true}'
```

#### Deletar um produto
```bash
curl -X DELETE http://localhost:3000/api/products/<mongodb_id>
```

## Estrutura da API

### Endpoints Disponíveis

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/[id]` - Busca um produto por ID do MongoDB
- `POST /api/products` - Cria um novo produto
- `PUT /api/products/[id]` - Atualiza um produto
- `DELETE /api/products/[id]` - Remove um produto

### Estrutura do Produto

```typescript
{
  _id: ObjectId,           // ID do MongoDB (gerado automaticamente)
  id: string,              // ID customizado do produto
  name: string,
  price: number,
  description: string,
  category: string,
  images: string[],
  sold?: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Segurança

⚠️ **Importante:**
- Nunca commite o arquivo `.env.local` (já está no `.gitignore`)
- A `MONGODB_URI` contém credenciais sensíveis
- Para produção, sempre use as variáveis de ambiente da Vercel

## Próximos Passos

Após configurar o MongoDB, você pode:

1. **Atualizar as páginas para usar a API:**
   - Modificar `app/page.tsx` para buscar produtos de `/api/products`
   - Modificar `app/produto/[id]/page.tsx` para buscar de `/api/products/[id]`

2. **Criar um painel admin:**
   - Adicionar/editar/remover produtos através da interface
   - Marcar produtos como vendidos

3. **Adicionar autenticação:**
   - Proteger rotas de criação/edição/exclusão
   - Usar NextAuth.js ou similar

## Troubleshooting

### Erro: "MONGODB_URI não definida"
- Verifique se o arquivo `.env.local` existe
- Confirme que a variável está correta
- Reinicie o servidor de desenvolvimento

### Erro de Conexão
- Verifique se seu IP está na whitelist do MongoDB Atlas
- No MongoDB Atlas, vá em Network Access e adicione `0.0.0.0/0` (permite todos os IPs)

### Produtos não aparecem após migração
- Execute `npm run migrate` novamente
- Verifique os logs do script
- Confirme que está usando o database correto (`mercurius`)
