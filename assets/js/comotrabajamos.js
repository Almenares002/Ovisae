document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Lógica del Acordeón (Click en los subtítulos) ---
    const stepHeaders = document.querySelectorAll('.step-header');
    
    stepHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.timeline-item');
            
            // Si el item clickeado ya está activo, lo cerramos (toggle)
            if (currentItem.classList.contains('active')) {
                currentItem.classList.remove('active');
            } else {
                // Cerramos todos los demás items
                document.querySelectorAll('.timeline-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Abrimos el item clickeado
                currentItem.classList.add('active');
            }
        });
    });

    // --- 2. Animación de Scroll (Reveal on scroll) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
});