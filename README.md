# BDESIGN

Sito/portfolio di uno studio di web design e sviluppo, costruito con Next.js, Tailwind CSS, shadcn/ui e Framer Motion. I progetti sono file Markdown.

## Features

- Progetti basati su file Markdown
- Animazioni parallax allo scroll
- Filtri per tag
- Feed RSS
- SEO ottimizzata con Open Graph e JSON-LD
- Completamente statico (SSG)
- Supporto dark mode

## Getting Started

Avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Aggiungere un nuovo progetto

1. Crea un nuovo file Markdown in `content/projects/`:

```bash
touch content/projects/mio-nuovo-progetto.md
```

2. Aggiungi il frontmatter in cima al file:

```markdown
---
title: "Titolo del progetto"
slug: "mio-nuovo-progetto"
date: "2026-02-04"
excerpt: "Breve descrizione del progetto"
cover: "/images/projects/mio-progetto/cover.jpg"
tags: ["nextjs", "e-commerce"]
author: "BDESIGN"
published: true
---

Il contenuto del progetto va qui...
```

### Campi del frontmatter

| Campo | Obbligatorio | Descrizione |
|-------|--------------|-------------|
| `title` | Sì | Il titolo del progetto |
| `slug` | No | Slug URL (default: nome del file) |
| `date` | Sì | Data in formato ISO (YYYY-MM-DD) |
| `excerpt` | Sì | Descrizione breve per SEO e anteprime |
| `cover` | No | Immagine di copertina (relativa a /public) |
| `tags` | No | Array di tag |
| `author` | No | Autore/studio mostrato sul progetto (default: BDESIGN) |
| `published` | No | `false` per nascondere in produzione (default: `true`) |

## Struttura del progetto

```
/
├── content/
│   └── projects/       # Progetti in Markdown
├── public/
│   └── images/
│       └── projects/   # Immagini dei progetti
├── src/
│   ├── app/
│   │   ├── work/
│   │   │   ├── [slug]/    # Pagina dettaglio progetto
│   │   │   └── page.tsx   # Elenco progetti
│   │   ├── contact/       # Pagina contatti
│   │   └── rss.xml/       # Feed RSS
│   ├── components/
│   │   ├── projects/      # Componenti pagina progetto
│   │   ├── parallax.tsx   # Carosello home
│   │   └── navbar.tsx     # Navigazione
│   └── lib/
│       └── projects.ts    # Utility progetti
```

## Variabili d'ambiente

Crea un file `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://tuodominio.com
RESEND_API_KEY=re_xxxxxxxx   # richiesta per il form contatti (anche in build)
```

## Feed RSS

Il feed RSS è disponibile su `/rss.xml`.

## Deployment

Deploy su Vercel o qualsiasi piattaforma che supporti Next.js:

```bash
npm run build
```

## Tech Stack

- [Next.js 16](https://nextjs.org) - Framework React
- [Tailwind CSS 4](https://tailwindcss.com) - CSS utility-first
- [Framer Motion](https://www.framer.com/motion/) - Animazioni
- [shadcn/ui](https://ui.shadcn.com) - Componenti UI
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Parsing frontmatter
- [remark](https://github.com/remarkjs/remark) - Elaborazione Markdown
