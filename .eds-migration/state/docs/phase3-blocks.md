# Phase 3 — Block Development Summary

## Blocks Implemented

### hero
- **Purpose**: Full-width hero with background image, heading overlay, optional CTA
- **Source**: Custom (rewrote from Block Collection pattern — original was empty)
- **Variants**: `default` (static image), `video` (Vimeo iframe or MP4 background)
- **Content model**: Row 1 = background image/video URL; Row 2 = heading + text + CTA
- **CSS**: Gradient overlay, centered content, responsive min-heights (320→480px)

### accordion
- **Purpose**: Expandable Q&A sections for FAQ content
- **Source**: Block Collection (kept JS, restyled CSS)
- **Content model**: Each row = summary | detail body. Uses native `<details>`/`<summary>`
- **CSS**: Purple chevrons, brand-tinted open state, rounded borders

### carousel
- **Purpose**: Image/content slider with navigation dots and arrows
- **Source**: Block Collection (kept JS with placeholders, restyled CSS)
- **Content model**: Each row = image column | content column = one slide
- **CSS**: Purple-tinted content overlay, brand dot indicators, white nav buttons

### cards
- **Purpose**: Responsive grid of content cards with optional images
- **Source**: Block Collection (kept JS, restyled CSS)
- **Variants**: `default`, `no-images` (text-only centered cards)
- **Content model**: Each row = image | body content = one card
- **CSS**: 8px rounded corners, hover lift effect, purple heading color

### tabs
- **Purpose**: Tabbed content panels
- **Source**: Block Collection (kept JS, restyled CSS)
- **Content model**: Each row = tab label | tab content. First child = tab button
- **CSS**: Underline-style tabs with brand-purple active indicator, clean panel

### columns
- **Purpose**: Multi-column layout (image + text side-by-side)
- **Source**: Boilerplate (unchanged JS)
- **Content model**: Each cell in a row = one column
- **CSS**: Boilerplate default, flexbox responsive stacking

### topic-menu (custom)
- **Purpose**: Sticky horizontal anchor navigation for FAQ topic sections
- **Source**: Custom build
- **Content model**: Single row with `<ul>` of `<a href="#id">` anchor links
- **JS**: IntersectionObserver for active-section highlighting, smooth scroll
- **CSS**: Sticky below nav, horizontal scroll on mobile, brand-purple active underline

### clinic-finder (custom)
- **Purpose**: Interactive clinic search (placeholder for Google Maps integration)
- **Source**: Custom build
- **Variants**: `full-page` (map + results side-by-side), `compact` (search + results only)
- **Content model**: Config-style rows (key | value): heading, placeholder, data-source
- **JS**: Reads config, renders search UI + map placeholder + results list, fetches JSON data-source
- **CSS**: Responsive layout, purple-branded search bar, card-style results

### before-after (pre-existing)
- **Purpose**: Before/after image comparison pairs
- **Source**: Previous commit (unchanged)

## Global Styles (styles.css)

- **Brand palette**: `--brand-primary: #6b2fa0`, `--brand-primary-dark: #522180`, `--brand-secondary: #d4145a`, `--brand-accent: #e91e8c`
- **Colors**: Light background `#f6f4f8`, dark `#3c3c3c`, text `#2d2d2d`
- **Buttons**: Primary = purple fill, Secondary = purple outline, Accent = magenta fill
- **Section styles**: `highlight`, `dark`, `centered`, `cta-band`, `qa-section`, `footnotes`
- **Fonts**: Roboto (body) + Roboto Condensed (headings), self-hosted in /fonts/

## Scripts

- **scripts.js**: Boilerplate decoration pipeline, auto-blocks hero, loads header/footer, decorates buttons. Lang set to `nl`.
- **delayed.js**: OneTrust cookie consent, Google Analytics/GTM, Facebook Pixel — all stub-based (IDs loaded from `window.aem.*` config).
- **placeholders.js**: Fetches `/placeholders.json` for localized strings.
- **aem.js**: Unmodified boilerplate core.

## head.html

- CSP meta header
- Viewport meta
- aem.js + scripts.js modules
- styles.css stylesheet
- Font preload for Roboto Regular
- Favicon link

## Dependencies from Block Collection

| Block | Source URL |
|-------|-----------|
| accordion | https://github.com/adobe/aem-block-collection/blob/main/blocks/accordion/ |
| carousel | https://github.com/adobe/aem-block-collection/blob/main/blocks/carousel/ |
| cards | https://github.com/adobe/aem-block-collection/blob/main/blocks/cards/ |
| tabs | https://github.com/adobe/aem-block-collection/blob/main/blocks/tabs/ |
| columns | Boilerplate default |
| header | Boilerplate default |
| footer | Boilerplate default |
| fragment | Boilerplate default |
