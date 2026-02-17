# My Blog

A modern, file-based blog built with Next.js, Tailwind CSS, shadcn/ui, and Framer Motion.

## Features

- File-based blog posts using Markdown
- Beautiful parallax scroll animations
- Tag-based filtering
- RSS feed
- SEO optimized with Open Graph and JSON-LD
- Fully static (SSG)
- Dark mode support

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding a New Post

1. Create a new Markdown file in `content/blog/`:

```bash
touch content/blog/my-new-post.md
```

2. Add the frontmatter at the top of the file:

```markdown
---
title: "My Post Title"
slug: "my-new-post"
date: "2026-02-04"
excerpt: "A brief description of your post"
cover: "/images/blog/my-cover.jpg"
tags: ["nextjs", "design"]
published: true
---

Your post content goes here...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The post title (displayed in the title style) |
| `slug` | No | URL slug (defaults to filename if omitted) |
| `date` | Yes | Publication date in ISO format (YYYY-MM-DD) |
| `excerpt` | Yes | Short description for SEO and previews |
| `cover` | No | Cover image path (relative to /public) |
| `tags` | No | Array of tags for categorization |
| `published` | No | Set to `false` to hide in production (default: `true`) |

### Markdown Features

- Headings (H1-H6)
- Code blocks with syntax highlighting
- Images
- Links (external links open in new tab)
- Lists (ordered and unordered)
- Blockquotes
- Tables

## Project Structure

```
/
├── content/
│   └── blog/          # Markdown blog posts
├── public/
│   └── images/        # Static images
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── [slug]/    # Post detail page
│   │   │   └── tag/[tag]/ # Tag filter page
│   │   └── rss.xml/       # RSS feed
│   ├── components/
│   │   ├── parallax.tsx   # Home page carousel
│   │   ├── navbar.tsx     # Navigation
│   │   └── ui/            # shadcn/ui components
│   └── lib/
│       └── blog.ts        # Blog utilities
```

## Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## RSS Feed

The RSS feed is available at `/rss.xml`.

## Deployment

Deploy on Vercel or any platform that supports Next.js:

```bash
npm run build
```

The blog is fully static and can be deployed to any static hosting service.

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework
- [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [remark](https://github.com/remarkjs/remark) - Markdown processing
