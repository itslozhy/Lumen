/* ===== CASA DE MADEIRA + CAMPO DE VISÃO ESCURO COM NEBLINA ===== */
(function(){
const TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const hxa=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const BASE={},CACHE={};
function base(z){const id=z?z.id:'_';if(BASE[id])return BASE[id];const w=z?hxa(z.wall):[40,34,40],b=[62,42,34];return BASE[id]=b.map((v,i)=>v*.72+w[i]*.28)}
function sh(z,f){const id=(z?z.id:'_')+':'+Math.round(f*40);if(CACHE[id])return CACHE[id];const b=base(z);return CACHE[id]='rgb('+b.map(v=>Math.max(0,Math.min(255,v*f))|0)+')'}
// parede de fundo: tábuas verticais, vigas e rodapé
// massa sólida: tábuas horizontais de madeira velha
// superfície: tábuas do assoalho
// campo de visão escuro com neblina e luzes
let DK=null;
window.fovDraw=function(ctx,g){
  const p=g.player,cam=g.camera,t=performance.now()/1000,W=640,H=360;
  const px=p.x-cam.x+14,py=p.y-cam.y+18,r=1+.02*Math.sin(t*3);
  if(typeof document.createElement==='function'){
    if(!DK){DK=document.createElement('canvas');DK.width=W;DK.height=H}
    const d=DK.getContext('2d');d.setTransform(1,0,0,1,0,0);d.globalCompositeOperation='source-over';d.clearRect(0,0,W,H);d.fillStyle='rgba(4,2,9,'+(window.FOVD||.96)+')';d.fillRect(0,0,W,H);
    d.globalCompositeOperation='destination-out';
    const hole=(x,y,rad,a)=>{if(!(x===px&&y===py)&&Math.hypot(x-px,y-py)>110)return;const gr=d.createRadialGradient(x,y,rad*.15,x,y,rad);gr.addColorStop(0,'rgba(0,0,0,'+a+')');gr.addColorStop(.55,'rgba(0,0,0,'+a*.55+')');gr.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=gr;d.fillRect(x-rad,y-rad,rad*2,rad*2)};
    hole(px,py,165*r*(window.FOVK||1),1);for(const q of (window.SL||[]))hole(q[0],q[1],38,.9*q[2]);for(const w of (window.WL||[]))hole(w[0],w[1]+10,75,.8);
    for(const it of g.interactives){const x=it.x-cam.x+it.w/2,y=it.y-cam.y+it.h/2;if(x<-80||x>W+80||y<-80||y>H+80)continue;
      if(it.type==='rest')hole(x,y-8,70,.9);else if((it.type==='kettle'&&!it.collected)||(it.type==='memory'&&!it.collected)||it.type==='ability')hole(x,y,46,.7);else if(it.type==='npc'||it.type==='book')hole(x,y,34,.55);else if(it.type==='painting')hole(x,y,52,.7);else if(it.type==='tv'||it.type==='mirror'||it.type==='photo'||it.type==='jar'||it.type==='term')hole(x,y,44,.75)}
    d.globalCompositeOperation='source-over';ctx.drawImage(DK,0,0);
  }else{const gr=ctx.createRadialGradient(px,py,40,px,py,200);gr.addColorStop(0,'rgba(4,2,9,0)');gr.addColorStop(1,'rgba(4,2,9,.95)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
  // neblina nas bordas
  ctx.fillStyle='rgba(110,90,140,'+(window.FOVM||.09)+')';for(let i=0;i<5;i++){const x=((t*9+i*170)%780)-70,y=(i%2?30:H-50)+Math.sin(t*.7+i)*14;ctx.beginPath();ctx.ellipse(x,y,110,22,0,0,TAU);ctx.fill()}
  const fg=ctx.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.62);fg.addColorStop(0,'rgba(60,40,80,0)');fg.addColorStop(1,'rgba(60,40,80,.22)');ctx.fillStyle=fg;ctx.fillRect(0,0,W,H);
};
})();
