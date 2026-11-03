export const SITE_NAME = "BBLOG";

// NEXT_PUBLIC_SITE_URL wins when set. The production fallback is the apex
// domain, which must be the primary domain in Vercel (www redirects to it) or
// every canonical/OG/RSS link points at a redirect.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bblog.blog"
    : "http://localhost:3000");
