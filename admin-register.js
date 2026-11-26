// ============================================================
//  admin-register.js  —  Admin Registration Logic
// ============================================================

(function () {
  const form       = document.getElementById('adminRegisterForm');
  const nameEl     = document.getElementById('adminName');
  const emailEl    = document.getElementById('adminEmail');
  const usernameEl = document.getElementById('adminUsername');
  const passwordEl = document.getElementById('adminPassword');
  const confirmEl  = document.getElementById('adminConfirm');
  const matchError = document.getElementById('matchError');

  function setFieldError(input, type) {
    const siblings = input.parentElement.querySelectorAll('.field-error');
    siblings.forEach(el => el.style.display = 'none');
    if (type) {
      const target = input.parentElement.querySelector('.error-' + type);
      if (target) target.style.display = 'block';
    }
  }

  function setCustomError(input, message) {
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    let hasError = false;

    if (!nameEl.value.trim()) {
      setFieldError(nameEl, 'empty'); hasError = true;
    } else if (!nameEl.validity.valid) {
      setFieldError(nameEl, 'invalid'); hasError = true;
    }

    if (!emailEl.value.trim()) {
      setFieldError(emailEl, 'empty'); hasError = true;
    } else if (!emailEl.validity.valid) {
      setFieldError(emailEl, 'invalid'); hasError = true;
    }

    if (!usernameEl.value.trim()) {
      setFieldError(usernameEl, 'empty'); hasError = true;
    } else if (!usernameEl.validity.valid) {
      setFieldError(usernameEl, 'invalid'); hasError = true;
    } else if (Store.adminUsernameExists(usernameEl.value.trim())) {
      setCustomError(usernameEl, 'This admin username is already taken.');
      hasError = true;
    }

    if (!passwordEl.value) {
      setFieldError(passwordEl, 'empty'); hasError = true;
    } else if (!passwordEl.validity.valid) {
      setFieldError(passwordEl, 'invalid'); hasError = true;
    }

    if (!confirmEl.value) {
      setFieldError(confirmEl, 'empty'); hasError = true;
    } else if (passwordEl.value !== confirmEl.value) {
      matchError.style.display = 'block'; hasError = true;
    }

    if (hasError) return;

    const admins = Store.getAdmins();
    admins.push({
      id:       Store.generateId('a'),
      name:     nameEl.value.trim(),
      email:    emailEl.value.trim(),
      username: usernameEl.value.trim(),
      password: passwordEl.value,
      createdAt: new Date().toISOString()
    });
    Store.saveAdmins(admins);

    showToast('Admin account created! Redirecting to login... ✅', 'success');

    setTimeout(function () {
      window.location.href = 'admin-login.html';
    }, 1500);
  });

  confirmEl.addEventListener('input', function () {
    matchError.style.display = 'none';
  });
})();

