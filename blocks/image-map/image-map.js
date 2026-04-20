/**
 * Image Map Block
 * Interactive image with positioned markers linking to treatment areas.
 * Row 1: Base image. Row 2+: Marker label | Link URL.
 * Markers are positioned using percentage-based coordinates.
 * @param {Element} block the block element
 */

/* Default marker positions — keyed by label text (lowercased).
   Coordinates are [left%, top%] on the base image. */
const MARKER_POSITIONS = {
  lippen: [50, 72],
  ogen: [50, 32],
  'eye-area': [50, 32],
  wangen: [30, 55],
  cheeks: [30, 55],
  kaak: [32, 72],
  jawline: [32, 72],
  voorhoofd: [50, 18],
  forehead: [50, 18],
  neus: [50, 48],
  nose: [50, 48],
  accentueren: [72, 45],
  enhance: [72, 45],
  herstel: [28, 45],
  restore: [28, 45],
  man: [70, 60],
  male: [70, 60],
};

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'image-map-container';

  // First row: base image
  const imageRow = rows[0];
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'image-map-base';
    imgWrapper.append(picture);
    container.append(imgWrapper);
  }

  // Subsequent rows: markers (label | link)
  const markersWrapper = document.createElement('div');
  markersWrapper.className = 'image-map-markers';

  rows.slice(1).forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const label = cells[0].textContent.trim();
    const linkEl = cells[1].querySelector('a');
    const href = linkEl ? linkEl.href : cells[1].textContent.trim();

    const marker = document.createElement('a');
    marker.className = 'image-map-marker';
    marker.href = href;
    marker.setAttribute('aria-label', label);

    // Position from lookup or evenly distributed
    const key = label.toLowerCase();
    const coords = MARKER_POSITIONS[key];
    if (coords) {
      marker.style.left = `${coords[0]}%`;
      marker.style.top = `${coords[1]}%`;
    } else {
      // Fallback: distribute markers in a circle
      const angle = (index / Math.max(rows.length - 1, 1)) * 2 * Math.PI;
      const cx = 50 + 25 * Math.cos(angle);
      const cy = 50 + 25 * Math.sin(angle);
      marker.style.left = `${cx}%`;
      marker.style.top = `${cy}%`;
    }

    const dot = document.createElement('span');
    dot.className = 'image-map-marker-dot';

    const tooltip = document.createElement('span');
    tooltip.className = 'image-map-marker-label';
    tooltip.textContent = label;

    marker.append(dot, tooltip);
    markersWrapper.append(marker);
  });

  container.append(markersWrapper);
  block.replaceChildren(container);
}
