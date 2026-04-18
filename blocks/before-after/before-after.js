/**
 * Before/After comparison block.
 * Each row = one comparison pair with 2 columns: before image | after image.
 * Multiple rows create a carousel of comparison pairs.
 * @param {Element} block the block element
 */
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
      beforeDiv.append(beforeLabel);
      beforeDiv.append(...cols[0].childNodes);

      const afterDiv = document.createElement('div');
      afterDiv.className = 'before-after-after';
      const afterLabel = document.createElement('span');
      afterLabel.className = 'before-after-label';
      afterLabel.textContent = 'Na';
      afterDiv.append(afterLabel);
      afterDiv.append(...cols[1].childNodes);

      slide.append(beforeDiv, afterDiv);
    }
    container.append(slide);
  });

  // Add navigation dots if multiple pairs
  if (pairs.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'before-after-nav';
    pairs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'before-after-dot';
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Vergelijking ${i + 1}`);
      dot.addEventListener('click', () => {
        container.querySelectorAll('.before-after-slide').forEach((s) => s.classList.remove('active'));
        nav.querySelectorAll('.before-after-dot').forEach((d) => d.classList.remove('active'));
        container.children[i].classList.add('active');
        dot.classList.add('active');
      });
      nav.append(dot);
    });
    block.replaceChildren(container, nav);
  } else {
    block.replaceChildren(container);
  }
}
