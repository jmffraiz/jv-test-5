# Phase 3 — Blocks Summary

## Metadata Block (fix)

**Name:** `metadata`
**Purpose:** Reads the authored Metadata table at the bottom of each page and applies key/value pairs to `<meta>` tags in the document `<head>`. Handles `title`, `description`, `og:*`, `twitter:*`, and arbitrary metadata keys.

**Content Model:**
| Metadata |
|---|---|
| Key (e.g. Title) | Value (e.g. My Page Title) |
| Description | Page description text |
| Image | /path/to/image.jpg |

Each row is a key/value pair. Keys are normalized via `toClassName()` (lowercased, hyphenated).

**Variants:** None — metadata is a configuration block, not visual.

**Behavior:**
- Uses `readBlockConfig()` from `aem.js` to extract key/value pairs
- Maps well-known keys: `title` → `<title>` + `og:title`, `description` → `description` + `og:description`, `image` → `og:image`
- Handles `og-*` and `twitter-*` prefixed keys (converts hyphens to colons)
- Removes its containing section from the DOM since it is configuration, not visible content

**Dependencies:** `readBlockConfig` from `scripts/aem.js` (boilerplate utility)

**CSS:** Empty/minimal — no visual rendering needed.

---

## Existing Blocks (unchanged)

| Block | Source | Notes |
|-------|--------|-------|
| accordion | block-collection | FAQ expand/collapse |
| before-after | custom | Image comparison |
| cards | block-collection | Responsive card grid |
| carousel | block-collection | Sliding content |
| clinic-finder | custom | Google Maps clinic search |
| columns | boilerplate | Multi-column layout |
| footer | boilerplate | Site footer |
| fragment | boilerplate | Content fragment loader |
| header | boilerplate | Site header/nav |
| hero | block-collection | Full-bleed hero with video variant |
| tabs | block-collection | Tabbed content panels |
| topic-menu | custom | Sticky anchor nav for FAQ |
