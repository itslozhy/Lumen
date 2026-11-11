/* ===== LÍQUIDO NA SPRITE, ALMAS VERDES, QUADROS/PLATAFORMAS/MAPA COERENTES ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,E=k=>ENV[k]&&ENV[k].ok?ENV[k]:null;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const rgb=h=>{const v=[1,3,5].map(i=>parseInt(h.substr(i,2),16));return v};
const rgba=(h,a)=>'rgba('+rgb(h)+','+a+')';
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
// ---- líquido escorrendo na sprite (máscara pela silhueta) ----
let OFF=null,LQ=null;
const oPD=Player.prototype.draw;
Player.prototype.draw=function(ctx,cam){
  oPD.call(this,ctx,cam);
  const d=this.dirt||0;if(d<=0||!this._dc||!this._dc.length||typeof document.createElement!=='function')return;
  if(!OFF){OFF=mk(100,100);LQ=mk(100,100)}
  const o=OFF.getContext('2d'),q=LQ.getContext('2d'),t=performance.now()/1000;
  o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,100,100);o.globalCompositeOperation='source-over';o.globalAlpha=1;o.filter='none';
  oPD.call(this,o,{x:Math.floor(this.x)-30,y:Math.floor(this.y)-30});
  q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,100,100);q.globalAlpha=1;
  const c1=this._dc[this._dc.length-1],c2=this._dc[0],feet=65,soak=3+d*36;
  const g=q.createLinearGradient(0,feet-soak-4,0,feet);g.addColorStop(0,rgba(c1,0));g.addColorStop(.35,rgba(c1,.75));g.addColorStop(1,rgba(c1,.95));
  q.fillStyle=g;q.beginPath();q.moveTo(20,feet);
  for(let x=20;x<=70;x+=2)q.lineTo(x,feet-soak+Math.sin(x*.55+t*.8)*2.2+hs(x,3)*3);
  q.lineTo(70,feet);q.fill();
  for(let i=0;i<Math.floor(d*7);i++){q.save();q.translate(34+hs(i,1)*22,feet-soak-3-hs(i,2)*22*d);q.rotate((hs(i,3)-.5)*1.3);
    q.fillStyle=rgba(c2,.6);q.beginPath();q.ellipse(0,0,3+hs(i,4)*7*d,1+hs(i,5)*2.5,0,0,TAU);q.fill();q.restore()}
  q.lineCap='round';
  for(let i=0;i<3+Math.floor(d*9);i++){const x=33+hs(i,4)*24,y0=Math.min(feet-4,feet-soak+(hs(i,5)-.6)*12),len=3+d*14*hs(i,6)+Math.sin(t*1.2+i)*1.4,lw=1+hs(i,7)*1.3;
    q.strokeStyle=rgba(c1,.9);q.lineWidth=lw;q.beginPath();q.moveTo(x,y0);q.lineTo(x,y0+len);q.stroke();
    q.fillStyle=rgba(c1,.95);q.beginPath();q.arc(x,y0+len,lw*.9,0,TAU);q.fill();
    q.strokeStyle='rgba(255,255,255,.3)';q.lineWidth=.6;q.beginPath();q.moveTo(x-.4,y0);q.lineTo(x-.4,y0+len*.8);q.stroke()}
  o.globalCompositeOperation='source-in';o.globalAlpha=.9;o.drawImage(LQ,0,0);o.globalAlpha=1;o.globalCompositeOperation='source-over';
  ctx.drawImage(OFF,Math.floor(this.x-cam.x)-30,Math.floor(this.y-cam.y)-30);
  if(d>.4){ctx.fillStyle=rgba(c1,.8);const px=Math.floor(this.x-cam.x)+14,py=Math.floor(this.y-cam.y);for(let i=0;i<2;i++)ctx.fillRect(px-5+i*9,py+34+((t*18+i*7)%9),1.5,2.5)}
};
// ---- almas verdes ----
let SP=null;
function glowG(ctx,x,y,r,col){const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(40,200,120,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)}
window.wisp=function(ctx,x,y,t,s){const b=Math.sin(t*2.2+s)*2.5;y+=b;glowG(ctx,x,y,14,'rgba(110,255,180,.4)');
  ctx.fillStyle='rgba(150,255,200,.85)';ctx.beginPath();ctx.moveTo(x,y-6);ctx.quadraticCurveTo(x+4,y,x+2,y+3);ctx.quadraticCurveTo(x,y+5,x-2,y+3);ctx.quadraticCurveTo(x-4,y,x,y-6);ctx.fill();
  ctx.strokeStyle='rgba(120,255,190,.4)';ctx.beginPath();ctx.moveTo(x,y+4);ctx.quadraticCurveTo(x+4*Math.sin(t*3+s),y+9,x-2,y+13);ctx.stroke()};
window.spirit=function(ctx,x,y,t,it){
  const e=E('npc');
  if(!SP&&e){SP=mk(e.w,e.h);const s=SP.getContext('2d');s.drawImage(e.i,0,0);s.globalCompositeOperation='source-atop';
    const g=s.createLinearGradient(0,0,0,e.h);g.addColorStop(0,'rgba(190,255,220,.9)');g.addColorStop(.55,'rgba(70,210,140,.75)');g.addColorStop(1,'rgba(30,150,95,.05)');s.fillStyle=g;s.fillRect(0,0,e.w,e.h)}
  const b=Math.sin(t*2+it.x)*2.5,cx=x+12;glowG(ctx,cx,y+14+b,32,'rgba(90,240,160,.28)');
  ctx.strokeStyle='rgba(120,255,190,.35)';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-5+i*5,y+28+b);ctx.quadraticCurveTo(cx-5+i*5+Math.sin(t*3+i)*4,y+34+b,cx-5+i*5,y+40+b);ctx.stroke()}
  if(SP){ctx.save();ctx.globalAlpha=.78+.15*Math.sin(t*5+it.x);ctx.drawImage(SP,x+1,y+1+b,22,32);ctx.restore()}
  ctx.fillStyle='rgba(190,255,220,.85)';for(let i=0;i<3;i++){const a=t*1.4+i*2.1;ctx.fillRect(cx+Math.cos(a)*15,y+12+b+Math.sin(a)*10,2,2)}
};
G.drawDialog=function(ctx){window.COL.dialog(this,ctx)};
G.drawMap=function(ctx){window.COL.map(this,ctx)};
// ---- quadros, plataformas ----
// ---- mapa gótico ----
// almas sobre livros e quadros que "falam"
const oW=G.drawWorld;
G.drawWorld=function(ctx){oW.call(this,ctx);const c=this.camera,t=performance.now()/1000;
  for(const it of this.interactives){if(it.type!=='book'&&it.type!=='painting')continue;const x=it.x-c.x+it.w/2,y=it.y-c.y-12;if(x<-20||x>660)continue;window.wisp(ctx,x,y,t,it.x)}};
})();
