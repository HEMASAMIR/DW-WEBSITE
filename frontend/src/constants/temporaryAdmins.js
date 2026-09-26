// TEMPORARY — delete this file (and its use in AuthContext) once the backend returns the user's
// groups in the login response, e.g. "user": { ..., "groups": ["Admin"] }.
//
// Admins are defined by the backend "Admin" group, but the API does not expose groups yet, so the
// site cannot detect them. Until then these known admin accounts are recognised here. This ONLY
// shows the admin panel — every action is still authorized by the backend.
//
// Emails are stored as SHA-256 hashes so the admin list is not exposed in the public JS bundle.
const TEMP_ADMIN_EMAIL_HASHES = new Set([
  'e1cd9c2c3b122f4e71b2165459ed8b4beb4ce4482c22ae77217bf2fa914f4ba4', // Herr Khaled
  'd301d39e869e22efb72a320488f51a7f418b0df19df156924f2971934a10740c', // platform admin
  '7d848741a7d95c1feefa0c41a177bbebccbde96c606846a3fd554994dd2ad7ed', // Nour
  '701d6c6a5d5fdcfb8a9e2f9cd7160db8a53e3026701ea56ff726037c01af4db6', // approved admin
]);

export async function isTemporaryAdmin(email) {
  if (!email || typeof window === 'undefined' || !window.crypto?.subtle) return false;
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return TEMP_ADMIN_EMAIL_HASHES.has(hex);
}
