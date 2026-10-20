# Cloudflare setup checklist

This Foundation assumes **Cloudflare Workers Builds** for deployment of client
sites derived from it. GitHub Actions validates only; it does not deploy.

## Branch model

- `main` = production.
- `staging` = persistent review environment.
- feature branches = temporary review environments, created from `staging`.

Cloudflare Worker Previews gives non-`main` branches isolated preview
environments.

## One-time account setup

These are account-level settings and should not be repeated for every project:

1. Set the Workers account subdomain to the agency convention.
2. Enable Cloudflare Access for **all Worker previews** (`Previews only`).
3. Use the Cloudflare identity provider for agency account members.
4. Keep One-time PIN available for external client reviewers.
5. Enable Dependabot alerts/security updates as account defaults in GitHub.
6. If external client DNS will be supported, configure Cloudflare for SaaS once
   on the agency zone with a fallback origin and a friendly CNAME target.

The account-wide Access rule covers existing and future Worker previews by
default.

## Initial project setup

1. Create the client repository from this Foundation template.
2. Run:
   `npm run init:project -- --slug project-slug --name "Client Name" --lang es`
3. Connect the repository to Cloudflare Workers Builds.
4. Set Production branch to `main`.
5. Enable Preview builds and use the current Worker Preview command shown by
   Cloudflare.
6. Create a `staging` branch and verify that pushes update a stable preview.
7. Open the staging URL while signed out and confirm Cloudflare Access blocks it.
8. Sign in as the agency admin and confirm the staging site loads.
9. Set the real production `SITE_URL` only when the final production hostname
   is known.

Because preview privacy is account-wide, a new project does **not** need a new
Access application just to keep staging private.

## Client review access

Only add project-specific Access when a client actually needs to review.

Recommended flow:

1. Create/reuse an Access policy that allows the client's exact email address.
2. Give that policy a review-friendly session duration (for example one week).
3. On the specific Worker, enable Access for **Previews only** and attach:
   - the agency account-members policy;
   - the client reviewer policy.
4. The client signs in with One-time PIN and may revisit while the session is valid.
5. After approval, remove the Worker-specific Access override so the Worker falls
   back to the account-wide agency-only preview policy.
6. Remove the external Zero Trust user when no longer needed to invalidate
   sessions and free the seat.

Never make staging public merely for client review.

## Preview SEO

Cloudflare Access is the real privacy control. The code also fails safe:

- every non-`main` build emits `noindex, nofollow`;
- preview `robots.txt` stays crawlable so crawlers can read the page-level
  noindex if Access is ever misconfigured;
- preview builds do not publish a sitemap;
- only `main` is indexable and advertises the production sitemap.

## SITE_URL

`SITE_URL` controls canonical URLs, Open Graph URLs, and the production sitemap.

Local, generic CI, and non-production preview builds may run without it and
use the Foundation placeholder. A Cloudflare Workers Builds production build
of `main` is blocked unless `SITE_URL` is a real non-placeholder URL.

Set the final production URL before launch.

## Production URL behavior

The default Wrangler configuration intentionally uses:

- `workers_dev: false` — no duplicate public production `*.workers.dev` URL;
- `preview_urls: true` — branch previews stay available behind Access.

Production should be served only on the client's real hostname.

## Domain connection

### Client DNS is on Cloudflare / directly manageable

Use the normal Worker Custom Domain or route supported by the client's zone.

### Canonical hostname and www redirect (Cloudflare-managed DNS)

Before connecting a public hostname, choose one canonical production URL,
normally the apex (`https://example.com`), and set `SITE_URL` to that URL.

For a zone directly managed in Cloudflare, with an apex Worker Custom Domain:

1. In the zone's **DNS → Records**, review the existing apex A/AAAA/CNAME
   records. Back up current records and remove **only** records conflicting
   with the new Custom Domain. Preserve unrelated records, including MX,
   TXT (SPF, DKIM, DMARC), other subdomains, and email routing.
2. In **Workers & Pages → your Worker → Production → Domains**, connect
   `example.com` as a Custom Domain, then verify the production page loads.
3. Confirm `www.example.com` has a **proxied** DNS record (orange cloud).
   An existing proxied CNAME pointing to the apex can be reused. **A DNS CNAME
   is not an HTTP redirect**: simply pointing `www` at the apex does not
   make `www` route to the apex Worker.
4. In the **example.com zone → Rules → Redirect Rules**, create a
   **Single Redirect**:
   - Match: **Custom filter expression** → Hostname → equals →
     `www.example.com` (never select “All incoming requests”).
   - Type: **Dynamic**.
   - Target expression:
     `concat("https://example.com", http.request.uri.path)`
   - Status code: **301 Permanent Redirect**.
   - **Preserve query string**: enabled.
   - Save/deploy. If the dashboard warns that it cannot confirm a proxied
     `www` record, inspect DNS before accepting the warning; do not add a
     duplicate DNS record.
5. Test `http://www.example.com` and `https://www.example.com` (and
   `/test-path?source=qa`), verifying that they redirect to the equivalent
   `https://example.com` URL. The apex must load without redirect loops.
   Check canonical URLs, Open Graph URLs, and that staging remains `noindex`.

This is a one-time **manual Cloudflare zone configuration per domain**, not
an Astro/Worker code change. The same steps are not necessarily applicable to
client-hosted DNS, Cloudflare for SaaS Custom Hostnames, or a deliberate
www-primary deployment; those require their own routing/redirect plan.

**Guana & Co. lesson (2026-10):** a proxied `www` CNAME alone returned
Cloudflare 522 until the zone-level redirect rule was added.

### Client keeps DNS elsewhere

Use the agency's Cloudflare for SaaS setup.

Current agency convention:

- fallback origin: `proxy-fallback.antidote.lat`;
- friendly CNAME target: `sites.antidote.lat`.

For each external hostname:

1. Create the Custom Hostname in Cloudflare for SaaS.
2. Route that exact hostname to the correct client Worker.
3. Ask the client to create a CNAME from their hostname to `sites.antidote.lat`.
4. Wait until both hostname and certificate status are active.
5. For an already-live hostname, use pre-validation when necessary to avoid
   interruption.

Do not use a catch-all Worker route across the agency zone.

## Recovery

- **staging / feature previews:** recover through Git (revert or fix-forward);
  Cloudflare rebuilds the branch automatically.
- **production:** use Cloudflare production deployment rollback when available
  for immediate recovery, then reconcile Git with a revert so source remains
  the truth.

Validate the production rollback flow on the first real launch of the project.
