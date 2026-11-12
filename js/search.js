// ============================================================
//  search.js — Search, filter, and sort logic
// ============================================================

let activeDestinationFilter = 'all';
let activeHotelFilters = {
  search: '',
  destination: 'all',
  minPrice: 0,
  maxPrice: 2000,
  stars: [],
  category: 'all',
  sort: 'recommended'
};

// ─────────────────────────────────────────────────────────────
//  Destination Search (Hero Widget)
// ─────────────────────────────────────────────────────────────
function initDestinationSearch() {
  const searchInput = document.getElementById('hero-search-input');
  const suggestBox = document.getElementById('search-suggestions');
  if (!searchInput || !suggestBox) return;

  searchInput.addEventListener('input', () => {
    if (typeof clearFieldError === 'function') clearFieldError(searchInput);
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 1) { suggestBox.classList.remove('active'); return; }

    const matches = DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      suggestBox.innerHTML = '<div class="suggestion-item suggestion-item--empty">No destinations found</div>';
    } else {
      suggestBox.innerHTML = matches.map(d => `
        <div class="suggestion-item" onclick="selectDestination('${d.name}')">
          <span class="suggestion-flag">${getDestIcon(d.category)}</span>
          <div class="suggestion-text">
            <span class="suggestion-name">${d.name}</span>
            <span class="suggestion-country">${d.country}</span>
          </div>
          <span class="suggestion-price">From $${d.priceFrom}/night</span>
        </div>
      `).join('');
    }
    suggestBox.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
      suggestBox.classList.remove('active');
    }
  });

  // Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  });
}

function selectDestination(name) {
  const input = document.getElementById('hero-search-input');
  if (input) input.value = name;
  const suggestBox = document.getElementById('search-suggestions');
  if (suggestBox) suggestBox.classList.remove('active');
}

function getDestIcon(category) {
  const icons = {
    beach: '<i class="fa-solid fa-umbrella-beach"></i>',
    city: '<i class="fa-solid fa-city"></i>',
    island: '<i class="fa-solid fa-mountain-sun"></i>',
    mountain: '<i class="fa-solid fa-mountain"></i>'
  };
  return icons[category] || '<i class="fa-solid fa-earth-americas"></i>';
}

function triggerSearch() {
  const input = document.getElementById('hero-search-input');
  const q = input ? input.value.trim() : '';
  if (!q) {
    if (input && typeof showFieldError === 'function') {
      showFieldError(input, 'Please enter a destination.');
      input.focus();
    }
    return;
  }

  if (typeof clearFieldError === 'function') clearFieldError(input);

  // Scroll to destinations section
  const section = document.getElementById('destinations');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      // Filter destinations
      const filtered = DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.country.toLowerCase().includes(q.toLowerCase())
      );
      renderDestinations(filtered.length > 0 ? filtered : DESTINATIONS);
    }, 600);
  }
}

// ─────────────────────────────────────────────────────────────
//  Destination Category Filters
// ─────────────────────────────────────────────────────────────
function initDestinationFilters() {
  const filterBtns = document.querySelectorAll('.dest-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDestinationFilter = btn.dataset.filter;
      applyDestinationFilter();
    });
  });
}

function applyDestinationFilter() {
  const grid = document.getElementById('destinations-grid');
  const filtered = activeDestinationFilter === 'all'
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.category === activeDestinationFilter);
  if (grid) {
    grid.classList.toggle('bento--filtered', activeDestinationFilter !== 'all');
  }
  renderDestinations(filtered);
}

// ─────────────────────────────────────────────────────────────
//  Hotel Filters
// ─────────────────────────────────────────────────────────────
function initHotelFilters() {
  // Search input
  const hotelSearch = document.getElementById('hotel-search');
  if (hotelSearch) {
    hotelSearch.addEventListener('input', () => {
      activeHotelFilters.search = hotelSearch.value.toLowerCase();
      applyHotelFilters();
    });
  }

  // Destination filter
  const destFilter = document.getElementById('hotel-dest-filter');
  if (destFilter) {
    destFilter.addEventListener('change', () => {
      activeHotelFilters.destination = destFilter.value;
      applyHotelFilters();
    });
  }

  // Price range
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceDisplay = document.getElementById('price-display');

  if (priceMax) {
    priceMax.addEventListener('input', () => {
      activeHotelFilters.maxPrice = parseInt(priceMax.value);
      if (priceDisplay) priceDisplay.textContent = `$0 — $${priceMax.value}`;
      applyHotelFilters();
    });
  }

  // Star rating checkboxes
  const starChecks = document.querySelectorAll('.star-filter-check');
  starChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      activeHotelFilters.stars = Array.from(starChecks)
        .filter(c => c.checked)
        .map(c => parseInt(c.value));
      applyHotelFilters();
    });
  });

  // Category filter
  const catFilter = document.getElementById('hotel-category-filter');
  if (catFilter) {
    catFilter.addEventListener('change', () => {
      activeHotelFilters.category = catFilter.value;
      applyHotelFilters();
    });
  }

  // Sort
  const sortSelect = document.getElementById('hotel-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeHotelFilters.sort = sortSelect.value;
      applyHotelFilters();
    });
  }
}

function applyHotelFilters() {
  let filtered = [...HOTELS];

  // Search
  if (activeHotelFilters.search) {
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(activeHotelFilters.search) ||
      h.location.toLowerCase().includes(activeHotelFilters.search) ||
      h.destination.toLowerCase().includes(activeHotelFilters.search)
    );
  }

  // Destination
  if (activeHotelFilters.destination !== 'all') {
    filtered = filtered.filter(h => h.destination === activeHotelFilters.destination);
  }

  // Price
  filtered = filtered.filter(h =>
    h.pricePerNight >= activeHotelFilters.minPrice &&
    h.pricePerNight <= activeHotelFilters.maxPrice
  );

  // Stars
  if (activeHotelFilters.stars.length > 0) {
    filtered = filtered.filter(h => activeHotelFilters.stars.includes(h.stars));
  }

  // Category
  if (activeHotelFilters.category !== 'all') {
    filtered = filtered.filter(h => h.category === activeHotelFilters.category);
  }

  // Sort
  switch (activeHotelFilters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // recommended — keep original order
      break;
  }

  renderHotels(filtered);

  // Update result count
  const countEl = document.getElementById('hotel-result-count');
  if (countEl) countEl.textContent = `${filtered.length} hotel${filtered.length !== 1 ? 's' : ''} found`;
}

function resetHotelFilters() {
  activeHotelFilters = {
    search: '', destination: 'all',
    minPrice: 0, maxPrice: 2000,
    stars: [], category: 'all', sort: 'recommended'
  };

  const els = {
    'hotel-search': '',
    'hotel-dest-filter': 'all',
    'hotel-category-filter': 'all',
    'hotel-sort': 'recommended'
  };

  Object.entries(els).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  const priceMax = document.getElementById('price-max');
  if (priceMax) priceMax.value = 2000;
  const priceDisplay = document.getElementById('price-display');
  if (priceDisplay) priceDisplay.textContent = '$0 — $2000';

  document.querySelectorAll('.star-filter-check').forEach(cb => cb.checked = false);

  renderHotels(HOTELS);
  const countEl = document.getElementById('hotel-result-count');
  if (countEl) countEl.textContent = `${HOTELS.length} hotels found`;
}
