/* CODEX / 2026-09-26. Muted film, explicit pause, responsive source and scroll treatment. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-cinema-hero]');
  const sequence = document.querySelector('[data-cinema-sequence]');
  const stage = document.querySelector('[data-cinema-stage]');
  const video = document.querySelector('[data-cinema-video]');
  const toggle = document.querySelector('[data-cinema-toggle]');
  if (!hero || !sequence || !stage || !video || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const connection = navigator.connection;
  let userPaused = reduced.matches || Boolean(connection?.saveData);
  let inView = sequence.getBoundingClientRect().bottom > 0 && sequence.getBoundingClientRect().top < innerHeight;
  let failed = false;
  let playPending = false;
  let resyncRequested = false;
  let selectedSource = '';
  let queued = false;

  function updateButton() {
    const playing = !video.paused && !video.ended;
    toggle.setAttribute('aria-label', playing ? '背景動画を停止する' : '背景動画を再生する');
    toggle.title = playing ? '背景動画を停止' : '背景動画を再生';
    toggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    stage.classList.toggle('is-playing', playing);
  }

  function loadSource() {
    const source = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    if (source === selectedSource) return;
    selectedSource = source;
    stage.classList.remove('has-frame');
    video.muted = true;
    video.defaultMuted = true;
    video.src = source;
    video.load();
  }

  async function syncPlayback() {
    if (userPaused || !inView || document.hidden || failed) {
      video.pause();
      updateButton();
      return;
    }
    if (playPending) { resyncRequested = true; return; }
    playPending = true;
    try {
      loadSource();
      await video.play();
      // A visibility or preference event can arrive while play() is pending.
      if (userPaused || !inView || document.hidden) video.pause();
    } catch (error) {
      if (error?.name !== 'AbortError') userPaused = true;
    } finally {
      playPending = false;
      updateButton();
      // A breakpoint can replace the source and abort the previous pending play().
      if (resyncRequested) {
        resyncRequested = false;
        queueMicrotask(syncPlayback);
      }
    }
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    if (!video.paused) {
      userPaused = true;
    } else {
      userPaused = false;
      failed = false;
      if (video.error) { selectedSource = ''; video.removeAttribute('src'); }
    }
    syncPlayback();
  });
  video.addEventListener('loadeddata', () => stage.classList.add('has-frame'));
  video.addEventListener('playing', updateButton);
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => {
    failed = true;
    stage.classList.remove('has-frame');
    video.pause();
    updateButton();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', syncPlayback);
  reduced.addEventListener('change', () => {
    if (reduced.matches) userPaused = true;
    requestProgress();
    syncPlayback();
  });
  mobile.addEventListener('change', () => {
    if (selectedSource) { video.pause(); loadSource(); }
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0 }).observe(sequence);
  }

  function updateProgress() {
    const bounds = hero.getBoundingClientRect();
    const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, -bounds.top / (innerHeight * .95)));
    stage.style.setProperty('--cinema-progress', progress.toFixed(4));
    if (!('IntersectionObserver' in window)) {
      const sceneBounds = sequence.getBoundingClientRect();
      const visible = sceneBounds.bottom > 0 && sceneBounds.top < innerHeight;
      if (visible !== inView) { inView = visible; syncPlayback(); }
    }
    queued = false;
  }
  function requestProgress() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress);

  // Keep one accessible text copy. Decorative letters follow the existing reveal observer.
  document.querySelectorAll('.cinema-home .section-head > .kicker').forEach(label => {
    const text = label.textContent.trim();
    const accessible = document.createElement('span');
    accessible.className = 'cinema-sr';
    accessible.textContent = text;
    const artwork = document.createElement('span');
    artwork.setAttribute('aria-hidden', 'true');
    let order = 0;
    text.split(/\s+/).forEach((word, index) => {
      if (index) artwork.append(document.createTextNode(' '));
      const group = document.createElement('span');
      group.className = 'cinema-label-word';
      Array.from(word).forEach(char => {
        const letter = document.createElement('span');
        letter.className = 'cinema-label-letter';
        letter.style.setProperty('--letter-order', String(order++));
        letter.textContent = char;
        group.append(letter);
      });
      artwork.append(group);
    });
    label.replaceChildren(accessible, artwork);
  });
  updateProgress();
  syncPlayback();
})();
