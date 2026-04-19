const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.juvederm.nl';
const BUNDLE_DIR = '/home/claude/migration-workspace/.eds-migration/state/source-bundle';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const SETTLE_TIMEOUT = 15000;
const MAX_RETRIES = 3;

const SITEMAP_URLS = [
  'https://www.juvederm.nl/',
  'https://www.juvederm.nl/nl',
  'https://www.juvederm.nl/nl/treatment/lips',
  'https://www.juvederm.nl/nl/treatment/eye-area',
  'https://www.juvederm.nl/nl/treatment/enhance',
  'https://www.juvederm.nl/nl/treatment/restore',
  'https://www.juvederm.nl/nl/treatment/male',
  'https://www.juvederm.nl/nl/qa',
  'https://www.juvederm.nl/nl/find-a-clinic',
  'https://www.juvederm.nl/nl/disclaimer',
  'https://www.juvederm.nl/nl/contact-us',
  'https://www.juvederm.nl/nl/clinics',
  'https://www.juvederm.nl/nl/clinic',
];

const BROWSER_OPTS = { ignoreHTTPSErrors: true };
const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

function slugify(url) {
  const s = url
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'homepage';
}

function getArchetype(url) {
  const p = url.replace(BASE_URL, '');
  if (p === '' || p === '/' || p === '/nl' || p === '/nl/') return 'homepage';
  if (p.includes('/treatment/')) return 'treatment-page';
  if (p.includes('/qa')) return 'faq';
  if (p.includes('/find-a-clinic') || p.includes('/clinics') || p === '/nl/clinic' || p === '/nl/clinic/') return 'clinic-finder';
  if (p.includes('/disclaimer')) return 'legal';
  if (p.includes('/contact')) return 'contact';
  return 'informational';
}

async function dismissOverlays(page) {
  const selectors = [
    '#onetrust-accept-btn-handler',
    '.onetrust-accept-btn-handler',
    'button[id*="accept"]',
    'button[class*="accept"]',
    'button:text("Accepteer")',
    'button:text("Akkoord")',
    'button:text("Accept all")',
    'button:text("Accept All")',
    '[class*="cookie"] button',
    '[id*="cookie"] button',
  ];
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        await page.waitForTimeout(800);
        console.log(`  Dismissed overlay: ${sel}`);
        return;
      }
    } catch (e) { /* ignore */ }
  }
}

async function waitForSettle(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: SETTLE_TIMEOUT });
  } catch (e) {
    console.log('  networkidle timeout, continuing...');
  }
  // Content stability: check main text stable over 2x500ms
  let prev = -1;
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(500);
    const len = await page.evaluate(() => {
      const el = document.querySelector('main') || document.body;
      return el ? el.innerText.trim().length : 0;
    });
    if (len > 50 && len === prev) break;
    prev = len;
  }
}

async function capturePage(browser, url, retries = 0) {
  const slug = slugify(url);
  const pageDir = path.join(BUNDLE_DIR, 'pages', slug);
  fs.mkdirSync(pageDir, { recursive: true });
  console.log(`\n[${slug}] ${url}`);

  let ctx;
  try {
    ctx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: DESKTOP_VIEWPORT,
      userAgent: DESKTOP_UA,
    });
    const page = await ctx.newPage();

    const redirects = [];
    let httpStatus = 200;
    page.on('response', r => {
      const s = r.status();
      if (s >= 300 && s < 400) {
        redirects.push({ from: r.url(), status: s, to: r.headers()['location'] });
      }
      if ((r.url() === url || r.url() === url.replace(/\/$/, '') + '/') && s < 300) {
        httpStatus = s;
      }
    });

    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (resp) httpStatus = resp.status();
    const finalUrl = page.url();

    await waitForSettle(page);
    await dismissOverlays(page);
    await page.waitForTimeout(1000);

    const title = await page.title();
    const metaDesc = await page.evaluate(() => {
      const el = document.querySelector('meta[name="description"]');
      return el ? el.getAttribute('content') : '';
    });
    const textLen = await page.evaluate(() => {
      const el = document.querySelector('main') || document.body;
      return el ? el.innerText.trim().length : 0;
    });

    let problem = null;
    if (textLen < 100) problem = `Short visible text: ${textLen} chars`;

    // Desktop screenshot + HTML
    await page.screenshot({ path: path.join(pageDir, 'desktop.png'), fullPage: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), await page.content());
    await ctx.close();
    console.log(`  ✓ desktop`);

    // Mobile
    const mCtx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: MOBILE_VIEWPORT,
      userAgent: MOBILE_UA,
    });
    const mPage = await mCtx.newPage();
    await mPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForSettle(mPage);
    await dismissOverlays(mPage);
    await mPage.waitForTimeout(800);
    await mPage.screenshot({ path: path.join(pageDir, 'mobile.png'), fullPage: true });
    await mCtx.close();
    console.log(`  ✓ mobile`);

    const meta = {
      url,
      finalUrl,
      title,
      metaDescription: metaDesc,
      archetype: getArchetype(url),
      httpStatus,
      slug,
      viewport_sizes: { desktop: DESKTOP_VIEWPORT, mobile: MOBILE_VIEWPORT },
      settle_strategy: 'networkidle + main.textLength stable 500ms x2, dismissed OneTrust cookie banner',
      captured_at: new Date().toISOString(),
      redirects,
      problem,
    };
    fs.writeFileSync(path.join(pageDir, 'meta.json'), JSON.stringify(meta, null, 2));
    return meta;

  } catch (err) {
    try { await ctx?.close(); } catch(e) {}
    console.error(`  ERROR: ${err.message}`);
    if (retries < MAX_RETRIES) {
      console.log(`  Retrying (${retries + 1}/${MAX_RETRIES})...`);
      return capturePage(browser, url, retries + 1);
    }
    return {
      url, finalUrl: url, title: '', metaDescription: '',
      archetype: getArchetype(url), httpStatus: 0, slug,
      captured_at: new Date().toISOString(), redirects: [],
      problem: `Capture failed after ${MAX_RETRIES} retries: ${err.message}`,
    };
  }
}

async function captureChrome(browser, url) {
  console.log('\n--- Capturing chrome ---');
  const chromeDir = path.join(BUNDLE_DIR, 'chrome');
  fs.mkdirSync(chromeDir, { recursive: true });

  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: DESKTOP_VIEWPORT,
    userAgent: DESKTOP_UA,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForSettle(page);
  await dismissOverlays(page);
  await page.waitForTimeout(1500);

  // Header HTML & links
  const headerHtml = await page.evaluate(() => {
    const h = document.querySelector('header, nav, [class*="header"], [class*="nav"]');
    return h ? h.outerHTML : '<!-- header not found -->';
  });
  fs.writeFileSync(path.join(chromeDir, 'header.html'), headerHtml);

  const headerLinks = await page.evaluate(() => {
    const h = document.querySelector('header, nav, [class*="header"]');
    if (!h) return [];
    return Array.from(h.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
    })).filter(l => l.text || l.href);
  });
  fs.writeFileSync(path.join(chromeDir, 'header.links.json'), JSON.stringify(headerLinks, null, 2));

  // Footer HTML & links
  const footerHtml = await page.evaluate(() => {
    const f = document.querySelector('footer, [class*="footer"]');
    return f ? f.outerHTML : '<!-- footer not found -->';
  });
  fs.writeFileSync(path.join(chromeDir, 'footer.html'), footerHtml);

  const footerLinks = await page.evaluate(() => {
    const f = document.querySelector('footer, [class*="footer"]');
    if (!f) return [];
    return Array.from(f.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
    })).filter(l => l.text || l.href);
  });
  fs.writeFileSync(path.join(chromeDir, 'footer.links.json'), JSON.stringify(footerLinks, null, 2));

  // Header screenshot
  try {
    const hBox = await page.evaluate(() => {
      const h = document.querySelector('header, nav, [class*="header"]');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { x: 0, y: 0, width: 1440, height: Math.max(r.bottom, 80) };
    });
    if (hBox) {
      await page.screenshot({ path: path.join(chromeDir, 'header-desktop.png'), clip: hBox });
    }
  } catch(e) { console.log('  header screenshot error:', e.message); }

  // Footer screenshot
  try {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const fBox = await page.evaluate(() => {
      const f = document.querySelector('footer, [class*="footer"]');
      if (!f) return null;
      const r = f.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top), width: 1440, height: Math.min(r.height, 900) };
    });
    if (fBox && fBox.height > 0) {
      await page.screenshot({ path: path.join(chromeDir, 'footer-desktop.png'), clip: fBox });
    }
  } catch(e) { console.log('  footer screenshot error:', e.message); }

  // Discover internal links
  const internalLinks = await page.evaluate((base) => {
    return [...new Set(
      Array.from(document.querySelectorAll('a[href]'))
        .map(a => { try { return new URL(a.href).href; } catch(e) { return ''; } })
        .filter(h => h.startsWith(base) && !h.includes('#'))
        .filter(h => !h.match(/\.(pdf|jpg|jpeg|png|gif|svg|ico|css|js|zip|woff|woff2)(\?|$)/i))
        .map(h => h.replace(/\/$/, '') || h)
    )];
  }, BASE_URL);

  await ctx.close();
  console.log(`  Found ${internalLinks.length} internal links`);
  return { headerLinks, footerLinks, internalLinks };
}

async function discoverLinks(browser, seedUrls) {
  console.log('\n--- Discovering pages ---');
  const seen = new Set();
  const queue = seedUrls.map(u => u.replace(/\/$/, '') || u);
  const all = new Set(queue);

  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: DESKTOP_VIEWPORT,
    userAgent: DESKTOP_UA,
  });

  for (const url of queue) {
    if (seen.has(url) || seen.size > 30) break;
    seen.add(url);
    try {
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
      const links = await page.evaluate((base) => {
        return [...new Set(
          Array.from(document.querySelectorAll('a[href]'))
            .map(a => { try { return new URL(a.href).href; } catch(e) { return ''; } })
            .filter(h => h.startsWith(base) && !h.includes('#'))
            .filter(h => !h.match(/\.(pdf|jpg|jpeg|png|gif|svg|ico|css|js|zip|woff|woff2)(\?|$)/i))
            .map(h => h.replace(/\/$/, '') || h)
        )];
      }, BASE_URL);
      await page.close();
      for (const l of links) {
        if (!all.has(l)) { all.add(l); queue.push(l); console.log(`  + ${l}`); }
      }
    } catch(e) {
      console.log(`  skip ${url}: ${e.message.split('\n')[0]}`);
    }
  }

  await ctx.close();
  return [...all];
}

async function main() {
  console.log('=== Juvederm.nl Crawler ===\n');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--ignore-certificate-errors'] });

  try {
    const allUrls = await discoverLinks(browser, SITEMAP_URLS);
    console.log(`\nDiscovered ${allUrls.length} URLs total`);

    const chromeData = await captureChrome(browser, 'https://www.juvederm.nl/');

    // Merge newly discovered links
    for (const l of chromeData.internalLinks) {
      if (!allUrls.includes(l)) allUrls.push(l);
    }

    // Deduplicate & sort
    const unique = [...new Set(allUrls)].sort((a, b) => {
      if (a.replace(BASE_URL, '').length < b.replace(BASE_URL, '').length) return -1;
      return a.localeCompare(b);
    });
    console.log(`\nTotal unique URLs to capture: ${unique.length}`);

    const pageResults = [];
    const redirectMap = {};

    for (const url of unique) {
      const meta = await capturePage(browser, url);
      const entry = {
        url,
        finalUrl: meta.finalUrl,
        title: meta.title,
        metaDescription: meta.metaDescription,
        archetype: meta.archetype,
        httpStatus: meta.httpStatus,
        slug: meta.slug,
        depth: (url.replace(BASE_URL, '').match(/\//g) || []).length - 1,
        priority: (url === BASE_URL || url === BASE_URL + '/' || url.endsWith('/nl')) ? 'high' : 
                  url.includes('/treatment/') ? 'high' : 'medium',
        screenshots: {
          desktop: `source-bundle/pages/${meta.slug}/desktop.png`,
          mobile: `source-bundle/pages/${meta.slug}/mobile.png`,
        },
      };
      pageResults.push(entry);
      if (meta.finalUrl && meta.finalUrl !== url && meta.finalUrl !== url + '/') {
        redirectMap[url] = meta.finalUrl;
      }
    }

    // Build archetypes
    const archetypeMap = {};
    for (const p of pageResults) {
      if (!archetypeMap[p.archetype]) archetypeMap[p.archetype] = [];
      archetypeMap[p.archetype].push(p.url);
    }
    const archetypes = Object.entries(archetypeMap).map(([name, urls]) => ({
      name, count: urls.length, sampleUrls: urls.slice(0, 3),
    }));

    // Extract font/asset info from homepage HTML
    const homepageHtmlPath = path.join(BUNDLE_DIR, 'pages', 'homepage', 'index.html');
    let fonts = [], globalImages = [];
    try {
      const html = fs.readFileSync(homepageHtmlPath, 'utf8');
      const fontMatches = [...html.matchAll(/href="([^"]+\.woff2?)"/g)].map(m => m[1]);
      fonts = [...new Set(fontMatches)];
      const imgMatches = [...html.matchAll(/src="(https?:\/\/[^"]+\.(svg|png|jpg|gif|ico)[^"]*)"/gi)].map(m => m[1]);
      globalImages = [...new Set(imgMatches)].slice(0, 10);
    } catch(e) {}

    const manifest = {
      site: 'https://juvederm.nl',
      canonicalBase: BASE_URL,
      crawledAt: new Date().toISOString(),
      totalPages: pageResults.length,
      pages: pageResults,
      archetypes,
      navigation: {
        header: chromeData.headerLinks,
        footer: chromeData.footerLinks,
      },
      assets: {
        favicon: `${BASE_URL}/favicon.ico`,
        fonts,
        globalImages,
      },
      redirects: redirectMap,
      crawlNotes: [
        'juvederm.nl (apex) redirects to www.juvederm.nl via 301',
        'Site has an SSL certificate issue (bypassed with ignoreHTTPSErrors)',
        'Site uses OneTrust cookie consent banner (Dutch language)',
        'Primary content language: Dutch (/nl/ path prefix)',
        'Sitemap at https://www.juvederm.nl/sitemap.xml contained 13 URLs',
        'Site appears to be a pharmaceutical/medical aesthetics site (Allergan/AbbVie brand)',
      ],
    };

    fs.writeFileSync(
      '/home/claude/migration-workspace/.eds-migration/state/manifest.json',
      JSON.stringify(manifest, null, 2)
    );
    console.log('\n✓ manifest.json written');
    console.log(`✓ ${pageResults.length} pages captured`);
    console.log(`✓ ${archetypes.length} archetypes: ${archetypes.map(a => a.name).join(', ')}`);

  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
