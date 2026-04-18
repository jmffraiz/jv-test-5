/**
 * Clinic Finder Block
 * Interactive clinic search with Google Maps integration.
 * Configuration-style block: rows are key-value pairs.
 * Variants: full-page, compact.
 * @param {Element} block the block element
 */

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      config[key] = value;
    }
  });
  return config;
}

function createSearchUI(config) {
  const heading = config.heading || 'Vind een kliniek bij jou in de buurt';
  const placeholder = config.placeholder || 'Voer je postcode of stad in';

  const wrapper = document.createElement('div');
  wrapper.className = 'clinic-finder-search';
  wrapper.innerHTML = `
    <h2 class="clinic-finder-heading">${heading}</h2>
    <div class="clinic-finder-input-wrapper">
      <input type="text"
        class="clinic-finder-input"
        placeholder="${placeholder}"
        aria-label="${placeholder}" />
      <button type="button" class="clinic-finder-btn" aria-label="Zoeken">
        <span class="clinic-finder-btn-text">Zoeken</span>
      </button>
    </div>
  `;
  return wrapper;
}

function createMapPlaceholder() {
  const mapContainer = document.createElement('div');
  mapContainer.className = 'clinic-finder-map';
  mapContainer.innerHTML = `
    <div class="clinic-finder-map-placeholder">
      <p>Voer een locatie in om klinieken op de kaart te zien.</p>
    </div>
  `;
  return mapContainer;
}

function createResultsList() {
  const results = document.createElement('div');
  results.className = 'clinic-finder-results';
  results.setAttribute('aria-live', 'polite');
  results.innerHTML = '<p class="clinic-finder-results-empty">Gebruik de zoekbalk om klinieken bij jou in de buurt te vinden.</p>';
  return results;
}

export default async function decorate(block) {
  const config = readConfig(block);
  const isCompact = block.classList.contains('compact');

  block.textContent = '';

  const searchUI = createSearchUI(config);
  const mapContainer = createMapPlaceholder();
  const resultsList = createResultsList();

  if (isCompact) {
    block.append(searchUI, resultsList);
  } else {
    const layout = document.createElement('div');
    layout.className = 'clinic-finder-layout';
    layout.append(mapContainer, resultsList);
    block.append(searchUI, layout);
  }

  // Wire up search interaction (placeholder behavior)
  const input = searchUI.querySelector('.clinic-finder-input');
  const btn = searchUI.querySelector('.clinic-finder-btn');

  function doSearch() {
    const query = input.value.trim();
    if (!query) return;

    resultsList.innerHTML = `<p class="clinic-finder-results-loading">Zoeken naar klinieken bij "${query}"...</p>`;

    // Placeholder: in production this would call Google Maps Geocoding API
    // and fetch clinic data from the configured data-source endpoint.
    const dataSource = config['data-source'];
    if (dataSource) {
      fetch(dataSource)
        .then((resp) => {
          if (!resp.ok) throw new Error('Failed to load clinic data');
          return resp.json();
        })
        .then((data) => {
          const clinics = data.data || data;
          if (clinics.length === 0) {
            resultsList.innerHTML = '<p>Geen klinieken gevonden in deze regio.</p>';
            return;
          }
          const list = document.createElement('ul');
          list.className = 'clinic-finder-list';
          clinics.slice(0, 10).forEach((clinic) => {
            const li = document.createElement('li');
            li.className = 'clinic-finder-card';
            li.innerHTML = `
              <h3 class="clinic-finder-card-name">${clinic.name || clinic.Name || ''}</h3>
              <p class="clinic-finder-card-address">${clinic.address || clinic.Address || ''}</p>
              ${clinic.phone || clinic.Phone ? `<p class="clinic-finder-card-phone">${clinic.phone || clinic.Phone}</p>` : ''}
            `;
            list.append(li);
          });
          resultsList.replaceChildren(list);
        })
        .catch(() => {
          resultsList.innerHTML = '<p>Er is een fout opgetreden. Probeer het opnieuw.</p>';
        });
    } else {
      resultsList.innerHTML = '<p class="clinic-finder-results-placeholder">Kliniekgegevens worden binnenkort beschikbaar.</p>';
    }
  }

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}
