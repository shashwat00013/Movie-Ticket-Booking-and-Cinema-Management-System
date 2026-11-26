// ============================================================
//  register.js  —  User Registration Logic
// ============================================================

(function () {
  const form        = document.getElementById('registerForm');
  const nameEl      = document.getElementById('regName');
  const usernameEl  = document.getElementById('regUsername');
  const emailEl     = document.getElementById('regEmail');
  const passwordEl  = document.getElementById('regPassword');
  const confirmEl   = document.getElementById('regConfirm');
  const matchError  = document.getElementById('matchError');

  // ── Inline error helpers ───────────────────────────────────
  function setFieldError(input, type) {
    const siblings = input.parentElement.querySelectorAll('.field-error');
    siblings.forEach(el => el.style.display = 'none');
    if (type) {
      const target = input.parentElement.querySelector('.error-' + type);
      if (target) target.style.display = 'block';
    }
  }

  function setCustomError(input, message) {
    // Inject or reuse a .error-custom span
    let custom = input.parentElement.querySelector('.error-custom');
    if (!custom) {
      custom = document.createElement('small');
      custom.className = 'field-error error-custom';
      input.insertAdjacentElement('afterend', custom);
    }
    custom.textContent = message;
    custom.style.display = 'block';
  }

  function clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
    matchError.style.display = 'none';
  }

  // ── Validate a single field using its HTML pattern ─────────
  function isPatternValid(input) {
    return input.validity.valid;
  }

  // ── Form submit ────────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    let hasError = false;

    // Full Name
    if (!nameEl.value.trim()) {
      setFieldError(nameEl, 'empty'); hasError = true;
    } else if (!isPatternValid(nameEl)) {
      setFieldError(nameEl, 'invalid'); hasError = true;
    }

    // Username
    if (!usernameEl.value.trim()) {
      setFieldError(usernameEl, 'empty'); hasError = true;
    } else if (!isPatternValid(usernameEl)) {
      setFieldError(usernameEl, 'invalid'); hasError = true;
    } else if (Store.usernameExists(usernameEl.value.trim())) {
      setCustomError(usernameEl, 'Username already taken. Please choose another.');
      hasError = true;
    }

    // Email
    if (!emailEl.value.trim()) {
      setFieldError(emailEl, 'empty'); hasError = true;
    } else if (!isPatternValid(emailEl)) {
      setFieldError(emailEl, 'invalid'); hasError = true;
    } else if (Store.emailExists(emailEl.value.trim())) {
      setCustomError(emailEl, 'This email is already registered.');
      hasError = true;
    }

    // Password
    if (!passwordEl.value) {
      setFieldError(passwordEl, 'empty'); hasError = true;
    } else if (!isPatternValid(passwordEl)) {
      setFieldError(passwordEl, 'invalid'); hasError = true;
    }

    // Confirm Password
    if (!confirmEl.value) {
      setFieldError(confirmEl, 'empty'); hasError = true;
    } else if (passwordEl.value !== confirmEl.value) {
      matchError.style.display = 'block'; hasError = true;
    }

    if (hasError) return;

    // ── Save user ──────────────────────────────────────────
    const newUser = {
      id:       Store.generateId('u'),
      name:     nameEl.value.trim(),
      username: usernameEl.value.trim(),
      email:    emailEl.value.trim(),
      password: passwordEl.value,
      createdAt: new Date().toISOString()
    };
    Store.addUser(newUser);

    showToast('Account created! Redirecting to login... ✅', 'success');

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1500);
  });

  // Clear match error on typing in confirm field
  confirmEl.addEventListener('input', function () {
    matchError.style.display = 'none';
  });
})();

