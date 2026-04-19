# Phase 2c — Migration Blueprint for juvederm.nl → EDS

**Generated:** 2026-04-19  
**Site:** https://www.juvederm.nl (Dutch-language, pharma/aesthetics)  
**Pages:** 14 pages across 6 archetypes  

---

## 1. Block Palette

### From Block Collection (7 blocks)

| Block | Purpose | Variants | Used By |
|-------|---------|----------|---------|
| **hero** | Full-width hero with bg image, H1, optional CTA | `hero`, `hero (video)` | homepage, treatment-page, faq |
| **columns** | Side-by-side content for benefits grid | `columns`, `columns (highlights)` | homepage, treatment-page |
| **carousel** | Rotating slides for product cards | `carousel`, `carousel (product-cards)` | treatment-page |
| **tabs** | VROUWELIJK/MANNELIJK treatment area switcher | — | homepage, treatment-page (via fragment) |
| **accordion** | Expandable Q&A sections | `accordion`, `accordion (faq)` | treatment-page, faq, footer |
| **cards** | Content grid with image + text | — | homepage, treatment-page (inside tabs) |
| **fragment** | Reusable content inclusion | — | all archetypes |

### Custom Blocks (4 blocks)

| Block | Purpose | Complexity | Used By |
|-------|---------|-----------|---------|
| **before-after** | Treatment before/after image comparison slider | Medium | homepage, treatment-page |
| **clinic-finder** | Interactive clinic search with Google Maps | High | homepage, treatment-page, clinic-finder |
| **topic-menu** | Sticky anchor navigation for FAQ page | Low | faq |
| **metadata** | Configuration block for document meta tags | Low | all |

### Boilerplate (2 blocks)

| Block | Purpose |
|-------|---------|
| **header** | Site header: logo + primary nav + FAQ dropdown + clinic-finder CTA |
| **footer** | Site footer loaded as fragment from /footer |

**Total: 13 blocks** (7 Block Collection + 4 custom + 2 boilerplate)

---

## 2. Content Model Decisions

### Why each block has its structure

**hero** — Single-column layout (1 cell per row). Row 1 = background image, Row 2 = heading + text + CTA. This is the standard Block Collection hero pattern. The `(video)` variant substitutes a Vimeo URL for the image. Keeping it as a single-column model means authors only deal with 2 rows, which is simple and maintainable.

**columns (highlights)** — Standard columns block with 3-4 cells per row. Each cell contains H3 + paragraph. The `highlights` variant applies brand background color via section metadata. Trade-off: we could have made each benefit a separate card, but columns is simpler for this consistent 3-4 item pattern and avoids unnecessary block nesting.

**carousel (product-cards)** — 2-column rows: image | text. One row per slide. The `product-cards` variant adds card styling to slides. Trade-off: could use a cards grid instead, but the carousel behavior (swipe, navigation dots) matches the source site exactly.

**before-after** — 2-column rows: before image | after image. Multiple rows = multi-pair carousel. Custom block because Block Collection has no equivalent. Block Party's Image-Compare is single-pair only and lacks Dutch localization.

**tabs** — Standard Block Collection tabs: column 1 = label, column 2 = panel content. Only 2 rows (VROUWELIJK/MANNELIJK). The panel content is rich (cards with images + text + links), but that's handled as formatted content within the cell.

**accordion** — Standard Block Collection pattern: column 1 = summary, column 2 = body. The `(faq)` variant adds brand-styled typography. Used in two contexts: FAQ accordion on pages, and footer navigation groups.

**clinic-finder** — Configuration model with key-value rows (heading, placeholder, api-key, country). This is necessary because the block needs JS configuration rather than displayable content. The `(compact)` variant renders a smaller CTA-style widget for content pages.

**topic-menu** — Single-cell block with an unordered list of anchor links. Minimal content model because the JS does the heavy lifting (sticky + scrollspy).

### What was left as default content and why

| Pattern | Reason |
|---------|--------|
| **Pharma disclaimer** | Simple icon + text, no interactive behavior. Section style `pharma-notice` provides the visual treatment. Made into a fragment for reuse. |
| **Reference/footnotes** | Plain text paragraphs with small typography. Section style `references` handles the visual reduction. Unique per page, so NOT a fragment. |
| **Scroll-reveal animation** | CSS-only effect triggered by IntersectionObserver in scripts.js. Section style `scroll-reveal` applied via section metadata. |
| **Contact info** | Simple address/phone/email text. No block structure needed. |
| **Legal text** | Long-form text content. Pure default content paragraphs. |

---

## 3. Archetype Blueprints

### 3.1 Homepage (`/nl`)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Hero | — | `hero` block: Sofie key visual bg, H1 "Jouw unieke schoonheid" |
| 2 | Brand Intro | `scroll-reveal` | Default: H2 intro + Lily portrait image + product range paragraph |
| 3 | Benefits | `highlight` | Default: H1 "Waarom JUVÉDERM®?" + `columns (highlights)` × 4 benefits |
| 4 | Footnotes | `references` | Default: superscript footnotes (1-17) |
| 5 | Treatment Explorer | — | Default H2 + `fragment` → /fragments/treatment-tabs |
| 6 | Clinic Finder CTA | — | `fragment` → /fragments/clinic-finder-cta |
| 7 | Pharma Notice | `pharma-notice` | `fragment` → /fragments/pharma-notice |

### 3.2 Treatment Page (×5: lips, eye-area, enhance, restore, male)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Hero | — | `hero` block (or `hero (video)`): treatment key visual, H1 |
| 2 | Treatment Intro | — | Default: H2 subtitle + descriptive paragraphs |
| 3 | Benefits | `highlight` | `columns (highlights)` × 3 treatment-specific benefits |
| 4 | Products | — | Default H2/H3 + `carousel (product-cards)` with 5-6 product slides |
| 5 | Before/After | — | `before-after` block: 1-3 comparison pairs |
| 6 | FAQ Teaser | — | Default H5 + `accordion (faq)` × 3-5 items + "Meer" CTA → /nl/qa |
| 7 | Treatment Explorer | — | `fragment` → /fragments/treatment-tabs |
| 8 | Clinic Finder CTA | — | `fragment` → /fragments/clinic-finder-cta |
| 9 | Pharma Notice | `pharma-notice` | `fragment` → /fragments/pharma-notice |
| 10 | References | `references` | Default: page-specific footnotes (NOT a fragment) |

### 3.3 FAQ Page (`/nl/qa`)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Hero | — | `hero` block: FAQ key visual, H1 "Ontdek het antwoord op je vraag" |
| 2 | Topic Navigation | — | `topic-menu` block: anchor links to FAQ sections |
| 3 | About JUVÉDERM® | — | Default: H2 + info content + H3 subsections (id: about-juvederm) |
| 4 | Treatment Prep | — | Default: H2 + side effects info (id: side-effects) |
| 5 | Consultation | — | Default: H2 + process and pain info |
| 6 | Costs & Results | — | Default: H2 + cost/duration content (id: duration) |
| 7 | Facial Areas | — | Default: H2 + treatment area descriptions (id: facial-areas) |
| 8 | References | `references` | Default: footnotes |

### 3.4 Clinic Finder (`/nl/find-a-clinic`)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Clinic Search | — | Default H1 + `clinic-finder` block (full-page variant) + city quick-links |
| 2 | Pharma Notice | `pharma-notice` | `fragment` → /fragments/pharma-notice |

### 3.5 Contact (`/nl/contact-us`)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Contact Info | — | Default: H2 "NEEM CONTACT OP" + address, phone, email |
| 2 | Pharma Notice | `pharma-notice` | `fragment` → /fragments/pharma-notice |
| 3 | Legal Footer | `references` | Default: AbbVie/Allergan legal notices |

### 3.6 Legal (`/nl/disclaimer`, `/nl/algemene-voorwaarden-kliniekzoeker`)

| # | Section | Style | Content |
|---|---------|-------|---------|
| 1 | Legal Content | — | Default: H2 title + long-form legal text paragraphs |

---

## 4. Global Elements

### Navigation (`/nav`)

The header block auto-loads `/nav`. Structure:

1. **Brand bar** — JUVÉDERM® logo linked to /nl
2. **Primary nav** — Treatment links: Lippen, Ogen, Accentueren, Herstel, Man
3. **FAQ dropdown** — Label "FAQ" with submenu: Over Juvéderm®, Kosten, Langdurige resultaten, Veiligheid, Zones van het gezicht
4. **CTA** — "Vind je kliniek" button → /nl/find-a-clinic

### Footer (`/footer`)

**Critical migration note:** The AEM `<footer>` element is empty. The actual footer content is rendered inside each page body as accordion + navigation-list components. In EDS, this becomes the `/footer` document.

Structure:
1. **Footer nav** — Accordion block with 2 groups:
   - "Behandeling": Lippen, Ogen, Accentueren, Herstel, Man
   - "FAQ": Over Juvéderm®, Kosten, Langdurige resultaten, Veiligheid, Zones van het gezicht
2. **Legal bar** — Allergan Aesthetics logo, "Neem contact op" link, "Privacy beleid" link
3. **Social + copyright** — Instagram/Facebook buttons, AbbVie copyright text

### Metadata Defaults

Applied via `/metadata.xlsx` (bulk metadata):

| URL Pattern | template | og:site_name | og:locale |
|------------|----------|-------------|-----------|
| `/**` | — | JUVÉDERM® Netherlands | nl_NL |
| `/nl/treatment/**` | treatment-page | — | — |
| `/nl/qa` | faq | — | — |
| `/nl/find-a-clinic` | clinic-finder | — | — |
| `/nl/contact-us` | contact | — | — |
| `/nl/disclaimer` | legal | — | — |

---

## 5. Fragment Inventory

| Fragment | Path | Used By | Contains |
|----------|------|---------|----------|
| **Treatment Tabs** | `/fragments/treatment-tabs` | homepage + 5 treatment pages | Tabs block (VROUWELIJK/MANNELIJK) with treatment area cards |
| **Clinic Finder CTA** | `/fragments/clinic-finder-cta` | homepage + 5 treatment pages | H2 + clinic-finder (compact) block |
| **Pharma Notice** | `/fragments/pharma-notice` | homepage + 5 treatment + faq + clinic-finder + contact | Warning icon + disclaimer text, section style pharma-notice |

**Rationale:** These three content sections are identical across 6-10 pages each. Fragmenting them eliminates duplication and ensures legal/regulatory content (pharma notice) is maintained in a single location.

---

## 6. Migration Rules

### AEM Component → EDS Block Mapping

| AEM Component | EDS Block | Notes |
|--------------|-----------|-------|
| teaser | hero | bg-image + H1 + CTA |
| title + text (grid) | columns (highlights) | Benefits grid |
| carousel + card | carousel (product-cards) | Product showcase |
| comparison-slider | before-after | Custom block |
| tabs | tabs | Female/Male switcher |
| accordion | accordion (faq) | Q&A sections |
| location-services | clinic-finder | Config block |
| navigation-list (footer) | accordion (in /footer) | Footer nav groups |
| navigation-list (topic) | topic-menu | FAQ page nav |
| embed / video-plyr | hero (video) or auto-block | Vimeo videos |
| scrollreveal | section style: scroll-reveal | CSS only |
| modal (OneTrust) | delayed.js | Not content |
| header / navigation | header (boilerplate) | Auto from /nav |
| container (generic) | section separator (---) | Section mapping |

### Content Transformation Rules

1. **Superscript references** — Preserve `<sup>` elements. Authors use superscript formatting in docs.
2. **Trademark symbols** — JUVÉDERM® with ® preserved as typed.
3. **Privacy banner** — "See our new privacy terms" removed from content. OneTrust via delayed.js.
4. **Dutch placeholders** — /placeholders.xlsx with: Voor, Na, Meer informatie, Vind je kliniek, etc.
5. **Footnotes** — Page-specific, authored as default content in `references` section style.

### Image Handling

- **Source:** All images from Adobe Dynamic Media CDN (`/adobe/dynamicmedia/deliver/dm-aid--*`)
- **Strategy:** Download and convert to WebP
- **Hero images:** Download at width=1600, quality=85
- **Product images:** Download at appropriate size
- **Before/after pairs:** Download at matched dimensions
- **Icons:** Download as PNG, evaluate SVG replacement
- **Critical:** Dynamic Media URLs will not persist post-migration; all images must be downloaded

### Link Transformations

- **Internal links:** Already use relative `/nl/...` paths — preserve as-is
- **Anchor links:** Ensure section IDs match (e.g., `#about-juvederm`)
- **Clinic location links:** Query params handled by clinic-finder JS
- **External links:** Preserved (AbbVie, Allergan, social media)
- **Root redirect:** `/` → `/nl` in redirects.xlsx

---

## 7. Architecture Decisions Log

### Decision 1: Fragment strategy for shared sections
**Choice:** Three fragments (treatment-tabs, clinic-finder-cta, pharma-notice) rather than authoring inline on each page.
**Rationale:** These sections appear identically on 6-10 pages. Fragmenting reduces content duplication from ~60 authored sections to 3. The pharma notice in particular is legally required to be consistent.
**Trade-off:** Fragment editing affects all pages at once (by design for regulatory content; potential risk for treatment-tabs if pages diverge).

### Decision 2: Footer built from pseudo-footer
**Choice:** Extract footer content from page body and author as `/footer` document.
**Rationale:** The AEM `<footer>` element is empty — footer content is actually rendered as accordion + navigation-list inside each page body. EDS's footer block expects a `/footer` document. This is the cleanest architectural alignment.
**Risk:** Footer accordion behavior (expand/collapse) must be verified to work within the footer block context.

### Decision 3: Columns over Cards for benefits grid
**Choice:** `columns (highlights)` rather than `cards` for the 3-4 benefit items.
**Rationale:** Benefits are a simple heading + paragraph pattern with no image. Columns is semantically correct for side-by-side text content. Cards implies an image + text pattern that doesn't match here.

### Decision 4: Before-after as custom block
**Choice:** Custom `before-after` block rather than adapting Block Party's Image-Compare.
**Rationale:** The site needs multi-pair carousel support, Dutch localization (Voor/Na labels), and touch-enabled slider interaction. Block Party's version is single-pair only. The local custom block already exists in the project.

### Decision 5: FAQ page uses default content, not accordion blocks for all content
**Choice:** FAQ sections are mostly default content (H2 + H3 + paragraphs), with topic-menu for navigation.
**Rationale:** The FAQ page is text-heavy with hierarchical headings. Wrapping everything in accordion blocks would over-complicate authoring. The topic-menu provides navigation, and anchor IDs on section headings enable deep linking. Only the expandable Q&A items on treatment pages use the accordion block.

### Decision 6: Clinic-finder as configuration block
**Choice:** Key-value row configuration model rather than visual content model.
**Rationale:** The clinic finder is entirely JS-driven (Google Maps API + clinic locator API). There's no visual content to author — just configuration parameters. A configuration model keeps the authoring table clean and lets JS handle all rendering.

### Decision 7: References as default content, not fragments
**Choice:** Footnote sections are authored per-page, not as shared fragments.
**Rationale:** Each page has different footnote references matching its specific claims. Sharing would be incorrect. The `references` section style provides consistent small-text styling.

### Decision 8: Homepage root redirect
**Choice:** Create redirect from `/` to `/nl` rather than duplicating homepage content.
**Rationale:** The two crawled homepage URLs (`/` and `/nl`) render identical content. The root URL is a language/locale redirect. One page document at `/nl` + a redirect avoids content duplication.

---

## 8. External Dependencies

| Dependency | Used By | Load Strategy |
|-----------|---------|---------------|
| Google Maps JavaScript API | clinic-finder | delayed (on block load) |
| Allergan/AbbVie Clinic Locator API | clinic-finder | on-demand (API calls) |
| Adobe Typekit (sic6ayn) | all pages | eager (brand fonts) |
| OneTrust | all pages | delayed.js |

---

## 9. Implementation Priority

| Priority | Block | Rationale |
|----------|-------|-----------|
| 1 | hero | All content pages, critical for visual fidelity |
| 2 | accordion | FAQ and footer navigation on every page |
| 3 | columns | Benefits grid on homepage + all treatment pages |
| 4 | tabs | Shared treatment explorer on 6+ pages |
| 5 | carousel | Product cards on all treatment pages |
| 6 | cards | Grid pattern within tab panels |
| 7 | before-after | Custom — treatment comparisons on 6+ pages |
| 8 | clinic-finder | Custom — high complexity, Google Maps dependency |
| 9 | topic-menu | Custom — only FAQ page |
| 10 | metadata | Configuration block, simple implementation |
