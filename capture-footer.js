const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BUNDLE_DIR = '/home/claude/migration-workspace/.eds-migration/state/source-bundle';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: DESKTOP_VIEWPORT,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  await page.goto('https://www.juvederm.nl/nl', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for networkidle
  try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch(e) {}
  
  // Dismiss consent
  try {
    const btn = page.locator('#onetrust-accept-btn-handler').first();
    if (await btn.isVisible({ timeout: 3000 })) { await btn.click(); await page.waitForTimeout(1000); }
  } catch(e) {}
  
  await page.waitForTimeout(2000);
  
  // Scroll to bottom to trigger lazy loading
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Find footer-like elements
  const footerInfo = await page.evaluate(() => {
    // Try different selectors
    const selectors = [
      'footer', '.footer', '[class*="footer"]', 
      '[data-component="footer"]', '#footer',
      '.aaaem-card__footer', 'div[class*="emu-card__footer"]'
    ];
    
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const links = Array.from(el.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(), href: a.href
        }));
        return { selector: sel, html: el.outerHTML.substring(0, 2000), links };
      }
    }
    
    // Fallback: look for bottom section
    const allDivs = Array.from(document.querySelectorAll('div'));
    const bottomDivs = allDivs.filter(d => {
      const r = d.getBoundingClientRect();
      return r.top > document.body.scrollHeight * 0.7 && d.querySelectorAll('a').length > 2;
    });
    
    if (bottomDivs.length > 0) {
      const el = bottomDivs[0];
      return { 
        selector: 'bottom-div', 
        html: el.outerHTML.substring(0, 2000),
        links: Array.from(el.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }))
      };
    }
    
    return null;
  });
  
  console.log('Footer info:', JSON.stringify(footerInfo, null, 2));
  
  // Find nav/header links more carefully
  const navInfo = await page.evaluate(() => {
    // Main navigation
    const navEls = document.querySelectorAll('nav, [role="navigation"], .navbar, .nav, [class*="navigation"]');
    const results = [];
    for (const el of navEls) {
      const links = Array.from(el.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(), href: a.href
      }));
      if (links.length > 0) {
        results.push({ selector: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''), links });
      }
    }
    return results;
  });
  
  console.log('\nNav elements:', JSON.stringify(navInfo, null, 2));
  
  // Look for bottom page links (legal, social, etc)
  const bottomLinks = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    const legal = allLinks.filter(a => {
      const text = a.innerText.trim().toLowerCase();
      return text.includes('privacy') || text.includes('terms') || text.includes('cookie') || 
             text.includes('contact') || text.includes('disclaimer') || text.includes('voorwaarden');
    }).map(a => ({ text: a.innerText.trim(), href: a.href }));
    return legal;
  });
  
  console.log('\nLegal links:', JSON.stringify(bottomLinks, null, 2));
  
  // Capture footer screenshot by scrolling to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportH = 900;
  const footerTop = Math.max(0, pageHeight - viewportH);
  
  await page.screenshot({ 
    path: path.join(BUNDLE_DIR, 'chrome', 'footer-desktop.png'),
    clip: { x: 0, y: footerTop, width: 1440, height: Math.min(viewportH, pageHeight) }
  });
  console.log('\nFooter screenshot saved');
  
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
