/* ===== COLAGEM: papel rasgado, fita, etiquetas, letras recortadas — HUD, título, diálogos, mapa, pausa, transições ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const SERIF='Georgia, serif',TYPE='"Courier New", Courier, monospace',HAND='"Segoe Script","Bradley Hand","Comic Sans MS",cursive';
const PAL={ink:['#1d1822','#0f0b14'],ink2:['#2d2535','#171020'],cream:['#d4cab8','#aa9d89'],bone:['#e8dfcc','#c4b8a0'],rose:['#a64c68','#6e2a40'],teal:['#103329','#071b15'],mon:['#0a0710','#030208']};
const cache=new Map(),mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function tornPts(w,h,seed,j){const pts=[];let k=0;const r=()=>hs(seed*13.1+k++,seed*7.7+3);
  const edge=(x0,y0,x1,y1)=>{const L=Math.hypot(x1-x0,y1-y0),m=Math.max(2,Math.round(L/7)),nx=-(y1-y0)/L,ny=(x1-x0)/L;for(let i=0;i<m;i++){const t=i/m,o=(r()-.5)*2*j*(r()>.86?2:1);pts.push([x0+(x1-x0)*t+nx*o,y0+(y1-y0)*t+ny*o])}};
  edge(0,0,w,0);edge(w,0,w,h);edge(w,h,0,h);edge(0,h,0,0);return pts}
function paperCv(w,h,kind,seed,j){const key=kind+'|'+w+'|'+h+'|'+seed+'|'+j;let c=cache.get(key);if(c)return c;if(cache.size>260)cache.clear();
  const P=PAL[kind]||PAL.ink,pad=6;c=mkc(w+pad*2,h+pad*2);const x=c.getContext('2d'),pts=tornPts(w,h,seed,j);
  const path=ex=>{x.beginPath();pts.forEach((p,i)=>{let X=pad+p[0],Y=pad+p[1];if(ex){const ux=(p[0]-w/2)/(w/2),uy=(p[1]-h/2)/(h/2),L=Math.hypot(ux,uy)||1;X+=ux/L*ex;Y+=uy/L*ex}i?x.lineTo(X,Y):x.moveTo(X,Y)});x.closePath()};
  path(1.7);x.fillStyle=(kind==='cream'||kind==='bone')?'#f4eddc':'#e6ddcb';x.fill();
  path(0);const gr=x.createLinearGradient(0,pad,0,pad+h);gr.addColorStop(0,P[0]);gr.addColorStop(1,P[1]);x.fillStyle=gr;x.fill();
  x.save();path(0);x.clip();
  const n=Math.floor(w*h/40);for(let i=0;i<n;i++){const a=hs(i,seed+1),b=hs(i,seed+2),l=hs(i,seed+3);x.fillStyle=l>.55?'rgba(255,255,255,.06)':'rgba(0,0,0,.10)';x.fillRect(pad+a*w,pad+b*h,l>.93?2:1,1)}
  for(let i=0;i<3;i++){const cx=hs(i,seed+4)*w,cy=hs(i,seed+5)*h,r=14+hs(i,seed+6)*32,rg=x.createRadialGradient(pad+cx,pad+cy,2,pad+cx,pad+cy,r);rg.addColorStop(0,'rgba(0,0,0,.12)');rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(pad+cx-r,pad+cy-r,r*2,r*2)}
  x.strokeStyle='rgba(255,255,255,.06)';x.beginPath();x.moveTo(pad+w*.5,pad);x.lineTo(pad+w*.5+3,pad+h);x.stroke();
  x.restore();cache.set(key,c);return c}
function paper(ctx,x,y,w,h,kind,seed,rot,opt){opt=opt||{};const cv=paperCv(Math.round(w),Math.round(h),kind,seed|0,opt.j||2.6);
  ctx.save();ctx.translate(x+w/2,y+h/2);if(rot)ctx.rotate(rot);ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=opt.sh===undefined?7:opt.sh;ctx.shadowOffsetY=2;ctx.drawImage(cv,-w/2-6,-h/2-6);ctx.restore()}
function tape(ctx,x,y,w,h,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle=col||'rgba(222,208,156,.82)';ctx.beginPath();
  for(let i=0;i<=4;i++)ctx.lineTo(-w/2+(i%2?2:0),-h/2+h*i/4);for(let i=4;i>=0;i--)ctx.lineTo(w/2-(i%2?2:0),-h/2+h*i/4);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(-w/2+3,-h/2+1,w-6,1);ctx.restore()}
function stitch(ctx,x,y,w,h,col){ctx.save();ctx.strokeStyle=col||'rgba(210,122,138,.6)';ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.restore()}
function wrap(ctx,s,w){const out=[];let line='';for(const word of String(s).split(' ')){const t=line?line+' '+word:word;if(ctx.measureText(t).width>w&&line){out.push(line);line=word}else line=t}if(line)out.push(line);return out}
function ransom(ctx,text,x,y,size,seed,kinds){let cx=x;for(let i=0;i<text.length;i++){const ch=text[i];if(ch===' '){cx+=size*.5;continue}
  ctx.font='bold '+size+'px '+SERIF;const w=Math.max(size*.66,ctx.measureText(ch).width+size*.34),h=size*1.22,kind=kinds[(i+seed)%kinds.length],rot=(hs(i,seed)-.5)*.2,yy=y+(hs(i,seed+5)-.5)*5;
  paper(ctx,cx,yy,w,h,kind,seed*7+i,rot,{j:1.3,sh:4});
  ctx.save();ctx.translate(cx+w/2,yy+h/2);ctx.rotate(rot);ctx.fillStyle=(kind==='cream'||kind==='bone')?'#1a1420':(kind==='rose'?'#fbeee6':'#e8dfcc');ctx.textAlign='center';ctx.font=(hs(i,seed+9)>.5?'bold ':'')+size+'px '+(hs(i,seed+2)>.4?SERIF:TYPE);ctx.fillText(ch,0,size*.34);ctx.restore();cx+=w+2}return cx}
function photo(ctx,key,x,y,w,rot,cap){const im=window.ART&&window.ART.get(key);if(!im)return;const h=w*im.naturalHeight/im.naturalWidth;
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;ctx.fillStyle='#e8dfcc';ctx.fillRect(-w/2-4,-h/2-4,w+8,h+(cap?17:8));ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.drawImage(im,-w/2,-h/2,w,h);
  if(cap){ctx.fillStyle='#3a2a34';ctx.font='italic 9px '+HAND;ctx.textAlign='center';ctx.fillText(cap,0,h/2+11)}tape(ctx,0,-h/2-5,22,8,-.15);ctx.restore()}
function butterfly(ctx,x,y,s,t,col){const f=Math.abs(Math.sin(t*7));ctx.save();ctx.translate(x,y);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-s*f,-s*.9);ctx.lineTo(-s*.9*f,s*.5);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s*f,-s*.9);ctx.lineTo(s*.9*f,s*.5);ctx.closePath();ctx.fill();ctx.fillStyle='#0b0912';ctx.fillRect(-.5,-2,1,5);ctx.restore()}
const COL=window.COL={paper,tape,stitch,wrap,ransom,photo,hs};
// ---------- HUD ----------
COL.hud=function(c,g){
  const p=g.player,t=performance.now()/1000,mh=CONFIG.PLAYER.MAX_HP,me=CONFIG.PLAYER.MAX_ENERGY,low=p.hp<30;
  // fio de costura ligando retrato, faixas e itens
  c.save();c.strokeStyle='rgba(210,122,138,.75)';c.lineWidth=1;c.setLineDash([3,2]);c.beginPath();c.moveTo(48,52);c.quadraticCurveTo(58,62,80,56);c.stroke();c.restore();
  // faixas de papel: vida e energia
  const bar=(x,y,w,tagW,label,v,mx,c1,c2,seed,rot)=>{
    paper(c,x,y,w,17,'ink',seed,rot);
    paper(c,x+2,y+2,tagW,13,'cream',seed+9,-.02,{j:1.4,sh:2});c.fillStyle='#2a1c28';c.font='bold 7px '+TYPE;c.textAlign='center';c.fillText(label,x+2+tagW/2,y+11.5);c.textAlign='left';
    const tx=x+tagW+7,tw=w-tagW-48,fw=Math.max(0,tw*v/mx);
    c.fillStyle='#07050b';c.fillRect(tx,y+4,tw,9);
    const gr=c.createLinearGradient(tx,0,tx+tw,0);gr.addColorStop(0,c1);gr.addColorStop(1,c2);c.fillStyle=gr;c.fillRect(tx,y+4,fw,9);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(tx,y+4,fw,2);
    stitch(c,tx-1,y+3,tw+2,11,'rgba(216,160,176,.55)');
    c.fillStyle='#e6dcc6';c.font='8px '+TYPE;c.fillText(Math.ceil(v)+'/'+mx,tx+tw+4,y+12)};
  bar(62,5,194,30,'VIDA',p.hp,mh,'#7a1f3a',low?'#ff5070':'#e0607a',3,-.006);
  bar(66,24,176,38,'ENERGIA',p.energy,me,'#3a2a9a','#7E9BE8',5,.005);
  // polaroid do retrato
  c.save();c.translate(31,33);c.rotate(-.06);c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=6;c.shadowOffsetY=2;c.fillStyle='#e8dfcc';c.fillRect(-25,-29,50,60);c.shadowBlur=0;c.shadowOffsetY=0;
  c.fillStyle='#0b0912';c.fillRect(-21,-25,42,42);const por=window.ART&&window.ART.get('portrait');if(por){const pw=por.naturalWidth||por.width;c.drawImage(por,0,0,pw,pw*.92,-21,-25,42,42)}
  if(low){c.fillStyle='rgba(255,40,80,'+(.16+.14*Math.sin(t*8))+')';c.fillRect(-21,-25,42,42);c.strokeStyle='rgba(255,60,90,.8)';c.lineWidth=1.5;c.beginPath();c.moveTo(-19,-5);c.lineTo(19,-9);c.moveTo(-17,0);c.lineTo(17,-3);c.stroke()}
  c.fillStyle='#3a2a34';c.font='italic 9px '+HAND;c.textAlign='center';c.fillText('mika',0,27);c.textAlign='left';c.restore();
  tape(c,26,5,24,8,-.3);
  // itens: etiquetas penduradas
  let x=70;const tg=(ic,key,cnt)=>{const rot=((x/28|0)%2?.04:-.04);c.save();c.translate(x+11,66);c.rotate(rot);paper(c,-11,-13,22,26,'ink2',x|0,0,{j:1.6,sh:3});
    c.fillStyle='#07050b';c.beginPath();c.arc(0,-8,1.8,0,TAU);c.fill();
    if(window.HUDICONS&&window.HUDICONS[ic]){c.lineWidth=1;window.HUDICONS[ic](c,0,1,t)}
    if(key){c.fillStyle='#e6dcc6';c.font='bold 7px '+TYPE;c.fillText(key,-9,-3)}
    if(cnt!==null&&cnt!==undefined){c.fillStyle='#ffe3ee';c.font='bold 8px '+TYPE;c.textAlign='right';c.fillText(cnt,10,11);c.textAlign='left'}c.restore();x+=28};
  tg('potion','1','x'+p.healItems);tg('mana','2','x'+(p.manaItems||0));
  if(p.hasStitch)tg('stitch');if(p.keys.includes('boss_key'))tg('key');if(p.hasFlame)tg('flame');
  c.save();c.strokeStyle='rgba(210,122,138,.7)';c.setLineDash([3,2]);c.beginPath();c.moveTo(70,54);c.quadraticCurveTo(80,50,92,54);c.stroke();c.restore()};
COL.banner=function(ctx,name,a){ctx.save();ctx.globalAlpha=Math.max(0,a);const nm=name.toUpperCase();ctx.font='bold 16px '+TYPE;const w=Math.max(190,ctx.measureText(nm).width+46),x=320-w/2,y=84;
  paper(ctx,x,y,w,34,'cream',(nm.length*7)|0,-.012);tape(ctx,x+14,y+3,26,9,-.5);tape(ctx,x+w-14,y+4,26,9,.45);
  ctx.fillStyle='#2a2030';ctx.textAlign='center';ctx.fillText(nm,320,y+22);ctx.fillStyle='#D8A0B0';ctx.font='italic 10px '+HAND;ctx.fillText('— local —',320,y-4);ctx.restore()};
G.drawToast=function(ctx){const m=this.message;if(!m)return;ctx.save();ctx.font='12px '+TYPE;const ls=wrap(ctx,m,500),h=14+ls.length*15,w=Math.min(540,Math.max.apply(null,ls.map(l=>ctx.measureText(l).width))+38),x=320-w/2,y=346-h;
  paper(ctx,x,y,w,h,'ink',m.length,.005);tape(ctx,x+14,y+2,22,8,-.4);ctx.fillStyle='#E6DCC6';ctx.textAlign='center';ls.forEach((l,i)=>ctx.fillText(l,320,y+17+i*15));ctx.restore()};
G.drawInteractHints=function(ctx){const hb=this.player.hitbox,range={x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24};
  for(const it of this.interactives){if((it.collected||it.looted)&&it.type!=='rest'&&it.type!=='npc'&&it.type!=='book'&&it.type!=='painting'&&it.type!=='door_lock')continue;
    if(rectOverlap(range,it)){const px=Math.floor(it.x-this.camera.x+it.w/2),py=Math.floor(it.y-this.camera.y-16);paper(ctx,px-38,py-9,76,15,'cream',(it.x|0)%50,-.02,{j:1.3,sh:3});
      ctx.fillStyle='#2a1c28';ctx.font='bold 9px '+TYPE;ctx.textAlign='center';ctx.fillText('[E] interagir',px,py+2);ctx.textAlign='left';break}}};
// ---------- diálogo ----------
COL.dialog=function(g,ctx){const t=performance.now()/1000,d=g.dialog;
  paper(ctx,36,246,568,98,'teal',11,0,{j:3});stitch(ctx,47,257,546,76,'rgba(95,224,160,.35)');tape(ctx,52,248,28,9,-.45);tape(ctx,588,249,28,9,.4);
  const rg=ctx.createRadialGradient(566,278,2,566,278,36);rg.addColorStop(0,'rgba(90,240,160,.22)');rg.addColorStop(1,'rgba(90,240,160,0)');ctx.fillStyle=rg;ctx.fillRect(520,244,90,70);if(window.wisp)window.wisp(ctx,566,276,t,3);
  ctx.font='bold 12px '+TYPE;const nw=ctx.measureText(d.name).width+24;paper(ctx,50,236,nw,19,'cream',d.name.length,-.02,{j:1.3,sh:3});ctx.fillStyle='#143a2c';ctx.fillText(d.name,62,249);
  ctx.font='14px '+SERIF;ctx.fillStyle='#e2f8ea';wrap(ctx,d.lines[g.dialogIndex]||'',480).slice(0,3).forEach((l,i)=>ctx.fillText(l,58,278+i*18));
  ctx.fillStyle='#7fe0b0';ctx.font='italic 11px '+HAND;ctx.textAlign='right';ctx.fillText('E ▸ continuar',584,335);ctx.textAlign='left'};
// ---------- pausa, morte, vitória ----------
G.drawDeath=function(ctx){ctx.fillStyle='rgba(10,0,16,.86)';ctx.fillRect(0,0,640,360);
  paper(ctx,96,120,448,60,'cream',23,-.015);tape(ctx,112,124,28,9,-.5);tape(ctx,528,126,28,9,.5);ctx.fillStyle='#4a1a2a';ctx.font='bold 24px '+SERIF;ctx.textAlign='center';ctx.fillText('As memórias se desfazem…',320,160);
  paper(ctx,190,204,260,26,'rose',29,.012);ctx.fillStyle='#fbeee6';ctx.font='12px '+TYPE;ctx.fillText('Enter — voltar à última fita',320,221);ctx.textAlign='left'};
G.drawWin=function(ctx){ctx.fillStyle='rgba(10,8,20,.92)';ctx.fillRect(0,0,640,360);
  paper(ctx,100,104,440,56,'cream',31,.01);tape(ctx,116,108,28,9,-.5);tape(ctx,524,108,28,9,.5);ctx.fillStyle='#2a2030';ctx.font='bold 22px '+SERIF;ctx.textAlign='center';ctx.fillText('A Casa Desfeita silencia.',320,141);
  ctx.fillStyle='#E6DCC6';ctx.font='italic 13px '+HAND;ctx.fillText('Você desfez a Costureira Vazia.',320,190);
  paper(ctx,170,206,300,24,'ink',37,-.008);ctx.fillStyle='#E6DCC6';ctx.font='11px '+TYPE;ctx.fillText('Fragmentos: '+this.player.memories.length+'   ·   Enter — menu',320,222);ctx.textAlign='left'};
// ---------- painéis (memórias, escolhas, terminais) ----------
COL.panel=function(ctx,x,y,w,h,kind,seed){paper(ctx,x,y,w,h,kind,seed,0,{j:3,sh:9});stitch(ctx,x+9,y+9,w-18,h-18,kind==='mon'?'rgba(122,107,139,.55)':'rgba(210,122,138,.45)');tape(ctx,x+26,y+2,28,9,-.45);tape(ctx,x+w-26,y+3,28,9,.4)};
COL.label=function(ctx,x,y,text,font,col){ctx.font=font;const w=ctx.measureText(text).width+22;paper(ctx,x-10,y-15,w,20,'cream',text.length,-.015,{j:1.3,sh:3});ctx.fillStyle=col||'#2a1c28';ctx.fillText(text,x,y)};
// ---------- mapa ----------
COL.map=function(g,ctx){const t=performance.now()/1000,p=g.player,sc=1.5,ox=20,oy=46;
  ctx.fillStyle='#120e17';ctx.fillRect(0,0,640,360);for(let i=0;i<260;i++){ctx.fillStyle=hs(i,1)>.5?'rgba(255,255,255,.025)':'rgba(0,0,0,.18)';ctx.fillRect(hs(i,2)*640,hs(i,3)*360,2,1)}
  paper(ctx,8,34,372,314,'cream',21,-.004,{j:3,sh:10});tape(ctx,26,36,34,10,-.5);tape(ctx,366,38,34,10,.5);tape(ctx,24,346,30,9,.4);
  ctx.strokeStyle='rgba(60,45,60,.09)';ctx.lineWidth=1;for(let x=ox;x<380;x+=33){ctx.beginPath();ctx.moveTo(x,44);ctx.lineTo(x,340);ctx.stroke()}for(let y=oy;y<340;y+=33){ctx.beginPath();ctx.moveTo(14,y);ctx.lineTo(374,y);ctx.stroke()}
  paper(ctx,96,6,208,24,'ink',33,.008);ctx.fillStyle='#E6DCC6';ctx.font='bold 12px '+TYPE;ctx.textAlign='center';ctx.fillText('MAPA — CASA DESFEITA',200,22);ctx.textAlign='left';
  for(const z of ZONES){if(z.w<=0)continue;const v=p.visitedZones.has(z.id),x=ox+z.x*sc,y=oy+z.y*sc,w=z.w*sc,h=z.h*sc;
    if(v){ctx.globalAlpha=.5;ctx.fillStyle=z.accent;ctx.fillRect(x,y,w,h);ctx.globalAlpha=.9;ctx.strokeStyle='#2a2030';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.globalAlpha=1;
      if(w>46){ctx.fillStyle='#1d1522';ctx.font='7px '+TYPE;ctx.fillText(z.name.length>w/3.8?z.name.slice(0,Math.floor(w/3.8)):z.name,x+3,y+9)}}
    else{ctx.strokeStyle='rgba(90,78,70,.45)';ctx.setLineDash([2,3]);ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.setLineDash([])}}
  for(const it of g.interactives){if(it.type!=='rest')continue;const z=zoneAt(Math.floor(it.x/T),Math.floor(it.y/T));if(!z||!p.visitedZones.has(z.id))continue;
    const x=ox+it.x/T*sc,y=oy+it.y/T*sc;ctx.fillStyle='#7a2a44';ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x+1.5,y-1);ctx.lineTo(x+4,y);ctx.lineTo(x+1.5,y+1);ctx.lineTo(x,y+4);ctx.lineTo(x-1.5,y+1);ctx.lineTo(x-4,y);ctx.lineTo(x-1.5,y-1);ctx.fill()}
  const mx=ox+(p.x/T)*sc,my=oy+(p.y/T)*sc,pu=2+Math.sin(t*4)*1.5;ctx.strokeStyle='rgba(200,40,70,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(mx,my,5+pu,0,TAU);ctx.stroke();
  ctx.fillStyle='#c8284a';ctx.beginPath();ctx.arc(mx,my,3.4,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(mx-1,my-1,2,2);ctx.fillStyle='#8a1c36';ctx.font='italic 9px '+HAND;ctx.fillText('você',mx+8,my-6);
  // fotos coladas e anotações à mão
  photo(ctx,'ph_a',428,92,60,.07,'o que sobrou');photo(ctx,'ph_c',432,208,54,-.08,'ainda aqui?');
  ctx.fillStyle='#D8A0B0';ctx.font='italic 10px '+HAND;ctx.fillText('a casa não é',394,284);ctx.fillText('um lugar.',404,298);
  ctx.strokeStyle='rgba(216,160,176,.7)';ctx.beginPath();ctx.moveTo(396,304);ctx.quadraticCurveTo(420,310,446,302);ctx.stroke();
  // legenda (ficha) e registros (post-its)
  const nf=(p.nar&&p.nar.f)||{};paper(ctx,480,38,142,130,'cream',41,.008);tape(ctx,548,40,30,9,.05);
  ctx.fillStyle='#2a1c28';ctx.font='bold 10px '+TYPE;ctx.fillText('LEGENDA',490,56);ctx.font='9px '+TYPE;
  ctx.globalAlpha=.55;ctx.fillStyle='#a64c68';ctx.fillRect(490,63,10,7);ctx.globalAlpha=1;ctx.fillStyle='#2a1c28';ctx.fillText('visitada',506,70);
  ctx.strokeStyle='rgba(90,78,70,.6)';ctx.setLineDash([2,2]);ctx.strokeRect(490.5,77.5,9,6);ctx.setLineDash([]);ctx.fillText('não explorada',506,84);
  ctx.fillStyle='#7a2a44';ctx.fillText('✦',490,100);ctx.fillStyle='#2a1c28';ctx.fillText('descanso',506,100);ctx.fillStyle='#c8284a';ctx.fillText('●',490,114);ctx.fillStyle='#2a1c28';ctx.fillText('você',506,114);
  ctx.fillStyle=p.hasFlame?'#9a4a10':'#7a6e60';ctx.fillText('Chama de Lúmen: '+(p.hasFlame?'sim':'não'),490,130);ctx.fillStyle='#2a1c28';ctx.fillText('libertados: '+(nf.free_n||0),490,147);ctx.fillText('finalizados: '+(nf.cut_n||0),490,160);
  const rec=(p.records||[]);paper(ctx,480,176,142,152,'bone',47,-.012);tape(ctx,550,178,30,9,-.1,'rgba(214,120,150,.8)');
  ctx.fillStyle='#4a1a2a';ctx.font='bold 10px '+TYPE;ctx.fillText('REGISTROS ('+rec.length+')',490,194);ctx.font='9px '+TYPE;
  rec.slice(-9).forEach((r,i)=>{ctx.fillStyle='#3a2a34';ctx.fillText('• '+(r[0].length>21?r[0].slice(0,20)+'…':r[0]),490,208+i*13)});
  if(!rec.length){ctx.fillStyle='#7a6e60';ctx.font='italic 10px '+HAND;ctx.fillText('nada registrado ainda.',490,208)}
  ctx.fillStyle='#9a8a9a';ctx.font='italic 10px '+HAND;ctx.fillText('M / Esc — fechar · L — álbum',488,346)};
// ---------- tela inicial ----------
const DESC={novo:'Comece uma nova jornada na Casa Desfeita.',contin:'Retorne de onde sua memória parou.',cred:'Quem teceu este jardim.'};
COL.title=function(g,c,t){
  for(let i=0;i<18;i++){const x=(hs(i,3)*700-t*(10+i%5*3)+700)%700-30,y=(hs(i,4)*400+t*(12+i%4*4))%380-10;c.fillStyle=i%2?'#D27A8A':'#A76E7F';c.fillRect(x,y,3,2);c.fillRect(x+1,y+2,2,1)}
  // recortes de papel emoldurando a cena
  paper(c,-18,-10,338,384,'ink',41,0,{j:4.5,sh:16});paper(c,296,-14,370,30,'ink2',42,0,{j:3.5,sh:8});paper(c,214,338,460,34,'ink',43,0,{j:3.5,sh:8});
  photo(c,'ph_b',312,172,58,.09);photo(c,'letter_seal',304,262,46,-.12);
  for(const [x,y,s,col,ph] of [[372,60,8,'#D27A8A',0],[420,38,6,'#e8dfcc',2],[330,120,5,'#A76E7F',4]])butterfly(c,x+Math.sin(t*.8+ph)*14,y+Math.cos(t*1.1+ph)*8,s,t+ph,col);
  // logo em letras recortadas
  ransom(c,'LÚMEN',30,40,38,2,['cream','rose','ink2','bone','cream']);
  paper(c,34,98,214,17,'rose',9,-.01,{j:1.6,sh:4});c.fillStyle='#fbeee6';c.font='bold 10px '+TYPE;c.fillText('O  J A R D I M   D O   F I M',46,110);tape(c,38,99,20,8,-.5);
  // menu
  let selTxt='';g.titleOptions.forEach((o,i)=>{const s=i===g.titleSelect,lk=/contin/i.test(o)&&!g.hasSave,y=140+i*34;if(s)selTxt=o;
    if(s){paper(c,30,y-1,206,26,'rose',50+i,-.012,{j:2,sh:6});tape(c,36,y,22,8,-.45);c.fillStyle='#fff';c.font='bold 14px '+TYPE;c.fillText(o.toUpperCase(),58,y+18);c.fillStyle='#ffe3ee';c.font='16px '+HAND;c.fillText('✦',40+Math.sin(t*4)*2,y+19)}
    else{paper(c,34,y+2,184,22,'ink2',60+i,(i%2?.012:-.012),{j:1.8,sh:4});c.fillStyle=lk?'#4a3e52':'#b8aab8';c.font='13px '+TYPE;c.fillText(o.toUpperCase(),58,y+18)}});
  const k=Object.keys(DESC).find(k=>new RegExp(k,'i').test(selTxt))||'novo';
  c.fillStyle='#D8A0B0';c.font='italic 11px '+HAND;c.fillText(DESC[k],38,140+g.titleOptions.length*34+22);
  c.strokeStyle='rgba(216,160,176,.55)';c.beginPath();c.moveTo(38,140+g.titleOptions.length*34+28);c.quadraticCurveTo(100,140+g.titleOptions.length*34+33,190,140+g.titleOptions.length*34+27);c.stroke();
  paper(c,324,342,308,22,'cream',44,.006,{j:2});c.fillStyle='#2a1c28';c.font='italic 11px '+HAND;c.textAlign='center';c.fillText('“Tudo o que você lembra também é uma mentira.”',478,357);c.textAlign='left'};
// ---------- transição: cortina de papel rasgado ----------
COL.wipe=function(ctx,f){if(f>=.995){ctx.fillStyle='#0b0912';ctx.fillRect(0,0,640,360);return}
  const edge=-20+f*720;ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=10;ctx.fillStyle='#0b0912';ctx.beginPath();ctx.moveTo(0,0);
  const pts=[];for(let y=0;y<=360;y+=10){pts.push([edge+(hs(y,9)-.5)*20+Math.sin(y*.045)*14,y])}pts.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(0,360);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(232,223,204,.85)';ctx.lineWidth=2;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0]+2,q[1]):ctx.moveTo(q[0]+2,q[1]));ctx.stroke();ctx.restore()};
})();
