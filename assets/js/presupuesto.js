document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL FORMULARIO (FORMSPREE)
    // ==========================================
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('formSuccessMessage');
    const errorMessage = document.getElementById('formErrorMessage');
    const successName = document.getElementById('successName');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const nombre = formData.get('nombre') || 'amigo/a';
                    successName.textContent = nombre.split(' ')[0];
                    
                    successMessage.style.display = 'block';
                    form.style.display = 'none';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.style.display = 'block';
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DEL ACORDEÓN FAQ (CLARO)
    // ==========================================
    const faqHeaders = document.querySelectorAll('.faq-light-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.faq-light-item');
            
            if (currentItem.classList.contains('active')) {
                currentItem.classList.remove('active');
            } else {
                document.querySelectorAll('.faq-light-item').forEach(item => item.classList.remove('active'));
                currentItem.classList.add('active');
            }
        });
    });

});