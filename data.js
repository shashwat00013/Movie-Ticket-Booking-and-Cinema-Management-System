// ============================================================
//  data.js  —  Shared localStorage Store for CinemaHub
// ============================================================

const Store = {

  // ── USERS ──────────────────────────────────────────────────
  getUsers() {
    return JSON.parse(localStorage.getItem('ch_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('ch_users', JSON.stringify(users));
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  findUser(username, password) {
    return this.getUsers().find(
      u => u.username === username && u.password === password
    ) || null;
  },
  usernameExists(username) {
    return this.getUsers().some(u => u.username === username);
  },
  emailExists(email) {
    return this.getUsers().some(u => u.email === email);
  },

  // ── ADMINS ─────────────────────────────────────────────────
  getAdmins() {
    return JSON.parse(localStorage.getItem('ch_admins') || '[]');
  },
  saveAdmins(admins) {
    localStorage.setItem('ch_admins', JSON.stringify(admins));
  },
  findAdmin(username, password) {
    return this.getAdmins().find(
      a => a.username === username && a.password === password
    ) || null;
  },
  adminUsernameExists(username) {
    return this.getAdmins().some(a => a.username === username);
  },

  // ── APPROVED MOVIES ────────────────────────────────────────
  getMovies() {
    return JSON.parse(localStorage.getItem('ch_movies') || '[]');
  },
  saveMovies(movies) {
    localStorage.setItem('ch_movies', JSON.stringify(movies));
  },

  // ── PENDING MOVIE SUBMISSIONS (from Vendor Portal) ─────────
  getPendingMovies() {
    return JSON.parse(localStorage.getItem('ch_pending_movies') || '[]');
  },
  savePendingMovies(list) {
    localStorage.setItem('ch_pending_movies', JSON.stringify(list));
  },
  // Move a pending movie → approved movies
  approveMovie(id) {
    const pending = this.getPendingMovies();
    const idx = pending.findIndex(m => m.id === id);
    if (idx === -1) return false;
    const movie = Object.assign({}, pending[idx], { status: 'approved', approvedAt: new Date().toISOString() });
    pending.splice(idx, 1);
    this.savePendingMovies(pending);
    const approved = this.getMovies();
    approved.push(movie);
    this.saveMovies(approved);
    return movie;
  },
  rejectPendingMovie(id) {
    const pending = this.getPendingMovies().filter(m => m.id !== id);
    this.savePendingMovies(pending);
  },

  // ── THEATERS ───────────────────────────────────────────────
  getTheaters() {
    return JSON.parse(localStorage.getItem('ch_theaters') || '[]');
  },
  saveTheaters(theaters) {
    localStorage.setItem('ch_theaters', JSON.stringify(theaters));
  },

  // ── BOOKINGS (written by Feature 2) ────────────────────────
  getBookings() {
    return JSON.parse(localStorage.getItem('ch_bookings') || '[]');
  },

  // ── SESSION ────────────────────────────────────────────────
  getSession() {
    return JSON.parse(sessionStorage.getItem('ch_session') || 'null');
  },
  setSession(data) {
    sessionStorage.setItem('ch_session', JSON.stringify(data));
  },
  clearSession() {
    sessionStorage.removeItem('ch_session');
  },

  // ── SEED DEMO DATA ─────────────────────────────────────────
  seedIfEmpty() {
    if (this.getAdmins().length === 0) {
      this.saveAdmins([
        { id: 'a1', name: 'Admin', username: 'admin', email: 'admin@gmail.com', password: 'Admin@123' }
      ]);
    }

    if (this.getMovies().length === 0) {
      this.saveMovies([
        { id: 'm1', title: 'Kalki 2898-AD', genre: 'Sci-Fi',  duration: 181, language: 'Telugu', description: 'An epic sci-fi set in a dystopian future.', vendorName: 'Sun Pictures',    submittedAt: '2024-06-01', status: 'approved' },
        { id: 'm2', title: 'Animal',        genre: 'Action',  duration: 201, language: 'Hindi',  description: 'A raw saga of a son and his father.',    vendorName: 'T-Series Films',   submittedAt: '2024-05-10', status: 'approved' },
        { id: 'm3', title: 'Stree 2',       genre: 'Horror',  duration: 139, language: 'Hindi',  description: 'The legend of Stree returns.',           vendorName: 'Maddock Films',    submittedAt: '2024-04-20', status: 'approved' }
      ]);
    }

    // Seed pending movie submissions (simulating vendor portal)
    if (this.getPendingMovies().length === 0) {
      this.savePendingMovies([
        { id: 'p1', title: 'Pushpa 2',       genre: 'Action',  duration: 185, language: 'Telugu', description: 'The rise of Pushpa Raj continues.', vendorName: 'Mythri Movie Makers', submittedAt: '2024-11-01', status: 'pending' },
        { id: 'p2', title: 'Jigra',          genre: 'Drama',   duration: 158, language: 'Hindi',  description: 'A sister fights for her brother.', vendorName: 'Dharma Productions',  submittedAt: '2024-11-10', status: 'pending' },
        { id: 'p3', title: 'Singham Again',  genre: 'Action',  duration: 174, language: 'Hindi',  description: 'Singham is back — bigger and bolder.', vendorName: 'Reliance Entertainment', submittedAt: '2024-11-15', status: 'pending' }
      ]);
    }

    if (this.getTheaters().length === 0) {
      this.saveTheaters([
        { id: 't1', name: 'PVR Phoenix',    city: 'Mumbai',    screens: 6, seats: 1800 },
        { id: 't2', name: 'INOX Connaught', city: 'Delhi',     screens: 4, seats: 1200 },
        { id: 't3', name: 'Cinepolis Forum',city: 'Bangalore', screens: 5, seats: 1500 }
      ]);
    }
  },

  generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }
};

Store.seedIfEmpty();
