document.addEventListener('DOMContentLoaded', function() {
    const portalModal = document.getElementById('portalModal');
    const iframe = document.getElementById('portalIframe');
    const loader = document.getElementById('portalLoader');
    
    // URL de tu Google Apps Script
    const portalUrl = "https://script.google.com/macros/s/AKfycbz18NXQE7foZBFmCplAdJT6_NbK1QSCwVXFrg2CCExyG7PQxq9J9PKo7ZB5K9V3tt25/exec?portal=client";

    // 1. Al abrir el modal, empezamos a cargar el iframe
    portalModal.addEventListener('show.bs.modal', function () {
        // Mostramos el loader y reseteamos el iframe
        loader.style.display = 'block';
        iframe.classList.remove('loaded');
        iframe.src = portalUrl;
    });

    // 2. Cuando el iframe termina de cargar, ocultamos el loader
    iframe.addEventListener('load', function() {
        // Comprobamos que no sea la página en blanco inicial
        if (iframe.src !== 'about:blank') {
            loader.style.display = 'none';
            iframe.classList.add('loaded');
        }
    });

    // 3. Al cerrar el modal, vaciamos el iframe para detener procesos y liberar memoria
    portalModal.addEventListener('hidden.bs.modal', function () {
        iframe.src = "about:blank";
        iframe.classList.remove('loaded');
    });
});