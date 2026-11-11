/* ===== REDESIGN TOTAL: arte das folhas novas + FINALIZAR/LIBERTAR + DASHES DE RUPTURA/ACOLHIMENTO ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const AJ=window.LUMEN_DATA.AJ;  // dados em js/data/sprites-arte.js
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const ART=window.ART={img:{},get(k){const i=this.img[k];return i&&i.complete&&i.naturalWidth?i:null}};
for(const k in AJ.img){const i=new Image();i.src=AJ.img[k];ART.img[k]=i}
for(const k in AJ.spr){const s=AJ.spr[k],i=new Image();i.src=s.d;window.SPRS[k]={i,n:s.n,cw:s.cw,ch:s.ch}}
// paleta unificada das zonas
const mixc=(a,b,t)=>{const A=[1,3,5].map(i=>parseInt(a.substr(i,2),16)),B=[1,3,5].map(i=>parseInt(b.substr(i,2),16));return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
for(const z of ZONES){z.wall=mixc(z.wall,'#33283e',.55);z.floor=mixc(z.floor,'#4a3a52',.55)}
// ---------- terreno com as texturas das folhas ----------
let T0=null;
function texInit(){if(T0)return T0;const need=['tex_stone','wall_diamond','ledge_b'];if(!need.every(k=>ART.get(k)))return null;
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  const st=mk(64,32),wd=mk(64,64),im1=ART.get('tex_stone'),im2=ART.get('wall_diamond');
  st.getContext('2d').drawImage(im1,0,0,im1.naturalWidth,im1.naturalHeight,0,0,64,32);
  wd.getContext('2d').drawImage(im2,im2.naturalWidth*.1,im2.naturalHeight*.08,im2.naturalWidth*.55,im2.naturalHeight*.5,0,0,64,64);
  return T0={st,wd,ledge:ART.get('ledge_b')}}
const tint=(c,px,py,w,h,z,a)=>{c.globalAlpha=a;c.fillStyle=z?z.wall:'#33283e';c.fillRect(px,py,w,h);c.globalAlpha=1};
window.woodBack=function(c,px,py,tx,ty,z){const T=texInit();if(!T){c.fillStyle='#1a1420';c.fillRect(px,py,16,16);return}
  c.drawImage(T.wd,(tx*16)%64,(ty*16)%64,16,16,px,py,16,16);c.fillStyle='rgba(8,5,14,.55)';c.fillRect(px,py,16,16);tint(c,px,py,16,16,z,.35);
  if(tx%6===0){c.fillStyle='rgba(10,6,16,.5)';c.fillRect(px+3,py,10,16);c.fillStyle='rgba(167,110,127,.18)';c.fillRect(px+3,py,1,16)}
  if(ty%7===0){c.fillStyle='rgba(10,6,16,.5)';c.fillRect(px,py+10,16,6);c.fillStyle='rgba(167,110,127,.25)';c.fillRect(px,py+10,16,1)}};
window.woodTile=function(c,px,py,tx,ty,k,z){const T=texInit();if(!T){c.fillStyle='#241c2c';c.fillRect(px,py,16,16);return}
  c.drawImage(T.st,(tx*16)%64,(ty*16)%32,16,16,px,py,16,16);c.fillStyle='rgba(8,5,14,.32)';c.fillRect(px,py,16,16);tint(c,px,py,16,16,z,.25)};
window.woodTop=function(c,px,py,tx,ty,k,z){if(!texInit())return;
  const a=((tx+ty)&1)===0;c.fillStyle=a?'#5a4a62':'#2a2030';c.fillRect(px,py,16,5);c.fillStyle='rgba(216,200,230,.35)';c.fillRect(px,py,16,1);c.fillStyle='rgba(8,5,14,.5)';c.fillRect(px,py+4,16,1);tint(c,px,py,16,5,z,.18)};
window.platTile=function(c,px,py,tx,ty,k){const T=texInit();if(!T||!T.ledge)return;
  const im=T.ledge,sw=im.naturalWidth/8;c.imageSmoothingEnabled=true;c.drawImage(im,(tx%8)*sw,0,sw,im.naturalHeight*.7,px,py-3,16,13);
  c.fillStyle='#A76E7F';c.fillRect(px,py,16,1)};
// ---------- janelas, pendurados e objetos de chão ----------
const WINS=['win_big','win_vine','win_purple_tall','win_small','win_stain','win_tall2'];
const sprDraw=(c,k,cx,by,H,al)=>{const im=ART.get(k);if(!im)return false;const s=H/im.naturalHeight,w=im.naturalWidth*s;c.save();c.imageSmoothingEnabled=true;if(al!=null)c.globalAlpha=al;c.drawImage(im,cx-w/2,by-H,w,H);c.restore();return true};
const MOON=['home','gallery','garden','chapel','stars','boss','tower','ante','mirror'];
window.woodWindow=function(c,x,y,z,t,tx){const k=WINS[Math.floor(hs(tx||0,3)*WINS.length)];if(!ART.get(k))return;
  const lit=.75+.25*Math.sin(t*1.7+x*.1),moon=MOON.includes(z.theme);(window.WL||(window.WL=[])).push([x+12,y+20]);
  c.save();c.globalCompositeOperation='lighter';const gr=c.createRadialGradient(x+12,y+20,4,x+12,y+20,70);gr.addColorStop(0,moon?'rgba(170,130,220,'+.22*lit+')':'rgba(255,190,130,'+.2*lit+')');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(x-60,y-50,144,150);
  c.fillStyle='rgba(190,150,255,'+.05*lit+')';c.beginPath();c.moveTo(x,y+44);c.lineTo(x+24,y+44);c.lineTo(x+52,y+112);c.lineTo(x-28,y+112);c.fill();c.restore();
  sprDraw(c,k,x+12,y+46,48)};
const DR=window.DRAWERS;
if(DR){
 DR.hang=function(c,x,y,z,t,r,tx){const keys=['curt_b','curt_c','banner_but','lantern','candel_wall','curt_a'];const k=keys[Math.floor(hs(tx||0,5)*keys.length)];const im=ART.get(k);if(!im)return;
   const H=k==='lantern'||k==='candel_wall'?28:44,s=H/im.naturalHeight,w=im.naturalWidth*s;c.save();c.imageSmoothingEnabled=true;c.drawImage(im,x+8-w/2,y-2,w,H);c.restore();
   if(k==='lantern'||k==='candel_wall'){(window.WL||(window.WL=[])).push([x+8,y+16,1])}};
 DR.floor=function(c,x,y,z,t,r,tx){const keys=['vase_flw','urn_flw','vase_tall_a','vase_tall_b','urn_a','urn_b','vase_a','stool'];const k=keys[Math.floor(hs(tx||0,7)*keys.length)];sprDraw(c,k,x+8,y,24)}}
// ---------- mobília com sprites ----------
const PD=window.PROPDEF;
if(PD){const fit=(k,L)=>(c,x,y,t)=>{const im=ART.get(k);if(!im)return;const w=PD[k+'_w']||0;return};
  const put=(nm,k,extra)=>{const d=PD[nm];if(!d)return;const w=d[0]*16,h=d[1]*16;d[2]=(c,x,y,t)=>{const im=ART.get(k);if(!im)return;const s=Math.min((w+10)/im.naturalWidth,(h+6)/im.naturalHeight),dw=im.naturalWidth*s,dh=im.naturalHeight*s;c.save();c.imageSmoothingEnabled=true;c.drawImage(im,x+w/2-dw/2,y-dh,dw,dh);c.restore();if(extra)extra(x+w/2,y-dh*.7)}};
  const light=(x,y)=>{if(window.WL)window.WL.push([x,y,1])};
  put('bed','bed');put('wardrobe','wardrobe');put('shelf','bookshelf');put('chair','chair');put('clockfloor','clock_grand');put('lamp','lamp_a',light);put('vase','vase_tall_a');
  put('console','table_bench');put('desk','desk_chests');put('plinth','statue_angel');put('statue','statue_angel');put('planter','urn_flw');put('fountain','fountain');put('candelabra','candelabra',light);
  put('radio','radio');put('toychest','desk_chests');put('trunk','desk_chests');put('nightstand','lamp_b',light);put('sofa','chair');put('armchair','chair');put('table','table_bench');put('crib','cage');put('pew','table_bench');put('trellis','w_vine_b');
  window.PROPSPR=new Set(['bed','wardrobe','shelf','chair','clockfloor','lamp','vase','console','desk','plinth','statue','planter','fountain','candelabra','radio','toychest','trunk','nightstand','sofa','armchair','table','crib','pew','trellis'])}
// ---------- quadros animados (folha de retratos) ----------
const MOT={paint_bed:'girl',paint2:'eye',paint_g2:'girl2',paint_chapel:'skull',paint_m2:'eye',paint_ante:'girl2'},ML=['girl','eye','girl2','skull','cat','lily'];
window.paintingDraw=function(c,x,y,it,t){
  const m=MOT[it.id]||ML[Math.floor(hs(it.x,it.y)*ML.length)],base=ART.get('pt_'+m+'_0'),im=base;
  if(!base){c.fillStyle='#2a1a22';c.fillRect(x,y,it.w,it.h);return}
  const H=it.h*1.9,w=base.naturalWidth/base.naturalHeight*H;c.save();c.imageSmoothingEnabled=true;c.drawImage(im,x+it.w/2-w/2,y+it.h/2-H/2,w,H);c.restore();
  if(m==='eye'||m==='skull'){const a=.35+.35*Math.sin(t*2.2+it.x);c.fillStyle='rgba(216,160,176,'+a+')';c.fillRect(x+it.w/2-1,y+it.h/2-H*.12,3,3)}};
// ---------- pontos de memória com sprites ----------
window.GLYPHSPR=function(c,x,y,sh){const map={screen:['tv',17],device:['radio',15],chair:['chair',18],box:['dresser',15],photo:['ph_a',16],frame:['frame_orn',17],paper:['letter_seal',13],book:['letter_butterfly',16]};const e=map[sh];if(!e)return false;return sprDraw(c,e[0],x+8,y+T+1,e[1]+4)};
// ---------- Mika: dashes, finalizar/libertar ----------
const nowms=()=>performance.now(),DUR=()=>CONFIG.PLAYER.DASH_DURATION;
const oPU=Player.prototype.update;
Player.prototype.update=function(dt,input,grid){
  const prev=this.dashTimer>0,mode=this.dashMode||(this.hasStitch?'free':null);
  const r=oPU.call(this,dt,input,grid);
  if(this.dashTimer>0&&!prev){this._ds=nowms();this._dh=new Set();if(mode==='free')this.dashTimer=DUR()*1.38;}
  if(this.dashTimer>0&&mode==='free')this.invuln=Math.max(this.invuln,this.dashTimer+40);
  if(this.dashTimer>0&&mode==='cut')this.invuln=Math.max(this.invuln,this.dashTimer+25);
  if(this.dashTimer>0&&mode==='cut'&&window.__G){const hb=this.hitbox,box={x:hb.x-14,y:hb.y-8,w:hb.w+28,h:hb.h+16};
    for(const e of window.__G.enemies){if(!e.alive||e._dh===1||(e._sb&&e.hidden)||this._dh.has(e))continue;if(rectOverlap(box,{x:e.x,y:e.y,w:e.w,h:e.h})){this._dh.add(e);e.takeDamage(30);if(e.alive){e.stunTimer=2000;e._sqT=1000}window.glitchFx&&window.glitchFx(window.__G,.22)}}}
  return r};
const oPD=Player.prototype.draw;
Player.prototype.draw=function(ctx,cam){
  const mode=this.dashMode||(this.hasStitch?'free':null),now=nowms(),t=now/1000;
  if(this.dashTimer>0&&mode==='cut'&&window.SPRS&&window.SPRS.mika_dash&&window.SPRS.mika_dash.i.naturalWidth){
    const S=window.SPRS.mika_dash,I=window.SPRS.mika_idle,sc=46/I.ch,w=S.cw*sc,h=S.ch*sc,px=Math.floor(this.x-cam.x)+14,by=Math.floor(this.y-cam.y)+36,f=Math.min(S.n-1,Math.floor((now-(this._ds||now))/(DUR()/S.n))),fl=this.facing<0,k=Math.floor(t*14);
    ctx.save();ctx.imageSmoothingEnabled=true;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(px,by+2,10,3,0,0,TAU);ctx.fill();
    for(let g=4;g>=1;g--){ctx.globalAlpha=.14*(5-g);ctx.filter='hue-rotate(-55deg) saturate(2.6) brightness(.9)';ctx.save();ctx.translate(px-this.facing*g*10,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,-w/2,by-h,w,h);ctx.restore()}
    ctx.filter='hue-rotate(-55deg) saturate(2.8) contrast(1.35) brightness(.92)';
    for(let i=0;i<8;i++){const o=(hs(i,k)-.5)*(hs(k,3)>.55?12:4);ctx.globalAlpha=.9;ctx.save();ctx.translate(px+o,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,i*S.ch/8,S.cw,S.ch/8,-w/2,by-h+i*h/8,w,h/8+.5);ctx.restore()}
    ctx.filter='none';ctx.globalAlpha=.5;ctx.fillStyle='#b01834';ctx.fillRect(px-w*.6,by-h*.5+Math.sin(t*30)*h*.25,w*1.2,2);ctx.restore();return}
  if(this.dashTimer>0&&mode==='free'){ctx.save();ctx.globalAlpha=.7;oPD.call(this,ctx,cam);ctx.restore();
    const px=Math.floor(this.x-cam.x)+14,py=Math.floor(this.y-cam.y)+18,g=ctx.createRadialGradient(px,py,2,px,py,26);g.addColorStop(0,'rgba(255,215,235,.35)');g.addColorStop(1,'rgba(255,215,235,0)');ctx.fillStyle=g;ctx.fillRect(px-26,py-26,52,52);
    const bf=ART.get('butterfly_fx');if(bf)for(let i=0;i<3;i++){ctx.globalAlpha=.7-i*.18;ctx.drawImage(bf,px-this.facing*(14+i*12)-6,py-10+Math.sin(t*14+i)*4,12,9)}ctx.globalAlpha=1;return}
  oPD.call(this,ctx,cam)};
// ---------- finalizar / libertar ----------
const key=e=>Math.round(e.spawnX)+','+Math.round(e.spawnY);
const near=(g,e)=>{const p=g.player;return Math.abs((e.x+e.w/2)-(p.x+14))<50&&Math.abs((e.y+e.h)-(p.y+34))<36};
const cands=g=>g.enemies.filter(e=>!e.alive&&!e.permanentlyDead&&!e._sb&&!e._proj&&e.respawnTimer>0);
function act(g,kind,e,boss){const p=g.player,now=nowms();p.nar=p.nar||{f:{},c:{},s:{}};p.res=p.res||{mika:0,kaim:0,kami:0};
  p._act={k:kind==='free'?'mika_free':'mika_cut',t0:now,ms:900,x:p.x,y:p.y};p.invuln=Math.max(p.invuln,900);
  if(kind==='free'){p.res.kami+=boss?3:1;p.dirtLvl=Math.max(0,(p.dirtLvl||0)-2.5);p.nar.f.free_n=(p.nar.f.free_n||0)+1;for(let i=0;i<9;i++)(g._bf=g._bf||[]).push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.random()*2-1,vy:-.6-Math.random(),l:2+Math.random()})}
  else{p.res.kaim+=boss?3:1;p.nar.f.cut_n=(p.nar.f.cut_n||0)+1;window.glitchFx&&window.glitchFx(g,.5);g._flashR=.5}
  const tk=(kind==='free'?'fr_':'ct_')+(boss?'spirit':e.type);p.nar.f[tk]=(p.nar.f[tk]||0)+1;
  const dmg=boss?20:(e.damage||10);
  if(kind==='cut'){const b0=p.hp;p.hp=Math.min(CONFIG.PLAYER.MAX_HP,p.hp+dmg);const gnd=Math.round(p.hp-b0);if(gnd>0)(g._fl=g._fl||[]).push({x:p.x+14,y:p.y-4,txt:'+'+gnd+' vida',col:'#ff8a9a',l:1.6})}
  else{const b0=p.energy;p.energy=Math.min(CONFIG.PLAYER.MAX_ENERGY,p.energy+dmg);const gnd=Math.round(p.energy-b0);if(gnd>0)(g._fl=g._fl||[]).push({x:p.x+14,y:p.y-4,txt:'+'+gnd+' energia',col:'#9ab8ff',l:1.6})}
  if(!boss){e.permanentlyDead=true;(p.gone=p.gone||[]).push(key(e))}}
const oHI=G.handleInteractions;
G.handleInteractions=function(){if(this._skipInt){this._skipInt=false;return}return oHI.call(this)};
const oU=G.update;
G.update=function(dt){
  const p=this.player,s=dt>1?dt/1000:dt;
  if(p&&this.state==='playing'&&!this._nar&&!this._choice&&!this._conn&&this.enemies){
    const inp=this.input;let tgt=null;
    if(this._bossChoice){const b=this._bossChoice;if(near(this,b))tgt=b}else tgt=cands(this).find(e=>near(this,e))||null;
    if(tgt){this._prompt=tgt;if(inp.wasPressed('KeyE')){this._skipInt=true;if(this._bossChoice)bossPick(this,'free');else act(this,'free',tgt)}else if(inp.wasPressed('KeyF')){if(this._bossChoice)bossPick(this,'cut');else act(this,'cut',tgt)}}else this._prompt=null}
  const ac=p&&p._act&&nowms()<p._act.t0+p._act.ms?p._act:null;
  oU.call(this,dt);
  if(ac){p.x=ac.x;p.y=Math.min(p.y,ac.y);p.vx=0}else if(p&&p._act)p._act=null;
  if(this._bf){for(const b of this._bf){b.x+=b.vx;b.y+=b.vy;b.l-=s}this._bf=this._bf.filter(b=>b.l>0)}
  if(this._fl){for(const f of this._fl){f.y-=.35;f.l-=s}this._fl=this._fl.filter(f=>f.l>0)}
  if(this._flashR>0)this._flashR-=s;
  // eco de abates anteriores ao carregar o jogo
  if(p&&p.gone&&this.enemies&&!this._goneApplied){this._goneApplied=true;const set=new Set(p.gone);for(const e of this.enemies)if(set.has(key(e))){e.alive=false;e.permanentlyDead=true}}};
// ---------- espírito do véu: escolha e ramificação ----------
window.bossDeath=function(g,b){g._bossChoice=b;b._downed=true};
window.bossResolve=function(g,kind,b){const p=g.player;act(g,kind,b,true);p.dashMode=kind;g._bossChoice=null;if(b)b._downed=false;g._unlock=true};
function bossPick(g,kind){const p=g.player;act(g,kind,g._bossChoice,true);p.dashMode=kind;g._bossChoice=null;
  g.dialog=kind==='free'?{name:'Espírito do Véu',lines:['Você estende a mão. O espírito deixa de resistir.','“Deixe tudo passar. Deixe cada voz correr por você.”','“Siga o fluxo delas, Mika... e atravessará o véu.”','Aceitar também dói. Mas o caminho se abre sem ser forçado.']}
   :{name:'Espírito do Véu',lines:['Você corta o fio que o prendia. O espírito se desfaz em faixas rubras.','“Então você escolhe rasgar... e ir contra.”','“Cada voz que você cala deixa o caminho mais livre — e mais vazio.”','Rasgar é rápido. O que fica para trás, não some.']};
  g.dialogIndex=0;g.state='dialog';g._unlock=true}
// ---------- desenho: inimigos caídos, espírito do véu, borboletas ----------
const oED=Enemy.prototype.draw;
Enemy.prototype.draw=function(ctx,cam){
  const g=window.__G;
  if(this._sb){
    if(this.hidden)return;
    if(!this.alive){if(g&&g._bossChoice===this){bossDownDraw(ctx,cam,this)}return}
    return bossDraw(ctx,cam,this)}
  if(!this.alive&&!this.permanentlyDead&&!this._proj&&this.respawnTimer>0&&g){return window.drawDowned(ctx,cam,this,g)}
  return oED.call(this,ctx,cam)};
function bossFrames(b){const S=window.SPRS,st=b.bs;if(st==='windup')return['boss_dash',0];if(st==='dash')return['boss_dash',1];if(st==='jump')return['boss_port',Math.floor(nowms()/150)%2?3:2];if(st==='recover')return['boss_dash',2];if(st==='mwind')return['boss_dash',0];if(st==='mhit')return['boss_dash',1];if(st==='cast')return['boss_aura',2];return['boss_aura',Math.floor(nowms()/220)%4]}
function bossDraw(ctx,cam,b){const t=nowms()/1000,[k,f]=bossFrames(b),S=window.SPRS[k];if(!S||!S.i.naturalWidth)return;
  const P=b._ph===2,cx=b.x-cam.x+b.w/2,by=b.y-cam.y+b.h+2,H=58,sc=H/window.SPRS.boss_aura.ch,w=S.cw*sc,h=S.ch*sc,fl=b.facing<0,FLT=P?'hue-rotate(65deg) saturate(2.6) brightness(1.25)':'hue-rotate(215deg) saturate(2.1) brightness(1.3)',GL=P?'255,60,90':'110,255,170',hurt=nowms()-(b._hurt||0)<110;
  const gr=ctx.createRadialGradient(cx,by-22,3,cx,by-22,54);gr.addColorStop(0,'rgba('+GL+','+(P?.5:.38)+')');gr.addColorStop(1,'rgba('+GL+',0)');ctx.fillStyle=gr;ctx.fillRect(cx-54,by-76,108,108);
  // fios do ataque de chuva
  if(b._rn){const top=173*16-cam.y,bot=185*16-cam.y;for(const r of b._rn){if(r.t<0)continue;const x=r.x-cam.x,u=Math.min(1,r.t/700);ctx.save();
    if(r.t<700){ctx.strokeStyle='rgba(255,70,100,'+(.5+.5*u)+')';ctx.lineWidth=1.6;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bot);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(255,90,120,'+u+')';ctx.fillRect(x-3,bot-3,6,3)}
    else{const a=1-(r.t-700)/300;ctx.globalAlpha=Math.max(0,a);const g2=ctx.createLinearGradient(x-9,0,x+9,0);g2.addColorStop(0,'rgba(255,40,80,0)');g2.addColorStop(.5,'rgba(255,200,215,.95)');g2.addColorStop(1,'rgba(255,40,80,0)');ctx.fillStyle=g2;ctx.fillRect(x-9,top,18,bot-top);ctx.fillStyle='#fff';ctx.fillRect(x-1,top,2,bot-top)}ctx.restore()}}
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.filter=hurt?'brightness(2.4) saturate(.3)':FLT;
  const px=cx;
  if(b.bs==='dash'){
    if(P){const kk=Math.floor(t*14),dir=b.facing;
      for(let g=4;g>=1;g--){ctx.globalAlpha=.14*(5-g);ctx.save();ctx.translate(px-dir*g*14,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,-w/2,by-h,w,h);ctx.restore()}
      for(let i=0;i<8;i++){const o=(hs(i,kk)-.5)*(hs(kk,3)>.55?12:4);ctx.globalAlpha=.92;ctx.save();ctx.translate(px+o,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,i*S.ch/8,S.cw,S.ch/8,-w/2,by-h+i*h/8,w,h/8+.5);ctx.restore()}
      ctx.filter='none';ctx.globalAlpha=.55;ctx.fillStyle='#b01834';ctx.fillRect(px-w*.8,by-h*.5+Math.sin(t*30)*h*.25,w*1.6,2);ctx.restore();return}
    for(let i=3;i>=1;i--){ctx.globalAlpha=.18*(4-i);ctx.save();ctx.translate(cx-b.facing*i*14,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,-w/2,by-h,w,h);ctx.restore()}}
  const lunge=b.bs==='mwind'?-b.facing*3:b.bs==='mhit'?b.facing*2:0;
  ctx.globalAlpha=b.bs==='windup'||b.bs==='mwind'?.7+.25*Math.sin(t*40):.92;ctx.translate(cx+lunge,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,-w/2,by-h,w,h);ctx.restore();ctx.filter='none';
  if(b.bs==='windup'){ctx.strokeStyle=P?'rgba(255,90,120,.85)':'rgba(130,255,180,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,by-34);ctx.lineTo(cx+b.facing*90,by-34);ctx.stroke()}
  if(b.bs==='mwind'){const u=1-Math.max(0,b.bt)/(P?250:360);ctx.save();ctx.translate(cx+b.facing*16,by-30);ctx.strokeStyle='rgba('+GL+','+(.3+.6*u)+')';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,(1-u)*22+i*4+3,0,TAU);ctx.stroke()}ctx.fillStyle='rgba(255,255,255,'+.8*u+')';ctx.fillRect(-1,-1,3,3);ctx.restore()}
  if(b.bs==='mhit'){const u=1-Math.max(0,b.bt)/190;ctx.save();ctx.translate(cx,by-28);if(b.facing<0)ctx.scale(-1,1);ctx.lineCap='round';
    for(let i=0;i<3;i++){const r=26+i*8,a0=-1.25+i*.08,a1=a0+(2.5-i*.2)*Math.min(1,u*1.6);ctx.globalAlpha=(1-u*.5)*(1-i*.2);ctx.strokeStyle=i===0?'#fff':P?'#ff4a6a':'#6dffb0';ctx.lineWidth=3-i*.7;ctx.beginPath();ctx.arc(-6,0,r,a0,a1);ctx.stroke()}ctx.restore()}
  if(b.bs==='cast'){const u=1-Math.max(0,b.bt)/820;ctx.save();ctx.globalAlpha=.4+.5*u;ctx.strokeStyle='rgb('+GL+')';ctx.lineWidth=1;for(let i=0;i<4;i++){const x=cx+(i-1.5)*8;ctx.beginPath();ctx.moveTo(x,by-48);ctx.lineTo(x+Math.sin(t*20+i)*2,by-48-18*u-i*3);ctx.stroke()}ctx.restore()}}
function bossDownDraw(ctx,cam,b){const t=nowms()/1000,S=window.SPRS.boss_aura;if(!S||!S.i.naturalWidth)return;const cx=b.x-cam.x+b.w/2,by=b.y-cam.y+b.h+2,H=44,sc=H/S.ch,w=S.cw*sc,h=S.ch*sc;
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.filter='hue-rotate(215deg) saturate(1.5) brightness(.95)';ctx.globalAlpha=.55;ctx.drawImage(S.i,0,0,S.cw,S.ch,cx-w/2,by-h+4,w,h);ctx.filter='none';
  ctx.strokeStyle='rgba(216,200,240,.8)';for(let i=0;i<5;i++){const y=by-6-i*7;ctx.beginPath();ctx.moveTo(cx-14,y+Math.sin(t*4+i));ctx.quadraticCurveTo(cx,y+5,cx+14,y-1);ctx.stroke()}
  const g2=window.__G;if(g2&&near(g2,b)){const w2=190,x=cx-w2/2,y=by-h-24;ctx.fillStyle='rgba(8,20,14,.92)';ctx.fillRect(x,y,w2,20);ctx.strokeStyle='#5fe0a0';ctx.strokeRect(x+.5,y+.5,w2-1,19);ctx.font='bold 10px Georgia';ctx.fillStyle='#dff7e8';ctx.fillText('[E] Libertar',x+8,y+14);ctx.fillStyle='#ff7a8a';ctx.fillText('[F] Finalizar',x+96,y+14)}
  else{ctx.fillStyle='rgba(190,255,220,.8)';ctx.font='10px Georgia';ctx.fillText('— o espírito aguarda —',cx-52,by-h-8)}
  ctx.restore()}
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);const c=this.camera;
  if(this._bf){const bf=ART.get('butterfly_fx');for(const b of this._bf){const x=b.x-c.x,y=b.y-c.y;ctx.globalAlpha=Math.min(1,b.l);if(bf)ctx.drawImage(bf,x-6,y-4,12,9);else{ctx.fillStyle='#D8A0B0';ctx.fillRect(x,y,3,3)}}ctx.globalAlpha=1}
  if(this._fl){ctx.font='bold 10px Georgia';ctx.textAlign='center';for(const f of this._fl){const x=f.x-c.x,y=f.y-c.y;ctx.globalAlpha=Math.min(1,f.l);ctx.fillStyle='#0b0912';ctx.fillText(f.txt,x+1,y+1);ctx.fillStyle=f.col;ctx.fillText(f.txt,x,y)}ctx.globalAlpha=1;ctx.textAlign='left'}};
const oH=G.drawHUD;
G.drawHUD=function(ctx){oH.call(this,ctx);if(this._flashR>0){ctx.fillStyle='rgba(176,24,52,'+Math.min(.3,this._flashR*.5)+')';ctx.fillRect(0,0,640,360)}};
// ---------- tela inicial com a arte nova ----------
const oT=G.drawTitle;
G.drawTitle=function(c){oT.call(this,c);const t=nowms()/1000,p=ART.get('portrait');
  if(p){const x=462,y=70,w=130,h=p.naturalHeight/p.naturalWidth*w;c.save();c.globalAlpha=.92;c.drawImage(p,x,y,w,h);c.globalAlpha=1;c.strokeStyle='#A76E7F';c.lineWidth=2;c.strokeRect(x-2,y-2,w+4,h+4);c.strokeStyle='rgba(216,160,176,.4)';c.lineWidth=1;c.strokeRect(x-6,y-6,w+12,h+12);c.restore()}
  const bf=ART.get('butterfly_fx');if(bf)for(let i=0;i<5;i++){const x=((t*14+i*130)%700)-30,y=60+i*55+Math.sin(t*2+i)*14;c.globalAlpha=.8;c.drawImage(bf,x,y,14,10)}c.globalAlpha=1};
// ---------- salvar/carregar ----------
const oSG=G.saveGame;G.saveGame=function(){oSG.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k));if(d){d.gone=this.player.gone||[];d.dm=this.player.dashMode||null;localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCG=G.continueGame;G.continueGame=function(){oCG.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));if(d&&this.player){this.player.gone=d.gone||[];this.player.dashMode=d.dm||(this.player.hasStitch?'free':null);this._goneApplied=false}}catch(e){}};
})();
