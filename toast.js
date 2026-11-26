// ============================================================
//  toast.js  —  Shared Toast + Confirm for all Feature 1 pages
// ============================================================

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
    '<span class="toast-icon">' +
      (type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️') +
    '</span>' +
    '<span class="toast-msg">' + message + '</span>';
  container.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { toast.classList.add('toast-show'); });
  });

  setTimeout(function () {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', function () { toast.remove(); });
  }, 3000);
}

