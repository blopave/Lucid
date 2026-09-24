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
- **Próxima revalidación de cifras de mercado:** antes del 23/12/2026.

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
