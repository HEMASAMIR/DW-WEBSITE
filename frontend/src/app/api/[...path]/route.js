export const dynamic = 'force-dynamic';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://py.deutschewelt.academy').replace(/\/+$/, '');
const BACKEND_HOST = new URL(BACKEND_URL).host;

async function proxy(request, context) {
  const params = await context?.params;
  const pathParts = params?.path || [];
  const subpath = Array.isArray(pathParts) ? pathParts.join('/') : pathParts;

  // Django endpoints end with a trailing slash
  const cleanSubpath = subpath ? `${subpath.replace(/\/+$/, '')}/` : '';
  const search = request.nextUrl ? request.nextUrl.search : new URL(request.url).search;
  const targetUrl = `${BACKEND_URL}/api/${cleanSubpath}${search || ''}`;

  // Forward client headers but override Host and X-Forwarded-Host to match backend ALLOWED_HOSTS
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k !== 'host' && k !== 'x-forwarded-host' && k !== 'connection' && k !== 'content-length') {
      headers.set(key, value);
    }
  });

  headers.set('host', BACKEND_HOST);
  headers.set('x-forwarded-host', BACKEND_HOST);

  const method = request.method.toUpperCase();
  const init = {
    method,
    headers,
    redirect: 'manual',
  };

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  try {
    const backendRes = await fetch(targetUrl, init);

    // Forward response headers
    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (k !== 'content-encoding' && k !== 'content-length' && k !== 'transfer-encoding') {
        responseHeaders.set(key, value);
      }
    });

    return new Response(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return Response.json(
      { detail: 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.' },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
