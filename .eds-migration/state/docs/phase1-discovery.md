# Phase 1 – Discovery & Crawl Report
**Site:** https://www.juvederm.nl  
**Crawled:** 2026-04-18  
**Crawler:** Playwright (Chromium headless, ignoreHTTPSErrors)

---

## Summary

Juvéderm NL is a single-language (Dutch) pharmaceutical/beauty brand site promoting injectable facial fillers by AbbVie. The site is served on `www.juvederm.nl` (bare domain `juvederm.nl` redirects via HTTP 301). It runs on Adobe Experience Manager (AEM) as a Cloud Service and is already an AEM-based site.

---

## Pages Found — By Archetype

| Archetype | Count | Notes |
|---|---|---|
| homepage | 1 | `/` — age-gate entry point, redirects to `/nl` |
| locale-root | 1 | `/nl` — Dutch locale landing page |
| treatment-page | 5 | `/nl/treatment/{lips,eye-area,enhance,restore,male}` |
| faq | 1 | `/nl/qa` — Q&A with anchor-based sections |
| clinic-finder | 3 | `/nl/find-a-clinic`, `/nl/clinics`, `/nl/clinic` |
| contact | 1 | `/nl/contact-us` |
| legal | 2 | `/nl/disclaimer`, `/nl/algemene-voorwaarden-kliniekzoeker` |
| **clinic-detail** | **54+** | Dynamic pages: `/content/juvederm-ous/nl/nl/clinic.html?location=…&clinic=…` |
| **Total canonical** | **14** | Excluding dynamic parametrized variants |

> The 54 clinic-detail pages discovered represent a sample from a single city (Amsterdam area). The full dataset will include all registered clinics Netherlands-wide.

---

## Navigation Structure

### Header Navigation
Primary nav (rendered via JavaScript, captured by Playwright):
- **Behandelingen (Treatments):** Lippen, Ogen, Accentueren, Herstel, Man
- **Vragen (FAQ sub-links):** Over Juvéderm®, Kosten, Langdurige resultaten, Veiligheid, Zones van het gezicht
- **CTA:** Vind je kliniek → `/nl/find-a-clinic`
- **Utility:** Neem contact op → `/nl/contact-us`
- **Legal (footer-like in header):** Privacy beleid (abbvie.nl), Algemene voorwaarden (abbvie.nl), Social media disclaimer, Algemene voorwaarden kliniekzoeker

### Footer Navigation
Mirrors header nav with additions:
- Clinic finder CTA
- All treatment links
- FAQ anchor links
- Contact
- Privacy, Terms (external abbvie.nl links)
- Cookie settings (`#onetrust` — OneTrust consent modal trigger)
- Disclaimer & clinic T&Cs

---

## Site Assets Discovered

| Asset | Value |
|---|---|
| Favicon | `https://www.juvederm.nl/content/dam/juvederm-ous/favicon.ico` |
| Primary Font | Google Fonts: `Assistant` |
| Secondary Fonts | Google Fonts: `Roboto`, `Google Sans`, `Google Sans Text` |
| Video Player | Plyr.io CDN (`cdn.plyr.io`) + Vimeo (`player.vimeo.com`) |

---

## Third-Party Integrations

| Integration | Purpose |
|---|---|
| `www.googletagmanager.com` | Tag management |
| `www.google-analytics.com` | Analytics |
| `maps.googleapis.com` | Google Maps (clinic finder) |
| `connect.facebook.net` | Facebook Pixel |
| `14175604.fls.doubleclick.net` / `9846055.fls.doubleclick.net` | DoubleClick ad tracking |
| `cdn.cookielaw.org` | OneTrust cookie consent |
| `player.vimeo.com` | Vimeo video embeds |
| `cdn.plyr.io` | Plyr video player |
| `static-p50407-e476655.adobeaemcloud.com` | AEM Cloud static assets |
| `www.gstatic.com` | Google static resources |

---

## Locale / Language Variants

- **Single language:** Dutch only (`lang="nl"`), URL prefix `/nl/`
- No `hreflang` alternate links detected
- No `/en/` or other locale paths found
- The root `/` and `/nl` both serve identical Dutch content (homepage)

---

## Archetype Rationale

| Archetype | Rationale |
|---|---|
| **homepage** | Entry point (`/`), age-gate, brand intro |
| **locale-root** | `/nl` — mirrors homepage for Dutch locale routing |
| **treatment-page** | Each page dedicated to a specific facial treatment area/use case; consistent template with hero, before/after, product callout |
| **faq** | Single long-form Q&A page with anchor-linked sections; unique template with accordion/tabs |
| **clinic-finder** | Interactive map/search UI; `/find-a-clinic` is the entry, `/clinics` shows filtered list, `/clinic` is the detail shell |
| **clinic-detail** | Dynamic individual clinic profiles loaded via JS with location + CRM ID params; not statically crawlable pages |
| **contact** | Simple contact form/info page |
| **legal** | Static text pages: social media disclaimer and clinic finder T&Cs |

---

## Crawl Issues & Notes

1. **SSL certificate**: Playwright required `ignoreHTTPSErrors: true` — the site uses a BigIP/F5 load balancer that presented a certificate error in the headless browser environment. Curl confirmed the certificate is valid in normal browsers.

2. **JavaScript-rendered content**: The site is heavily JS-driven (AEM SPA). Playwright with `waitUntil: domcontentloaded` + 2s wait was used. Navigation links and page titles were successfully extracted.

3. **Dynamic clinic pages**: The clinic finder generates hundreds of individual clinic detail URLs via JavaScript with `clinic=` and `location=` query params. These are not in the sitemap and are not suitable for static migration without a data export from the CRM.

4. **Internal AEM paths**: URLs like `/content/juvederm-ous/nl/nl/clinic.html` are internal AEM content paths exposed via the clinic finder widget. These mirror the `/nl/clinic` page template and should not be treated as separate pages.

5. **Sitemap coverage**: The sitemap at `https://www.juvederm.nl/sitemap.xml` listed 13 URLs — all canonical pages except `/nl/algemene-voorwaarden-kliniekzoeker` (which was discovered via link crawl). The sitemap was complete for static content.

6. **Forms detected**: Most pages include a hidden age-verification form. The clinic finder uses an embedded map/search widget backed by Google Maps API.
