# Endpoint do quiz da festa — Cloudflare Worker + KV

Servidorzinho de estado pra galeria "A Turma de Hoje": cada celular manda
`POST /add` com `{name, char}` e o painel oculto lê `GET /list?code=...`.

## Por quê
- Grátis (plano free da Cloudflare: KV + 100k requests/dia)
- Sem servidor pra manter; deploy em 1 comando
- CORS liberado pra qualquer origem (os celulares dos convidados)

## Deploy (rodar no host, depois que o token estiver em secrets)

O token NUNCA vai no chat: adicione no Control UI → Settings → Secrets
(nome: `CLOUDFLARE_API_TOKEN`) ou pelo Terminal com
`openclaw secrets set CLOUDFLARE_API_TOKEN` (prompt mascarado).

Depois, nesta pasta (`festa/worker`):

1. Criar o KV e pegar o id:
   `npx wrangler kv namespace create QUIZ_RESULTS`
   → copiar o `id` pra `wrangler.toml` (campo `[[kv_namespaces]]`)
2. Definir o segredo (usado pelo dashboard pra ver a lista):
   `npx wrangler secret put SECRET`
   → digitar/colar um código, ex.: `openssl rand -hex 8` (não precisa decorar)
3. Publicar:
   `npx wrangler deploy`
   → anotar a URL: `https://quizz-festa.<sub>.workers.dev`

## Ligar no quiz e no painel
Em `festa/index.html` e `festa/dashboard.html`, preencher:
- `API_URL` = URL do worker acima
- dashboard: digitar o mesmo `SECRET` no campo de código do painel
Depois dar `git push` no repositório (Pages atualiza sozinho).