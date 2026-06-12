// === WhatsApp Booking ===
function enviarReservaWhatsApp(e) {
  e.preventDefault();

  var servicio = document.getElementById('res-servicio').value;
  var fecha = document.getElementById('res-fecha').value;
  var hora = document.getElementById('res-hora').value;
  var nombre = document.getElementById('res-nombre').value.trim();
  var telefono = document.getElementById('res-telefono').value.trim();

  if (!servicio || !fecha || !hora || !nombre) return false;

  var fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {weekday:'long',day:'numeric',month:'long'});

  var mensaje = '💈 *Reserva en LA BARBIÈRE*%0A%0A'
    + '👤 *Nombre:* ' + encodeURIComponent(nombre) + '%0A'
    + '✂️ *Servicio:* ' + encodeURIComponent(servicio) + '%0A'
    + '📅 *Fecha:* ' + encodeURIComponent(fechaFormateada) + '%0A'
    + '🕐 *Hora:* ' + encodeURIComponent(hora);

  if (telefono) {
    mensaje += '%0A📱 *Teléfono:* ' + encodeURIComponent(telefono);
  }

  mensaje += '%0A%0A_¡Gracias! Me confirmáis la cita cuando podáis._';

  window.open('https://wa.me/34693411836?text=' + mensaje, '_blank');
  return false;
}

// === Horarios de la barbería ===
var horarios = {
  1: {manana:['09:30','14:00'],tarde:['16:00','21:00']},
  2: {manana:['09:30','14:00'],tarde:['16:00','21:00']},
  3: {manana:['09:30','14:00'],tarde:['16:00','21:00']},
  4: {manana:['09:30','21:00'],tarde:null},
  5: {manana:['09:30','21:00'],tarde:null},
  6: {manana:['09:00','14:00'],tarde:null}
};

function generateHours(manana, tarde) {
  var slots = [];
  // Generate morning slots
  var start = manana[0].split(':');
  var end = manana[1].split(':');
  var h = parseInt(start[0]), m = parseInt(start[1]);
  var endMin = parseInt(end[0]) * 60 + parseInt(end[1]);

  while (true) {
    var cur = h * 60 + m;
    if (cur >= endMin) break;
    var timeStr = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    slots.push(timeStr);
    m += 30;
    if (m >= 60) { h++; m = 0; }
  }

  // Evening slots
  if (tarde) {
    var tStart = tarde[0].split(':');
    var tEnd = tarde[1].split(':');
    h = parseInt(tStart[0]); m = parseInt(tStart[1]);
    endMin = parseInt(tEnd[0]) * 60 + parseInt(tEnd[1]);
    while (true) {
      var cur2 = h * 60 + m;
      if (cur2 >= endMin) break;
      var tStr = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
      if (slots.indexOf(tStr) === -1) slots.push(tStr);
      m += 30;
      if (m >= 60) { h++; m = 0; }
    }
  }
  return slots;
}

function updateHours(dateStr) {
  var select = document.getElementById('res-hora');
  select.innerHTML = '<option value="">Seleccionar hora</option>';
  if (!dateStr) return;

  var date = new Date(dateStr + 'T00:00:00');
  var day = date.getDay(); // 0=Sunday, 1=Monday, ... 6=Saturday

  if (day === 0) {
    select.innerHTML = '<option value="">Cerrado (domingo)</option>';
    return;
  }

  var horario = horarios[day];
  if (!horario) {
    select.innerHTML = '<option value="">Fuera de horario</option>';
    return;
  }

  var slots = generateHours(horario.manana, horario.tarde);
  slots.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    select.appendChild(opt);
  });
}

// === Init ===
document.addEventListener('DOMContentLoaded', function() {
  // Año footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fecha mínima = hoy
  var fechaInput = document.getElementById('res-fecha');
  if (fechaInput) {
    var today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
    fechaInput.addEventListener('change', function() { updateHours(this.value); });
  }

  // Menú hamburguesa
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
    });
    menu.querySelectorAll('a').forEach(function(l) {
      l.addEventListener('click', function() {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  var cards = document.querySelectorAll('.servicio-card, .testimonio-card');
  if ('IntersectionObserver' in window && cards.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function(el) { observer.observe(el); });
  } else {
    cards.forEach(function(el) { el.classList.add('visible'); });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    });
  });
});
