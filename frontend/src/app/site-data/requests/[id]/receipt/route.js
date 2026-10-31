import { isAdminRequest } from '@/lib/siteStore';
import { loadRequests, readReceipt } from '@/lib/requestsStore';

// A request's transfer receipt. Admins only; never cached.
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await isAdminRequest(request))) return Response.json({ detail: 'غير مصرح.' }, { status: 403 });
  const { id } = await params;
  const requests = await loadRequests();
  const r = requests.find((x) => x.id === id);
  const receiptTarget = r?.receipt || id;

  try {
    const file = await readReceipt(receiptTarget);
    return new Response(file.buf, {
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'Content-Disposition': `inline; filename="${file.name || 'receipt.jpg'}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    if (!r?.receipt) return Response.json({ detail: 'مفيش صورة تحويل للطلب ده.' }, { status: 404 });
    return Response.json({ detail: 'ملف التحويل مش موجود أو جاري مزامنته.' }, { status: 404 });
  }
}
