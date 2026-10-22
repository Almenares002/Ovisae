document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los números de las estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Configuración del Intersection Observer para detectar cuando la sección es visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Se activa cuando el 50% de la sección es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'), 10);
                
                // Iniciamos la animación de conteo
                animateValue(target, 0, finalValue, 2000); // 2000ms = 2 segundos
                
                // Dejamos de observar este elemento una vez animado
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observamos cada número
    statNumbers.forEach(number => {
        observer.observe(number);
    });

    /**
     * Función para animar el conteo de números
     * @param {HTMLElement} obj - El elemento HTML a modificar
     * @param {number} start - Valor inicial
     * @param {number} end - Valor final
     * @param {number} duration - Duración de la animación en milisegundos
     */
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            
            // Calculamos el progreso (0 a 1)
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Usamos una función de easing para que sea más suave al final (easeOutQuart)
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            
            // Calculamos el valor actual
            const currentValue = Math.floor(easeOutProgress * (end - start) + start);
            
            // Actualizamos el texto
            obj.textContent = currentValue;
            
            // Si no hemos terminado, seguimos pidiendo frames
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end; // Aseguramos el valor final exacto
            }
        };
        
        window.requestAnimationFrame(step);
    }
});