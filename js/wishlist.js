// ============================================================
//  wishlist.js — LocalStorage wishlist functionality
// ============================================================

const WISHLIST_KEY = 'travelWishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function toggleWishlist(hotelId) {
  const list = getWishlist();
  const idx  = list.indexOf(hotelId);
  const isAdding = idx === -1;

  if (isAdding) {
    list.push(hotelId);
  } else {
    list.splice(idx, 1);
  }

  saveWishlist(list);
  updateWishlistBadge(list.length);

  // Update button in card
  const btn = document.getElementById(`wish-btn-${hotelId}`);
  if (btn) {
    btn.innerHTML = isAdding ? '<i class="fa-solid fa-heart" style="color:#EF4444"></i>' : '<i class="fa-regular fa-heart"></i>';
    btn.classList.toggle('active', isAdding);
    btn.setAttribute('aria-label', (isAdding ? 'Remove from' : 'Add to') + ' wishlist');

    // Pulse animation
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 500);
  }
}

function updateWishlistBadge(count) {
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  const hotelCount = document.getElementById('hotel-wishlist-count');
  if (hotelCount) {
    hotelCount.textContent = count;
  }
}

function initWishlist() {
  const list = getWishlist();
  updateWishlistBadge(list.length);
}

function openWishlistPanel() {
  const panel = document.getElementById('wishlist-panel');
  const overlay = document.getElementById('wishlist-overlay');
  if (!panel) return;

  const list = getWishlist();
  const wishlistedHotels = HOTELS.filter(h => list.includes(h.id));

  const content = document.getElementById('wishlist-content');
  if (!content) return;

  if (wishlistedHotels.length === 0) {
    content.innerHTML = `
      <div class="wishlist-empty">
        <span class="wishlist-empty-icon"><i class="fa-regular fa-heart"></i></span>
        <h3>Your wishlist is empty</h3>
        <p>Click the heart icon on any hotel to save it here.</p>
      </div>
    `;
  } else {
    content.innerHTML = wishlistedHotels.map(h => `
      <div class="wishlist-item">
        <div class="wishlist-item__img" style="background:${h.imageFallback}">
          <img src="${h.image}" alt="${h.name}" onerror="this.style.display='none'" loading="lazy">
        </div>
        <div class="wishlist-item__info">
          <h4>${h.name}</h4>
          <p><i class="fa-solid fa-location-dot"></i> ${h.location}</p>
          <span class="wishlist-item__price">$${h.pricePerNight}/night</span>
        </div>
        <div class="wishlist-item__actions">
          <button class="btn btn--primary btn--sm" onclick="closeWishlistPanel(); navigateTo404(null);">Book</button>
          <button class="wishlist-item__remove" aria-label="Remove ${h.name} from wishlist" onclick="toggleWishlist(${h.id}); openWishlistPanel();"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    `).join('');
  }

  panel.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.documentElement.classList.add('nav-locked');
  document.body.classList.add('nav-locked');
}

function closeWishlistPanel() {
  const panel = document.getElementById('wishlist-panel');
  const overlay = document.getElementById('wishlist-overlay');
  if (panel) panel.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.documentElement.classList.remove('nav-locked');
  document.body.classList.remove('nav-locked');
}
