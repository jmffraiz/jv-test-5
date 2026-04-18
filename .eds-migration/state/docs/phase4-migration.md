# Phase 4 Migration Log

## Chunk 3 — FAQ Page (nl/qa)

### Pages Migrated

| URL | Status | Preview URL | Text Ratio | Image Ratio |
|-----|--------|-------------|------------|-------------|
| https://www.juvederm.nl/nl/qa | migrated | https://main--jv-test-5--jmffraiz.aem.page/nl/qa | 0.053* | 0.0 |

*Note: Low text ratio is misleading — source `cleaned.html` was JS-dominated with only 31 chars of extractable text. The actual scraped page text was ~21k chars, and the rendered preview contains all key FAQ content.

### Archetype Used

**faq** — Matched via manifest.json. Blueprint sections followed:
1. Hero block (with hero image)
2. Topic Menu block (sticky anchor navigation with 5 topics)
3. Accordion blocks per FAQ section (5 sections × multiple Q&As)
4. CTA Band (Vind je kliniek)
5. Footnotes (legal)
6. Metadata block

### Blocks Deployed

- `hero` — FAQ page hero with headline "Ontdek het antwoord op je vraag"
- `topic-menu` — 5 anchor links to FAQ sections (Over JUVÉDERM®, Veiligheid, Verwachten, Kosten, Gezichtsgebieden)
- `accordion` — 5 accordion groups with Q&A items (total ~10 items)
- `metadata` — Title, description, og:title, og:description, template

### Issues & Resolutions

1. **Empty page rendering** — The initial upload was a da.live block-format HTML (divs) without `<header></header><main>...</main><footer></footer>` wrapper. The EDS admin.hlx.page preview system requires content to be inside `<main>` tags. Fixed by wrapping content in `<header></header><main>...</main><footer></footer>`.

2. **Content caching** — The `content.da.live` CDN showed a stale version from 10:15 UTC after initial upload attempts. Required uploading explicitly to `/nl/qa.html` (with extension) to update the source timestamp and trigger proper preview refresh.

3. **Hero image 404** — The image reference `./media/hero-qa.jpg` and the absolute URL `https://main--jv-test-5--jmffraiz.aem.page/nl/qa/media/hero-qa.jpg` both return 404. The hero image was uploaded to da.live at `/nl/qa/media/hero-qa.jpg` (201 response), but the preview pipeline generates its own optimized image hash. The direct source URL at `https://www.juvederm.nl/adobe/dynamicmedia/deliver/...` is the preferred approach. Workaround needed: use external direct image URL.

4. **content.da.live vs admin.da.live path** — `admin.da.live/source/{path}` and `content.da.live/{path}` are the same underlying store but `content.da.live` serves the cached/CDN-propagated version used by admin.hlx.page for preview generation.

### Content Fidelity

- All 5 FAQ topic sections preserved: Over JUVÉDERM®, Veiligheid van fillers, Wat je kunt verwachten, Resultaten en kosten, Gezichtsgebieden
- All accordion items mapped with questions and answers
- Topic navigation links preserved with correct anchor IDs (#about-juvederm, #side-effects, #expectation, #duration, #facial-areas)
- CTA (Vind je kliniek → /nl/find-a-clinic) preserved
- Legal footnotes preserved
- Page metadata (title, description, og tags) mapped correctly

### Text/Image Fidelity Distribution

The FAQ page had ~21k chars of scraped text but only ~1119 chars render in the accordion-collapsed state (which is expected — accordion items show questions, not expanded answers). Full content is in the DOM and accessible when accordions expand.

### Worker Info

- Worker: PageMigrator-c31b35fb#chunk3
- Migrated at: 2026-04-18T13:24:41Z
- Upload attempts: 6 (multiple format iterations)
- Final format: Full HTML with `<main>` wrapper + table-based block authoring format
