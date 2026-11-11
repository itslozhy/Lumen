/* ===== PRIORIDADE 2: PONTOS DE CONEXÃO, ECOS DIGITAIS, RECONSTRUÇÃO + MOBÍLIA DE CASA ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const B=(c,x,y,w,h,col)=>R(c,x,y-h,w,h,col);
const ens=p=>{p.flags=p.flags||{};p.records=p.records||[];return p};
const addRec=(p,t,s)=>{if(!p.records.some(r=>r[0]===t))p.records.push([t,s])};
// ---------- mundo: alcova selada no sótão ----------
const _bw=buildWorld;
buildWorld=function(){const g=_bw();for(let x=61;x<=65;x++)g[29][x]=1;for(let y=30;y<=33;y++)g[y][61]=1;return g};
const _bi=buildInteractives;
buildInteractives=function(){const a=_bi();
  a.push({type:'term',x:113*T,y:46*T,w:2*T,h:T,id:'term_lib',collected:false},{type:'term',x:56*T,y:32*T,w:2*T,h:T,id:'term_attic',collected:false},
   {type:'term',x:80*T,y:33*T,w:2*T,h:T,id:'term_tower',collected:false},{type:'item',x:63*T,y:31*T,w:T,h:T,id:'elx_mana_attic',item:'mana',collected:false});return a};
// ---------- pontos de conexão ----------
const CONN={
 term_lib:{name:'Terminal 03 — Arquivo da casa',ok:g=>true,lines:['> conectando...','registro encontrado: "inventário da casa"','Cômodos: 14   Moradoras: 3   Presentes: ?','A contagem muda toda vez que é lida.'],rec:['Inventário da casa','Moradoras: 3. A soma nunca fecha.']},
 term_attic:{name:'Terminal 07 — Reconstrução',ok:g=>ens(g.player).records.length>=1,
  deny:['> conectando...','acesso negado.','memória insuficiente: reúna ao menos um registro.'],lines:['> conectando...','reconstruindo trecho 07...','a parede lembra que um dia foi uma porta.'],rec:['Porta lembrada','A parede do sótão cedeu quando foi lembrada.'],fx:'attic'},
 term_tower:{name:'Terminal 11 — Transmissão',ok:g=>ens(g.player).records.length>=2,
  deny:['> conectando...','acesso negado.','sinal fraco: reúna dois registros.'],lines:['> conectando...','transmissão interceptada.','duas projeções de Mika se aproximam...'],fx:'tower'}};
const openConn=(g,it)=>{const C=CONN[it.id];g._conn={it,C,ok:C.ok(g),t:0};window.glitchFx&&window.glitchFx(g,.3)};
function shards(g,x,y,n){const S=g._sh3||(g._sh3=[]);for(let i=0;i<n;i++)S.push({x:x+Math.random()*14-7,y:y+Math.random()*14-7,vx:Math.random()*2-1,vy:-Math.random()*2,l:1+Math.random()*.7})}
function openAttic(g,anim){for(let y=30;y<=33;y++){if(anim&&g.grid[y][61]===1)shards(g,61*T+8,y*T+8,8);g.grid[y][61]=0}}
function spawnProj(g,x,y){const e=new Enemy('paper_doll',x,y);e._proj=true;e.hp=e.maxHp=36;e._born=performance.now();g.enemies.push(e)}
function finishConn(g){const c=g._conn,C=c.C,p=ens(g.player);g._conn=null;if(!c.ok)return;c.it.collected=true;
  if(C.rec){addRec(p,C.rec[0],C.rec[1]);g.showMsg('Registro: '+C.rec[0])}
  if(C.fx==='attic'){p.flags.attic=1;openAttic(g,true);window.glitchFx&&window.glitchFx(g,.5)}
  if(C.fx==='tower'){p.flags.tower=1;spawnProj(g,69*T,31*T);spawnProj(g,76*T,31*T);window.glitchFx&&window.glitchFx(g,.5)}}
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(!this._conn&&!this._choice&&this.input.interact()){const hb=this.player.hitbox,it=this.interactives.find(i=>i.type==='term'&&!i.collected&&rectOverlap({x:hb.x-10,y:hb.y-10,w:hb.w+20,h:hb.h+20},i));if(it){openConn(this,it);return}}
  return oHI.call(this)};
const oU=G.update;
G.update=function(dt){
  const s=dt>1?dt/1000:dt;
  if(this._conn){const c=this._conn;c.t+=s;if(c.t>1.8&&(this.input.interact()||this.input.confirm()))finishConn(this);return}
  oU.call(this,dt);const p=this.player;if(!p||this.state==='title'||!this.grid)return;ens(p);
  if(p.flags.attic&&this.grid[30][61]===1)openAttic(this,false);
  if(p.flags.tower===1){const alive=this.enemies.some(e=>e._proj&&e.alive);if(!alive&&this.enemies.some(e=>e._proj)){p.flags.tower=2;addRec(p,'Sinal limpo','Eram só cópias de Mika. Cansadas de seguir.');p.healItems++;this.showMsg('Sinal limpo. Você encontrou um Elixir de Vida entre os restos.');window.glitchFx&&window.glitchFx(this,.4)}}
  for(const e of this.enemies)if(e._proj&&!e.alive&&!e._died){e._died=performance.now();e.permanentlyDead=true}
  const S=this._sh3;if(S){for(const q of S){q.x+=q.vx;q.y+=q.vy;q.vy+=.04;q.l-=s}this._sh3=S.filter(q=>q.l>0)}
};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);if(this.player&&this.player.flags&&this.player.flags.tower===1)delete this.player.flags.tower};
// ---------- projeção digital (inimigo) ----------
const oED=Enemy.prototype.draw;
Enemy.prototype.draw=function(ctx,cam){
  if(!this._proj)return oED.call(this,ctx,cam);
  const now=performance.now(),t=now/1000,SP=window.SPRS;if(!SP)return;
  let a=1;if(!this.alive){if(!this._died||now-this._died>600)return;a=1-(now-this._died)/600}else a=Math.min(1,(now-this._born)/500);
  const mv=Math.abs(this.vx)>.05,atk=this.atkPhase&&this.atkPhase!=='idle',S=SP[atk?'mika_attack':mv?'mika_walk':'mika_idle'];if(!S||!S.i.naturalWidth)return;
  const sc=42/SP.mika_idle.ch,w=S.cw*sc,h=S.ch*sc,f=Math.floor(t*(atk?12:mv?10:5))%S.n,cx=this.x-cam.x+this.w/2,by=this.y-cam.y+this.h+2,gl=hs(Math.floor(t*14),this.spawnX)>.82;
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.filter='hue-rotate(250deg) saturate(1.7) brightness(1.15)';ctx.globalAlpha=.6*a;
  const fl=atk?this.facing<0:this.facing>0;
  for(let i=0;i<6;i++){const o=(gl||a<1)?(hs(i,Math.floor(t*20))-.5)*10:0;ctx.save();ctx.translate(cx+o,0);if(fl)ctx.scale(-1,1);ctx.drawImage(S.i,f*S.cw,i*S.ch/6,S.cw,S.ch/6,-w*.5,by-h+i*h/6,w,h/6+.5);ctx.restore()}
  ctx.filter='none';ctx.globalAlpha=.25*a;ctx.fillStyle='#b8a0d8';ctx.fillRect(cx-w/2,by-h*.5+Math.sin(t*9)*h*.3,w,1);ctx.restore()};
// ---------- desenho: terminais, parede em reconstrução ----------
const term=(c,x,y,st,t)=>{const b=y+T;R(c,x+6,b-3,20,3,'#2a2430');R(c,x+13,b-8,6,5,'#3a3040');R(c,x+3,b-28,26,20,'#2a2430');R(c,x+5,b-26,22,16,'#0c0814');
  if(st){R(c,x+7,b-23,18,1,'#4a3a5a');R(c,x+7,b-19,12,1,'#4a3a5a')}
  else{for(let j=0;j<5;j++){const w=6+(hs(j,Math.floor(t*3))*12|0);R(c,x+7,b-24+j*3,w,1,'rgba(184,160,216,.85)')}R(c,x+7+((t*14|0)%14),b-11,2,2,'#D8A0B0');c.fillStyle='rgba(184,160,216,.1)';c.beginPath();c.arc(x+16,b-18,24,0,TAU);c.fill()}
  R(c,x+24,b-9,2,1,st?'#4a2a3a':'#D27A8A')};
// ---------- cômodos de casa: mobília e detalhes por cena ----------
const P=window.PROPDEF={
 bed:[3,2,(c,x,y)=>{B(c,x,y,48,9,'#3a2620');B(c,x+2,y-9,34,5,'#cfc6c0');B(c,x+3,y-14,10,3,'#e6dcc6');B(c,x+14,y-14,22,5,'#7a4a5a');B(c,x,y,3,24,'#4a3026');B(c,x+45,y,3,16,'#4a3026')}],
 nightstand:[1,1,(c,x,y)=>{B(c,x+1,y,14,12,'#4a3026');R(c,x+2,y-6,12,1,'#1a100c');B(c,x+6,y-12,4,5,'#e8d090');L(x+8,y-16)}],
 wardrobe:[2,3,(c,x,y)=>{B(c,x,y,32,46,'#3a2620');B(c,x+15,y,2,46,'#1a100c');R(c,x+12,y-22,2,3,'#c8a860');R(c,x+19,y-22,2,3,'#c8a860');B(c,x-1,y-44,34,3,'#4a3026')}],
 rug:[4,0,(c,x,y)=>{R(c,x,y-2,60,2,'#5a2a3a');R(c,x+3,y-2,54,1,'#8a5a6a')}],
 lamp:[1,3,(c,x,y)=>{B(c,x+7,y,2,34,'#6a5a50');B(c,x+3,y-26,10,8,'#d8b878');L(x+8,y-28)}],
 toychest:[2,1,(c,x,y)=>{B(c,x,y,28,12,'#5a3a28');B(c,x,y-10,28,2,'#7a5a38');B(c,x+13,y,2,12,'#a05a6a')}],
 console:[2,2,(c,x,y)=>{B(c,x,y-14,32,3,'#4a3026');B(c,x+2,y,2,14,'#3a2620');B(c,x+28,y,2,14,'#3a2620');B(c,x+12,y-17,6,10,'#5a6a7a')}],
 vase:[1,2,(c,x,y)=>{B(c,x+4,y,8,14,'#5a6a7a');R(c,x+7,y-26,1,12,'#4a5a3a');R(c,x+5,y-28,5,3,'#8a5a6a')}],
 clockfloor:[1,4,(c,x,y,t)=>{B(c,x+2,y,12,56,'#4a3026');c.fillStyle='#d8cfc0';c.beginPath();c.arc(x+8,y-44,4,0,TAU);c.fill();R(c,x+7+Math.sin(t*3)*2,y-30,2,12,'#c8a860')}],
 bench:[2,1,(c,x,y)=>{B(c,x,y-6,32,3,'#4a3026');B(c,x+2,y,3,6,'#3a2620');B(c,x+27,y,3,6,'#3a2620')}],
 easel:[2,3,(c,x,y)=>{B(c,x+6,y-14,20,24,'#cfc6b8');R(c,x+14,y-30,5,6,'#3a2a3a');R(c,x+12,y-24,9,8,'#5a3a4a');R(c,x+8,y-14,1,16,'#4a3026');R(c,x+23,y-14,1,16,'#4a3026')}],
 statue:[1,3,(c,x,y)=>{c.fillStyle='#b8b0a8';c.beginPath();c.moveTo(x+2,y);c.lineTo(x+5,y-30);c.lineTo(x+11,y-30);c.lineTo(x+14,y);c.fill();c.beginPath();c.arc(x+8,y-34,4,0,TAU);c.fill()}],
 plinth:[1,2,(c,x,y)=>{B(c,x+2,y,12,18,'#8a8090');c.fillStyle='#cfc6b8';c.beginPath();c.arc(x+8,y-23,4,0,TAU);c.fill()}],
 shelf:[2,4,(c,x,y)=>{B(c,x,y,32,60,'#3a2620');for(let r=0;r<4;r++){R(c,x+2,y-14-r*14,28,1,'#1a100c');for(let i=0;i<8;i++)R(c,x+2+i*3.4,y-26+(3-r)*0-r*14+14-12,2.4,10,['#7a3a4a','#3a4a6a','#6a5a3a','#4a6a5a'][(i+r)%4])}}],
 desk:[3,2,(c,x,y)=>{B(c,x,y-16,44,4,'#4a3026');B(c,x+2,y,3,16,'#3a2620');B(c,x+39,y,3,16,'#3a2620');R(c,x+8,y-18,8,2,'#d8cfc0');R(c,x+30,y-25,2,8,'#c8a860');R(c,x+28,y-27,6,3,'#d8b878');L(x+31,y-24)}],
 globe:[1,2,(c,x,y)=>{B(c,x+7,y,2,16,'#6a5a50');c.fillStyle='#4a6a7a';c.beginPath();c.arc(x+8,y-20,6,0,TAU);c.fill();c.strokeStyle='#c8a860';c.beginPath();c.arc(x+8,y-20,7,-1,1);c.stroke()}],
 chair:[1,2,(c,x,y)=>{B(c,x+3,y-8,10,2,'#4a3026');B(c,x+3,y,2,22,'#3a2620');B(c,x+11,y,2,8,'#3a2620');R(c,x+3,y-22,2,2,'#4a3026')}],
 trunk:[2,1,(c,x,y)=>{B(c,x,y,28,14,'#4a3020');B(c,x,y-9,28,2,'#2a1810');B(c,x+12,y,4,14,'#a08040')}],
 mannequin:[1,3,(c,x,y)=>{B(c,x+7,y,2,34,'#6a5a50');c.fillStyle='#cfc6c0';c.beginPath();c.moveTo(x+3,y-12);c.lineTo(x+5,y-30);c.lineTo(x+11,y-30);c.lineTo(x+13,y-12);c.fill();R(c,x+6,y-33,4,3,'#8a6a72')}],
 crate:[1,1,(c,x,y)=>{B(c,x+1,y,14,14,'#5a4028');R(c,x+1,y-8,14,1,'#2a1c10');R(c,x+7,y-14,1,14,'#2a1c10')}],
 crib:[2,2,(c,x,y)=>{B(c,x,y-16,32,2,'#cfc6b8');for(let i=0;i<8;i++)B(c,x+2+i*4,y-4,1,14,'#cfc6b8');B(c,x+2,y-6,28,3,'#e6dcc6')}],
 rockinghorse:[2,2,(c,x,y,t)=>{R(c,x+4,y-3+Math.sin(t*2)*0,24,2,'#4a3026');B(c,x+8,y-4,16,10,'#8a6a52');B(c,x+20,y-14,6,12,'#8a6a52');R(c,x+24,y-24,5,4,'#3a2a22')}],
 sofa:[3,2,(c,x,y)=>{B(c,x,y-4,46,12,'#5a2a3a');B(c,x+2,y-12,42,12,'#6a3a4a');B(c,x,y,5,20,'#4a2030');B(c,x+41,y,5,20,'#4a2030')}],
 armchair:[2,2,(c,x,y)=>{B(c,x,y-4,30,12,'#5a2a3a');B(c,x+2,y-12,26,12,'#6a3a4a');B(c,x,y,4,18,'#4a2030');B(c,x+26,y,4,18,'#4a2030')}],
 fireplace:[3,3,(c,x,y,t)=>{B(c,x,y,48,40,'#4a4048');B(c,x+10,y,28,22,'#0c0808');B(c,x-2,y-38,52,4,'#3a3038');for(let i=0;i<4;i++){c.fillStyle=i%2?'#ff7a3a':'#ffe08a';c.beginPath();c.moveTo(x+14+i*6,y);c.lineTo(x+17+i*6,y-8-Math.sin(t*9+i)*4-6);c.lineTo(x+20+i*6,y);c.fill()}L(x+24,y-10,1)}],
 barrel:[1,2,(c,x,y)=>{B(c,x+2,y,12,18,'#5a3a24');R(c,x+2,y-6,12,1,'#2a1a10');R(c,x+2,y-13,12,1,'#2a1a10')}],
 shelfjars:[2,3,(c,x,y)=>{B(c,x,y,32,46,'#3a2620');for(let r=0;r<3;r++){R(c,x+2,y-12-r*14,28,1,'#1a100c');for(let i=0;i<5;i++)B(c,x+3+i*5.6,y-14-r*14+14,4,9,['#5a7a6a','#8a5a6a','#6a6a8a'][(i+r)%3])}}],
 sewing:[2,2,(c,x,y,t)=>{B(c,x+2,y-14,28,3,'#4a3026');B(c,x+4,y,2,14,'#3a2620');B(c,x+26,y,2,14,'#3a2620');B(c,x+8,y-14,14,10,'#2a2a30');R(c,x+20,y-28,3,6,'#7a7088');R(c,x+21,y-22,1,8+Math.sin(t*8)*2,'#D27A8A')}],
 spools:[1,1,(c,x,y)=>{B(c,x+1,y,4,8,'#D27A8A');B(c,x+6,y,4,8,'#8a6ab8');B(c,x+11,y,4,8,'#e6dcc6')}],
 table:[3,2,(c,x,y)=>{B(c,x,y-16,44,4,'#4a3026');B(c,x+2,y,3,16,'#3a2620');B(c,x+39,y,3,16,'#3a2620');B(c,x+2,y-20,40,2,'#cfc6c0')}],
 pew:[3,2,(c,x,y)=>{B(c,x,y-8,44,3,'#4a3026');B(c,x,y-20,44,3,'#3a2620');B(c,x,y,3,22,'#3a2620');B(c,x+41,y,3,22,'#3a2620')}],
 altar:[3,3,(c,x,y,t)=>{B(c,x,y,46,22,'#4a4048');B(c,x+4,y-22,38,3,'#cfc6c0');R(c,x+8,y-32,3,8,'#e6dcc6');R(c,x+35,y-32,3,8,'#e6dcc6');R(c,x+22,y-46,2,14,'#c8a860');R(c,x+18,y-42,10,2,'#c8a860');F(c,x+9,y-34,t);F(c,x+36,y-34,t);L(x+23,y-34,1)}],
 candles:[1,1,(c,x,y,t)=>{B(c,x+2,y,3,7,'#e6dcc6');B(c,x+7,y,3,10,'#e6dcc6');B(c,x+12,y,3,6,'#e6dcc6');F(c,x+3,y-8,t);F(c,x+8,y-11,t);F(c,x+13,y-7,t);L(x+8,y-10,1)}],
 planter:[2,1,(c,x,y)=>{B(c,x,y,28,10,'#5a3a28');for(let i=0;i<5;i++){R(c,x+3+i*5,y-18,1,8,'#3a6a3a');R(c,x+2+i*5,y-21,3,3,i%2?'#D8A0B0':'#E6DCC6')}}],
 fountain:[3,2,(c,x,y,t)=>{B(c,x,y,44,10,'#6a6070');R(c,x+4,y-9,36,2,'#5a7a9a');B(c,x+20,y-10,4,16,'#7a7080');R(c,x+21,y-26+((t*20)%10),2,2,'#9ab8d8')}],
 trellis:[2,4,(c,x,y)=>{c.strokeStyle='#4a3a28';for(let i=0;i<5;i++){c.beginPath();c.moveTo(x+i*7,y);c.lineTo(x+i*7,y-56);c.stroke()}for(let j=0;j<5;j++)R(c,x,y-j*12-4,32,1,'#4a3a28');for(let k=0;k<7;k++){R(c,x+hs(k,1)*28,y-hs(k,2)*52,3,3,'#3a6a3a');if(k%3===0)R(c,x+hs(k,1)*28,y-hs(k,2)*52,2,2,'#D27A8A')}}],
 vanity:[2,3,(c,x,y)=>{B(c,x,y-14,28,3,'#4a3026');B(c,x+2,y,2,14,'#3a2620');B(c,x+24,y,2,14,'#3a2620');c.fillStyle='#6a6280';c.beginPath();c.ellipse(x+14,y-30,8,12,0,0,TAU);c.fill();c.strokeStyle='#c8a860';c.stroke()}],
 mirrorstand:[1,4,(c,x,y)=>{R(c,x+3,y-52,10,40,'#5a5270');c.strokeStyle='#3a2820';c.strokeRect(x+2.5,y-52.5,11,41);R(c,x+2,y-12,2,12,'#3a2820');R(c,x+12,y-12,2,12,'#3a2820')}],
 telescope:[2,3,(c,x,y)=>{c.strokeStyle='#4a3a28';c.beginPath();c.moveTo(x+10,y);c.lineTo(x+16,y-16);c.lineTo(x+22,y);c.stroke();c.save();c.translate(x+16,y-18);c.rotate(-.9);R(c,-4,-4,26,6,'#8a7a60');R(c,18,-5,6,8,'#5a5040');c.restore()}],
 radio:[1,1,(c,x,y,t)=>{B(c,x+2,y,12,9,'#4a3026');R(c,x+4,y-7,6,4,'#c8a860');R(c,x+11,y-6,2,2,hs(Math.floor(t*6),1)>.5?'#D27A8A':'#4a2a3a')}],
 candelabra:[1,3,(c,x,y,t)=>{B(c,x+7,y,2,26,'#c8a860');R(c,x+2,y-26,12,2,'#c8a860');F(c,x+3,y-30,t);F(c,x+7,y-31,t);F(c,x+12,y-30,t);L(x+8,y-30,1)}],
 stove:[2,3,(c,x,y,t)=>{B(c,x,y,32,26,'#2a2428');R(c,x+6,y-14,12,8,'#ff7a3a');R(c,x+8,y-12,8,4,'#ffe08a');B(c,x+24,y-26,4,20,'#2a2428');B(c,x+4,y-26,14,8,'#4a4a54');R(c,x+8+Math.sin(t*3)*2,y-38-((t*8)%6),3,3,'rgba(230,220,210,.4)');L(x+12,y-10,1)}],
 sink:[2,2,(c,x,y)=>{B(c,x,y,30,16,'#4a4048');B(c,x+2,y-16,26,3,'#8a9aa8');R(c,x+14,y-26,2,10,'#8a9aa8');R(c,x+14,y-26,6,2,'#8a9aa8')}],
 pantry:[2,4,(c,x,y)=>{B(c,x,y,32,58,'#3a2620');B(c,x+15,y,2,58,'#1a100c');R(c,x+4,y-50,10,12,'#4a5a5a');R(c,x+19,y-50,10,12,'#4a5a5a');R(c,x+12,y-28,2,3,'#c8a860')}],
 oldbed:[3,2,(c,x,y)=>{B(c,x,y-8,46,2,'#5a4a40');B(c,x,y,2,20,'#5a4a40');B(c,x+44,y,2,14,'#5a4a40');B(c,x+2,y-10,40,3,'#6a5a58')}],
 chests:[1,1,(c,x,y)=>{B(c,x+1,y,14,10,'#6a4a28');R(c,x+1,y-6,14,1,'#c8a860');R(c,x+7,y-8,2,3,'#c8a860')}],
 gear:[1,2,(c,x,y,t)=>{c.save();c.translate(x+8,y-14);c.rotate(t*.6);c.strokeStyle='#7a7088';c.lineWidth=2;c.beginPath();c.arc(0,0,8,0,TAU);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;R(c,Math.cos(a)*8-1,Math.sin(a)*8-1,3,3,'#7a7088')}c.restore()}]};
let LT=null;const L=(x,y,big)=>{if(LT)LT.push([x,y,big])};
const F=(c,x,y,t)=>{c.fillStyle='#ffd78a';c.beginPath();c.moveTo(x+1,y);c.lineTo(x+2,y-3-Math.sin(t*10+x)*1);c.lineTo(x+3,y);c.fill()};
const PLAN={bedroom:['bed','nightstand','wardrobe','rug','lamp','toychest','bench'],portrait_hall:['console','vase','clockfloor','bench','rug'],gallery:['easel','statue','plinth','bench','vase'],
 dead_library:['shelf','shelf','desk','globe','shelf','chair'],attic:['trunk','mannequin','crate','crib','rockinghorse','trunk'],clock_tower:['gear','crate','barrel'],
 sunken_hall:['sofa','armchair','fireplace','rug','vase'],cellar_path:['barrel','shelfjars','crate','barrel'],stairwell:['lamp','bench','vase','clockfloor'],
 basement:['sewing','mannequin','spools','table','shelfjars'],sewers:['barrel','crate','barrel'],chapel:['pew','pew','altar','candles','pew'],
 garden:['planter','bench','fountain','trellis','planter'],mirror_hall:['vanity','chair','mirrorstand','console'],observatory:['telescope','desk','chair','globe'],
 antechamber:['rug','radio','candelabra','bench','console'],kitchen:['stove','table','sink','pantry','barrel'],pinnacle:['crate','gear','barrel'],clock_hall:['clockfloor','bench','vase'],
 suspended_lib:['shelf','desk','shelf','globe','chair'],basement2:['barrel','crate','oldbed','shelfjars','chests'],d1:['oldbed','barrel','crate','shelfjars','chair'],
 d2:['oldbed','barrel','crate','shelfjars','chair'],d3:['oldbed','barrel','crate','shelfjars','chair'],vault:['chests','candelabra','table'],r1:['crate','barrel'],r2:['crate','barrel'],r3:['crate','barrel'],r4:['crate','barrel']};
let PROPS=null;
function build(g){PROPS=[];const zs=ZONES;
  for(const z of zs){const L0=PLAN[z.id];if(!L0)continue;const fr=z.y+z.h-1;let x=z.x+2;
    while(x<z.x+z.w-3){let placed=false;const i0=Math.floor(hs(x,z.x+z.y)*L0.length);
      for(let k=0;k<L0.length&&!placed;k++){const nm=L0[(i0+k)%L0.length],def=P[nm],w=def[0],h=def[1];let ok=true;
        for(let i=0;i<w&&ok;i++){if(g[fr][x+i]!==1)ok=false;for(let j=1;j<=h&&ok;j++)if(g[fr-j][x+i]!==0)ok=false}
        if(ok&&g.__iv.some(o=>o.x/T>x-1&&o.x/T<x+w+1&&o.y/T>fr-4&&o.y/T<=fr))ok=false;
        if(ok&&g.__hz.some(o=>o.x/T>x-1&&o.x/T<x+w+1&&o.y/T>fr-3&&o.y/T<=fr+1))ok=false;
        if(ok){PROPS.push({z:z.id,nm,x:x*T,y:fr*T,w:w*T});x+=w+1+Math.floor(hs(x,3)*3);placed=true}}
      if(!placed)x++}}window.PROPS_DBG=PROPS}
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);const c=this.camera,t=performance.now()/1000,p=ens(this.player);
  if(!PROPS||PROPS.__g!==this.grid){this.grid.__iv=this.interactives.filter(i=>i.type!=='painting');this.grid.__hz=this.hazards||[];build(this.grid);PROPS.__g=this.grid}
  LT=window.WL||(window.WL=[]);const DC=window.decoBegin(ctx),DCp=window.decoBegin2?window.decoBegin2(ctx):DC;
  for(const q of PROPS){const x=q.x-c.x,y=q.y-c.y;if(x<-70||x>700||y<-20||y>420)continue;P[q.nm][2]((window.PROPSPR&&window.PROPSPR.has(q.nm))?DC:DCp,x,y,t)}
  for(const it of this.interactives){if(it.type!=='term')continue;const x=it.x-c.x,y=it.y-c.y;if(x<-40||x>680)continue;(window.TERMDRAW||term)(DC,x,y,it.collected,t)}if(window.decoEnd2)window.decoEnd2(ctx);window.decoEnd(ctx);
  // parede em reconstrução (alcova do sótão)
  if(this.grid[30]&&this.grid[30][61]===1){const x=61*T-c.x,y=30*T-c.y;if(x>-40&&x<680){for(let j=0;j<4;j++)for(let i=0;i<T;i+=2){const k=hs(i+j*7,Math.floor(t*10));ctx.fillStyle='rgba('+(120+k*80|0)+',70,'+(180+k*70|0)+','+(.25+k*.3)+')';ctx.fillRect(x+i,y+j*T+((k*T)|0),2,3)}ctx.strokeStyle='rgba(184,160,216,.7)';ctx.strokeRect(x+3.5,y+3.5,T-7,4*T-7);ctx.fillStyle='rgba(184,160,216,.15)';ctx.fillRect(x,y,T,4*T)}}
  if(this._sh3)for(const q of this._sh3){const a=Math.min(1,q.l);ctx.fillStyle='rgba(184,160,216,'+a+')';ctx.fillRect(q.x-c.x,q.y-c.y,2,2)}
  // luzes das fontes de fogo/velas no escuro
  LT=null;
};
const oH=G.drawHUD;
G.drawHUD=function(ctx){
  oH.call(this,ctx);const cn=this._conn;if(!cn)return;const t=cn.t;
  ctx.fillStyle='rgba(4,2,8,.7)';ctx.fillRect(0,0,640,360);
  window.COL.panel(ctx,106,56,428,218,'mon',cn.C.name.length);ctx.lineWidth=1;
  for(let y=70;y<266;y+=3){ctx.fillStyle='rgba(184,160,216,.04)';ctx.fillRect(112,y,416,1)}
  ctx.fillStyle='#D8A0B0';ctx.font='11px Courier New, monospace';ctx.fillText('[ '+cn.C.name+' ]',126,84);
  const lines=cn.ok?cn.C.lines:cn.C.deny;let chars=Math.floor(Math.max(0,t-.3)*38);ctx.font='13px Courier New, monospace';
  lines.forEach((l,i)=>{const take=Math.max(0,Math.min(l.length,chars));chars-=l.length;let s=l.slice(0,take);
    if(i===0&&t<1.2)s=l.slice(0,Math.min(l.length-3,take))+'.'.repeat(Math.floor(t*4)%4);
    ctx.fillStyle=(!cn.ok&&i>=1)?'#e0607a':'#B8A0D8';ctx.fillText(s,126,112+i*24)});
  if(t>1.8){ctx.fillStyle='#7A6B8B';ctx.font='11px Courier New, monospace';ctx.fillText('E — encerrar conexão',126,254)}
};
})();
