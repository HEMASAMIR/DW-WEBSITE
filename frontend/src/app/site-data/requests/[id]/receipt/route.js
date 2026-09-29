import { isAdminRequest } from '@/lib/siteStore';
import { loadRequests, readReceipt } from '@/lib/requestsStore';

// A request's transfer receipt. Admins only; never cached.
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await isAdminRequest(request))) return Response.json({ detail: 'غير مصرح.' }, { status: 403 });
  const { id } = await params;
  const r = (await loadRequests()).find((x) => x.id === id);
  if (!r?.receipt) return Response.json({ detail: 'مفيش صورة تحويل للطلب ده.' }, { status: 404 });
  try {
    const file = await readReceipt(r.receipt);
    return new Response(file.buf, {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `inline; filename="${file.name}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return Response.json({ detail: 'ملف التحويل مش موجود.' }, { status: 404 });
  }
}
