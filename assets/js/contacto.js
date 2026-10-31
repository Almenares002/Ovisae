document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL FORMULARIO (FORMSPREE)
    // ==========================================
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccessMessage');
    const errorMessage = document.getElementById('formErrorMessage');
    const successName = document.getElementById('successName');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Ocultamos mensajes previos
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            // Obtenemos los datos del formulario
            const formData = new FormData(form);

            try {
                // Enviamos los datos a Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Éxito: Mostramos el mensaje personalizado
                    const nombre = formData.get('nombre_completo') || 'amigo/a';
                    successName.textContent = nombre.split(' ')[0]; // Solo el primer nombre
                    
                    successMessage.style.display = 'block';
                    form.style.display = 'none'; // Ocultamos el formulario
                    
                    // Opcional: Hacer scroll hasta el mensaje de éxito
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // Error en la respuesta del servidor
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                // Error de red o conexión
                errorMessage.style.display = 'block';
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DEL ACORDEÓN FAQ
    // ==========================================
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.faq-item');
            
            // Si el item clickeado ya está activo, lo cerramos
            if (currentItem.classList.contains('active')) {
                currentItem.classList.remove('active');
            } else {
                // Cerramos todos los demás items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                // Abrimos el item clickeado
                currentItem.classList.add('active');
            }
        });
    });

});