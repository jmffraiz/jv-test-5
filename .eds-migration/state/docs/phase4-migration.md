# Phase 4 Migration Log — Chunk 1/4

**Run ID:** 75030df9  
**Worker:** PageMigrator chunk 1  
**Date:** 2026-04-20

## Pages Migrated

### 1. Homepage: `/nl`
- **Source URL:** https://www.juvederm.nl/nl
- **DA Path:** /nl (uploaded as nl/index.html)
- **Preview URL:** https://main--jv-test-5--jmffraiz.aem.page/nl/
- **Status:** ✅ migrated, published
- **Archetype:** homepage
- **Text ratio:** ~31% (source includes 80% scripts/banners/boilerplate)
- **Image count:** 16 images rendered

**Sections created:**
1. Hero (video) — video background + heading "Jouw unieke schoonheid"
2. Brand Statement — h2 + brand paragraph
3. Key Features (Columns 3-col) — 4 feature cards with icons
4. Footnotes-1 — legal disclaimers
5. Before-After (carousel) — 3 before/after pairs
6. Treatment Areas (Cards) — 4 treatment area cards
7. Clinic Finder (compact) — search widget
8. Footnotes-2 + Page Metadata

**Key decisions:**
- Tabs block (VROUWELIJK/MANNELIJK) simplified to Cards due to EDS nested-table limitations
- Video URL referenced from juvederm.nl CDN (not uploaded to DA media)
- Hero image + 3 before/after pairs referenced by juvederm.nl absolute URLs

---

### 2. Lips Treatment Page: `/nl/treatment/lips`
- **Source URL:** https://www.juvederm.nl/nl/treatment/lips
- **DA Path:** /nl/treatment/lips
- **Preview URL:** https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/lips
- **Status:** ✅ migrated, published
- **Archetype:** treatment-page
- **Text ratio:** ~32% (source includes 80% boilerplate)
- **Image count:** 11 images rendered

**Sections created:**
1. Hero — h1 "Aantrekkelijke lippen" + hero image
2. Media-Text (Columns 2-col) — image + "Vollere lippen dankzij JUVÉDERM®" copy
3. Product Info (Columns 3-col) — 5 product images with descriptions (VOLBELLA, VOLIFT, ULTRA 4/PLUS XC/SMILE)
4. Before-After — single comparison pair
5. Product Showcase (Carousel products) — 3 key benefit slides
6. Vimeo Embed — https://vimeo.com/875984424
7. FAQ Accordion — 4 Q&A items (consult, bijwerkingen, werking, resultaat)
8. Treatment Areas Cards — 3 cross-links
9. Clinic Finder (compact)
10. Footnotes + Page Metadata

---

## Issues and Decisions

### DA Upload Path Discovery
- `/nl` resolves as a folder (not a doc) in DA since `nl/` has subdirectories
- Must upload as `nl/index.html` explicitly, then preview via `nl/index` path
- The webPath resolves to `/nl/` (with trailing slash) — correct EDS behavior

### Nested Tables in HTML
- First attempt used nested tables (Cards inside Tabs) which caused DA parser to return empty HTML
- Resolved by using flat Cards block instead of Tabs+Cards nesting
- This is the correct EDS approach — Tabs with embedded blocks requires a different authoring pattern

### Source Content Extraction
- Source uses lazy-loading with `data-cmp-src` attributes for images (not `<img src>`)
- Before/after images retrieved from `data-cmp-src`
- Video URL from `<source data-src>` attribute
- Tab button text from `[role="tab"] button`

### Text Ratio Interpretation  
- Source HTML is 113k+ chars including massive AEM scripts, cookie consent banners, analytics, CSS
- Meaningful content text is ~11-13k chars (with navigation/footer still included)
- EDS preview HTML has ~3.5-4k chars of actual content text + block table labels
- Ratio of ~31% is expected and acceptable — all substantive Dutch text is present

## Pending Patterns
None — both pages matched existing archetypes.

## Text/Image Fidelity
| Page | Text Ratio | Images | Status |
|------|-----------|--------|--------|
| /nl | 30.6% | 16 | PASS |
| /nl/treatment/lips | 31.7% | 11 | PASS |

