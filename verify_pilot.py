#!/usr/bin/env python3
"""
Pilot Verifier - Playwright-based comparison script for juvederm.nl migration.
Compares preview pages on aem.page vs source-bundle screenshots.
"""

import os
import sys
import json
import time
import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import numpy as np

BASE_DIR = Path("/home/claude/migration-workspace")
SOURCE_BUNDLE = BASE_DIR / ".eds-migration/state/source-bundle/pages"
SCREENSHOTS_DIR = BASE_DIR / ".eds-migration/verifier-results/pilot/screenshots"
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

PAGES = [
    {
        "slug": "nl",
        "url": "https://main--jv-test-5--jmffraiz.aem.page/nl/",
        "source_dir": "nl",
        "da_path": "nl/index",
        "name": "Homepage",
    },
    {
        "slug": "nl--treatment--lips",
        "url": "https://main--jv-test-5--jmffraiz.aem.page/nl/treatment/lips",
        "source_dir": "nl--treatment--lips",
        "da_path": "nl/treatment/lips",
        "name": "Treatment - Lips",
    },
    {
        "slug": "nl--qa",
        "url": "https://main--jv-test-5--jmffraiz.aem.page/nl/qa",
        "source_dir": "nl--qa",
        "da_path": "nl/qa",
        "name": "FAQ / Q&A",
    },
    {
        "slug": "nl--clinic-finder",
        "url": "https://main--jv-test-5--jmffraiz.aem.page/nl/clinic-finder",
        "source_dir": "nl--find-a-clinic",  # closest match in source-bundle
        "da_path": "nl/clinic-finder",
        "name": "Clinic Finder",
    },
    {
        "slug": "nl--algemene-voorwaarden-kliniekzoeker",
        "url": "https://main--jv-test-5--jmffraiz.aem.page/nl/algemene-voorwaarden-kliniekzoeker",
        "source_dir": None,  # not in source-bundle, scraped separately
        "da_path": "nl/algemene-voorwaarden-kliniekzoeker",
        "name": "Algemene Voorwaarden Kliniekzoeker",
    },
]

VIEWPORTS = [
    {"name": "desktop", "width": 1440, "height": 900},
    {"name": "mobile", "width": 390, "height": 844},
]


def dismiss_overlays(page):
    """Dismiss common cookie banners and overlays."""
    selectors = [
        "#onetrust-accept-btn-handler",
        ".onetrust-accept-btn-handler",
        "#acceptAllCookies",
        "[id*='cookie'] button[class*='accept']",
        "[id*='consent'] button[class*='accept']",
        ".cookie-accept",
        "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
        "button[data-testid='accept-all-cookies']",
        ".modal-close",
        "[class*='overlay'] [class*='close']",
        "[class*='banner'] [class*='accept']",
        "[id*='age-gate'] button",
        "button[class*='dismiss']",
        "button[class*='consent']",
    ]
    for sel in selectors:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                time.sleep(0.3)
        except:
            pass
    # Press Escape as fallback
    try:
        page.keyboard.press("Escape")
    except:
        pass


def wait_for_content_stable(page, timeout=12000):
    """Wait until main.innerText is stable for 2x500ms."""
    try:
        page.wait_for_selector("main", timeout=15000)
    except:
        pass
    
    last_len = -1
    stable_count = 0
    start = time.time()
    while time.time() - start < timeout / 1000:
        try:
            cur_len = page.evaluate("() => document.querySelector('main')?.innerText?.length || 0")
            if cur_len > 0 and cur_len == last_len:
                stable_count += 1
                if stable_count >= 2:
                    return True
            else:
                stable_count = 0
            last_len = cur_len
        except:
            pass
        time.sleep(0.5)
    return False


def phash(img, hash_size=16):
    """Compute perceptual hash of PIL image."""
    img = img.convert("L").resize((hash_size, hash_size), Image.LANCZOS)
    arr = np.array(img, dtype=float)
    mean = arr.mean()
    bits = (arr > mean).flatten()
    return bits


def phash_similarity(img1, img2):
    """Return similarity (0-1) between two images using pHash."""
    h1 = phash(img1)
    h2 = phash(img2)
    hamming = np.sum(h1 != h2)
    max_bits = len(h1)
    return 1.0 - (hamming / max_bits)


def screenshot_and_compare(page, slug, viewport, source_dir):
    """Take screenshot and compare with source."""
    vp_name = viewport["name"]
    preview_shot_path = SCREENSHOTS_DIR / f"{slug}-{vp_name}.png"
    
    page.screenshot(path=str(preview_shot_path), full_page=False)
    print(f"  Screenshot saved: {preview_shot_path}")
    
    result = {
        "name": vp_name,
        "preview_screenshot": f".eds-migration/verifier-results/pilot/screenshots/{slug}-{vp_name}.png",
        "source_screenshot": None,
        "similarity": None,
        "method": "pHash (16x16)",
        "threshold": 0.60,
        "passed": None,
        "note": "",
    }
    
    if source_dir:
        source_shot = SOURCE_BUNDLE / source_dir / f"{vp_name}.png"
        if source_shot.exists():
            result["source_screenshot"] = f"source-bundle/pages/{source_dir}/{vp_name}.png"
            try:
                src_img = Image.open(source_shot)
                prev_img = Image.open(preview_shot_path)
                sim = phash_similarity(src_img, prev_img)
                result["similarity"] = round(sim, 4)
                result["passed"] = sim >= result["threshold"]
                print(f"  pHash similarity ({vp_name}): {sim:.4f} {'PASS' if result['passed'] else 'FAIL'}")
            except Exception as e:
                result["note"] = f"Comparison error: {e}"
                result["passed"] = False
        else:
            result["note"] = f"Source screenshot not found: {source_shot}"
            result["passed"] = None
    else:
        result["note"] = "No source-bundle entry for this page; visual comparison skipped"
        result["passed"] = None
    
    return result


def check_chrome(page):
    """Check header and footer are non-empty."""
    header_html = page.evaluate("() => document.querySelector('header')?.innerHTML?.trim() || ''")
    footer_html = page.evaluate("() => document.querySelector('footer')?.innerHTML?.trim() || ''")
    
    header_len = len(header_html)
    footer_len = len(footer_html)
    
    # Check for non-trivial content (not just empty tags or whitespace)
    header_ok = header_len > 50
    footer_ok = footer_len > 50
    
    return {
        "header_html_len": header_len,
        "footer_html_len": footer_len,
        "header_ok": header_ok,
        "footer_ok": footer_ok,
    }


def check_content_fidelity(page, source_dir, slug):
    """Compare visible text on preview vs source HTML."""
    try:
        main_text = page.evaluate("() => document.querySelector('main')?.innerText || ''")
        preview_words = set(w.lower() for w in main_text.split() if len(w) > 3)
        preview_text_len = len(main_text)
    except:
        preview_words = set()
        preview_text_len = 0

    source_text_len = 0
    overlap = None
    
    if source_dir:
        source_html_path = SOURCE_BUNDLE / source_dir / "index.html"
        if source_html_path.exists():
            try:
                from html.parser import HTMLParser
                class TextExtractor(HTMLParser):
                    def __init__(self):
                        super().__init__()
                        self.text_parts = []
                        self._skip = False
                    def handle_starttag(self, tag, attrs):
                        if tag in ('script', 'style', 'nav', 'header', 'footer'):
                            self._skip = True
                    def handle_endtag(self, tag):
                        if tag in ('script', 'style', 'nav', 'header', 'footer'):
                            self._skip = False
                    def handle_data(self, data):
                        if not self._skip:
                            self.text_parts.append(data)
                
                extractor = TextExtractor()
                extractor.feed(source_html_path.read_text(encoding='utf-8', errors='replace'))
                source_text = ' '.join(extractor.text_parts)
                source_text_len = len(source_text)
                source_words = set(w.lower() for w in source_text.split() if len(w) > 3)
                
                if source_words:
                    overlap = len(preview_words & source_words) / len(source_words)
                    overlap = round(overlap, 3)
            except Exception as e:
                print(f"  Content fidelity error: {e}")

    ratio = preview_text_len / source_text_len if source_text_len > 0 else None
    
    return {
        "preview_text_len": preview_text_len,
        "source_text_len": source_text_len,
        "text_length_ratio": round(ratio, 3) if ratio is not None else None,
        "word_overlap": overlap,
        "fidelity_passed": (ratio is not None and ratio >= 0.3) or (overlap is not None and overlap >= 0.3),
    }


def check_js_errors(console_errors):
    """Summarize JS console errors."""
    real_errors = [e for e in console_errors if 
                   "error" in e.lower() and 
                   not any(x in e.lower() for x in ["favicon", "analytics", "rum", "404", "503", "cdn"])]
    return real_errors


def render_page(page, url):
    """Navigate page using crawler's settle strategy."""
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    
    try:
        response = page.goto(url, wait_until="networkidle", timeout=30000)
        http_status = response.status if response else None
    except Exception as e:
        print(f"  Navigation error: {e}")
        http_status = None
    
    dismiss_overlays(page)
    wait_for_content_stable(page)
    dismiss_overlays(page)
    
    return http_status, console_errors


def verify_pages():
    results = []
    issues = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for pg_info in PAGES:
            print(f"\n{'='*60}")
            print(f"Verifying: {pg_info['name']} ({pg_info['url']})")
            
            page_result = {
                "url": pg_info["url"],
                "page": pg_info["url"],
                "slug": pg_info["slug"],
                "name": pg_info["name"],
                "source_artifact": f"source-bundle/pages/{pg_info['source_dir']}/index.html" if pg_info["source_dir"] else "N/A",
                "preview_artifact": pg_info["url"],
                "render_strategy": "networkidle + dismiss overlays + main.innerText stable 500ms x2",
                "viewports": [],
                "da_source_status": None,
                "http_status": None,
                "chrome": None,
                "content_fidelity": None,
                "js_errors": [],
                "finding": "",
                "page_passed": True,
            }
            
            # Check DA source (token returns 401 - already found)
            page_result["da_source_status"] = {
                "status": 401,
                "note": "DA Source API returns 401 for all requests with provided token - cannot independently verify content in DA"
            }
            
            # Render at each viewport
            for vp in VIEWPORTS:
                context = browser.new_context(
                    viewport={"width": vp["width"], "height": vp["height"]},
                    user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    ignore_https_errors=True,
                )
                vp_page = context.new_page()
                
                http_status, console_errors = render_page(vp_page, pg_info["url"])
                
                if vp["name"] == "desktop":
                    page_result["http_status"] = http_status
                    page_result["js_errors"] = check_js_errors(console_errors)
                    page_result["chrome"] = check_chrome(vp_page)
                    page_result["content_fidelity"] = check_content_fidelity(
                        vp_page, pg_info["source_dir"], pg_info["slug"]
                    )
                    
                    print(f"  HTTP status: {http_status}")
                    print(f"  Chrome - header_ok: {page_result['chrome']['header_ok']} (len={page_result['chrome']['header_html_len']}), footer_ok: {page_result['chrome']['footer_ok']} (len={page_result['chrome']['footer_html_len']})")
                    print(f"  Content fidelity: {page_result['content_fidelity']}")
                    print(f"  JS errors: {len(page_result['js_errors'])}")
                
                vp_result = screenshot_and_compare(vp_page, pg_info["slug"], vp, pg_info["source_dir"])
                page_result["viewports"].append(vp_result)
                
                context.close()
            
            # Determine page issues
            page_issues = []
            
            # Check 1: HTTP status
            if page_result["http_status"] and page_result["http_status"] >= 400:
                page_issues.append({
                    "severity": "high",
                    "criterion": "Preview accessible",
                    "details": f"HTTP {page_result['http_status']} for {pg_info['url']}",
                    "remediation": "Upload page to DA and trigger preview"
                })
                page_result["page_passed"] = False
            
            # Check 2: Chrome
            if page_result["chrome"]:
                if not page_result["chrome"]["header_ok"]:
                    page_issues.append({
                        "severity": "high",
                        "criterion": "Header chrome present",
                        "details": f"Header HTML length {page_result['chrome']['header_html_len']} chars (empty/collapsed) on {pg_info['url']}",
                        "remediation": "Upload nav fragment to DA and configure code/helix-config.json"
                    })
                    # Per orchestrator note: known infrastructure gap, flag but don't fail
                if not page_result["chrome"]["footer_ok"]:
                    page_issues.append({
                        "severity": "high",
                        "criterion": "Footer chrome present",
                        "details": f"Footer HTML length {page_result['chrome']['footer_html_len']} chars (empty/collapsed) on {pg_info['url']}",
                        "remediation": "Upload footer fragment to DA"
                    })
            
            # Check 3: Content fidelity
            cf = page_result["content_fidelity"]
            if cf:
                ratio = cf.get("text_length_ratio")
                if ratio is not None and ratio < 0.5:
                    page_issues.append({
                        "severity": "medium",
                        "criterion": "Content fidelity >= 50% of source text length",
                        "details": f"Text ratio {ratio:.2f} on {pg_info['url']} (preview: {cf['preview_text_len']} chars, source: {cf['source_text_len']} chars)",
                        "remediation": "Review migration HTML for missing content sections"
                    })
                    if ratio < 0.3:
                        page_result["page_passed"] = False
            
            # Check 4: Visual similarity
            for vp_r in page_result["viewports"]:
                sim = vp_r.get("similarity")
                if sim is not None and not vp_r.get("passed"):
                    page_issues.append({
                        "severity": "medium" if sim >= 0.4 else "high",
                        "criterion": f"Visual similarity >= threshold ({vp_r['threshold']}) for {vp_r['name']}",
                        "details": f"pHash similarity {sim:.3f} on {pg_info['url']} ({vp_r['name']} viewport)",
                        "remediation": "Review page rendering and block structure"
                    })
                    if sim < 0.4:
                        page_result["page_passed"] = False
            
            # Check 5: JS errors
            if page_result["js_errors"]:
                page_issues.append({
                    "severity": "low",
                    "criterion": "No JS errors",
                    "details": f"{len(page_result['js_errors'])} JS errors on {pg_info['url']}: {page_result['js_errors'][:3]}",
                    "remediation": "Fix JavaScript errors in block scripts"
                })
            
            # Build finding string
            if not page_result["http_status"] or page_result["http_status"] < 400:
                page_result["finding"] = (
                    f"HTTP {page_result['http_status']} - "
                    f"header_ok={page_result['chrome']['header_ok'] if page_result['chrome'] else 'N/A'}, "
                    f"footer_ok={page_result['chrome']['footer_ok'] if page_result['chrome'] else 'N/A'}, "
                    f"text_ratio={cf.get('text_length_ratio') if cf else 'N/A'}, "
                    f"word_overlap={cf.get('word_overlap') if cf else 'N/A'}"
                )
            else:
                page_result["finding"] = f"Page returned HTTP {page_result['http_status']}"
            
            issues.extend(page_issues)
            results.append(page_result)
        
        browser.close()
    
    return results, issues


def check_failed_pages():
    """Verify that HTML artifacts exist for failed pages."""
    failed_checks = []
    
    # Expected locations per status files
    failed_pages = [
        {
            "path": "/nl/contact",
            "expected_artifacts": [
                BASE_DIR / ".eds-migration/state/html/contact.html",
                BASE_DIR / ".eds-migration/state/generated/nl/contact/index.html",
            ],
            "name": "Contact page",
        },
        {
            "path": "/nl/juridisch/privacybeleid",
            "expected_artifacts": [
                BASE_DIR / ".eds-migration/state/html/privacybeleid.html",
                BASE_DIR / ".eds-migration/state/generated/nl/juridisch/privacybeleid/index.html",
            ],
            "name": "Privacy Policy",
        },
    ]
    
    for fp in failed_pages:
        found = False
        found_path = None
        for art_path in fp["expected_artifacts"]:
            if art_path.exists() and art_path.stat().st_size > 100:
                found = True
                found_path = str(art_path)
                break
        
        failed_checks.append({
            "path": fp["path"],
            "name": fp["name"],
            "artifact_found": found,
            "artifact_path": found_path,
        })
        print(f"Failed page {fp['name']}: artifact_found={found}, path={found_path}")
    
    return failed_checks


def main():
    print("=== PILOT VERIFIER for juvederm.nl migration ===\n")
    
    # Check failed pages first
    print("Checking failed page artifacts...")
    failed_pages = check_failed_pages()
    
    # Run Playwright verification
    print("\nRunning Playwright verification...")
    results, issues = verify_pages()
    
    # Add issues for missing HTML artifacts
    for fp in failed_pages:
        if not fp["artifact_found"]:
            issues.append({
                "severity": "medium",
                "criterion": "Failed page HTML artifact exists in state branch",
                "details": f"{fp['name']} ({fp['path']}) - no HTML artifact found in expected locations",
                "remediation": "Generate and commit HTML artifact for manual upload"
            })
    
    # Determine overall verdict
    high_issues = [i for i in issues if i["severity"] == "high"]
    
    # Check if any page failed completely
    pages_failed = [r for r in results if not r.get("page_passed", True)]
    
    # The orchestrator notes say header/footer empty is known infra gap - don't fail on that
    # Filter out chrome issues from verdict decision  
    real_blockers = [i for i in high_issues if "chrome" not in i["criterion"].lower() and 
                     "header" not in i["criterion"].lower() and 
                     "footer" not in i["criterion"].lower()]
    
    if real_blockers:
        verdict = "FAIL"
        summary = f"FAIL: {len(real_blockers)} high-severity blocking issues found"
    elif len(issues) > 5:
        verdict = "FAIL"
        summary = f"FAIL: {len(issues)} issues found including {len(high_issues)} high-severity"
    else:
        verdict = "PASS"
        summary = f"PASS: {len(results)} pages rendered on preview with {len(issues)} non-blocking issues (nav/footer infra gap expected)"
    
    # Build evidence array
    evidence = []
    for r in results:
        ev = {
            "page": r["url"],
            "source_artifact": r["source_artifact"],
            "preview_artifact": r["preview_artifact"],
            "render_strategy": r["render_strategy"],
            "viewports": r["viewports"],
            "finding": r["finding"],
            "da_source_status": r["da_source_status"],
            "chrome": r["chrome"],
            "content_fidelity": r["content_fidelity"],
            "js_errors_count": len(r.get("js_errors", [])),
            "http_status": r["http_status"],
        }
        evidence.append(ev)
    
    # Add failed pages evidence
    for fp in failed_pages:
        evidence.append({
            "page": fp["path"],
            "source_artifact": "N/A (upload failed)",
            "preview_artifact": "N/A (not uploaded)",
            "render_strategy": "N/A",
            "viewports": [],
            "finding": f"Upload failed (DA API 401). HTML artifact {'found' if fp['artifact_found'] else 'NOT FOUND'} at {fp.get('artifact_path', 'N/A')}",
            "artifact_found": fp["artifact_found"],
            "artifact_path": fp.get("artifact_path"),
        })
    
    output = {
        "verdict": verdict,
        "issues": issues,
        "evidence": evidence,
        "failed_pages": failed_pages,
        "summary": summary,
    }
    
    out_path = BASE_DIR / ".eds-migration/verifier-results/pilot.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"\nVerdict: {verdict}")
    print(f"Summary: {summary}")
    print(f"Written to: {out_path}")
    
    return output


if __name__ == "__main__":
    result = main()
