/* ==========================================
   JS GLOBAL - APPARTAMENTI AL PARCO
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    initHeroSlideshow();
    initReviewsCarousel();
    initGalleries(); // Inicializa os botões "Mostrare più foto" e o Lightbox
});
 
// ---------------------------------------------
// 1. HERO: SLIDESHOW AUTOMÁTICO
// ---------------------------------------------
function initHeroSlideshow() {
    const slides = document.querySelectorAll(".hero-slides img");
    if (slides.length === 0) return;
 
    let currentIndex = 0;
    const intervalTime = 5000; // Troca a cada 5 segundos
 
    setInterval(() => {
        slides[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add("active");
    }, intervalTime);
}
 
// ---------------------------------------------
// 2. RECENSIONI: CARROSEL DE AVALIAÇÕES
// ---------------------------------------------
function initReviewsCarousel() {
    const reviews = document.querySelectorAll('.review-item');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
 
    // Proteção preventiva caso os botões não existam nessa página específica
    if (!reviews.length || !nextBtn || !prevBtn) return;
 
    let currentIndex = 0;
 
    function showReview(index) {
        reviews.forEach(review => review.classList.remove('active'));
        reviews[index].classList.add('active');
    }
 
    function updateButtonColors(btnToActive, btnToInactive) {
        btnToActive.classList.add('active-btn');
        btnToInactive.classList.remove('active-btn');
    }
 
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % reviews.length;
        showReview(currentIndex);
        updateButtonColors(nextBtn, prevBtn);
    });
 
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        showReview(currentIndex);
        updateButtonColors(prevBtn, nextBtn);
    });
}
 
// ---------------------------------------------
// 3. GALLERIA & LIGHTBOX (Botão "Mostrare più foto")
// ---------------------------------------------
function initGalleries() {
    const galleryButtons = document.querySelectorAll('.btn-gallery');
    const lightbox = document.querySelector('.gallery-lightbox');
 
    if (!galleryButtons.length || !lightbox) return;
 
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
 
    let currentImagesArray = [];
    let currentImgIndex = 0;
    let openerButton = null; // [ACESSIBILIDADE] Guarda o botão que abriu o lightbox
 
    // Ação do Botão "Mostrare più foto" -> Abre o Lightbox direto na primeira foto daquela galeria
    galleryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('aria-controls');
            const gallerySection = document.getElementById(targetId);
 
            if (gallerySection) {
                // Captura todas as imagens dentro da seção da galeria correspondente
                const images = gallerySection.querySelectorAll('img');
 
                if (images.length > 0) {
                    currentImagesArray = Array.from(images).map(img => ({
                        // [FIX] Usa data-src (URL real do lazy loader) com fallback para src
                        // Necessário pois a galeria começa com hidden — o IntersectionObserver
                        // nunca dispara, então img.src ainda é o placeholder SVG transparente.
                        src: img.dataset.src || img.src,
                        alt: img.alt
                    }));
 
                    // Atualiza o estado de acessibilidade do botão
                    button.setAttribute('aria-expanded', 'true');
 
                    // [ACESSIBILIDADE] Guarda o botão que abriu, para restaurar foco ao fechar
                    openerButton = button;
 
                    // Abre o lightbox na primeira imagem
                    currentImgIndex = 0;
                    openLightbox();
                }
            }
        });
    });
 
    // Funções de manipulação do Lightbox
    function openLightbox() {
        updateLightboxImage();
        lightbox.removeAttribute('aria-hidden');
        lightbox.removeAttribute('inert');
        lightbox.classList.add('active'); // Garante a transição visual caso use no CSS
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
 
        // [ACESSIBILIDADE] Move o foco para o botão de fechar ao abrir o lightbox
        closeBtn.focus();
    }
 
    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.setAttribute('inert', '');
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Libera o scroll do fundo
 
        // Reseta o estado dos botões aria-expanded
        galleryButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
 
        // [ACESSIBILIDADE] Restaura o foco para o botão que abriu o lightbox (WCAG 2.1 §2.4.3)
        if (openerButton) {
            openerButton.focus();
            openerButton = null;
        }
    }
 
    function updateLightboxImage() {
        const imageData = currentImagesArray[currentImgIndex];
        if (imageData) {
            lightboxImg.src = imageData.src;
            lightboxImg.alt = imageData.alt;
        }
    }
 
    function nextImage() {
        currentImgIndex = (currentImgIndex + 1) % currentImagesArray.length;
        updateLightboxImage();
    }
 
    function prevImage() {
        currentImgIndex = (currentImgIndex - 1 + currentImagesArray.length) % currentImagesArray.length;
        updateLightboxImage();
    }
 
    // Event Listeners do Lightbox
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    closeBtn.addEventListener('click', closeLightbox);
 
    // Fecha se clicar no fundo escuro (fora da imagem ou botões)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
 
    // Atalhos de teclado (Acessibilidade)
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'true') return;
 
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}