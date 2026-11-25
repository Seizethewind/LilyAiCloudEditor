# LilyAiCloudEditor

Mobile-first cloud code editor and coding classroom that runs on the web (installable PWA). Built so you can learn and build with only a phone.

## Status

Phase 1 scaffold: editor + run code in the browser.

- CodeMirror 6 editor (touch friendly) with a symbol bar for phone keyboards
- Run **Python** in the browser with Pyodide (no server, no cost). `input()` uses a prompt dialog.
- Run **JavaScript** in a Web Worker (10s timeout, `console.log` output)
- **HTML/CSS/JS** live preview in a sandboxed iframe
- Dark / light mode (follows the system, remembers your choice)
- Installable PWA, single-panel Editor/Output tabs on small screens

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Deploy (GitHub -> Vercel)

1. Import this repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite (build `npm run build`, output `dist`).

## Roadmap

1. File tree and saving (Supabase Postgres + Cloudflare R2)
2. Lessons and an AI tutor panel (Claude API, called from the backend)
3. Backend (FastAPI) and auth
4. Remote CPU/GPU runner (Modal) for heavy jobs

## Secrets

Keys (Modal, Claude API, storage) live only in the backend host's environment variables. See `.env.example`. Never use a `VITE_` prefix for a secret.

## License

MIT
