//---------------------------------------------
// HERO: SLIDESHOW AUTOMÁTICO
//---------------------------------------------
function initHero() {
    const slides = document.querySelectorAll(".hero-slides img");
    if (!slides.length) return;

    let currentIndex = 0;
    const intervalTime = 5000;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        if (slides[index]) slides[index].classList.add("active");
    }

    showSlide(currentIndex);
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, intervalTime);
}

document.addEventListener("DOMContentLoaded", function () {
    initHero();

    //--- 1. ACORDEÃO (Com Sincronização Inicial) ---
    const galleryButtons = document.querySelectorAll('.btn-gallery');
    galleryButtons.forEach((button) => {
        const gallery = document.getElementById(button.getAttribute('aria-controls'));
        if (!gallery) return;

        // SINCRONIZAÇÃO: Garante que o 'hidden' do HTML respeite o 'aria-expanded' inicial
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        gallery.hidden = !isExpanded;

        button.addEventListener('click', () => {
            const currentlyExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!currentlyExpanded));
            gallery.hidden = currentlyExpanded;
        });
    });

   //--- 2. LIGHTBOX (Com Reset, Foco e Proteção de Navegação) ---
const lightbox = document.querySelector('.gallery-lightbox');

if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');
    const btnClose = lightbox.querySelector('.lightbox-close');

    const galleries = {};
    let activeGalleryId = null;

    document.querySelectorAll('.galleria').forEach((gallery) => {
        const galleryId = gallery.id;
        if (!galleryId) return;
        const thumbs = Array.from(gallery.querySelectorAll('img'));
        galleries[galleryId] = { thumbs, currentIndex: 0 };

        thumbs.forEach((thumb, index) => {
            thumb.style.cursor = 'pointer';
            thumb.addEventListener('click', () => {
                activeGalleryId = galleryId;
                updateLightboxImage(index);
                
                // Abre o Lightbox
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.removeAttribute('inert'); // Permite foco e interação
                
                // Move o foco para o botão de fechar (Acessibilidade)
                btnClose?.focus();
            });
        });
    });

    function updateLightboxImage(index) {
        if (!activeGalleryId || !galleries[activeGalleryId]) return;

        const currentGallery = galleries[activeGalleryId];
        const total = currentGallery.thumbs.length;

        if (index < 0) index = total - 1;
        if (index >= total) index = 0;

        currentGallery.currentIndex = index;
        const thumb = currentGallery.thumbs[index];
        lightboxImg.src = thumb.dataset.full || thumb.src;
        lightboxImg.alt = thumb.alt || '';
    }

    const closeLightbox = () => {
        // Remove o foco do botão antes de esconder o elemento
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.setAttribute('inert', ''); // Bloqueia foco e interações
        activeGalleryId = null; 
    };

    // Navegação com proteção contra cliques acidentais
    btnPrev?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeGalleryId) updateLightboxImage(galleries[activeGalleryId].currentIndex - 1);
    });

    btnNext?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeGalleryId) updateLightboxImage(galleries[activeGalleryId].currentIndex + 1);
    });

    btnClose?.addEventListener('click', closeLightbox);
    
    // Fecha ao clicar no fundo
    lightbox.addEventListener('click', (e) => { 
        if (e.target === lightbox) closeLightbox(); 
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active') || !activeGalleryId) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') updateLightboxImage(galleries[activeGalleryId].currentIndex + 1);
        if (e.key === 'ArrowLeft')  updateLightboxImage(galleries[activeGalleryId].currentIndex - 1);
    });
}

    //--- 3. ANIMAÇÕES DE SCROLL ---
    const pqItems = document.querySelectorAll('#perchequi .pq-item.reveal');
    if (pqItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const idx = Array.from(pqItems).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 180}ms`;
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        pqItems.forEach(el => observer.observe(el));
    }
});

//--- MENU SANDUICHE ---
const btn = document.querySelector(".nav-toggle");
const menu = document.querySelector("nav ul");

btn.addEventListener("click", () => {
  menu.classList.toggle("open");
  btn.setAttribute("aria-expanded", menu.classList.contains("open"));
});
