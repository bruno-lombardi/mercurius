# Sistema de Cache e Performance

Este documento explica como o cache e a performance foram otimizados no projeto.

## 🚀 Estratégia de Cache

### ISR (Incremental Static Regeneration)

O projeto usa ISR do Next.js para cachear páginas estaticamente e revalidá-las periodicamente:

#### Página Inicial (`/`)
```typescript
export const revalidate = 30; // Revalida a cada 30 segundos
```
- Cache de 30 segundos
- Lista de produtos é cacheada
- Revalidação automática

#### Páginas de Produto (`/produto/[slug]`)
```typescript
export const revalidate = 60; // Revalida a cada 60 segundos
```
- Cache de 60 segundos por produto
- Páginas são pré-renderizadas em build time
- Revalidação automática

### Revalidação On-Demand

Além da revalidação automática por tempo, o sistema implementa **revalidação sob demanda**:

#### Quando acontece:
- ✅ Produto criado → Revalida home
- ✅ Produto atualizado → Revalida produto e home
- ✅ Produto deletado → Revalida produto e home

#### Como funciona:

1. **API de Revalidação**: `/api/revalidate`
```typescript
POST /api/revalidate
{
  "type": "product" | "home" | "all",
  "slug": "nome-do-produto", // apenas para type: product
  "secret": "seu_secret_aqui"
}
```

2. **Chamadas automáticas**: As rotas de CRUD chamam a API automaticamente:
```typescript
// Exemplo: após atualizar produto
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    type: 'product',
    slug: productSlug,
    secret: process.env.REVALIDATE_SECRET,
  }),
});
```

## 🔒 Segurança

A revalidação requer um **secret** para prevenir abusos:

```env
REVALIDATE_SECRET=sua_string_aleatoria_segura
```

Gere um secret seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Benefícios

### Performance
- ✅ **Primeira carga rápida**: Páginas pré-renderizadas
- ✅ **CDN-friendly**: Conteúdo estático pode ser cacheado em CDN
- ✅ **Menos carga no DB**: MongoDB consultado apenas na revalidação
- ✅ **Latência baixa**: Usuários recebem HTML pré-gerado

### Experiência do Usuário
- ✅ **Páginas instantâneas**: Sem loading de dados
- ✅ **Conteúdo atualizado**: Revalidação automática + on-demand
- ✅ **SEO otimizado**: HTML estático para crawlers

## 🔄 Fluxos de Revalidação

### 1. Criar Produto
```
Admin cria produto
    ↓
POST /api/products
    ↓
MongoDB: INSERT
    ↓
POST /api/revalidate (type: home)
    ↓
Cache da home é limpo
    ↓
Próximo acesso: nova versão gerada
```

### 2. Atualizar Produto
```
Admin atualiza produto
    ↓
PUT /api/products/[id]
    ↓
MongoDB: UPDATE
    ↓
POST /api/revalidate (type: product, slug)
    ↓
Cache do produto E home são limpos
    ↓
Próximos acessos: novas versões geradas
```

### 3. Deletar Produto
```
Admin deleta produto
    ↓
DELETE /api/products/[id]
    ↓
MongoDB: DELETE
    ↓
POST /api/revalidate (type: product, slug)
    ↓
Cache do produto E home são limpos
    ↓
Produto retorna 404, home atualizada
```

## 🛠️ Configuração

### 1. Adicione o secret no `.env.local`:
```env
REVALIDATE_SECRET=seu_secret_aqui
```

### 2. Deploy (Vercel)
As configurações de ISR funcionam automaticamente no Vercel:
- Cache é gerenciado pela plataforma
- Revalidação on-demand é suportada
- Edge caching é automático

### 3. Outras plataformas
Para outras plataformas, certifique-se de:
- Suporte a Next.js ISR
- Configurar cache headers corretamente
- Habilitar revalidação on-demand

## 📈 Monitoramento

### Logs de Revalidação
A API de revalidação retorna logs:
```json
{
  "success": true,
  "message": "Revalidated product: nome-do-produto",
  "revalidatedAt": "2026-01-30T12:00:00.000Z"
}
```

### Headers de Cache
O Next.js adiciona headers automaticamente:
```
Cache-Control: s-maxage=60, stale-while-revalidate
```

## 🔍 Debug

### Forçar revalidação manual
Use a API diretamente:
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "all",
    "secret": "seu_secret"
  }'
```

### Ver cache em desenvolvimento
```bash
# Limpa o cache do Next.js
rm -rf .next/cache

# Reconstruir
npm run build
npm start
```

## ⚡ Otimizações Futuras

Possíveis melhorias:
- [ ] Cache Redis para dados frequentes
- [ ] Service Worker para cache client-side
- [ ] Image optimization com Cloudinary cache
- [ ] API caching com HTTP headers
- [ ] Database indexes para queries rápidas

## 🎯 Métricas Alvo

Com este sistema:
- **TTFB**: < 200ms (first byte)
- **FCP**: < 1s (first contentful paint)
- **LCP**: < 2.5s (largest contentful paint)
- **CLS**: < 0.1 (cumulative layout shift)
- **Lighthouse Score**: 90+

## 📚 Referências

- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [On-Demand Revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
