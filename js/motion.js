/* CODEX / 2026-09-18, completed 2026-09-22: shared motion with readable fallbacks. */
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
    toggle.addEventListener('click', () => { userPaused = !userPaused; syncAmbient(); });
    document.addEventListener('visibilitychange', syncAmbient);
    if ('IntersectionObserver' in window) {
      const ambientObserver = new IntersectionObserver(entries => {
        hero.classList.toggle('ambient-offscreen', !entries[0].isIntersecting);
      });
      ambientObserver.observe(hero);
    }
    syncAmbient();
  }

  function reveal(element, immediate = false) {
    if (immediate) element.classList.add('reveal-instant');
    element.classList.remove('reveal-pending');
    element.classList.add('is-revealed');
    revealObserver?.unobserve(element);
  }
  function revealAll() {
    document.querySelectorAll('.reveal-target').forEach(element => reveal(element, true));
    revealObserver?.disconnect();
  }

  // Preserve the original text and inline markup: only existing line breaks are grouped.
  function prepareHeading(heading) {
    if (heading.querySelector('a, button, .motion-line')) return;
    const output = document.createDocumentFragment();
    let group = [];
    let lineIndex = 0;
    function flush() {
      if (!group.length) return;
      const line = document.createElement('span');
      const content = document.createElement('span');
      line.className = 'motion-line';
      content.className = 'motion-line-inner';
      content.style.setProperty('--line-delay', `${lineIndex++ * 85}ms`);
      group.forEach(node => content.append(node));
      line.append(content);
      output.append(line);
      group = [];
    }
    Array.from(heading.childNodes).forEach(node => {
      if (node.nodeName === 'BR') {
        flush();
      } else if (node.nodeType === 1 && node.classList.contains('en-line')) {
        flush();
        group.push(node);
        flush();
      } else {
        group.push(node);
      }
    });
    flush();
    heading.replaceChildren(output);
    heading.classList.add('motion-heading');
  }

  const panelSelector = [
    '.process-list > li', '.issue-list > article', '.service-cards > .card',
    '.hubs > .hub', '.jobs > .job', '.service-audience',
    '.service-permit-stages > li', '.vision-benefits > article',
    '.service-flow > li', '.knowledge-card', '.article-example', '.article-toc',
    '.vision-barriers > li', '.vision-world > div', '.service-model-evidence'
  ].join(', ');
  const textSelector = [
    'main h1', 'main h2', 'main h3', 'main .kicker',
    '.section-head .lede', '.approach-body .prose > p',
    '.showcase-copy > p', '.partner-split > div > p',
    '.contact-band-inner > div > p', '.bilingual > p',
    '.split .prose > p', '.bim-intro > p', '.bim-overview > p',
    '.bim-lifecycle > p', '.bim-lifecycle li',
    '.service-section-intro > p', '.service-hero-lead', '.service-hero-links',
    '.service-scope', '.service-permit-intro > p', '.service-permit-next',
    '.service-permit-context > div > p', '.vision-topic',
    '.vision-grid > article > p', '.vision-value > p', '.vision-example > p',
    '.vision-commitment > div > p', '.service-closing > div > p',
    '.knowledge-body > p', '.knowledge-body > section > p',
    '.article-contact > p', '.article-step-list > li'
  ].join(', ');

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    try {
      document.documentElement.classList.add('motion-initializing');
      const candidates = Array.from(document.querySelectorAll(`${panelSelector}, ${textSelector}`));
      const candidateSet = new Set(candidates);
      const targets = candidates.filter(element => {
        if (element.closest('.hero-copy, details, .form')) return false;
        let parent = element.parentElement;
        while (parent && parent.tagName !== 'MAIN') {
          if (candidateSet.has(parent)) return false;
          parent = parent.parentElement;
        }
        return true;
      });
      const siblingGroups = new Map();
      targets.forEach(element => {
        const siblings = siblingGroups.get(element.parentElement) || [];
        siblings.push(element);
        siblingGroups.set(element.parentElement, siblings);
      });

      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
      }, { threshold: 0, rootMargin: '0px 0px -28px 0px' });

      targets.forEach(element => {
        if (element.matches('h1, h2, h3')) prepareHeading(element);
        element.classList.add('reveal-target');
        if (element.matches(panelSelector)) element.classList.add('reveal-panel');
        const siblings = siblingGroups.get(element.parentElement);
        const order = siblings.indexOf(element);
        element.style.setProperty('--reveal-delay', `${Math.min(order, 3) * 80}ms`);
        const bounds = element.getBoundingClientRect();
        // Never hide text above a restored position or the current deep link.
        if (bounds.bottom < 0 || (location.hash && bounds.top < innerHeight)) {
          reveal(element, true);
        } else {
          element.classList.add('reveal-pending');
        }
      });
      // Commit the hidden start once, without animating backwards into it.
      void document.documentElement.offsetHeight;
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('motion-initializing');
        document.querySelectorAll('.reveal-pending').forEach(element => revealObserver.observe(element));
      });
      document.addEventListener('focusin', event => {
        const pending = event.target.closest('.reveal-pending');
        if (pending) reveal(pending, true);
      });
    } catch {
      document.documentElement.classList.remove('motion-initializing');
      revealAll();
    }
  }

  function revealReadingPosition() {
    if (!location.hash && scrollY < 80) return;
    document.querySelectorAll('.reveal-pending').forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < innerHeight && bounds.bottom > 0) reveal(element, true);
    });
  }
  window.addEventListener('hashchange', revealReadingPosition);
  window.addEventListener('pageshow', revealReadingPosition);
  reducedMotion.addEventListener('change', () => {
    syncAmbient();
    if (reducedMotion.matches) revealAll();
  });
  window.addEventListener('beforeprint', revealAll);

  // The visitor controls the model stages; no looping animation while reading.
  document.querySelectorAll('[data-model-demo]').forEach(demo => {
    const controls = demo.querySelector('.model-controls');
    const buttons = Array.from(demo.querySelectorAll('[data-model-select]'));
    const panels = Array.from(demo.querySelectorAll('[data-model-panel]'));
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      panels.forEach(panel => { panel.hidden = panel.dataset.modelPanel !== button.dataset.modelSelect; });
    }));
    demo.classList.add('model-demo-ready');
  });

  // A slim brass line provides orientation on long pages, without scroll capture.
  const header = document.querySelector('[data-header]');
  if (header) {
    const progress = document.createElement('div');
    const fill = document.createElement('span');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.append(fill);
    header.append(progress);
    let queued = false;
    function updateProgress() {
      const range = document.documentElement.scrollHeight - innerHeight;
      const fraction = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
      fill.style.transform = `scaleX(${fraction})`;
      queued = false;
    }
    function requestProgress() {
      if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
    }
    window.addEventListener('scroll', requestProgress, { passive: true });
    window.addEventListener('resize', requestProgress);
    window.addEventListener('load', requestProgress);
    document.addEventListener('toggle', requestProgress, true);
    updateProgress();
  }
})();
