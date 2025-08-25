// ==============================
// Effets visuels et interactions
// ==============================

// Crée et ajoute des particules décoratives en arrière-plan
function createParticles() {
    // Conteneur des particules
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Génère N particules avec des délais/durations aléatoires
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Défilement fluide pour les liens d'ancrage (remplaçable par CSS smooth)
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const isHashOnly = href === '#' || href === '';
            if (isHashOnly) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// IntersectionObserver pour faire apparaître les éléments avec animation
function setupIntersectionAnimations() {
    const options = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, options);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach((el, index) => {
        el.style.transitionDelay = index * 0.1 + 's';
        observer.observe(el);
    });
}

// Mise en surbrillance du lien actif dans la navigation + style de la barre
function setupActiveNavAndNavStyle() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    function onScroll() {
        // Détermine la section visible
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id') || '';
            }
        });

        // Applique la classe active au lien correspondant
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Accentue le fond/ombre de la nav après un léger scroll
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
    }

    // Attache l'écouteur
    window.addEventListener('scroll', onScroll);
    // Initialisation immédiate
    onScroll();
}

// Effet parallaxe léger pour le contenu du hero
function setupHeroParallax() {
    const parallax = document.querySelector('.hero-content');
    if (!parallax) return;

    function onScroll() {
        const scrolled = window.pageYOffset;
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
}

// Effets de tilt 3D survol carte projet
function setupProjectCardTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Effet machine à écrire du titre du hero (personnalisable)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function setupHeroTypewriter() {
    window.addEventListener('load', () => {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            setTimeout(() => typeWriter(heroTitle, 'Inassona Sow', 150), 1000);
        }
    });
}

// Animation de gradient dynamique au survol des CTA (si besoin d'effets avancés)
function setupCtaHoverGradient() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            button.style.setProperty('--mouse-x', x + 'px');
            button.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

// ==============================
// Filtrage des projets par catégorie
// ==============================

function setupProjectFilters() {
    // Conteneur des boutons de filtre
    const filterContainer = document.getElementById('projects-filters');
    if (!filterContainer) return;

    // Récupère tous les boutons et toutes les cartes
    const buttons = Array.from(filterContainer.querySelectorAll('[data-filter]'));
    const cards = Array.from(document.querySelectorAll('.project-card'));

    function applyFilter(category) {
        // Active l'état visuel du bouton
        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        const activeButton = buttons.find(btn => btn.dataset.filter === category);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-pressed', 'true');
        }

        // Affiche tout si "all"
        if (category === 'all') {
            cards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('is-hidden');
            });
            return;
        }

        // Affiche uniquement les cartes de la catégorie demandée
        cards.forEach(card => {
            const cat = card.dataset.category || '';
            if (cat === category) {
                card.style.display = 'block';
                card.classList.remove('is-hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('is-hidden');
            }
        });
    }

    // Écoute les clics sur chaque bouton
    buttons.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });

    // Filtre par défaut: Tous
    applyFilter('all');
}

// ==============================
// Initialisation globale
// ==============================

function init() {
    createParticles();
    enableSmoothScroll();
    setupIntersectionAnimations();
    setupActiveNavAndNavStyle();
    setupHeroParallax();
    setupProjectCardTilt();
    setupHeroTypewriter();
    setupCtaHoverGradient();
    setupProjectFilters();
}

// Lance l'initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', init);




