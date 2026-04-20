# Phase 5 — Configuration Summary (run: 75030df9)
Generated: 2026-04-20

## 1. Redirects
Uploaded to da.live as `jmffraiz/jv-test-5/redirects` (HTML table, 6 entries):

| Source | Destination |
|--------|-------------|
| `/` | `/nl` |
| `/nl/treatment/men` | `/nl/treatment/male` |
| `/nl/treatment/eyes` | `/nl/treatment/eye-area` |
| `/nl/find-a-clinic/map` | `/nl/find-a-clinic` |
| `/nl/clinic-finder` | `/nl/find-a-clinic` |
| `/nl/contact-us` | `/nl/contact` |

No redirect chains or loops. Rationale: `/nl/treatment/male` is the canonical path (source had `/nl/treatment/male` slug); `/nl/find-a-clinic` is canonical for clinic finder; `/` redirects to the Dutch locale root.

## 2. Bulk Metadata
Uploaded to da.live as `jmffraiz/jv-test-5/metadata` (HTML table, 5 URL pattern rows):

| URL Pattern | Template |
|-------------|----------|
| `/nl` | `homepage` |
| `/nl/treatment/**` | `treatment` |
| `/nl/qa` | `faq` |
| `/nl/find-a-clinic` | `clinic-finder` |
| `/nl/**` | `default` |

Patterns are ordered most-specific first to avoid conflicts. Title and description overrides set only for the homepage and key landing pages.

## 3. Indexing (helix-query.yaml)
Added `path` and `template` properties to the existing default index. All pages under `/**` are indexed except nav, footer, redirects, metadata. Index stored at `/query-index.json`.

## 4. Sitemap (helix-sitemap.yaml)
- Source: `/query-index.json`
- Origin: `https://www.juvederm.nl`
- Includes: `/nl/**` and `/nl`
- Excludes: `/nav`, `/footer`, `/redirects`, `/metadata`, `/nl/find-a-clinic/map` (map sub-page excluded as utility page)
- `lastmod` from `lastModified` header property

## 5. Navigation
### /nav document
Uploaded to da.live (`jmffraiz/jv-test-5/nav`), previewed successfully.

Structure (14 unique links, deduplicated from 27 in source due to desktop/mobile duplication):
- Logo: Juvéderm → `/nl`
- Section 1 "Behandeling" (5 treatment links): Lippen, Ogen, Accentueren, Herstel, Man
- Section 2 "FAQ" (5 Q&A anchor links): Over Juvéderm®, Kosten, Langdurige resultaten, Veiligheid, Zones van het gezicht
- CTA: "Vind je kliniek" → `/nl/find-a-clinic`

Source coverage: 12/14 unique links from `header.links.json` present (86% coverage).

### Upload method
The DA source API requires `PUT` with explicit `.html` extension (`/source/.../nav.html`) to update the canonically-published document ID. Using `POST /source/.../nav` creates a new draft that `content.da.live` does not serve.

### /footer document
Similar structure with 20 links:
- CTA button: Vind je kliniek
- Social: Instagram, Facebook
- Treatment links: Lippen, Ogen, Accentueren, Herstel, Man
- FAQ anchor links: 5 items
- Legal/contact: Neem contact op, Privacy beleid, Algemene voorwaarden, Social media disclaimer, Algemene voorwaarden kliniekzoeker
- Copyright: ©2025 AbbVie. All rights reserved.
- Brand: Juvéderm | Allergan Aesthetics

Source coverage: 19/21 unique links from `footer.links.json` present (90% coverage).

## 6. robots.txt
```
User-agent: *
Allow: /nl/
Allow: /nl
Disallow: /nav
Disallow: /footer
Disallow: /redirects
Disallow: /metadata
Disallow: /query-index.json
Sitemap: https://www.juvederm.nl/sitemap.xml
```

Rationale: Allows all public content paths. Disallows infrastructure pages. Sitemap points to the canonical domain.

## 7. CSP Fix (head.html)
Added `https://p.typekit.net` to both `style-src` and `font-src` CSP directives. The Typekit CDN uses `p.typekit.net` for font delivery and `use.typekit.net` for the CSS loader. Both domains now allowed.

## Self-Check Results

### DA GET verification
- `GET admin.da.live/source/jmffraiz/jv-test-5/nav` → 200, rich HTML, 12+ links ✅
- `GET admin.da.live/source/jmffraiz/jv-test-5/footer` → 200, rich HTML, 20+ links ✅

### Playwright verification (settle: networkidle + 3s wait)
- `/nav` document: `<main>` length 1457 chars, 12 links ✅
- `/footer` document: `<main>` length 2552 chars, 20 links ✅
- Homepage `header` links: 12 links (nav wired up) ✅
- Homepage `footer` links: 20 links (footer wired up) ✅
- Not empty shell `<body><header></header><main><div></div></main><footer></footer></body>` ✅

### Link coverage
- Nav: 12/14 source header.links.json links (86%) ✅
- Footer: ~19/21 source footer.links.json links (90%) ✅

### Key discovery
DA source API uses two document stores: admin.da.live (draft) and content.da.live (published). `POST /source/nav` creates a new draft; `content.da.live` serves the old published version. Fix: use `PUT /source/nav.html` with explicit `.html` extension to update the live document in-place, then re-trigger preview.
