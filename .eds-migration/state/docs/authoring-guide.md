# Juvéderm NL — Authoring Guide

## Page Types (Archetypes)

### Homepage
Full-bleed video hero → intro text → treatment carousel → benefit cards → accordion → CTA band → footnotes.

### Treatment Page
Hero image → intro paragraph → columns (image + text) → tabs (product range) → cards (journey steps) → accordion → CTA band → footnotes.

### FAQ Page
Hero → topic-menu (sticky nav) → repeated sections: heading + accordion per topic → CTA band → footnotes.

### Clinic Finder
Hero → clinic-finder block (search + map) → footnotes.

### Legal / Contact
Simple default content: heading + paragraphs. No blocks needed.

---

## Block Authoring Reference

### Hero
| Hero |
|---|
| ![background image](/images/hero.jpg) |
| # Your heading here |
| Subtext paragraph |
| **[CTA label](/link)** |

**Video variant** — name the block `Hero (video)`:
| Hero (video) |
|---|
| https://vimeo.com/123456789 |
| # Heading |

### Accordion
| Accordion |
|---|---|
| Question 1 | Answer text with **bold** and lists |
| Question 2 | More answer content |

### Carousel
| Carousel |
|---|---|
| ![slide image](/images/slide1.jpg) | ## Slide Title |
| | Description text |
| | [Link](/path) |

Each row = one slide. Column 1 = image, Column 2 = content.

### Cards
| Cards |
|---|---|
| ![card image](/images/card1.jpg) | ## Card Title |
| | Description |
| | [Read more](/path) |

Each row = one card. For text-only cards, use `Cards (no-images)`.

### Tabs
| Tabs |
|---|---|
| Tab Label 1 | Content for first tab |
| Tab Label 2 | Content for second tab |

### Columns
| Columns |
|---|---|
| ![image](/images/photo.jpg) | ## Heading |
| | Text content |

### Topic Menu
| Topic Menu |
|---|
| - [Topic 1](#section-id-1) |
| - [Topic 2](#section-id-2) |

Create an unordered list of anchor links. Each `#id` must match a section's ID on the page.

### Clinic Finder
| Clinic Finder |
|---|---|
| heading | Vind een kliniek bij jou in de buurt |
| placeholder | Voer je postcode of stad in |
| data-source | /clinic-data.json |

---

## Section Styles

Add section metadata below a section's content:

| Section Metadata |
|---|---|
| style | highlight |

Available styles:
- **highlight** — Light purple background
- **dark** — Dark background with white text
- **centered** — Centered text, narrower max-width
- **cta-band** — Purple background CTA strip
- **qa-section** — FAQ section with bottom border (use with topic-menu anchors)
- **footnotes** — Small text, top border, for regulatory notes

---

## Buttons

- **Primary button**: `**[Label](/link)**` (bold link)
- **Secondary button**: `*[Label](/link)*` (italic link)
- **Accent button**: `***[Label](/link)***` (bold + italic)

---

## Images

- Use descriptive alt text for all images
- Hero images: landscape, min 1600px wide
- Card images: 4:3 aspect ratio recommended
- SVG icons go in `/icons/` folder

## Brand Conventions

- Always write **JUVÉDERM®** with ® on first mention per page
- Use superscript `^1^` for regulatory citation references
- Site language is Dutch (nl-NL)
