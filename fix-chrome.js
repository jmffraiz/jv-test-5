/**
 * Fix chrome capture: update footer.html and footer.links.json
 * using the correct footer selector from the captured HTML
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.juvederm.nl';
const CHROME_DIR = '/home/claude/migration-workspace/.eds-migration/state/source-bundle/chrome';

async function main() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}/nl`, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Dismiss cookie banner
  try {
    const btn = page.locator('#onetrust-accept-btn-handler').first();
    if (await btn.isVisible({ timeout: 3000 })) {
      await btn.click();
      await page.waitForTimeout(800);
    }
  } catch {}
  
  await page.waitForTimeout(2000);

  // Get footer with correct selector
  const footerData = await page.evaluate(() => {
    // Try specific footer class first
    const footer = document.querySelector('footer.footer') 
      || document.querySelector('.cmp-experiencefragment--footer footer')
      || document.querySelector('footer[data-gtm-attribute="footerNav"]')
      || document.querySelector('footer');
    if (!footer) return { html: '', links: [] };
    return {
      html: footer.outerHTML,
      links: Array.from(footer.querySelectorAll('a[href]')).map(a => ({
        text: (a.innerText || a.textContent || '').trim(),
        href: a.href,
      })).filter(l => l.href),
    };
  });
  
  console.log(`Footer: ${footerData.links.length} links`);
  footerData.links.forEach(l => console.log(`  ${l.href}: ${l.text}`));
  
  fs.writeFileSync(path.join(CHROME_DIR, 'footer.html'), footerData.html);
  fs.writeFileSync(path.join(CHROME_DIR, 'footer.links.json'), JSON.stringify(footerData.links, null, 2));

  // Footer screenshot - scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  const footerBox = await page.evaluate(() => {
    const f = document.querySelector('footer.footer')
      || document.querySelector('footer[data-gtm-attribute="footerNav"]');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
  });
  
  if (footerBox && footerBox.width > 10 && footerBox.height > 10) {
    await page.screenshot({
      path: path.join(CHROME_DIR, 'footer-desktop.png'),
      clip: { ...footerBox, height: Math.min(footerBox.height, 800) },
    });
    console.log('Footer screenshot taken:', footerBox);
  }

  // Also fix header - get header links properly
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  const headerData = await page.evaluate(() => {
    const header = document.querySelector('header.aaaem-header')
      || document.querySelector('header')
      || document.querySelector('[data-gtm-attribute="headerNav"]');
    if (!header) return { html: '', links: [] };
    return {
      html: header.outerHTML,
      links: Array.from(header.querySelectorAll('a[href]')).map(a => ({
        text: (a.innerText || a.textContent || '').trim(),
        href: a.href,
      })).filter(l => l.href),
    };
  });
  
  console.log(`\nHeader: ${headerData.links.length} links`);
  headerData.links.forEach(l => console.log(`  ${l.href}: ${l.text}`));
  
  fs.writeFileSync(path.join(CHROME_DIR, 'header.html'), headerData.html);
  fs.writeFileSync(path.join(CHROME_DIR, 'header.links.json'), JSON.stringify(headerData.links, null, 2));

  const headerBox = await page.evaluate(() => {
    const h = document.querySelector('header.aaaem-header') || document.querySelector('header');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
  });
  if (headerBox && headerBox.width > 10 && headerBox.height > 10) {
    await page.screenshot({
      path: path.join(CHROME_DIR, 'header-desktop.png'),
      clip: { ...headerBox, height: Math.min(headerBox.height, 200) },
    });
  }

  await browser.close();
  console.log('\nChrome fix complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
