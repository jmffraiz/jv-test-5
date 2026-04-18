# Authoring Guide — Metadata Block

## Page Metadata

Every page should have a **Metadata** table at the bottom of the document. This table defines SEO and social sharing properties for the page.

### How to author

Add a table at the very end of your document with the header row "Metadata":

| Metadata | |
|---|---|
| Title | Jouw lippen, jouw keuze |
| Description | Ontdek de JUVÉDERM® behandelingen voor lippen, gezicht en meer. |
| Image | /media/hero-lips.jpg |

### Supported metadata keys

| Key | Purpose | Example |
|-----|---------|---------|
| Title | Page `<title>` and og:title | Jouw lippen, jouw keuze |
| Description | Meta description and og:description | Ontdek de JUVÉDERM® behandelingen... |
| Image | og:image for social sharing | /media/hero-lips.jpg |
| Template | Page template identifier | treatment-page |
| Theme | Visual theme | dark |
| Robots | Search engine directives | noindex, nofollow |
| og:type | Open Graph type | article |
| twitter:card | Twitter card type | summary_large_image |

### Notes
- The Metadata table is **not visible** on the page — it is configuration only.
- Keys are case-insensitive (Title = title = TITLE).
- For Open Graph tags, prefix with `og:` (e.g., `og:type`).
- For Twitter tags, prefix with `twitter:` (e.g., `twitter:card`).
- Page-level metadata overrides bulk metadata from `metadata.xlsx`.
