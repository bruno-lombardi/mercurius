import { MongoClient } from 'mongodb';
import { products } from '../app/data/products';

// Este script migra os produtos do arquivo local para o MongoDB
async function migrateProducts() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('mercurius');
    const collection = db.collection('products');

    // Limpa a coleção existente
    await collection.deleteMany({});
    console.log('Cleared existing products');

    // Insere os produtos
    const productsWithDates = products.map((product) => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(productsWithDates);
    console.log(`Inserted ${result.insertedCount} products`);

    // Lista os produtos inseridos
    const insertedProducts = await collection.find({}).toArray();
    console.log('\nInserted products:');
    insertedProducts.forEach((p) => {
      console.log(`- ${p.name} (${p.id})`);
    });
  } catch (error) {
    console.error('Error migrating products:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nMigration completed!');
  }
}

migrateProducts();
