import type { APIRoute } from "astro";
import { isProductionBranchBuild } from "../utils/production-branch";

// BaseLayout adds noindex/nofollow to every non-main build. Keep robots.txt
// crawlable in previews so that, if Access is ever misconfigured, crawlers can
// still reach the page-level noindex directive. Staging never advertises a sitemap.
const noindex = !isProductionBranchBuild();

export const GET: APIRoute = ({ site }) => {
  const body = noindex
    ? "User-agent: *\nAllow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site).href}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
