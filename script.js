/* ============================================
   MOZART COFFEE LOUNGE — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll detection for navbar background
    const handleNavScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);

    // ============ SCROLL ANIMATIONS ============
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay based on sibling index
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        // Add stagger delay for menu cards and gallery items
        const parent = el.closest('.menu-grid, .gallery-grid, .about-stats');
        if (parent) {
            const siblings = parent.querySelectorAll('[data-animate]');
            const idx = Array.from(siblings).indexOf(el);
            // Cap the stagger delay using modulo (max 4 columns)
            el.dataset.delay = (idx % 4) * 100;
        }
        animationObserver.observe(el);
    });

    // ============ MENU FILTER ============
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCards = document.querySelectorAll('.menu-card');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            menuCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ REVIEWS CAROUSEL ============
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCards = reviewsTrack.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    const dotsContainer = document.getElementById('reviewsDots');
    let currentReview = 0;
    let reviewAutoplay;

    // Create dots
    reviewCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToReview(i));
        dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentReview);
        });
    };

    const goToReview = (index) => {
        currentReview = index;
        if (currentReview < 0) currentReview = reviewCards.length - 1;
        if (currentReview >= reviewCards.length) currentReview = 0;
        reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
        updateDots();
    };

    prevBtn.addEventListener('click', () => {
        goToReview(currentReview - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        goToReview(currentReview + 1);
        resetAutoplay();
    });

    // Autoplay
    const startAutoplay = () => {
        reviewAutoplay = setInterval(() => goToReview(currentReview + 1), 5000);
    };

    const resetAutoplay = () => {
        clearInterval(reviewAutoplay);
        startAutoplay();
    };

    startAutoplay();

    // Touch/swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToReview(currentReview + 1);
            } else {
                goToReview(currentReview - 1);
            }
            resetAutoplay();
        }
    }, { passive: true });

    // ============ RESERVATION FORM REPLACED BY MAP ============
    // Form logic removed as per design update.

    // ============ PARALLAX HERO ============
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll < window.innerHeight) {
            const parallaxSpeed = scroll * 0.3;
            heroContent.style.transform = `translateY(${parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
        }
    });

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ MENU CARD 3D TILT ============
    const cards = document.querySelectorAll('.menu-card, .gallery-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============ FADE IN ANIMATION KEYFRAMES ============
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ============ SCROLL TO TOP ============
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
