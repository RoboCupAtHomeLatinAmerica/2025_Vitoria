// --- Parser de CSV com suporte a aspas e vírgulas internas ---
function parseCSV(text) {
  const rows = [];
  let row = [], cur = '', i = 0, inQ = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i+1] === '"') { cur += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      cur += ch; i++; continue;
    }
    if (ch === '"') { inQ = true; i++; continue; }
    if (ch === ',') { row.push(cur); cur = ''; i++; continue; }
    if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; i++; continue; }
    if (ch === '\r') { i++; continue; }
    cur += ch; i++;
  }
  row.push(cur); rows.push(row);
  // remove linhas vazias no final
  while (rows.length && rows[rows.length-1].every(c => c.trim()==='')) rows.pop();
  return rows;
}

// Renderizadores por coluna (por nome do cabeçalho)
const renderersByHeader = {
  // Links com rótulo
  'TDP': (val) => linkCell(val, 'TDP'),
  'Poster': (val) => linkCell(val, 'Poster'),
  // Foto do robô como <img>
  'Robot Photo': (val, row) => {
    const td = document.createElement('td'); td.className = 'px-3 py-2';
    if (!val) { td.textContent = ''; return td; }
    const img = document.createElement('img');
    img.src = val.trim();
    img.alt = `Robot Photo - ${row[0]||''}`;   // assume col 0 = Team Name
    img.className = 'h-14 w-auto rounded ring-1 ring-slate-200 dark:ring-slate-800';
    td.appendChild(img);
    return td;
  }
};

// Link “genérico” (usa texto da própria URL se não passar label)
function linkCell(url, label) {
  const td = document.createElement('td'); td.className = 'px-3 py-2';
  if (!url) return td;
  const a = document.createElement('a');
  a.href = url.trim(); a.target = '_blank'; a.rel = 'noopener';
  a.className = 'text-blue-600 hover:underline';
  a.textContent = label || url.trim();
  td.appendChild(a);
  return td;
}

// Fallback simples (texto ou link se detectar URL)
function defaultCell(val) {
  const td = document.createElement('td'); td.className = 'px-3 py-2';
  const v = String(val ?? '').trim();
  if (/^(https?:\/\/|\/)/i.test(v)) return linkCell(v);
  td.textContent = v; return td;
}

function fillTable(table, rows, { skipHeader = true } = {}) {
  const tbody = table.querySelector('tbody') || table.createTBody();
  tbody.innerHTML = '';
  if (!rows.length) return;

  // cabeçalhos do CSV
  const headers = rows[0].map(h => h.trim());
  const start = skipHeader ? 1 : 0;

  for (let r = start; r < rows.length; r++) {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-slate-200 dark:border-slate-800';
    const cols = rows[r];

    for (let c = 0; c < headers.length; c++) {
      const header = headers[c] || '';
      const val = cols[c] ?? '';
      const renderer = renderersByHeader[header] || defaultCell;
      const td = renderer.length >= 2 ? renderer(val, cols, header) : renderer(val); // permite (val,row)
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

async function loadTablesFromCSV() {
  const tables = Array.from(document.querySelectorAll('table[data-csv]'));
  await Promise.all(tables.map(async (table) => {
    const path = table.getAttribute('data-csv');
    try {
      const res = await fetch(path, { cache: 'no-store' }); // evite cache durante ajustes
      if (!res.ok) throw new Error('HTTP '+res.status);
      const text = await res.text();
      const rows = parseCSV(text);
      fillTable(table, rows, { skipHeader: true }); // pula cabeçalho do CSV
    } catch (e) {
      console.error('Falha ao carregar CSV de', path, e);
    }
  }));
}

document.addEventListener('DOMContentLoaded', loadTablesFromCSV);
