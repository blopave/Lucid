"""Genera los documentos de tokenización de lucid (HTML listo para imprimir a PDF).

Uso, desde la raíz del repo:
    python3 docs/tokenizacion/src/build.py

Escribe docs/tokenizacion/informe-tokenizacion-lucid.html y
docs/tokenizacion/roadmap-tokenizacion-inmuebles.html. El PDF se exporta desde
ese HTML (ver docs/tokenizacion/README.md).
"""
import re,html,os

SRC=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.dirname(SRC)
def R(n): return open(os.path.join(SRC,n),encoding='utf-8').read()
fonts=R('fonts.css')
css=R('base.css')
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
    b=re.sub(r'<section class="ch".*?</section>',lambda m:notes_for(m.group(0)),b,flags=re.S)
    # cualquier enlace restante fuera de secciones: texto plano
    b=re.sub(r'<a href="[^"]*">(.*?)</a>',r'\1',b,flags=re.S)
    c=css.replace('content:"lucid · Cómo tokenizar un inmueble en Argentina"',f'content:"{footer}"')
    page=f'<meta charset="utf-8">\n<title>{title}</title>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap">\n<style>\n{fonts}\n{c}\n{EXTRA}\n</style>\n{b}\n<script>{js}</script>\n'
    open(out,'w',encoding='utf-8').write(page)
    print(out, len(page), page.count('<a '))
DOCS=[
    ('informe.body.html','Tokenización: el mundo y Argentina','lucid · Informe: tokenización en el mundo y en Argentina','informe-tokenizacion-lucid.html'),
    ('roadmap.body.html','Road map de tokenización','lucid · Road map: cómo tokenizar un inmueble en Argentina','roadmap-tokenizacion-inmuebles.html'),
]
if __name__=='__main__':
    for body,title,footer,out in DOCS:
        build(body,title,footer,os.path.join(OUT,out))
