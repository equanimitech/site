# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitor is the author. The site is a public thinking substrate first: the place where the equanimitech framework, its hedges, and its working projects get written down in a form that holds up when read by someone else. Readers are a real but secondary audience, and the ones who matter are people already building in this direction who find the framework and decide to write.

They arrive from a link, a newsletter post, or a project README. They are reading, not operating: scanning the thesis, checking whether the nine principles are serious, and looking for a way in.

## Product Purpose

equanimi.tech is the public face of Equanimitech, an open studio building technology that preserves attention and cultivates equanimity. It states the thesis (engagement tech makes us reactive; equanimitech aims to make us intentional), publishes the nine-principle framework with its design tests, names the open measurement gap, and points at four working projects.

A visit worked when either an email arrives at rafaba@hey.com, or a project gets installed, forked, or tried. Reading depth and RSS subscription are welcome but are not the success condition.

## Positioning

The framework itself is the differentiator: nine principles in three layers (Sovereignty → Awareness → Equanimity), each carrying a falsifiable design test a competing product can be held against. It is published with its own hedge attached, and it is backed by four shipped projects rather than by essays alone. A neighboring "calm technology" site could copy the vocabulary; it could not truthfully copy the design tests plus the running code plus the stated measurement gap.

## Operating Context

- Static Astro 4 site, output `static`, `inlineStylesheets: "always"`, deployed to Vercel at `https://equanimi.tech`.
- pnpm only. `pnpm dev` (localhost:4321), `pnpm build`, `pnpm preview`.
- Surfaces: the single-page landing (`src/pages/index.astro`), the notes garden (`/notes` index plus `[...slug]` note pages), and an RSS feed (`src/pages/rss.xml.js`).
- Content lives in an Astro Content Collection (`src/content/notes`, Zod-validated schema in `src/content/config.ts`). Depth-on-demand inside a note is native `<details>`, no JS.
- Shared shell is `src/layouts/Base.astro`; notes use `src/layouts/Note.astro`.
- Verification is `pnpm build` plus a targeted `dist/` check. There is no test runner and none is being added.

## Capabilities and Constraints

Binding, in force for all future work:

- No JS framework, no client-side routing, no analytics, no third-party scripts. Fonts are self-hosted (Inter Variable + system mono).
- Every link must resolve. Anything with a broken link gets cut, not stubbed. No placeholder or coming-soon pages.
- The hedge language is load-bearing: the principles create the structural conditions under which equanimity can emerge, they do not produce it. Never upgrade this into a causal claim.
- No em dashes in copy or commit messages. Use a colon, comma, or period.
- Prefer `for...of` over `forEach` in `.astro` script blocks.

Open / undecided:

- The notes garden is currently parked as `draft: true` (start-here and the nine principle notes are seeded but not public). Whether and when it goes live is undecided.
- Stacking-column reading layout was deliberately deferred out of Phase 1.
- An `evergreen = stamped attestation` seam is recorded in docs but the build is deferred.

## Brand Commitments

- Name: Equanimitech. Domain and wordmark: equanimi.tech. Brand glyph: `≃`.
- Contact is a plain mailto to rafaba@hey.com. Field notes live on an external Substack newsletter.
- Design system inherits from `zenborg`: stone monochrome base, OKLCH color, CSS custom properties for spacing and animation, fluid `clamp()` typography, one muted clay accent, `prefers-reduced-motion` guard, wabi-sabi restraint. No gradients, shadows, glassmorphism, or illustration.
- Voice: plain, hedged, unhurried. Claims are stated at the strength the evidence supports and no higher.

## Evidence on Hand

Real:

- Four working projects with public GitHub repos under `github.com/equanimitech`: Secretariat, Signet, Zenborg, Keel.
- The EQUA-S scale (Dambrun, Juneau, Ricard) as a validated measure of equanimity in trained practitioners.
- Vipassana practice as the named lineage for awareness and equanimity as two wings of wisdom, treated explicitly as a working hypothesis.
- Ten seeded notes in the content collection (start-here plus the nine principles), currently draft.
- Logo and icon assets in `public/` (`logo-512.png`, `apple-touch-icon.png`, `favicon.svg`); a staged org profile README at `.github/profile/README.md`.

Absent, and never to be fabricated: no users, no customers, no testimonials, no press, no funding, no adoption numbers, no benchmark results, no instrument that measures equanimity passively in a product. The measurement gap is stated as open precisely because it is open.

## Product Principles

1. **Everything must earn its place.** The default answer to a new section, page, or feature is no. Cut before stubbing.
2. **State claims at the strength the evidence supports.** The hedge is not hedging, it is accuracy. A design hypothesis stays a design hypothesis.
3. **Practice the framework on the site itself.** The site is subject to its own nine design tests: no engagement mechanics, no attention capture, no telemetry, bounded reading with a natural end.
4. **Show the work, not the pitch.** Running code and design tests over adjectives and manifesto prose.
5. **Depth on demand, never up front.** Content depth tracks attentional depth. The gross layer reads complete on its own; the subtle layer is there for whoever presses.

## Accessibility & Inclusion

No product-specific standard was established beyond what the existing system already enforces: `prefers-reduced-motion` guard, semantic HTML, and a design that functions with zero client-side JS.
