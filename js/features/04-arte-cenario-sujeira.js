/* ===== ARTE DO CENÁRIO (imagens), SUJEIRA NA MIKA, INIMIGOS MAIS RESISTENTES ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,E=k=>ENV[k]&&ENV[k].ok?ENV[k]:null;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
function D(ctx,k,x,y,w,h,flip,al){const e=E(k);if(!e)return false;ctx.save();if(al!=null)ctx.globalAlpha=al;ctx.imageSmoothingEnabled=false;
  if(flip){ctx.translate(x+w,0);ctx.scale(-1,1);x=0}ctx.drawImage(e.i,x,y,w,h);ctx.restore();return true}
const glow=(ctx,x,y,r,c)=>{const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r)};
const H=new Set(['rest','memory','item','ability','cabinet','npc','door_lock']);
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  const its=this.interactives.filter(i=>H.has(i.type));for(const i of its){i._t=i.type;i.type='_'}
  oW.call(this,ctx);
  for(const i of its)i.type=i._t;
  const c=this.camera,t=(this.time||0);
  for(const m of this.movers){const e=E('floor');if(!e)break;const px=Math.floor(m.x-c.x),py=Math.floor(m.y-c.y);if(px<-80||px>680)continue;
    ctx.save();ctx.globalCompositeOperation='lighten';for(let i=0;i<m.w;i+=16)ctx.drawImage(e.i,(i/16%5)*16,0,Math.min(16,m.w-i),18,px+i,py-2,Math.min(16,m.w-i),18);ctx.restore()}
  for(const it of its){const x=Math.floor(it.x-c.x),y=Math.floor(it.y-c.y),b=Math.sin(t*3+it.x)*2,ty=it._t;if(x<-60||x>700)continue;
    if(ty==='rest'){glow(ctx,x+it.w/2,y-6,26+Math.sin(t*2)*2,'rgba(210,122,138,.22)');D(ctx,'rest',x+it.w/2-15,y+it.h-30,30,30)}
    else if(ty==='cabinet'){const h=it.h,w=h*.95;D(ctx,'chest',x+(it.w-w)/2,y,w,h,false,it.looted?.45:1)}
    else if(ty==='door_lock'){if(it.locked){D(ctx,'door',x,y,it.w,it.h);ctx.strokeStyle='#e8d080';ctx.globalAlpha=.4+.3*Math.sin(t*3);ctx.strokeRect(x-1,y-1,it.w+2,it.h+2);ctx.globalAlpha=1}else{D(ctx,'door',x,y,it.w,it.h,false,.35);glow(ctx,x+it.w/2,y+it.h/2,it.h*.7,'rgba(126,53,184,.3)')}}
    else if(ty==='npc'){window.spirit(ctx,x,y,t,it)}
    else if(it.collected)continue;
    else if(ty==='memory'){glow(ctx,x+5,y+5+b,20,'rgba(154,184,255,.35)');D(ctx,'fragment',x-6,y-2+b,24,18)}
    else if(ty==='ability'){glow(ctx,x+12,y+12+b,26,'rgba(126,53,184,.5)');D(ctx,'obj',x-2,y-2+b,28,28)}
    else if(ty==='item'){if(it.item==='boss_key'){glow(ctx,x+8,y+8+b,18,'rgba(232,208,128,.4)');D(ctx,'key',x+1,y-4+b,14,22)}
      else if(it.item==='flame'){window.flameDraw(ctx,x+8,y+14,t)}else if(it.item==='heal'){glow(ctx,x+7,y+8+b,14,'rgba(210,122,138,.3)');D(ctx,'heal',x-1,y-2+b,16,19)}
      else{glow(ctx,x+8,y+8+b,14,'rgba(107,140,165,.3)');window.manaDraw(ctx,x+8,y+8+b)}}
  }
};
// dificuldade: inimigos aguentam mais golpes
const oT=Enemy.prototype.takeDamage;
Enemy.prototype.takeDamage=function(a){const r=hs(this.spawnX,this.spawnY);return oT.call(this,a*(r>.74?.34:r<.2?.6:.5))};
// sujeira acumulada na Mika
const oU=G.update;
G.update=function(dt){
  oU.call(this,dt);const p=this.player,D2=this.decals;if(!p||this.state==='title')return;
  p.dirt=p.dirt||0;p._dc=p._dc||[];
  if(D2&&!p.dead){const cx=p.x+14,fy=p.y+34;let n=0,col=null;
    for(let i=D2.length-1;i>=0&&n<8;i--){const d=D2[i];if(d.nd)continue;
      const ok=d.k==='f'?Math.abs(d.y-fy)<7&&Math.abs(d.x-cx)<d.r*1.7+9:d.k==='w'?Math.abs(d.x-cx)<15&&d.y>p.y+6&&d.y<fy:false;
      if(ok){n++;col=d.col}}
    if(n){p.dirt=Math.min(1,p.dirt+.0035*n);if(col){p._dc.push(col);if(p._dc.length>8)p._dc.shift()}}
    else p.dirt=Math.max(0,p.dirt-.00022);
    p._f=(p._f||0)+1;
    if(p.dirt>.22&&p._f%14===0&&p.onGround&&Math.abs(p.vx)>.5&&p._dc.length){let y=Math.floor((p.y+36)/T)*T;
      D2.push({k:'f',x:cx-p.facing*4,y:fy,r:1.6,col:p._dc[p._dc.length-1],nd:1});p.dirt-=.004;if(D2.length>700)D2.shift()}}
};
const oPD=Player.prototype.draw;
Player.prototype.draw=function(ctx,cam){
  oPD.call(this,ctx,cam);const d=this.dirt||0;return;
  const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y),cx=px+14,n=Math.ceil(d*18);
  ctx.save();for(let i=0;i<n;i++){const a=hs(i,7),b=hs(i,11),y=py+(a<.55?24+b*12:12+b*14);ctx.globalAlpha=.55+.35*hs(i,3);ctx.fillStyle=this._dc[i%this._dc.length];
    const w=1.5+hs(i,5)*(2+d*3);ctx.beginPath();ctx.ellipse(cx-8+hs(i,1)*16,y,w,w*(.7+hs(i,2)*.6),0,0,TAU);ctx.fill()}
  if(d>.45){ctx.globalAlpha=.7;ctx.fillStyle=this._dc[0];const t=performance.now()/1000;for(let i=0;i<2;i++)ctx.fillRect(cx-5+i*9,py+30+((t*14+i*7)%8),1.4,2.4)}
  ctx.restore();
};
})();
