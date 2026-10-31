document.addEventListener('DOMContentLoaded', () => {
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.faq-item');
            
            // Si el elemento ya está activo, lo cerramos (opcional)
            if (currentItem.classList.contains('active')) {
                currentItem.classList.remove('active');
            } else {
                // Cerramos todos los demás
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Abrimos el seleccionado
                currentItem.classList.add('active');
            }
        });
    });
});