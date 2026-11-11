/* ===== MIKA / KAIM / KAMI: RESSONÂNCIA OCULTA, ESCOLHAS, MEMÓRIAS CONTRADITÓRIAS (1ª PARTE) ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const ens=p=>{p.res=p.res||{mika:0,kaim:0,kami:0};p.records=p.records||[];p.flags=p.flags||{};return p};
const dom=p=>{const r=ens(p).res,a=Object.keys(r).sort((x,y)=>r[y]-r[x]);return r[a[0]]>=2&&r[a[0]]-r[a[1]]>=2?a[0]:null};
// ---------- dados das escolhas ----------
const FT=(g,k)=>ens(g.player).flags[k];
const CH={
 photo:{name:'Fotografia presa à moldura',ctx:['Duas meninas sentadas numa escada, sorrindo para a câmera.','Uma delas está borrada, como se tivesse se mexido.','Há algo escrito no verso — a tinta parece ainda úmida.'],opts:[
  {t:'Virar a fotografia e ler o verso',r:{mika:2},out:['A letra é de Mika: "Não venha."','Por cima, em outra tinta, a mesma letra: "Venha."','As duas assinaturas são idênticas.'],rec:['Verso da fotografia','"Não venha." / "Venha." Mesma mão, duas tintas.']},
  {t:'Rasgar a fotografia ao meio',r:{kaim:2},gl:'kaim',out:['O papel cede fácil demais.','Sob a metade rasgada, a imagem segue inteira, sem corte algum.','No ar, algo estala como uma fita sendo cortada.'],rec:['Fotografia rasgada','Rasgar a imagem não rasgou a lembrança.']},
  {t:'Guardar a fotografia junto ao peito',r:{kami:2},gl:'kami',out:['O papel está morno, como se alguém acabasse de segurá-lo.','A menina borrada parece sorrir um pouco mais nítida.'],rec:['Fotografia guardada','Estava morna. Alguém a segurou antes de você.']}]},
 tv:{name:'Televisor de tubo, ainda ligado',ctx:['Chuvisco, e então uma festa: balões, bolo, sete velas.','Todos riem. Ninguém olha para a menina que sopra as velas.','Há uma cadeira vazia à mesa, posta com cuidado.'],opts:[
  {t:'Assistir até o fim',r:{mika:2},out:['Quando as velas apagam, uma chave gira numa porta.','A menina continua sorrindo. A imagem treme a cada risada.','Nenhum convidado projeta sombra.'],rec:['Gravação do aniversário','Sete velas, uma cadeira vazia, uma chave girando por fora.']},
  {t:'Desligar o aparelho',r:{kaim:2},gl:'kaim',out:['A tela apaga. O ponto de luz demora a sumir.','No vidro escuro, a menina ainda sopra as velas. Sem som.'],rec:['Tela apagada','A imagem continuou depois de desligada.']},
  {t:'Rebobinar a fita',r:{kami:2},gl:'kami',out:['A fita volta mais do que devia. Antes da festa, uma cozinha silenciosa.','Alguém prepara o bolo sozinho, com muito cuidado.','Quem cuidou de tudo não aparece em nenhuma foto.'],rec:['Antes da festa','Alguém preparou tudo sozinho e não aparece em foto alguma.']}]},
 mirror:{name:'Espelho sem moldura',ctx:['O reflexo de Mika chega meio segundo depois dela.','Na mão do reflexo, a tesoura aponta para o lado errado.','Ele parece esperar uma decisão.'],opts:[
  {t:'Encarar o próprio reflexo',r:{mika:2},out:['Por um instante, a expressão do reflexo muda.','Você não sabe qual das duas é a sua.'],rec:['Reflexo atrasado','Meio segundo de diferença. Quem imita quem?']},
  {t:'Quebrar o vidro com a tesoura',r:{kaim:3},gl:'kaim',out:['Os cacos giram no ar antes de cair.','Em cada pedaço, um rosto diferente. Nenhum hesita.','Atrás do espelho há só parede lisa, sem marca de prego.'],rec:['Espelho quebrado','Atrás do vidro: parede lisa. Nunca houve moldura.']},
  {t:'Encostar a mão no vidro',r:{kami:2},gl:'kami',out:['O reflexo encosta a mão, devagar, do outro lado.','Presas atrás do vidro, flores secas guardam a forma da sua mão.'],rec:['Flores atrás do vidro','Alguém guardou flores aqui, na forma exata da mão de Mika.']}]},
 jar:{name:'Fita cortada, presa a um jarro',ctx:['Uma flor murcha, amarrada por uma fita de seda.','A fita foi cortada ao meio, com um corte limpo.','Parece obra de alguém furioso. Ou de alguém muito cuidadoso.'],opts:[
  {t:'Seguir o fio solto da fita',r:{mika:2},out:['O fio atravessa o chão e some entre as pedras do jardim.','O corte não foi violento: alguém soltou o nó para libertar a flor.','A dor que você viu aqui talvez fosse alívio.'],rec:['Fita cortada','Corte limpo: alguém soltou a flor de propósito.']},
  {t:'Cortar o que resta da fita',r:{kaim:2},out:['A fita se desfaz em fios que sobem pelo ar.','A flor não cai. Continua de pé, sem nada que a segure.'],rec:['Fios soltos','Sem fita, a flor continuou de pé.']},
  {t:'Costurar as pontas da fita',r:{kami:2},out:['A fita fecha, mas o nó fica mais apertado do que antes.','Algo no jarro respira aliviado. Ou preso.'],rec:['Nó refeito','Remendar também pode prender.']}]},
 echo:{name:'Duas silhuetas diante da porta',ctx:['Duas figuras se formam no ar, como imagens mal sintonizadas.','Uma é rubra, partida em fatias. A outra é pálida e sustenta flores.','As duas têm o seu rosto.'],opts:[
  {t:'Estender a mão para a figura pálida',r:{kami:3},out:g=>['"Eu sou Kami", diz a pálida. "Fiquei com o que você deixou cair."',['Ela segura o verso de uma fotografia, com as duas letras.','Ela une as metades de uma fotografia com linha fina.','Ela devolve a fotografia, inteira e morna.',null][FT(g,'photo')===undefined?3:FT(g,'photo')]||'Ela segura algo que você não lembra ter perdido.','Ela sorri sem mostrar o que esconde.'],rec:['Kami','Guardou tudo. Talvez também o que não devia.']},
  {t:'Encarar a figura rubra',r:{kaim:3},out:g=>['"Chamam-me Kaim", diz a rubra. "Cortei o que machucava. Ninguém agradece."',['Ela mostra a tinta da letra de trás da fotografia, riscada.','Ela segura as duas metades da fotografia, sem culpa.','Ela aponta o bolso onde você guardou a fotografia, com raiva.',null][FT(g,'photo')===undefined?3:FT(g,'photo')]||'Ela aponta o seu bolso vazio com raiva.','Há cansaço em cada fatia do rosto dela.'],rec:['Kaim','Cortou o que doía. Talvez também o que sustentava.']},
  {t:'Pedir que as duas esperem',r:{mika:3},out:['"Esperem", você diz. As imagens tremem e se alinham.','"Ainda não sei qual de nós lembra direito", admite uma voz que pode ser a sua.','Elas somem, deixando só ruído.'],rec:['As três','Três respostas ao mesmo problema. Nenhuma é só erro.']}]}};
const MEMV={mem1:['Uma festa pequena: você lembra do bolo, mas não de quem cantou.','Cantaram parabéns sem olhar para você. Você não perdoou.','Cada convidado guardou um pedaço de bolo para você.'],
 mem_gallery:['Retratos em fila. Em todos, alguém que se parece com você.','Retratos demais. Alguém quis te transformar numa coleção.','Alguém emoldurou cada retrato para que você fosse lembrada.'],
 mem2:['Uma escada. Alguém desce à frente e não olha para trás.','A mão que te soltou na escada foi firme. Foi escolha.','Na escada, alguém te esperou degrau por degrau.'],
 mem3:['Uma janela fechada por fora. Do lado de dentro, ninguém grita.','Trancaram a janela. Você arrancaria a moldura inteira.','A janela foi fechada para o frio não entrar.'],
 mem_clock:['Os ponteiros pararam no instante em que alguém disse "espere".','Pararam os relógios para você não crescer. Ninguém perguntou.','Pararam os relógios para o dia durar mais um pouco.'],
 mem_garden:['O jardim existia antes? Ou nasceu depois da perda?','O jardim cresceu sobre o que alguém quis enterrar.','Cada flor foi plantada onde uma lembrança podia dormir.']};
const KI={mika:0,kaim:1,kami:2};
// ---------- mundo: objetos de memória ----------
const _bi=buildInteractives;
buildInteractives=function(){const a=_bi();
  a.push({type:'photo',x:11*T,y:46*T,w:T,h:T,id:'ev_photo',collected:false},{type:'tv',x:77*T,y:46*T,w:2*T,h:T,id:'ev_tv',collected:false},
   {type:'mirror',x:157*T,y:46*T,w:T,h:2*T,id:'ev_mirror',collected:false},{type:'jar',x:129*T,y:55*T,w:T,h:T,id:'ev_jar',collected:false});return a};
const EV={photo:'photo',tv:'tv',mirror:'mirror',jar:'jar'};
function openChoice(g,id,it){g._choice={id,sel:0,it:it||null};if(id==='echo'){const p=g.player;g._echo={x1:p.x-70,x2:p.x+70,t:0}}}
function addRec(p,t,s){if(!p.records.some(r=>r[0]===t))p.records.push([t,s])}
window.glitchFx=(g,s)=>{g._gl=s};
function pick(g,i){const c=g._choice,C=CH[c.id],o=C.opts[i],p=ens(g.player);
  for(const k in o.r)p.res[k]+=o.r[k];p.flags[c.id]=i;if(c.it)c.it.collected=true;
  if(o.rec){addRec(p,o.rec[0],o.rec[1]);g.showMsg('Registro: '+o.rec[0])}
  window.ALB&&window.ALB.regEvent(p,c.id,i,C,o);
  let out=typeof o.out==='function'?o.out(g):o.out.slice();
  if(c.id==='echo')out=out.concat(['Na porta de vidro à frente há três reflexos.','Nenhum deles se mexe quando você se mexe.']);
  if(o.gl)g._gl2={kind:o.gl,t:3.2};window.glitchFx(g,.4);
  g._choice=null;if(g._echo)g._echo.done=true;g.dialog={name:C.name,lines:out};g.dialogIndex=0;g.state='dialog'}
// ---------- fluxo ----------
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(!this._choice&&this.input.interact()){const hb=this.player.hitbox,it=this.interactives.find(i=>EV[i.type]&&!i.collected&&rectOverlap({x:hb.x-10,y:hb.y-10,w:hb.w+20,h:hb.h+20},i));
    if(it){openChoice(this,EV[it.type],it);return}}
  return oHI.call(this)};
const oU=G.update;
G.update=function(dt){
  const s=dt>1?dt/1000:dt;
  if(this._choice){const C=CH[this._choice.id],inp=this.input,n=C.opts.length;
    if(inp.wasPressed('ArrowUp')||inp.wasPressed('KeyW'))this._choice.sel=(this._choice.sel+n-1)%n;
    if(inp.wasPressed('ArrowDown')||inp.wasPressed('KeyS'))this._choice.sel=(this._choice.sel+1)%n;
    if(inp.interact()||inp.confirm())pick(this,this._choice.sel);
    return}
  oU.call(this,dt);
  const p=this.player;if(!p||this.state==='title')return;ens(p);
  if(this._gl>0)this._gl-=s;if(this._gl2){this._gl2.t-=s;if(this._gl2.t<=0)this._gl2=null}
  if(this._echo){this._echo.t+=s;if(this._echo.done&&this.state==='playing'&&!this.dialog){this._echo.o=(this._echo.o||0)+s;if(this._echo.o>1.4)this._echo=null}}
  if(this._pend&&this.state==='playing'&&!this.dialog){const id=this._pend;this._pend=null;openChoice(this,id)}
  if(!p.flags.echo_seen&&p.flags.echo===undefined&&p.keys&&p.keys.includes('boss_key')&&this.state==='playing'&&!this.dialog&&p.x/T>=179&&p.x/T<190&&p.y/T>34&&p.y/T<48){
    p.flags.echo_seen=1;const pp=this.player;this._echo={x1:pp.x-70,x2:pp.x+70,t:0};this._pend='echo';window.glitchFx(this,.5);
    this.dialog={name:'Antecâmara',lines:['O rádio na parede chia sozinho, sem estar ligado.','As luzes tremem como um televisor mal sintonizado.']};this.dialogIndex=0;this.state='dialog'}
  for(const it of this.interactives)if(it.type==='memory'&&it.collected&&!it._v){it._v=1;const v=MEMV[it.id];if(v&&p.flags){const d=dom(p);this.showMsg(v[d?KI[d]:0]);window.ALB&&window.ALB.fragVar(p,it.id,v[d?KI[d]:0]);if(it.id==='mem2')window.glitchFx(this,.25)}}
};
// ---------- desenho ----------
const echo=(ctx,kind,sx,sy,t,flip)=>{const S=window.SPRS&&window.SPRS.mika_idle;if(!S||!S.i.naturalWidth)return;const sc=42/S.ch,w=S.cw*sc,h=S.ch*sc,f=Math.floor(t*6)%S.n;
  ctx.save();ctx.imageSmoothingEnabled=true;
  if(kind==='kaim'){ctx.filter='hue-rotate(-45deg) saturate(2.4) contrast(1.3) brightness(.85)';const k=Math.floor(t*9);
    for(let i=0;i<7;i++){const o=(hs(i,k)-.5)*(hs(k,3)>.6?14:5);ctx.globalAlpha=.7;ctx.save();if(flip){ctx.translate(sx*2,0);ctx.scale(-1,1)}ctx.drawImage(S.i,f*S.cw,i*S.ch/7,S.cw,S.ch/7,sx-w/2+o*(flip?-1:1),sy-h+i*h/7,w,h/7);ctx.restore()}
    ctx.filter='none';ctx.fillStyle='rgba(190,30,50,.18)';ctx.fillRect(sx-w/2-4,sy-h*.55+Math.sin(t*20)*3,w+8,2)}
  else{ctx.filter='brightness(1.4) saturate(.5) hue-rotate(15deg)';ctx.globalAlpha=.78+.1*Math.sin(t*3);ctx.drawImage(S.i,f*S.cw,0,S.cw,S.ch,sx-w/2,sy-h,w,h);ctx.filter='none';
    const g=ctx.createRadialGradient(sx,sy-h/2,2,sx,sy-h/2,34);g.addColorStop(0,'rgba(255,200,225,.25)');g.addColorStop(1,'rgba(255,200,225,0)');ctx.fillStyle=g;ctx.fillRect(sx-34,sy-h/2-34,68,68);
    ctx.fillStyle='rgba(255,215,230,.85)';for(let i=0;i<4;i++){const a=t*1.2+i*1.6;ctx.fillRect(sx+Math.cos(a)*16,sy-h*.5+Math.sin(a)*14-((t*8+i*5)%10),2,2)}}
  ctx.restore()};
const obj={};
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);const c=this.camera,t=performance.now()/1000,p=ens(this.player),d=dom(p),g=this.grid;
  for(const it of this.interactives){const f=obj[it.type];if(!f)continue;const x=it.x-c.x,y=it.y-c.y;if(x<-40||x>680||y<-60||y>400)continue;f(ctx,x,y,p.flags[EV[it.type]],t)}
  if(d==='kami'||d==='kaim'){const sx=Math.max(1,Math.floor(c.x/T)),ex=Math.min(WORLD_W-1,Math.ceil((c.x+640)/T)),sy=Math.max(1,Math.floor(c.y/T)),ey=Math.min(WORLD_H-1,Math.ceil((c.y+360)/T));
    for(let ty=sy;ty<ey;ty++)for(let tx=sx;tx<ex;tx++){if(g[ty][tx]!==1)continue;const r=hs(tx,ty),X=tx*T-c.x,Y=ty*T-c.y;
      if(d==='kami'&&g[ty-1][tx]===0&&r>.93){R(ctx,X+7,Y-5,1,5,'#4a6a4a');R(ctx,X+5,Y-8,5,3,r>.97?'#D8A0B0':'#E6DCC6')}
      else if(d==='kaim'&&r>.972&&(g[ty][tx+1]===0||g[ty][tx-1]===0)){const sd=g[ty][tx+1]===0?T:0;ctx.strokeStyle='#8a1c2e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X+sd,Y+2);ctx.lineTo(X+sd+(sd?-4:4),Y+7);ctx.lineTo(X+sd+(sd?-1:1),Y+11);ctx.lineTo(X+sd+(sd?-5:5),Y+15);ctx.stroke()}}}
  const pl=this.player,sx0=pl.x-c.x+14,sy0=pl.y-c.y+36;
  if(this._gl2&&hs(Math.floor(t*18),2)>.3){const k=this._gl2.kind;echo(ctx,k,sx0+(k==='kaim'?-42:42),sy0,t,k==='kaim')}
  if(this._echo){const e=this._echo,a=Math.min(1,e.t/.8)*(e.o?Math.max(0,1-e.o/1.4):1),ey=sy0+ (e.y||0);ctx.globalAlpha=a;echo(ctx,'kaim',e.x1-c.x+14,ey,t,true);echo(ctx,'kami',e.x2-c.x+14,ey,t,false);ctx.globalAlpha=1}
};
const oH=G.drawHUD;
G.drawHUD=function(ctx){
  const d=dom(ens(this.player)),TN={mika:'rgba(126,53,184,.05)',kaim:'rgba(150,20,40,.075)',kami:'rgba(240,170,200,.055)'};
  if(d){ctx.fillStyle=TN[d];ctx.fillRect(0,0,640,360)}
  oH.call(this,ctx);
  if(this._gl>0){const k=Math.floor(performance.now()/50);for(let i=0;i<5;i++){const y=hs(i,k)*320|0,h=8+hs(k,i)*26|0,o=(hs(i+3,k)-.5)*26;try{ctx.drawImage(ctx.canvas,0,y,640,h,o,y,640,h)}catch(e){}}
    ctx.fillStyle='rgba(180,40,70,.08)';ctx.fillRect(0,hs(k,1)*340,640,3)}
  const ch=this._choice;if(ch){const C=CH[ch.id],t=performance.now()/1000;
    ctx.fillStyle='rgba(6,4,10,.55)';ctx.fillRect(0,0,640,360);
    window.COL.panel(ctx,40,160,560,180,'ink',C.name.length);ctx.fillStyle='#D8A0B0';ctx.font='italic 13px Georgia';ctx.fillText('— '+C.name+' —',56,184);
    ctx.fillStyle='#E6DCC6';ctx.font='13px Georgia';C.ctx.forEach((l,i)=>ctx.fillText(l,56,208+i*18));
    C.opts.forEach((o,i)=>{const y=276+i*22,s=i===ch.sel;if(s){ctx.fillStyle='rgba(130,24,56,.8)';ctx.fillRect(52,y-14,536,19);ctx.fillStyle='#fff';ctx.fillText('▸',58+Math.sin(t*6)*2,y)}
      ctx.fillStyle=s?'#ffffff':'#B9ABB9';ctx.font=(s?'bold ':'')+'13px Georgia';ctx.fillText(o.t,76,y)});
    ctx.fillStyle='#7A6B8B';ctx.font='10px Georgia';ctx.fillText('W/S escolher  ·  E confirmar',56,334)}
};
const oSG=G.saveGame;
G.saveGame=function(){oSG.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k)),p=ens(this.player);if(d){d.res=p.res;d.rec=p.records;d.fl=p.flags;localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));if(d&&this.player){this.player.res=d.res||{mika:0,kaim:0,kami:0};this.player.records=d.rec||[];this.player.flags=d.fl||{}}}catch(e){}};
})();
