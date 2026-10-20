# Claude Code instructions

Follow the project development standard:

@AGENTS.md

Claude-specific notes:

- Before declaring a task complete, run `npm run check` and `npm run build`
  and report the actual results.
- Do not commit, merge, or push unless explicitly asked.
- For client projects, start work from `staging`, not `main`.
- Follow `docs/seo-content.md` when creating or revising page content, metadata,
  routes, images, links, or structured data. AI drafts must stay grounded in
  approved client facts and page content.
- Never push to `main`, touch DNS/custom domains, or modify Cloudflare
  resources without explicit human instruction.
