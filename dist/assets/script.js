// ========================================
// 1. TYPEWRITER EFFECT (Hero)
// ========================================
const typewriterElement = document.getElementById("typewriter");
if (typewriterElement) {
    const text = "Lucas Bieszczad";
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            typewriterElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 80);
        }
    }
    typeWriter();
}

// ========================================
// 2. CARROUSEL PROJETS (Page d'accueil uniquement)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const slide = document.getElementById("carousel-slide");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const carouselContainer = document.querySelector(".carousel-container");
    
    if (!slide || !prevBtn || !nextBtn) return; // Sortir si éléments absents
    
    const projects = [
        { title: "Projet Steampunk", img: "assets/Blocking.png", alt: "Blockout du niveau", link: "steampunk.html" },
        { title: "Projets Techniques C++", img: "assets/Solitaire.png", alt: "Capture jeu console", link: "solitaire.html" },
        { title: "Fantasy Quest", img: "assets/img/fantasy_blockout.jpg", alt: "Screenshot Fantasy Quest", link: "fantasy.html" },
        { title: "Cyber Arena", img: "assets/img/cyber_arena.jpg", alt: "Screenshot Cyber Arena", link: "cyber.html" }
    ];
    
    let current = 0;
    let autoplayId = null;
    const AUTOPLAY_MS = 3500;
    
    // Afficher projet
    function showProject(idx) {
        const p = projects[idx];
        slide.innerHTML = `
            <a href="${p.link}" class="carousel-media">
                <img src="${p.img}" alt="${p.alt}">
            </a>
            <h3 style="margin:1rem 0 0.5rem 0;">${p.title}</h3>
        `;
    }
    
    // Navigation
    function goPrev() {
        current = (current - 1 + projects.length) % projects.length;
        showProject(current);
    }
    
    function goNext() {
        current = (current + 1) % projects.length;
        showProject(current);
    }
    
    // Autoplay
    function startAutoplay() {
        if (autoplayId) clearInterval(autoplayId);
        autoplayId = setInterval(goNext, AUTOPLAY_MS);
    }
    
    function stopAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }
    
    // Events
    prevBtn.onclick = goPrev;
    nextBtn.onclick = goNext;
    
    // Pause au survol
    if (carouselContainer) {
        carouselContainer.addEventListener("mouseenter", stopAutoplay);
        carouselContainer.addEventListener("mouseleave", startAutoplay);
        
        // Swipe mobile
        let touchStartX = 0;
        carouselContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].clientX;
            stopAutoplay();
        }, { passive: true });
        
        carouselContainer.addEventListener("touchend", (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) {
                dx > 0 ? goPrev() : goNext();
            }
            startAutoplay();
        }, { passive: true });
    }
    
    // Init
    showProject(current);
    startAutoplay();
});

// ========================================
// 3. ZOOM IMAGES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Zoom inline (toggle class)
    const zoomables = document.querySelectorAll('.zoomable, [data-zoom="inline"]');
    zoomables.forEach(img => {
        if (img.closest('a')) return; // Ignorer si dans un lien
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            img.classList.toggle('inline-enlarged');
        });
    });
    
    // Zoom fullscreen (modal)
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img.zoom-fullscreen, img[data-zoom="modal"]');
        if (!img || img.closest('a')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'img-modal';
        overlay.innerHTML = `<img src="${img.dataset.fullsrc || img.src}" alt="${img.alt || ''}">`;
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
});

// ========================================
// 4. NAVIGATION ACTIVE LINK
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ========================================
// 5. MENU MOBILE (Hamburger)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
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
});

// ========================================
// 6. FILTRES PROJETS (Page projets.html)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-tags]');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards avec animation
            projectCards.forEach(card => {
                const tags = card.dataset.tags.split(' ');
                const shouldShow = filter === 'all' || tags.includes(filter);
                
                if (shouldShow) {
                    card.style.display = '';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
});

// ========================================
// 7. COMPTEUR TEXTAREA (Page contact)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const messageTextarea = document.querySelector('textarea[name="message"]');
    
    if (!messageTextarea) return;
    
    const charCount = document.createElement('small');
    charCount.style.cssText = 'display:block;text-align:right;color:var(--text-medium);margin-top:0.5rem;';
    messageTextarea.insertAdjacentElement('afterend', charCount);
    
    messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        const max = 500;
        charCount.textContent = `${length} / ${max} caractères`;
        
        if (length >= max) {
            messageTextarea.value = messageTextarea.value.substring(0, max);
        }
    });
    
    // Trigger initial
    messageTextarea.dispatchEvent(new Event('input'));
});