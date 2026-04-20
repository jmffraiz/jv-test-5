# Authoring Guide — Juvéderm NL (juvederm.nl)

This guide explains how to create and edit content for the Juvéderm NL website using AEM Edge Delivery Services (Document Authoring).

---

## Page Types (Archetypes)

### Homepage
- Template metadata: `homepage`
- Sections: video hero → brand statement → key features (3-col columns) → footnotes → before/after carousel → treatment areas (tabs) → clinic finder CTA → footnotes

### Treatment Page (lips, eye-area, enhance, restore, male)
- Template metadata: `treatment`
- Sections: image hero → media-text intro (columns) → product info (3-col columns) → footnotes → before/after slider → product carousel → optional video embed → FAQ accordion → treatment cards → clinic finder CTA → footnotes

### FAQ Page
- Template metadata: `faq`
- Sections: hero → topic menu → multiple QA sections (columns + accordion) → key takeaways → clinic finder CTA → footnotes

### Clinic Finder Page
- Template metadata: `clinic-finder`
- Sections: hero → full-page clinic finder

### Legal / Contact / Informational Pages
- Template metadata: `legal`, `contact`, or `informational`
- Sections: default content only (headings + paragraphs)

---

## Block Authoring Reference

### Hero

| Hero |
| --- |
| ![Hero image](/images/hero-desktop.jpg) |
| # Jouw unieke schoonheid<br/>Ontdek wat Juvéderm® voor jou kan betekenen<br/>**[Lees meer](/nl/treatment/lips)** |

**Video variant:** Use table header `Hero (video)` and put an MP4 URL in row 1 instead of an image.

### Cards

| Cards | |
| --- | --- |
| ![Lips](/images/lips.jpg) | **Lippen**<br/>Mooie lippen in alle vormen...<br/>[Lees meer](/nl/treatment/lips) |
| ![Eyes](/images/eyes.jpg) | **Ogen**<br/>Verminder donkere kringen...<br/>[Lees meer](/nl/treatment/eye-area) |

Each row = one card. Image in column 1, text content in column 2.

### Carousel

| Carousel | |
| --- | --- |
| ![Slide image](/images/slide1.jpg) | ## Slide Heading<br/>Slide description text<br/>**[CTA](/nl/link)** |
| ![Slide 2](/images/slide2.jpg) | ## Slide 2 Heading<br/>More content here |

Each row = one slide. Navigation dots and arrows are auto-generated.

### Accordion

| Accordion | |
| --- | --- |
| Wat is Juvéderm®? | Juvéderm® is een collectie injecteerbare huidvullers... |
| Hoe lang duurt het resultaat? | Afhankelijk van het product kan het resultaat 12 tot 24 maanden duren. |

Column 1 = question/label, Column 2 = answer (supports paragraphs, lists, links).

### Columns (2-column)

| Columns | |
| --- | --- |
| ![Image](/images/treatment.jpg) | ## Heading<br/>Description text here.<br/>**[CTA](/nl/link)** |

Image on one side, text on the other. Order in document determines left/right layout.

### Columns (3-column)

| Columns (3-col) | | |
| --- | --- | --- |
| **98%**<br/>Natuurlijk resultaat | **95%**<br/>Tevreden patiënten | **12+ maanden**<br/>Langdurig resultaat |

Three equal columns — use for stats, features, or key takeaways.

### Tabs

| Tabs |
| --- |
| Gezicht |
| (Content for face tab: image-map, text, cards...) |
| Producten |
| (Content for products tab) |

First child in each row = tab label, remaining content = tab panel.

### Embed (Video)

Simply paste a Vimeo URL as a standalone link on its own line:

```
https://vimeo.com/875984424
```

This auto-blocks into an embed with a responsive 16:9 player.

### Before/After

| Before-after | |
| --- | --- |
| ![Before](/images/lips-before.jpg) | ![After](/images/lips-after.jpg) |

Each row = one comparison pair. For multiple pairs, add more rows — dot navigation appears automatically. A draggable slider lets visitors compare.

### Clinic Finder

| Clinic-finder (compact) | |
| --- | --- |
| heading | Vind een kliniek bij jou in de buurt |
| placeholder | Vul je locatie in |
| results-url | /nl/find-a-clinic |

Configuration block with key-value rows. Use `compact` variant for inline search bars, omit variant for full-page.

### Topic Menu

| Topic-menu |
| --- |
| - [Over JUVÉDERM®](#about-juvederm)<br/>- [Veiligheid](#side-effects)<br/>- [Verwachtingen](#expectation)<br/>- [Resultaten](#duration)<br/>- [Gezichtszones](#facial-areas) |

Single cell with a bulleted list of anchor links. Becomes sticky navigation below the header.

### Image Map

| Image-map | |
| --- | --- |
| ![Face](/images/face-treatment-areas.jpg) | |
| Lippen | [/nl/treatment/lips](/nl/treatment/lips) |
| Ogen | [/nl/treatment/eye-area](/nl/treatment/eye-area) |
| Accentueren | [/nl/treatment/enhance](/nl/treatment/enhance) |

Row 1 = base image. Rows 2+ = marker label | link. Markers appear as interactive dots on the image.

---

## Section Styles

Add a **Section Metadata** table at the end of a section to apply a style:

| Section Metadata | |
| --- | --- |
| Style | footnotes |

Available styles:
| Style | Effect |
|---|---|
| `light` / `highlight` | Light gray background |
| `dark` | Dark background, white text |
| `centered` | Center-aligned, narrower max-width |
| `brand-statement` | Centered with larger text, purple heading |
| `key-features` | Light gray background, centered |
| `footnotes` | Small text with top border |
| `before-after-section` | Light background for comparison slider |
| `treatment-areas` | Standard padding for treatment content |
| `clinic-finder-section` | Purple-magenta gradient background |
| `qa-section` | QA section with bottom border |
| `key-takeaways` | Purple background, white text |
| `cta-band` | Full-width purple CTA strip |

---

## CTA Button Conventions

- **Primary button:** Make the link text bold → `**[Button Text](url)**`
- **Secondary button:** Make the link text italic → `*[Button Text](url)*`
- **Accent button:** Bold + italic → `***[Button Text](url)***`
- **Plain link:** No formatting → `[Link Text](url)`

---

## Image Guidelines

- **Hero images:** Landscape, minimum 1600×900px. Provide separate mobile crop if needed.
- **Card images:** 4:3 aspect ratio, minimum 750px wide.
- **Before/after images:** Square (1:1), same dimensions for each pair.
- **Image map base:** Portrait or square, 600–700px wide.
- **Format:** Upload as JPG or PNG — EDS automatically serves optimized WebP.
- **Alt text:** Always provide descriptive alt text in Dutch for accessibility.

---

## Metadata

Every page should include a metadata table at the bottom of the document:

| Metadata | |
| --- | --- |
| Template | treatment |
| Title | Lippen behandeling - Juvéderm® |
| Description | Ontdek hoe Juvéderm® je lippen kan verfraaien... |
| Image | /images/lips-hero.jpg |
