/**
 * Site-wide configuration: name, language, and default metadata.
 *
 * The description is drawn only from the approved page copy (team, claim, and
 * the Estadio Heredia project). Confirm it with the client before launch.
 */
export const SITE = {
  name: "Enlace Fibonacci",
  lang: "es",
  defaultTitle: "Enlace Fibonacci",
  defaultDescription:
    "Enlace Fibonacci: Luis Felipe López y Gerardo López, arquitectos. Proyectos que nacen en el plano y se sienten en el espacio, como el Estadio Heredia.",
  /** Default Open Graph image, relative to the site root. */
  ogImage: "/images/og-enlace-fibonacci.jpg",
} as const;
