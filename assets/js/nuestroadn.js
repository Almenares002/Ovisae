document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos que queremos animar
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Configuración del Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
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

    // Observamos cada elemento
    revealElements.forEach(element => {
        observer.observe(element);
    });
});