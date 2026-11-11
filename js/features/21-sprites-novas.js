/* ===== SPRITES NOVAS: inimigos, itens, espinhos, grama e fotos (substituem toda a arte antiga) ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,ART=window.ART;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const OUT='#0b0912';
const R=(x,a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a|0,b|0,w,h)};
const line=(x,a,b,c,d,col,w)=>{x.strokeStyle=col;x.lineWidth=w||1;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()};
const circ=(x,a,b,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(a,b,r,0,TAU);x.fill()};
const oc=(x,a,b,r,col)=>{circ(x,a,b,r+1,OUT);circ(x,a,b,r,col)};
// camada 2: itens procedurais recoloridos para a paleta lilás, com contorno
let L2=null,S2=null;
window.decoBegin2=function(ctx){if(typeof document.createElement!=='function'||!ctx.canvas)return ctx;const w=ctx.canvas.width||640,h=ctx.canvas.height||360;
  if(!L2||L2.width!==w){L2=mk(w,h);S2=mk(w,h)}const l=L2.getContext('2d');l.setTransform(1,0,0,1,0,0);l.globalCompositeOperation='source-over';l.globalAlpha=1;l.filter='none';l.clearRect(0,0,w,h);window.__deco2=true;return l};
window.decoEnd2=function(ctx){if(!window.__deco2||!L2)return;window.__deco2=false;const w=L2.width,h=L2.height,s=S2.getContext('2d');
  s.setTransform(1,0,0,1,0,0);s.globalCompositeOperation='source-over';s.clearRect(0,0,w,h);s.drawImage(L2,0,0);s.globalCompositeOperation='source-in';s.fillStyle=OUT;s.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha=.85;for(const [x,y] of [[-1,0],[1,0],[0,-1],[0,1]])ctx.drawImage(S2,x,y);ctx.globalAlpha=1;
  if('filter' in ctx)ctx.filter='hue-rotate(252deg) saturate(.85) brightness(1.1)';ctx.drawImage(L2,0,0);ctx.filter='none';ctx.restore()};
// terminais: televisor de tubo da folha
window.TERMDRAW=function(c,x,y,done,t){const im=ART.get('tv');if(!im)return;const H=26,s=H/im.naturalHeight,w=im.naturalWidth*s,cx=x+16,by=y+T;
  c.save();c.imageSmoothingEnabled=true;c.drawImage(im,cx-w/2,by-H,w,H);c.restore();
  if(!done){for(let j=0;j<5;j++){const lw=4+(Math.sin(t*3+j*1.7)*.5+.5)*(w*.5);c.fillStyle='rgba(200,170,255,.8)';c.fillRect(cx-w*.3,by-H*.72+j*2.6,lw,1)}c.fillStyle='rgba(190,150,255,.14)';c.beginPath();c.arc(cx,by-H*.5,24,0,TAU);c.fill()}
  else{c.fillStyle='rgba(10,6,16,.6)';c.fillRect(cx-w*.32,by-H*.8,w*.62,H*.5)}};
// ---------- inimigos novos (pixel art desenhada por código) ----------
function strip(name,n,cw,ch,fn){const c=mk(cw*n,ch),x=c.getContext('2d');x.imageSmoothingEnabled=false;for(let i=0;i<n;i++){x.save();x.translate(i*cw,0);fn(x,i);x.restore()}const im=new Image();im.src=c.toDataURL();window.SPRS[name]={i:im,n,cw,ch}}
function doll(x,i,st){const ph=i/4*TAU,bob=st==='idle'?Math.round(Math.sin(ph)):st==='walk'?Math.abs(Math.round(Math.sin(ph)*1.5)):0,sw=st==='walk'?Math.sin(ph)*4:0;
  x.save();x.translate(18,26+bob);x.rotate(st==='hurt'?-.35:0);x.translate(-18,-26);
  const lg=(ox,s)=>{line(x,ox,36,ox+s,43,OUT,3);line(x,ox,36,ox+s,43,'#d8cfe0',1)};lg(14,sw*.5);lg(22,-sw*.5);
  x.fillStyle=OUT;x.beginPath();x.moveTo(18,19);x.lineTo(5,40);x.lineTo(31,40);x.closePath();x.fill();
  x.fillStyle='#d8cfe6';x.beginPath();x.moveTo(18,20);x.lineTo(7,39);x.lineTo(29,39);x.closePath();x.fill();
  x.fillStyle='#a898c0';x.beginPath();x.moveTo(18,20);x.lineTo(18,39);x.lineTo(29,39);x.closePath();x.fill();
  for(let k=0;k<5;k++)R(x,7+k*5,38,3,2,'#d8cfe6');line(x,13,28,11,38,'#8a7aa8');line(x,23,28,25,38,'#8a7aa8');
  const arm=(sx,a,l)=>{const ex=sx+Math.cos(a)*l,ey=25+Math.sin(a)*l;line(x,sx,24,ex,ey,OUT,3);line(x,sx,24,ex,ey,'#e6dcc6',1);return[ex,ey]};
  if(st==='attack'){const a=[-1.9,-1.2,-.6,.2][i%4],[ex,ey]=arm(24,a,10);arm(12,2.6,8);line(x,ex,ey,ex+5,ey-5,OUT,3);line(x,ex,ey,ex+5,ey-5,'#c9c4d6',1);line(x,ex,ey,ex+6,ey-1,OUT,3);line(x,ex,ey,ex+6,ey-1,'#c9c4d6',1)}
  else{arm(24,.9+sw*.08,9);arm(12,2.2-sw*.08,9)}
  oc(x,18,12,9,'#eee6f4');x.fillStyle='#3a2e44';x.beginPath();x.arc(18,11,9,Math.PI,TAU);x.fill();R(x,9,11,3,6,'#3a2e44');R(x,24,11,3,6,'#3a2e44');
  oc(x,26,5,3,'#D27A8A');oc(x,29,6,2,'#D27A8A');
  if(st==='hurt'){line(x,12,13,16,17,'#2a1c30');line(x,16,13,12,17,'#2a1c30');line(x,20,13,24,17,'#2a1c30');line(x,24,13,20,17,'#2a1c30')}else{oc(x,14,14,2,'#7E35B8');oc(x,22,14,2,'#7E35B8');R(x,13,13,1,1,'#fff');R(x,21,13,1,1,'#fff')}
  R(x,11,17,2,1,'#D27A8A');R(x,23,17,2,1,'#D27A8A');for(let k=0;k<4;k++)R(x,14+k*2,19+(st==='attack'?1:0),1,1,'#2a1c30');x.restore()}
function rat(x,i,st){const ph=i/4*TAU,sw=st==='walk'?Math.sin(ph)*2:0,lu=st==='attack'?[0,2,5,2][i%4]:0,sq=st==='hurt'?1:0;
  x.strokeStyle=OUT;x.lineWidth=3;x.beginPath();x.moveTo(11,17);x.bezierCurveTo(5,15,3,9,6+Math.sin(ph)*2,5);x.stroke();x.strokeStyle='#6a4a8a';x.lineWidth=1;x.stroke();
  for(const[ox,s]of[[14,sw],[18,-sw],[26+lu,-sw],[30+lu,sw]]){line(x,ox,21,ox+s,25,OUT,3);line(x,ox,21,ox+s,25,'#7a5a9a',1)}
  const bg=x.createLinearGradient(0,10,0,23);bg.addColorStop(0,'#a888d8');bg.addColorStop(1,'#5a3a8a');
  x.fillStyle=OUT;x.beginPath();x.ellipse(21,17+sq,13,7-sq,0,0,TAU);x.fill();x.fillStyle=bg;x.beginPath();x.ellipse(21,17+sq,12,6-sq,0,0,TAU);x.fill();
  for(let k=0;k<5;k++)R(x,12+k*4,12+sq,2,1,'#D27A8A');
  const hx=33+lu;x.fillStyle=OUT;x.beginPath();x.ellipse(hx,15+sq,7,5,0,0,TAU);x.fill();x.fillStyle='#b898e8';x.beginPath();x.ellipse(hx,15+sq,6,4,0,0,TAU);x.fill();
  x.fillStyle=OUT;x.beginPath();x.moveTo(hx+4,13+sq);x.lineTo(hx+10,16+sq);x.lineTo(hx+4,18+sq);x.closePath();x.fill();x.fillStyle='#d8c8f0';x.beginPath();x.moveTo(hx+4,14+sq);x.lineTo(hx+9,16+sq);x.lineTo(hx+4,17+sq);x.closePath();x.fill();
  R(x,hx+9,15+sq,2,2,'#D27A8A');oc(x,hx-2,10+sq,3,'#b898e8');R(x,hx-3,9+sq,2,2,'#D27A8A');oc(x,hx+1,10+sq,2,'#b898e8');circ(x,hx+2,14+sq,1.6,'#ff7a9a');R(x,hx+2,13+sq,1,1,'#fff');
  if(st==='attack'&&i%4>=1){R(x,hx+5,18+sq,1,2,'#fff');R(x,hx+8,18+sq,1,2,'#fff')}}
function mari(x,i,st){const ph=i/4*TAU,sw=st==='walk'?Math.sin(ph)*5:0,bob=st==='idle'?Math.round(Math.sin(ph)):0;
  x.strokeStyle='rgba(184,160,216,.65)';x.lineWidth=1;for(const hx of[19,10,28]){x.beginPath();x.moveTo(hx,0);x.lineTo(hx+Math.sin(ph+hx)*1.5,hx===19?6:30);x.stroke()}
  x.save();x.translate(0,bob);
  const leg=(ox,s,br)=>{const kx=ox+s*.6,ky=44,fx=ox+s+(br?5:0),fy=br?55:56;line(x,ox,36,kx,ky,OUT,4);line(x,ox,36,kx,ky,'#8a7aa8',2);line(x,kx,ky,fx,fy,OUT,4);line(x,kx,ky,fx,fy,'#a898c0',2);oc(x,kx,ky,2,'#e6dcc6')};leg(15,sw,false);leg(23,-sw,true);
  R(x,12,18,14,19,OUT);R(x,13,19,12,17,'#6a5a7a');R(x,13,19,12,3,'#8a7aa8');
  x.fillStyle='#4a3a5a';x.beginPath();x.moveTo(13,33);x.lineTo(15,39);x.lineTo(18,34);x.lineTo(21,40);x.lineTo(24,34);x.lineTo(25,38);x.lineTo(25,33);x.closePath();x.fill();
  const arm=(sx,a1,a2)=>{const ex=sx+Math.cos(a1)*8,ey=21+Math.sin(a1)*8,fx=ex+Math.cos(a2)*8,fy=ey+Math.sin(a2)*8;line(x,sx,21,ex,ey,OUT,4);line(x,sx,21,ex,ey,'#a898c0',2);line(x,ex,ey,fx,fy,OUT,4);line(x,ex,ey,fx,fy,'#a898c0',2);oc(x,ex,ey,2,'#e6dcc6');return[fx,fy]};
  if(st==='attack'){const a=[-2.2,-1.4,-.5,.3][i%4],[fx,fy]=arm(26,a,a+.6);arm(12,2.4,2.2);line(x,fx,fy,fx+7,fy-3,OUT,4);line(x,fx,fy,fx+7,fy-3,'#d8d4e6',2)}else{arm(26,.9+sw*.06,1.3);arm(12,2.3-sw*.06,1.9)}
  oc(x,19,10,7,'#b8a8c8');line(x,16,4,19,9,'#3a2e44');line(x,19,9,17,15,'#3a2e44');
  if(st==='hurt'){line(x,15,9,18,12,'#2a1c30');line(x,18,9,15,12,'#2a1c30')}else oc(x,15,10,1.5,'#2a1c30');
  R(x,21,9,3,3,'#2a1c30');R(x,22,10,1,1,'#7E35B8');R(x,17,15,5,1,'#2a1c30');line(x,17,15,17,17,'#2a1c30');line(x,20,15,20,17,'#2a1c30');x.restore()}
for(const [n,f,cw,ch] of [['doll',doll,36,46],['rat',rat,46,28],['mari',mari,38,60]])for(const [st,k] of [['idle',4],['walk',4],['attack',4],['hurt',3]])strip(n+'_'+st,k,cw,ch,(x,i)=>f(x,i,st));
// ---------- objetos interativos novos (substituem os recortes antigos) ----------
const DIM={rest:[51,52],chest:[49,52],door:[52,55],npc:[46,54],fragment:[46,34],obj:[54,55],heal:[31,37],key:[26,40],stairs:[43,58]};
let DONE=false;
function envBuild(){
  if(DONE)return;const E=(typeof ENV!=='undefined')?ENV:null,S=window.SPRS;if(!E||!S.mika_idle||!S.mika_idle.i.naturalWidth)return;
  if(!['candelabra','desk_chests','door_gothic','key','clock_pocket'].every(k=>ART.get(k)))return;DONE=true;
  const put=(k,fn)=>{const[w,h]=DIM[k],c=mk(w,h),x=c.getContext('2d');x.imageSmoothingEnabled=true;fn(x,w,h);E[k]={i:c,ok:true,w,h}};
  const fit=(img,sx,sy,sw,sh)=>(x,w,h)=>{const s=Math.min(w/sw,h/sh),dw=sw*s,dh=sh*s;x.drawImage(img,sx,sy,sw,sh,(w-dw)/2,h-dh,dw,dh)};
  const whole=k=>{const im=ART.get(k);return fit(im,0,0,im.naturalWidth,im.naturalHeight)};
  put('rest',whole('candelabra'));put('chest',whole('desk_chests'));put('door',whole('door_gothic'));put('key',whole('key'));put('obj',whole('clock_pocket'));
  const id=S.mika_idle;put('npc',fit(id.i,0,0,id.cw,id.ch));
  put('fragment',(x,w,h)=>{x.imageSmoothingEnabled=false;const P=(pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()};
    P([[23,0],[44,13],[23,34],[2,13]],OUT);P([[23,2],[41,13],[23,31],[5,13]],'#8a6ab8');P([[23,2],[41,13],[23,14]],'#d8c8f0');P([[23,14],[41,13],[23,31]],'#b898e8');P([[23,2],[5,13],[23,14]],'#a888d8');line(x,23,2,23,31,'#e6dcf4');R(x,19,6,3,3,'#fff')});
  put('heal',(x,w,h)=>{x.imageSmoothingEnabled=false;oc(x,15,24,11,'#d8cfe6');R(x,11,2,9,10,OUT);R(x,12,3,7,9,'#d8cfe6');R(x,11,0,9,5,OUT);R(x,12,1,7,3,'#a98a5a');
    x.fillStyle='#D27A8A';x.beginPath();x.arc(15,26,9,0,Math.PI);x.lineTo(6,22);x.lineTo(24,22);x.closePath();x.fill();R(x,7,22,17,1,'#ffb0c8');R(x,9,19,3,6,'rgba(255,255,255,.6)');
    x.fillStyle='#fff';x.fillRect(14,25,2,2);x.fillRect(13,26,4,1)});
  put('stairs',(x,w,h)=>{x.imageSmoothingEnabled=false;for(const rx of [6,33]){R(x,rx-1,0,6,h,OUT);R(x,rx,0,4,h,'#4a3a5a');R(x,rx,0,1,h,'#9a8ab8')}
    for(let y=4;y<h;y+=13){R(x,8,y-1,27,5,OUT);R(x,9,y,25,3,'#8a7aa8');R(x,9,y,25,1,'#c9bde0');R(x,19,y-2,5,2,'#D27A8A')}})}
const oW=G.drawWorld;G.drawWorld=function(ctx){envBuild();oW.call(this,ctx)};
// ---------- espinhos: ferro gótico (peças da cerca) ----------
window.drawHazards=function(ctx,hz,cam){const f=ART.get('fence_a');
  for(const h of hz){const px=Math.floor(h.x-cam.x),py=Math.floor(h.y-cam.y);if(px<-24||px>664)continue;
    if(f){const sw=f.naturalWidth/6;for(let i=0;i<h.w;i+=16){const k=Math.floor((h.x+i)/16)%5;ctx.drawImage(f,k*sw,0,sw,f.naturalHeight*.52,px+i,py+h.h-12,Math.min(16,h.w-i),12)}}
    else{ctx.fillStyle='#8a7aa8';for(let i=0;i<h.w;i+=5){ctx.beginPath();ctx.moveTo(px+i,py+h.h);ctx.lineTo(px+i+2.5,py);ctx.lineTo(px+i+5,py+h.h);ctx.fill()}}}};
// ---------- grama, poeira e hera na paleta nova ----------
const RR=(c,a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(a|0,b|0,w,h)};
window.drawGrass=function(c,px,py,tx,ty){for(let i=0;i<5;i++){const bx=px+1+i*3+((hs(tx+i,ty)*2)|0),bh=2+((hs(i+3,tx)*4)|0);RR(c,bx,py-bh,1,bh,i%2?'#3a4a5a':'#2c3a4c');RR(c,bx,py-bh,1,1,'#7a9a9a')}
  if(hs(tx,ty+5)>.82){RR(c,px+6,py-6,3,3,'#D8A0B0');RR(c,px+7,py-5,1,1,'#E6DCC6')}};
window.drawDust=function(c,px,py,tx,ty){RR(c,px+3,py-2,3,2,'rgba(201,185,230,.3)')};
window.drawVine=function(c,px,py,tx,ty,r){const l=3+((r*12)|0),b=py+16;RR(c,px+4,b,1,l,'#2c3a4c');for(let k=2;k<l;k+=3){RR(c,px+(k%2?2:5),b+k,2,2,'#3a4a5a')}RR(c,px+10,b,1,l>>1,'#2c3a4c');RR(c,px+3,b+l,3,2,'#D8A0B0');RR(c,px+4,b+l,1,1,'#E6DCC6')};
})();
