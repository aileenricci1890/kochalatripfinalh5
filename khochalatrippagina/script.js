/**
 * K'ochala Trip — script.js
 * JavaScript interactivo para la web turística de Cochabamba
 */

/* ============================================================
   1. NAVBAR — scroll effect + hamburger menu
============================================================ */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Aplica clase "scrolled" al hacer scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  toggleBackToTop();
}, { passive: true });

// Abre / cierra menú hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Cierra menú al hacer clic en un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Cierra menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   2. PARTÍCULAS FLOTANTES EN EL HERO
============================================================ */
const particlesContainer = document.getElementById('particles');

const PARTICLE_COLORS = [
  '#f1bf46', '#f59639', '#e1632d', '#92ab77',
  '#895a38', '#d7282f', '#ffd3a0'
];

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');

  const size   = Math.random() * 10 + 4;
  const color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  const left   = Math.random() * 100;
  const delay  = Math.random() * 10;
  const dur    = Math.random() * 10 + 8;

  p.style.cssText = `
    width:  ${size}px;
    height: ${size}px;
    background: ${color};
    left: ${left}%;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    opacity: 0.4;
  `;

  particlesContainer.appendChild(p);
}

// Crea 30 partículas al cargar
for (let i = 0; i < 30; i++) createParticle();

/* ============================================================
   3. SCROLL REVEAL — aparición de elementos al bajar
============================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   4. SLIDER DE HOTELES
============================================================ */
const hotelesTrack = document.getElementById('hotelesTrack');
const sliderPrev   = document.getElementById('sliderPrev');
const sliderNext   = document.getElementById('sliderNext');
const sliderDots   = document.getElementById('sliderDots');

let currentSlide   = 0;
let autoSlideTimer = null;
const CARDS_PER_VIEW = getCardsPerView();

function getCardsPerView() {
  if (window.innerWidth < 640)  return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

const totalCards   = hotelesTrack.querySelectorAll('.hotel-card').length;
const maxSlide     = Math.max(0, totalCards - getCardsPerView());

// Crea dots según cantidad de slides
function buildDots() {
  sliderDots.innerHTML = '';
  const perView = getCardsPerView();
  const total   = Math.max(1, totalCards - perView + 1);
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
  }
}

function updateDots() {
  sliderDots.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  const perView = getCardsPerView();
  const maxIdx  = Math.max(0, totalCards - perView);
  currentSlide  = Math.max(0, Math.min(index, maxIdx));

  // Calcula ancho de tarjeta + gap (24px)
  const cardWidth = hotelesTrack.querySelector('.hotel-card').offsetWidth + 24;
  hotelesTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  updateDots();
}

sliderNext.addEventListener('click', () => {
  const perView = getCardsPerView();
  const maxIdx  = Math.max(0, totalCards - perView);
  goToSlide(currentSlide < maxIdx ? currentSlide + 1 : 0);
  resetAutoSlide();
});

sliderPrev.addEventListener('click', () => {
  const perView = getCardsPerView();
  const maxIdx  = Math.max(0, totalCards - perView);
  goToSlide(currentSlide > 0 ? currentSlide - 1 : maxIdx);
  resetAutoSlide();
});

// Auto-slide cada 5 s
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    const perView = getCardsPerView();
    const maxIdx  = Math.max(0, totalCards - perView);
    goToSlide(currentSlide < maxIdx ? currentSlide + 1 : 0);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Soporte swipe táctil en el slider
let touchStartX = 0;
hotelesTrack.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

hotelesTrack.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) {
    if (delta > 0) {
      sliderNext.click();
    } else {
      sliderPrev.click();
    }
  }
});

buildDots();
startAutoSlide();

// Recalcula al redimensionar
window.addEventListener('resize', () => {
  buildDots();
  goToSlide(0);
});

/* ============================================================
   5. BOTÓN VOLVER ARRIBA
============================================================ */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   6. HOVER EFFECTS EN CARDS — cambio de color dinámico
============================================================ */
document.querySelectorAll('.act-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    const wrap = this.querySelector('.act-icon-wrap');
    if (wrap) {
      const bg = window.getComputedStyle(wrap).backgroundColor;
      this.style.borderLeftColor = bg;
    }
  });
  card.addEventListener('mouseleave', function () {
    this.style.borderLeftColor = 'transparent';
  });
});

/* ============================================================
   7. SMOOTH SCROLL para links internos
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura del navbar
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   8. NAVBAR — resalta link activo al hacer scroll
============================================================ */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-link'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   9. ANIMACIÓN DE NÚMEROS EN STATS DEL HERO
============================================================ */
function animateNumber(el, target, suffix, duration = 1500) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + (target - start) * ease);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observa cuando el hero-stats entra en viewport
const statsRow = document.querySelector('.hero-stats');
if (statsRow) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = document.querySelectorAll('.stat-number');
        animateNumber(statNums[0], 200, '+', 1200);
        // El segundo stat tiene texto estático (4.8★), lo dejamos
        animateNumber(statNums[2], 12, 'K+', 1500);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsRow);
}

/* ============================================================
   10. RIPPLE EFFECT en botones primarios
============================================================ */
document.querySelectorAll('.btn-primary, .btn-act, .hotel-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple   = document.createElement('span');
    const rect     = this.getBoundingClientRect();
    const size     = Math.max(rect.width, rect.height);
    const x        = e.clientX - rect.left - size / 2;
    const y        = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple-anim .6s ease-out;
      pointer-events: none;
    `;

    // Asegura que el botón tenga position relative y overflow hidden
    if (getComputedStyle(this).position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inyecta keyframe de ripple dinámicamente
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(2.5); opacity: 0; }
  }
  .active-link {
    background: rgba(225,99,45,.1) !important;
    color: #e1632d !important;
  }
`;
document.head.appendChild(rippleStyle);

/* ============================================================
   11. PARALLAX SUAVE en Hero blobs al mover el mouse
============================================================ */
document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  const dx = (clientX - cx) / cx;
  const dy = (clientY - cy) / cy;

  const blobs = document.querySelectorAll('.hero-blob');
  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 12;
    blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

/* ============================================================
   12. INIT — log de bienvenida en consola
============================================================ */
console.log(
  '%cK\'ochala Trip 🌄',
  'font-size:1.5rem; font-weight:900; color:#e1632d; background:#fff3e4; padding:8px 16px; border-radius:8px;'
);
console.log(
  '%cDescubre Cochabamba, Bolivia · Hecho con ❤️ en la Ciudad Jardín',
  'color:#895a38; font-size:.9rem;'
);