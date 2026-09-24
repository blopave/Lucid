"""Lee los PDF exportados y anota en qué página empieza cada capítulo (src/pages.json).

Uso, desde la raíz del repo, después de exportar los PDF:
    python3 docs/tokenizacion/src/paginate.py
Después se corre build.py de nuevo y se re-exportan los PDF: el índice ya sale con páginas.
Requiere pypdf (pip install pypdf).
"""
import os,re,json
import pypdf
SRC=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.dirname(SRC)
res={}
for name in ['informe-tokenizacion-lucid','roadmap-tokenizacion-inmuebles']:
    r=pypdf.PdfReader(os.path.join(OUT,name+'.pdf')); pages={}
    for i,p in enumerate(r.pages):
        for sid in re.findall(r'@@([a-z0-9-]+)@@',p.extract_text() or ''):
            pages.setdefault(sid,i+1)
    res[name+'.html']=pages
    print(name,pages)
json.dump(res,open(os.path.join(SRC,'pages.json'),'w'),indent=1,ensure_ascii=False)
