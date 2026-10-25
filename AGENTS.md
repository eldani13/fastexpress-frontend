# AGENTS.md (FastExpress Frontend)

Small Next.js 15 + React 19 app (App Router). Keep changes consistent with the existing "one component/util per file, export from each folder's `index.ts`" convention.

## Quick start
```bash
cp .env.example .env.local
npm install
npm run dev
```
- App: http://localhost:3000
- API base: `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`, no trailing slash). API must be running locally for real calls.

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Next dev |
| `npm run build` | Production build |
| `npm start` | Serve build |
| `npm run lint` | `next lint` |

## Architecture (real layout)
- `app/` - App Router (`app/page.tsx` renders `CotizadorPage`)
- `components/` - `brand/`, `layout/`, `cotizador/`, `guia/` (each folder re-exports via `index.ts`)
- `hooks/` - `useCotizacion`
- `lib/` - `api/` (HTTP client), `validation/`, `format/`, `constants/`
- `types/` - API contract types
- `styles/` - split CSS (`variables`, `form`, `guia`, `responsive`)
- Path alias: `@/*` -> project root (tsconfig)

## API integration
- Endpoint: `POST /api/v1/cotizaciones` via `lib/api/cotizar.ts`
- `baseUrl()` reads `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`), strips trailing slash
- If response not JSON on non-OK (e.g. 500 plain text), `cotizar()` returns `{ ok:false, status, body:null }` (catch on `respuesta.json()`)
- Exported: `cotizar()` and `CotizarResultado` from `lib/api/`

## Validation / gotchas
- `lib/validation/validarNumero.ts` accepts comma or dot as decimal separator (normalizes `,` -> `.`)
- `detectarMiles: true` (monto) rejects thousand separators like `1,000` / `1.000` with message: "No uses separador de miles..." (peso does not use it)
- Max 2 decimals; value must be > 0
- README notes DEF-005/DEF-006 already handled in `lib/api/cotizar.ts` and `lib/validation/validarNumero.ts` - preserve that behavior

## Conventions
- One component/util per file; export from each folder's `index.ts`
- Keep files small (~200 lines as per README)
- Preserve `data-testid` attributes (used by QA E2E)
- `tsconfig.json` has `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, excludes `_legacy_plano`
