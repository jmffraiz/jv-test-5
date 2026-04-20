# Phase 3 — Block Development Summary

**Site:** https://www.juvederm.nl  
**Run ID:** 75030df9  
**Target repo:** jmffraiz/jv-test-5 (main branch)

---

## Block Inventory (13 blocks + header/footer)

### 1. hero
- **Purpose:** Full-width banner with background image/video, overlay heading, body text, and optional CTA.
- **Content model:** Row 1 = background media (picture or video URL), Row 2 = overlay content (h1, paragraph, bold link → primary CTA button).
- **Variants:** `default` (image), `video` (auto-playing muted MP4 or Vimeo iframe).
- **CSS:** Full bleed, min-height 320–480px responsive, gradient overlay for text readability, white text.

### 2. cards
- **Purpose:** Grid of treatment area cards with image, title, description, link.
- **Content model:** Collection — each row has col 1 = image, col 2 = content (h3, p, link).
- **Variants:** `default`, `no-images`.
- **CSS:** CSS Grid auto-fill, hover shadow + translateY effect, rounded corners.
- **Source:** Block Collection `cards` pattern.

### 3. carousel
- **Purpose:** Rotating slideshow with prev/next arrows and dot indicators.
- **Content model:** Collection — each row is one slide with image column + content column.
- **Variants:** `default` (1 visible), `products` (multi-item visible on desktop).
- **CSS:** Scroll-snap horizontal slides, accessible dot indicators, arrow nav buttons.
- **Source:** Block Collection `carousel` pattern.

### 4. accordion
- **Purpose:** Expandable Q&A sections with chevron toggle.
- **Content model:** Collection — col 1 = question/label (summary), col 2 = answer/body.
- **Variants:** `default`.
- **CSS:** Uses native `<details>/<summary>`, chevron rotation animation, brand-tinted open state.
- **Source:** Block Collection `accordion` pattern.

### 5. columns
- **Purpose:** Side-by-side content layout.
- **Content model:** Single row with 2 or 3 columns.
- **Variants:** `default` (2-col), `3-col` (3 equal columns).
- **CSS:** Flexbox row on desktop, stacked on mobile, 24px gap.
- **Source:** Block Collection `columns` pattern.

### 6. tabs
- **Purpose:** Tabbed content panels with ARIA roles.
- **Content model:** Each child div = one tab (first child = tab label, remaining = panel content).
- **Variants:** `default`.
- **CSS:** Horizontal tab bar with active bottom-border accent, hidden/shown panels.
- **Source:** Block Collection `tabs` pattern.

### 7. embed
- **Purpose:** Video embed for Vimeo/YouTube URLs.
- **Content model:** Auto-blocked from standalone video URLs, or explicit block with single cell containing a URL.
- **Variants:** `vimeo`, `youtube`, generic fallback.
- **CSS:** 16:9 aspect ratio container, max-width 800px centered.
- **JS:** IntersectionObserver lazy-loading, optional placeholder image with play button.
- **Source:** Block Collection `embed` (adapted).

### 8. before-after
- **Purpose:** Image comparison slider with draggable divider between before/after images.
- **Content model:** Collection — each row has col 1 = before image, col 2 = after image.
- **Variants:** `default` (single pair with drag slider), `carousel` (multiple pairs with dot nav).
- **CSS:** Absolute-positioned overlapping images, clip-path for reveal, 44px circular grip handle.
- **JS:** Pointer events (mouse + touch) for drag, keyboard arrow support, ARIA slider role.
- **Source:** Custom implementation.

### 9. clinic-finder
- **Purpose:** Clinic search widget with location input.
- **Content model:** Configuration block — key-value rows (heading, placeholder, data-source, results-url).
- **Variants:** `compact` (inline search bar), `full-page` (search + map + results list).
- **CSS:** Centered input with search button, split layout for full-page.
- **JS:** Reads config rows, creates search UI, wires up fetch from data-source endpoint.
- **Source:** Custom implementation (placeholder for Google Maps API integration).

### 10. topic-menu
- **Purpose:** Sticky horizontal anchor navigation for FAQ page.
- **Content model:** Single cell with unordered list of anchor links.
- **Variants:** `default`.
- **CSS:** `position: sticky` below header, horizontal scrollable links, active underline state.
- **JS:** IntersectionObserver scroll-spy, smooth-scroll on click.
- **Source:** Custom implementation.

### 11. image-map
- **Purpose:** Interactive base image with positioned markers linking to treatment areas.
- **Content model:** Row 1 = base image, Row 2+ = marker label | link URL.
- **Variants:** `default`.
- **CSS:** Relative container with absolute markers, pulsing dot animation, tooltip on hover.
- **JS:** Percentage-based positioning from predefined coordinate map, fallback circular distribution.
- **Source:** Custom implementation.

### 12. header (nav)
- **Purpose:** Fixed site header with logo, nav groups with dropdowns, CTA button, mobile hamburger.
- **Content model:** Standard EDS nav fragment (fetched from /nav).
- **CSS:** Fixed on mobile, relative on desktop, grid layout, animated hamburger icon.

### 13. footer
- **Purpose:** Dark footer with social links, site links, legal links, copyright.
- **Content model:** Standard EDS footer fragment (fetched from /footer).
- **CSS:** Dark background, inline link lists, icon filters.

---

## Global Styles (styles.css)

### Design Tokens
| Token | Value |
|---|---|
| `--brand-primary` | `#4b2552` (Juvéderm purple-dark) |
| `--brand-primary-dark` | `#461a4e` (purple-medium) |
| `--brand-secondary` | `#a2258c` (magenta) |
| `--brand-accent` | `#a2258c` (magenta) |
| `--brand-primary-light` | `#f3ebfa` (light purple tint) |
| `--brand-purple-light` | `#ab7fb6` |
| `--brand-orange-peach` | `#fab073` |
| `--text-color` | `#4b4b4b` |
| `--background-color` | `#fff` |
| `--light-color` | `#f8f8f8` |

### Typography
- **Primary font:** `proxima-nova` (Adobe Typekit, kit: sic6ayn)
- **Secondary font:** `Assistant` (Google Fonts)
- **Fallback:** system `sans-serif` with `proxima-nova-fallback` for CLS prevention
- **Heading scale:** Fluid `clamp()` values from 1rem to 3.5rem

### Buttons
- **Primary:** Gradient from `--brand-secondary` to `--brand-primary`, white text, rounded pill shape
- **Secondary:** Outline with brand-primary border
- **Accent:** Solid magenta background

### Section Styles
15 section styles defined: `brand-statement`, `key-features`, `footnotes`, `before-after-section`, `treatment-areas`, `clinic-finder-section`, `media-text`, `product-info`, `product-showcase`, `faq-section`, `topic-menu-section`, `qa-section`, `key-takeaways`, `legal-content`, `contact-content`.

### Responsive Breakpoints
- Mobile: 0px (default)
- Tablet: 600px
- Desktop: 900px
- Wide: 1200px (max-width container)

---

## Scripts

### scripts.js
Standard EDS loading sequence:
- `loadEager` → decorateMain, build auto-blocks (hero, fragments), show body
- `loadLazy` → header, sections, footer, lazy-styles, fonts
- `loadDelayed` → delayed.js after 3s

Custom:
- `buildHeroBlock()` auto-builds hero from leading picture + h1
- `decorateButtons()` with bold → primary, em → secondary, bold+em → accent pattern
- `document.documentElement.lang = 'nl'` for Dutch locale

### delayed.js
Stubs for third-party integrations (not active until go-live):
- **OneTrust** cookie consent (requires `window.aem.oneTrustId`)
- **Google Tag Manager** (requires `window.aem.gtmId`)
- **Facebook Pixel** (requires `window.aem.fbPixelId`)

### placeholders.js
Fetches localized strings from `/placeholders.json` for carousel ARIA labels etc.

---

## head.html
- CSP meta tag with script-src nonce, style-src for Typekit/Google Fonts, font-src for Typekit/Gstatic
- Viewport meta
- aem.js + scripts.js (module type)
- styles.css (eager)
- Adobe Typekit CSS (`https://use.typekit.net/sic6ayn.css`) for Proxima Nova
- Google Fonts preconnect + CSS for Assistant
- Favicon

---

## Dependencies from Block Collection
| Block | Source |
|---|---|
| cards | Block Collection (standard pattern) |
| carousel | Block Collection (standard pattern) |
| accordion | Block Collection (standard pattern) |
| columns | Block Collection (standard pattern) |
| tabs | Block Collection (standard pattern) |
| embed | Block Collection ([embed block](https://github.com/adobe/aem-block-collection/tree/main/blocks/embed)) |
| header | Boilerplate |
| footer | Boilerplate |
| fragment | Boilerplate |

---

## fstab.yaml
```yaml
mountpoints:
  /: https://content.da.live/jmffraiz/jv-test-5
```
