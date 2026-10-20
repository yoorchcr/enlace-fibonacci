// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const PLACEHOLDER_SITE_URL = "https://foundation.example.com";
const siteUrl = process.env.SITE_URL;
const branch = process.env.WORKERS_CI_BRANCH;
const isProductionBranch = branch === "main";
const site = siteUrl ?? PLACEHOLDER_SITE_URL;

// The generic Foundation, local development, CI, and non-production previews may
// build without SITE_URL. A real production build of `main` may not: shipping
// placeholder canonicals / Open Graph URLs / sitemap URLs is a launch blocker.
/** @type {import("astro").AstroIntegration} */
const siteUrlGuard = {
  name: "site-url-guard",
  hooks: {
    "astro:build:start": ({ logger }) => {
      const hasRealSiteUrl =
        typeof siteUrl === "string" &&
        siteUrl.length > 0 &&
        siteUrl !== PLACEHOLDER_SITE_URL;

      if (isProductionBranch && !hasRealSiteUrl) {
        throw new Error(
          "Production build blocked: SITE_URL must be set to the real production " +
            "URL before main can deploy. Refusing to publish placeholder canonical, " +
            "Open Graph, and sitemap URLs.",
        );
      }

      if (!siteUrl) {
        logger.warn(
          "SITE_URL is not set — building with the placeholder " +
            `${PLACEHOLDER_SITE_URL}. This is allowed for local/CI/preview builds only.`,
        );
      }
    },
  },
};

export default defineConfig({
  site,
  output: "static",
  // Staging/feature previews are private behind Cloudflare Access and do not
  // publish a sitemap. Production main publishes the sitemap normally.
  integrations: [siteUrlGuard, ...(isProductionBranch ? [sitemap()] : [])],
  vite: {
    plugins: [tailwindcss()],
  },
});
