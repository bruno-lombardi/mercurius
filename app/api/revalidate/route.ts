import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Rota para revalidação sob demanda do cache do Next.js
 * POST /api/revalidate
 * Body: { type: 'product' | 'home', slug?: string, secret: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, secret } = body;

    // Verifica o secret para segurança
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalida baseado no tipo
    switch (type) {
      case 'product':
        if (!slug) {
          return NextResponse.json(
            { success: false, message: 'Slug is required for product revalidation' },
            { status: 400 }
          );
        }
        // Revalida a página específica do produto
        revalidatePath(`/produto/${slug}`);
        // Revalida a home também (lista de produtos)
        revalidatePath('/');
        break;

      case 'home':
        // Revalida apenas a home
        revalidatePath('/');
        break;

      case 'all':
        // Revalida tudo
        revalidatePath('/', 'layout');
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type. Use: product, home, or all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${type}${slug ? `: ${slug}` : ''}`,
      revalidatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { success: false, message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}
