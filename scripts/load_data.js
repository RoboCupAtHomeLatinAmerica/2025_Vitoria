// Título da página com ano
if (info.year) document.title = `RoboCup@Home Brazil Open ${info.year}`;

// Preenche campos simples
document.querySelectorAll('.year').forEach(el => el.textContent = info.year ?? '');
document.querySelectorAll('.city').forEach(el => el.textContent = info.city ?? '');
document.querySelectorAll('.date').forEach(el => el.textContent = info.date ?? '');

// Chair
const chairEl = document.querySelector('.chair');
if (chairEl) chairEl.textContent = info.chair ?? '';

// OC (lista)
const ocUl = document.querySelector('.oc');
if (ocUl) {
    const items = Array.isArray(info.oc) ? info.oc : [];
    ocUl.innerHTML = items.map(n => `<li>${n}</li>`).join('');
}
