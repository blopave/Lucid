# Documentos de tokenización

Dos documentos vivos de lucid, con la identidad de la marca (canon §1–3):

| Archivo | Qué es | Para quién |
| --- | --- | --- |
| `informe-tokenizacion-lucid.pdf` | Informe completo: qué es la tokenización, mercados, redes, Argentina, casos globales y locales, escenarios, preguntas de la gente, verificación. | Respaldo y referencia: socios, inversores, asesores. |
| `roadmap-tokenizacion-inmuebles.pdf` | Road map para tokenizar un inmueble en Argentina, fase por fase, con casos reales como ejemplo. | El dueño de un activo y el equipo de lucid. |

Los `.html` de esta carpeta son la versión lista para imprimir de cada PDF.

## Reglas

- **Todo dato se verifica antes de entrar.** Una fuente primaria (emisor, regulador, Boletín Oficial, RWA.xyz) o dos medios serios que coincidan. Lo que no se confirma se marca como no confirmado o se deja afuera.
- **Cada cifra lleva su fuente y su fecha.** Las fuentes van como enlace en el HTML de origen; el build las convierte en notas numeradas al final de cada capítulo.
- **Nada clickeable en el PDF.** Sin enlaces, sin campos de formulario.
- **Voz del canon (§4).** Nada de promesas de rendimiento. Los estados regulatorios se afirman solo si están confirmados.
- **Revalidar las cifras de mercado cada ~90 días.** Y cada vez que se trabaje sobre lucid y aparezca data nueva.

## Cómo actualizar

1. Editar el contenido en `src/informe.body.html` o `src/roadmap.body.html`. Los estilos compartidos están en `src/base.css` y los gráficos en `src/charts.js`, cuyos datos están escritos en el propio archivo.
2. Generar los HTML desde la raíz del repo:

   ```
   python3 docs/tokenizacion/src/build.py
   ```

3. Exportar a PDF:
   - **Con Claude Code:** pedile que los exporte con Playwright (`page.pdf` en A4, con `printBackground: true` y media `print`).
   - **A mano:** abrir cada `.html` con Live Server en Chrome y elegir Imprimir → Guardar como PDF. Tamaño A4, márgenes predeterminados y "Gráficos de fondo" activado.
4. Actualizar la fecha de corte en la portada y, si cambió algún dato del informe de julio 2026, sumarlo a la tabla de la Parte XII.

`src/build.py` es un script local para generar documentos. No es parte del sitio, que sigue sin build (canon §5).

## Pendientes conocidos (al 23/09/2026)

- INDEC publica el dato de ahorro fuera del sistema del 2.º trimestre de 2026 el 29/09/2026 (informe, Parte IX).
- Sin confirmar: el exchange propio del grupo inscripto como PSAV; los montos colocados de Landtoken, Pala, Metro Futuro y Lena Buró; si ya circulan las fichas de ILLA Belgrano.
- Falta la revisión de un abogado de mercado de capitales y un contador antes de mostrar los documentos a terceros.
