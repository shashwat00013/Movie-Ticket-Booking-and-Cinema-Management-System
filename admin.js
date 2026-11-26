// ============================================================
//  admin.js  —  Full Admin Dashboard Logic
//  Depends on: data.js (loaded first)
// ============================================================

// ══════════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════════
function showToast(message, type) {
  type = type || 'success';
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<span class="toast-icon">' + (type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️') + '</span>' +
    '<span class="toast-msg">' + message + '</span>';
  container.appendChild(toast);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { toast.classList.add('toast-show'); });
  });
  setTimeout(function () {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
  }, 3000);
}

// ══════════════════════════════════════════════════════════════
//  CONFIRM DIALOG  (fix: always rebuild innerHTML so it's never empty)
// ══════════════════════════════════════════════════════════════
function showConfirm(message, btnLabel, onConfirm) {
  btnLabel = btnLabel || 'Yes, Delete';

  // Always create fresh — never re-use a stale DOM node
  let overlay = document.getElementById('confirm-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'confirm-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML =
    '<div class="confirm-box">' +
      '<p class="confirm-msg">' + escHtml(message) + '</p>' +
      '<div class="confirm-actions">' +
        '<button class="btn btn-delete confirm-yes">' + escHtml(btnLabel) + '</button>' +
        '<button class="btn btn-secondary confirm-no">Cancel</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function cleanup() { overlay.remove(); }

  overlay.querySelector('.confirm-yes').addEventListener('click', function () {
    cleanup();
    onConfirm();
  });
  overlay.querySelector('.confirm-no').addEventListener('click', cleanup);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) cleanup(); });
}

// ══════════════════════════════════════════════════════════════
//  COUNT-UP ANIMATION
// ══════════════════════════════════════════════════════════════
function animateCount(el, target) {
  if (!el) return;
  const prefix = el.dataset.prefix || '';
  const start  = 0;
  const steps  = 30;
  let   i      = 0;
  const timer  = setInterval(function () {
    i++;
    el.textContent = prefix + Math.round(start + (target - start) * i / steps);
    if (i >= steps) { el.textContent = prefix + target; clearInterval(timer); }
  }, 16);
}

// ══════════════════════════════════════════════════════════════
//  DASHBOARD STATS
// ══════════════════════════════════════════════════════════════
function updateStats() {
  const movies   = Store.getMovies();
  const theaters = Store.getTheaters();
  const bookings = Store.getBookings();
  const pending  = Store.getPendingMovies();
  const revenue  = bookings.reduce(function (s, b) { return s + (b.amount || 0); }, 0);

  [
    ['stat-movies',   movies.length,   ''],
    ['stat-theaters', theaters.length, ''],
    ['stat-bookings', bookings.length, ''],
    ['stat-revenue',  revenue,         '₹'],
    ['stat-pending',  pending.length,  '']
  ].forEach(function (row) {
    var el = document.getElementById(row[0]);
    if (!el) return;
    el.dataset.prefix = row[2];
    animateCount(el, row[1]);
  });
}

// ══════════════════════════════════════════════════════════════
//  PENDING MOVIE SUBMISSIONS  (Vendor → Admin review)
// ══════════════════════════════════════════════════════════════
function renderPendingMoviesTable() {
  const list    = Store.getPendingMovies();
  const tbody   = document.getElementById('pending-tbody');
  const emptyEl = document.getElementById('pending-empty');
  const badge   = document.getElementById('pending-badge');

  if (!tbody) return;
  tbody.innerHTML = '';

  // Update sidebar badge
  if (badge) {
    badge.textContent = list.length > 0 ? list.length : '';
    badge.style.display = list.length > 0 ? 'inline-block' : 'none';
  }

  if (list.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  list.forEach(function (m) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + escHtml(m.title) + '</strong></td>' +
      '<td><span class="genre-badge badge-' + (m.genre || '').toLowerCase().replace(/[^a-z]/g,'') + '">' + escHtml(m.genre) + '</span></td>' +
      '<td>' + (m.duration || '—') + ' min</td>' +
      '<td>' + escHtml(m.language || '—') + '</td>' +
      '<td><span class="vendor-name">🏢 ' + escHtml(m.vendorName || 'Unknown') + '</span></td>' +
      '<td>' + formatDate(m.submittedAt) + '</td>' +
      '<td>' +
        '<div class="action-buttons">' +
          '<button class="btn btn-approve" onclick="approveMovie(\'' + m.id + '\')">✅ Approve</button>' +
          '<button class="btn btn-delete"  onclick="rejectMovie(\'' + m.id + '\')">🗑️ Reject</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });

  updateStats();
}

function approveMovie(id) {
  const pending = Store.getPendingMovies().find(function (m) { return m.id === id; });
  if (!pending) return;
  showConfirm('Approve "' + pending.title + '" and add it to the live movie list?', '✅ Yes, Approve', function () {
    Store.approveMovie(id);
    renderPendingMoviesTable();
    renderApprovedMoviesTable();
    showToast('"' + pending.title + '" approved and is now live! 🎬', 'success');
    updateStats();
  });
}

function rejectMovie(id) {
  const pending = Store.getPendingMovies().find(function (m) { return m.id === id; });
  if (!pending) return;
  showConfirm('Reject and delete "' + pending.title + '"? This cannot be undone.', '🗑️ Yes, Reject', function () {
    Store.rejectPendingMovie(id);
    renderPendingMoviesTable();
    showToast('"' + pending.title + '" submission rejected.', 'error');
    updateStats();
  });
}

// ══════════════════════════════════════════════════════════════
//  APPROVED MOVIES TABLE  (view + delete only)
// ══════════════════════════════════════════════════════════════
function renderApprovedMoviesTable() {
  const movies  = Store.getMovies();
  const tbody   = document.getElementById('approved-tbody');
  const emptyEl = document.getElementById('approved-empty');

  if (!tbody) return;
  tbody.innerHTML = '';

  if (movies.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  movies.forEach(function (m) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + escHtml(m.title) + '</strong></td>' +
      '<td><span class="genre-badge badge-' + (m.genre || '').toLowerCase().replace(/[^a-z]/g,'') + '">' + escHtml(m.genre) + '</span></td>' +
      '<td>' + (m.duration || '—') + ' min</td>' +
      '<td>' + escHtml(m.language || '—') + '</td>' +
      '<td>' + escHtml(m.vendorName || 'Direct') + '</td>' +
      '<td><span class="status-badge status-approved">✅ Live</span></td>' +
      '<td>' +
        '<div class="action-buttons">' +
          '<button class="btn btn-delete" onclick="deleteApprovedMovie(\'' + m.id + '\')">🗑️ Remove</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function deleteApprovedMovie(id) {
  const movie = Store.getMovies().find(function (m) { return m.id === id; });
  if (!movie) return;
  showConfirm('Remove "' + movie.title + '" from the live list?', '🗑️ Yes, Remove', function () {
    const movies = Store.getMovies().filter(function (m) { return m.id !== id; });
    Store.saveMovies(movies);
    renderApprovedMoviesTable();
    showToast('"' + movie.title + '" removed from live list.', 'error');
    updateStats();
  });
}

// ══════════════════════════════════════════════════════════════
//  THEATERS CRUD + MAP GRID
// ══════════════════════════════════════════════════════════════
let editingTheaterId = null;

const CITY_EMOJIS = {
  mumbai: '🌊', delhi: '🏛️', bangalore: '🌸', chennai: '🌴',
  kolkata: '🎭', hyderabad: '💎', pune: '🌿', ahmedabad: '🏺',
  jaipur: '🏰', default: '🏙️'
};

function getCityEmoji(city) {
  return CITY_EMOJIS[(city || '').toLowerCase()] || CITY_EMOJIS['default'];
}

function renderTheatersTable() {
  const theaters = Store.getTheaters();
  const tbody    = document.getElementById('theaters-tbody');
  const emptyEl  = document.getElementById('theaters-empty');

  if (!tbody) return;
  tbody.innerHTML = '';

  if (theaters.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    renderTheaterMap([]);
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  theaters.forEach(function (t) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + getCityEmoji(t.city) + ' ' + escHtml(t.name) + '</td>' +
      '<td>' + escHtml(t.city) + '</td>' +
      '<td>' + t.screens + '</td>' +
      '<td>' + t.seats + '</td>' +
      '<td>' +
        '<div class="action-buttons">' +
          '<button class="btn btn-edit"   onclick="editTheater(\'' + t.id + '\')">✏️ Edit</button>' +
          '<button class="btn btn-delete" onclick="deleteTheater(\'' + t.id + '\')">🗑️ Delete</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });

  renderTheaterMap(theaters);
  updateStats();
}

function renderTheaterMap(theaters) {
  const grid = document.getElementById('theater-map-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (theaters.length === 0) {
    grid.innerHTML = '<p class="map-empty">No theaters added yet. Add one above! 🏢</p>';
    return;
  }

  const byCity = {};
  theaters.forEach(function (t) {
    const city = (t.city || 'Unknown').trim();
    if (!byCity[city]) byCity[city] = [];
    byCity[city].push(t);
  });

  Object.keys(byCity).forEach(function (city) {
    const sec = document.createElement('div');
    sec.className = 'map-city-section';
    sec.innerHTML =
      '<h4 class="map-city-label">' + getCityEmoji(city) + ' ' + escHtml(city) + '</h4>' +
      '<div class="map-cards"></div>';
    grid.appendChild(sec);
    const cards = sec.querySelector('.map-cards');
    byCity[city].forEach(function (t) {
      const card = document.createElement('div');
      card.className = 'theater-map-card';
      card.innerHTML =
        '<div class="tmc-icon">🏢</div>' +
        '<div class="tmc-name">' + escHtml(t.name) + '</div>' +
        '<div class="tmc-detail">📽️ ' + t.screens + ' Screen' + (t.screens !== 1 ? 's' : '') + '</div>' +
        '<div class="tmc-detail">💺 ' + t.seats + ' Seats</div>' +
        '<div class="tmc-actions">' +
          '<button class="btn btn-edit tmc-btn"   onclick="editTheater(\'' + t.id + '\')">✏️</button>' +
          '<button class="btn btn-delete tmc-btn" onclick="deleteTheater(\'' + t.id + '\')">🗑️</button>' +
        '</div>';
      cards.appendChild(card);
    });
  });
}

function editTheater(id) {
  const t = Store.getTheaters().find(function (t) { return t.id === id; });
  if (!t) return;
  editingTheaterId = id;
  document.getElementById('theaterName').value    = t.name;
  document.getElementById('theaterCity').value    = t.city;
  document.getElementById('theaterScreens').value = t.screens;
  document.getElementById('theaterSeats').value   = t.seats;
  document.getElementById('theater-form-heading').textContent = '✏️ Edit Theater';
  document.getElementById('theater-save-btn').textContent     = 'Update Theater';
  document.getElementById('theater-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.location.hash = '#theaters';
}

function deleteTheater(id) {
  const t = Store.getTheaters().find(function (t) { return t.id === id; });
  if (!t) return;
  showConfirm('Delete "' + t.name + '"? This cannot be undone.', '🗑️ Yes, Delete', function () {
    Store.saveTheaters(Store.getTheaters().filter(function (x) { return x.id !== id; }));
    renderTheatersTable();
    showToast('Theater deleted!', 'error');
  });
}

function resetTheaterForm() {
  editingTheaterId = null;
  document.getElementById('theaterAdminForm').reset();
  document.getElementById('theater-form-heading').textContent = 'Add New Theater';
  document.getElementById('theater-save-btn').textContent     = 'Save Theater';
}

function initTheatersSection() {
  const form = document.getElementById('theaterAdminForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('theaterName').value.trim();
    const city    = document.getElementById('theaterCity').value.trim();
    const screens = parseInt(document.getElementById('theaterScreens').value) || 1;
    const seats   = parseInt(document.getElementById('theaterSeats').value) || 0;
    if (!name) { showToast('Theater name is required.', 'error'); return; }
    if (!city) { showToast('City is required.', 'error'); return; }
    const theaters = Store.getTheaters();
    if (editingTheaterId) {
      const idx = theaters.findIndex(function (t) { return t.id === editingTheaterId; });
      if (idx !== -1) theaters[idx] = { id: editingTheaterId, name: name, city: city, screens: screens, seats: seats };
      Store.saveTheaters(theaters);
      showToast('Theater updated! 🏢', 'success');
      resetTheaterForm();
    } else {
      theaters.push({ id: Store.generateId('t'), name: name, city: city, screens: screens, seats: seats });
      Store.saveTheaters(theaters);
      showToast('Theater added! 🏢', 'success');
      form.reset();
    }
    renderTheatersTable();
  });
  document.getElementById('theater-clear-btn').addEventListener('click', resetTheaterForm);
  renderTheatersTable();
}

// ══════════════════════════════════════════════════════════════
//  BOOKINGS TABLE
// ══════════════════════════════════════════════════════════════
function renderBookingsTable() {
  const bookings = Store.getBookings();
  const tbody    = document.getElementById('bookings-tbody');
  const emptyEl  = document.getElementById('bookings-empty');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (bookings.length === 0) { if (emptyEl) emptyEl.style.display = 'block'; return; }
  if (emptyEl) emptyEl.style.display = 'none';
  bookings.forEach(function (b) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td><code>' + escHtml(b.id || '—') + '</code></td>' +
      '<td>' + escHtml(b.movie || '—') + '</td>' +
      '<td>' + escHtml(b.theater || '—') + '</td>' +
      '<td>' + escHtml(b.customer || '—') + '</td>' +
      '<td>' + escHtml(String(b.seats || '—')) + '</td>' +
      '<td>₹' + (b.amount || 0) + '</td>';
    tbody.appendChild(tr);
  });
}

// ══════════════════════════════════════════════════════════════
//  UTILITY
// ══════════════════════════════════════════════════════════════
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch (e) { return iso; }
}

function checkAdminSession() {
  const session = Store.getSession();
  if (!session || session.type !== 'admin') {
    // window.location.href = 'admin-login.html'; // uncomment to enforce
    return null;
  }
  return session;
}

function setAdminGreeting() {
  const session = Store.getSession();
  const el = document.getElementById('adminName');
  if (el && session) el.textContent = 'Welcome, ' + session.name + ' 👋';
}

function initLogout() {
  const btn = document.querySelector('.btn-logout');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    Store.clearSession();
    window.location.href = 'admin-login.html';
  });
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
  checkAdminSession();
  setAdminGreeting();
  initLogout();
  updateStats();
  renderPendingMoviesTable();
  renderApprovedMoviesTable();
  initTheatersSection();
  renderBookingsTable();
});
