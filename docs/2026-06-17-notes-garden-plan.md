# Notes Garden (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an evergreen, interlinked notes garden at `equanimi.tech/notes` with per-section expansion and RSS, seeded from the existing repo prose, with zero client-side JS.

**Architecture:** Build inside the existing Astro static site. A `notes` Content Collection holds atomic markdown notes; one note layout renders them in a centered reading column with native `<details>` for depth-on-demand; an index page lists them; an `@astrojs/rss` endpoint emits the feed. A shared `Base.astro` shell is extracted from `index.astro` so the landing page and the garden wear the same `≃` chrome. Stacking columns are deliberately out of this phase.

**Tech Stack:** Astro 4 (static), Astro Content Collections (Zod), `@astrojs/rss`, hand-rolled CSS in `global.css`, pnpm. No JS framework. No test runner.

## Global Constraints

- Output is `static`; `inlineStylesheets: "always"`; deployed to Vercel. (`astro.config.mjs`)
- `site: "https://equanimi.tech"`. Canonical/OG URLs use this origin.
- No JS framework, no client-side routing in Phase 1. (`astro.config.mjs` comment is load-bearing.)
- Preserve all existing markup, class names, and the `≃` design system when refactoring. No redesign.
- Package manager is **pnpm** (never npm/yarn).
- **No em dashes** in any copy or commit message (use a colon, comma, or period).
- Verification per task = `pnpm build` succeeds (Zod schema validates) + a targeted `dist/` check. There is no unit-test framework and we are not adding one.
- Prefer `for...of` over `forEach` in any `.astro` script blocks.

---

### Task 1: Extract `Base.astro` shared shell

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (replace inlined head/masthead/footer with `<Base>`)

**Interfaces:**
- Produces: `Base.astro` accepting props `{ title: string; description: string; path: string; tagline?: string }`. Renders `<html>`, `<head>` (meta/OG/canonical/favicon/font preload built from props, `og:url` and canonical = `https://equanimi.tech` + `path`), `<header class="masthead">` (brand glyph + wordmark + nav; renders `<p class="tagline">` only if `tagline` provided), a `<slot/>` for page body, and the existing `<footer class="footer">`. Nav links: GitHub, Newsletter (Substack), Contact.

- [ ] **Step 1: Create `Base.astro`** by moving the head, masthead, and footer markup verbatim out of `index.astro`. Parameterize the page-specific bits with props.

```astro
---
import "../styles/global.css";
interface Props {
  title: string;
  description: string;
  path: string;       // leading-slash path, e.g. "/" or "/notes"
  tagline?: string;   // masthead tagline; homepage only
}
const { title, description, path, tagline } = Astro.props;
const url = `https://equanimi.tech${path}`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="color-scheme" content="light dark" />
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <link rel="canonical" href={url} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="512x512" href="/logo-512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:image" content="https://equanimi.tech/logo-512.png" />
    <link rel="alternate" type="application/rss+xml" title="equanimi.tech Notes" href="/rss.xml" />
    <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body>
    <header class="masthead">
      <a class="brand" href="/" aria-label="equanimi.tech, home">
        <svg class="brand__glyph" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" aria-hidden="true">
          <path d="M5 13 C 8 7, 14 7, 16 13 C 18 19, 24 19, 27 13"/>
          <path d="M6 22 H26"/>
        </svg>
        <span class="wordmark">equanimi<span class="dot">.</span>tech</span>
      </a>
      {tagline && <p class="tagline">{tagline}</p>}
      <nav class="masthead__nav" aria-label="Primary">
        <a href="/notes">Notes</a>
        <a href="https://github.com/equanimitech" rel="noreferrer noopener">GitHub</a>
        <a href="https://rafaba.substack.com/" rel="noreferrer noopener">Newsletter</a>
        <a href="/#door">Contact</a>
      </nav>
    </header>
    <slot />
    <footer id="footer" class="footer">
      <div class="footer__inner">
        <div class="footer__cols">
          <div class="footer__col footer__col--lab">
            <p class="footer__brand">
              <svg class="brand__glyph" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" aria-hidden="true">
                <path d="M5 13 C 8 7, 14 7, 16 13 C 18 19, 24 19, 27 13"/>
                <path d="M6 22 H26"/>
              </svg>
              <span class="wordmark">equanimi<span class="dot">.</span>tech</span>
            </p>
            <p class="footer__blurb">An open studio building technology that preserves attention and cultivates equanimity. The garage door stays up: working code, not finished products.</p>
          </div>
          <div class="footer__col">
            <p class="footer__head">Read</p>
            <p><a href="/notes">Notes</a></p>
            <p><a href="/rss.xml">RSS</a></p>
            <p><a href="https://rafaba.substack.com/">Newsletter</a></p>
          </div>
          <div class="footer__col">
            <p class="footer__head">Connect</p>
            <p><a href="mailto:rafaba@hey.com">rafaba@hey.com</a></p>
            <p><a href="https://github.com/equanimitech">GitHub</a></p>
          </div>
        </div>
        <p class="footer__base">Equanimitech, an open studio. Here, working. 2026.</p>
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Refactor `index.astro`** to use `Base`. Remove the now-duplicated head/masthead/footer; keep all `<main>`/hero/section content as the slotted body. The file's frontmatter becomes:

```astro
---
import Base from "../layouts/Base.astro";
import Section from "../components/Section.astro";
import Project from "../components/Project.astro";
const title = "equanimi.tech";
const description = "An open studio building technology that preserves attention and cultivates equanimity.";
---
<Base title={title} description={description} path="/" tagline={description}>
  <section id="hero" class="hero">
    <p class="hero__text">We, the users, are being used.</p>
  </section>
  <main>
    {/* ... existing Section/Project content unchanged ... */}
  </main>
</Base>
```

Keep every existing `<Section>`, `<Project>`, and prose block inside `<main>` exactly as-is.

- [ ] **Step 3: Build and verify homepage parity**

Run: `pnpm build`
Expected: build succeeds. Then `grep -c 'class="masthead"' dist/index.html` returns `1`, and `grep -c 'We, the users, are being used.' dist/index.html` returns `1`.

- [ ] **Step 4: Visual parity check**

Run: `pnpm preview` and open `/`. Confirm masthead, hero, all sections, and footer render identically to before (the only intended change: nav now has a "Notes" link, footer "Read" column).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "refactor(site): extract Base.astro shell shared by landing page and garden"
```

---

### Task 2: Define the `notes` content collection

**Files:**
- Create: `src/content/config.ts`

**Interfaces:**
- Produces: a `notes` collection (`type: 'content'`) with schema `{ title: string; summary: string; date: Date; tags?: string[]; status?: 'evergreen'|'budding'|'seedling'; related?: string[]; hero?: image; draft?: boolean }`. `status` defaults to `'budding'`, `draft` defaults to `false`. Later tasks import via `getCollection('notes')`.

- [ ] **Step 1: Write the collection config**

```ts
import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      status: z.enum(["evergreen", "budding", "seedling"]).default("budding"),
      related: z.array(z.string()).optional(),
      hero: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { notes };
```

- [ ] **Step 2: Add a throwaway note so the collection is non-empty for the build**

Create `src/content/notes/_smoke.md`:

```md
---
title: Smoke note
summary: Temporary note to validate the collection builds.
date: 2026-06-17
status: seedling
draft: true
---

Temporary. Deleted in Task 7.
```

- [ ] **Step 3: Build to verify schema validates**

Run: `pnpm build`
Expected: build succeeds with no Zod errors. (Draft note produces no page yet; that wiring is Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/notes/_smoke.md
git commit -m "feat(notes): define notes content collection schema"
```

---

### Task 3: Note layout + dynamic route + `<details>` styling

**Files:**
- Create: `src/layouts/Note.astro`
- Create: `src/pages/notes/[...slug].astro`
- Modify: `src/styles/global.css` (append `.note`, `.note__eyebrow`, `details`/`summary` rules)

**Interfaces:**
- Consumes: `Base.astro` (Task 1), `getCollection('notes')` (Task 2).
- Produces: static pages at `/notes/<slug>` for every non-draft note. `Note.astro` props: `{ note: CollectionEntry<'notes'>; readingTime: number }`.

- [ ] **Step 1: Write `Note.astro`**

```astro
---
import Base from "./Base.astro";
import type { CollectionEntry } from "astro:content";
interface Props { note: CollectionEntry<"notes">; readingTime: number; }
const { note, readingTime } = Astro.props;
const { Content } = await note.render();
const { title, summary, status, tags = [] } = note.data;
---
<Base title={`${title} | equanimi.tech`} description={summary} path={`/notes/${note.slug}`}>
  <main class="note">
    <a class="note__back" href="/notes">&larr; Notes</a>
    <p class="note__eyebrow">{readingTime} min read &middot; {status}{tags.length ? ` · ${tags.map((t) => `#${t}`).join(" ")}` : ""}</p>
    <h1 class="note__title">{title}</h1>
    <article class="prose note__body">
      <Content />
    </article>
  </main>
</Base>
```

- [ ] **Step 2: Write `[...slug].astro`** (reading time computed from word count at build)

```astro
---
import { getCollection } from "astro:content";
import Note from "../../layouts/Note.astro";

export async function getStaticPaths() {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  return notes.map((note) => {
    const words = note.body.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(words / 200));
    return { params: { slug: note.slug }, props: { note, readingTime } };
  });
}
const { note, readingTime } = Astro.props;
---
<Note note={note} readingTime={readingTime} />
```

- [ ] **Step 3: Append styles to `global.css`** (match the existing prose/reading scale; ~660px column)

```css
/* --- Notes garden --- */
.note { max-width: 42rem; margin-inline: auto; padding: 4rem 1.25rem 6rem; }
.note__back { display: inline-block; margin-bottom: 2rem; font-size: 0.9rem; opacity: 0.7; }
.note__eyebrow { font-size: 0.85rem; letter-spacing: 0.02em; opacity: 0.65; margin: 0 0 0.5rem; }
.note__title { font-size: clamp(1.8rem, 4vw, 2.6rem); line-height: 1.15; margin: 0 0 2rem; }
.note__body details { border-left: 2px solid currentColor; padding-left: 1rem; margin: 1.5rem 0; opacity: 0.95; }
.note__body summary { cursor: pointer; font-weight: 600; }
.note__body summary::-webkit-details-marker { color: currentColor; }
```

- [ ] **Step 4: Flip the smoke note to non-draft temporarily and build**

Temporarily set `draft: false` in `src/content/notes/_smoke.md`, then:
Run: `pnpm build`
Expected: build succeeds; `test -f dist/notes/_smoke/index.html` exits 0; `grep -c 'min read' dist/notes/_smoke/index.html` returns `1`. Then revert `draft: true`.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Note.astro src/pages/notes/[...slug].astro src/styles/global.css
git commit -m "feat(notes): note layout, dynamic route, and per-section details styling"
```

---

### Task 4: Notes index + "Start here" entry

**Files:**
- Create: `src/pages/notes/index.astro`

**Interfaces:**
- Consumes: `Base.astro`, `getCollection('notes')`.
- Produces: a page at `/notes` listing non-draft notes newest-first (title link, summary, status, tags). A note whose slug is `start-here` (if present) is pinned to the top under a "Start here" heading.

- [ ] **Step 1: Write the index page**

```astro
---
import Base from "../../layouts/Base.astro";
import { getCollection } from "astro:content";
const all = (await getCollection("notes", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
const start = all.find((n) => n.slug === "start-here");
const rest = all.filter((n) => n.slug !== "start-here");
const description = "An evergreen garden of notes on attention, sovereignty, and equanimity.";
---
<Base title="Notes | equanimi.tech" description={description} path="/notes">
  <main class="notes-index">
    <h1 class="notes-index__title">Notes</h1>
    <p class="notes-index__intro">{description}</p>
    {start && (
      <section class="notes-index__start">
        <p class="notes-index__eyebrow">Start here</p>
        <a class="note-card" href={`/notes/${start.slug}`}>
          <span class="note-card__title">{start.data.title}</span>
          <span class="note-card__summary">{start.data.summary}</span>
        </a>
      </section>
    )}
    <ul class="notes-index__list">
      {rest.map((n) => (
        <li>
          <a class="note-card" href={`/notes/${n.slug}`}>
            <span class="note-card__title">{n.data.title}</span>
            <span class="note-card__summary">{n.data.summary}</span>
            <span class="note-card__meta">{n.data.status}{n.data.tags?.length ? ` · ${n.data.tags.map((t) => `#${t}`).join(" ")}` : ""}</span>
          </a>
        </li>
      ))}
    </ul>
  </main>
</Base>
```

- [ ] **Step 2: Append index styles to `global.css`**

```css
.notes-index { max-width: 42rem; margin-inline: auto; padding: 4rem 1.25rem 6rem; }
.notes-index__title { font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 0 0 0.5rem; }
.notes-index__intro { opacity: 0.7; margin: 0 0 3rem; }
.notes-index__eyebrow { font-size: 0.85rem; letter-spacing: 0.02em; opacity: 0.65; margin: 0 0 0.5rem; }
.notes-index__list { list-style: none; padding: 0; margin: 2rem 0 0; }
.note-card { display: grid; gap: 0.25rem; padding: 1rem 0; border-top: 1px solid color-mix(in srgb, currentColor 15%, transparent); text-decoration: none; }
.note-card__title { font-weight: 600; }
.note-card__summary { opacity: 0.75; }
.note-card__meta { font-size: 0.8rem; opacity: 0.55; }
```

- [ ] **Step 3: Build and verify**

Run: `pnpm build`
Expected: build succeeds; `test -f dist/notes/index.html` exits 0; `grep -c 'note-card' dist/notes/index.html` returns at least `1` once real notes exist (Task 7). With only the draft smoke note, the list is empty but the page builds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/notes/index.astro src/styles/global.css
git commit -m "feat(notes): garden index with pinned Start here entry"
```

---

### Task 5: RSS feed

**Files:**
- Create: `src/pages/rss.xml.js`
- Modify: `package.json` (add `@astrojs/rss`)

**Interfaces:**
- Consumes: `getCollection('notes')`, `context.site` (= `https://equanimi.tech`).
- Produces: a valid RSS document at `/rss.xml` with one `<item>` per non-draft note (title, summary as description, link, pubDate). The autodiscovery `<link>` already exists in `Base.astro` (Task 1).

- [ ] **Step 1: Install the official RSS package**

Run: `pnpm add @astrojs/rss`
Expected: `@astrojs/rss` appears under dependencies in `package.json`.

- [ ] **Step 2: Write the endpoint**

```js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const notes = (await getCollection("notes", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: "equanimi.tech Notes",
    description: "An evergreen garden of notes on attention, sovereignty, and equanimity.",
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      pubDate: note.data.date,
      link: `/notes/${note.slug}/`,
    })),
  });
}
```

- [ ] **Step 3: Build and verify the feed is well-formed**

Run: `pnpm build`
Expected: build succeeds; `test -f dist/rss.xml` exits 0; `grep -c '<rss' dist/rss.xml` returns `1`.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/pages/rss.xml.js
git commit -m "feat(notes): RSS feed at /rss.xml via @astrojs/rss"
```

---

### Task 6: Seed the opening notes from the corpus

**Files:**
- Create: `src/content/notes/start-here.md`
- Create: `src/content/notes/the-boat.md`
- Create: `src/content/notes/adaptive-granularity.md`
- Create: `src/content/notes/glance-ask-click.md`
- Create: `src/content/notes/ui-navigates-mcp-does-the-work.md`
- Create: `src/content/notes/personal-os.md`
- Create: `src/content/notes/penceive-as-infrastructure.md`
- Create: `src/content/notes/stamped-by-humans.md`
- Delete: `src/content/notes/_smoke.md`

**Interfaces:**
- Consumes: the collection schema (Task 2). Each file carries valid frontmatter and interlinks to siblings with plain `/notes/<slug>` links.

- [ ] **Step 1: Curate each note.** For each source file below, read it, convert to a self-contained note body, write frontmatter, and replace cross-references with markdown links to sibling notes. Source → destination map:

| destination slug | source file | status |
|---|---|---|
| `start-here` | `../../torchbearer/docs` thesis + `site/src/pages/index.astro` framework prose | evergreen |
| `the-boat` | `../../torchbearer/docs/2026-05-31-the-boat.md` | evergreen |
| `adaptive-granularity` | `../../torchbearer/docs/2026-05-28-adaptive-granularity-seven-granularities.md` | evergreen |
| `glance-ask-click` | `../../torchbearer/docs/2026-06-07-glance-ask-click.md` | evergreen |
| `ui-navigates-mcp-does-the-work` | `../../torchbearer/docs/2026-05-17-ui-navigates-mcp-does-the-work.md` | budding |
| `personal-os` | `../../keel/docs/2026-06-08-personal-os-article-draft.md` | budding |
| `penceive-as-infrastructure` | `../../penceive/docs/ideas/2026-05-31-penceive-as-infrastructure.md` | evergreen |
| `stamped-by-humans` | `../../torchbearer/docs/2026-05-26-stamped-by-humans-drafting-brief.md` | seedling |

Frontmatter template (fill per note; keep `summary` to one line; **no em dashes**; strip any `$attestation`/signature blocks from stamped sources):

```md
---
title: The Boat
summary: Why equanimity is the load-bearing part you cannot see.
date: 2026-05-31
status: evergreen
tags: [framework]
related: [adaptive-granularity, penceive-as-infrastructure]
---

Body in markdown. Use <details> for depth-on-demand where a section has a
coarse summary and a deeper expansion. Link siblings inline, e.g.
[Adaptive Granularity](/notes/adaptive-granularity).
```

For `adaptive-granularity` specifically: render at least one `<details>` block so the note that explains depth-on-demand demonstrates it.

- [ ] **Step 2: Delete the smoke note**

```bash
rm src/content/notes/_smoke.md
```

- [ ] **Step 3: Build and verify the garden is populated**

Run: `pnpm build`
Expected: build succeeds (all 8 notes pass Zod); then:
- `ls dist/notes | grep -c index.html` reflects 8 note dirs + the index.
- `grep -c 'note-card' dist/notes/index.html` returns `7` (rest) plus the pinned start-here card.
- `grep -c '<item>' dist/rss.xml` returns `8`.

- [ ] **Step 4: Visual check**

Run: `pnpm preview`. Visit `/notes` (Start here pinned, 7 listed), click into 3 notes, confirm interlinks resolve, expand a `<details>` on `adaptive-granularity`, toggle light/dark.

- [ ] **Step 5: Commit**

```bash
git add src/content/notes
git commit -m "content(notes): seed the garden with eight interlinked notes from the corpus"
```

---

## Self-Review

**Spec coverage:** collection schema (T2), note page + per-section details (T3), index + Start here (T4), RSS + autodiscovery (T1 head + T5), shared Base shell + nav/footer wiring (T1), seed from corpus + drop the 6-Substack-port to optional (T6). Phase 2 stacking intentionally excluded. No gaps.

**Placeholders:** none. T6 is curation (read source, write note), not a code placeholder; the frontmatter template and source map are concrete.

**Type consistency:** `getCollection('notes', ({data}) => !data.draft)` used identically in T3/T4/T5. `Note.astro` props `{ note, readingTime }` match what `[...slug].astro` passes. Slug `start-here` referenced in T4 matches the file created in T6. `summary` field used as description in T3/T4/T5 matches the schema in T2.
