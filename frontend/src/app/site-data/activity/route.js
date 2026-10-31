import { isAdminRequest, getRequestUser, readStore, writeStore, withLock } from '@/lib/siteStore';

export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  const recent = url.searchParams.get('recent');

  const isAdmin = await isAdminRequest(request);
  if (isAdmin) {
    const list = (await readStore('activity')) || [];
    if (userId) {
      const userActivity = list.filter((a) => Number(a.user_id) === Number(userId));
      return json(userActivity);
    }
    if (recent) {
      const sorted = [...list].sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at)).slice(0, 50);
      return json(sorted);
    }
    return json(list.slice(0, 200));
  }

  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول أولاً.' }, 401);

  const list = (await readStore('activity')) || [];
  const mine = list.filter((a) => Number(a.user_id) === Number(user.id));
  return json(mine);
}

export async function POST(request) {
  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول أولاً.' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }

  const levelId = Number(body?.level_id);
  const videoId = Number(body?.video_id);
  const videoTitle = String(body?.video_title || '').trim().slice(0, 200);

  if (!levelId || !videoId) {
    return json({ detail: 'بيانات المحاضرة ناقصة.' }, 400);
  }

  const now = new Date().toISOString();
  const userName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.full_name || (user.email || '').split('@')[0] || `#${user.id}`;

  const result = await withLock('activity', async () => {
    const list = (await readStore('activity')) || [];
    const existingIndex = list.findIndex(
      (a) => Number(a.user_id) === Number(user.id) && Number(a.video_id) === videoId
    );

    let record;
    let next;
    if (existingIndex >= 0) {
      const prev = list[existingIndex];
      record = {
        ...prev,
        user_name: userName,
        video_title: videoTitle || prev.video_title,
        watched_at: now,
        view_count: (prev.view_count || 1) + 1,
      };
      next = [...list];
      next[existingIndex] = record;
    } else {
      record = {
        id: `act_${user.id}_${videoId}`,
        user_id: user.id,
        user_name: userName,
        user_email: user.email,
        level_id: levelId,
        video_id: videoId,
        video_title: videoTitle,
        watched_at: now,
        view_count: 1,
      };
      next = [record, ...list].slice(0, 3000);
    }

    await writeStore('activity', next);
    return record;
  });

  return json({ success: true, activity: result });
}
