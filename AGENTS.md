# Note per chi lavora su questo progetto con un assistente

Le convenzioni del progetto — in particolare **il diario delle novità va
scritto nella stessa sessione della modifica** — stanno in `CLAUDE.md`.
Il blocco qui sotto lo scrive Next da sé a ogni `next dev`: serve a non
far scrivere codice Next 14 su un progetto che è passato a Next 16.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
