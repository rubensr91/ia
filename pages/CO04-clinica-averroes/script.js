// Año actual en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú hamburguesa
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Scroll Reveal con Intersection Observer
const revealElements = document.querySelectorAll('.servicio-card, .testimonio-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Header transparente al inicio, sólido al scrollear
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    header.style.background = 'var(--white)';
    header.style.boxShadow = 'var(--shadow)';
  } else {
    header.style.background = 'var(--white)';
    header.style.boxShadow = 'var(--shadow)';
  }
  lastScroll = currentScroll;
});
