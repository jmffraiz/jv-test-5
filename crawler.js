/**
 * Juvederm.nl Crawler — Phase 1 Discovery
 * Uses Playwright with full browser rendering, overlay dismissal,
 * and content-stability settling.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.juvederm.nl';
const OUT_DIR = '/home/claude/migration-workspace/.eds-migration/state';
const BUNDLE_DIR = path.join(OUT_DIR, 'source-bundle');

// Ensure dirs
[OUT_DIR, BUNDLE_DIR, path.join(BUNDLE_DIR, 'pages'), path.join(BUNDLE_DIR, 'chrome'), path.join(OUT_DIR, 'docs')]
  .forEach(d => fs.mkdirSync(d, { recursive: true }));

function slugify(url) {
  try {
    const u = new URL(url);
    let p = u.pathname.replace(/^\/|\/$/g, '') || 'homepage';
    p = p.replace(/\//g, '--').replace(/[^a-zA-Z0-9\-_]/g, '-');
    return p.substring(0, 80) || 'homepage';
  } catch { return 'unknown'; }
}

function isInternal(url) {
  try {
    const u = new URL(url);
    return u.hostname === 'juvederm.nl' || u.hostname === 'www.juvederm.nl';
  } catch { return false; }
}

function normalizeUrl(url) {
  try {
    const u = new URL(url, BASE_URL);
    u.hash = '';
    if (!u.hostname.includes('juvederm')) return null;
    if (u.hostname === 'juvederm.nl') u.hostname = 'www.juvederm.nl';
    let h = u.href;
    if (h.endsWith('/') && h !== BASE_URL + '/') h = h.slice(0, -1);
    return h;
  } catch { return null; }
}

function shouldSkipUrl(url) {
  // Skip parameterized clinic detail URLs (they're all same template)
  if (url.includes('/clinic.html?') || url.includes('/clinics.html?')) return true;
  if (url.includes('/clinics?location=')) return true;
  // Skip /content/ AEM internal paths (same content, different URL pattern)
  if (url.includes('/content/juvederm-ous/')) return true;
  // Skip asset URLs
  if (url.match(/\.(jpg|jpeg|png|gif|pdf|svg|ico|css|js|woff|woff2|ttf|webp)(\?|$)/i)) return true;
  return false;
}

function archetypeFor(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p === '/' || p === '/nl' || p === '/nl/' || p === '') return 'homepage';
    if (p.includes('/treatment/')) return 'treatment-page';
    if (p.includes('/find-a-clinic') || p.includes('/clinics') || p.match(/\/clinic$/)) return 'clinic-finder';
    if (p.includes('/qa') || p.includes('/faq')) return 'faq';
    if (p.includes('/contact')) return 'contact';
    if (p.includes('/disclaimer') || p.includes('/privacy') || p.includes('/cookie')) return 'legal';
    if (p.includes('/product')) return 'product-detail';
    if (p.includes('/blog') || p.includes('/artikel') || p.includes('/news')) return 'blog-post';
    return 'informational';
  } catch { return 'informational'; }
}

async function waitForStability(page, timeout = 12000) {
  const start = Date.now();
  let prev = '';
  let stable = 0;
  while (Date.now() - start < timeout) {
    await page.waitForTimeout(500);
    let cur = '';
    try {
      cur = await page.evaluate(() => {
        const m = document.querySelector('main') || document.body;
        return m ? m.innerText.substring(0, 3000) : '';
      });
    } catch {}
    if (cur && cur === prev) {
      stable++;
      if (stable >= 2) return true;
    } else { stable = 0; }
    prev = cur;
  }
  return false;
}

async function dismissOverlays(page) {
  const selectors = [
    '#onetrust-accept-btn-handler',
    '.onetrust-accept-btn-handler',
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    'button[id*="accept"]',
    'button[class*="cookie-accept"]',
    '.js-cookie-accept',
    '[data-testid="cookie-accept"]',
    // Age gate / privacy gate
    'button[class*="age"]',
    '.age-gate button',
    // Generic modals
    'button[aria-label="Close"]',
    'button[aria-label="Sluiten"]',
    '.modal__close',
    '.popup-close',
    // Abbvie/Allergan specific
    '.privacy-gate .btn',
    '.aaaem-consent-banner button',
    '#consent-banner button[class*="accept"]',
    // Privacy overlay accept
    'button.aaaem-button--primary',
  ];

  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 800 })) {
        await btn.click({ timeout: 1500 });
        await page.waitForTimeout(600);
        console.log(`  → Dismissed: ${sel}`);
      }
    } catch {}
  }
  try { await page.keyboard.press('Escape'); } catch {}
}

async function capturePage(context, url, priority = 'medium', fullCapture = true) {
  const slug = slugify(url);
  const pageDir = path.join(BUNDLE_DIR, 'pages', slug);
  if (fullCapture) fs.mkdirSync(pageDir, { recursive: true });

  const result = {
    url, slug, title: '', metaDescription: '',
    archetype: archetypeFor(url), depth: 0, priority,
    status: 0, links: [], capturedAt: new Date().toISOString(),
    settleStrategy: '', error: null,
  };

  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 1440, height: 900 });

    let resp;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        break;
      } catch (e) {
        if (attempt === 2) throw e;
        await page.waitForTimeout(2000);
      }
    }
    result.status = resp ? resp.status() : 0;

    await dismissOverlays(page);
    const stable = await waitForStability(page, 12000);
    result.settleStrategy = `networkidle + main.textLength stable 500ms x2${stable ? '' : ' (timeout)'}; dismissed overlays`;
    await dismissOverlays(page);

    result.title = await page.title();
    result.metaDescription = await page.evaluate(() => {
      const m = document.querySelector('meta[name="description"]');
      return m ? m.getAttribute('content') || '' : '';
    });

    // Extract all internal links
    const hrefs = await page.evaluate((base) => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(h => h && !h.startsWith('javascript') && !h.startsWith('mailto') && !h.startsWith('tel'));
    }, BASE_URL);
    result.links = [...new Set(hrefs.map(h => normalizeUrl(h)).filter(Boolean).filter(isInternal))];

    if (fullCapture) {
      const html = await page.content();
      fs.writeFileSync(path.join(pageDir, 'index.html'), html);
      await page.screenshot({ path: path.join(pageDir, 'desktop.png'), fullPage: true });

      // Mobile
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await dismissOverlays(page);
      await waitForStability(page, 8000);
      await dismissOverlays(page);
      await page.screenshot({ path: path.join(pageDir, 'mobile.png'), fullPage: true });

      fs.writeFileSync(path.join(pageDir, 'meta.json'), JSON.stringify({
        url, title: result.title, metaDescription: result.metaDescription,
        archetype: result.archetype, viewport_sizes: ['1440x900', '390x844'],
        settle_strategy: result.settleStrategy, captured_at: result.capturedAt,
        http_status: result.status,
      }, null, 2));

      console.log(`  ✓ ${slug} [${result.archetype}] status=${result.status} links=${result.links.length}`);
    } else {
      console.log(`  ✓ [meta] ${url} "${result.title}" [${result.archetype}]`);
    }
  } catch (e) {
    result.error = e.message.substring(0, 200);
    console.log(`  ✗ ${url}: ${result.error}`);
  } finally {
    await page.close();
  }
  return result;
}

async function captureChrome(context) {
  const chromeDir = path.join(BUNDLE_DIR, 'chrome');
  fs.mkdirSync(chromeDir, { recursive: true });

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  try {
    await page.goto(`${BASE_URL}/nl`, { waitUntil: 'networkidle', timeout: 30000 });
    await dismissOverlays(page);
    await waitForStability(page, 10000);
    await dismissOverlays(page);

    // Scroll to top to ensure header visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Header
    const headerData = await page.evaluate(() => {
      const header = document.querySelector('header') ||
        document.querySelector('[class*="header"]') ||
        document.querySelector('nav');
      if (!header) return { html: '', links: [] };
      return {
        html: header.outerHTML,
        links: Array.from(header.querySelectorAll('a[href]')).map(a => ({
          text: (a.innerText || a.textContent || '').trim(),
          href: a.href,
        })).filter(l => l.text || l.href),
      };
    });
    fs.writeFileSync(path.join(chromeDir, 'header.html'), headerData.html);
    fs.writeFileSync(path.join(chromeDir, 'header.links.json'), JSON.stringify(headerData.links, null, 2));

    // Header screenshot
    const headerBox = await page.evaluate(() => {
      const h = document.querySelector('header') || document.querySelector('[class*="header"]');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
    });
    if (headerBox && headerBox.width > 10 && headerBox.height > 10) {
      await page.screenshot({
        path: path.join(chromeDir, 'header-desktop.png'),
        clip: { ...headerBox, height: Math.min(headerBox.height, 300) },
      });
    } else {
      // Full viewport screenshot
      await page.screenshot({ path: path.join(chromeDir, 'header-desktop.png'), clip: { x: 0, y: 0, width: 1440, height: 150 } });
    }

    // Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    const footerData = await page.evaluate(() => {
      const footer = document.querySelector('footer') || document.querySelector('[class*="footer"]');
      if (!footer) return { html: '', links: [] };
      return {
        html: footer.outerHTML,
        links: Array.from(footer.querySelectorAll('a[href]')).map(a => ({
          text: (a.innerText || a.textContent || '').trim(),
          href: a.href,
        })).filter(l => l.text || l.href),
      };
    });
    fs.writeFileSync(path.join(chromeDir, 'footer.html'), footerData.html);
    fs.writeFileSync(path.join(chromeDir, 'footer.links.json'), JSON.stringify(footerData.links, null, 2));

    const footerBox = await page.evaluate(() => {
      const f = document.querySelector('footer') || document.querySelector('[class*="footer"]');
      if (!f) return null;
      const r = f.getBoundingClientRect();
      return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
    });
    if (footerBox && footerBox.width > 10 && footerBox.height > 10) {
      await page.screenshot({
        path: path.join(chromeDir, 'footer-desktop.png'),
        clip: { ...footerBox, height: Math.min(footerBox.height, 600) },
      });
    } else {
      await page.screenshot({ path: path.join(chromeDir, 'footer-desktop.png'), fullPage: false });
    }

    console.log(`Chrome: ${headerData.links.length} header links, ${footerData.links.length} footer links`);
    return { header: headerData, footer: footerData };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('=== Juvederm.nl Crawler ===');
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  try {
    // Sitemap
    let sitemapUrls = [];
    {
      const p = await context.newPage();
      try {
        const r = await p.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        if (r && r.ok()) {
          const txt = await p.content();
          const matches = [...txt.matchAll(/<loc>(.*?)<\/loc>/gi)];
          sitemapUrls = [...new Set(matches.map(m => normalizeUrl(m[1].trim())).filter(Boolean))];
          console.log(`Sitemap: ${sitemapUrls.length} URLs`);
        }
      } catch (e) { console.log('Sitemap error:', e.message); }
      await p.close();
    }

    const visited = new Set();
    const queue = [];
    const allPages = [];

    // Seed queue
    const homepage = normalizeUrl(`${BASE_URL}/nl`);
    queue.push(homepage);
    sitemapUrls.filter(u => !shouldSkipUrl(u)).forEach(u => queue.push(u));
    // Remove duplicates
    const uniqueQueue = [...new Set(queue)];

    // Determine which pages get full capture
    // All sitemap pages + homepage get full capture (they're priority high)
    const fullCaptureSet = new Set(uniqueQueue);

    // Process all pages
    while (uniqueQueue.length > 0 || allPages.length < 1) {
      const url = uniqueQueue.shift();
      if (!url || visited.has(url) || shouldSkipUrl(url)) continue;
      visited.add(url);

      const isFull = fullCaptureSet.has(url);
      const priority = (url === homepage || url === BASE_URL) ? 'high' :
        (isFull ? 'high' : 'medium');

      console.log(`\n[${allPages.length + 1}/${uniqueQueue.length + allPages.length + 1}] ${url}`);
      const result = await capturePage(context, url, priority, isFull);
      allPages.push(result);

      // Add new internal links to queue (don't pre-mark visited; let the while loop handle dedup)
      result.links.forEach(l => {
        if (!visited.has(l) && !uniqueQueue.includes(l) && !shouldSkipUrl(l)) {
          uniqueQueue.push(l);
        }
      });
    }

    console.log(`\n=== Crawl done: ${allPages.length} pages ===\n`);

    // Chrome capture
    console.log('--- Chrome capture ---');
    const chrome = await captureChrome(context);

    // Archetypes
    const archetypeMap = {};
    allPages.forEach(p => {
      if (!archetypeMap[p.archetype]) archetypeMap[p.archetype] = [];
      archetypeMap[p.archetype].push(p.url);
    });
    const archetypes = Object.entries(archetypeMap).map(([name, urls]) => ({
      name, count: urls.length, sampleUrls: urls.slice(0, 3),
    }));

    // Assets from homepage HTML
    let assets = { favicon: '', fonts: [], globalImages: [] };
    const hpSlug = slugify(homepage);
    const hpHtml = path.join(BUNDLE_DIR, 'pages', hpSlug, 'index.html');
    if (fs.existsSync(hpHtml)) {
      const html = fs.readFileSync(hpHtml, 'utf8');
      const faviconM = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i)
        || html.match(/href=["']([^"']+favicon[^"']+)["']/i);
      if (faviconM) assets.favicon = faviconM[1];
      const fontMatches = [...html.matchAll(/https?:\/\/[^\s"'<>]*\.(woff2?|ttf|otf)([?#][^\s"'<>]*)?/gi)];
      assets.fonts = [...new Set(fontMatches.map(m => m[0]))].slice(0, 10);
      // Typekit/Google fonts
      const fontCSSMatches = [...html.matchAll(/(https?:\/\/(?:use\.typekit\.net|fonts\.googleapis\.com)[^\s"'<>]*)/gi)];
      fontCSSMatches.forEach(m => assets.fonts.push(m[1]));
      assets.fonts = [...new Set(assets.fonts)];
    }

    // Manifest
    const manifest = {
      site: BASE_URL,
      crawledAt: new Date().toISOString(),
      pages: allPages.map(p => ({
        url: p.url, title: p.title, metaDescription: p.metaDescription,
        archetype: p.archetype, depth: p.depth, priority: p.priority,
        slug: p.slug, httpStatus: p.status, error: p.error || null,
      })),
      archetypes,
      navigation: { header: chrome.header.links, footer: chrome.footer.links },
      assets,
    };
    fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('✓ manifest.json');

    // README
    const fullCaptures = allPages.filter(p => p.settleStrategy && !p.settleStrategy.includes('domcontentloaded'));
    const failed = allPages.filter(p => p.error);

    fs.writeFileSync(path.join(BUNDLE_DIR, 'README.md'), `# Juvederm.nl Source-of-Truth Bundle

## Crawl Summary
- **Site**: ${BASE_URL}
- **Crawled at**: ${manifest.crawledAt}
- **Total pages discovered**: ${allPages.length}
- **Full captures** (HTML + desktop + mobile screenshots): ${fullCaptures.length}
- **Failed**: ${failed.length}

## Render / Settle Strategy
All pages navigated via Playwright Chromium (headless) with \`ignoreHTTPSErrors: true\`.

1. \`page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })\`
2. \`dismissOverlays()\` — checked 15+ selectors (OneTrust, Cookiebot, Abbvie consent banner, generic modals)
3. Content stability loop: poll \`main.innerText\` every 500ms, require 2 identical readings (up to 12s)
4. \`dismissOverlays()\` again (some appear post-hydration)
5. Desktop screenshot at **1440×900**, then re-navigate at **390×844** for mobile screenshot
6. Pressed Escape as fallback for remaining overlays

## Viewports
- Desktop: **1440 × 900**
- Mobile: **390 × 844**

## Site-Specific Quirks
- **juvederm.nl (apex)** returns 503 "DNS cache overflow" — all actual content is at **www.juvederm.nl**
- SSL certificate uses self-signed/custom CA → \`ignoreHTTPSErrors: true\` required
- Language prefix: all Dutch content under \`/nl/\` path
- AEM (Adobe Experience Manager) + Helix/EDS hybrid — helix-rum-js script present
- Likely cookie consent banner (OneTrust/Cookiebot); age gate possible (medical aesthetics)
- Social links: instagram.com/juvederm.nl, facebook.com/juvederm.nl

## Archetypes Discovered
${archetypes.map(a => `- **${a.name}** (${a.count}): ${a.sampleUrls.slice(0,2).join(', ')}`).join('\n')}

## Chrome
- \`chrome/header.html\` + \`header.links.json\` — ${chrome.header.links.length} nav links
- \`chrome/footer.html\` + \`footer.links.json\` — ${chrome.footer.links.length} footer links
- \`chrome/header-desktop.png\` / \`chrome/footer-desktop.png\` — cropped screenshots

## Pages Captured (full)
${fullCaptures.map(p => `- \`pages/${p.slug}/\` [${p.archetype}] ${p.url}`).join('\n')}

${failed.length > 0 ? `## Partial Captures\n${failed.map(p => `- **${p.url}**: ${p.error}`).join('\n')}` : '## Partial Captures\nNone — all pages captured successfully.'}
`);
    console.log('✓ README.md');

    // Phase docs
    fs.writeFileSync(path.join(OUT_DIR, 'docs', 'phase1-discovery.md'), `# Phase 1 — Discovery: Juvederm.nl

## Overview
Crawl of ${BASE_URL} completed ${manifest.crawledAt}.
Site is the Dutch regional site for Juvéderm® dermal fillers (AbbVie Aesthetics).

## Pages by Archetype

| Archetype | Count | Sample URLs |
|-----------|-------|-------------|
${archetypes.map(a => `| ${a.name} | ${a.count} | ${a.sampleUrls[0] || ''} |`).join('\n')}
| **TOTAL** | **${allPages.length}** | |

## Navigation Structure

### Header (${chrome.header.links.length} links)
${chrome.header.links.slice(0, 20).map(l => `- [${l.text}](${l.href})`).join('\n') || '_not captured_'}

### Footer (${chrome.footer.links.length} links)
${chrome.footer.links.slice(0, 30).map(l => `- [${l.text}](${l.href})`).join('\n') || '_not captured_'}

## Assets Discovered
- **Favicon**: ${assets.favicon || 'not found'}
- **Fonts**: ${assets.fonts.join(', ') || 'none detected'}
- **Global Images**: embedded in homepage HTML

## Crawl Issues
- Apex domain (juvederm.nl) returns 503; redirected all fetches to www.juvederm.nl
- SSL certificate required \`ignoreHTTPSErrors: true\`
- Sitemap provided ${sitemapUrls.length} URLs; supplemented by link traversal
${failed.length > 0 ? failed.map(p => `- FAILED: ${p.url}: ${p.error}`).join('\n') : '- No page capture failures'}

## Archetype Rationale
- **homepage**: Root /nl — main landing page for Dutch market
- **treatment-page**: /nl/treatment/* — individual treatment areas (lips, eye, enhance, restore, male)
- **clinic-finder**: /nl/find-a-clinic, /nl/clinics, /nl/clinic — find local practitioners
- **faq**: /nl/qa — questions & answers about Juvéderm
- **contact**: /nl/contact-us — contact form
- **legal**: /nl/disclaimer — legal/disclaimer pages
- **informational**: Any other page not matching above patterns

## Source-of-Truth Bundle
Located at \`.eds-migration/state/source-bundle/\`
- **${fullCaptures.length}** full page captures (HTML + 2 viewport screenshots each)
- **${allPages.length - fullCaptures.length}** metadata-only captures
- Chrome header + footer (HTML, links JSON, screenshots)
`);
    console.log('✓ phase1-discovery.md');

    console.log('\n=== COMPLETE ===');
    console.log(`Pages: ${allPages.length} | Archetypes: ${archetypes.map(a=>a.name+'('+a.count+')').join(', ')}`);
    console.log(`Full captures: ${fullCaptures.length} | Failed: ${failed.length}`);

  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
