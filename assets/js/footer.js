document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // FORMULARIO NEWSLETTER
    // ==========================================
    // Envía la suscripción al mismo formulario de Formspree del contacto (llega a info@ovisae.com).
    document.querySelectorAll('form.newsletter-form').forEach((newsletterForm) => {
        if (newsletterForm.dataset.nlBound) return; // evita doble envío si el script se carga dos veces
        newsletterForm.dataset.nlBound = '1';
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = (emailInput.value || '').trim();
            const btn = newsletterForm.querySelector('.newsletter-btn');

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                emailInput.style.borderColor = 'rgba(220, 53, 69, 0.7)';
                emailInput.focus();
                return;
            }

            const originalContent = btn.innerHTML;
            btn.disabled = true;
            const fd = new FormData();
            fd.append('email', email);
            fd.append('_subject', 'Nueva suscripción al newsletter desde ovisae.com');
            fd.append('tipo', 'Newsletter');
            let ok = false;
            try {
                const res = await fetch('https://formspree.io/f/mzeebpkb', { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
                ok = res.ok;
            } catch (err) { ok = false; }

            if (ok) {
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
                btn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
                emailInput.value = '';
                emailInput.style.borderColor = '';
            } else {
                emailInput.style.borderColor = 'rgba(220, 53, 69, 0.7)';
            }
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.disabled = false;
                emailInput.style.borderColor = '';
            }, 3000);
        });
    });

    // ==========================================
    // EFECTO REVEAL EN CERTIFICACIONES (opcional)
    // ==========================================
    // No se usa animación de scroll para mantener el footer estático como pediste
    // pero si quieres añadir uno sutil aquí lo puedes hacer.

});