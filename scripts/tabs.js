// Abas acessíveis
const tabButtons = document.querySelectorAll('.tabbtn');
const panels = document.querySelectorAll('.tabpanel');

function activateTab(targetId) {
    panels.forEach(p => p.classList.add('hidden'));
    tabButtons.forEach(b => {
    const active = b.dataset.target === targetId;
    b.setAttribute('aria-selected', active ? 'true' : 'false');
    b.dataset.active = active ? 'true' : 'false';
    });
    document.getElementById(targetId).classList.remove('hidden');
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.target));
});

// Abre a primeira aba ao carregar
activateTab('tab-home');
