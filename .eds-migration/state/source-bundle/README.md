# Juvederm.nl Source-of-Truth Bundle

## Crawl Summary
- **Site**: https://www.juvederm.nl
- **Crawled at**: 2026-04-20T10:34:04.997Z
- **Total pages discovered**: 14
- **Full captures** (HTML + desktop + mobile screenshots): 14
- **Failed**: 0

## Render / Settle Strategy
All pages navigated via Playwright Chromium (headless) with `ignoreHTTPSErrors: true`.

1. `page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })`
2. `dismissOverlays()` — checked 15+ selectors (OneTrust, Cookiebot, Abbvie consent banner, generic modals)
3. Content stability loop: poll `main.innerText` every 500ms, require 2 identical readings (up to 12s)
4. `dismissOverlays()` again (some appear post-hydration)
5. Desktop screenshot at **1440×900**, then re-navigate at **390×844** for mobile screenshot
6. Pressed Escape as fallback for remaining overlays

## Viewports
- Desktop: **1440 × 900**
- Mobile: **390 × 844**

## Site-Specific Quirks
- **juvederm.nl (apex)** returns 503 "DNS cache overflow" — all actual content is at **www.juvederm.nl**
- SSL certificate uses self-signed/custom CA → `ignoreHTTPSErrors: true` required
- Language prefix: all Dutch content under `/nl/` path
- AEM (Adobe Experience Manager) + Helix/EDS hybrid — helix-rum-js script present
- Likely cookie consent banner (OneTrust/Cookiebot); age gate possible (medical aesthetics)
- Social links: instagram.com/juvederm.nl, facebook.com/juvederm.nl

## Archetypes Discovered
- **homepage** (2): https://www.juvederm.nl/nl, https://www.juvederm.nl/
- **treatment-page** (5): https://www.juvederm.nl/nl/treatment/lips, https://www.juvederm.nl/nl/treatment/eye-area
- **faq** (1): https://www.juvederm.nl/nl/qa
- **clinic-finder** (3): https://www.juvederm.nl/nl/find-a-clinic, https://www.juvederm.nl/nl/clinics
- **legal** (1): https://www.juvederm.nl/nl/disclaimer
- **contact** (1): https://www.juvederm.nl/nl/contact-us
- **informational** (1): https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker

## Chrome
- `chrome/header.html` + `header.links.json` — 27 nav links
- `chrome/footer.html` + `footer.links.json` — 21 footer links
- `chrome/header-desktop.png` / `chrome/footer-desktop.png` — cropped screenshots

## Pages Captured (full)
- `pages/nl/` [homepage] https://www.juvederm.nl/nl
- `pages/homepage/` [homepage] https://www.juvederm.nl/
- `pages/nl--treatment--lips/` [treatment-page] https://www.juvederm.nl/nl/treatment/lips
- `pages/nl--treatment--eye-area/` [treatment-page] https://www.juvederm.nl/nl/treatment/eye-area
- `pages/nl--treatment--enhance/` [treatment-page] https://www.juvederm.nl/nl/treatment/enhance
- `pages/nl--treatment--restore/` [treatment-page] https://www.juvederm.nl/nl/treatment/restore
- `pages/nl--treatment--male/` [treatment-page] https://www.juvederm.nl/nl/treatment/male
- `pages/nl--qa/` [faq] https://www.juvederm.nl/nl/qa
- `pages/nl--find-a-clinic/` [clinic-finder] https://www.juvederm.nl/nl/find-a-clinic
- `pages/nl--disclaimer/` [legal] https://www.juvederm.nl/nl/disclaimer
- `pages/nl--contact-us/` [contact] https://www.juvederm.nl/nl/contact-us
- `pages/nl--clinics/` [clinic-finder] https://www.juvederm.nl/nl/clinics
- `pages/nl--clinic/` [clinic-finder] https://www.juvederm.nl/nl/clinic
- `pages/nl--algemene-voorwaarden-kliniekzoeker/` [informational] https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker

## Partial Captures
None — all pages captured successfully.
