/* ===== Terminais de fita: pontos de descanso (salvar fita, só fora de combate) ===== */
(function(){
const G=Game.prototype,U=window.__UIK,K=U.K,tx=U.tx,win=U.win,scan=U.scan,vign=U.vign,reel=U.reel,seg=U.seg,TAU=Math.PI*2,HANDF=U.HANDF;
const KEEP=new Set(['rest_w3','rest_b1','rest_br','rest_ante']);   // chaleira · saída do alçapão · antes do mini chefe · antes da câmara do chefe
const ease=x=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const lerp=(a,b,k)=>a+(b-a)*k,sec=dt=>dt>1?dt/1000:dt;

// ---------- sprite do terminal (substitui o candelabro) ----------
function mkSprite(){const c=document.createElement('canvas');c.width=52;c.height=52;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  const R=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
  R(3,43,46,4,'#6a4a38');R(3,43,46,1,'#8a6a52');R(6,47,4,5,'#3a2620');R(42,47,4,5,'#3a2620');R(3,46,46,1,'#2a1a14');
  R(16,38,20,5,'#b9ad96');R(16,38,20,1,'#d8cdb4');                                   // base
  R(7,6,38,33,'#07050b');R(8,7,36,31,'#cbbfa8');R(8,7,36,2,'#e6dcc6');R(8,36,36,2,'#8f8470'); // carcaça
  R(11,10,30,25,'#050a07');R(11,10,30,1,'#000');R(11,10,1,25,'#000');R(11,34,30,1,'#8f8470');
  R(12,11,28,23,'#04160d');for(let yy=12;yy<33;yy+=2)R(12,yy,28,1,'rgba(0,0,0,.35)');
  R(13,12,26,3,'#4a2f8a');R(14,13,10,1,'#f0e8ff');R(30,13,6,1,'#e8d060');             // barra roxa + destaque amarelo
  R(14,17,18,1,'#5ff0a0');R(14,20,22,1,'#3ab87a');R(14,23,14,1,'#5ff0a0');R(14,26,20,1,'#3ab87a');R(14,29,8,1,'#8affc0');R(24,29,3,2,'#8affc0');
  R(40,36,3,2,'#c8284a');R(34,36,4,2,'#2a2230');                                      // led + botão
  R(20,41,12,2,'#120c14');R(22,41,8,1,'#e8dfcc');                                     // gaveta da fita
  return c}
function fixSprite(){const E=(typeof ENV!=='undefined')?ENV:null;if(!E||!E.rest||!E.rest.ok||E.rest._term)return;
  E.rest={i:mkSprite(),ok:true,w:52,h:52,_term:true}}

// ---------- utilidades ----------
const MOVE={rest_w3:[6,14],rest_br:[73,184]};   // plataforma do livro (cozinha) · fim da Ala do Véu, antes da porta da Sala do Espírito
function prune(g){const a=g.interactives;if(!a)return;for(let i=a.length-1;i>=0;i--){const it=a[i];if(it.type!=='rest')continue;if(!KEEP.has(it.id))a.splice(i,1);else if(MOVE[it.id]&&!it._mv){it._mv=1;it.x=MOVE[it.id][0]*16;it.y=MOVE[it.id][1]*16}}}
function inRange(g){const p=g.player,hb=p.hitbox,r={x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24},pc=hb.x+hb.w/2,out=[];
  for(const it of g.interactives){if((it.collected||it.looted)&&it.type!=='rest')continue;if(rectOverlap(r,it))out.push([Math.abs(it.x+it.w/2-pc),it])}
  return out.sort((a,b)=>a[0]-b[0]).map(q=>q[1])}
function nearTerm(g){if(!g.player||!g.interactives)return null;const l=inRange(g);return l.length&&l[0].type==='rest'&&KEEP.has(l[0].id)?l[0]:null}
function engaged(e,px,py){const ex=e.x+(e.w||16)/2,ey=e.y+(e.h||24)/2,dx=px-ex,d=Math.hypot(dx,py-ey);
  if(e.atkPhase&&e.atkPhase!=='idle')return d<240;                       // atacando
  if(d<(e.aggroRange||95)+40)return true;                                 // dentro do alcance de perseguição
  return d<300&&Math.abs(e.vx||0)>.3&&Math.sign(e.vx)===Math.sign(dx)}  // vindo na sua direção
function busy(g){const p=g.player;if(p.dead)return true;
  const px=p.x+(p.w||16)/2,py=p.y+(p.h||24)/2;
  for(const e of g.enemies){if(!e.alive||e.permanentlyDead||e._proj||e.hidden)continue;if(engaged(e,px,py))return true}
  const b=g.boss;if(b&&b.alive!==false&&!g.bossDefeated&&Math.hypot(b.x-px,b.y-py)<260)return true;return false}
window.__svBusy=busy;
function zoneName(it){try{const z=zoneAt(Math.floor(it.x/16),Math.floor(it.y/16));return z&&z.name?z.name:'Casa Desfeita'}catch(e){return 'Casa Desfeita'}}

function startSave(g,it){const src=g.ctx.canvas,s=document.createElement('canvas');s.width=640;s.height=360;s.getContext('2d').drawImage(src,0,0,640,360);
  const cam=g.camera,h=((Math.floor(it.x/16)*73+Math.floor(it.y/16)*131)&0xfff).toString(16).toUpperCase().padStart(3,'0');
  g._sv={t:0,m:0,ph:'in',o:0,snap:s,fx:it.x+it.w/2-cam.x,fy:it.y-6-cam.y,zn:zoneName(it),hash:h,done:false,ready:false,fast:false,ang:0,prog:0,tick:0};
  g.state='save'}

// ---------- atualização ----------
const oU=G.update;
G.update=function(dt){
  if(this.state==='save'&&this._sv){svUpdate(this,sec(dt));return}
  if(this.interactives)prune(this);
  if(this.state==='playing'&&this.player){const s=sec(dt);}
  return oU.call(this,dt)};
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(this.input.interact()){const it=nearTerm(this);
    if(it){if(busy(this)){this.showMsg('Sem sinal. Há perigo por perto.');return}startSave(this,it);return}}
  const ts=this.interactives.filter(i=>i.type==='rest');for(const i of ts)i.type='_';
  try{return oHI.call(this)}finally{for(const i of ts)i.type='rest'}};

function svUpdate(g,s){const v=g._sv,i=g.input,p=g.player,press=i.confirm()||i.interact();
  if(v.ph==='in'){v.t+=s;if(v.t>=1){v.ph='mon';v.m=0}return}
  if(v.ph==='mon'){if(press){if(v.ready){v.ph='out';v.o=0;return}v.fast=true}
    v.m+=s*(v.fast?3.2:1);
    const pr=Math.max(0,Math.min(1,(v.m-3.0)/1.8));v.prog=pr;
    v.ang+=s*(pr>0&&pr<1?7:pr>=1?0:.4);
    if(pr>=1&&!v.done){v.done=true;p.hp=CONFIG.PLAYER.MAX_HP;p.energy=CONFIG.PLAYER.MAX_ENERGY;g.lastRest={x:p.x,y:p.y};g.saveGame()}
    if(v.m>6.2)v.ready=true;return}
  if(v.ph==='out'){v.o+=s/.8;if(v.o>=1){g._sv=null;g.state='playing';g.showMsg('Fita gravada. Progresso salvo.')}}}

// ---------- desenho da cena ----------
const L=(v)=>[{t:.1,s:'C:\\FLUXO\\FITA> gravar --estado mika.exe'},{t:1.0,s:'> procurando fita virgem... ok'},{t:1.8,s:'> setor: '+v.zn+'  [0x'+v.hash+']'},{t:2.6,s:'> gravando fita'},
  {t:4.9,s:'> vida e energia restauradas'},{t:5.5,s:'> fita gravada. progresso salvo.'}];
function cassette(c,v,t,x,y){const m=v.m;
  c.fillStyle='#120c14';c.fillRect(x-1,y-1,202,126);c.fillStyle='#2a2230';c.fillRect(x,y,200,124);c.fillStyle='#4a3f5c';c.fillRect(x,y,200,1);c.fillRect(x,y,1,124);c.fillStyle='#0c0810';c.fillRect(x,y+123,200,1);c.fillRect(x+199,y,1,124);
  for(const [sx,sy] of[[6,6],[188,6],[6,112],[188,112]]){c.fillStyle='#0c0810';c.fillRect(x+sx,y+sy,6,6);c.fillStyle='#6a5c7c';c.fillRect(x+sx+2,y+sy+2,2,2)}
  c.fillStyle='#d8cdb0';c.fillRect(x+16,y+10,168,44);c.fillStyle='#c8284a';c.fillRect(x+16,y+10,168,5);c.fillStyle='#2a1c28';c.fillRect(x+16,y+53,168,1);
  c.font='bold 8px '+HANDF;c.fillStyle='#7a2a44';c.textAlign='left';c.fillText('LÚMEN · FITA',x+22,y+24);
  c.font='14px '+HANDF;c.fillStyle='#2a1c28';let z=v.zn;while(z.length>3&&c.measureText(z).width>156)z=z.slice(0,-1);c.fillText(z,x+22,y+43);
  c.fillStyle='#0c0810';c.fillRect(x+44,y+60,112,38);c.fillStyle='#1c1424';c.fillRect(x+46,y+62,108,34);
  const a=v.ang;reel(c,x+70,y+79,16,a);reel(c,x+130,y+79,16,-a*1.15);
  c.strokeStyle='#5a3a24';c.lineWidth=1;c.beginPath();c.moveTo(x+70,y+95);c.lineTo(x+130,y+95);c.stroke();
  c.fillStyle='#0c0810';c.fillRect(x+28,y+104,144,14);c.fillStyle='#3a3048';for(let i=0;i<7;i++)c.fillRect(x+36+i*19,y+107,10,8);
  if(v.done){c.save();c.translate(x+138,y+40);c.rotate(-.12);c.strokeStyle='#c8284a';c.lineWidth=2;c.strokeRect(-36,-10,72,20);c.font='bold 13px monospace';c.fillStyle='#c8284a';c.textAlign='center';c.fillText('GRAVADO',0,5);c.restore()}}
function drawMon(g,c,v,t){
  c.fillStyle='#030806';c.fillRect(0,0,640,360);
  U.tm(1);try{
  win(c,20,14,600,332,'FITA.EXE - gravador de estado',{});
  const m=v.m,lines=L(v),X=36;let y=48;
  // linha ativa = última já iniciada
  let act=-1;lines.forEach((l,i)=>{if(m>=l.t)act=i});
  lines.forEach((l,i)=>{if(m<l.t)return;const n=Math.floor((m-l.t)*38),sh=l.s.slice(0,n),on=i===act&&!v.ready;
    if(on){c.fillStyle='#4a2f8a';c.fillRect(X-6,y-11,352,15)}
    tx(c,sh+(on&&n<l.s.length?'\u2588':''),X,y,10,on?'#f0e8ff':K.main,'left',on);
    if(l.s==='> gravando fita'&&m>=l.t+.6){const bx=X+96,by=y-8;seg(c,bx,by,150,8,v.prog,1,K.main,K.dark);tx(c,Math.round(v.prog*100)+'%',bx+158,y,10,K.hi)}
    y+=22});
  if(v.ready){const cx=Math.floor(t*2.2)%2?'\u2588':' ';tx(c,'C:\\FLUXO\\FITA> '+cx,X,y+4,10,K.main)}
  // cassete
  const sl=1-ease((m-.9)/.9);cassette(c,v,t,408,76+sl*260);
  tx(c,'FITA N\u00BA '+v.hash,508,222+sl*260,9,K.mid,'center');
  // rodapé
  c.fillStyle='#4a2f8a';c.fillRect(24,326,592,16);
  tx(c,v.ready?'ENTER':'ENTER',34,337,9,'#f0d060',false,true);
  tx(c,v.ready?'ejetar fita e voltar':'pular',72,337,9,'#f0e8ff');
  tx(c,v.ready?'FITA GRAVADA':'GRAVANDO...',606,337,9,v.ready?K.hi:'#e8d080','right',true);
  }finally{U.tm(-1)}
  scan(c,.14,20,14,600,332);vign(c,.55)}
function svDraw(g,c){const v=g._sv,t=performance.now()/1000;c.imageSmoothingEnabled=false;
  const zk=v.ph==='in'?ease(v.t/1):v.ph==='out'?1-ease(v.o):1;
  if(v.ph!=='mon'){c.fillStyle='#050308';c.fillRect(0,0,640,360);
    c.save();const s=1+zk*zk*11;c.translate(lerp(v.fx,320,zk),lerp(v.fy,180,zk));c.scale(s,s);c.translate(-v.fx,-v.fy);c.drawImage(v.snap,0,0);c.restore();
    c.fillStyle='rgba(95,240,160,'+(zk*.18)+')';c.fillRect(0,0,640,360)}
  const a=v.ph==='mon'?1:Math.max(0,Math.min(1,(zk-.55)/.4));
  if(a>0){c.save();c.globalAlpha=a;drawMon(g,c,v,t);c.restore()}}
const oD=G.draw;
G.draw=function(){
  if(this.state==='save'&&this._sv){svDraw(this,this.ctx);return}
  oD.call(this)};

// ---------- brilho e aviso no mundo ----------
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  fixSprite();oW.call(this,ctx);
  const c=this.camera,t=performance.now()/1000,near=this.state==='playing'?nearTerm(this):null;
  for(const it of this.interactives){if(it.type!=='rest'||!KEEP.has(it.id))continue;const x=Math.floor(it.x+it.w/2-c.x),y=Math.floor(it.y-c.y);if(x<-60||x>700||y<-60||y>420)continue;
    ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(x,y-6,2,x,y-6,34);const f=.12+.03*Math.sin(t*9+it.x)+(Math.sin(t*37+it.y)>.96?.05:0);
    gr.addColorStop(0,'rgba(95,240,160,'+f+')');gr.addColorStop(1,'rgba(95,240,160,0)');ctx.fillStyle=gr;ctx.fillRect(x-36,y-42,72,72);ctx.restore();
    if(near===it){const bz=busy(this),s=bz?'\u25B2 sem sinal':'E  gravar fita',w=s.length*6+12;ctx.save();ctx.textAlign='left';
      ctx.fillStyle=bz?'#5a1a2a':'#4a2f8a';ctx.fillRect(x-w/2,y-42,w,13);ctx.fillStyle='#000';ctx.fillRect(x-w/2,y-29,w,1);
      ctx.fillStyle=bz?'#ff8aa0':'#f0e8ff';ctx.font='9px monospace';ctx.fillText(s,x-w/2+6,y-32);ctx.restore()}}};
})();
