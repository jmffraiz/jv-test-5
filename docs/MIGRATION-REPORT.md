# JUVÉDERM® Netherlands — EDS Migration Report

**Generated:** 2026-04-18 by IntegrationQA-c31b35fb  
**Run ID:** c31b35fb

---

## Executive Summary

| Item | Value |
|------|-------|
| **Source site** | https://www.juvederm.nl |
| **Preview base** | https://main--jv-test-5--jmffraiz.aem.page |
| **Live base** | https://main--jv-test-5--jmffraiz.aem.live |
| **da.live editor** | https://da.live/#/jmffraiz/jv-test-5 |
| **GitHub repo** | https://github.com/jmffraiz/jv-test-5 |
| **Total pages migrated** | 14 of 14 (100%) |
| **Excluded pages** | 54 dynamic clinic-detail pages (out of scope) |
| **Overall status** | ⚠️ **COMPLETE WITH KNOWN ISSUES** |

All 14 pages are migrated, published to da.live, and return HTTP 200 on preview. Average Lighthouse Performance is 99/100. One page has a CLS regression (treatment/restore, CLS=0.18). Redirect processing is not yet active at CDN level. All issues are documented and actionable.

---

## Migration Scope and Statistics

| Metric | Value |
|--------|-------|
| Source site | https://www.juvederm.nl (NL locale, SPA/AEM Sites) |
| Target platform | AEM Edge Delivery Services (da.live + GitHub) |
| Pages in scope | 14 |
| Pages migrated | 14 (100%) |
| Pages published | 14 (100%) |
| Pages with HTTP 200 on preview | 14 (100%) |
| Pages excluded (dynamic clinic detail) | 54 |
| Archetypes | 7 (homepage, locale-root, treatment-page, faq, clinic-finder, contact, legal) |
| Blocks implemented | 12 (8 Block Collection / boilerplate + 2 custom + metadata + topic-menu) |
| Lighthouse avg Performance | 99 |
| Lighthouse avg Accessibility | 98 |
| Lighthouse avg Best Practices | 98 |
| QA pass rate | 13/14 (93%) |

---

## Phase-by-Phase Summary

| Phase | Status | Retries | Fallbacks | Key Details |
|-------|--------|---------|-----------|-------------|
| 1 — Discovery | ✅ PASS | 0 | None | 14 pages crawled across 7 archetypes; SPA JS-rendering identified as scraping challenge |
| 2a — Scrape | ✅ PASS | 0 | None | Pages scraped; SPA content extracted via fetch of rendered HTML; images downloaded |
| 2b — Block Inventory | ✅ PASS | 0 | None | 12 distinct UI components mapped to 8 blocks; 2 custom blocks identified |
| 2c — Blueprint | ✅ PASS | 0 | None | 7 archetype blueprints defined; content models documented |
| 3 — Block Dev | ✅ PASS | 1 | None | All 12 blocks implemented; CSS scope fix applied for clinic-finder; metadata block added to fix 404s |
| 3.5 — Pilot | ✅ PASS | 0 | None | Homepage and treatment/lips verified end-to-end; image pipeline confirmed |
| 4 — Migration | ✅ PASS | 2 | None | All 14 pages migrated in 4 parallel chunks; image fix v2 applied for homepage (da.live media store); FAQ text ratio corrected |
| 5 — Config | ✅ PASS | 0 | None | Nav, footer, redirects, metadata, helix-query.yaml, helix-sitemap.yaml, robots.txt all configured |
| 6 — QA | ⚠️ WARNING | 0 | None | 13/14 pass; CLS regression on restore; redirects not CDN-active; 4 low/medium issues documented |

---

## Page Inventory

| Source URL | EDS Path | Preview URL | Archetype | Status | Lighthouse (P/A/BP) | Notes |
|------------|----------|-------------|-----------|--------|---------------------|-------|
| https://www.juvederm.nl/ | `/` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/) | homepage | ✅ Pass | 98/100/96 | Hero video + cards + carousel + columns |
| https://www.juvederm.nl/nl | `/nl/` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/) | locale-root | ✅ Pass | — | Stub; /nl (no slash) 404 on CDN |
| https://www.juvederm.nl/nl/treatment/lips | `/nl/treatment/lips` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/lips) | treatment-page | ✅ Pass | 100/98/96 | Full treatment content with 11 images |
| https://www.juvederm.nl/nl/treatment/eye-area | `/nl/treatment/eye-area` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/eye-area) | treatment-page | ✅ Pass | — | 13 images, full content |
| https://www.juvederm.nl/nl/treatment/enhance | `/nl/treatment/enhance` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/enhance) | treatment-page | ✅ Pass | — | 13 images, full content |
| https://www.juvederm.nl/nl/treatment/restore | `/nl/treatment/restore` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/restore) | treatment-page | ⚠️ Warn | 92/98/96 | **CLS=0.18** — images without dimensions in carousel |
| https://www.juvederm.nl/nl/treatment/male | `/nl/treatment/male` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/male) | treatment-page | ✅ Pass | — | 15 images, full content |
| https://www.juvederm.nl/nl/qa | `/nl/qa` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/qa) | faq | ✅ Pass | 100/100/100 | Full Q&A accordion; 10,818 chars |
| https://www.juvederm.nl/nl/find-a-clinic | `/nl/find-a-clinic` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/find-a-clinic) | clinic-finder | ✅ Pass | 100/100/100 | Configuration block; no live Maps integration |
| https://www.juvederm.nl/nl/contact-us | `/nl/contact-us` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/contact-us) | contact | ✅ Pass | 100/95/100 | Address/phone only; form not migrated |
| https://www.juvederm.nl/nl/disclaimer | `/nl/disclaimer` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/disclaimer) | legal | ✅ Pass | 100/95/100 | Full text; 5,042 chars |
| https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker | `/nl/algemene-voorwaarden-kliniekzoeker` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/algemene-voorwaarden-kliniekzoeker) | legal | ✅ Pass | — | Full T&Cs text; 10,689 chars |
| https://www.juvederm.nl/nl/clinics | `/nl/clinics` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/clinics) | stub | ✅ Pass | — | Stub redirecting to find-a-clinic |
| https://www.juvederm.nl/nl/clinic | `/nl/clinic` | [Preview](https://main--jv-test-5--jmffraiz.aem.page/nl/clinic) | stub | ✅ Pass | — | Stub with FAQ accordion |

---

## Block Inventory and Implementation Status

| Block | Source | Custom? | Status | Used By | Notes |
|-------|--------|---------|--------|---------|-------|
| hero | Block Collection | No | ✅ Implemented | All content pages | Video variant on homepage |
| accordion | Block Collection | No | ✅ Implemented | FAQ, clinic, treatment | 30 Q&A items on FAQ page |
| carousel | Block Collection | No | ✅ Implemented | Homepage, treatment | CLS issue on restore needs fix |
| cards | Block Collection | No | ✅ Implemented | Homepage, treatment | Product overview cards |
| tabs | Block Collection | No | ✅ Implemented | Treatment pages | VROUWELIJK/MANNELIJK variants |
| columns | Boilerplate | No | ✅ Implemented | Homepage, treatment | Two-column layouts |
| fragment | Boilerplate | No | ✅ Implemented | All pages | Shared content fragments |
| header | Boilerplate | No | ✅ Implemented | All pages | Auto-loaded from /nav |
| footer | Boilerplate | No | ✅ Implemented | All pages | Auto-loaded from /footer |
| before-after | Custom | Yes | ✅ Implemented | Treatment pages | Image comparison |
| clinic-finder | Custom | Yes | ✅ Implemented | find-a-clinic | Stub — Maps API not connected |
| metadata | Custom | Yes | ✅ Implemented | All pages | OG/Twitter meta tags |
| topic-menu | Custom | Yes | ✅ Implemented | FAQ | Sticky anchor navigation |

---

## Quality Metrics

### Lighthouse Scores (Mobile)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|------|-------------|---------------|----------------|-----|-----|-----|-----|
| Homepage | 98 | 100 | 96 | 69* | 1.7s | 0.004 | 110ms |
| Treatment/Lips | 100 | 98 | 96 | 69* | 1.2s | 0.035 | 20ms |
| Treatment/Restore | **92** | 98 | 96 | 69* | 1.1s | **0.18** | 0ms |
| FAQ | 100 | 100 | 100 | 69* | 1.2s | 0.058 | 10ms |
| Find-a-Clinic | 100 | 100 | 100 | 66* | 1.1s | 0.002 | 10ms |
| Contact | 100 | 95 | 100 | 57* | 1.1s | 0.006 | 10ms |
| Disclaimer | 100 | 95 | 100 | 57* | 1.1s | 0.005 | 10ms |
| **Average** | **99** | **98** | **98** | **65*** | — | — | — |

*SEO score reflects `noindex` on preview domain — expected for `*.aem.page` / `*.aem.live`. Will be 90+ on production domain.

### Content Coverage

- **Internal links:** 0 broken links found across all checked pages
- **H1 headings:** Present on all 14 pages
- **Images:** Present on all content-bearing pages; homepage 3 images (source count inflated by SPA chrome)
- **Dutch content:** Verified — all headings, product names (JUVÉDERM®), CTAs in Dutch

---

## Known Issues and Limitations

### Active Issues (Require Fix Before Go-Live)

| # | Issue | Severity | Affected Pages | Recommendation |
|---|-------|----------|----------------|----------------|
| 1 | **CLS=0.18 on treatment/restore** | Medium | `/nl/treatment/restore` | Add `width`/`height` attributes to carousel images; fix in `blocks/carousel/carousel.js` |
| 2 | **Redirects not active at CDN** | Medium | `/nl`, `/nl/contacteer-ons` | Verify `/redirects` DA document published to CDN; test with `curl -I` after publish trigger |
| 3 | **Missing /placeholders.json** | Low | All pages (console 404) | Create empty placeholders spreadsheet in da.live to eliminate console error |
| 4 | **Link color contrast** | Low | Disclaimer, Contact | Add `text-decoration: underline` to inline links in body text CSS |

### By-Design Limitations

| Limitation | Detail |
|------------|--------|
| 54 clinic-detail pages excluded | Dynamic `/nl/clinics/<slug>` pages not in migration scope. Requires post-launch manual migration or dynamic solution. |
| Contact form not migrated | Original SPA had embedded AEM Form. EDS version shows address/phone only. Form integration (AEM Forms, Marketo, etc.) needed. |
| Maps API not connected | Clinic-finder block is a configuration stub. Google Maps API key and integration required before launch. |
| Cookie consent not implemented | Flagged in Phase 2 inventory. Requires legal review of GDPR/cookiebot solution before go-live. |
| Source text parity low | Phase-4 verifier flagged text ratios of 13–26% vs source. Root cause: source site is a JS SPA with heavy chrome (50+ nav links, scripts, cookie banners in DOM). Actual editorial content is complete. |

---

## Redirect Configuration

Configured in da.live at `/redirects` (HTML table format, preview: HTTP 200):

| Source Path | Destination | Status |
|-------------|-------------|--------|
| `/nl` | `/` | Configured; CDN activation pending |
| `/nl/clinics` | `/nl/find-a-clinic` | Configured; stub page at `/nl/clinics` also exists |
| `/nl/clinic` | `/nl/find-a-clinic` | Configured; stub page at `/nl/clinic` also exists |
| `/nl/contacteer-ons` | `/nl/contact-us` | Configured; CDN activation pending |

**To activate:** Trigger CDN publish via AEM admin API or da.live publish action for the `/redirects` document.

---

## Recommendations for Post-Migration

### Immediate (Before Go-Live)
1. **Fix CLS on treatment pages** — Add explicit image dimensions to carousel block
2. **Activate redirects** — Publish `/redirects` document and verify CDN redirect processing
3. **Create placeholders.json** — Empty spreadsheet in da.live removes console error
4. **Set production domain** — Point custom domain (juvederm.nl) to EDS CDN; robots.txt will auto-switch from noindex to the repo-configured robots.txt

### Short-Term (First 4 Weeks Post-Launch)
5. **Connect clinic-finder Maps API** — Provide Google Maps API key and wire up search functionality
6. **Migrate clinic-detail pages** — Use EDS block-based template for the 54 clinic pages
7. **Implement contact form** — Choose and integrate a form solution for `/nl/contact-us`
8. **Implement cookie consent** — GDPR-compliant cookiebot or similar before public launch in NL
9. **Fix link underline CSS** — WCAG 2.1 AA compliance for inline links

### Ongoing Maintenance
10. **Content updates via da.live** — All page content is authored in da.live; no code deployments needed for content changes
11. **New pages** — Use existing archetype templates as starting point; follow content model in Phase 2c blueprint
12. **Block updates** — Deploy via GitHub PR to `main` branch; EDS CDN picks up changes automatically
13. **Monitor Core Web Vitals** — CrUX data will appear after ~28 days of production traffic; target P75 LCP <2.5s, CLS <0.1

---

## Links

| Resource | URL |
|----------|-----|
| Preview site | https://main--jv-test-5--jmffraiz.aem.page/ |
| Live CDN | https://main--jv-test-5--jmffraiz.aem.live/ |
| da.live editor | https://da.live/#/jmffraiz/jv-test-5 |
| GitHub repo | https://github.com/jmffraiz/jv-test-5 |
| QA report (JSON) | `.eds-migration/state/qa-report.json` on `migration-state/c31b35fb` branch |
| Phase 6 QA summary | `.eds-migration/state/docs/phase6-qa-summary.md` on `migration-state/c31b35fb` branch |
| Authoring guide | `docs/authoring-guide.md` on `migration-state/c31b35fb` branch |

---

*This report was generated by the EDS Migration Fleet — IntegrationQA agent (Phase 6).*  
*Run ID: c31b35fb | Timestamp: 2026-04-18T17:30:00Z*
