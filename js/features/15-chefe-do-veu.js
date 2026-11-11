/* ===== CHEFE DO VÉU: PLATAFORMAS, PULOS E DASHES; PAREDES NOS POÇOS ===== */
(function(){
const G=Game.prototype;
const SH=[['s1','Poço do Alçapão',73,132,4,8,1],['s2','Poço das Vozes',51,154,4,2,2],['s3','Poço do Véu',75,170,4,2,3],['s4','Poço Ascendente I',139,170,4,2,3],
 ['s5','Poço Ascendente II',121,154,4,2,2],['s6','Poço Ascendente III',139,138,4,2,1],['s7','Passagem para o Abismo',147,112,4,12,1]];
for(const s of SH){ZONES.push({id:s[0],name:s[1],x:s[2],y:s[3],w:s[4],h:s[5],theme:'cellar',wall:'#21150f',floor:'#2e2018',accent:'#3a8a5a',bg:'#040708'});window.FOVLV[s[0]]=s[6]}
const PL=[[82,86,179],[88,93,180],[94,99,177],[100,105,178],[106,110,177]];
const _bw=buildWorld;
buildWorld=function(){
  const g=_bw();
  for(const s of SH)for(let y=s[3];y<s[3]+s[5];y++){g[y][s[2]]=1;g[y][s[2]+s[4]-1]=1}
  for(const p of [[82,5,179],[94,6,177],[106,5,177]])for(let x=p[0];x<p[0]+p[1];x++)g[p[2]][x]=2;
  return g};
// IA do chefe: pula entre plataformas e dá dashes mirados que causam dano
const solid=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H||g[ty][tx]===1};
const gnd=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return ty>=0&&ty<WORLD_H&&(g[ty][tx]===1||g[ty][tx]===2)};
function bossRain(b,pl){const n=6,px=pl.x+14,a=[];for(let i=0;i<n;i++){const x=Math.max(81*T+8,Math.min(110*T-8,px+(i-(n-1)/2)*38+(Math.random()-.5)*20));a.push({x,t:-i*110})}b._rn=a}
function bossRainTick(b,pl,ms){const hb=pl.hitbox;let live=false;for(const r of b._rn){r.t+=ms;if(r.t<1000){live=true;if(r.t>=700&&!r.hit&&Math.abs(r.x-(hb.x+hb.w/2))<(hb.w/2+7)){r.hit=true;pl.takeDamage(18,'purple',r.x)}}}if(!live)b._rn=null}
const prev=Enemy.prototype.update;
Enemy.prototype.update=function(dt,pl,grid){
  if(!(this._sb&&!this.hidden&&this.alive))return prev.call(this,dt,pl,grid);
  const ms=dt>1?dt:dt*1000,cx=this.x+this.w/2,px=pl.x+14,dxp=px-cx,dist=Math.abs(dxp),dir=dxp>=0?1:-1,ph2=this.hp<this.maxHp*.5,GR=.42,P=this._ph===2,SP=P?1.3:1;
  const feet=()=>this.y+this.h,onG=()=>this.vy>=0&&gnd(grid,this.x+this.w/2,feet()+1);
  this.bt-=ms;if(this._rn)bossRainTick(this,pl,ms);
  if(this.bs==='idle'){this.facing=dir;this.vx=(dist>170?dir*2.8:dist<80?-dir*2.4:0)*SP;
    if(this.bt<=0){const mel=dist<78&&Math.abs((pl.y+18)-(this.y+this.h/2))<46&&onG();if(mel&&Math.random()<(P?.7:.55)){this.bs='mwind';this.bt=P?250:360;this.vx=0;this.facing=dir;this.hitDone=false}else if(P&&onG()&&Math.random()<.3){this.bs='cast';this.bt=820;this._cast=false;this.vx=0}else if(onG()&&Math.random()<(ph2?.65:.5)){
        const cur=PL.findIndex(p=>Math.abs(feet()-p[2]*T)<4&&cx>=p[0]*T&&cx<=(p[1]+1)*T),opts=PL.map((p,i)=>i).filter(i=>i!==cur),p=PL[opts[Math.random()*opts.length|0]];
        const tx=(p[0]+1+Math.random()*(p[1]-p[0]-1))*T+8,ty=p[2]*T,dy=ty-feet(),vy0=-Math.sqrt(2*GR*(Math.max(0,-dy)+14)),t=(-vy0+Math.sqrt(vy0*vy0+2*GR*dy))/GR;
        this.vy=vy0;this.vx=Math.max(-7,Math.min(7,(tx-cx)/t));this.bs='jump';this.bt=1700;this.facing=this.vx>=0?1:-1}
      else{this.bs='windup';this.bt=P?260:ph2?420:620;this.vx=0}}}
  else if(this.bs==='mwind'){this.facing=dir;this.vx=0;if(this.bt<=0){this.bs='mhit';this.bt=190;this.hitDone=false;this.vx=this.facing*(P?7:5.5)}}
  else if(this.bs==='mhit'){const f=this.facing,bx=f>0?this.x+this.w-6:this.x-46,hb2=pl.hitbox;if(!this.hitDone&&rectOverlap({x:hb2.x,y:hb2.y,w:hb2.w,h:hb2.h},{x:bx,y:this.y-6,w:52,h:this.h+12})){this.hitDone=true;pl.takeDamage(P?20:16,'purple',this.x)}if(this.bt<=0){this.vx=0;if(P&&Math.random()<.5){this.bs='windup';this.bt=200}else{this.bs='recover';this.bt=P?380:650}}}
  else if(this.bs==='cast'){this.facing=dir;this.vx=0;if(!this._cast){this._cast=true;bossRain(this,pl)}if(this.bt<=0){this.bs='recover';this.bt=P?520:800}}
  else if(this.bs==='jump'){if(this.vy>0&&onG()||this.bt<=0){this.bs='windup';this.bt=P?240:ph2?380:520;this.vx=0}}
  else if(this.bs==='windup'){this.facing=dir;this.vx=0;
    if(this.bt<=0){let ax=px-cx,ay=(pl.y+18)-(this.y+this.h/2);if(onG()&&ay>0&&Math.abs(ax)>60)ay*=.3;const n=Math.hypot(ax,ay)||1;this.ux=ax/n;this.uy=ay/n;this.bs='dash';this.bt=800;this._ds=performance.now();this.hitDone=false;this.facing=this.ux>=0?1:-1}}
  else if(this.bs==='dash'){
    const nx=this.x+this.ux*11,ny=this.y+this.uy*11;let blocked=false;
    if(!solid(grid,nx+(this.ux>0?this.w:0),this.y+4)&&!solid(grid,nx+(this.ux>0?this.w:0),this.y+this.h-4))this.x=nx;else blocked=true;
    if(!solid(grid,this.x+4,ny+(this.uy>0?this.h:0))&&!solid(grid,this.x+this.w-4,ny+(this.uy>0?this.h:0)))this.y=ny;else if(this.uy>0)blocked=true;
    this.x=Math.max(80*T+2,Math.min(118*T-this.w,this.x));this.y=Math.max(173*T,this.y);const hb=pl.hitbox;if(!this.hitDone&&rectOverlap({x:hb.x-4,y:hb.y-4,w:hb.w+8,h:hb.h+8},{x:this.x,y:this.y,w:this.w,h:this.h})){this.hitDone=true;pl.takeDamage(24,'purple',this.x)}
    if(this.bt<=0||blocked){this.vx=0;this.vy=0;if((ph2||P)&&(this.chain=(this.chain||0)+1)<(P?3:2)){this.bs='windup';this.bt=P?160:240}else{this.chain=0;this.bs='recover';this.bt=P?600:950}}
    return}
  else if(this.bs==='recover'){this.vx=0;if(this.bt<=0){this.bs='idle';this.bt=P?280:ph2?450:1000}}
  const nx=this.x+this.vx;if(!solid(grid,nx+(this.vx>0?this.w:0),this.y+8)&&!solid(grid,nx+(this.vx>0?this.w:0),this.y+this.h-4))this.x=nx;
  this.vy=Math.min(11,this.vy+GR);this.y+=this.vy;if(this.vy>=0&&gnd(grid,this.x+this.w/2,this.y+this.h)){this.y=Math.floor((this.y+this.h)/T)*T-this.h;this.vy=0}if(this.vy<0&&(solid(grid,this.x+6,this.y)||solid(grid,this.x+this.w-6,this.y))){this.y=(Math.floor(this.y/T)+1)*T;this.vy=0}this.x=Math.max(80*T+2,Math.min(118*T-this.w,this.x));
};
})();
