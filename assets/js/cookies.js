document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // LÓGICA DEL BANNER DE COOKIES
    // ==========================================
    const cookieBanner = document.getElementById('cookieBanner');
    const viewMain = document.getElementById('cookieViewMain');
    const viewConfig = document.getElementById('cookieViewConfig');
    
    const btnAcceptAll = document.getElementById('btnAcceptAll');
    const btnRejectAll = document.getElementById('btnRejectAll');
    const btnCustomize = document.getElementById('btnCustomize');
    const btnBackToMain = document.getElementById('btnBackToMain');
    const btnSavePreferences = document.getElementById('btnSavePreferences');
    
    const toggleAnalytics = document.getElementById('toggleAnalytics');
    const toggleMarketing = document.getElementById('toggleMarketing');

    // 1. Verificar si ya existen preferencias guardadas
    const savedConsent = localStorage.getItem('cookieConsent');

    if (!savedConsent) {
        // Si no hay preferencias, mostrar el banner con un pequeño delay
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1500); // Aparece 1.5 segundos después de cargar
    }

    // Función para guardar las preferencias
    function saveConsent(analytics, marketing) {
        const consentData = {
            necessary: true, // Siempre true
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        };
        
        // Guardar en localStorage
        localStorage.setItem('cookieConsent', JSON.stringify(consentData));
        
        // Ocultar banner
        cookieBanner.classList.remove('is-visible');
        
        // Aquí puedes disparar eventos para activar/desactivar scripts reales
        dispatchConsentEvent(consentData);
    }

    // Evento personalizado para que tus scripts de Analytics/Marketing escuchen
    function dispatchConsentEvent(consent) {
        const event = new CustomEvent('cookieConsentUpdated', { detail: consent });
        document.dispatchEvent(event);
        
        // Ejemplo de lo que harías aquí:
        // if (consent.analytics) { cargarGoogleAnalytics(); }
        // if (consent.marketing) { cargarFacebookPixel(); }
        console.log('Preferencias de cookies actualizadas:', consent);
    }

    // 2. Eventos de los botones
    if (btnAcceptAll) {
        btnAcceptAll.addEventListener('click', () => {
            saveConsent(true, true);
        });
    }

    if (btnRejectAll) {
        btnRejectAll.addEventListener('click', () => {
            saveConsent(false, false);
        });
    }

    if (btnCustomize) {
        btnCustomize.addEventListener('click', () => {
            viewMain.classList.remove('active');
            viewConfig.classList.add('active');
        });
    }

    if (btnBackToMain) {
        btnBackToMain.addEventListener('click', () => {
            viewConfig.classList.remove('active');
            viewMain.classList.add('active');
        });
    }

    if (btnSavePreferences) {
        btnSavePreferences.addEventListener('click', () => {
            saveConsent(toggleAnalytics.checked, toggleMarketing.checked);
        });
    }

    // 3. Botón opcional para reabrir el banner (si lo pusiste en el HTML)
    const btnReopen = document.getElementById('btnReopenCookies');
    if (btnReopen) {
        btnReopen.addEventListener('click', () => {
            // Cargar las preferencias actuales en los toggles
            if (savedConsent) {
                const consent = JSON.parse(savedConsent);
                toggleAnalytics.checked = consent.analytics;
                toggleMarketing.checked = consent.marketing;
            }
            
            // Mostrar el banner
            cookieBanner.classList.add('is-visible');
            viewConfig.classList.remove('active');
            viewMain.classList.add('active');
        });
    }
});