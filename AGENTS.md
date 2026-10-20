# Development Standard — Antidote Website Foundation

Vendor-neutral rules for anyone (human or AI agent) working on this
repository or on client projects derived from it.

## What this project is

A deliberately small, production-quality foundation for small corporate
websites and landing pages: Astro static output + Tailwind CSS 4, no
client-side framework by default, no backend by default. The production
artifact is a portable `dist/` folder; GitHub is the source of truth.

## Principles

1. Prefer simplicity over abstraction.
2. Reuse existing components and design tokens before creating new ones.
3. Avoid duplication, but extract patterns only after they actually repeat.
4. Add no dependency without a concrete current reason.
5. Keep responsibilities separated: tokens in CSS, metadata in site config,
   SEO in the base layout, content in pages.
6. Do not change architecture outside the requested scope.
7. Keep components understandable and props small.
8. Avoid client-side JavaScript when HTML/CSS/Astro is enough.
9. Do not implement hypothetical future requirements.
10. Run `npm run check` and `npm run build` before declaring work complete.
11. Never weaken checks just to make CI green.
12. Remove temporary files, dead code, and debug output before committing.

## Conventions

- Accessibility is non-negotiable: semantic HTML, one `h1` per page,
  visible focus states, useful alt text, and the skip link stays.
- Mobile-first styling.
- Styling uses Tailwind utilities backed by `src/styles/global.css` tokens.
- SEO metadata flows through `BaseLayout`.
- Indexability is branch-based: only a Cloudflare Workers Builds build of
  `main` is indexable; staging/feature/local builds fail safe to noindex.
- Commits follow Conventional Commits.

## SEO and content quality

- Treat SEO as page-specific content work, not a generic keyword layer.
- Every indexable page needs a descriptive title, page-specific meta description,
  clear primary `h1`, canonical URL, useful internal-link text, and intentional
  Open Graph imagery.
- Keep production routes short, stable, lowercase, and descriptive; do not
  casually change public URLs after launch.
- Prefer `astro:assets` for normal images. Write contextual alt text for
  meaningful images and use `alt=""` for purely decorative images.
- AI may draft metadata, alt text, link text, and structured data only from
  approved page content and known client facts. Never invent factual claims,
  services, locations, prices, credentials, hours, statistics, or testimonials.
- Add structured data only when the schema type applies and the markup matches
  visible page content.
- Before a production promotion, complete `docs/seo-content.md` in addition to
  the normal technical review.

## Standard deployment workflow

Cloudflare Workers Builds is the deployment mechanism. GitHub Actions only
validates; it never deploys.

- `main`: production, indexable.
- `staging`: persistent client/internal review environment, private behind account-wide Cloudflare Access and always noindex.
- feature/agent branches: start from `staging`, PR back into `staging`.

At new-site launch, follow the canonical-domain and `www` redirect checklist
in `docs/cloudflare-setup.md` before declaring DNS/SEO setup complete.
Agents must **not** modify DNS or Cloudflare rules without explicit human approval.

For normal work:
1. Start from current `staging`.
2. Make the change.
3. Run `npm run check` and `npm run build`.
4. Commit and push the feature branch.
5. Open a PR into `staging`.
6. After merge, review the stable Worker Preview through Cloudflare Access.
7. After explicit human approval, open `staging → main` PR.
8. Never merge `staging → main` without explicit human approval.

## Never do without explicit human instruction

- Push or merge directly to `main`.
- Change DNS, custom domains, production branch settings, Cloudflare account
  resources, secrets, or variables.
- Perform irreversible dashboard migrations.
- Configure analytics/tracking or third-party scripts.
- Force-push, rewrite history, or delete shared branches.
- Auto-merge dependency/security PRs without review.

## Recovery

- Broken staging/preview: fix forward or revert in Git, then let Cloudflare
  rebuild the branch preview.
- Broken production: use Cloudflare production rollback when available for
  immediate recovery, then reconcile Git with a revert so source remains the
  truth.

See `docs/cloudflare-setup.md`, `docs/deployment-security.md`,
`docs/seo-content.md`, and `docs/coming-soon.md`.
