document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos el elemento que queremos animar
    const revealElements = document.querySelectorAll('.cta-section .reveal-on-scroll');
    
    // Configuración del Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Se activa cuando el 20% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadimos la clase que dispara la animación CSS
                entry.target.classList.add('is-visible');
                // Dejamos de observar el elemento una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observamos el elemento
    revealElements.forEach(element => {
        observer.observe(element);
    });
});