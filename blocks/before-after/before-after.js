/**
 * Before/After comparison block.
 * Each row = one comparison pair with 2 columns: before image | after image.
 * Supports a draggable slider divider and optional carousel of pairs.
 * @param {Element} block the block element
 */

function createSlider(slide) {
  const wrapper = document.createElement('div');
  wrapper.className = 'before-after-slider';

  const before = slide.querySelector('.before-after-before');
  const after = slide.querySelector('.before-after-after');
  if (!before || !after) return;

  // Make clip-path based on slider position
  const handle = document.createElement('div');
  handle.className = 'before-after-handle';
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Vergelijk voor en na');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');
  handle.tabIndex = 0;

  const line = document.createElement('div');
  line.className = 'before-after-line';
  handle.append(line);

  const grip = document.createElement('div');
  grip.className = 'before-after-grip';
  grip.innerHTML = '<span class="before-after-arrow-left"></span><span class="before-after-arrow-right"></span>';
  handle.append(grip);

  wrapper.append(before, after, handle);
  slide.prepend(wrapper);

  function setPosition(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    after.style.clipPath = `inset(0 0 0 ${clamped}%)`;
    handle.style.left = `${clamped}%`;
    handle.setAttribute('aria-valuenow', Math.round(clamped));
  }

  setPosition(50);

  function getPercent(clientX) {
    const rect = wrapper.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  let dragging = false;

  function onStart(e) {
    e.preventDefault();
    dragging = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(getPercent(x));
  }

  function onMove(e) {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(getPercent(x));
  }

  function onEnd() {
    dragging = false;
  }

  wrapper.addEventListener('mousedown', onStart);
  wrapper.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);

  // Keyboard support
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.getAttribute('aria-valuenow'));
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPosition(current - 2);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPosition(current + 2);
    }
  });
}

export default function decorate(block) {
  const pairs = [...block.children];
  const container = document.createElement('div');
  container.className = 'before-after-container';

  pairs.forEach((pair, index) => {
    const slide = document.createElement('div');
    slide.className = 'before-after-slide';
    if (index === 0) slide.classList.add('active');

    const cols = [...pair.children];
    if (cols.length >= 2) {
      const beforeDiv = document.createElement('div');
      beforeDiv.className = 'before-after-before';
      const beforeLabel = document.createElement('span');
      beforeLabel.className = 'before-after-label';
      beforeLabel.textContent = 'Voor';
      beforeDiv.append(...cols[0].childNodes);
      beforeDiv.append(beforeLabel);

      const afterDiv = document.createElement('div');
      afterDiv.className = 'before-after-after';
      const afterLabel = document.createElement('span');
      afterLabel.className = 'before-after-label';
      afterLabel.textContent = 'Na';
      afterDiv.append(...cols[1].childNodes);
      afterDiv.append(afterLabel);

      slide.append(beforeDiv, afterDiv);
    }
    container.append(slide);
  });

  // Navigation dots for multiple pairs
  if (pairs.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'before-after-nav';
    pairs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'before-after-dot';
      dot.type = 'button';
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Vergelijking ${i + 1}`);
      dot.addEventListener('click', () => {
        container.querySelectorAll('.before-after-slide').forEach((s) => s.classList.remove('active'));
        nav.querySelectorAll('.before-after-dot').forEach((d) => d.classList.remove('active'));
        container.children[i].classList.add('active');
        dot.classList.add('active');
        // Initialize slider for newly active slide
        const active = container.children[i];
        if (!active.querySelector('.before-after-handle')) {
          createSlider(active);
        }
      });
      nav.append(dot);
    });
    block.replaceChildren(container, nav);
  } else {
    block.replaceChildren(container);
  }

  // Initialize slider on the first active slide
  const firstSlide = container.querySelector('.before-after-slide.active');
  if (firstSlide) createSlider(firstSlide);
}
