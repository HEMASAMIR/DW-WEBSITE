// List of emails allowed to take screenshots and record screens without restrictions.
// Admins (user.is_admin === true) are also automatically exempt.
export const ALLOWED_PROTECTION_EMAILS = [
  'samir@gmail.com',
  'samir1@gmail.com',
  'admin@example.com',
  'e2e92162@example.com',
];

export function isExemptFromProtection(user) {
  if (!user) return false;
  if (user.is_admin || user.is_staff || user.username === 'admin' || user.role === 'admin') return true;
  const groups = user.groups || [];
  if (groups.some((g) => (typeof g === 'string' ? g : g?.name) === 'Admin')) return true;
  const email = String(user.email || user.username || '').trim().toLowerCase();
  return ALLOWED_PROTECTION_EMAILS.some((e) => e.toLowerCase() === email);
}
