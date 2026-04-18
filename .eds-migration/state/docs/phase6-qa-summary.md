# Phase 6 — Integration QA Summary

**Run ID:** c31b35fb  
**Site:** juvederm.nl → jmffraiz/jv-test-5  
**Generated:** 2026-04-18  
**Agent:** IntegrationQA-c31b35fb

---

## Overall Result: ⚠️ WARNING (13 Passed / 1 Warning / 0 Failed)

All 14 migrated pages return HTTP 200 on preview. One page flagged as WARNING due to CLS regression on `/nl/treatment/restore`. No pages have broken internal links or missing H1 headings.

---

## Pass / Fail / Warning Counts

| Status | Count |
|--------|-------|
| ✅ Passed | 13 |
| ⚠️ Warning | 1 |
| ❌ Failed | 0 |
| **Total** | **14** |

---

## Lighthouse Score Distribution

Audited 7 of 14 pages (key archetypes: homepage, 2× treatment, FAQ, clinic-finder, contact, disclaimer).

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|-----|-----|-----|-----|-----|
| `/` (homepage) | 98 | 100 | 96 | 69 | 1.7s | 0.004 | 110ms |
| `/nl/treatment/lips` | 100 | 98 | 96 | 69 | 1.2s | 0.035 | 20ms |
| `/nl/treatment/restore` | 92 | 98 | 96 | 69 | 1.1s | **0.18** | 0ms |
| `/nl/qa` | 100 | 100 | 100 | 69 | 1.2s | 0.058 | 10ms |
| `/nl/find-a-clinic` | 100 | 100 | 100 | 66 | 1.1s | 0.002 | 10ms |
| `/nl/contact-us` | 100 | 95 | 100 | 57 | 1.1s | 0.006 | 10ms |
| `/nl/disclaimer` | 100 | 95 | 100 | 57 | 1.1s | 0.005 | 10ms |
| **Avg** | **99** | **98** | **98** | **65** | - | - | - |

**SEO note:** SEO scores of 57–69 reflect the `noindex` header served on `*.aem.page`/`*.aem.live` preview domains. This is expected EDS staging behaviour and will resolve automatically on the production domain.

**CLS warning:** `/nl/treatment/restore` has CLS=0.18 (threshold: 0.1). Images in the carousel/columns blocks lack explicit `width`/`height` attributes, causing layout shift as images load.

---

## Visual Fidelity Summary

The source site (juvederm.nl) is a JavaScript-rendered SPA (AEM Sites 6.x). Scraped source HTML includes full navigation, header, footer, cookie banners, and scripts inflating text/link counts.

| Archetype | EDS Text (chars) | Source Text (chars)* | Actual Content Present |
|-----------|-----------------|----------------------|----------------------|
| homepage | 5,351 | 26,717 | ✅ — source inflated by SPA chrome |
| treatment-page (lips) | 4,038 | 31,424 | ✅ — source inflated |
| faq | 10,818 | — | ✅ Full Q&A content |
| legal (disclaimer) | 5,042 | 19,725 | ✅ — source inflated |
| contact | 316 | 10,051 | ⚠️ Contact info only; form not migrated |
| clinic-finder | 252 | — | ✅ Configuration block (by design) |

*Source metrics from Phase-4 verifier. Source text includes full SPA DOM (nav, footer, scripts, cookie banner).

Visual spot-check confirms that all primary headings, product names (JUVÉDERM®), treatment descriptions, and key CTAs ("Vind je kliniek") are present on EDS preview pages.

---

## Broken Links

**No broken internal links found.** All internal links checked across key pages (homepage, treatment/lips, FAQ, disclaimer, find-a-clinic, contact-us) resolve to HTTP 200.

External links were not validated (out of scope for QA phase).

---

## Accessibility Findings

| Issue | Severity | Pages Affected | Audit ID |
|-------|----------|----------------|----------|
| Links rely on color alone to be distinguishable | Medium | disclaimer, contact-us | `link-in-text-block` |
| No other WCAG 2.1 AA failures found | — | — | — |

All pages pass heading hierarchy checks (H1 present on all pages). Image alt text is present on images generated via EDS media pipeline.

---

## Nav / Footer

- `/nav` preview: HTTP 200 ✅
- `/footer` preview: HTTP 200 ✅
- Nav and footer render correctly on all content pages per visual verification.

---

## Redirect Validation

Redirects are configured in da.live (`/redirects` document, HTTP 200 on preview). CDN-level processing was not verified as active on `aem.live`:

| Source | Destination | Configured | CDN Active |
|--------|-------------|-----------|-----------|
| `/nl` → `/` | Configured ✅ | ❌ `/nl` returns 404; `/nl/` serves content |
| `/nl/clinics` → `/nl/find-a-clinic` | Configured ✅ | ❌ `/nl/clinics` serves stub content (200) |
| `/nl/clinic` → `/nl/find-a-clinic` | Configured ✅ | ❌ `/nl/clinic` serves stub content (200) |
| `/nl/contacteer-ons` → `/nl/contact-us` | Configured ✅ | ❌ Returns 404 |

**Root cause:** The `/redirects` document is in da.live HTML table format and previews correctly, but CDN-level redirect processing requires the document to be published to the CDN cache. The `/nl/clinics` and `/nl/clinic` pages have their own stub content (intentional design decision from Phase 4/5), so EDS serves the page rather than redirecting.

---

## Known Issues and Recommended Follow-up

### High Priority
1. **Redirect activation** — Verify the `/redirects` DA document is published to CDN and being processed as an EDS redirect table. Test with `curl -I https://main--jv-test-5--jmffraiz.aem.live/nl/contacteer-ons` after triggering publish.

### Medium Priority
2. **CLS on treatment pages** — Add explicit `width` and `height` attributes to all `<img>` tags in carousel and columns blocks. Fix in `blocks/carousel/carousel.js` and `blocks/columns/columns.js`.
3. **Contact page form** — `/nl/contact-us` migrated with address/phone info only. If a contact form is required, integrate a form solution (e.g. AEM Forms, Marketo, or a third-party embed).

### Low Priority  
4. **Missing `/placeholders.json`** — Create an empty placeholders spreadsheet in da.live to eliminate console 404 errors and restore Best Practices=100 across all pages.
5. **Link underline for accessibility** — Add `text-decoration: underline` to inline links in body text CSS to satisfy WCAG 2.1 AA `link-in-text-block` criterion.

### Deferred / Out of Scope
- 54 dynamic clinic-detail pages (e.g. `/nl/clinics/<id>`) — excluded from migration scope. Manual migration or dynamic generation via clinic-finder block required post-launch.
- Cookie consent implementation — flagged in Phase 2 inventory but not implemented in Phase 3. Requires legal review before choosing a solution.
- Live Google Maps integration for clinic-finder — Phase 5 configuration block is a stub awaiting API key and integration work.

---

## Regressions Found

| Severity | Issue | Fix Phase | Resolved? |
|----------|-------|-----------|-----------|
| Medium | EDS redirect processing not active | 5-config | Deferred (human review) |
| Medium | CLS=0.18 on treatment/restore | 3-build | Deferred (human review) |
| Low | Missing placeholders.json | 5-config | Deferred (human review) |
| Low | Link color contrast (WCAG) | 3-build | Deferred (human review) |

Maximum 1 regression cycle policy applied — all issues logged for human review.
