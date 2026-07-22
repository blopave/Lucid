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
const heroHint  = document.querySelector('[data-hero-hint]');

let heroHintDismissed = false;
function dismissHeroHint() {
  if (heroHintDismissed || !heroHint) return;
  heroHintDismissed = true;
  heroHint.classList.add('is-dismissed');
  /* Un tick después de la transición, sacamos del DOM para que no capture focus. */
  setTimeout(() => heroHint.remove(), 800);
}

/* Umbral para que el pill aparezca (~60px de scroll). */
const SCROLL_TRIGGER = 60;

let raf = 0;

function updateOnScroll() {
  const y = Math.max(0, window.scrollY);
  const viewportH = window.innerHeight;

  /* 1. --hero-progress: 0 arriba del todo, 1 al terminar la primera pantalla. */
  const heroProgress = prefersReducedMotion ? 0 : Math.min(y / viewportH, 1);
  document.documentElement.style.setProperty('--hero-progress', heroProgress.toFixed(3));

  /* 2. Header visible cuando ya empezó el scroll. Hint del hero se disipa
        apenas hay actividad de scroll: su función era invitar, cumplida. */
  header.classList.toggle('site-header--visible', y > SCROLL_TRIGGER);
  if (y > 0) dismissHeroHint();

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

   Únicas celdas ámbar: las que caen sobre el PUNTO de la "i" (índice 3
   de "lucid"), o sea las que cumplen: x dentro del bounding de la "i"
   Y y en el tercio superior del bloque de texto. Todo lo demás es crema.
   Al cristalizar, el <text> final replica el mismo gesto: cuerpo crema,
   punto de la i (tspan superpuesto) en ámbar.
--------------------------------------------------------------------- */

const HERO_TEXT   = 'lucid';
const I_LETTER_INDEX = 3;                  /* 0=l, 1=u, 2=c, 3=i, 4=d */
const HERO_FONT   = 'italic 700 500px "Zodiak", "Times New Roman", serif';

/* Densidad del mesh escalada por viewport: en pantallas chicas (<720px de
   ancho) el wordmark ocupa proporcionalmente el mismo espacio, pero renderizar
   la misma cantidad de celdas fatiga al hilo principal y crea ruido visual.
   Menos celdas, mismo pulso, misma lectura final. */
const IS_MOBILE   = window.innerWidth < 720;
const SAMPLE_STEP = IS_MOBILE ? 16 : 12;   /* píxeles entre muestras (más = menos celdas) */
const CELL_SIZE   = IS_MOBILE ? 13 : 10;   /* proporcional a SAMPLE_STEP para tapar el gap */

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

  /* 2. Calculamos el bounding box horizontal de cada letra para poder
     aislar el rango de la "i". */
  ctx.font = HERO_FONT;
  const letterBounds = [];
  for (let i = 0; i < HERO_TEXT.length; i++) {
    const prefix = HERO_TEXT.substring(0, i);
    const withLetter = HERO_TEXT.substring(0, i + 1);
    const startX = ctx.measureText(prefix).width + padding;
    const endX   = ctx.measureText(withLetter).width + padding;
    letterBounds.push({ start: startX, end: endX });
  }
  const iLetter = letterBounds[I_LETTER_INDEX];

  /* 3. Sampleo de píxeles del wordmark completo. */
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const cells = [];

  for (let y = 0; y < canvas.height; y += SAMPLE_STEP) {
    for (let x = 0; x < canvas.width; x += SAMPLE_STEP) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx + 3] > 128) {
        cells.push({ x, y, isBrand: false });
      }
    }
  }

  /* 3.5. Sampleamos "i" en un canvas aparte para localizar EXACTAMENTE dónde
     cae su punto. En italic Zodiak, el punto se desprende del stem y se
     corre hacia la derecha por el ángulo de italic — buscar dentro del
     advance-width del glifo lo pierde. Al aislar la "i", el punto es la
     PRIMER capa de ink que aparece desde arriba, y termina cuando hay un
     gap vertical (el hueco entre punto y stem). */
  function locateIDot() {
    const iCanvas = document.createElement('canvas');
    iCanvas.width  = 320;
    iCanvas.height = canvas.height;
    const iCtx = iCanvas.getContext('2d');
    iCtx.font = HERO_FONT;
    iCtx.fillStyle = '#fff';
    iCtx.textBaseline = 'alphabetic';
    const anchor = 40;
    iCtx.fillText('i', anchor, textHeight * 0.78 + padding);

    const iData = iCtx.getImageData(0, 0, iCanvas.width, iCanvas.height).data;
    const rowHasInk = (y) => {
      for (let x = 0; x < iCanvas.width; x += SAMPLE_STEP) {
        if (iData[(y * iCanvas.width + x) * 4 + 3] > 128) return true;
      }
      return false;
    };

    /* Topmost ink row. */
    let topY = 0;
    while (topY < iCanvas.height && !rowHasInk(topY)) topY += SAMPLE_STEP;

    /* Extendemos hacia abajo mientras haya ink en filas contiguas; se corta
       cuando aparece la primera fila vacía (gap entre punto y stem). */
    let bottomY = topY;
    for (let y = topY + SAMPLE_STEP; y < iCanvas.height; y += SAMPLE_STEP) {
      if (rowHasInk(y)) bottomY = y;
      else break;
    }

    /* BBox de píxeles ink dentro del rango del punto. */
    let minX = iCanvas.width, maxX = 0;
    for (let y = topY; y <= bottomY; y += SAMPLE_STEP) {
      for (let x = 0; x < iCanvas.width; x += SAMPLE_STEP) {
        if (iData[(y * iCanvas.width + x) * 4 + 3] > 128) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }

    return {
      offsetX: (minX + maxX) / 2 - anchor,   /* centro x del punto relativo al anchor del glifo */
      y:      (topY + bottomY) / 2,          /* centro y en coords del canvas principal */
      radius: Math.max(maxX - minX, bottomY - topY) / 2 + SAMPLE_STEP * 1.6,
    };
  }

  const iDot = locateIDot();
  const dotCx = iLetter.start + iDot.offsetX;
  const dotCy = iDot.y;
  const dotR  = iDot.radius;

  /* Marca como brand las celdas del wordmark completo que caen dentro del
     círculo del punto — así, en la fase de ensamblado, esas celdas ya
     salen ámbar y anclan visualmente donde va a cristalizar el <circle>. */
  const dotR2 = dotR * dotR;
  for (const cell of cells) {
    const dx = cell.x - dotCx;
    const dy = cell.y - dotCy;
    if (dx * dx + dy * dy <= dotR2) cell.isBrand = true;
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
     píxeles con el mismo color. Todo el wordmark cristaliza en crema; el
     PUNTO de la "i" se dibuja aparte como un <circle> ámbar centrado en
     la región del punto (mismo gesto que hicieron las celdas brand).
     El text se agrega DESPUÉS de las celdas para renderizarse encima. */
  const textEl = document.createElementNS(NS, 'text');
  textEl.setAttribute('class', 'hero-mesh__text');
  textEl.setAttribute('x', padding);
  textEl.setAttribute('y', textHeight * 0.78 + padding);
  textEl.textContent = HERO_TEXT;
  svg.appendChild(textEl);

  /* Punto ámbar sobre la i. Cubre por completo el dot natural crema del
     glifo de la "i" para que la cristalización final se lea íntegra en ámbar. */
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('class', 'hero-mesh__text-dot');
  dot.setAttribute('cx', dotCx.toFixed(1));
  dot.setAttribute('cy', dotCy.toFixed(1));
  dot.setAttribute('r', dotR.toFixed(1));
  svg.appendChild(dot);

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

/* ---------- Captura de emails — punto único de contacto con el storage ---
   Todos los notify-form (por vertical y el general de la lista de espera)
   pasan por acá. Cada entrada guarda email + timestamp ISO. Idempotente:
   si el mismo email ya está anotado en ese vertical, no duplica.
--------------------------------------------------------------------- */

// TODO producción: reemplazar el cuerpo por POST a /api/waitlist
function submitEmail(vertical, email) {
  const store = JSON.parse(localStorage.getItem('lucid:notify') || '{}');
  const list = store[vertical] || (store[vertical] = []);
  const already = list.some((entry) => entry.email === email);
  if (!already) list.push({ email, at: new Date().toISOString() });
  localStorage.setItem('lucid:notify', JSON.stringify(store));
}

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
    submitEmail(vertical, email);
    form.classList.add('is-sent');
  });
});
