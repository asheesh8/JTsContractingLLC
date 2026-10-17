# JT's Contracting LLC — new website

A rebuild of [jtscontractingvt.com](https://www.jtscontractingvt.com), using the client's own
copy and photography. Static HTML/CSS/JS — no build step, no framework, no dependencies.

```
site/                     ← this is the deployable folder
  index.html              home
  services.html           six services, editorial rows + process
  work.html               filterable gallery + lightbox
  about.html              story, values, fleet, client roster
  contact.html            contact details + quote form
  404.html
  robots.txt  sitemap.xml
  assets/
    css/style.css         design system (tokens → components)
    js/main.js            ~200 lines, vanilla, no deps
    img/                  49 responsive WebP files (11 MB)
    video/                hero reel (6.7 MB)
docs/design-blueprint.md  extracted brand DNA + design decisions
```

> The original full-resolution photos and the old site's raw HTML are archived outside this
> repo (kept local, not published). Everything `site/` needs is committed here — the WebP
> derivatives were generated from those originals at 640/1280/1920 px.

**Live:** https://j-ts-contracting-llc.vercel.app — static site, no environment variables. Vercel serves the `site/` folder (`vercel.json` → `outputDirectory`).

## Run it locally

```bash
python3 -m http.server 4321 --directory site
```

Then open <http://localhost:4321>. It must be served over HTTP — opening `index.html`
directly with `file://` breaks the video and relative fetches.

## Deploy

The site lives in **`site/`**, not the repo root. Every host therefore needs pointing at that
subfolder — this is the one thing that trips up a first deploy (a root-level deploy 404s,
because there is no `index.html` at the root).

**Vercel** — already handled by [`vercel.json`](vercel.json):

```json
{ "outputDirectory": "site" }
```

No build command, no framework. If a deploy still 404s, the project's **Root Directory** in
Vercel → Settings → Build & Deployment is overriding it; either clear it, or set it to `site`
and delete `outputDirectory` from `vercel.json` (don't set both).

**Netlify / Cloudflare Pages** — publish directory `site`, build command empty.

**Any other static host / the current WordPress box** — upload the *contents* of `site/` into
the web root. All paths in the HTML are relative, so it works at any mount point.

`404.html` is picked up automatically by Vercel, Netlify and Cloudflare Pages.

> **Before pointing the real domain here:** `sitemap.xml`, `robots.txt` and every `canonical`
> tag hardcode `https://www.jtscontractingvt.com`. They are correct for the live domain but
> wrong while you're testing on a `*.vercel.app` preview URL — harmless for now, but don't
> submit the sitemap to Search Console until the real domain is attached.

## Before it goes live — three things need a decision

### 1. The quote form has no backend yet
`contact.html` currently shows a success message client-side but **sends nothing**. Wire it to
a real endpoint by adding an `action` to the form — `main.js` detects `action` and steps aside,
letting the post go through:

```html
<form class="form-card" data-form action="https://formspree.io/f/YOUR_ID" method="POST">
```

Formspree, Netlify Forms (`data-netlify="true"`), or Basin all work with zero code. Until then
the form is a demo.

### 2. The Google review count is hard-coded
The rating block says **"Excellent · Based on 26 reviews"** — taken from the current site. I did
not invent a star average, because the source only showed the word "Excellent". If JT wants a
numeric rating (e.g. 4.8) shown, confirm the real figure first and I'll add it plus
`aggregateRating` schema — Google penalises fabricated review markup.

Review count lives in `index.html`, search for `26 reviews`.

### 3. One review was left out
The Google feed includes a negative one-liner ("Jerry needs to work on his attitude…"). Curating
which testimonials to feature is normal, but you should know it was a deliberate omission, not an
oversight.

## What changed from the old site

| Old | New |
|---|---|
| Services page shipped **roofing** boilerplate ("our roofing experts inspect your roof") | Rewritten to their actual six trades |
| Stats contradicted each other: 99% / 98% / 100% success | Standardised on 99% satisfaction + 4,500+ projects |
| Footer LinkedIn → `john-cox-107a2228`, an unrelated person | Removed |
| Stock photos (hard-hat huddle, duct model, cleaning-spray woman) | Their own job photos wherever one existed |
| Big client names buried mid-paragraph | Marquee proof bar + a roster section on About |
| Sister-company numbers only legible inside a signage photo | Real `tel:` links (802-489-1279, 802-871-WIPE) |
| Company values only on an office wall | A section on Home and About |
| Full-size JPEGs, several MB each | Responsive WebP at 640/1280/1920 |

Two stock images are still in use — `dryer-duct` and (as a stand-in) the bathroom photo for
WIPE cleaning — because there were no real photos of duct work or cleaning crews in the library.
**Ask JT for a few photos of those two services** and they can be swapped in directly.

## Editing

Content is plain HTML; edit it in any editor. The design system is token-driven, so global
changes are one line in `assets/css/style.css`:

```css
:root {
  --red: #e01c4a;        /* brand crimson, sampled from the logo */
  --red-text: #a81038;   /* small red text on light — keeps AA contrast */
  --red-on-dark: #ff5b7e;
  --ink: #0b0c0f;
  --paper: #f6f5f3;
}
```

Brand red is only ~4.1:1 against both grounds, so it is used for fills, rules and large type;
small red text uses `--red-text` / `--red-on-dark`. Keep that split when adding copy.

### Adding a gallery project

1. Export the photo at 640 / 1280 / 1920 px wide as WebP into `assets/img/`.
2. Copy a `<button class="tile">` block in `work.html` and update `data-cat`, `data-title`,
   `data-label`, `data-full`, `src` and `alt`.

`data-cat` accepts several space-separated categories, so one photo can appear under
multiple filters.

### Before/after slider (built, not currently used)

`main.js` and `style.css` include a draggable before/after comparison (`.ba`). It is unused
because the only before/after photos in the library were shot from different angles, which makes
a slider look broken — those are shown as a labelled pair instead. Once JT shoots a properly
aligned pair (same spot, same framing — easy on power-washing jobs), use:

```html
<div class="ba">
  <img src="assets/img/before.webp" alt="…">
  <div class="ba-after" aria-hidden="true"><img src="assets/img/after.webp" alt=""></div>
  <span class="ba-tag l">Before</span><span class="ba-tag r">After</span>
  <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Reveal the after photo">
  <div class="ba-handle" aria-hidden="true"></div>
</div>
```

## Notes

- **Accessibility:** skip link, focus-visible rings, keyboard-operable lightbox (arrows + Esc),
  labelled form fields, `aria-current` nav, real alt text, AA contrast throughout, and full
  `prefers-reduced-motion` support.
- **SEO:** per-page titles/descriptions/canonicals, Open Graph, `GeneralContractor` JSON-LD with
  address and service catalogue, sitemap, robots.
- **Fonts** load from Google Fonts. To go fully self-hosted, download Barlow Condensed + Inter
  into `assets/fonts/` and swap the `<link>` for `@font-face`.
- **Video** is 6.7 MB and autoplays muted with a WebP poster. If mobile data is a concern,
  gate it behind `(min-width: 900px)` and let the poster stand in on phones.
