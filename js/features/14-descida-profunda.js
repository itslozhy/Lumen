/* ===== DESCIDA PROFUNDA: Câmaras, Ala do Véu (mini boss), salas ascendentes e passagem selada ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const Z=(id,name,x,y,w,h,wall,fl)=>ZONES.push({id,name,x,y,w,h,theme:'cellar',wall,floor:fl,accent:'#3a8a5a',bg:'#040708'});
Z('d1','Câmara dos Ecos',50,140,50,14,'#241814','#33241c');Z('d2','Salão das Vozes',20,156,60,14,'#21150f','#2e2018');Z('d3','Ala do Véu',40,172,40,14,'#1c110d','#281a14');
Z('bossroom','Sala do Espírito',79,172,41,14,'#180e0b','#24160f');
Z('r1','Passagem do Fluxo I',119,172,32,14,'#1c110d','#281a14');Z('r2','Passagem do Fluxo II',120,156,31,14,'#21150f','#2e2018');
Z('r3','Passagem do Fluxo III',120,140,31,14,'#241814','#33241c');Z('r4','Passagem do Fluxo IV',120,124,31,14,'#2a1a16','#3a2820');
window.FOVLV={basement2:1,d1:2,d2:3,d3:4,bossroom:4,r1:3,r2:2,r3:1,r4:1};
const LAD2=[{tx:74,y0:131,y1:152},{tx:52,y0:153,y1:168},{tx:76,y0:169,y1:184},{tx:140,y0:169,y1:184},{tx:122,y0:153,y1:168},{tx:140,y0:137,y1:152},{tx:148,y0:111,y1:136}];
(window.LAD=window.LAD||[]).push(...LAD2);
// ---- mundo ----
const _bw=buildWorld;
buildWorld=function(){
  const g=_bw();
  const fill=(x,y,w,h,v)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=v};
  const hl=(x,y,w,v=1)=>fill(x,y,w,1,v),room=(x,y,w,h)=>{hl(x,y,w);hl(x,y+h-1,w);fill(x,y,1,h,1);fill(x+w-1,y,1,h,1)};
  const shaft=(x,y0,y1)=>{for(let y=y0;y<=y1;y++){g[y][x]=0;g[y][x+1]=0}};
  const P=(arr)=>arr.forEach(p=>hl(p[0],p[1],p[2],2));
  room(50,140,50,14);room(20,156,60,14);room(40,172,40,14);room(79,172,41,14);
  room(119,172,32,14);room(120,156,31,14);room(120,140,31,14);room(120,124,31,14);
  shaft(74,132,140);shaft(52,153,156);shaft(76,169,172);shaft(140,169,172);shaft(122,153,156);shaft(140,137,140);shaft(148,112,124);
  fill(79,182,1,3,0);
  fill(111,173,8,12,1);
  P([[56,148,5],[64,145,5],[84,148,5],[90,145,5],[71,146,8]]);fill(60,150,2,3,1);fill(88,150,2,3,1);
  P([[24,164,5],[34,161,5],[44,164,5],[50,163,7],[64,162,5],[70,165,5]]);fill(38,166,2,3,1);fill(66,166,2,3,1);
  P([[73,179,7],[46,180,5],[56,177,5],[64,180,5]]);fill(50,182,2,3,1);fill(60,182,2,3,1);
  P([[88,180,6],[100,178,6]]);
  P([[124,180,5],[130,177,5],[134,180,4],[128,164,5],[134,161,5],[126,148,5],[132,145,5],[126,132,5],[132,129,5]]);
  return g;
};
const _bi=buildInteractives;
buildInteractives=function(){
  const a=_bi(),Tt=T;
  a.push({type:'hatch2',x:74*Tt,y:130*Tt,w:2*Tt,h:Tt,id:'hatch2',open:0},
   {type:'veil_seal',x:148*Tt,y:110*Tt,w:2*Tt,h:Tt,id:'veil_seal',collected:false},
   {type:'rest',x:76*Tt,y:152*Tt,w:2*Tt,h:Tt,id:'rest_c1'},{type:'rest',x:73*Tt,y:168*Tt,w:2*Tt,h:Tt,id:'rest_c2'},
   {type:'rest',x:82*Tt,y:184*Tt,w:2*Tt,h:Tt,id:'rest_br'},{type:'rest',x:122*Tt,y:184*Tt,w:2*Tt,h:Tt,id:'rest_r1'},{type:'rest',x:144*Tt,y:136*Tt,w:2*Tt,h:Tt,id:'rest_r4'},
   {type:'book',x:77*Tt,y:184*Tt,w:Tt,h:Tt,id:'book_veil'});
  let n=0;const pa=(x,y)=>a.push({type:'painting',x:x*Tt,y:y*Tt,w:2*Tt,h:3*Tt,id:'paint_d'+(++n)});
  [[57,143],[94,143],[22,159],[58,158],[44,176],[72,175],[86,176],[106,176]].forEach(p=>pa(p[0],p[1]));
  return a};
const _be=buildEnemies;
buildEnemies=function(){const a=_be().filter(e=>!(e.x===72*T&&e.y===126*T));
  [['paper_doll',56,150],['specter_rat',62,150],['broken_marionette',68,150],['paper_doll',80,150],['specter_rat',85,150],['broken_marionette',92,150],['paper_doll',58,145],['specter_rat',66,142],
   ['paper_doll',23,165],['specter_rat',36,165],['broken_marionette',42,165],['paper_doll',47,165],['specter_rat',55,165],['broken_marionette',68,165],['paper_doll',72,165],['specter_rat',35,158],['broken_marionette',65,159],['paper_doll',26,161],
   ['paper_doll',43,182],['specter_rat',53,182],['broken_marionette',56,182],['paper_doll',62,182],['specter_rat',70,182],['broken_marionette',74,182],['specter_rat',47,176],['broken_marionette',57,173],['paper_doll',65,176],['specter_rat',75,175],['paper_doll',48,178],
   ['specter_rat',126,182],['paper_doll',132,182],['broken_marionette',130,165],['paper_doll',128,150],['specter_rat',128,134]].forEach(e=>a.push({type:e[0],x:e[1]*T,y:e[2]*T}));
  a.push({type:'broken_marionette',x:108*T,y:181*T});return a};
const _bh=buildHazards;
buildHazards=function(){const a=_bh();
  for(const [x0,x1,y] of [[28,32,168],[58,62,168],[44,47,184],[66,69,184]])for(let x=x0;x<=x1;x++)a.push({x:x*T,y:y*T+8,w:T,h:8});return a};
// ---- quadros e livro ----
const POOL=[['A Voz que Chamava',['Eu te chamei tantas vezes que virei eco.','Agora respondo só quando você está de costas.']],
 ['O Quarto Fechado',['Trancaram a porta por fora. Disseram que era para o seu bem.','Bem... é uma palavra que dói diferente aqui embaixo.']],
 ['A Mão no Cobertor',['Segurei sua mão até esfriar.','Não foi você quem soltou. Foi o tempo. Mas você se culpa igual.']],
 ['O Sino que Parou',['Cada degrau para baixo é um dia que você não contou.','Quantos faltam até o fundo do véu?']],
 ['A Menina Maior',['Cresci o que ela não pôde.','Quer ver como seria? Olhe fundo. Mais fundo.']],
 ['O Coro Sem Boca',['Estamos todos falando ao mesmo tempo.','Pare de tentar ouvir uma voz só. Deixe todas passarem.']],
 ['A Cama Vazia',['Alguém dormia aqui. Alguém deixou de dormir.','Os lençóis ainda guardam o formato do medo.']],
 ['O Último Retrato',['Falta pouco. Ela já escuta o fluxo.','Não lute contra as vozes. Elas só querem ser ouvidas.']]];
for(let n=1;n<=8;n++)window.PAINTV['paint_d'+n]=window.PAINTV['paint_b'+((n%8)+1)];
const oPT=window.paintTalk;
window.paintTalk=function(g,it){const m=/^paint_d(\d+)$/.exec(it.id);if(!m)return oPT(g,it);const e=POOL[(+m[1])%POOL.length];g.dialog={name:e[0],lines:e[1]};g.dialogIndex=0;g.state='dialog'};
const BKX={book_veil:['"O véu não é uma parede. É uma correnteza."','"Quem tenta segurar cada voz se afoga."','"Quem as deixa passar... aprende a atravessar."']};
// ---- chefe sem barra: aparição, morte, desbloqueio ----
const oEU=Enemy.prototype.update;
Enemy.prototype.update=function(dt,pl,grid){
  if(this._sb===undefined){oEU.call(this,dt,pl,grid);if(this._sb){this.hidden=true;this.aggro=false}return}
  if(this._sb&&this.hidden)return;
  return oEU.call(this,dt,pl,grid)};
const oED=Enemy.prototype.draw;Enemy.prototype.draw=function(ctx,cam){if(this._sb&&this.hidden)return;return oED.call(this,ctx,cam)};
const oET=Enemy.prototype.takeDamage;Enemy.prototype.takeDamage=function(a){if(this._sb&&this.hidden)return;return oET.call(this,a)};
function shards(g,x,y,n){const S=g._sh||(g._sh=[]);for(let i=0;i<n;i++)S.push({x:x+Math.random()*16-8,y:y+Math.random()*16-8,vx:Math.random()*2-1,vy:-Math.random()*2.2,l:1+Math.random()*.8})}
function openVeil(g,anim){
  const seal=g.interactives.find(i=>i.id==='veil_seal');
  if(!anim){for(let y=177;y<=184;y++)for(let x=111;x<=119;x++)g.grid[y][x]=0;g.grid[111][148]=0;g.grid[111][149]=0;if(seal)seal.collected=true;return}
  g._vw={t:0,hole:false};g._flash=.7;
}
window.bossDeath=function(g,b){g.dialog={name:'Espírito do Véu',lines:['Não me segure. Não segure nada.','Deixe tudo passar. Deixe cada voz correr por você.','Siga o fluxo delas, Mika... e atravessará o véu.']};g.dialogIndex=0;g.state='dialog';g._unlock=true};
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  const p=this.player,hb=p.hitbox,ov=i=>rectOverlap({x:hb.x-10,y:hb.y-10,w:hb.w+20,h:hb.h+20},i);
  if(this.input.interact()){
    const h=this.interactives.find(i=>i.type==='hatch2'&&ov(i));
    if(h){if(!h.open){h.open=1;this.grid[131][74]=0;this.grid[131][75]=0;shards(this,75*T,131*T,10);this.showMsg('O alçapão cede. Um buraco estreito desce na escuridão...')}return}
    const s=this.interactives.find(i=>i.type==='veil_seal'&&ov(i));
    if(s){this.showMsg(s.collected?'O véu abriu uma passagem para baixo.':'Um véu selado cobre o chão. Só se abrirá quando o espírito cair.');return}
  }
  const had=this.dialog;oHI.call(this);
  if(!had&&this.dialog&&this.state==='dialog'){const b=this.interactives.filter(i=>i.type==='book'&&BKX[i.id]&&ov(i))[0];if(b)this.dialog={name:'Livro',lines:BKX[b.id]}}
};
const oU=G.update;
G.update=function(dt){
  oU.call(this,dt);const p=this.player,s=dt>1?dt/1000:dt;if(!p||this.state==='title'||!this.enemies)return;
  const b=this.enemies.find(e=>e._sb);
  if(b&&b.hidden&&!b._introDone&&!p.hasStitch&&this.state==='playing'&&!this.dialog&&p.x/T>=84&&p.x/T<118&&p.y/T>172){
    b._intro=true;b._introDone=true;this.dialog={name:'O Véu',lines:['O ar se parte em fios verdes...','O ESPÍRITO DO VÉU surge diante de você.']};this.dialogIndex=0;this.state='dialog'}
  if(b&&b._intro&&b.hidden&&this.state==='playing'&&!this.dialog){b.hidden=false;b.aggro=true;b._intro=false;shards(this,b.x+14,b.y+16,18);this._flash=.5}
  if(this._unlock&&this.state==='playing'&&!this.dialog){this._unlock=false;p.hasStitch=true;this.showMsg(p.dashMode==='cut'?'Dash de Ruptura desbloqueado! (C) — ofensivo, causa dano. A parede do véu se desfaz...':'Dash de Acolhimento desbloqueado! (C) — intangível, alcance bem maior. A parede do véu se desfaz...');openVeil(this,true)}
  const v=this._vw;
  if(v){v.t+=s;const k=Math.min(8,Math.floor(v.t/.2));for(let r=0;r<k;r++)if(this.grid[177+r][111]!==0){for(let x=111;x<=119;x++)this.grid[177+r][x]=0;shards(this,111*T+8,(177+r)*T+8,8);shards(this,115*T+8,(177+r)*T+8,4)}
    if(v.t>1.8&&!v.hole){v.hole=true;this.grid[111][148]=0;this.grid[111][149]=0;shards(this,149*T,111*T,16);const sl=this.interactives.find(i=>i.id==='veil_seal');if(sl)sl.collected=true}
    if(v.t>2.6)this._vw=null}
  const S=this._sh;if(S){for(const q of S){q.x+=q.vx;q.y+=q.vy;q.vy+=.04;q.l-=s}this._sh=S.filter(q=>q.l>0)}
  if(this._flash>0)this._flash-=s;
};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);if(this.player&&this.player.hasStitch&&this.interactives)openVeil(this,false)};
// ---- desenho: alçapão, selo do véu, escadas, fragmentos ----
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);
  const c=this.camera,t=performance.now()/1000,st=ENV.stairs;
  if(st&&st.ok)for(const l of LAD2){const x=l.tx*T-c.x+1;if(x<-20||x>660)continue;for(let y=l.y0*T;y<(l.y1+1)*T;y+=19){const sy=y-c.y;if(sy>-20&&sy<380)ctx.drawImage(st.i,x,sy,14,19)}}
  for(const h of this.interactives){
    if(h.type==='hatch2'){const x=h.x-c.x,y=h.y-c.y;if(x<-40||x>680)continue;
      if(!h.open){ctx.fillStyle='#4a3a5a';ctx.fillRect(x+1,y+T-5,h.w-2,5);ctx.fillStyle='#2a2038';for(let i=0;i<h.w;i+=8)ctx.fillRect(x+i,y+T-5,1,5);ctx.strokeStyle='#c9bde0';ctx.beginPath();ctx.arc(x+h.w/2,y+T-3,2.2,0,TAU);ctx.stroke()}
      else{ctx.fillStyle='#030204';ctx.fillRect(x+1,y+T-1,h.w-2,2);ctx.fillStyle='#4a3a5a';ctx.fillRect(x+h.w-3,y+T-12,3,12)}}
    if(h.type==='veil_seal'){const x=h.x-c.x,y=h.y-c.y;if(x<-40||x>680)continue;
      if(!h.collected){const a=.55+.3*Math.sin(t*3);ctx.fillStyle='rgba(20,60,40,.85)';ctx.fillRect(x,y+T-4,h.w,4);ctx.strokeStyle='rgba(110,255,170,'+a+')';ctx.beginPath();ctx.arc(x+h.w/2,y+T-2,9,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+h.w/2-6,y+T-2);ctx.lineTo(x+h.w/2+6,y+T-2);ctx.stroke();
        const g=ctx.createRadialGradient(x+h.w/2,y+T-3,1,x+h.w/2,y+T-3,26);g.addColorStop(0,'rgba(110,255,170,'+.25*a+')');g.addColorStop(1,'rgba(110,255,170,0)');ctx.fillStyle=g;ctx.fillRect(x-14,y-20,h.w+28,40)}
      else{const g=ctx.createLinearGradient(0,y+T,0,y-20);g.addColorStop(0,'rgba(110,255,170,.3)');g.addColorStop(1,'rgba(110,255,170,0)');ctx.fillStyle=g;ctx.fillRect(x,y-20,h.w,T+20)}}}
  if(this._sh)for(const q of this._sh){const a=Math.min(1,q.l);ctx.fillStyle='rgba(130,255,180,'+a+')';ctx.fillRect(q.x-c.x,q.y-c.y,2,2);ctx.fillStyle='rgba(60,200,120,'+.25*a+')';ctx.fillRect(q.x-c.x-2,q.y-c.y-2,6,6)}
};
const oH=G.drawHUD;
G.drawHUD=function(ctx){oH.call(this,ctx);if(this._flash>0){ctx.fillStyle='rgba(90,255,160,'+Math.min(.35,this._flash*.5)+')';ctx.fillRect(0,0,640,360)}};
})();
