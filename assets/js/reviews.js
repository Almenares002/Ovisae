document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DATOS INICIALES (Reseñas por defecto)
    // ==========================================
    const defaultReviews = [
        {
            id: 1,
            name: "Carlos Méndez",
            role: "Propietario · Miami, FL",
            rating: 5,
            text: "Trabajaron en la remodelación completa de mi casa y el resultado superó todas mis expectativas. El equipo manejó todo el proceso de permisos sin que yo tuviera que preocuparme por nada.",
            date: "Hace 2 semanas"
        },
        {
            id: 2,
            name: "Laura Vásquez",
            role: "Inversionista · Orlando, FL",
            rating: 5,
            text: "He trabajado con muchos estudios de ingeniería y este es sin duda el más profesional. Resolvieron un caso complejo de obra after-the-fact que otros me dijeron que era imposible.",
            date: "Hace 1 mes"
        },
        {
            id: 3,
            name: "Roberto Silva",
            role: "Contratista General · Tampa, FL",
            rating: 4,
            text: "Excelente comunicación y cumplimiento de plazos. Los planos estructurales fueron aprobados por el building department sin ninguna objeción. Altamente recomendados.",
            date: "Hace 1 mes"
        },
        {
            id: 4,
            name: "Ana Gutiérrez",
            role: "Promotora Comercial · Fort Lauderdale, FL",
            rating: 5,
            text: "Nos acompañaron en el diseño y coordinación de un centro comercial completo. La integración de todas las disciplinas bajo un mismo techo nos ahorró meses de trabajo.",
            date: "Hace 2 meses"
        },
        {
            id: 5,
            name: "David Thompson",
            role: "Propietario Comercial · Naples, FL",
            rating: 5,
            text: "Profesionales de principio a fin. El soporte post-entrega ha sido igual de bueno que durante la ejecución. Definitivamente los volveré a contactar.",
            date: "Hace 3 meses"
        }
    ];

    // ==========================================
    // 2. GESTIÓN DE localStorage
    // ==========================================
    const STORAGE_KEY = 'company_reviews_v1';

    // Obtener reviews guardadas o usar las por defecto
    function getReviews() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            // Primera visita: guardamos las reviews por defecto
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
            return defaultReviews;
        } catch (e) {
            console.warn('localStorage no disponible, usando datos en memoria.');
            return defaultReviews;
        }
    }

    // Guardar una nueva review
    function saveReview(review) {
        const reviews = getReviews();
        reviews.unshift(review); // La nueva va al principio
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage.');
        }
        return reviews;
    }

    // ==========================================
    // 3. RENDERIZADO DEL CARRUSEL
    // ==========================================
    const carouselInner = document.getElementById('reviewsCarouselInner');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    // Número de cards por slide según el tamaño de pantalla
    function getCardsPerSlide() {
        const width = window.innerWidth;
        if (width >= 992) return 3; // Desktop
        if (width >= 576) return 2; // Tablet
        return 1; // Mobile
    }

    // Generar HTML de una estrella de rating (estático)
    function renderStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<span class="star-filled">★</span>';
            } else {
                starsHTML += '<span class="star-empty">★</span>';
            }
        }
        return starsHTML;
    }

    // Obtener iniciales del nombre
    function getInitials(name) {
        return name.split(' ')
            .slice(0, 2)
            .map(n => n.charAt(0).toUpperCase())
            .join('');
    }

    // Renderizar el carrusel completo
    function renderCarousel() {
        const reviews = getReviews();
        const cardsPerSlide = getCardsPerSlide();
        const totalSlides = Math.ceil(reviews.length / cardsPerSlide);

        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';

        // Crear los slides
        for (let i = 0; i < totalSlides; i++) {
            const slideReviews = reviews.slice(i * cardsPerSlide, (i + 1) * cardsPerSlide);
            
            const slide = document.createElement('div');
            slide.className = `carousel-item ${i === 0 ? 'active' : ''}`;
            
            const row = document.createElement('div');
            row.className = 'row g-4 justify-content-center';
            
            slideReviews.forEach(review => {
                const col = document.createElement('div');
                col.className = `col-md-6 col-lg-${12 / cardsPerSlide}`;
                
                col.innerHTML = `
                    <div class="review-card">
                        <div class="review-stars">${renderStars(review.rating)}</div>
                        <p class="review-text">${review.text}</p>
                        <div class="review-footer">
                            <div class="review-avatar">${getInitials(review.name)}</div>
                            <div class="review-author-info">
                                <h4>${review.name}</h4>
                                <p>${review.role}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                row.appendChild(col);
            });
            
            slide.appendChild(row);
            carouselInner.appendChild(slide);
        }

        // Crear indicadores
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#reviewsCarousel');
            indicator.setAttribute('data-bs-slide-to', i);
            if (i === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            carouselIndicators.appendChild(indicator);
        }

        // Reiniciar el carrusel de Bootstrap
        const carouselElement = document.getElementById('reviewsCarousel');
        if (carouselElement && window.bootstrap) {
            const carouselInstance = bootstrap.Carousel.getInstance(carouselElement) || new bootstrap.Carousel(carouselElement);
            carouselInstance.to(0);
        }
    }

    // Inicializar carrusel
    renderCarousel();

    // Re-renderizar al cambiar el tamaño de pantalla (con debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderCarousel();
        }, 250);
    });

    // ==========================================
    // 4. SISTEMA DE ESTRELLAS INTERACTIVO
    // ==========================================
    const starRatingInput = document.getElementById('starRatingInput');
    const ratingValueInput = document.getElementById('ratingValue');
    let currentRating = 0;

    if (starRatingInput) {
        const stars = starRatingInput.querySelectorAll('.star');

        stars.forEach(star => {
            // Al pasar el ratón
            star.addEventListener('mouseenter', () => {
                const value = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    const sValue = parseInt(s.getAttribute('data-value'));
                    s.classList.toggle('hovered', sValue <= value);
                });
            });

            // Al hacer clic
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-value'));
                ratingValueInput.value = currentRating;
                
                stars.forEach(s => {
                    const sValue = parseInt(s.getAttribute('data-value'));
                    s.classList.toggle('selected', sValue <= currentRating);
                    s.classList.remove('hovered');
                });
            });
        });

        // Al salir del área de estrellas
        starRatingInput.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });
    }

    // ==========================================
    // 5. MODAL DE RESEÑA
    // ==========================================
    const openBtn = document.getElementById('openReviewForm');
    const closeBtn = document.getElementById('closeReviewForm');
    const modal = document.getElementById('reviewModal');
    const form = document.getElementById('reviewForm');
    const charCount = document.getElementById('charCount');
    const reviewTextArea = document.getElementById('reviewText');

    // Abrir modal
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        currentRating = 0;
        ratingValueInput.value = 0;
        if (starRatingInput) {
            starRatingInput.querySelectorAll('.star').forEach(s => s.classList.remove('selected', 'hovered'));
        }
        if (charCount) charCount.textContent = '0';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera de la card
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Contador de caracteres
    if (reviewTextArea && charCount) {
        reviewTextArea.addEventListener('input', () => {
            charCount.textContent = reviewTextArea.value.length;
        });
    }

    // ==========================================
    // 6. ENVÍO DEL FORMULARIO
    // ==========================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validaciones
            const name = document.getElementById('reviewName').value.trim();
            const role = document.getElementById('reviewRole').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            const rating = parseInt(ratingValueInput.value);

            if (rating === 0) {
                alert('Por favor, selecciona una valoración con las estrellas.');
                return;
            }

            if (!name || !role || !text) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Crear nueva review
            const newReview = {
                id: Date.now(),
                name: name,
                role: role,
                rating: rating,
                text: text,
                date: 'Ahora mismo'
            };

            // Guardar y re-renderizar
            saveReview(newReview);
            renderCarousel();

            // Cerrar modal
            closeModal();

            // Scroll hasta el carrusel para que el usuario vea su review publicada
            const carouselEl = document.getElementById('reviewsCarousel');
            if (carouselEl) {
                carouselEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Pequeña notificación
            showToast('¡Gracias! Tu reseña ha sido publicada.');
        });
    }

    // Toast de confirmación
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            padding: 14px 28px;
            background: linear-gradient(135deg, #4a90e2, #2563eb);
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 50px;
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.5);
            z-index: 10000;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(30px)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ==========================================
    // 7. ANIMACIONES DE SCROLL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // ==========================================
    // NOTA IMPORTANTE SOBRE PERSISTENCIA
    // ==========================================
    /*
    ⚠️  IMPORTANTE:
    Las reseñas se guardan en el localStorage del navegador del visitante.
    Esto significa que:
    ✅ El visitante verá sus propias reseñas al volver a la web.
    ✅ Cada visitante tiene su propia copia (no se comparten entre usuarios).
    ❌ Las reseñas NO son visibles para otros visitantes de la web.

    Para que las reseñas se compartan entre TODOS los usuarios, necesitas
    conectar este formulario a un backend real. Aquí tienes las opciones más rápidas:

    🔹 OPCIÓN 1: Supabase (Recomendado - gratis para empezar)
       1. Crea un proyecto en https://supabase.com
       2. Crea una tabla "reviews" con columnas: name, role, rating, text, created_at
       3. Sustituye la función saveReview() por:
          await supabase.from('reviews').insert([newReview]);
       4. Sustituye getReviews() por:
          const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

    🔹 OPCIÓN 2: Firebase Firestore
       Muy similar, documentación oficial en https://firebase.google.com/docs/firestore

    🔹 OPCIÓN 3: Formspree / Getform (Solo envío por email)
       Ideal si solo quieres recibir las reseñas por correo y moderarlas antes de publicarlas.

    🔹 OPCIÓN 4: Google Sheets + Google Apps Script
       Solución económica, requiere un poco más de configuración.
    */
});