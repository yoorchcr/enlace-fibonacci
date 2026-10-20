/**
 * Site-wide configuration.
 *
 * A client project started from the Foundation should edit this file first:
 * name, language, default metadata, and navigation all live here.
 */
export const SITE = {
  name: "Antidote Foundation",
  lang: "en",
  defaultTitle: "Antidote Website Foundation",
  defaultDescription:
    "A reusable foundation for building small corporate websites and landing pages quickly and professionally.",
  /** Default Open Graph image, relative to the site root. Replace per client. */
  ogImage: "/images/og-default.png",
  nav: [
    { label: "Features", href: "/#features" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
