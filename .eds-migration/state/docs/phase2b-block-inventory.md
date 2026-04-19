# Phase 2b — Block Inventory for juvederm.nl

**Generated:** 2026-04-19  
**Migration run:** 693fdd13

---

## Executive Summary

The juvederm.nl site uses **12 distinct content patterns** mapped to **10 EDS blocks** (6 from Block Collection, 4 custom) plus **3 default content patterns**. The project already has 13 local blocks scaffolded from a previous phase. The block palette is intentionally minimal — we prefer default content + section styles over unnecessary blocks.

---

## Block Palette

### Blocks from Block Collection (6)

| Block | Purpose | Archetypes | Notes |
|-------|---------|-----------|-------|
| **hero** | Full-width background image + H1 + CTA | homepage, treatment, faq | Adapted with video variant for Vimeo backgrounds |
| **accordion** | Expandable Q&A sections | treatment, faq, footer | Standard details/summary pattern; (faq) variant for styling |
| **carousel** | Rotating product card slides | treatment | Product-cards variant for JUVÉDERM® product showcase |
| **tabs** | Female/Male treatment area switcher | homepage, treatment | Standard accessible tabs with ARIA roles |
| **columns** | Side-by-side benefit items | homepage, treatment | Highlights variant for 3-col benefit grid |
| **cards** | Content grid with images | treatment (inside tabs) | Standard ul/li grid pattern |

### Custom Blocks (4)

| Block | Purpose | Complexity | Why Custom? |
|-------|---------|-----------|-------------|
| **before-after** | Treatment comparison slider | Medium | No BC equivalent; needs multi-pair carousel, Dutch labels |
| **clinic-finder** | Google Maps clinic search | High | Requires Google Maps API, Places Autocomplete, Allergan API |
| **topic-menu** | Sticky FAQ anchor navigation | Low | No BC equivalent for scrollspy nav |
| **metadata** | Document meta tag configuration | Low | Reads key-value pairs, sets `<meta>` tags |

### Boilerplate (2)

| Block | Purpose |
|-------|---------|
| **header** | Site logo + primary nav + FAQ dropdown + clinic CTA |
| **footer** | Loads /footer fragment (accordion + legal links + social + copyright) |

### Default Content (not blocks) (3)

| Pattern | Section Style | Why Not a Block? |
|---------|--------------|-----------------|
| **Pharma disclaimer** | `pharma-notice` | Simple icon + warning text, no interaction needed |
| **Reference/footnotes** | `references` | Plain text paragraphs with superscript citations |
| **Scroll reveal** | `scroll-reveal` | CSS-only animation, no content structure |

---

## Block Collection & Block Party Survey

### Block Collection Search Results

| Block | Found? | Status |
|-------|--------|--------|
| hero | ✅ | Adopted (adapted locally with video variant) |
| accordion | ✅ | Adopted (local copy) |
| cards | ✅ | Adopted (local copy) |
| carousel | ✅ | Adopted (local copy) |
| columns | ✅ | Adopted (local copy) |
| tabs | ✅ | Adopted (local copy) |
| fragment | ✅ | Adopted (local copy) |
| video | ✅ | Available but not primary — hero (video) covers use case |
| quote | ✅ | Not needed — no testimonial patterns on site |
| embed | ❌ | Not in Block Collection; auto-blocking handles this |

### Block Party Search Results

| Entry | Category | Decision | Reasoning |
|-------|----------|----------|-----------|
| **Image-Compare** (dave-fink) | Block | Not adopted | Local before-after is more complete (multi-pair, Dutch labels) |
| **Interactive Map** (meejain) | Block | Reference only | Generic Google Maps; clinic-finder needs brand-specific search UX |
| **Video block** (adobe-rnd) | Block | Reference only | Hero (video) variant covers primary use case |
| **Responsive Slider** (meejain) | Block | Not adopted | Adds Swiper.js dependency; local carousel is simpler |

---

## Content Model Decisions

### Hero — Why single-column layout
The Juvederm hero is always a fullbleed background image with overlaid text. A 1-column model with Row 1 = image, Row 2 = content keeps authoring simple and matches the Block Collection hero pattern exactly.

### Benefits Grid — Why columns, not cards
The benefit items (e.g., "Natural results", "Long-lasting", "High satisfaction") have no images — just headings and text. Using `columns (highlights)` instead of `cards` avoids the image-focused card pattern and keeps the author experience clean.

### Comparison Slider — Why custom
The before/after slider is central to the treatment pages and homepage. Key requirements not met by existing blocks:
- Multi-pair carousel with navigation dots
- Dutch labels ("Voor" / "Na")
- Pharma-brand-specific responsive behavior
- Interactive drag/slider overlay (not just side-by-side)

### Clinic Finder — Why custom
The clinic finder requires:
- Google Maps JavaScript API with Places Autocomplete
- Custom search form UX for clinic search
- Integration with Allergan/AbbVie clinic locator backend
- Two variants (full-page and compact inline widget)
No community block covers this full stack.

### Pharma Disclaimer — Why default content
The Dutch pharma disclaimer ("Kijk uit. Jezelf mooier maken kan lelijk uitpakken.") is static warning text with an icon. Making it a block would over-engineer a simple pattern. A section style gives the visual treatment; a fragment allows reuse across pages.

### Footer — Why fragment + accordion
The AEM site has no traditional `<footer>` element. The "footer" is actually an accordion with navigation groups + legal links bar. In EDS, this becomes a `/footer` fragment that contains an `accordion` block plus default content for legal/social/copyright links.

---

## Section Styles

| Style | Purpose | Used On |
|-------|---------|---------|
| `pharma-notice` | Dark background with warning icon for regulatory disclaimer | homepage, treatment, faq |
| `references` | Small text, muted color for footnotes/citations | homepage, treatment |
| `scroll-reveal` | Fade-in/slide-up animation triggered by scroll | homepage |
| `highlight` | Brand-colored background for emphasized sections | homepage, treatment |

---

## Shared Content (Fragment Candidates)

| Fragment | Shared Across | Contents |
|----------|--------------|----------|
| `/footer` | All 14 pages | Accordion nav groups + legal links + social + copyright |
| `/nav` | All 14 pages | Logo + treatment nav + FAQ dropdown + clinic CTA |
| `/fragments/treatment-tabs` | 6+ pages | Female/Male treatment area explorer (tabs block) |
| `/fragments/clinic-finder-cta` | 6+ pages | Compact clinic finder widget |
| `/fragments/pharma-notice` | 8+ pages | Dutch pharma disclaimer (identical everywhere) |

---

## Architecture Decisions Log

1. **Prefer Block Collection blocks over Block Party** — BC blocks are Adobe-vetted for accessibility and performance. All 6 adopted blocks come from BC.

2. **Minimize custom blocks** — Only 4 custom blocks, each with clear justification for why BC/BP alternatives don't fit.

3. **Default content over blocks** — Pharma notice, references, and scroll-reveal use section styles instead of blocks. This follows EDS philosophy of semantic HTML first.

4. **Fragment strategy for shared content** — Treatment tabs, clinic finder CTA, and pharma disclaimer appear on 6+ pages each. Authoring as fragments avoids duplication and ensures consistency.

5. **Video strategy: hero variant over standalone block** — Video appears only in hero context on 1-2 treatment pages. The hero (video) variant is simpler than adding a separate video block. If standalone video needs emerge, the BC video block is ready to adopt.

6. **Google Maps as delayed load** — The clinic-finder block's Google Maps API should load in the delayed phase to avoid impacting Core Web Vitals (LCP, TBT).

7. **Superscript references preserved as default content** — The pharma footnotes (†12,13 *4 ‡17) are essential for regulatory compliance. They're plain text with `<sup>` tags — no block needed.

---

## Implementation Priority

1. **hero** — Every content page starts with it
2. **accordion** — FAQ sections + footer on every page
3. **columns** — Benefits grid on 6+ pages
4. **tabs** — Shared treatment explorer
5. **carousel** — Product cards on treatment pages
6. **cards** — Grid pattern within tabs
7. **before-after** — Custom comparison slider
8. **clinic-finder** — Custom Google Maps integration (highest complexity)
9. **topic-menu** — FAQ-only anchor navigation
10. **metadata** — Configuration utility block

---

## External Dependencies

| Dependency | Used By | Load Strategy |
|-----------|---------|---------------|
| Google Maps JavaScript API | clinic-finder | Delayed |
| Google Places Autocomplete | clinic-finder | Delayed |
| Allergan/AbbVie Clinic API | clinic-finder | On-demand |
| Adobe Typekit (sic6ayn) | All pages | Eager (consider self-hosting) |
