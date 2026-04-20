
---

## Chunk 4/4 — Worker PageMigrator-75030df9#chunk4

**Batch processed:** 2026-04-20  
**Pages in chunk:** 1

---

### Pages Migrated

| URL | da.live Path | Archetype | Status | Text Ratio | Image Ratio |
|-----|-------------|-----------|--------|-----------|------------|
| https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker | /nl/algemene-voorwaarden-kliniekzoeker | informational | ✅ migrated | 66% | 100% (0/0) |

---

### Source Acquisition

The page `nl--algemene-voorwaarden-kliniekzoeker` was **not present** in the source bundle. It was scraped fresh using Playwright with the documented settle strategy (networkidle + content stability 500ms × 2, overlays dismissed). The scraped HTML and screenshots were saved to `source-bundle/pages/nl--algemene-voorwaarden-kliniekzoeker/`.

---

### Content Mapping

- **Archetype:** `informational` (same pattern as `legal` — plain text content)
- **Blueprint section:** 1 × `content` with `style: legal-content`
- **Content structure:**
  - `<h2>` page title: "Algemene Voorwaarden Kliniekzoeker"
  - Introductory paragraphs (6 paragraphs)
  - `<h3>` sub-heading: "Allergan Aesthetics Kliniekzoeker - Gebruiksvoorwaarden."
  - 13 numbered `<h4>` sections (ALGEMEEN through WIJZIGINGEN) with body paragraphs
  - Reference line: "AbbVie B.V./AbbVie N.V. | NL-JUV-220043 | March 2022"
- **Metadata block:** title, description, template=informational
- **Images:** None — this is a text-only legal/terms page

---

### Issues & Decisions

1. **Page not in source bundle:** Fresh Playwright scrape required. Used same settle strategy documented in `source-bundle/README.md`.

2. **Header/footer chrome (0 links):** The `/nav` and `/footer` pages on da.live are empty (returning `<main><div></div></main>`). This is a site infrastructure gap affecting all migrated pages — not a content migration failure. The EDS header block IS loading (`data-block-status="loaded"`) and hydrating, but there are no links because the nav fragment is unpopulated.

3. **Console 503 error:** `Failed to load resource: the server responded with a status of 503` — this is from the source site `www.juvederm.nl` which has a known "DNS cache overflow" issue. Expected and not a migration error.

4. **Text fidelity 66%:** Preview text (10,656 chars) vs source body total (16,080 chars). The source includes nav, cookie banners, and footer repeated content not present in the EDS preview. Against main content only (13,885 chars), ratio is 77%. All legal sections preserved.

---

### Fidelity Distribution

| Page | Text Ratio | Image Ratio | Notes |
|------|-----------|------------|-------|
| /nl/algemene-voorwaarden-kliniekzoeker | 66% (body) / 77% (content) | N/A (0 images) | All 13 legal sections preserved |

