document.addEventListener("DOMContentLoaded", () => {
  // Buscamos el contenedor específico en español
  const faqContainer = document.getElementById("faq-section-es");

  if (faqContainer) {
    const faqHeaders = faqContainer.querySelectorAll(".faq-header");

    faqHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const currentItem = header.closest(".faq-item");

        // Si el item clickeado ya está activo, lo cerramos
        if (currentItem.classList.contains("active")) {
          currentItem.classList.remove("active");
        } else {
          // Cerramos todos los demás dentro de este contenedor
          faqContainer.querySelectorAll(".faq-item").forEach((item) => {
            item.classList.remove("active");
          });
          // Abrimos el clickeado
          currentItem.classList.add("active");
        }
      });
    });
  }
});
