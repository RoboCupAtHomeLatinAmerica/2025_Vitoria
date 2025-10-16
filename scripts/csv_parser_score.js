(function () {
  // === Ajuste aqui os caminhos dos seus CSVs ===
  const CSV_MAP = {
    scorePosterTable:  ['csv/score/poster.csv'],
    scoreStage1Table:  ['csv/score/stage1.csv'],
    scoreStage2Table:  ['csv/score/stage2.csv'], // tenta na ordem
    scoreFinalTable:   ['csv/score/final.csv'],
    scoreOverallTable: ['csv/score/geral.csv']
  };

  // Parser CSV robusto (aspas, vírgulas, quebras de linha)
  function parseCSV(text) {
    const rows = [];
    let row = [], cur = '', i = 0, inQ = false;
    while (i < text.length) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        cur += ch; i++; continue;
      } else {
        if (ch === '"') { inQ = true; i++; continue; }
        if (ch === ',') { row.push(cur); cur = ''; i++; continue; }
        if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; i++; continue; }
        if (ch === '\r') { i++; continue; }
        cur += ch; i++;
      }
    }
    row.push(cur); rows.push(row);
    // remove linhas finais vazias
    while (rows.length && rows[rows.length - 1].every(c => (c ?? '').trim() === '')) rows.pop();
    return rows;
  }

  function cell(text) {
    const td = document.createElement('td');
    td.className = 'px-3 py-2';
    td.textContent = text ?? '';
    return td;
  }

  async function fetchFirstAvailable(paths) {
    const errors = [];
    for (const p of paths) {
      try {
        const res = await fetch(p, { cache: 'no-store' });
        if (res.ok) return await res.text();
        errors.push(`${p} (HTTP ${res.status})`);
      } catch (e) {
        errors.push(`${p} (${e.message})`);
      }
    }
    throw new Error('Nenhum CSV encontrado: ' + errors.join(' | '));
  }

  async function fillTable(tableId, csvPaths) {
    const table = document.getElementById(tableId);
    if (!table) return;

    try {
      const text = await fetchFirstAvailable(csvPaths);
      const rows = parseCSV(text);
      if (!rows.length) return;

      const theadCols = table.querySelectorAll('thead th').length || (rows[0]?.length ?? 0);
      const tbody = table.querySelector('tbody') || table.createTBody();
      tbody.innerHTML = '';

      // pula a primeira linha (cabeçalho do CSV)
      for (let r = 1; r < rows.length; r++) {
        const tr = document.createElement('tr');
        tr.className = 'border-t border-slate-200 dark:border-slate-800';
        const cols = rows[r];

        for (let c = 0; c < theadCols; c++) {
          tr.appendChild(cell(cols[c] ?? ''));
        }
        tbody.appendChild(tr);
      }
    } catch (err) {
      console.error(`Falha ao preencher #${tableId}:`, err);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    for (const [tableId, paths] of Object.entries(CSV_MAP)) {
      await fillTable(tableId, paths);
    }
  });
})();