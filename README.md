# Crate

A fast reading list / bookmark manager built with [swift-rust](https://swift-rust.multivrs.space/), the React 19 framework on Rust + Bun.

Save links, tag them, mark them read, edit notes, and filter by tag, status or search text. Every mutation is a plain HTML form, so the app works with JavaScript disabled. Client JS only powers two small islands (copy link, theme toggle) and `<Link>` client navigation.

## Scripts

- `bun run dev` — dev server on http://localhost:3210
- `bun run build` / `bun run start` — production build and server
- `bun run typecheck` · `bun run lint` · `bun run format`

## How it uses swift-rust

| Feature | Where |
| --- | --- |
| `loader.ts` + `useLoaderData()` for route data (reads `searchParams`) | `src/app/loader.ts`, `src/app/b/[id]/loader.ts` |
| `action.ts` + `useActionData()` for form POSTs, with 303 redirects via `RouteControl` | `src/app/action.ts`, `src/app/b/[id]/action.ts` |
| Dynamic segment, `notFound()` → `not-found.tsx` | `src/app/b/[id]/` |
| `route.ts` JSON API (`GET`/`POST`, `GET`/`PATCH`/`DELETE`) | `src/app/api/bookmarks/` |
| `"use client"` islands (JSON-serializable props) | `src/components/copy-button.tsx`, `theme-toggle.tsx` |
| `<Link>` client navigation, `swift-rust/font/google` (Geist), `metadata` | `src/app/layout.tsx` |
| swift-rust ui components (`bunx @swift-rust/ui add …`) | `src/components/ui/` |

## API

```bash
curl localhost:3210/api/bookmarks?tag=rust&status=unread
curl -X POST localhost:3210/api/bookmarks -H 'content-type: application/json' -d '{"url":"https://bun.sh","tags":"bun, tooling"}'
curl -X PATCH localhost:3210/api/bookmarks/<id> -H 'content-type: application/json' -d '{"read":true}'
curl -X DELETE localhost:3210/api/bookmarks/<id>
```

## Data

Bookmarks are stored in `.data/crate.json` (git-ignored, seeded on first run). Route modules are re-imported per request in dev, so in-memory state would not survive. On read-only hosts such as Vercel functions, swap `src/lib/store.ts` for a real database; the rest of the app only talks to its exported functions.
