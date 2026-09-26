// The browser talks to /api/* and /media/* on the site's own origin; Next.js forwards them
// server-side to the Django backend. This avoids CORS entirely (the backend does not allow
// cross-origin requests from the website domain).
// Production backend by default. For local development put BACKEND_URL=http://127.0.0.1:8000
// in .env.local instead of editing this line.
const BACKEND_URL = (process.env.BACKEND_URL || 'https://py.deutschewelt.academy').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Django URLs end with "/" — don't let Next.js redirect them to the slash-less form.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      // :path* drops the trailing slash; Django would then 301 back to the same relative URL (loop).
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*/` },
      { source: '/media/:path*', destination: `${BACKEND_URL}/media/:path*` },
    ];
  },
};

export default nextConfig;
