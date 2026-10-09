// 1. Preloader Initialization
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hide');
    }, 1500);
});

// 2. Buttery Smooth Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const interactiveElements = document.querySelectorAll('a, button, .interactive-hover');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, {
        duration: 400,
        fill: "forwards"
    });
});

interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('expand');
        cursorOutline.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('expand');
        cursorOutline.classList.remove('expand');
    });
});

// 3. Smooth Scroll Reveal (Applies to all new sections)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// 4. Typing Engine
const textElement = document.querySelector('.typing-text');
const words = ['clean code.', 'system logic.', 'software.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }
    setTimeout(typeEffect, typeSpeed);
}
setTimeout(typeEffect, 1800);

// 5. 3D Tilt Effect for Project Cards
const cards = document.querySelectorAll('.tilt-element');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        // Disable the float animation CSS while hovering so it doesn't conflict
        card.style.animation = 'none';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        // Re-enable the float animation when the mouse leaves
        setTimeout(() => {
            card.style.animation = '';
        }, 300); // Wait for the transition to finish before turning float back on
    });
});

// 6. NIAT requirement: Dark / Light mode toggle.
// This is additive and does not modify the existing animation functions above.
const themeToggle = document.querySelector('#theme-toggle');
const themeToggleLabel = document.querySelector('#theme-toggle-label');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        themeToggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        if (themeToggleLabel) themeToggleLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
        if (themeIcon) {
            themeIcon.classList.toggle('fa-sun', !isLight);
            themeIcon.classList.toggle('fa-moon', isLight);
        }
    });
}

// Keep the copyright year current without affecting the original animations.
const currentYearNode = document.querySelector('#current-year');
if (currentYearNode) currentYearNode.textContent = String(new Date().getFullYear());


// 7. Additive polish: scroll progress and active-section navigation.
// This does not change the existing preloader, cursor, typing, reveal or tilt logic.
(() => {
    const progressBar = document.querySelector('#scroll-progress-bar');
    let progressTicking = false;

    const updateScrollProgress = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        progressTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!progressTicking) {
            window.requestAnimationFrame(updateScrollProgress);
            progressTicking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const trackedSections = navLinks
        .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
        .filter(item => item.section);

    if ('IntersectionObserver' in window && trackedSections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                trackedSections.forEach(({ link, section }) => {
                    const active = section === entry.target;
                    link.classList.toggle('is-current', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-25% 0px -58% 0px', threshold: 0 });

        trackedSections.forEach(({ section }) => sectionObserver.observe(section));
    }
})();

// 8. Additive interactive spotlight and subtle hero parallax.
// Existing preloader, cursor, typing, scroll-reveal, and 3D-card tilt
// functions above are kept unchanged. This block only adds independent polish.
(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduceMotion.matches) return;

    const spotTargets = document.querySelectorAll('.glass-panel, .card, .hero-visual');
    spotTargets.forEach((element) => {
        element.addEventListener('pointermove', (event) => {
            const rect = element.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            element.style.setProperty('--spot-x', `${Math.max(0, Math.min(100, x))}%`);
            element.style.setProperty('--spot-y', `${Math.max(0, Math.min(100, y))}%`);
            element.classList.add('pointer-lit');
        }, { passive: true });
        element.addEventListener('pointerleave', () => {
            element.classList.remove('pointer-lit');
        }, { passive: true });
    });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.addEventListener('pointermove', (event) => {
            const rect = heroVisual.getBoundingClientRect();
            const relX = (event.clientX - rect.left) / rect.width - 0.5;
            const relY = (event.clientY - rect.top) / rect.height - 0.5;
            heroVisual.style.setProperty('--hero-tilt-x', `${(relX * 3.2).toFixed(2)}deg`);
            heroVisual.style.setProperty('--hero-tilt-y', `${(-relY * 3.2).toFixed(2)}deg`);
        }, { passive: true });
        heroVisual.addEventListener('pointerleave', () => {
            heroVisual.style.setProperty('--hero-tilt-x', '0deg');
            heroVisual.style.setProperty('--hero-tilt-y', '0deg');
        }, { passive: true });
    }
})();



// 9. Navigation repair: accessible compact menu and sticky-header-aware anchors.
// This is additive; the existing preloader, cursor, typing, reveal, and tilt code above remains unchanged.
(() => {
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('#nav-menu-toggle');
    const navMenu = document.querySelector('#primary-navigation');
    if (!header || !menuButton || !navMenu) return;

    const updateHeaderOffset = () => {
        const headerHeight = Math.ceil(header.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--site-header-height', `${headerHeight}px`);
    };

    const setMenuOpen = (open) => {
        header.classList.toggle('menu-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        menuButton.title = open ? 'Close navigation menu' : 'Open navigation menu';
        updateHeaderOffset();
    };

    menuButton.addEventListener('click', () => {
        setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = targetId ? document.querySelector(targetId) : null;
            setMenuOpen(false);
            if (!target) return;
            // Keep normal anchor history/hash behavior but land below the sticky header.
            event.preventDefault();
            if (window.location.hash !== targetId) history.pushState(null, '', targetId);
            const offset = Math.ceil(header.getBoundingClientRect().height) + 14;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('menu-open')) {
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (header.classList.contains('menu-open') && !header.contains(event.target)) setMenuOpen(false);
    });

    const desktopQuery = window.matchMedia('(min-width: 1121px)');
    const handleBreakpoint = () => setMenuOpen(false);
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', handleBreakpoint);
    else desktopQuery.addListener(handleBreakpoint);

    if ('ResizeObserver' in window) {
        new ResizeObserver(updateHeaderOffset).observe(header);
    } else {
        window.addEventListener('resize', updateHeaderOffset, { passive: true });
    }
    window.addEventListener('orientationchange', updateHeaderOffset, { passive: true });
    updateHeaderOffset();
})();
