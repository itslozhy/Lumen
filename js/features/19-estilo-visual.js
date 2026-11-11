/* ===== ESTILO VISUAL UNIFICADO: contorno único nas decorações, correção de cor global e grão ===== */
(function(){
const G=Game.prototype;let LAY=null,SIL=null,NOISE=null;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
window.decoBegin=function(ctx){
  if(typeof document.createElement!=='function'||!ctx.canvas)return ctx;
  const w=ctx.canvas.width||640,h=ctx.canvas.height||360;
  if(!LAY||LAY.width!==w){LAY=mk(w,h);SIL=mk(w,h)}
  const l=LAY.getContext('2d');l.setTransform(1,0,0,1,0,0);l.globalCompositeOperation='source-over';l.globalAlpha=1;l.clearRect(0,0,w,h);window.__deco=true;return l};
window.decoEnd=function(ctx){
  if(!window.__deco||!LAY)return;window.__deco=false;const w=LAY.width,h=LAY.height,s=SIL.getContext('2d');
  s.setTransform(1,0,0,1,0,0);s.globalCompositeOperation='source-over';s.clearRect(0,0,w,h);s.drawImage(LAY,0,0);
  s.globalCompositeOperation='source-in';s.fillStyle='#0b0912';s.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha=.85;for(const [x,y] of [[-1,0],[1,0],[0,-1],[0,1]])ctx.drawImage(SIL,x,y);ctx.globalAlpha=1;ctx.drawImage(LAY,0,0);ctx.restore()};
const oH=G.drawHUD;
G.drawHUD=function(ctx){
  // correção de cor única (violeta frio) e grão de papel sob o HUD
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.3;ctx.fillStyle='#d4c4e4';ctx.fillRect(0,0,640,360);ctx.restore();
  try{if(!NOISE&&typeof document.createElement==='function'){NOISE=mk(96,96);const n=NOISE.getContext('2d'),im=n.createImageData(96,96);for(let i=0;i<im.data.length;i+=4){const v=110+Math.random()*60|0;im.data[i]=v;im.data[i+1]=v-6;im.data[i+2]=v+8;im.data[i+3]=255}n.putImageData(im,0,0)}
    if(NOISE){ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=.1;const pt=ctx.createPattern(NOISE,'repeat');if(pt){ctx.translate((performance.now()/90|0)%48,(performance.now()/70|0)%48);ctx.fillStyle=pt;ctx.fillRect(-48,-48,740,460)}ctx.restore()}}catch(e){}
  oH.call(this,ctx)};
})();
