/**
 * Delayed loading of third-party scripts.
 * Loaded 3s after page load to protect Core Web Vitals.
 */

/**
 * OneTrust Cookie Consent
 * Replace DOMAIN_SCRIPT_ID with the actual OneTrust domain script ID.
 */
function loadOneTrust() {
  const otId = window.aem?.oneTrustId || '';
  if (!otId) return;

  const script = document.createElement('script');
  script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
  script.setAttribute('data-domain-script', otId);
  script.setAttribute('charset', 'UTF-8');
  document.head.append(script);

  // OneTrust wrapper function
  window.OptanonWrapper = () => {
    // Callback when consent is updated
  };
}

/**
 * Google Analytics / Google Tag Manager stub
 * Replace GTM_ID with actual container ID when available.
 */
function loadGoogleAnalytics() {
  const gtmId = window.aem?.gtmId || '';
  if (!gtmId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
  document.head.append(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args) { window.dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', gtmId);
}

/**
 * Facebook Pixel stub
 * Replace PIXEL_ID with actual pixel ID when available.
 */
function loadFacebookPixel() {
  const pixelId = window.aem?.fbPixelId || '';
  if (!pixelId) return;

  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

// Load all third-party integrations
loadOneTrust();
loadGoogleAnalytics();
loadFacebookPixel();
