import path from 'path';
import { isAdminRequest, getRequestUser, backendGet } from '@/lib/siteStore';
import {
  loadRequests, updateRequests, adminView, ownView, saveReceipt, RECEIPT_TYPES, MAX_RECEIPT_BYTES,
} from '@/lib/requestsStore';

// Students' level / book requests (see src/lib/requestsStore.js).
//   GET  (admin)   → { counts, results } — filters: kind, status, level, search
//   GET  (student) → the student's own requests only
//   POST (student) → multipart: kind, item_id, full_name, phone, payment_method, note, receipt?
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function GET(request) {
  const url = new URL(request.url);

  if (url.searchParams.get('mine') !== '1' && (await isAdminRequest(request))) {
    const kind = url.searchParams.get('kind');
    const status = url.searchParams.get('status');
    const level = url.searchParams.get('level');
    const q = (url.searchParams.get('search') || '').trim().toLowerCase();
    const all = (await loadRequests()).filter((r) => !kind || r.kind === kind);

    const counts = { by_status: {}, pending_by_level: {} };
    all.forEach((r) => {
      counts.by_status[r.status] = (counts.by_status[r.status] || 0) + 1;
      if (r.status === 'pending') counts.pending_by_level[r.level_code] = (counts.pending_by_level[r.level_code] || 0) + 1;
    });

    const results = all
      .filter((r) => (!status || r.status === status) && (!level || r.level_code === level))
      .filter((r) => !q || [r.full_name, r.phone].some((v) => String(v || '').toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 300)
      .map(adminView);
    return json({ counts, results });
  }

  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول الأول.' }, 401);
  const mine = (await loadRequests())
    .filter((r) => r.user_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)
    .map(ownView);
  return json(mine);
}

export async function POST(request) {
  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول الأول عشان تبعت الطلب.' }, 401);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  const kind = String(form.get('kind') || '');
  const itemId = Number(form.get('item_id'));
  const fullName = String(form.get('full_name') || '').trim().slice(0, 120);
  const phone = String(form.get('phone') || '').replace(/\D/g, '');
  const paymentMethod = String(form.get('payment_method') || '').trim().slice(0, 50);
  const note = String(form.get('note') || '').trim().slice(0, 1000);
  const receipt = form.get('receipt');

  if (kind !== 'level' && kind !== 'book') return json({ detail: 'نوع الطلب غير صحيح.' }, 400);
  if (!fullName) return json({ full_name: ['الاسم مطلوب.'] }, 400);
  if (phone.length !== 11) return json({ phone: ['رقم الهاتف يجب أن يكون 11 رقماً.'] }, 400);
  const hasReceipt = receipt && typeof receipt === 'object' && receipt.size > 0;
  if (hasReceipt) {
    if (!RECEIPT_TYPES[path.extname(receipt.name || '').toLowerCase()]) return json({ receipt: ['صورة التحويل يجب أن تكون صورة أو PDF.'] }, 400);
    if (receipt.size > MAX_RECEIPT_BYTES) return json({ receipt: ['حجم صورة التحويل أكبر من 8 ميجا.'] }, 400);
  }

  // The item as the student sees it (name, price, level, already unlocked?) — straight from the backend.
  let item = null;
  if (kind === 'level') {
    const data = await backendGet('/api/courses/levels/', user.token);
    const list = Array.isArray(data) ? data : data?.results || [];
    const l = list.find((x) => Number(x.id) === itemId);
    if (l) item = { name: l.title || l.name, level_code: l.name, amount: l.price, has_access: l.has_access };
  } else {
    const data = await backendGet('/api/books/', user.token);
    const list = Array.isArray(data) ? data : Object.values(data || {}).flat();
    const b = list.find((x) => Number(x.id) === itemId);
    if (b) item = { name: b.name, level_code: b.level, amount: b.price, has_access: b.has_access };
  }
  if (!item) return json({ detail: kind === 'level' ? 'المستوى غير موجود.' : 'الكتاب غير موجود.' }, 404);
  if (item.has_access) return json({ detail: kind === 'level' ? 'المستوى مفعّل على حسابك بالفعل.' : 'الكتاب مفعّل على حسابك بالفعل.' }, 400);

  const id = `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  try {
    const created = await updateRequests(async (list) => {
      if (list.some((r) => r.user_id === user.id && r.kind === kind && r.item_id === itemId && r.status === 'pending')) {
        return { list, result: null };
      }
      const record = {
        id,
        kind,
        item_id: itemId,
        item_name: item.name,
        level_code: item.level_code,
        amount: String(item.amount ?? '0'),
        user_id: user.id,
        user_email: '',
        full_name: fullName,
        phone,
        payment_method: paymentMethod,
        note,
        receipt: hasReceipt ? await saveReceipt(id, receipt) : null,
        status: 'pending',
        admin_note: '',
        created_at: new Date().toISOString(),
      };
      return { list: [...list, record], result: record };
    });
    if (!created) {
      return json({ detail: 'عندك طلب لنفس العنصر قيد المراجعة بالفعل، هيتم تفعيله أول ما الإدارة تراجعه.' }, 400);
    }
    return json(ownView(created), 201);
  } catch {
    return json({ detail: 'تعذر حفظ الطلب، حاول مرة أخرى.' }, 500);
  }
}
