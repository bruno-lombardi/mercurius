import clientPromise from '@/lib/mongodb';
import type { Product } from '@/types/product';
import { ObjectId } from 'mongodb';

// Função auxiliar para buscar produtos da API
export async function getProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const products = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    // Converte ObjectId para string para serialização
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      image: product.images[0], // Primeiro imagem como principal
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    // Busca por _id (ObjectId)
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return null;
    }

    return {
      ...product,
      _id: product._id.toString(),
      image: product.images?.[0], // Primeiro imagem como principal
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
