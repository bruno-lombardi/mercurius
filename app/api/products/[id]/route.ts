import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { slugify, generateUniqueSlug } from '@/lib/slugify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    // Busca por ObjectId
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...product, _id: product._id.toString() }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const body = await request.json();
    
    // Se o nome foi alterado, atualiza o slug
    const currentProduct = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });
    
    let slug = currentProduct?.slug;
    
    // Se o nome mudou ou não existe slug, gera um novo
    if (!slug || body.name !== currentProduct?.name) {
      const baseSlug = slugify(body.name);
      
      // Busca slugs existentes (excluindo o produto atual)
      const existingProducts = await db
        .collection('products')
        .find(
          { _id: { $ne: new ObjectId(id) } },
          { projection: { slug: 1 } }
        )
        .toArray();
      
      const existingSlugs = existingProducts.map(p => p.slug).filter(Boolean);
      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }
    
    const updateData = {
      ...body,
      slug,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Revalida o cache do Next.js (on-demand revalidation)
    try {
      const revalidateUrl = new URL('/api/revalidate', request.url);
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          slug: slug,
          secret: process.env.REVALIDATE_SECRET,
        }),
      });
    } catch (revalidateError) {
      // Não falha a requisição se a revalidação falhar
      console.warn('Failed to revalidate cache:', revalidateError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      slug: slug,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    const body = await request.json();
    
    // Remove _id do body se existir
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = body;
    
    const result = await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date(),
          }
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Buscar e retornar o produto atualizado
    const updatedProduct = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('mercurius');
    
    // Busca o produto antes de deletar para pegar o slug
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });
    
    const result = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Revalida o cache (home e página do produto)
    try {
      const revalidateUrl = new URL('/api/revalidate', request.url);
      await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          slug: product?.slug,
          secret: process.env.REVALIDATE_SECRET,
        }),
      });
    } catch (revalidateError) {
      console.warn('Failed to revalidate cache:', revalidateError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
