/* ===== MANCHAS PERSISTENTES, POGO DIAGONAL E ATORDOAMENTO ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,rnd=(a,b)=>a+Math.random()*(b-a);
const PAL={purple:['#7E35B8','#9a4ad8','#5a2590','#3b1a66'],black:['#0d0a14','#1a1420','#2a2038','#4a2a6a'],green:['#5fa84a','#3d7a38','#8fd070','#2a5a2a']};
const solid=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H||g[ty][tx]===1};
function splat(game,e){
  const g=game.grid,z=zoneAt(Math.floor(e.x/T),Math.floor(e.y/T)),gr=z&&(z.theme==='sewer'||z.theme==='garden');
  const pal=PAL[gr?'green':e.stainColor==='black'?'black':'purple'],cx=e.x+e.w/2,cy=e.y+e.h/2,D=game.decals||(game.decals=[]);
  const add=d=>{d.col=pal[Math.random()*pal.length|0];D.push(d);if(D.length>700)D.shift()};
  for(let i=0;i<44;i++){
    const a=Math.random()<.78?rnd(-Math.PI,0):rnd(0,Math.PI),s=rnd(1.5,6.5);
    let x=cx,y=cy,vx=Math.cos(a)*s,vy=Math.sin(a)*s;
    for(let k=0;k<140;k++){
      const ox=x,oy=y;x+=vx;y+=vy;vy+=.18;
      if(solid(g,x,y)){
        const hx=solid(g,x,oy),hy=solid(g,ox,y),r=rnd(1.5,5);
        if(hx&&!hy){add({k:'w',x:vx>0?Math.floor(x/T)*T:Math.floor(x/T)*T+T,y:oy,r,len:rnd(0,14)})}
        else if(vy<0&&hy){add({k:'c',x:ox,y:Math.floor(y/T)*T+T,r,len:rnd(0,8)})}
        else add({k:'f',x:ox,y:Math.floor(y/T)*T,r});
        break}}}
  // poça principal sob o inimigo
  let fy=e.y+e.h;for(let k=0;k<30&&!solid(g,cx,fy);k++)fy+=4;fy=Math.floor(fy/T)*T;
  for(let i=0;i<7;i++)add({k:'f',x:cx+rnd(-18,18),y:fy,r:rnd(3,8)});
  game.particles.emit(cx,cy,gr?'spore':'black',10);
}
const oU=G.update;
G.update=function(dt){
  oU.call(this,dt);
  if(this.enemies)for(const e of this.enemies){if(e._wa===undefined)e._wa=e.alive;if(e._wa&&!e.alive)splat(this,e);e._wa=e.alive}
};
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);
  const D=this.decals;if(!D)return;const c=this.camera;
  for(const d of D){const x=d.x-c.x,y=d.y-c.y;if(x<-30||x>670||y<-30||y>390)continue;
    ctx.fillStyle=d.col;ctx.globalAlpha=.88;ctx.beginPath();
    if(d.k==='f')ctx.ellipse(x,y-d.r*.3,d.r*1.7,d.r*.55,0,0,TAU);
    else if(d.k==='w'){ctx.ellipse(x,y,d.r*.5,d.r*1.1,0,0,TAU);ctx.fill();ctx.fillRect(x-.5,y,1.6,d.len);ctx.beginPath();ctx.arc(x,y+d.len,1.3,0,TAU)}
    else{ctx.ellipse(x,y+d.r*.3,d.r,d.r*.5,0,0,TAU);ctx.fill();ctx.fillRect(x-.5,y,1.4,d.len);ctx.beginPath();ctx.arc(x,y+d.len,1.2,0,TAU)}
    ctx.fill();ctx.globalAlpha=.4;ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x-d.r*.5,y-(d.k==='f'?d.r*.5:0),1,1)}
  ctx.globalAlpha=1;
};
// atordoamento: preso por linhas por 2s
const oEU=Enemy.prototype.update;
Enemy.prototype.update=function(dt,pl,grid){
  if(this.stunTimer>0&&this.alive){this.stunTimer-=dt*1000;const x=this.x;oEU.call(this,dt,pl,grid);this.x=x;this.vx=0;this.atkPhase='idle';this.atkTimer=0;this.atkLunge=0;this.freezeTimer=Math.max(this.freezeTimer,120);return}
  if(!this.alive)this.stunTimer=0;
  return oEU.call(this,dt,pl,grid);
};
})();
