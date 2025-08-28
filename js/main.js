// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Carousel for promotions
function scrollTrack(dir){
  const el = document.getElementById('promoTrack');
  if(!el) return;
  const step = el.clientWidth * 0.8;
  el.scrollBy({left: dir * step, behavior: 'smooth'});
}

// Generic horizontal scroll by element id (gallery)
function scrollEl(id, dir){
  const el = document.getElementById(id);
  if(!el) return;
  const step = el.clientWidth * 0.8;
  el.scrollBy({left: dir * step, behavior: 'smooth'});
}

// Auto-advance for horizontal tracks (simple loop)
function autoScrollTrack(id, stepFactor = 0.9, interval = 3500){
  const el = document.getElementById(id);
  if(!el) return;
  setInterval(() => {
    const step = el.clientWidth * stepFactor;
    if (el.scrollLeft + el.clientWidth + step >= el.scrollWidth - 2){
      el.scrollTo({left: 0, behavior: 'auto'});
    } else {
      el.scrollBy({left: step, behavior: 'smooth'});
    }
  }, interval);
}

// Sort promotions by weekday using data-days (e.g., "2-4" or "3")
function sortPromosByDay(){
  const track = document.getElementById('promoTrack');
  if(!track) return;
  const promos = Array.from(track.children).filter(el => el.classList?.contains('promo'));
  const items = promos.map((el, idx) => {
    const ds = (el.dataset && el.dataset.days) ? String(el.dataset.days) : '';
    const nums = Array.from(ds.matchAll(/\d+/g)).map(m => parseInt(m[0], 10));
    const key = nums.length ? Math.min(...nums) : 99 + idx;
    return {el, key, idx};
  });
  items.sort((a,b) => (a.key - b.key) || (a.idx - b.idx));
  items.forEach(({el}) => track.appendChild(el));
}

// Init
autoScrollTrack('galleryTrack', 0.9, 3500);
sortPromosByDay();

// Destacar la promoción del día (grande) y dejar las otras pequeñas
function highlightTodayPromo(){
  const track = document.getElementById('promoTrack');
  if(!track) return;
  const today0Sun = new Date().getDay(); // 0..6 (Dom..Sáb)
  const day = today0Sun === 0 ? 7 : today0Sun; // 1..7 (Lun..Dom)

  const promos = Array.from(track.children).filter(el => el.classList?.contains('promo'));

  function matchesDay(spec){
    if(!spec) return false;
    const parts = String(spec).split(/[\s,]+/).filter(Boolean);
    for(const p of parts){
      const m = p.match(/^(\d+)-(\d+)$/);
      if(m){
        const a = parseInt(m[1],10), b = parseInt(m[2],10);
        if(a<=b){ if(day>=a && day<=b) return true; }
        else { if(day>=a || day<=b) return true; }
      } else if(/^\d+$/.test(p)){
        if(parseInt(p,10) === day) return true;
      }
    }
    return false;
  }

  // Reset classes/visibility
  promos.forEach(el => {
    el.classList.remove('today','thumb');
    el.removeAttribute('hidden');
  });

  // Pick first match as today; others become thumbs
  let todayEl = null;
  for(const el of promos){
    const ds = el.dataset?.days || '';
    if(!todayEl && matchesDay(ds)){ todayEl = el; break; }
  }
  if(!todayEl && promos.length){ todayEl = promos[0]; }
  promos.forEach(el => {
    if(el === todayEl){
      el.classList.add('today');
      const b = el.querySelector('.badge');
      if(b) b.textContent = 'Hoy';
    } else {
      el.classList.add('thumb');
    }
  });
}

highlightTodayPromo();

// Slider simple para el destacado de música/karaoke
(function initMusicHero(){
  const root = document.querySelector('.music-hero');
  if(!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  if(slides.length <= 1) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 3500);
})();

// Carta interactiva (pestañas) con delegación de eventos
function setCardapioCategory(cat){
  const grid = document.getElementById('menuGrid');
  const wrap = document.getElementById('cardapio');
  if(!grid || !wrap) return false;
  const tabs = Array.from(wrap.querySelectorAll('.tab'));
  tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === cat)));
  Array.from(grid.children).forEach(it => {
    const show = it.getAttribute('data-cat') === cat;
    if(show){ it.removeAttribute('hidden'); }
    else { it.setAttribute('hidden',''); }
  });
  return true;
}

function initCardapioUI(){
  const wrap = document.getElementById('cardapio');
  if(!wrap || wrap.dataset.ui) return;
  const tabsWrap = wrap.querySelector('.tabs');
  if(tabsWrap){
    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if(!btn) return;
      const cat = btn.dataset.tab;
      setCardapioCategory(cat);
    });
  }
  // Estado inicial
  setCardapioCategory('pasteis');
  wrap.dataset.ui = '1';
}

initCardapioUI();

// Toggle de la carta inmediatamente debajo del botón
(function initCardapioToggle(){
  const btn = document.querySelector('.hero .btn.btn-primary[href="#cardapio"]');
  const section = document.getElementById('cardapio');
  if(!btn || !section) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = section.hasAttribute('hidden');
    if(isHidden){
      section.removeAttribute('hidden');
      btn.setAttribute('aria-expanded','true');
      // Ensure actions are present (idempotent)
      enhanceMenuActions();
      initCardapioUI();
    } else {
      section.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();

// Añade botones de ubicación y WhatsApp en los ítems de la carta
function enhanceMenuActions(){
  const grid = document.getElementById('menuGrid');
  if(!grid) return;
  const phone = '34647255683';
  const gmaps = 'https://www.google.com/maps/dir/?api=1&destination=Calle%20Reina%20Felicia%207%2C%20Zaragoza%2C%2050003';
  Array.from(grid.querySelectorAll('.menu-item')).forEach(el => {
    if(el.dataset.enhanced) return;
    const label = el.textContent.trim();
    el.textContent = '';
    el.classList.add('has-actions');

    const loc = document.createElement('a');
    loc.className = 'mini-btn';
    loc.href = gmaps; loc.target = '_blank'; loc.rel = 'noopener noreferrer';
    loc.setAttribute('aria-label','Abrir ubicación en Google Maps');
    const locImg = document.createElement('img');
    locImg.src = '/images/localizacao.jpg';
    locImg.alt = 'Ubicación'; locImg.loading = 'lazy';
    loc.appendChild(locImg);

    const wpp = document.createElement('a');
    wpp.className = 'mini-btn'; wpp.target = '_blank'; wpp.rel = 'noopener noreferrer';
    wpp.setAttribute('aria-label','Abrir WhatsApp con el pedido');
    const msg = `Hola! Me gustaría pedir ${label}.`;
    wpp.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    const wppImg = document.createElement('img');
    wppImg.src = '/images/wpp.jpg';
    wppImg.alt = 'WhatsApp'; wppImg.loading = 'lazy';
    wpp.appendChild(wppImg);

    const span = document.createElement('span');
    span.className = 'item-label';
    span.textContent = label;

    const actions = document.createElement('span');
    actions.className = 'item-actions';
    actions.append(loc, wpp);

    el.append(span, actions);
    el.dataset.enhanced = '1';
  });
}

enhanceMenuActions();

// Normaliza los textos de los badges en "Noche de música"
(function initMusicBadges(){
  const badges = document.querySelectorAll('#musica .music-badges .badge-pill');
  if(badges && badges.length){
    if(badges[0]) badges[0].textContent = 'Jueves: Karaoke (desde las 18:00)';
    if(badges[1]) badges[1].textContent = 'Sábados: Show en vivo';
  }
})();
