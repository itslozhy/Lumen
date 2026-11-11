/* ===== ABERTURA v2: cinemática em pixel art (fita → computador → três registros → monitores → porta → quarto) ===== */
(function(){
const G=Game.prototype,COL=window.COL,hs=COL.hs,TAU=Math.PI*2;
const MONO='"Courier New", Courier, monospace',HAND='"Segoe Script","Bradley Hand","Comic Sans MS",cursive';
const ease=x=>{x=Math.min(1,Math.max(0,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},lin=(a,b,x)=>a+(b-a)*Math.min(1,Math.max(0,x));
const BK='#0b0912',D1='#14101c',D2='#1d1822',D3='#2d2535',V1='#4a3a6a',V2='#6a5a8a',M1='#A76E7F',RO='#D27A8A',CR='#e8dfcc',CR2='#c4b8a0',LI='#b8a0d8',TL='#0e2624',TL2='#1c4a44',TX='#d8efe6';
const buf=document.createElement('canvas');buf.width=320;buf.height=180;const b=buf.getContext('2d');
const tmp=document.createElement('canvas');tmp.width=640;tmp.height=360;const tc=tmp.getContext('2d');
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(0,Math.round(w)),Math.max(0,Math.round(h)))};
const ell=(c,cx,cy,rx,ry,col)=>{c.fillStyle=col;for(let y=-ry;y<=ry;y++){const h=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry+.01))));c.fillRect(Math.round(cx-h),Math.round(cy+y),h*2+1,1)}};
const _cc=new Map();function cached(n,fn){let k=_cc.get(n);if(!k){k=document.createElement('canvas');k.width=320;k.height=180;fn(k.getContext('2d'));_cc.set(n,k)}return k}
// texto em pixel (binariza a fonte para ficar pixelado)
const _pt=new Map();
function ptext(c,s,x,y,font,col,al){const key=font+'|'+col+'|'+s;let e=_pt.get(key);if(!e){const m=document.createElement('canvas').getContext('2d');m.font=font;const w=Math.ceil(m.measureText(s).width)+4,h=Math.ceil(parseInt(font.match(/(\d+)px/)[1])*1.5);const cv=document.createElement('canvas');cv.width=w;cv.height=h;const q=cv.getContext('2d');q.font=font;q.fillStyle='#fff';q.textBaseline='alphabetic';q.fillText(s,2,h*.72);const d=q.getImageData(0,0,w,h),dd=d.data;const col4=q.createImageData(1,1);
  const tmpc=document.createElement('canvas');tmpc.width=1;tmpc.height=1;const t2=tmpc.getContext('2d');t2.fillStyle=col;t2.fillRect(0,0,1,1);const rgb=t2.getImageData(0,0,1,1).data;
  for(let i=0;i<dd.length;i+=4){const on=dd[i+3]>70;dd[i]=rgb[0];dd[i+1]=rgb[1];dd[i+2]=rgb[2];dd[i+3]=on?255:0}q.putImageData(d,0,0);e={cv,w,h};_pt.set(key,e);if(_pt.size>700)_pt.clear()}
  c.drawImage(e.cv,Math.round(x-(al==='c'?e.w/2:al==='r'?e.w:0)),Math.round(y-e.h*.72))}
// ---- estética de terminal antigo: barras de seleção roxas, teclas/palavras em amarelo, rodapé de status ----
const TERM={on:false,y:true,nof:false,ft:null},TYL='#ffd870';
function selBar(c,x,y,w,h,a){c.save();c.fillStyle='rgba(106,90,138,'+(a==null?.92:a)+')';c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));c.fillStyle='rgba(176,150,230,.85)';c.fillRect(Math.round(x),Math.round(y),Math.round(w),1);c.fillStyle='rgba(30,20,60,.6)';c.fillRect(Math.round(x),Math.round(y+h-1),Math.round(w),1);c.restore()}
function termFoot(c,x,y,w,items){c.save();c.fillStyle='#3a2a5a';c.fillRect(x,y,w,11);c.fillStyle='#6a5a8a';c.fillRect(x,y,w,1);let cx=x+5;for(const [k,l] of items){ptext(c,k,cx,y+9,'bold 8px '+MONO,TYL);cx+=k.length*5+3;ptext(c,l,cx,y+9,'8px '+MONO,'#d8d0f0');cx+=l.length*5+8}c.restore()}
const TOKRE=/(\[[^\]]{1,24}\]|[\w.\-]+\.(?:exe|sys|dat|log|txt|rem|sav|bak|tmp)\b|\*\*\*[^*]+\*\*\*|[A-ZÀ-Ú][A-ZÀ-Ú_ ]{2,}:)/;
function flower(c,x,y,r,pc,cc){for(let k=0;k<7;k++){const a=k/7*TAU;ell(c,x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,Math.max(1,r*.4),Math.max(1,r*.4),pc)}ell(c,x,y,Math.max(1,r*.34),Math.max(1,r*.34),cc)}
function rose(c,x,y,r,col,col2){ell(c,x,y,r,r,col2);ell(c,x,y,r*.75,r*.75,col);ell(c,x,y,r*.5,r*.5,col2);ell(c,x,y,r*.28,r*.28,col)}
function thr(c,p,col,t,w){const q=(u,a,bb,cc)=>(1-u)*(1-u)*a+2*(1-u)*u*bb+u*u*cc;for(let u=0;u<=1;u+=.004){const x=q(u,p[0][0],p[1][0],p[2][0]),y=q(u,p[0][1],p[1][1],p[2][1])+Math.sin(u*9+t*1.3)*1.2;R(c,x,y,w||1,1,col)}}
function fly(c,x,y,s,t,col,col2){const f=.35+Math.abs(Math.sin(t*6))*.65,w=s*f;ell(c,x-w*.6,y-s*.35,w*.62,s*.5,col);ell(c,x+w*.6,y-s*.35,w*.62,s*.5,col);ell(c,x-w*.45,y+s*.3,w*.4,s*.32,col2||col);ell(c,x+w*.45,y+s*.3,w*.4,s*.32,col2||col);R(c,x,y-s*.6,1,s*1.1,BK)}
function noiseRect(c,x,y,w,h,n,t){for(let i=0;i<n;i++){const v=hs(i,Math.floor(t*30)+x);c.fillStyle=v>.5?'#e8dfcc':'#6a5a8a';c.fillRect(x+Math.floor(hs(i,Math.floor(t*30)+1)*w),y+Math.floor(hs(i,Math.floor(t*30)+2)*h),1+(v>.9?2:0),1)}}
const typed=(lines,n)=>{const o=[];let k=n;for(const l of lines){o.push(l.slice(0,Math.max(0,Math.floor(k))));k-=l.length}return o};
// ---------- retratos (arte real da Mika, tratada por personagem) ----------
const PW=74,PH=86,PC={};
function mkPortrait(k){const src=window.ART&&window.ART.get('portrait');const cv=document.createElement('canvas');cv.width=PW;cv.height=PH;const q=cv.getContext('2d');q.imageSmoothingEnabled=true;
  if(!src){R(q,0,0,PW,PH,D3);return cv}
  q.drawImage(src,8,2,145,168,0,0,PW,PH);
  if(k!=='mika'){const d=q.getImageData(0,0,PW,PH),a=d.data,M=k==='kaim'?[[22,4,14],[170,38,66],[255,196,204]]:[[40,38,70],[184,176,216],[255,255,255]];
    for(let i=0;i<a.length;i+=4){const l=Math.min(1,(a[i]*.3+a[i+1]*.59+a[i+2]*.11)/190),lo=l<.5?M[0]:M[1],hi=l<.5?M[1]:M[2],u=l<.5?l*2:(l-.5)*2;a[i]=lo[0]+(hi[0]-lo[0])*u;a[i+1]=lo[1]+(hi[1]-lo[1])*u;a[i+2]=lo[2]+(hi[2]-lo[2])*u}q.putImageData(d,0,0)}
  if(k==='kaim'){ // fatias e riscos
    const band=(y0,h,dx)=>{const t2=document.createElement('canvas');t2.width=PW;t2.height=h;t2.getContext('2d').drawImage(cv,0,y0,PW,h,0,0,PW,h);R(q,0,y0,PW,h,'#1a0610');q.drawImage(t2,dx,y0)};band(30,7,-5);band(52,5,4);
    for(const [x0,y0,x1,y1] of [[2,14,72,62],[0,52,74,40]]){q.strokeStyle='#14040a';q.lineWidth=2.4;q.beginPath();q.moveTo(x0,y0);for(let u=1;u<=6;u++)q.lineTo(x0+(x1-x0)*u/6+(u%2?3:-3),y0+(y1-y0)*u/6+(u%2?-2:2));q.stroke();q.strokeStyle='#ff4a68';q.lineWidth=1.2;q.stroke()}}
  if(k==='kami'){flower(q,63,9,7,'#f4eef8',RO);flower(q,53,16,4,'#d8d0f0',CR);flower(q,9,76,6,'#f4eef8',LI);flower(q,20,80,4,'#d8d0f0',RO);flower(q,66,72,6,'#f4eef8',RO);R(q,0,0,PW,PH,'rgba(255,255,255,.04)')}
  return cv}
function portrait(c,k,t,seed){const src=PC[k]||(PC[k]=mkPortrait(k));c.save();c.beginPath();c.rect(0,0,PW,PH);c.clip();c.imageSmoothingEnabled=false;c.drawImage(src,0,0);
  const pul=Math.max(0,Math.sin(t*2.6+seed*2.3)*1.6-.7),base=.18,g=Math.min(1,base+pul),fr=Math.floor(t*12)+seed*9;
  const n=1+Math.floor(g*5);for(let i=0;i<n;i++){const y=Math.floor(hs(i,fr)*(PH-6)),h=2+Math.floor(hs(i,fr+4)*(5+g*12)),dx=Math.round((hs(i,fr+8)-.5)*(4+g*16));c.drawImage(src,0,y,PW,h,dx,y,PW,h)}
  if(g>.45){c.globalCompositeOperation='lighter';c.globalAlpha=.25*g;c.drawImage(src,-2-g*3,0);c.globalAlpha=.18*g;c.fillStyle=k==='kaim'?'#ff2a5a':'#7affee';c.fillRect(0,Math.floor(hs(2,fr)*PH),PW,2);c.globalCompositeOperation='source-over'}
  c.globalAlpha=.08;for(let y=0;y<PH;y+=2){c.fillStyle='#000';c.fillRect(0,y,PW,1)}c.globalAlpha=1;c.restore()}
function polaroid(c,x,y,sc,rot,k,t,name,vis,fl){if(vis<=0)return;const pop=vis<1?(.55+.45*ease(vis)):1,w=88*sc*pop,h=110*sc*pop;c.save();c.translate(x,y+Math.sin(t*1.1+x)*1.2);c.rotate(rot);c.globalAlpha=Math.min(1,vis*3);
  R(c,-w/2+3,-h/2+4,w,h,'rgba(0,0,0,.55)');R(c,-w/2,-h/2,w,h,CR);R(c,-w/2,-h/2,w,2,'#f4eddc');
  c.save();c.translate(-w/2+7*sc*pop,-h/2+7*sc*pop);c.scale(sc*pop,sc*pop);portrait(c,k,t,name.length);c.restore();
  ptext(c,name,0,h/2-5*sc,'italic bold '+Math.round(10*sc)+'px Georgia','#3a2a34','c');
  R(c,-9*sc,-h/2-3,18*sc,6,'rgba(222,208,156,.85)');
  if(fl){c.globalAlpha=Math.max(0,fl);R(c,-w/2,-h/2,w,h,'#fff')}c.restore()}
// ---------- Mika sentada (sprite novo, baseado na arte real) ----------
let SIT=null;
function mkSit(){const cv=document.createElement('canvas');cv.width=56;cv.height=80;const c=cv.getContext('2d');
  const HA='#b48cb8',HS='#8a6a98',HL='#dcc0dc',SK='#ecd8d4',SS='#c8a8b0',JK='#1d1822',J2='#3a3048',OL='#2a1c34';
  // cabelo atrás, longo e ondulado
  ell(c,28,25,23,24,HS);for(let i=0;i<2;i++){const x0=i?42:6;for(let y=30;y<64;y+=2){const w=9+Math.round(Math.sin(y*.5+i*2)*2);R(c,i?x0-1:x0,y,w,2,y%6<2?HA:HS)}}
  ell(c,28,22,20,18,HA);
  // torso
  R(c,14,50,28,30,JK);ell(c,28,52,16,7,JK);R(c,23,46,10,5,J2);R(c,28,52,1,28,'#c4b8c8');R(c,16,60,5,8,J2);R(c,35,60,5,8,J2);R(c,19,52,1,26,J2);R(c,37,52,1,26,J2);
  R(c,9,54,7,22,JK);R(c,40,54,7,22,JK);R(c,9,54,2,22,J2);R(c,45,54,2,22,J2);
  R(c,22,73,6,5,SK);R(c,28,73,6,5,SK);R(c,22,77,12,1,SS);
  // mechas sobre o peito
  for(const x0 of [13,38]){for(let y=44;y<68;y+=2){const w=5+Math.round(Math.sin(y*.6+x0)*1.5);R(c,x0,y,w,2,y%4?HA:HL)}}
  R(c,25,41,6,7,SS);
  // rosto
  ell(c,28,31,12,13,SK);R(c,18,40,20,1,SS);R(c,22,43,12,1,SS);
  // franja
  for(let x=16;x<=40;x++){const len=7+Math.floor(hs(x,3)*7)+(x>34?3:0);R(c,x,17,1,len,HA)}
  for(let x=17;x<=39;x+=3)R(c,x,17,1,5+Math.floor(hs(x,9)*5),HL);
  R(c,12,20,5,22,HA);R(c,39,20,5,22,HA);R(c,14,22,2,18,HL);
  R(c,18,25,6,1,'#e8dfcc');R(c,20,26,5,1,'#e8dfcc'); // grampo
  // laço preto
  R(c,36,9,11,8,'#14101c');R(c,34,11,5,5,'#14101c');R(c,40,12,3,3,'#4a3a5a');R(c,37,10,8,1,'#4a3a5a');R(c,35,16,3,5,'#14101c');R(c,44,15,3,5,'#14101c');
  R(c,17,35,4,2,'#e8a0b0');R(c,36,35,4,2,'#e8a0b0');R(c,27,40,3,1,'#9a6070');
  return cv}
function drawSit(c,x,y,bt,open,gb,fz){if(!SIT)SIT=mkSit();const bob=Math.round(Math.sin(bt*1.6)*1),sy=y+bob;c.save();c.imageSmoothingEnabled=false;c.drawImage(SIT,x,sy);
  const ex=[x+19,x+31];for(const e of ex){if(open>0){R(c,e,sy+32,6,4,CR);R(c,e+1,sy+32,4,4,'#9a7ac8');R(c,e+2,sy+33,2,2,BK);R(c,e+1,sy+32,1,1,CR);R(c,e-1,sy+31,8,1,'#2a1c34')}else{R(c,e,sy+34,6,1,'#2a1c34');R(c,e+1,sy+35,4,1,'#6a4a6a')}}
  if(gb>.1){for(let i=0;i<2+Math.floor(gb*7);i++){const y0=Math.floor(hs(i,fz)*72),sh=2+Math.floor(hs(i,fz+3)*10),dx=(hs(i,fz+6)-.5)*(6+gb*26);c.fillStyle='rgba(20,16,28,.9)';c.fillRect(x-6,sy+y0,70,sh);c.drawImage(SIT,0,y0,56,sh,x+dx,sy+y0,56,sh)}
    c.globalCompositeOperation='lighter';c.globalAlpha=.3*Math.min(1,gb);c.drawImage(SIT,x+3,sy);c.globalCompositeOperation='source-over';c.globalAlpha=1}
  c.restore()}
function shadowFig(c,x,y,col,glow,fz,seed){const m=window.SPRS&&window.SPRS.mika_idle;if(!m||!m.i.naturalWidth)return;const t2=document.createElement('canvas');t2.width=m.cw;t2.height=m.ch;const q=t2.getContext('2d');q.imageSmoothingEnabled=false;
  q.drawImage(m.i,0,0,m.cw,m.ch,0,0,m.cw,m.ch);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,m.cw,m.ch);
  const g2=document.createElement('canvas');g2.width=m.cw;g2.height=m.ch;const z=g2.getContext('2d');z.drawImage(m.i,0,0);z.globalCompositeOperation='source-in';z.fillStyle=glow;z.fillRect(0,0,m.cw,m.ch);
  c.save();c.globalAlpha=.92;for(const [dx,im] of [[-2,g2],[2,g2],[0,t2]])c.drawImage(im,x+dx,y);
  for(let i=0;i<5;i++){const y0=Math.floor(hs(i,fz+seed)*(m.ch-8)),sh=2+Math.floor(hs(i,fz+seed+3)*9),dx=(hs(i,fz+seed+6)-.5)*30;c.clearRect(x,y+y0,m.cw,sh);c.drawImage(t2,0,y0,m.cw,sh,x+dx,y+y0,m.cw,sh)}c.restore()}
// ---------- cenas ----------
const SC=[];
// 1 — fita
SC[0]={T:6.6,t0:1.0,pos:'bl',tx:['ARQUIVO: 001','ORIGEM: DESCONHECIDA','ESTADO: RECUPERAÇÃO...'],cam:t=>[160,90,1+.06*t/6.6],draw(c,bt){
  c.drawImage(cached('s1',q=>{R(q,0,0,320,180,D1);for(let y=0;y<180;y+=9){R(q,0,y,320,1,D2);R(q,0,y+4,320,1,'#17121e')}for(let i=0;i<260;i++)R(q,hs(i,1)*320,hs(i,2)*180,1,1,i%3?'#241c2c':'#2d2535');
    flower(q,300,16,10,M1,CR2);flower(q,28,166,9,'#6a4a6a',CR2);flower(q,270,168,7,RO,CR);flower(q,12,24,6,V2,CR2);
    R(q,24,22,272,138,'#0b0912');R(q,26,24,268,134,'#3a3048');R(q,28,26,264,130,'#2d2535');R(q,28,26,264,3,'#6a5a7a');R(q,28,26,3,130,'#4a3a5a');R(q,291,26,3,130,'#1a1522');R(q,28,155,264,3,'#1a1522');R(q,40,36,240,70,'#0f0b14');R(q,40,36,240,2,'#06040a');R(q,40,104,240,2,'#4a3a5a');for(const [sx,sy] of [[36,34],[282,34],[36,148],[282,148]])ell(q,sx,sy,2,2,'#0b0912');
    R(q,52,128,216,22,'#0f0b14');R(q,60,132,200,2,'#2d2535');R(q,100,142,120,6,'#0b0912')}),0,0);
  const a=bt*2.4,rl=lin(27,17,bt/6.6),rr=lin(16,27,bt/6.6);
  for(const [cx,r] of [[92,rl],[228,rr]]){ell(b,cx,72,31,31,'#06040a');ell(b,cx,72,r+3,r+3,'#120d16');ell(b,cx,72,r,r,'#2a1c20');ell(b,cx,72,r-3,r-3,'#241a1e');ell(b,cx,72,10,10,'#c4b8a0');ell(b,cx,72,7,7,BK);for(let k=0;k<6;k++){const an=a+k/6*TAU;R(b,cx+Math.cos(an)*7-1,72+Math.sin(an)*7-1,3,3,CR)}for(let i=0;i<5;i++)R(b,cx-r+3+i*5,72+Math.sin(i+bt*3)*2,1,1,'#3a2a30')}
  R(b,92+rl*.5,98,136-rl*.5,2,'#2a1c20');R(b,100,96,120,1,'#3a2a30');
  b.save();b.translate(160,114);b.rotate(-.02+Math.sin(bt*1.7)*.004);R(b,-56,-10,112,40,'#d8cfbc');R(b,-56,-10,112,2,'#f0e8d6');R(b,-56,28,112,2,'#a89c88');for(let i=0;i<14;i++)R(b,-56+i*8,-10,4,1,'#c4b8a0');
  ptext(b,'LUMEN',-48,11,'italic bold 26px Georgia','#2a1c28');R(b,-44,14,70,1,'#4a3a4a');fly(b,36,4,7,bt,'#7a5a8a','#4a3a6a');ptext(b,'REC. 01. // MIKA',-48,26,'bold 9px '+MONO,'#4a3a4a');b.restore();
  thr(b,[[0,160],[130,120],[320,176]],RO,bt);thr(b,[[200,0],[240,50],[320,30]],M1,bt+1)}};
const BG2=q=>{R(q,0,0,320,180,D1);for(let x=0;x<320;x+=14)R(q,x,0,1,150,'#17121e');for(let i=0;i<200;i++)R(q,hs(i,5)*320,hs(i,6)*150,1,1,'#241c2c');R(q,0,150,320,30,'#241a1e');R(q,0,150,320,2,'#3a2a30');
    R(q,50,6,220,140,'#6a5a7a');R(q,50,6,220,3,'#b8aac4');R(q,50,6,3,140,'#9a8eaa');R(q,267,6,3,140,'#4a3a5a');R(q,50,143,220,3,'#3a2c48');R(q,SX-4,SY-4,SW+8,SH+8,'#2a2236');R(q,SX-2,SY-2,SW+4,SH+4,'#0b0912');
    R(q,112,146,96,8,'#6a5a7a');R(q,100,152,120,4,'#4a3a5a');
    R(q,70,156,180,20,'#b8aab8');R(q,70,156,180,2,'#e0d4e0');for(let r=0;r<3;r++)for(let k=0;k<22;k++)R(q,74+k*8,159+r*5,6,3,'#4a3e52');
    R(q,14,64,24,66,'rgba(120,140,170,.25)');R(q,15,66,22,2,'rgba(200,220,255,.3)');for(const [dx,dy,col] of [[20,-8,'#c8a860'],[28,-14,'#a88858'],[24,-20,'#d8b878'],[16,-2,'#8a7048']]){R(q,24,64,1,-dy+6,'#5a4a30');ell(q,24+dx-24,60+dy,3,3,col);R(q,24+dx-24,60+dy,1,1,BK)}R(q,14,130,24,3,'#3a3a4a');
    R(q,277,36,26,26,'#D8A0B0');R(q,277,36,26,3,'#e8b8c8');for(let i=0;i<4;i++)R(q,281,44+i*4,16-(i%2)*4,1,'#7a4a5a');R(q,288,30,4,4,'rgba(222,208,156,.8)')};
// 2 — computador
const SX=64,SY=20,SW=192,SH=100;
SC[1]={T:9.2,te:6.2,cam:bt=>{if(bt<6.2)return[160,88,1+.04*bt/6.2];const e=ease((bt-6.2)/2.6);return[lin(160,160,e),lin(88,70,e),lin(1.04,3.5,e)]},draw(c,bt){
  b.drawImage(cached('s2',BG2),0,0);
  b.drawImage(buf,0,0);
  R(b,SX,SY,SW,SH,TL);const fl=.5+.5*Math.sin(bt*40)*.04;b.fillStyle='rgba(60,140,130,'+(.08+fl)+')';b.fillRect(SX,SY,SW,SH);
  const F='bold 10px '+MONO;let n=Math.max(0,(bt-.5)*14);
  const h='C:/MEMORIA/MIKA/',hh=h.slice(0,Math.min(h.length,Math.floor(n)));ptext(b,hh,SX+10,SY+14,F,TX);if(n<h.length+3&&Math.floor(bt*4)%2)R(b,SX+10+hh.length*6+1,SY+6,5,9,TX);
  const fn=['MIKA_01','MIKA_02','MIKA_03'],ft=[2.0,2.6,3.2];let hov=-1;const cur=ease((bt-3.6)/1.1);
  fn.forEach((s,i)=>{if(bt<ft[i])return;const y=SY+26+i*16,sel=(i===1&&bt>4.7);if(sel)R(b,SX+8,y-3,92,13,V2);R(b,SX+12,y,5,2,sel?CR:LI);R(b,SX+12,y+2,12,7,sel?CR:LI);R(b,SX+12,y+3,12,1,'#6a5a8a');ptext(b,s,SX+30,y+9,F,sel?BK:TX)});
  if(bt>3.4){const tx=lin(SX+170,SX+54,cur),ty=lin(SY+88,SY+52,cur)+(bt>4.7&&bt<4.85?1:0);const ar=[[0,0,1,1],[0,1,2,1],[0,2,3,1],[0,3,4,1],[0,4,5,1],[0,5,6,1],[0,6,4,1],[0,7,3,1],[3,6,2,3],[3,7,2,4]];for(const [ax,ay,w,hh2] of ar){R(b,tx+ax-1,ty+ay-1,w+2,2,BK)}for(const [ax,ay,w] of ar)R(b,tx+ax,ty+ay,w,1,CR)}
  if(bt>5.0){const s='> Abrindo arquivo'+'.'.repeat(Math.floor((bt-5)*3)%4),k=Math.min(s.length,Math.floor((bt-5.0)*14));ptext(b,s.slice(0,Math.max(0,k)),SX+10,SY+SH-8,F,TX)}
  for(let y=SY;y<SY+SH;y+=2)R(b,SX,y,SW,1,'rgba(0,0,0,.18)');
  b.fillStyle='rgba(216,239,230,.06)';b.fillRect(SX,SY+((bt*22)%SH),SW,6);
  fly(b,262,12,6,bt,'#8a7aa8','#4a3a6a');thr(b,[[0,170],[100,150],[56,176]],RO,bt)}};
// 3 — três registros
SC[2]={T:9.6,t0:3.6,pos:'bl',tx:['Três registros foram encontrados.','Todos têm o mesmo nome.','Nenhum guarda a mesma memória.'],cam:t=>[160,84,1+.06*t/9.6],draw(c,bt){
  b.drawImage(cached('s3',q=>{R(q,0,0,320,180,'#120e18');for(let i=0;i<340;i++)R(q,hs(i,3)*320,hs(i,4)*180,1,1,i%2?'#1d1822':'#2d2535');
    for(const [x,y,w,h,k,r] of [[10,20,90,70,'#241c2c',.05],[220,10,100,80,'#2a2236',-.04],[120,110,110,70,'#1d1822',.03]]){R(q,x,y,w,h,k)}
    flower(q,300,150,12,M1,CR2);flower(q,14,160,10,'#6a4a6a',CR2);flower(q,20,24,7,'#6a4a6a',CR);flower(q,300,24,7,V2,CR2);rose(q,160,170,9,'#8a4a60','#a64c68')}),0,0);
  const vis=[ease((bt-.4)/.4),ease((bt-1.5)/.4),ease((bt-2.6)/.4)],flash=i=>{const d=bt-[.4,1.5,2.6][i];return d>0&&d<.35?1-d/.35:0};
  thr(b,[[0,40],[160,10],[320,60]],RO,bt);thr(b,[[0,150],[160,176],[320,140]],M1,bt+2);
  polaroid(b,72,78,.98,-.12,'kaim',bt,'KAIM',vis[0],flash(0));polaroid(b,250,80,.98,.12,'kami',bt,'KAMI',vis[2],flash(2));polaroid(b,161,68,1.12,.01,'mika',bt,'MIKA',vis[1],flash(1));
  fly(b,284,28,8,bt,CR,'#c4b8a0');fly(b,36,40,6,bt+1,RO,M1)}};
// 4 — memórias: riscada / reescrita / não encontrada
function mroom(c,x,y,w,h,tint,t){const T=tint;R(c,x,y,w,h,T[0]);R(c,x,y+h*.76,w,h*.24,'#1a1422');R(c,x+w*.62,y+h*.12,w*.28,h*.42,T[1]);R(c,x+w*.76,y+h*.12,1,h*.42,T[0]);R(c,x+w*.62,y+h*.32,w*.28,1,T[0]);
  R(c,x+w*.08,y+h*.56,w*.5,h*.2,'#5a4a7a');R(c,x+w*.08,y+h*.5,w*.15,h*.1,CR2);R(c,x+w*.08,y+h*.76,w*.04,h*.1,'#2a1c3a');R(c,x+w*.52,y+h*.76,w*.04,h*.1,'#2a1c3a');R(c,x+w*.28,y+h*.16,w*.18,h*.22,'#2a1c3a');R(c,x+w*.3,y+h*.19,w*.14,h*.16,CR2)}
function tvx(c,x,y,w,h,age,fn){R(c,x-3,y+h+3,w+6,3,'rgba(0,0,0,.4)');R(c,x-5,y-5,w+10,h+10,'#8a7e98');R(c,x-5,y-5,w+10,2,'#bfb4cc');R(c,x-5,y+h+3,w+10,2,'#4a3e58');R(c,x-2,y-2,w+4,h+4,'#1a1422');
  if(age<0){R(c,x,y,w,h,BK);return}
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();if(age<.4){R(c,x,y,w,h,BK);noiseRect(c,x,y,w,h,w*h/4,age*10)}else fn(c,x,y,w,h,age-.4);
  for(let yy=0;yy<h;yy+=2)R(c,x,y+yy,w,1,'rgba(0,0,0,.2)');if(age<.15){c.fillStyle='rgba(255,255,255,'+(.6-age*4)+')';c.fillRect(x,y,w,h)}c.restore();ell(c,x+w+1,y+h+1,1,1,age>.2?RO:'#3a2a30')}
function tag(c,x,y,s,col,rot){c.save();c.translate(x,y);c.rotate(rot);R(c,-40,-7,80,13,'#d8cfbc');R(c,-40,-7,80,1,'#f0e8d6');R(c,-6,-10,12,4,'rgba(222,208,156,.85)');ptext(c,s,0,3,'bold 8px '+MONO,col,'c');c.restore()}
SC[3]={T:8.4,t0:1.0,pos:'bl',tx:['Uma memória foi riscada.','Outra foi reescrita.','A última ainda não foi encontrada.'],cam:t=>[160,lin(86,80,t/8.4),lin(1,1.16,t/8.4)],draw(c,bt){
  b.drawImage(cached('s4b',q=>{R(q,0,0,320,180,'#120e18');for(let x=0;x<320;x+=18)R(q,x,0,1,180,'#17121e');for(let i=0;i<220;i++)R(q,hs(i,7)*320,hs(i,8)*180,1,1,'#241c2c');R(q,0,138,320,42,'#1a1422');R(q,0,138,320,1,'#2d2535');flower(q,18,166,10,'#8a4a60',CR2);flower(q,304,22,7,V2,CR2);flower(q,302,160,9,M1,CR2);rose(q,160,170,8,'#8a4a60','#a64c68')}),0,0);
  thr(b,[[0,26],[160,6],[320,34]],RO,bt);thr(b,[[0,150],[160,176],[320,148]],M1,bt+1);
  const W=82,H=60,Y=44;
  // 1 — riscada
  tvx(b,22,Y,W,H,bt-1.0,(q,x,y,w,h,a)=>{mroom(q,x,y,w,h,['#2a1420','#9a4a60'],a);const pts=[[.06,.1],[.94,.3],[.06,.5],[.94,.7],[.06,.9],[.94,.98]],pr=Math.min(1,a/1.1)*(pts.length-1);q.lineCap='round';q.lineJoin='round';for(const [col,wd] of [['#0b0409',5],['#ff3a5a',2.4]]){q.strokeStyle=col;q.lineWidth=wd;q.beginPath();q.moveTo(x+pts[0][0]*w,y+pts[0][1]*h);for(let i=1;i<pts.length;i++){const f=Math.min(1,Math.max(0,pr-(i-1)));if(f<=0)break;q.lineTo(x+(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f)*w,y+(pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f)*h)}q.stroke()}
    if(a>1.2){q.fillStyle='rgba(255,58,90,.12)';q.fillRect(x,y,w,h)}});
  // 2 — reescrita
  tvx(b,119,Y,W,H,bt-1.8,(q,x,y,w,h,a)=>{mroom(q,x,y,w,h,['#2a2040','#9a7ac8'],a);const fr=Math.floor(a*10),k=Math.min(1,a/.9);
    q.save();q.beginPath();q.rect(x+w*.1,y+h*.2,w*.5,h*.45);q.clip();mroom(q,x-8,y-4,w+10,h+6,['#17261f','#5ae0b0'],a);q.restore();
    for(let i=0;i<4+Math.floor(k*5);i++){const yy=y+hs(i,fr)*h,hh=2+hs(i,fr+3)*8,dx=(hs(i,fr+5)-.5)*22*k;q.drawImage(q.canvas,x,yy,w,hh,x+dx,yy,w,hh)}
    for(let i=0;i<7;i++)R(q,x+hs(i,fr+9)*w,y+hs(i,fr+10)*h,3+hs(i,fr+11)*9,2+hs(i,fr+12)*3,i%2?'#ff6aa0':'#5affd8');
    q.fillStyle='rgba(255,106,160,.16)';q.fillRect(x,y+((a*60)%h),w,3)});
  // 3 — não encontrada
  tvx(b,216,Y,W,H,bt-2.7,(q,x,y,w,h,a)=>{R(q,x,y,w,h,'#07050b');noiseRect(q,x,y,w,h,w*h/9,a);R(q,x+w*.3,y+h*.2,w*.4,h*.62,'rgba(11,9,18,.78)');ptext(q,'?',x+w/2,y+h*.72,'bold 34px '+MONO,'#e8dfcc','c');if(Math.floor(a*2)%2)ptext(q,'SEM SINAL',x+w/2,y+h-6,'bold 9px '+MONO,'#D27A8A','c')});
  if(bt>1.3)tag(b,63,Y+H+17,'RISCADA','#a02840',-.03);if(bt>2.1)tag(b,160,Y+H+17,'REESCRITA','#3a5a80',.02);if(bt>3.0)tag(b,257,Y+H+17,'NÃO ENCONTRADA','#4a3a5a',-.02);
  fly(b,160,26,6,bt,LI,V2);fly(b,48,30,5,bt+2,RO,M1)}};
// 5 — porta do jardim
SC[4]={T:7.6,t0:1.6,pos:'bl',tx:['Se todas as memórias são suas...','por que nenhuma delas lembra de você?'],cam:t=>[160,lin(92,80,t/7.6),lin(1,1.6,ease(t/7.6))],draw(c,bt){
  b.drawImage(cached('s5',q=>{R(q,0,0,320,180,'#0e0b14');for(let y=0;y<180;y+=6)R(q,0,y,320,1,'#120e18');for(let i=0;i<300;i++)R(q,hs(i,8)*320,hs(i,9)*180,1,1,i%2?'#1d1822':'#17121e');
    R(q,0,142,320,38,'#0f0b14');for(let i=0;i<120;i++){const x=hs(i,2)*320;R(q,x,142+hs(i,3)*30,1,2+hs(i,4)*4,i%3?'#1d2a22':'#2a3a30')}
    for(let y=36;y<142;y++){const half=Math.round(38*Math.sqrt(Math.max(0,1-Math.pow((y<76?(76-y)/40:0),2))));R(q,160-half-6,y,half*2+12,1,'#3a3048')}
    for(let y=36;y<142;y++){const half=Math.round(32*Math.sqrt(Math.max(0,1-Math.pow((y<76?(76-y)/40:0),2))));R(q,160-half,y,half*2,1,'#1a1214')}
    for(let k=0;k<7;k++){const x=134+k*8;R(q,x,60+Math.abs(k-3)*0,1,82,'#0e0a0c');R(q,x+4,50,1,92,'#241a1c')}R(q,152,70,16,20,'#120c0e');ell(q,160,96,4,4,'#a8946a');ell(q,160,96,2,2,'#241a1c');
    for(let y=28;y<76;y+=6){R(q,120-Math.round(40*Math.sqrt(Math.max(0,1-Math.pow((76-Math.min(y,76))/40,2)))),y,1,1,'#4a3a58')}
    for(const [x,y,r,c1,c2] of [[40,120,13,'#8a4a60','#a64c68'],[70,134,10,'#6a3a50','#8a4a60'],[26,100,9,'#a86a7a','#c88a98'],[282,118,14,'#8a4a60','#a64c68'],[250,134,11,'#6a3a50','#a64c68'],[296,96,9,'#a86a7a','#c88a98'],[100,146,8,'#8a4a60','#a64c68'],[226,148,8,'#6a3a50','#8a4a60']])rose(q,x,y,r,c1,c2);
    for(let i=0;i<70;i++){const x=hs(i,12)*320,y=hs(i,13)*100+30;if(x>96&&x<224)continue;R(q,x,y,2,2,i%2?'#2a4a38':'#1d3a2c')}
    for(const x of [92,228])for(let y=40;y<140;y+=3)R(q,x+Math.sin(y*.3)*3,y,1,2,'#2a4a38')}),0,0);
  const pl=.5+.5*Math.sin(bt*3.1);R(b,141,138,38,3,'rgba(255,170,200,'+(.35+pl*.3)+')');const g=b.createRadialGradient(160,140,2,160,140,60);g.addColorStop(0,'rgba(255,150,190,'+(.18+pl*.12)+')');g.addColorStop(1,'rgba(255,150,190,0)');b.fillStyle=g;b.fillRect(80,80,160,70);
  thr(b,[[0,30],[140,60],[160,92]],RO,bt);thr(b,[[160,92],[200,140],[320,150]],RO,bt+1);fly(b,200+Math.sin(bt)*30,60+Math.cos(bt*1.3)*10,8,bt,'#d8d0e0',CR2);fly(b,110+Math.cos(bt*.8)*20,90,5,bt+2,RO,M1);
  const gl=Math.sin(bt*2.7)>.82;if(gl)for(let k=0;k<4;k++){const y=Math.floor(hs(k,Math.floor(bt*9))*170);b.drawImage(buf,0,y,320,5,Math.round((hs(k,3)-.5)*30),y,320,5)}}};
// 6 — quarto
SC[5]={T:11,pos:'tl',t0:2.4,tx:['> REGISTRO INTERROMPIDO','> IDENTIDADE: MIKA','> BEM-VINDA DE VOLTA.'],cam:t=>{const e=ease(t/10.2),e2=ease((t-1)/9.2);return[lin(140,100,e),lin(88,86,e2),lin(1.12,2.05,e2)]},draw(c,bt){
  b.drawImage(cached('s6',q=>{R(q,0,0,320,180,'#1c1630');for(let x=0;x<320;x+=10)R(q,x,0,1,130,'#241c3c');for(let i=0;i<260;i++)R(q,hs(i,1)*320,hs(i,2)*130,1,1,'#2a2244');
    R(q,0,130,320,50,'#1a1224');R(q,0,128,320,3,'#3a2a50');
    R(q,236,14,64,72,'#0b0a24');R(q,234,12,68,2,'#3a2a50');R(q,234,86,68,3,'#3a2a50');R(q,234,12,2,76,'#3a2a50');R(q,300,12,2,76,'#3a2a50');R(q,267,14,2,72,'#3a2a50');for(let i=0;i<24;i++)R(q,238+hs(i,3)*60,16+hs(i,4)*68,1,1,i%3?'#d8d0e0':'#8a7aa8');ell(q,282,30,6,6,'#e8dfcc');ell(q,284,29,5,5,'#0b0a24');R(q,276,30,6,1,'#e8dfcc');
    R(q,228,8,10,86,'#5a3a78');R(q,228,8,3,86,'#7a5a98');for(let y=10;y<92;y+=8)R(q,231+(y%16?1:0),y,2,4,'#4a2a68');R(q,300,8,12,86,'#5a3a78');for(let y=10;y<92;y+=8)R(q,303,y,2,4,'#4a2a68');
    R(q,22,24,20,26,'#2d2535');R(q,24,26,16,22,'#4a3a6a');R(q,26,30,12,2,'#a64c68');R(q,52,18,16,22,'#2d2535');R(q,54,20,12,18,'#6a5a8a');R(q,84,30,18,24,'#2d2535');R(q,86,32,14,20,'#3a2a50');ell(q,93,42,3,3,'#a64c68');
    R(q,232,112,56,5,'#3a2a30');R(q,236,117,4,30,'#2a1c20');R(q,280,117,4,30,'#2a1c20');
    R(q,6,118,214,16,'#3a2a50');R(q,6,134,214,34,'#241c3c');R(q,2,104,8,64,'#2a1c20');R(q,214,118,8,50,'#2a1c20');
    R(q,10,112,40,14,'#e0d4e0');R(q,10,112,40,2,'#fff4ff');R(q,10,124,40,2,'#a898b8')}),0,0);
  const sw=Math.sin(bt*1.2)*2;R(b,150,0,1,26,'#4a3a58');for(let i=0;i<4;i++){const x=140+i*10+sw*(i%2?-1:1),y=30+i*4;R(b,x,y-4,1,6,'#4a3a58');ell(b,x,y+4,3,3,i%2?RO:'#e8a0b0');R(b,x-1,y+3,3,2,'#fff')}R(b,134,26,34,1,'#4a3a58');
  // TV com estática
  R(b,238,84,44,32,'#8a7e98');R(b,238,84,44,2,'#bfb4cc');R(b,241,87,32,26,'#0b0912');noiseRect(b,241,87,32,26,160,bt);R(b,276,90,3,3,RO);R(b,276,97,3,3,'#3a2a30');R(b,246,116,28,3,'#4a3e58');
  const tg=b.createRadialGradient(256,100,4,256,100,90);tg.addColorStop(0,'rgba(220,210,240,.22)');tg.addColorStop(1,'rgba(220,210,240,0)');b.fillStyle=tg;b.fillRect(120,40,200,130);
  // cama + Mika
  R(b,6,128,214,40,'#6a5a8a');R(b,6,128,214,3,'#8a7aaa');for(let i=0;i<8;i++){R(b,60+i*20,134+(i%2)*3,12,1,'#4a3a6a');R(b,64+i*20,146,1,18,'#4a3a6a')}R(b,6,160,214,8,'#3a2a50');
  R(b,14,116,52,16,CR);R(b,14,116,52,3,'#fff4ff');R(b,14,128,52,4,'#c4b8a0');
  R(b,76,90,46,44,CR);R(b,76,90,46,3,'#fff4ff');R(b,76,90,3,44,'#c4b8a0');R(b,119,90,3,44,'#a898b8');
  const ramp=Math.max(0,Math.min(1,(bt-2)/8.4)),fz=Math.floor(bt*14),gb=Math.min(1,ramp*.9+(Math.sin(bt*3.3)>.8?.25:0));
  drawSit(b,72,52,bt,ease((bt-5.4)/1.2),gb,fz);
  R(b,2,132,214,38,'#5a3a78');R(b,2,132,214,3,'#7a5a98');for(let i=0;i<6;i++)R(b,12+i*34,140+(i%2)*4,22,1,'#4a2a68');
  R(b,2,132,214,6,'#5a3a78');R(b,2,132,214,2,'#7a5a98');R(b,60,138,150,26,'#5a3a78');ell(b,100,140,30,5,'#7a5a98');for(let i=0;i<5;i++)R(b,66+i*28,142,18,1,'#4a2a68');ell(b,52,140,12,3,'#6a4a88');
  fly(b,196,58,5,bt,RO,M1);
  R(b,0,0,15,160,'#07050b');R(b,15,0,2,160,'#2a2040');R(b,0,0,4,160,'#120e18');R(b,17,0,1,160,'#4a3a6a');R(b,2,76,2,5,'#a8946a');
  { const ramp2=Math.max(0,Math.min(1,(bt-2)/8.4));
    for(let k=0;k<Math.floor(ramp2*7);k++){const y=Math.floor(hs(k,fz)*172);b.drawImage(buf,0,y,320,2+Math.floor(hs(k,fz+2)*7),Math.round((hs(k,fz+4)-.5)*(8+ramp2*50)),y,320,2+Math.floor(hs(k,fz+2)*7))}
    if(Math.sin(bt*5)>.92-ramp2*.1){b.fillStyle='rgba(216,210,240,'+(.04+ramp2*.06)+')';b.fillRect(0,0,320,180)}
    const sh=bt>S6.T-.6&&bt<S6.T-.22&&((Math.floor(bt*34)%5)!==0);
    if(sh){shadowFig(b,6,40,'#14040a','#ff3a5a',fz,1);shadowFig(b,118,40,'#1c1a34','#e8e0ff',fz,5)}}
}};
const S6=SC[5];
// ---------- pós-processamento ----------
const scan=document.createElement('canvas');scan.width=640;scan.height=360;{const q=scan.getContext('2d');for(let y=0;y<360;y+=2){q.fillStyle='rgba(0,0,0,.2)';q.fillRect(0,y,640,1)}const g=q.createRadialGradient(320,180,150,320,180,420);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(4,2,10,.7)');q.fillStyle=g;q.fillRect(0,0,640,360)}
function glitch(c,amt,t){if(amt<=.02)return;tc.drawImage(c.canvas,0,0);const n=2+Math.floor(amt*12),seed=Math.floor(t*14);
  for(let i=0;i<n;i++){const y=Math.floor(hs(i,seed)*340),h=3+Math.floor(hs(i,seed+7)*26*amt),dx=Math.round((hs(i,seed+3)-.5)*90*amt);c.drawImage(tmp,0,y,640,h,dx,y,640,h)}
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(.5,amt*.45);c.drawImage(tmp,-8*amt,0);c.globalAlpha=Math.min(.4,amt*.35);c.fillStyle='#ff3a7a';c.globalCompositeOperation='screen';c.drawImage(tmp,7*amt,2);c.restore();
  if(amt>.55){c.save();c.globalAlpha=(amt-.55)*.8;for(let i=0;i<30;i++){c.fillStyle=hs(i,seed)>.5?'#e8dfcc':'#D27A8A';c.fillRect(hs(i,seed+1)*640,hs(i,seed+2)*360,20+hs(i,seed+3)*90,2)}c.restore()}}
function blit(c,S,bt,t){const [cx,cy,z]=S.cam(bt),sw=320/z,sh=180/z,hx=Math.sin(t*1.7)*.6,hy=Math.cos(t*1.3)*.5;let sx=Math.min(320-sw,Math.max(0,cx-sw/2+hx)),sy=Math.min(180-sh,Math.max(0,cy-sh/2+hy));c.imageSmoothingEnabled=false;c.drawImage(buf,sx,sy,sw,sh,0,0,640,360)}
function overlay(c,S,bt,t){
  if(S.tx){const n=Math.max(0,(bt-S.t0)*30),L=typed(S.tx,n),tl=S.pos==='tl';
    if(!tl){const g=c.createLinearGradient(0,240,0,360);g.addColorStop(0,'rgba(5,3,10,0)');g.addColorStop(1,'rgba(5,3,10,.78)');c.fillStyle=g;c.fillRect(0,240,640,120)}
    c.font='bold 14px '+MONO;c.textBaseline='alphabetic';let y=tl?36:(360-22-(L.length-1)*22);L.forEach((s,i)=>{if(!s&&i>0&&!L[i-1])return;c.fillStyle='rgba(0,0,0,.8)';c.fillText(s,31,y+1);c.fillStyle='#ece2f0';c.fillText(s,30,y);
      if(i===L.findIndex((q,j)=>q.length<S.tx[j].length||j===L.length-1)&&Math.floor(t*3)%2&&n<S.tx.join('').length+40){const w=c.measureText(s).width;c.fillStyle='#ece2f0';c.fillRect(32+w,y-11,8,13)}y+=22})}
  if(S===SC[0]){c.font='bold 15px '+MONO;if(Math.floor(t*2)%2){c.fillStyle='#ece2f0';c.fillText('> PLAY ▶',30,38)}c.fillStyle='#D27A8A';if(Math.floor(t*1.5)%2)c.fillText('● REC',560,38)}}
function drawIntro(g,c){const I=g._in,t=performance.now()/1000;
  if(I.ph==='out'){if(!g._rm)prepRoom(g);drawRoom(g,c,t,true);
    const S=SC[5];S.draw(c,S.T);tc.clearRect(0,0,640,360);tc.imageSmoothingEnabled=false;blit(tc,S,S.T,t);overlay(tc,S,S.T,t);tc.drawImage(scan,0,0);
    const o=ease(I.o);for(let y=0;y<360;y+=6){const k=hs(y,Math.floor(t*14));if(k<o*1.25)continue;const dx=Math.round((hs(y,3)-.5)*60*(.3+o));c.drawImage(tmp,0,y,640,6,dx,y,640,6)}
    c.fillStyle='rgba(216,239,230,'+Math.max(0,.2-o*.4)+')';c.fillRect(0,0,640,360);return}
  const S=SC[Math.min(I.i,SC.length-1)],bt=I.bt;b.imageSmoothingEnabled=false;S.draw(c,bt);c.imageSmoothingEnabled=false;blit(c,S,bt,t);overlay(c,S,bt,t);
  const pre=SC[I.i]===SC[1]&&bt>7.4?Math.min(1,(bt-7.4)/1.5):0;
  c.drawImage(scan,0,0);for(let i=0;i<40;i++){c.fillStyle='rgba(232,223,204,'+(.05+hs(i,Math.floor(t*24))*.1)+')';c.fillRect(hs(i,Math.floor(t*24))*640,hs(i,Math.floor(t*24)+9)*360,1+hs(i,7)*2,1)}
  const a1=I.i>0||I.fromOut?Math.max(0,1-bt/.4):(I.i===0?Math.max(0,1-bt/.9):0),a2=Math.max(0,(bt-(S.T-.5))/.5);
  glitch(c,Math.max(a1,a2,pre*.85,(S===SC[5]?Math.max(0,Math.min(1,(bt-2)/8.4))*.42:0),(Math.sin(t*2.1+I.i)>.93?.35:0)),t);
  if(I.i===0&&bt<.7){c.fillStyle='rgba(11,9,18,'+(1-bt/.7)+')';c.fillRect(0,0,640,360)}
  if(bt>S.T-.2&&I.i<SC.length-1){c.fillStyle='rgba(11,9,18,'+((bt-(S.T-.2))/.2*.8)+')';c.fillRect(0,0,640,360)}}
// =====================================================================
// QUARTO DA MIKA → COMPUTADOR → CASA DESFEITA (sentada no banco) → jogo
// =====================================================================
const FL=144,NOIN=g=>new Proxy(g.input,{get(t,k){if(k==='left'||k==='right')return()=>t[k]();const v=t[k];return typeof v==='function'?()=>false:v}});
let RG=null;function roomGrid(){if(RG)return RG;RG=[];for(let y=0;y<WORLD_H;y++)RG.push(new Array(WORLD_W).fill(0));
  for(let x=0;x<WORLD_W;x++){RG[9][x]=1;RG[10][x]=1;RG[0][x]=1;RG[1][x]=1}for(let y=0;y<WORLD_H;y++){RG[y][0]=1;RG[y][19]=1}return RG}
const artp=(c,k,x,by,h,flip)=>{const im=window.ART&&window.ART.get(k);if(!im)return 0;const w=im.naturalWidth*h/im.naturalHeight;if(flip){c.save();c.translate(x+w,by-h);c.scale(-1,1);c.drawImage(im,0,0,w,h);c.restore()}else c.drawImage(im,x,by-h,w,h);return w};
// ---- banco preto antigo (sprite novo) ----
let STM=null;
function mkStool(){const cv=document.createElement('canvas');cv.width=64;cv.height=56;const c=cv.getContext('2d');const K='#17111f',K2='#2d2438',K3='#6a5a82',K4='#9a88b8',GD='#d8b878';
  for(const x0 of [20,38]){R(c,x0,22,4,28,K2);R(c,x0+1,22,1,28,K3)}
  for(const x0 of [8,52]){R(c,x0,20,5,32,K);R(c,x0+1,20,1,32,K3);ell(c,x0+2,30,4,3,K2);R(c,x0,28,5,1,K4);ell(c,x0+2,40,3,3,K2);R(c,x0,39,5,1,K4);R(c,x0-2,50,9,3,K);R(c,x0-2,50,9,1,K3)}
  R(c,10,38,44,3,K);R(c,10,38,44,1,K3);
  ell(c,32,14,30,8,K);ell(c,32,12,30,6,K2);ell(c,32,11,26,4,K3);ell(c,32,10,20,2,K4);R(c,2,14,60,7,K);R(c,3,14,58,1,K4);
  for(let i=0;i<9;i++)R(c,6+i*6,17,2,2,GD);R(c,4,21,56,3,K2);R(c,5,23,54,1,K);
  return cv}
// ---- Mika sentada no banco (sprite novo, a partir da arte real) ----
let SEAT=null;
function mkSeat(){if(!SIT)SIT=mkSit();if(!STM)STM=mkStool();const cv=document.createElement('canvas');cv.width=80;cv.height=130;const c=cv.getContext('2d');
  c.drawImage(STM,8,74);                       // banco
  c.drawImage(SIT,12,8);                       // tronco, cabeça, cabelo
  // saia e pernas listradas
  ell(c,40,88,29,7,'#1d1822');R(c,12,88,56,8,'#1d1822');R(c,12,95,56,1,'#4a3a5a');for(let x=14;x<66;x+=6)R(c,x,96,3,2,'#1d1822');
  for(const x0 of [26,42]){for(let y=98;y<122;y++)R(c,x0,y,12,1,((y>>1)%2)?'#d8c8d8':'#4a3a5a');R(c,x0,98,12,1,'#e8d4d0');R(c,x0,98,1,24,'#2a1c34');R(c,x0+11,98,1,24,'#2a1c34')}
  for(const x0 of [23,43]){R(c,x0,120,16,8,'#0f0b14');R(c,x0,120,16,1,'#3a3048');R(c,x0-2,126,8,2,'#0f0b14')}
  return cv}
function drawSeated(c,px,fy,t,gl){if(!SEAT)SEAT=mkSeat();const s=.42,w=80*s,h=130*s,br=Math.sin(t*1.6)*.35,eo=((t%5)>4.78)?0:1;c.save();c.imageSmoothingEnabled=true;c.globalAlpha=.22;c.globalCompositeOperation='lighter';for(const [dx,dy] of [[-1,0],[1,0],[0,-1]])c.drawImage(SEAT,px-w/2+dx,fy-h+2+br+dy,w,h);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(SEAT,px-w/2,fy-h+2+br,w,h);
  if(gl>0.1){c.globalCompositeOperation='lighter';c.globalAlpha=.3*gl;c.drawImage(SEAT,px-w/2+1.5,fy-h+2+br,w,h)}c.restore()}
// ---- computador do quarto (sprite novo, mesma identidade do close-up) ----
function drawCRT(c,x,yb,t,near){c.save();c.translate(x,yb-34);c.scale(.5,.5);
  R(c,6,58,50,8,'#b8aab8');R(c,6,58,50,2,'#e0d4e0');for(let r=0;r<2;r++)for(let k=0;k<8;k++)R(c,9+k*6,61+r*3,5,2,'#4a3e52');
  R(c,0,0,60,50,'#6a5a7a');R(c,0,0,60,3,'#b8aac4');R(c,0,0,3,50,'#9a8eaa');R(c,57,0,3,50,'#4a3a5a');R(c,0,47,60,3,'#3a2c48');
  R(c,5,5,50,38,'#2a2236');R(c,7,7,46,34,'#0b0912');R(c,8,8,44,32,TL);
  const fl=.5+.5*Math.sin(t*37)*.05;c.fillStyle='rgba(60,150,135,'+(.18+fl*.2+(near?.12:0))+')';c.fillRect(8,8,44,32);
  for(let i=0;i<5;i++)R(c,11,12+i*6,14+((i*7)%18),1,i===2?'#d8efe6':'#7fb8a8');if(Math.floor(t*2)%2)R(c,11,42-6,4,2,'#d8efe6');
  for(let y=8;y<40;y+=2)R(c,8,y,44,1,'rgba(0,0,0,.2)');
  R(c,22,50,16,6,'#5a4a6a');R(c,50,44,3,2,RO);R(c,44,44,3,2,'#3a2a30');
  c.restore()}
// ---- quarto ----
function prepRoom(g){const p=g.player;g._wp={x:p.x,y:p.y};p.x=118;p.y=FL-34-1;p.vx=0;p.vy=0;p.facing=1;p.anim='idle';p.onGround=false;p.dashTimer=0;p.attacking=false;p.onWall=0;
  g._rm={t:0,near:false};for(let k=0;k<40;k++){try{p.update(.016,NOIN(g),roomGrid())}catch(e){}}}
const roomGl=t=>{const k=Math.floor(t*4),r=hs(k,3);return r>.86?.12+hs(k,4)*.1:0};
function roomUpdate(g,dt){const s=dt>1?dt/1000:dt,r=g._rm;r.t+=s;const p=g.player;try{p.update(s,NOIN(g),roomGrid())}catch(e){}
  p.x=Math.max(20,Math.min(274,p.x));const cx=p.x+14;r.near=cx>176&&cx<246;
  if(r.near&&g.input.interact()){g.state='pc';g._pc={ph:'z',bt:0,o:0};p.vx=0}}
// ---- cena do computador ----
const CH='#%&@$?*+=/|<>~^!;:_\\';
const garb=(i,bt)=>{let s='';const n=11+(i*3)%6,f=Math.floor(bt*8)+i*13;for(let k=0;k<n;k++)s+=CH[Math.floor(hs(k+i*31,f)*CH.length)];return s};
const PCS={T:8.7,cam:bt=>{if(bt<6.6)return[160,88,1+.04*bt/6.6];const e=ease((bt-6.6)/2.2);return[160,lin(88,70,e),lin(1.04,3.6,e)]},draw(c,bt){
  b.drawImage(cached('s2',BG2),0,0);
  R(b,SX,SY,SW,SH,TL);b.fillStyle='rgba(60,140,130,'+(.08+.02*Math.sin(bt*40))+')';b.fillRect(SX,SY,SW,SH);
  const F='bold 10px '+MONO,LEG=4,hov=bt>6.0,clk=bt>6.4&&bt<6.62;
  R(b,SX+8,SY+4,SW-16,1,'#2a5a52');ptext(b,'ARQUIVOS  [7]',SX+8,SY+11,'bold 8px '+MONO,'#5a9a8a');
  for(let i=0;i<7;i++){const ts=.5+i*.55,n=Math.max(0,(bt-ts)*24);if(n<=0)continue;const y=SY+25+i*10.5,leg=i===LEG;
    if(leg&&hov)R(b,SX+6,y-8,SW-14,11,clk?CR:V2);
    R(b,SX+10,y-7,6,8,leg?(hov?'#0b0912':CR):'#4a6a62');R(b,SX+11,y-6,4,1,leg?'#6a5a8a':TL);R(b,SX+11,y-4,4,1,leg?'#6a5a8a':TL);
    const s=leg?'casa.desfeita.rem':garb(i,bt),k=Math.min(s.length,Math.floor(n));
    ptext(b,s.slice(0,k),SX+22,y,F,leg?(hov?(clk?BK:CR):TX):(hs(i,Math.floor(bt*6))>.9?'#D27A8A':'#6f9a90'));
    if(n<s.length+2&&Math.floor(bt*6)%2)R(b,SX+22+k*6+1,y-8,4,9,TX)}
  if(bt>4.8){const e=ease((bt-4.8)/1.4),tx=lin(SX+SW-18,SX+70,e),ty=lin(SY+SH-10,SY+25+LEG*10.5-3,e)+(clk?1:0);const ar=[[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,4],[0,7,3],[3,6,2],[3,7,2]];for(const [ax,ay,w] of ar)R(b,tx+ax-1,ty+ay-1,w+2,2,BK);for(const [ax,ay,w] of ar)R(b,tx+ax,ty+ay,w,1,CR);
    if(clk){for(let k=0;k<8;k++){const a=k/8*TAU;R(b,tx+Math.cos(a)*6,ty+Math.sin(a)*6,1,1,CR)}}}
  for(let y=SY;y<SY+SH;y+=2)R(b,SX,y,SW,1,'rgba(0,0,0,.18)');b.fillStyle='rgba(216,239,230,.06)';b.fillRect(SX,SY+((bt*22)%SH),SW,6);
  fly(b,262,12,6,bt,'#8a7aa8','#4a3a6a');thr(b,[[0,170],[100,150],[56,176]],RO,bt);
  if(bt>6.6){const r=Math.min(1,(bt-6.6)/2.1);for(let k=0;k<Math.floor(r*10);k++){const fz=Math.floor(bt*16),y=SY+Math.floor(hs(k,fz)*SH),hh=2+Math.floor(hs(k,fz+2)*10);b.drawImage(buf,SX,y,SW,hh,SX+Math.round((hs(k,fz+4)-.5)*(10+r*70)),y,SW,hh)}}}};
function pcUpdate(g,dt){const s=dt>1?dt/1000:dt,P=g._pc;
  if(P.ph==='z'){P.bt+=s;if(P.bt>=1.5){P.ph='s';P.bt=0}return}
  if(P.ph==='s'){P.bt+=s;if((g.input.confirm()||g.input.interact())&&P.bt<6.3)P.bt=6.3;if(P.bt>=PCS.T){P.ph='out';P.o=.001;sitPrep(g)}return}
  if(P.ph==='out'){P.o+=s/1.7;if(P.o>=1){g._pc=null;g.state='hang';g._hg={t:0,ph:'idle',r:0}}}}
function drawPC(g,c){const P=g._pc,t=performance.now()/1000;
  if(P.ph==='z'){drawRoom(g,c,t,true);tmp.getContext('2d').drawImage(c.canvas,0,0);const e=ease(P.bt/1.45),z=1+e*6.2,cx=lin(320,410,e),cy=lin(180,172,e),sw=640/z,sh=360/z;c.fillStyle='#07050b';c.fillRect(0,0,640,360);c.imageSmoothingEnabled=false;c.drawImage(tmp,Math.max(0,Math.min(640-sw,cx-sw/2)),Math.max(0,Math.min(360-sh,cy-sh/2)),sw,sh,0,0,640,360);c.drawImage(scan,0,0);
    glitch(c,lin(.15,1,e),t);return}
  if(P.ph==='out'){drawHangScene(g,c,{t:0,ph:'idle',r:0},t,true);const bt=PCS.T;PCS.draw(c,bt);tc.clearRect(0,0,640,360);tc.imageSmoothingEnabled=false;blit(tc,PCS,bt,t);tc.drawImage(scan,0,0);const o=ease(P.o);
    for(let y=0;y<360;y+=6){const k=hs(y,Math.floor(t*14));if(k<o*1.25)continue;const dx=Math.round((hs(y,3)-.5)*70*(.3+o));c.drawImage(tmp,0,y,640,6,dx,y,640,6)}
    c.fillStyle='rgba(216,239,230,'+Math.max(0,.3-o*.5)+')';c.fillRect(0,0,640,360);return}
  const bt=P.bt;b.imageSmoothingEnabled=false;PCS.draw(c,bt);c.imageSmoothingEnabled=false;blit(c,PCS,bt,t);c.drawImage(scan,0,0);
  const r=bt>6.6?Math.min(1,(bt-6.6)/2.1):0;glitch(c,Math.max(Math.max(0,1-bt/.5),r*.95,(Math.sin(t*2.3)>.9?.25:0),r>0?(Math.sin(t*9)>.4?.5*r:0):0),t);
  if(bt>PCS.T-.25){c.fillStyle='rgba(11,9,18,'+((bt-(PCS.T-.25))/.25*.5)+')';c.fillRect(0,0,640,360)}}
// ---- Casa Desfeita: Mika sentada no banco ----
function sitPrep(g){if(g._st)return;const p=g.player;if(g._wp){p.x=g._wp.x;p.y=g._wp.y}p.vx=0;p.vy=0;p.anim='idle';p.draw=function(){};g.drawHUD=function(){};g.drawInteractHints=function(){};g.drawToast=function(){};g._st={t:0,ph:'sit'}}
function sitRestore(g){const p=g.player;delete p.draw;delete g.drawHUD;delete g.drawInteractHints;delete g.drawToast}
function drawSitWorld(g,c,t,hideSeat){const w=g.state;g.state='playing';try{G._oDraw.call(g)}finally{g.state=w}const p=g.player,cam=g.camera;if(!hideSeat)drawSeated(c,p.x-cam.x+14,p.y-cam.y+33,t,0)}
// =====================================================================
// MOBÍLIA DO QUARTO (estética do computador) + MIKA SUSPENSA + LIBERTAR
// =====================================================================
const WD='#3a2c48',WD2='#2a2236',WL='#6a5a82',GOLD='#c8a860';
const U=(c,x,yb,hl,fn)=>{c.save();c.translate(x,yb-hl);c.scale(.5,.5);fn(c);c.restore()};
function fBed(c){R(c,6,92,142,4,'rgba(0,0,0,.35)');for(const x of [14,126])R(c,x,82,8,14,WD2);
  R(c,0,6,14,90,WD);R(c,0,6,3,90,WL);R(c,11,6,3,90,WD2);ell(c,7,6,7,5,WD);ell(c,7,2,3,3,GOLD);R(c,14,24,5,60,WD2);for(let y=30;y<84;y+=8)R(c,14,y,5,2,WL);
  R(c,138,48,10,48,WD);R(c,138,48,2,48,WL);R(c,146,48,2,48,WD2);ell(c,143,48,5,4,WD);ell(c,143,44,2,2,GOLD);
  R(c,14,74,126,10,WD);R(c,14,74,126,2,WL);R(c,14,82,126,2,WD2);
  R(c,16,54,122,22,'#e0d6e8');R(c,16,54,122,2,'#fbf4fc');R(c,16,74,122,2,'#a898b8');
  R(c,44,46,94,32,'#7a4a98');R(c,44,46,94,3,'#a678c4');for(let j=0;j<5;j++)for(let i=0;i<12;i++){if((i+j)%2)R(c,48+i*8,52+j*5,4,3,'#6a3a88');else R(c,50+i*8,54+j*5,2,2,'#9a6ab8')}
  R(c,44,74,94,5,'#d8a0c8');R(c,44,78,94,1,'#8a5a9a');R(c,44,46,3,32,'#5a2a78');for(let i=0;i<4;i++)R(c,66+i*20,50,1,26,'#5a2a78');
  ell(c,32,52,17,9,'#f4eef8');ell(c,32,56,15,5,'#c4b8d0');ell(c,30,50,9,3,'#fff');R(c,20,48,2,6,'#c4b8d0')}
function fDresser(c,t){R(c,0,64,78,4,'rgba(0,0,0,.35)');R(c,4,58,8,10,WD2);R(c,66,58,8,10,WD2);
  R(c,0,12,78,50,WD);R(c,0,12,3,50,WL);R(c,75,12,3,50,WD2);R(c,-3,8,84,7,WL);R(c,-3,8,84,2,'#8a7aa2');R(c,-3,14,84,1,WD2);
  for(const y of [18,38]){R(c,6,y,66,16,WD2);R(c,6,y,66,2,'#4a3a5a');ell(c,39,y+8,3,3,GOLD);R(c,38,y+7,1,1,'#fff')}
  ell(c,60,2,6,3,'#2a2236');R(c,54,-4,12,6,'#e8dfcc');R(c,56,-2,8,1,'#a64c68');
  // abajur
  R(c,14,-6,10,8,WD2);ell(c,19,-6,6,2,GOLD);R(c,18,-22,2,16,GOLD);for(let r=0;r<14;r++){const w=6+r*.9;R(c,19-w,-38+r,w*2,1,r<2?'#f4c8d8':'#e8a0c0')}R(c,9,-25,20,2,'#c87aa0');const f=.5+.5*Math.sin(t*5)*.03;R(c,12,-34,14,1,'rgba(255,255,255,'+(.4+f)+')')}
function fWindow(c,t){const W=56;R(c,0,14,W,96,'#8a7aa0');ell(c,28,18,28,16,'#8a7aa0');R(c,4,18,W-8,88,'#0b0a24');ell(c,28,20,24,13,'#0b0a24');
  for(let i=0;i<22;i++)R(c,6+hs(i,5)*(W-12),16+hs(i,6)*86,1,1,i%3?'#d8d0e0':'#8a7aa8');ell(c,38,34,6,6,'#e8dfcc');ell(c,40,32,5,5,'#0b0a24');
  R(c,27,16,2,92,'#b8aac4');R(c,4,56,W-8,2,'#b8aac4');R(c,0,14,W,2,'#c4b8d0');R(c,-4,108,W+8,6,'#b8aac4');R(c,-4,108,W+8,2,'#e0d4e0');R(c,-4,113,W+8,1,'#6a5a7a')}
function fCurtain(c,flip){const W=26,H=104;for(let x=0;x<W;x++){const fo=Math.sin(x*.9)*.5+.5;c.fillStyle=fo>.66?'#a06aa0':fo>.33?'#7a4a78':'#5a3458';c.fillRect(flip?W-1-x:x,0,1,H-Math.round(Math.abs(Math.sin(x*1.7))*6))}
  R(c,flip?0:0,0,W,4,'#c8a860');R(c,0,64,W,3,'#e8dfcc');R(c,flip?W-6:0,64,6,8,'#e8dfcc')}
function fPicture(c){R(c,0,0,38,46,WD);R(c,0,0,38,2,WL);R(c,3,3,32,40,'#d8cfbc');R(c,3,3,32,2,'#f0e8d6');
  const bx=19,by=24;ell(c,bx-7,by-3,7,6,'#a64c68');ell(c,bx+7,by-3,7,6,'#a64c68');ell(c,bx-5,by+5,5,4,'#8a4a78');ell(c,bx+5,by+5,5,4,'#8a4a78');R(c,bx-1,by-6,2,14,'#1d1630');R(c,bx-8,by-5,3,3,'#f4eef8');R(c,bx+6,by-5,3,3,'#f4eef8');R(c,bx-1,by-9,1,3,'#1d1630');R(c,bx+1,by-10,1,3,'#1d1630')}
function fClock(c,t){R(c,0,138,46,4,'rgba(0,0,0,.3)');R(c,2,128,42,10,WD);R(c,2,128,42,2,WL);R(c,6,34,34,96,WD);R(c,6,34,3,96,WL);R(c,37,34,3,96,WD2);ell(c,23,34,20,10,WD);ell(c,23,16,14,14,WD);R(c,9,12,28,22,WD);
  ell(c,23,30,13,13,'#e8dfcc');ell(c,23,30,11,11,'#d8cfbc');for(let i=0;i<12;i++){const a=i/12*TAU;R(c,23+Math.sin(a)*9,30-Math.cos(a)*9,1,1,'#2a1c28')}const h=t*.2,m=t*2.4;
  for(let k=0;k<7;k++){R(c,23+Math.sin(h)*k*.8,30-Math.cos(h)*k*.8,1,1,'#2a1c28')}for(let k=0;k<10;k++)R(c,23+Math.sin(m)*k*.9,30-Math.cos(m)*k*.9,1,1,'#2a1c28');
  R(c,12,52,22,70,'#1d1630');R(c,12,52,22,2,'#0f0b14');const sw=Math.sin(t*3)*7;R(c,23+sw*.3,54,1,52,GOLD);ell(c,23+sw,108,6,6,GOLD);ell(c,23+sw,107,3,3,'#f0d898')}
function fShelf(c){R(c,0,150,100,4,'rgba(0,0,0,.3)');R(c,0,0,100,152,WD);R(c,0,0,4,152,WL);R(c,96,0,4,152,WD2);R(c,0,0,100,3,WL);R(c,5,5,90,142,'#17101e');
  const cols=['#a64c68','#4a3a6a','#6a5a8a','#d8cfbc','#8a4a60','#3a5a6a','#a8946a','#7a4a98'];
  for(let s=0;s<4;s++){const y0=5+s*36;R(c,5,y0+33,90,4,WL);R(c,5,y0+33,90,1,'#8a7aa2');let x=7;let k=0;while(x<88){const w=4+Math.floor(hs(s*9+k,3)*6),h=20+Math.floor(hs(s*9+k,4)*10),col=cols[Math.floor(hs(s*9+k,5)*cols.length)];
    if(s===1&&k===6){ell(c,x+6,y0+28,6,5,'#e8dfcc');R(c,x+5,y0+22,2,3,'#a64c68');x+=14;k++;continue}
    if(s===3&&k===5){R(c,x,y0+22,9,11,'#8a4a60');R(c,x,y0+22,9,2,'#c87a98');x+=11;k++;continue}
    R(c,x,y0+33-h,w,h,col);R(c,x,y0+33-h,1,h,'rgba(255,255,255,.18)');R(c,x+1,y0+36-h-2,w-2,1,'rgba(0,0,0,.25)');if(hs(s*9+k,6)>.6)R(c,x+1,y0+33-h+6,w-2,2,GOLD);x+=w+1;k++}}}
function fDesk(c){R(c,0,76,152,4,'rgba(0,0,0,.35)');R(c,0,0,152,8,WL);R(c,0,0,152,2,'#8a7aa2');R(c,0,8,152,2,WD2);
  R(c,6,10,52,66,WD);R(c,6,10,3,66,WL);R(c,55,10,3,66,WD2);for(const y of [14,40]){R(c,12,y,40,22,WD2);R(c,12,y,40,2,'#4a3a5a');ell(c,32,y+11,3,3,GOLD)}
  R(c,60,10,6,66,WD2);R(c,140,10,8,66,WD);R(c,140,10,2,66,WL);R(c,62,10,80,3,WD2)}
function fStool(c){R(c,2,38,36,3,'rgba(0,0,0,.3)');for(const x of [6,30]){R(c,x,16,4,24,WD);R(c,x,16,1,24,WL)}R(c,18,18,4,20,WD2);R(c,6,28,28,2,WD2);
  ell(c,20,14,19,7,'#8a3a58');ell(c,20,12,19,5,'#c05a78');ell(c,20,10,14,3,'#d87a98');R(c,2,14,36,4,'#8a3a58');for(let i=0;i<7;i++)R(c,5+i*5,17,1,1,GOLD)}
function fVase(c){R(c,0,24,18,44,'rgba(120,140,170,.3)');R(c,1,26,2,38,'rgba(200,220,255,.3)');for(const [dx,dy,col] of [[8,-14,'#c8a860'],[14,-24,'#a88858'],[4,-26,'#d8b878'],[-1,-10,'#8a7048']]){R(c,9,24,1,-dy,'#5a4a30');ell(c,9+dx-9,24+dy,5,5,col);R(c,9+dx-9,24+dy,1,1,BK)}R(c,0,66,18,3,'#3a3a4a')}
function fNote(c){R(c,0,0,26,24,'#D8A0B0');R(c,0,0,26,2,'#e8b8c8');for(let i=0;i<4;i++)R(c,4,7+i*4,18-(i%2)*6,1,'#7a4a5a');R(c,10,-5,6,6,'rgba(222,208,156,.85)')}
function fRug(c){}
// ---- quarto ----
function drawRoom(g,c,t,noGl){const p=g.player;c.save();c.fillStyle='#07050b';c.fillRect(0,0,640,360);c.scale(2,2);c.imageSmoothingEnabled=false;
  R(c,16,16,288,128,'#241c3a');for(let x=16;x<304;x+=12){R(c,x,16,1,128,'#2d2346');R(c,x+6,16,1,128,'#2a2040')}for(let i=0;i<260;i++)R(c,16+hs(i,1)*288,16+hs(i,2)*128,1,1,i%2?'#2d2346':'#1d1630');
  R(c,16,104,288,40,'#1d1626');R(c,16,102,288,3,'#3a2a50');R(c,16,105,288,1,'#0f0b14');for(let x=16;x<304;x+=18)R(c,x,106,1,36,'#17101e');R(c,16,16,288,6,'#17121e');R(c,16,22,288,1,'#3a2a50');R(c,16,140,288,4,'#14101c');R(c,16,140,288,1,'#3a2a50');
  R(c,16,144,288,36,'#1a1224');for(let x=16;x<304;x+=22)R(c,x,144,1,36,'#120d1a');for(let y=152;y<180;y+=9)R(c,16,y,288,1,'#140e1c');R(c,16,144,288,1,'#4a3a6a');
  ell(c,168,158,56,8,'#2a1230');ell(c,168,158,48,6,'#4a2040');ell(c,168,158,34,4,'#2a1230');for(let i=0;i<12;i++)R(c,134+i*6,157,2,2,'#a8946a');
  // esquerda
  U(c,52,74,57,k=>fWindow(k,t));U(c,38,98,52,k=>fCurtain(k,false));U(c,80,98,52,k=>fCurtain(k,true));
  U(c,22,143,48,fBed);
  const g2=c.createRadialGradient(124,98,2,124,98,40);g2.addColorStop(0,'rgba(255,190,210,.22)');g2.addColorStop(1,'rgba(255,190,210,0)');c.fillStyle=g2;c.fillRect(84,56,80,80);
  U(c,98,143,34,k=>fDresser(k,t));U(c,100,86,23,fPicture);
  U(c,150,143,71,k=>fClock(k,t));
  // direita
  U(c,250,143,76,fShelf);
  U(c,182,143,38,fDesk);U(c,226,104,35,fVase);U(c,170,94,12,fNote);
  const near=g._rm&&g._rm.near;drawCRT(c,192,106,t,near);
  U(c,206,143,20,fStool);
  const gl=c.createRadialGradient(207,92,2,207,92,48);gl.addColorStop(0,'rgba(120,230,210,'+(near?.2:.12)+')');gl.addColorStop(1,'rgba(120,230,210,0)');c.fillStyle=gl;c.fillRect(150,40,120,100);
  if(p)p.draw(c,{x:0,y:0});
  c.restore();
  if(g._rm&&g._rm.near){c.font='bold 11px Georgia';const s='[E] usar o computador',w=c.measureText(s).width;COL.label(c,420-w/2,126,s,'bold 11px Georgia','#2a1c28')}
  c.drawImage(scan,0,0);c.globalAlpha=1;
  if(!noGl)glitch(c,roomGl(t),t)}
// ---- Mika suspensa por linhas (frames derivados do sprite real) ----
let UP=null;
function epx(cv){const w=cv.width,h=cv.height,q=cv.getContext('2d'),d=q.getImageData(0,0,w,h),s=d.data,o=q.createImageData(w*2,h*2),t=o.data;
  const G=(x,y)=>{x=x<0?0:x>=w?w-1:x;y=y<0?0:y>=h?h-1:y;return(y*w+x)*4},eq=(i,j)=>s[i]===s[j]&&s[i+1]===s[j+1]&&s[i+2]===s[j+2]&&s[i+3]===s[j+3];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P=G(x,y),A=G(x,y-1),B=G(x+1,y),C=G(x-1,y),D=G(x,y+1);let a=P,b2=P,c2=P,d2=P;
    if(eq(C,A)&&!eq(C,D)&&!eq(A,B))a=A;if(eq(A,B)&&!eq(A,C)&&!eq(B,D))b2=B;if(eq(D,C)&&!eq(D,B)&&!eq(C,A))c2=C;if(eq(B,D)&&!eq(B,A)&&!eq(D,C))d2=D;
    const put=(ox,oy,i)=>{const k=((y*2+oy)*w*2+(x*2+ox))*4;t[k]=s[i];t[k+1]=s[i+1];t[k+2]=s[i+2];t[k+3]=s[i+3]};put(0,0,a);put(1,0,b2);put(0,1,c2);put(1,1,d2)}
  const out=document.createElement('canvas');out.width=w*2;out.height=h*2;out.getContext('2d').putImageData(o,0,0);return out}
function mkUP(){const m=window.SPRS&&window.SPRS.mika_idle;if(!m||!m.i.naturalWidth)return null;const cv=document.createElement('canvas');cv.width=m.cw;cv.height=m.ch;cv.getContext('2d').drawImage(m.i,m.cw,0,m.cw,m.ch,0,0,m.cw,m.ch);return epx(cv)}
const RT=[42,50],NK=[40,36],HIP=[45,82];
const rot=(x,y,cx,cy,a)=>{const c=Math.cos(a),s=Math.sin(a),dx=x-cx,dy=y-cy;return[cx+dx*c-dy*s,cy+dx*s+dy*c]};
function hpose(i){if(i<8){const f=i/8*TAU;return{r:Math.sin(f)*.045,h:.2+Math.sin(f+1.2)*.07,l:-Math.sin(f)*.1,b:Math.sin(f*2)*.8}}
  if(i<10)return{r:i===8?-.02:.02,h:i===8?-.06:-.12,l:.04,b:0};return{r:i===10?-.1:.1,h:-.2,l:i===10?.28:-.28,b:-1.5}}
const lerpP=(a,b,u)=>({r:lin(a.r,b.r,u),h:lin(a.h,b.h,u),l:lin(a.l,b.l,u),b:lin(a.b,b.b,u)});
function hpt(P,part,x,y){let q=[x,y];if(part==='head')q=rot(x,y,NK[0],NK[1],P.h);else if(part==='legs')q=rot(x,y,HIP[0],HIP[1],P.l);q=rot(q[0],q[1],RT[0],RT[1],P.r);return[q[0],q[1]+P.b]}
const ATT=[['head',37,3],['torso',31,52],['torso',55,53],['torso',24,73],['torso',74,72],['legs',35,92],['legs',57,92]];
function drawFig(c,P){if(!UP)UP=mkUP();if(!UP)return;c.save();c.imageSmoothingEnabled=false;
  c.translate(RT[0]*2,RT[1]*2+P.b*2);c.rotate(P.r);c.translate(-RT[0]*2,-RT[1]*2);
  c.save();c.translate(HIP[0]*2,HIP[1]*2);c.rotate(P.l);c.translate(-HIP[0]*2,-HIP[1]*2);c.drawImage(UP,0,156,154,78,0,156,154,78);
  c.strokeStyle='rgba(232,223,204,.9)';c.lineWidth=1.2;for(const x of [35,57]){c.beginPath();c.ellipse(x*2,92*2,6,3,0,0,TAU);c.stroke()}c.restore();
  c.drawImage(UP,0,68,154,104,0,68,154,104);
  c.strokeStyle='rgba(232,223,204,.95)';c.lineWidth=1.3;for(const [x,y] of [[24,73],[74,72]]){c.beginPath();c.ellipse(x*2,y*2,8,5,0,0,TAU);c.stroke();c.strokeStyle='rgba(210,122,138,.9)';c.beginPath();c.ellipse(x*2,y*2,6,3.5,0,0,TAU);c.stroke();c.strokeStyle='rgba(232,223,204,.95)'}
  c.strokeStyle='#D27A8A';c.lineWidth=1.2;for(const [x,y] of [[31,52],[55,53]]){for(let k=0;k<3;k++){const xx=x*2-6+k*6,yy=y*2+(k%2)*2;c.beginPath();c.moveTo(xx-2,yy-2);c.lineTo(xx+2,yy+2);c.moveTo(xx+2,yy-2);c.lineTo(xx-2,yy+2);c.stroke()}}
  c.save();c.translate(NK[0]*2,NK[1]*2);c.rotate(P.h);c.translate(-NK[0]*2,-NK[1]*2);if(P.tn){c.translate(80,0);c.scale(1-.16*P.tn,1);c.translate(-80+P.tn*7,0)}c.drawImage(UP,0,0,154,84,0,0,154,84);
  c.strokeStyle='#D27A8A';c.lineWidth=1.3;for(let k=0;k<3;k++){const xx=66+k*8,yy=6+(k%2)*2;c.beginPath();c.moveTo(xx-2,yy-2);c.lineTo(xx+2,yy+2);c.moveTo(xx+2,yy-2);c.lineTo(xx-2,yy+2);c.stroke()}c.restore();
  c.restore()}
window.__hangSheet=function(){const n=12,W=400,H=600,sh=document.createElement('canvas');sh.width=W*4;sh.height=H*3;const q=sh.getContext('2d');q.fillStyle='#0b0912';q.fillRect(0,0,sh.width,sh.height);
  for(let i=0;i<n;i++){const P=hpose(i),ox=(i%4)*W,oy=Math.floor(i/4)*H;q.save();q.translate(ox+80,oy+110);q.scale(2,2);
    q.strokeStyle='rgba(232,223,204,.8)';q.lineWidth=.8;for(const [part,x,y] of ATT){const a=hpt(P,part,x,y);q.beginPath();q.moveTo(a[0]*2,a[1]*2);q.lineTo(a[0]*2+(a[0]-42)*.2,a[1]*2-70);q.stroke()}
    drawFig(q,P);q.restore();q.fillStyle='#b8aab8';q.font='14px monospace';q.fillText('frame '+i+(i<8?'  balanço':i<10?'  olhar para cima':'  debate-se'),ox+12,oy+22)}
  return sh}
// ---- cena Casa Desfeita: suspensa, texto, LIBERTAR, quebra ----
const HL=[{s:'Onde estou?',t0:1.0,t1:3.55},{s:'Quem sou eu?',t0:3.8,t1:6.25},{s:'Eu deveria...',t0:6.5,t1:99}];
const LIB_T=8.3;
function bigText(c,str,cx,cy,size,t,amt){const f='bold '+size+'px Georgia',m=c.measureText(str);c.save();c.font=f;const w=c.measureText(str).width+30,h=size*1.4;const cv=document.createElement('canvas');cv.width=Math.ceil(w);cv.height=Math.ceil(h);const q=cv.getContext('2d');q.font=f;q.textAlign='center';q.textBaseline='middle';
  q.fillStyle='#7a2a48';q.fillText(str,w/2+3,h/2+3);q.fillStyle='#fbeee6';q.fillText(str,w/2,h/2);q.strokeStyle='#D27A8A';q.lineWidth=1.5;q.strokeText(str,w/2,h/2);
  const fz=Math.floor(t*18);c.save();c.translate(cx-w/2,cy-h/2);
  for(let y=0;y<h;y+=4){const dx=(hs(y,fz)>.82?(hs(y,fz+3)-.5)*60*amt:0)+Math.sin(y*.3+t*30)*amt*2;c.drawImage(cv,0,y,w,4,dx,y,w,4)}
  c.globalCompositeOperation='lighter';c.globalAlpha=.55*amt;c.drawImage(cv,-5*amt,0);c.fillStyle='rgba(0,255,230,.0)';c.restore();c.restore()}
function hangStrings(c,P,s,ox,oy,t,tens,fade){c.save();c.lineCap='round';
  for(let k=0;k<9;k++){const x=40+(k-4)*170+Math.sin(k*3.1)*30,len=60+hs(k,2)*130;c.globalAlpha=.16*fade;c.strokeStyle='#e8dfcc';c.lineWidth=1;c.beginPath();c.moveTo(x+Math.sin(t*.6+k)*4,-10);c.lineTo(x+Math.sin(t*.6+k+1)*6,len);c.stroke();c.fillStyle='#D27A8A';c.fillRect(x+Math.sin(t*.6+k+1)*6-1,len,3,3)}
  c.globalAlpha=fade;ATT.forEach((a,i)=>{const q=hpt(P,a[0],a[1],a[2]),x=ox+q[0]*s,y=oy+q[1]*s,sway=Math.sin(t*.9+i*1.7)*(3+tens*9)+(hs(i,Math.floor(t*30))-.5)*tens*7,xt=x+(x-320)*.05+sway,w=Math.max(1.5,s*.34);
    for(const [col,wd] of [['#0b0912',w+2.2],[i%2?'#D27A8A':'#e8dfcc',w]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+xt)/2+sway*.4,y*.5,xt,-20);c.stroke()}
    c.fillStyle='#fbeee6';c.beginPath();c.arc(x,y,w*.9,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(x+1,y);c.quadraticCurveTo((x+xt)/2+sway*.4+1,y*.5,xt+1,-20);c.stroke()});
  c.restore()}
function drawHangScene(g,c,H,t,under){
  const r=H.ph==='rel'?H.r:0,e=ease(Math.min(1,r/1.0)),s=lin(6.2,4.0,e)+(H.ph==='idle'?.2*Math.sin(t*.4)+Math.min(.5,H.t*.03):0),fx=lin(40,40,e),fy=lin(25,44,e),cyS=lin(165,188,e);
  const ox=320-fx*s,oy=cyS-fy*s;
  // fundo: casa desfeita escurecida
  drawSitWorld(g,c,t,true);c.fillStyle='rgba(6,4,12,.84)';c.fillRect(0,0,640,360);const v=c.createRadialGradient(320,170,60,320,170,420);v.addColorStop(0,'rgba(60,20,50,.18)');v.addColorStop(1,'rgba(0,0,0,.65)');c.fillStyle=v;c.fillRect(0,0,640,360);
  for(let i=0;i<26;i++){const x=(hs(i,3)*660+Math.sin(t*.3+i)*20)%660,y=(hs(i,4)*380-t*(6+i%5*2)+380*4)%380;c.fillStyle=i%3?'rgba(232,223,204,.35)':'rgba(210,122,138,.5)';c.fillRect(x,y,2,2)}
  const ph=H.ph==='idle'?(H.t<LIB_T?Math.floor(t*5)%8:8+(Math.floor(t*2)%2)):10+(Math.floor(t*14)%2),
    P=H.ph==='idle'&&H.t<LIB_T?lerpP(hpose(Math.floor(t*5)%8),hpose((Math.floor(t*5)+1)%8),(t*5)%1):hpose(ph);
  const tens=H.ph==='rel'?Math.min(1,.3+r):(H.t>=LIB_T?.6:.15);
  hangStrings(c,P,s,ox,oy,t,tens,1);
  c.save();c.translate(ox,oy);c.scale(s/2,s/2);
  const sh=c.createRadialGradient(80,100,10,80,100,160);sh.addColorStop(0,'rgba(210,122,138,'+(.1+tens*.18)+')');sh.addColorStop(1,'rgba(210,122,138,0)');c.fillStyle=sh;c.fillRect(-100,-120,360,420);
  drawFig(c,P);c.restore();
  if(under)return;
  // texto
  if(H.ph==='idle'||r<.5){const fade=H.ph==='rel'?1-r*2:1;const g1=c.createLinearGradient(0,255,0,360);g1.addColorStop(0,'rgba(4,2,8,0)');g1.addColorStop(1,'rgba(4,2,8,.85)');c.fillStyle=g1;c.fillRect(0,255,640,105);
    for(const L of HL){if(H.t<L.t0||(H.t>L.t1&&L.t1<90))continue;const n=Math.floor((H.t-L.t0)*16),txt=L.s.slice(0,n),a=Math.min(1,(L.t1-H.t)*4,1)*fade;c.save();c.globalAlpha=Math.max(0,a);c.font='italic 30px Georgia';c.textAlign='center';
      const gl=hs(Math.floor(t*20),7)>.9?(hs(Math.floor(t*20),8)-.5)*8:0;c.fillStyle='rgba(210,122,138,.5)';c.fillText(txt,320+gl+2,326);c.fillStyle='#f0e6f4';c.fillText(txt,320+gl,324);
      if(n<L.s.length+6&&Math.floor(t*3)%2){const w=c.measureText(txt).width;c.fillStyle='#f0e6f4';c.fillRect(320+w/2+4,304,3,24)}c.restore()}
    if(H.t>=LIB_T&&H.ph==='idle'){const k=H.t-LIB_T,amt=Math.max(.35,1-k*1.2);c.save();c.translate(0,0);bigText(c,'LIBERTAR',320,222+Math.sin(t*2)*2,Math.round(84*(1+.04*Math.sin(t*3))),t,amt);c.restore();
      if(H.t>LIB_T+.9){const pul=.5+.5*Math.sin(t*5);c.save();c.globalAlpha=.55+pul*.45;COL.label(c,282,350,'[E]  libertar','bold 13px Georgia','#2a1c28');c.restore()}}}}
function hangGlAmt(H,t){if(H.ph==='rel'){const r=H.r;return r<1?.25+r*.4:Math.min(1,.4+(r-1)*.6)}const bs=hs(Math.floor(t*5),3)>.82?.45:0,tl=HL.reduce((a,L)=>{const d=H.t-L.t0;return Math.max(a,d>0&&d<.3?.55:0)},0),lb=H.t>=LIB_T&&H.t<LIB_T+.45?1:0;return Math.max(.14,bs,tl,lb)}
let FRZ=null;
function hangUpdate(g,dt){const s=dt>1?dt/1000:dt,H=g._hg;
  if(H.ph==='idle'){H.t+=s;if(g.input.interact()){if(H.t<LIB_T+.1)H.t=LIB_T+.05;else if(H.t>LIB_T+.9){H.ph='rel';H.r=0}}}
  else{H.r+=s;if(H.r>=2.5){sitRestore(g);g.state='playing';g._hg=null;g._st=null;g._wp=null;g.messageTimer=0;g.message=null;g._gl={t:0,d:1.0};FRZ=null}}}
function drawHang(g,c){const H=g._hg,t=performance.now()/1000;
  if(H.ph==='rel'&&H.r>=1.0){
    if(!FRZ){const tr=H.r;H.r=1.0;drawHangScene(g,c,H,t,false);H.r=tr;FRZ=document.createElement('canvas');FRZ.width=640;FRZ.height=360;FRZ.getContext('2d').drawImage(c.canvas,0,0);delete g.player.draw}
    const r=H.r,w=g.state;g.state='playing';try{G._oDraw.call(g)}finally{g.state=w}c.fillStyle='rgba(6,4,12,'+Math.max(0,.84-(r-1.9)*1.6)+')';c.fillRect(0,0,640,360);
    const N=18,cx=320,cy=175,al=Math.max(0,1-ease((r-1.35)/.85)),dd=ease((r-1.1)/1.0);
    const ang=[];for(let k=0;k<N;k++)ang.push(k/N*TAU+(hs(k,7)-.5)*.3);
    if(al>0){for(let k=0;k<N;k++){const a0=ang[k],a1=k===N-1?ang[0]+TAU:ang[k+1],am=(a0+a1)/2,d=dd*(30+hs(k,2)*110),rt=(hs(k,3)-.5)*.35*dd;
      c.save();c.globalAlpha=al;c.translate(cx+Math.cos(am)*d,cy+Math.sin(am)*d);c.rotate(rt);c.translate(-cx,-cy);c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+1100*Math.cos(a0),cy+1100*Math.sin(a0));c.lineTo(cx+1100*Math.cos(a1),cy+1100*Math.sin(a1));c.closePath();c.clip();c.drawImage(FRZ,0,0);c.restore()}
      const pr=Math.min(1,(r-1.0)/.45);c.save();c.globalAlpha=al;c.lineCap='round';c.lineJoin='round';
      for(let k=0;k<N;k++){const a=ang[k],L=700*pr,pts=[];for(let d=0;d<=L;d+=28){const off=(hs(k*31+Math.floor(d/28),5)-.5)*18;pts.push([cx+Math.cos(a)*d-Math.sin(a)*off,cy+Math.sin(a)*d+Math.cos(a)*off])}
        for(const [col,wd] of [['#07050b',4],['#fbeee6',1.6],['#D27A8A',.7]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}}
      c.restore()}
    c.drawImage(scan,0,0);glitch(c,hangGlAmt(H,t),t);
    if(r>2.05&&r<2.5){const k=(r-2.05)/.45;c.fillStyle='rgba(251,238,230,'+(k<.5?k*1.2:Math.max(0,(1-k)*1.2))+')';c.fillRect(0,0,640,360)}return}
  drawHangScene(g,c,H,t,false);c.drawImage(scan,0,0);glitch(c,hangGlAmt(H,t),t);
  if(H.ph==='idle'&&H.t<.8){c.fillStyle='rgba(7,5,11,'+(1-H.t/.8)+')';c.fillRect(0,0,640,360)}}

// ---------- integração ----------
const oS=G.startNewGame;
G.startNewGame=function(){oS.call(this);if(this._ni)return;
  this._in={i:0,bt:0,o:0,ph:'in'};this.state='playing';try{for(let k=0;k<70;k++)G._oUpdate.call(this,.016)}catch(e){}this.messageTimer=2.6;this.message='Desperte na Casa Desfeita...';this.state='intro'};
const oCG=G.continueGame;G.continueGame=function(){this._ni=1;try{return oCG.apply(this,arguments)}finally{this._ni=0}};
G._oUpdate=G.update;
const oU=G.update;
for(const S of SC){if(S.te===undefined)S.te=(S.t0||0)+S.tx.join('').length/30+.35}
G.update=function(dt){
  if(this.state==='room'&&this._rm){roomUpdate(this,dt);return}
  if(this.state==='pc'&&this._pc){pcUpdate(this,dt);return}
  if(this.state==='hang'&&this._hg){hangUpdate(this,dt);return}
  if(this._gl&&typeof this._gl==='object'){this._gl.t+=(dt>1?dt/1000:dt);if(this._gl.t>=this._gl.d)this._gl=null}
  if(this.state!=='intro'||!this._in)return oU.call(this,dt);
  const I=this._in,i=this.input,s=dt>1?dt/1000:dt,S=SC[Math.min(I.i,SC.length-1)];
  if(I.ph==='out'){I.o+=s/1.5;if(I.o>=1){this.state='room';this._in=null}return}
  I.bt+=s;
  if(i.wasPressed('Escape')){I.ph='out';I.i=SC.length-1;I.o=.001;return}
  if(i.confirm()||i.wasPressed('KeyE')){if(I.bt<S.te-.05)I.bt=S.te;else adv(I)}
  else if(I.bt>=S.T)adv(I)};
function adv(I){if(I.i>=SC.length-1){I.ph='out';I.o=.001;return}I.i++;I.bt=0}
const oD=G.draw;
G.draw=function(){
  if(this.state==='room'&&this._rm){const c=this.ctx;c.imageSmoothingEnabled=false;drawRoom(this,c,performance.now()/1000);return}
  if(this.state==='pc'&&this._pc){drawPC(this,this.ctx);return}
  if(this.state==='hang'&&this._hg){drawHang(this,this.ctx);return}
  if(this.state==='intro'&&this._in){const c=this.ctx;c.imageSmoothingEnabled=false;c.fillStyle='#0b0912';c.fillRect(0,0,640,360);drawIntro(this,c);
  if(this._in.ph!=='out'){c.font='italic 10px '+HAND;c.fillStyle='rgba(216,160,176,.7)';c.textAlign='right';c.fillText('ENTER avança · ESC pula',628,352);c.textAlign='left'}return}
  oD.call(this);if(this._gl&&typeof this._gl==='object'){const k=this._gl.t/this._gl.d;glitch(this.ctx,Math.max(0,1-k)*(k<.12?k/.12:1),performance.now()/1000)}};
G._oDraw=oD;
window.__introSC=SC;

// =====================================================================
// MINI BOSS: cinemática do Espírito do Véu (verde x roxo, cenário real)
// =====================================================================
const CEN_X=95.5*16,FLOOR=185*16,CEIL=173*16;
let SPG=null,SPC=null,FRZ2=null;
function mkSPG(){const S=window.SPRS&&window.SPRS.boss_aura;if(!S||!S.i.naturalWidth)return null;const out=[];
  const ramp=[[3,22,14],[8,60,38],[22,128,76],[70,226,140],[196,255,224]];
  for(let f=0;f<S.n;f++){const cv=document.createElement('canvas');cv.width=S.cw;cv.height=S.ch;cv.getContext('2d').drawImage(S.i,f*S.cw,0,S.cw,S.ch,0,0,S.cw,S.ch);
    const e=epx(cv),q=e.getContext('2d'),d=q.getImageData(0,0,e.width,e.height),s=d.data;
    for(let i=0;i<s.length;i+=4){if(s[i+3]<24){s[i+3]=0;continue}const l=Math.min(1,Math.pow((s[i]*.35+s[i+1]*.25+s[i+2]*.4)/255*1.55,1.3)),k=l*(ramp.length-1),a=Math.floor(k),u=k-a,A=ramp[a],B=ramp[Math.min(ramp.length-1,a+1)];
      s[i]=A[0]+(B[0]-A[0])*u;s[i+1]=A[1]+(B[1]-A[1])*u;s[i+2]=A[2]+(B[2]-A[2])*u;s[i+3]=s[i+3]>150?255:s[i+3]*1.4}
    q.putImageData(d,0,0);out.push(e)}
  // colunas da silhueta (frame 0)
  const e0=out[0],w=e0.width,h=e0.height,dd=e0.getContext('2d').getImageData(0,0,w,h).data,top=[],bot=[];
  for(let x=0;x<w;x++){let a=-1,b2=-1;for(let y=0;y<h;y++)if(dd[(y*w+x)*4+3]>120){if(a<0)a=y;b2=y}top.push(a);bot.push(b2)}
  const runs=[];for(let x=0;x<w;x++){const R=[];let st=-1;for(let y=0;y<=h;y++){const on=y<h&&dd[(y*w+x)*4+3]>120;if(on&&st<0)st=y;if(!on&&st>=0){if(y-st>=2)R.push([st,y-1]);st=-1}}runs.push(R)}
  SPC={top,bot,w,h,runs};return out.map(mkRing)}
// espírito em coordenadas de mundo: (x,y)=pés, s=escala por pixel do sprite 2x
function drawSpirit(c,x,y,s,t,o){o=o||{};if(!SPG&&!(SPG=mkSPG()))return;
  const MG=4,n=SPG.length,ft=o.f!=null?o.f:t*3.2,fi=Math.floor(ft)%n,fr=ft-Math.floor(ft),im=SPG[fi],im2=SPG[(fi+1)%n],w=im.width,h=im.height,hh=h-2*MG,gl=o.gl||0,al=o.a==null?1:o.a,fz=Math.floor(t*17);
  c.save();c.imageSmoothingEnabled=false;
  const cy=y-hh*s*.5;let gr=c.createRadialGradient(x,cy,2,x,cy,hh*s*.95);gr.addColorStop(0,'rgba(90,255,170,'+(.4*al)+')');gr.addColorStop(.5,'rgba(60,220,130,'+(.13*al)+')');gr.addColorStop(1,'rgba(60,220,130,0)');
  c.globalCompositeOperation='lighter';c.fillStyle=gr;c.fillRect(x-hh*s,cy-hh*s,hh*s*2,hh*s*2);c.globalCompositeOperation='source-over';
  const lean=(o.lean||0)+Math.sin(t*2.1)*.012+(gl>.3&&hs(fz,2)>.8?(hs(fz,3)-.5)*.14*gl:0);
  const strips=(img,dx0,dy0,alpha,comp)=>{c.save();c.globalAlpha=alpha;c.globalCompositeOperation=comp||'source-over';c.translate(x+dx0,y+dy0);c.rotate(lean);
    const SH=2,hi=img.height,iw=img.width;for(let sy=0;sy<hi;sy+=SH){const k=1-sy/hi,j=hs(sy*.37,fz),dx=Math.sin(sy*.045+t*2.4)*(.6+k*1.7)+(gl>.02&&j>1-.16*gl?(hs(sy,fz+4)-.5)*gl*60:0);
      c.drawImage(img,0,sy,iw,SH,(-iw/2+dx)*s,(sy-hi+MG)*s,iw*s,SH*s+.5)}c.restore()};
  const gh=o.ghost||0;for(let k=gh;k>=1;k--){const off=(o.dir||1)*(k*13+Math.sin(t*3+k)*3)*s+(gl>.4?(hs(k,fz)-.5)*40*s:0);strips(im,off,0,.17*al/k,'lighter')}
  strips(im,0,0,.97*al);if(fr>.03)strips(im2,0,0,fr*.85*al);
  const ex=x+Math.sin(lean)*hh*s*.8,ey=y-hh*s*.82;c.globalAlpha=al;
  c.strokeStyle='#b4ffd4';c.lineWidth=Math.max(.45,.8*s);for(let k=0;k<3;k++){const xx=ex-8*s+k*8*s,yy=ey-10*s+(k%2)*1.6*s;c.beginPath();c.moveTo(xx-1.7*s,yy-1.7*s);c.lineTo(xx+1.7*s,yy+1.7*s);c.moveTo(xx+1.7*s,yy-1.7*s);c.lineTo(xx-1.7*s,yy+1.7*s);c.stroke()}
  const bl=hs(Math.floor(t*2.5),4)>.92?0:1;if(bl){c.fillStyle='#f0fff6';c.fillRect(ex-9*s,ey,6*s,1.7*s);c.fillRect(ex+3*s,ey,6*s,1.7*s)}
  c.globalCompositeOperation='lighter';c.fillStyle='rgba(120,255,190,.45)';c.fillRect(ex-11*s,ey-.8*s,10*s,3.4*s);c.fillRect(ex+1*s,ey-.8*s,10*s,3.4*s);
  c.restore()}
function mkRing(e){const w=e.width,h=e.height,o=document.createElement('canvas');o.width=w+8;o.height=h+8;const q=o.getContext('2d'),sil=document.createElement('canvas');sil.width=w;sil.height=h;const sq=sil.getContext('2d');sq.drawImage(e,0,0);sq.globalCompositeOperation='source-in';sq.fillStyle='#00170c';sq.fillRect(0,0,w,h);
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dx*dx+dy*dy<=5)q.drawImage(sil,4+dx,4+dy);q.drawImage(e,4,4);return o}
// espírito feito de fios (silhueta se formando)
function drawSpiritThreads(c,x,y,s,prog,t){if(!SPG&&!(SPG=mkSPG()))return;const w=SPC.w,h=SPC.h;c.save();c.lineCap='butt';
  for(let cx=0;cx<w;cx+=2){const tp=SPC.top[cx],bt=SPC.bot[cx];if(tp<0)continue;const pc=Math.max(0,Math.min(1,prog*1.6-hs(cx,5)*.6)),sw=Math.sin(t*2+cx*.2)*(1-pc)*4*s;
    const X=x+(cx-w/2)*s,yT=y+(tp-h)*s,yB=y+(bt-h)*s,yEnd=yT+(yB-yT)*pc,top=CEIL-20;
    if(cx%8===0){c.globalAlpha=.4*Math.min(1,prog*3);c.strokeStyle='#52f0a0';c.lineWidth=.45;c.beginPath();c.moveTo(X+sw,top);c.lineTo(X,yT);c.stroke()}
    if(pc>0){c.globalAlpha=.95;c.strokeStyle=hs(cx,2)>.55?'#43e58f':hs(cx,3)>.5?'#b4ffd4':'#1f9a5e';c.lineWidth=1.25*s;c.beginPath();for(const q of SPC.runs[cx]){const a0=y+(q[0]-h)*s,a1=Math.min(y+(q[1]-h)*s,yEnd);if(a1>a0){c.moveTo(X,a0);c.lineTo(X,a1)}}c.stroke()}}
  c.restore()}
// Mika (a mesma figura da cena suspensa), pés em (x,y)
const P0={r:0,h:0,l:0,b:0},KF=46/234;
function drawMikaFig(c,x,y,P,flip,al,k){k=k||KF;c.save();c.globalAlpha=al==null?1:al;c.translate(x,y+2);c.scale(flip?-k:k,k);c.translate(-77,-232);drawFig(c,P);c.restore()}
// texto em verde com glitch
function gtext(c,str,cx,cy,size,t,amt,style,pal){pal=pal||{fill:'#d8ffe8',sh:'#04321c',edge:'#3fe58a',out:'#010a05'};const f=(style||'bold')+' '+size+'px Georgia';c.save();c.font=f;const w=Math.ceil(c.measureText(str).width)+34,h=Math.ceil(size*1.5);const cv=document.createElement('canvas');cv.width=w;cv.height=h;const q=cv.getContext('2d');q.font=f;q.textAlign='center';q.textBaseline='middle';
  q.lineJoin='round';q.lineWidth=6;q.strokeStyle=pal.out;q.strokeText(str,w/2,h/2);q.fillStyle=pal.sh;q.fillText(str,w/2+3,h/2+3);q.fillStyle=pal.fill;q.fillText(str,w/2,h/2);q.strokeStyle=pal.edge;q.lineWidth=1.4;q.strokeText(str,w/2,h/2);
  const fz=Math.floor(t*18);c.translate(Math.round(cx-w/2),Math.round(cy-h/2));
  for(let y=0;y<h;y+=3){const dx=(hs(y,fz)>.8?(hs(y,fz+3)-.5)*70*amt:0)+Math.sin(y*.3+t*30)*amt*2.4;c.drawImage(cv,0,y,w,3,dx,y,w,3)}
  c.globalCompositeOperation='lighter';c.globalAlpha=.6*Math.min(1,amt+.2);c.drawImage(cv,-5*amt-1,0);c.fillStyle='rgba(255,40,120,.0)';c.globalAlpha=.3*amt;c.drawImage(cv,6*amt+1,1);c.restore()}
// ---- script de falas ----
const BTX=[{w:'s',s:'Você demorou',t0:15.9,t1:19.4,big:1},{w:'m',s:'Onde...',t0:21.0,t1:22.7},{w:'s',s:'Você também está presa',t0:23.5,t1:25.8},{w:'m',s:'Presa a quê?',t0:26.1,t1:27.4},
  {w:'s',s:'Então venha, descubra se consegue atravessar',t0:29.5,t1:33.0,two:['Então venha,','descubra se consegue atravessar']}];
const FAKE={isDown:k=>k==='ArrowRight',wasPressed:()=>false};['left','up','down','jump','attack','interact','dash','map','pause','heal','mana','confirm'].forEach(k=>FAKE[k]=()=>false);FAKE.right=()=>true;
const BT_END=33.0,BT_SHATTER=2.4;
function bcShards(g,x,y,n,sp){const S=g._sh||(g._sh=[]);for(let i=0;i<n;i++)S.push({x:x+Math.random()*16-8,y:y+Math.random()*16-8,vx:(Math.random()*2-1)*(sp||1),vy:-Math.random()*2.2*(sp||1),l:1+Math.random()*.8})}
function bcClose(g,k){for(let r=0;r<3;r++){if(k>r&&g.grid[184-r][79]!==1){g.grid[184-r][79]=1;bcShards(g,79*16+8,(184-r)*16+8,10,1.4)}}}
function bcStart(g,b){const p=g.player;const rt=!!g._bossRetry;BTX[0].s=rt?'Então você voltou':'Você demorou';WIN[3].title=rt?'VOCE_VOLTOU.txt':'VOCE_DEMOROU.txt';WIN[3].l=rt?['ultimo acesso: agora','tamanho: 0 bytes']:['ultimo acesso: ha muito tempo','tamanho: 0 bytes'];p.facing=1;b._introDone=true;g.state='bcine';p.vx=0;p.vy=0;p.anim='idle';
  g.drawHUD=function(){};g.drawInteractHints=function(){};g.drawToast=function(){};g.messageTimer=0;g.message=null;
  g._bc={t:0,sh:0,flash:0,x0:p.x,b:b,fig:false,closed:0,imp:false,rev:false};FRZ2=null}
function bcEnd(g){const p=g.player;delete p.draw;delete g.drawHUD;delete g.drawInteractHints;delete g.drawToast;g.state='playing';g._bc=null;FRZ2=null}
function bcMika(B,p){const mx=p.x+14,my=p.y+34;return [mx,my]}
function bcUpdate(g,dt){const B=g._bc,s=Math.min(.05,dt>1?dt/1000:dt),p=g.player,b=B.b;B.t+=s;let t=B.t;
  if(g.input.wasPressed('Escape')&&t<BT_END-.6){B.t=t=BT_END-.55;}
  B.sh*=Math.exp(-s*2.4);B.flash=Math.max(0,B.flash-s*1.6);
  if(!B.imp&&t>=4.2){B.imp=true;B.sh=1.7;B.flash=.55;for(let i=0;i<22;i++)bcShards(g,80*16+Math.random()*31*16,CEIL+4,1,.7)}
  const cl=t<.05?0:t<.2?1:t<.35?2:3;if(cl>B.closed){bcClose(g,cl);B.closed=cl;B.sh=Math.max(B.sh,1.1);B.flash=.35}
  if(B.t>.4&&B.closed<3){bcClose(g,3);B.closed=3}
  // Mika (sprite real) caminhando até o centro
  const xs=B.x0,xe=CEN_X-14;
  if(t<1.5){p.x=xs;p.anim='idle';p.facing=t>.55&&t<1.25?-1:1;p.vx=0}
  else if(t<4.2){const u=(t-1.5)/2.7;p.facing=1;const ox=p.x;p.update(s,FAKE,g.grid);p.x=lin(xs,xe,u);p.vx=0}
  else{p.x=B.rx!=null?B.rx:xe;p.vx=0;p.anim='idle';
    if(t<8.8){const L=[[4.2,1],[5.0,-1],[5.7,1],[6.3,-1],[6.8,1],[7.4,-1],[7.9,1]];let f=1;for(const q of L)if(t>=q[0])f=q[1];p.facing=f}}
  if(t>=14.0&&t<15.4){const u=ease((t-14.0)/.55);p.x=lin(xe,xe-36,u);B.rx=xe-36}else if(t>=15.4){p.x=xe-36;B.rx=xe-36}
  if(t>=8.2&&!B.fig){B.fig=true;p.draw=function(){}}
  if(t>=BT_END&&!B.rev){B.rev=true;b.hidden=false;b.aggro=false;b.alive=true;b.x=CEN_X-b.w/2;b.y=FLOOR-44-b.h;b.vy=0;b.vx=0;b.bs='idle';b.bt=1500;delete p.draw;p.facing=1;p.x=xe-36;
    g.camera.x=Math.max(0,Math.min(220*16-640,p.x-320));g.camera.y=Math.max(0,Math.min(192*16-360,p.y-200))}
  if(t>=BT_END+BT_SHATTER){b.aggro=true;g._flash=.6;bcEnd(g);g._gl={t:0,d:1.3};return}
  const S=g._sh;if(S){for(const q of S){q.x+=q.vx;q.y+=q.vy;q.vy+=.04;q.l-=s}g._sh=S.filter(q=>q.l>0)}}
// câmera: {fx,fy,z,rot}
function bcCam(B,p){const t=B.t,mx=p.x+14,my=p.y+34,faceX=CEN_X,faceY=FLOOR-37;let fx,fy,z=1,rot=0;
  const K=(t0,t1)=>ease((t-t0)/(t1-t0));
  if(t<8.0){fx=lin(mx+50,mx+30,K(1.5,4.2));if(t<1.5)fx=mx+60;fy=2858;z=lin(1.0,1.18,K(0,8))}
  else if(t<10.4){const u=K(8.0,10.4);fx=lin(CEN_X+30,faceX+1,u);fy=lin(2858,faceY,u);z=lin(1.18,6.4,u)}
  else if(t<14.0){const u=(t-10.4)/3.6;fx=faceX+1+Math.sin(u*3)*2.2;fy=faceY+Math.sin(u*2.2)*1.4;z=6.4+u*.4;rot=Math.sin(u*2.4)*.035}
  else if(t<15.9){const u=K(14.0,15.9);fx=lin(faceX+1,CEN_X+8,u);fy=lin(faceY,2884,u);z=lin(6.8,1.95,u);rot=lin(0,-.035,u)}
  else if(t<19.9){const u=(t-15.9)/4;fx=CEN_X+8+u*4;fy=2884;z=1.95+u*.15;rot=-.035}
  else if(t<22.0){const u=K(19.9,22.0);const mxx=CEN_X-36;fx=lin(CEN_X+12,mxx+12,u);fy=lin(2884,my-32,u);z=lin(2.1,3.7,u);rot=lin(-.035,0,u)}
  else if(t<27.0){fx=CEN_X-36+10;fy=my-44;z=3.3;rot=-.085}
  else if(t<29.0){const u=(t-27.0)/2,pan=Math.sin(u*TAU*1.25)*(1-u*.4),b=ease((u-.55)/.45);const px=CEN_X-30+pan*120+u*30,py=2870+Math.sin(u*9)*8*(1-u),pz=lin(2.0,1.7,Math.min(1,u*2))+(u>.7?(u-.7)*1.2:0),pr=Math.sin(u*14)*.06*(1-u);fx=lin(px,CEN_X,b);fy=lin(py,2862,b);z=lin(pz,2.0,b);rot=lin(pr,.035,b)}
  else if(t<BT_END){const u=(t-29.0)/(BT_END-29);fx=CEN_X;fy=2862;z=2.0+u*.25;rot=.035*(1-u)}
  else{fx=CEN_X;fy=2862;z=2.25}
  return{fx,fy,z,rot}}
function bcGl(B){const t=B.t;let a=.09;const sp=(r,th)=>hs(Math.floor(t*r),3)>th?1:0;
  if(t<.9)a=Math.max(a,1-t/.9);
  if(t>=4.2&&t<5)a=Math.max(a,.95-(t-4.2)*.8);
  if(t>8.0&&t<8.5)a=Math.max(a,.85);
  if(t>=10.3&&t<14)a=Math.max(a,.12+sp(7,.8)*.3+(t>13?.18:0));
  if(t>=14.0&&t<15)a=Math.max(a,.7);
  if(t>=15.8&&t<19.4)a=Math.max(a,.35+sp(9,.72)*.35);
  if(t>=19.4&&t<20.0)a=Math.max(a,.55+(t-19.4)*.75);
  if(t>=20.0&&t<20.5)a=Math.max(a,1);
  if(t>=21.9&&t<22.6)a=Math.max(a,.9);
  if(t>=22.6&&t<27)a=Math.max(a,.14+sp(6,.8)*.3);
  if(t>=26.9&&t<27.8)a=Math.max(a,1-(t-26.9)*.5);
  if(t>=27.8&&t<29)a=Math.max(a,.5);
  if(t>=29&&t<BT_END)a=Math.max(a,.16+sp(8,.8)*.35+Math.max(0,t-31.8)*.5);
  if(t>=BT_END)a=Math.max(a,Math.max(0,1-(t-BT_END)/2.3));
  return Math.min(1,a)}
// fios roxos que prendem o espírito
const SPA=[[98,6],[72,46],[124,46],[58,86],[138,86],[98,92],[86,130],[112,130]];
function purpleStrings(c,sx,sy,s,tilt,t,tens,al,snap){c.save();c.lineCap='round';
  SPA.forEach((a,i)=>{const lx=(a[0]-98)*s,ly=(a[1]-140)*s,cs=Math.cos(tilt),sn=Math.sin(tilt),X=sx+lx*cs-ly*sn,Y=sy+lx*sn+ly*cs,sway=Math.sin(t*1.7+i*1.3)*(1+tens*5)+(hs(i,Math.floor(t*28))-.5)*tens*5,top=CEIL-6+(i%3)*2,xt=X+(X-sx)*.25+sway;
    for(const [col,wd] of [['#12062a',1.9],[i%2?'#a56bff':'#7d3fe0',.9]]){c.globalAlpha=al*(snap?Math.max(0,1-snap*1.5):1);c.strokeStyle=col;c.lineWidth=wd;c.beginPath();c.moveTo(X,Y);c.quadraticCurveTo((X+xt)/2+sway*.3,(Y+top)/2,xt,top-snap*40);c.stroke()}
    c.globalAlpha=al;c.fillStyle='#e6d4ff';c.fillRect(X-.8,Y-.8,1.8,1.8)});
  c.restore()}
function braid(c,B,t,n,wv,al,x0,eyeY,tipK){c.save();c.lineCap='round';c.globalAlpha=al;
  for(let i=0;i<n;i++){const t0=10.45+i*(i===0?0:.45)+(i>0?.2:0);const dropK=Math.max(0,Math.min(1,(t-t0)/(i===0?1.7:.9)));if(dropK<=0)continue;const e=1-Math.pow(1-dropK,2.4);
    const baseX=x0+(i-(n-1)/2)*2.5,tipY=lin(eyeY-70,eyeY+(i%3)*2.5-2,e*(tipK==null?1:tipK)),pts=[];
    for(let y=CEIL-30;y<=tipY;y+=2){const u=(y-(CEIL-30))/Math.max(1,tipY-(CEIL-30));const w=Math.sin(u*7+t*2.3+i*2.1)*wv*(2+u*5)*(.4+u)+Math.sin(u*3-t*1.4+i)*wv*2.5;pts.push([baseX+w,y])}
    for(const [col,wd] of [['rgba(2,26,14,.85)',1.7],[i%2?'#2fe283':'#74f6ae',.8],['rgba(220,255,236,.9)',.28]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();pts.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}
    c.fillStyle='#d8ffe8';c.fillRect(baseX+(pts.length?pts[pts.length-1][0]-baseX:0)-.8,tipY-.5,1.8,1.8)}
  c.restore()}
function bcWorld(g,c,fx,fy){let wc=bcWorld.wc;if(!wc){wc=bcWorld.wc=document.createElement('canvas');wc.width=640;wc.height=360}
  g.camera.x=Math.floor(fx)-320;g.camera.y=Math.floor(fy)-180;const w=g.state;g.state='playing';try{G._oDraw.call(g)}finally{g.state=w}
  const q=wc.getContext('2d');q.clearRect(0,0,640,360);q.drawImage(c.canvas,0,0);return wc}
const TRN=[[7.7,.6,'bars'],[10.2,.35,'dip'],[13.9,.55,'whip'],[19.85,.4,'dip'],[21.8,.5,'bars'],[26.85,.4,'dip'],[28.55,.5,'bars']];
function bcTrans(c,t,tm){for(const [t0,d,ty] of TRN){const u=(t-t0)/d;if(u<0||u>1)continue;const f=1-Math.abs(2*u-1);
  if(ty==='bars'){const N=14,bw=640/N;for(let i=0;i<N;i++){const th=hs(i,t0)*.6,k=Math.min(1,Math.max(0,(f-th)/(1-th))),hg=360*Math.min(1,k*1.4),up=i%2===0;c.fillStyle='#02010a';c.fillRect(i*bw,up?0:360-hg,bw+1,hg);if(hg>2){c.fillStyle='#43e58f';c.fillRect(i*bw,up?hg:360-hg-1,bw+1,1)}}}
  else if(ty==='dip'){c.fillStyle='rgba(2,1,8,'+Math.min(1,f*1.6)+')';c.fillRect(0,0,640,360);if(f>.3&&hs(Math.floor(tm*30),t0)>.5){c.fillStyle='rgba(70,255,150,.5)';c.fillRect(0,hs(Math.floor(tm*25),2)*340,640,3+hs(Math.floor(tm*25),5)*14)}}
  else{tc.drawImage(c.canvas,0,0);c.save();c.globalCompositeOperation='lighter';for(let k=-4;k<=4;k++){if(!k)continue;c.globalAlpha=.04*f;c.drawImage(tmp,k*26*f,0)}c.restore()}}}
function rblur(c,a){if(a<.04)return;tc.drawImage(c.canvas,0,0);c.save();c.globalCompositeOperation='lighter';for(let k=1;k<=4;k++){const sc=1+a*.035*k;c.globalAlpha=.06*a;c.translate(320,180);c.scale(sc,sc);c.translate(-320,-180);c.drawImage(tmp,0,0);c.setTransform(1,0,0,1,0,0)}c.restore()}
function warp(c,a,tm){if(a<.05)return;tc.drawImage(c.canvas,0,0);for(let y=0;y<360;y+=3){const dx=Math.sin(y*.045+tm*7)*a*7+(hs(y>>2,Math.floor(tm*12))>.96?(hs(y,Math.floor(tm*12))-.5)*a*40:0);c.drawImage(tmp,0,y,640,3,dx,y,640,3)}}
function fileWin(c,W,t,tm){const u=t-W.t0,v=W.t1-t;if(u<0||v<0)return;if(u<.3&&hs(Math.floor(tm*30),W.t0*7)>.55+u)return;
  const w=W.w,h=18+W.l.length*13+(W.bar?14:0),jit=hs(Math.floor(tm*20),W.t0)>.93?(hs(Math.floor(tm*20),3)-.5)*14:0,col=W.col||'#2fbf76';
  c.save();c.translate(Math.round(W.x+jit),W.y);c.globalAlpha=Math.min(1,v*5)*.94;c.fillStyle='rgba(2,14,9,.9)';c.fillRect(0,0,w,h);c.fillStyle=col;c.fillRect(0,0,w,13);
  ptext(c,W.title,5,10,'bold 10px '+MONO,'#021208');c.fillStyle='#021208';c.fillRect(w-24,3,5,5);c.fillRect(w-14,3,5,5);c.strokeStyle=col;c.strokeRect(.5,.5,w-1,h-1);
  W.l.forEach((s,i)=>ptext(c,typeof s==='function'?s(t):s,6,26+i*13,'10px '+MONO,W.tx||'#9dffc8'));
  if(W.bar){const p=Math.min(1,Math.max(0,W.bar(t)));c.fillStyle='#0b3a22';c.fillRect(6,h-13,w-12,6);c.fillStyle='#43e58f';c.fillRect(6,h-13,(w-12)*p,6)}c.restore()}
const WIN=[{t0:.9,t1:2.9,x:370,y:46,w:244,title:'SALA_DO_ESPIRITO.rem',l:['saida........ removida','acesso....... negado']},
 {t0:4.5,t1:6.6,x:24,y:46,w:214,title:'memoria.tmp',l:['leitura falhou','setor 0x4F2A corrompido']},
 {t0:10.7,t1:13.6,x:392,y:46,w:222,title:'fio_01.rem',l:[t=>'escrevendo... '+Math.min(99,Math.floor((t-10.7)*34))+'%'],bar:t=>(t-10.7)/3.2},
 {t0:16.2,t1:18.6,x:26,y:46,w:236,title:'VOCE_DEMOROU.txt',l:['ultimo acesso: ha muito tempo','tamanho: 0 bytes']},
 {t0:19.3,t1:20.5,x:352,y:46,w:240,title:'espirito.exe',l:['NAO ENCONTRADO','arquivo removido do fluxo'],col:'#c74a6a',tx:'#ffb0c0'},
 {t0:23.9,t1:26.4,x:26,y:46,w:212,title:'presa.rem',l:['prisao.... ???','chave..... nenhuma']},
 {t0:29.8,t1:33.0,x:368,y:46,w:246,title:'atravessar.rem',l:[t=>'progresso: '+Math.min(99,Math.floor((t-29.8)*31))+'%'],bar:t=>(t-29.8)/3.2}];
let DK=null;
function bcDark(c,cam,shx,shy,L,tm,amt){if(!DK){DK=document.createElement('canvas');DK.width=640;DK.height=360}const q=DK.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,640,360);q.fillStyle='rgba(2,0,8,'+amt+')';q.fillRect(0,0,640,360);q.globalCompositeOperation='destination-out';
  const co=Math.cos(cam.rot),si=Math.sin(cam.rot),pos=[];
  for(const l of L){const dx=(l.x-cam.fx)*cam.z,dy=(l.y-cam.fy)*cam.z,sx=320+shx+dx*co-dy*si,sy=180+shy+dx*si+dy*co,r=Math.min(l.r*cam.z,310)*(1+.03*Math.sin(tm*11+l.x)+(hs(Math.floor(tm*14),l.x|0)>.94?-.12:0)),a=l.a==null?1:l.a;
    const g=q.createRadialGradient(sx,sy,r*.1,sx,sy,r);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(.55,'rgba(0,0,0,'+.55*a+')');g.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g;q.fillRect(sx-r,sy-r,r*2,r*2);pos.push([sx,sy,r,l.tint])}
  c.drawImage(DK,0,0);c.save();c.globalCompositeOperation='lighter';for(const p of pos){if(!p[3])continue;const g=c.createRadialGradient(p[0],p[1],2,p[0],p[1],p[2]*.9);g.addColorStop(0,p[3]);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(p[0]-p[2],p[1]-p[2],p[2]*2,p[2]*2)}c.restore()}
function bcLights(t,mx,my,sy){const L=[],R=t<4.2?76:t<8?lin(68,52,(t-4.2)/3.8):t<14?84:t<19.9?50:t<27?64:44;L.push({x:mx,y:my-22,r:R});
  if(t<1.4)L.push({x:79*16+10,y:2930,r:62,a:.85*(1-t/1.4)});
  if(t>=10.4&&t<19.4)L.push({x:CEN_X+8,y:2905,r:58,a:.9,tint:'rgba(60,255,150,.16)'});
  if(t>=17.3&&t<19.95)L.push({x:CEN_X+16,y:FLOOR-48,r:92*Math.min(1,(t-17.3)/1.5),tint:'rgba(60,255,150,.18)'});
  if(t>=22.55&&t<27.1)L.push({x:mx+4,y:my-44,r:105,a:.9*Math.min(1,(t-22.55)/.5),tint:'rgba(60,255,150,.14)'});
  if(t>=28.6){const f=t<29.2&&hs(Math.floor(t*30),5)>.5?.3:1;L.push({x:CEN_X,y:sy-38,r:118,a:f,tint:'rgba(60,255,150,.18)'})}
  return L}
function bcCompose(g,c,B,t,tm){
  const p=g.player,cam=bcCam(B,p),[mx,my]=bcMika(B,p),sh=B.sh;cam.z*=1+.05*sh;cam.rot+=Math.sin(tm*.9)*.005;
  const hk=Math.min(1,2.6/cam.z),shx=(hs(Math.floor(tm*40),1)-.5)*14*sh+(Math.sin(tm*1.3)+Math.sin(tm*2.9)*.5)*.45*hk,shy=(hs(Math.floor(tm*40),2)-.5)*10*sh+(Math.sin(tm*1.1+1)+Math.sin(tm*3.3)*.5)*.4*hk;
  const wc=bcWorld(g,c,cam.fx,cam.fy);
  c.fillStyle='#04020a';c.fillRect(0,0,640,360);c.save();c.imageSmoothingEnabled=false;
  c.translate(320+shx,180+shy);c.rotate(cam.rot);c.scale(cam.z,cam.z);c.translate(-cam.fx,-cam.fy);
  c.drawImage(wc,Math.floor(cam.fx)-320,Math.floor(cam.fy)-180);
  c.fillStyle='rgba(62,22,118,.2)';c.fillRect(cam.fx-700,cam.fy-500,1400,1000);
  const fig=B.fig;
  const Pm=()=>{let P={r:Math.sin(t*1.3)*.012,h:Math.sin(t*.9)*.03,l:0,b:Math.sin(t*1.6)*.25};
    if(t>=10.4&&t<14){P.h=-.04+Math.sin(t*2)*.02;P.r=Math.sin(t*.8)*.015}
    if(t>=14.0&&t<15.9){const u=ease((t-14.0)/.35),d=Math.max(0,1-(t-14.35)/1.2);P.r=-.3*Math.min(u,1)*d-.04;P.h=.18*d;P.l=.1*d;P.b=-Math.sin(Math.min(1,(t-14.0)/.9)*Math.PI)*5}
    if(t>=20&&t<22)P.h=.1+Math.sin(t*3)*.03;if(t>=22.6&&t<27){P.h=t>26.1?.12:-.03;P.r=.02}
    return P};
  if(t>=17.3&&t<19.95){const pr=Math.min(1,(t-17.3)/2.1),gl=t>19.3?(t-19.3)*1.4:0;
    drawSpiritThreads(c,CEN_X+16,FLOOR-2,.55,pr,t);
    if(pr>.72)drawSpirit(c,CEN_X+16,FLOOR-2,.55,t,{a:(pr-.72)/.28*.92,gl:.06+gl,ghost:t>19.3?3:0,lean:.02});
    if(t>19.3&&t<19.95&&hs(Math.floor(t*30),9)>.35)drawSpirit(c,CEN_X+16+(hs(Math.floor(t*30),1)-.5)*50,FLOOR-2,.55,t,{a:.6,gl:1,ghost:4})}
  if(t>=10.4&&t<17.9){const n=Math.min(9,1+Math.max(0,Math.floor((t-10.9)/.5))),wv=t<13.2?0:Math.min(1,(t-13.2)/1.3),al=t>17.2?Math.max(0,1-(t-17.2)/.7):1;
    braid(c,B,t,n,wv*(t>14?1.25:1),al,CEN_X+(t<14.3?2:2+(Math.min(1,(t-14.3)/1.2))*14),FLOOR-2-33)}
  if(t>=22.55&&t<27.1){const u=Math.min(1,(t-22.55)/.5),gl=.05+(t<23.0?.7:0)+(hs(Math.floor(t*9),6)>.9?.6:0);
    drawSpirit(c,mx+4,my+6,.62,t,{a:.92*u,gl,ghost:1,lean:-.02,dir:-1,f:t*2.4})}
  if(fig){const P=Pm();c.save();const sg=c.createRadialGradient(mx,my-24,2,mx,my-24,40);sg.addColorStop(0,'rgba(180,110,255,.18)');sg.addColorStop(1,'rgba(180,110,255,0)');c.fillStyle=sg;c.fillRect(mx-45,my-70,90,90);c.restore();drawMikaFig(c,mx,my,P,true,1,KF)}
  let hsy=FLOOR-44;
  if(t>=28.6){const u=Math.min(1,(t-28.6)/.25),tens=t>31.3?Math.min(1,(t-31.3)/1.2):0,snap=Math.max(0,(t-32.5)/.45),pend=Math.sin(t*1.1)*.045*(1-snap)+(hs(Math.floor(tm*22),7)-.5)*tens*.05;
    hsy=FLOOR-44+Math.sin(t*1.3)*2+snap*snap*16;
    c.save();c.translate(CEN_X,CEIL);c.rotate(pend);c.translate(-CEN_X,-CEIL);purpleStrings(c,CEN_X,hsy,.56,0,t,tens,u,snap);
    drawSpirit(c,CEN_X,hsy,.56,t,{a:u,gl:.04+tens*.45+(hs(Math.floor(tm*10),8)>.92?.5:0),ghost:tens>.3?2:0,dir:1,f:t*2.5});c.restore()}
  c.restore();
  bcDark(c,cam,shx,shy,bcLights(t,mx,my,hsy),tm,.95);
  if(B.flash>0){c.fillStyle='rgba(120,255,180,'+Math.min(.55,B.flash*.8)+')';c.fillRect(0,0,640,360)}
  if(t>=4.2&&t<4.35){c.fillStyle='rgba(235,255,245,.7)';c.fillRect(0,0,640,360)}
  return cam}
function bcFrame(g,c,B,t,tm){const cam=bcCompose(g,c,B,t,tm);
  const dz=Math.abs(cam.z-(B.pz==null?cam.z:B.pz));B.pz=cam.z;rblur(c,Math.min(1,dz*22));
  bcText(g,c,B,t);bcTrans(c,t,tm);for(const W of WIN)fileWin(c,W,t,tm);
  const bh=t<BT_END?34*ease(t/.8):34;
  if(bh>.5){c.fillStyle='#000';c.fillRect(0,0,640,bh);c.fillRect(0,360-bh,640,bh)}
  const bl=Math.floor(tm*1.6)%2===0,sec=Math.floor(t),fr=Math.floor((t-sec)*24);if(bh>1){if(bl){c.fillStyle='#ff3b5c';c.beginPath();c.arc(22,bh-12,3.2,0,TAU);c.fill()}ptext(c,'REC',30,bh-8,'bold 10px '+MONO,'#e8dfcc');ptext(c,'00:00:'+String(sec).padStart(2,'0')+':'+String(fr).padStart(2,'0'),640-84,bh-8,'10px '+MONO,'#9dffc8')}
  warp(c,Math.max(0,bcGl(B)-.28)*.9,tm);c.drawImage(scan,0,0)}
function bcText(g,c,B,t){c.save();c.translate(0,-30);bcText2(g,c,B,t);c.restore()}
function bcText2(g,c,B,t){
  const big=BTX[0];
  for(const L of BTX){if(t<L.t0||t>L.t1)continue;const n=Math.floor((t-L.t0)*(L.big?9:16)),a=Math.min(1,(L.t1-t)*3,(t-L.t0)*5);if(a<=0)continue;
    c.save();c.globalAlpha=a;
    if(L.w==='s'){const amt=.5+.5*(hs(Math.floor(t*14),4)>.6?1:0)+(L.big?.1:0);
      if(L.big){const f=Math.min(L.s.length,n),txt=L.s.slice(0,f);const gg=c.createLinearGradient(0,150,0,230);if(f>0)gtext(c,txt+' ',320,196+Math.sin(t*3)*2,74,t,Math.min(1,amt),'italic bold')}
      else if(L.two){const k=L.two[0].length,l1=L.two[0].slice(0,Math.min(k,n)),l2=n>k+1?L.two[1].slice(0,n-k-1):'';if(l1)gtext(c,l1,320,142,30,t,amt*.8,'italic');if(l2)gtext(c,l2,320,174,30,t,amt*.8,'italic')}
      else{gradBand(c);gtext(c,L.s.slice(0,n),320,318,32,t,amt*.8,'italic')}}
    else{gradBand(c);const txt=L.s.slice(0,n);c.font='italic 30px Georgia';c.textAlign='center';const gl=hs(Math.floor(t*20),7)>.9?(hs(Math.floor(t*20),8)-.5)*8:0;c.fillStyle='rgba(210,122,138,.55)';c.fillText(txt,320+gl+2,326);c.fillStyle='#f4e8f8';c.fillText(txt,320+gl,324);
      if(n<L.s.length+5&&Math.floor(t*3)%2){const w=c.measureText(txt).width;c.fillStyle='#f4e8f8';c.fillRect(320+w/2+4,304,3,24)}}
    c.restore()}}
function gradBand(c){const g1=c.createLinearGradient(0,255,0,360);g1.addColorStop(0,'rgba(4,2,8,0)');g1.addColorStop(1,'rgba(4,2,8,.9)');c.fillStyle=g1;c.fillRect(0,225,640,135)}
function drawBC(g,c){const B=g._bc,t=B.t,tm=performance.now()/1000;c.imageSmoothingEnabled=false;
  if(t>=BT_END&&FRZ2===null||t>=BT_END){const r=t-BT_END;
    if(!FRZ2){const sv=B.t;B.t=BT_END-.001;bcFrame(g,c,B,B.t,tm);FRZ2=document.createElement('canvas');FRZ2.width=640;FRZ2.height=360;FRZ2.getContext('2d').drawImage(c.canvas,0,0);B.t=sv}
    // fundo: mundo real com o espírito livre
    g.camera.x=Math.max(0,Math.min(220*16-640,g.player.x-320));g.camera.y=Math.max(0,Math.min(192*16-360,g.player.y-200));
    const w=g.state;g.state='playing';try{G._oDraw.call(g)}finally{g.state=w}
    c.fillStyle='rgba(60,20,110,'+Math.max(0,.35-r*.2)+')';c.fillRect(0,0,640,360);
    const N=20,cx=320,cy=186,al=Math.max(0,1-ease((r-.5)/1.3)),dd=ease((r-.22)/.9),pr=Math.min(1,r/.35),ang=[];for(let k=0;k<N;k++)ang.push(k/N*TAU+(hs(k,17)-.5)*.3);
    if(al>0){for(let k=0;k<N;k++){const a0=ang[k],a1=k===N-1?ang[0]+TAU:ang[k+1],am=(a0+a1)/2,d=dd*(24+hs(k,12)*100),rt=(hs(k,13)-.5)*.3*dd;c.save();c.globalAlpha=al;c.translate(cx+Math.cos(am)*d,cy+Math.sin(am)*d);c.rotate(rt);c.translate(-cx,-cy);c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+1100*Math.cos(a0),cy+1100*Math.sin(a0));c.lineTo(cx+1100*Math.cos(a1),cy+1100*Math.sin(a1));c.closePath();c.clip();c.drawImage(FRZ2,0,0);c.restore()}
      c.save();c.globalAlpha=al;c.lineCap='round';c.lineJoin='round';
      for(let k=0;k<N;k++){const a=ang[k],L=720*pr,pts=[];for(let d=0;d<=L;d+=26){const off=(hs(k*31+Math.floor(d/26),15)-.5)*18;pts.push([cx+Math.cos(a)*d-Math.sin(a)*off,cy+Math.sin(a)*d+Math.cos(a)*off])}
        for(const [col,wd] of [['#031a0f',4.2],['#e6fff0',1.7],['#3fe58a',.8]]){c.strokeStyle=col;c.lineWidth=wd;c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}}
      c.restore()}
    if(r<.3){c.fillStyle='rgba(225,255,238,'+(1-r/.3)*.8+')';c.fillRect(0,0,640,360)}
    if(r>2.0){c.fillStyle='rgba(90,255,170,'+Math.max(0,(r-2.0)*.5)*(r>2.2?1:1)+')';c.globalAlpha=Math.min(.6,(r-2.0)*1.5);c.fillRect(0,0,640,360);c.globalAlpha=1}
    {const bh=34*(1-ease((r-1.4)/.8));if(bh>.5){c.fillStyle='#000';c.fillRect(0,0,640,bh);c.fillRect(0,360-bh,640,bh)}}
    c.drawImage(scan,0,0);glitch(c,bcGl(B),tm);return}
  bcFrame(g,c,B,t,tm);glitch(c,bcGl(B),tm);
  if(t<.5){c.fillStyle='rgba(0,0,0,'+0+')';c.fillRect(0,0,640,360)}}
// ---- integração ----
const oU3=G.update;
G.update=function(dt){
  if(this.state==='bcine'&&this._bc){bcUpdate(this,dt);return}
  const p=this.player,b=this.enemies&&this.enemies.find(e=>e._sb);
  if(p&&b&&this.state==='playing'&&!this.dialog&&b.hidden&&!b._introDone&&!p.hasStitch&&p.x/16>=83.3&&p.x/16<110&&p.y/16>172&&p.onGround){bcStart(this,b);return}
  oU3.call(this,dt);
  if(b&&!b.alive&&this.grid&&this.grid[183][79]===1&&b._introDone&&this.state==='playing'){for(let y=182;y<=184;y++)this.grid[y][79]=0;bcShards(this,79*16+8,183*16,14,1.4)}};
const oD3=G.draw;
G.draw=function(){if(this.state==='bcine'&&this._bc){drawBC(this,this.ctx);return}oD3.call(this)};
window.__bcDbg={drawSpirit,drawSpiritThreads};window.__bcStart=function(){const g=window.__G||window.__game,b=g.enemies.find(e=>e._sb);bcStart(g,b)};

// =====================================================================
// MINI BOSS: fase 2 (cutscene de alertas + monitor + "Deletar"), luz roxa, glitches
// =====================================================================
const REDP={fill:'#ffd6dc',sh:'#3a0610',edge:'#ff2a45',out:'#12020a'};
const B2MSG=[['ALERTA','processo hostil detectado'],['ERRO 0x0DEL','espirito.exe nao responde'],['AVISO','fluxo interrompido'],['ARQUIVO CORROMPIDO','memoria.tmp'],['ALERTA','deletar: pendente'],['ERRO','voce nao deveria estar aqui'],['AVISO','sala_do_espirito.rem'],['FALHA CRITICA','setor 0x4F2A'],['ALERTA','presa.rem sem saida'],['ERRO','mika.exe sem resposta']];
const B2W=(()=>{const a=[];for(let i=0;i<18;i++){const m=B2MSG[i%B2MSG.length],w=150+Math.floor(hs(i,1)*70),h=46+Math.floor(hs(i,2)*18),fr=i>=10;a.push({t0:fr?3.3+(i-10)*.25:.6+i*.15,x:Math.floor(hs(i,3)*(640-w)),y:Math.floor(34+hs(i,4)*(292-h)),w,h,m,amb:hs(i,5)>.55,fr})}return a})();
const B2F=['mika.exe','kaim.bak','kami.bak','casa.rem','fio_01.rem','voce.txt','espirito.exe','memoria.tmp','porta.rem','quarto.rem','vhs.rec','jardim.rem','eco.wav','nome.???','livre.rem'];
function b2Start(g,b){g.state='bcine2';g.player.facing=(b.x+b.w/2>g.player.x+14)?1:-1;g.drawHUD=function(){};g.drawInteractHints=function(){};g.drawToast=function(){};g.messageTimer=0;g.message=null;const p=g.player;p.vx=0;p.vy=0;g._b2={t:0,b,sh:0,red:false}}
function b2End(g){const B=g._b2,b=B.b,p=g.player;delete g.drawHUD;delete g.drawInteractHints;delete g.drawToast;b._ph=2;b.hp=b.maxHp=520;b._p2=false;b.bs='idle';b.bt=500;b.vx=0;b.vy=0;b.hitDone=false;b.chain=0;g.state='playing';g._b2=null;p.invuln=Math.max(p.invuln||0,900);g._flashR=.9}
function b2Update(g,dt){const B=g._b2,s=Math.min(.05,dt>1?dt/1000:dt);B.t+=s;if(g.input.wasPressed('Escape')&&B.t<7.6)B.t=7.6;B.sh*=Math.exp(-s*2.5);
  if(B.t>=8.3&&!B.red){B.red=true;B.b._ph=2;B.sh=1.8}
  if(B.t>=9.3)b2End(g)}
function alertBox(c,x,y,w,h,m,amb,u){c.save();const k=Math.min(1,u*5),cx=x+w/2,cy=y+h/2;c.translate(cx,cy);c.scale(.6+.4*k,.6+.4*k);c.translate(-cx,-cy);c.globalAlpha=Math.min(1,u*8);
  const col=amb?'#d9a03a':'#c8344f';c.fillStyle='#12060a';c.fillRect(x,y,w,h);c.fillStyle=col;c.fillRect(x,y,w,14);ptext(c,m[0],x+18,y+11,'bold 10px '+MONO,'#1a0408');
  c.fillStyle='#1a0408';c.beginPath();c.moveTo(x+8,y+3);c.lineTo(x+13,y+11);c.lineTo(x+3,y+11);c.closePath();c.fill();c.strokeStyle=col;c.strokeRect(x+.5,y+.5,w-1,h-1);
  ptext(c,m[1],x+8,y+31,'10px '+MONO,'#ffd6dc');c.fillStyle='#3a1218';c.fillRect(x+w-46,y+h-18,38,12);ptext(c,'OK',x+w-36,y+h-9,'bold 9px '+MONO,'#ffb0c0');c.restore()}
const M2X=100,M2Y=22,M2W=440,M2H=316,S2X=M2X+34,S2Y=M2Y+30,S2W=M2W-68,S2H=M2H-92;
function iconPos(i){const cw=S2W/5,ch=(S2H-18)/3;return[S2X+(i%5)*cw+cw/2,S2Y+16+Math.floor(i/5)*ch+ch*.4]}
const TGI=6,ICN=iconPos(TGI),MNU={x:ICN[0]+14,y:ICN[1]+8},DLP=[MNU.x+22,MNU.y+3+13*3+7];
const CKP=[[3.4,S2X+20,S2Y+24],[3.95,S2X+250,S2Y+60],[4.4,S2X+70,S2Y+170],[4.75,ICN[0]+6,ICN[1]+4],[5.0,ICN[0]+6,ICN[1]+4],[5.2,MNU.x+30,MNU.y+20],[5.35,MNU.x+34,MNU.y+22],[5.65,DLP[0],DLP[1]],[6.0,DLP[0],DLP[1]]];
function cursorAt(t){let a=CKP[0];if(t<=CKP[0][0])return[a[1],a[2]];for(let i=1;i<CKP.length;i++){const b=CKP[i];if(t<=b[0]){const u=ease((t-a[0])/(b[0]-a[0]));return[lin(a[1],b[1],u),lin(a[2],b[2],u)]}a=b}return[a[1],a[2]]}
function drawMonitor(c,B,t,tm){const u=Math.min(1,(t-2.6)/.8);if(u<=0)return;const e=ease(u),sc=lin(.15,1,e);
  c.save();c.translate(320,180);c.scale(sc,sc*(u<1?1+(hs(Math.floor(tm*30),1)-.5)*.12:1));c.translate(-320,-180);
  c.fillStyle='#0a0610';c.fillRect(M2X-4,M2Y-4,M2W+8,M2H+8);c.fillStyle='#2a2233';c.fillRect(M2X,M2Y,M2W,M2H);c.fillStyle='#4a3f5c';c.fillRect(M2X,M2Y,M2W,3);c.fillRect(M2X,M2Y,3,M2H);c.fillStyle='#171220';c.fillRect(M2X+M2W-3,M2Y,3,M2H);c.fillRect(M2X,M2Y+M2H-3,M2W,3);
  c.fillStyle='#120c1a';c.fillRect(S2X-8,S2Y-8,S2W+16,S2H+16);c.fillStyle='#0b1f1c';c.fillRect(S2X,S2Y,S2W,S2H);
  ptext(c,'LUMEN',M2X+M2W/2-14,M2Y+M2H-14,'bold 10px '+MONO,'#8a7aa8');c.fillStyle=Math.floor(tm*2)%2?'#43e58f':'#1c6a40';c.fillRect(M2X+M2W-30,M2Y+M2H-20,6,6);
  c.save();c.beginPath();c.rect(S2X,S2Y,S2W,S2H);c.clip();const tt=t-3.4;
  if(tt>0){c.fillStyle='#1c4a44';c.fillRect(S2X,S2Y,S2W,12);ptext(c,'C:\\FLUXO\\VEU\\',S2X+4,S2Y+10,'bold 10px '+MONO,'#d8efe6');
    const n=Math.min(B2F.length,Math.floor(tt*9)+1),delt=t>5.65;
    for(let i=0;i<n;i++){const [ix,iy]=iconPos(i),fl=i===n-1&&n<B2F.length,rd=delt||(t>4.75&&i===TGI),jit=(delt&&hs(i,Math.floor(tm*20))>.5)?(hs(i,3)-.5)*8:0;
      c.fillStyle=rd?'#c8344f':fl?'#ffffff':'#d8efe6';c.fillRect(ix-10+jit,iy-14,20,26);c.fillStyle='#0b1f1c';c.fillRect(ix+3+jit,iy-14,7,7);c.fillStyle=rd?'#7a1428':'#7fb8a8';c.fillRect(ix-6+jit,iy-4,12,2);c.fillRect(ix-6+jit,iy+1,12,2);c.fillRect(ix-6+jit,iy+6,8,2);
      if(i===TGI&&t>4.75)selBar(c,ix+jit-B2F[i].length*2.7-4,iy+14,B2F[i].length*5.4+8,11,.9);
      {const nm=B2F[i],dot=nm.lastIndexOf('.'),ex=dot>0&&/\.exe$/.test(nm);if(ex&&!rd){const w=nm.length*5.4;ptext(c,nm.slice(0,dot),ix+jit-w/2,iy+23,'9px '+MONO,'#9dffc8');ptext(c,nm.slice(dot),ix+jit-w/2+dot*5.4,iy+23,'bold 9px '+MONO,TYL)}else ptext(c,nm,ix+jit,iy+23,'9px '+MONO,rd?'#ff9aae':'#9dffc8','c')}}
    termFoot(c,S2X,S2Y+S2H-11,S2W,[['F1','Ajuda'],['F3','Abrir'],['DEL','Apagar']]);
    if(t>=4.9){const mx=MNU.x,my=MNU.y;c.fillStyle='#e8e2d4';c.fillRect(mx,my,80,56);c.strokeStyle='#0b1f1c';c.strokeRect(mx+.5,my+.5,79,55);
      ['Abrir','Copiar','Renomear','Deletar'].forEach((s,i)=>{const hv=(i===3&&t>5.55);if(hv){c.fillStyle=t>5.7?'#c8344f':'#6a5a8a';c.fillRect(mx+2,my+3+i*13,76,12)}ptext(c,s.slice(0,1),mx+8,my+13+i*13,'bold 10px '+MONO,hv?TYL:'#b07a00');ptext(c,s.slice(1),mx+14,my+13+i*13,'10px '+MONO,hv?'#fff':'#1a1420')})}
    const cu=cursorAt(t);const cx=cu[0]+(hs(Math.floor(tm*30),4)-.5)*(t<5.4?1.2:.3),cy=cu[1]+(hs(Math.floor(tm*30),5)-.5)*(t<5.4?1.2:.3);
    if(t>5.7&&t<5.95){c.strokeStyle='rgba(255,90,120,'+(1-(t-5.7)/.25)+')';c.lineWidth=2;c.beginPath();c.arc(cx,cy,4+(t-5.7)*70,0,TAU);c.stroke()}
    c.save();c.translate(cx,cy);c.scale(1.3,1.3);c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=1.2;c.beginPath();[[0,0],[0,13],[3.5,10],[6,15],[8,14],[5.5,9],[10,9]].forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();c.stroke();c.restore()}
  for(let y=0;y<S2H;y+=2){c.fillStyle='rgba(0,0,0,.18)';c.fillRect(S2X,S2Y+y,S2W,1)}c.restore();c.restore()}
function b2Gl(t){const sp=(r,th)=>hs(Math.floor(t*r),3)>th?1:0;if(t<.5)return 1-t*.8;if(t<2.6)return .25+sp(9,.7)*.35;if(t<3.4)return .65;if(t<5.9)return .2+sp(8,.75)*.4;if(t<6.6)return 1;if(t<8.3)return .4+sp(10,.6)*.5;return Math.max(.2,1-(t-8.3)*.6)}
function b2Draw(g,c){const B=g._b2,t=B.t,tm=performance.now()/1000;c.imageSmoothingEnabled=false;
  const sh=B.sh+(t<.6?1.2*(1-t/.6):0)+(t>=.6&&t<3?.12+t*.06:0)+(t>=6&&t<8.3?.35:0)+(t>=8.3?1.4:0),shx=(hs(Math.floor(tm*45),1)-.5)*16*sh,shy=(hs(Math.floor(tm*45),2)-.5)*12*sh;
  let wc=b2Draw.wc;if(!wc){wc=b2Draw.wc=document.createElement('canvas');wc.width=640;wc.height=360}
  const w0=g.state;g.state='playing';try{G._oDraw.call(g)}finally{g.state=w0}
  wc.getContext('2d').clearRect(0,0,640,360);wc.getContext('2d').drawImage(c.canvas,0,0);
  c.fillStyle='#04020a';c.fillRect(0,0,640,360);c.save();c.translate(320+shx,180+shy);c.rotate(Math.sin(tm*40)*.008*sh);c.scale(1+(t<.4?.08*(1-t/.4):0)+(t>=8.3?.04:0),1+(t<.4?.08*(1-t/.4):0)+(t>=8.3?.04:0));c.translate(-320,-180);c.drawImage(wc,0,0);c.restore();
  if(t>=6.3){c.fillStyle='rgba(120,8,30,'+(.3+.1*Math.sin(tm*20))+')';c.fillRect(0,0,640,360)}else if(t>=.6){c.fillStyle='rgba(10,0,22,'+Math.min(.55,(t-.6)*.5)+')';c.fillRect(0,0,640,360)}
  if(t>=.6&&t<6.0){const fade=t>5.8?Math.max(0,(6.0-t)*5):1;for(const W of B2W){if(W.fr||t<W.t0)continue;c.save();c.globalAlpha=fade;alertBox(c,W.x,W.y,W.w,W.h,W.m,W.amb,t-W.t0);c.restore()}}
  if(t<6.0)drawMonitor(c,B,t,tm);
  if(t>=3.3&&t<6.0){const fade=t>5.8?Math.max(0,(6.0-t)*5):1;for(const W of B2W){if(!W.fr||t<W.t0)continue;c.save();c.globalAlpha=fade;alertBox(c,W.x,W.y,W.w,W.h,W.m,W.amb,t-W.t0);c.restore()}}
  if(t>=6.45&&t<8.3){const a=Math.min(1,(t-6.45)*6,(8.3-t)*5),amt=.55+.45*(hs(Math.floor(tm*16),4)>.6?1:0);c.save();c.globalAlpha=a;gtext(c,'É ISSO O QUE',320,150+Math.sin(tm*30)*1.5,46,tm,amt,'italic bold',REDP);gtext(c,'VOCÊ SEMPRE FEZ!',320,212,46,tm,amt,'italic bold',REDP);c.restore()}
  if(t<.12){c.fillStyle='rgba(255,240,240,'+(1-t/.12)+')';c.fillRect(0,0,640,360)}
  if(t>=5.95&&t<6.45){const k=(t-5.95)/.5;c.fillStyle='rgba(255,235,235,'+(k<.25?k*4:Math.max(0,1-(k-.25)*1.4))*.9+')';c.fillRect(0,0,640,360)}
  if(t>=8.3&&t<8.6){c.fillStyle='rgba(255,40,70,'+(1-(t-8.3)/.3)*.7+')';c.fillRect(0,0,640,360)}
  warp(c,Math.max(0,b2Gl(t)-.3)*.8,tm);c.drawImage(scan,0,0);glitch(c,b2Gl(t),tm)}
// ---- ambiente da luta: luz roxa, glitches e alertas ----
const MSG2=['ALERTA: processo hostil','AVISO: arquivo ausente','ERRO 0x0DEL','deletando...','fluxo instavel','falha: setor 4F2A','AVISO: presa.rem','ALERTA: nao resista'];
function fightBoss(g){if(g.state!=='playing'||!g.enemies)return null;const b=g.enemies.find(e=>e._sb);return b&&!b.hidden&&b.alive&&b._introDone?b:null}
const oDW=G.drawWorld;
G.drawWorld=function(ctx){const b=fightBoss(this);window.FOVLV.bossroom=b?0:4;oDW.call(this,ctx);if(this._grime&&this._grimeK)bfGrime(ctx,this.camera,this._grime,this._grimeK,performance.now()/1000);if(!b){this._fa=0;return}
  const cam=this.camera,t=performance.now()/1000,P=b._ph===2,fa=(this._fa=Math.min(1,(this._fa||0)+.025)),fl=1+.12*Math.sin(t*(P?13:5))+(hs(Math.floor(t*(P?20:8)),3)>.9?.25:0);
  ctx.save();ctx.beginPath();ctx.rect(79*16-cam.x,172*16-cam.y,34*16,14*16);ctx.clip();ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=(P?'rgba(120,20,60,':'rgba(76,30,140,')+(.2*fa*fl)+')';ctx.fillRect(79*16-cam.x,172*16-cam.y,34*16,14*16);
  for(const lx of [86,95,104]){const x=lx*16-cam.x,y=174*16-cam.y,g=ctx.createRadialGradient(x,y,6,x,y,170);g.addColorStop(0,(P?'rgba(255,60,110,':'rgba(170,90,255,')+(.34*fa*fl)+')');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-170,y-170,340,340)}
  ctx.restore()};
function cornerAlerts(c,tm){for(let i=0;i<3;i++){const idx=(Math.floor(tm*1.1)+i*3)%MSG2.length,ph=(tm*1.1)%1;if(hs(Math.floor(tm*14),i+20)<.12)continue;if(ph<.1&&hs(Math.floor(tm*30),i)>.5)continue;
  const x=482,y=12+i*30,w=150,h=26,amb=(idx+i)%2===0,col=amb?'#d9a03a':'#c8344f';c.save();c.globalAlpha=.68;c.fillStyle='#12060a';c.fillRect(x,y,w,h);c.fillStyle=col;c.fillRect(x,y,w,5);c.strokeStyle=col;c.strokeRect(x+.5,y+.5,w-1,h-1);ptext(c,MSG2[idx],x+6,y+19,'9px '+MONO,'#ffd6dc');c.restore()}}
const oU4=G.update;
G.update=function(dt){
  if(this.state==='bcine2'&&this._b2){b2Update(this,dt);return}
  const b=this.enemies&&this.enemies.find(e=>e._sb);
  if(b&&b._p2&&b._ph!==2&&this.state==='playing'&&!this.dialog&&b.alive){b2Start(this,b);return}
  oU4.call(this,dt)};
const oD4=G.draw;
G.draw=function(){if(this.state==='bcine2'&&this._b2){b2Draw(this,this.ctx);return}
  oD4.call(this);const fb=fightBoss(this);if(fb){const tm=performance.now()/1000,P=fb._ph===2,sl=Math.floor(tm*(P?7:3));let a=0;if(hs(sl,11)>(P?.5:.82))a=P?.22+.4*hs(sl,12):.08+.1*hs(sl,12);if(a>0)glitch(this.ctx,a,tm);if(P)cornerAlerts(this.ctx,tm)}};


// ================= p33: CENA FINAL DO BOSS =================
const BF_SX=CEN_X+88,BF_MX0=CEN_X-70,BF_CH=67.0,BF_M3=65.6;
let SPRD=null,UPN=null;
function bfRed(){if(SPRD)return SPRD;if(!SPG&&!(SPG=mkSPG()))return null;
  SPRD=SPG.map(im=>{const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const q=cv.getContext('2d');q.drawImage(im,0,0);const d=q.getImageData(0,0,cv.width,cv.height),s=d.data,ramp=[[18,2,6],[70,8,20],[150,22,44],[236,64,92],[255,206,214]];
    for(let i=0;i<s.length;i+=4){if(!s[i+3])continue;const l=Math.min(1,s[i+1]/226),k=l*4,a=Math.min(3,Math.floor(k)),u=k-a,A=ramp[a],B=ramp[a+1];s[i]=A[0]+(B[0]-A[0])*u;s[i+1]=A[1]+(B[1]-A[1])*u;s[i+2]=A[2]+(B[2]-A[2])*u}
    q.putImageData(d,0,0);return cv});return SPRD}
// fatia de sprite: origem = base-centro da fatia
function bfSlab(c,ims,y0,y1,s,sy,t,gl){const fz=Math.floor(t*17);
  for(const [im,al] of ims){if(al<=.01)continue;c.save();c.globalAlpha*=al;const iw=im.width;
    for(let r=y0;r<y1;r+=2){const hh=Math.min(2,y1-r),k=1-r/im.height,dx=Math.sin(r*.05+t*2.4)*(.4+k*1.2)+(gl>.02&&hs(r*.37,fz)>1-.16*gl?(hs(r,fz+4)-.5)*gl*50:0);
      c.drawImage(im,0,r,iw,hh,(-iw/2+dx)*s,-(y1-r)*s*sy,iw*s,hh*s*sy+.6)}c.restore()}}
// espírito ajoelhado. (x,y)=chão. o:{red,a,dir,bow,head,gl,dis}
function bfKneel(c,x,y,s,t,o){if(!SPG&&!(SPG=mkSPG()))return null;const R=bfRed(),n=SPG.length,fi=Math.floor(t*2.2)%n,G=SPG[fi],Rd=R[fi],h=G.height,MG=4,wy=Math.floor(h*.56),ny=Math.floor(h*.27),KQ=o.kq||.5,SQ=o.sq||1,red=o.red||0,al=o.a==null?1:o.a,dir=o.dir||-1,gl=o.gl||0,hd=o.head||0;
  const ims=[[G,1-red],[Rd,red]],low=(h-wy)*s*KQ,bw=(o.bow==null?.42:o.bow)+Math.sin(t*1.7)*.012,hb=lin(.38,-.34,hd)+Math.sin(t*1.3)*.015;
  const Lb=(wy-ny)*s*SQ,Hh=ny*s*SQ,aB=dir*bw,aH=aB+dir*hb,Px=x,Py=y-low+2*s;const GEO={head:[Px+Lb*Math.sin(aB)+Hh*.5*Math.sin(aH),Py-Lb*Math.cos(aB)-Hh*.5*Math.cos(aH)],hand:[x+dir*34*s/.45*.6,y-low*.9],top:[Px+Lb*Math.sin(aB)+Hh*Math.sin(aH),Py-Lb*Math.cos(aB)-Hh*Math.cos(aH)]};if(o.geom)return GEO;
  c.save();c.imageSmoothingEnabled=false;
  // poça de aura no chão
  const gc=red>.5?'255,70,100':'90,255,170';c.globalCompositeOperation='lighter';let gr=c.createRadialGradient(x,y-2,2,x,y-2,70*s/.45);gr.addColorStop(0,'rgba('+gc+','+.35*al+')');gr.addColorStop(1,'rgba('+gc+',0)');c.fillStyle=gr;c.save();c.translate(x,y-2);c.scale(1,.28);c.translate(-x,-(y-2));c.fillRect(x-80*s/.45,y-2-80*s/.45,160*s/.45,160*s/.45);c.restore();c.globalCompositeOperation='source-over';
  c.globalAlpha=al*(1-(o.dis||0)*.85);
  c.save();c.translate(x,y);bfSlab(c,ims,wy,h,s,KQ,t,gl);c.restore();
  c.save();c.translate(x,y-low+2*s);c.rotate(dir*bw);bfSlab(c,ims,ny,wy,s,SQ,t,gl);
  c.translate(0,-(wy-ny)*s*SQ);c.rotate(dir*hb);bfSlab(c,ims,0,ny,s,SQ,t,gl);
  // olhos (no referencial da cabeça)
  const ey=-(ny-(MG+.18*(h-2*MG)))*s*SQ,ec=red>.5?[255,150,170]:[180,255,212],ew=hd>.5?1:0;
  c.strokeStyle='rgb('+ec+')';c.lineWidth=Math.max(.5,.8*s);
  if(!ew){for(let k=0;k<3;k++){const xx=-8*s+k*8*s,yy=ey-6*s+(k%2)*1.6*s;c.beginPath();c.moveTo(xx-1.7*s,yy-1.7*s);c.lineTo(xx+1.7*s,yy+1.7*s);c.moveTo(xx+1.7*s,yy-1.7*s);c.lineTo(xx-1.7*s,yy+1.7*s);c.stroke()}}
  else{c.fillStyle='rgb('+ec+')';c.fillRect(-9*s,ey,6*s,1.7*s);c.fillRect(3*s,ey,6*s,1.7*s)}
  c.globalCompositeOperation='lighter';c.fillStyle='rgba('+ec+',.4)';c.fillRect(-11*s,ey-.8*s,10*s,3.4*s);c.fillRect(1*s,ey-.8*s,10*s,3.4*s);
  c.restore();
  // fios soltos no chão
  c.globalCompositeOperation='lighter';c.strokeStyle='rgba('+gc+',.5)';c.lineWidth=.5;for(let k=0;k<5;k++){const xx=x+(k-2)*10*s/.45+Math.sin(t+k)*2;c.beginPath();c.moveTo(xx,y-6);c.quadraticCurveTo(xx+dir*6,y-1,xx+dir*14+Math.sin(t*1.4+k)*3,y);c.stroke()}
  c.restore();
  return GEO}
// ---------- Mika: braço + tesoura ----------
let UPN2=null;function bfUPN(both){if(both&&UPN2)return UPN2;if(!both&&UPN)return UPN;if(!UP)UP=mkUP();if(!UP)return null;const cv=document.createElement('canvas');cv.width=UP.width;cv.height=UP.height;const q=cv.getContext('2d');q.drawImage(UP,0,0);q.clearRect(116,118,40,58);if(both){q.clearRect(36,118,34,58);UPN2=cv}else UPN=cv;return cv}
const BFS=[112,114],BFS2=[66,114],BFL1=38,BFL2=34;
function bfArm(a1,bend,S){S=S||BFS;const e=[S[0]+Math.sin(a1)*BFL1,S[1]+Math.cos(a1)*BFL1],a2=a1+bend,h=[e[0]+Math.sin(a2)*BFL2,e[1]+Math.cos(a2)*BFL2];return{s:S,e,h,a2}}
function bfScissors(c,x,y,ang,open,glow){c.save();c.translate(x,y);c.rotate(ang);
  if(glow){c.globalCompositeOperation='lighter';const g=c.createRadialGradient(18,0,2,18,0,34);g.addColorStop(0,'rgba(255,190,220,'+glow*.5+')');g.addColorStop(1,'rgba(255,190,220,0)');c.fillStyle=g;c.fillRect(-20,-40,80,80);c.globalCompositeOperation='source-over'}
  for(const sg of [-1,1]){c.save();c.rotate(sg*open*.5);
    c.fillStyle='#0c0812';c.beginPath();c.moveTo(-3,-3.4);c.lineTo(34,-.6);c.lineTo(34,.6);c.lineTo(-3,3.4);c.closePath();c.fill();
    c.fillStyle='#dfe8f0';c.beginPath();c.moveTo(-2,-2.2);c.lineTo(33,-.3);c.lineTo(33,.3);c.lineTo(-2,2.2);c.closePath();c.fill();c.fillStyle='#8aa0b4';c.fillRect(0,0,30,.9);
    c.strokeStyle='#0c0812';c.lineWidth=5.4;c.beginPath();c.arc(-13,0,5.2,0,TAU);c.stroke();c.strokeStyle='#D27A8A';c.lineWidth=3;c.beginPath();c.arc(-13,0,5.2,0,TAU);c.stroke();
    c.fillStyle='#0c0812';c.fillRect(-9,-1.6,7,3.2);c.restore()}
  c.fillStyle='#0c0812';c.beginPath();c.arc(0,0,2.6,0,TAU);c.fill();c.fillStyle='#e8c8a0';c.beginPath();c.arc(0,0,1.4,0,TAU);c.fill();c.restore()}
function bfDrawArm(c,A,hand){c.save();c.lineCap='round';c.lineJoin='round';
  const seg=(p,q,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke()};
  seg(A.s,A.e,14,'#0c0812');seg(A.e,A.h,12,'#0c0812');seg(A.s,A.e,10.5,'#2b2038');seg(A.e,A.h,9,'#2b2038');
  c.strokeStyle='#4a3a5c';c.lineWidth=2;c.beginPath();c.moveTo(A.s[0]-2,A.s[1]-1);c.lineTo(A.e[0]-2,A.e[1]-1);c.lineTo(A.h[0]-1,A.h[1]);c.stroke();
  const w1=[lin(A.e[0],A.h[0],.6),lin(A.e[1],A.h[1],.6)],w2=[lin(A.e[0],A.h[0],.82),lin(A.e[1],A.h[1],.82)];seg(w1,w2,12,'#0c0812');seg(w1,w2,9.6,'#D27A8A');
  const hx=A.h[0],hy=A.h[1];c.fillStyle='#0c0812';c.beginPath();c.arc(hx,hy,7.2,0,TAU);c.fill();c.fillStyle='#ead3d6';c.beginPath();c.arc(hx,hy,6,0,TAU);c.fill();c.fillStyle='#c9a4ae';c.beginPath();c.arc(hx+1.5,hy+2,3.4,0,TAU);c.fill();
  c.restore()}
// (x,y)=pés. o:{P,al,arm:[a1,bend]|null,sc:abertura|null,glow,k}; devolve ponto da mão em coords de mundo
function bfMika(c,x,y,o){if(!UP)UP=mkUP();if(!UP)return null;const k=o.k||KF,P=o.P||P0;c.save();c.globalAlpha=o.al==null?1:o.al;c.translate(x,y+2);c.scale(o.flip?-k:k,k);c.translate(-77,-232);
  const sv=UP;let A=null;if(o.arm){UP=bfUPN(!!o.arm2)}
  try{drawFig(c,P)}finally{UP=sv}
  if(o.arm){A=bfArm(o.arm[0],o.arm[1]);c.save();c.translate(RT[0]*2,RT[1]*2+P.b*2);c.rotate(P.r);c.translate(-RT[0]*2,-RT[1]*2);bfDrawArm(c,A);if(o.arm2){bfDrawArm(c,bfArm(o.arm2[0],o.arm2[1],BFS2))}if(o.sc!=null){let ang=Math.atan2(A.h[1]-A.e[1],A.h[0]-A.e[0]);if(o.tgt)ang=Math.atan2(232+(o.tgt[1]-(y+2))/k-A.h[1],77+(o.tgt[0]-x)/k*(o.flip?-1:1)-A.h[0]);bfScissors(c,A.h[0]+Math.cos(ang)*5,A.h[1]+Math.sin(ang)*5,ang,o.sc,o.glow||0)}c.restore()}
  c.restore();if(!A)return null;const sg=o.flip?-1:1;return {h:[x+sg*(A.h[0]-77)*k,y+2+(A.h[1]-232+P.b*2)*k],e:[x+sg*(A.e[0]-77)*k,y+2+(A.e[1]-232)*k],s:[x+sg*(A.s[0]-77)*k,y+2+(A.s[1]-232)*k],ang:Math.atan2(A.h[1]-A.e[1],A.h[0]-A.e[0]),A}}

// ---------- tesoura gótica grande (pixel-art) ----------
function bfRings(px,py,tilt,open){const out=[];for(const sg of [1,-1]){const th=sg*open/2,hx=-Math.sin(th),hy=Math.cos(th),R=21,x=hx*R,y=hy*R,ct=Math.cos(tilt),st=Math.sin(tilt);out.push([px+x*ct-y*st,py+x*st+y*ct])}return out} // [anel esq, anel dir]
function bfBig(c,px,py,tilt,open,glint,hands){const q=bfBig.q||(bfBig.q=document.createElement('canvas'));if(!q.width){q.width=150;q.height=150}const x=q.getContext('2d');x.clearRect(0,0,150,150);x.save();x.translate(75,75);x.rotate(tilt);x.lineJoin='round';x.lineCap='round';
  const hs2=[];
  for(const sg of [-1,1]){const th=sg*open/2,bx=Math.sin(th),by=-Math.cos(th),hx=-bx,hy=-by,px_=Math.cos(th),py_=Math.sin(th),inn=-sg;
    const T=[bx*50+inn*px_*.4,by*50+inn*py_*.4],I0=[inn*px_*1.3,inn*py_*1.3],O0=[-inn*px_*3.8,-inn*py_*3.8],O1=[bx*30-inn*px_*2.4,by*30-inn*py_*2.4];
    // lâmina
    x.beginPath();x.moveTo(I0[0],I0[1]);x.lineTo(T[0],T[1]);x.lineTo(O1[0],O1[1]);x.lineTo(O0[0],O0[1]);x.closePath();x.strokeStyle='#0c0812';x.lineWidth=2.6;x.stroke();x.fillStyle='#cdd8e2';x.fill();
    x.beginPath();x.moveTo(O0[0]*.45+I0[0]*.1,O0[1]*.45+I0[1]*.1);x.lineTo(bx*38,by*38);x.strokeStyle='#7d8fa4';x.lineWidth=1.2;x.stroke();   // friso
    x.beginPath();x.moveTo(I0[0],I0[1]);x.lineTo(T[0],T[1]);x.strokeStyle='#f4f8fc';x.lineWidth=.9;x.stroke();  // fio de corte
    // haste + anel
    const cx=hx*21,cy=hy*21;x.beginPath();x.moveTo(0,0);x.lineTo(cx,cy);x.strokeStyle='#0c0812';x.lineWidth=5;x.stroke();x.strokeStyle='#3a2c4c';x.lineWidth=3;x.stroke();
    x.beginPath();x.arc(cx+hx*5,cy+hy*5,7,0,TAU);x.strokeStyle='#0c0812';x.lineWidth=5.6;x.stroke();x.strokeStyle='#2b2038';x.lineWidth=3.4;x.stroke();x.strokeStyle='#c8a24a';x.lineWidth=.9;x.beginPath();x.arc(cx+hx*5,cy+hy*5,7,.3,TAU-.3);x.stroke();
    for(const a of [-1.1,0,1.1]){const ax=hx*Math.cos(a)-hy*Math.sin(a),ay=hx*Math.sin(a)+hy*Math.cos(a);x.fillStyle='#0c0812';x.beginPath();x.arc(cx+hx*5+ax*9.4,cy+hy*5+ay*9.4,2.5,0,TAU);x.fill();x.fillStyle='#c8a24a';x.beginPath();x.arc(cx+hx*5+ax*9.4,cy+hy*5+ay*9.4,1.4,0,TAU);x.fill()}
    x.fillStyle='#0c0812';x.beginPath();x.moveTo(cx+hx*13,cy+hy*13);x.lineTo(cx+hx*18+hy*2.4,cy+hy*18-hx*2.4);x.lineTo(cx+hx*23,cy+hy*23);x.lineTo(cx+hx*18-hy*2.4,cy+hy*18+hx*2.4);x.closePath();x.fill();x.fillStyle='#D27A8A';x.beginPath();x.arc(cx+hx*18,cy+hy*18,1.2,0,TAU);x.fill();
    hs2.push([cx+hx*5,cy+hy*5])}
  x.fillStyle='#0c0812';x.beginPath();x.arc(0,0,3.6,0,TAU);x.fill();x.fillStyle='#a8183a';x.beginPath();x.arc(0,0,2.5,0,TAU);x.fill();x.fillStyle='#ff9ab0';x.fillRect(-1,-1.6,1.4,1.4);
  if(hands){for(const h of hs2){x.fillStyle='#3a2430';x.beginPath();x.arc(h[0],h[1]+1.5,3,0,TAU);x.fill();x.fillStyle='#c9a4ae';x.beginPath();x.arc(h[0],h[1]+1.5,2,0,TAU);x.fill()}}
  if(glint>0){const gp=glint%1;x.globalCompositeOperation='source-atop';for(const sg of [-1,1]){const th=sg*open/2,bx=Math.sin(th),by=-Math.cos(th),d=8+gp*36;x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=2;x.beginPath();x.moveTo(bx*d,by*d);x.lineTo(bx*(d+6),by*(d+6));x.stroke()}}
  x.restore();
  const id=x.getImageData(0,0,150,150),d=id.data;for(let i=3;i<d.length;i+=4)d[i]=d[i]>110?255:0;x.putImageData(id,0,0);
  c.save();c.imageSmoothingEnabled=false;c.drawImage(q,Math.round(px-75),Math.round(py-75));c.restore()}
// ---------- Mika com faca (sprites do próprio jogo: mika_walk / mika_free) ----------
let KSP=null;
function bfKS(){if(KSP)return KSP;const SF=window.SPRS&&window.SPRS.mika_free,SW=window.SPRS&&window.SPRS.mika_walk;if(!SF||!SF.i.naturalWidth||!SW||!SW.i.naturalWidth)return null;
  const mk=(S,i,clipX)=>{const cv=document.createElement('canvas');cv.width=S.cw;cv.height=S.ch;const q=cv.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(S.i,i*S.cw,0,S.cw,S.ch,0,0,S.cw,S.ch);if(clipX)q.clearRect(clipX,0,S.cw-clipX,S.ch);return cv};
  KSP={F0:mk(SF,0,89),WK:[0,1,2,3].map(i=>mk(SW,i)),fw:SF.cw,fh:SF.ch,ww:SW.cw,wh:SW.ch};return KSP}
function pxKnife(q,hx,hy,ang,len){const ca=Math.cos(ang),sa=Math.sin(ang),nx=-sa,ny=ca;const P=(x,y,c)=>{q.fillStyle=c;q.fillRect(Math.round(x),Math.round(y),1,1)};
  for(let t=-8;t<=0;t+=.5)for(let o=-1;o<=1;o++){const e=Math.abs(o)===1;P(hx+ca*t+nx*o,hy+sa*t+ny*o,e?'#0c0812':(Math.floor(t)%3===0?'#D27A8A':'#3a2c4c'))}
  P(hx-ca*9,hy-sa*9,'#0c0812');P(hx-ca*10,hy-sa*10,'#0c0812');
  for(let o=-3;o<=3;o++)P(hx+ca*1+nx*o,hy+sa*1+ny*o,Math.abs(o)===3?'#0c0812':'#8a7aa8');
  for(let t=2;t<=len;t+=.5){const w=lin(2.2,.4,Math.pow(t/len,1.1));for(let o=-w-1;o<=w+1;o+=.5){const a=Math.abs(o);P(hx+ca*t+nx*o,hy+sa*t+ny*o,a>w+.4?'#0c0812':o<-w*.3?'#f4f8fc':o>w*.35?'#7d8fa4':'#cdd8e2')}}
  P(hx+ca*(len+1),hy+sa*(len+1),'#0c0812');P(hx+ca*(len*.7)-nx*1,hy+sa*(len*.7)-ny*1,'#ff9ab0')}
const BFWH=[[26,66],[45,71],[46,71],[44,72]];
// (x,y)=pés. o:{blend 0=andando 1=braço estendido,wf,ang,knife,dx,dy,rot,a}
function bfMikaK(c,x,y,o){const K=bfKS();if(!K)return;const H=66,sw=H/108,sf=H/82,al=o.a==null?1:o.a,bl=o.blend||0,tmp=bfMikaK.t||(bfMikaK.t=document.createElement('canvas')),tb=bfMikaK.b||(bfMikaK.b=document.createElement('canvas'));
  const part=(img,w,h,ax,ay,s,hand,ang,flip,hy0,hy1,alpha)=>{if(alpha<=.01)return;tmp.width=w;tmp.height=h;const q=tmp.getContext('2d');q.imageSmoothingEnabled=false;q.clearRect(0,0,w,h);q.drawImage(img,0,0);
    if(o.knife!==false)pxKnife(q,hand[0],hand[1],ang,o.klen||24);
    tb.width=w;tb.height=h;const r=tb.getContext('2d');r.clearRect(0,0,w,h);r.filter='blur(1.3px)';r.drawImage(img,0,hy0,w,hy1-hy0,0,hy0,w,hy1-hy0);r.filter='none';r.globalCompositeOperation='destination-in';const gg=r.createLinearGradient(0,hy0,0,hy1);gg.addColorStop(0,'#000');gg.addColorStop(.7,'#000');gg.addColorStop(1,'rgba(0,0,0,0)');r.fillStyle=gg;r.fillRect(0,hy0,w,hy1-hy0);
    c.save();c.globalAlpha=al*alpha;c.translate(Math.round(x+(o.dx||0)),Math.round(y+(o.dy||0)));c.rotate(o.rot||0);if(flip)c.scale(-1,1);c.imageSmoothingEnabled=false;c.drawImage(tmp,-ax*s,-ay*s,w*s,h*s);
    c.globalAlpha=al*alpha*.85;c.drawImage(tb,-ax*s,-ay*s,w*s,h*s);c.restore()};
  if(bl<.999)part(K.WK[(o.wf||0)%4],K.ww,K.wh,57,114,sw,[BFWH[(o.wf||0)%4][0],BFWH[(o.wf||0)%4][1]],Math.PI-.38,true,0,52,1-bl);
  if(bl>.001)part(K.F0,K.fw,K.fh,70,108,sf,[86,78],o.ang==null?.3:o.ang,false,22,66,bl)}
// ---------- silhuetas de fios (Kami / Kaim) ----------
let KMASK=null;
function bfMask(){if(KMASK)return KMASK;if(!UP)UP=mkUP();if(!UP)return null;const w=UP.width,h=UP.height,dd=UP.getContext('2d').getImageData(0,0,w,h).data,top=[],bot=[],runs=[];
  for(let x=0;x<w;x++){let a=-1,b2=-1;for(let y=0;y<h;y++)if(dd[(y*w+x)*4+3]>110){if(a<0)a=y;b2=y}top.push(a);bot.push(b2)}
  for(let x=0;x<w;x++){const R=[];let st=-1;for(let y=0;y<=h;y++){const on=y<h&&dd[(y*w+x)*4+3]>110;if(on&&st<0)st=y;if(!on&&st>=0){if(y-st>=2)R.push([st,y-1]);st=-1}}runs.push(R)}
  return KMASK={top,bot,w,h,runs}}
// x,y = pés; s = escala; kind 'kami'|'kaim'
function bfSil(c,x,y,s,prog,t,kind,flip){const M=bfMask();if(!M||prog<=0)return;const kaim=kind==='kaim',pal=kaim?['#ff3b5c','#ff8aa0','#a01832']:['#f2fff8','#c8ffe0','#8ae8b8'],w=M.w,h=M.h;c.save();c.lineCap='butt';
  for(let cx=0;cx<w;cx+=2){const tp=M.top[cx];if(tp<0)continue;const bt=M.bot[cx],pc=Math.max(0,Math.min(1,prog*1.6-hs(cx,kaim?7:9)*.6)),sw=Math.sin(t*2+cx*.2)*(1-pc)*3*s,fx=flip?w-1-cx:cx;
    const X=x+(fx-w/2)*s,yT=y+(tp-h)*s,yB=y+(bt-h)*s,yE=yT+(yB-yT)*pc,top=CEIL-24;
    if(cx%6===0){c.globalAlpha=(kaim?.5:.38)*Math.min(1,prog*3);c.strokeStyle=pal[0];c.lineWidth=.5;c.beginPath();c.moveTo(X+sw,top);c.lineTo(X,yT);c.stroke()}
    if(pc>0){c.globalAlpha=kaim?.9:.82;c.strokeStyle=hs(cx,2)>.55?pal[0]:hs(cx,3)>.5?pal[1]:pal[2];c.lineWidth=1.3*s;c.beginPath();for(const q of M.runs[cx]){const a0=y+(q[0]-h)*s,a1=Math.min(y+(q[1]-h)*s,yE);if(a1>a0){c.moveTo(X,a0);c.lineTo(X,a1)}}c.stroke()}}
  if(prog>.6){c.globalCompositeOperation='lighter';const gr=c.createRadialGradient(x,y-h*s*.5,4,x,y-h*s*.5,h*s*.8);gr.addColorStop(0,kaim?'rgba(255,40,80,.2)':'rgba(220,255,240,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=Math.min(1,(prog-.6)*3);c.fillStyle=gr;c.fillRect(x-h*s,y-h*s*1.4,h*s*2,h*s*1.6)}
  c.restore()}
// ---------- monitor (moldura/tela) ----------
function monFrame(c,k,tm,bg){if(k<=0)return false;const e=ease(k),sc=lin(.15,1,e);
  c.save();c.translate(320,180);c.scale(sc,sc*(k<1?1+(hs(Math.floor(tm*30),1)-.5)*.12:1));c.translate(-320,-180);
  c.fillStyle='#0a0610';c.fillRect(M2X-4,M2Y-4,M2W+8,M2H+8);c.fillStyle='#2a2233';c.fillRect(M2X,M2Y,M2W,M2H);c.fillStyle='#4a3f5c';c.fillRect(M2X,M2Y,M2W,3);c.fillRect(M2X,M2Y,3,M2H);c.fillStyle='#171220';c.fillRect(M2X+M2W-3,M2Y,3,M2H);c.fillRect(M2X,M2Y+M2H-3,M2W,3);
  c.fillStyle='#120c1a';c.fillRect(S2X-8,S2Y-8,S2W+16,S2H+16);c.fillStyle=bg||'#0b1f1c';c.fillRect(S2X,S2Y,S2W,S2H);
  ptext(c,'LUMEN',M2X+M2W/2-14,M2Y+M2H-14,'bold 10px '+MONO,'#8a7aa8');c.fillStyle=Math.floor(tm*2)%2?'#43e58f':'#1c6a40';c.fillRect(M2X+M2W-30,M2Y+M2H-20,6,6);
  c.save();c.beginPath();c.rect(S2X,S2Y,S2W,S2H);c.clip();TERM.on=true;TERM.y=bg!=='#bdf5d0';return true}
function monEnd(c){if(!TERM.nof)termFoot(c,S2X,S2Y+S2H-11,S2W,TERM.ft||[['F1','Ajuda'],['F10','Menu'],['ESC','Sair']]);for(let y=0;y<S2H;y+=2){c.fillStyle='rgba(0,0,0,.18)';c.fillRect(S2X,S2Y+y,S2W,1)}TERM.on=false;TERM.nof=false;TERM.ft=null;c.restore();c.restore()}
const bfTy=(s,t0,rate,t)=>t<t0?'':s.slice(0,Math.min(s.length,Math.floor((t-t0)*rate)+1));
function mono(c,s,x,y,sz,col,al){c.font=(sz>=13?'bold ':'')+sz+'px '+MONO;
  if(!TERM.on||!s){c.textAlign=al||'left';c.fillStyle=col;c.fillText(s,x,y);return}
  c.textAlign='left';const w=c.measureText(s).width,x0=al==='center'?x-w/2:al==='right'?x-w:x,opt=/^\s*\[.+\]\s*$/.test(s),hd=al==='center'&&sz<=10;
  if(opt||hd)selBar(c,x0-5,y-sz+1,w+10,sz+4,.92);
  c.fillStyle=col;if(opt||!TERM.y){c.fillText(s,x0,y);c.textAlign=al||'left';return}
  let cx=x0;s.split(TOKRE).forEach((q,i)=>{if(!q)return;c.fillStyle=i%2?TYL:col;c.fillText(q,cx,y);cx+=c.measureText(q).width});c.textAlign=al||'left'}
function bfCursor(c,cx,cy){c.save();c.translate(cx,cy);c.scale(1.3,1.3);c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=1.2;c.beginPath();[[0,0],[0,13],[3.5,10],[6,15],[8,14],[5.5,9],[10,9]].forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();c.stroke();c.restore()}
const cpath=(P,t)=>{let a=P[0];if(t<=a[0])return[a[1],a[2]];for(let i=1;i<P.length;i++){const b=P[i];if(t<=b[0]){const u=ease((t-a[0])/(b[0]-a[0]));return[lin(a[1],b[1],u),lin(a[2],b[2],u)]}a=b}return[a[1],a[2]]};
// texto glitchado direto (sem cache)
function garble(c,s,cx,cy,sz,col,amt,tm,al){c.save();c.font='bold '+sz+'px '+MONO;c.textAlign='center';const fz=Math.floor(tm*16);
  const out=amt>.6?s.split('').map((ch,i)=>hs(i,fz)>.45?'▒░#%@&?'[Math.floor(hs(i,fz+2)*7)]:ch).join(''):s.split('').map((ch,i)=>hs(i,fz)>.9?'#?'[Math.floor(hs(i,fz+1)*2)]:ch).join('');
  const w=Math.ceil(c.measureText(out).width)+20,h=Math.ceil(sz*1.6),cv=garble.cv||(garble.cv=document.createElement('canvas'));cv.width=w;cv.height=h;const q=cv.getContext('2d');q.font=c.font;q.textAlign='center';q.textBaseline='middle';q.fillStyle=col;q.fillText(out,w/2,h/2);
  c.globalAlpha=al==null?1:al;for(let y=0;y<h;y+=2){const dx=(hs(y,fz)>.6?(hs(y,fz+3)-.5)*amt*34:0);c.drawImage(cv,0,y,w,2,cx-w/2+dx,cy-h/2+y,w,2)}c.restore()}
// pastas
const BFN=['monitor.exe','governanta.exe','a?a?a','???.rem','x_x_x.tmp','█████','.....'];
function bfFold(c,x,y,col,tag,rd){c.fillStyle='#0b1f1c';c.fillRect(x-14,y-14,28,24);c.fillStyle=col;c.fillRect(x-13,y-12,12,4);c.fillRect(x-13,y-8,26,17);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x-13,y-8,26,2);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x-13,y+6,26,3)}
function bfFoldPos(i){const cw=S2W/4,ch=(S2H-28)/2;return[S2X+(i%4)*cw+cw/2,S2Y+34+Math.floor(i/4)*ch+ch*.32]}
const BTRASH=[S2X+S2W-34,S2Y+S2H-34];
// tela: terminal
function scrTerm(c,tm,L,t,hdr){c.fillStyle='#07120f';c.fillRect(S2X,S2Y,S2W,S2H);c.fillStyle='#1c4a44';c.fillRect(S2X,S2Y,S2W,13);mono(c,hdr||'C:\\FLUXO\\VEU\\',S2X+5,S2Y+10,10,'#d8efe6');
  const last0=L.filter(l=>t>=l.t0).pop();for(const l of L){const s=bfTy(l.s,l.t0,l.r||14,t);if(!s)continue;const y=S2Y+36+l.row*26;let col=l.col||'#9dffc8';
    if(l===last0&&!l.nopre){c.font=((l.sz||13)>=13?'bold ':'')+(l.sz||13)+'px '+MONO;selBar(c,S2X+9,y-(l.sz||13)+1,c.measureText('> '+s).width+10,(l.sz||13)+4,.55)}
    if(l.blink){const on=Math.floor(tm*(l.blink))%2===0;if(!on&&t>l.t0+.3){col='#3a3a3a'}}
    mono(c,(l.nopre?'':'> ')+s,S2X+14,y,l.sz||13,col);}
  const last=L.filter(l=>t>=l.t0).pop();if(last&&Math.floor(tm*2.5)%2===0){const s=bfTy(last.s,last.t0,last.r||14,t);c.font=(last.sz||13)>=13?'bold 13px '+MONO:'12px '+MONO;const w=c.measureText((last.nopre?'':'> ')+s).width;c.fillStyle='#9dffc8';c.fillRect(S2X+14+w+3,S2Y+36+last.row*26-11,8,13)}}
// ---------- estado ----------
let BFGRIME=null;
function bfStart(g,b){g._bossChoice=null;g.state='bfin';g.drawHUD=function(){};g.drawInteractHints=function(){};g.drawToast=function(){};g.messageTimer=0;g.message=null;const p=g.player;p.vx=0;p.vy=0;p.anim='idle';p.draw=function(){};p.invuln=Math.max(p.invuln||0,99999);
  g._bfz={t:0,u:0,br:null,b,sh:0,pts:[],bh:0,flash:0,notice:false,fav:(p.res&&(p.res.kaim||0)>(p.res.kami||0))?'cut':'free',pz:null,done:false};g.projectiles&&(g.projectiles.length=0)}
function bfEnd(g){const B=g._bfz,p=g.player,b=B.b;delete p.draw;delete g.drawHUD;delete g.drawInteractHints;delete g.drawToast;
  p.x=CEN_X-14;p.y=FLOOR-34-1;p.vx=0;p.vy=0;p.facing=1;p.invuln=600;p.anim='idle';b.hidden=true;b.alive=false;g.state='playing';g._bfz=null;
  g._grime=B.br==='elim'?'purple':'green';g._flashR=.5;
  if(window.bossResolve)window.bossResolve(g,B.br==='elim'?'cut':'free',b)}
function bfUpdate(g,dt){const B=g._bfz,s=Math.min(.05,dt>1?dt/1000:dt),inp=g.input;B.sh*=Math.exp(-s*2.2);B.flash=Math.max(0,B.flash-s);
  if(!B.br){if(B.t<BF_CH)B.t+=s;else{B.t=BF_CH;B.hold=(B.hold||0)+s;
      const pk=inp.wasPressed('KeyE')?'free':inp.wasPressed('KeyF')?'elim':null;if(pk&&B.hold>.4){B.br=pk;B.u=0;B.sh=1.4}}}
  else{let s2=s;if(B.fz>0){B.fz-=s;s2=0}else if(B.slow>0){B.slow-=s;s2=s*.35}B.u+=s2;B.cz=(B.cz||0)+s;
    if(B.br==='elim'&&!B.cutDone&&B.u>=BFE.cut+.09){B.cutDone=true;B.cz=0;B.fz=.3;B.slow=1.0;B.sh=2.8;B.flash=1;for(let i=0;i<40;i++)B.pts.push({x:B.hx||BF_SX-14,y:B.hy||FLOOR-48,vx:(Math.random()-.5)*150,vy:-Math.random()*100,l:.9+Math.random()*.9,m:1.6,gold:1})}
    if(B.u>=(B.br==='elim'?BFE.notice:BFF.notice)){B.notice=true;if(inp.wasPressed('KeyC')){B.done=true;bfEnd(g);return}}}
  // partículas
  for(const q of B.pts){q.x+=q.vx*s;q.y+=q.vy*s;q.l-=s;q.vx*=Math.exp(-s*.4)}B.pts=B.pts.filter(q=>q.l>0);
  if(B.br==='free'){const u=B.u;
    if(u>=9.4&&u<11.8){for(let i=0;i<3;i++)B.pts.push({x:BF_SX-12+(Math.random()-.5)*34,y:FLOOR-6-Math.random()*40,vx:(Math.random()-.5)*24-4,vy:-10-Math.random()*26,l:1.6+Math.random()*1.6,m:1.6+Math.random()*1.6})}
    if(u>=12.2&&u<14.6){for(let i=0;i<3;i++)B.pts.push({x:BF_SX-70+(Math.random()-.5)*40+(u-12.2)*40,y:FLOOR-6-Math.random()*44,vx:30+Math.random()*30,vy:-4-Math.random()*8,l:1.4,m:1.4})}
    if(u>=BFF.world){for(let i=0;i<2;i++)B.pts.push({x:CEN_X-160+Math.random()*320,y:FLOOR-4-Math.random()*90,vx:(Math.random()-.5)*8,vy:-6-Math.random()*14,l:3+Math.random()*3,m:5})}}
}
// timelines por ramo
const BFE={red:1.0,off:1.6,step:1.9,stop:6.2,head:4.6,thread:5.2,q0:7.0,a0:8.0,cut:8.9,mon:11.4,l1:11.9,l2:13.1,ret:15.8,expl:16.1,grab:17.5,trash:19.7,del:20.0,gl2:21.7,room:22.3,notice:24.9};
const BFF={red:1.0,off:1.6,thr:1.9,t0:3.0,arm0:4.6,arm1:7.0,fp0:6.4,fp1:6.8,touch:9.5,dis1:11.8,mika0:11.8,light0:12.4,v0:12.6,gl:14.8,mon:15.4,l1:15.9,l2:17.2,ret:19.9,expl:20.2,grab:21.6,menu:22.2,ext:23.4,gl2:25.0,world:25.6,notice:28.0};
// ---------- grime / luz final ----------
function bfGrime(ctx,cam,mode,k,tm){if(!k)return;const X0=79*16,Y0=172*16;ctx.save();ctx.beginPath();ctx.rect(X0-cam.x,Y0-cam.y,34*16,14*16);ctx.clip();
  if(mode==='purple'){
    for(let i=0;i<70;i++){const x=X0+hs(i,31)*544-cam.x,y=Y0+hs(i,32)*224-cam.y,r=(5+hs(i,33)*22)*Math.max(0,Math.min(1,k*1.4-hs(i,34)*.4));if(r<=0)continue;ctx.globalAlpha=.36*Math.min(1,k*2);ctx.fillStyle=hs(i,35)>.5?'#3a1670':'#5a2a9a';ctx.beginPath();ctx.ellipse(x,y,r,r*(.45+hs(i,36)*.5),hs(i,37)*3,0,TAU);ctx.fill()}
    for(let i=0;i<26;i++){const x=X0+hs(i,41)*544-cam.x,L=(10+hs(i,42)*110)*Math.min(1,Math.max(0,k*1.5-hs(i,43)*.5));ctx.globalAlpha=.6*Math.min(1,k*2);ctx.fillStyle='#4a2090';ctx.fillRect(x,Y0-cam.y,2+hs(i,44)*2,L);ctx.beginPath();ctx.arc(x+1,Y0-cam.y+L,2.6+hs(i,45)*2,0,TAU);ctx.fill()}
    ctx.globalAlpha=.2*k;ctx.fillStyle='#2a0f55';ctx.fillRect(X0-cam.x,Y0-cam.y,544,224)}
  else{ctx.globalCompositeOperation='lighter';
    for(const lx of [86,95,104]){const x=lx*16-cam.x,y=178*16-cam.y,g=ctx.createRadialGradient(x,y,6,x,y,190);g.addColorStop(0,'rgba(120,255,190,'+(.5*k)+')');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-190,y-190,380,380)}
    ctx.fillStyle='rgba(90,255,170,'+(.12*k)+')';ctx.fillRect(X0-cam.x,Y0-cam.y,544,224);
    for(let i=0;i<50;i++){const sp=5+hs(i,52)*11,y=Y0+224-((tm*sp+hs(i,53)*224)%224),x=X0+hs(i,51)*544+Math.sin(tm*.8+i)*5;ctx.globalAlpha=k*(.4+.5*hs(i,54));ctx.fillStyle=hs(i,55)>.5?'#b8ffd8':'#4fe898';const z=hs(i,56)>.7?3:2;ctx.fillRect(Math.floor(x-cam.x),Math.floor(y-cam.y),z,z)}}
  ctx.restore()}
// ---------- mão em primeira pessoa ----------
function fpHand(c,u,tm,gl){const q=fpHand.q||(fpHand.q=document.createElement('canvas'));if(!q.width){q.width=160;q.height=90}
  const x=q.getContext('2d');x.clearRect(0,0,160,90);const e=ease(u),tx=lin(128,106,e),ty=lin(96,52,e)+Math.sin(tm*1.6)*.7,sp=lin(.05,.4,e);
  const W=[tx+14,ty+20],E=[190,128],dx=E[0]-W[0],dy=E[1]-W[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
  const quad=(a,wa,b,wb,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(a[0]+nx*wa,a[1]+ny*wa);x.lineTo(b[0]+nx*wb,b[1]+ny*wb);x.lineTo(b[0]-nx*wb,b[1]-ny*wb);x.lineTo(a[0]-nx*wa,a[1]-ny*wa);x.closePath();x.fill()};
  const at=k=>[W[0]+dx*k,W[1]+dy*k];
  quad(W,8.5,E,22,'#0c0812');quad(W,7,E,20.5,'#2b2038');quad(W,2.5,E,6,'#3a2c4c');
  quad(at(0),9.6,at(.075),10.4,'#0c0812');quad(at(0),8.2,at(.075),9,'#D27A8A');quad(at(0),8.2,at(.012),9,'#f0a8b6');
  x.save();x.translate(tx+10,ty+10);x.rotate(-.62);
  x.fillStyle='#3a2430';x.fillRect(-9,-8,18,17);x.fillStyle='#ead3d6';x.fillRect(-8,-7,16,15);x.fillStyle='#c9a4ae';x.fillRect(-8,4,16,4);x.fillRect(5,-7,3,13);
  [[-6.2,13,-1],[-2.1,16,-.3],[2,15,.35],[6,12,1]].forEach(([ox,Lf,a])=>{x.save();x.translate(ox,-7);x.rotate(a*(.1+sp*.9)*.5);x.fillStyle='#3a2430';x.fillRect(-2.7,-Lf-1,5.4,Lf+2);x.fillStyle='#ead3d6';x.fillRect(-1.9,-Lf,3.8,Lf+1);x.fillStyle='#c9a4ae';x.fillRect(.5,-Lf,1.4,Lf+1);x.fillStyle='#f8ecee';x.fillRect(-1.5,-Lf+.5,1,3);x.fillStyle='#3a2430';x.fillRect(-2,-Lf/2,4,.8);x.restore()});
  x.save();x.translate(-8,2);x.rotate(-1.05-sp*.5);x.fillStyle='#3a2430';x.fillRect(-2.9,-11,5.8,12);x.fillStyle='#ead3d6';x.fillRect(-2,-10.5,4,10.5);x.fillStyle='#c9a4ae';x.fillRect(.4,-10.5,1.4,10.5);x.restore();
  x.restore();
  if(gl>0){x.globalCompositeOperation='lighter';const g=x.createRadialGradient(tx+6,ty-2,2,tx+6,ty-2,38);g.addColorStop(0,'rgba(150,255,200,'+gl*.55+')');g.addColorStop(1,'rgba(150,255,200,0)');x.fillStyle=g;x.fillRect(tx-40,ty-44,100,90);x.globalCompositeOperation='source-over'}
  c.save();c.imageSmoothingEnabled=false;c.drawImage(q,0,0,640,360);c.restore()}
// ---------- câmera ----------
function bfKF(K,t){let a=K[0];if(t<=a[0])return a.slice(1);for(let i=1;i<K.length;i++){const b=K[i];if(t<=b[0]){const u=ease((t-a[0])/(b[0]-a[0]));return[lin(a[1],b[1],u),lin(a[2],b[2],u),lin(a[3],b[3],u)]}a=b}return a.slice(1)}
const FY=FLOOR;
const KMAIN=[[0,1540,FY-64,2.3],[7.2,1544,FY-62,2.5],[27,1540,FY-62,2.5],[30.8,1570,FY-52,3.3],[44,1572,FY-46,3.3],[45.8,1606,FY-44,3.4],[57.9,1612,FY-44,3.6],[58.25,1572,FY-26,5.2],[60.0,1572,FY-26,5.4],[62.0,1594,FY-46,3.4],[BF_CH,1594,FY-50,3.1]];
const KELIM_OLD=[[0,1594,FY-52,3.2],[1.9,1594,FY-52,3.2],[4.8,1594,FY-48,4.0],[8.0,1596,FY-52,4.2],[8.6,1598,FY-50,5.0],[10.5,1598,FY-50,5.2],[BFE.room-.1,1598,FY-50,5.2],[BFE.room,CEN_X,FY-60,2.3]];
const KFREE=[[0,1594,FY-52,3.2],[3.0,1594,FY-50,3.5],[6.4,1596,FY-48,4.0],[6.8,1604,FY-48,5.0],[BFF.touch+1.8,1604,FY-48,5.6],[11.8,1558,FY-32,4.4],[14.8,1558,FY-32,4.6],[BFF.world-.1,1558,FY-32,4.6],[BFF.world,CEN_X,FY-60,2.3]];
// IK do braço (coords do sprite)
function bfIK(mx,my,k,tx,ty,flip,S){S=S||BFS;const ux=77+(tx-mx)/k*(flip?-1:1),uy=232+(ty-(my+2))/k;let dx=ux-S[0],dy=uy-S[1],d=Math.hypot(dx,dy);const m=BFL1+BFL2-.5;if(d>m){dx*=m/d;dy*=m/d;d=m}
  const a=Math.acos(Math.max(-1,Math.min(1,(BFL1*BFL1+d*d-BFL2*BFL2)/(2*BFL1*d)))),base=Math.atan2(dx,dy),a1=base-a;
  const e=[S[0]+Math.sin(a1)*BFL1,S[1]+Math.cos(a1)*BFL1],a2=Math.atan2(S[0]+dx-e[0],S[1]+dy-e[1]);return[a1,a2-a1]}
// ---------- falas ----------
const BFTX=[{w:'m',s:'Por que não continua lutando?',t0:29.6,t1:33.0},{w:'s',s:'Porque você já decidiu que eu precisava cair.',t0:33.4,t1:37.6},{w:'s',s:'Mas não decidiu o que fazer comigo.',t0:38.0,t1:41.0},{w:'s',s:'Você sabe a diferença.',t0:41.9,t1:44.9},
  {w:'s',s:'Uma parte de você quer cortar tudo.',t0:46.2,t1:49.8},{w:'s',s:'Outra quer guardar até aquilo que te consome',t0:50.2,t1:54.6},{w:'s',s:'E existe aquela que ainda procura entender.',t0:55.0,t1:58.6}];
const BFTE=[{w:'m',s:'Últimas palavras?',t0:BFE.q0,t1:8.5,r:12},{w:'s',s:'Apenas de',t0:BFE.a0,t1:BFE.cut+.12,r:11}];
const BFTF=[{w:'s',s:'Não tente carregar todas as suas vozes sozinha',t0:BFF.t0,t1:BFF.arm1-.1},{w:'s',s:'Deixe-as passar.',t0:BFF.v0,t1:BFF.gl-.3,r:10}];
function bfLines(c,L,t,tm){for(const l of L){if(t<l.t0||t>l.t1)continue;const n=Math.floor((t-l.t0)*(l.r||16)),a=Math.min(1,(l.t1-t)*3,(t-l.t0)*5);if(a<=0)continue;c.save();c.globalAlpha=a;
  if(l.w==='s'){const amt=.1+(hs(Math.floor(t*14),4)>.88?.45:0);gradBand(c);gtext(c,l.s.slice(0,n),320,304,30,t,amt,'italic')}
  else{gradBand(c);const txt=l.s.slice(0,n);c.font='italic 30px Georgia';c.textAlign='center';const gl=hs(Math.floor(t*20),7)>.92?(hs(Math.floor(t*20),8)-.5)*8:0;c.fillStyle='rgba(210,122,138,.55)';c.fillText(txt,320+gl+2,312);c.fillStyle='#f4e8f8';c.fillText(txt,320+gl,310)}
  c.restore()}}
// ---------- glitch ----------
const GLM=[[0,1.3,1],[7.0,8.1,.95,'split'],[16.9,17.7,.55],[26.3,27.3,.95],[41.0,41.8,.9],[62.0,64.0,.18],[64.0,65.8,.9]];
const GLE=[[1.0,1.7,.9],[9.35,11.2,1.0],[BFE.mon-.5,BFE.mon+.3,.95],[BFE.expl-.1,BFE.expl+.2,.4],[BFE.gl2,BFE.room,1.0]];
const GLF=[[1.0,1.7,.7],[BFF.touch,BFF.dis1,.22],[11.5,12.3,.6],[BFF.gl,BFF.mon+.3,.75],[BFF.expl-.1,BFF.expl+.2,.35],[BFF.gl2,BFF.world,.85]];
function bfGl(B,t,tm){const E=B.br?(B.br==='elim'?GLE:GLF):GLM,tt=B.br?B.u:t;let a=0,sp=null;for(const e of E)if(tt>=e[0]&&tt<e[1]){const k=Math.min(1,(tt-e[0])*6,(e[1]-tt)*3);a=Math.max(a,e[2]*(.55+.45*k)*(.7+.3*hs(Math.floor(tm*24),3)));if(e[3])sp=e[3]}
  if(!B.br&&tt>=44&&tt<62&&hs(Math.floor(tm*3),5)>.8)a=Math.max(a,.16);if(!B.br&&tt>=1.3&&tt<7&&hs(Math.floor(tm*5),6)>.88)a=Math.max(a,.25);
  if(B.br==='elim'&&B.u>=BFE.cut+.09&&B.u<BFE.cut+.5)a=1;B.gsp=sp;return a}
// ---------- monitor ----------
function bfMonitor(c,B,tm){const t=B.t,u=B.u,br=B.br;let k=0,kind=null,tt=0;
  if(!br){if(t>=7.4&&t<26.9){k=Math.min(1,(t-7.4)/.55,(26.9-t)/.5);kind=t<17.0?'term':t<17.6?'blink':'blue'}else if(t>=BF_M3){k=Math.min(1,(t-BF_M3)/.4);kind='choice'}}
  else if(br==='elim'){if(u<BFE.off-.1){k=1;kind='red'}else if(u>=BFE.mon&&u<BFE.gl2+.5){k=Math.min(1,(u-BFE.mon)/.4,(BFE.gl2+.5-u)/.4);kind=u<BFE.expl?'estat':'expl'}}
  else{if(u<BFF.off-.1){k=1;kind='lg'}else if(u>=BFF.mon&&u<BFF.gl2+.5){k=Math.min(1,(u-BFF.mon)/.4,(BFF.gl2+.5-u)/.4);kind=u<BFF.expl?'estat':'expl'}}
  B.mk=k;if(k<=0)return;
  const bg=kind==='blue'?'#1337b8':kind==='red'?'#b01428':kind==='lg'?'#bdf5d0':kind==='blink'?'#000':'#0b1f1c';
  if(!monFrame(c,k,tm,bg))return;const fz=Math.floor(tm*20);
  if(kind==='term'){scrTerm(c,tm,[{s:'PROCESSO INTERROMPIDO',t0:8.6,row:0,col:'#e8fff4'},{s:'espirito.exe',t0:10.4,row:1},{s:'STATUS: INDEFINIDO',t0:11.6,row:2,col:'#ffd27a'},{s:'OPERAÇÕES DISPONÍVEIS:',t0:13.2,row:3},
      {s:'[DELETAR]',t0:15.0,row:4.7,col:'#ff4060',blink:3,nopre:1,sz:14,r:12},{s:'[RESTAURAR]',t0:15.5,row:5.7,col:'#43e58f',blink:3.4,nopre:1,sz:14,r:12}],t)}
  else if(kind==='blink'){if(hs(Math.floor(tm*30),2)>.4){c.fillStyle='#1337b8';c.fillRect(S2X,S2Y,S2W,S2H)}}
  else if(kind==='blue'){const l1=bfTy('RESQUÍCIO: Então... você conseguiu. ',18.1,14,t),l2=bfTy('RESQUÍCIO: Mas ainda não terminou, Mika.',22.7,14,t);
    mono(c,'*** LINK INSTÁVEL ***',S2X+S2W/2,S2Y+16,10,'#a8c4ff','center');mono(c,'ORIGEM: espirito.exe',S2X+8,S2Y+S2H-8,9,'#7fa0ff');
    mono(c,l1,S2X+14,S2Y+S2H*.38,13,'#ffffff');mono(c,l2,S2X+14,S2Y+S2H*.38+30,13,'#ffffff');
    if(Math.floor(tm*2.5)%2===0){const ln=l2||l1,ry=l2?S2Y+S2H*.38+30:S2Y+S2H*.38;c.font='bold 13px '+MONO;c.textAlign='left';const w=c.measureText(ln).width;c.fillStyle='#fff';c.fillRect(S2X+14+w+3,ry-11,8,13)}
    for(let i=0;i<5;i++){if(hs(i,fz)>.55){const y=S2Y+hs(i,fz+1)*S2H,h=2+hs(i,fz+2)*10;c.fillStyle=hs(i,fz+3)>.5?'#2a5cff':'#0a2488';c.fillRect(S2X+(hs(i,fz+4)-.5)*40,y,S2W,h)}}
    if(hs(fz,9)>.8){c.drawImage(c.canvas,S2X,S2Y+60,S2W,24,S2X+(hs(fz,3)-.5)*30,S2Y+60,S2W,24)}}
  else if(kind==='choice'){const fav=B.fav,ex=Math.floor(tm*2.6)%2===0,cx1=S2X+S2W*.25,cx2=S2X+S2W*.75,cy=S2Y+S2H*.45;
    mono(c,'ESCOLHA O DESTINO',S2X+S2W/2,S2Y+18,10,'#7fb8a8','center');c.fillStyle='#1c4a44';c.fillRect(S2X+S2W/2,S2Y+30,1,S2H-60);
    if(fav==='free')garble(c,'LIBERTAR',cx1,cy,24,ex?'#7dffb0':'#43e58f',.02,tm,1);else garble(c,'LIBERTAR',cx1,cy,24,'#43e58f',.96,tm,.55);
    if(fav==='cut')garble(c,'ELIMINAR',cx2,cy,24,ex?'#ff6a82':'#ff3b5c',.02,tm,1);else garble(c,'ELIMINAR',cx2,cy,24,'#ff3b5c',.96,tm,.55);
    for(const [cx,col,ky,on] of [[cx1,'#43e58f','E',fav==='free'],[cx2,'#ff3b5c','F',fav==='cut']]){c.save();c.globalAlpha=on?1:.55;c.strokeStyle=col;c.lineWidth=1.5;c.strokeRect(cx-18,cy+30,36,26);if(on)garble(c,'[ '+ky+' ]',cx,cy+44,13,col,.02,tm,1);else garble(c,'[ '+ky+' ]',cx,cy+44,13,col,.7,tm,1);c.restore()}}
  else if(kind==='red'||kind==='lg'){c.fillStyle=kind==='red'?'rgba(255,60,80,'+(.3+.2*Math.sin(tm*20))+')':'rgba(255,255,255,'+(.25+.15*Math.sin(tm*14))+')';c.fillRect(S2X,S2Y,S2W,S2H);
    const ww=kind==='red'?'ELIMINAR':'LIBERTAR';garble(c,ww,S2X+S2W/2,S2Y+S2H/2,30,kind==='red'?'#ffe0e4':'#0b3a22',.08+(hs(fz,3)>.85?.5:0),tm,1)}
  else if(kind==='estat'||kind==='expl'){bfBranchScreens(c,B,kind,tm)}
  TERM.nof=(kind==='blue'||kind==='blink'||kind==='red'||kind==='lg');TERM.ft=kind==='choice'?[['E','Libertar'],['F','Eliminar']]:kind==='term'?[['F1','Ajuda'],['F3','Deletar'],['ESC','Sair']]:[['<-','Retornar'],['F10','Menu'],['ESC','Sair']];
  monEnd(c)}
function bfBranchScreens(c,B,kind,tm){const u=B.u,el=B.br==='elim',E=el?BFE:BFF,eT=u-E.expl,fz=Math.floor(tm*20);
  const retP=[S2X+40,S2Y+S2H-18],ic0=bfFoldPos(0);
  if(kind==='estat'){const col2=el?'#ff4060':'#43e58f';scrTerm(c,tm,[{s:'monitor.exe',t0:E.l1,row:0,col:'#e8fff4'},{s:el?'STATUS: DELETADO':'STATUS: LIBERTO',t0:E.l2,row:1,col:col2,r:12}],u,'C:\\FLUXO\\monitor\\');
    const ta=E.l2+1.4;if(u>ta){const hv=u>E.ret-.5;c.fillStyle=hv?'#2a5a50':'#16352f';c.fillRect(S2X+8,S2Y+S2H-30,64,22);c.strokeStyle='#43e58f';c.strokeRect(S2X+8.5,S2Y+S2H-29.5,63,21);mono(c,'<- retornar',S2X+40,S2Y+S2H-15,10,'#d8efe6','center')}
    const cp=cpath([[ta,S2X+S2W-20,S2Y+50],[E.ret-.35,retP[0],retP[1]-4],[E.ret,retP[0],retP[1]-4]],u);if(u>ta){bfCursor(c,cp[0],cp[1]);if(u>E.ret-.05&&u<E.ret+.25){c.strokeStyle='rgba(180,255,220,'+(1-(u-E.ret)/.3)+')';c.lineWidth=2;c.beginPath();c.arc(cp[0],cp[1],4+(u-E.ret)*60,0,TAU);c.stroke()}}}
  else{c.fillStyle='#0b1f1c';c.fillRect(S2X,S2Y,S2W,S2H);c.fillStyle='#1c4a44';c.fillRect(S2X,S2Y,S2W,13);mono(c,'C:\\FLUXO\\',S2X+5,S2Y+10,10,'#d8efe6');
    const gone=el&&u>E.del;
    for(let i=0;i<7;i++){if(eT*10<i)continue;const [ix,iy0]=bfFoldPos(i);let ix2=ix,iy=iy0,col='#7fb8a8',nm=BFN[i],lvl=i===0?0:i===1?1:2,al=1;
      const gl=lvl===2?1:lvl===1?.3:0,j=lvl===2?(hs(i,fz)-.5)*10:lvl===1&&hs(fz,i)>.8?(hs(fz,i+2)-.5)*5:0;
      if(i===0){if(gone)continue;if(el&&u>E.grab&&u<E.trash+.1){const cp=cpath([[E.grab,ic0[0]+4,ic0[1]+4],[E.trash,BTRASH[0],BTRASH[1]]],u);ix2=cp[0]-4;iy=cp[1]-4;al=.7}if(!el&&u>E.ext){const ee=u-E.ext;col='#43e58f';al=Math.max(0,1-ee/1.3)}}
      c.save();c.globalAlpha=al;bfFold(c,ix2+j,iy,col);c.restore();
      if(i===0&&!gone)selBar(c,ix2-32,iy+18,64,11,.9);if(lvl===2)garble(c,nm,ix2,iy+26,9,'#9dffc8',.95,tm+i,.75);else if(lvl===1){garble(c,nm,ix2,iy+26,9,'#9dffc8',.18,tm+i,.9)}else garble(c,nm,ix2,iy+26,9,'#e8fff4',0,tm,al)}
    if(el){const hot=u>E.trash-.3&&u<E.del+.4;c.fillStyle=hot?'#ff6a82':'#7a8a90';c.fillRect(BTRASH[0]-10,BTRASH[1]-2,20,20);c.fillRect(BTRASH[0]-12,BTRASH[1]-6,24,4);c.fillRect(BTRASH[0]-4,BTRASH[1]-9,8,3);c.fillStyle='#0b1f1c';for(const dx of [-5,0,5])c.fillRect(BTRASH[0]+dx-1,BTRASH[1]+2,2,14)}
    let cur;if(el)cur=cpath([[0,retP[0],retP[1]-4],[E.grab-.6,ic0[0]+4,ic0[1]+4],[E.grab,ic0[0]+4,ic0[1]+4],[E.trash,BTRASH[0],BTRASH[1]],[E.del+.4,BTRASH[0],BTRASH[1]],[E.gl2,BTRASH[0]-30,BTRASH[1]-40]],eT+E.expl);
    else{const mn=[ic0[0]+14,ic0[1]+8];cur=cpath([[0,retP[0],retP[1]-4],[E.grab-.6,ic0[0]+4,ic0[1]+4],[E.menu,ic0[0]+4,ic0[1]+4],[E.menu+.2,mn[0]+8,mn[1]+6],[E.ext-.35,mn[0]+30,mn[1]+6+13*2+6],[E.ext,mn[0]+30,mn[1]+6+13*2+6],[E.gl2,mn[0]+60,mn[1]+60]],u);
      if(u>=E.menu){const mx=mn[0],my=mn[1];c.fillStyle='#e8e2d4';c.fillRect(mx,my,86,56);c.strokeStyle='#0b1f1c';c.strokeRect(mx+.5,my+.5,85,55);['Abrir','Copiar','Extrair','Propriedades'].forEach((s,i)=>{const hv=i===2&&u>E.ext-.4;if(hv){c.fillStyle=u>E.ext?'#43e58f':'#6a5a8a';c.fillRect(mx+2,my+3+i*13,82,12)}mono(c,s.slice(0,1),mx+8,my+13+i*13,10,hv?TYL:'#b07a00');mono(c,s.slice(1),mx+14,my+13+i*13,10,hv?'#fff':'#1a1420')})}}
    if(u<E.gl2){bfCursor(c,cur[0],cur[1]);const ck=el?E.trash:E.ext;if(u>ck-.05&&u<ck+.3){c.strokeStyle=el?'rgba(255,90,120,'+(1-(u-ck)/.35)+')':'rgba(120,255,190,'+(1-(u-ck)/.35)+')';c.lineWidth=2;c.beginPath();c.arc(cur[0],cur[1],4+(u-ck)*60,0,TAU);c.stroke()}}
    if(!el&&u>E.ext&&u<E.ext+1.5){const ee=u-E.ext;for(let i=0;i<22;i++){const x=ic0[0]+(hs(i,61)-.5)*26+Math.sin(ee*4+i)*3,y=ic0[1]-ee*(20+hs(i,62)*50)+hs(i,63)*10;c.fillStyle='rgba(160,255,200,'+Math.max(0,1-ee/1.4)+')';c.fillRect(x,y,2,2)}}}}
function bfGold(c,x0,y0,x1,y1,t,al,sw){c.save();c.lineCap='round';const mx=(x0+x1)/2+Math.sin(t*2.2)*(sw==null?1:sw),my=(y0+y1)/2;
  const path=()=>{c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(mx,my,x1,y1);c.stroke()};
  c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,190,70,'+.3*al+')';c.lineWidth=2.4;path();c.globalCompositeOperation='source-over';
  c.strokeStyle='rgba(120,70,10,'+al+')';c.lineWidth=1.0;path();c.strokeStyle='rgba(255,214,110,'+al+')';c.lineWidth=.6;path();c.strokeStyle='rgba(255,246,200,'+.7*al+')';c.lineWidth=.25;path();c.restore()}
function bfDip(c,t,t0,d,col){const u=(t-t0)/d;if(u<0||u>1)return;const f=1-Math.abs(2*u-1);c.fillStyle=col||'rgba(0,0,0,'+Math.min(1,f*1.6)+')';if(col)c.fillStyle=col.replace('A',f.toFixed(2));c.fillRect(0,0,640,360)}
function bfNotice(c,txt,col,tm){const x=320,y=176,w=360,h=74;c.save();c.fillStyle='rgba(6,3,12,.94)';c.fillRect(x-w/2,y-h/2,w,h);c.strokeStyle=col;c.lineWidth=2;c.strokeRect(x-w/2+.5,y-h/2+.5,w-1,h-1);c.fillStyle=col;c.fillRect(x-w/2,y-h/2,w,5);
  mono(c,'AVISO DO SISTEMA',x-w/2+10,y-h/2+19,9,col);c.font='bold 21px '+MONO;c.textAlign='center';c.fillStyle='#fff';c.fillText(txt,x,y+6);
  if(Math.floor(tm*2)%2===0){c.font='bold 11px '+MONO;c.fillStyle=col;c.fillText('pressione  C  para aceitar',x,y+h/2-9)}c.restore()}
function bfDraw(g,c){const B=g._bfz,tm=performance.now()/1000,t=B.t,u=B.u,br=B.br,el=br==='elim',fr=br==='free';c.imageSmoothingEnabled=false;
  g._grime=el?'purple':fr?'green':null;g._grimeK=el?Math.max(0,Math.min(1,(u-BFE.room)/2.6)):fr?Math.max(0,Math.min(1,(u-BFF.world)/2.6)):0;
  const tt=br?u:t,room=el?u>=BFE.room:fr?u>=BFF.world:false,fp=fr&&u>=BFF.fp1&&u<BFF.dis1;
  let cam=bfKF(br?(el?KELIM_OLD:KFREE):KMAIN,tt),EL=null;
  if(el&&u<BFE.room){const cl=v=>Math.max(0,Math.min(1,v)),ph=ease(cl((u-BFE.head)/1.4)),post=u>=BFE.cut?ease(cl((u-BFE.cut)/.5)):0,hd=Math.max(0,ph-post),FLx=FLOOR-2,sf=66/82,L=24*sf;
    const geo=bfKneel(c,BF_SX,FLx,.45,u,{red:0,s:.45,dir:-1,head:hd,bow:.8-ph*.15,kq:.4,sq:.8,geom:true}),tx=geo.top[0],yc=geo.top[1]-4,hy=FLx-24.1;
    const th=Math.asin(Math.max(-.95,Math.min(-.35,(yc-hy)/L))),hx=tx-L*Math.cos(th),mxt=hx-12.9,mxs=mxt-115,ap=cl((u-BFE.step)/(BFE.stop-BFE.step)),mxp=lin(mxs,mxt,1-(1-ap)*(1-ap));
    EL={geo,tx,th,L,mx:mxp,mxt,sf,ph,hd};
    let cf;if(u<BFE.stop)cf=[mxp+40,FY-34,lin(3.0,3.5,ap)];else{const w=ease(cl((u-BFE.stop)/1.3));cf=[lin(mxp+40,(mxp+tx)/2+8,w),lin(FY-34,FY-40,w),lin(3.5,4.2,w)+.5*ease(cl((u-BFE.stop-1.3)/(BFE.cut-BFE.stop-1.3)))]}
    if(u>=BFE.cut){const pz=.8*Math.exp(-(u-BFE.cut)*2.2),fw=ease(cl((u-BFE.cut-1.5)/1.1));cf=[lin((mxp+tx)/2+8,mxp+10,fw),lin(FY-40,FLx-50,fw),lin(4.7+pz,5.2,fw)]}
    cam=cf}
  const sh=B.sh+(el&&u>=BFE.cut&&u<BFE.cut+.8?1.4*(1-(u-BFE.cut)/.8):0),shx=(hs(Math.floor(tm*40),1)-.5)*14*sh+Math.sin(tm*1.3)*(el?2.2:.5),shy=(hs(Math.floor(tm*40),2)-.5)*10*sh+Math.cos(tm*1.1)*(el?1.6:.4);
  if(fp){cam=[cam[0]+Math.sin(tm*.9)*1.2,cam[1]+Math.sin(tm*1.7)*.6,cam[2]]}
  const [fx,fy,z]=cam,wc=bcWorld(g,c,fx,fy);
  c.fillStyle='#04020a';c.fillRect(0,0,640,360);c.save();c.imageSmoothingEnabled=false;c.translate(320+shx,180+shy);c.scale(z,z);c.translate(-fx,-fy);c.drawImage(wc,Math.floor(fx)-320,Math.floor(fy)-180);
  c.fillStyle='rgba(62,22,118,.14)';c.fillRect(fx-700,fy-500,1400,1000);
  const FL=FLOOR-2,SPX=BF_SX;let sp=null,mk=null,lights=[],spOn=false,mikaOn=false,mx=BF_MX0,kM=KF,P={r:Math.sin(tt*1.3)*.012,h:.05+Math.sin(tt*.9)*.02,l:0,b:Math.sin(tt*1.6)*.25,tn:0},arm=null,sc=null,glow=0,spt={};
  if(!br){
    const rk=Math.max(0,Math.min(1,(t-1.2)/6)),e=ease(rk);spt={red:1-e,s:.6*(1-.25*e),dir:-1,a:t<.35?0:t<1.3?(hs(Math.floor(tm*24),5)>.35?1:.15):1,gl:t<1.4?.8:.05+(hs(Math.floor(tm*8),4)>.93?.4:0)};spOn=spt.a>0;
    mikaOn=t>=.7&&(t>1.4||hs(Math.floor(tm*24),6)>.4);
    if(t>=27.2){const w=ease(Math.min(1,(t-27.2)/3.6));mx=lin(BF_MX0,BF_SX-44,w);if(t<30.8){P.b=-Math.abs(Math.sin(t*9))*1.3;P.r=Math.sin(t*9)*.03}}
    if(t>=40)P.h=.1+Math.sin(t*1.1)*.02}
  else if(el){const ph=ease(Math.max(0,Math.min(1,(u-BFE.head)/1.6)));spt={red:0,s:.45,dir:-1,head:ph,bow:.8-ph*.15,kq:.4,sq:.8,a:u<BFE.cut+.25?1:Math.max(0,1-(u-BFE.cut-.25)/1.1),gl:u>=BFE.cut?.7:.05};spOn=!room&&spt.a>0;
    if(u>=BFE.cut)spt.head=Math.max(0,ph-ease(Math.min(1,(u-BFE.cut)/.5)));
    mikaOn=u<BFE.gl2&&u>=BFE.off-.3;mx=EL?EL.mx:mx;kM=KF;if(room){mx=CEN_X;kM=KF;mikaOn=u>=BFE.room-.3}}
  else{const hd=ease(Math.max(0,Math.min(1,(u-BFF.t0)/1.2)));spt={red:0,s:.45,dir:-1,head:hd*.55,bow:.5-hd*.2,a:u<BFF.touch?1:1-ease((u-BFF.touch)/2.2),dis:u<BFF.touch?0:ease((u-BFF.touch)/2.2),gl:u<BFF.touch?.05:.4};spOn=!room&&spt.a>.02;mikaOn=!fp;mx=BF_SX-44;if(room){mx=CEN_X}}
  // ---- silhuetas e fios (principal)
  if(!br){if(t>=46.2&&t<BF_M3+1.5){bfSil(c,BF_SX+8,FL,.3,Math.min(1,(t-46.2)/2.8),t,'kaim',true);bfSil(c,BF_SX+50,FL,.3,Math.min(1,(t-50.2)/3.0),t,'kami',false)}}
  if(spOn){sp=bfKneel(c,SPX,FL,spt.s,tt,spt)}
  if(!br&&t>=62&&sp){const p=ease(Math.min(1,(t-62)/1.8)),hx=sp.hand[0],hy=sp.hand[1],yy=lin(CEIL-30,hy,p);c.save();c.lineCap='round';c.globalCompositeOperation='lighter';c.strokeStyle='rgba(120,255,180,.35)';c.lineWidth=4;c.beginPath();c.moveTo(hx,CEIL-30);c.lineTo(hx+Math.sin(t*2)*.8,yy);c.stroke();c.globalCompositeOperation='source-over';c.strokeStyle='#9cf8c4';c.lineWidth=1.2;c.beginPath();c.moveTo(hx,CEIL-30);c.lineTo(hx+Math.sin(t*2)*.8,yy);c.stroke();c.strokeStyle='#eafff4';c.lineWidth=.5;c.stroke();c.restore()}
  if(fr&&sp&&u>=BFF.thr&&u<BFF.touch+.4){const pa=ease(Math.min(1,(u-BFF.thr)/1.2)),fa=u>BFF.touch?Math.max(0,1-(u-BFF.touch)/.4):1;c.save();c.lineCap='round';
    for(let i=0;i<9;i++){const ax=SPX-30+i*8+(hs(i,71)-.5)*6,bx=SPX+(i-4)*4.5+Math.sin(tt*1.5+i)*.8,by=FL-8-hs(i,72)*sp.hand[1]*0-(14+hs(i,73)*38),ty=lin(CEIL-30,by,pa);c.globalAlpha=.85*fa;c.globalCompositeOperation='lighter';c.strokeStyle='rgba(120,255,180,.3)';c.lineWidth=2;c.beginPath();c.moveTo(ax,CEIL-30);c.lineTo(bx,ty);c.stroke();c.globalCompositeOperation='source-over';c.strokeStyle=hs(i,74)>.5?'#9cf8c4':'#58e89a';c.lineWidth=.6;c.beginPath();c.moveTo(ax,CEIL-30);c.lineTo(bx,ty);c.stroke()}c.restore()}
  // fio dourado (eliminar)
  if(el&&sp&&u>=BFE.thread&&!room){const hx=sp.top[0],hy=sp.top[1]+3,al=Math.min(1,(u-BFE.thread)/.6),pr=ease(Math.min(1,(u-BFE.thread)/1.2));
    B.hx=hx;B.hy=hy-4;if(u<BFE.cut+.09){bfGold(c,hx,CEIL-40,hx,lin(CEIL-40,hy,pr),u,al)}
    else{const k=u-BFE.cut-.09,fa=Math.max(0,1-k/.9);bfGold(c,hx,CEIL-40-k*30,hx+k*4,hy-12-k*40,u*3,fa,3);bfGold(c,hx,hy,hx-k*10,hy+k*18,u*4,fa,3)}}
  // ---- Mika
  if(mikaOn&&!fp){let ar=null,tgt=null,ar2=null,bigS=null;
    if(el&&EL&&!room&&mikaOn){const cl=v=>Math.max(0,Math.min(1,v)),sl=ease(cl((u-BFE.cut)/.09)),raise=ease(cl((u-BFE.stop)/.7)),lw=ease(cl((u-BFE.cut-1.8)/1.0)),th=EL.th,a0=th-.2,wind=ease(cl((u-(BFE.cut-.45))/.45));
      const low=.3,aim=u<BFE.cut?lin(low,a0,raise)-.14*wind:lin(a0-.14,1.0,sl),dx=sl*5*(1-lw)-wind*1.6*(u<BFE.cut?1:0),dy=sl*1.4*(1-lw),sf=EL.sf;
      const bob=u<BFE.stop?-Math.abs(Math.sin(u*2.2*Math.PI/1))*.9:0;
      bfMikaK(c,mx,FL+bob,{blend:raise,wf:Math.floor(u*2.2),ang:aim,dx,dy,rot:sl*.05*(1-lw)+wind*-.02,a:1});
      const hX=mx+dx+12.9,hY=FL+dy-24.1;
      if(u>=BFE.cut&&u<BFE.cut+.22){const k=1-(u-BFE.cut)/.22,sw=ease(cl((u-BFE.cut)/.09));c.save();c.globalCompositeOperation='lighter';c.lineCap='round';for(const [w,col] of [[5,'rgba(255,170,200,'+.35*k+')'],[2,'rgba(255,255,255,'+.9*k+')']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.arc(hX,hY,EL.L*.95,a0-.14,lin(a0-.14,1.0,sw));c.stroke()}c.restore()}
      mk={h:[hX,hY]}}
    if(fr&&!room){const w=ease(Math.max(0,Math.min(1,(u-BFF.arm0)/(BFF.arm1-BFF.arm0)))),w2=u>BFF.mika0?1-ease(Math.min(1,(u-BFF.mika0)/.8)):1;ar=w*w2>.02?[lin(.18,1.42,w*w2),lin(.2,.12,w*w2)]:null;glow=u>BFF.arm1-.5?.8*w2:0}
    if(!(el&&EL)){if(fr&&!room&&u<BFF.mika0){const cl=v=>Math.max(0,Math.min(1,v)),bl=ease(cl((u-(BFF.arm0-.3))/.5)),mxF=BF_SX-60;bfMika(c,mxF,FL,{P,k:.282,flip:true,al:1-bl});if(bl>0){bfMikaK(c,mxF,FL,{blend:1,knife:false,a:bl});if(u>BFF.arm1-.5){const hx=mxF+12.9,hy=FL-24.1;c.save();c.globalCompositeOperation='lighter';const gg=c.createRadialGradient(hx+3,hy,1,hx+3,hy,16);gg.addColorStop(0,'rgba(170,255,210,.8)');gg.addColorStop(1,'rgba(170,255,210,0)');c.fillStyle=gg;c.fillRect(hx-16,hy-16,40,32);c.restore()}}}
    else mk=bfMika(c,fr&&!room?BF_SX-60:mx,FL,{P,k:fr&&!room?.282:kM,flip:true,al:1})}}
  // partículas
  for(const q of B.pts){const a=Math.max(0,Math.min(1,q.l/q.m));c.globalAlpha=a;c.fillStyle=q.gold?'#ffd870':a>.5?'#c8ffe0':'#4fe898';const zz=a>.6?1.1:.8;c.fillRect(Math.floor(q.x*2)/2,Math.floor(q.y*2)/2,zz,zz)}c.globalAlpha=1;
  c.restore();
  // ---- luz / escuro
  const L=[];if(mikaOn&&!fp)L.push({x:mx,y:FL-24,r:room?150:112,tint:fr&&room?'rgba(120,255,190,.14)':null});if(spOn)L.push({x:SPX,y:FL-30,r:110,tint:spt.red>.5?'rgba(255,50,80,.12)':'rgba(80,255,170,.1)'});
  if(fp)L.push({x:fx,y:fy,r:300});if(room)L.push({x:CEN_X,y:FL-60,r:260});
  bcDark(c,{fx,fy,z,rot:0},shx,shy,L,tm,room?(el?.82:.7):fp?.84:.9);
  if(B.flash>0){c.fillStyle='rgba(255,255,255,'+Math.min(.6,B.flash)+')';c.fillRect(0,0,640,360)}
  // ---- efeitos específicos
  if(fp){const vg=c.createRadialGradient(320,180,120,320,180,420);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(2,0,6,.85)');c.fillStyle=vg;c.fillRect(0,0,640,360);
    const hu=ease(Math.max(0,Math.min(1,(u-BFF.fp1-.2)/(BFF.touch-BFF.fp1-.6))));fpHand(c,hu,tm,u>BFF.touch-.8?Math.min(1,(u-BFF.touch+.8)):.15);
    if(u>=BFF.touch&&u<BFF.touch+.5){c.fillStyle='rgba(190,255,220,'+(1-(u-BFF.touch)/.5)*.45+')';c.fillRect(0,0,640,360)}}
  if(fr&&u>=BFF.light0&&u<BFF.light0+2.2){const k=(u-BFF.light0)/1.8,x=lin(-120,760,k);c.save();c.globalCompositeOperation='lighter';const g2=c.createLinearGradient(x-110,0,x+110,0);g2.addColorStop(0,'rgba(120,255,190,0)');g2.addColorStop(.5,'rgba(150,255,205,.42)');g2.addColorStop(1,'rgba(120,255,190,0)');c.fillStyle=g2;c.fillRect(x-110,0,220,360);c.restore()}
  if(fr&&room){const k=Math.min(1,(u-BFF.world)/2);c.fillStyle='rgba(110,255,180,'+(.17*k)+')';c.fillRect(0,0,640,360)}
  // ---- falas
  if(!B.mon0)B.mon0=0;
  bfLines(c,br?(el?BFTE:BFTF):BFTX,tt,tm);
  if(!br&&t>=64.0&&t<65.6){const a=Math.min(1,(t-64.0)*5,(65.6-t)*4),amt=.5+.5*(hs(Math.floor(tm*16),4)>.5?1:0);c.save();c.globalAlpha=a;gtext(c,'ELIMINAR',320+Math.sin(tm*40)*3,176,60,tm,amt,'italic bold',REDP);c.globalCompositeOperation='lighter';gtext(c,'LIBERTAR',320-Math.sin(tm*37)*3,184,60,tm,amt,'italic bold');c.restore()}
  // transições
  if(!br){bfDip(c,t,57.85,.5)}else if(fr){bfDip(c,u,6.2,.6);bfDip(c,u,11.5,.5)}else{if(B.cutDone&&B.cz<.4){const k=1-B.cz/.4;c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,240,190,'+k+')';c.lineWidth=3+14*k;c.beginPath();c.moveTo(-20,60);c.lineTo(660,300);c.stroke();c.strokeStyle='rgba(255,255,255,'+k+')';c.lineWidth=2;c.stroke();c.restore()}}
  // monitor
  bfMonitor(c,B,tm);
  // barras + REC
  const bh=34*(1-Math.min(1,(B.mk||0)*1.6)),sec=Math.floor(tt),frm=Math.floor((tt-sec)*24);
  if(bh>.5){c.fillStyle='#000';c.fillRect(0,0,640,bh);c.fillRect(0,360-bh,640,bh);if(bh>20){if(Math.floor(tm*1.6)%2===0){c.fillStyle='#ff3b5c';c.beginPath();c.arc(22,bh-12,3.2,0,TAU);c.fill()}ptext(c,'REC',30,bh-8,'bold 10px '+MONO,'#e8dfcc');ptext(c,'00:00:'+String(sec).padStart(2,'0')+':'+String(frm).padStart(2,'0'),640-84,bh-8,'10px '+MONO,'#9dffc8')}}
  // aviso final
  if(B.notice)bfNotice(c,el?'ATUALIZAÇÃO: RUPTURA [C]':'ATUALIZAÇÃO: TRAVESSIA [C]',el?'#a060ff':'#43e58f',tm);
  const ga=bfGl(B,t,tm);
  if(B.gsp==='split'||(!br&&t>=7.0&&t<8.4)){const k=Math.min(1,(t-7.0)*3,(8.4-t)*2);c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(140,50,255,'+.4*k+')';c.fillRect(0,0,320,360);c.fillStyle='rgba(255,30,60,'+.4*k+')';c.fillRect(320,0,320,360);for(let i=0;i<14;i++){if(hs(i,Math.floor(tm*18))>.5){const y=hs(i,5)*360;c.fillStyle=i%2?'rgba(255,60,90,.5)':'rgba(170,90,255,.5)';c.fillRect(i%2?320:0,y,320,3+hs(i,6)*10)}}c.restore()}
  if(!br&&t<.25){c.fillStyle='rgba(255,240,240,'+(1-t/.25)+')';c.fillRect(0,0,640,360)}
  warp(c,Math.max(0,ga-.3)*.9,tm);c.drawImage(scan,0,0);glitch(c,Math.max(ga,fp?.04:0),tm)}
// ---------- integração ----------
const oU5=G.update;
G.update=function(dt){
  if(this.state==='bfin'&&this._bfz){if(!window.__bfManual)bfUpdate(this,dt);return}
  const b=this.enemies&&this.enemies.find(e=>e._sb);
  if(b&&b._ph===2&&!b.alive&&!b._fin&&this.state==='playing'&&!this.dialog&&!this.player.hasStitch){b._fin=true;b._done=true;bfStart(this,b);return}
  oU5.call(this,dt)};
const oD5=G.draw;
G.draw=function(){if(this.state==='bfin'&&this._bfz){bfDraw(this,this.ctx);return}oD5.call(this)};
window.__bfDbg={bfKneel,bfMika,bfSil,bfStart,upd:(g,dt)=>bfUpdate(g,dt),draw:(g)=>bfDraw(g,g.ctx)};


// =====================================================================
// MORTE: glitch forte → computador da abertura → "rebobinar fita" → fita parada → rebobina ao contrário → Mika no último terminal
// =====================================================================
const DCAM=[160,70,1.55];
const _mc=document.createElement('canvas').getContext('2d');
function pw(s,F){_mc.font=F;return _mc.measureText(s).width}
function segs(c,x,y,parts,n,F){let k=n,w=0;for(const [s,col] of parts){if(k<=0)break;const sh=s.slice(0,Math.max(0,Math.floor(k)));if(sh)ptext(c,sh,x,y,F,col);x+=pw(s,F);w+=pw(sh,F);k-=s.length}return w}
function tapeInfo(g){const lr=g.lastRest||{x:0,y:0};let best=null,bd=1e9;for(const it of g.interactives||[]){if(it.type!=='rest')continue;const d=Math.hypot(it.x+it.w/2-(lr.x+14),it.y-lr.y);if(d<bd){bd=d;best=it}}
  const zn=(px,py)=>{try{const z=zoneAt(Math.floor(px/16),Math.floor(py/16));return z&&z.name?z.name:'Casa Desfeita'}catch(e){return 'Casa Desfeita'}};
  if(best&&bd<140)return{zn:zn(best.x,best.y),hash:((Math.floor(best.x/16)*73+Math.floor(best.y/16)*131)&0xfff).toString(16).toUpperCase().padStart(3,'0')};
  return{zn:zn(lr.x,lr.y),hash:'000'}}
// se morreu lutando contra o Espírito do Véu: a sala volta como no salvamento (porta aberta, chefe intacto, intro de novo)
function miniReset(g){const b=g.enemies&&g.enemies.find(e=>e._sb);if(!b||!b._introDone||!b.alive)return;
  b.x=b.spawnX;b.y=b.spawnY;b.vx=0;b.vy=0;b.hp=b.maxHp=400;b.alive=true;b.permanentlyDead=false;b.hidden=true;b.aggro=false;b.bs='idle';b.bt=1000;b.dd=0;b.hitDone=false;
  b._introDone=false;b._intro=false;b._p2=false;b._ph=0;b._rn=null;b._fin=false;b._done=false;b._hurt=0;b.stunTimer=0;b.freezeTimer=0;b.atkPhase='idle';b.atkTimer=0;
  for(let r=0;r<3;r++)g.grid[184-r][79]=0;
  g.enemies=g.enemies.filter(e=>!e._proj);g._b2=null;g._bc=null;g._bossChoice=null;g._fa=0;g._sh=[];g._flash=0;g._bossRetry=true;
  delete g.drawHUD;delete g.drawInteractHints;delete g.drawToast;FRZ2=null}
function dthStart(g){const s=document.createElement('canvas');s.width=640;s.height=360;s.getContext('2d').drawImage(g.ctx.canvas,0,0,640,360);
  const ti=tapeInfo(g);g._rw={t:0,m:0,ph:'gl',snap:s,zn:ti.zn,hash:ti.hash,ang:0,sp:0,ready:false};g.state='rw'}
function dthUpdate(g,dt){const s=dt>1?dt/1000:dt,v=g._rw,i=g.input,pr=i.confirm()||i.interact();
  v.t+=s;
  if(v.ph==='gl'){if(v.t>=1.5){v.ph='pc';v.m=0}return}
  if(v.ph==='pc'){v.m+=s;if(pr&&v.m>1.2){if(v.m<4.8)v.m=4.8;else if(v.ready){v.ph='g2';v.t=0;return}}
    if(v.m>=4.8)v.ready=true;if(v.m>10){v.ph='g2';v.t=0}return}
  if(v.ph==='g2'){if(v.t>=.9){v.ph='cass';v.m=0;v.ang=0}return}
  if(v.ph==='cass'){v.m+=s;v.ang=(v.m>.9&&v.m<1.2)?Math.sin((v.m-.9)/.3*Math.PI)*.35:0;if(v.m>=2.3){v.ph='rew';v.m=0;v.ang=0}return}
  if(v.ph==='rew'){v.m+=s;v.sp=2+ease(v.m/2.6)*30;v.ang-=v.sp*s;
    if(v.m>=3.0){miniReset(g);const p=g.player;p.dead=false;p.hp=CONFIG.PLAYER.MAX_HP;p.energy=CONFIG.PLAYER.MAX_ENERGY;p.x=g.lastRest.x;p.y=g.lastRest.y;p.vx=0;p.vy=0;p.stains=[];p.jumpsLeft=2;p.invuln=1500;p.knockbackTimer=0;
      const W=g.grid[0].length*16,H=g.grid.length*16;g.camera.x=Math.max(0,Math.min(W-CONFIG.INTERNAL_W,p.x-CONFIG.INTERNAL_W/2+14));g.camera.y=Math.max(0,Math.min(H-CONFIG.INTERNAL_H,p.y-CONFIG.INTERNAL_H/2+10));
      v.ph='out';v.t=0}return}
  if(v.ph==='out'){if(v.t>=1.4){g._rw=null;g.state='playing';g.showMsg('Fita rebobinada.')}}}
function dthBase(t){b.drawImage(cached('s2',BG2),0,0);R(b,SX,SY,SW,SH,TL);b.fillStyle='rgba(60,140,130,'+(.08+.02*Math.sin(t*40))+')';b.fillRect(SX,SY,SW,SH)}
function dthFx(t){for(let y=SY;y<SY+SH;y+=2)R(b,SX,y,SW,1,'rgba(0,0,0,.18)');b.fillStyle='rgba(216,239,230,.06)';b.fillRect(SX,SY+((t*22)%SH),SW,6)}
function dthTerm(v,m,t){const F='bold 10px '+MONO,x=SX+10;
  const L=[[.3,SY+14,[['C:/FLUXO/FITA/',TX]]],[1.0,SY+28,[['> ',TX],['mika.exe',TYL],[' encerrado (0xFADE)',RO]]],[2.1,SY+42,[['> a fita parou de girar.',TX]]],
    [3.1,SY+60,[['> rebobinar: ',TX],['['+v.zn+']',TYL]]],[3.9,SY+74,[['  fita 0x'+v.hash+' \u00B7 \u00FAltimo salvamento',LI]]]];
  L.forEach((l,i)=>{if(m<l[0])return;const n=(m-l[0])*26,len=l[2].reduce((a,q)=>a+q[0].length,0);if(i===3)selBar(b,SX+6,l[1]-9,SW-12,13);
    const w=segs(b,x,l[1],l[2],n,F);if(n<len&&Math.floor(t*8)%2)R(b,x+w+1,l[1]-8,5,9,TX)});
  if(m>=4.8&&Math.floor(t*2)%2)termFoot(b,SX,SY+SH-11,SW,[['ENTER','rebobinar fita']]);else if(m>=4.8)termFoot(b,SX,SY+SH-11,SW,[['ENTER','']])}
function dthCass(v,t,rew,m){const cx=SX+SW/2,cy=SY+50,x0=cx-48,y0=cy-30,F7='bold 7px '+MONO;
  ptext(b,'FITA 0x'+v.hash,SX+8,SY+12,'bold 8px '+MONO,TX);
  R(b,x0-1,y0-1,98,62,'#0c0810');R(b,x0,y0,96,60,'#2a2230');R(b,x0,y0,96,1,'#4a3f5c');R(b,x0,y0,1,60,'#4a3f5c');
  for(const [sx,sy] of[[3,3],[90,3],[3,54],[90,54]])R(b,x0+sx,y0+sy,3,3,'#6a5c7c');
  R(b,x0+8,y0+5,80,22,'#d8cdb0');R(b,x0+8,y0+5,80,3,'#c8284a');R(b,x0+8,y0+26,80,1,'#8a7a6a');
  ptext(b,'L\u00DAMEN FITA',x0+11,y0+14,'bold 6px '+MONO,'#7a2a44');let z=v.zn;if(z.length>19)z=z.slice(0,19);ptext(b,z,x0+11,y0+23,F7,'#2a1c28');
  R(b,x0+20,y0+31,56,20,'#0c0810');
  for(const [rx,sg] of[[x0+33,1],[x0+63,1]]){ell(b,rx,y0+41,8,8,'#1c120e');ell(b,rx,y0+41,5,5,'#e8dfcc');ell(b,rx,y0+41,2,2,'#120c14');
    for(let k=0;k<6;k++){const a=v.ang*sg+k*TAU/6;R(b,rx+Math.cos(a)*3.4,y0+41+Math.sin(a)*3.4,1,1,'#120c14')}}
  R(b,x0+33,y0+49,30,1,'#5a3a24');R(b,x0+14,y0+53,68,5,'#0c0810');for(let k=0;k<6;k++)R(b,x0+20+k*10,y0+54,6,3,'#3a3048');
  if(rew){const c=Math.max(0,Math.floor(300*(1-m/3)));ptext(b,'\u25C0\u25C0 REBOBINANDO',SX+8,SY+SH-16,'bold 8px '+MONO,TYL);ptext(b,String(c).padStart(3,'0'),SX+SW-8,SY+SH-16,'bold 8px '+MONO,TX,'r')}
  else ptext(b,'\u25A0 PARADA',SX+8,SY+SH-16,'bold 8px '+MONO,RO);
  termFoot(b,SX,SY+SH-11,SW,[['FITA','0x'+v.hash],['ESC','---']])}
function vhs(c,t,amt){tc.drawImage(c.canvas,0,0);const f=Math.floor(t*12);for(let i=0;i<5;i++){const y=Math.floor(hs(i,f)*340),h=6+Math.floor(hs(i,f+3)*20),dx=Math.round((hs(i,f+5)-.5)*120*amt);c.drawImage(tmp,0,y,640,h,dx,y,640,h)}
  c.save();for(let i=0;i<14;i++){c.globalAlpha=.25*amt;c.fillStyle=hs(i,f)>.5?'#e8dfcc':'#D27A8A';c.fillRect(0,Math.floor(hs(i,f+9)*360),640,1+Math.floor(hs(i,f+4)*2))}c.restore()}
function dthDraw(g,c,oDraw){const v=g._rw,t=performance.now()/1000;c.imageSmoothingEnabled=false;
  if(v.ph==='out'){g.state='playing';try{oDraw.call(g)}finally{g.state='rw'}const k=v.t/1.4,a=Math.max(0,1-k);
    glitch(c,a*1.1,t);vhs(c,t,a);c.drawImage(scan,0,0);if(v.t<.18){c.fillStyle='rgba(232,223,204,'+(1-v.t/.18)*.9+')';c.fillRect(0,0,640,360)}
    if(k<.7){c.globalAlpha=1-k/.7;ptext(c,'\u25C0\u25C0 FITA 0x'+v.hash,24,34,'bold 12px '+MONO,TYL);c.globalAlpha=1}return}
  if(v.ph==='gl'){const k=Math.min(1,v.t/1.5),f=Math.floor(t*30);c.fillStyle='#050308';c.fillRect(0,0,640,360);
    c.drawImage(v.snap,(hs(f,1)-.5)*k*28,(hs(f,2)-.5)*k*10,640,360);
    if(k>.25&&Math.floor(t*16)%4===0){c.save();c.globalCompositeOperation='difference';c.fillStyle='#e8dfcc';c.fillRect(0,0,640,360);c.restore()}
    glitch(c,.55+k*.75,t);glitch(c,.4+k*.6,t+3);vhs(c,t,k);c.drawImage(scan,0,0);
    if(k>.82){c.fillStyle='rgba(232,223,204,'+((k-.82)/.18)+')';c.fillRect(0,0,640,360)}return}
  const cam=v.ph==='rew'?[160,lin(70,90,ease(v.m/2.8)),lin(1.55,1.0,ease(v.m/2.8))]:DCAM;
  const showCass=v.ph==='cass'||v.ph==='rew'||(v.ph==='g2'&&v.t>=.45);
  dthBase(t);if(showCass)dthCass(v,t,v.ph==='rew',v.m);else dthTerm(v,v.ph==='g2'?9:v.m,t);dthFx(t);
  blit(c,{cam:()=>cam},0,t);c.drawImage(scan,0,0);
  let amt=0;
  if(v.ph==='pc')amt=Math.max(Math.max(0,1-v.m/.7)*.9,(Math.sin(t*2.3)>.92?.25:0));
  else if(v.ph==='g2')amt=1.0;
  else if(v.ph==='cass')amt=Math.max((v.m>.85&&v.m<1.25)?.7:0,(Math.sin(t*3.1)>.93?.3:0));
  else if(v.ph==='rew')amt=.3+ease(v.m/2.8)*.95;
  if(amt>0)glitch(c,amt,t);
  if(v.ph==='g2'||v.ph==='rew'){vhs(c,t,v.ph==='g2'?.9:.3+v.m/3*.7)}
  if(v.ph==='rew'){c.save();c.globalCompositeOperation='screen';c.globalAlpha=.1+.3*hs(Math.floor(t*9),5);c.drawImage(v.snap,(hs(Math.floor(t*9),6)-.5)*40,0);c.restore()
    if(v.m>2.7){c.fillStyle='rgba(232,223,204,'+Math.min(1,(v.m-2.7)/.3)+')';c.fillRect(0,0,640,360)}}
  if(v.ph==='pc'&&v.m<.3){c.fillStyle='rgba(232,223,204,'+(1-v.m/.3)*.8+')';c.fillRect(0,0,640,360)}}
const oUd=G.update;
G.update=function(dt){if(this.state==='rw'&&this._rw){dthUpdate(this,dt);return}const r=oUd.call(this,dt);if(this.state==='dead'&&!this._rw)dthStart(this);return r};
const oDd=G.draw;
G.draw=function(){if(this.state==='rw'&&this._rw){dthDraw(this,this.ctx,oDd);return}oDd.call(this)};
window.__dth={start:dthStart,tape:tapeInfo};

const ORS_DATA=window.LUMEN_DATA.ORS_DATA;  // dados em js/data/sprites-cinematicas.js


// =====================================================================
// ORFANATO_04: computador glitchado (sala da chave) → gravação de câmera de segurança → versões Kaim / Kami
// =====================================================================
const ORI={};for(const k in ORS_DATA){if(k[0]==='_')continue;const im=new Image();im.src=ORS_DATA[k].d;ORI[k]=im}
const OGDX=ORS_DATA._gdx;
function osp(k){const im=ORI[k];return im&&im.complete&&im.naturalWidth?im:null}
const _sil={};function osil(k){let s=_sil[k];if(!s){const im=osp(k);if(!im)return null;s=document.createElement('canvas');s.width=im.naturalWidth;s.height=im.naturalHeight;const q=s.getContext('2d');q.drawImage(im,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#050308';q.fillRect(0,0,s.width,s.height);_sil[k]=s}return s}
function spr(c,k,x,y,o){o=o||{};const im=osp(k);if(!im)return;const m=ORS_DATA[k];c.save();c.globalAlpha=o.al==null?1:o.al;c.translate(x,y);if(o.flip)c.scale(-1,1);c.imageSmoothingEnabled=true;c.drawImage(o.sil?osil(k):im,-m.ax,-m.ay);c.restore()}
const OMX=580,OFY=335,OGX0=330,OGPK=380,OGSL=OMX+OGDX,OPAUSE=40.0;
const OPAP=[];for(let i=0;i<16;i++)OPAP.push({x:440+hs(i,1)*170,y:OFY-10+hs(i,2)*26,r:(hs(i,3)-.5)*1.7,w:22+hs(i,4)*10,h:15+hs(i,5)*8,d:hs(i,6)>.45,c:['#d8cfbc','#e8dfcc','#cfc6d8','#d8c8c0'][i%4]});
OPAP[5]={x:438,y:OFY-2,r:.2,w:24,h:18,d:true,c:'#e8dfcc',pick:true};
function opaper(c,x,y,r,w,h,col,d,al){c.save();c.translate(x,y);c.rotate(r);c.globalAlpha=al==null?1:al;c.fillStyle='rgba(0,0,0,.28)';c.fillRect(-w/2+2,-h/2+3,w,h);c.fillStyle=col;c.fillRect(-w/2,-h/2,w,h);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(-w/2,-h/2,w,2);
  if(d){c.strokeStyle='#a64c68';c.lineWidth=1.6;c.beginPath();c.moveTo(-w*.32,h*.2);c.lineTo(-w*.1,-h*.2);c.lineTo(w*.1,h*.15);c.lineTo(w*.32,-h*.25);c.stroke();c.fillStyle='#4a6ab8';c.fillRect(-w*.36,h*.3,w*.3,2);c.fillStyle='#d8b050';c.fillRect(w*.1,h*.28,w*.2,2)}
  else{c.fillStyle='rgba(60,50,80,.5)';for(let i=0;i<3;i++)c.fillRect(-w*.36,-h*.28+i*h*.24,w*.72*(.6+.4*hs(i,w)),1)}c.restore()}
function ocrumple(c,x,y,k){const n=10,R0=k<1?lerp2(16,7,k):7;c.save();c.translate(x,y);c.rotate(k*2.4);c.beginPath();for(let i=0;i<n;i++){const a=i/n*TAU,rr=R0*(1-.34*k*hs(i,7))*(k<1?1+.35*(1-k)*Math.sin(i*2.1):1),px=Math.cos(a)*rr*(1+(1-k)*.5),py=Math.sin(a)*rr*(1-(1-k)*.25);i?c.lineTo(px,py):c.moveTo(px,py)}c.closePath();
  c.fillStyle='#d8cfbc';c.fill();c.strokeStyle='rgba(50,40,70,.7)';c.lineWidth=1;c.stroke();c.strokeStyle='rgba(120,100,140,.7)';c.beginPath();c.moveTo(-R0*.5,-R0*.2);c.lineTo(R0*.2,R0*.3);c.moveTo(0,-R0*.6);c.lineTo(R0*.3,-R0*.1);c.stroke();c.restore()}
const lerp2=(a,b,k)=>a+(b-a)*k;
// ---------- linha do tempo da cena (gravação) ----------
function ocam(u){const K=[[0,320,180,1],[13.6,320,180,1],[16.4,440,215,1.45],[26,470,215,1.55],[31.8,500,232,1.7],[35.8,530,260,2.0],[37.0,552,258,2.8],[37.5,556,255,3.0],[38.9,548,262,2.4],[41,548,268,2.25]];
  if(u<=0)return K[0].slice(1);for(let i=0;i<K.length-1;i++)if(u<K[i+1][0]){const e=ease((u-K[i][0])/(K[i+1][0]-K[i][0]));return[1,2,3].map(j=>lin(K[i][j],K[i+1][j],e))}return K[K.length-1].slice(1)}
function ocamKami(w){const e=ease(w/3.4);return[lin(548,574,e),lin(222,258,e),lin(2.25,4.3,e)]}
function ost(u){const s={gx:OGX0,gk:'g_idle',pair:null,paper:0,mk:'m_idle',gdy:Math.sin(u*1.8)*.8,ball:null};
  if(u>=10.6&&u<14.2){s.gx=lin(OGX0,OGPK,(u-10.6)/3.6);s.gk=(Math.floor(u/.42)%2)?'g_walk1':'g_walk2';s.gdy=Math.abs(Math.sin(u*7.5))*-1.4}
  else if(u>=14.2&&u<15.4){s.gx=OGPK;s.gk='g_crouch';s.gdy=0}
  else if(u>=15.4&&u<16.6){s.gx=OGPK;s.gk='g_pick';s.gdy=0}
  else if(u>=16.6&&u<31.8){s.gx=OGPK;s.gk='g_hold_np';s.paper=u<27.6?1:u<28.9?2:3}
  else if(u>=31.8&&u<35.8){s.gx=lin(OGPK,OGSL,(u-31.8)/4.0);s.gk=(Math.floor(u/.42)%2)?'g_walk1':'g_walk2';s.gdy=Math.abs(Math.sin(u*7.5))*-1.4}
  else if(u>=35.8){s.gx=OGSL;s.gdy=0;s.pair=u<36.6?'p1':u<37.0?'p2':u<37.4?'p3':u<37.55?'p4':u<37.75?'p5':u<37.95?'p6':u<38.35?'p7':(u<38.9&&Math.floor(u*22)%2?'p7':'p12')}
  else if(u<10.6){s.gx=OGX0}
  if(u>=29.0&&u<31.2)s.mk='m_reach';
  if(u>=31.8){const q=Math.min(1,(u-31.8)/.7),bx=OGPK+40+q*26,by=(OFY-116)+q*q*112-Math.abs(Math.sin(q*Math.PI*2.2))*10*(1-q);s.ball=[bx,Math.min(by,OFY-5)]}
  return s}
const OCAP=[[1.4,3.6,'g','O que significa isso?'],[3.9,6.6,'m','Eu estava procurando uma coisa...'],[6.9,9.9,'g','Eu não perguntei o que estava fazendo.'],[17.4,19.4,'g','Olhe para este lugar.'],[19.9,21.9,'m','Eu ia arrumar...'],[22.4,23.2,'g','Ia...'],[24.6,27.2,'g','Você sempre tem uma desculpa.'],[29.3,30.9,'g','Nem tente.']];
const osc=document.createElement('canvas');osc.width=640;osc.height=360;const oq=osc.getContext('2d');
const osg=document.createElement('canvas');osg.width=640;osg.height=360;const og=osg.getContext('2d');
function oroomBG(c,t){const px=new Proxy(c,{get(o,k){const v=o[k];if(k==='drawImage')return(im,...a)=>{if(im===scan)return;return o.drawImage(im,...a)};return typeof v==='function'?v.bind(o):v},set(o,k,v){o[k]=v;return true}});drawRoom({player:null,_rm:null},px,t,true)}
function ogovDraw(c,st,sil,al){const y=OFY+st.gdy;
  if(st.pair){if(st.pair==='p12')spr(c,'p12g',OMX,OFY,{sil,al});else spr(c,st.pair,OMX,OFY,{sil,al});return}
  spr(c,st.gk,st.gx,y,{sil,al});if(sil)return;
  if(st.paper===1)opaper(c,st.gx+40,y-116,-.18,19,29,'#e8dfcc',true);
  else if(st.paper===2){const k=Math.min(1,(st._u-27.6)/1.3);if(k<.55)opaper(c,st.gx+40,y-116,-.18+k*1.2,lerp2(19,12,k/.55),lerp2(29,14,k/.55),'#e8dfcc',true);else ocrumple(c,st.gx+40,y-114,(k-.55)/.45)}
  else if(st.paper===3)ocrumple(c,st.gx+40,y-114,1)}
function oscene(u,o){o=o||{};const c=o.only?og:oq,st=ost(u);st._u=u;const cam=o.cam||ocam(u);
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  if(o.only){c.clearRect(0,0,640,360)}else{c.fillStyle='#06040a';c.fillRect(0,0,640,360)}
  c.save();c.translate(320,180);c.scale(cam[2],cam[2]);c.translate(-cam[0],-cam[1]);
  if(o.only==='gov'){ogovDraw(c,st,true,1)}
  else{oroomBG(c,u);
    OPAP.forEach((p,i)=>{if(p.pick&&u>=15.6)return;opaper(c,p.x,p.y,p.r,p.w,p.h,p.c,p.d)});
    if(st.ball)ocrumple(c,st.ball[0],st.ball[1],1);
    // Mika
    if(!st.pair){c.save();spr(c,st.mk,OMX,OFY,{flip:true});c.restore()}
    else if(st.pair==='p12'){spr(c,'p12m',OMX,OFY,{al:o.mikaAl==null?1:o.mikaAl})}
    if(o.gov!=='skip')ogovDraw(c,st,false,1)}
  c.restore();return st}
// ---------- visual de câmera de segurança ----------
const osn=document.createElement('canvas');osn.width=160;osn.height=90;const osq=osn.getContext('2d'),osd=osq.createImageData(160,90);
function osnow(c,T,a){const f=Math.floor(T*30),d=osd.data;for(let i=0;i<14400;i++){const v=hs(i,f)>.5?255:Math.floor(hs(i,f+7)*150);d[i*4]=d[i*4+1]=d[i*4+2]=v;d[i*4+3]=Math.floor(hs(i,f+3)*255*a)}osq.putImageData(osd,0,0);c.save();c.imageSmoothingEnabled=false;c.globalCompositeOperation='screen';c.drawImage(osn,0,0,640,360);c.restore()}
function otrack(c,T,a,y0,h){tc.drawImage(c.canvas,0,0);const f=Math.floor(T*24);for(let y=0;y<h;y+=3){const dx=Math.round((hs(y,f)-.5)*50*a),yy=y0+y;c.drawImage(tmp,0,yy,640,3,dx,yy,640,3)}
  c.save();for(let y=0;y<h;y+=2){c.globalAlpha=.55*a*hs(y,f+3);c.fillStyle=hs(y,f+5)>.4?'#e8f4ea':'#303a34';c.fillRect(0,y0+y,640,1+Math.floor(hs(y,f+9)*2))}c.restore()}
function ocamPost(c,src,u,T,o){o=o||{};const wash=o.wash||0,bs=o.bs||1;
  c.save();c.imageSmoothingEnabled=false;
  if(bs>1){const sw=Math.ceil(640/bs),sh=Math.ceil(360/bs),q=ofs(sw,sh);q.drawImage(src,0,0,sw,sh);c.imageSmoothingEnabled=true;c.drawImage(q.canvas,0,0,sw,sh,0,0,640,360);c.imageSmoothingEnabled=false}else c.drawImage(src,0,0);
  c.globalCompositeOperation='saturation';c.globalAlpha=o.sat==null?.82:o.sat;c.fillStyle='hsl(0,0%,50%)';c.fillRect(0,0,640,360);
  c.globalCompositeOperation='multiply';c.globalAlpha=.55*(1-wash);c.fillStyle='#9fc8b4';c.fillRect(0,0,640,360);
  c.globalCompositeOperation='screen';c.globalAlpha=.1+wash*.55;c.fillStyle='#9ab0a4';c.fillRect(0,0,640,360);
  c.restore();}
const _ofs={};function ofs(w,h){const k=w+'x'+h;let q=_ofs[k];if(!q){const cv=document.createElement('canvas');cv.width=w;cv.height=h;q=cv.getContext('2d');q.imageSmoothingEnabled=true;_ofs[k]=q}return q}
function opad(n){return String(n).padStart(2,'0')}
function ohdr(c,u,paused,T){const F='bold 15px '+MONO;
  if(paused){R(c,16,12,5,14,'#e8dfcc');R(c,25,12,5,14,'#e8dfcc');ptext(c,'PAUSE',40,25,F,Math.floor(T*1.8)%2?'#e8dfcc':'#8a8a80')}
  else{if(Math.floor(T*1.7)%2)ell(c,23,19,6,6,'#ff4a5a');ptext(c,'REC',38,25,F,'#ffd0d4')}
  ptext(c,'CAM 04  QUARTO INFANTIL',172,25,'bold 13px '+MONO,'#c8dccf');
  const s=40+Math.floor(u);ptext(c,'1998/10/14  03:'+opad(12+Math.floor(s/60))+':'+opad(s%60),624,25,F,'#e8f4ea','r')}
function ocapDraw(c,u){for(const [t0,t1,who,txt] of OCAP){if(u<t0||u>t1+.4)continue;const n=Math.floor((u-t0)*30),sh=txt.slice(0,n),a=Math.min(1,(t1+.4-u)*4);if(!sh)continue;
  c.save();c.globalAlpha=a;const F='bold 16px '+MONO;_mc.font=F;const w=_mc.measureText(txt).width,lab=who==='g'?'GOVERNANTA':'MIKA';_mc.font='bold 11px '+MONO;const lw=_mc.measureText(lab).width+10;
  const bw=Math.max(w,0)+28+lw,x0=320-bw/2;c.fillStyle='rgba(0,0,0,.58)';c.fillRect(x0,40,bw,28);c.fillStyle=who==='g'?'#b8a0d8':'#e8a0b8';c.fillRect(x0,40,3,28);
  ptext(c,lab,x0+10,58,'bold 11px '+MONO,who==='g'?'#b8a0d8':'#e8a0b8');ptext(c,sh,x0+lw+14,59,F,'#f2ece6');c.restore()}}
// ---------- terminais em 640x360 ----------
const ots=document.createElement('canvas');ots.width=640;ots.height=360;const otq=ots.getContext('2d');
const OPAL={a:{bg:'#071210',fr:'#2a5a52',tx:'#d8efe6',dm:'#7fb8a8',ac:'#D27A8A',bar:'#4a2f8a'},r:{bg:'#12060a',fr:'#7a2236',tx:'#ffcad2',dm:'#c0707e',ac:'#ff4a6a',bar:'#6a1830'}};
function otFrame(c,T,k,title,gl){const P=OPAL[k];c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle='#030206';c.fillRect(0,0,640,360);
  R(c,10,6,620,348,'#1c1624');R(c,10,6,620,2,'#3a2a50');R(c,10,352,620,2,'#0a0810');R(c,14,10,612,340,'#0b0912');
  R(c,24,38,592,300,P.bg);R(c,24,38,592,300,'rgba(60,150,135,'+(.04+.02*Math.sin(T*9))+')');
  R(c,24,16,592,20,P.bar);R(c,24,36,592,1,'rgba(176,150,230,.7)');ptext(c,title,34,31,'bold 13px '+MONO,'#f0e8ff');R(c,590,22,8,8,'#f0d060');R(c,602,22,8,8,'#c8284a');
  for(let y=38;y<338;y+=3)R(c,24,y,592,1,'rgba(0,0,0,.24)');
  R(c,24,38+((T*46)%290),592,12,'rgba(216,239,230,.045)');
  if(hs(Math.floor(T*18),1)>.94)R(c,24,38,592,300,'rgba(255,255,255,.05)')}
function otFoot(c,items){R(c,24,320,592,18,'#3a2a5a');R(c,24,320,592,1,'#6a5a8a');let x=34;for(const [k,l] of items){ptext(c,k,x,333,'bold 12px '+MONO,TYL);x+=pw(k,'bold 12px '+MONO)+8;ptext(c,l,x,333,'12px '+MONO,'#e0d8f4');x+=pw(l,'12px '+MONO)+22}}
// linhas digitadas; ln=[texto,tamanho,estilo]; devolve {tot,done}
function otLines(c,T,u,ln,x0,y0,cps,k){const P=OPAL[k||'a'];let n=u*cps,y=y0,tot=0,done=true;
  ln.forEach((l,i)=>{const [s,sz,st]=l,len=s.length;tot+=len;const lh=sz>18?36:28,F='bold '+sz+'px '+MONO;
    if(len&&n>0){let sh=s.slice(0,Math.max(0,Math.floor(n)));if(sh.length<len)done=false;
      if(sh.length===len&&hs(i,Math.floor(T*9))>.985){const p=Math.floor(hs(i,Math.floor(T*9)+4)*len);sh=sh.slice(0,p)+CH[Math.floor(hs(p,Math.floor(T*9))*CH.length)]+sh.slice(p+1)}
      const j=hs(i,Math.floor(T*13))>.97?(hs(i,Math.floor(T*13)+2)-.5)*16:0,x=x0+j;
      if(st===2){c.fillStyle=P.bar;c.fillRect(x-8,y-sz-1,pw(s,F)+16,sz+9)}
      const ci=s.indexOf(':');
      if(st===1){ptext(c,sh,x,y,F,Math.floor(T*7)%2?P.ac:'#ffb0c0')}
      else if(ci>0&&st!==2){const a=sh.slice(0,ci+1),bb=sh.slice(ci+1);ptext(c,a,x,y,F,P.dm);if(bb)ptext(c,bb,x+pw(a,F),y,F,P.tx)}
      else ptext(c,sh,x,y,F,st===2?'#f0e8ff':P.tx);
      if(sh.length<len&&Math.floor(T*8)%2)R(c,x+pw(sh,F)+2,y-sz+2,sz*.55,sz-2,P.tx)}else if(len)done=false;
    n-=len;y+=lh});return{tot,done}}
function oarrow(c,x,y,z,press){const ar=[[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,4],[0,7,3],[3,6,2],[3,7,2]];y+=press?z:0;for(const [ax,ay,w] of ar)R(c,x+ax*z-z,y+ay*z-z,w*z+2*z,z*2,BK);for(const [ax,ay,w] of ar)R(c,x+ax*z,y+ay*z,w*z,z,CR)}
const OT1=[['ORFANATO',22,2],['ARQUIVO DE REGISTROS INTERNOS',16,0],['',16,0],['UNIDADE: 04',16,0],['LOCAL: QUARTO INFANTIL',16,0],['RESPONSÁVEL: GOVERNANTA',16,0],['',16,0],['ESTADO DO ARQUIVO: FRAGMENTADO',16,0]];
const OT1CPS=34,OT1END=123/34+.2;
const OT2=[['REGISTRO ENCONTRADO.',18,0],['',18,0],['DUAS INTERPRETAÇÕES DISPONÍVEIS.',18,0],['',18,0],['REPRODUZIR?',18,0]];
const OT2CPS=34,OT2BTN=63/34+.4;
const OBF='bold 18px '+MONO,OBY=84+28*5+2;
function obtn(){const sx=56,sw=pw('[ SIM ]',OBF),nx=56+pw('[ SIM ]   ',OBF),nw=pw('[ NÃO ]',OBF);return{sx,sw,nx,nw}}
function ot1(c,T,u){otFrame(c,T,'a','ARQUIVO.REM - registros internos',0);
  const r=otLines(c,T,u,OT1,56,82,OT1CPS,'a');// destaque FRAGMENTADO por flicker de bloco
  if(r.done&&Math.floor(T*3)%2)R(c,56,300,6,4,'#D27A8A');
  otFoot(c,[['...','aguardando']])}
function ot2(c,T,u,sel,up,fin){otFrame(c,T,'a','ARQUIVO.REM - registros internos',0);
  otLines(c,T,u,OT2,56,92,OT2CPS,'a');
  if(u>=OT2BTN){const B=obtn(),cx0=590,cy0=300,tgt=sel==='nao'?[B.nx+B.nw/2,OBY-6]:[B.sx+B.sw/2,OBY-6];
    const a=Math.min(1,(u-OT2BTN)*4);c.save();c.globalAlpha=a;
    const hov=sel?(fin||u>=up+.8):false,clk=sel?(fin||(u>=up+.8&&u<up+1.1)):false;
    if(sel==='sim'&&hov){R(c,B.sx-6,OBY-19,B.sw+12,26,clk?CR:'#6a5a8a')}
    if(sel==='nao'&&hov){R(c,B.nx-6,OBY-19,B.nw+12,26,clk?CR:'#6a5a8a')}
    ptext(c,'[ SIM ]',B.sx,OBY,OBF,sel==='sim'&&hov?(clk?BK:'#fff2c0'):OPAL.a.tx);ptext(c,'[ NÃO ]',B.nx,OBY,OBF,sel==='nao'&&hov?(clk?BK:'#fff2c0'):OPAL.a.tx);
    let ax=cx0,ay=cy0;if(sel){const e=fin?1:ease((u-up)/.8);ax=lin(cx0,tgt[0],e);ay=lin(cy0,tgt[1],e)}else{ax=cx0+Math.sin(T*1.7)*3;ay=cy0+Math.cos(T*1.3)*3}
    oarrow(c,ax,ay,2,clk);c.restore()}
  otFoot(c,u>=OT2BTN?[['E','SIM'],['F','NÃO']]:[['...','carregando']])}
// ---------- jigsaw ----------
function jedge(p,x0,y0,x1,y1,sg){if(!sg){p.lineTo(x1,y1);return}const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,vx=uy*sg,vy=-ux*sg,pt=(a,b)=>[x0+ux*L*a+vx*L*b,y0+uy*L*a+vy*L*b];
  p.lineTo(...pt(.36,0));p.bezierCurveTo(...pt(.36,.05),...pt(.28,.17),...pt(.5,.17));p.bezierCurveTo(...pt(.72,.17),...pt(.64,.05),...pt(.64,0));p.lineTo(x1,y1)}
const JNX=8,JNY=5;
function jsg(i,j,k){return hs(i*13+j*7,k)>.5?1:-1}
function jpath(i,j,w,h){const p=new Path2D(),x=-w/2,y=-h/2;p.moveTo(x,y);
  jedge(p,x,y,x+w,y,j===0?0:-jsg(i,j-1,1));jedge(p,x+w,y,x+w,y+h,i===JNX-1?0:jsg(i,j,2));jedge(p,x+w,y+h,x,y+h,j===JNY-1?0:jsg(i,j,1));jedge(p,x,y+h,x,y,i===0?0:-jsg(i-1,j,2));p.closePath();return p}
const jcache={};function jp(i,j,w,h){const k=i+','+j+','+w+','+h;return jcache[k]||(jcache[k]=jpath(i,j,w,h))}
// k: 0..1 (peças se separando); fly: 0..1 (peças se espalhando de vez)
function ojig(c,k,T,fly,seed){tc.drawImage(c.canvas,0,0);const W=640/JNX,H=360/JNY;c.save();c.fillStyle='#05040a';c.fillRect(0,0,640,360);
  for(let j=0;j<JNY;j++)for(let i=0;i<JNX;i++){const id=j*JNX+i+(seed||0),cx=(i+.5)*W,cy=(j+.5)*H,d=k*6+(fly||0)*260,dx=(hs(id,1)-.5)*2*d,dy=(hs(id,2)-.5)*2*d*.8,r=((hs(id,3)-.5)*.16*k)+(fly||0)*(hs(id,4)-.5)*2.4,sc=1-(fly||0)*.25;
    c.save();c.translate(cx+dx,cy+dy);c.rotate(r);c.scale(sc,sc);const P=jp(i,j,W,H);c.clip(P);c.drawImage(tmp,-cx,-cy);
    c.fillStyle='rgba(0,0,0,'+(.18*k*hs(id,5))+')';c.fillRect(-W,-H,W*2,H*2);c.restore();
    c.save();c.translate(cx+dx,cy+dy);c.rotate(r);c.scale(sc,sc);c.strokeStyle='rgba(0,0,0,'+(.85*k)+')';c.lineWidth=2.2;c.stroke(P);c.strokeStyle='rgba(200,180,240,'+(.35*k)+')';c.lineWidth=.8;c.stroke(P);c.restore()}
  c.restore()}
function ocracks(c,k,T){c.save();c.strokeStyle='rgba(235,225,255,.9)';c.lineWidth=2;const cx=320+Math.sin(T*3)*3,cy=180;for(let r=0;r<9;r++){const a=r/9*TAU+hs(r,3)*.5;let x=cx,y=cy;c.beginPath();c.moveTo(x,y);const L=lin(0,700,k*(.6+hs(r,4)*.6));for(let s=0;s<L;s+=26){const aa=a+(hs(r*40+s,5)-.5)*.9;x+=Math.cos(aa)*26;y+=Math.sin(aa)*26;c.lineTo(x,y)}c.stroke()}c.restore()}
// ---------- textos de voz ----------
const OVR={fill:'#ffd6dc',sh:'#3a0610',edge:'#ff2a45',out:'#12020a'},OVK={fill:'#f4eaff',sh:'#241838',edge:'#b89cff',out:'#0b0614'};
const OVCH='abcdefghijklmnopqrstuvwxyz#%&@$?*+=/|<>~^';
function ovoice(c,txt,u,t0,t1,T,pal,amt,y,size){if(u<t0||u>t1)return;const a=Math.min(1,(t1-u)*3,(u-t0)*5);if(a<=0)return;c.save();c.globalAlpha=a;const n=Math.floor((u-t0)*20);gtext(c,txt,320,y==null?180:y,size||30,T,amt==null?.35:amt,'italic bold',pal);c.restore()}
function oscr(word,T,k){let s='';for(let i=0;i<word.length;i++)s+=hs(i,Math.floor(T*16))<k?OVCH[Math.floor(hs(i*5,Math.floor(T*16)+2)*OVCH.length)]:word[i];return s}
// ---------- etapas da cena ----------
function ofStart(g,pc,ver){const p=g.player;if(p){p.vx=0;p.vy=0}g._of={ph:'t1',u:0,T:0,ver:ver||(p&&p.dashMode==='cut'?'kaim':'kami'),pc,sel:null,up:0,wait:false};g.state='orf'}
function ofEnd(g,flag){const v=g._of;g._orf=flag;if(v&&v.pc)v.pc.collected=true;g._of=null;g.state='playing';g.showMsg(flag==='no'?'O terminal se apagou.':'Registro reproduzido.')}
function ofKey(g,k){if(window.__orfManual){const q=window.__orfQ||(window.__orfQ={});if(q[k]){q[k]=0;return true}return false}return g.input.wasPressed(k)}
const OKT=[['ARQUIVO: ORFANATO_04',16,0],['MEMÓRIA: Danosa',16,0],['',16,0],['AÇÃO SOLICITADA:',16,0],['ELIMINAÇÃO DEFINITIVA',20,1],['',16,0]];
const OKT_CPS=32,OKT_D=(20+15+0+17+21)/32+.3;
const OKE=[['ERRO 0x04',22,1],['',16,0],['EXCLUSÃO IMPOSSÍVEL.',16,0],['',16,0],['A MEMÓRIA POSSUI UMA',16,0],['REFERÊNCIA EXTERNA ATIVA.',16,0],['',16,0],['ORIGEM: GOVERNANTA',16,1]];
const OMT=[['ARQUIVO: ORFANATO_04',0],['MEMÓRIA: DANOSA',0],['INTEGRIDADE: FRAGMENTADA',0],['',0],['AÇÃO SOLICITADA:',0],['RESTAURAÇÃO / CURA',1]];
const OMT_CPS=22,OMT_D=(20+15+24+0+17+18)/22+.3;
function ofUpdate(g,dt){const v=g._of,s=Math.min(.05,dt>1?dt/1000:dt);v.u+=s;v.T+=s;const u=v.u;
  switch(v.ph){
  case 't1':if(u>=OT1END+2.0){v.ph='t2';v.u=0}break;
  case 't2':v.wait=u>OT2BTN+.3&&!v.sel;if(v.wait){if(ofKey(g,'KeyE')){v.sel='sim';v.up=u}else if(ofKey(g,'KeyF')){v.sel='nao';v.up=u}}
    if(v.sel&&u>=v.up+1.3){v.ph=v.sel==='sim'?'yes':'no';v.u=0}break;
  case 'no':if(u>=3.6)ofEnd(g,'no');break;
  case 'yes':if(u>=3.2){v.ph='cam';v.u=0}break;
  case 'cam':{const w=u-OPAUSE;if(v.ver==='kaim'&&w>=17.6){v.ph='kt';v.u=0;v.sel=null}else if(v.ver==='kami'&&w>=19.0){v.ph='mt';v.u=0;v.sel=null}break}
  case 'kt':v.wait=u>=OKT_D+1.2&&!v.sel;if(v.wait&&ofKey(g,'KeyF')){v.sel=1;v.up=u}if(v.sel&&u>=v.up+.8+5.0+1.2+12.6)ofEnd(g,'done');break;
  case 'mt':v.wait=u>=OMT_D+1.2&&!v.sel;if(v.wait&&ofKey(g,'KeyE')){v.sel=1;v.up=u}if(v.sel&&u>=v.up+10.6)ofEnd(g,'done');break}}
function ofDraw(g,c){const v=g._of,u=v.u,T=v.T;c.imageSmoothingEnabled=false;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  const ph=v.ph;
  if(ph==='t1'||ph==='t2'||ph==='no'||ph==='yes'){
    if(ph==='t1'){ot1(otq,T,u)}else if(ph==='t2'){ot2(otq,T,u,v.sel,v.up,false)}else{ot2(otq,T,99,v.sel,0,true)}
    c.drawImage(ots,0,0);
    let gl=0.04*(hs(Math.floor(T*6),3)>.8?1:0)+.03;
    if(ph==='t1'){gl+=(u>OT1END+1.7?(u-OT1END-1.7)*3:0)+(u<.3?.5:0)}
    if(ph==='t2'){gl+=Math.max(0,.9-u*2.6)+(v.sel&&u>=v.up+.8&&u<v.up+1.3?.6:0)}
    if(ph==='t1'||ph==='t2'){vhs(c,T,gl*.5);glitch(c,gl,T)}
    if(ph==='no'){const gA=u<.8?lin(.4,1,u/.8):0,rd=ease((u-.7)/.8),gB=u>=1.5&&u<2.5?1.0:0;
      if(rd>0){c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgba(255,40,60,'+rd*.9+')';c.fillRect(0,0,640,360);c.globalCompositeOperation='source-over';c.fillStyle='rgba(200,10,30,'+rd*.35+')';c.fillRect(0,0,640,360);c.restore();
        if(u>=1.0){ptext(c,'SINAL RECUSADO',320,190,'bold 22px '+MONO,'#ffe0e4','c')}}
      vhs(c,T,Math.max(gA,gB)*.6);glitch(c,Math.max(gA,gB),T);
      if(u>=2.5){const k=Math.min(1,(u-2.5)/1.0);tc.drawImage(c.canvas,0,0);c.fillStyle='#000';c.fillRect(0,0,640,360);
        if(k<.7){const sy=1-ease(k/.7)*.985;c.imageSmoothingEnabled=true;c.drawImage(tmp,0,0,640,360,0,180-180*sy,640,360*sy);c.globalCompositeOperation='lighter';c.globalAlpha=.4*ease(k/.7);c.drawImage(tmp,0,0,640,360,0,180-180*sy,640,360*sy);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
        else{const q=ease((k-.7)/.3),wd=640*(1-q);c.fillStyle='rgba(255,230,230,'+(1-q)+')';c.fillRect(320-wd/2,178,wd,3);ell(c,320,180,Math.max(1,6*(1-q)),Math.max(1,6*(1-q)),'rgba(255,240,240,'+(1-q)+')')}}
    }
    if(ph==='yes'){const gA=u<.7?lin(.3,.9,u/.7):.4+.5*Math.min(1,(u-.7)/1.6),z=1+.62*ease((u-.7)/1.6);
      if(u>=.7){tc.drawImage(c.canvas,0,0);c.fillStyle='#000';c.fillRect(0,0,640,360);let sy=1,sx=z;if(u>=2.3){const k=ease((u-2.3)/.8);sy=1-.97*k;sx=z+.5*k}
        c.imageSmoothingEnabled=true;c.save();c.translate(320,190);c.scale(sx,Math.max(.02,sy)*z);c.translate(-320,-190);c.drawImage(tmp,0,0);c.restore()}
      vhs(c,T,gA*.8);glitch(c,gA,T);if(u>=2.3)glitch(c,1.0,T+2);
      if(u>=2.8){c.fillStyle='rgba(232,240,235,'+Math.min(1,(u-2.8)/.4)+')';c.fillRect(0,0,640,360)}}
    c.drawImage(scan,0,0);return}
  if(ph==='cam'){
    const w=u-OPAUSE,uf=Math.min(u,OPAUSE),paused=u>=OPAUSE,kai=v.ver==='kaim',kam=v.ver==='kami';
    let cam=ocam(u);if(kam&&w>0)cam=ocamKami(w);
    // --- Kami: branco + montagem do computador ---
    if(kam&&w>=13.0){okamiAssemble(c,w,T);return}
    if(kai&&w>0){
      const k=ease((w-3)/8.5),sat=.82+.18*ease((w-.6)/3.4),bs=1+Math.floor(k*9);
      oscene(uf,{cam,gov:'skip',mikaAl:1-k*.8});ocamPost(c,osc,uf,T,{sat,wash:k,bs});
      const gl=oscene(uf,{cam,only:'gov'});c.drawImage(osg,0,0);
      c.save();c.globalCompositeOperation='source-over';c.drawImage(scan,0,0);c.restore();osnow(c,T,.14+k*.2);
      if(w>10){const cl=ease((w-10)/6.8),bh=180*cl;c.fillStyle='#000';c.fillRect(0,0,640,bh);c.fillRect(0,360-bh,640,bh);if(cl>.98){c.fillStyle='#000';c.fillRect(0,0,640,360);c.fillStyle='rgba(235,235,235,.8)';c.fillRect(320-300*(1-ease((w-16.8)/.7)),179,600*(1-ease((w-16.8)/.7)),2)}}
      otrack(c,T,.5,290,34);
      const gb=((w>1.2&&w<1.5)||(w>4.6&&w<4.9)||(w>8.4&&w<8.7)||(w>12.4&&w<12.8)||(w>15&&w<15.4))?.8:(hs(Math.floor(T*8),9)>.9?.25:0);
      if(gb)glitch(c,gb,T);
      // falas
      const KL=[[1.2,3.4,'Eu me lembro de tudo.'],[3.8,5.8,'Eu me lembro da voz.'],[6.2,8.0,'Eu me lembro da mão'],[8.4,10.6,'Do quão áspera era'],[11.0,13.0,'Por que guardar...']];
      for(const [a,b,t] of KL)ovoice(c,t,w,a,b,T,OVR,.3,200);
      if(w>=13.4&&w<=16.8){const kk=Math.min(.9,(w-13.4)/2.2+.1),txt='Se podemos '+(w>16.0?oscr('apagar',T,.9):oscr('apagar',T,kk));ovoice(c,txt,w,13.4,16.8,T,OVR,.4+kk*.5,200)}
      ohdr(c,uf,true,T);return}
    // --- cena normal / pausa (Kami inclusive até 13s) ---
    const pv=u<1.2?ease((u-.2)/1.0):1;
    oscene(uf,{cam});ocamPost(c,osc,uf,T,{});
    if(pv<1){c.fillStyle='rgba(0,0,0,'+(1-pv)+')';c.fillRect(0,0,640,360)}
    c.drawImage(scan,0,0);
    let sn=.13;if(u<1.2)sn=lerp2(1,.13,ease(u/1.2));osnow(c,T,sn);
    if(!paused){const gb=hs(Math.floor(T*3),4)>.93?.14:0;if(gb)vhs(c,T,gb);
      if(uf>=37.4&&uf<37.62){c.fillStyle='rgba(235,245,238,'+(.5*(1-(uf-37.4)/.22))+')';c.fillRect(0,0,640,360);glitch(c,.6,T)}
      if(uf>=37.95&&uf<38.9){glitch(c,.9,T);vhs(c,T,.8)}}
    else{ // pausa: tremor vertical, faixas de ruído, jitter
      const j=Math.round(Math.sin(T*43)*1.2);if(j){tc.drawImage(c.canvas,0,0);c.drawImage(tmp,0,j)}
      otrack(c,T,.7,276,52);otrack(c,T,.3,Math.floor((T*70)%300),14);
      if(w<.35){glitch(c,.9*(1-w/.35),T)}}
    ocapDraw(c,uf);ohdr(c,uf,paused,T);
    if(kam&&w>0){ // falas de Kami (voz)
      const ML=[[1.0,3.4,'Nunca deveria ter feito...'],[3.8,5.8,'A gente acreditar...'],[6.2,8.4,'Que não era suficiente.'],[9.0,11.8,'Mas eu não quero apagar isso.']];
      for(const [a,b,t] of ML)ovoice(c,t,w,a,b,T,OVK,.28,300);
      if((w>8.5&&w<8.95)||(w>11.8)){glitch(c,w>11.8?Math.min(1,(w-11.8)*3.5):.9,T);vhs(c,T,.6)}
      if(w>12){c.fillStyle='rgba(250,248,255,'+Math.min(1,(w-12)/1.0)+')';c.fillRect(0,0,640,360)}}
    return}
  if(ph==='kt'){const q=v.sel?u-v.up:-1;oKaimTerm(c,v,u,T,q);return}
  if(ph==='mt'){oKamiTerm(c,v,u,T);return}}
// ---------- Kaim: terminal de eliminação ----------
function oKaimTerm(c,v,u,T,q){
  const oc=ots;let state='ask';if(q>=0){if(q>=.8+5.0+1.2)state='err';else if(q>=.8)state='load';else state='click'}
  const E0=.8+5.0+1.2;
  if(state==='err'){const e=q-E0;otFrame(otq,T,'r','ERRO.SYS - falha critica',0);R(otq,24,38,592,300,'rgba(120,0,20,.18)');
    otq.strokeStyle='rgba(255,60,90,'+(.5+.4*Math.sin(T*14))+')';otq.lineWidth=4;otq.strokeRect(30,44,580,288);
    otLines(otq,T,e,OKE,56,86,38,'r');otFoot(otq,[['ERRO','0x04'],['---','sem resposta']])}
  else{otFrame(otq,T,'r','ARQUIVO.REM - eliminacao',0);
    const r=otLines(otq,T,u,OKT,56,86,OKT_CPS,'r');
    const bx=56,by=86+28*5+36+4,F='bold 20px '+MONO,bw=pw('[ CONFIRMAR ]',F);
    if(u>=OKT_D){const hov=u>=OKT_D+1.1||q>=0,clk=state==='click'&&q<.35;
      if(hov){R(otq,bx-6,by-22,bw+12,30,clk?CR:'#8a2a44')}
      ptext(otq,'[ CONFIRMAR ]',bx,by,F,hov?(clk?BK:'#fff2c0'):OPAL.r.tx);
      const e=ease((u-OKT_D)/1.1),ax=q>=0?bx+bw/2:lin(580,bx+bw/2,e),ay=q>=0?by-8:lin(310,by-8,e);oarrow(otq,ax,ay,2,clk)}
    if(state==='load'){const lp=Math.min(.8,.8*Math.min(1,(q-.8)/5.0)),stall=q>=5.8;R(otq,24,38,592,282,'#12060a');R(otq,24,38,592,300,'rgba(60,0,10,.55)');
      ptext(otq,'ELIMINANDO MEMÓRIA...',56,120,'bold 18px '+MONO,OPAL.r.tx);ptext(otq,'ORFANATO_04',56,148,'16px '+MONO,OPAL.r.dm);
      R(otq,56,180,520,26,'#2a0a12');otq.strokeStyle='#ff4a6a';otq.lineWidth=2;otq.strokeRect(56,180,520,26);R(otq,60,184,Math.floor(512*lp/.8*.8),18,stall&&Math.floor(T*10)%2?'#ff8a9a':'#ff2a45');
      ptext(otq,Math.floor(lp*100)+'%',584,200,'bold 18px '+MONO,'#ffd6dc','r');
      if(stall)ptext(otq,'...',56,240,'bold 18px '+MONO,'#ffb0c0');
      for(let i=0;i<5;i++)R(otq,56+i*104,214,98,3,'rgba(255,60,90,.35)')}
    otFoot(otq,state==='ask'&&u>=OKT_D+1.2?[['F','confirmar']]:[['...','processando']])}
  c.drawImage(oc,0,0);
  // distorções
  let gl=.05+(hs(Math.floor(T*7),2)>.85?.12:0);
  if(state==='click'&&q>.3)gl+=.7;if(state==='load'&&q<1.2)gl+=.5;if(state==='load'&&q>5.8)gl+=.2*(Math.floor(T*10)%2);
  let e=state==='err'?q-E0:0;
  if(state==='err'){if(e<.6)gl+=.9-e;
    if(e>=1.8&&e<4.4)gl+=.55;if(e>=4.8&&e<7.2){gl+=.5;owave(c,T,(.4+.6*Math.min(1,(e-4.8)/1.2)))}
    if(e>=10.4)gl+=1.0}
  vhs(c,T,Math.min(1,gl)*.6);glitch(c,Math.min(1.2,gl),T);
  if(state==='err'){ovoice(c,'EU MANDEI APAGAR',e,1.8,4.4,T,OVR,.8,180,38);ovoice(c,'Então é ela.',e,4.8,7.0,T,OVR,.5,180,34);ovoice(c,'Eu mesma resolvo...',e,7.4,10.2,T,OVR,.4,180,32);ovoice(c,'Isso.',e,10.4,12.0,T,OVR,1.0,180,44);
    if(e>=10.4){const k=Math.min(1,(e-10.4)/1.6);c.fillStyle='rgba(0,0,0,'+k*k+')';c.fillRect(0,0,640,360)}}
  c.drawImage(scan,0,0)}
function owave(c,T,a){tc.drawImage(c.canvas,0,0);for(let y=0;y<360;y+=3){const dx=Math.sin(y*.05+T*9)*14*a+Math.sin(y*.21+T*17)*5*a;c.drawImage(tmp,0,y,640,3,dx,y,640,3)}}
// ---------- Kami: montagem do computador (quebra-cabeça) ----------
function okamiAssemble(c,w,T){const k=Math.min(1,(w-13.0)/.6);c.fillStyle='#f4f2f8';c.fillRect(0,0,640,360);
  dthBase(T);
  const W=40,H=36;c.save();
  for(let j=0;j<JNY;j++)for(let i=0;i<JNX;i++){const id=j*JNX+i,ts=13.6+hs(id,9)*2.4,p=ease((w-ts)/.9);if(p<=0)continue;
    const cx=(i+.5)*80,cy=(j+.5)*72,ox=(1-p)*(hs(id,1)-.5)*900,oy=(1-p)*(hs(id,2)-.5)*600,rot=(1-p)*(hs(id,3)-.5)*3.2,sc=.6+.4*p;
    c.save();c.globalAlpha=Math.min(1,p*2);c.translate(cx+ox,cy+oy);c.rotate(rot);c.scale(sc,sc);const P=jp(i,j,80,72);c.clip(P);c.imageSmoothingEnabled=false;c.drawImage(buf,i*W-8,j*H-8,W+16,H+16,-56,-52,112,104);c.restore();
    c.save();c.globalAlpha=Math.min(1,p*2)*.7;c.translate(cx+ox,cy+oy);c.rotate(rot);c.scale(sc,sc);c.strokeStyle='rgba(40,30,70,.55)';c.lineWidth=1.4;c.stroke(P);c.restore()}
  c.restore();
  osnow(c,T,.06);
  if(w<14.2){const gl=Math.max(0,1-(w-13.0)*1.4);glitch(c,gl,T)}
  if(w<13.6){c.fillStyle='rgba(250,248,255,'+(1-(w-13.0)/.6)+')';c.fillRect(0,0,640,360)}
  c.save();c.globalAlpha=.9;
  ovoice(c,'Isso faz parte de quem...',w,13.4,16.4,T,{fill:'#2a1a40',sh:'#e8e0f8',edge:'#8a6ad0',out:'#f8f6ff'},.18,320,30);
  ovoice(c,'Somos.',w,17.2,18.9,T,{fill:'#2a1a40',sh:'#e8e0f8',edge:'#8a6ad0',out:'#f8f6ff'},.12,320,40);c.restore();
  c.drawImage(scan,0,0)}
// ---------- Kami: terminal de restauração (computador da abertura) ----------
function oKamiTerm(c,v,u,T){const q=v.sel?u-v.up:-1,F='bold 10px '+MONO;
  const cz=ease(u/1.4),cam=[160,lin(90,70,cz),lin(1.0,1.55,cz)];
  dthBase(T);
  OMT.forEach((l,i)=>{const ts=.6+(OMT.slice(0,i).reduce((a,m)=>a+m[0].length,0))/OMT_CPS,n=(u-ts)*OMT_CPS;if(!l[0]||n<=0)return;const y=SY+14+i*12+(i>=4?4:0),sh=l[0].slice(0,Math.floor(n));
    if(l[1])selBar(b,SX+6,y-9,SW-12,12);
    const ci=l[0].indexOf(':');if(ci>0&&!l[1]){const a=sh.slice(0,ci+1),bb=sh.slice(ci+1);ptext(b,a,SX+10,y,F,'#7fb8a8');if(bb)ptext(b,bb,SX+10+pw(a,F),y,F,TX)}else ptext(b,sh,SX+10,y,F,l[1]?'#f0e8ff':TX);
    if(sh.length<l[0].length&&Math.floor(T*8)%2)R(b,SX+10+pw(sh,F)+1,y-8,5,9,TX)});
  const by=SY+14+6*12+10,bw=pw('[ CONFIRMAR ]',F);
  const prog=q>=0?Math.min(.8,.8*Math.min(1,Math.max(0,(q-.6)/4.0))):0;
  if(u>=OMT_D&&q<.6){const hov=u>=OMT_D+1.1||q>=0,clk=q>=0&&q<.35;if(hov)R(b,SX+6,by-9,bw+8,12,clk?CR:V2);ptext(b,'[ CONFIRMAR ]',SX+10,by,F,hov?(clk?BK:'#fff2c0'):TX);
    const e=ease((u-OMT_D)/1.1),ax=q>=0?SX+10+bw/2:lin(SX+SW-16,SX+10+bw/2,e),ay=q>=0?by-3:lin(SY+SH-14,by-3,e);
    const ar=[[0,0,1],[0,1,2],[0,2,3],[0,3,4],[0,4,5],[0,5,6],[0,6,4],[0,7,3],[3,6,2],[3,7,2]];for(const [a1,a2,a3] of ar)R(b,ax+a1-1,ay+a2-1,a3+2,2,BK);for(const [a1,a2,a3] of ar)R(b,ax+a1,ay+a2,a3,1,CR)}
  if(q>=.6){R(b,SX+4,SY+55,SW-8,32,TL);ptext(b,'RESTAURANDO...',SX+10,SY+66,F,TX);R(b,SX+10,SY+71,150,9,'#0b0912');R(b,SX+10,SY+71,Math.floor(150*prog),9,'#b8a0d8');b.strokeStyle='#6a5a8a';b.strokeRect(SX+10.5,SY+71.5,149,8);ptext(b,Math.floor(prog*100)+'%',SX+SW-10,SY+79,F,TX,'r')}
  if(u>=OMT_D+.4&&q<0)termFoot(b,SX,SY+SH-11,SW,[['E','confirmar']]);else if(q>=0)termFoot(b,SX,SY+SH-11,SW,[['...','restaurando']]);
  dthFx(T);blit(c,{cam:()=>cam},0,T);c.drawImage(scan,0,0);
  // quebra-cabeça se formando
  let jk=q>=.6?Math.min(1,(q-.6)/4.0)*.8+(q>4.6?.2*Math.min(1,(q-4.6)/3.5):0):0;
  const crack=q>=8.4?Math.min(1,(q-8.4)/1.5):0;
  let gl=.04+(hs(Math.floor(T*7),2)>.88?.1:0);if(q>=0&&q<.6)gl+=.5;if(q>=.6&&q<4.7&&hs(Math.floor(T*10),4)>.85)gl+=.3;if(crack>0)gl+=.7+crack*.5;
  if(jk>0){ojig(c,Math.min(1,jk*1.1),T,crack>0?Math.pow(crack,2):0,0)}
  if(crack>0){ocracks(c,crack,T)}
  vhs(c,T,Math.min(1,gl)*.5);glitch(c,Math.min(1.3,gl),T);
  const ML=[[.8,3.0,'Não importa o quanto tente...'],[3.2,5.0,'Ainda está lá...'],[5.4,8.2,'Precisamos encontrá-la.']];
  for(const [a,b2,t] of ML)ovoice(c,t,q,a,b2,T,OVK,.25,300,28);
  if(q>=9.4){const k=Math.min(1,(q-9.4)/1.0);c.fillStyle='rgba(0,0,0,'+k+')';c.fillRect(0,0,640,360)}}
// ---------- integração ----------
const oUo=G.update;
G.update=function(dt){
  if(this.state==='orf'&&this._of){if(!window.__orfManual)ofUpdate(this,dt);return}
  if(this.interactives&&!this.interactives.some(i=>i.id==='orf_pc'))this.interactives.push({type:'orfpc',id:'orf_pc',x:168*16,y:110*16,w:32,h:16,collected:!!this._orf});
  return oUo.call(this,dt)};
const oDo=G.draw;
G.draw=function(){if(this.state==='orf'&&this._of){if(!window.__orfManual)ofDraw(this,this.ctx);return}oDo.call(this)};
const oHIo=G.handleInteractions;
G.handleInteractions=function(){
  if(this.input.interact()&&this.state==='playing'){const pc=this.interactives.find(i=>i.id==='orf_pc');
    if(pc&&!pc.collected){const hb=this.player.hitbox,r={x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24};
      if(rectOverlap(r,pc)){if(window.__svBusy&&window.__svBusy(this)){this.showMsg('O terminal está instável. Há perigo por perto.');return}ofStart(this,pc);return}}}
  return oHIo.call(this)};
function drawOrfPC(ctx,x,y,t,alive){ctx.save();ctx.translate(x+16,y);const fl=Math.floor(t*14);
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-20,-2,40,3);
  ctx.fillStyle='#2a2236';ctx.fillRect(-18,-12,36,10);ctx.fillStyle='#4a3e5c';ctx.fillRect(-18,-12,36,2);ctx.fillStyle='#17101e';ctx.fillRect(-16,-2,3,2);ctx.fillRect(13,-2,3,2);
  ctx.fillStyle='#3a3050';ctx.fillRect(-13,-36,26,24);ctx.fillStyle='#5a4a72';ctx.fillRect(-13,-36,26,2);ctx.fillRect(-13,-36,2,24);ctx.fillStyle='#17101e';ctx.fillRect(-10,-33,20,17);
  if(alive){ctx.fillStyle='#0a1612';ctx.fillRect(-9,-32,18,15);
    for(let r=0;r<5;r++){const yy=-32+r*3,o=hs(r,fl)>.8?(hs(r,fl+3)-.5)*8:0;ctx.fillStyle=hs(r,fl+1)>.6?'#D27A8A':'#5ff0c0';ctx.fillRect(-8+o,yy,4+hs(r,fl+5)*10,1.5)}
    if(hs(fl,7)>.82){ctx.fillStyle='rgba(255,60,120,.5)';ctx.fillRect(-9,-32+Math.floor(hs(fl,8)*12),18,2)}
    ctx.fillStyle='rgba(255,255,255,'+(.04+hs(fl,2)*.05)+')';ctx.fillRect(-9,-32,18,15)}
  else{ctx.fillStyle='#050308';ctx.fillRect(-9,-32,18,15);ctx.fillStyle='#8a2a3a';ctx.fillRect(7,-19,2,2)}
  ctx.restore();
  if(alive){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x+16,y-24,2,x+16,y-24,48);const a=.12+.05*Math.sin(t*11)+(hs(fl,4)>.9?.08:0);g.addColorStop(0,'rgba(255,90,170,'+a+')');g.addColorStop(1,'rgba(255,90,170,0)');ctx.fillStyle=g;ctx.fillRect(x-32,y-72,96,96);ctx.restore()}}
const oDWo=G.drawWorld;
G.drawWorld=function(ctx){oDWo.call(this,ctx);const pc=this.interactives&&this.interactives.find(i=>i.id==='orf_pc');if(!pc)return;const cam=this.camera,x=Math.floor(pc.x-cam.x),y=Math.floor(pc.y+pc.h-cam.y);if(x<-60||x>700||y<-40||y>420)return;
  drawOrfPC(ctx,x,y,performance.now()/1000,!pc.collected);
  const p=this.player;if(p&&p.draw&&this.state==='playing'&&!p.dead){const hb=p.hitbox;if(hb.x<pc.x+pc.w&&hb.x+hb.w>pc.x)try{p.draw(ctx,cam)}catch(e){}}};
const oSNo=G.startNewGame;G.startNewGame=function(){oSNo.apply(this,arguments);this._orf=null;this._of=null};
const oSGo=G.saveGame;G.saveGame=function(){oSGo.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k));if(d){d.orf=this._orf||null;localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCGo=G.continueGame;G.continueGame=function(){oCGo.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));this._orf=d&&d.orf||null}catch(e){}};
// gancho para renderização quadro a quadro (vídeos)
window.__orfDbg={start:(g,ver)=>{window.__orfManual=true;window.__orfQ={};ofStart(g,{collected:false},ver)},step:(g,dt)=>{if(g._of)ofUpdate(g,dt)},draw:g=>{if(g._of)ofDraw(g,g.ctx)},press:k=>{(window.__orfQ||(window.__orfQ={}))[k]=1},info:g=>g._of?{ph:g._of.ph,u:g._of.u,wait:g._of.wait,ver:g._of.ver}:null,jump:(g,ph,u)=>{const v=g._of;v.ph=ph;v.u=u}};

})();
