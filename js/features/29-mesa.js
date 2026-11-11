/* ===== MESA: mapa estirado + mini TVs, álbum de fotos, gaveteiro de pastas e bandeja de fitas — tudo na mesma mesa; zoom do título para a fita ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,COL=window.COL,U=window.__UIK,K=U.K,win=U.win,tx=U.tx,scan=U.scan,vign=U.vign,rr=U.rr,mkc=U.mkc,T0=U.T0,HANDF=U.HANDF,reel=U.reel;
const hs=COL.hs,A=window.__ALBU;
const MONO='"Courier New", Courier, monospace';
const INK='#2a1c28';
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease3=x=>{x=cl(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const ST=['MAPA','FOTOS','PASTAS','FITAS'];
// ---------- mesa ----------
let DESK=null;
function desk(c){if(!DESK){DESK=mkc(640,360);const d=DESK.getContext('2d');
  const g=d.createLinearGradient(0,0,0,360);g.addColorStop(0,'#33223a');g.addColorStop(1,'#1c1226');d.fillStyle=g;d.fillRect(0,0,640,360);
  for(let y=0;y<360;y+=36){d.fillStyle='rgba(0,0,0,.4)';d.fillRect(0,y,640,2);d.fillStyle='rgba(255,220,250,.05)';d.fillRect(0,y+2,640,1);
    for(let k=0;k<30;k++){const gy=y+5+hs(y,k)*28;d.fillStyle=hs(k,y)>.5?'rgba(0,0,0,'+(.05+hs(y,k+9)*.07)+')':'rgba(255,225,255,'+(.03+hs(y,k+9)*.04)+')';d.fillRect(hs(k,y+3)*600,gy,30+hs(k,y+4)*130,1)}}}
  c.drawImage(DESK,0,0)}
function shadowed(c,fn,blur,oy){c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=blur==null?10:blur;c.shadowOffsetY=oy==null?3:oy;fn();c.restore()}
function paperR(c,x,y,w,h,rot,col,seed,j){c.save();c.translate(x+w/2,y+h/2);c.rotate(rot||0);const pts=[];let k=0;const r=()=>hs(seed*7.3+k++,seed+1);
  const edge=(x0,y0,x1,y1)=>{const L=Math.hypot(x1-x0,y1-y0),m=Math.max(3,Math.round(L/8));for(let i=0;i<m;i++){const t=i/m;pts.push([x0+(x1-x0)*t+(r()-.5)*j,y0+(y1-y0)*t+(r()-.5)*j])}};
  const hw=w/2,hh=h/2;edge(-hw,-hh,hw,-hh);edge(hw,-hh,hw,hh);edge(hw,hh,-hw,hh);edge(-hw,hh,-hw,-hh);
  const path=()=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath()};
  shadowed(c,()=>{path();c.fillStyle=col;c.fill()},12,4);
  path();const g=c.createLinearGradient(-hw,-hh,hw,hh);g.addColorStop(0,'rgba(255,250,235,.25)');g.addColorStop(1,'rgba(90,60,40,.28)');c.fillStyle=g;c.fill();
  c.save();path();c.clip();for(let i=0;i<5;i++){const cx=(hs(i,seed+4)-.5)*w,cy=(hs(i,seed+5)-.5)*h,rd=20+hs(i,seed+6)*40,rg=c.createRadialGradient(cx,cy,2,cx,cy,rd);rg.addColorStop(0,'rgba(110,80,40,.16)');rg.addColorStop(1,'rgba(110,80,40,0)');c.fillStyle=rg;c.fillRect(cx-rd,cy-rd,rd*2,rd*2)}
  for(let i=0;i<w*h/180;i++){c.fillStyle='rgba(70,50,30,'+(.04+hs(i,seed+8)*.06)+')';c.fillRect((hs(i,seed+2)-.5)*w,(hs(i,seed+3)-.5)*h,1,1)}c.restore();
  path();c.strokeStyle='rgba(70,50,35,.55)';c.lineWidth=1;c.stroke();c.restore()}
function pin(c,x,y,col){c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=4;c.shadowOffsetY=2;c.fillStyle=col||'#b8334f';c.beginPath();c.arc(x,y,4,0,TAU);c.fill();c.restore();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.arc(x-1.2,y-1.2,1.2,0,TAU);c.fill()}
function pencil(c,x,y,rot){c.save();c.translate(x,y);c.rotate(rot);shadowed(c,()=>{c.fillStyle='#7a5ac8';c.fillRect(-46,-3,80,6)},4,2);c.fillStyle='#9a7ae8';c.fillRect(-46,-3,80,2);c.fillStyle='#d9c9a0';c.beginPath();c.moveTo(34,-3);c.lineTo(48,0);c.lineTo(34,3);c.fill();c.fillStyle='#2a2030';c.beginPath();c.moveTo(44,-.8);c.lineTo(48,0);c.lineTo(44,.8);c.fill();c.fillStyle='#d27a8a';c.fillRect(-52,-3,7,6);c.fillStyle='#a8a8b8';c.fillRect(-45,-3,3,6);c.restore()}
function ring(c,x,y,r){c.save();c.strokeStyle='rgba(20,8,24,.35)';c.lineWidth=2;c.beginPath();c.arc(x,y,r,.2,TAU-.6);c.stroke();c.restore()}
// ---------- mini TV antiga ----------
function miniTV(c,x,y,w,h,title,fn,t){
  shadowed(c,()=>{c.fillStyle='#2a2233';rr(c,x,y,w,h,12);c.fill()},14,5);
  const bg=c.createLinearGradient(0,y,0,y+h);bg.addColorStop(0,'#5a4d70');bg.addColorStop(1,'#2a2233');c.fillStyle=bg;rr(c,x,y,w,h,12);c.fill();c.strokeStyle='#0e0a14';c.lineWidth=2;rr(c,x+1,y+1,w-2,h-2,11);c.stroke();
  c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x+10,y+3,w-60,1);
  const sx=x+12,sy=y+12,sw=w-66,sh=h-36;c.fillStyle='#120c1a';rr(c,sx-4,sy-4,sw+8,sh+8,12);c.fill();
  c.save();rr(c,sx,sy,sw,sh,10);c.clip();c.fillStyle='#030a06';c.fillRect(sx,sy,sw,sh);
  const gr=c.createRadialGradient(sx+sw/2,sy+sh/2,10,sx+sw/2,sy+sh/2,sw*.7);gr.addColorStop(0,'rgba(95,240,160,.12)');gr.addColorStop(1,'rgba(120,80,220,.18)');c.fillStyle=gr;c.fillRect(sx,sy,sw,sh);
  c.fillStyle='rgba(106,90,138,.95)';c.fillRect(sx,sy,sw,10);c.fillStyle='rgba(176,150,230,.9)';c.fillRect(sx,sy,sw,1);tx(c,title,sx+6,sy+8,7.5,'#f0eaff',null,true);tx(c,'F1',sx+sw-5,sy+8,7.5,'#ffd870','right',true);
  c.save();c.beginPath();c.rect(sx,sy+11,sw,sh-11);c.clip();U.tm(1);try{fn(c,sx,sy+11,sw,sh-11,t)}finally{U.tm(-1)}c.restore();
  scan(c,.25,sx,sy,sw,sh);const fl=c.createLinearGradient(sx,sy,sx+sw,sy+sh);fl.addColorStop(0,'rgba(255,255,255,.08)');fl.addColorStop(.35,'rgba(255,255,255,0)');c.fillStyle=fl;c.fillRect(sx,sy,sw,sh);
  const vg=c.createRadialGradient(sx+sw/2,sy+sh/2,sh*.3,sx+sw/2,sy+sh/2,sw*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=vg;c.fillRect(sx,sy,sw,sh);c.restore();
  c.strokeStyle='#0a0612';c.lineWidth=2;rr(c,sx,sy,sw,sh,10);c.stroke();
  // painel lateral: botões e alto-falante
  const px=x+w-48;for(let i=0;i<2;i++){const ky=y+22+i*34;c.fillStyle='#120c1a';c.beginPath();c.arc(px+18,ky,12,0,TAU);c.fill();c.fillStyle='#6a5c80';c.beginPath();c.arc(px+18,ky,9.5,0,TAU);c.fill();c.fillStyle='#8a7aa0';c.beginPath();c.arc(px+17,ky-1,8,0,TAU);c.fill();c.strokeStyle='#14101c';c.lineWidth=1.5;c.beginPath();c.moveTo(px+18,ky);c.lineTo(px+18+Math.cos(i*2+.8)*8,ky+Math.sin(i*2+.8)*8);c.stroke()}
  for(let i=0;i<6;i++){c.fillStyle='#0e0a14';c.fillRect(px+4,y+h-62+i*5,28,2)}
  c.fillStyle=Math.floor(t*1.5)%2?K.main:K.dim;c.fillRect(px+30,y+h-20,4,4);tx(c,'LUMEN',x+14,y+h-8,7,'#a898c0',null,true);
  c.fillStyle='#14101c';c.fillRect(x+14,y+h-1,18,4);c.fillRect(x+w-32,y+h-1,18,4)}
function foot(c,x,y,w,items){c.fillStyle='#3a2a5a';c.fillRect(x,y,w,11);c.fillStyle='#6a5a8a';c.fillRect(x,y,w,1);let cx=x+5;for(const [k,l] of items){c.font='bold 8px '+MONO;c.fillStyle='#ffd870';c.fillText(k,cx,y+9);cx+=c.measureText(k).width+3;c.font='8px '+MONO;c.fillStyle='#d8d0f0';c.fillText(l,cx,y+9);cx+=c.measureText(l).width+9}}
// ---------- cassete pequeno ----------
const CATC={collect:'#c9a24a',destroy:'#b8334f',free:'#5fc9a0',cut:'#8a5ac8'};
function fitText(c,s,maxW,px0,font){let px=px0;do{c.font=font(px);px-=1}while(c.measureText(s).width>maxW&&px>9);return px}
function cass(c,x,y,w,o){o=o||{};const s=w/400;c.save();c.translate(x,y);c.scale(s,s);
  if(o.glow){c.shadowColor='rgba(190,150,255,.9)';c.shadowBlur=22/s}else{c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=8/s;c.shadowOffsetY=3/s}
  c.fillStyle='#352c44';rr(c,0,0,400,244,12);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  const bg=c.createLinearGradient(0,0,0,244);bg.addColorStop(0,o.locked?'#3a3348':'#4a3f5c');bg.addColorStop(1,'#241d2e');c.fillStyle=bg;rr(c,1,1,398,242,11);c.fill();c.strokeStyle='#0e0a14';c.lineWidth=3;rr(c,1,1,398,242,11);c.stroke();
  for(const [sx,sy] of [[14,14],[386,14],[14,230],[386,230]]){c.fillStyle='#14101c';c.beginPath();c.arc(sx,sy,6,0,TAU);c.fill();c.fillStyle='#8a7aa0';c.beginPath();c.arc(sx,sy,4,0,TAU);c.fill()}
  c.fillStyle=o.locked?'#c9c2b0':'#d9cfb6';c.fillRect(24,18,352,124);for(let i=0;i<7;i++){c.fillStyle='rgba(120,100,80,.25)';c.fillRect(24,50+i*14,352,2)}
  if(!o.locked){c.fillStyle=o.stripe||'#b8566f';c.fillRect(24,18,352,16)}
  else{c.fillStyle='#9a8f80';c.fillRect(24,18,352,10)}
  if(!o.locked&&o.label){const px=fitText(c,o.label,320,40,p=>'italic bold '+p+'px '+HANDF);c.fillStyle='#1a1020';c.fillText(o.label,40,Math.min(110,78+px*.6))}
  if(o.sub){c.font='bold 17px '+MONO;c.fillStyle='#fff6e8';c.fillText(o.sub,32,32)}
  c.fillStyle='#0a0610';rr(c,78,148,244,60,8);c.fill();c.strokeStyle='#8a7aa0';c.lineWidth=2;rr(c,78,148,244,60,8);c.stroke();
  c.save();rr(c,80,150,240,56,7);c.clip();const pr=o.pr==null?.3:o.pr,RL=25-11*pr,RR=14+11*pr,an=o.ang||0;
  c.strokeStyle='#4a2c20';c.lineWidth=3;c.beginPath();c.moveTo(142,178+RL);c.lineTo(258,178+RR);c.stroke();reel(c,142,178,RL,an);reel(c,258,178,RR,an*1.1);c.restore();
  c.fillStyle='#1a1424';c.beginPath();c.moveTo(66,214);c.lineTo(334,214);c.lineTo(352,239);c.lineTo(48,239);c.closePath();c.fill();c.strokeStyle='#0e0a14';c.lineWidth=2;c.stroke();
  for(const hx of [88,312]){c.fillStyle='#08050c';c.beginPath();c.arc(hx,222,6,0,TAU);c.fill()}c.fillStyle='#08050c';c.fillRect(176,218,48,9);c.restore()}
// ---------- estação 0: MAPA ----------
function stMap(c,A,g,t){const p=g.player,sc=1.5,ox=20,oy=46;
  paperR(c,8,34,372,314,-.004,'#cfc2a0',3,2.4);
  c.save();c.beginPath();c.rect(10,36,368,310);c.clip();
  c.strokeStyle='rgba(60,45,60,.1)';c.lineWidth=1;for(let x=ox;x<380;x+=33){c.beginPath();c.moveTo(x+.5,36);c.lineTo(x+.5,346);c.stroke()}for(let y=oy;y<346;y+=33){c.beginPath();c.moveTo(10,y+.5);c.lineTo(378,y+.5);c.stroke()}
  for(const z of ZONES){if(z.w<=0)continue;const v=p.visitedZones.has(z.id),x=ox+z.x*sc,y=oy+z.y*sc,w=z.w*sc,h=z.h*sc;
    if(v){c.globalAlpha=.5;c.fillStyle=z.accent;c.fillRect(x,y,w,h);c.globalAlpha=.95;c.strokeStyle='#3a2a30';c.lineWidth=1.2;c.strokeRect(x+.5,y+.5,w-1,h-1);c.globalAlpha=1;
      if(w>46){c.fillStyle='#2a1c24';c.font='7px '+MONO;c.fillText(z.name.length>w/4.1?z.name.slice(0,Math.floor(w/4.1)):z.name,x+3,y+9)}}
    else{c.strokeStyle='rgba(90,70,60,.5)';c.setLineDash([2,3]);c.strokeRect(x+.5,y+.5,w-1,h-1);c.setLineDash([])}}
  for(const it of g.interactives){if(it.type!=='rest')continue;const z=zoneAt(Math.floor(it.x/T),Math.floor(it.y/T));if(!z||!p.visitedZones.has(z.id))continue;
    const x=ox+it.x/T*sc,y=oy+it.y/T*sc;c.fillStyle='#8a2a44';c.beginPath();c.moveTo(x,y-4.5);c.lineTo(x+1.6,y-1.4);c.lineTo(x+4.5,y);c.lineTo(x+1.6,y+1.4);c.lineTo(x,y+4.5);c.lineTo(x-1.6,y+1.4);c.lineTo(x-4.5,y);c.lineTo(x-1.6,y-1.4);c.fill()}
  try{const N=window.NARR,st=N.NS(p);if(st.f.plan_marked){c.font='bold 10px '+MONO;for(const zid in N.CLO){const q=N.CLO[zid];if(!q||st.f['cl_'+zid])continue;c.fillStyle='#b8334f';c.fillText('?',ox+q.px*1.5-2,oy+q.fr*1.5+3)}}}catch(e){}
  c.restore();
  const mx=ox+(p.x/T)*sc,my=oy+(p.y/T)*sc,pu=2+Math.sin(t*4)*1.5;c.strokeStyle='rgba(184,51,79,.6)';c.lineWidth=1.5;c.beginPath();c.arc(mx,my,6+pu,0,TAU);c.stroke();pin(c,mx,my-1,'#c8284a');
  c.fillStyle='#8a1c36';c.font='italic bold 10px '+HANDF;c.fillText('você',mx+9,my-8);
  for(const [px,py] of [[18,43],[370,43],[18,340],[370,340]])pin(c,px,py,'#6a5a8a');
  c.fillStyle='#3a2a30';c.font='bold 9px '+MONO;c.fillText('MAPA — CASA DESFEITA',14,30);
  ring(c,300,330,11);
  // mini TVs
  const nf=(p.nar&&p.nar.f)||{},rec=p.records||[];
  miniTV(c,394,34,240,150,'LEGENDA.TXT',(c,x,y,w,h)=>{
    c.globalAlpha=.5;c.fillStyle=K.mid;c.fillRect(x+8,y+8,10,7);c.globalAlpha=1;c.strokeStyle=K.main;c.strokeRect(x+8.5,y+8.5,9,6);tx(c,'zona visitada',x+24,y+15,8,K.txt);
    c.strokeStyle=K.vioM;c.setLineDash([2,2]);c.strokeRect(x+8.5,y+22.5,9,6);c.setLineDash([]);tx(c,'não explorada',x+24,y+29,8,K.txt);
    c.fillStyle=K.amb;c.beginPath();c.moveTo(x+13,y+35);c.lineTo(x+16,y+39);c.lineTo(x+13,y+43);c.lineTo(x+10,y+39);c.fill();tx(c,'terminal de fita',x+24,y+43,8,K.txt);
    c.fillStyle=K.vio;c.fillRect(x+11,y+49,5,5);tx(c,'você',x+24,y+57,8,K.txt);
    tx(c,'chama de lúmen: '+(p.hasFlame?'sim':'não'),x+8,y+69,8,p.hasFlame?K.amb:K.vioM);tx(c,'libertados: '+(nf.free_n||0)+'  finalizados: '+(nf.cut_n||0),x+8,y+81,8,K.main)},t);
  miniTV(c,394,196,240,150,'REGISTROS.LOG',(c,x,y,w,h)=>{
    tx(c,'> '+rec.length+' entrada(s)',x+8,y+12,8,K.vio);
    rec.slice(-6).forEach((r,i)=>tx(c,'• '+(r[0].length>24?r[0].slice(0,23)+'…':r[0]),x+8,y+25+i*11,8,K.txt));
    if(!rec.length)tx(c,'// nada registrado ainda'+(Math.floor(t*2)%2?'_':''),x+8,y+26,8,K.vioM)},t)}
// ---------- estação 1: ÁLBUM DE FOTOS ----------
const PW=262,PH=290;
function photoSlot(c,e,idx,sel,t,sx,sy){const w=132,h=99,rot=sel?0:((idx*7)%5-2)*.014;
  c.save();c.translate(sx,sy);c.rotate(rot);if(sel){const k=1.08+Math.sin(t*3)*.01;c.scale(k,k)}
  if(!e.un){c.strokeStyle='rgba(80,60,60,.45)';c.setLineDash([3,3]);c.strokeRect(-w/2+.5,-h/2+.5,w-1,h-1);c.setLineDash([]);c.fillStyle='rgba(60,40,50,.5)';c.font='italic bold 26px '+HANDF;c.textAlign='center';c.fillText('?',0,9);c.textAlign='left';
    c.fillStyle='#6a5a60';c.font='italic 9px '+HANDF;c.textAlign='center';c.fillText('espaço vazio',0,h/2+12);c.textAlign='left'}
  else{shadowed(c,()=>{c.fillStyle='#e8dfcc';c.fillRect(-w/2-3,-h/2-3,w+6,h+6)},sel?14:6,2);c.imageSmoothingEnabled=false;c.drawImage(A.photoOf(e),-w/2,-h/2,w,h);c.fillStyle='rgba(120,80,160,.07)';c.fillRect(-w/2,-h/2,w,h);
    c.fillStyle='#14101c';for(const [cx,cy,dx,dy] of [[-1,-1,1,1],[1,-1,-1,1],[-1,1,1,-1],[1,1,-1,-1]]){const px=cx*(w/2+3),py=cy*(h/2+3);c.beginPath();c.moveTo(px,py);c.lineTo(px+dx*11,py);c.lineTo(px,py+dy*11);c.fill()}
    c.fillStyle='#3a2a34';c.font='italic 10px '+HANDF;c.textAlign='center';const tt=e.t.length>26?e.t.slice(0,25)+'…':e.t;c.fillText(tt,0,h/2+15);c.textAlign='left'}
  if(sel){c.strokeStyle='rgba(190,150,255,.95)';c.lineWidth=2;c.strokeRect(-w/2-5,-h/2-5,w+10,h+10)}
  c.restore()}
function pageContent(c,AL,spread,side,t){ // origem = lombada; direita: x 0..PW, esquerda: x -PW..0
  const x0=side==='R'?0:-PW,list=AL.lists[0],sel=AL.sel[0];
  const g=c.createLinearGradient(side==='R'?0:-PW,0,side==='R'?PW:0,0);if(side==='R'){g.addColorStop(0,'#bfb299');g.addColorStop(.12,'#e0d6bd');g.addColorStop(1,'#e8dfc8')}else{g.addColorStop(0,'#e8dfc8');g.addColorStop(.88,'#e0d6bd');g.addColorStop(1,'#bfb299')}
  c.fillStyle=g;c.fillRect(x0,0,PW,PH);for(let i=0;i<90;i++){c.fillStyle='rgba(90,70,50,'+(.03+hs(i,spread+(side==='R'?3:9))*.05)+')';c.fillRect(x0+hs(i,spread+2)*PW,hs(i,spread+5)*PH,1+hs(i,4)*2,1)}
  c.strokeStyle='rgba(90,70,50,.25)';c.strokeRect(x0+.5,.5,PW-1,PH-1);
  for(let k=0;k<2;k++){const idx=spread*4+(side==='R'?2:0)+k;if(idx>=list.length)continue;const e=list[idx];photoSlot(c,e,idx,idx===sel,t,x0+PW/2,76+k*140)}
  c.fillStyle='#7a6a60';c.font='italic 9px '+HANDF;c.textAlign=side==='R'?'right':'left';c.fillText(String(spread*2+(side==='R'?2:1)),side==='R'?x0+PW-12:x0+12,PH-8);c.textAlign='left'}
function stPhotos(c,AL,t){const list=AL.lists[0],n=Math.max(1,Math.ceil(list.length/4));
  // capa de couro
  shadowed(c,()=>{c.fillStyle='#3a1a2e';rr(c,26,26,588,318,10);c.fill()},18,6);const cg=c.createLinearGradient(0,26,0,344);cg.addColorStop(0,'#4a2038');cg.addColorStop(1,'#2a1224');c.fillStyle=cg;rr(c,26,26,588,318,10);c.fill();
  c.strokeStyle='rgba(210,122,138,.4)';c.setLineDash([5,3]);c.strokeRect(32.5,32.5,575,305);c.setLineDash([]);
  for(let i=0;i<260;i++){c.fillStyle='rgba(0,0,0,'+(.06+hs(i,1)*.08)+')';c.fillRect(26+hs(i,2)*588,26+hs(i,3)*318,2,1)}
  c.save();c.translate(320,36);
  const fl=AL.flip;
  if(!fl){pageContent(c,AL,AL.pg,'L',t);pageContent(c,AL,AL.pg,'R',t)}
  else{const k=ease3(fl.t),sx=Math.cos(Math.PI*k),fw=fl.to>fl.from;
    if(fw){pageContent(c,AL,fl.from,'L',t);pageContent(c,AL,fl.to,'R',t);c.save();c.scale(Math.abs(sx),1);if(k<.5)pageContent(c,AL,fl.from,'R',t);else pageContent(c,AL,fl.to,'L',t);c.restore()}
    else{pageContent(c,AL,fl.to,'R',t);pageContent(c,AL,fl.from,'L',t);c.save();c.scale(Math.abs(sx),1);if(k<.5)pageContent(c,AL,fl.from,'L',t);else pageContent(c,AL,fl.to,'R',t);c.restore()}
    c.fillStyle='rgba(0,0,0,'+(.25*Math.sin(Math.PI*k))+')';c.fillRect(-PW,0,PW*2,PH)}
  const sg=c.createLinearGradient(-14,0,14,0);sg.addColorStop(0,'rgba(0,0,0,0)');sg.addColorStop(.5,'rgba(40,20,20,.45)');sg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sg;c.fillRect(-14,0,28,PH);
  c.restore();
  tx(c,'álbum — pág. '+(AL.pg+1)+'/'+n,320,338,8,'#d8b8c8','center');
  if(AL.pg>0)tx(c,'◀',40,190,16,'#d8b8c8','left',true);if(AL.pg<n-1)tx(c,'▶',600,190,16,'#d8b8c8','right',true)}
// ---------- estação 2: GAVETEIRO ----------
const FC=['#c9b27a','#8a78b8','#9ab09a'],FCL=['#6a5e44','#463d62','#52604f'];
function stDocs(c,AL,t){const list=AL.lists[1],sel=AL.sel[1],nd=Math.max(1,Math.ceil(list.length/10)),dr=Math.floor(sel/10);
  const cx0=14,cy0=28,cw=190,chh=306;shadowed(c,()=>{c.fillStyle='#2a2438';c.fillRect(cx0,cy0,cw,chh)},16,5);
  const cg=c.createLinearGradient(cx0,0,cx0+cw,0);cg.addColorStop(0,'#4a4260');cg.addColorStop(1,'#322a44');c.fillStyle=cg;c.fillRect(cx0,cy0,cw,chh);c.strokeStyle='#0e0a14';c.lineWidth=2;c.strokeRect(cx0+1,cy0+1,cw-2,chh-2);
  const dh=Math.floor((chh-14)/nd);
  for(let d=0;d<nd;d++){const on=d===dr,off=AL.dro[d]||0,y=cy0+7+d*dh,x=cx0+8+off,w=cw-16,h=dh-4;
    shadowed(c,()=>{c.fillStyle=on?'#6a6080':'#58506a';c.fillRect(x,y,w,h)},on?10:3,2);
    c.fillStyle=on?'#7a7098':'#625a78';c.fillRect(x,y,w,2);c.fillStyle='#1a1424';c.fillRect(x,y+h-2,w,2);c.strokeStyle='#0e0a14';c.strokeRect(x+.5,y+.5,w-1,h-1);
    c.fillStyle='#c9a24a';c.fillRect(x+w/2-18,y+h-14,36,5);c.fillStyle='#e8d090';c.fillRect(x+w/2-18,y+h-14,36,1);
    c.fillStyle='#ddd2b8';c.fillRect(x+w/2-30,y+5,60,14);c.strokeStyle='#8a7a60';c.strokeRect(x+w/2-29.5,y+5.5,59,13);
    const un=list.slice(d*10,d*10+10).filter(e=>e.un).length;c.font='italic bold 9px '+HANDF;c.fillStyle=on?'#1a1020':'#5a4a5a';c.textAlign='center';c.fillText('Gaveta '+(d+1)+'  '+un+'/'+list.slice(d*10,d*10+10).length,x+w/2,y+15);c.textAlign='left'}
  // gaveta aberta
  const ox=222,oy=40,ow=406,oh=292;shadowed(c,()=>{c.fillStyle='#120c18';c.fillRect(ox,oy+40,ow,oh-40)},14,4);
  c.fillStyle='#1c1426';c.fillRect(ox,oy+40,ow,oh-40);const ig=c.createLinearGradient(0,oy+40,0,oy+oh);ig.addColorStop(0,'#0a0610');ig.addColorStop(1,'#241a30');c.fillStyle=ig;c.fillRect(ox+6,oy+46,ow-12,oh-60);
  const base=dr*10,fo=Math.min(10,list.length-base);
  for(let i=0;i<fo;i++){const e=list[base+i],on=base+i===sel,fx=ox+14+i*39,top=oy+78+(on?-26:0),fh=170,ci=(base+i)%3;
    c.save();shadowed(c,()=>{c.fillStyle=e.un?FC[ci]:'#3a3248';c.fillRect(fx,top,35,fh)},on?12:4,2);
    const gg=c.createLinearGradient(fx,0,fx+35,0);gg.addColorStop(0,'rgba(255,255,255,.18)');gg.addColorStop(1,'rgba(0,0,0,.25)');c.fillStyle=gg;c.fillRect(fx,top,35,fh);
    c.strokeStyle=e.un?FCL[ci]:'#1a1424';c.strokeRect(fx+.5,top+.5,34,fh-1);
    const tabx=fx+((base+i)*13%3)*5,tw=26;c.fillStyle=e.un?FC[ci]:'#463d58';c.fillRect(tabx,top-10,tw,11);c.strokeStyle=e.un?FCL[ci]:'#1a1424';c.strokeRect(tabx+.5,top-9.5,tw-1,10);
    if(e.un){c.fillStyle='#2a1c28';c.font='bold 6.5px '+MONO;c.fillText(String(e.id).replace(/^B_/,'LV-').slice(0,6),tabx+2,top-2)}
    if(on){c.strokeStyle='rgba(190,150,255,.95)';c.lineWidth=2;c.strokeRect(fx-1,top-11,37,fh+12);c.lineWidth=1}
    if(e.un){c.fillStyle='rgba(60,40,30,.5)';for(let k=0;k<4;k++)c.fillRect(fx+6,top+30+k*7,23-(k%2)*6,1)}c.restore()}
  // frente da gaveta
  shadowed(c,()=>{c.fillStyle='#4a4458';c.fillRect(ox-4,oy+232,ow+8,62)},10,-2);const fg=c.createLinearGradient(0,oy+232,0,oy+294);fg.addColorStop(0,'#6a6280');fg.addColorStop(1,'#3a3450');c.fillStyle=fg;c.fillRect(ox-4,oy+232,ow+8,62);c.strokeStyle='#0e0a14';c.strokeRect(ox-3.5,oy+232.5,ow+7,61);
  c.fillStyle='#c9a24a';rr(c,ox+ow/2-34,oy+270,68,10,5);c.fill();c.fillStyle='#e8d090';c.fillRect(ox+ow/2-30,oy+271,60,2);
  c.fillStyle='#ddd2b8';c.fillRect(ox+ow/2-96,oy+240,192,24);c.strokeStyle='#8a7a60';c.strokeRect(ox+ow/2-95.5,oy+240.5,191,23);
  const cur=list[sel];c.fillStyle='#1a1020';c.font='italic bold 11px '+HANDF;c.textAlign='center';const nm=cur&&cur.un?cur.t:'— pasta vazia —';c.fillText(nm.length>34?nm.slice(0,33)+'…':nm,ox+ow/2,oy+257);c.textAlign='left';
  tx(c,'PASTAS — '+list.filter(e=>e.un).length+'/'+list.length,ox,oy+30,9,'#d8b8e8',null,true)}
// ---------- estação 3: FITAS ----------
function stItems(c,AL,t){const list=AL.lists[2],sel=AL.sel[2];
  shadowed(c,()=>{c.fillStyle='#3a2a2a';rr(c,22,24,596,320,8);c.fill()},16,5);const tg=c.createLinearGradient(0,24,0,344);tg.addColorStop(0,'#4a3238');tg.addColorStop(1,'#2a1a22');c.fillStyle=tg;rr(c,22,24,596,320,8);c.fill();
  c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=2;rr(c,30,32,580,304,6);c.stroke();c.fillStyle='#1a1018';rr(c,34,36,572,296,5);c.fill();
  for(let i=0;i<list.length;i++){const e=list[i],cc=i%4,r=Math.floor(i/4),x=46+cc*140,y=44+r*98,on=i===sel,lift=on?-9:0;
    c.fillStyle='rgba(0,0,0,.45)';c.fillRect(x-2,y+80,132,3);
    cass(c,x,y+lift,128,{label:e.un?e.t:null,locked:!e.un,stripe:CATC[e.cat],sub:e.un?({collect:'COLETADO',destroy:'DESTRUÍDO',free:'LIBERTADO',cut:'FINALIZADO'}[e.cat]||''):'',ang:on?t*3:0,pr:.2+(i%5)*.12,glow:on})}
  tx(c,'FITAS — '+list.filter(e=>e.un).length+'/'+list.length,40,350,8,'#d8b8e8',null,true)}
// ---------- detalhes ----------
function typedPaper(c,x,y,w,h,rot,seed){paperR(c,x,y,w,h,rot,'#e0d6bc',seed,2.6)}
function detail(c,AL,g,t){const st=AL.st,list=AL.lists[st-1],e=list[AL.sel[st-1]],k=ease3(AL.dz);if(k<=0||!e)return;
  c.save();c.fillStyle='rgba(8,4,14,'+(.8*k)+')';c.fillRect(0,0,640,360);c.globalAlpha=k;c.translate(320,190);const s=.88+.12*k;c.scale(s,s);c.translate(-320,-190);
  const zn=A.zname(e.z);
  if(st===1){typedPaper(c,36,28,568,310,-.004,11);
    c.save();c.translate(176,160);shadowed(c,()=>{c.fillStyle='#e8dfcc';c.fillRect(-124,-96,248,192)},12,3);c.imageSmoothingEnabled=false;c.drawImage(A.photoOf(e),-120,-90,240,180);c.fillStyle='rgba(120,80,160,.07)';c.fillRect(-120,-90,240,180);
    c.fillStyle='#14101c';for(const [cx,cy,dx,dy] of [[-1,-1,1,1],[1,-1,-1,1],[-1,1,1,-1],[1,1,-1,-1]]){const px=cx*124,py=cy*96;c.beginPath();c.moveTo(px,py);c.lineTo(px+dx*18,py);c.lineTo(px,py+dy*18);c.fill()}c.restore();
    let y=62;c.fillStyle=INK;c.font='bold 13px '+MONO;for(const l of COL.wrap(c,e.t.toUpperCase(),250)){c.fillText(l,332,y);y+=16}
    c.fillStyle='#6a3a52';c.font='italic 11px '+HANDF;c.fillText(zn,332,y+2);y+=24;c.fillStyle='#3a2a34';c.font='12px '+MONO;
    for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,250)){if(y>252)break;c.fillText(l,332,y);y+=15}y+=3}
    const clue=A.CLUE[String(e.id).replace(/^F_|^V_/,'')]||A.CLUE[e.sc];if(clue){let yy=Math.max(y+8,262);c.fillStyle='#b8334f';c.font='italic 12px '+HANDF;COL.wrap(c,'✎ '+clue,250).slice(0,3).forEach(l=>{c.fillText(l,332,yy);yy+=15})}
    tx(c,'E / Esc — voltar ao álbum',60,330,8,'#6a5a60')}
  else if(st===2){if(e.kind==='screen'){win(c,110,14,420,330,'doc_'+String(e.id).toLowerCase()+'.txt');c.fillStyle='rgba(106,90,138,.88)';c.fillRect(118,28,404,15);c.fillStyle='rgba(176,150,230,.85)';c.fillRect(118,28,404,1);U.tm(1);tx(c,'local: '+zn,126,39,9,'#f0eaff');let y=64;for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,380)){if(y>324)break;tx(c,l,126,y,12,K.txt);y+=17}y+=5}U.tm(-1);foot(c,112,331,416,[['F1','Ajuda'],['E','Fechar'],['ESC','Sair']])}
    else{typedPaper(c,150,26,340,324,.01,23);const plate=e.kind==='plate';if(plate){c.fillStyle='rgba(70,70,90,.35)';c.fillRect(160,36,320,304)}
      c.fillStyle='#7a2a44';c.font='bold 10px '+MONO;c.fillText((e.kind||'nota').toUpperCase()+' — '+zn,172,38);c.fillStyle=INK;c.font=(e.kind==='book'?'italic 13px Georgia':'12px '+MONO);let y=74;
      for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,296)){if(y>334)break;c.fillText(l,172,y);y+=17}y+=5}}
    tx(c,e.t,320,356,9,'#d8b8e8','center',true)}
  else{cass(c,40,70,300,{label:e.t,stripe:CATC[e.cat],sub:({collect:'COLETADO',destroy:'DESTRUÍDO',free:'LIBERTADO',cut:'FINALIZADO'}[e.cat]||''),ang:t*2.6,pr:.4,glow:true});
    miniTV(c,356,36,262,168,'ITEM.DAT',(c,x,y,w,h)=>{c.imageSmoothingEnabled=false;const iw=Math.min(w-8,(h-6)*4/3);c.drawImage(A.photoOf(e),x+(w-iw)/2,y+3,iw,iw*.75)},t);
    typedPaper(c,356,222,262,112,.008,31);c.fillStyle=INK;c.font='bold 11px '+MONO;c.fillText(e.t.toUpperCase().slice(0,26),370,246);c.fillStyle='#6a3a52';c.font='italic 10px '+HANDF;c.fillText(zn,370,260);c.fillStyle='#3a2a34';c.font='11px '+MONO;
    let y=277;for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,232)){if(y>324)break;c.fillText(l,370,y);y+=13}}
    tx(c,'E / Esc — voltar às fitas',60,326,8,'#a898c0')}
  c.restore()}
// ---------- composição ----------
const HINT=['←→ Q/R trocar de mesa  ·  M/Esc fechar','←→ virar página  ·  ↑↓ foto  ·  E ampliar  ·  Q/R mesa','←→ pasta  ·  ↑↓ gaveta  ·  E abrir  ·  Q/R mesa','←→↑↓ fita  ·  E ouvir  ·  Q/R mesa'];
COL.album=function(g,c){const AL=g._alb,t=T0();if(!AL)return;if(AL.st===undefined){AL.st=1;AL.cam=1}if(AL.pg===undefined)AL.pg=Math.floor(AL.sel[0]/4);if(!AL.dro)AL.dro=[0,0,0,0,0,0];if(!AL.dz)AL.dz=0;
  c.save();c.fillStyle='#120a18';c.fillRect(0,0,640,360);
  const dist=Math.abs(AL.st-AL.cam),dip=Math.sin(cl(dist,0,1)*Math.PI)*.045;
  c.translate(320,180);c.scale(1-dip,1-dip);c.translate(-320,-180);
  for(let s=0;s<4;s++){const off=(s-AL.cam)*640;if(Math.abs(off)>=640)continue;c.save();c.translate(Math.round(off),0);desk(c);
    if(s===0)stMap(c,AL,g,t);else if(s===1)stPhotos(c,AL,t);else if(s===2)stDocs(c,AL,t);else stItems(c,AL,t);c.restore()}
  c.restore();
  // luz do abajur e vinheta
  const lg=c.createRadialGradient(320,150,40,320,170,420);lg.addColorStop(0,'rgba(255,200,240,.07)');lg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=lg;c.fillRect(0,0,640,360);vign(c,.75);
  for(let i=0;i<14;i++){c.fillStyle='rgba(255,230,255,'+(.08+.1*Math.sin(t+i))+')';c.fillRect((hs(i,1)*640+t*4*(1+i%3))%640,(hs(i,2)*360+t*2)%360,1,1)}
  // detalhe
  if(AL.dz>0.001)detail(c,AL,g,t);
  // barra de abas
  c.fillStyle='rgba(8,4,14,.88)';c.fillRect(0,0,640,17);c.fillStyle=K.vioM;c.fillRect(0,17,640,1);
  const lab=[ST[0],'FOTOS '+AL.lists[0].filter(e=>e.un).length+'/'+AL.lists[0].length,'PASTAS '+AL.lists[1].filter(e=>e.un).length+'/'+AL.lists[1].length,'FITAS '+AL.lists[2].filter(e=>e.un).length+'/'+AL.lists[2].length];
  lab.forEach((n,i)=>{const on=i===AL.st,x=10+i*152,w=146;c.fillStyle=on?K.main:'rgba(40,24,70,.9)';c.fillRect(x,3,w,13);c.strokeStyle=on?K.hi:K.vioM;c.strokeRect(x+.5,3.5,w-1,12);tx(c,n,x+w/2,13,9,on?'#021410':K.vio,'center',true)});
  tx(c,'Q',2,13,7,K.vioM);tx(c,'R',638,13,7,K.vioM,'right');
  if(!AL.dz)tx(c,HINT[AL.st],320,355,8,'#a898c0','center');
  scan(c,.07)};
// ---------- entrada ----------
function nav(g,AL,dt){const i=g.input,st=AL.st,li=st-1,L=AL.lists[li],n=L?L.length:0,s=AL.sel;
  const P=k=>i.wasPressed(k);const R=P('ArrowRight')||P('KeyD'),Lf=P('ArrowLeft')||P('KeyA'),Dn=P('ArrowDown')||P('KeyS'),Up=P('ArrowUp')||P('KeyW');
  if(st===1){if(R)s[0]=Math.min(n-1,s[0]+2);if(Lf)s[0]=Math.max(0,s[0]-2);if(Dn&&s[0]%2===0&&s[0]+1<n)s[0]++;if(Up&&s[0]%2===1)s[0]--}
  else if(st===2){if(R)s[1]=Math.min(n-1,s[1]+1);if(Lf)s[1]=Math.max(0,s[1]-1);if(Dn)s[1]=Math.min(n-1,s[1]+10);if(Up)s[1]=Math.max(0,s[1]-10)}
  else if(st===3){if(R)s[2]=Math.min(n-1,s[2]+1);if(Lf)s[2]=Math.max(0,s[2]-1);if(Dn)s[2]=Math.min(n-1,s[2]+4);if(Up)s[2]=Math.max(0,s[2]-4)}
  else{if(R)AL.st=1;}
  if((P('KeyE')||P('Enter'))&&st>0&&L[s[li]]&&L[s[li]].un)AL.detail=true}
function albUpdate(g,dt){const AL=g._alb,i=g.input;if(AL.st===undefined){AL.st=1;AL.cam=1}
  if(!AL.dro)AL.dro=[0,0,0,0,0,0];if(!AL.dz)AL.dz=0;if(AL.pg===undefined)AL.pg=Math.floor(AL.sel[0]/4);
  AL.cam+=(AL.st-AL.cam)*Math.min(1,dt*4.2);if(Math.abs(AL.st-AL.cam)<.002)AL.cam=AL.st;
  AL.dz+=(((AL.detail?1:0)-(AL.dz||0))*Math.min(1,dt*10));if(!AL.dz)AL.dz=0;
  const nd=Math.ceil(AL.lists[1].length/10);for(let d=0;d<nd;d++)AL.dro[d]+=(((d===Math.floor(AL.sel[1]/10)?16:0))-AL.dro[d])*Math.min(1,dt*10);
  if(AL.flip){AL.flip.t+=dt/.55;if(AL.flip.t>=1){AL.pg=AL.flip.to;AL.flip=null}}
  const want=Math.floor(AL.sel[0]/4);if(!AL.flip&&want!==AL.pg)AL.flip={from:AL.pg,to:want>AL.pg?AL.pg+1:AL.pg-1,t:0};
  const P=k=>i.wasPressed(k),close=()=>{g.state=AL.from||'playing'};
  if(P('Escape')){if(AL.detail)AL.detail=false;else close();return}
  if(AL.detail){if(P('KeyE')||P('Enter'))AL.detail=false;return}
  if(P('KeyM')){if(AL.st===0)close();else AL.st=0;return}
  if(P('KeyL')){if(AL.st===1)close();else AL.st=1;return}
  if(P('KeyQ')){AL.st=(AL.st+3)%4;return}if(P('KeyR')){AL.st=(AL.st+1)%4;return}
  if(AL.st===0&&(P('ArrowLeft')||P('KeyA'))){AL.st=3;return}
  if(AL.st===3&&(P('ArrowRight')||P('KeyD'))&&false){return}
  nav(g,AL,dt)}
function toAlb(g,st,from){A.open(g,from);g._alb.st=st;g._alb.cam=st}
const oUA=G.update;
G.update=function(dt){const s=dt>1?dt/1000:dt;
  if(this.state==='album'&&this._alb){albUpdate(this,s);return}
  const before=this.state,r=oUA.call(this,dt);
  if(this.state==='map')toAlb(this,0,before==='pause'?'pause':'playing');
  else if(this.state==='album'&&this._alb&&this._alb.st===undefined){this._alb.st=1;this._alb.cam=1}
  return r};
// ---------- transição: novo jogo = zoom na fita até a cena da fita ----------
const oSN=G.startNewGame;
G.startNewGame=function(){if(this._ni||this._tz)return oSN.call(this);
  const cv=mkc(640,360);try{this.drawTitle(cv.getContext('2d'))}catch(e){}
  oSN.call(this);this._tz={t:0,img:cv}};
const oUT=G.update;
G.update=function(dt){const s=dt>1?dt/1000:dt;if(this._tz){this._tz.t+=s;if(this._tz.t>=2.6)this._tz=null;return}return oUT.call(this,dt)};
const oDT=G.draw;
G.draw=function(){oDT.call(this);const z=this._tz;if(!z)return;const c=this.ctx,k=ease3(z.t/2.6),al=1-ease3((z.t/2.6-.45)/.55);
  const s=1+1.35*k,fx=320,fy=190,tx2=320,ty2=144;const cx=lerp(fx,tx2,k),cy=lerp(fy,ty2,k);
  c.save();c.globalAlpha=cl(al,0,1);c.translate(cx,cy);c.scale(s,s);c.translate(-fx,-fy);c.imageSmoothingEnabled=true;c.drawImage(z.img,0,0);c.restore();
  c.fillStyle='rgba(8,4,14,'+(.35*Math.sin(Math.PI*cl(z.t/2.6,0,1)))+')';c.fillRect(0,0,640,360)};
function lerp(a,b,k){return a+(b-a)*k}
})();
