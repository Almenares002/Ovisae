document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar GLightbox
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true, // Permite pasar de la última a la primera imagen
        autoplayVideos: false
    });

    // 2. Scroll suave para el botón del Hero
    const scrollBtn = document.querySelector('.btn-scroll-down');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollBtn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50, // -50 para dejar un poco de margen
                    behavior: 'smooth'
                });
            }
        });
    }
});