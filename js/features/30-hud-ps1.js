/* ===== HUD do jogador minimalista, estilo PS1 (monitor de batimentos + barras chunky) ===== */
(function(){
const COL=window.COL,U=window.__UIK,K=U.K,tx=U.tx;
const sh=(c,s,x,y,sz,col,al,b)=>{tx(c,s,x+1,y+1,sz,'#000',al,b);tx(c,s,x,y,sz,col,al,b)};
function ecg(c,x,y,w,h,hp,t){const st=hp>=60?0:hp>=30?1:2,col=[K.main,K.amb,K.red][st],rate=[.9,1.5,2.6][st];
  c.fillStyle='#02080a';c.fillRect(x,y,w,h);c.fillStyle='rgba(95,240,160,.08)';for(let gx=4;gx<w;gx+=8)c.fillRect(x+gx,y,1,h);for(let gy=4;gy<h;gy+=8)c.fillRect(x,y+gy,w,1);
  c.save();c.beginPath();c.rect(x+1,y+1,w-2,h-2);c.clip();c.strokeStyle=col;c.lineWidth=1.3;c.shadowColor=col;c.shadowBlur=4;c.beginPath();
  const mid=y+h*.55,flat=hp<8&&Math.floor(t*3)%2;
  for(let i=0;i<=w;i+=1){const u=(((i/w)*1.6-t*rate*.9)%1+1)%1;let v=0;
    if(!flat){if(u<.1)v=Math.sin(u/.1*Math.PI)*.12;else if(u>.30&&u<.34)v=-(u-.30)/.04*.18;else if(u>=.34&&u<.38)v=-.18+(u-.34)/.04*(1.0+.18*0);else if(u>=.38&&u<.43)v=1-(u-.38)/.05*1.4;else if(u>=.43&&u<.47)v=-.4+(u-.43)/.04*.4;else if(u>.6&&u<.72)v=Math.sin((u-.6)/.12*Math.PI)*.2}
    const py=mid-v*(h*.42);i?c.lineTo(x+i,py):c.moveTo(x+i,py)}c.stroke();c.restore();
  c.fillStyle='rgba(0,0,0,.35)';for(let yy=y;yy<y+h;yy+=2)c.fillRect(x,yy,w,1);
  c.fillStyle='#7a68b8';c.fillRect(x,y,w,1);c.fillRect(x,y,1,h);c.fillStyle='#000';c.fillRect(x,y+h-1,w,1);c.fillRect(x+w-1,y,1,h);
  const lb=['FINE','CAUTION','DANGER'][st];sh(c,lb,x+w-3,y+h-4,7,col,'right',true)}
function bar(c,x,y,w,h,v,mx,c1,c2){c.fillStyle='#000';c.fillRect(x-1,y-1,w+2,h+2);c.fillStyle='#14101c';c.fillRect(x,y,w,h);const f=Math.max(0,Math.min(1,v/mx))*w;
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.fillRect(x,y,f,h);
  c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x,y,f,1);c.fillStyle='rgba(0,0,0,.28)';for(let i=0;i<f;i+=2)c.fillRect(x+i,y+h-1,1,1);
  c.fillStyle='#7a68b8';c.fillRect(x-1,y-1,w+2,1);c.fillRect(x-1,y-1,1,h+2)}
COL.hud=function(c,g){const p=g.player,t=performance.now()/1000,mh=CONFIG.PLAYER.MAX_HP,me=CONFIG.PLAYER.MAX_ENERGY,hp=p.hp/mh*100,low=hp<30;
  const x=8,y=8;
  ecg(c,x,y,68,26,hp,t);
  bar(c,x,y+30,68,5,p.hp,mh,low?'#7a1f3a':'#2a8a5a',low?'#ff5a7a':'#8affc0');
  bar(c,x,y+38,50,3,p.energy,me,'#4a2a9a','#b49aff');
  // itens: só ícones e contagem
  let ix=x+9;const it=(ic,cnt,dim)=>{c.save();c.globalAlpha=dim?.4:1;c.translate(ix,y+57);c.scale(.85,.85);if(window.HUDICONS&&window.HUDICONS[ic]){c.lineWidth=1;window.HUDICONS[ic](c,0,0,t)}c.restore();
    if(cnt!==null&&cnt!==undefined)sh(c,'x'+cnt,ix+6,y+64,7,dim?K.vioM:K.hi,'left',true);ix+=cnt!==null&&cnt!==undefined?27:20};
  it('potion',p.healItems,p.healItems<=0);if((p.manaItems||0)>0||p.hasStitch)it('mana',p.manaItems||0,(p.manaItems||0)<=0);
  if(p.hasStitch)it('stitch');if(p.keys.includes('boss_key'))it('key');if(p.hasFlame)it('flame');
  if(low){c.fillStyle='rgba(255,40,80,'+(.05+.05*Math.sin(t*6))+')';c.fillRect(0,0,640,360)}};
})();
