# JT's Contracting — Design Blueprint

Extracted from jtscontractingvt.com + the client's own photo library, then rebuilt.

## Brand DNA (extracted, not invented)

| Source | Signal |
|---|---|
| Logo `logo-trans.png` | Crimson **#E01C4A**, heavy black outline, condensed athletic lettering |
| Truck fleet photos | American-flag Kenworth livery — patriotic, bold, unmistakable |
| Office photo `20201013_170150` | Values painted on the wall in brand red: **Trust, Excellence, Accountability, Collaboration, Service, Innovation, Gratitude** |
| Copy | "Born into the Business!" · "The Professional You Can TRUST!" · 2nd-generation, est. 1996 |
| Client list (buried in a paragraph) | City of Burlington, UVM, Middlebury College, Cabot Creamery, Redstone, Nedde Real Estate, Bolton Valley |

**The core insight:** the old site buries its two strongest assets — an institutional client
roster and 30 years of real job photography — inside stock imagery and generic template copy.
The rebuild leads with both.

## Palette

```
--red        #E01C4A   brand crimson (sampled from logo)
--red-deep   #A81038   pressed / gradient anchor
--ink        #0B0C0F   near-black ground
--ink-2      #14161B   raised dark surface
--ink-3      #1E2129   borders on dark
--paper      #F6F5F3   warm off-white
--paper-2    #EDEBE7   sunken light surface
--steel      #6E727C   secondary text
--navy       #16233F   flag-blue, used sparingly
```

Dark is the primary ground for hero / proof / CTA bands; warm paper for reading sections.
Red is *accent only* — rules, numerals, eyebrows, one button. Never a red background field.

## Type

- **Display:** Barlow Condensed 700/800, uppercase, tight tracking — echoes the logo's condensed
  athletic weight. Clamped fluid sizing, `1920px` cap.
- **Body:** Inter 400/500, 1.65 line-height, `65ch` measure.
- **Numerals:** Barlow Condensed with `tabular-nums` for stats.

## Layout system

- 12-col grid, `1280px` content max, `88rem` wide-bleed max, fluid gutters via `clamp()`.
- Vertical rhythm on an 8px base; section padding `clamp(5rem, 10vw, 9rem)`.
- Services are **full-width editorial rows**, numbered 01–06 — not a card grid. Big photo,
  big type, alternating side. Reads as a portfolio, not a brochure.

## Signature components

1. **Hero** — full-bleed drone video (their own footage), grain + vignette, oversized headline
   with red rule, stat strip anchored bottom.
2. **Client marquee** — institutional names in condensed caps, infinite scroll. The trust play.
3. **Values wall** — real office photo + the seven painted values, staggered reveal.
4. **Before/after slider** — draggable, from their real graffiti-removal photo.
5. **Filterable work gallery** with keyboard-accessible lightbox.
6. **Sticky mobile call bar** — tap-to-call always in reach (highest-converting element on any
   contractor site).

## Motion

IntersectionObserver reveals (18px rise, 500ms, stagger 60ms), count-up stats, marquee,
drag slider. Everything collapses to static under `prefers-reduced-motion: reduce`.

## Source-site issues corrected

- Services page shipped **roofing** boilerplate ("our roofing experts inspect your roof") —
  they don't sell roofing. Rewritten to their actual trades.
- Stats contradicted across pages (99% / 98% / 100% success). Standardised on **99%** + 4,500+.
- Footer LinkedIn pointed at `john-cox-107a2228` — an unrelated person. Removed.
- Stock photography (hard-hat huddle, duct-cleaning model, cleaning-spray woman) replaced with
  their own job photos wherever a real one existed.
- Sister-company phone numbers (802-489-1279 flooring, 802-871-WIPE cleaning) were only legible
  inside a signage photo. Now real `tel:` links.
