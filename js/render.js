// ============================================================
//  render.js — Dynamic card rendering
// ============================================================

function renderStars(rating, max = 5) {
  let html = '<span class="stars">';
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(rating)) {
      html += '<i class="star star--full fa-solid fa-star"></i>';
    } else if (i - rating < 1) {
      html += '<i class="star star--half fa-solid fa-star-half-stroke"></i>';
    } else {
      html += '<i class="star star--empty fa-regular fa-star"></i>';
    }
  }
  html += `</span>`;
  return html;
}

function renderHotelStars(count) {
  return Array(count).fill('<i class="hotel-star fa-solid fa-star"></i>').join('');
}

// ─────────────────────────────────────────────────────────────
//  Destination Cards
// ─────────────────────────────────────────────────────────────
function renderDestinations(data) {
  const grid = document.getElementById('destinations-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = `<div class="no-results"><span class="no-results-icon"><i class="fa-solid fa-map-location-dot"></i></span><p>No destinations found. Try a different search.</p></div>`;
    return;
  }

  data.forEach((dest, index) => {
    const card = document.createElement('div');
    card.className = `dest-card dest-card--bento-${index + 1}`;
    card.dataset.id = dest.id;
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = String(index * 80);
    card.innerHTML = `
      <div class="dest-card__img-wrap">
        <img src="${dest.image}" alt="${dest.name}" class="dest-card__img" loading="lazy"
          onerror="this.style.display='none';this.parentElement.style.background='${getDestGradient(dest.id)}';">
        <span class="dest-card__tag" style="background:${dest.tagColor}">${dest.tag}</span>
        <span class="dest-card__bento-badge">
          <i class="fa-solid fa-star"></i> ${dest.rating}
        </span>
      </div>
      <div class="dest-card__body">
        <div class="dest-card__head">
          <div class="dest-card__location">
            <span class="dest-card__name">${dest.name}</span>
            <span class="dest-card__country"><i class="fa-solid fa-location-dot"></i> ${dest.country}</span>
          </div>
          <div class="dest-card__price">
            From <strong>$${dest.priceFrom}</strong>/night
          </div>
        </div>
        <div class="dest-card__reveal">
          <p class="dest-card__desc">${dest.description}</p>
          <div class="dest-card__highlights">
            ${dest.highlights.map(h => `<span class="highlight-chip">${h}</span>`).join('')}
          </div>
          <div class="dest-card__footer">
            <div class="dest-card__rating">
              ${renderStars(dest.rating)}
              <span>${dest.rating} (${dest.reviews.toLocaleString()} reviews)</span>
            </div>
            <button class="btn btn--primary btn--sm dest-card__btn" onclick="navigateTo404(this)" data-dest-id="${dest.id}">
              Explore Now <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.AOS) AOS.refresh();
}

function getDestGradient(id) {
  const gradients = [
    'linear-gradient(135deg,#2D6A4F,#52B788)',
    'linear-gradient(135deg,#B5838D,#E5989B)',
    'linear-gradient(135deg,#0096C7,#00B4D8)',
    'linear-gradient(135deg,#E07C5B,#F4A261)',
    'linear-gradient(135deg,#F72585,#B5179E)',
    'linear-gradient(135deg,#2D3561,#4A4E8C)',
  ];
  return gradients[(id - 1) % gradients.length];
}

// ─────────────────────────────────────────────────────────────
//  Hotel Cards
// ─────────────────────────────────────────────────────────────
function renderHotels(data) {
  const grid = document.getElementById('hotels-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = `<div class="no-results"><span class="no-results-icon"><i class="fa-solid fa-hotel"></i></span><p>No hotels match your filters. Try adjusting them.</p></div>`;
    return;
  }

  const wishlist = getWishlist();

  data.forEach((hotel, index) => {
    const isWishlisted = wishlist.includes(hotel.id);
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.dataset.id = hotel.id;
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = String((index % 4) * 80);
    card.innerHTML = `
      <div class="hotel-card__img-wrap" style="background:${hotel.imageFallback}">
        <img src="${hotel.image}" alt="${hotel.name}" class="hotel-card__img" loading="lazy"
          onerror="this.style.display='none';">
        <span class="hotel-card__badge" style="background:${hotel.badgeColor}">${hotel.badge}</span>
        <button class="hotel-card__wish ${isWishlisted ? 'active' : ''}" 
          onclick="toggleWishlist(${hotel.id})" 
          aria-label="${isWishlisted ? 'Remove from' : 'Add to'} wishlist"
          id="wish-btn-${hotel.id}">
          ${isWishlisted ? '<i class="fa-solid fa-heart" style="color:#EF4444"></i>' : '<i class="fa-regular fa-heart"></i>'}
        </button>
      </div>
      <div class="hotel-card__body">
        <div class="hotel-card__stars">${renderHotelStars(hotel.stars)}</div>
        <h3 class="hotel-card__name">${hotel.name}</h3>
        <p class="hotel-card__location"><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
        <p class="hotel-card__desc">${hotel.description}</p>
        <div class="hotel-card__amenities">
          ${hotel.amenities.slice(0, 4).map(a => `<span class="amenity-chip">${getAmenityIcon(a)} ${a}</span>`).join('')}
          ${hotel.amenities.length > 4 ? `<span class="amenity-chip amenity-chip--more">+${hotel.amenities.length - 4} more</span>` : ''}
        </div>
        <div class="hotel-card__footer">
          <div class="hotel-card__rating">
            ${renderStars(hotel.rating)}
            <span class="rating-num">${hotel.rating}</span>
            <span class="rating-count">(${hotel.reviews.toLocaleString()})</span>
          </div>
          <div class="hotel-card__price">
            <span class="price-amount">$${hotel.pricePerNight}</span>
            <span class="price-label">/night</span>
          </div>
        </div>
        <button class="btn btn--primary hotel-card__book-btn" onclick="navigateTo404(this)">
          Book Now
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.AOS) AOS.refresh();
}

function getAmenityIcon(amenity) {
  const icons = {
    'Pool': '<i class="fa-solid fa-water-ladder"></i>',
    'Spa': '<i class="fa-solid fa-spa"></i>',
    'Free WiFi': '<i class="fa-solid fa-wifi"></i>',
    'WiFi': '<i class="fa-solid fa-wifi"></i>',
    'Beach Access': '<i class="fa-solid fa-umbrella-beach"></i>',
    'Restaurant': '<i class="fa-solid fa-utensils"></i>',
    'Gym': '<i class="fa-solid fa-dumbbell"></i>',
    'Bar': '<i class="fa-solid fa-martini-glass-citrus"></i>',
    'Concierge': '<i class="fa-solid fa-bell-concierge"></i>',
    'Valet Parking': '<i class="fa-solid fa-car"></i>',
    'City View': '<i class="fa-solid fa-city"></i>',
    'Rooftop Pool': '<i class="fa-solid fa-water-ladder"></i>',
    'Sky Bar': '<i class="fa-solid fa-martini-glass"></i>',
    'Business Center': '<i class="fa-solid fa-briefcase"></i>',
    'Onsen Bath': '<i class="fa-solid fa-hot-tub-person"></i>',
    'Tea Ceremony': '<i class="fa-solid fa-mug-hot"></i>',
    'Zen Garden': '<i class="fa-solid fa-seedling"></i>',
    'Traditional Meals': '<i class="fa-solid fa-bowl-food"></i>',
    'Overwater Villa': '<i class="fa-solid fa-water"></i>',
    'Glass Floor': '<i class="fa-solid fa-gem"></i>',
    'Snorkeling': '<i class="fa-solid fa-person-swimming"></i>',
    'Private Chef': '<i class="fa-solid fa-utensils"></i>',
    'Sunset Deck': '<i class="fa-solid fa-sun"></i>',
    'Plunge Pool': '<i class="fa-solid fa-water-ladder"></i>',
    'Caldera View': '<i class="fa-solid fa-mountain-sun"></i>',
    'Wine Cellar': '<i class="fa-solid fa-wine-glass"></i>',
    'Helicopter Pad': '<i class="fa-solid fa-helicopter"></i>',
    'Jungle View': '<i class="fa-solid fa-tree"></i>',
    'Yoga Deck': '<i class="fa-solid fa-spa"></i>',
    'Infinity Pool': '<i class="fa-solid fa-infinity"></i>',
    'Organic Restaurant': '<i class="fa-solid fa-leaf"></i>',
    'Rooftop Terrace': '<i class="fa-solid fa-building"></i>',
    'Fine Dining': '<i class="fa-solid fa-champagne-glasses"></i>',
    'Breakfast': '<i class="fa-solid fa-mug-saucer"></i>',
    'Rooftop Bar': '<i class="fa-solid fa-martini-glass"></i>',
    'Capsule Spa': '<i class="fa-solid fa-spa"></i>',
    'Champagne': '<i class="fa-solid fa-champagne-glasses"></i>',
    'Private Beach': '<i class="fa-solid fa-umbrella-beach"></i>',
    'Helicopter': '<i class="fa-solid fa-helicopter"></i>'
  };
  return icons[amenity] || '<i class="fa-solid fa-check"></i>';
}

// ─────────────────────────────────────────────────────────────
//  Offers / Promo Cards
// ─────────────────────────────────────────────────────────────
function renderOffers(data) {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.forEach((offer, index) => {
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.dataset.aos = 'zoom-in';
    card.dataset.aosDelay = String(index * 150);
    card.innerHTML = `
      <div class="offer-card__inner" style="background:${offer.gradient}">
        <div class="offer-card__icon">${offer.icon}</div>
        <div class="offer-card__discount">${offer.discount}</div>
        <h3 class="offer-card__title">${offer.title}</h3>
        <p class="offer-card__desc">${offer.description}</p>
        <div class="offer-card__meta">
          <span><i class="fa-solid fa-circle-check"></i> Valid for: ${offer.validFor}</span>
          <span><i class="fa-solid fa-credit-card"></i> Min. spend: ${offer.minSpend}</span>
          <span><i class="fa-solid fa-calendar-days"></i> Expires: ${formatDate(offer.expiry)}</span>
        </div>
        <div class="offer-card__coupon">
          <span class="coupon-code" id="coupon-${offer.id}">${offer.code}</span>
          <button class="coupon-copy-btn" onclick="copyCoupon('${offer.code}', ${offer.id})" id="copy-btn-${offer.id}">
            <span class="copy-icon"><i class="fa-regular fa-copy"></i></span> Copy Code
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
//  Features / Why Choose Us
// ─────────────────────────────────────────────────────────────
function renderFeatures(data) {
  const grid = document.getElementById('features-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.forEach((feat, index) => {
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = String((index % 3) * 100);
    card.innerHTML = `
      <div class="feature-card__icon">${feat.icon}</div>
      <h3 class="feature-card__title">${feat.title}</h3>
      <p class="feature-card__desc">${feat.description}</p>
    `;
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
//  Testimonials
// ─────────────────────────────────────────────────────────────
function renderTestimonials(data) {
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  track.innerHTML = '';

  data.forEach(t => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-card__quote">"</div>
        <p class="testimonial-card__text">${t.review}</p>
        <div class="testimonial-card__rating">${renderStars(t.rating)}</div>
        <div class="testimonial-card__author">
          <div class="testimonial-avatar" style="background:${t.avatarColor}">
            ${t.initials}
          </div>
          <div class="testimonial-info">
            <span class="testimonial-name">${t.name} ${t.flag}</span>
            <span class="testimonial-meta">${t.country} · ${t.destination}</span>
            <span class="testimonial-date">${t.date}</span>
          </div>
        </div>
      </div>
    `;
    track.appendChild(slide);
  });
}

// ─────────────────────────────────────────────────────────────
//  Stats
// ─────────────────────────────────────────────────────────────
function renderStats(data) {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.forEach((stat, index) => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.dataset.aos = 'zoom-in';
    item.dataset.aosDelay = String(index * 100);
    item.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    grid.appendChild(item);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
