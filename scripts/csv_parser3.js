async function preencherTabelaPessoas(caminhoCSV) {
  try {
    // Busca o CSV
    const resposta = await fetch(caminhoCSV);
    if (!resposta.ok) throw new Error('Erro ao carregar CSV');
    const texto = await resposta.text();

    // Divide em linhas e colunas
    const linhas = texto.trim().split(/\r?\n/);
    const cabecalho = linhas[0].split(',').map(c => c.trim());
    const dados = linhas.slice(1).map(l => l.split(',').map(v => v.trim()));

    // Seleciona a tabela (única do tipo ou com seletor específico)
    const tabela = document.getElementById('peopleTable');
    const thead = tabela.querySelector('thead');
    const tbody = tabela.querySelector('tbody');

    // Substitui o cabeçalho (caso queira atualizar pelo CSV)
    thead.innerHTML = '<tr>' + cabecalho.map(c => `<th class="px-3 py-2">${c}</th>`).join('') + '</tr>';

    // Monta o corpo da tabela
    tbody.innerHTML = '';
    for (const linha of dados) {
      const tr = document.createElement('tr');
      tr.className = 'border-t border-slate-200 dark:border-slate-800';
      for (const valor of linha) {
        const td = document.createElement('td');
        td.className = 'px-3 py-2';
        td.textContent = valor;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  } catch (erro) {
    console.error('Erro ao preencher tabela:', erro);
    document.body.insertAdjacentHTML('beforeend', `<p style="color:red;">${erro.message}</p>`);
  }
}

// Chama automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  preencherTabelaPessoas('csv/people.csv'); 
});