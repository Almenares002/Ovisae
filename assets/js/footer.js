document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // FORMULARIO NEWSLETTER
    // ==========================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value;
            const btn = newsletterForm.querySelector('.newsletter-btn');
            
            // Validación básica de email
            if (!email || !email.includes('@')) {
                emailInput.style.borderColor = 'rgba(220, 53, 69, 0.5)';
                return;
            }
            
            // Animación de éxito en el botón
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
            btn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
            
            // Aquí puedes agregar la llamada a tu API o Formspree:
            // fetch('https://formspree.io/f/TU_ID', { method: 'POST', body: new FormData(newsletterForm) })
            
            // Reset después de 3 segundos
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                emailInput.value = '';
                emailInput.style.borderColor = '';
            }, 3000);
        });
    }

    // ==========================================
    // EFECTO REVEAL EN CERTIFICACIONES (opcional)
    // ==========================================
    // No se usa animación de scroll para mantener el footer estático como pediste
    // pero si quieres añadir uno sutil aquí lo puedes hacer.

});