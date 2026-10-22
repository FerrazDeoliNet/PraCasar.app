import { buildExportPayload, applyImportedPayload } from './state.js';
import { renderAllViews } from './main.js';
import { autoSaveToServer } from './cloud.js';

export function exportAllData() {
  const payload = buildExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `planejamento_casamento_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importAllData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    let payload;
    try { payload = JSON.parse(e.target.result); }
    catch { alert('Arquivo inválido: JSON malformado.'); event.target.value = ''; return; }

    if (!payload?.guestData) {
      alert('Arquivo inválido.'); event.target.value = ''; return;
    }
    if (!confirm('Importar vai SUBSTITUIR todos os dados atuais. Continuar?')) {
      event.target.value = ''; return;
    }
    try {
      applyImportedPayload(payload);
      renderAllViews();
      await autoSaveToServer();
      event.target.value = '';
    } catch (err) {
      alert('Não foi possível importar: ' + err.message);
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}