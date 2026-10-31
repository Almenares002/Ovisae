document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar: cambio de estilo al hacer scroll ---
    const navbar = document.getElementById('mainNavbar');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar al cargar por si ya está scrolleado

    // --- 2. Menú Móvil ---
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Bloquear scroll del body cuando el menú está abierto
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Cerrar menú al hacer clic en un enlace
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            // Actualizar el enlace activo
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Cerrar menú al hacer clic en el overlay
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('menu-open') && 
            !mobileMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // --- 3. Selector de Idioma ---
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            
            // Actualizar estado visual de todos los botones de idioma
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Activar solo los del idioma seleccionado (tanto en desktop como móvil)
            document.querySelectorAll(`.lang-btn[data-lang="${selectedLang}"]`).forEach(b => {
                b.classList.add('active');
            });
            
            // Aquí puedes agregar la lógica para cambiar el idioma del sitio
            // Por ejemplo: cambiar el atributo lang del html, cargar traducciones, etc.
            document.documentElement.lang = selectedLang;
            
            console.log(`Idioma cambiado a: ${selectedLang.toUpperCase()}`);
        });
    });

    // --- 4. Actualizar enlaces activos al hacer scroll (Smooth Scroll) ---
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo aplicar smooth scroll si es un anchor interno
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Compensar altura del navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});