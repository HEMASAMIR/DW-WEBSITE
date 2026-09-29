import { readStore, writeStore, isAdminRequest, cleanBranch } from '@/lib/siteStore';

// Branches shown on the site, edited from the admin dashboard (see src/lib/siteStore.js).
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await readStore('branches'));
}

/** Replaces the whole list (the dashboard sends the list in display order). Admins only. */
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
  if (!Array.isArray(body) || body.length > 50) {
    return Response.json({ detail: 'بيانات غير صحيحة.' }, { status: 400 });
  }
  const list = body.map(cleanBranch);
  const bad = list.find((b) => !b.name || !b.address);
  if (bad) return Response.json({ detail: 'اسم الفرع والعنوان مطلوبين.' }, { status: 400 });
  try {
    return Response.json(await writeStore('branches', list));
  } catch {
    return Response.json({ detail: 'تعذر حفظ الفروع على السيرفر.' }, { status: 500 });
  }
}
