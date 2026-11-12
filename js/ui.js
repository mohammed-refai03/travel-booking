// ============================================================
//  ui.js — Testimonial slider, mobile nav, coupon copy,
//           newsletter, sticky header, smooth scroll, counters
// ============================================================

// ─────────────────────────────────────────────────────────────
//  404 Navigation With Exact Section Memory
// ─────────────────────────────────────────────────────────────
function getViewportSectionId() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  let currentId = 'hero';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 160) {
      currentId = sec.id;
    }
  });
  return currentId;
}

function navigateTo404(triggerEl) {
  let sectionId = '';
  if (triggerEl && typeof triggerEl.closest === 'function') {
    const insideModalOrFixed = triggerEl.closest('#booking-modal, #wishlist-panel, #main-header, #mobile-nav-menu');
    if (!insideModalOrFixed) {
      const parentSection = triggerEl.closest('section[id], footer[id]');
      if (parentSection) sectionId = parentSection.id;
    }
  }
  if (!sectionId) {
    sectionId = getViewportSectionId();
  }

  const scrollY = Math.round(window.scrollY);
  try {
    sessionStorage.setItem('stackly_return_section', sectionId);
    sessionStorage.setItem('stackly_return_scrollY', String(scrollY));
  } catch (e) {
    // Ignore storage restriction errors
  }

  window.location.href = `404.html?from=${encodeURIComponent(sectionId)}&y=${scrollY}`;
}

function showInlineError(inputEl, msg, containerEl) {
  if (inputEl) inputEl.classList.add('input--error');
  if (containerEl) {
    containerEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    return;
  }
  if (!inputEl || !inputEl.parentElement) return;
  let err = inputEl.parentElement.querySelector('.inline-form-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'inline-form-error';
    inputEl.parentElement.appendChild(err);
  }
  err.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
}

function clearInlineError(inputEl, containerEl) {
  if (inputEl) inputEl.classList.remove('input--error');
  if (containerEl) {
    containerEl.textContent = '';
    return;
  }
  if (!inputEl || !inputEl.parentElement) return;
  const err = inputEl.parentElement.querySelector('.inline-form-error');
  if (err) err.remove();
}

// ─────────────────────────────────────────────────────────────
//  Toast Notifications (Disabled per requirements)
// ─────────────────────────────────────────────────────────────
function showToast() {}

// ─────────────────────────────────────────────────────────────
//  Testimonial Slider
// ─────────────────────────────────────────────────────────────
let currentSlide = 0;
let totalSlides  = 0;
let sliderTimer  = null;

function initTestimonialSlider() {
  const track  = document.getElementById('testimonials-track');
  const dots   = document.getElementById('slider-dots');
  const prevBtn= document.getElementById('slider-prev');
  const nextBtn= document.getElementById('slider-next');
  if (!track) return;

  renderTestimonials(TESTIMONIALS);
  totalSlides = TESTIMONIALS.length;

  // Create dots
  if (dots) {
    dots.innerHTML = TESTIMONIALS.map((_, i) =>
      `<button class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-advance
  startAutoSlide();

  // Pause on hover
  const container = document.querySelector('.testimonials-slider');
  if (container) {
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
  }

  // Touch/swipe support
  let startX = 0;
  if (track) {
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
    });
  }
}

function goToSlide(index) {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoSlide() {
  stopAutoSlide();
  sliderTimer = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  if (sliderTimer) { clearInterval(sliderTimer); sliderTimer = null; }
}

// ─────────────────────────────────────────────────────────────
//  Mobile Navigation
// ─────────────────────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu   = document.getElementById('mobile-nav-menu');
  const overlay   = document.getElementById('nav-overlay');
  const closeBtn  = document.getElementById('mobile-nav-close');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  if (overlay)  overlay.addEventListener('click', closeMobileNav);

  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

function preventDrawerScroll(e) {
  const navMenu = document.getElementById('mobile-nav-menu');
  if (!navMenu || !navMenu.classList.contains('active')) return;
  if (e.type === 'keydown') {
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (keys.includes(e.key)) e.preventDefault();
    return;
  }
  if (!navMenu.contains(e.target) || navMenu.scrollHeight <= navMenu.clientHeight) {
    e.preventDefault();
  }
}

function openMobileNav() {
  const navMenu = document.getElementById('mobile-nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const hamburger = document.getElementById('hamburger-btn');
  if (navMenu) {
    navMenu.classList.add('active');
    navMenu.setAttribute('aria-hidden', 'false');
  }
  if (overlay) overlay.classList.add('active');
  if (hamburger) {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  document.documentElement.classList.add('nav-locked');
  document.body.classList.add('nav-locked');
  window.addEventListener('wheel', preventDrawerScroll, { passive: false });
  window.addEventListener('touchmove', preventDrawerScroll, { passive: false });
  window.addEventListener('keydown', preventDrawerScroll);
}

function closeMobileNav() {
  const navMenu = document.getElementById('mobile-nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const hamburger = document.getElementById('hamburger-btn');
  if (navMenu) {
    navMenu.classList.remove('active');
    navMenu.setAttribute('aria-hidden', 'true');
  }
  if (overlay) overlay.classList.remove('active');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  document.documentElement.classList.remove('nav-locked');
  document.body.classList.remove('nav-locked');
  window.removeEventListener('wheel', preventDrawerScroll);
  window.removeEventListener('touchmove', preventDrawerScroll);
  window.removeEventListener('keydown', preventDrawerScroll);
}

// ─────────────────────────────────────────────────────────────
//  Sticky Header
// ─────────────────────────────────────────────────────────────
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
//  Smooth Scroll
// ─────────────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────
//  Coupon Copy
// ─────────────────────────────────────────────────────────────
function copyCoupon(code, offerId) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => onCopied(code, offerId));
  } else {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    onCopied(code, offerId);
  }
}

function onCopied(code, offerId) {
  const btn = document.getElementById(`copy-btn-${offerId}`);
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 2500);
  }
  showToast(`<i class="fa-solid fa-check"></i> Coupon code "${code}" copied to clipboard!`, 'success');
}

// ─────────────────────────────────────────────────────────────
//  Newsletter Validation
// ─────────────────────────────────────────────────────────────
function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const input   = document.getElementById('newsletter-email');
  const errorEl = document.getElementById('newsletter-error');
  if (!form || !input) return;

  input.addEventListener('input', () => {
    clearInlineError(form, errorEl);
    input.classList.remove('input--error');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = input.value.trim();

    if (!email) {
      showInlineError(form, 'Please enter your email address.', errorEl);
      input.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showInlineError(form, 'Please enter a valid email address (e.g. name@example.com).', errorEl);
      input.focus();
      return;
    }

    clearInlineError(form, errorEl);

    const subs = JSON.parse(localStorage.getItem('travelSubscribers') || '[]');
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem('travelSubscribers', JSON.stringify(subs));
    }

    navigateTo404(form);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────────────────────
//  Animated Counters
// ─────────────────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

// ─────────────────────────────────────────────────────────────
//  Guest Picker Dropdown Toggle
// ─────────────────────────────────────────────────────────────
function initGuestPickerToggle() {
  const pairs = [
    { toggle: document.getElementById('guest-picker-toggle'), dropdown: document.getElementById('guest-picker-dropdown') },
    { toggle: document.getElementById('hotel-guest-toggle'),  dropdown: document.getElementById('hotel-guest-dropdown') }
  ].filter(p => p.toggle && p.dropdown);

  if (pairs.length === 0) return;

  pairs.forEach(({ toggle, dropdown }) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains('active');
      pairs.forEach(p => {
        p.dropdown.classList.remove('active');
        p.toggle.classList.remove('active');
        p.toggle.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        dropdown.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    pairs.forEach(({ toggle, dropdown }) => {
      if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────
//  Back to Top Button
// ─────────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────────────────────
//  Parallax hero
// ─────────────────────────────────────────────────────────────
function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(50% + ${offset * 0.4}px)`;
    }
  }, { passive: true });
}
