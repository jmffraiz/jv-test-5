# Phase 2 Analysis — juvederm.nl Migration Blueprint

**Run ID:** 75030df9  
**Generated:** 2026-04-20  
**Site:** https://www.juvederm.nl  

## Executive Summary

Juvederm.nl is a 14-page Dutch aesthetics brand site built on AEM Cloud Service with EMU (Experience Manager Unified) components. The site maps well to EDS — 7 of 11 content blocks have direct Block Collection equivalents, 3 custom blocks already exist locally, and 1 needs to be built from scratch (image-map). After deduplication (homepage + clinic finder aliases), the effective site is 10 unique pages across 7 archetypes.

---

## Block Palette

### Block Collection Blocks (7)

| Block | Purpose | Archetypes | Notes |
|-------|---------|------------|-------|
| **hero** | Full-width banner with image/video, heading, CTA | homepage, treatment-page, faq, clinic-finder | Video variant for homepage only. Already local. |
| **cards** | Treatment area card grid | homepage, treatment-page | Image + text + link per card. Already local. |
| **carousel** | Rotating slideshow | homepage, treatment-page, faq | Products variant shows 3-4 items visible. Already local. |
| **accordion** | Expandable Q&A pairs | treatment-page, faq | Standard 2-column Q/A collection. Already local. |
| **columns** | Side-by-side layout | homepage, treatment-page, faq | 2-col for media-text, 3-col for product info. Already local. |
| **tabs** | Tabbed content panels | homepage, treatment-page | Used for treatment areas section. Already local. |
| **embed** | Video embed (Vimeo) | treatment-page | Auto-blocked from Vimeo URLs. **Needs to be added from Block Collection.** |

### Custom Blocks (4)

| Block | Purpose | Archetypes | Notes |
|-------|---------|------------|-------|
| **before-after** | Image comparison slider | homepage, treatment-page | Drag-to-compare interaction. Already local. No BC equivalent. |
| **clinic-finder** | Clinic search widget | homepage, treatment-page, clinic-finder | Google Maps Places API integration. Config-style block. Already local. |
| **topic-menu** | Sticky anchor navigation | faq | In-page scroll-spy navigation. Already local. |
| **image-map** | Interactive face image with markers | homepage, treatment-page | **Must be built from scratch.** No BC or Block Party equivalent. |

### Default Content Patterns (4)

| Pattern | Purpose | Notes |
|---------|---------|-------|
| Brand statements | Centered heading + paragraph | Section style `brand-statement`, no block needed |
| Footnotes | Small legal text | Section style `footnotes`, small-text CSS |
| CTA buttons | Bold links → primary buttons | `**[text](url)**` = filled button convention |
| Legal/contact text | Plain headings + paragraphs | No blocks — pure default content |

---

## Content Model Decisions

### hero
**Model:** Standalone — Row 1: background media, Row 2: overlay content (h1 + text + CTA).  
**Why:** Keeps authoring simple. Author drops in an image/video, then writes the overlay text. Bold link = CTA button. Video variant via block variant name `Hero (video)`.  
**Trade-off:** Could have separated heading and CTA into distinct rows, but single-cell content is more flexible and aligns with Block Collection hero pattern.

### cards
**Model:** Collection — Each row: [Image | Content (heading + text + link)].  
**Why:** Natural collection pattern. Image in col 1, everything else in col 2. Max 2 cells per row.

### accordion
**Model:** Collection — Each row: [Question | Answer].  
**Why:** Standard Q&A pattern matching Block Collection. 2 cells per row, clean and predictable.

### columns
**Model:** Standalone — Single row with 2 or 3 cells.  
**Why:** Author controls LTR/RTL by placing image in left or right column. 3-col variant via `Columns (3-col)`.  
**Trade-off:** Considered separate blocks for media-text vs 3-up, but columns block with variants is more minimal and reuses existing code.

### before-after
**Model:** Collection — Each row: [Before image | After image].  
**Why:** Two images per pair, carousel variant holds multiple pairs. Heading/context goes in a preceding default content paragraph.  
**Trade-off:** Considered embedding heading in the block, but keeping it as default content above is more flexible and follows EDS conventions.

### clinic-finder
**Model:** Configuration — Key-value rows for heading, placeholder, API key, results URL.  
**Why:** This block is API-driven (Google Maps) with minimal authored content. Config pattern keeps it clean. Variant name controls compact vs full-page behavior.

### image-map
**Model:** Standalone — Row 1: base image, Row 2+: [Label | Link URL].  
**Why:** Keeps marker definitions simple. JS positions markers based on label text matching predefined coordinate data.  
**Trade-off:** Considered authoring coordinates as additional cells, but that's poor author UX. Better to hardcode coordinate mappings in JS keyed to known treatment area labels.

### topic-menu
**Model:** Standalone — Single cell with a bulleted list of anchor links.  
**Why:** Author creates a simple list; block handles sticky positioning and scroll-spy. Minimally invasive.

### embed
**Model:** Auto-blocked — Author pastes a Vimeo URL as default content; embed block auto-detects it.  
**Why:** Zero authoring friction. Standard Block Collection pattern.

---

## What Was Left as Default Content and Why

1. **Brand statements** — Centered heading + paragraph. Adding a block would be over-engineering for content that needs no interactivity. Section style class handles centering and typography.

2. **Footnotes** — Small legal text paragraphs. A section style with smaller font size is sufficient. No structural transformation needed.

3. **CTA buttons** — Links styled as buttons via CSS conventions (`**[text](url)**` = primary). This is standard EDS practice and doesn't need a block.

4. **Legal/contact/informational pages** — Pure text content (headings, paragraphs, lists). No blocks needed at all — default content handles these completely.

5. **Section headings** — Many sections start with an H2 heading before a block (e.g., "JUVÉDERM® maakt het verschil" before before-after). These remain as default content before the block, which is idiomatic EDS.

---

## Site Conventions

### Section Styles
15 section styles identified, mapped from source EMU container class names to EDS section metadata:
- `brand-statement` — centered text with larger heading
- `footnotes` — smaller font, muted color
- `before-after-section` — gray background (#F2F1F1)
- `treatment-areas` — full-width card grid area
- `clinic-finder-section` — gradient background
- `media-text` — equal-column image+text layout
- `qa-section` — FAQ topic section with anchor ID
- `key-takeaways` — highlight columns area
- Others: `product-info`, `product-showcase`, `faq-section`, `topic-menu-section`, `legal-content`, `contact-content`, `key-features`

### CTA Patterns
Three button styles used consistently across the site:
1. **Primary filled** — Gradient purple/magenta background, white text. Used for main CTAs ("Vind een kliniek", "Afspraak maken").
2. **Primary outline** — Transparent background, bordered. Used for secondary CTAs and header nav button.
3. **Secondary filled** — Solid dark purple background. Used for "Lees meer" links.

**EDS Convention:** Bold link = primary CTA, plain link = secondary. Button styling is CSS-only, defined in global styles.

### Image Strategy
- **Download and convert** all images from AEM DAM paths
- Sources: `/content/dam/juvederm-ous/nl/`, `/content/dam/juvederm-ous/common/`, `/adobe/dynamicmedia/deliver/`
- EDS automatic WebP optimization handles format conversion
- Hero images: download both desktop and mobile crops where separate assets exist
- Before/after images: download all comparison pairs (768×768 square format)

### Typography
- **Primary:** Proxima Nova (Adobe Typekit `sic6ayn`) — headings, body, UI
- **Secondary:** Assistant (Google Fonts) — accent text
- Fluid typography with `clamp()` for responsive sizing

### Color Palette
- Brand purples: #4B2552 (dark), #A2258C (magenta), #AB7FB6 (light)
- UI: #4B4B4B (text), #F8F8F8 / #F2F1F1 (backgrounds), #FFFFFF (white)
- Logo uses tri-color gradient (purple, orange-peach, magenta)

---

## Architecture Decisions Log

### 1. Columns block absorbs three source patterns
**Decision:** Use the `columns` block for media-text (2-col), 3-up grids (3-col), and key takeaways (3-col).  
**Rationale:** All three are side-by-side content layouts. Using one block with a variant reduces the palette from 13 blocks to 11. The `3-col` variant is just a different column count in the same block.

### 2. Scroll-reveal → static columns
**Decision:** Replace the homepage's animated scroll-reveal section (4 cards appearing sequentially) with a static columns block.  
**Rationale:** Scroll-reveal animations add complexity and potential CLS issues. The content (4 stat cards with icons) is meaningful without animation. If animation is desired later, it can be added via CSS/JS decoration.

### 3. 3-up carousel → columns block
**Decision:** Model the treatment page's 3-item "carousel" (data-items=3, no controls, static) as a columns block rather than a carousel.  
**Rationale:** Source uses emu-carousel but with `data-items="3"` and `data-controls="false"` — it's effectively a static 3-column grid. No carousel behavior needed.

### 4. Image-map must be custom
**Decision:** Build image-map as a new custom block.  
**Rationale:** No Block Collection or Block Party equivalent exists for interactive hotspot images. The source uses EMU's image-map component with absolute-positioned markers on a face image. This is a unique brand feature that needs custom development.

### 5. Clinic finder URL consolidation
**Decision:** Use `/nl/find-a-clinic` as canonical, redirect `/nl/clinics` and `/nl/clinic`.  
**Rationale:** All three URLs render the same clinic search page. Single canonical URL avoids content duplication.

### 6. Homepage/root URL consolidation
**Decision:** Use `/nl` as canonical homepage, redirect `/` to `/nl`.  
**Rationale:** Both URLs serve identical content. The `/nl` path is the primary Dutch locale path.

### 7. Embed block from Block Collection
**Decision:** Add embed block from Block Collection for Vimeo videos.  
**Rationale:** Only 2 pages use Vimeo embeds (lips, eye-area). Block Collection embed handles oEmbed auto-detection. Low effort to add, proven pattern.

### 8. Topic-menu stays as custom block
**Decision:** Keep topic-menu as a separate custom block rather than trying to use tabs or nav patterns.  
**Rationale:** The sticky scroll-spy anchor navigation is a distinct UX pattern from tabs. It observes section positions and highlights the active topic — this needs custom IntersectionObserver logic.

### 9. Google Maps API key handling
**Decision:** Document API key for clinic-finder but recommend server-side proxy in production.  
**Rationale:** Client-side API key exposure is a security concern. During development, use the existing key; for go-live, set up a server-side proxy via Edge Workers or similar.

### 10. Third-party tags in delayed.js
**Decision:** All marketing/analytics tags (GTM, GA, OneTrust, FB Pixel, Floodlight) load in delayed.js.  
**Rationale:** EDS performance best practice — these tags have no user-facing impact and can safely load 3+ seconds after page load without affecting Core Web Vitals.
