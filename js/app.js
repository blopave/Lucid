/* ==========================================================================
   LUCID · Render del dashboard desde data/portfolio.json
   Vanilla JS, sin build. La UI se hidrata de los datos, nunca hardcodeada.

   Fixture activo: DATA_URL apunta al portfolio con activos. Para probar el
   estado vacío (usuario nuevo, aún sin invertir), cambiar DATA_URL a
   'data/portfolio-empty.json' — el hero se hidrata en US$ 0,00 sin delta ni
   renta y en lugar de la grilla de activos se muestra un bloque cálido con
   CTA a la sección de mundos.
   ========================================================================== */

const DATA_URL = 'data/portfolio.json';
// const DATA_URL = 'data/portfolio-empty.json';

const WORLDS = {
  propiedades: 'Propiedades',
  bonos:       'Bonos',
  acciones:    'Acciones',
  franquicias: 'Franquicias'
};

const nfUsd    = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfPct    = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfShare  = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Helpers ---------------------------------------------------------- */

function formatUsd(value) {
  return 'US$ ' + nfUsd.format(value);
}

function splitUsdParts(value) {
  const [int, dec] = nfUsd.format(value).split(',');
  return { int, dec: dec || '00' };
}

async function loadData() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo cargar el portfolio.');
  return res.json();
}

/* --- Count-up del total (feedback sutil, no espectáculo) -------------- */

function animateTotal(endValue) {
  const intEl = document.querySelector('[data-total-int]');
  const decEl = document.querySelector('[data-total-dec]');

  if (prefersReducedMotion || endValue === 0) {
    const parts = splitUsdParts(endValue);
    intEl.textContent = parts.int;
    decEl.textContent = ',' + parts.dec;
    return;
  }

  const duration = 700;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cúbica
    const current = endValue * eased;
    const parts = splitUsdParts(current);
    intEl.textContent = parts.int;
    decEl.textContent = ',' + parts.dec;
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* --- Hero ------------------------------------------------------------- */

function renderHero(data, isEmpty) {
  const { totalUsd, changePeriod, rentThisMonth } = data.portfolio;

  animateTotal(totalUsd);

  const meta = document.querySelector('.hero__meta');
  const actions = document.querySelector('.hero__actions');

  if (isEmpty) {
    // Portfolio vacío: sin delta, sin renta, sin acciones de mover plata.
    // Solo el total en US$ 0,00 y el label.
    if (meta) meta.hidden = true;
    if (actions) actions.hidden = true;
  } else {
    if (meta) meta.hidden = false;
    if (actions) actions.hidden = false;

    const deltaEl = document.querySelector('[data-delta]');
    const up = changePeriod.direction === 'up';
    deltaEl.classList.toggle('hero__delta--up', up);
    deltaEl.classList.toggle('hero__delta--down', !up);
    deltaEl.querySelector('.hero__delta-arrow').textContent = up ? '↑' : '↓';

    const sign = up ? '+' : '−';
    document.querySelector('[data-delta-value]').textContent = `${sign}${nfPct.format(changePeriod.percent)}%`;
    document.querySelector('[data-delta-abs]').textContent   = `· ${formatUsd(changePeriod.value)}`;
    document.querySelector('[data-delta-period]').textContent = changePeriod.period;
    document.querySelector('[data-rent]').textContent = formatUsd(rentThisMonth);
  }

  document.querySelector('[data-avatar]').textContent = data.user.initials;
}

/* --- Composición ------------------------------------------------------
   La composición se CALCULA desde los activos: suma de myShareUsd por
   mundo, dividida por el total. No se lee del JSON.
   Regla: sólo se muestra si hay más de un mundo representado.
--------------------------------------------------------------------- */

function computeComposition(assets) {
  const total = assets.reduce((sum, a) => sum + a.myShareUsd, 0);
  if (total <= 0) return [];

  const byWorld = new Map();
  for (const a of assets) {
    byWorld.set(a.world, (byWorld.get(a.world) || 0) + a.myShareUsd);
  }
  return Array.from(byWorld, ([world, value]) => ({
    world,
    value,
    percent: (value / total) * 100
  })).sort((a, b) => b.value - a.value);
}

function renderComposition(assets) {
  const container = document.querySelector('[data-composition]');
  const section = document.getElementById('composition-section');
  const comp = computeComposition(assets);

  if (comp.length < 2) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  const frag = document.createDocumentFragment();

  const bar = document.createElement('div');
  bar.className = 'composition__bar';
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', comp.map(c => `${WORLDS[c.world]} ${c.percent.toFixed(1)}%`).join(', '));

  comp.forEach(item => {
    const seg = document.createElement('div');
    seg.className = 'composition__segment';
    seg.dataset.world = item.world;
    seg.style.width = `${item.percent}%`;
    seg.style.background = `var(--world-${item.world})`;
    bar.appendChild(seg);
  });
  frag.appendChild(bar);

  const legend = document.createElement('div');
  legend.className = 'composition__legend';

  comp.forEach(item => {
    const it = document.createElement('div');
    it.className = 'composition__item';
    it.dataset.world = item.world;
    it.innerHTML = `
      <span class="composition__dot" style="background: var(--world-${item.world});" aria-hidden="true"></span>
      <span class="composition__name">${WORLDS[item.world]}</span>
      <span class="composition__value">${formatUsd(item.value)}</span>
      <span class="composition__percent">· ${nfPct.format(item.percent)}%</span>
    `;
    legend.appendChild(it);
  });
  frag.appendChild(legend);

  container.appendChild(frag);

  wireCompositionHighlight(container);
}

/* Vincula segmentos de la barra con ítems de leyenda: al pasar por
   cualquiera, se resalta su mundo y se atenúan los demás. Pura sensación
   de feedback — la info ya está toda visible, así que no hace falta soporte
   de teclado. Las transiciones (y su anulación bajo reduced-motion) las
   maneja el CSS. */
function wireCompositionHighlight(container) {
  const els = container.querySelectorAll('.composition__segment, .composition__item');

  const focusWorld = (world) => {
    els.forEach(el => {
      const match = el.dataset.world === world;
      el.classList.toggle('is-active', match);
      el.classList.toggle('is-dim', !match);
    });
  };

  const clear = () => {
    els.forEach(el => el.classList.remove('is-active', 'is-dim'));
  };

  els.forEach(el => {
    el.addEventListener('mouseenter', () => focusWorld(el.dataset.world));
    el.addEventListener('mouseleave', clear);
  });
}

/* --- Assets ----------------------------------------------------------- */

function renderAssets(data) {
  const container = document.querySelector('[data-assets]');
  const section   = container.closest('.section');
  const emptyEl   = document.getElementById('assets-empty');
  const isEmpty   = data.assets.length === 0;

  if (isEmpty) {
    // Estado vacío cálido: escondemos la grilla y el header de "Tus activos",
    // y mostramos un bloque invitando a explorar mundos.
    section.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  section.hidden = false;
  emptyEl.hidden = true;

  const frag = document.createDocumentFragment();

  data.assets.forEach(a => {
    const card = document.createElement('button');
    card.className = 'asset';
    card.type = 'button';
    card.setAttribute('aria-label', `${a.type} en ${a.location}. Ver detalle.`);
    card.innerHTML = `
      <div class="asset__head">
        <div class="asset__id" aria-hidden="true">${a.imageInitials}</div>
        <span class="chip chip--${a.world}">
          <span class="chip__dot" aria-hidden="true"></span>
          <span>${WORLDS[a.world]}</span>
        </span>
      </div>

      <div class="asset__meta">
        <div class="asset__title">${a.type} · ${a.location}</div>
        <div class="asset__location">Tu parte · ${nfShare.format(a.sharePercent)}%</div>
      </div>

      <div class="asset__body">
        <div class="asset__stat">
          <span class="asset__stat-label">Tu parte</span>
          <span class="asset__stat-value">${formatUsd(a.myShareUsd)}</span>
        </div>
        <div class="asset__stat">
          <span class="asset__stat-label">Renta pagada</span>
          <span class="asset__stat-value">${formatUsd(a.rentPaidUsd)}</span>
        </div>
      </div>

      <div class="asset__backing">
        <span class="asset__backing-label">Respaldo</span>
        <span class="asset__backing-value">${a.backing.structure} · ${a.backing.deedNumber}</span>
      </div>
    `;
    frag.appendChild(card);
  });

  container.appendChild(frag);
}

/* --- Mundos ----------------------------------------------------------- */

function renderWorlds(data) {
  const container = document.querySelector('[data-worlds]');
  const frag = document.createDocumentFragment();

  data.worlds.forEach(world => {
    const active = world.status === 'active';
    const tile = document.createElement(active ? 'button' : 'div');
    tile.className = `world-tile world-tile--${active ? 'active' : 'soon'}`;
    if (active) {
      tile.type = 'button';
      tile.setAttribute('aria-label', `Explorar ${world.name}`);
    }
    tile.innerHTML = `
      <div class="world-tile__head">
        <span class="world-tile__name">${world.name}</span>
        <span class="world-tile__status">${active ? 'Disponible' : 'Muy pronto'}</span>
      </div>
      <p class="world-tile__desc">${world.description}</p>
      <div class="world-tile__foot">
        <span class="world-tile__accent" style="background: var(--world-${world.id});" aria-hidden="true"></span>
        ${active ? '' : '<button class="btn btn--ghost btn--sm" type="button">Avisame</button>'}
      </div>
    `;
    frag.appendChild(tile);
  });

  container.appendChild(frag);
}

/* --- Wiring del CTA del estado vacío ---------------------------------- */

function wireEmptyStateCTA() {
  const cta = document.querySelector('[data-empty-cta]');
  if (!cta) return;
  cta.addEventListener('click', () => {
    const target = document.getElementById('worlds-section');
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

/* --- Bootstrap -------------------------------------------------------- */

async function init() {
  try {
    const data = await loadData();
    const isEmpty = !data.assets || data.assets.length === 0;
    renderHero(data, isEmpty);
    renderComposition(data.assets || []);
    renderAssets(data);
    renderWorlds(data);
    wireEmptyStateCTA();
  } catch (err) {
    console.error(err);
    document.querySelector('[data-total-int]').textContent = '—';
    document.querySelector('[data-total-dec]').textContent = '';
  }
}

init();
