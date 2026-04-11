# Next Premium Personal Site

A production-ready Next.js 14 personal website with a premium minimal visual system.

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/`: App Router entry, layout, global styles
- `components/layout/`: shared layout primitives (Container, SectionBlock, SectionHeading, SiteHeader)
- `components/sections/`: reusable homepage sections and index exports
- `components/ui/`: behavior primitives (SectionReveal)
- `config/site.ts`: site metadata and navigation config
- `data/`: section-level content sources (`projects`, `methodology`, `versionHistory`)
- `types/content.ts`: shared content type definitions

## Design Constraints Implemented

- Black/white/gray palette + single blue accent
- Large type hierarchy and generous spacing
- Subtle, controlled motion only
- Content-first layout with minimal noise
