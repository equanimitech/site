# equanimi.tech landing

Static Astro site. Monochrome stone palette, single clay accent. Self-hosted Inter variable + system mono. No JS framework, no analytics, no third-party scripts.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # → dist/
pnpm preview  # serve the production build
```

## Inheritance

Design system inherits from `zenborg`: stone monochrome base, OKLCH colors, CSS custom properties for spacing + animation, fluid clamp() typography, `prefers-reduced-motion` guard, wabi-sabi restraint (no gradients, shadows, glassmorphism, illustration). One accent: muted clay/ochre.

## Pending Rafa input

- §1 opening line (placeholder marked `<!-- §1 OPENING — pending Rafa -->`)
- §6 standpoint copy review
- §9 contact email confirmation (default `rafa@equanimi.tech`)
- §10 social links (Substack, GitHub, LinkedIn) + page source URL
- §4 primer link, §7 product links, §8 reading links

## Structure

```
src/
  pages/index.astro
  components/{Section,Pyramid,Project}.astro
  styles/global.css
public/fonts/Inter-Variable.woff2
```
