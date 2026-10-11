import fs from 'fs';
import path from 'path';
import { ALLOWED_PROTECTION_EMAILS } from '@/constants/securityConfig';

// Global in-memory map survives across warm serverless requests
globalThis.__dw_device_sessions = globalThis.__dw_device_sessions || new Map();
const sessions = globalThis.__dw_device_sessions;

const TMP_FILE = path.join(process.env.TMPDIR || '/tmp', 'dw_device_sessions.json');

// Attempt lazy load from tmp on cold start
try {
  if (sessions.size === 0 && fs.existsSync(TMP_FILE)) {
    const raw = fs.readFileSync(TMP_FILE, 'utf8');
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([uid, sess]) => sessions.set(Number(uid) || uid, sess));
  }
} catch {
  // Ignore filesystem read errors
}

function persistSessions() {
  try {
    const obj = {};
    sessions.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(TMP_FILE, JSON.stringify(obj), 'utf8');
  } catch {
    // Ignore tmp write errors in constrained environments
  }
}

/**
 * Validates or claims a device session for a user.
 * - Admins and whitelisted emails have unlimited multi-device access.
 * - Students are restricted to one active mobile/device session at a time.
 * - If a new device signs in or claims the session, older sessions are revoked.
 */
export function handleDeviceSession({
  userId,
  userEmail,
  isAdmin,
  deviceId,
  deviceName,
  deviceType,
  action = 'heartbeat',
}) {
  if (!userId) return { active: false, reason: 'unauthorized' };

  // Admins & Whitelisted accounts are always exempt (unlimited devices)
  const isEmailExempt = ALLOWED_PROTECTION_EMAILS.some(
    (e) => e.toLowerCase() === String(userEmail || '').trim().toLowerCase()
  );
  if (isAdmin || isEmailExempt) {
    return { active: true, exempt: true };
  }

  const existing = sessions.get(userId);

  // No active session registered yet -> claim it
  if (!existing) {
    const newSession = {
      activeDeviceId: deviceId,
      activeDeviceName: deviceName || 'هاتف محمول',
      activeDeviceType: deviceType || 'mobile',
      updatedAt: Date.now(),
      registeredAt: Date.now(),
    };
    sessions.set(userId, newSession);
    persistSessions();
    return { active: true, exempt: false, message: 'registered' };
  }

  // Same device as currently active
  if (existing.activeDeviceId === deviceId) {
    existing.updatedAt = Date.now();
    if (deviceName) existing.activeDeviceName = deviceName;
    return { active: true, exempt: false };
  }

  // A different device is attempting an action
  if (action === 'register' || action === 'takeover') {
    // The new device takes over as active, revoking the previous device
    existing.previousDeviceId = existing.activeDeviceId;
    existing.previousDeviceName = existing.activeDeviceName;
    existing.activeDeviceId = deviceId;
    existing.activeDeviceName = deviceName || 'هاتف محمول';
    existing.activeDeviceType = deviceType || 'mobile';
    existing.updatedAt = Date.now();
    existing.switchedAt = Date.now();
    sessions.set(userId, existing);
    persistSessions();
    return { active: true, exempt: false, message: 'registered' };
  }

  // Heartbeat from an old device that was replaced
  return {
    active: false,
    exempt: false,
    reason: 'new_device_login',
    newDevice: existing.activeDeviceName || 'جهاز آخر',
    switchedAt: existing.switchedAt || Date.now(),
  };
}

export function clearUserDeviceSession(userId) {
  sessions.delete(userId);
  persistSessions();
}
