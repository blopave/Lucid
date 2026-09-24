"""Genera los documentos de tokenización de lucid (HTML listo para imprimir a PDF).

Uso, desde la raíz del repo:
    python3 docs/tokenizacion/src/build.py

Escribe docs/tokenizacion/informe-tokenizacion-lucid.html y
docs/tokenizacion/roadmap-tokenizacion-inmuebles.html. El PDF se exporta desde
ese HTML (ver docs/tokenizacion/README.md).
"""
import re,html,os,json

# Fecha de corte de los datos: se cambia acá y se refleja en ambos documentos.
CORTE='24/09/2026'

SRC=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.dirname(SRC)
def R(n): return open(os.path.join(SRC,n),encoding='utf-8').read()
fonts=R('fonts.css')
css=R('base.css')
diagrams=R('diagrams.css')
js=R('charts.js')
EXTRA='''
.example{border:1px solid rgba(229,178,74,.3);border-radius:var(--radius-lg);background:var(--bg-1);padding:18px 20px;margin:24px 0;display:grid;gap:10px}
.example__k{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--brand);margin:0}
.example h4{margin:0;font-family:var(--font-display);font-size:1.2rem;font-weight:700;line-height:1.25}
.example p{margin:0;font-size:var(--text-sm)}
.cases .example{margin:0}
.box{width:16px;height:16px;border:1.5px solid var(--border-strong);border-radius:4px;display:inline-block;margin-top:2px}
sup.fn{font-family:var(--font-mono);font-size:.62em;color:var(--brand);margin-left:1px;vertical-align:super;line-height:0}
.case__src sup.fn{font-size:.8em}
.notes{list-style:none;padding:14px 0 0;margin:28px 0 0;border-top:1px solid var(--border);display:grid;gap:4px;max-width:none;break-inside:auto}
.notes__k{font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted);margin:0 0 4px}
.notes li{display:grid;grid-template-columns:22px 1fr;gap:6px;font-size:9.5px;line-height:1.4;color:var(--text-muted);margin:0;break-inside:avoid}
.notes li span{font-family:var(--font-mono);color:var(--brand)}

.flow--6{grid-template-columns:repeat(3,1fr)!important;gap:10px}
.faq{display:grid;grid-template-columns:1fr;gap:0}
.faq > div{padding:14px 0;border-bottom:1px solid var(--border);break-inside:avoid}
.faq h4{margin:0 0 6px;font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--text-primary)}
.faq p{margin:0;font-size:var(--text-base)}

/* ---------- aperturas de capítulo ---------- */
.step-open{display:flex;align-items:center;gap:18px;margin:0 0 14px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.step-num{font-family:var(--font-display);font-style:italic;font-weight:700;font-size:4.2rem;line-height:.9;color:var(--brand);min-width:1.1em;letter-spacing:-.02em}
.step-num--roman{font-size:3.4rem;font-style:normal;min-width:1.6em}
.step-open--alt .step-num{color:var(--text-secondary)}
.step-meta{display:grid;gap:8px}
.step-meta .ch__label{margin:0}
.step-title{margin:0;font-family:var(--font-mono);font-size:var(--text-xs);letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
.step-bar{display:flex;gap:5px}
.step-bar i{width:26px;height:5px;border-radius:3px;background:var(--bg-3)}
.step-bar i.on{background:var(--brand)}
.outcome{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:baseline;background:var(--brand-tint);border:1px solid rgba(229,178,74,.35);border-radius:12px;padding:12px 16px;margin:4px 0 22px}
.outcome span{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brand)}
.outcome p{margin:0;color:var(--text-primary);font-size:var(--text-base);max-width:none}
/* ---------- índice ---------- */
.print-index h2{margin-bottom:10px}
.idx-group{margin:16px 0 0;break-inside:avoid-page}
.print-index .idx-k{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin:0 0 2px;padding-bottom:6px;border-bottom:1px solid var(--border-strong);max-width:none}
.print-index .idx-group ol{margin:0;display:grid}
.print-index .idx-group li{display:grid;grid-template-columns:52px 1fr auto;gap:12px;align-items:baseline;padding:7px 0;border-bottom:1px solid var(--border);break-inside:avoid}
.print-index .idx-group .idx-n{font-family:var(--font-display);font-weight:700;font-size:1.2rem;color:var(--text-secondary);line-height:1;padding:0;letter-spacing:0}
.print-index .idx-steps .idx-n{font-style:italic;color:var(--brand);font-size:1.6rem}
.print-index .idx-group li b{font-family:var(--font-display);font-size:1.08rem}
.print-index .idx-group li small{margin-top:2px}
.print-index .idx-group .idx-p{padding:0;font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-secondary);min-width:2.2em;text-align:right;font-variant-numeric:tabular-nums}
.pgmark{position:absolute;font-size:2px;line-height:1;color:#0E1620;white-space:nowrap}
section.ch{position:relative}
@media print{ .notes{grid-template-columns:1fr 1fr;column-gap:18px} }
@page{background:#0E1620}

.notes li code{font-family:var(--font-mono);font-size:9px;color:var(--text-secondary);word-break:break-all}
'''
def notes_for(sec):
    urls=[]
    def repl(m):
        u,t=m.group(1),m.group(2)
        if u not in urls: urls.append(u)
        n=urls.index(u)+1
        label=re.sub(r'<[^>]+>','',t).strip()
        if label in ('Fuente',): return f'<sup class="fn">{n}</sup>'
        return f'{t}<sup class="fn">{n}</sup>'
    sec=re.sub(r'\s?<a href="(https?://[^"]+)">(.*?)</a>' if False else r'<a href="(https?://[^"]+)">(.*?)</a>',repl,sec,flags=re.S)
    sec=sec.replace(' <sup class="fn">','<sup class="fn">')
    if urls:
        items=''.join(f'<li><span>{i+1}</span><code>{html.escape(u)}</code></li>' for i,u in enumerate(urls))
        sec=sec[:sec.rindex('</section>')]+f'  <div class="notes-wrap"><p class="notes__k">Notas y fuentes</p><ol class="notes">{items}</ol></div>\n    </section>'
    return sec
def build(body_path,title,footer,out):
    b=R(body_path)
    b=b.replace('{{CORTE}}',CORTE)
    b=re.sub(r'<section class="ch".*?</section>',lambda m:notes_for(m.group(0)),b,flags=re.S)
    b=re.sub(r'(<section class="ch" id="([^"]+)">)',lambda m:m.group(1)+f'<span class="pgmark" aria-hidden="true">@@{m.group(2)}@@</span>',b)
    pj=os.path.join(SRC,'pages.json')
    pages=json.load(open(pj)).get(os.path.basename(out),{}) if os.path.exists(pj) else {}
    b=re.sub(r'<span class="idx-p" data-for="([^"]+)"></span>',lambda m:f'<span class="idx-p" data-for="{m.group(1)}">{pages.get(m.group(1),"")}</span>',b)
    # cualquier enlace restante fuera de secciones: texto plano
    b=re.sub(r'<a href="[^"]*">(.*?)</a>',r'\1',b,flags=re.S)
    c=css.replace('content:"lucid · Cómo tokenizar un inmueble en Argentina"',f'content:"{footer}"')
    page=f'<meta charset="utf-8">\n<title>{title}</title>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap">\n<style>\n{fonts}\n{c}\n{EXTRA}\n{diagrams}\n</style>\n{b}\n<script>{js}</script>\n'
    open(out,'w',encoding='utf-8').write(page)
    print(out, len(page), page.count('<a '))
DOCS=[
    ('informe.body.html','Tokenización: el mundo y Argentina','lucid · Informe: tokenización en el mundo y en Argentina','informe-tokenizacion-lucid.html'),
    ('roadmap.body.html','Road map de tokenización','lucid · Road map: cómo tokenizar un inmueble en Argentina','roadmap-tokenizacion-inmuebles.html'),
]
if __name__=='__main__':
    for body,title,footer,out in DOCS:
        build(body,title,footer,os.path.join(OUT,out))
