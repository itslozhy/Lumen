/* ===== LORE, MAIS LIVROS, PORÃO DOS VÉUS, ESPÍRITO VELOZ (DASH) ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
ZONES.push({id:'basement2',name:'Porão dos Véus',x:6,y:116,w:72,h:16,theme:'cellar',wall:'#2a1a16',floor:'#3a2820',accent:'#4a8a58',bg:'#05080a'});
const BX=6,BY=116;
// ---- mundo ----
const _bw=buildWorld;
buildWorld=function(){
  const g=_bw();
  const fill=(x,y,w,h,v)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=v};
  const hl=(x,y,w,v=1)=>fill(x,y,w,1,v);
  hl(6,116,72);hl(6,131,72);fill(6,116,1,16,1);fill(77,116,1,16,1);
  [22,40,58].forEach(x=>fill(x,128,2,3,1));
  [[26,125,5],[30,122,8],[46,121,8],[62,122,7],[48,125,4],[10,124,5],[68,125,5]].forEach(p=>hl(p[0],p[1],p[2],2));
  return g;
};
const _bi=buildInteractives;
buildInteractives=function(){
  const a=_bi().filter(i=>i.id!=='stitch_orb');
  const T6=T;
  a.push({type:'hatch',x:16*T6,y:22*T6,w:2*T6,h:T6,id:'hatch_down',open:0},
   {type:'hatch_up',x:8*T6,y:130*T6,w:2*T6,h:T6,id:'hatch_up'},
   {type:'rest',x:13*T6,y:130*T6,w:2*T6,h:T6,id:'rest_b1'},{type:'rest',x:63*T6,y:130*T6,w:2*T6,h:T6,id:'rest_b2'},
   {type:'book',x:10*T6,y:14*T6,w:T6,h:T6,id:'book_dash'},{type:'book',x:23*T6,y:46*T6,w:T6,h:T6,id:'book_diary'},
   {type:'book',x:51*T6,y:5*T6,w:T6,h:T6,id:'book_clock'},{type:'book',x:48*T6,y:15*T6,w:T6,h:T6,id:'book_lib'},
   {type:'book',x:89*T6,y:10*T6,w:T6,h:T6,id:'book_pin'},{type:'book',x:118*T6,y:83*T6,w:T6,h:T6,id:'book_sewer'},
   {type:'book',x:136*T6,y:91*T6,w:T6,h:T6,id:'book_abyss'});
  [11,17,26,32,45,51,60,67].forEach((x,i)=>a.push({type:'painting',x:x*T6,y:123*T6,w:2*T6,h:3*T6,id:'paint_b'+(i+1)}));
  return a};
const _be=buildEnemies;
buildEnemies=function(){const a=_be();
  [['paper_doll',12,128],['specter_rat',16,128],['broken_marionette',19,128],['paper_doll',27,128],['specter_rat',33,128],['broken_marionette',36,128],
   ['paper_doll',33,119],['specter_rat',49,118],['broken_marionette',44,128],['paper_doll',52,128],['specter_rat',55,128],['broken_marionette',65,119],['paper_doll',61,128],['specter_rat',69,122]]
   .forEach(e=>a.push({type:e[0],x:e[1]*T,y:e[2]*T}));
  return a};
const _bh=buildHazards;
buildHazards=function(){const a=_bh();for(const r of [[30,33],[48,51]])for(let x=r[0];x<=r[1];x++)a.push({x:x*T,y:130*T+8,w:T,h:8});return a};
// ---- pinturas do porão (rostos variados) ----
window.PAINTV={
 paint_b1:{sk:'#cfc0b4',hr:'#14100f',st:'long',ct:'#1a1a22',eye:'hollow',mo:'stitch',ex:'tears'},
 paint_b2:{sk:'#b8a898',hr:'#3a2a28',st:'bun',ct:'#241818',eye:'none',mo:'none',ex:'crack'},
 paint_b3:{sk:'#c8b8a0',hr:'#d8d4dc',st:'short',ct:'#1c2230',eye:'gold',mo:'flat',ex:'monocle'},
 paint_b4:{sk:'#e0d0c4',hr:'#5a3a7a',st:'long',ct:'#2a1a3a',eye:'hollow',mo:'smile',ex:'thread'},
 paint_b5:{sk:'#a89888',hr:'#1a1018',st:'veil',ct:'#101018',eye:'hollow',mo:'flat',ex:'overpaint'},
 paint_b6:{sk:'#d8ccc0',hr:'#222222',st:'short',ct:'#2a2a2a',eye:'none',mo:'smile',ex:'crack'},
 paint_b7:{sk:'#c89a80',hr:'#6a2a22',st:'long',ct:'#3a1a1a',eye:'hollow',mo:'stitch',ex:'ribbon'},
 paint_b8:{sk:'#e8dcd0',hr:'#14100f',st:'veil',ct:'#2a1420',eye:'hollow',mo:'smile',ex:'thread'}};
const PT={
 paint_bed:['A Menina da Fita',['Eu fui você. Antes da casa. Antes do silêncio.','A fita é o último pedaço que ela deixou ficar.','Você não está dormindo, Mika. Mas pode continuar sonhando.']],
 paint2:['O Relojoeiro',['Parei os relógios na hora em que a menina parou.','Desde então a casa repete o mesmo dia, cada vez mais alto.','O medo cresce quando ninguém o enfrenta. Por isso os monstros.']],
 paint_g2:['A Governanta',['Eu cuidei dela até o fim. Ou fingi cuidar.','Os bonecos de papel são as vezes em que ela foi tratada como brinquedo.','Há quem diga que eu e a Costureira somos a mesma. Não responda.']],
 paint_chapel:['O Padre Sem Rosto',['Rezei por uma criança que ninguém visitava.','As marionetes se ajoelham porque aprenderam a obedecer sem perguntar.','Perdoar é soltar os fios. Poucos aqui conseguem.']],
 paint_m2:['O Irmão',['Havia alguém a mais neste retrato. Ela apagou quem lhe doeu.','Os espelhos guardam o que a tinta cobriu.','Se encontrar meu rosto, não diga meu nome. Ela escuta.']],
 paint_ante:['A Costureira, antes',['Eu costurava as lembranças para que não sangrassem.','Mas costurei demais, e agora ninguém consegue partir.','Venha ao Jardim do Fim, Mika. Lá tudo o que você lembra enfim se desfaz.']],
 paint_b1:['O Retrato da Culpa',['Você olhou a cama vazia ao lado e sorriu. Eu vi.','Sorriu porque não era você. Lembra? Eu lembro.']],
 paint_b2:['A Visita que Não Veio',['Esperei tanto por ela que aprendi a odiar a porta.','Quer dizer algo à porta, Mika? Ela também esperou.']],
 paint_b3:['O Doutor',['Dizia "está tudo bem" olhando o relógio, não você.','Quem acredita num rosto que desvia o olhar?']],
 paint_b4:['A Criança Maior',['Sempre pequena demais para contar. Sempre grande demais para chorar.','Quantos adultos cabem numa criança que se cala?']],
 paint_b5:['A Voz no Corredor',['Ouço passos que nunca chegam ao quarto.','Eles passam. Sempre passam. Passam hoje também.']],
 paint_b6:['O Espelho Sem Reflexo',['Aqui embaixo ninguém te reflete. Por que será?','Não olhe para o chão. Você já olhou tempo demais.']],
 paint_b7:['A Febre',['Estou quente porque você me chama de memória.','Mas sou o último pedaço que ainda dói. Não me solte.']],
 paint_b8:['Quem Segura os Fios',['Os espíritos que correm pelo véu são os últimos que fugiram de mim.','Mate o mais rápido e o véu se abre. Você também vai correr.']]};
window.paintTalk=function(g,it){const e=PT[it.id];g.dialog={name:e?e[0]:'Retrato',lines:e?e[1]:['A tinta ainda está úmida... depois de tantos anos.']};g.dialogIndex=0;g.state='dialog'};
// ---- livros e NPCs (lore) ----
const BK={
 book_bed:['"Desperte. Ou continue sonhando."','A letra é sua. A data nunca foi escrita.'],
 book1:['"As paredes lembram o que as pessoas esquecem."','"E esquecem o que as pessoas fingem lembrar."'],
 book2:['"A porta do quarto da Governanta só se abre com a chave do Abismo."','"Ela está presa onde as lembranças fecham. A chave dorme sob fios selados."'],
 book3:['"Pulo duas vezes. O ar também é chão, se você insistir."','"Foi assim que a menina aprendeu a fugir de casa. E de si."'],
 book_cellar:['"Desça. Sempre há outro andar abaixo."','"Os mortos também têm porão."'],
 book_chapel:['"A Costureira puxa os fios — e você com eles."','"Cada fio é uma lembrança que alguém não quis soltar."'],
 book_obs:['"Do alto, a casa parece um corpo deitado."','"Respira devagar, como quem dorme. Ou como quem já não respira."'],
 book_ante:['"Sem a chave, a Governanta não te recebe."','"Ela guardou o quarto intacto. Como se alguém fosse voltar."'],
 book_diary:['"Dia 12: a casa ficou silenciosa depois que pararam de me chamar."','"Dia 13: a Governanta diz que é só febre. Os ratos discordam."','"Dia 14:" (o resto da página foi arrancado)'],
 book_clock:['"Estes relógios marcam o instante em que a menina parou de respirar."','"Todos os ponteiros apontam para o quarto da Governanta."','"A chave dorme nas profundezas. Só o fogo, lá no alto, queima os fios."'],
 book_lib:['"Livros de luto são os mais lidos e os menos terminados."','"Aqui, cada capítulo é uma memória reescrita até ficar suportável."','"A maior mentira desta casa é a que conforta."'],
 book_pin:['"Os sinos tocaram por uma criança. Ninguém veio ao enterro."','"A Casa Desfeita é só um quarto pequeno e uma cama grande demais."'],
 book_sewer:['"Os ratos não são ratos: são o medo do escuro, crescido."','"Tudo aqui é exagero: a dor inchando para caber na memória."'],
 book_abyss:['"Se chegou até aqui, já entendeu: nada nesta casa quer te ferir."','"São só as coisas que doeram, vestidas de monstros para serem vencidas."','"Quando vencer todas, a menina poderá ir."'],
 book_dash:['"Há espíritos que correm pelo véu, no porão sob a cozinha."','"Eles não andam: cruzam. Quem os alcança aprende a cruzar também."','"A chaleira é igual: ninguém a pega andando. Procure o alçapão no chão."']};
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  const p=this.player,hb=p.hitbox,ov=i=>rectOverlap({x:hb.x-10,y:hb.y-10,w:hb.w+20,h:hb.h+20},i);
  if(this.input.interact()){
    const h=this.interactives.find(i=>i.type==='hatch'&&ov(i));
    if(h&&!this._tp){h.open=1;this._tp={t:.7,x:9*T+2,y:131*T-34,msg:'O alçapão range... e a escuridão cheira a umidade e véu.'};this.showMsg('O alçapão se abre...');return}
    const u=this.interactives.find(i=>i.type==='hatch_up'&&ov(i));
    if(u&&!this._tp){this._tp={t:.5,x:14*T,y:23*T-34,msg:null};return}
  }
  const had=this.dialog;oHI.call(this);
  if(!had&&this.dialog&&this.state==='dialog'){
    const near=this.interactives.filter(i=>(i.type==='book'||i.type==='npc')&&ov(i)).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
    if(near){
      if(near.type==='book'&&BK[near.id])this.dialog={name:'Livro',lines:BK[near.id]};
      else if(near.type==='npc'){const L=[];
        if(near.id==='guard_ante')L.push('Sem a chave, a Governanta não te recebe.','Ou melhor: ela te recebe — mas você não entra.','Atrás dessa porta está o primeiro dia que a menina quis esquecer.');
        else if(near.id==='echo_girl'||near.id==='echo_garden')L.push('Você voltou... ou chegou pela primeira vez?','Aqui as lembranças não envelhecem. Só mentem melhor.','O quarto da Governanta está trancado. A chave dorme bem fundo.');
        else L.push('A Casa Desfeita não tem um único caminho.','Cada sala é um pedaço do que ela viveu, aumentado até virar pesadelo.','A chave do quarto da Governanta dorme no extremo das profundezas.');
        if(this._sealSeen&&!p.hasFlame)L.push('Viu os fios selados? Só o fogo os desfaz. Ele vive no alto da casa, numa chaleira que corre.');
        else if(p.hasFlame&&!p.keys.includes('boss_key'))L.push('Você tem o fogo. Queime os fios no Abismo e pegue a chave.');
        this.dialog={name:this.dialog.name,lines:L}}}
  }
};
// ---- espírito veloz (chefe do dash) ----
const solid=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H||g[ty][tx]===1};
const gnd=(g,x,y)=>{const tx=Math.floor(x/T),ty=Math.floor(y/T);return ty>=0&&ty<WORLD_H&&(g[ty][tx]===1||g[ty][tx]===2)};
const oEU=Enemy.prototype.update;
Enemy.prototype.update=function(dt,pl,grid){
  if(this._sb===undefined){this._sb=Math.abs(this.spawnX-108*T)<2&&Math.abs(this.spawnY-181*T)<2;if(this._sb){this.hp=this.maxHp=400;this.w=28;this.h=32;this.damage=20;this.bs='idle';this.bt=1000;this.aggro=false}}
  if(!this._sb)return oEU.call(this,dt,pl,grid);
  if(!this.alive){this.permanentlyDead=true;return}
  const ms=dt>1?dt:dt*1000,dx=(pl.x+14)-(this.x+this.w/2),dist=Math.abs(dx),dir=dx>=0?1:-1;
  if(!this.aggro&&dist<300&&Math.abs(pl.y-this.y)<90)this.aggro=true;
  if(this.aggro){this.bt-=ms;
    if(this.bs==='idle'){this.facing=dir;this.vx=dist>160?dir*1.3:dist<90?-dir*1.1:0;if(this.bt<=0){this.bs='windup';this.bt=this.hp<this.maxHp*.5?420:650;this.vx=0}}
    else if(this.bs==='windup'){this.facing=dir;this.vx=0;if(this.bt<=0){this.bs='dash';this.bt=380;this.dd=dir;this.hitDone=false}}
    else if(this.bs==='dash'){this.vx=this.dd*10;this.facing=this.dd;
      const hb=pl.hitbox;if(!this.hitDone&&rectOverlap(hb,{x:this.x,y:this.y,w:this.w,h:this.h})){this.hitDone=true;pl.takeDamage(20,'purple',this.x)}
      if(this.bt<=0){this.bs='recover';this.bt=950;this.vx=0}}
    else if(this.bs==='recover'){this.vx=0;if(this.bt<=0){this.bs='idle';this.bt=this.hp<this.maxHp*.5?500:1100}}}
  const nx=this.x+this.vx;if(!solid(grid,nx+(this.vx>0?this.w:0),this.y+8)&&!solid(grid,nx+(this.vx>0?this.w:0),this.y+this.h-4))this.x=nx;else if(this.bs==='dash'){this.bs='recover';this.bt=950;this.vx=0}
  this.vy=Math.min(11,this.vy+.42);this.y+=this.vy;if(this.vy>=0&&gnd(grid,this.x+this.w/2,this.y+this.h)){this.y=Math.floor((this.y+this.h)/T)*T-this.h;this.vy=0}
};
const oT=Enemy.prototype.takeDamage;
Enemy.prototype.takeDamage=function(a){
  if(this._sb){if(!this.alive||this.bs==='dash'||(this._p2&&this._ph!==2))return;this.hp-=a;this._hurt=performance.now();if(this.hp<=0){if(this._ph!==2){this.hp=1;this._p2=true;this.bs='idle';this.vx=0;this._rn=null;return}this.hp=0;this.alive=false;this.projectiles=[];this._rn=null}return}
  return oT.call(this,a)};
const oED=Enemy.prototype.draw;
Enemy.prototype.draw=function(ctx,cam){
  if(!this._sb)return oED.call(this,ctx,cam);
  if(!this.alive)return;
  const t=performance.now()/1000,cx=this.x-cam.x+this.w/2,bt=this.y-cam.y+this.h;
  if(this._z==null||this._z.indexOf('hue')<0)this._z='hue-rotate(100deg) saturate(2.4) brightness(1.25)';this._v=0;
  const g=ctx.createRadialGradient(cx,bt-20,3,cx,bt-20,52);g.addColorStop(0,'rgba(110,255,170,.45)');g.addColorStop(1,'rgba(110,255,170,0)');ctx.fillStyle=g;ctx.fillRect(cx-52,bt-72,104,104);
  ctx.save();ctx.translate(cx,bt);ctx.scale(1.35,1.35);ctx.translate(-cx,-bt);
  if(this.bs==='dash')for(let k=3;k>=1;k--){ctx.globalAlpha=.16*(4-k);oED.call(this,ctx,{x:cam.x+(this.facing>0?-1:1)*(-k)*-14*-1,y:cam.y})}
  ctx.globalAlpha=this.bs==='windup'?.65+.3*Math.sin(t*40):.8+.1*Math.sin(t*6);oED.call(this,ctx,cam);ctx.restore();ctx.globalAlpha=1;
  if(this.bs==='windup'){ctx.strokeStyle='rgba(130,255,180,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,bt-30);ctx.lineTo(cx+this.facing*90,bt-30);ctx.stroke()}
};
// ---- jogo: teleporte, desbloqueio do dash, luzes verdes, fog do porão ----
const oU=G.update;
G.update=function(dt){
  oU.call(this,dt);const p=this.player,s=dt>1?dt/1000:dt;if(!p||this.state==='title')return;
  if(this._tp){this._tp.t-=s;if(this._tp.t<=0){p.x=this._tp.x;p.y=this._tp.y;p.vx=0;p.vy=0;this.camera.x=Math.max(0,Math.min(WORLD_W*T-640,p.x-320));this.camera.y=Math.max(0,Math.min(WORLD_H*T-360,p.y-200));if(this._tp.msg)this.showMsg(this._tp.msg);this._fade=.5;this._tp=null}}
  else if(this._fade>0)this._fade-=s;
  for(const h of this.interactives)if(h.type==='hatch'&&h.open>0&&!this._tp)h.open=Math.max(0,h.open-s*.5);
  const b=this.enemies&&this.enemies.find(e=>e._sb);
  if(b){if(p.hasStitch&&b.alive&&!b.aggro){b.alive=false;b.permanentlyDead=true}
    if(!b.alive&&!b._done){b._done=true;if(!p.hasStitch&&window.bossDeath)window.bossDeath(this,b)}}
};
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  const p=this.player,z=zoneAt(Math.floor((p.x+14)/T),Math.floor((p.y+20)/T)),inB=!!(z&&(window.FOVLV||{})[z.id]>0),lv=(z&&(window.FOVLV||{})[z.id])||0;
  window.FOVK=[1,.85,.8,.75,.7][lv];window.FOVD=[.96,.985,.988,.99,.992][lv];window.FOVM=[.09,.2,.24,.28,.32][lv];
  oW.call(this,ctx);
  const c=this.camera,t=performance.now()/1000,L=this._sl||(this._sl=[]);window.SL=[];
  for(const h of this.interactives){if(h.type!=='hatch'&&h.type!=='hatch_up')continue;const x=h.x-c.x,y=h.y-c.y;if(x<-40||x>680)continue;
    if(h.type==='hatch'){const o=h.open||0;ctx.fillStyle='#120c1a';ctx.fillRect(x+1,y+T-5,h.w-2,5);
      if(o>0){ctx.fillStyle='#050305';ctx.fillRect(x+2,y+T-5,h.w-4,5);ctx.save();ctx.translate(x+2,y+T-5);ctx.rotate(-Math.min(1,o*2)*1.3);ctx.fillStyle='#4a3a5a';ctx.fillRect(0,-4,h.w-4,4);ctx.restore()}
      else{ctx.fillStyle='#4a3a5a';ctx.fillRect(x+1,y+T-5,h.w-2,4);ctx.fillStyle='#2a2038';for(let i=0;i<h.w;i+=8)ctx.fillRect(x+i,y+T-5,1,4);ctx.strokeStyle='#c9bde0';ctx.beginPath();ctx.arc(x+h.w/2,y+T-3,2.5,0,TAU);ctx.stroke()}}
    else{ctx.fillStyle='#4a3a5a';ctx.fillRect(x+6,y-30,3,30);ctx.fillRect(x+13,y-30,3,30);for(let i=0;i<5;i++)ctx.fillRect(x+6,y-26+i*7,10,2)}}
  if(inB){this._slT=(this._slT||0)-1/60;
    if(this._slT<=0){this._slT=(2+Math.random()*2.5)/(.6+lv*.4);const d=Math.random()<.5?1:-1;L.push({x:c.x+(d>0?-30:670),y:c.y+80+Math.random()*200,vx:d*(1.1+Math.random()*1.2),age:0,life:5.5+Math.random()*2.5,ph:Math.random()*6})}
    for(const l of L){l.age+=1/60;l.x+=l.vx;l.y+=Math.sin(l.age*2+l.ph)*.35;const a=Math.sin(Math.PI*Math.min(1,l.age/l.life)),sx=l.x-c.x,sy=l.y-c.y;if(a<=0)continue;
      const g=ctx.createRadialGradient(sx,sy,1,sx,sy,22);g.addColorStop(0,'rgba(150,255,190,'+.8*a+')');g.addColorStop(1,'rgba(60,200,120,0)');ctx.fillStyle=g;ctx.fillRect(sx-22,sy-22,44,44);
      ctx.fillStyle='rgba(230,255,240,'+a+')';ctx.beginPath();ctx.arc(sx,sy,2,0,TAU);ctx.fill();ctx.strokeStyle='rgba(120,255,180,'+.35*a+')';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-l.vx*14,sy-Math.sin(l.age*2+l.ph)*5);ctx.stroke();
      window.SL.push([sx,sy,a])}}
  this._sl=L.filter(l=>l.age<l.life);if(!inB)this._sl=[];
};
const oH=G.drawHUD;
G.drawHUD=function(ctx){
  oH.call(this,ctx);
  const b=this.enemies&&this.enemies.find(e=>false);
  if(b){ctx.fillStyle='rgba(8,20,14,.85)';ctx.fillRect(170,330,300,14);ctx.fillStyle='#bfffd8';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText('ESPÍRITO DO VÉU',320,327);
    const g=ctx.createLinearGradient(172,0,468,0);g.addColorStop(0,'#2a8a5a');g.addColorStop(1,'#8affc0');ctx.fillStyle=g;ctx.fillRect(172,332,296*b.hp/b.maxHp,10);ctx.strokeStyle='#5fe0a0';ctx.strokeRect(170.5,330.5,299,13);ctx.textAlign='left'}
  const f=this._tp?1-this._tp.t/(this._tp.t+.01>.7?.7:.7):(this._fade>0?this._fade/.5:0);
  if(f>0)window.COL.wipe(ctx,Math.min(1,f));
};
})();
