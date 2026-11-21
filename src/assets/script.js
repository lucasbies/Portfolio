/* Portfolio Lucas Bieszczad : comportements de page */

document.addEventListener('DOMContentLoaded', () => {
    markCurrentPage();
    initThemeToggle();
    initProjectFilters();
    initImageZoom();
    initCharCount();
});

/* Lien de navigation de la page courante */
function markCurrentPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
    });
}

/* Thème : suit le système, sauf si l'utilisateur a choisi */
function initThemeToggle() {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const current = () => root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = current() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { /* stockage indisponible */ }
        });
    });
}

/* Filtres de la page projets */
function initProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('[data-tags]');
    if (!buttons.length || !rows.length) return;

    const matches = (row, filter) => filter === 'all' || row.dataset.tags.split(' ').includes(filter);

    buttons.forEach(btn => {
        const count = btn.querySelector('.filter-count');
        if (count) {
            const n = [...rows].filter(row => matches(row, btn.dataset.filter)).length;
            count.textContent = `(${n})`;
        }

        btn.addEventListener('click', () => {
            buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            rows.forEach(row => { row.hidden = !matches(row, btn.dataset.filter); });
        });
    });
}

/* Agrandissement des images de galerie */
function initImageZoom() {
    document.querySelectorAll('.zoomable').forEach(img => {
        if (img.closest('a')) return;
        img.addEventListener('click', () => img.classList.toggle('inline-enlarged'));
    });
}

/* Compteur du message de contact */
function initCharCount() {
    const textarea = document.querySelector('textarea[maxlength]');
    const output = document.getElementById('contact-count');
    if (!textarea || !output) return;

    const max = Number(textarea.getAttribute('maxlength'));
    const update = () => { output.textContent = `${textarea.value.length} / ${max} caractères`; };
    textarea.addEventListener('input', update);
    update();
}
