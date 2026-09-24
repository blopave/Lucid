# lucid — Canon del proyecto

Este documento es el canon permanente del repo. Toda sesión (Claude o humana) lo
lee al empezar y lo respeta. Ningún cambio de identidad, tipografía, voz o
paleta se hace sin decisión explícita del dueño del proyecto.

Si algo choca con este documento, el canon gana. Si el canon está mal, se
actualiza acá primero y después se toca el código.

---

## 1. Marca

- El wordmark es **"lucid"**, siempre en minúscula. Nunca "Lucid", nunca "LUCID".
- **EL GESTO DE IDENTIDAD ES EL PUNTO DE LA "i".** Es "la luz": el ÚNICO
  elemento de color del wordmark.
- Color por defecto del punto: ámbar `var(--brand)`.
- En el dashboard, el punto se tiñe con el color del mundo activo (custom
  property `--wm-dot-color` sobre el contenedor del wordmark).
- **PROHIBIDO** colorear cualquier otra letra. La versión con "u" ámbar quedó
  eliminada del proyecto y no debe volver bajo ninguna forma.

### Técnica del wordmark
El contenedor del wordmark lleva `aria-label="lucid"`. Adentro:
- Texto plano `"luc"`
- `<span class="wm-i" aria-hidden="true">ı</span>` (i sin punto, U+0131)
- `<span class="wm-dot" aria-hidden="true"></span>` (círculo posicionado absoluto
  sobre la ı, background `var(--wm-dot-color, var(--brand))`, `border-radius:50%`)
- Texto plano `"d"`

Si Zodiak no incluye glifo para ı en algún tamaño, se usa "i" normal y se tapa
su punto tipográfico con un pseudo-elemento del color de fondo antes de dibujar
el `.wm-dot` propio. El resultado óptico siempre es: cuerpo crema, punto en color.

Ajustar tamaño y posición del punto en cada tamaño de uso (header 1.35rem,
footer, topbar, hero, favicon) por afinación óptica.

---

## 2. Tipografía

Las **mismas TRES familias** en TODAS las páginas del proyecto (landing y
dashboard):

- **Zodiak** (Fontshare) — display serif con itálicas modernistas. Es la
  tipografía del wordmark, de los titulares, del manifiesto y de la tagline.
  Pesos: 400, 401 (italic), 700, 701 (bold italic).
- **Switzer** (Fontshare) — neo-grotesque para cuerpo, botones, párrafos.
  Pesos: 400, 500, 600, 700.
- **JetBrains Mono** (Google) — cifras tabulares (`tabular-nums`), etiquetas
  técnicas, chips, IDs de asset. Pesos: 400, 500.

**Prohibidas en este proyecto:** Unbounded, Geist, Geist Mono, Inter, cualquier
serif genérica del sistema. Si aparece una referencia a estas, hay que
eliminarla; es residuo de iteraciones anteriores.

Los tokens (`css/tokens.css`) son la fuente de verdad — nunca se define una
`font-family` a mano fuera de ese archivo.

---

## 3. Paleta

La única paleta autorizada es la de `css/tokens.css` — "Mercado nocturno":
navy petróleo (`--bg` = `#0E1620`) con tinta crema (`--text-primary` = `#ECE4D0`)
y ámbar de marca (`--brand` = `#E5B24A`). Los cuatro mundos tienen su color
propio (`--world-propiedades`, `--world-bonos`, `--world-acciones`,
`--world-franquicias`).

**No inventar colores nuevos.** Si se necesita un valor nuevo, se agrega como
token en `tokens.css` y desde ahí se usa.

---

## 4. Voz

Español rioplatense (vos, tenés, agendá), claro, cálido, adulto. Traduce todo
lo técnico al criollo. Menos es más.

**Prohibido:**
- Jerga cripto sin traducir: "wallet", "token", "mintear", "on-chain", "gas",
  "L2", "smart contract". Si el concepto es necesario, se explica en criollo
  o se sustituye ("tu parte digital", "registro público", etc.).
- Montos promocionales concretos ("desde $1000", "gana US$300 al mes").
- Promesas de rendimiento ("rendí un X%", "renta garantizada").
- **AFIRMAR EN PRESENTE ESTADOS REGULATORIOS O DE CUSTODIA QUE TODAVÍA NO
  EXISTEN.** El estado real del proyecto se comunica como proceso ("en
  construcción", "va a", "cada activo pasará por"). Nunca se dice "regulado",
  "custodia bancaria activa", "aprobado por CNV" mientras eso no sea un hecho.

Los compromisos concretos y fechados sí son afirmables ("Primera propiedad ·
Palermo · Q4 2026" es un compromiso, no una afirmación regulatoria).

---

## 5. Doctrina de producto

- **La landing enamora. El dashboard respeta.**
- En el dashboard: el número va primero, cero espectáculo. Un count-up de
  700ms es la única animación aceptable en la hidratación del hero.
- Las animaciones de entrada cinematográficas (mesh, tagline stagger, world
  reveals) viven ÚNICAMENTE en la landing.
- El movimiento es feedback (150–250ms), no decoración. Duraciones definidas
  como tokens (`--transition-fast/base/slow`).
- Respetar `prefers-reduced-motion` en todo lo que se anime.
- El sitio corre sin build — HTML/CSS/JS vanilla + Live Server. No sumar
  bundlers, no sumar frameworks.

---

## 6. Método de trabajo

- **Sprints con prioridades P0/P1/P2**, un bloque a la vez, verificando entre
  bloques antes de seguir.
- Los sprints se piden desde afuera del canon. El canon no cambia salvo
  decisión explícita.
- Cada sprint documenta sus criterios de aceptación y se cumple entero antes
  de darlo por cerrado.
- Todo cambio visible debe verse en Live Server sin errores de consola.
- Los datos del dashboard viven en `data/portfolio.json`. La UI se hidrata,
  nunca se hardcodea.

---

## 7. Estructura del repo

```
/
├── index.html          # Landing pública (pre-login)
├── app.html            # Dashboard (post-login mock)
├── css/
│   ├── tokens.css      # Design tokens — fuente única de verdad
│   ├── components.css  # Wordmark, botones, chips, hero, cards
│   ├── layout.css      # Estructura del dashboard
│   └── landing.css     # Todo lo de landing
├── js/
│   ├── landing.js      # Mesh, parallax, reveals, captura email
│   └── app.js          # Render del dashboard desde portfolio.json
├── data/
│   └── portfolio.json  # Datos mock del usuario/portfolio
├── img/
│   ├── favicon.svg     # Gesto mínimo: navy + punto ámbar
│   ├── og.svg          # Open Graph — fuente vectorial
│   └── og.png          # Open Graph 1200×630 rasterizado
└── docs/
    └── tokenizacion/   # Informe + road map de tokenización (ver §9)
        ├── informe-tokenizacion-lucid.pdf
        ├── roadmap-tokenizacion-inmuebles.pdf
        └── src/        # Fuente HTML + build.py que genera los documentos
```

## 8. Pendientes conocidos

- `img/og.png` fue rasterizado por Playwright a partir de `img/og-render.html`
  (helper eliminado tras generar el PNG). Si se cambia el diseño de `og.svg`
  hay que regenerar el PNG: por ahora no tenemos ImageMagick / rsvg-convert
  en el entorno, así que el flujo es abrir el SVG en Chrome + screenshot a
  1200×630, o restaurar el helper HTML temporalmente.

- **`--text-muted` — RESUELTO (jul 2026).** Con aprobación del dueño se subió
  de `#6D7D93` a `#899AAF` para pasar WCAG AA (≥4.5) en cuerpo chico sobre las
  cuatro superficies (ratios medidos: 6.33 `--bg`, 5.95 `--bg-1`, 5.47 `--bg-2`,
  4.88 `--bg-3`). El valor anterior sólo cumplía AA-large. Todos los `-ink` de
  mundos y los otros tokens de texto ya pasaban AA.

---

## 9. Documentos vivos de tokenización

`docs/tokenizacion/` guarda dos documentos que acompañan al producto:

- **Informe completo** (`informe-tokenizacion-lucid.pdf`): panorama de la
  tokenización en el mundo y en Argentina, con casos reales verificados.
- **Road map** (`roadmap-tokenizacion-inmuebles.pdf`): cómo tokenizar un
  inmueble en Argentina, fase por fase, con ejemplos reales.

Reglas (decisión del dueño, sep 2026):

- **Se actualizan mientras se trabaja sobre lucid.** Si una sesión trae data
  nueva sobre tokenización, regulación, proveedores o casos, se incorpora a
  estos documentos y se regeneran los PDF.
- **Todo dato se verifica antes de entrar**, con fuente primaria o dos medios
  serios que coincidan. Lo no confirmado se marca o queda afuera. La
  información no puede fallar: cada auditoría (fuente abierta por dato,
  calificación A–D, veredicto) se registra en
  `docs/tokenizacion/VERIFICACION.md`, y ante cualquier cambio de contenido se
  audita el texto final, no las notas previas.
- **Llevan la identidad de lucid** (§1–3) y la voz del canon (§4). El PDF no
  tiene elementos clickeables: las fuentes van como notas numeradas.
- El cómo (editar, generar, exportar a PDF) está en
  `docs/tokenizacion/README.md`.
