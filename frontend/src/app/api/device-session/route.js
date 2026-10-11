import { getRequestUser, isAdminRequest } from '@/lib/siteStore';
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

  const { deviceId, deviceName, deviceType, action = 'heartbeat', clientEmail, clientIsAdmin } = body;

  if (!deviceId) {
    return Response.json({ active: false, detail: 'معرّف الجهاز مطلوب' }, { status: 400 });
  }

  // Check if admin through multiple robust channels
  let isAdmin = Boolean(user.is_admin || clientIsAdmin);
  if (!isAdmin) {
    isAdmin = await isAdminRequest(request);
  }

  const userEmail = user.email || clientEmail || '';

  const result = handleDeviceSession({
    userId: user.id,
    userEmail,
    isAdmin,
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
