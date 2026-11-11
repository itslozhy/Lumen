/* ===== HUD E TELA INICIAL REFEITOS DO ZERO (100% procedurais) + SUJEIRA POR TIPO/TAMANHO ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,MAXD=40;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const poly=(c,pts,fill,stroke)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}};
const star=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,k=i%2?r*.28:r;c.lineTo(x+Math.cos(a)*k,y+Math.sin(a)*k*1.4)}c.fill()};
// pontos de sujeira por tipo e tamanho do inimigo
window.dirtPts=function(e){const W={paper_doll:1,specter_rat:.7,broken_marionette:1.4}[e.type]||1,r=hs(e.spawnX,e.spawnY),S=r>.74?1.6:r<.2?.7:1;
  return 3*W*S*Math.max(.8,Math.min(1.5,(e.h||24)/24))};
// ---------- HUD ----------
const icons={
 potion(c,x,y){R(c,x-2,y-7,4,3,'#C9B9B9');c.fillStyle='#D27A8A';c.beginPath();c.ellipse(x,y+1,5,5.5,0,0,TAU);c.fill();R(c,x-3,y-3,2,4,'rgba(255,255,255,.45)')},
 mana(c,x,y){R(c,x-2,y-7,4,3,'#C9B9B9');c.fillStyle='#5a7aee';c.beginPath();c.ellipse(x,y+1,5,5.5,0,0,TAU);c.fill();R(c,x-3,y-3,2,4,'rgba(255,255,255,.45)')},
 stitch(c,x,y){star(c,x,y,7,'#9a6ae8');R(c,x-1,y-1,2,2,'#fff')},
 key(c,x,y){c.strokeStyle='#e8d080';c.lineWidth=2;c.beginPath();c.arc(x-3,y-3,3,0,TAU);c.stroke();c.fillStyle='#e8d080';c.fillRect(x-1,y-1,2,9);c.fillRect(x-1,y+5,4,2);c.fillRect(x-1,y+2,3,1)},
 flame(c,x,y,t){window.flameDraw(c,x,y+6,t)}};
// ---------- TELA INICIAL ----------
window.HUDICONS=icons;
window.hudDraw=function(c,g){window.COL.hud(c,g)};
function spire(c,x,b,w,h,col,glow,t,i){
  c.fillStyle=col;c.fillRect(x,b-h,w,h);poly(c,[[x-2,b-h],[x+w/2,b-h-w*1.7],[x+w+2,b-h]],col);
  c.fillRect(x-3,b-h*.6,3,h*.6);c.fillRect(x+w,b-h*.7,3,h*.7);poly(c,[[x-4,b-h*.6],[x-1.5,b-h*.6-9],[x+1,b-h*.6]],col);poly(c,[[x+w-1,b-h*.7],[x+w+1.5,b-h*.7-9],[x+w+4,b-h*.7]],col);
  if(glow)for(let k=0;k<3;k++){if(hs(i,k+7)>.35){c.fillStyle='rgba(255,150,200,'+(.55+.3*Math.sin(t*2+i*3+k))+')';c.beginPath();c.moveTo(x+w/2-2,b-h+10+k*14);c.lineTo(x+w/2,b-h+5+k*14);c.lineTo(x+w/2+2,b-h+10+k*14);c.lineTo(x+w/2+2,b-h+16+k*14);c.lineTo(x+w/2-2,b-h+16+k*14);c.fill()}}}
G.drawTitle=function(c){
  const t=performance.now()/1000;
  // céu
  const sky=c.createLinearGradient(0,0,0,360);sky.addColorStop(0,'#0c0818');sky.addColorStop(.55,'#3a1a4a');sky.addColorStop(1,'#a04a86');c.fillStyle=sky;c.fillRect(0,0,640,360);
  for(let i=0;i<70;i++){c.globalAlpha=.25+.7*Math.abs(Math.sin(t*1.4+i*2.3));R(c,hs(i,1)*640,hs(i,2)*220,1,1,'#E6DCC6')}c.globalAlpha=1;
  // lua
  const mx=470,my=92,mg=c.createRadialGradient(mx,my,10,mx,my,130);mg.addColorStop(0,'rgba(255,170,215,.55)');mg.addColorStop(1,'rgba(255,170,215,0)');c.fillStyle=mg;c.fillRect(mx-130,my-130,260,260);
  c.fillStyle='#f0a8c8';c.beginPath();c.arc(mx,my,44,0,TAU);c.fill();c.fillStyle='rgba(150,70,130,.35)';for(const [a,b,r] of [[-14,-10,9],[12,12,7],[-4,16,5],[16,-14,4]]){c.beginPath();c.arc(mx+a,my+b,r,0,TAU);c.fill()}
  // nuvens
  for(let i=0;i<4;i++){const x=((t*6+i*190)%820)-90,y=40+i*38;c.fillStyle='rgba(120,60,130,.22)';c.beginPath();c.ellipse(x,y,70,7,0,0,TAU);c.fill()}
  // castelos (3 camadas)
  const layers=[['#3a1a4a',.35,.55,1],['#241030',.55,.8,1],['#12081c',1,1.05,0]];
  layers.forEach((L,li)=>{for(let i=0;i<9;i++){const w=18+hs(i,li+3)*22,h=(60+hs(i,li+5)*120)*L[2],x=250+i*46+li*14+Math.sin(t*.15+li)*2*li;spire(c,x,330,w,h,L[0],L[3]&&i%2===0,t,i+li*11)}});
  // arcos e ponte
  c.fillStyle='#0c0614';c.fillRect(250,292,400,50);c.fillStyle='#07040c';for(let i=0;i<8;i++){c.beginPath();c.arc(285+i*50,342,22,Math.PI,0);c.fill()}
  c.fillStyle='#12081c';for(let i=0;i<24;i++)c.fillRect(250+i*17,282,2,12);R(c,250,292,400,2,'#241030');
  // morcegos
  for(let i=0;i<3;i++){const x=(t*28*(1+i*.3)+i*230)%700-30,y=70+i*38+Math.sin(t*2+i)*10,f=Math.sin(t*14+i)*4;c.fillStyle='#0c0614';poly(c,[[x,y],[x-8,y-4+f],[x-4,y+1],[x,y+2],[x+4,y+1],[x+8,y-4+f]],'#0c0614')}
  // jardim em primeiro plano
  const fg=c.createLinearGradient(0,300,0,360);fg.addColorStop(0,'rgba(10,6,18,0)');fg.addColorStop(1,'rgba(8,4,14,.95)');c.fillStyle=fg;c.fillRect(0,300,640,60);
  for(let i=0;i<30;i++){const x=hs(i,9)*640,s=Math.sin(t*1.5+i)*1.5,h=10+hs(i,10)*22;c.strokeStyle='#1d3a28';c.lineWidth=1.2;c.beginPath();c.moveTo(x,360);c.quadraticCurveTo(x+s*2,360-h/2,x+s,360-h);c.stroke();
    if(i%2===0){c.fillStyle=i%4===0?'#D27A8A':'#A76E7F';c.beginPath();c.arc(x+s,360-h,2.6,0,TAU);c.fill();R(c,x+s-1,360-h-1,2,2,'#ffd0e0')}}
  window.COL.title(this,c,t);
};
})();
