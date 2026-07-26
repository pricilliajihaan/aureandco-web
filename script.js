// ========================
// MODERN EVENT LISTENERS
// ========================
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeNavigation();
    initializeScrollEffects();
    initializeScrollToTop();
    initializeAOS();
    initializeFreeConsultModal();
    initializeTestimonialSystem();
    initializeGallerySliders();
    initializePackageAccordions();
    initializePackageOrderModal();
    initializeCustomDecorModal();
    initializeTestimonialModal();
});

// ========================
// IMAGE CAROUSEL FUNCTIONALITY
// ========================
function initializeCarousel() {
    const carousel = document.querySelector('.image-carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let autoplayInterval;

    function showSlide(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        updateButtonStates();
    }

    function updateButtonStates() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === items.length - 1;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; showSlide(currentIndex); resetAutoplay(); }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < items.length - 1) { currentIndex++; showSlide(currentIndex); resetAutoplay(); }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
            resetAutoplay();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; showSlide(currentIndex); resetAutoplay(); }
        else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) { currentIndex++; showSlide(currentIndex); resetAutoplay(); }
    });

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }, 5000);
    }
    function resetAutoplay() { clearInterval(autoplayInterval); startAutoplay(); }

    carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.addEventListener('mouseleave', () => startAutoplay());

    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50 && currentIndex < items.length - 1) { currentIndex++; showSlide(currentIndex); resetAutoplay(); }
        if (touchEndX - touchStartX > 50 && currentIndex > 0) { currentIndex--; showSlide(currentIndex); resetAutoplay(); }
    });

    showSlide(0);
    startAutoplay();
}

// ========================
// NAVIGATION FUNCTIONALITY
// ========================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id') || 'home';
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').slice(1);
            if (href === current || (current === '' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ========================
// SCROLL EFFECTS
// ========================
function initializeScrollEffects() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.service-card, .package-card, .testimonial-card, .gallery-card').forEach(el => observer.observe(el));
}

function initializeAOS() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

// ========================
// SCROLL TO TOP
// ========================
function initializeScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;
    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('show', document.documentElement.scrollTop > 300);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========================
// MODAL HELPERS
// ========================
let currentOpenModal = null;

function openModal(modalId) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    if (!modal || !overlay) return;
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentOpenModal = modalId;
}

function closeAllModals() {
    const overlay = document.getElementById('modalOverlay');
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentOpenModal = null;
}

// ========================
// 1. FREE CONSULTATION MODAL (Hero)
// ========================
function initializeFreeConsultModal() {
    const btn = document.getElementById('freeConsultBtn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('freeConsultModal');
    });

    // Close buttons
    document.querySelectorAll('.free-consult-close').forEach(el => el.addEventListener('click', closeAllModals));
    document.getElementById('modalOverlay').addEventListener('click', closeAllModals);

    // Form submit
    const form = document.getElementById('freeConsultForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('freeName').value.trim();
            const domisili = document.getElementById('freeDomisili').value.trim();
            const tanggal = document.getElementById('freeTanggal').value || '-';
            const budget = document.getElementById('freeBudget').value.trim() || '-';

            if (!nama || !domisili) { alert('Harap isi Nama dan Domisili!'); return; }

            const waNumber = '628984706086';
            const msg = `Halo Admin! Saya ${nama}, ingin konsultasi gratis mengenai dekorasi pernikahan.\n\nBerikut detail rencana acara saya:\n- Est. Domisili Acara: ${domisili}\n- Rencana Tanggal Acara: ${tanggal}\n- Kisaran Budget: ${budget}\n\nMohon info lebih lanjut ya, terima kasih!`;
            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
            closeAllModals();
            form.reset();
        });
    }
}

// ========================
// 2. TESTIMONIAL SYSTEM (LocalStorage + Rating Sort)
// ========================
const DEFAULT_TESTIMONIALS = [
    { name: 'Rina & Dimas', decor: 'Pernikahan Outdoor', rating: 5, text: 'Mewujudkan wedding kami jadi sangat sempurna. Detail floral dan lightingnya benar-benar dreamy.' },
    { name: 'Lia & Arga', decor: 'Pernikahan Indoor', rating: 5, text: 'Lebih dari ekspektasi. Setiap sudut ruangan terasa hangat dan menuai banyak pujian dari tamu.' },
    { name: 'Fajar & Nisa', decor: 'Pernikahan Intimate', rating: 4, text: 'Komunikasi cepat, hasil rapi, dan event berjalan lancar. Sangat direkomendasikan.' },
    { name: 'Sari & Budi', decor: 'Pernikahan Indoor', rating: 5, text: 'Pelayanan sangat memuaskan! Mereka sangat detail dan kreatif. Thank you Aure\'Design!' },
    { name: 'Dewi & Andi', decor: 'Pernikahan Outdoor', rating: 4, text: 'Dekorasi outdoor-nya stunning! Semua tamu terpukau dengan keindahan setupnya.' }
];

function getTestimonials() {
    const stored = localStorage.getItem('aure_testimonials');
    if (!stored) {
        localStorage.setItem('aure_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
        return [...DEFAULT_TESTIMONIALS];
    }
    try { return JSON.parse(stored); } catch(e) { return [...DEFAULT_TESTIMONIALS]; }
}

function saveTestimonial(t) {
    const list = getTestimonials();
    list.push(t);
    localStorage.setItem('aure_testimonials', JSON.stringify(list));
    renderTestimonials();
}

function renderTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testiDotsContainer');
    if (!track) return;

    const list = getTestimonials();
    // Sort by rating descending (highest first)
    list.sort((a, b) => b.rating - a.rating);

    track.innerHTML = '';
    list.forEach(t => {
        const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testi-stars" style="color:#f1c40f;font-size:1.1rem;letter-spacing:2px;">${stars}</div>
            <p>"${t.text}"</p>
            <div class="testimonial-author"><strong>${t.name}</strong><span>${t.decor}</span></div>
        `;
        track.appendChild(card);
    });

    // Reinitialize carousel
    initializeTestimonialCarouselUI(track, dotsContainer);
}

function initializeTestimonialCarouselUI(track, dotsContainer) {
    const prevBtn = document.querySelector('.testi-prev');
    const nextBtn = document.querySelector('.testi-next');
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let cardsPerView = 3;
    const cardWidth = cards[0]?.offsetWidth + 24 || 300;

    function updateCardsPerView() {
        const w = window.innerWidth;
        if (w <= 768) cardsPerView = 1;
        else if (w <= 992) cardsPerView = 2;
        else cardsPerView = 3;
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const total = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                currentIndex = i * cardsPerView;
                if (currentIndex >= cards.length) currentIndex = cards.length - cardsPerView;
                scrollToIdx(currentIndex);
                updateDotsUI();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDotsUI() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        const activeIdx = Math.floor(currentIndex / cardsPerView);
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }

    function scrollToIdx(idx) {
        track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    }

    function updateBtn() {
        if (prevBtn) prevBtn.disabled = currentIndex <= 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex -= cardsPerView; if (currentIndex < 0) currentIndex = 0; scrollToIdx(currentIndex); updateDotsUI(); updateBtn(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - cardsPerView) { currentIndex += cardsPerView; scrollToIdx(currentIndex); updateDotsUI(); updateBtn(); }
    });

    window.addEventListener('resize', () => {
        updateCardsPerView(); createDots(); currentIndex = 0; scrollToIdx(0); updateBtn();
    });

    updateCardsPerView();
    createDots();
    updateBtn();
}

function initializeTestimonialSystem() {
    renderTestimonials();

    // Hidden feature: Show "add testimonial" button & auto-open modal if URL has ?action=add-testimonial
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add-testimonial' || window.location.hash === '#add-testimonial') {
        const addBtnContainer = document.querySelector('.testimonial-add');
        if (addBtnContainer) addBtnContainer.style.display = 'block';

        // Auto-open the testimonial modal after a short delay (for page load)
        setTimeout(() => {
            const addBtn = document.getElementById('addTestimonialBtn');
            if (addBtn) {
                // Reset rating
                document.querySelectorAll('#starRating .star').forEach(s => s.classList.remove('active'));
                document.getElementById('reviewRating').value = '0';
                openModal('testimonialModal');
            }
        }, 800);
    }
}

// ========================
// 3. GALLERY 2x2 SLIDERS
// ========================
function initializeGallerySliders() {
    document.querySelectorAll('.gallery-slider').forEach(slider => {
        const track = slider.querySelector('.gallery-slider-track');
        const slides = slider.querySelectorAll('.gallery-slide');
        const prevBtn = slider.querySelector('.gallery-slide-prev');
        const nextBtn = slider.querySelector('.gallery-slide-next');
        if (!track || slides.length === 0) return;

        let current = 0;

        function updateGallerySlider() {
            const slideWidth = slides[0].offsetWidth + 12;
            track.scrollTo({ left: current * slideWidth, behavior: 'smooth' });
            if (prevBtn) prevBtn.style.opacity = current === 0 ? '0.3' : '1';
            if (nextBtn) nextBtn.style.opacity = current >= slides.length - 1 ? '0.3' : '1';
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) { current--; updateGallerySlider(); } });
        if (nextBtn) nextBtn.addEventListener('click', () => { if (current < slides.length - 1) { current++; updateGallerySlider(); } });
        updateGallerySlider();
    });
}

// ========================
// 4. PACKAGE ACCORDION (Dropdown)
// ========================
function initializePackageAccordions() {
    document.querySelectorAll('.package-card').forEach(card => {
        const toggleBtn = card.querySelector('.accordion-toggle');
        const details = card.querySelector('.package-details');
        if (!toggleBtn || !details) return;

        details.style.maxHeight = '0px';
        details.style.overflow = 'hidden';
        details.style.transition = 'max-height 0.4s ease';
        details.style.display = 'block';

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = card.classList.toggle('accordion-open');
            if (isOpen) {
                details.style.maxHeight = details.scrollHeight + 200 + 'px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Sembunyikan Detail';
            } else {
                details.style.maxHeight = '0px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Lihat Detail';
            }
        });
    });
}

// ========================
// 5. PACKAGE ORDER MODAL
// ========================
function initializePackageOrderModal() {
    const modal = document.getElementById('orderModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('orderForm');
    let selectedPackage = '';

    if (!modal) return;

    document.querySelectorAll('.btn-order-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedPackage = btn.dataset.package || 'Paket';
            document.getElementById('selectedPackageName').textContent = selectedPackage;
            openModal('orderModal');
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeAllModals);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('fieldName').value.trim();
            const domisili = document.getElementById('fieldDomisili').value.trim();
            const tanggal = document.getElementById('fieldTanggal').value || '-';
            const budget = document.getElementById('fieldBudget').value.trim() || '-';
            if (!nama || !domisili) { alert('Harap isi Nama Lengkap dan Domisili!'); return; }

            const wa = '628984706086';
            const msg = `Halo Admin! Saya ${nama}, ingin berkonsultasi mengenai paket ${selectedPackage}.\n\nBerikut detail rencana acara saya:\n- Est. Domisili Acara: ${domisili}\n- Rencana Tanggal Acara: ${tanggal}\n- Kisaran Budget: ${budget}\n\nApakah paket ini tersedia untuk tanggal tersebut? Mohon info lebih lanjut ya, terima kasih!`;
            window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
            closeAllModals();
            form.reset();
        });
    }
}

// ========================
// 6. CUSTOM DÉCOR MODAL WITH CHECKLIST INTEGRATION
// ========================
function initializeCustomDecorModal() {
    const waBtn = document.getElementById('customDecorWA');
    const modal = document.getElementById('customDecorModal');
    const form = document.getElementById('customDecorForm');

    if (!waBtn || !modal) return;

    // Close buttons
    document.querySelectorAll('.custom-decor-close').forEach(el => el.addEventListener('click', closeAllModals));

    waBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('customDecorModal');
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('custName').value.trim();
            const domisili = document.getElementById('custDomisili').value.trim();
            const tanggal = document.getElementById('custTanggal').value || '-';
            const budget = document.getElementById('custBudget').value.trim() || '-';
            if (!nama || !domisili) { alert('Harap isi Nama Lengkap dan Domisili!'); return; }

            // Get checked items from checklist
            const checkboxes = document.querySelectorAll('.decor-checklist input[type="checkbox"]:checked');
            const items = [];
            checkboxes.forEach(cb => items.push(cb.value));

            const wa = '628984706086';
            let itemList = items.length > 0 ? items.join(', ') : '(Belum ada item yang dipilih)';
            const msg = `Halo Admin! Saya ${nama}, ingin berkonsultasi untuk dekorasi custom dengan pilihan item berikut:\n\n${itemList}\n\nDetail rencana acara:\n- Est. Domisili Acara: ${domisili}\n- Rencana Tanggal Acara: ${tanggal}\n- Kisaran Budget: ${budget}\n\nMohon bantuan penawaran dan estimasi harganya ya, terima kasih!`;
            window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
            closeAllModals();
            form.reset();
        });
    }
}

// ========================
// TESTIMONIAL REVIEW MODAL
// ========================
function initializeTestimonialModal() {
    const addBtn = document.getElementById('addTestimonialBtn');
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');

    if (!addBtn || !modal) return;

    document.querySelectorAll('.testimonial-close').forEach(el => el.addEventListener('click', closeAllModals));

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset rating
        document.querySelectorAll('#starRating .star').forEach(s => s.classList.remove('active'));
        document.getElementById('reviewRating').value = '0';
        openModal('testimonialModal');
    });

    // Star rating click handler
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.val);
            document.getElementById('reviewRating').value = val;
            stars.forEach((s, i) => s.classList.toggle('active', i < val));
        });
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.val);
            stars.forEach((s, i) => s.classList.toggle('active', i < val));
        });
        star.addEventListener('mouseleave', () => {
            const currentVal = parseInt(document.getElementById('reviewRating').value);
            stars.forEach((s, i) => s.classList.toggle('active', i < currentVal));
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewName').value.trim();
            const decor = document.getElementById('reviewDecor').value;
            const rating = parseInt(document.getElementById('reviewRating').value);
            const text = document.getElementById('reviewText').value.trim();

            if (!name || !decor || rating === 0 || !text) {
                alert('Harap lengkapi semua field dan berikan rating!');
                return;
            }

            saveTestimonial({ name, decor, rating, text });
            closeAllModals();
            form.reset();
            document.querySelectorAll('#starRating .star').forEach(s => s.classList.remove('active'));
            document.getElementById('reviewRating').value = '0';
            alert('Terima kasih! Ulasan Anda telah disimpan.');
        });
    }
}

// ========================
// UTILITY FUNCTIONS
// ========================
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}
function debounce(func, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => func(...args), wait); }; }
function throttle(func, limit) { let inThrottle; return (...args) => { if (!inThrottle) { func.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; }

// ========================
// COUNTER ANIMATION
// ========================
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
            let count = 0;
            const inc = target / 50;
            const timer = setInterval(() => {
                count += inc;
                if (count >= target) { counter.textContent = target; clearInterval(timer); }
                else { counter.textContent = Math.floor(count); }
            }, 30);
        }
    });
}

// ========================
// PERFORMANCE MONITORING
// ========================
window.addEventListener('load', () => {
    console.log('%c=== Aure\' Design Website ===', 'color: #d4a574; font-size: 16px; font-weight: bold;');
    console.log('%cAll systems initialized successfully! ✓', 'color: #2ecc71; font-size: 12px;');
});

// Track clicks on CTA buttons
document.querySelectorAll('.btn-primary, .cta-btn').forEach(btn => {
    btn.addEventListener('click', function() { console.log('CTA clicked:', this.textContent.trim()); });
});

// Service worker (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Dark mode toggle (optional)
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
function toggleDarkMode() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Error handling
window.addEventListener('error', (event) => console.error('Error:', event.error));
window.addEventListener('unhandledrejection', (event) => console.error('Unhandled rejection:', event.reason));

