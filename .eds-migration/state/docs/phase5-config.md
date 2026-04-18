# Phase 5 — Site Configuration

Generated: 2026-04-18  
Site: juvederm.nl → jmffraiz/jv-test-5 (EDS)

---

## Redirects

**Total count: 4**  
Uploaded to da.live as `/redirects` (HTML table, Status: 201).

| Source | Destination | Rationale |
|--------|-------------|-----------|
| `/nl` | `/` | Locale root → homepage (decision D1: redirect /nl to /) |
| `/nl/clinics` | `/nl/find-a-clinic` | Old clinic-finder path (D6) |
| `/nl/clinic` | `/nl/find-a-clinic` | Old clinic-finder singular path (D6) |
| `/nl/contacteer-ons` | `/nl/contact-us` | Old Dutch contact URL variant found during crawl |

No redirect loops or chains. All migrated pages retain their original paths (EDS paths match source paths for content pages); only structural redirects needed.

---

## Bulk Metadata

**Pattern: `/**` (all pages)**  
Uploaded to da.live as `/metadata` (HTML table, Status: 201).

| Property | Value |
|----------|-------|
| `og:site_name` | JUVÉDERM® Nederland |
| `og:locale` | nl_NL |
| `og:type` | website |
| `twitter:card` | summary_large_image |
| `robots` | index, follow |

Single wildcard pattern covers all content pages. No overlapping globs. Individual page metadata (title, description, og:image) is set per-page during content migration (Phase 4).

---

## Indexing (helix-query.yaml)

Pushed to `main` branch.

**Index: `default`**  
- **Include:** `/**` — covers homepage (`/`) and all `/nl/**` paths  
- **Exclude:** `/nav`, `/footer`, `/redirects`, `/metadata` — infrastructure documents excluded from query index  
- **Target:** `/query-index.json`  
- **Properties indexed:** `title` (og:title), `description` (meta description), `image` (og:image), `lastModified` (from Last-Modified header)

Rationale: Broad include ensures all migrated content pages (treatments, FAQ, clinic finder, contact, legal) appear in the query index for use by search, filtering, and sitemap generation.

---

## Sitemap (helix-sitemap.yaml)

Pushed to `main` branch.

**Sitemap: `default`**  
- **Source:** `/query-index.json`  
- **Origin:** `https://www.juvederm.nl` (canonical production domain)  
- **Lastmod:** `lastModified` field from query index  
- **Include:** `/nl/**` and `/` — covers all 14 migrated pages  
- **Exclude:** `/nav`, `/footer`, `/redirects`, `/metadata`  
- **Output:** `https://www.juvederm.nl/sitemap.xml`

Coverage: All 14 migrated pages are included:
- `/` (homepage)
- `/nl/index` (locale root, but redirects to `/`)
- `/nl/treatment/lips`, `/eye-area`, `/enhance`, `/restore`, `/male`
- `/nl/qa`
- `/nl/find-a-clinic`
- `/nl/contact-us`
- `/nl/disclaimer`
- `/nl/algemene-voorwaarden-kliniekzoeker`
- `/nl/clinics` and `/nl/clinic` (redirect targets in sitemap)

---

## Navigation

**Nav document uploaded to da.live `/nav` (Status: 201). Preview: 200.**

### Header structure:
- **Brand:** JUVÉDERM® → links to `/`
- **Main nav:**
  - Behandelingen (dropdown)
    - Lippen → `/nl/treatment/lips`
    - Ooggebied → `/nl/treatment/eye-area`
    - Verfraaien → `/nl/treatment/enhance`
    - Herstellen → `/nl/treatment/restore`
    - Mannelijk → `/nl/treatment/male`
  - Vragen → `/nl/qa`
  - Vind je kliniek → `/nl/find-a-clinic`
  - Neem contact op → `/nl/contact-us`

**Footer document uploaded to da.live `/footer` (Status: 201). Preview: 200.**

### Footer structure:
- **Brand section:** JUVÉDERM® + Allergan/AbbVie attribution + © 2024
- **Content links:** Vind je kliniek, treatment pages, Veelgestelde vragen, contact
- **Legal links:** Disclaimer, Algemene voorwaarden (abbvie.nl), Privacy beleid (abbvie.nl), Algemene voorwaarden kliniekzoeker
- **Regulatory:** NL-JUV-230001 compliance code

---

## robots.txt

Pushed to `main` branch.

```
User-agent: *
Allow: /

Sitemap: https://www.juvederm.nl/sitemap.xml
```

**Rationale:**  
- All migrated paths are allowed (no blocking of `/nl/**` or `/`)  
- Sitemap URL points to production canonical domain (`www.juvederm.nl`)  
- No disallow rules needed — all migrated content is public-facing and indexable  
- Infrastructure paths (`/nav`, `/footer`) are not explicitly blocked as EDS CDN handles them appropriately

---

## Upload Summary

| Artifact | Method | Status |
|----------|--------|--------|
| `helix-query.yaml` | git push → main | ✅ committed |
| `helix-sitemap.yaml` | git push → main | ✅ committed |
| `robots.txt` | git push → main | ✅ committed |
| `/redirects` | da.live Source API | ✅ 201 |
| `/metadata` | da.live Source API | ✅ 201 |
| `/nav` | da.live Source API | ✅ 201 |
| `/footer` | da.live Source API | ✅ 201 |
| Preview: `/nav` | admin.hlx.page | ✅ 200 |
| Preview: `/footer` | admin.hlx.page | ✅ 200 |
| Preview: `/redirects` | admin.hlx.page | ✅ 200 |
| Preview: `/metadata` | admin.hlx.page | ⚠️ 404 (expected — metadata is consumed as spreadsheet, not rendered page) |
