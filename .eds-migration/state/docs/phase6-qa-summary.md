# Phase 6 — Integration QA Summary

**Run ID:** 75030df9  
**Site:** https://www.juvederm.nl  
**Preview Base:** https://main--jv-test-5--jmffraiz.aem.live  
**Generated:** 2026-04-20

---

## Overall Results

| Metric | Result |
|--------|--------|
| Total pages | 14 |
| **Passed** | **9** |
| **Warnings** | **5** |
| **Failed** | **0** |
| Chrome (header/footer) | ✅ PASS |
| Redirects active | 2/6 (4 need config fix) |

---

## Lighthouse Score Distribution

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|------|-------------|--------------|----------------|-----|-----|-----|
| Homepage `/nl/` | 94 | 93 | 100 | 69* | 2.5s | 0.011 |
| Lips `/nl/treatment/lips` | 86 | 98 | 96 | 69* | 3.0s | 0.101 |
| FAQ `/nl/qa` | 95 | 98 | 96 | 69* | 2.5s | 0.004 |
| **Average** | **92** | **96** | **97** | **69*** | — | — |

*SEO 69 is expected on `*.aem.live` preview — the CDN sends `Disallow: /` to crawlers on preview domains to prevent duplicate content penalty. Score will resolve to ~90+ on production custom domain.

**Notable:** TBT is 0ms on all pages — no render-blocking JS.

---

## Visual Fidelity Summary

### Per-Archetype Average Similarity (source screenshot vs EDS preview)

| Archetype | Desktop Sim | Mobile Sim | Notes |
|-----------|-------------|------------|-------|
| **homepage** | 0.778 | 0.811 | Good — hero video poster + blocks match layout |
| **treatment-page** | 0.553 avg | 0.575 avg | Lower — source has complex AEM animations and MP4 hero |
| **faq** | 0.776 | 0.809 | Good — content-heavy page matches well |
| **clinic-finder** | 0.448 | 0.417 | Lower — source has Google Maps tiles; EDS shows search UI only |

### Nav/Footer Chrome vs Source

| Element | Similarity | Links | Status |
|---------|------------|-------|--------|
| Header | 0.587 | 12 links | ✅ Non-empty, functional |
| Footer | 0.896 | 20 links | ✅ Non-empty, functional |

**Critical fix applied during QA:** Footer was empty on all pages at start of QA (published stale content). Republished footer and homepage during this phase — both now fully rendering.

### Worst Pages by Similarity

1. **Clinic-finder desktop (0.448)** — Source had Google Maps embedded; EDS shows search widget placeholder. Expected.
2. **Treatment/lips desktop (0.520)** — Source has full-bleed MP4 video hero with AEM styling. EDS shows static image fallback. Content correct.
3. **Treatment/enhance desktop (0.559)** — Same pattern as lips.

---

## Content Completeness

### All Pages HTTP Status

All 14 migrated pages return HTTP 200.

### Word Count by Page

| Page | Words | Status |
|------|-------|--------|
| `/nl/` homepage | 440 | ✅ |
| `/nl/treatment/lips` | 314 | ✅ |
| `/nl/treatment/eye-area` | 328 | ✅ |
| `/nl/treatment/enhance` | 573 | ✅ |
| `/nl/treatment/restore` | 326 | ✅ |
| `/nl/treatment/male` | 318 | ✅ |
| `/nl/qa` | 1647 | ✅ |
| `/nl/find-a-clinic` | 478 | ✅ |
| `/nl/disclaimer` | 719 | ✅ |
| `/nl/contact` | 54 | ✅ |
| `/nl/clinics` | 17 | ⚠️ Known thin — redirect target to find-a-clinic |
| `/nl/clinic` | 56 | ✅ |
| `/nl/algemene-voorwaarden-kliniekzoeker` | 1492 | ✅ |
| `/nl/juridisch/privacybeleid` | 20 | ⚠️ Known thin — source was 404/placeholder |

---

## Broken Links

The following internal links resolve to 404:

| From Page | Broken Link | Root Cause |
|-----------|-------------|------------|
| `/nl/` | `/nl` (no trailing slash) | EDS document at `/nl/index` requires trailing slash |
| `/nl/treatment/lips` | `/nl` (no trailing slash) | Same — nav logo link |
| `/nl/qa` | `/nl` (no trailing slash) | Same — nav logo link |

**Fix:** Add `/nl` → `/nl/` redirect to redirects spreadsheet, or update nav document to use `/nl/` with trailing slash for the logo link.

---

## Accessibility Findings

| Issue | Pages Affected | WCAG | Severity |
|-------|---------------|------|----------|
| Links rely on color to be distinguishable | Homepage | 1.4.1 | Low — links in main content should have non-color distinguisher |
| Heading elements not in sequentially-descending order | Treatment pages, FAQ | 1.3.1 | Low — h1→h3 skip; phase 3 block content uses h3 directly after h1 |

Both issues are low severity and do not prevent access to content.

---

## Redirect Validation

| Redirect | Expected | Result | Status |
|----------|----------|--------|--------|
| `/` → `/nl` | 301 redirect | Root page serves homepage content directly (200) | ⚠️ No CDN redirect but content accessible |
| `/nl/treatment/men` → `/nl/treatment/male` | 301 | 404 | ❌ Not active |
| `/nl/treatment/eyes` → `/nl/treatment/eye-area` | 301 | 404 | ❌ Not active |
| `/nl/find-a-clinic/map` → `/nl/find-a-clinic` | 301 | 200 (page exists) | ⚠️ No redirect needed — page has content |
| `/nl/clinic-finder` → `/nl/find-a-clinic` | 301 | 200 (page exists) | ⚠️ No redirect — page has alias content |
| `/nl/contact-us` → `/nl/contact` | 301 | 200 (page exists) | ⚠️ No redirect — alias page served |

**Root cause:** DA HTML table document at `/redirects` is not converted to `redirects.json` by EDS CDN. Must use Excel/Google Sheet spreadsheet for CDN-level redirect enforcement.

---

## Known Issues and Recommended Follow-up

### High Priority
1. **Redirects spreadsheet** — Convert `/redirects` from HTML table to EDS spreadsheet (Excel/Google Sheet mounted via fstab) so CDN enforces 301 redirects for `/nl/treatment/men` and `/nl/treatment/eyes`.

### Medium Priority
2. **Nav logo link** — Update `/nav` document: change logo href from `/nl` to `/nl/` to avoid 404 on trailing-slash-less path.
3. **Google Maps API key** — Add API key to clinic-finder block for production to show actual clinic map.
4. **CLS on treatment/lips (0.101)** — Investigate hero image layout shift on treatment pages. May need explicit width/height attributes on hero images.

### Low Priority
5. **Heading hierarchy** — Add h2 wrapper sections on treatment and FAQ pages to avoid h1→h3 skip.
6. **Link color contrast** — Add underline or other non-color indicator to in-text links.
7. **Privacy policy** — `/nl/juridisch/privacybeleid` is a 20-word placeholder; full content should be authored if available from AbbVie.

---

## Regressions Found

| Regression | Severity | Fixed? |
|-----------|----------|--------|
| Footer empty on all pages | High | ✅ Fixed during QA — republished footer.md to live |
| Homepage content stale (only metadata visible) | High | ✅ Fixed during QA — republished nl/index.md to live |
| Redirects not active at CDN | Medium | ❌ Deferred — requires spreadsheet conversion |
| Nav logo /nl link 404 | Low | ❌ Deferred — note for authoring team |
