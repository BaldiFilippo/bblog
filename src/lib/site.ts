export const SITE_NAME = "BBLOG";

// NEXT_PUBLIC_SITE_URL wins when set. The production fallback is the host
// Vercel actually serves (the apex 308s to www), so a missing env var degrades
// to correct canonical/OG/RSS links, not to localhost or to a redirecting URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.bblog.blog"
    : "http://localhost:3000");
