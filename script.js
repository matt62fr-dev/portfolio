document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTION DU MODE SOMBRE / CLAIR ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        if (themeToggle) themeToggle.textContent = '🌙 Mode Sombre';
    } else {
        if (themeToggle) themeToggle.textContent = '☀️ Mode Clair';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            let theme = 'dark';
            if (body.classList.contains('light-theme')) {
                theme = 'light';
                themeToggle.textContent = '🌙 Mode Sombre';
            } else {
                themeToggle.textContent = '☀️ Mode Clair';
            }
            localStorage.setItem('theme', theme);
        });
    }


    // --- 2. ANIMATION AU DÉFILEMENT (SCROLL REVEAL) ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();


    // --- 3. FILTRAGE DYNAMIQUE DES RÉALISATIONS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectSections = document.querySelectorAll('.project-detail-section');

    if (filterBtns.length > 0 && projectSections.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectSections.forEach(section => {
                    const category = section.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        section.style.display = 'block';
                        setTimeout(() => section.style.opacity = '1', 50);
                    } else {
                        section.style.opacity = '0';
                        setTimeout(() => section.style.display = 'none', 300);
                    }
                });
            });
        });
    }


    // --- 4. GÉNÉRATEUR DE LIVRES INTERACTIFS (FACTORISÉ & PROPRE) ---
    function setupBookModal(modalId, openBtnId, closeBtnId, prevBtnId, nextBtnId, indicatorId, pageSelector) {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);
        const pages = modal ? modal.querySelectorAll(pageSelector) : [];
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const indicator = document.getElementById(indicatorId);
        
        let currentPage = 0;

        if (!modal || !openBtn || pages.length === 0) return;

        function updateView() {
            pages.forEach((page, index) => {
                page.classList.toggle('active', index === currentPage);
            });
            if (indicator) {
                indicator.textContent = `Page ${currentPage + 1} / ${pages.length}`;
            }
        }

        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = 0;
            updateView();
            modal.classList.add('active');
        });

        const closeModal = () => modal.classList.remove('active');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < pages.length - 1) {
                    currentPage++;
                    updateView();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    updateView();
                }
            });
        }

        // Navigation globale clavier (Échap / Flèches)
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
                currentPage++;
                updateView();
            }
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                updateView();
            }
        });
    }

    // Initialisation du Livre La Plagne
    setupBookModal('videoModal', 'openVideoModal', 'closeVideoModal', 'prevPage', 'nextPage', 'pageIndicator', '.book-page');

    // Initialisation du Manuel Boulanger (13 pages)
    setupBookModal('boulangerModal', 'openBoulangerModal', 'closeBoulangerModal', 'prevBoulanger', 'nextBoulanger', 'boulangerIndicator', '.boulanger-page');

    // Initialisation de la Soutenance Boulanger (25 pages)
    setupBookModal('soutenanceModal', 'openSoutenanceModal', 'closeSoutenanceModal', 'prevSoutenance', 'nextSoutenance', 'soutenanceIndicator', '.soutenance-page');
    
});