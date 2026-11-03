# bblog

Personal blog. Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-first — no `tailwind.config.*`, tokens live in `src/app/globals.css`). Markdown posts from the filesystem, no CMS. Deployed on Vercel.

## Commands

- `pnpm lint` — ESLint 9 flat config
- `pnpm typecheck` — `tsc --noEmit`
- Dev server: `pnpm dev` (assume it's already running; don't start it)

## Structure

- `src/app/` — routes: home (`page.tsx`), `blog/`, `blog/[slug]/`, `contact/`, `api/contact/` (Resend email), `rss.xml/`, `sitemap.ts`, `robots.ts`
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

- `NEXT_PUBLIC_SITE_URL` — falls back to `https://bblog.blog` in prod and localhost:3000 elsewhere. The apex must be the primary domain in Vercel (www → apex), DNS is at GoDaddy
- `RESEND_API_KEY` — contact form; read at request time, so builds don't need it
- `CONTACT_FROM` — sender for the contact form, e.g. `BBLOG <hello@bblog.blog>`, on a domain verified in Resend; unset, Resend's shared `onboarding@resend.dev` is used (delivers only to the account owner)

## Gotchas

- pnpm only (`pnpm-lock.yaml`); don't add an npm or yarn lockfile
- Animated covers: keep authoring them as `.gif` in `public/images/covers/`, then run `scripts/convert-covers.sh` (ffmpeg + cwebp) to produce the `.mp4` and `-poster.webp` that `CoverMedia` serves and the `-og.jpg` (1200×630) used as the Open Graph image. A GIF without them shows a broken cover and no link preview.
- `.mdx` files are picked up by the loader but rendered as plain Markdown — MDX components won't execute
- `next.config.ts` has no remote image domains configured: post images must be local under `public/`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
