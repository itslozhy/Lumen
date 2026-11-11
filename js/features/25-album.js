/* ===== ÁLBUM: fotografias com pistas, documentos legíveis, itens e perdas (tecla L) + menu de pausa ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2,COL=window.COL;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const HAND='"Segoe Script","Bradley Hand","Comic Sans MS",cursive',TYPE='"Courier New", Courier, monospace',SERIF='Georgia, serif';
const sd=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))%100003;return h};
const art=k=>window.ART&&window.ART.get(k);
const zname=id=>{const z=ZONES.find(q=>q.id===id);return z?z.name:'Casa Desfeita'};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
// ---------- o que é foto e o que é documento ----------
const PHOTO_N=new Set(['QD-01','CM-01','CM-02','CM-02a','GQ-02','GQ-02a','SA-01','SA-02','GI-03','CE-02','SI-01','SI-04','BM-01','BM-04','PE-03','PC-01','PC-03','JI-02']);
const FRAGS=['mem1','mem_gallery','mem2','mem3','mem_clock','mem_sunken','mem_base','mem_sewer','mem_deep','mem_garden','mem_obs','mem_boss','mem_ante','mem_vault','mem_kitchen'];
const FRAG_TXT={mem1:'Uma voz: "Você já esteve aqui antes..."',mem2:'Páginas falam de costuras no tempo.',mem3:'O sótão guarda o que caiu para cima.',mem_gallery:'Quadros que nunca secaram.',mem_clock:'O relógio anda para trás.',mem_sunken:'Algo afunda e sobe ao mesmo tempo.',mem_base:'Fios atravessam as paredes.',mem_sewer:'A chave espera nas galerias profundas.',mem_deep:'Mais fundo do que a casa admite.',mem_garden:'Flores que não existem.',mem_obs:'Estrelas costuradas no teto.',mem_boss:'Eu mesma costurei esta casa.',mem_ante:'A porta exige o que as profundezas escondem.',mem_vault:'Atrás dos fios, o que sobrou do cofre.',mem_kitchen:'O fogo lembra quem o acendeu.'};
const FRAG_T={mem1:'Festa pequena',mem_gallery:'Retratos em fila',mem2:'A escada',mem3:'Janela fechada por fora',mem_clock:'Ponteiros parados',mem_sunken:'Afunda e sobe',mem_base:'Fios nas paredes',mem_sewer:'A chave nas galerias',mem_deep:'Mais fundo',mem_garden:'Flores que não existem',mem_obs:'Estrelas costuradas',mem_boss:'Eu costurei a casa',mem_ante:'A porta que exige',mem_vault:'Atrás dos fios',mem_kitchen:'O fogo da cozinha'};
const EVENTS=['photo','tv','mirror','jar','echo'];
const EV_T={photo:'Fotografia presa à moldura',tv:'Gravação do televisor',mirror:'Espelho sem moldura',jar:'Fita cortada',echo:'Duas silhuetas'};
const CLUE={'QD-01':'duas figuras… ou uma só? Reflexo, sombra, irmã?','CM-02a':'a parede sem moldura. Procure atrás do retângulo limpo.','CM-02':'a marca ainda está na parede. Algo foi tirado dali.','CM-01':'a tinta é mais nova justamente no rosto.','GQ-02a':'só a porta, sem a menina. Olhe atrás do cavalete.','GQ-02':'os pedaços não são da mesma tela.','SA-01':'o reflexo olha para o outro lado.','SA-02':'a fotografia resistiu à água: alguém a deixou dentro do copo de propósito.','GI-03':'nenhum fragmento está inteiro. Junte-os.','CE-02':'três reflexos, três marcas de mão atrás do pano.','SI-01':'tudo com a mesma etiqueta: “guardar”.','SI-04':'o lacre é para não se sentir culpado.','BM-01':'datas repetidas… e datas que ainda não aconteceram.','BM-04':'ordenados pela espessura das páginas arrancadas.','PE-03':'a parede foi construída depois da porta.','PC-01':'fios cortados, fios reunidos muitas vezes.','PC-03':'o fio acaba dentro do carretel. Está mais leve de um lado.','JI-02':'esvaziada de propósito.',mem_sewer:'A chave do cofre está fundo, nas galerias.',mem_ante:'A porta pede o que as profundezas escondem: a chave.',mem2:'Algo foi dito sobre costuras no tempo… e sobre o dash.',mem_obs:'As linhas entre as estrelas desenham a planta da casa.'};
const DOC_RE=/diário|livro|gravador|gravação|placa|inscri|anota|bilhete|etiqueta|lista|mapa|monitor|terminal|símbolo|recorte|patamar|compartimento|pistas/i;
function isDocNode(n){return n&&!PHOTO_N.has(n.id)&&(n.sh==='paper'||n.sh==='device'||n.sh==='screen'||n.sh==='book'||DOC_RE.test(n.lab||''))}
function docKind(n){if(n.sh==='device')return'transcript';if(n.mon||n.sh==='screen')return'screen';if(/placa|inscri/i.test(n.lab||''))return'plate';if(n.sh==='book'||/livro/i.test(n.lab||''))return'book';return'note'}
// ---------- registro (chamado pelo jogo) ----------
const lst=p=>(p.docs=p.docs||[]);
function put(p,d){const L=lst(p),i=L.findIndex(q=>q.id===d.id);if(i<0)L.push(d);else if(d.lines&&d.lines.length)Object.assign(L[i],d)}
window.ALB={
 reg(g,n,lines){const p=g.player,ls=(lines||[]).map(String).filter(s=>s.trim());if(!ls.length)return;
  if(PHOTO_N.has(n.id))put(p,{id:n.id,k:'photo',t:n.lab,z:n.z,lines:ls,sh:n.sh||'thing'});
  else if(isDocNode(n))put(p,{id:n.id,k:'doc',t:n.lab,z:n.z,lines:ls,kind:docKind(n)})},
 regBook(p,id,lines,it){const z=it?zoneAt(Math.floor(it.x/T),Math.floor(it.y/T)):null,ls=(lines||[]).map(String);put(p,{id:'B_'+id,k:'doc',t:'Livro: '+ls[0].replace(/["“”]/g,'').slice(0,22)+'…',z:z?z.id:null,lines:ls,kind:'book'})},
 regFrag(p,id,it){const z=it?zoneAt(Math.floor(it.x/T),Math.floor(it.y/T)):null;put(p,{id:'F_'+id,k:'photo',t:FRAG_T[id]||'Fragmento de memória',z:z?z.id:null,lines:[FRAG_TXT[id]||'Fragmento de memória.'],sc:id})},
 fragVar(p,id,txt){const d=lst(p).find(q=>q.id==='F_'+id);if(d)d.lines=[d.lines[0],txt]},
 regEvent(p,id,i,C,o){put(p,{id:'V_'+id,k:'photo',t:(o.rec&&o.rec[0])||EV_T[id],z:{photo:'bedroom',tv:'sewers',mirror:'mirror_hall',jar:'garden',echo:'antechamber'}[id],lines:C.ctx.concat(o.rec?[o.rec[1]]:[]),sc:'ev_'+id,v:i})}};
// ---------- primitivas de desenho ----------
function img(x,k,cx,by,h,fl,sh){const im=art(k);if(!im)return;const w=im.naturalWidth*h/im.naturalHeight;x.save();x.translate(cx,by);if(fl)x.scale(-1,1);if(sh!==false){x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(0,0,w*.42,3,0,0,TAU);x.fill()}x.imageSmoothingEnabled=false;x.drawImage(im,-w/2,-h,w,h);x.restore()}
function strip(x,key,f,cx,by,h,fl){const S=window.SPRS&&window.SPRS[key];if(!S||!S.i.naturalWidth)return;const w=S.cw*h/S.ch;x.save();x.translate(cx,by);if(fl)x.scale(-1,1);x.imageSmoothingEnabled=false;x.drawImage(S.i,f*S.cw,0,S.cw,S.ch,-w/2,-h,w,h);x.restore()}
function sil(x,cx,by,h,col,al,fl,f){const S=window.SPRS&&window.SPRS.mika_idle;if(!S||!S.i.naturalWidth)return;const w=S.cw*h/S.ch,t=mk(Math.ceil(w)+2,Math.ceil(h)+2),tx=t.getContext('2d');tx.imageSmoothingEnabled=false;tx.drawImage(S.i,(f||0)*S.cw,0,S.cw,S.ch,0,0,w,h);tx.globalCompositeOperation='source-in';tx.fillStyle=col;tx.fillRect(0,0,t.width,t.height);x.save();x.globalAlpha=al==null?1:al;x.translate(cx,by);if(fl)x.scale(-1,1);x.drawImage(t,-w/2,-h);x.restore()}
const R=(x,a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a,b,w,h)};
const circ=(x,a,b,r,c)=>{x.fillStyle=c;x.beginPath();x.arc(a,b,r,0,TAU);x.fill()};
function ring(x,cx,cy,rx,ry){x.save();x.strokeStyle='#e0304f';x.lineWidth=1.4;x.beginPath();x.ellipse(cx,cy,rx,ry,-.15,.3,TAU+.1);x.stroke();x.restore()}
function arrow(x,x1,y1,x2,y2){x.save();x.strokeStyle='#e0304f';x.lineWidth=1.4;x.beginPath();x.moveTo(x1,y1);x.quadraticCurveTo((x1+x2)/2+4,(y1+y2)/2-4,x2,y2);x.stroke();const a=Math.atan2(y2-y1,x2-x1);x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-5*Math.cos(a-.5),y2-5*Math.sin(a-.5));x.moveTo(x2,y2);x.lineTo(x2-5*Math.cos(a+.5),y2-5*Math.sin(a+.5));x.stroke();x.restore()}
function water(x,y0,al){x.fillStyle='rgba(40,50,110,'+(al||.5)+')';x.fillRect(0,y0,120,90-y0);for(let i=0;i<5;i++){x.strokeStyle='rgba(200,210,255,.25)';x.beginPath();x.moveTo(8+i*6,y0+4+i*5);x.lineTo(60+i*12,y0+4+i*5);x.stroke()}}
function flame(x,cx,cy,s){const g=x.createRadialGradient(cx,cy,0,cx,cy,s*3);g.addColorStop(0,'rgba(255,210,130,.85)');g.addColorStop(1,'rgba(255,120,40,0)');x.fillStyle=g;x.fillRect(cx-s*3,cy-s*3,s*6,s*6);x.fillStyle='#ffb070';x.beginPath();x.moveTo(cx,cy-s*1.6);x.quadraticCurveTo(cx+s,cy,cx,cy+s*.6);x.quadraticCurveTo(cx-s,cy,cx,cy-s*1.6);x.fill()}
function cake(x,cx,by,w){R(x,cx-w/2,by-9,w,9,'#e8c8d0');R(x,cx-w/2,by-11,w,3,'#fff4f0');for(let i=0;i<7;i++){const px=cx-w/2+3+i*(w-6)/6;R(x,px,by-17,1,6,'#ece0c8');flame(x,px+.5,by-19,1.2)}}
// ---------- cenas ----------
const SC={};
SC.mem1=(x,u)=>{img(x,'table_bench',60,84,34);cake(x,60,56,22);img(x,'chair',98,86,42);for(const gx of[16,30,44])sil(x,gx,84,34,'#07050c',.95,false,0);sil(x,72,82,26,'#b89ac8',.9,true,1);u.mark(()=>{ring(x,98,64,10,16);arrow(x,112,30,102,44)})};
SC.mem_gallery=(x,u)=>{[20,60,100].forEach((cx,i)=>{const k=['pt_girl_0','pt_girl2_0','pt_girl_0'][i];img(x,k,cx,70,46,false,false);x.strokeStyle='#c9a86a';x.strokeRect(cx-17,24,34,46)});u.mark(()=>{ring(x,60,44,12,14)})};
SC.mem2=(x,u)=>{x.fillStyle='#120d18';for(let i=0;i<9;i++)R(x,8+i*10,26+i*6,112-8-i*10,6,i%2?'#2a2030':'#352840');sil(x,70,50,24,'#0a0710',.95,true,0);R(x,0,74,22,10,'#d8c0c8');R(x,18,76,8,4,'#d8c0c8');u.mark(()=>{arrow(x,30,70,56,48)})};
SC.mem3=(x,u)=>{img(x,'win_big',60,84,74,false,false);for(let i=0;i<4;i++){R(x,40,22+i*14,40,3,'#3a2a1e');R(x,42,22+i*14,1,3,'#120a06')}circ(x,60,40,4,'rgba(255,200,230,.5)');x.fillStyle='rgba(230,220,240,.35)';x.fillRect(66,50,6,9);x.fillRect(64,47,2,4);x.fillRect(68,45,2,5);u.mark(()=>{arrow(x,100,24,78,40)})};
SC.mem_clock=(x,u)=>{img(x,'clock_grand',60,86,76);x.strokeStyle='#e8d080';x.lineWidth=1.5;x.beginPath();x.moveTo(60,28);x.lineTo(60,17);x.moveTo(60,28);x.lineTo(68,32);x.stroke();u.mark(()=>{ring(x,60,26,13,13)})};
SC.mem_garden=(x,u)=>{R(x,0,64,120,26,'#1c1a24');x.fillStyle='#2a2630';x.beginPath();x.ellipse(60,70,38,9,0,0,TAU);x.fill();for(let i=0;i<22;i++){const fx=26+hs(i,1)*68,fy=60+hs(i,2)*12;R(x,fx,fy,1,6,'#2a5a4a');circ(x,fx,fy,1.6,i%2?'#e0607a':'#c8a0e0')}img(x,'vase_flw',100,80,40);u.mark(()=>{ring(x,60,68,40,10)})};
SC.mem_sunken=(x,u)=>{img(x,'door_gothic',60,52,46,false,false);x.save();x.translate(0,104);x.scale(1,-1);x.globalAlpha=.4;img(x,'door_gothic',60,52,46,false,false);x.restore();water(x,52,.45);u.mark(()=>{arrow(x,86,44,86,22);arrow(x,92,60,92,80)})};
SC.mem_base=(x,u)=>{for(let i=0;i<3;i++)R(x,i*40+2,8,36,70,'rgba(0,0,0,.28)');x.strokeStyle='#e0607a';x.lineWidth=1.2;for(let j=0;j<4;j++){x.beginPath();x.moveTo(0,20+j*14);for(let i=0;i<=6;i++)x.lineTo(i*20,20+j*14+(i%2?-5:5)*(hs(j,i)>.5?1:-1));x.stroke()}};
SC.mem_sewer=(x,u)=>{for(let i=0;i<4;i++){R(x,i*34,0,12,60,'#1a2230');R(x,i*34+2,0,2,60,'#2a3a4a')}water(x,44,.7);const g=x.createRadialGradient(60,76,1,60,76,22);g.addColorStop(0,'rgba(255,220,150,.7)');g.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=g;x.fillRect(30,50,60,40);img(x,'key',60,84,30,false,false);u.mark(()=>{arrow(x,92,28,66,66);ring(x,60,72,14,12)})};
SC.mem_deep=(x,u)=>{for(let i=0;i<7;i++){x.strokeStyle='rgba(180,150,210,'+(.5-i*.05)+')';x.strokeRect(10+i*7,4+i*6,100-i*14,80-i*10)}for(let i=0;i<6;i++)R(x,58,10+i*10,4,2,'#8a7aa8');sil(x,60,22,12,'#0a0710',.9,false,0);u.mark(()=>{arrow(x,92,24,70,64)})};
SC.mem_obs=(x,u)=>{R(x,0,0,120,90,'#0a0816');const P=[[60,16],[30,40],[90,40],[30,70],[90,70],[60,40]];x.strokeStyle='rgba(200,200,255,.35)';x.beginPath();x.moveTo(60,16);x.lineTo(30,40);x.lineTo(30,70);x.lineTo(90,70);x.lineTo(90,40);x.closePath();x.moveTo(30,40);x.lineTo(90,40);x.moveTo(60,40);x.lineTo(60,70);x.stroke();P.forEach(p=>circ(x,p[0],p[1],1.8,'#fff4c8'));for(let i=0;i<30;i++)R(x,hs(i,4)*120,hs(i,5)*90,1,1,'rgba(255,255,255,.5)');u.mark(()=>{ring(x,60,44,36,32)})};
SC.mem_boss=(x,u)=>{sil(x,40,84,46,'#0a0710',.95,false,0);x.strokeStyle='#e0607a';x.lineWidth=1.2;x.beginPath();x.moveTo(56,52);x.lineTo(76,30);x.lineTo(96,52);x.lineTo(96,76);x.lineTo(56,76);x.closePath();x.stroke();x.strokeStyle='#d8d0e0';x.beginPath();x.moveTo(50,50);x.lineTo(100,26);x.stroke();circ(x,100,26,1.6,'#d8d0e0')};
SC.mem_ante=(x,u)=>{img(x,'door_gothic',60,84,72,false,false);circ(x,60,50,2.4,'#ffd89a');R(x,59,52,2,5,'#ffd89a');img(x,'key',100,84,22,false,false);u.mark(()=>{arrow(x,98,56,66,50);ring(x,100,72,8,12)})};
SC.mem_vault=(x,u)=>{img(x,'desk_chests',60,86,50);x.strokeStyle='#e0607a';for(let i=0;i<5;i++){x.beginPath();x.moveTo(30,40+i*5);x.lineTo(90,44+i*5);x.stroke()}};
SC.mem_kitchen=(x,u)=>{R(x,30,60,60,6,'#3a2a2a');x.fillStyle='#8a8a9a';x.beginPath();x.ellipse(60,52,16,12,0,0,TAU);x.fill();R(x,74,44,12,3,'#8a8a9a');R(x,56,36,8,4,'#6a6a7a');flame(x,60,66,3);flame(x,50,66,2);flame(x,70,66,2)};
SC.ev_photo=(x,u)=>{const v=u.v||0;R(x,0,0,120,90,'#1a1420');if(v===0){R(x,14,10,92,70,'#e6dcc6');x.font='11px '+HAND;x.fillStyle='#5a2a3a';x.fillText('Não venha.',26,36);x.fillStyle='#2a3a8a';x.fillText('Venha.',40,56);x.strokeStyle='#5a2a3a';x.beginPath();x.moveTo(24,40);x.lineTo(100,38);x.stroke();u.mark(()=>{arrow(x,102,66,86,58)})}
  else{for(let i=0;i<9;i++)R(x,10+i*10,56+(i%3)*4,12,4,i%2?'#2a2030':'#3a2c44');sil(x,40,56,30,'#d8b8e0',.95,false,2);sil(x,62,56,30,'#d8b8e0',.35,false,2);sil(x,66,56,30,'#d8b8e0',.35,false,2);if(v===1){x.strokeStyle='#ffffff';x.lineWidth=1.5;x.beginPath();x.moveTo(60,0);x.lineTo(56,30);x.lineTo(63,60);x.lineTo(58,90);x.stroke()}if(v===2){const g=x.createRadialGradient(60,44,3,60,44,50);g.addColorStop(0,'rgba(255,200,170,.4)');g.addColorStop(1,'rgba(255,200,170,0)');x.fillStyle=g;x.fillRect(0,0,120,90)}u.mark(()=>{ring(x,64,42,12,18)})}};
SC.ev_tv=(x,u)=>{const v=u.v||0;img(x,'tv',60,86,64);R(x,38,34,44,30,v===1?'#06040a':'#201a2a');if(v===0){cake(x,60,60,14);img(x,'chair',76,64,16,false,false);for(const gx of[44,50])sil(x,gx,64,14,'#07050c',.9,false,0)}else if(v===2){R(x,42,56,36,4,'#4a3a3a');circ(x,60,50,4,'#e8c8d0');sil(x,52,60,14,'#b8a0c8',.5,false,0)}else{x.fillStyle='rgba(200,200,255,.15)';x.fillRect(38,34,44,30)}u.mark(()=>{ring(x,76,56,8,10)})};
SC.ev_mirror=(x,u)=>{img(x,'frame_orn',60,86,76,false,false);R(x,34,22,52,46,'#0e0a16');sil(x,52,64,34,'#c8b0e0',.9,false,0);sil(x,57,64,34,'#c8b0e0',.5,true,0);const v=u.v||0;if(v===1){for(let i=0;i<5;i++){x.strokeStyle='rgba(255,255,255,.7)';x.beginPath();x.moveTo(34+i*12,22);x.lineTo(44+i*8,68);x.stroke()}}if(v===2){for(let i=0;i<6;i++)circ(x,48+i*5,56,2,'#b04a6a')}u.mark(()=>{arrow(x,100,34,80,50)})};
SC.ev_jar=(x,u)=>{const v=u.v||0;img(x,'vase_a',60,86,48);x.strokeStyle='#e0607a';x.lineWidth=1.2;x.beginPath();x.moveTo(60,40);x.quadraticCurveTo(52,30,56,22);x.stroke();circ(x,56,21,3,'#a05a7a');x.strokeStyle='#d8d0e0';x.beginPath();if(v===0){x.moveTo(62,70);x.quadraticCurveTo(80,80,110,74)}else if(v===1){for(let i=0;i<4;i++){x.moveTo(60,60);x.lineTo(50+i*8,20-i*2)}}else{x.moveTo(52,62);x.lineTo(70,62);x.lineTo(60,70);x.closePath()}x.stroke();u.mark(()=>{ring(x,60,62,12,8)})};
SC.ev_echo=(x,u)=>{R(x,0,0,120,90,'#08060e');R(x,44,18,32,60,'rgba(180,200,230,.18)');x.strokeStyle='#8a7aa8';x.strokeRect(44.5,18.5,31,60);sil(x,32,84,48,'#d02a4a',.85,false,0);for(let i=0;i<4;i++)R(x,22,40+i*10,22,2,'rgba(0,0,0,.6)');sil(x,90,84,48,'#e8e0f0',.85,true,1);circ(x,98,52,2,'#e0a0c0');circ(x,102,56,2,'#c8a0e0')};
// fotografias de objetos dos nós
SC['QD-01']=(x,u)=>{img(x,'dresser',60,86,56);R(x,50,22,20,24,'#e6dcc6');R(x,52,24,16,16,'#241c2c');sil(x,60,40,15,'#e0c8e8',.95,false,0);sil(x,64,40,15,'#f0a0c0',.45,true,0);R(x,56,43,8,1,'#7a6a6a');u.mark(()=>{ring(x,60,34,15,16);arrow(x,100,20,76,32)})};
SC['CM-02a']=(x,u)=>{x.fillStyle='rgba(255,255,255,.07)';x.fillRect(34,12,52,46);x.strokeStyle='rgba(255,255,255,.3)';x.setLineDash([3,2]);x.strokeRect(34.5,12.5,51,45);x.setLineDash([]);sil(x,22,92,70,'#04030a',.97,false,0);u.mark(()=>{ring(x,60,35,28,26);arrow(x,96,70,74,48)})};
SC['CM-02']=(x,u)=>{x.fillStyle='rgba(255,255,255,.06)';x.fillRect(34,12,52,46);for(const[cx,cy]of[[34,12],[86,12],[34,58],[86,58]]){x.strokeStyle='rgba(255,255,255,.4)';x.beginPath();x.moveTo(cx-3,cy);x.lineTo(cx+3,cy);x.moveTo(cx,cy-3);x.lineTo(cx,cy+3);x.stroke()}u.mark(()=>{ring(x,60,35,28,26)})};
SC['CM-01']=(x,u)=>{img(x,'pt_girl2_0',60,84,70,false,false);R(x,50,22,20,18,'rgba(215,200,225,.55)');u.mark(()=>{ring(x,60,31,14,13);arrow(x,98,16,76,28)})};
SC['GQ-02']=(x,u)=>{[['pt_girl_0',10,8,40,48,0],['pt_eye_0',50,30,40,50,1],['pt_cat_0',70,6,40,44,2]].forEach(a=>{x.save();x.beginPath();x.rect(a[1],a[2],a[3],a[4]);x.clip();img(x,a[0],a[1]+a[3]/2+(a[5]-1)*6,a[2]+a[4]+8,70,false,false);x.restore();x.strokeStyle='#c9a86a';x.strokeRect(a[1]+.5,a[2]+.5,a[3]-1,a[4]-1)});u.mark(()=>{arrow(x,104,70,84,56)})};
SC['GQ-02a']=(x,u)=>{R(x,0,0,120,90,'#10101a');img(x,'door_gothic',60,84,72,false,false);u.mark(()=>{ring(x,60,50,16,30);arrow(x,100,24,78,36)})};
SC['SA-01']=(x,u)=>{water(x,50,.55);sil(x,60,50,34,'#e0d0e8',.95,false,0);x.save();x.translate(0,100);x.scale(1,-1);sil(x,60,50,34,'#8a7aa8',.5,true,0);x.restore();u.mark(()=>{arrow(x,100,64,76,72)})};
SC['SA-02']=(x,u)=>{img(x,'stool',60,86,40);x.fillStyle='rgba(200,225,255,.28)';x.strokeStyle='rgba(235,243,255,.9)';x.beginPath();x.moveTo(44,22);x.lineTo(76,22);x.lineTo(70,50);x.lineTo(50,50);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(80,120,210,.65)';x.beginPath();x.moveTo(47,32);x.lineTo(73,32);x.lineTo(70,50);x.lineTo(50,50);x.closePath();x.fill();R(x,53,34,14,14,'#e6dcc6');R(x,55,36,10,10,'#2a2030');sil(x,60,46,10,'#b8a0c8',.9,false,0);R(x,44,21,32,1,'rgba(255,255,255,.9)');u.mark(()=>{ring(x,60,40,18,16);arrow(x,100,24,78,36)})};
SC['CE-02']=(x,u)=>{img(x,'frame_orn',60,86,78,false,false);R(x,32,22,56,48,'#0e0a16');for(let i=0;i<3;i++){x.save();x.beginPath();x.rect(32+i*19,22,19,48);x.clip();sil(x,41+i*19,70,40,'#c8b0e0',.85,i===1,i);x.restore()}x.strokeStyle='rgba(255,255,255,.7)';x.beginPath();x.moveTo(51,22);x.lineTo(48,70);x.moveTo(70,22);x.lineTo(74,70);x.stroke();u.mark(()=>{ring(x,60,46,28,26)})};
SC['GI-03']=(x,u)=>{x.strokeStyle='#6a4a3a';x.lineWidth=2;x.beginPath();x.ellipse(60,60,40,18,0,0,TAU);x.stroke();[['ph_a',36,44,28,-.2],['ph_b',62,40,30,.15],['ph_c',84,48,26,-.1]].forEach(a=>{x.save();x.translate(a[1],a[2]);x.rotate(a[4]);const im=art(a[0]);if(im){x.imageSmoothingEnabled=false;x.drawImage(im,-a[3]/3,-a[3]/2,a[3]*.66,a[3])}x.restore()});x.strokeStyle='#e0607a';x.beginPath();x.moveTo(20,70);x.lineTo(100,74);x.stroke();u.mark(()=>{ring(x,60,52,44,24)})};
SC['SI-01']=(x,u)=>{R(x,24,52,72,26,'#3a2a22');R(x,22,50,76,5,'#5a4032');for(let i=0;i<5;i++){circ(x,34+i*14,48-(i%2)*3,4+(i%3),['#c8a0e0','#e8d080','#e0607a','#6a8cc8','#c9b9b9'][i])}R(x,52,64,22,10,'#e6dcc6');x.font='6px '+HAND;x.fillStyle='#2a1c28';x.fillText('guardar',54,72);u.mark(()=>{ring(x,63,69,14,8)})};
SC['SI-04']=(x,u)=>{R(x,26,40,68,40,'#4a3626');R(x,26,56,68,4,'#2a1c12');circ(x,60,58,8,'#a02040');circ(x,60,58,5,'#c83a58');R(x,56,57,8,2,'#7a1428');u.mark(()=>{ring(x,60,58,12,12);arrow(x,100,30,70,52)})};
SC['BM-01']=(x,u)=>{R(x,18,10,84,74,'#2a2432');for(let r=0;r<4;r++)for(let c=0;c<2;c++){R(x,22+c*40,14+r*17,36,14,'#3a3244');R(x,34+c*40,19+r*17,12,5,'#d8cfb8')}x.font='4px '+TYPE;x.fillStyle='#2a1c28';['03/11','12/04','12/04','??/??','07/09','31/12','??/??','00/00'].forEach((d,i)=>x.fillText(d,34+(i%2)*40,23+Math.floor(i/2)*17));u.mark(()=>{ring(x,40,53,16,8);ring(x,80,70,12,8)})};
SC['BM-04']=(x,u)=>{img(x,'bookshelf',60,86,76,false,false);for(let i=0;i<7;i++)R(x,40+i*5+(hs(i,1)*2|0),20+(i%3)*16,3,3,'#e6dcc6');u.mark(()=>{arrow(x,100,30,74,42)})};
SC['PE-03']=(x,u)=>{R(x,24,10,72,76,'rgba(255,255,255,.09)');img(x,'door_gothic',60,86,64,false,false);R(x,38,20,3,4,'#e0304f');u.mark(()=>{ring(x,60,46,36,38)})};
SC['PC-01']=(x,u)=>{for(let i=0;i<9;i++){x.strokeStyle=['#e0607a','#c8a0e0','#e8d080','#6a8cc8'][i%4];x.beginPath();x.moveTo(14+i*11,8);x.lineTo(14+i*11,hs(i,3)>.7?44:80);x.stroke()}for(let j=0;j<5;j++){x.strokeStyle='rgba(230,220,200,.5)';x.beginPath();x.moveTo(8,20+j*14);x.lineTo(112,20+j*14+(hs(j,2)-.5)*6);x.stroke()}u.mark(()=>{ring(x,25,60,10,14)})};
SC['PC-03']=(x,u)=>{x.save();x.translate(60,52);x.rotate(.18);R(x,-6,-24,12,48,'#3a2a22');for(let i=0;i<10;i++)R(x,-14,-20+i*4,28,3,i%2?'#e0607a':'#c04a68');x.restore();u.mark(()=>{arrow(x,100,22,74,38);ring(x,50,56,18,24)})};
SC['JI-02']=(x,u)=>{img(x,'fountain',60,86,70);R(x,40,50,40,8,'#0a0810');u.mark(()=>{ring(x,60,54,22,8)})};
// ---------- fotografia ----------
const PH=new Map(),PROPS_BG={};
function photoScene(e){const key=e.sc||e.id,W=120,H=90,c=mk(W,H),x=c.getContext('2d'),z=ZONES.find(q=>q.id===e.z)||ZONES[0],s=sd(key),r=i=>hs(s,i);
  x.imageSmoothingEnabled=false;x.fillStyle=z.wall;x.fillRect(0,0,W,H);
  const wd=art('wall_diamond');if(wd){x.globalAlpha=.55;for(let i=0;i<3;i++)for(let j=0;j<2;j++)x.drawImage(wd,i*47,j*65,47,65);x.globalAlpha=1}
  x.fillStyle=z.floor;x.fillRect(0,66,W,24);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,66,W,2);for(let i=0;i<8;i++){x.fillStyle='rgba(0,0,0,.22)';x.fillRect(i*17+(r(i)*5|0),68,1,22)}
  const marks=[],u={v:e.v,mark:f=>marks.push(f)},fn=SC[key]||SC[e.id];
  if(fn)try{fn(x,u)}catch(err){}
  const lg=x.createRadialGradient(r(10)>.5?20:100,10,2,60,40,80);lg.addColorStop(0,'rgba(255,170,200,.30)');lg.addColorStop(1,'rgba(255,170,200,0)');x.fillStyle=lg;x.fillRect(0,0,W,H);
  x.globalCompositeOperation='multiply';x.fillStyle='rgba(150,115,185,.5)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
  for(let i=0;i<460;i++){x.fillStyle=r(i+50)>.5?'rgba(255,255,255,.08)':'rgba(0,0,0,.15)';x.fillRect(r(i+51)*W,r(i+52)*H,1,1)}
  for(let i=0;i<3;i++){x.strokeStyle='rgba(255,240,255,.13)';x.beginPath();const sx=r(i+70)*W;x.moveTo(sx,0);x.lineTo(sx+(r(i+71)-.5)*6,H);x.stroke()}
  const vg=x.createRadialGradient(W/2,H/2,28,W/2,H/2,78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,12,.7)');x.fillStyle=vg;x.fillRect(0,0,W,H);
  marks.forEach(f=>f());return c}
// ---------- documentos legíveis ----------
const DS={note:{paper:'#d8ccb0',ink:'#2a2a48',font:'14px '+HAND,lh:21,head:'FOLHA',bg:'cream'},book:{paper:'#cdbf9c',ink:'#3a2a20',font:'italic 14px '+SERIF,lh:20,head:'LIVRO',bg:'bone'},plate:{paper:'#5a5a6a',ink:'#e4e0ee',font:'bold 12px '+TYPE,lh:18,head:'PLACA',bg:'ink2'},transcript:{paper:'#e8e4da',ink:'#1a1a22',font:'12px '+TYPE,lh:17,head:'GRAVAÇÃO',bg:'bone'},screen:{paper:'#05040a',ink:'#8affc0',font:'12px '+TYPE,lh:17,head:'TERMINAL',bg:'mon'}};
function docSheet(ctx,e,x,y,w,h,full){const S=DS[e.kind||'note']||DS.note,lines=e.lines||[];
  COL.paper(ctx,x,y,w,h,S.bg,sd(e.id),full?-.006:0,{j:2.4});
  if(e.kind==='plate'){for(const[sx,sy]of[[x+10,y+10],[x+w-10,y+10],[x+10,y+h-10],[x+w-10,y+h-10]]){circ(ctx,sx,sy,3,'#2a2a34');R(ctx,sx-2,sy,4,1,'#9a9aa8')}}
  if(!full){ctx.fillStyle=S.ink;ctx.globalAlpha=.55;for(let i=0;i<Math.min(7,lines.length*2+2);i++)ctx.fillRect(x+10,y+14+i*6,w-20-hs(i,sd(e.id))*30,1.5);ctx.globalAlpha=1;return}
  ctx.fillStyle=e.kind==='screen'?'#2a8a60':(e.kind==='plate'?'#aaa6b8':'#7a2a44');ctx.font='bold 10px '+TYPE;ctx.fillText(S.head,x+16,y+22);
  ctx.fillStyle=S.ink;ctx.font=S.font;let yy=y+46;const maxW=w-36;
  for(const ln of lines){for(const l of COL.wrap(ctx,ln,maxW)){if(yy>y+h-14)break;ctx.fillText(l,x+18,yy);yy+=S.lh}yy+=4}}
function docPhoto(e){let c=PH.get('d'+e.id);if(!c){c=mk(120,90);const x=c.getContext('2d');x.fillStyle='#17121e';x.fillRect(0,0,120,90);for(let i=0;i<5;i++){x.fillStyle='rgba(255,255,255,.03)';x.fillRect(0,i*18,120,1)}
  x.save();x.translate(60,46);x.rotate((hs(sd(e.id),3)-.5)*.25);docSheet(x,e,-34,-34,68,68,false);x.restore();
  const vg=x.createRadialGradient(60,45,28,60,45,78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,12,.7)');x.fillStyle=vg;x.fillRect(0,0,120,90);
  for(let i=0;i<300;i++){x.fillStyle=hs(i,5)>.5?'rgba(255,255,255,.07)':'rgba(0,0,0,.14)';x.fillRect(hs(i,6)*120,hs(i,7)*90,1,1)}PH.set('d'+e.id,c)}return c}
function photoOf(e){if(e.k==='doc')return docPhoto(e);let c=PH.get(e.id+(e.v||0));if(!c){c=e.k==='item'?itemScene(e):photoScene(e);PH.set(e.id+(e.v||0),c)}return c}
// ---------- itens coletados e destruídos ----------
const SPEC=[
 {id:'S_key',t:'Chave da Câmara',cat:'collect',fx:'collect',art:'key',z:'abyss',x:'Presa em fios que só o fogo desfaz. Pesa mais do que parece.',has:g=>g.player.keys.includes('boss_key')},
 {id:'S_flame',t:'Chama de Lúmen',cat:'collect',fx:'collect',art:'flame',z:'kitchen',x:'A chaleira fugia de quem corria. Só o dash a alcançou.',has:g=>g.player.hasFlame},
 {id:'S_stitch',t:'Costura Astral',cat:'collect',fx:'collect',art:'butterfly',z:'basement2',x:'O ar também é chão, se você insistir.',has:g=>g.player.hasStitch},
 {id:'D_seal',t:'Selo do Cofre',cat:'destroy',fx:'burn',art:'door',z:'vault',x:'Os fios arderam. Atrás deles, alguma coisa respirou aliviada.',has:g=>g.interactives.some(i=>i.type==='seal'&&i.collected)},
 {id:'D_spirit_free',t:'Espírito do Véu',cat:'free',fx:'free',art:'spirit',z:'basement2',x:'Ele soltou os próprios fios. A parede do Véu se abriu sem barulho.',has:g=>(g.player.nar.f.fr_spirit||0)>0},
 {id:'D_spirit_cut',t:'Espírito do Véu',cat:'cut',fx:'cut',art:'spirit',z:'basement2',x:'Cortado ao meio. O silêncio que ficou foi imediato.',has:g=>(g.player.nar.f.ct_spirit||0)>0}];
const ENEMY={paper_doll:['doll','Boneca de papel'],specter_rat:['rat','Rato espectral'],broken_marionette:['mari','Marionete quebrada']};
for(const ty in ENEMY){const n=ENEMY[ty][1];
  SPEC.push({id:'E_'+ty+'_free',t:n+' libertada',cat:'free',fx:'free',art:'enemy',en:ENEMY[ty][0],z:'bedroom',x:'Os fios se soltaram. Ela pareceu aliviada.',has:g=>(g.player.nar.f['fr_'+ty]||0)>0});
  SPEC.push({id:'E_'+ty+'_cut',t:n+' finalizada',cat:'cut',fx:'cut',art:'enemy',en:ENEMY[ty][0],z:'bedroom',x:'Os fios foram cortados. Ninguém reclamou.',has:g=>(g.player.nar.f['ct_'+ty]||0)>0})}
function itemScene(e){const W=120,H=90,c=mk(W,H),x=c.getContext('2d'),z=ZONES.find(q=>q.id===e.z)||ZONES[0],s=sd(e.id),r=i=>hs(s,i);
  x.imageSmoothingEnabled=false;x.fillStyle=z.wall;x.fillRect(0,0,W,H);const wd=art('wall_diamond');if(wd){x.globalAlpha=.55;for(let i=0;i<3;i++)for(let j=0;j<2;j++)x.drawImage(wd,i*47,j*65,47,65);x.globalAlpha=1}
  x.fillStyle=z.floor;x.fillRect(0,66,W,24);const a=e.art;
  if(a==='key'){const g2=x.createRadialGradient(60,48,2,60,48,34);g2.addColorStop(0,'rgba(255,220,150,.5)');g2.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=g2;x.fillRect(20,10,80,80);img(x,'key',60,74,56)}
  else if(a==='flame'){img(x,'candelabra',60,86,54);flame(x,60,26,9)}
  else if(a==='butterfly'){const g2=x.createRadialGradient(60,40,2,60,40,36);g2.addColorStop(0,'rgba(190,130,255,.55)');g2.addColorStop(1,'rgba(190,130,255,0)');x.fillStyle=g2;x.fillRect(20,0,80,80);for(const sg of[-1,1]){x.fillStyle='#e6d0ff';x.beginPath();x.moveTo(60,44);x.lineTo(60+sg*34,16);x.lineTo(60+sg*26,50);x.closePath();x.fill();x.fillStyle='#b78cf0';x.beginPath();x.moveTo(60,44);x.lineTo(60+sg*30,64);x.lineTo(60+sg*10,52);x.closePath();x.fill()}R(x,59,28,2,28,'#120a1c')}
  else if(a==='door'){img(x,'door_gothic',60,86,72);x.strokeStyle='#D27A8A';for(let i=0;i<6;i++){x.beginPath();x.moveTo(40+r(i)*8,26+i*8);x.quadraticCurveTo(60,32+i*8+r(i+9)*8,80-r(i+3)*8,26+i*8);x.stroke()}}
  else if(a==='spirit'){const S=window.SPRS&&window.SPRS.boss_aura;if(S&&S.i.naturalWidth){const h=70,w=S.cw*h/S.ch;x.drawImage(S.i,0,0,S.cw,S.ch,60-w/2,84-h,w,h)}}
  else if(a==='enemy'){strip(x,e.en+'_idle',0,60,84,{doll:44,rat:30,mari:52}[e.en]||40)}
  const lg=x.createRadialGradient(r(10)>.5?20:100,10,2,60,40,80);lg.addColorStop(0,'rgba(255,170,200,.30)');lg.addColorStop(1,'rgba(255,170,200,0)');x.fillStyle=lg;x.fillRect(0,0,W,H);
  x.globalCompositeOperation='multiply';x.fillStyle='rgba(150,115,185,.55)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
  for(let i=0;i<500;i++){x.fillStyle=r(i+50)>.5?'rgba(255,255,255,.08)':'rgba(0,0,0,.16)';x.fillRect(r(i+51)*W,r(i+52)*H,1,1)}
  const vg=x.createRadialGradient(W/2,H/2,28,W/2,H/2,78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,12,.72)');x.fillStyle=vg;x.fillRect(0,0,W,H);
  if(e.fx==='burn'){for(let i=0;i<4;i++){const ed=[[0,0],[W,0],[W,H],[0,H]][i],gr=x.createLinearGradient(ed[0],ed[1],W/2,H/2);gr.addColorStop(0,'rgba(255,120,30,.75)');gr.addColorStop(.18,'rgba(20,8,4,.85)');gr.addColorStop(.4,'rgba(20,8,4,0)');x.fillStyle=gr;x.fillRect(0,0,W,H)}x.fillStyle='#06030a';for(let i=0;i<7;i++){x.beginPath();x.arc(r(i+92)<.5?r(i+91)*12:W-r(i+92)*12,r(i+93)*H,3+r(i+94)*7,0,TAU);x.fill()}}
  if(e.fx==='cut'){const t=mk(W,H);t.getContext('2d').drawImage(c,0,0);x.clearRect(0,0,W,H);x.save();x.beginPath();x.moveTo(0,0);x.lineTo(W,0);x.lineTo(0,H);x.closePath();x.clip();x.drawImage(t,0,0);x.restore();x.save();x.beginPath();x.moveTo(W,0);x.lineTo(W,H);x.lineTo(0,H);x.closePath();x.clip();x.drawImage(t,3,3);x.restore();x.strokeStyle='rgba(255,60,90,.95)';x.lineWidth=1.5;x.beginPath();x.moveTo(W,0);x.lineTo(0,H);x.stroke()}
  if(e.fx==='free'){const g2=x.createRadialGradient(60,44,4,60,44,60);g2.addColorStop(0,'rgba(255,240,250,.35)');g2.addColorStop(1,'rgba(255,240,250,0)');x.fillStyle=g2;x.fillRect(0,0,W,H);for(let i=0;i<7;i++){const bx=14+r(i+100)*92,by=8+r(i+101)*50,sz=3+r(i+102)*4;x.fillStyle=i%2?'#ffd0e4':'#e6d8ff';for(const sg of[-1,1]){x.beginPath();x.moveTo(bx,by);x.lineTo(bx+sg*sz,by-sz*.8);x.lineTo(bx+sg*sz*.8,by+sz*.5);x.closePath();x.fill()}}}
  if(e.fx==='collect'){x.strokeStyle='rgba(255,230,180,.55)';x.strokeRect(6.5,6.5,W-13,H-13)}return c}
// ---------- catálogo ----------
let NCAT=null;
function catalog(g){const p=g.player,N=window.NARR,L=lst(p),by={};L.forEach(d=>by[d.id]=d);
  if(!NCAT){NCAT={photo:[],doc:[]};EVENTS.forEach(id=>NCAT.photo.push({id:'V_'+id,t:EV_T[id]}));FRAGS.forEach(id=>NCAT.photo.push({id:'F_'+id,t:FRAG_T[id]}));N.ORD.forEach(id=>{const n=N.NODE[id];if(!n)return;if(PHOTO_N.has(id))NCAT.photo.push({id,t:n.lab,z:n.z});else if(isDocNode(n))NCAT.doc.push({id,t:n.lab,z:n.z})})}
  const slot=(c,k)=>by[c.id]?Object.assign({un:true},c,by[c.id],{k}):Object.assign({un:false,k,sc:c.id},c);
  const photos=NCAT.photo.map(c=>slot(c,'photo')),docs=NCAT.doc.map(c=>slot(c,'doc'));
  g.interactives.filter(i=>i.type==='book').forEach(i=>docs.push(by['B_'+i.id]?Object.assign({un:true},by['B_'+i.id]):{id:'B_'+i.id,k:'doc',un:false,t:'Livro',kind:'book'}));
  const items=SPEC.map(e=>Object.assign({},e,{k:'item',un:!!e.has(g),lines:[e.x]}));
  return [photos,docs,items]}
// ---------- tela do álbum ----------
const STAMP={collect:['COLETADO','#e8d9a0'],destroy:['DESTRUÍDO','#e0607a'],free:['LIBERTADO','#9ad8c0'],cut:['FINALIZADO','#e0607a']};
function stamp(ctx,k,x,y,rot,sz){const s=STAMP[k];if(!s)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.font='bold '+sz+'px '+TYPE;const w=ctx.measureText(s[0]).width+10;ctx.strokeStyle=s[1];ctx.fillStyle='rgba(8,5,14,.55)';ctx.lineWidth=2;ctx.fillRect(-w/2,-sz*.8,w,sz*1.5);ctx.strokeRect(-w/2,-sz*.8,w,sz*1.5);ctx.fillStyle=s[1];ctx.textAlign='center';ctx.fillText(s[0],0,sz*.3);ctx.restore()}
function polaroid(ctx,e,x,y,sc,sel,rot){const ph=e.un?photoOf(e):null,w=120*sc,h=90*sc,cw=w+24*sc,ch=h+34*sc;
  ctx.save();ctx.translate(x+cw/2,y+ch/2);ctx.rotate(rot||0);ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=e.un?'#e8dfcc':'#2d2535';ctx.fillRect(-cw/2,-ch/2,cw,ch);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  if(ph){ctx.imageSmoothingEnabled=false;ctx.drawImage(ph,-w/2,-ch/2+12*sc,w,h);ctx.fillStyle='#3a2a34';ctx.font='italic '+(sc>1?13:9)+'px '+HAND;ctx.textAlign='center';const t=sc>1||e.t.length<=22?e.t:e.t.slice(0,21)+'…';ctx.fillText(t,0,ch/2-8*sc);if(STAMP[e.cat]&&sc<1.5)stamp(ctx,e.cat,w/2-8,-ch/2+h-2*sc,.18,7)}
  else{ctx.fillStyle='#120d18';ctx.fillRect(-w/2,-ch/2+12*sc,w,h);ctx.fillStyle='#5a4a62';ctx.font=(40*sc)+'px '+HAND;ctx.textAlign='center';ctx.fillText('?',0,-ch/2+12*sc+h*.68);ctx.fillStyle='#6a5a72';ctx.font='italic '+(9*sc)+'px '+HAND;ctx.fillText('ainda não registrado',0,ch/2-8*sc)}
  ctx.restore();COL.tape(ctx,x+cw/2,y+2,24*sc,8*sc,(rot||0)-.25,sel?'rgba(230,120,160,.9)':null);
  if(sel){ctx.strokeStyle='rgba(255,200,225,.9)';ctx.lineWidth=2;ctx.strokeRect(x-2,y-2,cw+4,ch+4)}}
const TABS=['FOTOGRAFIAS','DOCUMENTOS','ITENS'];window.__ALBU={photoOf,zname,CLUE,TABS,open:openAlbum};
COL.album=function(g,ctx){const A=g._alb,list=A.lists[A.tab],sel=A.sel[A.tab];
  ctx.fillStyle='#120e17';ctx.fillRect(0,0,640,360);for(let i=0;i<260;i++){ctx.fillStyle=hs(i,1)>.5?'rgba(255,255,255,.025)':'rgba(0,0,0,.18)';ctx.fillRect(hs(i,2)*640,hs(i,3)*360,2,1)}
  COL.paper(ctx,8,10,624,342,'ink',77,-.002,{j:3.5,sh:12});
  TABS.forEach((n,i)=>{const on=i===A.tab,w=on?150:122,x=24+i*152;COL.paper(ctx,x,on?4:10,w,24,on?'cream':'ink2',90+i,(i-1)*.006,{j:1.5,sh:on?6:3});ctx.fillStyle=on?'#2a1c28':'#8a7a92';ctx.font='bold 10px '+TYPE;ctx.textAlign='center';const un=A.lists[i].filter(e=>e.un).length;ctx.fillText(n+' '+un+'/'+A.lists[i].length,x+w/2,on?22:28);ctx.textAlign='left'});
  const pages=Math.max(1,Math.ceil(list.length/6)),pg=Math.floor(sel/6);ctx.fillStyle='#D8A0B0';ctx.font='italic 10px '+HAND;ctx.textAlign='right';ctx.fillText('pág. '+(pg+1)+'/'+pages,614,28);ctx.textAlign='left';
  for(let i=0;i<6;i++){const idx=pg*6+i,e=list[idx];if(!e)continue;const c=i%3,r=Math.floor(i/3),x=44+c*196,y=44+r*148;polaroid(ctx,e,x,y-(idx===sel?3:0),1,idx===sel,((idx*7)%5-2)*.012)}
  ctx.fillStyle='#9a8a9a';ctx.font='italic 10px '+HAND;ctx.fillText('← → ↑ ↓ escolher  ·  Q / R trocar de aba  ·  E ver  ·  L / Esc fechar',28,344);
  if(A.detail){const e=list[sel];ctx.fillStyle='rgba(6,4,10,.86)';ctx.fillRect(0,0,640,360);
    if(e.k==='doc'){docSheet(ctx,e,120,22,400,300,true);COL.tape(ctx,150,26,30,9,-.4);COL.tape(ctx,490,28,30,9,.4);ctx.fillStyle='#E6DCC6';ctx.font='bold 12px '+TYPE;ctx.textAlign='center';ctx.fillText(e.t,320,346);ctx.textAlign='left';ctx.fillStyle='#9a8a9a';ctx.font='italic 10px '+HAND;ctx.fillText(zname(e.z),128,346);ctx.textAlign='right';ctx.fillText('Esc — voltar',512,346);ctx.textAlign='left'}
    else{polaroid(ctx,e,36,40,2,false,-.03);COL.paper(ctx,320,44,286,262,'cream',91,.01,{j:3});COL.tape(ctx,340,48,30,9,-.4);COL.tape(ctx,590,50,30,9,.4);
      ctx.fillStyle='#2a1c28';ctx.font='bold 13px '+TYPE;let y=78;COL.wrap(ctx,e.t.toUpperCase(),250).forEach(l=>{ctx.fillText(l,338,y);y+=16});
      ctx.fillStyle='#8a3a52';ctx.font='italic 11px '+HAND;ctx.fillText(zname(e.z),338,y+2);y+=22;
      ctx.fillStyle='#3a2a34';ctx.font='12px '+SERIF;for(const ln of (e.lines||[])){for(const l of COL.wrap(ctx,ln,246)){if(y>262)break;ctx.fillText(l,338,y);y+=16}y+=3}
      const cl=CLUE[e.id.replace(/^F_|^V_/,'')]||CLUE[e.sc];if(cl){ctx.fillStyle='#c8284a';ctx.font='italic 12px '+HAND;let yy=Math.max(y+6,250);COL.wrap(ctx,'✎ '+cl,246).slice(0,2).forEach(l=>{ctx.fillText(l,338,yy);yy+=15})}
      if(STAMP[e.cat])stamp(ctx,e.cat,500,290,-.14,13);ctx.fillStyle='#9a8a9a';ctx.font='italic 10px '+HAND;ctx.fillText('Esc — voltar ao álbum',40,334)}}};
// ---------- pausa ----------
const PM=['CONTINUAR','MAPA','ÁLBUM','SAIR'];
G.drawPause=function(ctx){const sel=this._pm||0;ctx.fillStyle='rgba(8,6,12,.8)';ctx.fillRect(0,0,640,360);
  COL.ransom(ctx,'PAUSADO',178,70,34,3,['cream','rose','ink2','bone']);
  if(this._pq){COL.paper(ctx,150,146,340,136,'cream',17,-.01);COL.tape(ctx,168,148,26,9,-.5);COL.tape(ctx,472,149,26,9,.4);ctx.fillStyle='#2a2030';ctx.textAlign='center';ctx.font='bold 14px '+TYPE;ctx.fillText('Sair para o menu?',320,176);ctx.font='11px '+TYPE;ctx.fillText('O progresso desde o último descanso',320,194);ctx.fillText('será perdido.',320,208);
    [['SAIR',250],['VOLTAR',390]].forEach((o,i)=>{const on=(this._pqs||0)===i;if(on)COL.paper(ctx,o[1]-50,226,100,26,'rose',60+i,i?.01:-.01,{j:2});ctx.fillStyle=on?'#fff':'#4a3a44';ctx.font='bold 12px '+TYPE;ctx.fillText(o[0],o[1],243)});ctx.textAlign='left';return}
  PM.forEach((o,i)=>{const y=140+i*40,on=i===sel;if(on){COL.paper(ctx,230,y-4,180,30,'rose',50+i,-.012,{j:2,sh:6});COL.tape(ctx,238,y-2,22,8,-.45)}else COL.paper(ctx,236,y,168,24,'ink2',60+i,i%2?.012:-.012,{j:1.8,sh:4});
    ctx.fillStyle=on?'#fff':'#b8aab8';ctx.font=(on?'bold 14px ':'13px ')+TYPE;ctx.textAlign='center';ctx.fillText(o,320,y+(on?17:17));ctx.textAlign='left'})};
// ---------- entrada, estados e persistência ----------
const oU=G.update;
function openAlbum(g,from){const L=catalog(g);g._alb={lists:L,tab:0,sel:[0,0,0],detail:false,from};g.state='album'}
G.update=function(dt){
  if(this.state==='album'){const i=this.input,A=this._alb,L=A.lists[A.tab],n=L.length;
    if(i.wasPressed('Escape')||i.wasPressed('KeyL')||i.wasPressed('KeyM')){if(A.detail)A.detail=false;else this.state=A.from||'playing';return}
    if(A.detail){if(i.wasPressed('KeyE')||i.wasPressed('Enter'))A.detail=false;return}
    if(i.wasPressed('KeyQ')){A.tab=(A.tab+2)%3;return}if(i.wasPressed('KeyR')){A.tab=(A.tab+1)%3;return}
    const s=A.sel;
    if(i.wasPressed('ArrowRight')||i.wasPressed('KeyD'))s[A.tab]=Math.min(n-1,s[A.tab]+1);
    if(i.wasPressed('ArrowLeft')||i.wasPressed('KeyA'))s[A.tab]=Math.max(0,s[A.tab]-1);
    if(i.wasPressed('ArrowDown')||i.wasPressed('KeyS'))s[A.tab]=Math.min(n-1,s[A.tab]+3);
    if(i.wasPressed('ArrowUp')||i.wasPressed('KeyW'))s[A.tab]=Math.max(0,s[A.tab]-3);
    if((i.wasPressed('KeyE')||i.wasPressed('Enter'))&&L[s[A.tab]]&&L[s[A.tab]].un)A.detail=true;
    return}
  if(this.state==='pause'){const i=this.input;
    if(this._pq){if(i.wasPressed('ArrowLeft')||i.wasPressed('ArrowRight')||i.wasPressed('KeyA')||i.wasPressed('KeyD'))this._pqs=1-(this._pqs||0);
      if(i.wasPressed('Escape'))this._pq=false;
      else if(i.wasPressed('Enter')||i.wasPressed('KeyE')){if((this._pqs||0)===0){this._pq=false;this.state='title';this.titleSelect=0;try{this.hasSave=!!localStorage.getItem(CONFIG.SAVE_KEY)}catch(e){}}else this._pq=false}
      return}
    if(i.wasPressed('ArrowDown')||i.wasPressed('KeyS'))this._pm=((this._pm||0)+1)%PM.length;
    if(i.wasPressed('ArrowUp')||i.wasPressed('KeyW'))this._pm=((this._pm||0)+PM.length-1)%PM.length;
    if(i.wasPressed('Enter')||i.wasPressed('KeyE')){const k=this._pm||0;if(k===0){this.state='playing';return}if(k===1){this.state='map';return}if(k===2){openAlbum(this,'pause');return}this._pq=true;this._pqs=1;return}
    if(i.wasPressed('KeyL')){openAlbum(this,'pause');return}}
  if((this.state==='playing'||this.state==='map')&&this.input.wasPressed('KeyL')&&!this.dialog&&!this._nar&&!this._choice&&!this._conn&&!this._bossChoice){openAlbum(this,this.state);return}
  if(this.state==='playing'&&this.input.pause&&this.input.pause()){this._pm=0;this._pq=false}
  return oU.call(this,dt)};
const oD=G.draw;
G.draw=function(){oD.call(this);if(this.state==='album'&&this._alb)COL.album(this,this.ctx)};
const oSG=G.saveGame;G.saveGame=function(){oSG.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k));if(d){d.docs=lst(this.player);localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCG=G.continueGame;G.continueGame=function(){oCG.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));if(d&&this.player)this.player.docs=d.docs||[]}catch(e){}};
})();
