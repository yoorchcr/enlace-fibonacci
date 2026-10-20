/**
 * Cloudflare Workers Builds exposes the branch it is building as
 * `WORKERS_CI_BRANCH`. Only a build of `main` counts as production.
 * Every other branch and any build where the variable is unset (for example
 * local development or generic CI) fails safe to "not production".
 */
export function isProductionBranchBuild(): boolean {
  return process.env.WORKERS_CI_BRANCH === "main";
}
