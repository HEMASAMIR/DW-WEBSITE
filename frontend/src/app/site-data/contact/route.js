import { readStore, writeStore, isAdminRequest, cleanContact } from '@/lib/siteStore';

// Contact numbers, payment methods and level WhatsApp groups, edited from the admin dashboard
// (see src/lib/siteStore.js). Public read; the site shows the changes on the next page load.
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await readStore('contact'));
}

/** Admins only. */
export async function PUT(request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, { status: 403 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ detail: 'بيانات غير صحيحة.' }, { status: 400 });
  }
  const data = cleanContact(body);
  if (!data) return Response.json({ detail: 'بيانات غير صحيحة.' }, { status: 400 });
  if (!data.whatsapp) return Response.json({ detail: 'رقم الواتساب مطلوب.' }, { status: 400 });
  if (!data.payment.methods.length && !data.payment.cash_at_branch) {
    return Response.json({ detail: 'لازم طريقة دفع واحدة على الأقل.' }, { status: 400 });
  }
  try {
    return Response.json(await writeStore('contact', data));
  } catch {
    return Response.json({ detail: 'تعذر حفظ البيانات على السيرفر.' }, { status: 500 });
  }
}
