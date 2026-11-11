/* ===== SUJEIRA POR ABATES ===== */
(function(){
const G=Game.prototype,MAXD=40;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const oU=G.update;
G.update=function(dt){
  oU.call(this,dt);const p=this.player;if(!p||this.state==='title'||!this.enemies)return;
  p.dirtLvl=p.dirtLvl||0;const s=dt>1?dt/1000:dt;
  for(const e of this.enemies){if(e._dk===undefined)e._dk=e.alive;
    if(e._dk&&!e.alive){p.dirtLvl=Math.min(MAXD,p.dirtLvl+window.dirtPts(e));
      const z=zoneAt(Math.floor(e.x/T),Math.floor(e.y/T)),col=z&&(z.theme==='sewer'||z.theme==='garden')?'#5fa84a':e.stainColor==='black'?'#3a2e52':'#7E35B8';
      (p._dc=p._dc||[]).push(col);if(p._dc.length>8)p._dc.shift()}
    e._dk=e.alive}
  p._dcl=(p._dcl||0)+s;if(p._dcl>=5){p._dcl-=5;p.dirtLvl=Math.max(0,p.dirtLvl-1)}
  p.dirt=p.dirtLvl/MAXD};
})();
