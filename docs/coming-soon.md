# Optional Coming Soon pattern

Use a public Coming Soon page only when the real client domain is available
before the website is ready and there is value in showing a branded placeholder.

Recommended flow:

1. Connect the real production domain to `main` and set the real `SITE_URL`.
2. Let `main` serve a minimal branded Coming Soon page.
3. Pass `noindex` to `BaseLayout` on that page so thin temporary content is
   not indexed.
4. Build the real site on `staging`; client review happens on the stable
   Worker Preview.
5. At launch, merge the reviewed `staging → main` PR. The real site replaces
   Coming Soon and normal production indexability takes over.

Keep Coming Soon deliberately small: logo/brand, one short message, and only
essential contact/social links if needed.

Do not add a temporary CMS, countdown logic, password system, or second Worker.

If the domain is not ready yet, skip Coming Soon entirely and work only from
the staging Worker Preview until launch.
