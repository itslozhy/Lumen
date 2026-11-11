/* ===== UI MONITOR: toda a interface no estilo terminal/arquivos do monitor da Mika ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,COL=window.COL;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const MONO='"Courier New", Courier, monospace';
const K={bg:'#030a06',pan:'rgba(3,14,9,.95)',hi:'#c8ffd8',main:'#5ff0a0',mid:'#2fae6c',dim:'#17603c',dark:'#0a2a1a',red:'#ff5a7a',amb:'#ffd27a',txt:'#bff5d4',pl:'#2a2233',plHi:'#5a4d70',plLo:'#0e0a14',vio:'#a98bff',vioD:'#3a2a66',vioM:'#7a68b8'};
// ---------- remapeamento de estilos antigos (fontes de papel e cores rosadas) enquanto a UI desenha ----------
let UI=0;
const P=CanvasRenderingContext2D.prototype,dF=Object.getOwnPropertyDescriptor(P,'font'),dFS=Object.getOwnPropertyDescriptor(P,'fillStyle'),dSS=Object.getOwnPropertyDescriptor(P,'strokeStyle');
const CM={'#d8a0b0':K.vio,'#e6dcc6':K.txt,'#b9abb9':K.mid,'#7a6b8b':K.vioM,'#b8a0d8':K.hi,'#d27a8a':K.main,'#a76e7f':K.mid,'#9a8a9a':K.dim,'#c8284a':K.red,'#e0607a':K.red,'#8a1c36':K.red,'#e2f8ea':K.txt,'#7fe0b0':K.main,
 'rgba(130,24,56,.8)':'rgba(110,80,220,.5)','rgba(122,107,139,.55)':'rgba(53,169,143,.5)','#e8dfcc':K.txt,'#ffe3ee':K.hi,'#fbeee6':K.hi,'#7e9be8':K.main,'#a64c68':K.mid};
let TM=0;const fixC=v=>{if(typeof v!=='string')return v;const lv=v.toLowerCase();if(TM&&lv==='#d8a0b0')return '#f0eaff';const r=CM[lv];return r||v};
const TOKRE=/(\[[^\]]{1,24}\]|[\w.\-]+\.(?:exe|sys|dat|log|txt|rem|sav|bak|tmp)\b|\*\*\*[^*]+\*\*\*|[A-Z\u00C0-\u00DA][A-Z\u00C0-\u00DA_ ]{2,}:)/;
const dFT=P.fillText;P.fillText=function(s,x,y,mw){if(!TM||typeof s!=='string'||!TOKRE.test(s)||!/Courier|monospace/.test(this.font))return dFT.call(this,s,x,y,mw);
  const al=this.textAlign,col=this.fillStyle;this.textAlign='left';let cx=al==='center'?x-this.measureText(s).width/2:al==='right'?x-this.measureText(s).width:x;
  s.split(TOKRE).forEach((q,i)=>{if(!q)return;this.fillStyle=i%2?'#ffd870':col;dFT.call(this,q,cx,y);cx+=this.measureText(q).width});this.fillStyle=col;this.textAlign=al};
function fixF(v){if(typeof v!=='string'||!/Georgia|Segoe|cursive|serif|Bradley/.test(v)||/Courier/.test(v))return v;
  const m=/(\d+(?:\.\d+)?)px/.exec(v);if(!m)return v;const sz=Math.max(8,Math.round(parseFloat(m[1])*.9*10)/10);return (/bold/.test(v)?'bold ':'')+sz+'px '+MONO}
Object.defineProperty(P,'font',{get:dF.get,set(v){dF.set.call(this,UI?fixF(v):v)},configurable:true});
Object.defineProperty(P,'fillStyle',{get:dFS.get,set(v){dFS.set.call(this,UI?fixC(v):v)},configurable:true});
Object.defineProperty(P,'strokeStyle',{get:dSS.get,set(v){dSS.set.call(this,UI?fixC(v):v)},configurable:true});
function ui(name){const o=G[name];G[name]=function(){UI++;try{return o.apply(this,arguments)}finally{UI--}}}
// ---------- primitivas ----------
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
let SCN=null,VIG=null;
function scan(c,a,x,y,w,h){if(!SCN){SCN=mkc(4,3);const s=SCN.getContext('2d');s.fillStyle='rgba(0,0,0,1)';s.fillRect(0,2,4,1)}
  c.save();c.globalAlpha=a==null?.18:a;c.fillStyle=c.createPattern(SCN,'repeat');c.fillRect(x||0,y||0,w==null?640:w,h==null?360:h);c.restore()}
function vign(c,a){if(!VIG){const g=c.createRadialGradient(320,180,120,320,180,420);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.7)');VIG=g}c.save();c.globalAlpha=a==null?1:a;c.fillStyle=VIG;c.fillRect(0,0,640,360);c.restore()}
function tx(c,s,x,y,sz,col,al,b){c.font=(b?'bold ':'')+sz+'px '+MONO;c.fillStyle=col||K.txt;c.textAlign=al||'left';c.fillText(s,x,y);c.textAlign='left'}
function win(c,x,y,w,h,title,o){o=o||{};x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  c.save();c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=o.sh==null?8:o.sh;c.fillStyle=K.pl;c.fillRect(x,y,w,h);c.shadowBlur=0;
  c.fillStyle='#7a68b8';c.fillRect(x,y,w,1);c.fillRect(x,y,1,h);c.fillStyle=K.plLo;c.fillRect(x,y+h-1,w,1);c.fillRect(x+w-1,y,1,h);
  const ix=x+2,iy=y+2,iw=w-4,ih=h-4;c.fillStyle=o.bg||K.pan;c.fillRect(ix,iy,iw,ih);
  const gr=c.createLinearGradient(0,iy,0,iy+ih);gr.addColorStop(0,'rgba(80,255,150,.08)');gr.addColorStop(1,'rgba(140,100,255,.12)');c.fillStyle=gr;c.fillRect(ix,iy,iw,ih);
  scan(c,.16,ix,iy,iw,ih);
  c.fillStyle='#000';c.fillRect(ix,iy,iw,1);c.fillRect(ix,iy,1,ih);c.fillStyle=o.line||K.vioM;c.fillRect(ix,iy+ih-1,iw,1);c.fillRect(ix+iw-1,iy,1,ih);
  if(title!==null){const col=o.line||K.main,on=o.focus!==false;c.fillStyle='#020a05';c.fillRect(ix+1,iy+1,iw-2,10);for(let yy=iy+3,q=0;yy<iy+10;yy+=2,q++){c.fillStyle=!on?K.dim:(q%2&&!o.line?K.vio:col);c.fillRect(ix+1,yy,iw-2,1)}
    c.font='bold 8px '+MONO;let t=String(title||'');while(t.length>3&&c.measureText(t).width>iw-44)t=t.slice(0,-2);const tw=c.measureText(t).width;
    c.fillStyle='#020a05';c.fillRect(ix+Math.round(iw/2-tw/2)-4,iy+1,tw+8,10);c.fillStyle=col;c.textAlign='center';c.fillText(t,ix+iw/2,iy+9);c.textAlign='left';
    c.strokeStyle=col;c.strokeRect(ix+4.5,iy+2.5,6,6);c.fillStyle='#020a05';c.fillRect(ix+iw-12,iy+3,8,5);c.strokeRect(ix+iw-11.5,iy+3.5,7,4)}
  c.restore()}
function seg(c,x,y,w,h,v,mx,col,bg){const n=Math.floor(w/4),f=Math.max(0,Math.min(1,v/mx));c.fillStyle=bg||K.dark;c.fillRect(x,y,w,h);const k=Math.ceil(n*f-1e-6);c.fillStyle=col;for(let i=0;i<k;i++)c.fillRect(x+i*4,y,3,h)}
function btn(c,x,y,w,h,label,on){c.fillStyle=on?K.main:'rgba(2,13,12,.9)';c.fillRect(x,y,w,h);c.strokeStyle=on?K.hi:K.vioM;c.strokeRect(x+.5,y+.5,w-1,h-1);tx(c,label,x+w/2,y+h/2+3.5,10,on?'#021410':K.mid,'center',on)}
function cur(t){return Math.floor(t*2.2)%2?'\u2588':' '}
const T0=()=>performance.now()/1000;
// ---------- HUD ----------
COL.hud=function(c,g){
  const p=g.player,t=T0(),mh=CONFIG.PLAYER.MAX_HP,me=CONFIG.PLAYER.MAX_ENERGY,low=p.hp<30,bl=low&&Math.floor(t*4)%2;
  win(c,5,4,210,52,'mika.exe',low?{line:K.red}:{});
  // retrato
  c.fillStyle='#010504';c.fillRect(9,17,36,36);
  const por=window.ART&&window.ART.get('portrait');if(por){const pw=por.naturalWidth||por.width;c.save();c.beginPath();c.rect(9,17,36,36);c.clip();c.drawImage(por,0,0,pw,pw*.92,9,17,36,36);c.fillStyle='rgba(20,210,160,.2)';c.fillRect(9,17,36,36);c.restore()}
  scan(c,.3,9,17,36,36);c.strokeStyle=low?K.red:K.dim;c.strokeRect(8.5,16.5,37,37);
  if(low){c.fillStyle='rgba(255,40,80,'+(.14+.14*Math.sin(t*8))+')';c.fillRect(9,17,36,36)}
  // barras
  const row=(y,lb,v,mx,col)=>{tx(c,lb,50,y+7,8,K.vio,'left',true);seg(c,66,y,102,7,v,mx,col);c.strokeStyle=K.vioM;c.strokeRect(65.5,y-.5,103,8);tx(c,Math.ceil(v)+'/'+mx,173,y+7,8,K.txt)};
  row(17,'HP',p.hp,mh,low?K.red:'#5fe8b8');row(29,'EN',p.energy,me,'#a58cff');
  let zn='';try{const z=zoneAt(Math.floor((p.x+14)/T),Math.floor((p.y+20)/T));zn=z?z.name:''}catch(e){}
  if(low)tx(c,bl?'!! INTEGRIDADE CRITICA':'',50,50,7.5,K.red,'left',true);
  else tx(c,('> '+zn.toUpperCase()).slice(0,28)+cur(t),50,50,7.5,K.dim);
  // inventário
  let x=5;const slot=(ic,key,cnt,ok)=>{c.fillStyle=K.pan;c.fillRect(x,59,28,24);c.strokeStyle=ok===false?K.dim:K.vioM;c.strokeRect(x+.5,59.5,27,23);
    c.save();c.globalAlpha=ok===false?.4:1;if(window.HUDICONS&&window.HUDICONS[ic]){c.lineWidth=1;window.HUDICONS[ic](c,x+14,72,t)}c.restore();
    if(key)tx(c,key,x+3,67,7,K.vio,'left',true);if(cnt!==null&&cnt!==undefined)tx(c,cnt,x+25,80,7.5,K.hi,'right');x+=31};
  slot('potion','1','x'+p.healItems,p.healItems>0);slot('mana','2','x'+(p.manaItems||0),(p.manaItems||0)>0);
  if(p.hasStitch)slot('stitch');if(p.keys.includes('boss_key'))slot('key');if(p.hasFlame)slot('flame')};
COL.banner=function(c,name,a){a=Math.max(0,a);const nm=name.toUpperCase(),path='C:\\CASA_DESFEITA\\'+nm.replace(/\s+/g,'_');
  c.save();c.globalAlpha=Math.min(1,a*1.5);c.font='bold 16px '+MONO;const w=Math.max(250,c.measureText(nm).width+40,c.measureText(path).width*.8+24),x=Math.round(320-w/2),y=78;
  win(c,x,y,w,46,'cd.exe');const n=Math.ceil(Math.min(1,a*1.8)*path.length);
  tx(c,('> '+path.slice(0,n)).slice(0,44),x+8,y+23,9,K.vio);c.font='bold 16px '+MONO;c.fillStyle=K.hi;c.fillText(nm,x+8,y+41);
  c.restore()};
G.drawToast=function(c){const m=this.message;if(!m)return;c.save();c.font='11px '+MONO;const ls=COL.wrap(c,m,500),h=8+ls.length*13,w=Math.min(552,Math.max.apply(null,ls.map(l=>c.measureText(l).width))+34),x=Math.round(320-w/2),y=Math.round(348-h);
  c.fillStyle='rgba(2,13,12,.95)';c.fillRect(x,y,w,h);c.strokeStyle=K.vioM;c.strokeRect(x+.5,y+.5,w-1,h-1);c.fillStyle=K.vio;c.fillRect(x,y-7,26,7);tx(c,'LOG',x+13,y-1.5,6.5,'#021410','center',true);
  ls.forEach((l,i)=>{tx(c,i?'':'>',x+6,y+14+i*13,11,K.main);tx(c,l,x+19,y+14+i*13,11,K.txt)});c.restore()};
G.drawInteractHints=function(ctx){const hb=this.player.hitbox,range={x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24};
  for(const it of this.interactives){if(it.type==='rest')continue;if((it.collected||it.looted)&&it.type!=='rest'&&it.type!=='npc'&&it.type!=='book'&&it.type!=='painting'&&it.type!=='door_lock')continue;
    if(rectOverlap(range,it)){const px=Math.floor(it.x-this.camera.x+it.w/2),py=Math.floor(it.y-this.camera.y-16);
      ctx.fillStyle='rgba(2,13,12,.92)';ctx.fillRect(px-42,py-10,84,15);ctx.strokeStyle=K.vio;ctx.strokeRect(px-41.5,py-9.5,83,14);
      tx(ctx,'[E] interagir'+cur(T0()),px,py+1,8.5,K.hi,'center',true);break}}};
// ---------- diálogo ----------
COL.dialog=function(g,c){const t=T0(),d=g.dialog,nm=String(d.name||'').toLowerCase().replace(/\s+/g,'_');
  win(c,36,244,568,100,nm+'.msg');
  tx(c,String(d.name||'').toUpperCase()+':',48,271,10,K.vio,'left',true);
  c.font='12.5px '+MONO;COL.wrap(c,d.lines[g.dialogIndex]||'',520).slice(0,3).forEach((l,i)=>tx(c,l,48,289+i*16,12.5,K.txt));
  tx(c,'['+(g.dialogIndex+1)+'/'+d.lines.length+']',48,337,8,K.dim);
  if(Math.floor(t*2)%2)tx(c,'[E] continuar \u25B8',592,337,9,K.main,'right',true)};
// ---------- morte, vitória ----------
G.drawDeath=function(c){const t=T0();c.fillStyle='rgba(0,4,4,.92)';c.fillRect(0,0,640,360);scan(c,.2);
  win(c,110,112,420,122,'erro_fatal.log',{line:K.red});
  const o=Math.floor(t*10)%17===0?2:0;c.font='bold 20px '+MONO;c.textAlign='center';if(o){c.fillStyle='rgba(255,90,122,.6)';c.fillText('AS MEM\u00D3RIAS SE DESFAZEM\u2026',320+o*2,158+o)}c.fillStyle=K.hi;c.fillText('AS MEM\u00D3RIAS SE DESFAZEM\u2026',320,158);c.textAlign='left';
  tx(c,'> processo mika.exe encerrado (0xFADE)',130,186,10,K.red);tx(c,'> [ENTER] restaurar \u00FAltima fita'+cur(t),130,206,10,K.main);vign(c,.8)};
G.drawWin=function(c){const t=T0();c.fillStyle='rgba(0,4,4,.94)';c.fillRect(0,0,640,360);scan(c,.2);
  win(c,100,98,440,140,'casa_desfeita.log');
  tx(c,'A Casa Desfeita silencia.',320,138,19,K.hi,'center',true);
  tx(c,'> processo costureira_vazia.exe finalizado',120,170,10,K.mid);tx(c,'> fragmentos recuperados: '+this.player.memories.length,120,188,10,K.txt);tx(c,'> [ENTER] voltar ao menu'+cur(t),120,214,10,K.main);vign(c,.8)};
// ---------- painéis genéricos (escolhas, narrativa, conexões) ----------
const PT=['memoria.txt','registro.log','eco.dat','fragmento.sav'];
COL.panel=function(c,x,y,w,h,kind,seed){win(c,x,y,w,h,kind==='mon'?'terminal.sys':PT[(seed|0)%PT.length],{sh:12});if(kind==='mon'){c.fillStyle='rgba(106,90,138,.88)';c.fillRect(x+6,y+14,w-12,17);c.fillStyle='rgba(176,150,230,.85)';c.fillRect(x+6,y+14,w-12,1);c.fillStyle='rgba(30,20,60,.6)';c.fillRect(x+6,y+30,w-12,1)}};
COL.label=function(c,x,y,text,font){c.save();c.font='bold 11px '+MONO;const w=c.measureText(text).width+16;c.fillStyle='rgba(2,13,12,.94)';c.fillRect(x-8,y-14,w,19);c.strokeStyle=K.main;c.strokeRect(x-7.5,y-13.5,w-1,18);c.fillStyle=K.hi;c.fillText(text,x,y);c.restore()};
COL.paper=function(c,x,y,w,h){win(c,x,y,w,h,null)};COL.tape=function(){};COL.stitch=function(){};
COL.ransom=function(c,text,x,y,size){c.font='bold '+size+'px '+MONO;c.fillStyle=K.hi;c.fillText(text,x,y+size)};
// ---------- transição ----------
COL.wipe=function(c,f){if(f>=.995){c.fillStyle='#010504';c.fillRect(0,0,640,360);return}
  const edge=-20+f*700;c.save();for(let y=0;y<360;y+=12){const e=edge+(hs(y,9)-.5)*40+Math.sin(y*.05)*10;c.fillStyle='#010504';c.fillRect(0,y,Math.max(0,e),12);c.fillStyle=K.main;c.fillRect(e,y,2,12);if(hs(y,Math.floor(f*30))>.55){c.fillStyle=K.mid;c.fillRect(e+4,y+3,6+hs(y,2)*30,2)}}
  scan(c,.2,0,0,Math.max(0,edge),360);c.restore()};
// ---------- mapa ----------
COL.map=function(g,c){const t=T0(),p=g.player,sc=1.5,ox=20,oy=46;
  c.fillStyle=K.bg;c.fillRect(0,0,640,360);
  win(c,6,4,376,346,'mapa.exe');tx(c,'C:\\CASA_DESFEITA\\MAPA> exibir',12,26,8,K.mid);
  c.save();c.beginPath();c.rect(7,36,374,313);c.clip();
  c.strokeStyle='rgba(53,169,143,.12)';c.lineWidth=1;for(let x=ox;x<382;x+=33){c.beginPath();c.moveTo(x+.5,36);c.lineTo(x+.5,349);c.stroke()}for(let y=oy;y<349;y+=33){c.beginPath();c.moveTo(7,y+.5);c.lineTo(381,y+.5);c.stroke()}
  for(const z of ZONES){if(z.w<=0)continue;const v=p.visitedZones.has(z.id),x=ox+z.x*sc,y=oy+z.y*sc,w=z.w*sc,h=z.h*sc;
    if(v){c.globalAlpha=.32;c.fillStyle=K.mid;c.fillRect(x,y,w,h);c.globalAlpha=1;c.strokeStyle=K.main;c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);
      if(w>46){c.fillStyle=K.hi;c.font='7px '+MONO;c.fillText(z.name.length>w/4.2?z.name.slice(0,Math.floor(w/4.2)):z.name,x+3,y+9)}}
    else{c.strokeStyle='rgba(53,169,143,.35)';c.setLineDash([2,3]);c.strokeRect(x+.5,y+.5,w-1,h-1);c.setLineDash([])}}
  for(const it of g.interactives){if(it.type!=='rest')continue;const z=zoneAt(Math.floor(it.x/T),Math.floor(it.y/T));if(!z||!p.visitedZones.has(z.id))continue;
    const x=ox+it.x/T*sc,y=oy+it.y/T*sc;c.fillStyle=K.amb;c.beginPath();c.moveTo(x,y-4);c.lineTo(x+3,y);c.lineTo(x,y+4);c.lineTo(x-3,y);c.fill()}
  const mx=ox+(p.x/T)*sc,my=oy+(p.y/T)*sc,pu=2+Math.sin(t*4)*1.5;c.strokeStyle='rgba(180,255,228,.7)';c.lineWidth=1;c.strokeRect(mx-5-pu/2,my-5-pu/2,10+pu,10+pu);
  c.fillStyle=Math.floor(t*3)%2?K.hi:K.main;c.fillRect(mx-2,my-2,4,4);tx(c,'VOC\u00CA',mx+9,my-6,7.5,K.hi,'left',true);
  c.restore();
  // legenda
  const nf=(p.nar&&p.nar.f)||{};win(c,388,4,246,128,'legenda.txt');
  c.globalAlpha=.4;c.fillStyle=K.mid;c.fillRect(398,24,12,8);c.globalAlpha=1;c.strokeStyle=K.main;c.strokeRect(398.5,24.5,11,7);tx(c,'zona visitada',416,31,9,K.txt);
  c.strokeStyle='rgba(53,169,143,.5)';c.setLineDash([2,2]);c.strokeRect(398.5,38.5,11,7);c.setLineDash([]);tx(c,'n\u00E3o explorada',416,45,9,K.txt);
  c.fillStyle=K.amb;c.beginPath();c.moveTo(404,52);c.lineTo(407,56);c.lineTo(404,60);c.lineTo(401,56);c.fill();tx(c,'terminal de fita',416,59,9,K.txt);
  c.fillStyle=K.hi;c.fillRect(402,66,5,5);tx(c,'voc\u00EA',416,73,9,K.txt);
  tx(c,'chama de l\u00FAmen: '+(p.hasFlame?'sim':'n\u00E3o'),398,92,9,p.hasFlame?K.amb:K.dim);tx(c,'libertados: '+(nf.free_n||0),398,106,9,K.main);tx(c,'finalizados: '+(nf.cut_n||0),398,120,9,K.red);
  const rec=p.records||[];win(c,388,138,246,212,'registros.log');tx(c,'> '+rec.length+' entrada(s)',398,160,9,K.mid);
  rec.slice(-9).forEach((r,i)=>tx(c,'\u2022 '+(r[0].length>31?r[0].slice(0,30)+'\u2026':r[0]),398,176+i*13,9,K.txt));
  if(!rec.length)tx(c,'// nada registrado ainda.',398,178,9,K.dim);
  tx(c,'// a casa n\u00E3o \u00E9 um lugar.',398,334,8,K.dim);
  scan(c,.1);vign(c,.6);tx(c,'[M/Esc] fechar \u00B7 [L] \u00E1lbum',376,344,8,K.dim,'right')};
// ---------- pausa ----------
const PM=['CONTINUAR','MAPA','\u00C1LBUM','SAIR'];
G.drawPause=function(c){const sel=this._pm||0,t=T0();c.fillStyle='rgba(0,5,5,.84)';c.fillRect(0,0,640,360);scan(c,.2);
  if(this._pq){win(c,150,116,340,120,'confirmar.exe',{line:K.amb});tx(c,'Encerrar sess\u00E3o e voltar ao menu?',320,152,12,K.hi,'center',true);tx(c,'O progresso desde o \u00FAltimo descanso ser\u00E1 perdido.',320,170,9,K.txt,'center');
    btn(c,200,194,100,22,'[ SAIR ]',(this._pqs||0)===0);btn(c,340,194,100,22,'[ VOLTAR ]',(this._pqs||0)===1);vign(c,.8);return}
  win(c,206,78,228,200,'pausa.sys');tx(c,'PROCESSO SUSPENSO',320,106,10,K.vio,'center',true);
  c.fillStyle=K.dim;c.fillRect(222,114,196,1);
  PM.forEach((o,i)=>{const y=126+i*36,on=i===sel;btn(c,226,y,188,28,(on?'> ':'  ')+o,on)});
  tx(c,'W/S escolher \u00B7 E confirmar'+cur(t),320,268,8,K.dim,'center');vign(c,.8)};
// ---------- tela inicial: fita cassete, faixas = menu ----------
const DESC={novo:'Inicia uma nova sessão na Casa Desfeita.',contin:'Retoma a partir do último ponto salvo.',cred:'Quem teceu este jardim.'};
const HANDF='"Segoe Script","Bradley Hand","Comic Sans MS",cursive';
const TS={sel:-1,cnt:0,burst:0,dir:1,last:0,ang:[0,0],hy:0,flash:0,vu:0};
function spire(c,x,b,w,h,col){c.fillStyle=col;c.fillRect(x,b-h,w,h);c.beginPath();c.moveTo(x-2,b-h);c.lineTo(x+w/2,b-h-w*1.7);c.lineTo(x+w+2,b-h);c.fill()}
function reel(c,cx,cy,R,ang){c.save();c.beginPath();c.arc(cx,cy,R,0,TAU);c.fillStyle='#1c120e';c.fill();c.strokeStyle='#3a261c';c.lineWidth=1;c.stroke();
  c.strokeStyle='rgba(255,220,180,.14)';c.beginPath();c.arc(cx,cy,R-3,.5,1.5);c.stroke();
  c.beginPath();c.arc(cx,cy,13,0,TAU);c.fillStyle='#e8dfcc';c.fill();c.beginPath();c.arc(cx,cy,9,0,TAU);c.fillStyle='#120c14';c.fill();
  c.fillStyle='#e8dfcc';for(let i=0;i<6;i++){c.save();c.translate(cx,cy);c.rotate(ang+i*TAU/6);c.fillRect(-1.5,-9,3,5);c.restore()}c.restore()}
function bevelKey(c,x,y,w,h,lbl,down,lit){const o=down?1:0;c.fillStyle='#120c1a';c.fillRect(x,y,w,h);c.fillStyle=lit?'#2a6a48':'#4a3f5c';c.fillRect(x+1,y+1+o,w-2,h-3);
  c.fillStyle=down?'#2a2233':'#7a6b90';c.fillRect(x+1,y+1+o,w-2,1);c.fillRect(x+1,y+1+o,1,h-3);c.fillStyle='#171220';c.fillRect(x+1,y+h-3,w-2,2);
  tx(c,lbl,x+w/2,y+h/2+3+o,9,lit?K.hi:'#d8cfe8','center',true);if(lit){c.fillStyle=K.main;c.fillRect(x+w-8,y+4,3,3)}}
G.drawTitle=function(c){
  const t=T0(),g=this,n=g.titleOptions.length,dt=Math.min(.1,Math.max(0,t-TS.last||0));TS.last=t;
  if(TS.sel<0)TS.sel=g.titleSelect;
  if(g.titleSelect!==TS.sel){TS.dir=((g.titleSelect-TS.sel+n)%n===1)?1:-1;TS.sel=g.titleSelect;TS.burst=1;TS.flash=.35}
  TS.burst=Math.max(0,TS.burst-dt*1.5);TS.flash=Math.max(0,TS.flash-dt);
  const tgt=TS.sel*150;TS.cnt+=(tgt-TS.cnt)*Math.min(1,dt*5);
  const sp=2.4+TS.burst*TS.burst*16;TS.ang[0]+=sp*dt*TS.dir;TS.ang[1]+=sp*dt*TS.dir*1.12;
  // fundo: casa fantasma, estrelas
  const sky=c.createLinearGradient(0,0,0,360);sky.addColorStop(0,'#0a0714');sky.addColorStop(1,'#1c1030');c.fillStyle=sky;c.fillRect(0,0,640,360);
  c.save();for(let i=0;i<60;i++){c.globalAlpha=.2+.6*Math.abs(Math.sin(t*1.2+i*2.3));c.fillStyle='#b8a8d8';c.fillRect(hs(i,1)*640,hs(i,2)*200,1,1)}
  c.globalAlpha=1;[['#241838',.55],['#150d22',.85]].forEach(([col,s],li)=>{for(let i=0;i<14;i++){const w=16+hs(i,li+3)*20,h=(50+hs(i,li+5)*110)*s;spire(c,i*50+li*20-10,340,w,h,col)}});c.restore();
  // ---- cassete ----
  const X=120,Y=12,W=400,H=244;c.save();c.translate(X,Y);
  c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=18;c.shadowOffsetY=6;c.fillStyle='#352c44';rr(c,0,0,W,H,12);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#4a3f5c');bg.addColorStop(1,'#241d2e');c.fillStyle=bg;rr(c,1,1,W-2,H-2,11);c.fill();c.strokeStyle='#0e0a14';c.lineWidth=2;rr(c,1,1,W-2,H-2,11);c.stroke();
  for(const [sx,sy] of [[13,13],[W-13,13],[13,H-13],[W-13,H-13]]){c.fillStyle='#14101c';c.beginPath();c.arc(sx,sy,4.5,0,TAU);c.fill();c.fillStyle='#8a7aa0';c.beginPath();c.arc(sx,sy,3,0,TAU);c.fill();c.strokeStyle='#14101c';c.beginPath();c.moveTo(sx-2,sy-1);c.lineTo(sx+2,sy+1);c.stroke()}
  // etiqueta
  c.fillStyle='#d9cfb6';c.fillRect(24,18,352,124);const ls=c.createLinearGradient(0,18,0,142);ls.addColorStop(0,'rgba(255,255,255,.12)');ls.addColorStop(1,'rgba(90,60,40,.18)');c.fillStyle=ls;c.fillRect(24,18,352,124);
  for(let i=0;i<7;i++){c.fillStyle='rgba(120,100,80,.25)';c.fillRect(24,50+i*14,352,1)}
  for(let i=0;i<70;i++){c.fillStyle='rgba(80,60,40,'+(.04+hs(i,5)*.06)+')';c.fillRect(24+hs(i,6)*352,18+hs(i,7)*124,1+hs(i,8)*2,1)}
  c.fillStyle='#b8566f';c.fillRect(24,18,352,14);tx(c,'LADO A',32,29,9,'#f4e8e0',null,true);tx(c,'C-60 · TYPE II',368,29,8,'#f4e8e0','right');
  c.fillStyle='#2a2030';c.font='bold 30px '+MONO;c.fillText('LÚMEN',34,62);tx(c,'o jardim do fim',36,76,10,'#5a3a4a');
  // faixas
  const lane=i=>90+i*17;TS.hy+=(lane(TS.sel)-TS.hy)*Math.min(1,dt*9);if(!TS.hy)TS.hy=lane(TS.sel);
  c.fillStyle='rgba(210,122,138,.55)';c.fillRect(150,TS.hy-12,214,15);c.fillStyle='#b8566f';c.beginPath();c.moveTo(138,TS.hy-10);c.lineTo(146,TS.hy-4.5);c.lineTo(138,TS.hy+1);c.fill();
  const CODE=['A1','A2','B1','B2'];
  g.titleOptions.forEach((o,i)=>{const lk=/contin/i.test(o)&&!g.hasSave,y=lane(i),s=i===TS.sel;
    c.font='bold 11px '+MONO;c.fillStyle=lk?'#9a8f80':'#3a2a4a';c.fillText(CODE[i]||'B'+i,34,y-1);
    c.font='italic '+(s?'bold ':'')+'14px '+HANDF;c.fillStyle=lk?'#9a8f80':(s?'#1a1020':'#4a3a5a');c.fillText(o.toUpperCase(),156,y-1);
    if(lk){c.strokeStyle='#9a8f80';c.beginPath();c.moveTo(156,y-5);c.lineTo(156+c.measureText(o.toUpperCase()).width,y-5);c.stroke();tx(c,'(fita em branco)',364,y-1,8,'#9a8f80','right')}
    else tx(c,['00:00','—','—'][i]||'',364,y-1,8,'#6a5a6a','right')});
  c.strokeStyle='#8a7a68';c.strokeRect(24.5,18.5,351,123);
  // janela da fita
  c.fillStyle='#0a0610';rr(c,78,148,244,60,8);c.fill();c.strokeStyle='#8a7aa0';c.lineWidth=1;rr(c,78.5,148.5,243,59,8);c.stroke();
  c.save();rr(c,80,150,240,56,7);c.clip();const pr=Math.min(1,TS.cnt/300),RL=25-11*pr,RR=14+11*pr;
  const wg=c.createLinearGradient(0,150,0,206);wg.addColorStop(0,'rgba(120,100,150,.25)');wg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=wg;c.fillRect(80,150,240,56);
  c.strokeStyle='#4a2c20';c.lineWidth=2;c.beginPath();c.moveTo(142,178+RL);c.lineTo(258,178+RR);c.stroke();
  reel(c,142,178,RL,TS.ang[0]);reel(c,258,178,RR,TS.ang[1]);
  for(let i=0;i<5;i++){c.fillStyle='rgba(255,255,255,.35)';c.fillRect(194+i*3,155,1,i%2?3:5)}c.restore();
  // base trapezoidal
  c.fillStyle='#1a1424';c.beginPath();c.moveTo(66,214);c.lineTo(334,214);c.lineTo(352,H-5);c.lineTo(48,H-5);c.closePath();c.fill();c.strokeStyle='#0e0a14';c.lineWidth=1.5;c.stroke();
  for(const hx of [88,312]){c.fillStyle='#08050c';c.beginPath();c.arc(hx,H-22,5,0,TAU);c.fill();c.strokeStyle='#6a5c80';c.stroke()}for(const hx of [160,180,200,220,240]){c.fillStyle='#08050c';c.beginPath();c.arc(hx+0,H-14,2,0,TAU);c.fill()}
  c.fillStyle='#08050c';c.fillRect(176,218,48,8);
  // contador mecânico dentro da janela? marca de fita
  c.restore();
  // ---- medidor VU (esquerda) ----
  win(c,10,64,104,84,'vu.sys');const vu=Math.min(1,.35+.25*Math.sin(t*7)+.2*Math.sin(t*13+1)+TS.burst*.5);TS.vu+=(vu-TS.vu)*Math.min(1,dt*10);
  c.save();c.beginPath();c.rect(14,78,96,68);c.clip();c.fillStyle='#d9cfb6';c.fillRect(14,78,96,68);const px=62,py=140;
  for(let i=0;i<=10;i++){const a=Math.PI*(1.2+i*.06);c.strokeStyle=i>7?'#b8334f':'#3a2a4a';c.lineWidth=i%5?1:1.6;c.beginPath();c.moveTo(px+Math.cos(a)*46,py+Math.sin(a)*46);c.lineTo(px+Math.cos(a)*(i%5?41:38),py+Math.sin(a)*(i%5?41:38));c.stroke()}
  const na=Math.PI*(1.2+TS.vu*.6);c.strokeStyle='#14101c';c.lineWidth=1.3;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(na)*44,py+Math.sin(na)*44);c.stroke();c.fillStyle='#3a2a4a';c.fillRect(14,132,96,14);c.restore();
  tx(c,'VU',20,98,9,'#3a2a4a',null,true);tx(c,'L',20,143,8,K.main);tx(c,'R',104,143,8,K.main,'right');
  // ---- contador (direita) ----
  win(c,526,64,104,84,'contador');const cn=String(Math.max(0,Math.round(TS.cnt))).padStart(3,'0');
  for(let i=0;i<3;i++){const dx=544+i*24;c.fillStyle='#050308';c.fillRect(dx,84,20,30);c.strokeStyle='#4a3f5c';c.strokeRect(dx+.5,84.5,19,29);c.fillStyle='rgba(255,255,255,.06)';c.fillRect(dx+1,98,18,1);tx(c,cn[i],dx+10,106,20,'#e8dfcc','center',true)}
  c.fillStyle=Math.floor(t*2)%2?'#ff3a5a':'#5a1a2a';c.fillRect(538,128,6,6);tx(c,'REC',548,134,8,K.mid);c.fillStyle=K.main;c.fillRect(580,128,6,6);tx(c,'PLAY',590,134,8,K.mid);
  // ---- teclas ----
  const kx=X+(W-4*92-3*8)/2,ky=266,fl=TS.flash>0;
  bevelKey(c,kx,ky,92,26,'◀◀ ANT',fl&&TS.dir<0);bevelKey(c,kx+100,ky,92,26,'▶ PLAY',false,true);bevelKey(c,kx+200,ky,92,26,'■ STOP',false);bevelKey(c,kx+300,ky,92,26,'PRÓX ▶▶',fl&&TS.dir>0);
  // ---- display ----
  const opt=(g.titleOptions[TS.sel]||'').toUpperCase(),k=Object.keys(DESC).find(k=>new RegExp(k,'i').test(opt))||'novo';
  win(c,X,299,W,44,'display');tx(c,(CODE[TS.sel]||'A1')+' ▶ '+opt+'  '+cn,X+10,324,10,K.hi,null,true);
  c.font='9px '+MONO;c.fillStyle=K.mid;c.fillText('// '+DESC[k],X+10,336);
  tx(c,'W/S faixa  ·  ENTER play',X+W-8,324,8,K.dim,'right');
  tx(c,'“Tudo o que você lembra também é uma mentira.”',320,354,8,'#6a5c80','center');
  scan(c,.14);vign(c,.8);
};
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath()}
// ---------- álbum ----------
const A=window.__ALBU;
if(A){const STAMPS={collect:['COLETADO',K.amb],destroy:['DESTRU\u00CDDO',K.red],free:['LIBERTADO',K.main],cut:['FINALIZADO',K.red]};
 const tag=(c,cat,x,y,al)=>{const s=STAMPS[cat];if(!s)return;c.font='bold 7.5px '+MONO;const w=c.measureText(s[0]).width+8;c.fillStyle='rgba(2,10,10,.85)';c.fillRect(al==='r'?x-w:x,y,w,11);c.strokeStyle=s[1];c.strokeRect((al==='r'?x-w:x)+.5,y+.5,w-1,10);c.fillStyle=s[1];c.fillText(s[0],(al==='r'?x-w:x)+4,y+8.5)};
 const fname=e=>(e.k==='doc'?'doc_':e.k==='item'?'item_':'img_')+String(e.id).toLowerCase().replace(/[^a-z0-9]+/g,'_')+(e.k==='doc'?'.txt':e.k==='item'?'.dat':'.bmp');
 const thumb=(c,e,x,y,w,h,sc)=>{
   if(!e.un){c.fillStyle='#010504';c.fillRect(x,y,w,h);for(let i=0;i<14;i++){c.fillStyle='rgba(53,169,143,'+(.05+hs(i,3)*.1)+')';c.fillRect(x,y+hs(i,4)*h,w,1)}tx(c,'?',x+w/2,y+h/2+10*sc,28*sc,K.dim,'center',true);tx(c,'N\u00C3O REGISTRADO',x+w/2,y+h-5,7,K.dim,'center');return}
   if(e.k==='doc'){c.fillStyle='#010504';c.fillRect(x,y,w,h);c.fillStyle=K.dim;c.fillRect(x+6,y+6,w-12,9);tx(c,(e.kind||'note').toUpperCase()+'.TXT',x+9,y+13,7,'#021410',null,true);
     for(let i=0;i<8;i++){c.fillStyle=i%3?K.mid:K.main;c.globalAlpha=.55;c.fillRect(x+8,y+24+i*(h-34)/8,(w-24)*(.45+hs(i,sd2(e.id))*.5),2);c.globalAlpha=1}return}
   const ph=A.photoOf(e);c.imageSmoothingEnabled=false;c.drawImage(ph,x,y,w,h);c.fillStyle='rgba(20,230,180,.1)';c.fillRect(x,y,w,h);scan(c,.22,x,y,w,h);if(sc<1.5)tag(c,e.cat,x+w-2,y+2,'r')};
 const sd2=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))%100003;return h};
 COL.album=function(g,c){const al=g._alb,list=al.lists[al.tab],sel=al.sel[al.tab],t=T0();
  c.fillStyle=K.bg;c.fillRect(0,0,640,360);win(c,4,3,632,354,'album.exe \u2014 C:\\MIKA\\MEM\u00D3RIAS');
  A.TABS.forEach((n,i)=>{const on=i===al.tab,x=12+i*154,un=al.lists[i].filter(e=>e.un).length;c.fillStyle=on?K.main:K.pan;c.fillRect(x,17,148,15);c.strokeStyle=on?K.hi:K.dim;c.strokeRect(x+.5,17.5,147,14);tx(c,n+' '+un+'/'+al.lists[i].length,x+74,28,9,on?'#021410':K.mid,'center',true)});
  const pages=Math.max(1,Math.ceil(list.length/6)),pg=Math.floor(sel/6);tx(c,'p\u00E1g '+(pg+1)+'/'+pages,626,28,8,K.dim,'right');
  for(let i=0;i<6;i++){const idx=pg*6+i,e=list[idx];if(!e)continue;const cc=i%3,r=Math.floor(i/3),x=22+cc*204,y=40+r*146,s=idx===sel;
    c.fillStyle=s?'rgba(40,170,140,.16)':K.pan;c.fillRect(x,y,194,138);c.strokeStyle=s?K.hi:(e.un?K.mid:K.dark);c.lineWidth=s?2:1;c.strokeRect(x+.5,y+.5,193,137);c.lineWidth=1;
    c.fillStyle=s?K.main:(e.un?K.dim:K.dark);c.fillRect(x+1,y+1,192,9);tx(c,fname(e).slice(0,32),x+4,y+8.5,7,'#021410',null,true);
    thumb(c,e,x+15,y+14,164,109,1.4);
    tx(c,e.un?(e.t.length>34?e.t.slice(0,33)+'\u2026':e.t):'\u2014',x+97,y+134,7.5,e.un?K.txt:K.dim,'center');
    if(s)tx(c,'\u25B6',x-1,y+72,10,K.hi,'right',true)}
  tx(c,'\u2190 \u2192 \u2191 \u2193 escolher  \u00B7  Q / R trocar de aba  \u00B7  E abrir  \u00B7  L / Esc fechar'+cur(t),14,350,8,K.dim);
  if(al.detail){const e=list[sel];c.fillStyle='rgba(0,5,5,.9)';c.fillRect(0,0,640,360);scan(c,.2);
    if(e.k==='doc'){win(c,70,14,500,326,fname(e));tx(c,'tipo: '+(e.kind||'nota')+'   local: '+A.zname(e.z),84,38,9,K.mid);c.fillStyle=K.dim;c.fillRect(84,44,472,1);
      c.font='12.5px '+MONO;let y=64;for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,470)){if(y>322)break;tx(c,l,84,y,12.5,e.kind==='screen'?K.hi:K.txt);y+=17}y+=5}
      tx(c,e.t,320,356,9,K.main,'center',true);tx(c,'Esc \u2014 voltar',566,332,8,K.dim,'right')}
    else{win(c,24,34,262,236,fname(e));thumb(c,e,34,50,242,181,2);tag(c,e.cat,276,236,'r');tx(c,'ampliado 2x',34,258,7.5,K.dim);
      win(c,298,34,318,298,'detalhes.txt');let y=62;c.font='bold 12px '+MONO;COL.wrap(c,e.t.toUpperCase(),290).forEach(l=>{tx(c,l,310,y,12,K.hi,null,true);y+=16});
      tx(c,'local: '+A.zname(e.z),310,y+2,9,K.main);y+=24;c.font='11.5px '+MONO;
      for(const ln of (e.lines||[])){for(const l of COL.wrap(c,ln,292)){if(y>272)break;tx(c,l,310,y,11.5,K.txt);y+=15}y+=4}
      const cl=A.CLUE[String(e.id).replace(/^F_|^V_/,'')]||A.CLUE[e.sc];if(cl){let yy=Math.max(y+6,276);c.font='10px '+MONO;COL.wrap(c,'// pista: '+cl,292).slice(0,3).forEach(l=>{tx(c,l,310,yy,10,K.amb);yy+=13})}
      tx(c,'Esc \u2014 voltar ao \u00E1lbum',34,330,8,K.dim)}}
  scan(c,.08)}}
{const oh=G.drawHUD;G.drawHUD=function(){UI++;const tm=!!(this._conn||(this._nar&&this._nar.n&&this._nar.n.mon));if(tm)TM++;try{return oh.apply(this,arguments)}finally{UI--;if(tm)TM--}}}ui('drawDialog');ui('drawMap');ui('drawPause');ui('drawDeath');ui('drawWin');ui('drawToast');ui('drawInteractHints');
window.__UIK={tm:d=>{TM+=d},K,win,tx,scan,vign,seg,btn,cur,rr,mkc,T0,HANDF,TS,reel};
})();
