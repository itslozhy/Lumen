/* ===== JANELAS DE MADEIRA LUMINOSAS, QUADROS-RETRATO ANIMADOS, ELIXIRES DE VIDA E MANA ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const MOON=['home','gallery','garden','chapel','stars','boss','tower','ante','mirror'];
// ---- janela de madeira que ilumina ----
// ---- quadros-retrato com rosto e animação ----
const BG=[['#1d3030','#08100f'],['#30202a','#12080e'],['#1c1c36','#08081a'],['#32291a','#120e08']];
const SK=['#e2c2b0','#c89a80','#9a6a50','#efd8c6'],HR=['#1a1216','#6a2a22','#d8b878','#d8d4dc','#5a3a7a'],CT=['#3a1a2a','#1a2a3a','#2a2a1a','#3a1a1a'];
// ---- elixires ----
window.cabHash=id=>{let h=7;for(const ch of String(id))h=(h*31+ch.charCodeAt(0))%100003;return hs(h%997,h%389)};
window.cabLoot=function(g,it){const r=window.cabHash(it.id),p=g.player;
  if(r<.34){p.healItems++;g.showMsg('Encontrou um Elixir de Vida (tecla 1).')}
  else{p.manaItems=(p.manaItems||0)+1;g.showMsg('Encontrou um Elixir de Mana (tecla 2).')}};
const oPU=Player.prototype.update;
Player.prototype.update=function(dt,input,grid){
  if(input.mana&&input.mana()&&(this.manaItems||0)>0&&this.energy<CONFIG.PLAYER.MAX_ENERGY){this.manaItems--;this.energy=Math.min(CONFIG.PLAYER.MAX_ENERGY,this.energy+CONFIG.PLAYER.MAX_ENERGY*.2);
    if(window.__G)window.__G.showMsg('Elixir de Mana: +20% de energia.')}
  return oPU.call(this,dt,input,grid)};
const oBI=buildInteractives;
buildInteractives=function(){
  const keep=['heal_secret_attic','heal_sewer','heal_mirror'];
  const a=oBI().filter(i=>!(i.type==='item'&&(i.item==='heal'||i.item==='energy'))||keep.includes(i.id));
  for(const i of a)if(i.id==='heal_mirror')i.item='mana';
  a.push({type:'item',x:5*T,y:14*T,w:T,h:T,id:'elx_mana_kitchen',item:'mana',collected:false},
   {type:'item',x:156*T,y:109*T,w:T,h:T,id:'elx_life_vault',item:'heal',collected:false},
   {type:'item',x:62*T,y:3*T,w:T,h:T,id:'elx_life_pin',item:'heal',collected:false});
  return a};
const oW=G.drawWorld;G.drawWorld=function(ctx){window.PLP=this.player;window.__G=this;oW.call(this,ctx)};
const oSG=G.saveGame;
G.saveGame=function(){oSG.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k));if(d){d.manaItems=this.player.manaItems||0;localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));if(d&&this.player)this.player.manaItems=d.manaItems||0}catch(e){}};
})();
