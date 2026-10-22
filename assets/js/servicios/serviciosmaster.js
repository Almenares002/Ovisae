document.addEventListener('DOMContentLoaded', () => {
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.faq-item');
            
            // Cierra los demás
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) item.classList.remove('active');
            });
            
            // Alterna el actual
            currentItem.classList.toggle('active');
        });
    });
});