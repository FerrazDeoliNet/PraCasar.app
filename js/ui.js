const VIEW_SUBTITLES = {
  convidados: 'Lista Geral de Convidados',
  churrasco: 'Convidados do Churrasco Pós-Cerimônia',
  decoracao: 'Planejamento de Decoração',
  musica: 'Trilha Sonora da Cerimônia e Festa',
  midia: 'Cobertura Fotográfica e Audiovisual',
  valores: 'Controle Financeiro e Orçamento'
};

export function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('active');
  document.getElementById('sidebarOverlay')?.classList.toggle('active');
}

export function toggleEditMode() {
  const body = document.body;
  const btn = document.getElementById('editModeBtn');
  body.classList.toggle('edit-mode-active');
  const active = body.classList.contains('edit-mode-active');
  btn.querySelector('.btn-label').textContent = active ? 'Concluir' : 'Editar';
  btn.firstChild.textContent = active ? '' : '';
  btn.innerHTML = active
    ? '<span class="btn-label">✅ Concluir</span>'
    : '<span class="btn-label">✏️ Editar</span>';
}

export function switchView(viewName, event) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar-item, .bottom-nav-item').forEach(el => el.classList.remove('active'));

  document.getElementById('view-' + viewName)?.classList.add('active');

  document.querySelectorAll(`[data-view="${viewName}"]`).forEach(el => el.classList.add('active'));

  const sub = document.getElementById('pageSubtitle');
  if (sub) sub.textContent = VIEW_SUBTITLES[viewName] || '';

  // Em mobile, se sidebar estava aberta, fecha; bottom nav já está fixa
  document.getElementById('sidebar')?.classList.remove('active');
  document.getElementById('sidebarOverlay')?.classList.remove('active');

  // Scroll para o topo suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });
}