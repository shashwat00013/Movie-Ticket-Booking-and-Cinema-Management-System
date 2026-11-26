// ============================================================
//  login.js  —  User Login Logic
// ============================================================

(function () {
  const form       = document.getElementById('userLoginForm');
  const usernameEl = document.getElementById('userEmail');
  const passwordEl = document.getElementById('userPassword');
  const rememberEl = document.getElementById('remember');

  // Pre-fill username if "Remember me" was previously checked
  const remembered = localStorage.getItem('ch_remember_user');
  if (remembered) {
    usernameEl.value  = remembered;
    rememberEl.checked = true;
  }

  // ── Remove hardcoded pattern attributes ────────────────────
  // (HTML had pattern="admin" — we handle auth in JS now)
  usernameEl.removeAttribute('pattern');
  usernameEl.removeAttribute('title');
  passwordEl.removeAttribute('pattern');
  passwordEl.removeAttribute('title');

  // ── Custom inline error helpers ────────────────────────────
  function setError(input, type) {
    // hide all sibling errors first
    const siblings = input.parentElement.querySelectorAll('.field-error');
    siblings.forEach(el => el.style.display = 'none');
    if (type) {
      const target = input.parentElement.querySelector('.error-' + type);
      if (target) target.style.display = 'block';
    }
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
  }

  // ── Form submit ────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    // Basic empty check
    if (!username) { setError(usernameEl, 'empty'); return; }
    if (!password) { setError(passwordEl, 'empty'); return; }

    // Look up in localStorage
    const user = Store.findUser(username, password);

    if (!user) {
      // Show generic invalid on both if not found
      setError(usernameEl, 'invalid');
      setError(passwordEl, 'invalid');
      showToast('Invalid username or password.', 'error');
      return;
    }

    // Remember me
    if (rememberEl.checked) {
      localStorage.setItem('ch_remember_user', username);
    } else {
      localStorage.removeItem('ch_remember_user');
    }

    // Save session
    Store.setSession({ type: 'user', id: user.id, name: user.name, username: user.username });

    showToast('Welcome back, ' + user.name + '! 🎬', 'success');

    // Redirect to Feature 2 after toast
    setTimeout(function () {
      window.location.href = '../Feature2/index.html';
    }, 1200);
  });

  // Clear inline errors on input
  usernameEl.addEventListener('input', clearErrors);
  passwordEl.addEventListener('input', clearErrors);
})();

