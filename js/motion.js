(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-ambient]');
  const toggle = document.querySelector('[data-motion-toggle]');
  let userPaused = false;
  let revealObserver;

  function syncAmbient() {
    if (!hero || !toggle) return;
    hero.classList.toggle('ambient-ready', !reducedMotion.matches);
    hero.classList.toggle('ambient-paused', userPaused);
    hero.classList.toggle('ambient-document-hidden', document.hidden);
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.textContent = userPaused ? '背景の動きを再開する' : '背景の動きを止める';
  }

  if (hero && toggle) {
    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      syncAmbient();
    });
    document.addEventListener('visibilitychange', syncAmbient);
    if ('IntersectionObserver' in window) {
      const ambientObserver = new IntersectionObserver(entries => {
        hero.classList.toggle('ambient-offscreen', !entries[0].isIntersecting);
      }, { threshold: 0 });
      ambientObserver.observe(hero);
    }
    syncAmbient();
  }

  function reveal(element) {
    element.classList.remove('reveal-pending');
    element.classList.add('is-revealed');
    revealObserver?.unobserve(element);
  }

  function revealAll() {
    document.querySelectorAll('.reveal-pending').forEach(reveal);
    revealObserver?.disconnect();
  }

  // The equipment / structure images remain crisp and stationary.
  const selector = [
    '.section-head', '.approach-body .prose', '.process-list li',
    '.issue-list article', '.service-cards .card', '.showcase-copy',
    '.partner-split > div', '.contact-band-inner > div',
    '.bilingual > p', '.service-detail', '.hubs > .hub', '.jobs > .job'
  ].join(', ');

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    try {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
      }, { threshold: 0, rootMargin: '0px 0px -36px 0px' });

      document.querySelectorAll(selector).forEach((element, index) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight - 36) return;
        element.classList.add('reveal-target', 'reveal-pending');
        element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 65}ms`);
        revealObserver.observe(element);
      });
      document.addEventListener('focusin', event => {
        const target = event.target.closest('.reveal-pending');
        if (target) reveal(target);
      });
    } catch {
      revealAll();
    }
  }

  reducedMotion.addEventListener('change', () => {
    syncAmbient();
    if (reducedMotion.matches) revealAll();
  });
  window.addEventListener('beforeprint', revealAll);
})();
