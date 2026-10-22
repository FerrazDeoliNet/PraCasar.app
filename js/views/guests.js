import { state, saveGuests, generateId, STORAGE_KEY } from '../state.js';

const COUNTER_IDS = { inv: 'cnt-inv', no: 'cnt-no', wait: 'cnt-wait', yes: 'cnt-yes', pending: 'cnt-pending' };

function setRadiosEnabled(pid, enabled) {
  const wrap = document.querySelector(`input[name="status_${pid}"]`)?.closest('tr');
  if (!wrap) return;
  wrap.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = !enabled);
  if (!enabled) {
    wrap.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    localStorage.removeItem('status_' + pid);
  }
}

function computeCounters(containerEl) {
  const allInv = containerEl.querySelectorAll('input[type="checkbox"][id^="inv_"]');
  const inv  = containerEl.querySelectorAll('input[type="checkbox"][id^="inv_"]:checked').length;
  const no   = containerEl.querySelectorAll('input[type="radio"][value="no"]:checked').length;
  const wait = containerEl.querySelectorAll('input[type="radio"][value="waiting"]:checked').length;
  const yes  = containerEl.querySelectorAll('input[type="radio"][value="yes"]:checked').length;
  return { inv, no, wait, yes, pending: allInv.length - inv };
}

function updateCounters(containerEl) {
  const c = computeCounters(containerEl);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set(COUNTER_IDS.inv, c.inv);
  set(COUNTER_IDS.no, c.no);
  set(COUNTER_IDS.wait, c.wait);
  set(COUNTER_IDS.yes, c.yes);
  set(COUNTER_IDS.pending, c.pending);
}

function bindEvents(containerEl) {
  containerEl.querySelectorAll('input[type="checkbox"][id^="inv_"]').forEach(input => {
    const pid = input.dataset.pid;
    input.checked = localStorage.getItem('inv_' + pid) === 'true';
    setRadiosEnabled(pid, input.checked);

    const saved = localStorage.getItem('status_' + pid);
    if (saved && input.checked) {
      const radio = containerEl.querySelector(`input[name="status_${pid}"][value="${saved}"]`);
      if (radio) radio.checked = true;
    }

    input.addEventListener('change', () => {
      localStorage.setItem('inv_' + pid, input.checked);
      setRadiosEnabled(pid, input.checked);
      updateCounters(containerEl);
      saveGuests();
    });
  });

  containerEl.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener('mousedown', function () { this._pre = this.checked; });
    r.addEventListener('touchstart', function () { this._pre = this.checked; }, { passive: true });
    r.addEventListener('click', function (e) {
      if (this.disabled) { e.preventDefault(); return; }
      if (this._pre) {
        this.checked = false;
        localStorage.removeItem(this.name);
      } else {
        localStorage.setItem(this.name, this.value);
      }
      updateCounters(containerEl);
      saveGuests();
    });
  });
}

export function render() {
  const wrap = document.getElementById('panels');
  if (!wrap) return;
  wrap.innerHTML = '';

  [state.guestData.groom, state.guestData.bride].forEach((side, sideIdx) => {
    const panel = document.createElement('div');
    panel.className = 'panel';

    const heading = document.createElement('div');
    heading.className = 'panel-heading';
    heading.textContent = side.heading;
    panel.appendChild(heading);

    side.sections.forEach((section, secIdx) => {
      const titleEl = document.createElement('div');
      titleEl.className = 'section-title';
      titleEl.textContent = section.title;
      panel.appendChild(titleEl);

      const card = document.createElement('div');
      card.className = 'glass-table-wrap';

      const table = document.createElement('table');
      table.innerHTML = `
        <thead><tr>
          <th class="name-col">Nome</th>
          <th>📨</th><th>❌</th><th>⏳</th><th>✅</th>
        </tr></thead>
        <tbody></tbody>`;
      const tbody = table.querySelector('tbody');

      section.people.forEach(p => {
        const pid = p.id;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="name-col">
            <span>${p.name}${p.role ? `<span class="role-tag">${p.role}</span>` : ''}</span>
            <span class="action-btns">
              <button class="action-btn" onclick="App.editGuest('${pid}')" title="Editar">✏️</button>
              <button class="action-btn delete" onclick="App.deleteGuest('${pid}')" title="Excluir">🗑️</button>
            </span>
          </td>
          <td><input type="checkbox" id="inv_${pid}" data-pid="${pid}"></td>
          <td><input type="radio" class="radio-no"   name="status_${pid}" value="no"      disabled></td>
          <td><input type="radio" class="radio-wait" name="status_${pid}" value="waiting" disabled></td>
          <td><input type="radio" class="radio-yes"  name="status_${pid}" value="yes"     disabled></td>`;
        tbody.appendChild(tr);
      });

      card.appendChild(table);

      const addRow = document.createElement('div');
      addRow.className = 'add-row-container';
      addRow.innerHTML = `
        <input type="text" class="add-input" id="input_name_${sideIdx}_${secIdx}" placeholder="Nome do convidado...">
        <input type="text" class="add-input" id="input_role_${sideIdx}_${secIdx}" placeholder="Papel (opcional)" style="max-width:130px">
        <button class="add-btn" onclick="App.addGuest(${sideIdx},${secIdx})">+</button>`;
      card.appendChild(addRow);

      panel.appendChild(card);
    });

    wrap.appendChild(panel);
  });

  bindEvents(wrap);
  updateCounters(wrap);
}

export function addGuest(sideIdx, secIdx) {
  const name = document.getElementById(`input_name_${sideIdx}_${secIdx}`).value.trim();
  const role = document.getElementById(`input_role_${sideIdx}_${secIdx}`).value.trim();
  if (!name) return;
  const sideKey = sideIdx === 0 ? 'groom' : 'bride';
  state.guestData[sideKey].sections[secIdx].people.push({
    id: generateId(), name, ...(role ? { role } : {})
  });
  saveGuests();
  render();
}

function findPerson(pid) {
  for (const sideKey of ['groom', 'bride']) {
    for (const section of state.guestData[sideKey].sections) {
      const person = section.people.find(p => p.id === pid);
      if (person) return { person, section };
    }
  }
  return null;
}

export function editGuest(pid) {
  const found = findPerson(pid);
  if (!found) return;
  const newName = prompt('Editar nome:', found.person.name);
  if (!newName?.trim()) return;
  const newRole = prompt('Editar papel (opcional):', found.person.role || '');
  found.person.name = newName.trim();
  found.person.role = newRole?.trim() || undefined;
  saveGuests();
  render();
}

export function deleteGuest(pid) {
  if (!confirm('Excluir este convidado?')) return;
  const found = findPerson(pid);
  if (!found) return;
  found.section.people.splice(found.section.people.indexOf(found.person), 1);
  localStorage.removeItem('inv_' + pid);
  localStorage.removeItem('status_' + pid);
  saveGuests();
  render();
}