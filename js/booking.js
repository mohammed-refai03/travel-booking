// ============================================================
//  booking.js — Date validation, guest/room picker, price estimation
// ============================================================

let bookingState = {
  destination: null,
  hotel: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
  basePrice: 0
};

// ─────────────────────────────────────────────────────────────
//  Date Picker Initialisation (Hero + Hotels Toolbar Synced)
// ─────────────────────────────────────────────────────────────
function initDatePickers() {
  const pairs = [
    { inEl: document.getElementById('check-in-date'), outEl: document.getElementById('check-out-date') },
    { inEl: document.getElementById('hotel-check-in'), outEl: document.getElementById('hotel-check-out') }
  ].filter(p => p.inEl && p.outEl);

  if (pairs.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateInput(today);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  bookingState.checkIn  = tomorrow;
  bookingState.checkOut = dayAfter;

  pairs.forEach(({ inEl, outEl }) => {
    inEl.min    = todayStr;
    outEl.min   = formatDateInput(tomorrow);
    inEl.value  = formatDateInput(tomorrow);
    outEl.value = formatDateInput(dayAfter);

    inEl.addEventListener('change', () => handleCheckInChange(inEl, outEl, pairs, today, todayStr));
    outEl.addEventListener('change', () => handleCheckOutChange(inEl, outEl, pairs));
  });

  updateStaySummary();
  updatePriceEstimate();
}

function handleCheckInChange(inEl, outEl, pairs, today, todayStr) {
  const selectedIn = parseLocalDate(inEl.value);
  if (!selectedIn) return;

  if (selectedIn < today) {
    showFieldError(inEl, 'Check-in cannot be in the past.');
    inEl.value = formatDateInput(bookingState.checkIn || today);
    return;
  }

  clearFieldError(inEl);
  bookingState.checkIn = selectedIn;

  const nextDay = new Date(selectedIn);
  nextDay.setDate(selectedIn.getDate() + 1);

  if (!bookingState.checkOut || bookingState.checkOut <= selectedIn) {
    bookingState.checkOut = nextDay;
  }

  syncAllDateInputs(pairs, formatDateInput(nextDay));
  updateStaySummary();
  updatePriceEstimate();
}

function handleCheckOutChange(inEl, outEl, pairs) {
  const selectedOut = parseLocalDate(outEl.value);
  const selectedIn  = parseLocalDate(inEl.value);
  if (!selectedOut || !selectedIn) return;

  if (selectedOut <= selectedIn) {
    showFieldError(outEl, 'Check-out must be after check-in.');
    const nextDay = new Date(selectedIn);
    nextDay.setDate(selectedIn.getDate() + 1);
    bookingState.checkOut = nextDay;
    syncAllDateInputs(pairs, formatDateInput(nextDay));
    updateStaySummary();
    updatePriceEstimate();
    return;
  }

  clearFieldError(outEl);
  bookingState.checkOut = selectedOut;
  syncAllDateInputs(pairs);
  updateStaySummary();
  updatePriceEstimate();
}

function syncAllDateInputs(pairs, minOutStr) {
  const inStr  = bookingState.checkIn ? formatDateInput(bookingState.checkIn) : '';
  const outStr = bookingState.checkOut ? formatDateInput(bookingState.checkOut) : '';
  pairs.forEach(({ inEl, outEl }) => {
    if (inEl.value !== inStr) inEl.value = inStr;
    if (minOutStr) outEl.min = minOutStr;
    if (outEl.value !== outStr) outEl.value = outStr;
  });

  const mci = document.getElementById('modal-checkin');
  const mco = document.getElementById('modal-checkout');
  if (mci) mci.value = inStr;
  if (mco) mco.value = outStr;
}

function parseLocalDate(val) {
  if (!val) return null;
  const parts = val.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function showFieldError(input, msg) {
  clearFieldError(input);
  input.classList.add('input--error');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = msg;
  input.parentElement.appendChild(err);
}

function clearFieldError(input) {
  input.classList.remove('input--error');
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

// ─────────────────────────────────────────────────────────────
//  Guest & Room Picker (Hero + Hotels Toolbar Synced)
// ─────────────────────────────────────────────────────────────
function initGuestPicker() {
  const counterGroups = [
    { key: 'adults',   min: 1, max: 10, initial: 2, ids: [
      ['adults-count', 'adults-decrease', 'adults-increase'],
      ['hotel-adults-count', 'hotel-adults-decrease', 'hotel-adults-increase']
    ]},
    { key: 'children', min: 0, max: 8,  initial: 0, ids: [
      ['children-count', 'children-decrease', 'children-increase'],
      ['hotel-children-count', 'hotel-children-decrease', 'hotel-children-increase']
    ]},
    { key: 'rooms',    min: 1, max: 5,  initial: 1, ids: [
      ['rooms-count', 'rooms-decrease', 'rooms-increase'],
      ['hotel-rooms-count', 'hotel-rooms-decrease', 'hotel-rooms-increase']
    ]}
  ];

  counterGroups.forEach(group => {
    group.ids.forEach(([displayId, decBtnId, incBtnId]) => {
      setupCounter(group.key, displayId, decBtnId, incBtnId, group.min, group.max, group.initial, counterGroups);
    });
  });

  updateGuestDisplay();
  updateStaySummary();
}

function setupCounter(key, displayId, decBtnId, incBtnId, min, max, initial, allGroups) {
  const display = document.getElementById(displayId);
  const decBtn  = document.getElementById(decBtnId);
  const incBtn  = document.getElementById(incBtnId);
  if (!display || !decBtn || !incBtn) return;

  display.textContent = initial;
  updateCounterBtns(initial, decBtn, incBtn, min, max);

  decBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bookingState[key] > min) {
      bookingState[key] -= 1;
      syncAllCounters(key, min, max, allGroups);
      updateGuestDisplay();
      updateStaySummary();
      updatePriceEstimate();
    }
  });

  incBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bookingState[key] < max) {
      bookingState[key] += 1;
      syncAllCounters(key, min, max, allGroups);
      updateGuestDisplay();
      updateStaySummary();
      updatePriceEstimate();
    }
  });
}

function syncAllCounters(key, min, max, allGroups) {
  const group = allGroups.find(g => g.key === key);
  if (!group) return;
  const val = bookingState[key];
  group.ids.forEach(([displayId, decBtnId, incBtnId]) => {
    const display = document.getElementById(displayId);
    const decBtn  = document.getElementById(decBtnId);
    const incBtn  = document.getElementById(incBtnId);
    if (display) display.textContent = val;
    if (decBtn && incBtn) updateCounterBtns(val, decBtn, incBtn, min, max);
  });
}

function updateCounterBtns(val, decBtn, incBtn, min, max) {
  decBtn.disabled = val <= min;
  incBtn.disabled = val >= max;
}

function updateGuestDisplay() {
  const { adults, children, rooms } = bookingState;
  const text = `${adults} Adult${adults !== 1 ? 's' : ''}${children ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}, ${rooms} Room${rooms !== 1 ? 's' : ''}`;
  ['guest-display', 'hotel-guest-display'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

function getSelectedNights() {
  if (!bookingState.checkIn || !bookingState.checkOut) return 1;
  return Math.max(1, Math.round((bookingState.checkOut - bookingState.checkIn) / (1000 * 60 * 60 * 24)));
}

function updateStaySummary() {
  const summaryEl = document.getElementById('hotel-stay-summary');
  if (!summaryEl) return;
  const nights = getSelectedNights();
  const guests = bookingState.adults + bookingState.children;
  summaryEl.textContent = `${nights} Night${nights !== 1 ? 's' : ''} · ${guests} Guest${guests !== 1 ? 's' : ''} · ${bookingState.rooms} Room${bookingState.rooms !== 1 ? 's' : ''}`;
}

// ─────────────────────────────────────────────────────────────
//  Dynamic Price Estimation
// ─────────────────────────────────────────────────────────────
function updatePriceEstimate() {
  const { checkIn, checkOut, adults, children, rooms, basePrice } = bookingState;
  if (!checkIn || !checkOut || !basePrice) {
    renderPriceBreakdown(null);
    return;
  }

  const nights = getSelectedNights();
  const guests = adults + children;

  const extraGuests   = Math.max(0, guests - (rooms * 2));
  const extraGuestFee = extraGuests * 25 * nights;
  const roomTotal     = basePrice * rooms * nights;
  const taxRate       = 0.12;
  const taxes         = Math.round((roomTotal + extraGuestFee) * taxRate);
  const grandTotal    = roomTotal + extraGuestFee + taxes;

  renderPriceBreakdown({ nights, rooms, basePrice, roomTotal, extraGuestFee, taxes, grandTotal });
}

function renderPriceBreakdown(data) {
  const panel = document.getElementById('price-estimate-panel');
  if (!panel) return;

  if (!data) {
    panel.innerHTML = '<p class="price-panel-placeholder">Select dates and guests to see your price estimate.</p>';
    return;
  }

  panel.innerHTML = `
    <div class="price-breakdown">
      <div class="price-row">
        <span>$${data.basePrice} × ${data.rooms} room${data.rooms > 1 ? 's' : ''} × ${data.nights} night${data.nights > 1 ? 's' : ''}</span>
        <span>$${data.roomTotal.toLocaleString()}</span>
      </div>
      ${data.extraGuestFee > 0 ? `
      <div class="price-row">
        <span>Extra guest fee</span>
        <span>$${data.extraGuestFee.toLocaleString()}</span>
      </div>` : ''}
      <div class="price-row">
        <span>Taxes & fees (12%)</span>
        <span>$${data.taxes.toLocaleString()}</span>
      </div>
      <div class="price-row price-row--total">
        <span>Total (${data.nights} night${data.nights > 1 ? 's' : ''})</span>
        <span class="total-amount">$${data.grandTotal.toLocaleString()}</span>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
//  Booking Redirect (Popup Modals Removed)
// ─────────────────────────────────────────────────────────────
function openBookingModal() {
  if (typeof navigateTo404 === 'function') navigateTo404(document.activeElement);
}

function openHotelBooking() {
  if (typeof navigateTo404 === 'function') navigateTo404(document.activeElement);
}

function closeBookingModal() {}

function submitBooking() {
  if (typeof navigateTo404 === 'function') navigateTo404(document.activeElement);
}
