# bblog

Personal blog. Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-first — no `tailwind.config.*`, tokens live in `src/app/globals.css`). Markdown posts from the filesystem, no CMS. Deployed on Vercel.

## Commands

- `pnpm lint` — ESLint 9 flat config
- `pnpm exec tsc --noEmit` — typecheck (there is no `typecheck` script in package.json)
- Dev server: `pnpm dev` (assume it's already running; don't start it)

## Structure

- `src/app/` — routes: home (`page.tsx`), `blog/`, `blog/[slug]/`, `contact/`, `api/contact/` (Resend email), `rss.xml/`
- `src/components/` — shared client components (navbar, parallax, smooth-scroll, loading screen, tilt card); `posts/` for post renderers; `ui/` shadcn-style
- `src/lib/posts.ts` — all content loading/parsing (gray-matter + remark-html, sync fs reads, server-side only)
- `src/lib/post-styles.ts` — single source of truth for title/author classes; the home→post animation alignment depends on it, change with care
- `content/posts/*.md` — the posts; images in `public/images/posts/<slug>/`
- Path alias: `@/*` → `./src/*`

## Content model

Frontmatter: `title`, `date`, `excerpt` required; `slug` (defaults to filename), `cover`, `tags`, `author`, `published`, `url` optional. `published: false` hides a post in production only. Markdown may contain raw HTML (rendered unsanitized — trusted content only); article CSS supports `.image-grid` and `.full-bleed`.

## Conventions

- Component files are kebab-case (`PostFixedHero.tsx` is a legacy exception, don't imitate it)
- Interactive components are `"use client"`; data loading stays server-side in `src/lib/posts.ts`
- Animations: Framer Motion; smooth scroll centralized in `SmoothScroll` (Lenis, exposed as `window.__lenis`)
- Fonts: Geist / Geist Mono (Google) + local Safiro (`--font-safiro`)
- Next 16 async params pattern: `params: Promise<{ slug: string }>`

## Environment

- `NEXT_PUBLIC_SITE_URL` — falls back to localhost:3000; without it in prod, OG/RSS links break
- `RESEND_API_KEY` — contact form; local builds use a dummy value (`RESEND_API_KEY=re_dummy_local_build`)

## Gotchas

- Both `pnpm-lock.yaml` and a stale `package-lock.json` exist: pnpm only, never touch the npm lockfile
- `.mdx` files are picked up by the loader but rendered as plain Markdown — MDX components won't execute
- `next.config.ts` has no remote image domains configured: post images must be local under `public/`
