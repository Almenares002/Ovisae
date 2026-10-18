document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Animación de Scroll (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 2. Animación de Números (Estadísticas) ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'), 10);
                animateValue(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    statNumbers.forEach(num => statObserver.observe(num));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            obj.textContent = Math.floor(easeOutProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- 3. Filtrado de Proyectos ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const searchInput = document.getElementById('projectSearch');
    const noResults = document.getElementById('noResults');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        let visibleCount = 0;
        
        projectItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const services = item.getAttribute('data-service');
            const textContent = item.textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = searchQuery === '' || textContent.includes(searchQuery);
            
            if (matchesFilter && matchesSearch) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // Event listeners para los botones de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos
            filterButtons.forEach(b => b.classList.remove('active'));
            // Añadir clase active al clickeado
            btn.classList.add('active');
            // Actualizar filtro activo
            activeFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    // Event listener para el buscador
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            filterProjects();
        });
    }
});