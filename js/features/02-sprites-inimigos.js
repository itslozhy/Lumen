/* ===== SPRITES REAIS DO SPRITESHEET + VARIAÇÕES DE INIMIGOS ===== */
(function(){
const SPR={},S={};window.SPRS=S;
for(const k in SPR){const i=new Image();i.src=SPR[k].d;S[k]={i,n:SPR[k].n,cw:SPR[k].cw,ch:SPR[k].ch}}
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
function spr(ctx,key,fi,x,bottom,sc,flip,ax){const s=S[key];if(!s||!s.i.complete||!s.i.naturalWidth)return false;
  const w=s.cw*sc,h=s.ch*sc;ctx.save();ctx.translate(x,0);if(flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(s.i,(fi%s.n)*s.cw,0,s.cw,s.ch,-w*(ax==null?.5:ax),bottom-h,w,h);ctx.restore();return true}
const fr=(k,fps,t)=>Math.floor(t*fps)%S[k].n;
const ok=k=>S[k]&&S[k].i.naturalWidth;
const oP=Player.prototype.draw;
Player.prototype.draw=function(ctx,cam){
  if(!ok('mika_idle'))return;
  const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y),cx=px+14,bt=py+36,now=performance.now(),t=now/1000,sc=46/S.mika_idle.ch;
  if(this.attacking&&!this._wa)this._as=now;this._wa=this.attacking;if(this.dashTimer>0&&!this._wd)this._ds=now;this._wd=this.dashTimer>0;
  let key='mika_idle',f=fr('mika_idle',6,t),ax=.5;const low=this.hp<30;
  switch(this.anim){
   case 'walk':key=low?'mika_hurtwalk':'mika_walk';f=fr(key,low?7:11,t);break;
   case 'dash':key=S.mika_dash?'mika_dash':'mika_walk';f=S.mika_dash?Math.min(S.mika_dash.n-1,Math.floor((now-(this._ds||now))/(CONFIG.PLAYER.DASH_DURATION/S.mika_dash.n))):fr(key,22,t);break;
   case 'jump':key='mika_jump';f=1;break;case 'fall':key='mika_jump';f=3;break;case 'wall':key=S.mika_wall?'mika_wall':'mika_jump';f=S.mika_wall?Math.floor(now/170)%S.mika_wall.n:4;break;
   case 'hurt':key='mika_hurtwalk';f=0;break;
   case 'attack':case 'pogo':key='mika_attack';ax=.5;f=Math.min(S.mika_attack.n-1,Math.floor((now-(this._as||now))/34));break;
   default:if(low){key='mika_hurtwalk';f=fr(key,3,t)}}
  if(this._act&&S[this._act.k]&&now<this._act.t0+this._act.ms){const s2=S[this._act.k];key=this._act.k;f=Math.min(s2.n-1,Math.floor((now-this._act.t0)/this._act.ms*s2.n));ax=.5}
  const fl=(key==='mika_attack'||key==='mika_dash'||key==='mika_cut'||key==='mika_free')?this.facing<0:this.facing>0;
  ctx.save();ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(cx,py+38,10,3,0,0,Math.PI*2);ctx.fill();
  if(this.dashTimer>0)for(let i=3;i>0;i--){ctx.globalAlpha=.16*(4-i);if('filter' in ctx)ctx.filter='hue-rotate(250deg) saturate(2)';spr(ctx,key,f,cx-this.facing*i*9,bt,sc,fl,ax)}
  ctx.globalAlpha=this.knockbackTimer>0?.7+Math.sin(this.knockbackTimer/20)*.3:1;
  if(this.invuln>0&&Math.floor(now/70)%2)ctx.globalAlpha*=.6;
  if('filter' in ctx)ctx.filter='saturate(1.28) contrast(1.2) brightness(1.2)';
  if(this.pogoing){ctx.save();ctx.translate(cx,bt-20);ctx.rotate(-.5*this.facing);spr(ctx,'mika_attack',2,0,20,sc,fl,.5);ctx.restore()}else{ctx.save();ctx.filter='brightness(0)';ctx.globalAlpha=.85;for(const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1]])spr(ctx,key,f,cx+ox,bt+oy,sc,fl,ax);ctx.restore();ctx.shadowColor='rgba(255,232,246,.9)';ctx.shadowBlur=2;spr(ctx,key,f,cx,bt,sc,fl,ax);ctx.shadowBlur=0;ctx.shadowColor='transparent'}ctx.filter='none';ctx.globalAlpha=1;
  if(this.pogoing){ctx.strokeStyle='#D27A8A';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-3+this.facing*2,py+30);ctx.lineTo(cx+this.facing*14,py+48);ctx.lineTo(cx+5+this.facing*2,py+30);ctx.stroke()}
  if(this.anim==='wall'){ctx.fillStyle='rgba(122,107,139,.6)';ctx.fillRect(px+(this.facing>0?26:-2),py+20+this.animFrame*2,3,3)}
  ctx.restore();
};
const MAP={paper_doll:['doll',32],specter_rat:['rat',24],broken_marionette:['mari',40]};
const TINT={sewer:'hue-rotate(85deg) saturate(1.3)',sunken:'hue-rotate(165deg) saturate(1.2)',stitch:'hue-rotate(-35deg) saturate(1.5)',garden:'hue-rotate(25deg) saturate(1.4)',chapel:'saturate(.45) brightness(1.25)',ante:'hue-rotate(-65deg) saturate(1.6)',boss:'hue-rotate(-65deg) saturate(1.6)',cellar:'sepia(.6) saturate(1.3)',library:'hue-rotate(190deg) saturate(1.1)',mirror:'hue-rotate(150deg) brightness(1.1)'};
const oE=Enemy.prototype.draw;
Enemy.prototype.draw=function(ctx,cam){
  const m=MAP[this.type];if(!m)return oE.call(this,ctx,cam);if(!ok(m[0]+'_idle'))return;
  const now=performance.now(),t=now/1000;
  for(const pr of this.projectiles){const qx=pr.x-cam.x,qy=pr.y-cam.y,g=ctx.createRadialGradient(qx,qy,1,qx,qy,10);g.addColorStop(0,'#e8b0ff');g.addColorStop(.4,'rgba(126,53,184,.8)');g.addColorStop(1,'rgba(126,53,184,0)');ctx.fillStyle=g;ctx.fillRect(qx-10,qy-10,20,20)}
  if(this.permanentlyDead)return;
  const px=Math.floor(this.x-cam.x+(this.atkLunge||0)*this.facing),py=Math.floor(this.y-cam.y);if(px<-60||px>700||py<-50||py>410)return;
  if(!this.alive){const k=1-this.respawnTimer/CONFIG.RESPAWN_TIME;ctx.globalAlpha=.3+k*.4;ctx.fillStyle=this.stainColor==='black'?'#1a1420':'#7E35B8';ctx.beginPath();ctx.ellipse(px+this.w/2,py+this.h-2,14,4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;return}
  if(this._hp==null)this._hp=this.hp;if(this.hp<this._hp)this._hu=now+320;this._hp=this.hp;
  if(this._z==null){const z=zoneAt(Math.floor(this.spawnX/T),Math.floor(this.spawnY/T));const r=hs(this.spawnX,this.spawnY);this._z=TINT[z&&z.theme]||'';this._v=r>.74?2:r<.2?1:0}
  const p=m[0],tg=m[1]*(this._v===2?1.22:this._v===1?.86:1),sc=tg/S[p+'_idle'].ch;
  const hurt=now<(this._hu||0),atk=this.atkPhase&&this.atkPhase!=='idle',mv=Math.abs(this.vx)>.05;
  const key=p+(hurt?'_hurt':atk?'_attack':mv?'_walk':'_idle');
  let f=hurt?Math.min(S[key].n-1,Math.floor((320-(this._hu-now))/80)):fr(key,atk?13:mv?9:5,t+this.spawnX);
  if(atk&&this.atkPhase==='windup')f=0;
  const cx=px+this.w/2,bt=py+this.h+2;
  ctx.save();ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(cx,bt,tg*.35,3,0,0,Math.PI*2);ctx.fill();
  if(this._v===2){const g=ctx.createRadialGradient(cx,bt-tg/2,2,cx,bt-tg/2,tg);g.addColorStop(0,'rgba(210,60,90,.35)');g.addColorStop(1,'rgba(210,60,90,0)');ctx.fillStyle=g;ctx.fillRect(cx-tg,bt-tg*1.5,tg*2,tg*2)}
  let flt='saturate(.72) hue-rotate(-14deg) contrast(1.05) '+this._z+(this._v===2?' brightness(1.15) contrast(1.15)':'');
  if(this.atkPhase==='windup')flt+=' brightness(1.6) sepia(1) saturate(3)';
  if(hurt)flt='brightness(2.2) saturate(.3)';
  if('filter' in ctx)ctx.filter=flt.trim()||'none';
  spr(ctx,key,f,cx,bt,sc,this.facing<0,p==='rat'&&atk?.45:.5);
  ctx.filter='none';
  if(this.hp<this.maxHp){const w=22;ctx.fillStyle='rgba(15,14,25,.8)';ctx.fillRect(cx-w/2,py-8,w,3);ctx.fillStyle=this._v===2?'#ff5a7a':'#D27A8A';ctx.fillRect(cx-w/2,py-8,w*this.hp/this.maxHp,3)}
  ctx.restore();
};
})();
