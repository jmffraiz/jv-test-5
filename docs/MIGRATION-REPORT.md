# JUVÉDERM® Netherlands — EDS Migration Report

## Executive Summary

| Item | Value |
|------|-------|
| **Source site** | https://www.juvederm.nl |
| **Preview base** | https://main--jv-test-5--jmffraiz.aem.page |
| **da.live editor** | https://da.live/#/jmffraiz/jv-test-5 |
| **GitHub repo** | https://github.com/jmffraiz/jv-test-5 |
| **Total pages migrated** | 11 of 13 (2 dynamic pages skipped) |
| **Overall status** | ✅ **COMPLETE** |

---

## Phase-by-Phase Summary

| Phase | Status | Retries | Fallbacks | Details |
|-------|--------|---------|-----------|---------|
| 1 — Discovery | ✅ PASS | 0 | None | 13 pages found, 5 archetypes |
| 2a — Scrape | ✅ PASS | 0 | None | 6 pages scraped with Playwright |
| 2b — Inventory | ✅ PASS | 0 | None | 7 Block Collection + 1 custom block |
| 2c — Blueprint | ✅ PASS | 0 | None | 5 archetype blueprints defined |
| 3 — Block Dev | ✅ PASS | 0 | None | 5 blocks added, lint clean |
| 3.5 — Pilot | ✅ PASS | 0 | None | 2 pilot pages verified |
| 4 — Migration | ✅ PASS | 0 | None | 11 pages migrated, all 200 |
| 5 — Config | ✅ PASS | 0 | None | Nav, footer, redirects, YAML configs |
| 6 — QA | ✅ PASS | 0 | None | All checks passing |

---

## Architecture Overview

### Block Palette (8 blocks)

| Block | Source | Purpose |
|-------|--------|---------|
| hero | Block Collection | Full-bleed hero banner with background image |
| cards | Block Collection | Grid of content items (features, products) |
| columns | Block Collection | Side-by-side content layout |
| accordion | Block Collection | Expandable Q&A sections |
| tabs | Block Collection | Switchable content panels (VROUWELIJK/MANNELIJK) |
| carousel | Block Collection | Product showcase carousel |
| fragment | Block Collection | Reusable content sections |
| before-after | Custom | Image comparison with Voor/Na labels |

### Content Models

- **Treatment pages**: hero → columns (intro) → cards (benefits) → before-after → carousel (products) → accordion (FAQ) → CTA
- **FAQ page**: hero → multiple columns + accordion sections → references
- **Legal pages**: Simple heading + paragraph text
- **Homepage**: hero → intro → cards → before-after → tabs → CTA

### Site Conventions
- Language: Dutch (nl)
- Path prefix: /nl/
- Images: Adobe Dynamic Media (dm-aid--* URLs)
- Footer: Medical compliance text (NL-JUV-230072)
- Warning: "Kijk uit. Jezelf mooier maken kan lelijk uitpakken."

---

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Dynamic clinic finder pages not migrated | Low | Deferred — requires custom JS integration |
| Images reference original Dynamic Media URLs | Medium | Functional but adds external dependency |
| Footnote superscript numbers stripped | Low | Content simplified for cleaner authoring |
| Cookie consent (OneTrust) not integrated | Low | Requires delayed.js integration |

---

## Maintenance Guide

### Adding New Pages
1. Create HTML in da.live editor: https://da.live/#/jmffraiz/jv-test-5
2. Use block tables (hero, cards, accordion, etc.) following the content models above
3. Preview at: https://main--jv-test-5--jmffraiz.aem.page/{path}
4. Publish when ready

### Modifying Blocks
1. Clone repo: `git clone https://github.com/jmffraiz/jv-test-5.git`
2. Edit files in `blocks/{block-name}/`
3. Run `npm run lint` to verify
4. Push to main branch — changes are live on preview immediately

### Updating Navigation
1. Edit `nav.html` in da.live
2. Edit `footer.html` in da.live
3. Preview both to trigger update

### Adding Redirects
1. Edit `redirects.html` in da.live
2. Add new row with Source and Destination columns
3. Preview to activate

---

## Links

| Resource | URL |
|----------|-----|
| **Preview (homepage)** | https://main--jv-test-5--jmffraiz.aem.page/nl/ |
| **da.live Editor** | https://da.live/#/jmffraiz/jv-test-5 |
| **GitHub Repository** | https://github.com/jmffraiz/jv-test-5 |
| **QA Report** | See `qa-report.json` in working directory |
| **Phase 1 — Discovery** | [docs/phase1-discovery.md](phase1-discovery.md) |
| **Phase 2 — Analysis** | [docs/phase2-analysis.md](phase2-analysis.md) |
| **Phase 3 — Block Dev** | [docs/phase3-block-dev.md](phase3-block-dev.md) |
| **Phase 4 — Migration** | [docs/phase4-migration.md](phase4-migration.md) |
| **Phase 5 — Config** | [docs/phase5-config.md](phase5-config.md) |
