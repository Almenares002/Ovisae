document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Seleccionamos todos los elementos de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('customLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    let currentIndex = 0;

    // 2. Función para abrir el Lightbox
    function openLightbox(index) {
        currentIndex = index;
        // Obtenemos la URL de la imagen en alta resolución (la misma que se ve en la grilla)
        lightboxImg.src = galleryItems[currentIndex].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita el scroll de la página de fondo
    }

    // 3. Función para cerrar el Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaura el scroll
    }

    // 4. Función para cambiar de imagen (siguiente/anterior)
    function changeImage(direction) {
        currentIndex += direction;
        
        // Si llegamos al final, volvemos al principio (bucle)
        if (currentIndex < 0) {
            currentIndex = galleryItems.length - 1;
        } else if (currentIndex >= galleryItems.length) {
            currentIndex = 0;
        }
        
        lightboxImg.src = galleryItems[currentIndex].src;
    }

    // 5. Asignar eventos de clic a cada imagen de la galería
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // 6. Eventos de los botones
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => changeImage(1));
    prevBtn.addEventListener('click', () => changeImage(-1));

    // 7. Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 8. Soporte para teclado (Escape para cerrar, flechas para navegar)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return; // Solo actúa si el lightbox está abierto
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'ArrowLeft') changeImage(-1);
    });
});