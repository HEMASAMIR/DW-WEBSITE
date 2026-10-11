import { getRequestUser } from '@/lib/siteStore';
import { handleDeviceSession, clearUserDeviceSession } from '@/lib/sessionStore';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ active: false, detail: 'غير مصرح' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // default empty
  }

  const { deviceId, deviceName, deviceType, action = 'heartbeat' } = body;

  if (!deviceId) {
    return Response.json({ active: false, detail: 'معرّف الجهاز مطلوب' }, { status: 400 });
  }

  const result = handleDeviceSession({
    userId: user.id,
    userEmail: user.email,
    isAdmin: user.is_admin,
    deviceId,
    deviceName,
    deviceType,
    action,
  });

  return Response.json({
    success: true,
    ...result,
  });
}

export async function DELETE(request) {
  const user = await getRequestUser(request);
  if (user) {
    clearUserDeviceSession(user.id);
  }
  return Response.json({ success: true });
}
