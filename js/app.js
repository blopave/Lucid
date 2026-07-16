/* ==========================================================================
   LUCID · Render del dashboard desde data/portfolio.json
   Vanilla JS, sin build. La UI se hidrata de los datos, nunca hardcodeada.
   ========================================================================== */

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
  const res = await fetch('data/portfolio.json');
  if (!res.ok) throw new Error('No se pudo cargar el portfolio.');
  return res.json();
}

/* --- Count-up del total (feedback sutil, no espectáculo) -------------- */

function animateTotal(endValue) {
  const intEl = document.querySelector('[data-total-int]');
  const decEl = document.querySelector('[data-total-dec]');

  if (prefersReducedMotion) {
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

function renderHero(data) {
  const { totalUsd, changePeriod, rentThisMonth } = data.portfolio;

  animateTotal(totalUsd);

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

  document.querySelector('[data-avatar]').textContent = data.user.initials;
}

/* --- Composición ------------------------------------------------------ */

function renderComposition(data) {
  const container = document.querySelector('[data-composition]');
  const section = document.getElementById('composition-section');
  const comp = data.portfolio.composition || [];

  // Regla: sólo aparece con más de un tipo de activo
  if (comp.length < 2) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  const frag = document.createDocumentFragment();

  // Barra segmentada
  const bar = document.createElement('div');
  bar.className = 'composition__bar';
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', comp.map(c => `${WORLDS[c.world]} ${c.percent.toFixed(1)}%`).join(', '));

  comp.forEach(item => {
    const seg = document.createElement('div');
    seg.className = 'composition__segment';
    seg.style.width = `${item.percent}%`;
    seg.style.background = `var(--world-${item.world})`;
    bar.appendChild(seg);
  });
  frag.appendChild(bar);

  // Leyenda
  const legend = document.createElement('div');
  legend.className = 'composition__legend';

  comp.forEach(item => {
    const it = document.createElement('div');
    it.className = 'composition__item';
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
}

/* --- Assets ----------------------------------------------------------- */

function renderAssets(data) {
  const container = document.querySelector('[data-assets]');
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

/* --- Bootstrap -------------------------------------------------------- */

async function init() {
  try {
    const data = await loadData();
    renderHero(data);
    renderComposition(data);
    renderAssets(data);
    renderWorlds(data);
  } catch (err) {
    console.error(err);
    document.querySelector('[data-total-int]').textContent = '—';
    document.querySelector('[data-total-dec]').textContent = '';
  }
}

init();
