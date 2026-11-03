// Shared by server and client components (no fs here, unlike posts.ts).
// Frontmatter dates are plain "YYYY-MM-DD": parsed as UTC midnight, so they
// must also be formatted in UTC or the day shifts west of Greenwich.
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
