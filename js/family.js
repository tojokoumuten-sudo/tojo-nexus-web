/* CODEX / 2026-10-14: illustrative controls; no Revit connection or form submission. */
(() => {
  const demo = document.querySelector('[data-family-demo]');
  if (demo) {
    const widthInput = demo.querySelector('[data-family-width]');
    const buttons = [...demo.querySelectorAll('[data-family-origin]')];
    let origin = 'edge';
    const set = (selector, name, value) => demo.querySelector(selector).setAttribute(name, value);
    function draw() {
      const mm = Number(widthInput.value);
      const width = mm * .23;
      const left = origin === 'edge' ? 120 : 280 - width / 2;
      const right = left + width;
      const anchor = origin === 'edge' ? left : 280;
      set('[data-box-front]', 'x', left);
      set('[data-box-front]', 'width', width);
      set('[data-box-top]', 'points', `${left},160 ${left+40},120 ${right+40},120 ${right},160`);
      set('[data-box-side]', 'points', `${right},160 ${right+40},120 ${right+40},235 ${right},275`);
      set('[data-datum]', 'd', `M${anchor},78 V305`);
      set('[data-anchor]', 'cx', anchor);
      set('[data-datum-label]', 'x', anchor);
      set('[data-width-line]', 'd', `M${left},290 V326 M${left},314 H${right} M${right},290 V326`);
      set('[data-width-label]', 'x', left+width/2);
      set('[data-clearance]', 'd', `M${right+40},104 H540`);
      demo.querySelector('[data-width-label]').textContent = `幅 ${mm.toLocaleString('ja-JP')} mm`;
      demo.querySelector('output').value = `${mm.toLocaleString('ja-JP')} mm`;
      demo.querySelector('[data-datum-label]').textContent = origin === 'edge' ? '端を固定' : '芯を固定';
      demo.querySelector('[data-family-caption]').textContent = origin === 'edge'
        ? '端の位置を保ったまま、幅を調整。壁際など、動かしたくない位置を基準にできます。'
        : '芯の位置を保ったまま、左右へ均等に調整。通り芯など、中心位置を基準にできます。';
      demo.querySelector('svg title').textContent = `${origin === 'edge' ? '端' : '芯'}を基準にした幅${mm}mmの変更イメージ`;
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      origin = button.dataset.familyOrigin;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      draw();
    }));
    widthInput.addEventListener('input', draw);
    draw();
    demo.querySelector('.family-demo-controls').hidden = false;
  }
  // Select the requested service only; keep the user's message untouched.
  if (new URLSearchParams(location.search).get('service') === 'revit-family') {
    const type = document.querySelector('#contact-form select[name="type"]');
    if (type && !type.value && [...type.options].some(o => o.value === 'revit-family')) {
      type.value = 'revit-family';
    }
  }
})();
