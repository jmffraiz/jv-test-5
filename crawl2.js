const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.juvederm.nl';
const BUNDLE_DIR = '/home/claude/migration-workspace/.eds-migration/state/source-bundle';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// Only canonical sitemap URLs - no dynamic/parameterized URLs
const CORE_URLS = [
  { url: 'https://www.juvederm.nl/', slug: 'homepage', archetype: 'homepage', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl', slug: 'nl', archetype: 'homepage', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/treatment/lips', slug: 'nl-treatment-lips', archetype: 'treatment-page', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/treatment/eye-area', slug: 'nl-treatment-eye-area', archetype: 'treatment-page', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/treatment/enhance', slug: 'nl-treatment-enhance', archetype: 'treatment-page', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/treatment/restore', slug: 'nl-treatment-restore', archetype: 'treatment-page', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/treatment/male', slug: 'nl-treatment-male', archetype: 'treatment-page', priority: 'high' },
  { url: 'https://www.juvederm.nl/nl/qa', slug: 'nl-qa', archetype: 'faq', priority: 'medium' },
  { url: 'https://www.juvederm.nl/nl/find-a-clinic', slug: 'nl-find-a-clinic', archetype: 'clinic-finder', priority: 'medium' },
  { url: 'https://www.juvederm.nl/nl/disclaimer', slug: 'nl-disclaimer', archetype: 'legal', priority: 'low' },
  { url: 'https://www.juvederm.nl/nl/contact-us', slug: 'nl-contact-us', archetype: 'contact', priority: 'medium' },
  { url: 'https://www.juvederm.nl/nl/clinics', slug: 'nl-clinics', archetype: 'clinic-finder', priority: 'medium' },
  { url: 'https://www.juvederm.nl/nl/clinic', slug: 'nl-clinic', archetype: 'clinic-finder', priority: 'medium' },
  { url: 'https://www.juvederm.nl/nl/algemene-voorwaarden-kliniekzoeker', slug: 'nl-algemene-voorwaarden-kliniekzoeker', archetype: 'legal', priority: 'low' },
];

const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

async function dismissOverlays(page) {
  const selectors = [
    '#onetrust-accept-btn-handler',
    '.onetrust-accept-btn-handler',
    'button[id*="accept"]',
  ];
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 3000 })) {
        await btn.click();
        await page.waitForTimeout(800);
        console.log(`  Dismissed overlay: ${sel}`);
        return;
      }
    } catch (e) { }
  }
}

async function waitForSettle(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 12000 });
  } catch (e) {
    console.log('  networkidle timeout, continuing...');
  }
  let prev = -1;
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(500);
    const len = await page.evaluate(() => {
      const el = document.querySelector('main') || document.body;
      return el ? el.innerText.trim().length : 0;
    });
    if (len > 50 && len === prev) break;
    prev = len;
  }
}

async function capturePage(browser, entry) {
  const { url, slug, archetype, priority } = entry;
  const pageDir = path.join(BUNDLE_DIR, 'pages', slug);

  // Skip homepage (already captured)
  if (slug === 'homepage' && fs.existsSync(path.join(pageDir, 'desktop.png'))) {
    console.log(`[SKIP - already captured] ${url}`);
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(pageDir, 'meta.json'), 'utf8'));
      return { ...meta, slug, archetype, priority };
    } catch(e) {}
  }

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

    let httpStatus = 200;
    let finalUrl = url;
    const redirects = [];

    page.on('response', r => {
      const s = r.status();
      if (s >= 300 && s < 400) {
        redirects.push({ from: r.url(), status: s, to: r.headers()['location'] });
      }
    });

    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (resp) httpStatus = resp.status();
    finalUrl = page.url();

    await waitForSettle(page);
    await dismissOverlays(page);
    await page.waitForTimeout(800);

    const title = await page.title();
    const metaDesc = await page.evaluate(() => {
      const el = document.querySelector('meta[name="description"]');
      return el ? el.getAttribute('content') || '' : '';
    });
    const textLen = await page.evaluate(() => {
      const el = document.querySelector('main') || document.body;
      return el ? el.innerText.trim().length : 0;
    });

    let problem = null;
    if (textLen < 100) problem = `Short visible text: ${textLen} chars`;

    await page.screenshot({ path: path.join(pageDir, 'desktop.png'), fullPage: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), await page.content());
    await ctx.close();
    console.log(`  ✓ desktop (${textLen} chars)`);

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
    await mPage.waitForTimeout(600);
    await mPage.screenshot({ path: path.join(pageDir, 'mobile.png'), fullPage: true });
    await mCtx.close();
    console.log(`  ✓ mobile`);

    const meta = {
      url, finalUrl, title, metaDescription: metaDesc, archetype, httpStatus, slug, priority,
      viewport_sizes: { desktop: DESKTOP_VIEWPORT, mobile: MOBILE_VIEWPORT },
      settle_strategy: 'domcontentloaded + networkidle + main.textLength stable 500ms x2, dismissed #onetrust-accept-btn-handler',
      captured_at: new Date().toISOString(),
      redirects, problem,
    };
    fs.writeFileSync(path.join(pageDir, 'meta.json'), JSON.stringify(meta, null, 2));
    return meta;

  } catch (err) {
    try { await ctx?.close(); } catch(e) {}
    console.error(`  ERROR: ${err.message.split('\n')[0]}`);
    return {
      url, finalUrl: url, title: '', metaDescription: '', archetype, httpStatus: 0, slug, priority,
      captured_at: new Date().toISOString(), redirects: [],
      problem: `Capture failed: ${err.message.split('\n')[0]}`,
    };
  }
}

async function main() {
  console.log('=== Juvederm.nl Core Page Capture ===\n');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--ignore-certificate-errors'] });

  const pageResults = [];
  const redirectMap = {};

  try {
    for (const entry of CORE_URLS) {
      const meta = await capturePage(browser, entry);
      pageResults.push({
        url: meta.url,
        finalUrl: meta.finalUrl,
        title: meta.title,
        metaDescription: meta.metaDescription,
        archetype: meta.archetype,
        httpStatus: meta.httpStatus || 200,
        slug: meta.slug,
        depth: (meta.url.replace(BASE_URL, '').match(/\//g) || []).length - 1,
        priority: meta.priority || 'medium',
        screenshots: {
          desktop: `source-bundle/pages/${meta.slug}/desktop.png`,
          mobile: `source-bundle/pages/${meta.slug}/mobile.png`,
        },
        problem: meta.problem,
      });
      if (meta.finalUrl && meta.finalUrl !== meta.url && !meta.finalUrl.startsWith(meta.url)) {
        redirectMap[meta.url] = meta.finalUrl;
      }
    }
  } finally {
    await browser.close();
  }

  // Read chrome data captured earlier
  let headerLinks = [], footerLinks = [];
  try {
    headerLinks = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, 'chrome', 'header.links.json'), 'utf8'));
    footerLinks = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, 'chrome', 'footer.links.json'), 'utf8'));
  } catch(e) { console.log('Chrome data missing, using empty'); }

  // Build archetypes
  const archetypeMap = {};
  for (const p of pageResults) {
    if (!archetypeMap[p.archetype]) archetypeMap[p.archetype] = [];
    archetypeMap[p.archetype].push(p.url);
  }
  const archetypes = Object.entries(archetypeMap).map(([name, urls]) => ({
    name, count: urls.length, sampleUrls: urls.slice(0, 3),
  }));

  // Extract assets from homepage HTML
  let fonts = [], globalImages = [];
  try {
    const html = fs.readFileSync(path.join(BUNDLE_DIR, 'pages', 'homepage', 'index.html'), 'utf8');
    const fontMatches = [...html.matchAll(/href="([^"]*\.woff2?)"/g)].map(m => m[1]);
    fonts = [...new Set(fontMatches)].slice(0, 10);
    const imgMatches = [...html.matchAll(/src="(https?:\/\/[^"]+\.(?:svg|png|jpg|ico)[^"]*)"/gi)].map(m => m[1]);
    globalImages = [...new Set(imgMatches)].filter(u => u.includes('juvederm')).slice(0, 10);
  } catch(e) {}

  const manifest = {
    site: 'https://juvederm.nl',
    canonicalBase: BASE_URL,
    crawledAt: new Date().toISOString(),
    totalPages: pageResults.length,
    pages: pageResults,
    archetypes,
    navigation: {
      header: headerLinks,
      footer: footerLinks,
    },
    assets: {
      favicon: `${BASE_URL}/favicon.ico`,
      fonts,
      globalImages,
    },
    redirects: {
      'https://juvederm.nl/': 'https://www.juvederm.nl/ (301)',
      ...redirectMap,
    },
    sitemapUrl: `${BASE_URL}/sitemap.xml`,
    crawlNotes: [
      'juvederm.nl redirects to www.juvederm.nl via HTTP 301',
      'Site has SSL certificate issues in headless browser - bypassed with ignoreHTTPSErrors',
      'OneTrust cookie consent banner present (Dutch) - dismissed via #onetrust-accept-btn-handler',
      'Primary content language: Dutch (/nl/ path prefix)',
      'Sitemap at /sitemap.xml contained 13 canonical URLs',
      'Dynamic parameterized URLs (clinic location queries) excluded - same template as /nl/clinic',
      'Site appears to use Adobe AEM/CQ as backend (/content/juvederm-ous/ paths visible)',
      'Site is pharmaceutical/medical aesthetics brand (Allergan/AbbVie - JUVEDERM)',
    ],
  };

  fs.writeFileSync(
    '/home/claude/migration-workspace/.eds-migration/state/manifest.json',
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n=== DONE ===');
  console.log(`✓ manifest.json written`);
  console.log(`✓ ${pageResults.length} pages captured`);
  console.log(`✓ ${archetypes.length} archetypes: ${archetypes.map(a => `${a.name}(${a.count})`).join(', ')}`);
  const failed = pageResults.filter(p => p.problem);
  if (failed.length) {
    console.log(`⚠ ${failed.length} pages with issues:`);
    failed.forEach(p => console.log(`  - ${p.url}: ${p.problem}`));
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
