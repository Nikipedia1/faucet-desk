const enc = new TextEncoder();
async function keyOf(code) {
  const h = await crypto.subtle.digest('SHA-256', enc.encode('faucetdesk:' + code));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}
const J = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
export async function onRequest({ request, env }) {
  if (!env.FAUCET_KV) return new Response('KV non configurato', { status: 500 });
  const code = request.headers.get('X-Sync-Key') || '';
  if (code.length < 12) return new Response('Codice troppo corto', { status: 400 });
  const key = await keyOf(code);
  if (request.method === 'GET') {
    const v = await env.FAUCET_KV.get(key);
    return v ? new Response(v, { headers: J }) : new Response('Vuoto', { status: 404 });
  }
  if (request.method === 'PUT') {
    const t = await request.text();
    if (t.length > 200000) return new Response('Troppo grande', { status: 413 });
    try { const d = JSON.parse(t); if (!Array.isArray(d.sites)) throw 0; }
    catch (e) { return new Response('Dati non validi', { status: 400 }); }
    await env.FAUCET_KV.put(key, t);
    return new Response('ok');
  }
  return new Response('Metodo non consentito', { status: 405 });
}
