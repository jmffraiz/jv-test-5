# Phase 1 — Discovery: Juvederm.nl

## Overview
Crawl of https://www.juvederm.nl completed 2026-04-20T10:35:29.087Z.  
Site: Dutch regional site for Juvéderm® dermal fillers (AbbVie/Allergan Aesthetics).  
CMS: Adobe Experience Manager (AEM) with helix-rum-js (EDS/Franklin) integration.

## Pages by Archetype

| Archetype | Count | Sample URL |
|-----------|-------|------------|
| homepage | 2 | https://www.juvederm.nl/nl |
| treatment-page | 5 | https://www.juvederm.nl/nl/treatment/lips |
| faq | 1 | https://www.juvederm.nl/nl/qa |
| clinic-finder | 3 | https://www.juvederm.nl/nl/find-a-clinic |
| legal | 1 | https://www.juvederm.nl/nl/disclaimer |
| contact | 1 | https://www.juvederm.nl/nl/contact-us |
| informational | 1 | https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker |
| **TOTAL** | **14** | |

## Navigation Structure

### Header Navigation (27 links)
- [https://privacy.abbvie/.](https://privacy.abbvie/)
- [Skip to Main Content](https://www.juvederm.nl/nl#maincontent)
- [](https://www.juvederm.nl/nl)
- [](https://www.juvederm.nl/nl)
- [Lippen](https://www.juvederm.nl/nl/treatment/lips)
- [Ogen](https://www.juvederm.nl/nl/treatment/eye-area)
- [Accentueren](https://www.juvederm.nl/nl/treatment/enhance)
- [Herstel](https://www.juvederm.nl/nl/treatment/restore)
- [Man](https://www.juvederm.nl/nl/treatment/male)
- [Over Juvéderm®](https://www.juvederm.nl/nl/qa#about-juvederm)
- [Kosten](https://www.juvederm.nl/nl/qa#duration)
- [Langdurige resultaten](https://www.juvederm.nl/nl/qa#results)
- [Veiligheid](https://www.juvederm.nl/nl/qa#side-effects)
- [Zones van het gezicht](https://www.juvederm.nl/nl/qa#facial-areas)
- [Vind je kliniek](https://www.juvederm.nl/nl/find-a-clinic)
- [](https://www.juvederm.nl/nl)
- [Lippen](https://www.juvederm.nl/nl/treatment/lips)
- [Ogen](https://www.juvederm.nl/nl/treatment/eye-area)
- [Accentueren](https://www.juvederm.nl/nl/treatment/enhance)
- [Herstel](https://www.juvederm.nl/nl/treatment/restore)

### Footer Navigation (21 links)
- [Vind je kliniek](https://www.juvederm.nl/nl/find-a-clinic)
- [Instagram](https://www.instagram.com/juvederm.nl/)
- [Facebook](https://www.facebook.com/juvederm.nl)
- [](https://www.juvederm.nl/nl)
- [](https://www.allerganaesthetics.nl/)
- [Lippen](https://www.juvederm.nl/nl/treatment/lips)
- [Ogen](https://www.juvederm.nl/nl/treatment/eye-area)
- [Accentueren](https://www.juvederm.nl/nl/treatment/enhance)
- [Herstel](https://www.juvederm.nl/nl/treatment/restore)
- [Man](https://www.juvederm.nl/nl/treatment/male)
- [Over Juvéderm®](https://www.juvederm.nl/nl/qa#about-juvederm)
- [Kosten](https://www.juvederm.nl/nl/qa#duration)
- [Langdurige resultaten](https://www.juvederm.nl/nl/qa#results)
- [Veiligheid](https://www.juvederm.nl/nl/qa#side-effects)
- [Zones van het gezicht](https://www.juvederm.nl/nl/qa#facial-areas)
- [Neem contact op](https://www.juvederm.nl/nl/contact-us)
- [Privacy beleid](https://www.abbvie.nl/privacy.html)
- [Algemene voorwaarden](https://www.abbvie.nl/termsofuse.html)
- [Social media disclaimer](https://www.juvederm.nl/nl/disclaimer)
- [Cookies settings](https://www.juvederm.nl/nl#onetrust)
- [Algemene voorwaarden kliniekzoeke](https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker)

## Assets Discovered
- **Favicon**: https://static-p50407-e476655.adobeaemcloud.com/.../favicon.png
- **Fonts (CSS)**: https://use.typekit.net/sic6ayn.css (Typekit), https://fonts.googleapis.com/css?family=Assistant (Google Fonts)
- **Video player**: Plyr.io 3.6.12 (CSS + JS)
- **Analytics**: Google Tag Manager (GTM-TNZCH6P)
- **reCAPTCHA**: Google reCAPTCHA v2
- **Global Images**: AEM DAM assets under /content/dam/juvederm-ous/

## Crawl Issues
- Apex domain juvederm.nl returns 503 (DNS cache overflow); all fetches to www.juvederm.nl
- SSL certificate required ignoreHTTPSErrors: true (custom CA)
- Sitemap provided 13 seed URLs; link traversal added 1 additional page
- Clinic finder generates infinite parameterized URLs (location=CITY, clinic=SF_ID) — filtered; all render same template
- No page capture failures

## Archetype Rationale
- **homepage**: Root /nl — primary entry for Dutch market visitors
- **treatment-page**: /nl/treatment/* — 5 treatment focus areas (lips, eye-area, enhance, restore, male)
- **clinic-finder**: /nl/find-a-clinic, /nl/clinics, /nl/clinic — 3 variants of the clinic locator (map, list, detail)
- **faq**: /nl/qa — single questions & answers page with section anchors
- **contact**: /nl/contact-us — contact form with reCAPTCHA
- **legal**: /nl/disclaimer — legal/disclaimer page
- **informational**: /nl/algemene-voorwaarden-kliniekzoeker — terms for clinic finder; other uncategorized pages

## Source-of-Truth Bundle
Located at: `.eds-migration/state/source-bundle/`

- **13 full-page captures** each with:
  - `index.html` — fully rendered DOM post-JS hydration
  - `desktop.png` — fullPage screenshot at 1440×900
  - `mobile.png` — fullPage screenshot at 390×844 (separate navigation)
  - `meta.json` — URL, title, meta description, archetype, settle strategy
- **Chrome artifacts**: header/footer HTML, link JSON, desktop screenshots
- **1 metadata-only capture**: algemene-voorwaarden-kliniekzoeker (discovered late via link traversal)
