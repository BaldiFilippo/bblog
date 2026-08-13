export const SITE_NAME = "BBLOG";

// NEXT_PUBLIC_SITE_URL wins when set. The production fallback is the real
// domain so a missing env var degrades to correct OG/RSS links, not to localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bblog.blog"
    : "http://localhost:3000");
