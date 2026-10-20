# Antidote Website Foundation

Internal reusable foundation for small corporate websites and landing pages.
The rendered site is static and portable; the default deployment workflow is
Cloudflare Workers + Workers Builds + Worker Previews.

## Stack

- Astro 7
- Tailwind CSS 4
- Static output
- Cloudflare Workers Static Assets
- GitHub as source of truth

## Prerequisites

- Node.js 22.12+
- npm 10+

## Local development

```sh
npm ci
npm run dev
```

Validation:

```sh
npm run check
npm run build
```

## Start a client project

Create a new repository from this GitHub template, then initialize the
project-specific identifiers:

```sh
npm run init:project -- --slug client-project --name "Client Name" --lang es
```

The helper updates:

- package / lockfile project name;
- Worker name;
- Wrangler compatibility date;
- site name, language, and default title.

Then replace the Foundation placeholder content, assets, metadata, navigation,
and design tokens with the approved client design.

## Branch workflow

- `main` = production.
- `staging` = persistent review environment.
- feature / agent branches start from `staging` and merge back into `staging`.
- production promotion is a reviewed `staging → main` PR with explicit human approval.

Cloudflare Workers Builds is the deployment mechanism. GitHub Actions validates
only; it never deploys.

## Private previews

Preview privacy is configured once at the Cloudflare account level:

- all Worker Previews require Cloudflare Access;
- agency members authenticate with the Cloudflare identity provider;
- external client reviewers can be allowed on one Worker with exact-email
  policies and One-time PIN;
- client-review access is removed after approval.

New Workers inherit the account-wide preview protection automatically.

The code also fails safe:

- only a Cloudflare build of `main` is indexable;
- staging / feature / local builds emit `noindex, nofollow`;
- preview builds do not publish a sitemap;
- preview `robots.txt` remains crawlable so page-level `noindex` can still be
  read if Access is ever misconfigured.

## Production URL safety

`SITE_URL` controls canonical URLs, Open Graph URLs, and the production
sitemap.

A Cloudflare production build of `main` is blocked until `SITE_URL` is a real
non-placeholder URL.

Wrangler intentionally uses:

- `workers_dev: false` — no duplicate public production `*.workers.dev` URL;
- `preview_urls: true` — branch previews remain available behind Access.

## Domains

When the client's DNS is directly manageable in Cloudflare, use the normal
Worker Custom Domain / route.

For client DNS hosted elsewhere, the agency Cloudflare for SaaS setup uses:

- fallback origin: `proxy-fallback.antidote.lat`;
- CNAME target for clients: `sites.antidote.lat`.

Create the exact Custom Hostname, route it to the correct Worker, then ask the
client to CNAME their hostname to `sites.antidote.lat`.

See `docs/cloudflare-setup.md` for the runbook, including the one-time
`www` → canonical-domain 301 redirect and path/query verification.

## Design and content

Core visual tokens live in `src/styles/global.css` inside `@theme`.
Site-wide metadata/navigation live in `src/config/site.ts`.

Use `astro:assets` for normal site imagery. Files that require stable public
URLs (favicons, OG image) belong in `public/`.

### SEO and AI-assisted content

The Foundation supplies the technical SEO baseline, while titles, descriptions,
routes, headings, image alt text, internal links, Open Graph choices, and
structured data remain page-specific.

AI may draft those elements from the approved page content and known client
facts, but it must not invent claims or business information. Production review
follows `docs/seo-content.md`.

## Security and maintenance

The Foundation includes:

- baseline static security headers in `public/_headers`;
- CI on `main`, `staging`, and pull requests;
- monthly maintenance validation;
- monthly Dependabot version-update PRs for npm and GitHub Actions.

Dependabot alerts and security updates are account/repository settings and are
not controlled by `.github/dependabot.yml`.

Dependency PRs are reviewed manually; no dependency auto-merge.

## Coming Soon

If a new client's production domain is ready before the real site, `main` may
temporarily serve a minimal branded noindex Coming Soon page while the actual
site is built privately on `staging`.

At launch, the approved `staging → main` merge replaces Coming Soon.

If an existing website is already live, leave it live until launch instead of
using Coming Soon.

See `docs/coming-soon.md`.

## Portability

The application code renders to plain static files and has no Cloudflare
runtime dependency. The current deployment configuration is intentionally
Cloudflare-specific (`wrangler.jsonc`, Workers Builds, `WORKERS_CI_BRANCH`).
Moving to another static host would require replacing that deployment/build
configuration, not rewriting the page/component code.

## Project structure

```
.github/
  workflows/ci.yml
  workflows/maintenance.yml
  dependabot.yml
docs/
  cloudflare-setup.md
  coming-soon.md
  deployment-security.md
  seo-content.md
scripts/
  init-project.mjs
public/
src/
  assets/
  components/
  config/site.ts
  layouts/BaseLayout.astro
  pages/
  styles/
  utils/production-branch.ts
wrangler.jsonc
```

See `AGENTS.md` for development rules.
