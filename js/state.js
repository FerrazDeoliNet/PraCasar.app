import { showToast } from './toast.js';

export function generateId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

export const STORAGE_KEY = 'wedding_guests_data_v3';
export const CHURRASCO_STORAGE_KEY = 'wedding_churrasco_data_v1';

const defaultGuestData = {
  groom: {
    heading: '🤵 Lado do Noivo',
    sections: [
      {
        key: 'padrinhos_noivo',
        title: 'Padrinhos e Madrinhas',
        people: [
          { name: 'Matheus Vinicius', role: 'Padrinho' }, { name: 'Mateus Bezerra', role: 'Padrinho' },
          { name: 'Leonardo', role: 'Padrinho' }, { name: 'Natan', role: 'Padrinho' },
          { name: 'Manuela', role: 'Madrinha' }, { name: 'Julia', role: 'Madrinha' },
          { name: 'Par do Natan', role: 'Madrinha' }
        ]
      },
      {
        key: 'convidados_noivo',
        title: 'Convidados',
        people: [
          { name: 'Mãe do Bezerra' }, { name: 'Pai do Bezerra' }, { name: 'Lidiane' }, { name: 'Davi' },
          { name: 'Tia do bezerra' }, { name: 'Adryne kadden' }, { name: 'Kaique Henrique' },
          { name: 'Mãe' }, { name: 'Pai' }, { name: 'Fatima' }, { name: 'Andrade' }, { name: 'Jose Armando' },
          { name: 'Amanda' }, { name: 'Nayara e filho' }, { name: 'Jorge' }, { name: 'Geu' },
          { name: 'Tio paulo' }, { name: 'Tia mulher do tio Paulo' }, { name: 'Lucas' }, { name: 'Esposa de Lucas' },
          { name: 'Maria Paula' }, { name: 'Vó Izaura' }, { name: 'Tia Soma' }, { name: 'Filha tia soma' },
          { name: 'Tia Luza' }, { name: 'Tio Giuberto' }, { name: 'Tio Modesto' }, { name: 'Tia Ercilia' },
          { name: 'E filhos (2)' }, { name: 'Tio Clesio' }, { name: 'Mulher Tio Clesio' }, { name: 'Nathaly' },
          { name: 'Marido Nathaly' }, { name: 'Tia Sonia' }, { name: 'Pai Nathaly' }, { name: 'Talia' },
          { name: 'Filho Talia' }, { name: 'Rodrigo' }, { name: 'Andreia' }, { name: '(Tia da Geladeira)' },
          { name: 'Tia Irma' }, { name: 'Caroline' }, { name: 'Felipe' }, { name: 'Rodrigo' }, { name: 'Geh' },
          { name: 'Murilo' }, { name: 'Yuri' }, { name: 'Tio Evangelista' }, { name: 'Caio' }, { name: 'Mãe do Caio' },
          { name: 'Kaique' }, { name: 'Tio Gil' }, { name: 'Tia Lu' }, { name: 'Annie Ribeiro' }, { name: 'Rayssa' },
          { name: 'Katia' }, { name: 'Bruno' }, { name: 'Fernanda' }, { name: 'Fernanda Namorado' }, { name: 'Paulo' },
          { name: 'Gabriel' }, { name: 'Gabriela' }, { name: 'Vitória' }, { name: 'Dona Ju' }, { name: 'Natalia' },
          { name: 'Debora' }, { name: 'Debora Namorada' }, { name: 'Caio Nubert' }, { name: 'Cleyton' }, { name: 'Carol' },
          { name: 'Mariane' }, { name: 'David' }, { name: 'Sarah' }, { name: 'Kevin' }, { name: 'Jade' }, { name: 'Ismael' },
          { name: 'Raminho' }, { name: 'Laura' }
        ]
      }
    ]
  },
  bride: {
    heading: '👰 Lado da Noiva',
    sections: [
      {
        key: 'padrinhos_noiva',
        title: 'Madrinhas e Padrinhos',
        people: [
          { name: 'Dariane', role: 'Madrinha' }, { name: 'Zé', role: 'Padrinho' },
          { name: 'Ana', role: 'Madrinha' }, { name: 'Guilherme', role: 'Padrinho' },
          { name: 'Gi', role: 'Madrinha' }, { name: 'Namorado da Gi', role: 'Padrinho' },
          { name: 'Mayssa', role: 'Madrinha' }, { name: 'Luana', role: 'Madrinha' },
          { name: 'Tainá', role: 'Madrinha' }, { name: 'Paty', role: 'Madrinha' },
          { name: 'Jai', role: 'Padrinho' }
        ]
      },
      {
        key: 'convidados_noiva',
        title: 'Convidados',
        people: [
          { name: 'Pai' }, { name: 'Rose' }, { name: 'Da' }, { name: 'Kamyla' }, { name: 'Grayce' },
          { name: 'Katia' }, { name: 'Adailton' }, { name: 'Mulher do salão' }, { name: 'Marido da Mulher do salão' },
          { name: 'Manicure' }, { name: 'Marido da Manicure' }, { name: 'Mateus mafre' }, { name: 'Leozinho' },
          { name: 'Geraldo' }, { name: 'Mãe' }, { name: 'Rodrigo curso' }
        ]
      }
    ]
  }
};

const defaultChurrascoData = {
  heading: '🍖 Convidados do Churrasco',
  sections: [{ key: 'churrasco_lista', title: 'Lista de Convidados', people: [] }]
};

function ensureGuestIds(data) {
  ['groom', 'bride'].forEach(sideKey => {
    const side = data?.[sideKey];
    if (!side?.sections) return;
    side.sections.forEach(section => {
      if (!Array.isArray(section.people)) section.people = [];
      section.people.forEach(p => { if (!p.id) p.id = generateId(); });
    });
  });
  return data;
}

function ensureChurrascoIds(data) {
  if (!data?.sections) return data;
  data.sections.forEach(section => {
    if (!Array.isArray(section.people)) section.people = [];
    section.people.forEach(p => { if (!p.id) p.id = generateId(); });
  });
  return data;
}

function loadGuestData() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
  const data = stored || JSON.parse(JSON.stringify(defaultGuestData));
  ensureGuestIds(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function loadChurrascoData() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(CHURRASCO_STORAGE_KEY)); } catch (e) {}
  const data = stored || JSON.parse(JSON.stringify(defaultChurrascoData));
  ensureChurrascoIds(data);
  localStorage.setItem(CHURRASCO_STORAGE_KEY, JSON.stringify(data));
  return data;
}

/* ============================================================
   ESTADO GLOBAL — mutável, consumido pelas views
   ============================================================ */
export const state = {
  guestData: loadGuestData(),
  churrascoData: loadChurrascoData(),
  decorItems: JSON.parse(localStorage.getItem('wedding_decor')) || [],
  musicItems: JSON.parse(localStorage.getItem('wedding_music')) || [],
  mediaItems: JSON.parse(localStorage.getItem('wedding_media')) || [],
  budgetItems: JSON.parse(localStorage.getItem('wedding_budget')) || []
};

function notify() {
  window.dispatchEvent(new Event('wedding:changed'));
}

/* ============================================================
   Save functions — todas notificam o cloud.js
   ============================================================ */
export function saveGuests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.guestData));
  notify();
}
export function saveChurrasco() {
  localStorage.setItem(CHURRASCO_STORAGE_KEY, JSON.stringify(state.churrascoData));
  notify();
}
export function saveDecor() {
  localStorage.setItem('wedding_decor', JSON.stringify(state.decorItems));
  notify();
}
export function saveMusic() {
  localStorage.setItem('wedding_music', JSON.stringify(state.musicItems));
  notify();
}
export function saveMedia() {
  localStorage.setItem('wedding_media', JSON.stringify(state.mediaItems));
  notify();
}
export function saveBudget() {
  localStorage.setItem('wedding_budget', JSON.stringify(state.budgetItems));
  notify();
}

/* ============================================================
   Export / import payload
   ============================================================ */
function collectStatuses(sections) {
  const statuses = {};
  sections.forEach(section => {
    (section.people || []).forEach(person => {
      const pid = person.id;
      const invited = localStorage.getItem('inv_' + pid) === 'true';
      const status = localStorage.getItem('status_' + pid) || null;
      if (invited || status) statuses[pid] = { invited, status };
    });
  });
  return statuses;
}

export function buildExportPayload() {
  return {
    appVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    version: 1,
    guestData: state.guestData,
    guestStatuses: collectStatuses([
      ...state.guestData.groom.sections,
      ...state.guestData.bride.sections
    ]),
    churrascoData: state.churrascoData,
    churrascoStatuses: collectStatuses(state.churrascoData.sections),
    decorItems: state.decorItems,
    musicItems: state.musicItems,
    mediaItems: state.mediaItems,
    budgetItems: state.budgetItems
  };
}

export function applyImportedPayload(payload) {
  if (!payload?.guestData?.groom || !payload?.guestData?.bride) {
    throw new Error('O arquivo não contém uma lista de convidados válida.');
  }

  state.guestData = ensureGuestIds(payload.guestData);
  if (payload.churrascoData?.sections) {
    state.churrascoData = ensureChurrascoIds(payload.churrascoData);
  }
  state.decorItems  = Array.isArray(payload.decorItems)  ? payload.decorItems  : [];
  state.musicItems  = Array.isArray(payload.musicItems)  ? payload.musicItems  : [];
  state.mediaItems  = Array.isArray(payload.mediaItems)  ? payload.mediaItems  : [];
  state.budgetItems = Array.isArray(payload.budgetItems) ? payload.budgetItems : [];

  // limpar flags antigas
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('inv_') || k.startsWith('status_'))) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));

  const validIds = new Set();
  [...state.guestData.groom.sections, ...state.guestData.bride.sections].forEach(s =>
    (s.people || []).forEach(p => validIds.add(p.id))
  );
  state.churrascoData.sections.forEach(s => (s.people || []).forEach(p => validIds.add(p.id)));

  [payload.guestStatuses || {}, payload.churrascoStatuses || {}].forEach(map => {
    Object.entries(map).forEach(([pid, status]) => {
      if (!validIds.has(pid) || !status) return;
      if (status.invited) localStorage.setItem('inv_' + pid, 'true');
      if (['no', 'waiting', 'yes'].includes(status.status)) {
        localStorage.setItem('status_' + pid, status.status);
      }
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.guestData));
  localStorage.setItem(CHURRASCO_STORAGE_KEY, JSON.stringify(state.churrascoData));
  localStorage.setItem('wedding_decor', JSON.stringify(state.decorItems));
  localStorage.setItem('wedding_music', JSON.stringify(state.musicItems));
  localStorage.setItem('wedding_media', JSON.stringify(state.mediaItems));
  localStorage.setItem('wedding_budget', JSON.stringify(state.budgetItems));

  notify();
}