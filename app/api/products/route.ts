import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const products = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const body = await request.json();
    
    // Gera slug baseado no nome do produto
    const baseSlug = slugify(body.name);
    
    // Busca todos os slugs existentes para garantir unicidade
    const existingProducts = await db
      .collection('products')
      .find({}, { projection: { slug: 1 } })
      .toArray();
    
    const existingSlugs = existingProducts.map(p => p.slug).filter(Boolean);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
    
    const product = {
      ...body,
      slug: uniqueSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(product);

    // Revalida o cache da home (lista de produtos)
    try {
      const revalidateUrl = new URL('/api/revalidate', request.url);
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'home',
          secret: process.env.REVALIDATE_SECRET,
        }),
      });
    } catch (revalidateError) {
      console.warn('Failed to revalidate cache:', revalidateError);
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...product, _id: result.insertedId } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
