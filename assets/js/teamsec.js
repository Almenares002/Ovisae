document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.team-card');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const totalCards = cards.length;
    
    // Empezamos en la carta central (índice 4 de 0 a 8)
    let activeIndex = 4; 

    // Función para actualizar las posiciones del carrusel
    function updateCarousel() {
        cards.forEach((card, i) => {
            // Limpiamos las clases de posición anteriores
            card.classList.remove('pos-center', 'pos-left-1', 'pos-right-1', 'pos-left-2', 'pos-right-2', 'pos-hidden');
            
            // Calculamos la distancia cíclica (módulo)
            let diff = (i - activeIndex + totalCards) % totalCards;

            // Asignamos la clase según la posición relativa
            if (diff === 0) {
                card.classList.add('pos-center');
            } else if (diff === 1) {
                card.classList.add('pos-right-1');
            } else if (diff === 2) {
                card.classList.add('pos-right-2');
            } else if (diff === totalCards - 1) { // -1 en módulo
                card.classList.add('pos-left-1');
            } else if (diff === totalCards - 2) { // -2 en módulo
                card.classList.add('pos-left-2');
            } else {
                card.classList.add('pos-hidden');
            }
        });
    }

    // Inicializar carrusel
    updateCarousel();

    // --- Lógica de Navegación (Flechas laterales) ---
    nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % totalCards;
        updateCarousel();
        resetFlips(); // Reseteamos los giros al navegar
    });

    prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + totalCards) % totalCards;
        updateCarousel();
        resetFlips(); // Reseteamos los giros al navegar
    });

    // --- Lógica de Centrado al hacer clic en una Card ---
    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            // Si el clic fue en el botón de flip, no centramos la card
            if (e.target.closest('.flip-btn')) return;

            if (activeIndex !== i) {
                activeIndex = i;
                updateCarousel();
                resetFlips(); // Reseteamos los giros al centrar una nueva card
            }
        });
    });

    // --- Lógica del Botón Flip (Giro 180 grados) ---
    const flipButtons = document.querySelectorAll('.flip-btn');
    
    flipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el clic active el centrado de la card
            
            const currentCard = btn.closest('.team-card');
            
            // Giramos todas las demás cartas a su estado inicial (frente)
            cards.forEach(card => {
                if (card !== currentCard) {
                    card.classList.remove('flipped');
                }
            });

            // Alternamos el estado de la carta actual
            currentCard.classList.toggle('flipped');
        });
    });

    // Función auxiliar para resetear todos los giros
    function resetFlips() {
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
    }
});