/* ========================================
   CHARGEMENT CRITIQUE (exécution immédiate)
======================================== */

// ✅ MENU MOBILE (nécessaire dès le chargement)
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNavLink();
    initThemeToggle();
});

function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Fermer au clic sur lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ✅ DARK MODE TOGGLE
function initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    
    // Charger le thème sauvegardé ou détecter la préférence système
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Appliquer le toggle à tous les boutons (header + footer)
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
}

/* ========================================
   CHARGEMENT DIFFÉRÉ (après idle browser)
======================================== */

// ✅ LAZY LOAD avec requestIdleCallback (meilleur pour performance)
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        initNonCriticalFeatures();
    }, { timeout: 2000 });
} else {
    // Fallback Safari/anciens navigateurs
    setTimeout(initNonCriticalFeatures, 200);
}

function initNonCriticalFeatures() {
    // Typewriter (uniquement si élément existe)
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        initTypewriter(typewriterElement);
    }
    
    // Carrousel (uniquement page d'accueil)
    const carouselSlide = document.getElementById("carousel-slide");
    if (carouselSlide) {
        initCarousel();
    }
    
    // Filtres projets (uniquement page projets)
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        initProjectFilters();
    }
    
    // Zoom images
    initImageZoom();
    
    // Compteur textarea (page contact)
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        initTextareaCounter(messageTextarea);
    }
}

/* ========================================
   FONCTIONS FEATURES
======================================== */


// 3. FILTRES PROJETS (CORRECTION COMPLÈTE)
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-tags]');
    
    if (filterBtns.length === 0 || projectCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // 1️⃣ GESTION BOUTONS ACTIFS
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 2️⃣ FILTRAGE AVEC TRANSITIONS FLUIDES
            projectCards.forEach(card => {
                const tags = card.dataset.tags.split(' ');
                const shouldShow = filter === 'all' || tags.includes(filter);
                
                if (!shouldShow) {
                    // Phase 1 : Animation de sortie
                    card.classList.add('filtering-out');
                    
                    // Phase 2 : Masquage après transition
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.classList.remove('filtering-out');
                    }, 300);
                    
                } else {
                    // Retirer masquage immédiatement
                    card.classList.remove('hidden');
                    
                    // Phase 1 : Préparer animation d'entrée
                    card.classList.add('filtering-in');
                    
                    // Phase 2 : Trigger reflow
                    void card.offsetWidth;
                    
                    // Phase 3 : Animation d'entrée
                    requestAnimationFrame(() => {
                        card.classList.remove('filtering-in');
                    });
                }
            });
        });
    });
}

// 4. ZOOM IMAGES
function initImageZoom() {
    // Zoom inline
    const zoomables = document.querySelectorAll('.zoomable, [data-zoom="inline"]');
    zoomables.forEach(img => {
        if (img.closest('a')) return;
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            img.classList.toggle('inline-enlarged');
        });
    });
    
    // Zoom fullscreen modal
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img.zoom-fullscreen, img[data-zoom="modal"]');
        if (!img || img.closest('a')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'img-modal';
        overlay.innerHTML = `<img src="${img.dataset.fullsrc || img.src}" alt="${img.alt || ''}" loading="lazy">`;
        document.body.appendChild(overlay);
        
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        function close() {
            overlay.remove();
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        }
        
        function onKey(ev) {
            if (ev.key === 'Escape') close();
        }
        
        overlay.addEventListener('click', close);
        window.addEventListener('keydown', onKey);
    });
}

// 5. COMPTEUR TEXTAREA
function initTextareaCounter(textarea) {
    const charCount = document.createElement('small');
    charCount.style.cssText = 'display:block;text-align:right;color:var(--text-medium);margin-top:0.5rem;';
    textarea.insertAdjacentElement('afterend', charCount);
    
    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        const max = 500;
        charCount.textContent = `${length} / ${max} caractères`;
        
        if (length >= max) {
            textarea.value = textarea.value.substring(0, max);
        }
    });
    
    textarea.dispatchEvent(new Event('input'));
}