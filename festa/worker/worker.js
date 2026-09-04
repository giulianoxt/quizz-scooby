// Worker Cloudflare — estado do quiz da festa (KV)
// Rotas:
//   POST /add  {name, char}  -> guarda o resultado de um convidado
//   GET  /list?code=SEGREDO  -> lista completa (usado pelo dashboard)
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response('ok', { headers: CORS });
    const url = new URL(request.url);

    if (url.pathname === '/add' && request.method === 'POST') {
      try {
        const body = await request.json();
        if (typeof body.name !== 'string' || typeof body.char !== 'number' || body.char < 0 || body.char > 4)
          return new Response('bad', { status: 400, headers: CORS });
        const key = 'results';
        const list = JSON.parse((await env.QUIZ_RESULTS.get(key)) || '[]');
        list.push({ name: body.name.slice(0, 30), char: body.char, at: new Date().toISOString() });
        await env.QUIZ_RESULTS.put(key, JSON.stringify(list));
        return new Response('ok', { headers: CORS });
      } catch (e) {
        return new Response('bad', { status: 400, headers: CORS });
      }
    }

    if (url.pathname === '/list' && request.method === 'GET') {
      if (url.searchParams.get('code') !== env.SECRET)
        return new Response('no', { status: 403, headers: CORS });
      const list = JSON.parse((await env.QUIZ_RESULTS.get('results')) || '[]');
      return new Response(JSON.stringify(list), {
        headers: { 'content-type': 'application/json', ...CORS }
      });
    }

    return new Response('not found', { status: 404, headers: CORS });
  }
};