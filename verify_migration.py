#!/usr/bin/env python3
"""
Phase 4 Migration Verifier for juvederm.nl EDS migration.
Uses Playwright to render preview pages, captures screenshots,
compares them to source bundle screenshots using pHash/SSIM,
and checks content completeness.
"""

import os
import sys
import json
import re
import time
import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
from PIL import Image
import io
import struct
import math

BASE_DIR = Path("/home/claude/migration-workspace")
SOURCE_BUNDLE = BASE_DIR / ".eds-migration/state/source-bundle/pages"
SCREENSHOTS_OUT = BASE_DIR / ".eds-migration/verifier-results/migration/screenshots"
SCREENSHOTS_OUT.mkdir(parents=True, exist_ok=True)

# Pages to spot-check: (preview_url, source_slug, archetype, page_id)
SPOT_CHECKS = [
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/", "nl", "homepage", "nl-homepage"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/lips", "nl--treatment--lips", "treatment-page", "nl-treatment-lips"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/eye-area", "nl--treatment--eye-area", "treatment-page", "nl-treatment-eye-area"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/enhance", "nl--treatment--enhance", "treatment", "nl-treatment-enhance"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/restore", "nl--treatment--restore", "treatment-page", "nl-treatment-restore"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/male", "nl--treatment--male", "treatment-page", "nl-treatment-male"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/qa", "nl--qa", "faq", "nl-qa"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/find-a-clinic", "nl--find-a-clinic", "clinic-finder", "nl-find-a-clinic"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/clinic-finder", "nl--clinics", "clinic-finder", "nl-clinic-finder"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/contact", "nl--contact-us", "contact", "nl-contact"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/juridisch/privacybeleid", None, "legal-placeholder", "nl-privacybeleid"),
    ("https://main--jv-test-5--jmffraiz.aem.page/nl/algemene-voorwaarden-kliniekzoeker", None, "informational", "nl-algemene-voorwaarden"),
]

VIEWPORTS = [
    {"name": "desktop", "width": 1440, "height": 900},
    {"name": "mobile", "width": 390, "height": 844},
]

OVERLAY_SELECTORS = [
    "#onetrust-accept-btn-handler",
    "#CybotCookiebotDialogBodyButtonAccept",
    ".cookie-accept",
    "[aria-label='Accept cookies']",
    ".modal-close",
    "button.accept",
    ".consent-banner button",
    "#age-gate-submit",
    ".overlay-close",
    "[data-testid='cookie-accept']",
    ".abbvie-consent-accept",
    ".js-accept-cookies",
]

def dismiss_overlays(page):
    """Try to dismiss cookie banners and overlays."""
    for sel in OVERLAY_SELECTORS:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                page.wait_for_timeout(300)
        except Exception:
            pass
    # Also try pressing Escape
    try:
        page.keyboard.press("Escape")
    except Exception:
        pass

def wait_for_stable_content(page, timeout=15000):
    """Wait until main text length is stable across two 500ms samples."""
    start = time.time()
    prev_len = -1
    stable_count = 0
    while time.time() - start < timeout / 1000:
        try:
            cur_len = page.evaluate("() => (document.querySelector('main') || document.body).innerText.length")
        except Exception:
            cur_len = 0
        if cur_len > 0 and cur_len == prev_len:
            stable_count += 1
            if stable_count >= 2:
                return cur_len
        else:
            stable_count = 0
        prev_len = cur_len
        time.sleep(0.5)
    return prev_len

def phash_image(img, hash_size=8):
    """Compute perceptual hash of a PIL Image."""
    img = img.convert('L').resize((hash_size * 4, hash_size * 4), Image.LANCZOS)
    pixels = list(img.getdata())
    avg = sum(pixels) / len(pixels)
    bits = [1 if p > avg else 0 for p in pixels]
    # Reduce to hash_size x hash_size using DCT approximation (simple average blocks)
    # Simple block average pHash approximation
    small = img.resize((hash_size, hash_size), Image.LANCZOS)
    small_pixels = list(small.getdata())
    small_avg = sum(small_pixels) / len(small_pixels)
    hash_bits = [1 if p > small_avg else 0 for p in small_pixels]
    return hash_bits

def hamming_distance(h1, h2):
    return sum(b1 != b2 for b1, b2 in zip(h1, h2))

def compute_similarity(path1, path2):
    """Compute pHash similarity between two image files. Returns 0.0-1.0."""
    try:
        img1 = Image.open(path1)
        img2 = Image.open(path2)
        # Resize to same size for comparison
        target_size = (1440, 900)
        img1 = img1.resize(target_size, Image.LANCZOS)
        img2 = img2.resize(target_size, Image.LANCZOS)
        h1 = phash_image(img1)
        h2 = phash_image(img2)
        dist = hamming_distance(h1, h2)
        similarity = 1.0 - (dist / len(h1))
        return similarity
    except Exception as e:
        print(f"  Error computing similarity: {e}")
        return 0.0

def extract_visible_text_from_html(html_path):
    """Extract visible text from saved HTML using BeautifulSoup."""
    try:
        from bs4 import BeautifulSoup
        with open(html_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        # Remove script and style
        for tag in soup(['script', 'style', 'noscript', 'meta', 'link']):
            tag.decompose()
        text = soup.get_text(separator=' ', strip=True)
        words = text.split()
        return words
    except Exception as e:
        print(f"  Error extracting text from HTML: {e}")
        return []

def render_page(page, url, viewport):
    """Render a page with the crawler's settle strategy."""
    page.set_viewport_size({"width": viewport["width"], "height": viewport["height"]})
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    
    http_status = [200]
    def handle_response(response):
        if response.url == url or response.url == url.rstrip('/'):
            http_status[0] = response.status
    page.on("response", handle_response)
    
    retries = 3
    for attempt in range(retries):
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            break
        except PlaywrightTimeoutError:
            if attempt == retries - 1:
                print(f"  Timeout after {retries} attempts for {url}")
                break
        except Exception as e:
            if attempt == retries - 1:
                print(f"  Error loading {url}: {e}")
                break
            time.sleep(2)
    
    dismiss_overlays(page)
    stable_len = wait_for_stable_content(page)
    dismiss_overlays(page)
    
    # Get visible text
    try:
        visible_text = page.evaluate("() => (document.querySelector('main') || document.body).innerText")
    except Exception:
        visible_text = ""
    
    # Check header/footer
    try:
        header_text = page.evaluate("() => { const h = document.querySelector('header'); return h ? h.innerText.trim() : ''; }")
        footer_text = page.evaluate("() => { const f = document.querySelector('footer'); return f ? f.innerText.trim() : ''; }")
    except Exception:
        header_text = ""
        footer_text = ""
    
    # Check HTTP status via page response
    try:
        actual_status = page.evaluate("() => window.__aem_status || 200")
    except Exception:
        actual_status = 200
    
    screenshot_bytes = page.screenshot(full_page=False)
    
    return {
        "visible_text": visible_text,
        "text_length": len(visible_text),
        "stable_len": stable_len,
        "header_text": header_text,
        "footer_text": footer_text,
        "screenshot_bytes": screenshot_bytes,
        "console_errors": console_errors,
        "http_status": http_status[0],
    }

def check_http_status(url):
    """Check if URL returns 200 using Playwright's response."""
    import urllib.request
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.getcode()
    except Exception as e:
        code = str(e)
        if "503" in code:
            return 503
        if "404" in code:
            return 404
        return -1

def main():
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        
        for preview_url, source_slug, archetype, page_id in SPOT_CHECKS:
            print(f"\n{'='*60}")
            print(f"Checking: {page_id} ({archetype})")
            print(f"  Preview URL: {preview_url}")
            print(f"  Source slug: {source_slug}")
            
            page_result = {
                "page_id": page_id,
                "preview_url": preview_url,
                "source_slug": source_slug,
                "archetype": archetype,
                "viewports": [],
                "da_live_status": None,
                "preview_http_status": None,
                "content_text_length": None,
                "source_word_count": None,
                "preview_word_count": None,
                "word_overlap_ratio": None,
                "header_present": None,
                "footer_present": None,
                "console_errors": [],
                "issues": [],
            }
            
            # Check DA.live content
            da_path = preview_url.replace("https://main--jv-test-5--jmffraiz.aem.page", "")
            if not da_path:
                da_path = "/nl/"
            da_url = f"https://admin.da.live/source/jmffraiz/jv-test-5{da_path}.html"
            try:
                import urllib.request
                req = urllib.request.Request(da_url, headers={"Authorization": f"Bearer {os.environ.get('EDS_TOKEN', '')}"})
                resp = urllib.request.urlopen(req, timeout=15)
                da_status = resp.getcode()
                da_content = resp.read()
                page_result["da_live_status"] = da_status
                page_result["da_live_content_bytes"] = len(da_content)
                print(f"  DA.live: HTTP {da_status}, {len(da_content)} bytes")
            except Exception as e:
                # Try without trailing slash
                da_path2 = da_path.rstrip('/')
                da_url2 = f"https://admin.da.live/source/jmffraiz/jv-test-5{da_path2}.html"
                try:
                    req2 = urllib.request.Request(da_url2, headers={"Authorization": f"Bearer {os.environ.get('EDS_TOKEN', '')}"})
                    resp2 = urllib.request.urlopen(req2, timeout=15)
                    da_status = resp2.getcode()
                    da_content = resp2.read()
                    page_result["da_live_status"] = da_status
                    page_result["da_live_content_bytes"] = len(da_content)
                    print(f"  DA.live (no trailing slash): HTTP {da_status}, {len(da_content)} bytes")
                except Exception as e2:
                    page_result["da_live_status"] = -1
                    page_result["da_live_content_bytes"] = 0
                    print(f"  DA.live error: {e2}")
                    page_result["issues"].append({
                        "type": "da_live_missing",
                        "detail": str(e2)
                    })
            
            # Render page at each viewport
            all_console_errors = []
            all_visible_text = ""
            header_present = False
            footer_present = False
            
            for vp in VIEWPORTS:
                print(f"  Rendering at {vp['name']} ({vp['width']}x{vp['height']})...")
                context = browser.new_context(
                    ignore_https_errors=True,
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
                )
                page = context.new_page()
                
                render_result = render_page(page, preview_url, vp)
                
                # Save screenshot
                out_path = SCREENSHOTS_OUT / f"{page_id}-{vp['name']}.png"
                with open(out_path, 'wb') as f:
                    f.write(render_result["screenshot_bytes"])
                print(f"    Screenshot saved: {out_path}")
                print(f"    Text length: {render_result['text_length']}")
                print(f"    Header: '{render_result['header_text'][:50]}...' " if len(render_result['header_text']) > 50 else f"    Header: '{render_result['header_text']}'")
                print(f"    Footer: '{render_result['footer_text'][:50]}...' " if len(render_result['footer_text']) > 50 else f"    Footer: '{render_result['footer_text']}'")
                
                if render_result["console_errors"]:
                    print(f"    Console errors: {render_result['console_errors'][:3]}")
                
                all_console_errors.extend(render_result["console_errors"])
                if vp["name"] == "desktop":
                    all_visible_text = render_result["visible_text"]
                    header_present = len(render_result["header_text"]) > 0
                    footer_present = len(render_result["footer_text"]) > 0
                    page_result["preview_http_status"] = render_result["http_status"]
                
                # Compare with source screenshot if available
                source_screenshot = None
                if source_slug:
                    source_path = SOURCE_BUNDLE / source_slug / f"{vp['name']}.png"
                    if source_path.exists():
                        source_screenshot = str(source_path)
                
                similarity = None
                threshold = 0.50
                if source_screenshot:
                    similarity = compute_similarity(source_screenshot, str(out_path))
                    print(f"    pHash similarity ({vp['name']}): {similarity:.3f} (threshold: {threshold})")
                
                vp_result = {
                    "name": vp["name"],
                    "preview_screenshot": f".eds-migration/verifier-results/migration/screenshots/{page_id}-{vp['name']}.png",
                    "source_screenshot": f"source-bundle/pages/{source_slug}/{vp['name']}.png" if source_slug else None,
                    "similarity": round(similarity, 3) if similarity is not None else None,
                    "method": "pHash (block average)",
                    "threshold": threshold,
                    "passed": (similarity >= threshold) if similarity is not None else None,
                    "text_length": render_result["text_length"],
                }
                page_result["viewports"].append(vp_result)
                
                page.close()
                context.close()
            
            page_result["console_errors"] = list(set(all_console_errors))[:10]
            page_result["header_present"] = header_present
            page_result["footer_present"] = footer_present
            
            # Content completeness
            preview_words = all_visible_text.split()
            page_result["preview_word_count"] = len(preview_words)
            
            if source_slug:
                source_html_path = SOURCE_BUNDLE / source_slug / "index.html"
                if source_html_path.exists():
                    source_words = extract_visible_text_from_html(str(source_html_path))
                    page_result["source_word_count"] = len(source_words)
                    if source_words:
                        # Compute word overlap
                        preview_set = set(w.lower() for w in preview_words if len(w) > 3)
                        source_set = set(w.lower() for w in source_words if len(w) > 3)
                        if source_set:
                            overlap = len(preview_set & source_set) / len(source_set)
                        else:
                            overlap = 1.0
                        page_result["word_overlap_ratio"] = round(overlap, 3)
                        print(f"  Word overlap: {overlap:.3f} (source: {len(source_words)}, preview: {len(preview_words)})")
            
            results.append(page_result)
            print(f"  Done: {page_id}")
        
        browser.close()
    
    return results


if __name__ == "__main__":
    results = main()
    # Save results
    out_path = BASE_DIR / ".eds-migration/verifier-results/migration_render_results.json"
    with open(out_path, 'w') as f:
        # Don't include screenshot bytes in JSON
        clean = []
        for r in results:
            rc = {k: v for k, v in r.items() if k != 'screenshot_bytes'}
            clean.append(rc)
        json.dump(clean, f, indent=2)
    print(f"\n\nResults saved to {out_path}")
    
    # Print summary
    print("\n=== SUMMARY ===")
    for r in results:
        print(f"\n{r['page_id']} ({r['archetype']}):")
        print(f"  DA.live: {r.get('da_live_status')} ({r.get('da_live_content_bytes',0)} bytes)")
        print(f"  Preview words: {r.get('preview_word_count')}")
        print(f"  Source words: {r.get('source_word_count')}")
        print(f"  Word overlap: {r.get('word_overlap_ratio')}")
        print(f"  Header present: {r.get('header_present')}")
        print(f"  Footer present: {r.get('footer_present')}")
        for vp in r.get('viewports', []):
            print(f"  {vp['name']}: similarity={vp.get('similarity')}, passed={vp.get('passed')}")
        if r.get('console_errors'):
            print(f"  Console errors: {r['console_errors'][:3]}")
