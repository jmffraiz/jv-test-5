/**
 * Topic Menu Block
 * Sticky horizontal anchor navigation for FAQ page topic sections.
 * Highlights the active section based on scroll position.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const ul = block.querySelector('ul');
  if (!ul) return;

  // Add nav wrapper
  const nav = document.createElement('nav');
  nav.className = 'topic-menu-nav';
  nav.setAttribute('aria-label', 'Topic navigation');
  nav.append(ul);
  block.replaceChildren(nav);

  // Gather all anchor links
  const links = [...ul.querySelectorAll('a[href^="#"]')];
  if (links.length === 0) return;

  // Highlight active link
  function setActive(id) {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  // Smooth scroll on click
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = block.offsetHeight + 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setActive(targetId);
      }
    });
  });

  // Intersection observer for scroll-based highlighting
  const sectionIds = links.map((link) => link.getAttribute('href').substring(1));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Set first link active by default
  if (links.length > 0) {
    links[0].classList.add('active');
    links[0].setAttribute('aria-current', 'true');
  }
}
