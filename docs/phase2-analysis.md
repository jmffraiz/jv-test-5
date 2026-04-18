# Phase 2 — Analysis Report

## Site: https://www.juvederm.nl

## Phase 2a — Scrape Samples
Scraped 6 representative pages across 4 archetypes:
- **homepage**: /nl (18 images)
- **treatment**: /nl/treatment/lips (22 images), /nl/treatment/male (22 images)
- **faq**: /nl/qa (12 images)
- **legal**: /nl/disclaimer (6 images), /nl/contact-us (6 images)

All pages produced: metadata.json, screenshot.png, cleaned.html, images/

## Phase 2b — Block Inventory

### Block Collection Blocks (7)
| Block | Purpose | Used On |
|-------|---------|---------|
| hero | Full-bleed hero banner with background image | homepage, treatment, faq |
| cards | Grid of items with images/text | homepage, treatment |
| columns | Side-by-side content layout | treatment, faq |
| accordion | Expandable Q&A sections | treatment, faq |
| tabs | Switchable panels (female/male) | homepage, treatment |
| carousel | Product image carousel | treatment |
| fragment | Reusable embedded content | homepage, treatment |

### Custom Blocks (1)
| Block | Purpose | Reason |
|-------|---------|--------|
| before-after | Image comparison with Voor/Na labels | No exact match in Block Collection |

### Default Content Patterns
- Headings with body text + superscript references
- Footnote bibliographies
- CTA buttons/links
- Warning banner text

## Phase 2c — Migration Blueprint

### Block Palette: 8 blocks total
- 7 from Block Collection (hero, cards, columns, accordion, tabs, carousel, fragment)
- 1 custom (before-after)

### Archetype Section Counts
| Archetype | Sections | Blocks Used |
|-----------|----------|-------------|
| homepage | 6 | hero, cards, before-after, tabs |
| treatment | 7 | hero, columns, cards, before-after, carousel, accordion, tabs |
| faq | 7 | hero, columns, accordion |
| legal | 1 | none (all default content) |
| clinic-finder | 2 | none (static shell + custom JS needed) |

### Site Conventions
- All content under `/nl` path prefix
- Dutch language throughout
- Heavy use of scientific footnotes/references
- Medical compliance code on every page
- Shared sections: treatment tabs (fragment candidate), clinic finder CTA, footer legal
- Images served from Adobe Dynamic Media — will download and re-host
- External links to abbvie.nl for privacy/terms

### Fragment Opportunities
1. Treatment tabs (VROUWELIJK/MANNELIJK) — identical on homepage + all 5 treatment pages
2. Footer legal disclaimer — identical on all pages (handled by EDS auto-footer)
