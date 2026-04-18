# Phase 1 — Discovery Report

## Site: https://www.juvederm.nl
## Crawled: 2026-04-18

## Summary
- **Sitemap URL**: https://www.juvederm.nl/sitemap.xml (13 URLs)
- **Total pages found**: 13 (sitemap) + 1 (footer link not in sitemap) = 14 unique URLs
- **Migratable pages**: 10 (static content pages)
- **Dynamic pages**: 3 (clinic-finder, clinics listing, clinic detail — require special handling)

## Archetypes Identified

| Archetype | Pages | Priority | Description |
|-----------|-------|----------|-------------|
| homepage | 1 | P1 | Main landing page with hero, features, before/after, tabs |
| treatment | 5 | P1 | Treatment detail pages (lips, eyes, enhance, restore, male) |
| faq | 1 | P1 | Long-form FAQ with topic sections and accordions |
| clinic-finder | 3 | P3 | Interactive/dynamic pages (API-driven) |
| legal | 3 | P2 | Text-heavy legal/info pages (disclaimer, contact, terms) |

## Navigation Structure
- **Header**: Behandeling (5 treatments), FAQ (5 anchored topics), Vind je kliniek (CTA)
- **Footer**: Same treatment + FAQ links, utility links (contact, privacy, terms, disclaimer), social (Instagram, Facebook)
- **Warning banner**: "Kijk uit" medical warning required by Dutch regulations

## Key Findings
1. Small site — 13 pages total, very focused on JUVÉDERM® product line
2. All treatment pages share identical structure (hero → intro → features → before/after → products → FAQ → treatment tabs → clinic finder)
3. Heavy use of Adobe Dynamic Media for images (dm-aid--* URLs)
4. Clinic finder pages are interactive (maps, geolocation) — require custom JS post-migration
5. Root `/` redirects to `/nl` — single-language site (Dutch)
6. `/nl/algemene-voorwaarden-kliniekzoeker` found in footer but NOT in sitemap.xml
7. External links to abbvie.nl for privacy and terms — these stay external
8. All pages share identical footer with medical compliance text and reference number

## Risks & Notes
- Dynamic Media images will need to be downloaded and hosted in EDS
- Clinic finder functionality cannot be replicated with static content alone
- Before/after slider is a common interactive component across all treatment pages
- Product carousel appears on every treatment page with slightly different product sets
- Heavy footnote/reference system throughout (numbered superscripts to bibliography)
