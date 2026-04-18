# Phase 2b — Block Inventory

## Summary

Analysis of **juvederm.nl** (14 pages across 7 archetypes) identified **11 distinct UI components** mapped to EDS blocks, plus **3 default content patterns** and **2 auto-generated structures**. The Block Collection covers 7 of 11 blocks; only 3 custom blocks are needed.

## Block Palette

### Standard Blocks (from Block Collection)

| Block | Source | Used By | Priority |
|-------|--------|---------|----------|
| **hero** | Block Collection | homepage, locale-root, treatment-page, faq, clinic-finder | High |
| **accordion** | Block Collection | faq, homepage, locale-root, treatment-page | High |
| **carousel** | Block Collection | homepage, locale-root, treatment-page, faq | High |
| **cards** | Block Collection | homepage, locale-root, treatment-page | Medium |
| **tabs** | Block Collection | homepage, locale-root, treatment-page | Medium |
| **video** | Block Collection | homepage, locale-root | Low |
| **footer** | Block Collection | all pages | High |

### Standard Blocks (from Boilerplate)

| Block | Source | Used By | Priority |
|-------|--------|---------|----------|
| **columns** | Boilerplate | homepage, locale-root, treatment-page | Medium |

### Custom Blocks (must build)

| Block | Used By | Priority | Complexity |
|-------|---------|----------|------------|
| **topic-menu** | faq | Medium | Low |
| **clinic-finder** | clinic-finder | High | High |
| **cookie-consent** | all pages (via delayed.js) | Medium | Medium |

### Default Content (no block needed)

| Pattern | Used By | Notes |
|---------|---------|-------|
| Text content (headings, paragraphs, lists) | legal, contact, faq, treatment-page | Majority of legal/contact pages |
| Buttons/CTAs | all content pages | "Vind je kliniek" is primary CTA pattern |
| Images | homepage, treatment-page, faq | Downloaded and re-hosted via EDS CDN |

### Auto-Generated

| Component | Notes |
|-----------|-------|
| **header/nav** | From /nav document. Logo + 2-level dropdown (Behandeling, FAQ) + mobile hamburger |
| **metadata** | From metadata block. OG/Twitter cards, description, keywords |

---

## Detailed Block Analysis

### 1. Hero Block
- **Source:** Block Collection (`hero`)
- **Pattern on source site:** AEM Teaser component (`emu-teaser`, `hero-teaser`) with full-bleed background image, h1 text overlay, and optional CTA
- **Homepage variant:** Includes auto-playing background video (evaluating whether to use hero + video or standalone video block)
- **FAQ variant:** Hero image with "Ontdek het antwoord op je vraag" heading
- **Treatment variant:** Hero image specific to treatment area (lips, eyes, etc.)
- **Clinic-finder variant:** Distinct hero style (`juvederm-findaclinic-hero`) with heading + search prompt

### 2. Accordion Block
- **Source:** Block Collection (`accordion`)
- **Pattern on source site:** AEM `emu-accordion` component with expandable items
- **FAQ page:** Primary consumer — 5+ topic groups with ~30 total Q&A items. Each item has a heading (question) and rich-text answer with paragraphs, lists, and superscript citation references
- **Homepage/Treatment:** Smaller accordion sections for product details and secondary info
- **Content model:** Each row = one accordion item (heading in col 1, rich text body in col 2)

### 3. Carousel Block
- **Source:** Block Collection (`carousel`)
- **Pattern on source site:** `emu-carousel` component with sliding panels and dot navigation
- **Homepage:** Treatment area cards carousel (Lips, Eyes, Restore, Contour, Enhancement) — each slide has image + heading + text + link
- **Treatment pages:** Product variant carousel (VOLBELLA, VOLIFT, ULTRA series)
- **Content model:** Each row = one slide with image + text content

### 4. Cards Block
- **Source:** Block Collection (`cards`)
- **Pattern on source site:** Grid of styled containers with icon/image + heading + text
- **Homepage "Why JUVÉDERM?":** 4 benefit cards (natural look, leading brand, lasting results, satisfaction) with icons
- **Treatment pages:** Step-by-step journey cards (Consultation → Treatment → Results)
- **Content model:** Each row = one card (image | heading + description)

### 5. Tabs Block
- **Source:** Block Collection (`tabs`)
- **Pattern on source site:** `emu-tabs` component for product range details
- **Treatment pages:** Tabs for different JUVÉDERM products (VOLBELLA, VOLIFT, ULTRA 4, 3, 2)
- **Content model:** Tab name in col 1, tab content in col 2

### 6. Video Block
- **Source:** Block Collection (`video`)
- **Usage:** Homepage hero has auto-playing background video
- **Decision:** May be integrated as a hero variant rather than standalone block
- **Priority:** Low — only homepage uses video

### 7. Topic Menu (Custom)
- **Source:** Custom block
- **Pattern:** Sticky horizontal anchor navigation with topic labels
- **Only used on:** FAQ page
- **Implementation:** Simple block with `<ul>` of anchor links, CSS sticky positioning
- **Alternative considered:** Could be a section style on default content anchor links

### 8. Clinic Finder (Custom)
- **Source:** Custom block
- **Pattern:** Interactive search with Google Maps integration
- **Components:** Location search input, Google Maps embed, results list with clinic cards
- **Full-page version:** `/nl/find-a-clinic` — main interactive page
- **Compact version:** Search input in homepage/treatment footers
- **Implementation options:** (a) Full custom block with Maps API, (b) iframe embed of existing service
- **This is the highest-complexity custom block**

### 9. Cookie Consent (Custom)
- **Source:** Custom (delayed.js integration)
- **Pattern:** OneTrust-based consent banner + preferences modal
- **Implementation:** Script integration in `delayed.js`, not a content block
- **Categories:** Required, Functional, Advertising cookies

---

## Architecture Decisions

### Decision 1: Prefer Default Content Over Blocks
Legal and contact pages are almost entirely default content (headings, paragraphs, lists, links). No blocks needed — these render well with standard EDS markup.

### Decision 2: Hero Video Handling
Homepage hero video can be handled as a hero block variant (hero with video background) rather than a separate video block. This keeps the block palette minimal.

### Decision 3: Clinic Finder Strategy
The clinic finder requires Google Maps API integration and custom search logic. Recommended approach: build a custom `clinic-finder` block that initializes a map and handles search/results. This is the only high-complexity custom block.

### Decision 4: Topic Menu Simplicity
The FAQ topic menu could be a simple custom block or even a styled section of anchor links. Recommending a lightweight custom block for semantic clarity and reusability.

### Decision 5: Cookie Consent via delayed.js
Cookie consent is a script integration, not a content block. It should be loaded via `delayed.js` to avoid impacting page performance.

### Decision 6: Carousel vs Cards
Some sections could be either carousel or cards depending on viewport. Source site uses carousel for treatment options on homepage. Recommending carousel for the scrollable treatment showcase and cards for static benefit grids.

---

## Site Conventions Identified

### CTA Pattern
- **Primary CTA:** "Vind je kliniek" (Find your clinic) → links to `/nl/find-a-clinic`
- **Appears in:** Header nav, footer, inline on homepage/treatment pages
- **EDS pattern:** `<p><strong><a href="/nl/find-a-clinic">Vind je kliniek</a></strong></p>`

### Section Styles
- `hero` — full-bleed background image sections
- `qa-section` — FAQ topic groups with accordion content
- `highlight` — feature/benefit callout sections with background color
- `centered` — centered text content (legal, contact pages)

### Image Strategy
- Source uses Adobe Dynamic Media (`/adobe/dynamicmedia/deliver/`)
- Images need to be downloaded and committed to repo or DA content
- EDS CDN handles responsive optimization automatically
- SVG icons (logo, social media) should be placed in `/icons/` directory

### Typography & Branding
- JUVÉDERM® brand name consistently uses `®` and `sup` for citation numbers
- Regulatory footnotes with superscript references appear on most pages
- Dutch language content (nl-NL locale)

### Navigation Structure
```
├── Behandeling (Treatment)
│   ├── Lippen (Lips)
│   ├── Ogen (Eyes)
│   ├── Accentueren (Enhance)
│   ├── Herstel (Restore)
│   └── Man (Male)
├── FAQ
│   ├── Over Juvéderm® (About)
│   ├── Kosten (Cost)
│   ├── Langdurige resultaten (Lasting Results)
│   ├── Veiligheid (Safety)
│   └── Zones van het gezicht (Facial Areas)
└── Vind je kliniek (Find your clinic) [CTA]
```
