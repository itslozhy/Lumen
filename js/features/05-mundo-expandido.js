/* ===== MUNDO EXPANDIDO: Pináculo (cima), Abismo e Cofre (baixo), chama e selo ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,U=UPR*T;
for(const z of ZONES)z.y+=UPR;
ZONES.push(
 {id:'pinnacle',name:'Pináculo dos Sinos',x:56,y:2,w:48,h:22,theme:'tower',wall:'#2c2838',floor:'#403850',accent:'#e8d080',bg:'#0b0914'},
 {id:'abyss',name:'Abismo das Agulhas',x:104,y:88,w:48,h:24,theme:'stitch',wall:'#241828',floor:'#341e34',accent:'#D27A8A',bg:'#06030a'},
 {id:'vault',name:'Cofre das Costuras',x:152,y:100,w:20,h:12,theme:'ante',wall:'#2c2030',floor:'#3a2838',accent:'#e8d080',bg:'#0e0a12'});
const _bw=buildWorld;
buildWorld=function(){
  const old=_bw(),g=Array.from({length:WORLD_H},()=>new Uint8Array(WORLD_W));
  for(let y=0;y<old.length&&y+UPR<WORLD_H;y++)g[y+UPR].set(old[y]);
  const fill=(x,y,w,h,v)=>{for(let j=y;j<y+h&&j<WORLD_H;j++)for(let i=x;i<x+w&&i<WORLD_W;i++)g[j][i]=v};
  const hl=(x,y,w,v=1)=>fill(x,y,w,1,v),room=(x,y,w,h)=>{hl(x,y,w);hl(x,y+h-1,w);fill(x,y,1,h,1);fill(x+w-1,y,1,h,1)};
  const open=(x,y,h)=>{for(let j=0;j<h;j++)g[y+j][x]=0};
  room(56,2,48,22);open(74,22,7);open(75,22,7);
  [[78,19,4],[87,17,4],[96,14,4],[88,11,4],[79,8,4],[69,6,4],[60,4,6]].forEach(p=>hl(p[0],p[1],p[2],2));
  room(104,88,48,24);open(134,85,4);open(135,85,4);
  [[132,92,6],[122,95,5],[112,98,5],[108,102,4],[130,104,4],[138,101,4],[145,104,4]].forEach(p=>hl(p[0],p[1],p[2],2));
  room(151,100,22,12);
  for(let x=0;x<WORLD_W;x++){g[0][x]=1;g[WORLD_H-1][x]=1}
  return g;
};
const _bi=buildInteractives;
buildInteractives=function(){
  const a=_bi().filter(i=>i.id!=='boss_key');for(const i of a)i.y+=U;
  a.push(
   {type:'item',x:61*T,y:3*T,w:T,h:T,id:'flame',item:'flame',collected:false},
   {type:'item',x:98*T,y:12*T,w:T,h:T,id:'heal_pin',item:'heal',collected:false},
   {type:'rest',x:72*T,y:21*T,w:2*T,h:T,id:'rest_pin'},
   {type:'rest',x:146*T,y:109*T,w:2*T,h:T,id:'rest_abyss'},
   {type:'cabinet',x:113*T,y:96*T,w:2*T,h:2*T,id:'cab_abyss',looted:false},
   {type:'seal',x:148*T,y:106*T,w:3*T,h:5*T,id:'seal_vault',collected:false},
   {type:'memory',x:159*T,y:109*T,w:T,h:T,id:'mem_vault',collected:false},
   {type:'item',x:165*T,y:109*T,w:T,h:T,id:'boss_key',item:'boss_key',collected:false});
  return a;
};
const _be=buildEnemies;
buildEnemies=function(){
  const a=_be();for(const e of a)e.y+=U;
  [['broken_marionette',88,15],['paper_doll',70,4],
   ['broken_marionette',113,96],['specter_rat',123,93],['paper_doll',139,99],['specter_rat',131,102],['broken_marionette',146,108]].forEach(e=>a.push({type:e[0],x:e[1]*T,y:e[2]*T}));
  return a;
};
const _bm=buildMovers;
buildMovers=function(){const a=_bm();for(const m of a){m.y+=U;if(m.axis==='y'){m.min+=U;m.max+=U}}
  a.push({x:114*T,y:105*T,w:3*T,h:6,min:112*T,max:128*T,axis:'x',speed:.9,dir:1});return a};
const _bh=buildHazards;
buildHazards=function(){const a=_bh();for(const h of a)h.y+=U;
  for(let x=105;x<=142;x++)a.push({x:x*T,y:110*T+8,w:T,h:8});
  for(let x=60;x<=70;x++)a.push({x:x*T,y:22*T+8,w:T,h:8});for(let x=98;x<=102;x++)a.push({x:x*T,y:22*T+8,w:T,h:8});return a};
// apoiar itens/baús/etc. no chão
function snap(g,it){
  if(it.type==='painting'||it.type==='seal'||it._s)return;it._s=1;
  const tx=Math.floor((it.x+it.w/2)/T);let ty=Math.floor((it.y+it.h-1)/T);
  while(ty>0&&g[ty][tx]===1)ty--;
  let k=0;while(ty<WORLD_H-1&&g[ty][tx]===0&&k++<24)ty++;
  if(g[ty][tx]===1||g[ty][tx]===2)it.y=ty*T-it.h;
}
function burn(game,s,msg){
  for(let y=Math.floor(s.y/T);y<(s.y+s.h)/T;y++)game.grid[y][151]=0;
  s.collected=true;for(let i=0;i<5;i++)game.particles.emit(151*T+8,(s.y/T+i)*T,'ember',8);
  if(msg)game.showMsg('A chama consome os fios... a passagem se abre!');
}
const oU=G.update;
G.update=function(dt){oU.call(this,dt);if(this.interactives&&this.grid&&this.state!=='title')for(const it of this.interactives)snap(this.grid,it)};
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(this.input.interact()){const s=this.interactives.find(i=>i.type==='seal'&&!i.collected),hb=this.player.hitbox;
    if(s&&rectOverlap({x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24},s)){if(this.player.hasFlame)burn(this,s,true);else{this._sealSeen=true;this.showMsg('Fios selados por uma costura antiga... só o fogo os desfaz.')}return}}
  return oHI.call(this)};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);if(!this.interactives)return;const f=this.interactives.find(i=>i.id==='flame');if(f&&f.collected)this.player.hasFlame=true;
  const s=this.interactives.find(i=>i.type==='seal');if(s&&s.collected)burn(this,s,false)};
window.flameDraw=function(ctx,x,y,t){const f=Math.sin(t*9)*1.5;const g=ctx.createRadialGradient(x,y-6,1,x,y-6,22);g.addColorStop(0,'rgba(255,170,90,.5)');g.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g;ctx.fillRect(x-22,y-28,44,44);
  ctx.fillStyle='#3a2a28';ctx.fillRect(x-5,y-2,10,3);
  ctx.fillStyle='#ff7a3a';ctx.beginPath();ctx.moveTo(x,y-18+f);ctx.quadraticCurveTo(x+8,y-6,x+3,y-2);ctx.lineTo(x-3,y-2);ctx.quadraticCurveTo(x-8,y-6,x,y-18+f);ctx.fill();
  ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.moveTo(x,y-11);ctx.quadraticCurveTo(x+4,y-6,x+2,y-2);ctx.lineTo(x-2,y-2);ctx.quadraticCurveTo(x-4,y-6,x,y-11);ctx.fill()};
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);const c=this.camera,t=performance.now()/1000;
  for(const s of this.interactives){if(s.type!=='seal'||s.collected)continue;const x=s.x+s.w*0+3*T-T-c.x+0;const X=151*T-c.x,Y=Math.floor(s.y/T)*T-c.y,h=Math.floor(s.h/T)*T;
    if(X<-40||X>680)continue;ctx.fillStyle='#1a0c1e';ctx.fillRect(X,Y,T,h);
    ctx.strokeStyle='#D27A8A';ctx.lineWidth=1;for(let i=0;i<8;i++){ctx.globalAlpha=.55+.3*Math.sin(t*2+i);ctx.beginPath();ctx.moveTo(X,Y+i*h/8);ctx.lineTo(X+T,Y+(i+1.6)*h/8%h);ctx.stroke();ctx.beginPath();ctx.moveTo(X+T,Y+i*h/8);ctx.lineTo(X,Y+((i+2.3)*h/8)%h);ctx.stroke()}
    ctx.globalAlpha=1;ctx.fillStyle='rgba(210,122,138,.18)';ctx.beginPath();ctx.arc(X+8,Y+h/2,26+Math.sin(t*3)*3,0,TAU);ctx.fill()}
};

})();
