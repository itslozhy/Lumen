/* ===== INIMIGOS: ataques, caídos e fios que espremem; itens; passagens mais altas ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const OUT='#0b0912';
const R=(x,a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a|0,b|0,w,h)};
const line=(x,a,b,c,d,col,w)=>{x.strokeStyle=col;x.lineWidth=w||1;x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()};
const circ=(x,a,b,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(a,b,r,0,TAU);x.fill()};
const oc=(x,a,b,r,col)=>{circ(x,a,b,r+1,OUT);circ(x,a,b,r,col)};
// ---------- sprites de caídos (entre finalizar e libertar) ----------
function strip(name,n,cw,ch,fn){const c=mk(cw*n,ch),x=c.getContext('2d');x.imageSmoothingEnabled=false;for(let i=0;i<n;i++){x.save();x.translate(i*cw,0);fn(x,i);x.restore()}const im=new Image();im.src=c.toDataURL();window.SPRS[name]={i:im,n,cw,ch}}
function dollDown(x,i){const br=Math.sin(i/3*TAU)*.6;
  x.fillStyle=OUT;x.beginPath();x.moveTo(6,22);x.lineTo(30,22);x.lineTo(36,14);x.lineTo(12,12);x.closePath();x.fill();
  x.fillStyle='#d8cfe6';x.beginPath();x.moveTo(8,21);x.lineTo(29,21);x.lineTo(34,15);x.lineTo(13,14);x.closePath();x.fill();
  x.fillStyle='#a898c0';x.beginPath();x.moveTo(20,21);x.lineTo(29,21);x.lineTo(34,15);x.lineTo(24,15);x.closePath();x.fill();
  line(x,32,21,40,22,OUT,3);line(x,32,21,40,22,'#d8cfe0',1);line(x,34,18,41,17,OUT,3);line(x,34,18,41,17,'#d8cfe0',1);
  line(x,14,16,8,22+br,OUT,3);line(x,14,16,8,22+br,'#e6dcc6',1);
  oc(x,8,16+br,7,'#eee6f4');x.fillStyle='#3a2e44';x.beginPath();x.arc(8,15+br,7,Math.PI,TAU);x.fill();oc(x,3,9+br,2.5,'#D27A8A');
  line(x,5,17+br,7,19+br,'#2a1c30');line(x,7,17+br,5,19+br,'#2a1c30');line(x,10,17+br,12,19+br,'#2a1c30');line(x,12,17+br,10,19+br,'#2a1c30');for(let k=0;k<3;k++)R(x,6+k*2,21+br,1,1,'#2a1c30')}
function ratDown(x,i){const br=Math.sin(i/3*TAU)*.5;
  x.fillStyle=OUT;x.beginPath();x.ellipse(22,13,15,7,0,0,TAU);x.fill();
  const bg=x.createLinearGradient(0,6,0,20);bg.addColorStop(0,'#5a3a8a');bg.addColorStop(1,'#a888d8');x.fillStyle=bg;x.beginPath();x.ellipse(22,13,14,6,0,0,TAU);x.fill();
  x.fillStyle='#d8c8f0';x.beginPath();x.ellipse(22,15,9,3,0,0,TAU);x.fill();
  for(const[ox,oy]of[[14,3],[19,2],[27,2],[32,3]]){line(x,ox,10,ox+(ox<22?-2:2),oy+br,OUT,3);line(x,ox,10,ox+(ox<22?-2:2),oy+br,'#7a5a9a',1)}
  x.fillStyle=OUT;x.beginPath();x.ellipse(37,14,7,5,.3,0,TAU);x.fill();x.fillStyle='#b898e8';x.beginPath();x.ellipse(37,14,6,4,.3,0,TAU);x.fill();
  line(x,38,11,41,15,'#2a1c30');line(x,41,11,38,15,'#2a1c30');
  x.strokeStyle=OUT;x.lineWidth=3;x.beginPath();x.moveTo(8,14);x.bezierCurveTo(4,18,2,16,1,19);x.stroke();x.strokeStyle='#6a4a8a';x.lineWidth=1;x.stroke()}
function mariDown(x,i){const br=Math.sin(i/3*TAU)*.6;
  x.strokeStyle='rgba(184,160,216,.6)';x.lineWidth=1;x.beginPath();x.moveTo(12,4);x.bezierCurveTo(8,10,18,14,14,26);x.stroke();x.beginPath();x.moveTo(30,6);x.bezierCurveTo(34,12,26,16,30,26);x.stroke();
  line(x,18,26,12,29,OUT,4);line(x,18,26,12,29,'#8a7aa8',2);line(x,12,29,22,30,OUT,4);line(x,12,29,22,30,'#a898c0',2);oc(x,12,29,2,'#e6dcc6');
  line(x,24,26,32,29,OUT,4);line(x,24,26,32,29,'#8a7aa8',2);line(x,32,29,38,26,OUT,4);line(x,32,29,38,26,'#a898c0',2);oc(x,32,29,2,'#e6dcc6');
  x.save();x.translate(21,22);x.rotate(.35);R(x,-7,-14,14,16,OUT);R(x,-6,-13,12,14,'#6a5a7a');R(x,-6,-13,12,3,'#8a7aa8');x.restore();
  line(x,15,14,8,22+br,OUT,4);line(x,15,14,8,22+br,'#a898c0',2);oc(x,8,22+br,2,'#e6dcc6');line(x,27,14,34,21+br,OUT,4);line(x,27,14,34,21+br,'#a898c0',2);oc(x,34,21+br,2,'#e6dcc6');
  oc(x,19,7+br,6,'#b8a8c8');line(x,16,3,19,7,'#3a2e44');line(x,16,6+br,19,9+br,'#2a1c30');line(x,19,6+br,16,9+br,'#2a1c30');R(x,21,7+br,3,2,'#2a1c30')}
for(const[n,f,cw,ch]of[['doll',dollDown,44,26],['rat',ratDown,46,22],['mari',mariDown,46,34]])strip(n+'_down',3,cw,ch,(x,i)=>f(x,i));
const TY={paper_doll:['doll',32],specter_rat:['rat',24],broken_marionette:['mari',40]};
window.drawDowned=function(ctx,cam,e,g){
  const t=performance.now()/1000,cx=e.x-cam.x+e.w/2,by=e.y-cam.y+e.h+1,m=TY[e.type],SP=window.SPRS,p=g.player;let w=24,h=16;
  if(m&&SP[m[0]+'_down']&&SP[m[0]+'_down'].i.naturalWidth&&SP[m[0]+'_idle']){const S=SP[m[0]+'_down'],I=SP[m[0]+'_idle'],sc=m[1]/I.ch,f=Math.floor(t*2.2+e.spawnX)%S.n;w=S.cw*sc;h=S.ch*sc;
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,cx-w/2,by-h,w,h);ctx.restore()}
  ctx.save();ctx.strokeStyle='rgba(216,170,230,.85)';ctx.lineWidth=1;for(let i=0;i<3;i++){const y=by-h*.3-i*h*.25;ctx.beginPath();ctx.moveTo(cx-w*.42,y+Math.sin(t*4+i)*.8);ctx.quadraticCurveTo(cx,y+3,cx+w*.42,y-1);ctx.stroke()}
  const gl=ctx.createRadialGradient(cx,by-h/2,1,cx,by-h/2,w*.7);gl.addColorStop(0,'rgba(216,160,230,.28)');gl.addColorStop(1,'rgba(216,160,230,0)');ctx.fillStyle=gl;ctx.fillRect(cx-w,by-h-8,w*2,h+16);
  const nr=Math.abs((e.x+e.w/2)-(p.x+14))<50&&Math.abs((e.y+e.h)-(p.y+34))<36;
  if(nr){const bw=118,x=cx-bw/2,y=by-h-24;ctx.fillStyle='rgba(8,5,14,.88)';ctx.fillRect(x,y,bw,18);ctx.strokeStyle='#A76E7F';ctx.strokeRect(x+.5,y+.5,bw-1,17);ctx.font='bold 9px Georgia';ctx.fillStyle='#E6DCC6';ctx.fillText('[E] Libertar',x+5,y+12);ctx.fillStyle='#e0607a';ctx.fillText('[F] Finalizar',x+60,y+12)}
  else{ctx.fillStyle='rgba(230,220,198,'+(.4+.3*Math.sin(t*4))+')';ctx.font='9px Georgia';ctx.fillText('…',cx-3,by-h-10)}
  ctx.restore()};
// ---------- efeitos de ataque e fios que espremem ----------
function atkFx(ctx,type,cx,cy,fc,t){const k=(performance.now()%360)/360;ctx.save();ctx.translate(cx,cy);ctx.scale(fc,1);
  if(type==='paper_doll'){ctx.strokeStyle='rgba(236,230,252,.92)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(8,-2,13,-1.15,1.05);ctx.stroke();ctx.strokeStyle='rgba(176,136,232,.65)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(8,-2,17,-1.05,.95);ctx.stroke();
    for(let i=0;i<5;i++){const a=-1+i*.5+k;ctx.fillStyle='#f4eefc';ctx.fillRect(8+Math.cos(a)*(15+k*5),-2+Math.sin(a)*(15+k*5),2,2)}}
  else if(type==='specter_rat'){for(let i=0;i<3;i++){ctx.strokeStyle='rgba(168,130,224,'+(.75-i*.18)+')';ctx.lineWidth=2-i*.4;ctx.beginPath();ctx.moveTo(-6,-5+i*5);ctx.lineTo(-22-k*8,-5+i*5);ctx.stroke()}
    ctx.fillStyle='#fff';ctx.fillRect(15,-1,1,6);ctx.fillRect(12,0,1,5);ctx.fillRect(18,0,1,5);ctx.fillStyle='rgba(255,120,160,.8)';ctx.fillRect(21,-1,3,3)}
  else{ctx.strokeStyle='rgba(224,140,190,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-4,24,-1.6,.95);ctx.stroke();ctx.strokeStyle='rgba(184,160,216,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,-4,28,-1.5,.9);ctx.stroke();
    ctx.strokeStyle='rgba(184,160,216,.5)';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(20,-26);ctx.lineTo(12+i*6,-4-i*3);ctx.stroke()}}
  ctx.restore()}
function bound(ctx,e,cam,t){const cx=e.x-cam.x+e.w/2,top=e.y-cam.y,h=e.h,sq=(Math.sin(t*5.5)+1)/2,now=performance.now(),fl=now-(e._sqFlash||0)<260;
  ctx.save();ctx.globalAlpha=Math.min(1,e.stunTimer/250);
  for(let i=0;i<4;i++){const ex=cx+(i-1.5)*7,w=Math.sin(t*5+i)*1.4;ctx.strokeStyle=i%2?'rgba(216,160,200,.8)':'rgba(230,220,198,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ex+w,top-58);ctx.lineTo(ex-w,top-28);ctx.lineTo(ex,top+2);ctx.stroke()}
  for(let i=0;i<6;i++){const y=top+3+i*(h-5)/5,hw=(e.w/2+4)-sq*4.5-(i%2),sw=Math.sin(t*6+i)*.8;ctx.strokeStyle=fl?'#ff6a8a':(i%2?'#E6DCC6':'#D27A8A');ctx.lineWidth=1+sq*1.3;
    ctx.beginPath();ctx.moveTo(cx-hw,y+sw);ctx.quadraticCurveTo(cx,y+5-sq*3,cx+hw,y-sw+1);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(cx-hw-1,y+sw-1,2,2);ctx.fillRect(cx+hw-1,y-sw,2,2)}
  const gl=ctx.createRadialGradient(cx,top+h/2,2,cx,top+h/2,e.w*(.7-sq*.15));gl.addColorStop(0,'rgba(216,140,200,'+(.12+sq*.14)+')');gl.addColorStop(1,'rgba(216,140,200,0)');ctx.fillStyle=gl;ctx.fillRect(cx-e.w,top-4,e.w*2,h+8);
  if(fl){const k=(now-e._sqFlash)/260;ctx.globalAlpha=1-k;ctx.fillStyle='#ff9ab0';ctx.font='bold 10px Georgia';ctx.fillText('-3',cx+9,top-6-k*12)}
  ctx.restore()}
const oED=Enemy.prototype.draw;
Enemy.prototype.draw=function(ctx,cam){
  oED.call(this,ctx,cam);if(!this.alive||this._sb||this._proj)return;
  const t=performance.now()/1000,cx=this.x-cam.x+this.w/2,cy=this.y-cam.y+this.h/2;
  if(this.atkPhase==='strike')atkFx(ctx,this.type,cx,cy,this.facing<0?-1:1,t);
  if(this.stunTimer>0)bound(ctx,this,cam,t)};
// dano dos fios: 3 por segundo enquanto o inimigo estiver preso (pogo ou dash de Ruptura)
const oEU=Enemy.prototype.update;
Enemy.prototype.update=function(dt,pl,grid){
  if(this.stunTimer>0&&this.alive&&!this._sb){const ms=dt>1?dt:dt*1000;this._sqT=(this._sqT===undefined?1000:this._sqT)+ms;
    if(this._sqT>=1000){this._sqT-=1000;this._sqFlash=performance.now();const r=hs(this.spawnX,this.spawnY),f=r>.74?.34:r<.2?.6:.5;this.takeDamage(3/f)}}
  else if(!(this.stunTimer>0))this._sqT=1000;
  return oEU.call(this,dt,pl,grid)};
// projétil novo
Projectile.prototype.draw=function(ctx,cam){const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y);
  const g=ctx.createRadialGradient(px,py,1,px,py,11);g.addColorStop(0,'rgba(255,200,230,.85)');g.addColorStop(.4,'rgba(150,100,220,.6)');g.addColorStop(1,'rgba(110,60,190,0)');ctx.fillStyle=g;ctx.fillRect(px-11,py-11,22,22);
  for(let k=1;k<=4;k++){ctx.globalAlpha=.5-k*.1;ctx.fillStyle='#a888d8';ctx.fillRect(px-this.vx*k*1.3-1,py-this.vy*k*1.3-1,3,3)}ctx.globalAlpha=1;
  oc(ctx,px,py,3,'#ffe3f0');R(ctx,px-1,py-1,2,2,'#D27A8A')};
// ---------- itens ----------
window.drawBook=function(c,px,py){R(c,px,py+1,10,12,OUT);R(c,px+1,py+2,8,10,'#4a3a6a');R(c,px+1,py+2,2,10,'#2a1c40');R(c,px+3,py+3,5,8,'#6a5a8a');R(c,px+7,py+4,1,7,'#e6dcc6');R(c,px+4,py+5,3,2,'#D27A8A');R(c,px+5,py+4,1,4,'#D27A8A');R(c,px+1,py+11,8,1,'#c8a860')};
window.manaDraw=function(c,x,y){const e=(typeof ENV!=='undefined')?ENV.heal:null,g=c.createRadialGradient(x,y,1,x,y,13);g.addColorStop(0,'rgba(120,150,255,.4)');g.addColorStop(1,'rgba(120,150,255,0)');c.fillStyle=g;c.fillRect(x-13,y-13,26,26);
  if(e&&e.ok&&e.i){c.save();if('filter' in c)c.filter='hue-rotate(215deg) saturate(1.1)';c.drawImage(e.i,x-8,y-10,16,19);c.restore()}else{R(c,x-2,y-8,4,3,'#C9B9B9');circ(c,x,y+1,5,'#5a7aee')}};
// ---------- passagens com altura coerente com o tamanho da Mika ----------
const _bw=buildWorld;
buildWorld=function(){const g=_bw(),zs=ZONES,inZ=(x,y)=>zs.some(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h);
  for(let x=1;x<WORLD_W-1;x++)for(let y=3;y<WORLD_H-2;y++){
    if(g[y][x]!==0||!(g[y+1][x]===1||g[y+1][x]===2)||!inZ(x,y))continue;
    let n=0,yy=y;while(yy>1&&g[yy][x]===0){n++;yy--}
    if(n===2&&g[yy][x]===1&&inZ(x,yy)){if(g[yy-1][x]===1)g[yy][x]=0;else if(g[yy-1][x]===0&&!inZ(x,yy-1)&&yy-1>=1){g[yy][x]=0;g[yy-1][x]=1}}}
  return g};
})();
