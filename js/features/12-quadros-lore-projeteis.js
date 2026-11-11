/* ===== QUADROS CLÁSSICOS/CREEPY COM LORE, PROJÉTEIS COLIDEM, FOV +10% ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
// projéteis param em plataformas, paredes, chão e teto
const oPr=Projectile.prototype.update;
Projectile.prototype.update=function(dt){
  const ox=this.x,oy=this.y;oPr.call(this,dt);const g=window.__G&&window.__G.grid;if(!g||this.life<=0)return;
  for(const [x,y] of [[this.x,this.y],[(ox+this.x)/2,(oy+this.y)/2]]){const tx=Math.floor(x/T),ty=Math.floor(y/T);
    if(tx<0||ty<0||tx>=WORLD_W||ty>=WORLD_H||g[ty][tx]===1||g[ty][tx]===2){this.life=0;if(window.__G.particles)window.__G.particles.emit(ox,oy,'impact',3);return}}
};
// lore dos quadros
const LORE={
 paint_bed:{name:'A Menina da Fita',lines:['Você já dormiu neste quarto. Ou o quarto dormiu em você?','A fita no meu cabelo é o único ponto que ela esqueceu de desfazer.','Procure os fragmentos. Eles mentem, mas mentem sobre algo verdadeiro.'],
  v:{sk:'#d9c9c0',hr:'#14100f',st:'long',ct:'#2a1420',eye:'hollow',mo:'stitch',ex:'ribbon'}},
 paint2:{name:'O Relojoeiro',lines:['Os sinos do Pináculo pararam no dia em que a Costureira chegou.','Desde então toda hora é a mesma hora, e dói do mesmo jeito.','Se ouvir o tique-taque de novo, é porque alguém lembrou de você.'],
  v:{sk:'#b8a898',hr:'#d8d4dc',st:'short',ct:'#1c2230',eye:'gold',mo:'flat',ex:'monocle'}},
 paint_g2:{name:'A Governanta',lines:['Eu cuidava das bonecas de papel. Eram crianças que não queriam crescer.','A Costureira prometeu que nunca sentiriam frio.','Esqueceu de dizer que também nunca sentiriam mais nada.'],
  v:{sk:'#d8ccc0',hr:'#3a2a28',st:'bun',ct:'#1a1a1a',eye:'normal',mo:'flat',ex:'crack'}},
 paint_chapel:{name:'O Padre Sem Rosto',lines:['Rezei por todos, até o dia em que não sobrou ninguém para rezar.','As marionetes quebradas ainda se ajoelham aqui à noite.','Não as atrapalhe. É a única memória que elas guardam inteira.'],
  v:{sk:'#cfc0b0',hr:'#222222',st:'veil',ct:'#101018',eye:'none',mo:'none',ex:'tears'}},
 paint_m2:{name:'O Irmão',lines:['Éramos dois neste retrato. Alguém pintou por cima de um de nós.','Os espelhos daqui guardam o que a tinta apagou.','Se encontrar meu rosto, não diga meu nome. Ela escuta.'],
  v:{sk:'#c8b8a8',hr:'#1a1018',st:'short',ct:'#2a1a2a',eye:'normal',mo:'flat',ex:'overpaint'}},
 paint_ante:{name:'A Costureira, antes',lines:['Antes de ser vazia, eu tinha um nome e um dedal de prata.','Só queria que ninguém fosse esquecido. Costurei tão forte que ninguém partiu.','Venha. No Jardim do Fim, tudo o que se lembra enfim se desfaz.'],
  v:{sk:'#e8dcd0',hr:'#6a4a8a',st:'veil',ct:'#2a1a3a',eye:'hollow',mo:'smile',ex:'thread'}}};
window.paintTalk=function(g,it){const l=LORE[it.id];g.dialog={name:l?l.name:'Retrato',lines:l?l.lines:['A tinta ainda está úmida... depois de tantos anos.']};g.dialogIndex=0;g.state='dialog'};
const oBI=buildInteractives;
buildInteractives=function(){return oBI().filter(i=>i.type!=='painting'||LORE[i.id])};
// retrato clássico e inquietante
const shade=(hex,f)=>{const v=[1,3,5].map(i=>parseInt(hex.substr(i,2),16));return 'rgb('+v.map(x=>cl(x*f,0,255)|0)+')'};
// mensagem ao interagir e visão
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(this.input.interact()){const hb=this.player.hitbox,p=this.interactives.find(i=>i.type==='painting'&&rectOverlap({x:hb.x-6,y:hb.y-6,w:hb.w+12,h:hb.h+12},i));
    if(p){window.paintTalk(this,p);return}}
  return oHI.call(this)};
})();
