/**
 * Script para adicionar slugs aos produtos existentes no banco de dados
 * Execute: npm run add-slugs
 */

import { MongoClient, Db } from 'mongodb';
import { slugify, generateUniqueSlug } from '../lib/slugify';

interface Product {
  _id: string;
  name: string;
  slug?: string;
}

async function addSlugsToProducts() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Erro: MONGODB_URI não está definida no arquivo .env.local');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Conectado ao MongoDB');

    const db: Db = client.db('mercurius');
    const collection = db.collection<Product>('products');

    // Cria índice único para slugs
    try {
      await collection.createIndex({ slug: 1 }, { unique: true });
      console.log('✓ Índice único criado para campo slug');
    } catch (error) {
      console.log('⚠️  Índice já existe ou erro ao criar:', (error as Error).message);
    }

    // Busca todos os produtos
    const products = await collection.find({}).toArray();
    console.log(`\n📦 Encontrados ${products.length} produtos`);

    const existingSlugs: string[] = [];
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Se já tem slug, pula
      if (product.slug) {
        console.log(`⏭️  Pulando "${product.name}" - já tem slug: ${product.slug}`);
        existingSlugs.push(product.slug);
        skipped++;
        continue;
      }

      // Gera slug único
      const baseSlug = slugify(product.name);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      existingSlugs.push(uniqueSlug);

      // Atualiza no banco
      await collection.updateOne(
        { _id: product._id },
        { $set: { slug: uniqueSlug, updatedAt: new Date() } }
      );

      console.log(`✓ Atualizado "${product.name}" → ${uniqueSlug}`);
      updated++;
    }

    console.log(`\n✅ Migração concluída!`);
    console.log(`   - ${updated} produtos atualizados`);
    console.log(`   - ${skipped} produtos já tinham slug`);

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✓ Conexão fechada');
  }
}

// Executa o script
addSlugsToProducts();
