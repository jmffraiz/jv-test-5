# Juvederm.nl — Source-of-Truth Bundle

**Crawled at:** 2026-04-19  
**Source site:** https://juvederm.nl (redirects to https://www.juvederm.nl)  
**Agent:** Crawler-693fdd13

---

## Contents

```
source-bundle/
  README.md                     ← this file
  pages/
    homepage/                   ← https://www.juvederm.nl/
    nl/                         ← https://www.juvederm.nl/nl (Dutch homepage)
    nl-treatment-lips/          ← /nl/treatment/lips
    nl-treatment-eye-area/      ← /nl/treatment/eye-area
    nl-treatment-enhance/       ← /nl/treatment/enhance
    nl-treatment-restore/       ← /nl/treatment/restore
    nl-treatment-male/          ← /nl/treatment/male
    nl-qa/                      ← /nl/qa
    nl-find-a-clinic/           ← /nl/find-a-clinic
    nl-clinics/                 ← /nl/clinics
    nl-clinic/                  ← /nl/clinic
    nl-contact-us/              ← /nl/contact-us
    nl-disclaimer/              ← /nl/disclaimer
    nl-algemene-voorwaarden-kliniekzoeker/
    
    Each page folder contains:
      desktop.png   — full-page screenshot at 1440×900
      mobile.png    — full-page screenshot at 390×844
      index.html    — fully rendered DOM (post-JS hydration)
      meta.json     — capture metadata

  chrome/
    header.html           ← <header> outerHTML from homepage
    header.links.json     ← header navigation links (JSON)
    footer.html           ← <footer> outerHTML (NOTE: empty - see below)
    footer.links.json     ← [] empty (no links in AEM footer element)
    header-desktop.png    ← header screenshot at desktop viewport
    footer-desktop.png    ← footer/bottom-of-page screenshot at desktop
```

---

## Capture Strategy

**Browser:** Playwright Chromium (headless)  
**Viewports:**
- Desktop: 1440 × 900 px
- Mobile: 390 × 844 px (iPhone 14 dimensions)

**Settle strategy per page:**
1. Navigate with `waitUntil: 'domcontentloaded'`
2. Wait for `networkidle` (timeout 12s — many pages time out due to Google Maps / analytics)
3. Content-stability loop: sample `main.innerText.length` every 500ms × 4, break when stable and > 50 chars
4. Dismiss OneTrust cookie consent banner via `#onetrust-accept-btn-handler`
5. Additional 800ms settle before screenshot

**Re-navigate for mobile:** Yes — separate browser context per viewport so responsive logic runs fresh.

---

## Site-Specific Quirks

### SSL Certificate Issue
The site has an SSL certificate issue that prevents standard browser HTTPS connections in the headless environment. All captures use `ignoreHTTPSErrors: true`. This does not affect the rendered content — the site itself is valid and loads correctly.

### Apex Domain Redirect
`https://juvederm.nl` → `https://www.juvederm.nl` via HTTP 301.

### OneTrust Cookie Consent
- **Selector:** `#onetrust-accept-btn-handler`
- **Language:** Dutch (button text not relied upon — ID-based selection)
- **Timing:** Banner appears ~1-2s after DOMContentLoaded; dismissed before screenshot

### AEM Backend
The site runs on Adobe AEM (evidenced by `/content/juvederm-ous/` URL patterns, AEM component class names like `aaaem-container`, `cmp-container`, `emu-navigation`). This is relevant because:
- Component structure follows AEM page model
- Footer element (`<footer class="aaaem-card__footer">`) is an AEM container that is **empty** — no links are rendered in it
- Navigation uses AEM EMU navigation component with `juvederm-navigation` class

### Empty Footer
The `<footer>` HTML element on the site contains an empty AEM container div. There are no rendered footer navigation links. Legal/utility links (disclaimer, contact, terms of the clinic finder) are referenced only within page body content.

### Google Maps API
The clinic finder pages (`/nl/find-a-clinic`, `/nl/clinics`, `/nl/clinic`) load Google Maps, causing `networkidle` to never fully resolve. Captured after 12s timeout with content-stability fallback. Screenshots show the maps component in a loading/partial state on some captures.

### Dynamic Clinic Pages
The site generates parameterized URLs (`/nl/clinics?location=...` and `/nl/clinic?location=...&clinic=...`) for individual clinic listings. These are dynamic query-based pages using the same page template as `/nl/clinic`. They were **excluded** from the capture set to avoid thousands of nearly-identical pages. One representative capture of `/nl/clinic` (the template) is included.

### Language Structure
The site uses `/nl/` prefix for Dutch content. The root URL (`/`) redirects to `/nl` which is the Dutch homepage. No other language variants were discovered.

---

## Pages Captured: 14

| Slug | URL | Archetype | Priority |
|------|-----|-----------|----------|
| homepage | / | homepage | high |
| nl | /nl | homepage | high |
| nl-treatment-lips | /nl/treatment/lips | treatment-page | high |
| nl-treatment-eye-area | /nl/treatment/eye-area | treatment-page | high |
| nl-treatment-enhance | /nl/treatment/enhance | treatment-page | high |
| nl-treatment-restore | /nl/treatment/restore | treatment-page | high |
| nl-treatment-male | /nl/treatment/male | treatment-page | high |
| nl-qa | /nl/qa | faq | medium |
| nl-find-a-clinic | /nl/find-a-clinic | clinic-finder | medium |
| nl-clinics | /nl/clinics | clinic-finder | medium |
| nl-clinic | /nl/clinic | clinic-finder | medium |
| nl-contact-us | /nl/contact-us | contact | medium |
| nl-disclaimer | /nl/disclaimer | legal | low |
| nl-algemene-voorwaarden-kliniekzoeker | /nl/algemene-voorwaarden-kliniekzoeker | legal | low |

---

## Partial Captures / Known Issues

- **Clinic finder pages** (`nl-find-a-clinic`, `nl-clinics`, `nl-clinic`): Google Maps API prevents clean `networkidle`. Screenshots may show map in a loading state, but page text/content is fully rendered.
- **Footer:** Empty in AEM template — no footer navigation links exist on this site.
- **SSL bypass:** All captures used `ignoreHTTPSErrors: true` due to an environment-level SSL validation issue.
