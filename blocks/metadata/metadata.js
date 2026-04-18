import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Sets or updates a meta tag in the document head.
 * @param {string} name The meta name or property
 * @param {string} value The meta content value
 */
function setMetaTag(name, value) {
  if (name === 'title') {
    document.title = value;
    return;
  }
  const attr = name.includes(':') ? 'property' : 'name';
  let meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.append(meta);
  }
  meta.content = value;
}

/**
 * Metadata block — reads the authored metadata table and applies
 * entries to the document head as meta tags.
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
  const config = readBlockConfig(block);

  Object.entries(config).forEach(([key, value]) => {
    if (!value) return;

    if (key === 'title') {
      setMetaTag('title', value);
      setMetaTag('og:title', value);
    } else if (key === 'description') {
      setMetaTag('description', value);
      setMetaTag('og:description', value);
    } else if (key === 'image') {
      setMetaTag('og:image', value);
    } else if (key.startsWith('og-')) {
      setMetaTag(key.replace(/^og-/, 'og:'), value);
    } else if (key.startsWith('twitter-')) {
      setMetaTag(key.replace(/^twitter-/, 'twitter:'), value);
    } else {
      setMetaTag(key, value);
    }
  });

  // Remove the metadata section — it is configuration, not visual content
  const section = block.closest('.section');
  if (section) {
    section.remove();
  }
}
