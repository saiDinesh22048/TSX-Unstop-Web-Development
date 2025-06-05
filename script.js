function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Preloader
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <style>
            #preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(26, 26, 26, 0.5);
                backdrop-filter: blur(10px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
            }
            .spinner {
                border: 5px solid rgba(255, 255, 255, 0.2);
                border-top: 5px solid #f57c00;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            #preloader.hidden {
                opacity: 0;
                visibility: hidden;
            }
        </style>
    `;
    document.body.prepend(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 2000);
    });
});

// Particle effect for hero section
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}
document.addEventListener('DOMContentLoaded', createParticles);

// Smooth scrolling
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navbarLinks = document.querySelectorAll('.nav-link');
let isThrottled = false;

function updateActiveNavLink() {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => (isThrottled = false), 100);

    let currentSection = '';
    sections.forEach(section => {
        if (isInViewport(section)) {
            currentSection = section.getAttribute('id');
        }
    });

    navbarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Parallax effect
function updateParallax() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const sectionTop = section.offsetTop;
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
            const parallaxSpeed = section.dataset.parallaxSpeed || 0.3;
            const offset = Math.max(0, (scrollPosition - sectionTop) * parallaxSpeed);
            section.style.transform = `translateY(${Math.min(offset, 100)}px)`; // Cap offset to prevent excessive movement
        } else {
            section.style.transform = `translateY(0)`; // Reset when out of view
        }
    });
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('load', updateParallax);


// AOS Initialization
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 200, // Increased from default to trigger animations earlier
        disable: 'transform' // Disable AOS transforms to avoid conflicts
    });
}

// Project filter
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => card.classList.add('hidden'), 300);
            }
        });
    });
});

// Initialize "All" filter
document.addEventListener('DOMContentLoaded', () => {
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn) allFilterBtn.click();
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const feedback = document.getElementById('formFeedback');

        if (name && email && message) {
            feedback.innerHTML = `
                <p class="text-success">Thank you, ${name}! Your message has been sent.</p>
                <style>
                    .text-success { animation: fadeIn 0.5s ease-in-out; color: #ffca28; }
                    .text-danger { color: #d32f2f; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                </style>
            `;
            this.reset();
            setTimeout(() => (feedback.innerHTML = ''), 4000);
        } else {
            feedback.innerHTML = '<p class="text-danger">Please fill out all fields.</p>';
            setTimeout(() => (feedback.innerHTML = ''), 4000);
        }
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollToTopBtn';
scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
        scrollToTopBtn.style.display = 'block';
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
        setTimeout(() => (scrollToTopBtn.style.display = 'none'), 300);
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});