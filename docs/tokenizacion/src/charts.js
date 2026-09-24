
(function(){
  const NS='http://www.w3.org/2000/svg';
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const C={priv:css('--route-priv'),pub:css('--route-pub'),text:css('--text-primary'),sec:css('--text-secondary'),muted:css('--text-muted'),grid:'rgba(236,228,208,.08)',axis:'rgba(236,228,208,.18)',neg:css('--negative'),brand:css('--brand'),bg2:css('--bg-2'),bg1:css('--bg-1')};
  function el(tag,attrs,parent,text){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e}
  const fmt=n=>n.toLocaleString('es-AR');
  const tip=document.getElementById('tip');
  function bindTip(){}
  function barPath(x,y,w,h,r){r=Math.min(r,w/2,h);return `M${x},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h-r}Q${x+w},${y+h} ${x+w-r},${y+h}H${x}Z`}

  /* cover fraction */
  const fr=document.getElementById('fraction');
  const lit=new Set([132,133,152,153,172,173,192,193]);
  if(fr){for(let i=0;i<200;i++){const c=document.createElement('i');const col=i%20,row=Math.floor(i/20);
    // silueta de casa: techo a dos aguas + cuerpo
    const roof=row<5 && Math.abs(col-9.5)<=row*2+1.5; const body=row>=5 && col>=3 && col<=16;
    if(roof||body)c.className='on'; if(lit.has(i))c.className='lit'; fr.appendChild(c)}}

  /* waffle */
  const wf=document.getElementById('waffle');if(wf)for(let i=0;i<100;i++){const c=document.createElement('i');if(i<80)c.className='o';wf.appendChild(c)}

  /* ---------- Gantt ---------- */
  const phases=['1 · Activo','2 · Estructura legal','3 · Regulación','4 · Proveedor','5 · Emisión','6 · Colocación','7 · Vida del activo'];
  const priv=[[0,1.5],[0.5,2.5],[1,2],[1,2.5],[2.5,3],[3,5],[5,12]];
  const pub =[[0,1.5],[1,4],[2,10],[2,4],[10,10.5],[10.5,11.5],[11.5,12]];
  (function(){
    const svg=document.getElementById('gantt');if(!svg)return;const W=760,L=150,R=16,T=26,rowH=38,H=T+phases.length*rowH+8;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);const x=m=>L+(W-L-R)*m/12;
    for(let m=0;m<=12;m+=2){el('line',{x1:x(m),x2:x(m),y1:T-6,y2:H-8,stroke:C.grid},svg);el('text',{x:x(m),y:14,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,m===0?'0':m+(m===12?'+ m':''))}
    phases.forEach((p,i)=>{const y=T+i*rowH;el('text',{x:0,y:y+rowH/2+4,'font-size':13,fill:C.sec},svg,p);
      [[priv[i],C.priv,'Privado',y+7],[pub[i],C.pub,'Oferta pública',y+19]].forEach(([r,c,lab,yy])=>{
        const open=r[1]===12;const w=Math.max(4,x(r[1])-x(r[0]));
        const b=el('path',{d:barPath(x(r[0]),yy,w,10,4),fill:c,opacity:open?.55:1},svg);
        bindTip(b,`<b>${p}</b><span>${lab}: mes ${fmt(r[0])} a ${open?'todo el plazo':'mes '+fmt(r[1])}</span>`)});
    });
    const tb=document.querySelector('#gantt-table tbody');if(tb)phases.forEach((p,i)=>{tb&&tb.insertAdjacentHTML('beforeend',`<tr><td>${p}</td><td class="num">${fmt(priv[i][0])}–${priv[i][1]===12?'fin':fmt(priv[i][1])}</td><td class="num">${fmt(pub[i][0])}–${pub[i][1]===12?'fin':fmt(pub[i][1])}</td></tr>`)});
  })();

  /* ---------- Timeline ---------- */
  (function(){
    const svg=document.getElementById('timeline');if(!svg)return;const W=900,H=300,L=24,R=24,axisY=150;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const t0=new Date(2025,2,1),t1=new Date(2028,0,15);const x=d=>L+(W-L-R)*(d-t0)/(t1-t0);
    el('rect',{x:x(new Date(2025,5,1)),y:axisY-6,width:x(new Date(2027,11,31))-x(new Date(2025,5,1)),height:12,rx:6,fill:'rgba(229,178,74,.14)'},svg);
    el('line',{x1:L,x2:W-R,y1:axisY,y2:axisY,stroke:C.axis},svg);
    [2025,2026,2027].forEach(y=>{const xx=x(new Date(y,0,1));if(xx>L){el('line',{x1:xx,x2:xx,y1:axisY-4,y2:axisY+4,stroke:C.muted},svg);el('text',{x:xx+4,y:axisY+20,'text-anchor':'start','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,y)}});
    // tier: + arriba, - abajo; 1 = cerca del eje, 2 = lejos
    const ev=[
      {d:new Date(2025,3,10),t:'RG 1060',s:'Consulta pública',tier:2,k:'n'},
      {d:new Date(2025,5,15),t:'RG 1069',s:'Etapa I',tier:-1,k:'n'},
      {d:new Date(2025,7,20),t:'Landtoken',s:'Campos · tope USD 20M',tier:1,k:'e'},
      {d:new Date(2025,7,21),t:'RG 1081',s:'Más instrumentos',tier:-2,k:'n'},
      {d:new Date(2025,9,22),t:'RG 1087',s:'Etapa III',tier:2,k:'n',dx:40},
      {d:new Date(2026,3,8),t:'ILLA Belgrano',s:'Edificio · USD 4,15M',tier:1,k:'e'},
      {d:new Date(2026,4,4),t:'RG 1137',s:'Consulta ampliación',tier:-1,k:'n'},
      {d:new Date(2026,5,10),t:'RG 1150',s:'Prórroga a 2027',tier:-2,k:'n',dx:30},
      {d:new Date(2027,11,31),t:'31/12/2027',s:'Vence el período de prueba',tier:1,k:'end'},
    ];
    ev.forEach(e=>{const xx=x(e.d);const up=e.tier>0;const dist=Math.abs(e.tier)===1?44:92;const ly=up?axisY-dist:axisY+dist;const tx=xx+(e.dx||0);
      el('line',{x1:xx,x2:tx,y1:axisY+(up?-8:8),y2:up?ly+22:ly-14,stroke:C.axis},svg);
      let m;if(e.k==='e'){m=el('rect',{x:xx-6,y:axisY-6,width:12,height:12,transform:`rotate(45 ${xx} ${axisY})`,fill:C.pub,stroke:C.bg1,'stroke-width':2},svg)}
      else if(e.k==='end'){m=el('circle',{cx:xx,cy:axisY,r:7,fill:C.bg1,stroke:C.brand,'stroke-width':2.5},svg)}
      else{m=el('circle',{cx:xx,cy:axisY,r:5,fill:C.sec,stroke:C.bg1,'stroke-width':2},svg)}
      const anchor=tx>W-120?'end':tx<90?'start':'middle';const ty=up?ly:ly;
      el('text',{x:tx,y:ty,'text-anchor':anchor,'font-size':12.5,'font-weight':600,fill:e.k==='e'?css('--route-pub-ink'):C.text},svg,e.t);
      el('text',{x:tx,y:ty+15,'text-anchor':anchor,'font-size':11.5,fill:C.muted},svg,e.s);
      bindTip(m,`<b>${e.t}</b><span>${e.s} · ${e.d.toLocaleDateString('es-AR',{month:'short',year:'numeric'})}</span>`)});
    // today
    const today=x(new Date(2026,8,23));el('line',{x1:today,x2:today,y1:24,y2:H-16,stroke:C.brand,'stroke-dasharray':'3 4'},svg);
    el('text',{x:today+6,y:30,'font-size':11,fill:C.brand,'font-family':'JetBrains Mono, monospace'},svg,'HOY');
  })();

  /* ---------- Provider map ---------- */
  (function(){
    const svg=document.getElementById('provmap');if(!svg)return;const W=760,H=380,L=36,R=12,T=12,B=54;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const pw=W-L-R,ph=H-T-B,colW=pw/3;
    // bands
    el('rect',{x:L,y:T,width:pw,height:ph*.42,rx:10,fill:'rgba(74,158,255,.07)'},svg);
    el('rect',{x:L,y:T+ph*.46,width:pw,height:ph*.54,rx:10,fill:'rgba(201,111,74,.07)'},svg);
    el('text',{x:L+12,y:T+20,'font-size':11,fill:css('--route-pub-ink'),'font-family':'JetBrains Mono, monospace','letter-spacing':'.08em'},svg,'OFERTA PÚBLICA CON CNV');
    el('text',{x:L+12,y:T+ph*.46+20,'font-size':11,fill:css('--route-priv-ink'),'font-family':'JetBrains Mono, monospace','letter-spacing':'.08em'},svg,'FUERA DE LA CNV');
    for(let i=1;i<3;i++)el('line',{x1:L+colW*i,x2:L+colW*i,y1:T,y2:T+ph,stroke:C.grid,'stroke-dasharray':'2 4'},svg);
    ['Solo tecnología','Plataforma y servicios','Proyecto completo'].forEach((t,i)=>el('text',{x:L+colW*i+colW/2,y:H-B+22,'text-anchor':'middle','font-size':12.5,fill:C.sec},svg,t));
    el('text',{x:L+pw/2,y:H-8,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,'CUÁNTO DEL PROCESO TE RESUELVEN →');
    const P=[
      {n:'Blockenfy',c:0,y:.60,psav:false,d:'Tecnología de marca blanca, fichas con verificación incorporada. No arma lo legal.'},
      {n:'Koibanx',c:0,y:.72,psav:false,d:'Tecnología para entidades financieras. PSAV n.º 13 con cuatro de las cinco categorías.'},
      {n:'Xcapit',c:0,y:.84,psav:false,d:'Desarrollo a medida. Diagnóstico USD 8–12K; plataforma USD 40–150K.'},
      {n:'Brickken',c:1,y:.60,psav:false,d:'Software español por suscripción, desde €299 por mes; sin caso argentino confirmado.'},
      {n:'Pala · Casa Token',c:1,y:.83,psav:false,d:'Plataforma para desarrolladores con validación notarial. Declara USD 150M en oferta.'},
      {n:'Volsmart',c:1,y:.22,psav:true,d:'PSAV n.º 85. En ILLA Belgrano fue PSAV, titular del registro y proveedor tecnológico.'},
      {n:'R3AL Blocks',c:2,y:.60,psav:false,d:'Estructura, emite y vende en su marketplace. Fideicomiso privado.'},
      {n:'Brick-ly',c:2,y:.72,psav:false,d:'Marketplace de hoteles. Cobra una comisión por ficha vendida.'},
      {n:'Metro Futuro',c:2,y:.84,psav:false,d:'PSAV n.º 100 con tres de las cinco categorías. Estructura, emite, vende y paga rentas, fuera del régimen de la CNV.'},
      {n:'Landtoken + Allaria',c:2,y:.22,psav:true,d:'Fideicomiso financiero con oferta pública; Allaria Digital es PSAV n.º 132. Tecnología de Tech Demeter.'},
    ];
    P.forEach(p=>{const cx=L+colW*p.c+44,cy=T+ph*p.y;const g=el('g',{},svg);
      el('circle',{cx,cy,r:14,fill:'transparent'},g);
      el('circle',{cx,cy,r:7,fill:p.psav?C.text:C.bg1,stroke:C.text,'stroke-width':2},g);
      el('text',{x:cx+14,y:cy+4.5,'font-size':13,'font-weight':500,fill:C.text},g,p.n);
      bindTip(g,`<b>${p.n}</b><span>${p.d}</span>`)});
  })();

  /* ---------- Horizontal log bars ---------- */
  function logBars(id,rows,ticks,tickFmt,valFmt,tableId){
    const svg=document.getElementById(id);if(!svg)return;const W=720,L=210,R=90,T=8,rowH=34,H=T+rows.length*rowH+26;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);const lo=Math.log10(ticks[0]),hi=Math.log10(ticks[ticks.length-1]);
    const x=v=>L+(W-L-R)*(Math.log10(v)-lo)/(hi-lo);
    ticks.forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:T,y2:H-24,stroke:C.grid},svg);el('text',{x:x(t),y:H-8,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,tickFmt(t))});
    el('line',{x1:L,x2:L,y1:T,y2:H-24,stroke:C.axis},svg);
    const tb=document.querySelector('#'+tableId+' tbody');
    rows.forEach((r,i)=>{const y=T+i*rowH+8;
      el('text',{x:0,y:y+8,'font-size':13,fill:C.text,'font-weight':500},svg,r.n);
      el('text',{x:0,y:y+22,'font-size':11,fill:C.muted},svg,r.p);
      const w=Math.max(4,x(r.v)-L);const b=el('path',{d:barPath(L,y+4,w,12,4),fill:r.pub?C.pub:C.priv},svg);
      el('text',{x:L+w+8,y:y+14.5,'font-size':12,fill:C.sec,'font-family':'JetBrains Mono, monospace'},svg,valFmt(r.v)+(r.cap?' (tope)':''));
      bindTip(b,`<b>${r.n}</b><span>${r.p} · ${valFmt(r.v)}${r.cap?' (tope de emisión)':''}</span>`);
      tb&&tb.insertAdjacentHTML('beforeend',`<tr><td>${r.n}</td><td>${r.p}</td><td class="num">${fmt(r.v)}${r.cap?' (tope)':''}</td></tr>`)});
  }
  logBars('tickets',[
    {n:'IDERO Casa Propia',p:'Pala',v:10},
    {n:'Landtoken',p:'Allaria · oferta pública',v:50,pub:true},
    {n:'ILLA Belgrano',p:'Volsmart · oferta pública',v:100,pub:true},
    {n:'Aldeana Pilar',p:'Metro Futuro',v:100},
    {n:'XUUM Pinamar',p:'R3AL Blocks',v:100},
    {n:'Conectia',p:'R3AL Blocks',v:109},
    {n:'HQ Benavídez',p:'Metro Futuro',v:1000},
  ],[1,10,100,1000,10000],t=>'USD '+fmt(t),v=>'USD '+fmt(v),'tickets-table');
  const money=v=>v>=1e6?'USD '+fmt(+(v/1e6).toFixed(2))+'M':'USD '+fmt(Math.round(v/1000))+'K';
  logBars('sizes',[
    {n:'ILLA Belgrano',p:'Volsmart · oferta pública',v:4150330,pub:true},
    {n:'Sense Manantiales',p:'Metro Futuro',v:665000},
    {n:'Aldeana Pilar',p:'Metro Futuro',v:187000},
    {n:'HQ Benavídez',p:'Metro Futuro',v:163107},
    {n:'Altos de Benavídez',p:'Metro Futuro',v:148000},
    {n:'Conectia',p:'R3AL Blocks',v:132184},
  ],[1e5,1e6,1e7],t=>t>=1e6?'USD '+fmt(t/1e6)+'M':'USD '+fmt(t/1e3)+'K',money,'sizes-table');


  /* ---------- Barras lineales ---------- */
  function linBars(id,rows,max,step,unit,tableId,hi){
    const svg=document.getElementById(id);if(!svg)return;const W=720,L=170,R=70,T=6,rowH=34,H=T+rows.length*rowH+26;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);const x=v=>L+(W-L-R)*v/max;
    for(let t=0;t<=max;t+=step){el('line',{x1:x(t),x2:x(t),y1:T,y2:H-24,stroke:t===0?C.axis:C.grid},svg);el('text',{x:x(t),y:H-8,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,fmt(t))}
    const tb=document.querySelector('#'+tableId+' tbody');
    rows.forEach((r,i)=>{const y=T+i*rowH+8;const on=hi?r.n===hi:true;
      el('text',{x:0,y:y+13,'font-size':13,fill:on?C.text:C.sec,'font-weight':on?600:400},svg,r.n);
      const w=Math.max(4,x(r.v)-L);const b=el('path',{d:barPath(L,y+2,w,14,4),fill:on?C.brand:'rgba(164,180,202,.45)'},svg);
      el('text',{x:L+w+8,y:y+13.5,'font-size':12,fill:C.sec,'font-family':'JetBrains Mono, monospace'},svg,fmt(r.v)+unit);
      bindTip(b,`<b>${r.n}</b><span>USD ${fmt(r.v)} miles de millones</span>`);
      tb&&tb.insertAdjacentHTML('beforeend',`<tr><td>${r.n}</td><td class="num">${fmt(r.v)}</td></tr>`)});
  }
  linBars('market',[{n:'Bonos del Tesoro de EE.UU.',v:14.93},{n:'Crédito privado',v:8.10},{n:'Materias primas (oro)',v:5.00},{n:'Resto',v:10.80}],16,4,'','market-table');
  linBars('networks',[{n:'Ethereum',v:16.55},{n:'BNB Chain',v:5.68},{n:'Solana',v:4.41},{n:'Stellar',v:3.37},{n:'Resto',v:8.66}],18,3,'','networks-table');
  linBars('latam',[{n:'Brasil',v:252.5},{n:'Argentina',v:88.5},{n:'México',v:77.6},{n:'Venezuela',v:39.1},{n:'Colombia',v:29.1}],300,50,'','latam-table','Argentina');

  /* ---------- Waterfall ---------- */
  (function(){
    const rows=[{n:'Alquiler bruto',v:30000,t:'total'},{n:'Expensas e impuestos',v:-4500},{n:'Administración',v:-3000},{n:'Vacancia',v:-2500},{n:'Seguro y mantenimiento',v:-1500},{n:'Renta repartida',v:18500,t:'total'}];
    const svg=document.getElementById('waterfall');if(!svg)return;const W=720,H=290,L=56,R=12,T=24,B=58;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const y=v=>T+(H-T-B)*(1-v/30000);const bw=(W-L-R)/rows.length;
    [0,10000,20000,30000].forEach(t=>{el('line',{x1:L,x2:W-R,y1:y(t),y2:y(t),stroke:t===0?C.axis:C.grid},svg);el('text',{x:L-8,y:y(t)+4,'text-anchor':'end','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,fmt(t/1000)+'K')});
    let run=0;const tb=document.querySelector('#wf-table tbody');
    rows.forEach((r,i)=>{const x0=L+i*bw+bw*.22,w=bw*.56;let top,bot,fill;
      if(r.t==='total'){top=y(r.v);bot=y(0);fill=i===0?C.priv:C.brand;run=r.v}else{top=y(run);bot=y(run+r.v);run+=r.v;fill=C.neg}
      const b=el('rect',{x:x0,y:top,width:w,height:Math.max(2,bot-top),rx:4,fill,opacity:r.t==='total'?1:.85},svg);
      if(i<rows.length-1){const ny=r.t==='total'?y(run):y(run);el('line',{x1:x0+w,x2:x0+bw,y1:ny,y2:ny,stroke:C.axis,'stroke-dasharray':'2 3'},svg)}
      el('text',{x:x0+w/2,y:top-7,'text-anchor':'middle','font-size':12,fill:r.t==='total'?C.text:C.sec,'font-family':'JetBrains Mono, monospace','font-weight':r.t==='total'?500:400},svg,(r.v<0?'−':'')+fmt(Math.abs(r.v)));
      const words=r.n.split(' ');const l1=words.slice(0,Math.ceil(words.length/2)).join(' '),l2=words.slice(Math.ceil(words.length/2)).join(' ');
      el('text',{x:x0+w/2,y:H-B+20,'text-anchor':'middle','font-size':12,fill:C.sec},svg,words.length>2?l1:r.n);
      if(words.length>2)el('text',{x:x0+w/2,y:H-B+35,'text-anchor':'middle','font-size':12,fill:C.sec},svg,l2);
      bindTip(b,`<b>${r.n}</b><span>USD ${(r.v<0?'−':'')+fmt(Math.abs(r.v))} por año</span>`);
      tb&&tb.insertAdjacentHTML('beforeend',`<tr><td>${r.n}</td><td class="num">${(r.v<0?'−':'')+fmt(Math.abs(r.v))}</td></tr>`)});
    el('text',{x:W-R,y:14,'text-anchor':'end','font-size':11.5,fill:C.muted},svg,'5.000 fichas → USD 3,70 por ficha al año');
  })();

  /* ---------- Plazos reales de los casos con CNV ---------- */
  (function(){
    const svg=document.getElementById('casetime');if(!svg)return;const W=760,L=130,R=20,T=34,laneH=74,H=T+2*laneH+30;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const t0=new Date(2024,7,1),t1=new Date(2026,4,1);const x=d=>L+(W-L-R)*(d-t0)/(t1-t0);
    [new Date(2025,0,1),new Date(2026,0,1)].forEach(d=>{el('line',{x1:x(d),x2:x(d),y1:T-12,y2:H-24,stroke:C.grid},svg);el('text',{x:x(d)+4,y:T-16,'font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,d.getFullYear())});
    const lanes=[
      {n:'Landtoken I',s:'Campos',ev:[[new Date(2025,2,17),'int'],[new Date(2025,7,20),'cnv'],[new Date(2025,11,4),'cond'],[new Date(2025,11,18),'emi']],dur:'≈ 9 meses'},
      {n:'ILLA Belgrano I',s:'Edificio',ev:[[new Date(2024,8,20),'int'],[new Date(2025,5,25),'cnv'],[new Date(2025,8,9),'cond'],[new Date(2025,11,2),'emi']],dur:'≈ 14 meses',dig:new Date(2026,3,8)},
    ];
    lanes.forEach((ln,i)=>{const y=T+i*laneH+30;
      el('text',{x:0,y:y-2,'font-size':13.5,'font-weight':600,fill:C.text},svg,ln.n);
      el('text',{x:0,y:y+14,'font-size':11.5,fill:C.muted},svg,ln.s);
      const a=x(ln.ev[0][0]),b=x(ln.ev[3][0]);
      el('rect',{x:a,y:y-4,width:b-a,height:8,rx:4,fill:'rgba(229,178,74,.18)'},svg);
      el('text',{x:(a+b)/2,y:y-14,'text-anchor':'middle','font-size':12,fill:C.brand,'font-family':'JetBrains Mono, monospace'},svg,ln.dur);
      ln.ev.forEach(([d,k])=>{const xx=x(d);
        if(k==='int')el('circle',{cx:xx,cy:y,r:6,fill:C.bg1,stroke:C.sec,'stroke-width':2},svg);
        else if(k==='cnv')el('rect',{x:xx-6,y:y-6,width:12,height:12,transform:`rotate(45 ${xx} ${y})`,fill:C.pub,stroke:C.bg1,'stroke-width':2},svg);
        else if(k==='cond')el('circle',{cx:xx,cy:y,r:5.5,fill:C.sec,stroke:C.bg1,'stroke-width':2},svg);
        else el('circle',{cx:xx,cy:y,r:7.5,fill:C.brand,stroke:C.bg1,'stroke-width':2},svg);
        const lab=d.toLocaleDateString('es-AR',{month:'short',year:'2-digit'}).replace('.','');
        if(k!=='cond')el('text',{x:xx,y:y+24,'text-anchor':'middle','font-size':10.5,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,lab)});
      if(ln.dig){const xx=x(ln.dig);el('line',{x1:x(ln.ev[3][0])+9,x2:xx-7,y1:y,y2:y,stroke:C.axis,'stroke-dasharray':'3 4'},svg);
        el('circle',{cx:xx,cy:y,r:6,fill:C.bg1,stroke:C.pub,'stroke-width':2},svg);
        el('text',{x:xx,y:y+24,'text-anchor':'middle','font-size':10.5,fill:css('--route-pub-ink'),'font-family':'JetBrains Mono, monospace'},svg,'abr 26');
        el('text',{x:xx,y:y-14,'text-anchor':'end','font-size':11,fill:css('--route-pub-ink')},svg,'versión digital aprobada')}
    });
  })();

  /* ---------- Rangos de costo (log) ---------- */
  (function(){
    const svg=document.getElementById('costrange');if(!svg)return;
    const rows=[
      {n:'Diagnóstico de Xcapit',p:'4 semanas',a:8000,b:12000},
      {n:'Plataforma mínima de Xcapit',p:'Desarrollo a medida',a:40000,b:150000},
      {n:'Armado de ILLA Belgrano I',p:'Organización, estructuración y colocación',a:135886,b:135886,pub:true},
      {n:'Armado de Landtoken I',p:'Estimado, con el primer año de fiduciario',a:334950,b:334950,pub:true},
    ];
    const W=720,L=260,R=90,T=8,rowH=44,H=T+rows.length*rowH+26;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const lo=3,hi=6;const x=v=>L+(W-L-R)*(Math.log10(v)-lo)/(hi-lo);
    [1e3,1e4,1e5,1e6].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:T,y2:H-24,stroke:C.grid},svg);el('text',{x:x(t),y:H-8,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,t>=1e6?'USD 1M':'USD '+fmt(t/1000)+'K')});
    const k=v=>'USD '+fmt(Math.round(v/1000))+'K';
    rows.forEach((r,i)=>{const y=T+i*rowH+14;
      el('text',{x:0,y:y+2,'font-size':13,'font-weight':500,fill:C.text},svg,r.n);
      el('text',{x:0,y:y+18,'font-size':11,fill:C.muted},svg,r.p);
      const c=r.pub?C.pub:C.sec;
      if(r.a===r.b){el('circle',{cx:x(r.a),cy:y+6,r:7,fill:c},svg);el('text',{x:x(r.a)+13,y:y+10,'font-size':12,fill:C.sec,'font-family':'JetBrains Mono, monospace'},svg,k(r.a))}
      else{el('rect',{x:x(r.a),y:y,width:Math.max(12,x(r.b)-x(r.a)),height:12,rx:6,fill:c},svg);el('text',{x:x(r.b)+10,y:y+10.5,'font-size':12,fill:C.sec,'font-family':'JetBrains Mono, monospace'},svg,k(r.a)+'–'+k(r.b))}
    });
  })();

  /* ---------- Comisiones al inversor (apiladas) ---------- */
  function feeBars(id,rows,max){
    const svg=document.getElementById(id);if(!svg)return;const W=720,L=170,R=90,T=6,rowH=42,H=T+rows.length*rowH+26;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);const x=v=>L+(W-L-R)*v/max;const pct=v=>fmt(v)+'%';
    for(let t=0;t<=max;t+=1){el('line',{x1:x(t),x2:x(t),y1:T,y2:H-24,stroke:t===0?C.axis:C.grid},svg);el('text',{x:x(t),y:H-8,'text-anchor':'middle','font-size':11,fill:C.muted,'font-family':'JetBrains Mono, monospace'},svg,t+'%')}
    rows.forEach((r,i)=>{const y=T+i*rowH+10;let acc=0;
      el('text',{x:0,y:y+8,'font-size':13,'font-weight':500,fill:C.text},svg,r.n);
      el('text',{x:0,y:y+23,'font-size':11,fill:C.muted},svg,r.p);
      r.seg.forEach(([v,c,lab])=>{if(v<=0){acc+=0;return}const x0=x(acc),w=x(acc+v)-x0;el('rect',{x:x0,y:y,width:Math.max(2,w-1.5),height:18,rx:3,fill:c},svg);
        if(w>34)el('text',{x:x0+w/2,y:y+13,'text-anchor':'middle','font-size':10.5,fill:C.bg1,'font-weight':600,'font-family':'JetBrains Mono, monospace'},svg,lab||pct(v));acc+=v});
      el('text',{x:x(acc)+8,y:y+13.5,'font-size':12,fill:C.sec,'font-family':'JetBrains Mono, monospace'},svg,r.total||pct(acc));
    });
  }
  feeBars('exitfees',[
    {n:'Metro Futuro',p:'Rescate',seg:[[6,C.brand]]},
    {n:'Lofty',p:'Venta en la plataforma',seg:[[3,C.brand]]},
    {n:'Raíz Finance',p:'Solo si salís antes de tiempo',seg:[[2,C.brand]]},
    {n:'Prypco Mint',p:'Reventa',seg:[[1,C.brand]]},
    {n:'Brick-ly',p:'Sin penalidad',seg:[[0,C.brand]],total:'0%'},
  ],7);
  feeBars('feebars',[
    {n:'Prypco Mint',p:'Dubái',seg:[[4.1,C.pub],[1,C.brand]]},
    {n:'Lofty',p:'EE.UU.',seg:[[2.5,C.pub],[3,C.brand]]},
  ],6);

  })();
