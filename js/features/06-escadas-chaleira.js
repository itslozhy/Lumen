/* ===== ESCADAS ESCALÁVEIS, SALAS SUPERIORES E A CHALEIRA FUGITIVA ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
ZONES.push(
 {id:'clock_hall',name:'Corredor dos Relógios',x:36,y:2,w:20,h:7,theme:'tower',wall:'#2a2634',floor:'#3c3448',accent:'#e8d080',bg:'#0b0914'},
 {id:'suspended_lib',name:'Biblioteca Suspensa',x:20,y:9,w:36,h:15,theme:'library',wall:'#252038',floor:'#2e2638',accent:'#6B8CA5',bg:'#0b0a16'},
 {id:'kitchen',name:'Cozinha Esquecida',x:3,y:9,w:17,h:15,theme:'home',wall:'#2e2428',floor:'#3e2c2a',accent:'#D27A8A',bg:'#120d12'});
const LADS=[{tx:23,y0:18,y1:22},{tx:39,y0:8,y1:20},{tx:10,y0:15,y1:22}];
(window.LAD=window.LAD||[]).push(...LADS);
const _bw=buildWorld;
buildWorld=function(){
  const g=_bw();
  const fill=(x,y,w,h,v)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=v};
  const hl=(x,y,w,v=1)=>fill(x,y,w,1,v),room=(x,y,w,h)=>{hl(x,y,w);hl(x,y+h-1,w);fill(x,y,1,h,1);fill(x+w-1,y,1,h,1)};
  const open=(x,y,h)=>{for(let j=0;j<h;j++)g[y+j][x]=0};
  room(36,2,21,7);open(56,6,2);hl(57,8,4,2);[[74,7,3],[66,7,3],[62,8,3],[53,5,2]].forEach(p=>hl(p[0],p[1],p[2],2));
  [[50,6,3],[45,5,3],[40,6,3]].forEach(p=>hl(p[0],p[1],p[2],2));
  room(20,9,37,15);open(38,8,3);open(39,8,3);
  [[36,14,5],[29,16,4],[24,18,3],[46,16,5],[50,12,4]].forEach(p=>hl(p[0],p[1],p[2],2));
  room(3,9,18,15);open(20,21,2);
  hl(4,15,7,2);hl(13,17,5,2);
  return g;
};
const _bi=buildInteractives;
buildInteractives=function(){
  const a=_bi().filter(i=>i.id!=='flame');
  a.push({type:'kettle',x:12*T,y:22*T,w:T,h:T,id:'kettle',collected:false,state:'idle',vx:0,vy:0},
   {type:'rest',x:54*T,y:7*T,w:2*T,h:T,id:'rest_w1'},{type:'rest',x:5*T,y:22*T,w:2*T,h:T,id:'rest_w3'},
   {type:'cabinet',x:6*T,y:13*T,w:2*T,h:2*T,id:'cab_w3',looted:false},{type:'memory',x:8*T,y:14*T,w:T,h:T,id:'mem_kitchen',collected:false},
   {type:'cabinet',x:51*T,y:10*T,w:2*T,h:2*T,id:'cab_w2',looted:false},{type:'item',x:47*T,y:14*T,w:T,h:T,id:'heal_w2',item:'heal',collected:false});
  return a};
const _be=buildEnemies;
buildEnemies=function(){const a=_be();
  [['paper_doll',45,3],['broken_marionette',47,13],['specter_rat',30,13],['paper_doll',25,15],['paper_doll',53,10]].forEach(e=>a.push({type:e[0],x:e[1]*T,y:e[2]*T}));return a};
const _bh=buildHazards;
buildHazards=function(){const a=_bh();
  for(let x=41;x<=52;x++)a.push({x:x*T,y:7*T+8,w:T,h:8});for(let x=24;x<=55;x++)a.push({x:x*T,y:22*T+8,w:T,h:8});return a};
// escalada
const solid=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H||g[ty][tx]===1};
const oU=G.update;
G.update=function(dt){
  const p=this.player,inp=this.input;
  if(!p||this.state!=='playing'||p.dead)return oU.call(this,dt);
  const cx=p.x+14,bot=p.y+34,l=(window.LAD||[]).find(l=>Math.abs(cx-(l.tx*T+8))<9&&bot>=l.y0*T&&bot<=(l.y1+1)*T+4);
  if(!l)p._cl=false;else if(!p._cl&&(inp.up()||inp.down())&&p.dashTimer<=0)p._cl=true;
  const exit=inp.wasPressed('Space')||inp.wasPressed('KeyZ');
  if(p._cl&&exit)p._cl=false;
  if(!p._cl)return oU.call(this,dt);
  const y0=p.y;oU.call(this,dt);
  const dy=(inp.up()?-1:inp.down()?1:0)*2.2;let ny=y0+dy;
  const nb=ny+34;if(nb<l.y0*T)ny=l.y0*T-34;if(nb>(l.y1+1)*T)ny=(l.y1+1)*T-34;
  const px=l.tx*T+8-14;
  if(solid(this.grid,px+6,ny+8)||solid(this.grid,px+21,ny+8)||solid(this.grid,px+14,ny+2))ny=y0;
  p.x=px;p.y=ny;p.vy=0;p.vx=0;p.anim='wall';p.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS;p.onGround=false;
};
// chaleira fugitiva
function ground(g,x,y){const tx=Math.floor(x/T),ty=Math.floor(y/T);return ty>=0&&ty<WORLD_H&&(g[ty][tx]===1||g[ty][tx]===2)}
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(this.input.interact()){const k=this.interactives.find(i=>i.type==='kettle'&&!i.collected),hb=this.player.hitbox;
    if(k&&rectOverlap({x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24},k)){
      if(k.state==='idle'){k.state='run';k.vy=-6;this.showMsg('A chaleira dá um salto e foge pela sala!')}
      else this.showMsg(this.player.hasStitch?'Ela é rápida... só um dash a alcançaria!':'Rápida demais. Só um impulso a alcançaria...');
      return}}
  return oHI.call(this)};
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);
  const c=this.camera,t=performance.now()/1000;
  const st=ENV.stairs;if(st&&st.ok)for(const l of LADS){const x=l.tx*T-c.x+1;if(x<-20||x>660)continue;for(let y=l.y0*T;y<(l.y1+1)*T;y+=19)ctx.drawImage(st.i,x,y-c.y,14,19)}
  const p=this.player,g=this.grid;
  for(const k of this.interactives){if(k.type!=='kettle'||k.collected)continue;
    if(k.state==='run'&&this.state==='playing'){
      const f=1,ccx=k.x+8,dx=ccx-(p.x+14),dir=dx>=0?1:-1;let on=ground(g,ccx,k.y+k.h+1)&&k.vy>=0;
      if(on){k.vx=dir*3.3;const nx=k.x+k.vx,ex=nx+(dir>0?k.w:0);
        const wall=solid(g,ex,k.y+8)||nx<4*T||nx>19*T-k.w;
        if(wall){k.vx=0;if(Math.abs(dx)<90){k.vy=-7.4;k.vx=-dir*4.6}}
        else if(Math.abs(dx)<14&&p.dashTimer<=0){k.vy=-5.2}}
      k.vy=Math.min(11,k.vy+.42);const nx=k.x+k.vx;
      if(!solid(g,nx+(k.vx>0?k.w:0),k.y+8)&&nx>=4*T&&nx<=19*T-k.w)k.x=nx;
      k.y+=k.vy;if(k.vy>=0&&ground(g,k.x+8,k.y+k.h)){k.y=Math.floor((k.y+k.h)/T)*T-k.h;k.vy=0}
      if(p.dashTimer>0){const hb=p.hitbox;if(rectOverlap({x:hb.x-8,y:hb.y-6,w:hb.w+16,h:hb.h+12},{x:k.x,y:k.y,w:k.w,h:k.h})){
        k.collected=true;p.hasFlame=true;this.showMsg('Você alcançou a chaleira! A Chama de Lúmen é sua.');for(let i=0;i<6;i++)this.particles.emit(k.x+8,k.y+6,'ember',8);continue}}}
    const x=k.x-c.x,y=k.y-c.y,run=k.state==='run',fl=k.vx<0;
    ctx.save();ctx.translate(x+8,y+8);if(fl)ctx.scale(-1,1);
    ctx.fillStyle='#2a1a22';ctx.beginPath();ctx.ellipse(0,9,8,2,0,0,TAU);ctx.fill();
    if(run){const s=Math.sin(t*28)*3;ctx.strokeStyle='#C9B9B9';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-3,5);ctx.lineTo(-3+s,9);ctx.moveTo(3,5);ctx.lineTo(3-s,9);ctx.stroke()}
    ctx.fillStyle='#7a7088';ctx.beginPath();ctx.ellipse(0,1,7,6,0,0,TAU);ctx.fill();ctx.fillStyle='#b8aecb';ctx.beginPath();ctx.ellipse(-2,-1,3,2,0,0,TAU);ctx.fill();
    ctx.fillStyle='#4a3a5a';ctx.fillRect(-4,-6,8,2);ctx.fillRect(-1,-8,2,2);
    ctx.fillStyle='#7a7088';ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(11,-5);ctx.lineTo(12,-4);ctx.lineTo(7,2);ctx.fill();
    ctx.strokeStyle='#C9B9B9';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-7,0,4,-1.2,1.2);ctx.stroke();
    ctx.restore();
    window.flameDraw(ctx,x+(fl?4:12)+(fl?-4:0)*0,y-2,t);
    ctx.fillStyle='rgba(230,220,200,.35)';for(let i=0;i<3;i++){const a=(t*1.5+i/3)%1;ctx.beginPath();ctx.arc(x+8+Math.sin(t*3+i)*3,y-8-a*14,1.5+a*2,0,TAU);ctx.fill()}
  }
};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);const k=this.interactives&&this.interactives.find(i=>i.id==='kettle');if(k&&k.collected)this.player.hasFlame=true};
})();
