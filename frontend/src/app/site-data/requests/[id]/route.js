import { isAdminRequest, getRequestUser } from '@/lib/siteStore';
import { updateRequests, adminView, deleteReceipt } from '@/lib/requestsStore';

// One request. Admins only.
//   PATCH { status: 'approved' | 'rejected', admin_note? } — the dashboard unlocks the item on the
//         backend first, then marks the request here.
//   DELETE
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function GET(request, { params }) {
  if (!(await isAdminRequest(request))) return json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);
  const { id } = await params;
  const list = await loadRequests();
  const r = list.find((x) => x.id === id);
  if (!r) return json({ detail: 'الطلب غير موجود.' }, 404);
  return json(r);
}

export async function PATCH(request, { params }) {
  if (!(await isAdminRequest(request))) return json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  if (!['approved', 'rejected', 'pending'].includes(body.status)) return json({ detail: 'حالة غير صحيحة.' }, 400);
  const admin = await getRequestUser(request);

  const updated = await updateRequests(async (list) => {
    const i = list.findIndex((r) => r.id === id);
    if (i < 0) return { list, result: null };
    const r = {
      ...list[i],
      status: body.status,
      admin_note: String(body.admin_note || '').slice(0, 500),
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin?.name || 'الإدارة',
    };
    const next = [...list];
    next[i] = r;
    return { list: next, result: r };
  });
  if (!updated) return json({ detail: 'الطلب غير موجود.' }, 404);
  return json({ detail: 'تم.', request: adminView(updated) });
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest(request))) return json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);
  const { id } = await params;
  const removed = await updateRequests(async (list) => {
    const r = list.find((x) => x.id === id);
    return { list: list.filter((x) => x.id !== id), result: r || null };
  });
  if (!removed) return json({ detail: 'الطلب غير موجود.' }, 404);
  await deleteReceipt(removed.receipt);
  return json({ detail: 'تم حذف الطلب.' });
}
