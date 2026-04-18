# Phase 5 — Configuration Report

## Site Configuration

### Content (da.live)
| File | Status | Purpose |
|------|--------|---------|
| nav.html | ✅ Uploaded + Previewed | Header navigation |
| footer.html | ✅ Uploaded + Previewed | Footer with links, legal text, social |
| redirects.html | ✅ Uploaded + Previewed | URL redirects (/ → /nl/) |

### Code (GitHub)
| File | Status | Purpose |
|------|--------|---------|
| helix-query.yaml | ✅ Committed | Query index for /nl/** pages |
| helix-sitemap.yaml | ✅ Committed | Sitemap generation for /nl/** |
| robots.txt | ✅ Committed | Allow all crawlers + sitemap reference |
| fstab.yaml | ✅ Already present | Content mount to da.live |

### Navigation Structure
- Behandeling → 5 treatment pages
- FAQ → 5 anchor links to /nl/qa sections
- CTA: Vind je kliniek → /nl/find-a-clinic

### Footer Structure
- Social links (Instagram, Facebook)
- CTA: Vind je kliniek
- Behandeling links (5)
- FAQ links (5)
- Utility links (contact, privacy, terms, disclaimer, clinic finder terms)
- Legal compliance text (AbbVie / NL-JUV-230072)

### Redirects
| Source | Destination |
|--------|-------------|
| / | /nl/ |
| /nl/treatment | /nl/treatment/lips |
