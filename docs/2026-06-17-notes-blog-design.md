# Notes: an evergreen stacked-notes garden for equanimi.tech

**Date:** 2026-06-17
**Status:** design approved, pending spec review → implementation plan

## Problem

equanimitech's writing is scattered. Essays live on Substack (`rafaba.substack.com`,
"Mindful Cyborg" era), and ~2,000+ lines of newer, on-brand prose sit unread across
the monorepo (`torchbearer/docs`, `keel/docs`, `penceive/docs`, `site/docs`, the
landing page itself). Substack is not equanimitech: someone else's chrome, no
sovereignty over the reading surface. The repo prose has no home at all.

We want a reading surface on `equanimi.tech` that (a) gathers this corpus, (b)
embodies the framework rather than just describing it — specifically principle #5,
**Attentional Granularity** (depth on demand) — and (c) keeps RSS as the subscribe
path so we never self-host email.

Reference look/interaction: Andy Matuschak's notes (evergreen, interlinked,
**stacked sliding columns**) over lutr.dev's chronological feed. The garden suits an
interlinked conceptual corpus; a chronological blog does not.

## Solution

An evergreen **notes garden** built entirely inside the existing `/site` Astro
project using native Content Collections. Atomic, interlinked notes — not dated
essays. Granularity is expressed as **per-section expansion** (native
`<details>`). Internal links open as **stacked columns** (Matuschak-style), added as
a progressive-enhancement layer so the garden is fully usable without it.

### Decisions (locked)

- **Paradigm:** evergreen garden (interlinked atomic notes), not a chronological blog.
- **Newsletter:** stays on Substack as the email channel. The garden is the canonical
  home and links back. We do not self-host email. RSS is the on-site subscribe path.
- **Name / route:** "Notes" at `/notes`, individual notes at `/notes/<slug>`.
- **Granularity = per-section expansion** via native `<details>`/`<summary>`.
  Zero JS, accessible, no-CSS-degradable. Replaces the earlier document-level zoom.
- **Format:** Markdown. `<details>` is authored as raw HTML in markdown. **MDX
  deferred** — adopt only if collapsible sections get repetitive enough to want a
  `<Fold>` component. Neither images nor zoom need MDX.
- **Interlinking:** plain markdown links to `/notes/<slug>` for v1. Wikilinks
  (`[[slug]]`, needs one remark dep) are the likely first upgrade if linking is tedious.
- **Stacking:** Matuschak-style columns, built in **Phase 2** as progressive
  enhancement (vanilla JS, ~120 lines). Degrades to normal navigation.
- **Orbit / spaced repetition:** deferred. Embedding hosted Orbit would fail
  principle #1 (Local-First Ownership); a local-first SR build is its own project and
  overlaps Penceive. Not v1, possibly never on the site.
- **Content lives in `site/src/content/notes/`** — site/ deploys standalone; sibling
  repos are unavailable at build time. Publishing = curating a copy into the site.

## Content model

### Collection — `src/content/notes/*.md`

`src/content/config.ts` defines the `notes` collection (Zod schema, build-time validated):

| field | type | required | notes |
|---|---|---|---|
| `title` | string | yes | the note's name |
| `summary` | string | yes | one-line handle; used in index, RSS, OG, and as link preview |
| `date` | date | yes | for RSS ordering + a quiet "last tended" stamp; de-emphasized |
| `tags` | string[] | no | thematic clusters (`#framework`, `#sovereignty`, `#attention`) |
| `status` | enum `evergreen`/`budding`/`seedling` | no | garden maturity; default `budding` |
| `related` | string[] (slugs) | no | explicit cross-links surfaced at note foot |
| `hero` | image | no | optional featured image (Astro image) |
| `draft` | boolean | no | default false; excluded from index + RSS |

Body = markdown. May contain `<details>` for per-section expansion and plain links to
other notes for interlinking.

## Components (Phase 1 — no JS)

Each unit has one purpose, inherits existing styles, is independently checkable.

### 1. Shared shell — `src/layouts/Base.astro`

`index.astro` currently inlines head + masthead + footer. Extract a `Base.astro`
(head + masthead + footer + `<slot/>`) and refactor `index.astro` onto it, so the
landing page, `/notes`, and note pages share one shell. Targeted in-scope cleanup —
all current markup/classes preserved, no redesign.

### 2. Collection config — `src/content/config.ts`

The `notes` schema above.

### 3. Note page — `src/layouts/Note.astro` + `src/pages/notes/[...slug].astro`

`[...slug].astro` does `getCollection('notes')` → `getStaticPaths`, renders body via
`Note.astro`. Layout: centered ~660px reading column, eyebrow (read-time ·
`status` · tags), `<h1>` title, optional hero, prose (inherits `global.css`), a
"related notes" list at the foot (from `related` + back-links where cheap). Read-time
= full-content word-count / 200, computed at build.

### 4. Per-section expansion

Collapsible sections are native `<details><summary>handle</summary>…full…</details>`
authored in markdown. Styled in `global.css` to match the design system (the summary
is the coarse view; open reveals depth). No JS; full content stays in the DOM for
crawlers and the no-CSS fallback.

### 5. Index + entry — `src/pages/notes/index.astro` + a "Start here" note

`/notes` lists notes (title · summary · tags · status), grouped by cluster or listed
newest-first. One note is designated the **"Start here"** entry (e.g. the thesis), the
garden's front door. No pagination yet (revisit at ~25 notes).

### 6. RSS — `src/pages/rss.xml.js`

`@astrojs/rss` (the one new dependency). Emits non-draft notes ordered by date at
`/rss.xml`; autodiscovery `<link>` in `Base.astro` head.

### 7. Navigation edits — in `Base.astro`

Masthead nav gains "Notes" (`/notes`). Footer gains an RSS link and a "Notes" entry.
Existing "Newsletter → Substack" links stay.

## Components (Phase 2 — stacking, progressive enhancement)

### 8. Stacked columns — `src/scripts/stack.js`

Vanilla JS, ~120 lines. Intercepts clicks on internal `/notes/<slug>` links → fetches
the target note's rendered HTML → appends it as a sticky column to the right → pushes
`?stacked=a,b,c` URL state (History API; back/forward works). On load with `?stacked=`,
hydrates the columns. Disabled below a viewport breakpoint and when JS is off — links
just navigate. Changes zero content; if it proves fiddly, Phase 1 stands alone.

This is the site's **first client-side JS** (config currently states "no JS framework,
no client-side routing"). It is progressive enhancement, not a framework — done with
eyes open.

## Architecture / data flow

```
src/content/notes/*.md ──getCollection('notes')──> /notes (index, clustered)
                       ├──getStaticPaths────────────> /notes/<slug> (static page)
                       └──@astrojs/rss──────────────> /rss.xml
Phase 2: internal-link click ──fetch /notes/<slug>──> append column + ?stacked= URL
```

All static, built at `astro build`, deployed to Vercel as today.

## Error handling

- Draft / future-dated notes excluded from index + RSS via filter.
- Malformed frontmatter fails the build (Zod) — caught at build, never runtime.
- Missing hero: layout renders without it.
- Phase 2: a fetch failure or no-JS falls back to plain navigation (the note's own page).

## Testing

Static site; verification is build + visual check.

- `astro build` succeeds with all seed notes (schema validation green).
- `/notes` lists the seed set; every note links to a working page.
- `<details>` sections expand/collapse; full text present with CSS disabled.
- `/rss.xml` is well-formed with the expected item count.
- Light/dark render; reading column centered ~660px; masthead/footer match landing.
- Phase 2: stacking opens columns + updates URL; back/forward restores; narrow
  viewport and JS-off both fall back to navigation.

## Seed content (launch without writing anything new)

Primary seed = the internal corpus (curated copies into `src/content/notes/`).
Opening cluster, interlinked:

| note (working title) | source | status |
|---|---|---|
| **Start here / The thesis** | `site/src/pages/index.astro` (thesis + framework) | evergreen |
| **The Boat** | `torchbearer/docs/2026-05-31-the-boat.md` | evergreen (stamped) |
| **Adaptive Granularity** | `torchbearer/docs/2026-05-28-adaptive-granularity-seven-granularities.md` | evergreen — *the note the garden embodies* |
| **Glance / Ask / Click** | `torchbearer/docs/2026-06-07-glance-ask-click.md` | evergreen (stamped) |
| **UI navigates, MCP does the work** | `torchbearer/docs/2026-05-17-ui-navigates-mcp-does-the-work.md` | budding |
| **Personal OS** | `keel/docs/2026-06-08-personal-os-article-draft.md` | budding |
| **Penceive as infrastructure (the Wake)** | `penceive/docs/ideas/2026-05-31-penceive-as-infrastructure.md` | evergreen (stamped) |
| **Stamped by humans** | `torchbearer/docs/2026-05-26-stamped-by-humans-drafting-brief.md` | seedling (brief → essay) |
| **Deferred extracts** (reference layer) | `site/docs/2026-05-14-deferred-extracts…md` | seedling |

Natural interlinks already present: Boat ↔ each project · Adaptive Granularity ↔
this garden's zoom · Glance/Ask/Click ↔ UI-navigates-MCP · Stamped-by-humans ↔
Tom Bedor reference ↔ Secretariat.

**Backlog (not blocker):** the nine-principle write-ups (only a roadmap +
deferred-extracts reference exist). Publish on a cadence; the garden grows.

**Substack archive:** the 6 Mindful Cyborg essays are an *optional secondary* import,
later — they are chronological-essay shaped and less central than the internal corpus.

## Status and attestation (the seam)

The `status` field is the garden's one convention, and it maps onto Secretariat's
trust model:

- **seedling / budding** are *signature-only*. An agent may have drafted them; they
  are informational, rough on purpose.
- **evergreen** is *stamped* by the principal (signet, Touch ID). The human vouches.

Two properties fall out:

1. Only the principal can mint evergreen. Agents draft seedlings and budding notes;
   they never stamp. The top of the ladder requires Rafa's hand on the wheel. This is
   "stamped by humans" enforced on the studio's own publishing.
2. The stamp is what keeps the open door safe: rough work is visibly rough, firm work
   carries the seal, so everything can be shown without diluting the door's edge.

This mirrors the crystallization gradient: `Ask -> (cache) -> Press` and
`seedling -> (stamp) -> evergreen` are the same move, paying an effortful act once to
precipitate something durable.

At bottom this is sovereignty applied to one's own voice: publishing owned outright,
off the rented platform, the status label an honesty with oneself and the stamp simply
meaning it.

**Build deferred.** Today `status` is an honest frontmatter label, nothing more. When
the first note is firm enough to stamp, build the attestation layer: allow a signet
`$signatures` block through the schema, run `signet verify` at build, render a verified
seal on evergreen notes. Not before.

## Out of scope (YAGNI — add when needed)

Email capture/sending · spaced repetition / Orbit · wikilink syntax · MDX components ·
tag/cluster archive pages · pagination · search · comments · automated sync from
source repos · porting the 6 Substack essays.

## Build sequence

**Phase 1 — the garden (no JS):**
1. Extract `Base.astro`; refactor `index.astro` onto it.
2. Add `src/content/config.ts` with the `notes` schema.
3. Build `Note.astro` + `[...slug].astro`; style `<details>`; add one seed note; verify build.
4. Build `/notes/index.astro` (clustered) + designate "Start here".
5. Add `@astrojs/rss` + `rss.xml.js`; verify feed.
6. Wire nav/footer links + RSS autodiscovery in `Base.astro`.
7. Curate the opening seed notes from the corpus (frontmatter + light edit + interlinks);
   final build + visual check.

**Phase 2 — stacking (progressive enhancement):**
8. Build `stack.js`: link interception, column append, `?stacked=` URL state, hydrate-on-load.
9. Responsive + no-JS fallback; verify back/forward and degradation.
