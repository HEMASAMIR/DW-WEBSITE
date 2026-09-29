import { readStore, writeStore, isAdminRequest, cleanAnnouncement } from '@/lib/siteStore';

// Promo banner at the top of the home page, edited from the admin dashboard (see src/lib/siteStore.js).
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await readStore('announcement');
  return data ? Response.json(data) : Response.json({ detail: 'لا يوجد إعلان.' }, { status: 404 });
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
  const data = cleanAnnouncement(body);
  if (!data || !data.title) return Response.json({ detail: 'عنوان الإعلان مطلوب.' }, { status: 400 });
  try {
    return Response.json(await writeStore('announcement', data));
  } catch {
    return Response.json({ detail: 'تعذر حفظ الإعلان على السيرفر.' }, { status: 500 });
  }
}
