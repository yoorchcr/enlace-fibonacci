import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const slug = getArg("slug");
const siteName = getArg("name");
const lang = getArg("lang") ?? "es";

if (!slug || !siteName) {
  console.error(
    'Usage: node scripts/init-project.mjs --slug project-slug --name "Client Name" [--lang es]',
  );
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 63) {
  console.error(
    "Invalid --slug. Use lowercase letters, numbers, and single dashes only (max 63 characters).",
  );
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
packageJson.name = slug;
await writeFile("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);

const lockJson = JSON.parse(await readFile("package-lock.json", "utf8"));
lockJson.name = slug;
if (lockJson.packages?.[""]) {
  lockJson.packages[""].name = slug;
}
await writeFile("package-lock.json", `${JSON.stringify(lockJson, null, 2)}\n`);

let wrangler = await readFile("wrangler.jsonc", "utf8");
wrangler = wrangler
  .replace(
    /"name":\s*"[^"]+"/,
    `"name": "${slug}"`,
  )
  .replace(
    /"compatibility_date":\s*"\d{4}-\d{2}-\d{2}"/,
    `"compatibility_date": "${today}"`,
  );
await writeFile("wrangler.jsonc", wrangler);

let siteConfig = await readFile("src/config/site.ts", "utf8");
siteConfig = siteConfig
  .replace(/name:\s*"[^"]+"/, `name: ${JSON.stringify(siteName)}`)
  .replace(/lang:\s*"[^"]+"/, `lang: ${JSON.stringify(lang)}`)
  .replace(/defaultTitle:\s*"[^"]+"/, `defaultTitle: ${JSON.stringify(siteName)}`);
await writeFile("src/config/site.ts", siteConfig);

console.log("");
console.log("Project initialized:");
console.log(`  Worker/package slug: ${slug}`);
console.log(`  Site name: ${siteName}`);
console.log(`  Language: ${lang}`);
console.log(`  Wrangler compatibility date: ${today}`);
console.log("");
console.log("Next:");
console.log("  1. Replace Foundation placeholder content/assets.");
console.log("  2. Commit these changes.");
console.log("  3. Connect the repo to Cloudflare Workers Builds (main = production).");
console.log("  4. Create staging; account-wide Cloudflare Access already protects previews.");
console.log("  5. Set SITE_URL only when the final production hostname is known.");
console.log("  6. At launch, verify www → canonical domain (301, paths/queries); see docs/cloudflare-setup.md.");
