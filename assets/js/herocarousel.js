document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicators-custom .dot');
    
    // ==========================================
    // CONFIGURACIÓN DEL TIEMPO AQUÍ (en milisegundos)
    // 5000 = 5 segundos | 3000 = 3 segundos | 8000 = 8 segundos
    // ==========================================
    const TRANSITION_TIME = 9000; 
    
    let currentIndex = 0;
    let slideInterval;

    // Función para mostrar una diapositiva específica
    function showSlide(index) {
        // Remover clases activas de todas las imágenes y puntos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Añadir clase activa al nuevo índice
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
    }

    // Función para avanzar a la siguiente diapositiva
    function nextSlide() {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Iniciar el ciclo automático
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, TRANSITION_TIME);
    }

    // Lógica para hacer clic en los puntos indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // Pausar el automático al hacer clic manual
            showSlide(index);
            // Reiniciar el ciclo automático
            slideInterval = setInterval(nextSlide, TRANSITION_TIME);
        });
    });
});