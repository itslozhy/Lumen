/* ===== LUMEN VISUAL UPGRADE: tiles, zonas, parallax, HUD, título ===== */
(function(){
const G=Game.prototype,W=640,H=360,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return 'rgb('+A.map((v,i)=>v+(B[i]-v)*t|0)+')'};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const MOON={home:1,gallery:1,garden:1,chapel:1,stars:1,boss:1,tower:1,ante:1,mirror:1};
const OUT={garden:.12,stars:.1,shaft:.15,sewer:.2,boss:.15};
const AMB={garden:'paper',sewer:'spore',stitch:'spore',library:'dust',attic:'dust',chapel:'ember',stars:'ember',boss:'spore',cellar:'dust'};
let decor=null,lastZone=null,banner=0,bname='',vig=null;
function buildDecor(g){
  decor={};
  for(const z of ZONES){const L=decor[z.id]=[];
    for(let tx=z.x+1;tx<z.x+z.w-1;tx++){
      let ceil=-1,fl=-1;
      for(let ty=z.y+1;ty<z.y+z.h-1;ty++){
        if(ceil<0&&g[ty][tx]===0&&g[ty-1][tx]===1)ceil=ty;
        else if(ceil>=0&&g[ty][tx]!==0){fl=ty;break}
      }
      if(ceil<0||fl<0||fl-ceil<5)continue;
      const r=hs(tx,z.x),h=fl-ceil;
      if(tx%7===z.x%7&&h>=7&&!(window.FOVLV&&window.FOVLV[z.id]))L.push({k:'win',tx,ty:ceil+1});
      else if(tx%5===2&&r>.35)L.push({k:'hang',tx,ty:ceil});
      if(r>.62&&g[fl-1][tx]===0)L.push({k:'floor',tx,ty:fl,r});
      if(h>=8&&tx%9===5&&z.id!=='suspended_lib'&&!(window.FOVLV&&window.FOVLV[z.id])){L.push({k:'ladder',tx,ty:ceil,r:h});(window.LAD=window.LAD||[]).push({tx,y0:ceil,y1:ceil+h-1})}
    }}
}
const drawers=window.DRAWERS={
 ladder(c,x,y,z,t,r){if(!ENV.stairs.ok)return;for(let yy=4;yy<(r-1)*T;yy+=19)c.drawImage(ENV.stairs.i,x,y+yy,14,19)},
 win(c,x,y,z,t,r,tx){window.woodWindow(c,x,y,z,t,tx)},
 hang(){},
 floor(){}
};
function tileCols(z){return {wall:z?z.wall:'#2a2228',fl:z?z.floor:'#3a2a28',ac:z?z.accent:'#A76E7F'}}
G.drawWorld=function(ctx){
  const cam=this.camera,t=this.time||0;
  window.WL=[];if(!decor)buildDecor(this.grid);
  const pz=zoneAt(Math.floor((this.player.x+14)/T),Math.floor((this.player.y+20)/T))||ZONES[0];
  if(pz!==lastZone){lastZone=pz;bname=pz.name;banner=3.2}
  // céu / fundo
  const sb=this._sb||(this._sb={bg:hx(pz.bg),ac:hx(pz.accent),moon:MOON[pz.theme]?1:0,depth:0}),lp=(a,b)=>a.map((v,i)=>v+(b[i]-v)*.035),h2=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  sb.bg=lp(sb.bg,hx(pz.bg));sb.ac=lp(sb.ac,hx(pz.accent));sb.moon+=((MOON[pz.theme]?1:0)-sb.moon)*.04;sb.depth+=(clamp((this.player.y/T-UPR)/70,0,1.6)-sb.depth)*.03;
  const sbg=h2(sb.bg),sac=h2(sb.ac);
  const gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,mix(sbg,'#000000',.4+.15*sb.depth));gr.addColorStop(1,mix(sbg,sac,.22));
  ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
  if(pz.theme==='stars'||pz.theme==='boss')for(let i=0;i<60;i++){ctx.globalAlpha=.4+.5*Math.sin(t*2+i*9);R(ctx,(hs(i,1)*W*1.3-cam.x*.03)%W,hs(i,2)*H*.7,1,1,'#E6DCC6')}
  ctx.globalAlpha=1;
  if(sb.moon>.02){ctx.globalAlpha=sb.moon;const mx=W*.74-cam.x*.04,my=78-cam.y*.03+(1-sb.moon)*40;
    const mg=ctx.createRadialGradient(mx,my,10,mx,my,90);mg.addColorStop(0,'rgba(230,130,180,.5)');mg.addColorStop(1,'rgba(230,130,180,0)');
    ctx.fillStyle=mg;ctx.fillRect(mx-90,my-90,180,180);
    ctx.fillStyle='#d98ab0';ctx.beginPath();ctx.arc(mx,my,34,0,TAU);ctx.fill();ctx.fillStyle='rgba(120,50,110,.35)';
    ctx.beginPath();ctx.arc(mx-9,my-6,7,0,TAU);ctx.arc(mx+11,my+9,5,0,TAU);ctx.fill();ctx.globalAlpha=1}
  for(let l=0;l<2;l++){const f=l?.28:.14,col=mix(sbg,'#7E35B8',(l?.2:.1)*(1-.4*sb.depth));
    for(let i=0;i<14;i++){const x=(((i*78-cam.x*f)%1092)+1092)%1092-80,hh=70+hs(i,l+3)*110,w=26+hs(i,l+5)*28,b=H+90-cam.y*.1*(l+1);
      ctx.fillStyle=col;ctx.fillRect(x,b-hh,w,hh);ctx.beginPath();ctx.moveTo(x-2,b-hh);ctx.lineTo(x+w/2,b-hh-w*1.5);ctx.lineTo(x+w+2,b-hh);ctx.fill();
      if(i%3===0){ctx.fillStyle='rgba(210,122,138,.35)';ctx.fillRect(x+w/2-1,b-hh+14,3,7)}}}
  const sx=Math.max(0,Math.floor(cam.x/T)-1),ex=Math.min(WORLD_W,Math.ceil((cam.x+W)/T)+1),sy=Math.max(0,Math.floor(cam.y/T)-1),ey=Math.min(WORLD_H,Math.ceil((cam.y+H)/T)+1);
  // parede de fundo (papel de parede + rodapé)
  for(let ty=sy;ty<ey;ty++)for(let tx=sx;tx<ex;tx++){
    if(this.grid[ty][tx]!==0)continue;const z=zoneAt(tx,ty);if(!z)continue;
    const px=Math.floor(tx*T-cam.x),py=Math.floor(ty*T-cam.y);
    ctx.globalAlpha=1-(OUT[z.theme]||0);
    window.woodBack(ctx,px,py,tx,ty,z);
    const bt=this.grid[ty+1]&&this.grid[ty+1][tx];
    if(bt===1||bt===2){R(ctx,px,py+T-4,T,4,mix(z.wall,'#000000',.7));R(ctx,px,py+T-4,T,1,z.accent)}
    ctx.globalAlpha=1}
  
  // decoração por zona
  for(const z of ZONES){const L=decor[z.id];if(!L)continue;
    if((z.x+z.w)*T<cam.x||z.x*T>cam.x+W)continue;
    for(const d of L){const px=Math.floor(d.tx*T-cam.x),py=Math.floor(d.ty*T-cam.y);if(px<-40||px>W+20)continue;drawers[d.k](ctx,px,py,z,t,d.r,d.tx)}}
  // tiles sólidos
  for(let ty=sy;ty<ey;ty++)for(let tx=sx;tx<ex;tx++){
    const c=this.grid[ty][tx];if(!c)continue;
    const px=Math.floor(tx*T-cam.x),py=Math.floor(ty*T-cam.y),z=zoneAt(tx,ty),k=tileCols(z),r=hs(tx,ty);
    if(c===1){
      window.woodTile(ctx,px,py,tx,ty,k,z);
      
      R(ctx,px,py,T,1,'rgba(255,255,255,.07)');if(r>.8)R(ctx,px+3,py+3,5,3,'rgba(167,110,127,.12)');
      const up=ty>0&&this.grid[ty-1][tx]===0;
      if(up){window.woodTop(ctx,px,py,tx,ty,k,z);R(ctx,px,py+5,T,1,'rgba(0,0,0,.4)');
        if(z&&(z.theme==='garden'||z.theme==='sewer'||z.theme==='sunken'))window.drawGrass(ctx,px,py,tx,ty);
        else if(r>.55)window.drawDust(ctx,px,py,tx,ty)}
      const dn=ty<WORLD_H-1&&this.grid[ty+1][tx]===0;
      if(dn&&r>.35)window.drawVine(ctx,px,py,tx,ty,r)
    }else{
      window.platTile(ctx,px,py,tx,ty,k);R(ctx,px,py+2,T,1,'rgba(255,255,255,.18)');
      for(let i=1;i<T;i+=4)R(ctx,px+i,py+3,2,2,'rgba(0,0,0,.35)');R(ctx,px,py+6,T,1,'rgba(0,0,0,.4)')}
  }
  // ambiente
  const a=AMB[pz.theme];if(a&&Math.random()<.12)this.particles.emit(cam.x+Math.random()*W,cam.y+Math.random()*H,a,1);
  // plataformas móveis
  for(const m of this.movers){const px=Math.floor(m.x-cam.x),py=Math.floor(m.y-cam.y);if(px<-60||px>W+20)continue;
    for(let i=0;i<m.w;i+=T)window.platTile(ctx,px+i,py,(i/T)|0,0,{ac:'#D27A8A'});
    for(let i=4;i<m.w-4;i+=8)R(ctx,px+i,py+3,3,2,'#7E35B8');
    ctx.fillStyle='rgba(126,53,184,'+(.2+.1*Math.sin(t*4))+')';ctx.fillRect(px,py+m.h,m.w,3)}
  window.drawHazards(ctx,this.hazards,cam);
  // interativos
  for(const it of this.interactives){const px=Math.floor(it.x-cam.x),py=Math.floor(it.y-cam.y);if(px<-50||px>W+50)continue;
    const bob=Math.sin(t*3+it.x)*2;
    if(it.type==='rest'){const cx=px+it.w/2;R(ctx,cx-9,py-2,18,6,'#3d333a');R(ctx,cx-9,py-2,18,1,'#D27A8A');R(ctx,cx-1,py-12,2,10,'#C9B9B9');
      ctx.fillStyle='rgba(210,122,138,.25)';ctx.beginPath();ctx.arc(cx,py-14,18+Math.sin(t*2)*2,0,TAU);ctx.fill();
      ctx.fillStyle='#ffe3ee';ctx.beginPath();ctx.moveTo(cx,py-24);ctx.lineTo(cx+3,py-17);ctx.lineTo(cx+10,py-14);ctx.lineTo(cx+3,py-11);ctx.lineTo(cx,py-4);ctx.lineTo(cx-3,py-11);ctx.lineTo(cx-10,py-14);ctx.lineTo(cx-3,py-17);ctx.fill()}
    else if(it.type==='memory'&&!it.collected){ctx.fillStyle='rgba(126,53,184,.3)';ctx.beginPath();ctx.arc(px+5,py+5+bob,14,0,TAU);ctx.fill();
      ctx.fillStyle='#9ab8ff';ctx.beginPath();ctx.moveTo(px+5,py-4+bob);ctx.lineTo(px+11,py+5+bob);ctx.lineTo(px+5,py+14+bob);ctx.lineTo(px-1,py+5+bob);ctx.fill();R(ctx,px+4,py+bob,2,6,'#fff')}
    else if(it.type==='item'&&!it.collected){
      if(it.item==='boss_key'){R(ctx,px+2,py+5+bob,10,3,'#e8d080');ctx.fillStyle='#e8d080';ctx.beginPath();ctx.arc(px+13,py+6+bob,4,0,TAU);ctx.fill();R(ctx,px+3,py+8+bob,2,3,'#e8d080');R(ctx,px+11,py+5+bob,3,3,'#101019');
        ctx.fillStyle='rgba(232,208,128,.2)';ctx.beginPath();ctx.arc(px+8,py+7+bob,15,0,TAU);ctx.fill()}
      else{const hl=it.item==='heal';R(ctx,px+3,py+2+bob,8,3,'#C9B9B9');R(ctx,px+2,py+5+bob,10,9,hl?'#D27A8A':'#6B8CA5');R(ctx,px+4,py+7+bob,2,4,'rgba(255,255,255,.5)');
        ctx.fillStyle=hl?'rgba(210,122,138,.2)':'rgba(107,140,165,.2)';ctx.beginPath();ctx.arc(px+7,py+8+bob,11,0,TAU);ctx.fill()}}
    else if(it.type==='ability'&&!it.collected){const cx=px+12,cy=py+12+bob;ctx.fillStyle='rgba(126,53,184,.3)';ctx.beginPath();ctx.arc(cx,cy,20+Math.sin(t*4)*2,0,TAU);ctx.fill();
      ctx.save();ctx.translate(cx,cy);ctx.rotate(t);ctx.fillStyle='#ffd0e6';ctx.beginPath();for(let i=0;i<8;i++){const rr=i%2?4:12,an=i*Math.PI/4;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}ctx.fill();ctx.restore()}
    else if(it.type==='cabinet'){R(ctx,px,py,it.w,it.h,'#3a2a28');R(ctx,px,py,it.w,3,'#5a4540');R(ctx,px+1,py+it.h/2,it.w-2,1,'#1a1214');R(ctx,px+it.w/2-2,py+it.h/2-2,4,5,'#a98a5a');if(it.looted)R(ctx,px,py,it.w,2,'#000')}
    else if(it.type==='book'){R(ctx,px,py+2,9,9,'#7a3a4a');R(ctx,px+1,py+3,2,7,'#C9B9B9');R(ctx,px+4,py+5,4,1,'#E6DCC6');ctx.fillStyle='rgba(210,122,138,.15)';ctx.beginPath();ctx.arc(px+4,py+6,10,0,TAU);ctx.fill()}
    else if(it.type==='painting'){window.paintingDraw(ctx,px,py,it,t)}
    else if(it.type==='npc'){const b=Math.sin(t*2+it.x)*1.5;R(ctx,px+5,py+13+b,14,17,'#6a5a70');R(ctx,px+3,py+28+b,18,3,'#3d2f48');R(ctx,px+7,py+3+b,10,10,'#C9B9B9');R(ctx,px+6,py+1+b,12,4,'#D27A8A');R(ctx,px+9,py+7+b,2,2,'#101019');R(ctx,px+14,py+7+b,2,2,'#101019');
      ctx.fillStyle='rgba(126,53,184,.3)';ctx.beginPath();ctx.arc(px+12,py-6+b,4,0,TAU);ctx.fill()}
    else if(it.type==='door_lock'){
      if(it.locked){R(ctx,px,py,it.w,it.h,'#2a1424');R(ctx,px+2,py+2,it.w-4,it.h-2,'#4a2030');R(ctx,px,py,it.w,2,'#e8d080');R(ctx,px+it.w/2-3,py+it.h/2-4,6,8,'#e8d080');R(ctx,px+it.w/2-1,py+it.h/2-1,2,4,'#101019');
        ctx.strokeStyle='#e8d080';ctx.globalAlpha=.4+.3*Math.sin(t*3);ctx.strokeRect(px-1,py-1,it.w+2,it.h+2);ctx.globalAlpha=1}
      else{const g2=ctx.createLinearGradient(px,py,px,py+it.h);g2.addColorStop(0,'rgba(210,122,138,.5)');g2.addColorStop(1,'rgba(126,53,184,.15)');ctx.fillStyle=g2;ctx.fillRect(px,py,it.w,it.h)}}
  }
};
// HUD gótico + vinheta + nome de zona
G.drawHUD=function(ctx){
  const p=this.player,t=this.time||0;
  if(!vig){vig=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);vig.addColorStop(0,'rgba(8,4,16,0)');vig.addColorStop(1,'rgba(8,4,16,.65)')}
  const pl=ctx.createRadialGradient(p.x-this.camera.x+14,p.y-this.camera.y+16,4,p.x-this.camera.x+14,p.y-this.camera.y+16,70);
  pl.addColorStop(0,'rgba(230,150,190,.10)');pl.addColorStop(1,'rgba(230,150,190,0)');ctx.fillStyle=pl;ctx.fillRect(0,0,W,H);
  window.fovDraw(ctx,this);
  const fr=(x,y,w,h)=>{R(ctx,x,y,w,h,'rgba(15,14,25,.85)');ctx.strokeStyle='#A76E7F';ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='rgba(210,122,138,.3)';ctx.strokeRect(x+2.5,y+2.5,w-5,h-5);R(ctx,x-1,y-1,3,3,'#D27A8A');R(ctx,x+w-2,y-1,3,3,'#D27A8A');R(ctx,x-1,y+h-2,3,3,'#D27A8A');R(ctx,x+w-2,y+h-2,3,3,'#D27A8A')};
  window.hudDraw(ctx,this);
  if(banner>0){banner-=1/60;window.COL.banner(ctx,bname,Math.min(1,banner,3.2-banner))}
};
// tela inicial: rasgos de papel, castelo, lua, borboletas
})();
