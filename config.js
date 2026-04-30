const CONFIG = {



    // 1. RUTA  GITHUB
    BASE_URL: "https://altervector.github.io/oleyaji/",

    // 2. SEGURETAT (Tu lista exacta del index)
    SITIOS_SEGUROS: ["altervector.com", "pages.dev", "netlify.app", "localhost", "127.0.0.1"],
    URL_OFICIAL: "https://oleyaji.altervector.com",
    BASE_WORKER: "https://oleyaji.altervector.workers.dev",


    EMAIL_SUPORT: "suport@altervector.com",

    // 4. CLOUDINARY
    CLOUDI_NAME: "deopqx65a",
    PDF_ID: "productos/Carta_OleyAji",
    PDF_URL: "https://res.cloudinary.com/deopqx65a/image/upload/productos/Carta_OleyAji.pdf",

    // 5. MODO EDICIO (El único punto de verdad)
    ES_ADMIN: sessionStorage.getItem('adminMode') === 'true'
};
if (CONFIG.ES_ADMIN) {
    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('admin-mode-active');
    });
}