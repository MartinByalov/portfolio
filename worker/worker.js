// Cloudflare Worker: server-side verification for the portfolio access gate.
//
// The secret code is NEVER stored in this repository. Set it only as an
// encrypted Worker secret (dashboard: Settings -> Variables and Secrets,
// or run `npx wrangler secret put PORTFOLIO_ACCESS_CODE` inside worker/).
//
// API: POST /verify  with JSON body { "code": "<6-character code>" }
// (letters, digits and symbols; case-sensitive)
//      -> 200 { "success": true }   on match
//      -> 403 { "success": false }  on mismatch
//      -> 429 { "success": false }  when rate-limited
//      -> 503 { "success": false }  when the secret is not configured

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Best-effort per-isolate rate limiting (isolates are reused across requests
// in the same region, which is enough to slow down PIN brute-forcing).
const attempts = new Map();

function getClientIp(request) {
  return request.headers.get('cf-connecting-ip')
    || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    || 'unknown';
}

function allowedOrigins(env) {
  const raw = String(env.ALLOWED_ORIGINS || 'https://martinbyalov.github.io').trim();
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (origin && allowedOrigins(env).includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.startedAt > RATE_LIMIT_WINDOW_MS) {
    attempts.set(ip, { count: 1, startedAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Constant-time comparison of SHA-256 digests, so the plaintext secret is
// never compared directly in a way that leaks timing information.
async function codesMatch(input, expected) {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(input)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  if (va.length !== vb.length) return false;
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname !== '/verify') {
      return jsonResponse({ success: false }, 404, cors);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ success: false }, 405, cors);
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return jsonResponse(
        { success: false, message: 'Твърде много опити. Опитайте по-късно.' },
        429,
        { ...cors, 'Retry-After': '600' }
      );
    }

    const expected = String(env.PORTFOLIO_ACCESS_CODE || '').trim();
    if (!expected) {
      return jsonResponse({ success: false, message: 'Достъпът не е конфигуриран.' }, 503, cors);
    }

    let code = '';
    try {
      const body = await request.json();
      code = String(body && body.code ? body.code : '').trim();
    } catch (err) {
      return jsonResponse({ success: false }, 400, cors);
    }

    if (!/^\S{6}$/.test(code)) {
      return jsonResponse({ success: false }, 403, cors);
    }

    const ok = await codesMatch(code, expected);
    if (ok) {
      return jsonResponse({ success: true }, 200, cors);
    }
    return jsonResponse({ success: false }, 403, cors);
  },
};
