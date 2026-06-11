// Set min date to today
document.addEventListener('DOMContentLoaded', function() {
  var fechaInput = document.getElementById('res-fecha');
  if (fechaInput) {
    var today = new Date();
    fechaInput.setAttribute('min', today.toISOString().split('T')[0]);
    fechaInput.value = today.toISOString().split('T')[0];
  }
});

// Reservation form handler
function confirmarReserva(e) {
  e.preventDefault();
  var btn = document.getElementById('btn-reservar');
  var btnText = document.getElementById('btn-reservar-text');
  var btnLoading = document.getElementById('btn-reservar-loading');
  var fecha = document.getElementById('res-fecha').value;
  var hora = document.getElementById('res-hora').value;
  var personas = document.getElementById('res-personas').value;
  var nombre = document.getElementById('res-nombre').value;

  if (!fecha || !hora || !nombre) return false;

  // Visual feedback
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-flex';
  btn.disabled = true;

  // Simulate brief processing, then open Google Maps
  setTimeout(function() {
    // Open Google Maps reservation page in new tab
    window.open('https://maps.google.com/?cid=5676192936418391034', '_blank');

    // Reset form
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btn.disabled = false;
    document.getElementById('form-reserva').reset();
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];

    alert('Redirigiendo a Google Maps para completar tu reserva en Gascona.\n\nTambién puedes llamarnos al 636 47 45 63.');
  }, 800);

  return false;
}

// Switch tabs in the menu (global para onclick)
function switchTab(tabId) {
  document.querySelectorAll('.carta-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.carta-tab').forEach(function(t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  var panel = document.getElementById('panel-' + tabId);
  var tab = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');
  if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
}

(function() {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.body.classList.add('js-loaded');

  // Menú hamburguesa
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true' ? false : true;
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.classList.toggle('active');
    });
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      });
    });
  }

  // Scroll Reveal
  var revealEls = document.querySelectorAll('.plato-card, .testimonio-card');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // Contador animado de reseñas
  if ('IntersectionObserver' in window) {
    var animated = false;
    var countObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          var el = document.querySelectorAll('.about-stat-num')[1];
          if (el) {
            var current = 0, target = 2912, step = Math.ceil(target / 60);
            var timer = setInterval(function() {
              current += step;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = current.toLocaleString('es-ES');
            }, 25);
          }
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    var stats = document.querySelector('.about-stats');
    if (stats) countObserver.observe(stats);
  }

  // Smooth scroll para anclas
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        // Si era un tab dentro de la carta, no hacer nada extra
      }
    });
  });

})();
