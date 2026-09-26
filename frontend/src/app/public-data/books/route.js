import { getPublicBooks } from '@/lib/publicCatalog';

// Public catalog for visitors who are not logged in (see src/lib/publicCatalog.js).
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await getPublicBooks());
  } catch {
    return Response.json({ detail: 'تعذر تحميل الكتب حالياً.' }, { status: 502 });
  }
}
