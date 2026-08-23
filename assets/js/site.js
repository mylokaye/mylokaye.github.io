(() => {
  const measurementId = 'G-0K36MBFB25';
  const consentKey = 'mylo-analytics-consent';

  function createBanner() {
    const element = document.createElement('section');
    element.className = 'cookie-banner';
    element.hidden = true;
    element.dataset.cookieBanner = '';
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'false');
    element.setAttribute('aria-labelledby', 'cookie-banner-title');
    element.innerHTML = `
      <h2 id="cookie-banner-title" class="text-lg font-extrabold text-white">Optional analytics</h2>
      <p class="mt-2 text-sm font-medium leading-6 text-slate-300">
        This site uses Google Analytics only if you accept. It helps measure which tools and guides are useful. Read the
        <a class="font-bold text-accent underline underline-offset-4" href="/privacy.html#website-analytics">privacy and cookie details</a>.
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__button cookie-banner__button--primary focus-ring" type="button" data-consent-accept>Accept analytics</button>
        <button class="cookie-banner__button focus-ring" type="button" data-consent-reject>Reject analytics</button>
      </div>`;
    document.body.append(element);
    return element;
  }

  const banner = document.querySelector('[data-cookie-banner]') || createBanner();
  let analyticsLoaded = false;

  function readConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch {
      // Analytics remains disabled when storage is unavailable.
    }
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    banner.querySelector('button')?.focus({ preventScroll: true });
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function clearAnalyticsCookies() {
    const cookieNames = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));

    for (const name of cookieNames) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.mylokaye.info; SameSite=Lax`;
    }
  }

  function configureAnalytics() {
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  }

  function loadAnalytics() {
    if (analyticsLoaded) {
      configureAnalytics();
      return;
    }

    analyticsLoaded = true;
    configureAnalytics();
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  function grantAnalytics() {
    writeConsent('granted');
    loadAnalytics();
    hideBanner();
  }

  function denyAnalytics() {
    writeConsent('denied');
    window[`ga-disable-${measurementId}`] = true;
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    clearAnalyticsCookies();
    hideBanner();
  }

  document.querySelectorAll('[data-consent-accept]').forEach((button) => {
    button.addEventListener('click', grantAnalytics);
  });

  document.querySelectorAll('[data-consent-reject]').forEach((button) => {
    button.addEventListener('click', denyAnalytics);
  });

  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', showBanner);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-analytics-event]');
    if (!link || readConsent() !== 'granted' || typeof window.gtag !== 'function') return;
    window.gtag('event', 'outbound_click', {
      link_type: link.dataset.analyticsEvent,
      project: link.dataset.analyticsProject || 'site'
    });
  });

  if (readConsent() === 'granted') {
    loadAnalytics();
  } else if (readConsent() !== 'denied') {
    showBanner();
  }
})();
