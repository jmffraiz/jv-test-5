# Phase 2c — Migration Blueprint

**Site:** juvederm.nl → AEM Edge Delivery Services  
**Generated:** 2026-04-18  
**Scope:** 14 canonical pages, 7 archetypes, 8 blocks (5 Block Collection + 1 boilerplate + 2 custom)

---

## 1. Block Palette

### Summary

| # | Block | Source | Type | Archetypes | Priority |
|---|-------|--------|------|------------|----------|
| 1 | **hero** | Block Collection | standalone | homepage, treatment-page, faq, clinic-finder | High |
| 2 | **accordion** | Block Collection | collection | faq, homepage, treatment-page | High |
| 3 | **carousel** | Block Collection | collection | homepage, treatment-page | High |
| 4 | **cards** | Block Collection | collection | homepage, treatment-page | Medium |
| 5 | **tabs** | Block Collection | auto-blocked | treatment-page | Medium |
| 6 | **columns** | Boilerplate | standalone | homepage, treatment-page | Medium |
| 7 | **topic-menu** | Custom | standalone | faq | Medium |
| 8 | **clinic-finder** | Custom | configuration | clinic-finder | High |

**Palette size: 8 blocks** — reduced from 11 in inventory by:
- Merging video into hero (video variant) — only homepage uses video
- Cookie consent moved to delayed.js integration (not a block)
- Footer is auto-loaded from /footer document (standard EDS pattern)

### Default Content (no block needed)

| Pattern | Used By | Notes |
|---------|---------|-------|
| Headings, paragraphs, lists | legal, contact, treatment-page, faq | All text-heavy sections |
| CTA buttons | all content pages | `<strong><a>` = primary, `<em><a>` = secondary |
| Inline images | homepage, treatment-page | Standalone images within sections |
| Regulatory footnotes | all content pages | Superscript references at page bottom |

---

## 2. Block Specifications

### 2.1 Hero (Block Collection)

**Purpose:** Full-bleed visual header with background image/video, heading overlay, and optional CTA.

**Content Model:**

| Hero |
|------|
| ![background image](/images/hero.jpg) |
| # Page Heading |
| Optional subtext paragraph |
| **[CTA Link](/path)** |

- **Variant: Hero (video)** — first cell contains a video URL instead of image
- Single cell per row, ≤4 rows
- Heading is always h1 (page title)
- CTA is optional strong-wrapped link

**CSS:** Full-bleed positioning, gradient overlay for text contrast, responsive images  
**JS:** Background image setup, video variant (auto-play, loop, muted), responsive source switching

---

### 2.2 Accordion (Block Collection)

**Purpose:** Expandable/collapsible content sections for Q&A and product details.

**Content Model:**

| Accordion |  |
|-----------|--|
| Question heading | Rich text answer (paragraphs, lists, sup refs) |
| Next question | Next answer... |

- Collection model: each row = one item
- 2 columns: summary (col 1) + detail (col 2)
- FAQ page has ~30 items across 5 groups (each group is a separate accordion block within a qa-section)
- Rich text supports paragraphs, bulleted lists, superscript references

**CSS:** Expand/collapse animation, chevron indicator, borders  
**JS:** Toggle logic, ARIA attributes, keyboard navigation

---

### 2.3 Carousel (Block Collection)

**Purpose:** Sliding content panels for treatment area showcases and product features.

**Content Model:**

| Carousel |  |
|----------|--|
| ![slide image](/images/lips.jpg) | ## Lippen |
| | Description text |
| | [Meer informatie](/nl/treatment/lips) |

- Collection model: each row = one slide
- Image in col 1, rich text content in col 2
- Dot navigation and swipe support

**CSS:** Slide transitions, dot indicators, responsive  
**JS:** Slide logic, touch/swipe, auto-advance optional

---

### 2.4 Cards (Block Collection)

**Purpose:** Grid display of feature/benefit items or treatment journey steps.

**Content Model:**

| Cards |  |
|-------|--|
| ![icon](/images/icon.svg) | ## Card Heading |
| | Description text |

- Collection model: each row = one card
- Optional image in col 1
- Variant: Cards (no-images) for text-only cards

**CSS:** Responsive grid (2-3 columns), card styling  
**JS:** Minimal decoration

---

### 2.5 Tabs (Block Collection)

**Purpose:** Tabbed product information panels on treatment pages.

**Content Model:**

| Tabs |  |
|------|--|
| VOLBELLA | Product description with sup references |
| VOLIFT | Product description... |
| ULTRA 4 | Product description... |

- Auto-blocked/collection: each row = one tab
- Col 1 = tab label, Col 2 = tab panel content
- Used on treatment pages for JUVÉDERM® product variants

**CSS:** Tab bar, active/inactive states  
**JS:** Tab switching, ARIA tablist roles, keyboard navigation

---

### 2.6 Columns (Boilerplate)

**Purpose:** Side-by-side layout for image + text content.

**Content Model:**

| Columns |  |
|---------|--|
| ![photo](/images/treatment.jpg) | ## Heading |
| | Description paragraph |

- Standalone model: 2 cells = 2 columns
- Included in EDS boilerplate — no additional development needed
- Responsive: stacks vertically on mobile

---

### 2.7 Topic Menu (Custom — must build)

**Purpose:** Sticky horizontal anchor navigation for FAQ page sections.

**Content Model:**

| Topic Menu |
|------------|
| - [Over Juvéderm®](#about-juvederm) |
| - [Kosten](#duration) |
| - [Langdurige resultaten](#results) |
| - [Veiligheid](#side-effects) |
| - [Zones van het gezicht](#facial-areas) |

- Standalone model: single cell with unordered list of anchor links
- Author creates a list; each item links to a section id on the same page
- Low complexity: CSS sticky positioning + JS intersection observer

**CSS:** Sticky top positioning, horizontal layout, active state highlight, brand purple color  
**JS:** Intersection observer to highlight current section, smooth scroll on click  
**Dependencies:** None

---

### 2.8 Clinic Finder (Custom — must build)

**Purpose:** Interactive clinic search with Google Maps integration.

**Content Model:**

| Clinic Finder |  |
|---------------|--|
| heading | Vind een kliniek bij jou in de buurt |
| placeholder | Voer je postcode of stad in |
| data-source | /clinic-data.json |

- Configuration model: key-value pairs for settings
- Google Maps API key loaded from site config (not authored)
- Clinic data from JSON spreadsheet or external API
- Full-page variant on /nl/find-a-clinic

**CSS:** Map container, search bar, results list, clinic cards, responsive  
**JS:** Google Maps init, geocoding, clinic data fetch, distance sorting, result rendering  
**Dependencies:** Google Maps JavaScript API, clinic data endpoint

**This is the highest-complexity block.** Consider phasing: ship pilot pages first without clinic-finder, add it in batch phase.

---

## 3. Archetype Section Blueprints

### 3.1 Homepage (/)

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `hero` | **Hero (video)** — background video, h1, CTA |
| 2 | — | Default content — intro paragraph about hyaluronic acid |
| 3 | `highlight` | **Carousel** — 5 treatment area cards |
| 4 | — | **Cards** — 4 benefit cards ("Why JUVÉDERM?") |
| 5 | — | **Accordion** — product details |
| 6 | `cta-band` | Default content — "Vind je kliniek" CTA button |
| 7 | `footnotes` | Default content — regulatory footnotes |

### 3.2 Treatment Page (/nl/treatment/{slug})

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `hero` | **Hero** — treatment-specific hero image, h1 |
| 2 | — | Default content — treatment intro paragraph |
| 3 | — | **Columns** — image + text side-by-side |
| 4 | — | **Tabs** — product range (VOLBELLA, VOLIFT, ULTRA) |
| 5 | `highlight` | **Cards** — treatment journey steps |
| 6 | — | **Accordion** — additional Q&A |
| 7 | `cta-band` | Default content — "Vind je kliniek" CTA |
| 8 | `footnotes` | Default content — regulatory footnotes |

### 3.3 FAQ (/nl/qa)

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `hero` | **Hero** — FAQ hero image, h1 |
| 2 | — | **Topic Menu** — sticky anchor nav |
| 3-7 | `qa-section` | **h2 heading** + **Accordion** (per FAQ topic group) |
| 8 | `cta-band` | Default content — CTA |
| 9 | `footnotes` | Default content — footnotes |

### 3.4 Clinic Finder (/nl/find-a-clinic)

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `hero` | **Hero** — "Vind een kliniek" heading |
| 2 | — | **Clinic Finder** — map + search + results |
| 3 | `footnotes` | Default content — footnotes |

### 3.5 Legal (/nl/disclaimer, /nl/algemene-voorwaarden-kliniekzoeker)

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `centered` | Default content — h1 + body text (paragraphs, lists) |

### 3.6 Contact (/nl/contact-us)

| # | Section Style | Content |
|---|--------------|---------|
| 1 | `centered` | Default content — h1 + contact info + address + links |

---

## 4. Section Styles

| Style | Purpose | Pages |
|-------|---------|-------|
| `hero` | Full-bleed background image section | All except legal/contact |
| `highlight` | Accent background for feature sections | Homepage, treatment pages |
| `qa-section` | FAQ topic group with id anchor | FAQ page |
| `cta-band` | Centered CTA button band | Most pages |
| `centered` | Centered text layout | Legal, contact |
| `footnotes` | Small-text regulatory footnotes | Most pages |

Section styles are applied via Section Metadata block at the end of each section:

| Section Metadata | |
|---|---|
| style | hero |

---

## 5. Metadata Mapping

### Global Defaults (bulk metadata)

| Key | Value |
|-----|-------|
| og:site_name | Juvéderm® Netherlands |
| template | content-page |
| lang | nl |

### Per-Page Metadata (authored in document)

| Source Field | EDS Metadata Key | Notes |
|-------------|-----------------|-------|
| `<title>` | title | Trim leading spaces from source titles |
| `<meta name="description">` | description | Preserve Dutch text |
| `og:title` | og:title | Usually same as title |
| `og:description` | og:description | Usually same as description |
| `og:image` | og:image | Downloaded and re-hosted hero/share image |
| `keywords` | keywords | Preserved where present |

---

## 6. Navigation & Footer

### Navigation (/nav)

Authored in the /nav document. Structure:

```
[Juvéderm Logo linked to /]

- Behandeling
  - [Lippen](/nl/treatment/lips)
  - [Ogen](/nl/treatment/eye-area)
  - [Accentueren](/nl/treatment/enhance)
  - [Herstel](/nl/treatment/restore)
  - [Man](/nl/treatment/male)
- FAQ
  - [Over Juvéderm®](/nl/qa#about-juvederm)
  - [Kosten](/nl/qa#duration)
  - [Langdurige resultaten](/nl/qa#results)
  - [Veiligheid](/nl/qa#side-effects)
  - [Zones van het gezicht](/nl/qa#facial-areas)

**[Vind je kliniek](/nl/find-a-clinic)**
```

Mobile: Hamburger menu with slide-out panel, same link structure.

### Footer (/footer)

Authored in the /footer document. Structure:

```
**[Vind je kliniek](/nl/find-a-clinic)**

---

:instagram: :facebook:

---

- [Lippen](/nl/treatment/lips)
- [Ogen](/nl/treatment/eye-area)
- ... (all nav links)
- [Neem contact op](/nl/contact-us)

---

[Privacy beleid](https://www.abbvie.nl/privacy.html) |
[Algemene voorwaarden](https://www.abbvie.nl/termsofuse.html) |
[Social media disclaimer](/nl/disclaimer) |
[Cookies settings](#onetrust) |
[Algemene voorwaarden kliniekzoeker](/nl/algemene-voorwaarden-kliniekzoeker)

---

© AbbVie. Alle rechten voorbehouden.
```

---

## 7. Migration Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| D1 | Homepage & locale-root are identical → migrate once, redirect /nl → / | Avoids duplicate content, simplifies authoring |
| D2 | Clinic-detail (54 pages) → out of scope | Dynamic CRM-driven pages; handled at runtime by clinic-finder block |
| D3 | Clinic-finder → custom block with Google Maps API | No Block Collection equivalent; data from JSON spreadsheet |
| D4 | Cookie consent → delayed.js (OneTrust SDK) | Standard EDS pattern for third-party scripts; protects CWV |
| D5 | Video → Hero (video) variant, no standalone video block | Only homepage uses video; keeps palette at 8 blocks |
| D6 | /nl/clinics, /nl/clinic → redirect to /nl/find-a-clinic | Same UI, single canonical page |
| D7 | Topic-menu → custom block (not section style) | Enables JS-powered active highlighting, clearer authoring |
| D8 | Legal & contact → default content only | Simple text pages need no blocks |
| D9 | Google Fonts → self-hosted | Better LCP, no third-party DNS lookup |
| D10 | Analytics (GTM, GA, FB Pixel) → delayed.js | Non-critical scripts deferred to protect performance |

---

## 8. Migration Order

### Pilot Phase (4 pages)

These pages validate all core blocks and templates:

1. **/** (homepage) — exercises hero, carousel, cards, accordion, CTA pattern
2. **/nl/treatment/lips** — validates treatment-page template with tabs, columns
3. **/nl/qa** — validates accordion-heavy page, topic-menu custom block
4. **/nl/disclaimer** — quick win, validates default content and metadata

### Batch Phase (7 pages)

After pilot validation, migrate remaining pages:

5. /nl/treatment/eye-area
6. /nl/treatment/enhance
7. /nl/treatment/restore
8. /nl/treatment/male
9. /nl/find-a-clinic (requires clinic-finder custom block)
10. /nl/contact-us
11. /nl/algemene-voorwaarden-kliniekzoeker

### Redirects Only

- /nl → / (homepage duplicate)
- /nl/clinics → /nl/find-a-clinic
- /nl/clinic → /nl/find-a-clinic

### Out of Scope

- 54 clinic-detail dynamic pages (handled at runtime)

---

## 9. Third-Party Integrations

| Integration | EDS Approach | Location |
|------------|-------------|----------|
| Google Tag Manager | `delayed.js` script tag | delayed.js |
| Google Analytics | Via GTM (above) | delayed.js |
| Facebook Pixel | `delayed.js` script tag | delayed.js |
| Google Maps API | Loaded by clinic-finder block JS | clinic-finder.js |
| OneTrust Cookie Consent | `delayed.js` SDK load + CSS | delayed.js |
| Vimeo (video embed) | Hero video variant or aem-embed auto-block | hero.js |

---

## 10. Image Strategy

- **Source:** Adobe Dynamic Media (`/content/dam/juvederm-ous/`)
- **Action:** Download all images during migration, commit to DA content
- **Optimization:** EDS CDN handles responsive image delivery automatically
- **SVG icons:** Logo, social media icons → `/icons/` directory
- **Hero images:** One desktop + one mobile variant per hero (responsive `<picture>`)

---

## 11. Redirects Configuration

Create `redirects.xlsx` with:

| Source | Destination |
|--------|------------|
| /nl | / |
| /nl/clinics | /nl/find-a-clinic |
| /nl/clinic | /nl/find-a-clinic |

---

## 12. Risks & Open Items

1. **Clinic data source:** Need to determine how clinic records will be provided post-migration. Options: JSON spreadsheet in DA, external API, or Salesforce integration.
2. **Age gate:** Source site has an age verification form. Decision needed on whether to implement in EDS (could be a modal loaded in eager phase).
3. **Vimeo video hosting:** Homepage hero video is currently hosted on Vimeo. Need to confirm video URL and hosting arrangement post-migration.
4. **Regulatory compliance:** Medical device disclaimers and regulatory footnotes must be carefully preserved. All `<sup>` citation references must be maintained.
5. **External links:** Privacy and Terms links point to abbvie.nl (external domain). These are kept as-is.
