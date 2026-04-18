/**
 * Hero Block
 * Full-width hero with background image, heading, subtext, optional CTA.
 * Variant: "hero (video)" for Vimeo/video background.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const isVideo = block.classList.contains('video');
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: background (image or video link)
  const bgRow = rows[0];
  const bgCell = bgRow?.children[0];

  // Second row: content (heading, text, CTA)
  const contentRow = rows[1];

  // Build hero structure
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  if (contentRow) {
    const contentCell = contentRow.children[0] || contentRow;
    heroContent.append(...contentCell.childNodes);
  } else if (bgCell) {
    // If only one row, check if it has both image and text
    const pic = bgCell.querySelector('picture');
    if (!pic) {
      heroContent.append(...bgCell.childNodes);
    }
  }

  // Handle background
  if (isVideo && bgCell) {
    const link = bgCell.querySelector('a');
    const textContent = bgCell.textContent.trim();
    let videoSrc = '';

    if (link) {
      videoSrc = link.href;
    } else if (textContent.match(/https?:\/\//)) {
      videoSrc = textContent;
    }

    if (videoSrc) {
      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'hero-video-bg';

      // Check for Vimeo
      const vimeoMatch = videoSrc.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1&background=1`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen');
        iframe.setAttribute('loading', 'lazy');
        iframe.title = 'Hero background video';
        videoWrapper.append(iframe);
      } else {
        // Generic video (MP4, etc.)
        const video = document.createElement('video');
        video.src = videoSrc;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');
        videoWrapper.append(video);
      }
      block.prepend(videoWrapper);
    }
  } else if (bgCell) {
    const picture = bgCell.querySelector('picture');
    if (picture) {
      const bgWrapper = document.createElement('div');
      bgWrapper.className = 'hero-bg';
      bgWrapper.append(picture);
      block.prepend(bgWrapper);
    }
  }

  // Clean up old rows and insert content
  block.querySelectorAll(':scope > div:not(.hero-bg):not(.hero-video-bg)').forEach((r) => r.remove());
  block.append(heroContent);
}
