/* ==========================================================================
   LUCID · Landing
   Sistema cinematográfico:
     1. Handoff del wordmark (scroll-linked scale/translate).
     2. Header pulz-style (invisible en scrollY=0, aparece al scrollear).
     3. Parallax del aurora del tagline.
     4. Parallax de las ilustraciones de cada mundo.
     5. Reveal en entrada (tagline, manifiesto, mundos) via IntersectionObserver.
   Además: captura de emails en las cards de mundos.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Refs ------------------------------------------------------- */
const header    = document.getElementById('site-header');
const tagAurora = document.querySelector('.tagline-block__aurora');
const worlds    = Array.from(document.querySelectorAll('.world'));

/* Umbral para que el pill aparezca (~60px de scroll). */
const SCROLL_TRIGGER = 60;

let raf = 0;

function updateOnScroll() {
  const y = Math.max(0, window.scrollY);
  const viewportH = window.innerHeight;

  /* 1. --hero-progress: 0 arriba del todo, 1 al terminar la primera pantalla. */
  const heroProgress = prefersReducedMotion ? 0 : Math.min(y / viewportH, 1);
  document.documentElement.style.setProperty('--hero-progress', heroProgress.toFixed(3));

  /* 2. Header visible cuando ya empezó el scroll. */
  header.classList.toggle('site-header--visible', y > SCROLL_TRIGGER);

  /* 3. Parallax del aurora del tagline. */
  if (tagAurora && !prefersReducedMotion) {
    const rect = tagAurora.parentElement.getBoundingClientRect();
    if (rect.bottom > -400 && rect.top < viewportH + 400) {
      const offset = (viewportH / 2 - rect.top) * 0.22;
      tagAurora.style.setProperty('--tagline-parallax', `${offset.toFixed(1)}px`);
    }
  }

  /* 4. Parallax vertical de cada ilustración de mundo. */
  if (!prefersReducedMotion) {
    for (const world of worlds) {
      const rect = world.getBoundingClientRect();
      if (rect.bottom < -400 || rect.top > viewportH + 400) continue;
      const centerDelta = (rect.top + rect.height / 2) - viewportH / 2;
      const parallax = centerDelta * -0.08;
      const visual = world.querySelector('.world__visual');
      if (visual) visual.style.setProperty('--world-parallax', `${parallax.toFixed(1)}px`);
    }
  }

  raf = 0;
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(updateOnScroll);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
updateOnScroll();

/* ---------- Hero mesh — el wordmark ES la asamblea ------------------
   Renderizamos "lucid" en Zodiak Bold Italic dentro de un canvas
   oculto y sampleamos sus píxeles. Por cada píxel que tiene texto,
   colocamos una celda SVG. Al ensamblarse, las celdas DIBUJAN la
   palabra desde adentro — la marca ES la asamblea tokenizada.

   Las celdas que caen dentro del bounding box horizontal de la "u"
   se colorean ámbar (variante --brand). El resto en crema.
--------------------------------------------------------------------- */

const HERO_TEXT   = 'lucid';
const BRAND_LETTER_INDEX = 1;              /* 0=l, 1=u, 2=c, 3=i, 4=d */
const HERO_FONT   = 'italic 700 500px "Zodiak", "Times New Roman", serif';
const SAMPLE_STEP = 12;                    /* píxeles entre muestras (menor = más celdas) */
const CELL_SIZE   = 10;                    /* tamaño de cada celda cuadrada (en unidades del canvas) */

function initHeroMesh() {
  const heroEl   = document.querySelector('.hero-brand');
  const container = document.querySelector('.hero-mesh');
  const svg = document.querySelector('.hero-mesh__svg');
  if (!heroEl || !container || !svg) return;

  /* Reduced motion: no armamos el mesh, materializamos directo. */
  if (prefersReducedMotion) {
    heroEl.classList.add('is-materialized');
    return;
  }

  /* 1. Canvas oculto para renderizar el texto y samplear píxeles. */
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = HERO_FONT;

  const padding = 40;   /* margen para descenders, hooks del italic, etc. */
  const metrics = ctx.measureText(HERO_TEXT);
  const textWidth = Math.ceil(metrics.width);
  /* Alto aproximado del texto — Zodiak Bold Italic 500px tiene ascender
     alto por el hook de la 'l'. Usamos ~460px como caja de dibujo. */
  const textHeight = 460;

  canvas.width  = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;

  /* Reset del contexto (algunos browsers pierden font al resize del canvas). */
  ctx.font = HERO_FONT;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(HERO_TEXT, padding, textHeight * 0.78 + padding);

  /* 2. Calculamos el bounding box horizontal de cada letra para saber
     cuáles caen dentro de la letra brand ("u" por defecto). */
  ctx.font = HERO_FONT;
  const letterBounds = [];
  for (let i = 0; i < HERO_TEXT.length; i++) {
    const prefix = HERO_TEXT.substring(0, i);
    const withLetter = HERO_TEXT.substring(0, i + 1);
    const startX = ctx.measureText(prefix).width + padding;
    const endX   = ctx.measureText(withLetter).width + padding;
    letterBounds.push({ start: startX, end: endX });
  }
  const brandLetter = letterBounds[BRAND_LETTER_INDEX];

  /* 3. Sampleo de píxeles: por cada SAMPLE_STEP px de la caja, chequeamos
     si el píxel tiene texto (alpha > umbral). Cada uno se vuelve una celda. */
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const cells = [];

  for (let y = 0; y < canvas.height; y += SAMPLE_STEP) {
    for (let x = 0; x < canvas.width; x += SAMPLE_STEP) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx + 3] > 128) {
        cells.push({
          x, y,
          isBrand: x >= brandLetter.start && x < brandLetter.end
        });
      }
    }
  }

  /* 4. Construimos el SVG con viewBox del tamaño del canvas. Cada celda
     es un rect centrado en su coordenada muestreada. */
  svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);

  const NS = 'http://www.w3.org/2000/svg';
  const frag = document.createDocumentFragment();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxDist = Math.hypot(centerX, centerY);

  for (const cell of cells) {
    const dist = Math.hypot(cell.x - centerX, cell.y - centerY) / maxDist;

    /* Posición inicial random — cada celda viene desde afuera en cualquier
       dirección, con radio proporcional al tamaño del canvas. */
    const initAngle  = Math.random() * Math.PI * 2;
    const initRadius = (0.6 + Math.random() * 0.8) * Math.max(canvas.width, canvas.height);
    const initX = Math.cos(initAngle) * initRadius;
    const initY = Math.sin(initAngle) * initRadius;

    /* Delay basado en distancia al centro — pulso expansivo. */
    const delay = Math.round(dist * 1200);

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('class', 'hero-mesh__cell' + (cell.isBrand ? ' hero-mesh__cell--brand' : ''));
    rect.setAttribute('x', (cell.x - CELL_SIZE / 2).toFixed(1));
    rect.setAttribute('y', (cell.y - CELL_SIZE / 2).toFixed(1));
    rect.setAttribute('width', CELL_SIZE);
    rect.setAttribute('height', CELL_SIZE);
    rect.style.setProperty('--init-x', `${initX.toFixed(1)}px`);
    rect.style.setProperty('--init-y', `${initY.toFixed(1)}px`);
    rect.style.setProperty('--delay', `${delay}ms`);
    frag.appendChild(rect);
  }

  svg.innerHTML = '';
  svg.appendChild(frag);

  /* 4.5. AGREGAMOS el <text> final en el MISMO sistema de coordenadas
     que las celdas — misma font, misma escala, misma posición. Esto es
     la clave para que la transición sea perfecta: cuando las celdas
     hacen fade out y el text hace fade in, ocupan exactamente los mismos
     píxeles con el mismo color. No hay salto de tamaño.
     El text se agrega DESPUÉS de las celdas para renderizarse encima. */
  const textEl = document.createElementNS(NS, 'text');
  textEl.setAttribute('class', 'hero-mesh__text');
  textEl.setAttribute('x', padding);
  textEl.setAttribute('y', textHeight * 0.78 + padding);

  const before = HERO_TEXT.substring(0, BRAND_LETTER_INDEX);
  const brand  = HERO_TEXT.charAt(BRAND_LETTER_INDEX);
  const after  = HERO_TEXT.substring(BRAND_LETTER_INDEX + 1);

  if (before) textEl.appendChild(document.createTextNode(before));
  const tspan = document.createElementNS(NS, 'tspan');
  tspan.setAttribute('class', 'hero-mesh__text-brand');
  tspan.textContent = brand;
  textEl.appendChild(tspan);
  if (after) textEl.appendChild(document.createTextNode(after));

  svg.appendChild(textEl);

  /* 5. Secuencia de dos fases:
        Fase 1 (0-2200ms):     scatter → assemble (celdas dibujan "lucid").
        Fase 2 (2200-2900ms):  cristalización — celdas fade out + wordmark fade in.
                               Al final: la tipografía Zodiak original limpia. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroEl.classList.add('is-assembled');
      setTimeout(() => heroEl.classList.add('is-materialized'), 2200);
    });
  });
}

/* Esperamos a que Zodiak esté cargada antes de samplear el canvas —
   si samplemos antes, cae en la fuente fallback y las métricas cambian. */
if (document.fonts && document.fonts.load) {
  document.fonts.load(HERO_FONT).then(initHeroMesh, initHeroMesh);
} else {
  initHeroMesh();
}

/* ---------- IntersectionObserver — entradas cinematográficas ---------- */
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.tagline, .manifesto, .world').forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.tagline, .manifesto, .world').forEach((el) => {
    el.classList.add('is-in');
  });
}

/* ---------- Captura de email (mock local, localStorage) --------------- */
document.querySelectorAll('.notify-form').forEach((form) => {
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const input = form.querySelector('.notify-form__input');
    const email = (input.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.focus();
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    const vertical = form.dataset.notify || 'general';
    const store = JSON.parse(localStorage.getItem('lucid:notify') || '{}');
    store[vertical] = store[vertical] || [];
    if (!store[vertical].includes(email)) store[vertical].push(email);
    localStorage.setItem('lucid:notify', JSON.stringify(store));
    form.classList.add('is-sent');
  });
});
