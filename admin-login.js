// ============================================================
//  admin-login.js  —  Admin Login Logic
// ============================================================

(function () {
  const form       = document.getElementById('loginForm');
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');

  // Remove hardcoded pattern validation — JS handles it
  usernameEl.removeAttribute('pattern');
  usernameEl.removeAttribute('title');
  passwordEl.removeAttribute('pattern');
  passwordEl.removeAttribute('title');

  function setError(input, type) {
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (!username) { setError(usernameEl, 'empty'); return; }
    if (!password) { setError(passwordEl, 'empty'); return; }

    const admin = Store.findAdmin(username, password);

    if (!admin) {
      setError(usernameEl, 'invalid');
      setError(passwordEl, 'invalid');
      showToast('Invalid admin credentials.', 'error');
      return;
    }

    // Save admin session
    Store.setSession({ type: 'admin', id: admin.id, name: admin.name, username: admin.username });

    showToast('Welcome, ' + admin.name + '! 👋', 'success');

    setTimeout(function () {
      window.location.href = 'admin-dashboard.html';
    }, 1000);
  });

  usernameEl.addEventListener('input', clearErrors);
  passwordEl.addEventListener('input', clearErrors);
})();

