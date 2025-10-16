(function loadSRContexts() {
  // Ajuste aqui os caminhos dos seus .txt
  const CTX1_PATH = 'csv/context1.txt';
  const CTX2_PATH = 'csv/context2.txt';

  async function loadTxtInto(elId, path) {
    const el = document.getElementById(elId);
    if (!el) return;

    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      el.textContent = text; // preserva quebras de linha no <pre>
    } catch (err) {
      console.warn('Falha ao carregar', path, err);
      el.textContent = 'Não foi possível carregar o arquivo: ' + path;
    }
  }

  loadTxtInto('sr-context-1', CTX1_PATH);
  loadTxtInto('sr-context-2', CTX2_PATH);
})();