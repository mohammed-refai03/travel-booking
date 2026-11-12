// ============================================================
//  main.js — Application entry point
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Handle fresh reload param from 404 "Back to Home" ─────
  const urlParams = new URLSearchParams(window.location.search);
  const isFreshHome = urlParams.has('fresh');
  if (isFreshHome) {
    history.replaceState(null, '', window.location.pathname);
    window.scrollTo(0, 0);
  }

  // ── Init AOS ──────────────────────────────────────────────
  if (window.AOS) {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60
    });
  }

  // ── Render all data ───────────────────────────────────────
  renderDestinations(DESTINATIONS);
  renderHotels(HOTELS);
  renderOffers(OFFERS);
  renderFeatures(FEATURES);
  renderStats(STATS);

  // ── Init JS modules ───────────────────────────────────────
  initDestinationSearch();
  initDestinationFilters();
  initHotelFilters();
  initDatePickers();
  initGuestPicker();
  initGuestPickerToggle();
  initWishlist();
  initTestimonialSlider();
  initMobileNav();
  initStickyHeader();
  initSmoothScroll();
  initNewsletter();
  initCounters();
  initHeroParallax();

  // ── Keyboard navigation ───────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeWishlistPanel();
    }
  });

  // ── Wishlist drawer close controls ────────────────────────
  const wishlistOverlay = document.getElementById('wishlist-overlay');
  if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlistPanel);

  const wishlistClose = document.getElementById('wishlist-close');
  if (wishlistClose) wishlistClose.addEventListener('click', closeWishlistPanel);

  // ── Hero search button ────────────────────────────────────
  const searchBtn = document.getElementById('hero-search-btn');
  if (searchBtn) searchBtn.addEventListener('click', triggerSearch);

  // ── Reset hotel filters button ────────────────────────────
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetHotelFilters);

  // ── Restore exact section when returning from 404 "Go Back"
  let restoreData = null;
  try {
    const rawRestore = sessionStorage.getItem('stackly_restore_scroll');
    if (rawRestore) {
      restoreData = JSON.parse(rawRestore);
      sessionStorage.removeItem('stackly_restore_scroll');
    }
  } catch (e) {
    restoreData = null;
  }

  const hashSection = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
  const targetSectionId = (restoreData && restoreData.sectionId) || (!isFreshHome ? hashSection : '');

  if (targetSectionId) {
    const scrollToTargetSection = () => {
      const targetEl = document.getElementById(targetSectionId);
      if (restoreData && typeof restoreData.y === 'number' && restoreData.y > 0) {
        window.scrollTo({ top: restoreData.y, behavior: 'auto' });
      } else if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };
    requestAnimationFrame(() => {
      scrollToTargetSection();
      setTimeout(scrollToTargetSection, 150);
    });
  }

  // ── Loading screen ────────────────────────────────────────
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }, 850);
  }

  // ── Contact Inquiry Form (Inline Validation + 404 Route) ──
  const contactForm = document.getElementById('contact-inquiry-form');
  if (contactForm) {
    const nameEl  = document.getElementById('contact-name');
    const phoneEl = document.getElementById('contact-phone');
    const emailEl = document.getElementById('contact-email');
    const msgEl   = document.getElementById('contact-message');

    [nameEl, phoneEl, emailEl, msgEl].forEach(field => {
      if (field) {
        field.addEventListener('input', () => clearInlineError(field));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      const nameVal  = nameEl ? nameEl.value.trim() : '';
      const phoneVal = phoneEl ? phoneEl.value.trim() : '';
      const emailVal = emailEl ? emailEl.value.trim() : '';
      const msgVal   = msgEl ? msgEl.value.trim() : '';
      const digitsOnly = phoneVal.replace(/\D/g, '');

      if (!nameVal || nameVal.length < 2) {
        showInlineError(nameEl, 'Please enter your full name (at least 2 characters).');
        if (!firstInvalid) firstInvalid = nameEl;
      } else {
        clearInlineError(nameEl);
      }

      if (!phoneVal || digitsOnly.length < 10 || digitsOnly.length > 15) {
        showInlineError(phoneEl, 'Please enter a valid phone number (10 to 15 digits).');
        if (!firstInvalid) firstInvalid = phoneEl;
      } else {
        clearInlineError(phoneEl);
      }

      if (!emailVal || !isValidEmail(emailVal)) {
        showInlineError(emailEl, 'Please enter a valid email address.');
        if (!firstInvalid) firstInvalid = emailEl;
      } else {
        clearInlineError(emailEl);
      }

      if (!msgVal || msgVal.length < 10) {
        showInlineError(msgEl, 'Please enter your trip details (at least 10 characters).');
        if (!firstInvalid) firstInvalid = msgEl;
      } else {
        clearInlineError(msgEl);
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      navigateTo404(contactForm);
    });
  }

  console.log('Stackly Travel initialized successfully!');
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});
