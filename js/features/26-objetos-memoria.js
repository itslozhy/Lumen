/* ===== OBJETOS NO MUNDO: cada ponto de memória é literalmente o que o nome diz, no móvel certo ===== */
(function(){
const TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const art=k=>window.ART&&window.ART.get(k);
const WD='#4a3a32',WD2='#6a5646',DK='#1a1220',CR='#e6dcc6',ME='#7a7a8a',GO='#c9a86a',RO='#D27A8A',ST='#5a5a68';
function J(c,x,b,t){const o={
  a(k,h,dx,lift,fl){const im=art(k);if(!im)return;const w=im.naturalWidth*h/im.naturalHeight;c.save();c.translate(x+(dx||0),b-(lift||0));if(fl)c.scale(-1,1);c.imageSmoothingEnabled=false;c.drawImage(im,-w/2,-h,w,h);c.restore()},
  r(dx,dy,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x+dx),Math.round(b+dy),w,h)},
  o(dx,dy,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x+dx,b+dy,rx,ry,0,0,TAU);c.fill()},
  l(x1,y1,x2,y2,col,w){c.strokeStyle=col;c.lineWidth=w||1;c.beginPath();c.moveTo(x+x1,b+y1);c.lineTo(x+x2,b+y2);c.stroke()},
  p(pts,fill,stroke){c.beginPath();pts.forEach((q,i)=>i?c.lineTo(x+q[0],b+q[1]):c.moveTo(x+q[0],b+q[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}},
  ring(dx,dy,r,col,w){c.strokeStyle=col;c.lineWidth=w||1;c.beginPath();c.arc(x+dx,b+dy,r,0,TAU);c.stroke()},
  t};return o}
const SP={};const S=(ids,fn)=>ids.split(' ').forEach(id=>SP[id]=fn);
// ---- mobília e peças reutilizáveis ----
const plate=(j,lift,txt)=>{j.r(-9,-lift-12,18,12,ST);j.r(-8,-lift-11,16,10,'#3e3e4a');for(const[sx,sy]of[[-7,-lift-10],[6,-lift-10],[-7,-lift-3],[6,-lift-3]])j.r(sx,sy,1,1,'#a8a8b8');if(txt)for(let i=0;i<3;i++)j.r(-5,-lift-9+i*3,8-(i%2)*3,1,'#c8c4d8');return lift+12};
const recorder=j=>{j.r(-10,-16,20,2,WD2);j.r(-8,-24,16,8,'#3a3040');j.ring(-4,-20,2.5,GO);j.ring(4,-20,2.5,GO);j.r(-1,-18,2,1,'#D27A8A');return 26};
const easel=j=>{j.l(-9,0,-3,-34,WD,2);j.l(9,0,3,-34,WD,2);j.l(0,0,0,-30,WD,2);j.r(-9,-14,18,2,WD2)};
const crt=(j,lift,mode,t)=>{j.r(-8,-lift-18,16,15,'#3a3440');j.r(-6,-lift-16,12,11,'#07050c');if(mode==='static'){for(let i=0;i<4;i++)j.r(-6+(hs(i,Math.floor(t*8))*6|0),-lift-16+i*3,5+(hs(i,Math.floor(t*6)+3)*5|0),1,'rgba(200,210,230,.7)')}else{for(let i=0;i<4;i++)j.r(-5,-lift-15+i*3,4+((i*5)%7),1,'#8affc0')}j.r(-3,-lift-3,6,3,'#2a2430')};
const wallpatch=(j,w,h,lift,col)=>j.r(-w/2,-lift-h,w,h,col||'rgba(0,0,0,.28)');
const carve=(j,w,lift)=>{wallpatch(j,w,16,lift);for(let i=0;i<4;i++)j.r(-w/2+3,-lift-13+i*4,w-6-(i%3)*4,1,'rgba(200,190,220,.55)')};
const pipeEnd=j=>{j.r(-12,-14,16,8,'#6a6a78');j.r(-12,-14,16,2,'#8a8a98')};
const curtain=(j,h,col)=>{j.r(-9,-h,18,h,col);for(let i=0;i<5;i++)j.r(-8+i*4,-h,1,h,'rgba(0,0,0,.25)');j.r(-10,-h,20,2,GO)};
const sheet=(j,dx,dy,w,h)=>{j.r(dx,dy,w,h,CR);for(let i=0;i<Math.floor(h/3);i++)j.r(dx+1,dy+1+i*3,w-2-(i%2)*2,1,'#7a6a6a')};
const flowerTop=(j,dx,dy,col)=>{j.o(dx,dy,3,3,col);j.o(dx,dy,1.2,1.2,'#f0e0a0')};
// ---- por zona ----
S('QD-01',j=>{j.a('dresser',32);j.r(-4,-37,8,10,CR);j.r(-3,-36,6,8,'#2a2030');j.r(-2,-34,2,4,'#b8a0c8');return 40});            // penteadeira com a fotografia em cima
S('QD-02',j=>{j.a('desk_chests',28);j.r(7,-12,11,6,WD2);j.r(8,-15,7,4,'#6a4a8a');j.r(8,-15,1,4,GO);return 30});               // gaveta aberta com o diário
S('QD-03',j=>{j.a('dresser',24);j.r(-9,-52,18,28,'#5a6a8a');j.r(-8,-51,5,26,'rgba(255,255,255,.18)');j.a('frame_orn',36,0,18);return 56});
S('QD-04',j=>{j.a('win_small',44,0,14);j.r(-7,-2,14,2,'rgba(240,220,150,.5)');return 60});
S('M-03',j=>{j.a('stool',14);crt(j,14,'static',j.t);return 46});
S('CM-01',j=>{j.a('pt_girl2_0',52,0,12);return 66});
S('CM-02',j=>{j.a('frame_orn',46,0,12);return 60});
S('CM-02a',j=>{j.r(-10,-14,20,2,WD2);j.r(-5,-17,10,3,CR);j.r(-4,-16,8,1,'#7a6a6a');return 20});
S('CM-03 TR-04',j=>{const h=plate(j,18,true);j.ring(0,-24,3,'#c8c4d8');return h});
S('TR-02a',j=>plate(j,18,true));
S('GQ-01',j=>{j.a('pt_girl_0',46,0,12);return 60});
S('GQ-02',j=>{easel(j);j.r(-5,-30,10,12,'#8a7aa0');j.r(-14,-3,6,3,'#8a6a8a');j.r(8,-4,7,3,'#6a5a8a');j.r(2,-2,5,2,'#a08aa0');return 36});
S('GQ-02a',j=>{easel(j);j.r(-8,-32,16,20,'#5a4a6a');j.r(7,-27,4,10,CR);j.r(8,-25,2,1,'#7a6a6a');return 36});
S('GQ-03',j=>{easel(j);j.r(-9,-32,18,22,'#7a5a3a');j.r(-9,-22,18,1,'#4a2a1a');j.r(0,-32,1,22,'#4a2a1a');return 36});
S('BM-01',j=>{j.r(-9,-36,18,36,'#4a4a5a');for(let i=0;i<4;i++){j.r(-8,-35+i*9,16,8,'#5a5a6c');j.r(-3,-33+i*9,6,3,CR);j.r(-1,-30+i*9,2,1,GO)}return 38});
S('BM-02',j=>{j.a('table_bench',20);j.r(-6,-26,12,5,'#120c18');j.r(-6,-27,12,1,'#3a2a44');j.r(4,-26,1,9,'#120c18');flowerTop(j,-8,-24,'#8a5a6a');flowerTop(j,9,-23,'#6a4a5a');return 30});
S('BM-03',j=>{j.a('stool',14);crt(j,14,'text',j.t);j.r(-8,-4,16,2,'#2a2430');return 46});
S('BM-04',j=>{j.a('bookshelf',48);return 48});
S('M-04 M-05 A-04a',j=>{const h=recorder(j);if(j.t>0){const a=.12+.1*Math.sin(j.t*3);j.o(0,-18,14,12,'rgba(255,200,160,'+a+')')}return h});
S('BM-05',j=>{j.r(-8,-28,16,28,'#4a4a5a');for(let i=0;i<3;i++)j.r(-7,-27+i*9,14,8,'#5a5a6c');j.ring(0,-23,3.5,CR,1.2);return 30});
S('BM-06',j=>{j.a('table_bench',20);sheet(j,-9,-27,7,6);sheet(j,0,-28,8,7);j.l(5,-24,10,-27,GO,1);return 32});
S('SI-01',j=>{j.r(-10,-14,20,14,'#5a4032');j.r(-10,-15,20,2,'#7a5a38');j.o(-5,-17,3,3,'#c8a0e0');j.o(2,-18,3,3,'#e8d080');j.o(7,-16,2.5,2.5,RO);j.r(-3,-9,8,4,CR);return 22});
S('SI-01a',j=>{j.r(-11,-36,22,4,WD);j.l(0,-32,0,-22,CR,1);j.r(-4,-22,8,6,CR);j.r(-3,-20,6,1,'#7a6a6a');return 38});
S('SI-02',j=>{j.r(-10,-52,20,3,WD);j.l(-5,-49,-5,-28,CR,1);j.l(5,-49,5,-28,CR,1);j.a('chair',26,0,16);return 54});
S('SI-03',j=>{j.r(-9,-8,18,8,WD2);j.ring(-4,-12,4,ME,2);j.ring(4,-11,3,ME,2);j.l(-9,-8,9,-9,ME,1);j.a('clock_pocket',12,6,8);return 22});
S('SI-04',j=>{j.r(-10,-15,20,15,'#4a3626');j.r(-10,-9,20,2,'#2a1c12');j.o(0,-8,4,4,'#a02040');j.o(0,-8,2.5,2.5,'#c83a58');return 18});
S('SI-05',j=>{j.r(-11,-34,22,4,WD);j.r(-3,-30,8,10,CR);for(let i=0;i<3;i++)j.r(-2,-28+i*3,5,1,'#7a6a6a');j.o(1,-31,1.4,1.4,'#c8284a');return 36});
S('TR-01',j=>{j.a('clock_grand',54);return 54});
S('TR-02',j=>{j.o(0,-30,10,10,'#2a2230');j.ring(0,-30,10,ME,2);for(let i=0;i<8;i++){const a=i*TAU/8;j.r(Math.cos(a)*11-1,-30+Math.sin(a)*11-1,2,2,ME)}j.o(0,-30,2,2,'#0a0810');return 42});
S('TR-03',j=>{j.a('win_purple_tall',52,0,12);for(const dx of[-5,0,5])j.r(dx-1,-40,2,9,'#0a0810');return 66});
S('TR-05',j=>{j.a('clock_grand',44,-4);sheet(j,6,-34,8,10);j.r(8,-36,4,2,'rgba(220,200,150,.7)');return 46});
S('SA-01',j=>{j.r(-15,-5,30,5,'#2a3a6a');for(let i=0;i<4;i++)j.r(-12+i*7,-4+(i%2),5,1,'rgba(200,210,255,.4)');j.r(-15,-6,30,1,'#4a5a9a');return 10});
S('SA-02',j=>{j.a('stool',16);j.p([[-6,-32],[6,-32],[4,-16],[-4,-16]],'rgba(200,225,255,.30)','rgba(235,243,255,.9)');j.p([[-5,-24],[5,-24],[4,-17],[-4,-17]],'rgba(80,120,210,.65)');j.r(-3,-25,6,7,CR);j.r(-2,-24,4,5,'#2a2030');j.r(-1,-23,2,2,'#b8a0c8');j.r(-6,-32,12,1,'rgba(255,255,255,.9)');return 34});   // copo d'água com a fotografia dentro
S('SA-03',j=>{j.o(0,-5,11,4,'#7a7088');j.ring(0,-5,11,GO,1);for(let i=0;i<7;i++)j.r(-10+i*3.4,-5+(i%2)*3,2,3,'rgba(220,230,255,.7)');j.l(-8,-8,-14,-3,'#7a7088',1);j.l(8,-8,14,-3,'#7a7088',1);return 12});
S('SA-04',j=>{j.r(-10,-48,20,38,'#2a3050');j.r(-4,-44,8,26,'#3a2a2a');j.o(2,-30,1,1,GO);j.a('frame_orn',44,0,8);return 54});
S('SA-04a',j=>{j.a('chair',28,0,0,true);j.o(11,-1,4,1.5,'#9ab8d8');return 30});
S('PP-01',j=>{j.r(-10,-34,20,26,ST);j.r(-9,-33,18,24,'#3e3e4a');for(let i=0;i<4;i++){j.r(-7+i*4,-30,2,5,i%2?'#c8284a':'#8aa8c8')}j.l(-6,-22,-8,-4,'#2a2a34',1);j.l(4,-22,6,-2,'#2a2a34',1);return 36});
S('PP-02',j=>{wallpatch(j,20,32,4);for(let i=0;i<7;i++)j.l(-8,-10-i*3,8,-26+(i%3)*4+i,'rgba(220,210,235,.5)',1);return 36});
S('PP-03',j=>{pipeEnd(j);j.r(4,-14,12,8,'#6a6a78');j.r(4,-14,12,2,'#8a8a98');j.r(0,-6,1,6,'#8ab8e8');j.o(0,-1,5,1.5,'#4a6a9a');return 22});
S('PP-04',j=>{j.r(-8,-32,16,32,ST);j.r(-7,-31,14,30,'#4a4a58');j.ring(0,-18,4,'#c8c4d8',1.2);j.r(5,-16,2,3,GO);return 34});
S('M-01',j=>{j.a('table_bench',16);crt(j,16,'text',j.t);for(let i=0;i<4;i++)j.r(-12+i*6,-3,3,1,i%2?'#e8d080':'#2a2430');return 50});
S('PE-01',j=>{j.a('win_tall2',54,0,14);return 68});
S('PE-02',j=>{carve(j,20,10);return 28});
S('PE-03',j=>{j.r(-13,-44,26,44,'rgba(255,255,255,.07)');j.a('door_gothic',36);return 44});
S('PE-04',j=>{for(let i=0;i<6;i++){const dx=-10+i*4,l=26+hs(i,2)*18;j.l(dx,-52,dx+(hs(i,3)-.5)*3,-52+l,i%2?'#D27A8A':'#e6dcc6',1)}j.r(-12,-54,24,3,WD);return 54});
S('PE-05',j=>{j.r(-7,-24,14,14,ST);j.r(-6,-23,12,12,'#4a4a58');j.r(-1,-19,2,4,GO);j.r(-5,-8,10,4,CR);return 26});
S('PC-01',j=>{j.r(-13,-42,3,42,WD);j.r(10,-42,3,42,WD);j.r(-13,-42,26,3,WD);for(let i=0;i<8;i++){j.l(-9+i*2.6,-39,-9+i*2.6,hs(i,3)>.7?-22:-4,['#e0607a','#c8a0e0','#e8d080','#6a8cc8'][i%4],1)}return 44});
S('PC-01a',j=>{j.r(-10,-14,20,2,WD2);j.ring(0,-20,5,'#8a7aa8',1.5);j.ring(0,-20,2,'#5a4a68',1);j.r(6,-18,7,5,CR);return 24});
S('PC-02',j=>{j.r(-1,-14,2,14,ME);j.r(-6,-2,12,2,ME);j.r(-7,-30,14,16,'#6a5a7a');j.r(-7,-30,14,3,'#8a7aa8');j.r(-2,-34,4,4,'#6a5a7a');j.o(0,-36,3,3,'#b8a8c8');return 40});
S('PC-03',j=>{j.r(-8,-5,16,2,WD2);j.r(-8,-3,16,3,WD2);j.r(-6,-5,12,2,'#e0607a');j.r(-6,-12,12,2,WD2);j.r(-5,-10,10,5,'#c04a68');j.r(-5,-10,10,1,'#e0607a');j.r(2,-9,1,5,'rgba(255,255,255,.25)');return 14});
S('PC-04',j=>{j.r(-10,-34,20,2,WD);j.r(-9,-32,18,24,'#6a3a4a');for(let i=0;i<6;i++){j.r(-6+(i%3)*5,-28+Math.floor(i/3)*10,3,1,CR);j.r(-5+(i%3)*5,-27+Math.floor(i/3)*10,1,3,CR)}return 36});
S('GI-01',j=>{j.r(-11,-22,22,22,WD);j.r(-11,-22,22,2,WD2);j.r(-11,-12,22,1,DK);j.o(-5,-16,3,3,'#c8a0e0');j.r(2,-18,5,4,CR);j.o(6,-6,3,3,RO);return 24});
S('GI-02',j=>{for(let i=0;i<4;i++){j.l(-12+i*8,0,-6+i*5,-14-i*2,'#4a3a2a',3-i*.4)}j.l(0,-12,10,-24,'#4a3a2a',2);j.l(-6,-14,-10,-26,'#4a3a2a',2);return 28});
S('GI-03',j=>{j.o(0,-5,11,5,'#4a3a30');j.o(0,-6,8,3,'#2a2018');sheet(j,-6,-12,5,5);j.r(1,-12,4,5,'#b8a0c8');j.l(-8,-4,8,-9,'#e0607a',1);return 14});
S('GI-04',j=>{j.r(-9,-24,18,16,'#2a3040');for(let i=0;i<4;i++)j.r(-8+i*4.5,-23,1,14,'#6a6a7a');j.r(-9,-24,18,1,'#6a6a7a');j.r(-9,-9,18,1,'#6a6a7a');return 26});
S('GI-04a',j=>{sheet(j,-5,-8,10,8);j.l(-6,-8,6,-1,'#c8284a',1.2);return 10});
S('GI-05',j=>{pipeEnd(j);sheet(j,2,-13,9,4);return 16});
S('JI-05',j=>{j.l(-12,0,-4,-8,'#4a3a2a',3);j.l(4,0,12,-8,'#4a3a2a',3);j.r(-8,-9,16,2,'#3a2a1a');sheet(j,-3,-15,6,6);return 18});
S('CD-01',j=>{j.r(-15,-22,30,22,'#d8d0e0');j.r(-15,-22,30,2,'#f0e8f8');j.r(-15,-4,30,4,'#b8b0c8');j.r(-9,-32,3,10,CR);j.r(6,-32,3,10,CR);if(j.t>=0){for(const dx of[-8,7])j.o(dx,-34,1.4,2.2,'#ffcf8a')}return 36});
S('CD-02',j=>{j.r(-3,-24,6,24,WD);j.r(-9,-30,18,3,WD2);j.r(-6,-33,12,3,CR);j.r(0,-33,1,3,'#7a6a6a');j.r(-9,0,18,2,WD);return 36});
S('CD-03',j=>{j.a('win_big',50,0,14);return 64});
S('CD-04',j=>{j.a('table_bench',20);for(let i=0;i<4;i++)j.r(-8+i*4,-17,2,1,'rgba(220,200,170,.6)');return 22});
S('M-06',j=>{j.a('radio',24);return 24});
S('CD-05 O-05 A-03',j=>{carve(j,24,12);return 30});
S('JI-01',j=>{j.r(-6,-5,12,5,'#3a2a22');j.l(0,-5,0,-26,'#3a6a3a',2);j.l(0,-14,-7,-18,'#3a6a3a',2);j.l(0,-18,7,-22,'#3a6a3a',2);for(let i=0;i<6;i++){const a=i*TAU/6;j.o(Math.cos(a)*4,-28+Math.sin(a)*4,3,3,RO)}j.o(0,-28,2,2,'#f0e0a0');return 36});
S('JI-02',j=>{j.a('fountain',46);j.r(-12,-14,24,4,'#0a0810');return 46});
S('JI-03',j=>{j.r(-13,-6,26,6,'#3a2a22');j.r(-13,-7,26,2,'#6a5a4a');for(let i=0;i<6;i++)j.r(-12+i*4.5,-6,3,3,'#8a8a96');return 10});
S('JI-04',j=>{j.r(-1,-14,2,14,WD);j.r(-8,-26,16,12,CR);j.r(-8,-26,16,1,'#a89a80');for(let i=0;i<3;i++)j.r(-6,-23+i*3,10-(i%2)*3,1,'#5a4a4a');return 28});
S('CE-01',j=>{j.r(-12,-62,24,52,'#5a6a8a');j.r(-11,-61,6,50,'rgba(255,255,255,.16)');j.a('frame_orn',60,0,6);return 68});
S('CE-02',j=>{j.r(-12,-62,24,52,'#5a6a8a');j.a('frame_orn',60,0,6);j.l(-4,-60,0,-30,'rgba(255,255,255,.8)',1);j.l(0,-30,6,-14,'rgba(255,255,255,.8)',1);j.l(5,-58,0,-30,'rgba(255,255,255,.7)',1);return 68});
S('CE-02a',j=>{curtain(j,46,'#5a4a6a');j.r(-9,-14,18,14,'rgba(0,0,0,.35)');return 48});
S('CE-03',j=>{j.a('frame_orn',56,0,6);j.r(-12,-60,24,50,'#5a4a6a');for(let i=0;i<5;i++)j.r(-11+i*5,-60,1,50,'rgba(0,0,0,.25)');return 64});
S('CE-04',j=>{for(const[dx,h,l]of[[-9,26,14],[0,34,10],[9,22,16]]){j.r(dx-5,-l-h,10,h,'#5a6a8a');j.a('frame_orn',h+4,dx,l-2)}return 48});
S('O-01',j=>{j.r(-11,-40,22,28,'#0e0c1c');const P=[[-6,-34],[4,-36],[-8,-24],[0,-28],[8,-22],[3,-16]];for(let i=0;i<P.length;i++){j.o(P[i][0],P[i][1],1.2,1.2,'#fff4c8');if(i)j.l(P[i-1][0],P[i-1][1],P[i][0],P[i][1],'rgba(200,200,255,.45)',1)}return 42});
S('O-02',j=>{j.l(-9,0,0,-20,WD,2);j.l(9,0,0,-20,WD,2);j.l(0,0,0,-20,WD,2);j.l(-4,-18,12,-34,GO,4);j.l(12,-34,14,-37,'#2a2030',4);return 38});
S('O-03',j=>{j.a('table_bench',20);j.ring(-6,-25,4,GO,1.5);j.r(2,-28,3,8,GO);j.r(6,-24,6,4,'#8a6a3a');return 30});
S('O-04',j=>{j.a('table_bench',20);j.r(-11,-23,22,3,'#d8cdb0');j.l(-8,-22,8,-22,'#7a6a6a',1);j.l(-4,-23,4,-21,'#c8284a',1);return 26});
S('A-01',j=>{j.a('chair',32);j.r(-8,-2,16,2,'rgba(220,200,230,.18)');return 34});
S('A-02',j=>{j.a('door_gothic',52);j.ring(0,-30,4,GO,1.2);return 54});
S('A-04',j=>{curtain(j,50,'#6a3a4a');return 52});
// ---- entrada: substitui os glifos pequenos ----
window.nodeObj=function(c,x,y,n,t,done,d){const b=y+16,cx=x+8,f=SP[n.id];let top=24;
  if(f){c.save();try{top=f(J(c,cx,b,t))||24}catch(e){top=24}c.restore()}else{c.fillStyle=CR;c.fillRect(cx-4,b-11,8,11)}
  if(!done){const a=.5+.4*Math.sin(t*3),my=b-top-10;c.fillStyle='rgba(216,160,176,'+a+')';c.beginPath();c.moveTo(cx,my-6);c.lineTo(cx+3,my-3);c.lineTo(cx,my);c.lineTo(cx-3,my-3);c.fill()}
  if(d==='kaim'){c.strokeStyle='#8a1c2e';c.beginPath();c.moveTo(cx-5,b-14);c.lineTo(cx-1,b-8);c.lineTo(cx-3,b-3);c.stroke()}
  else if(d==='kami'){c.fillStyle='#D8A0B0';c.fillRect(cx+4,b-4,2,2);c.fillStyle='#3a6a3a';c.fillRect(cx+5,b-2,1,2)}
  else if(d==='mika'){c.strokeStyle='rgba(126,53,184,.5)';c.beginPath();c.moveTo(cx-8,b);c.lineTo(cx+8,b);c.stroke()}};
})();
