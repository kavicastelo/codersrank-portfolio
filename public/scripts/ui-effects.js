// Theme toggle logic
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');

    // Get saved theme or default to 'dark'
    let currentTheme = localStorage.getItem('theme') || 'dark';

    // Optional: Respect user's system preference on first visit
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            currentTheme = 'light';
        }
    }

    // Apply the theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Optional: Listen to system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {  // Only if user hasn't manually chosen
            const systemTheme = e.matches ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', systemTheme);
        }
    });
}

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, header, footer').forEach(el => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
});
