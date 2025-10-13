const CSV_PATH = 'Photos/objects/index.csv';           // caminho do CSV
const BASE_DIR = 'Photos/objects';               // pasta base onde estão as subpastas (Drinks, Cleaning supplies, etc.)

// Função simples para ler e dividir o CSV
function parseCSV(text) {
  return text.trim().split(/\r?\n/).map(line =>
    line.split(',').map(cell => cell.trim())
  );
}

// Ignora entradas inválidas (vazias, "a.PNG", ".")
function isValidFile(name) {
  if (!name) return false;
  const val = name.trim();
  return !(val === '' || val.toLowerCase() === 'a.png' || val === '.');
}

async function loadCSVAndBuildTable() {
  try {
    const res = await fetch(CSV_PATH);
    if (!res.ok) throw new Error('Erro ao carregar CSV');
    const text = await res.text();
    const rows = parseCSV(text);
    if (!rows.length) return;

    const headers = rows[0];
    const table = document.getElementById('objectsTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Monta cabeçalho
    thead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    tbody.innerHTML = '';

    // Monta linhas de imagens
    for (let i = 1; i < rows.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < headers.length; j++) {
        const folder = headers[j];
        const file = rows[i][j];
        const td = document.createElement('td');
        td.className = 'px-3 py-2 align-top text-center';

        if (isValidFile(file)) {
          const fig = document.createElement('figure');
          fig.className = 'space-y-1';

          const img = document.createElement('img');
          img.src = `${BASE_DIR}/${folder}/${encodeURIComponent(file)}`;
          img.alt = file;
          img.loading = 'lazy';
          img.style.maxWidth = '100px';
          img.style.borderRadius = '6px';
          img.style.border = '1px solid #ccc';
          img.onerror = () => { img.style.opacity = '0.4'; img.alt = 'Imagem não encontrada'; };

          const cap = document.createElement('figcaption');
          cap.textContent = file.replace(/\.[^.]+$/, '');
          cap.style.fontSize = '12px';
          cap.style.color = '#555';

          fig.appendChild(img);
          fig.appendChild(cap);
          td.appendChild(fig);
        }

        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  } catch (err) {
    console.error(err);
    document.body.insertAdjacentHTML('beforeend', `<p style="color:red;">Erro ao carregar CSV: ${err.message}</p>`);
  }
}

// Chama automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', loadCSVAndBuildTable);