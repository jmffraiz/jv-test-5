# Phase 1 — Discovery: juvederm.nl

**Run ID:** 693fdd13  
**Date:** 2026-04-19  
**Crawler:** Crawler-693fdd13  
**Source site:** https://juvederm.nl → https://www.juvederm.nl

---

## Summary

Total pages discovered: **14**  
Total archetypes: **5**  
Sitemap URL: https://www.juvederm.nl/sitemap.xml (13 URLs)  
Additional discovered via link traversal: 1 (`/nl/algemene-voorwaarden-kliniekzoeker`)

---

## Page Inventory by Archetype

| Archetype | Count | Description |
|-----------|-------|-------------|
| homepage | 2 | Root (`/`) and Dutch homepage (`/nl`) |
| treatment-page | 5 | Individual treatment area pages |
| faq | 1 | FAQ / Q&A page with anchor sections |
| clinic-finder | 3 | Clinic search, listing, and detail pages |
| contact | 1 | Contact form page |
| legal | 2 | Disclaimer and clinic finder terms |

**Total: 14 pages**

---

## Page List

### Homepage (2)
- `https://www.juvederm.nl/` — redirects to `/nl`, same content
- `https://www.juvederm.nl/nl` — Dutch language homepage

### Treatment Pages (5)
- `https://www.juvederm.nl/nl/treatment/lips` — Lip treatments
- `https://www.juvederm.nl/nl/treatment/eye-area` — Eye area treatments
- `https://www.juvederm.nl/nl/treatment/enhance` — Accentueren (enhancement)
- `https://www.juvederm.nl/nl/treatment/restore` — Herstel (restoration)
- `https://www.juvederm.nl/nl/treatment/male` — Male-focused treatments

### FAQ (1)
- `https://www.juvederm.nl/nl/qa` — Frequently asked questions with anchor sections (about-juvederm, duration, results, side-effects, facial-areas)

### Clinic Finder (3)
- `https://www.juvederm.nl/nl/find-a-clinic` — Entry point / search
- `https://www.juvederm.nl/nl/clinics` — Clinics listing (map + list)
- `https://www.juvederm.nl/nl/clinic` — Individual clinic detail template

### Contact (1)
- `https://www.juvederm.nl/nl/contact-us` — Contact form

### Legal (2)
- `https://www.juvederm.nl/nl/disclaimer` — Social media disclaimer
- `https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker` — Clinic finder general terms

---

## Navigation Structure

### Header Navigation
The site uses an AEM EMU navigation component (`emu-navigation`). The header contains:

**Primary nav items (top-level):**
- Treatment submenu: Lippen, Ogen, Accentueren, Herstel, Man
- FAQ submenu: Over Juvéderm®, Kosten, Langdurige resultaten, Veiligheid, Zones van het gezicht
- CTA button: "Vind je kliniek" → `/nl/find-a-clinic`

**Mobile navigation:** Identical links in a modal overlay (`.juvederm-navigation--mobile`)

### Footer
The site's `<footer>` element is an empty AEM container. **No footer navigation links are rendered.** Legal/utility links exist only in page body content:
- Disclaimer → `/nl/disclaimer`
- Contact → `/nl/contact-us`
- Algemene Voorwaarden Kliniekzoeker → `/nl/algemene-voorwaarden-kliniekzoeker`
- AbbVie Privacy Policy → `https://privacy.abbvie/`

---

## Site Assets Discovered

| Asset | Details |
|-------|---------|
| Favicon | `https://www.juvederm.nl/favicon.ico` |
| Backend | Adobe AEM / CQ (evidenced by component class patterns) |
| Cookie consent | OneTrust (cdn.cookielaw.org) |
| Maps API | Google Maps JavaScript API (clinic finder) |
| Fonts | Embedded via AEM — specific font files to be extracted from page HTML |

---

## Crawl Issues

| Issue | Description |
|-------|-------------|
| SSL certificate | Headless browser environment could not validate site SSL cert. Bypassed with `ignoreHTTPSErrors`. Site content not affected. |
| Apex redirect | `https://juvederm.nl` → `https://www.juvederm.nl` (301). All captures done against www. |
| Google Maps networkidle | Clinic finder pages load Google Maps which never reaches networkidle. 12s timeout applied, then content-stability fallback used. |
| Dynamic clinic URLs | Hundreds of parameterized `/nl/clinic?location=...&clinic=...` URLs discovered. Excluded — all use same template as `/nl/clinic`. |
| Empty footer | AEM footer container has no rendered content. No footer links to migrate. |

---

## Archetype Rationale

- **homepage**: The root `/` and `/nl` URLs render identical content (Dutch homepage). Both captured to document redirect behavior.
- **treatment-page**: Five pages sharing the same layout pattern: hero image, treatment description, before/after section, FAQ teaser, clinic CTA. Distinguished by treatment area (lips, eyes, enhance, restore, male).
- **faq**: Dedicated Q&A page with accordion/section structure and anchor navigation. Unique layout from treatment pages.
- **clinic-finder**: Three-page flow: search entry (`find-a-clinic`), results listing with map (`clinics`), and individual clinic detail (`clinic`). All use Google Maps and dynamic data. 
- **contact**: Single contact form page.
- **legal**: Static text pages (disclaimer and terms). Minimal visual complexity.

---

## Source-of-Truth Bundle

**Location:** `.eds-migration/state/source-bundle/`

**Coverage:**
- 14 pages × 2 viewports = **28 screenshots total**
- 14 rendered HTML files
- 14 meta.json files with capture metadata
- Chrome: header HTML, footer HTML, header links JSON, footer links JSON, header screenshot, footer/bottom screenshot

**Viewport sizes:**
- Desktop: 1440 × 900 px
- Mobile: 390 × 844 px

See `source-bundle/README.md` for full details on capture strategy and site-specific quirks.

---

## Pointer to Artifacts

| Artifact | Path |
|---------|------|
| Full manifest | `.eds-migration/state/manifest.json` |
| Source bundle | `.eds-migration/state/source-bundle/` |
| Phase 1 docs | `.eds-migration/state/docs/phase1-discovery.md` (this file) |
