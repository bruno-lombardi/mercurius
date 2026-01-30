# Migração de Slugs

Este guia explica como adicionar slugs aos produtos existentes e criar índices no banco de dados.

## 1. Executar Script de Migração

Para adicionar slugs aos produtos que já existem no banco de dados:

```bash
npm run add-slugs
```

O script irá:
- Conectar ao MongoDB usando variáveis de ambiente do `.env.local`
- Criar índice único para o campo `slug` (se não existir)
- Buscar todos os produtos sem slug
- Gerar slugs únicos baseados no nome
- Atualizar os produtos no banco

## 2. Criar Índice no MongoDB (Automático)

O script de migração já cria automaticamente o índice único para o campo `slug`. Se preferir criar manualmente:

### Via MongoDB Compass:
1. Conecte ao seu banco `mercurius`
2. Abra a collection `products`
3. Vá em "Indexes"
4. Clique em "Create Index"
5. Configure:
   - Field: `slug`
   - Type: `1` (ascending)
   - Options: Marque "unique"

### Via MongoDB Shell:
```javascript
use mercurius
db.products.createIndex({ slug: 1 }, { unique: true })
```

### Via Node.js (Automático):
Você pode criar um script separado ou adicionar esta função em algum lugar do seu código de inicialização:

```javascript
async function createIndexes() {
  const client = await clientPromise;
  const db = client.db('mercurius');
  
  await db.collection('products').createIndex(
    { slug: 1 }, 
    { unique: true }
  );
  
  console.log('✓ Índice de slug criado');
}
```

## O que mudou?

### Tipo Product
```typescript
export interface Product {
  _id?: string;
  name: string;
  slug: string; // ← NOVO campo
  price: number;
  // ...
}
```

### URLs dos Produtos
Antes: `/produto/507f1f77bcf86cd799439011`
Agora: `/produto/sofa-retratil-3-lugares`

### Benefícios:
- ✅ URLs amigáveis para SEO
- ✅ Melhor experiência do usuário
- ✅ URLs descritivas e memoráveis
- ✅ Slugs únicos garantidos
- ✅ Atualização automática quando o nome muda

## Fluxo de Criação/Edição

1. **Criar novo produto**: Slug é gerado automaticamente do nome
2. **Editar nome**: Slug é recalculado automaticamente
3. **Editar outros campos**: Slug permanece o mesmo
4. **Unicidade**: Se já existir o slug, adiciona sufixo numérico (-1, -2, etc.)

## Exemplos de Slugs

| Nome do Produto | Slug Gerado |
|----------------|-------------|
| Sofá Retrátil 3 Lugares | sofa-retratil-3-lugares |
| Mesa de Jantar (Madeira) | mesa-de-jantar-madeira |
| Geladeira Brastemp 450L | geladeira-brastemp-450l |
| Sofá Retrátil 3 Lugares | sofa-retratil-3-lugares-1 |

## Solução de Problemas

### Produtos sem slug
Se algum produto não tiver slug após a migração, ele não será acessível pela nova rota. Execute novamente o script de migração.

### Slugs duplicados
O sistema adiciona sufixos numéricos automaticamente. Se ainda houver problemas, verifique o índice único no MongoDB.

### Rota antiga [id] ainda existe?
Sim, a rota antiga em `app/produto/[id]/page.tsx` ainda existe. Você pode:
- Mantê-la para compatibilidade (301 redirect para slug)
- Removê-la se não precisar de compatibilidade retroativa
