# SEO and content quality guardrails

Use this checklist for every client project derived from the Foundation. The
goal is to make good defaults automatic while keeping page-specific SEO grounded
in the client's real content.

## Core rule for AI-assisted content

AI may draft titles, meta descriptions, image alt text, link text, structured
data, and other SEO copy, but it must derive them from the approved page content
and known client facts.

Never invent services, locations, credentials, awards, prices, opening hours,
statistics, guarantees, testimonials, or other factual claims for SEO.

If the source material is incomplete, use a clear placeholder or flag the
missing fact for review instead of fabricating it.

## Every indexable page

Before production, verify:

- one clear primary topic and one visible `h1`;
- a unique, descriptive `<title>` that matches the page language and content;
- a useful, page-specific meta description;
- a canonical URL pointing to the intended production URL;
- clean, stable, descriptive URL paths (lowercase words separated by hyphens);
- descriptive internal-link anchor text;
- an appropriate Open Graph image and social metadata;
- the page is intentionally indexable;
- the page is included in the production sitemap when appropriate.

Do not keyword-stuff titles, descriptions, headings, alt text, or links.

Do not use vague page titles such as "Home" or "Services" when a more descriptive
title can identify the actual page and business.

There is no guaranteed character limit that Google will display for titles or
snippets. Prefer concise, useful text over writing to an arbitrary pixel or
character formula.

## URL / route hygiene

Choose final slugs before launch when possible.

Good examples:

- `/airport-transfers`
- `/property-management`
- `/wine-tours`

Avoid:

- uppercase/mixed-case routes;
- long keyword strings;
- unnecessary IDs or query parameters for normal content pages;
- dates in evergreen URLs unless the date is part of the content identity.

After a URL has been publicly launched, do not change it casually. If a change
is necessary, preserve the old URL with an appropriate permanent redirect and
update internal links/canonicals.

## Images

Prefer Astro's `<Image />` or `<Picture />` from `astro:assets` for normal
content imagery.

For each image:

- use a short, descriptive filename when practical;
- place the image near relevant content;
- provide alt text that describes the image's useful meaning in that context;
- use `alt=""` for images that are purely decorative;
- do not stuff keywords into alt text;
- use an image representative of the page for Open Graph/social sharing;
- avoid shipping unnecessarily oversized source assets.

Astro requires `alt` on its Image component and can infer dimensions for local
images, helping prevent layout shift.

AI may propose alt text from the actual image and surrounding content, but the
final text must describe the image's purpose on that page rather than act as a
generic SEO caption.

## Structured data

Use structured data only when it accurately represents content visible on the
page and the schema type genuinely applies.

Examples that may be appropriate depending on the project:

- Organization
- LocalBusiness and a more specific subtype
- Service
- Product
- Event
- Article / BlogPosting
- BreadcrumbList

Do not add schema simply because a type exists. Do not mark up content that the
user cannot see, and do not fabricate properties to make a schema appear more
complete.

Validate production structured data with Google's supported testing tools when
it is used.

## Language and multilingual pages

Metadata, headings, alt text, link text, and structured-data content should use
the same language as the page.

For genuinely multilingual sites, each language version must have its own
appropriate metadata and URL. Add `hreflang` only when the site actually has
equivalent alternate-language pages and their URL mapping is known.

## People-first content

SEO copy must still read naturally for a person. Prefer useful, specific
information over filler written only to target keywords.

Where relevant, pages should make core business information easy to understand:
what the client offers, who it is for, where it is offered, and the next action
a visitor can take.

## Pre-launch SEO QA

For the production candidate, verify:

- real `SITE_URL` is configured;
- production has no accidental `noindex`;
- staging remains private and `noindex`;
- production `robots.txt` allows crawling and references the real sitemap;
- sitemap contains only intended canonical production URLs;
- titles and meta descriptions are complete and page-specific;
- headings are semantic and the main `h1` is clear;
- canonical and Open Graph URLs use the real production hostname;
- favicon and social image are client-specific, not Foundation placeholders;
- images have appropriate alt text and dimensions;
- internal links work and use useful anchor text;
- 404 page works;
- structured data, when present, validates and matches visible content;
- mobile layout, accessibility, and performance have been reviewed.

Search Console submission/verification is a launch or post-launch task when the
client/project requires it; it is not hard-coded into the Foundation.
