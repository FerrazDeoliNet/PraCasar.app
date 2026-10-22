let timer = null;

export function showToast(msg, duration = 2500) {
  const el = document.getElementById('sync-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('show'), duration);
}