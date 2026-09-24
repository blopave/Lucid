# Log de verificación — documentos de tokenización

Registro de cada auditoría de datos del informe y del road map. El protocolo está en
CLAUDE.md §9: una fuente abierta por dato, calificada de A a D, y lo que no se
confirma se marca o queda afuera.

**Calificación de fuentes**

| Nivel | Qué es | Cuándo alcanza |
| --- | --- | --- |
| A | Fuente primaria: regulador, Boletín Oficial, gobierno, tribunal, registro, emisor, o una plataforma de datos sobre sus propios datos (RWA.xyz, Chainalysis) | Sola |
| B | Prensa seria o estudio jurídico | Dos que coincidan, o una junto con una A |
| C | Dato que una empresa declara sobre sí misma, o una sola nota | Solo presentado como "según la empresa" |
| D | Poco confiable | No se usa |

---

## Actualización 3 · 24/09/2026 (datos al día y fecha de corte única)

**Qué se hizo:**
- Se releyeron hoy, en su fuente original, todas las cifras que cambian con el tiempo.
- Se buscaron novedades de Argentina, la región y el mundo desde junio de 2026. Tres verificadores trabajaron en paralelo, solo con WebFetch sobre las fuentes primarias.
- Se sacaron las referencias al informe de julio 2026 y las fechas repetidas: cada documento tiene una sola fecha de corte, `CORTE` en `src/build.py`.

**Cifras actualizadas** (RWA.xyz y emisores, nivel A salvo que se indique):

| Dato | Antes | Ahora |
| --- | --- | --- |
| Activos tokenizados que circulan libremente | USD 38.830M | USD 38.670M |
| Activos representados | USD 354.360M | USD 357.980M |
| Ethereum (valor en circulación) | USD 16.610M | USD 16.550M (43%) |
| BNB Chain / Solana / Stellar | 5,78 / 4,49 / 3,36 | 5,68 / 4,41 / 3,37 (USD miles de millones) |
| Provenance, representado | USD 22.970M | USD 23.040M |
| Bonos del Tesoro de EE.UU. tokenizados | USD 14.930M | USD 14.940M |
| USYC (Circle) | USD 2.510M | USD 2.430M |
| Crédito privado (en circulación / representado) | 8.100 / 36.470 | 7.980 / 36.550 (USD millones) |
| Materias primas | USD 5.000M | USD 4.920M |
| Tether Gold / Pax Gold | 2.700 / 1.890 | 2.650 / 1.850 (USD millones) |
| Acciones tokenizadas | USD 3.140M | USD 3.130M |
| Ondo en acciones tokenizadas | USD 870M | USD 867M |
| BUIDL | USD 2.230M | USD 2.240M |
| Securitize | USD 4.680M | USD 4.720M |
| Maple, activos administrados (C, según la empresa) | USD 4.840M | USD 4.760M |
| Dólar en liras turcas (B) | 48,84 | 48,86 |

**Sin cambios, confirmados de nuevo:**
- Inmuebles: USD 226M en circulación y USD 1.340M representados.
- USDY: USD 2.270M, rendía 3,60%.
- WTGXX: USD 1.230M.
- ERC-3643: más de USD 32.000M, según su asociación.
- Registro de PSAV de la CNV: 81 empresas. R3AL Blocks sigue sin figurar.
- La prohibición del BCRA (Banco Central) sigue vigente.
- INDEC: el dato del 2.º trimestre de 2026 todavía no se publicó; sigue USD 259.305M al 31/03/2026.
- Landtoken: sigue con una sola serie.
- Ripio: nada nuevo después del AL30.

**Novedades incorporadas:**
- **Chainalysis, informe 2026** (publicado el 23/09/2026, A). Reemplaza al de 2025.
  - Argentina recibió USD 88.500M en los 12 meses a junio de 2026 (+15,3%) y sigue segunda de la región.
  - Brasil: USD 252.500M (−1,6%). México: USD 77.600M (+25,5%). Venezuela: USD 39.100M. Colombia: USD 29.100M. Región: USD 593.800M (+9,8%).
  - En Argentina, las billeteras con al menos USD 10.000 en dólares digitales crecieron 82% desde julio de 2024.
  - Se sacó el dato de 2025 sobre "más de la mitad de las compras en pesos", que el informe 2026 no trae.
- **RG 1165 de la CNV** (07/09/2026, A): incluye a los PSAV en la matriz de actividades compatibles. No es una norma de tokenización. No hubo normas nuevas de tokenización después de la RG 1150.
- **Hong Kong:** su corporación hipotecaria colocó unos HKD 12.000M en bonos digitales (10/06/2026, HKMA, A).
- **DTCC:** operaciones reales con activos tokenizados junto a unas 40 firmas el 15/07/2026; el servicio se lanza en octubre de 2026 (A).
- **SEC:** propuesta de "Regulation Crypto Assets" (18/08/2026, A). La plataforma de la Bolsa de Nueva York sigue sin lanzarse; presentó su regla en abril de 2026 (Federal Register, A).
- **GENIUS Act:** todavía sin normas finales; entra en vigencia a más tardar el 18/01/2027 (texto de la ley, A).
- **Dubái:** desde julio de 2026 se puede comprar en la reventa desde AED 1.000; siguen siendo 10 propiedades (Gulf News, B).
- **RealT:** en abril de 2026 perdió el control de la cartera, que pasó a un fiduciario independiente (Outlier Media, B). No hay novedades posteriores a la liquidación anunciada el 02/07/2026.

**No se sumó (plan, sin emisión, o fuentes contradictorias):**
- el piloto de Kazajistán en Alatau City, que es un plan;
- el acuerdo de TAP Real Estate por el Zermatt Resort, que es un acuerdo;
- el hotel Trump en Maldivas, donde las fuentes se contradicen.

**Pendiente:**
- Lofty: el sitio bloquea las lecturas, así que se mantiene el dato de sep 2023 rotulado como "según la empresa".
- El Boletín Oficial no se revisó directamente para julio a septiembre.
- La prohibición brasileña en los registros inmobiliarios no se reverificó hoy.
- **Próxima revalidación:** antes del 24/12/2026, y el 29/09/2026 si el INDEC publica el dato nuevo.

---

## Auditoría 2 · 24/09/2026 (texto final completo)

**Alcance:** los dos documentos enteros, auditados sobre el texto ya armado y no sobre notas previas.
- Más de 200 afirmaciones contrastadas contra la fuente que cita cada una.
- Cinco auditores independientes: informe en tres partes, road map, y un quinto para los puntos en disputa.
- Al final se probaron las 134 fuentes citadas.

**Resultado:** no se encontraron errores de fondo en las tesis. Sí se corrigieron datos puntuales, citas mal asignadas y afirmaciones sin fuente.

### Correcciones de datos

| Dónde | Decía | Quedó | Fuente |
| --- | --- | --- | --- |
| RealT, varios capítulos | Demanda de Detroit por 408 propiedades | Más de 400 propiedades | Ciudad de Detroit (A) |
| RealT | Pagos suspendidos en febrero de 2026 | Los pagos se cortan casi por completo a fines de 2025 | Cryptobriefing (B) |
| RealT | Un fiduciario judicial toma el control | RealT acepta ceder el control a un fiduciario externo (abril de 2026) | Outlier Media (B) |
| ILLA Belgrano | Emitido en diciembre de 2025 | Colocación el 28/11/2025 | iProfesional (B) |
| ILLA Belgrano | Algunas fuentes dicen que la CNV aprobó la versión digital el 20/05/2026 | Autorización: Res. RESFC-2026-23510, del 08/04/2026. El 20/05 se publicó el documento de emisión en la AIF (Autopista de la Información Financiera de la CNV) | PAGBAM (B), LexLatin (B) |
| ILLA Belgrano | "El primer edificio con oferta pública" | "El primer fideicomiso financiero residencial con oferta pública" | LexLatin (B) |
| ILLA Belgrano | Ticket citado a La Nación | Citado a iProfesional: la nota de La Nación es contenido pago | iProfesional (B) |
| Landtoken | "Siete sociedades de bolsa y Ripio a la vez" | Siete sociedades de bolsa, y la versión digital en PSAV habilitados, entre ellos Ripio | Abogados.com.ar (B), calificadora UNTREF (A) |
| SeSocio | "El fideicomiso con BLC Trust nunca se concretó" | El fideicomiso existió, pero la publicidad presentaba a BLC Trust como custodio del dinero cuando lo manejaba SeSocio | Resolución de la CNV (A) |
| SeSocio | 2017–2022 | 2016–2022 (fideicomiso constituido el 30/08/2016) | Resolución de la CNV (A) |
| Reental | Las fichas son préstamos | Las fichas son obligaciones de deuda vinculadas al inmueble | Observatorio Blockchain (B) |
| Ripio, AL30 | "Primer valor negociable tokenizado del país" | "Primer bono soberano argentino tokenizado" (Landtoken fue anterior) | iProfesional (B) |
| Chainalysis | Argentina recibió USD 93.900M, sin período | Entre julio de 2022 y junio de 2025 | Chainalysis (A) |
| Turquía | "Uno de los mayores compradores" | El mayor: 4,3% del PBI, abr 2023–mar 2024 | Chainalysis vía Cointelegraph (B) |
| Nigeria | "Cerca del 70% desde junio de 2023" | Entre junio de 2023 y febrero de 2024 | BusinessDay, Legit (B) |
| MAG + MANTRA | "Otro acuerdo por los mismos inmuebles" | Otro acuerdo, de USD 3.000M, con MultiBank y Mavryk (mayo de 2025) | FX News Group (B) |
| MANTRA | La ficha OM cayó 90% "en dos días" | 90% en cuestión de horas (13–14/04/2025) | CoinDesk (B) |
| Lofty | "100+ propiedades" | 148 propiedades a sep 2023, según la empresa | Algorand (C, rotulado) |
| BENJI | "Nació" / "base" en Stellar; gasto de 0,20% | Nació en Stellar en 2021; el gasto de 0,20% en 2024 era con una exención temporal (0,26% sin ella) | Franklin Templeton (A), prospecto ante la SEC (A) |
| USDY (Ondo) | "Paga 3,60%" | Rendía 3,60% al 22/09/2026, variable, y no es una promesa | Ondo (A, emisor) |
| MiCA | Licencia válida en 27 países desde dic 2024 | Aplicación completa desde dic 2024, con un período de transición hasta jul 2026 | ESMA (A) |
| RG 1150 | "ETF y certificados vinculados" | Fondos abiertos ETF y certificados CEVA vinculados a ETP | Boletín Oficial (A) |
| RG 1087 | "Etapa III" | Sin el rótulo, que la norma no usa | Boletín Oficial (A) |
| Brickken | "Español, con socio legal en Argentina" | Sede en Barcelona; el socio argentino no se confirmó y se sacó | Brickken, aviso legal (A) |
| Metro Futuro | Incluía el proyecto Sense Manantiales | Sevilla MF3 (Sense ya no figura) | Metro Futuro (C) |
| Kobe | "Armado por Kenedix con SMBC y Daiwa" | Ficha de Kenedix que se revende en START, el mercado de Osaka Digital Exchange respaldado por SMBC y Daiwa | ODX (A) |
| DTCC | "Anunció la tokenización" | Anunció un plan para tokenizar | Canton (A) |
| Larry Fink | "Presidente" | Presidente y director ejecutivo | BlackRock (A) |

### Afirmaciones que se sacaron por falta de fuente

- Honorario de fiduciario del 5,5% (modelo del Colegio de Escribanos: sin URL).
- "El Banco Central evalúa cambiar la prohibición" de operar cripto.
- En qué redes operaba RealT (Gnosis y Ethereum).
- Pala sobre Polygon: solo aparece como logo en su sitio.
- La adopción de eNaira "según el FMI".
- La proyección de BCG de USD 16 billones: la página citada no muestra la cifra.
- Los cambios de metodología de RWA.xyz en noviembre de 2025 y marzo de 2026.
- El máximo histórico de BUIDL (USD 2.500–2.850M).
- La fecha de publicación del INDEC.
- El crecimiento de 18% en 30 días de las acciones tokenizadas, porque es una cifra que cambia a diario.
- Corite y otros pilotos de regalías.
- "Desde USD 50–100", reemplazado por "montos chicos" (canon §4).
- Que R3AL Blocks cobre en pesos, dólares o cripto.

### Afirmaciones a las que se les agregó fuente

- **Normas:** RG 1058 (Boletín Oficial); Código Civil y Comercial, arts. 1685, 1686, 1892 y 2277 (InfoLEG); Ley 17.801 (InfoLEG).
- **Instituciones del resumen ejecutivo:** Securitize, Stellar, JPMorgan, UBS, ICE y Gobierno de Hong Kong.
- **Regulación de EE.UU.:** GENIUS Act (Casa Blanca) y la declaración de la SEC de enero de 2026.
- **Casos y ejemplos:** el origen de ERC-3643 (EIP-3643), Circle en BUIDL, la primera venta de Dubái (Dubai Land Department, 29/05/2025), Celsius (CFTC) y los ejemplos de estructuras legales (Aspen, Lofty, Reental).
- **Tabla de la Parte XII:** 15 fuentes.

### Dato nuevo encontrado

- R3AL Blocks declara en su sitio la matrícula PSAV n.º 148. Esa matrícula **no figura** en el registro de la CNV, que tiene 81 inscriptos al 24/09/2026. Se informa tal cual.

### Criterio de fecha de corte

- Las cifras de RWA.xyz son las leídas el 23/09/2026 y se rotulan con esa fecha.
- Al 24/09/2026 los auditores vieron variaciones menores al 3% (por ejemplo, total USD 38.620–38.670M).
- Centrifuge se redondeó a "alrededor de USD 1.000M": su valor cambia fuerte de un día a otro.

### Fuentes que no responden a consultas automáticas (verificadas por otra vía)

- SEC, UBS, ICE, Securitize y Lofty bloquean bots: devuelven error 403 o 429.
- IMPO, el sitio oficial de leyes de Uruguay, estaba caído (error 502). La Ley 20.345 se verificó en una copia archivada de Wayback.

### Pendiente

- Revisión de un abogado de mercado de capitales y de un contador.
- El exchange propio del grupo inscripto como PSAV: no confirmado, quedó afuera.
- Los montos colocados por Landtoken (efectivo), Pala, Metro Futuro y Lena Buró.
- Si ya circulan las fichas de ILLA Belgrano.
- El dato del INDEC del 2.º trimestre de 2026, cuando se publique.
- **Próxima revalidación de cifras de mercado:** ver la actualización 3.

---

## Auditoría 1 · 23/09/2026 (informe de julio 2026)

Primera revisión del informe original, con tres agentes de verificación. Las correcciones principales están en la tabla de la Parte XII del informe:

- BUIDL no superó los USD 3.000M.
- Ethereum tiene el 43% del valor en circulación, no el 60%.
- Los PSAV inscriptos son 81, no 140.
- La cita "cuándo, no si" de Larry Fink no existe.
- "La lira perdió 450%" es imposible, porque nada pierde más de 100%.
- El costo de €55.000–140.000 no tenía fuente.
- El Banco Central no habilitó a los bancos a operar cripto.
- Argentina "más avanzada que Colombia o México" no tiene fuente que lo compare.
