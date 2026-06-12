# equanimi.tech

Site for Equanimitech, an open studio building technology that preserves attention and cultivates equanimity.

Static Astro. Monochrome stone palette, single clay accent. Self-hosted Inter variable + system mono. No JS framework, no analytics, no third-party scripts.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # → dist/
pnpm preview  # serve the production build
```

## Inheritance

Design system inherits from `zenborg`: stone monochrome base, OKLCH colors, CSS custom properties for spacing and animation, fluid `clamp()` typography, `prefers-reduced-motion` guard, wabi-sabi restraint (no gradients, shadows, glassmorphism, illustration). One accent: muted clay.

## Structure

```
src/
  pages/index.astro
  components/{Section,Project}.astro
  styles/global.css
public/fonts/Inter-Variable.woff2
.github/profile/README.md       # staged for github.com/equanimitech org profile
```

## Discipline

Everything must earn its place. Anything with a broken link gets cut, not stubbed.
