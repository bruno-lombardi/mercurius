# 📸 Configuração do Cloudinary

## Passo a Passo para obter as credenciais:

### 1. Criar conta no Cloudinary
- Acesse: https://cloudinary.com/users/register_free
- Preencha os dados e crie sua conta gratuita
- Confirme seu email

### 2. Acessar o Dashboard
- Após login, você será direcionado para o Dashboard
- Ou acesse: https://cloudinary.com/console

### 3. Copiar as credenciais
No Dashboard, você verá um box com as seguintes informações:

```
Cloud name: xxxxxxxxx
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWx (clique no "eye" para revelar)
```

### 4. Adicionar ao .env.local
Abra o arquivo `.env.local` e substitua os valores:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

### 5. Reiniciar o servidor
Depois de adicionar as credenciais, reinicie o servidor:

```bash
npm run dev
```

## ✨ Features implementadas:

✅ Upload via drag & drop ou clique
✅ Múltiplas imagens (até 5 por produto)
✅ Preview em tempo real
✅ Progress bar durante upload
✅ Validação de tipo (JPG, PNG, WEBP)
✅ Validação de tamanho (máximo 5MB)
✅ Reordenação de imagens (primeira = principal)
✅ Remoção de imagens
✅ Otimização automática pelo Cloudinary
✅ Compressão e resize para 1200x1200
✅ CDN global

## 📦 Free Tier do Cloudinary:

- 25 GB de storage
- 25 GB de bandwidth/mês
- 25k transformações/mês
- Mais que suficiente para o projeto! 🎉
