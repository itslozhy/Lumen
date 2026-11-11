/* ===== MEMÓRIAS, ESCOLHAS E DESBLOQUEIOS — motor + pontos (spec LUMEN_Especificacao) ===== */
(function(){
const G=Game.prototype,TAU=Math.PI*2;
const hs=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const NS=p=>{const n=p.nar=p.nar||{f:{},c:{},s:{}};return n};
const RES=p=>{p.res=p.res||{mika:0,kaim:0,kami:0};return p.res};
const DK={mika:'m',kaim:'k',kami:'a'};
const dom=p=>{const r=RES(p),a=Object.keys(r).sort((x,y)=>r[y]-r[x]);return r[a[0]]>=2&&r[a[0]]-r[a[1]]>=2?a[0]:null};
const NODE={},ORD=[];
const def=(id,z,s,o)=>{o.id=id;o.z=z;o.sh=s;NODE[id]=o;ORD.push(id)};
const Q=a=>a;
// ---------- condições declarativas ----------
function ev(g,t){
  if(Array.isArray(t)){if(t[0]==='or')return t.slice(1).some(x=>ev(g,x));return t.every(x=>ev(g,x))}
  const p=g.player,n=NS(p);let neg=false;if(t[0]==='!'){neg=true;t=t.slice(1)}let r=false;
  if(t.startsWith('f:'))r=!!n.f[t.slice(2)];else if(t.startsWith('d:'))r=n.c[t.slice(2)]!==undefined;
  else if(t.startsWith('z:'))r=!!(p.visitedZones&&p.visitedZones.has(t.slice(2)));else if(t.startsWith('mz:'))r=!!n.f['mz_'+t.slice(3)];
  else if(t.startsWith('mzc:')){const[a,b]=t.slice(4).split('>=');r=(n.f['mc_'+a]||0)>=+b}
  else if(t.startsWith('mzn>='))r=Object.keys(n.f).filter(k=>k.startsWith('mz_')).length>=+t.slice(5);
  else if(t.startsWith('m>='))r=Object.keys(n.f).filter(k=>k.startsWith('m_')).length>=+t.slice(3);
  else if(t.startsWith('chz>=')){const zs=new Set();for(const k in n.c)if(NODE[k]&&NODE[k].c)zs.add(NODE[k].z);r=zs.size>=+t.slice(5)}
  else if(t.startsWith('ch>='))r=Object.keys(n.c).filter(k=>NODE[k]&&NODE[k].c).length>=+t.slice(4);
  else if(t.startsWith('q>='))r=['q_room','q_absence','q_return'].filter(k=>n.f[k]).length>=+t.slice(3);
  else if(t.startsWith('conn>='))r=Object.keys(n.f).filter(k=>k.startsWith('cl_')||k.startsWith('pfb_')).length>=+t.slice(6);
  else if(t.startsWith('dom:'))r=dom(p)===t.slice(4);
  return neg?!r:r}
const vis=(g,n)=>!n.if||ev(g,n.if);
// ---------- dados: QUARTO DESFEITO ----------
def('QD-01','bedroom','photo',{lab:'Fotografia na penteadeira',mem:1,
 t:['Uma fotografia antiga.','A borda está dobrada, como se alguém a tivesse segurado por muito tempo.','Há duas figuras. Ou talvez sempre tenha havido apenas uma.'],
 c:[{t:'“Vou guardar.”',r:'m1',s:['photo_kept'],out:['Você guarda a fotografia. Algo fica faltando na penteadeira.']},
    {t:'“Não quero isso comigo.”',r:'k1',s:['photo_rejected'],out:['Você a vira para baixo. A imagem continua ali, escondida.']},
    {t:'“Ela não deveria ficar sozinha.”',r:'a1',s:['photo_sheltered'],out:['Você a coloca numa pequena moldura, com cuidado.']}],
 rc:[['O espaço vazio na penteadeira parece maior do que antes.'],['A fotografia continua virada para baixo. A poeira ao redor dela não se acumulou.'],['A moldura está limpa. O vidro, porém, mostra uma mancha por dentro.']]});
def('QD-02','bedroom','box',{lab:'Gaveta do diário',mem:1,if:['d:QD-01'],
 t:['“Não contei a ninguém que voltei ao quarto.','Às vezes, tenho a impressão de que alguém arruma minhas coisas enquanto durmo.','Perguntei quem foi. Ninguém respondeu.”'],
 c:[{t:'“Anotar a frase.”',s:['note_copied'],out:['Você anota a frase. A letra não parece sua.']},{t:'“Deixar como está.”',s:['pencil_mark'],out:['Você fecha a gaveta. Um risco de lápis surge no espelho.']}],
 rc:[['A gaveta está aberta. A frase anotada continua no caderno.'],['A gaveta fechou sozinha.']]});
def('QD-03','bedroom','mirror',{lab:'Espelho da penteadeira',if:['or','z:mirror_hall','m>=2'],
 t:['O reflexo demora um instante a acompanhar seu movimento.','Atrás de você, a cama está ocupada.','Quando se vira, não há ninguém.'],
 c:[{t:'“Tocar o vidro.”',s:['mirror_touched'],out:['O vidro está frio. Em outro lugar, algo estala.']},{t:'“Não olhar novamente.”',s:['bedroom_dim'],out:['Você desvia o olhar. A luz do quarto parece diminuir.']}],
 rc:[['A rachadura que você sentiu nunca apareceu aqui.'],['O espelho está escuro. Você evita o canto do olho.']]});
def('QD-04','bedroom','window',{lab:'Janela incompatível',if:['f:mon_any'],
 t:['Lá fora deveria haver um jardim.','Há uma parede muito próxima da janela.','Do outro lado, alguém acendeu uma luz.'],s:['window_seen'],
 rf:(g,n)=>['A parede continua colada na janela.',...(n.f.tr04?['No parapeito, riscado: “O horário foi mantido.”']:[])]});
def('M-03','bedroom','screen',{lab:'Monitor sem sinal',mon:1,if:['or','d:QD-04','z:observatory'],
 t:(g,n)=>{const m=[['m03_1',1,['Você voltou antes de terminar.']],['m03_2',n.f.q_any,['A porta estava aberta.']],['m03_3',Object.keys(n.c).filter(k=>NODE[k]&&NODE[k].c).length>=2,['Não eram três lugares.','Eram três maneiras de permanecer.']]];
   let pick=null;for(const x of m.slice().reverse())if(x[1]&&!n.f[x[0]]){pick=x;break}
   const head=['SEM SINAL','','A imagem aparece por poucos segundos.',''];
   if(pick){n.f[pick[0]]=1;return head.concat(['“'+pick[2][0]+(pick[2][1]?'':'”')].concat(pick[2][1]?[pick[2][1]+'”']:[]))}
   const last=m.filter(x=>x[1]&&n.f[x[0]]).pop();return head.concat(last?['(nada novo)']:['(sem imagem)'])}});
// ---------- CORREDOR DAS MOLDURAS ----------
def('CM-01','portrait_hall','frame',{lab:'Retrato central',mem:1,
 t:['O retrato parece ter sido retocado várias vezes.','A tinta é mais nova onde deveria estar o rosto.'],s:['central_portrait_seen'],
 v:{m:['Há marcas sob a tinta. Alguém tentou apagar uma expressão, não um rosto.'],k:['A tela está rasgada por dentro. O corte não alcança a superfície.'],a:['A tinta foi restaurada com cuidado. A figura parece tranquila demais.']},
 rf:(g,n)=>[...(n.f.altar_photo?['A figura agora segura uma fotografia, pintada por cima.']:[]),...(n.f.photo_kept?['No canto, um laço novo, pintado depois.']:[]),'O retoque continua visível.']});
def('CM-02','portrait_hall','frame',{lab:'Moldura vazia',mem:1,if:['d:CM-01',['or','f:photo_kept','f:photo_rejected','f:photo_sheltered']],
 t:['O retângulo na parede está limpo.','O restante da parede guarda a marca de uma moldura que já não existe.'],
 c:[{t:'“Procurar o que foi retirado.”',cl:'portrait_hall',out:['Atrás do papel de parede, a parede cede alguns centímetros.']},{t:'“Deixar o espaço vazio.”',s:['empty_frame_preserved'],out:['Você deixa a marca como está.']},{t:'“Cobrir a marca.”',s:['empty_frame_covered'],out:['Um tecido cobre a marca na parede.']}],
 rc:[['A abertura atrás do papel de parede continua aberta.'],['O retângulo limpo segue ali. Uma moldura vazia reapareceu na Galeria.'],['O tecido cobre a marca. Algo se move por trás dele.']]});
def('CM-02a','portrait_hall','paper',{lab:'Fotografia sem data',if:['f:cl_portrait_hall'],closet:'portrait_hall',
 t:['Uma fotografia sem data.','Mostra a mesma parede, sem a moldura.','Quem a tirou estava de costas para a câmera.']});
def('CM-03','portrait_hall','paper',{lab:'Placa de identificação',if:['f:doc_read'],
 t:['A placa tem quatro parafusos.','O nome foi removido, mas as letras deixaram marcas no metal.'],s:['tag_ok'],
 v:{m:['As letras podem ser reconstruídas. Falta apenas uma parte.'],k:['O nome foi retirado com força. Não parece um acidente.'],a:['Alguém poliu a placa para que não restassem marcas.']}});
// ---------- GALERIA QUEBRADA ----------
def('GQ-01','gallery','frame',{lab:'Quadro da menina',
 t:['A pintura representa uma menina diante de uma porta.','A porta foi pintada por cima tantas vezes que parece mais espessa que a parede.'],
 v:{m:['Há algo escrito sob a camada de tinta.'],k:['A porta foi coberta. Alguém não queria que fosse encontrada.'],a:['A pintura foi restaurada. A menina parece estar esperando.']},
 rf:(g,n)=>[...(n.f.canvas_turned?['Atrás da menina, agora, aparece um rosto de perfil.']:n.f.canvas_respected?['A menina está sozinha. A porta parece mais próxima.']:[]),'A porta continua espessa demais.']});
def('GQ-02','gallery','frame',{lab:'Fragmentos de tela',mem:1,if:['d:GQ-01',['or','mz:bedroom','mz:dead_library']],
 t:['Os pedaços não se encaixam pela cor.','Talvez a imagem nunca tenha sido uma só.'],
 c:[{t:'“Montar pela ordem das bordas.”',r:'m1',s:['frag_ordered'],out:['As bordas formam uma moldura. Dentro dela, um número de gaveta.']},{t:'“Separar os fragmentos.”',r:'k1',cl:'gallery',out:['Você afasta os pedaços. Atrás do cavalete, a parede cede.']},{t:'“Guardar todos juntos.”',r:'a1',s:['frag_kept'],out:['Você junta os pedaços num só maço. Uma dobra vira flor de papel.']}],
 rc:[['Os fragmentos estão montados pela borda.'],['Os pedaços ficaram espalhados no chão.'],['O maço de papel está guardado.']]});
def('GQ-02a','gallery','paper',{lab:'Recorte atrás do cavalete',if:['f:cl_gallery'],closet:'gallery',t:['Um recorte de tela, guardado como se tivesse sido esquecido.','Mostra só a porta, sem a menina.']});
def('GQ-03','gallery','frame',{lab:'Tela virada para a parede',if:['ch>=2'],
 t:['A moldura está presa à parede.','A tela, não.','Alguém a virou para que não pudesse ser vista.'],
 c:[{t:'“Virar a tela.”',s:['canvas_turned'],out:['Você vira a tela. A imagem do Quadro da menina vai mudar.']},{t:'“Respeitar sua posição.”',s:['canvas_respected'],out:['Você a deixa como está.']}],
 rc:[['A tela virada mostra um rosto de perfil.'],['A tela continua virada para a parede.']]});
// ---------- BIBLIOTECA MORTA ----------
def('BM-01','dead_library','box',{lab:'Fichário central',mem:1,
 t:['As gavetas estão etiquetadas por data.','Algumas datas se repetem.','Outras ainda não aconteceram.'],
 c:[{t:'Abrir a gaveta sem etiqueta.',s:['doc_read','bm01_done'],out:['“Registro incompleto.','Nome: [ilegível].','Ocorrência: retorno ao quarto.','Testemunhas: nenhuma.”']},{t:'Deixar fechado.',again:1}],
 rf:(g,n)=>['A gaveta sem etiqueta está vazia. A ficha continua na sua memória.',...(n.f.tag_ok?['Uma etiqueta nova, sem nome, aparece na gaveta.']:[]),...(n.f.frag_ordered?['Um papel solto repete o número da gaveta.']:[])]});
def('BM-02','dead_library','paper',{lab:'Livro de luto',mem:1,if:['or','d:QD-02','d:BM-01'],
 t:['“Não houve cerimônia para aquilo que desapareceu.','Ainda assim, alguém deixou flores na porta.”'],
 c:[{t:'“Procurar a data.”',s:['date_search','doc_read'],out:['A data está raspada. Uma inscrição na Capela repete o ano.']},{t:'“Procurar quem escreveu.”',s:['author_search','doc_read'],out:['A letra é cuidadosa. Um bilhete aparece no Sótão.']},{t:'“Fechar o livro.”',s:['mourning_book_closed','doc_read'],out:['Você fecha o livro. A luz da Capela vai mudar.']}],
 rc:[['O livro está aberto na data raspada.'],['O livro está aberto na página do bilhete.'],['O livro está fechado. Ainda pesa.']]});
def('BM-03','dead_library','screen',{lab:'Terminal de catálogo',mon:1,rep:1,if:['or','f:mon_any','m>=2'],
 t:['ARQUIVO DOMÉSTICO','ÍNDICE DE OCORRÊNCIAS','','03 REGISTROS INCOMPLETOS','01 REGISTRO SEM ORIGEM','AGUARDANDO CONSULTA...','','AVISO: ALGUNS REGISTROS NÃO POSSUEM DATA.'],
 c:[{t:'CONSULTAR QUARTO',s:['q_room','q_any'],out:['O cômodo foi encontrado em ordem.','A janela estava aberta.','Não foi registrada entrada.'],again:1},{t:'CONSULTAR AUSÊNCIA',s:['q_absence','q_any'],out:['Não foi possível determinar quem deveria estar presente.','O espaço reservado foi mantido.'],again:1},{t:'CONSULTAR RETORNO',s:['q_return','q_any'],out:['O registro antecede a data de entrada.','A ocorrência foi arquivada mesmo assim.'],again:1},{t:'SAIR',again:1,quiet:1}]});
def('BM-04','dead_library','box',{lab:'Estante sem identificação',mem:1,if:['d:BM-01','mz:portrait_hall'],
 t:['Não há título nas lombadas.','Os livros estão organizados pela espessura das páginas arrancadas.'],
 c:[{t:'Empurrar a estante.',cl:'dead_library',out:['A estante desloca-se alguns pixels. Uma passagem curta se abre.']},{t:'Deixar como está.',again:1}]});
def('M-04','dead_library','device',{lab:'Gravador do compartimento',mem:1,if:['f:cl_dead_library'],closet:'dead_library',s:['m04_heard'],
 t:['“Se eu escrever tudo, talvez pare de mudar.','Mas, quando leio no dia seguinte, as palavras parecem ter sido escritas por outra pessoa.','Eu reconheço a letra.','Não reconheço a intenção.”']});
def('BM-05','dead_library','paper',{lab:'Símbolo no fichário',if:['d:PP-02'],t:['Uma etiqueta circular no fichário.','É o mesmo círculo da porta de manutenção, na altura da mão.'],s:['symbol_found']});
def('BM-06','dead_library','paper',{lab:'Anotações da biblioteca',if:['or','f:note_copied','f:tag_ok','f:frag_ordered','f:nest_reorg'],
 t:(g,n)=>[...(n.f.note_copied?['Anotação: “Não contei a ninguém que voltei ao quarto.” A letra é a sua.']:[]),...(n.f.tag_ok?['Etiqueta no fichário: a mesma marca do metal da placa.']:[]),...(n.f.frag_ordered?['Papel solto: a ordem das bordas forma uma porta.']:[]),...(n.f.nest_reorg?['Inscrição a lápis: “nenhum fragmento está inteiro; todos servem”.']:[])]});
// ---------- SÓTÃO INVERTIDO ----------
def('SI-01','attic','box',{lab:'Caixa de lembranças',mem:1,
 t:['A caixa contém objetos que parecem pertencer a épocas diferentes.','Todos têm a mesma etiqueta: “guardar”.'],
 c:[{t:'“Organizar por data.”',r:'m1',s:['order_ok'],out:['Você alinha os objetos. Uma ordem de consulta se desenha no Observatório.']},{t:'“Retirar o que não pertence.”',r:'k1',cl:'attic',out:['Ao retirar um objeto, um vão se abre entre as vigas.']},{t:'“Manter tudo junto.”',r:'a1',s:['flowerbox'],out:['Você fecha a caixa com tudo dentro. Cheira a flores.']}],
 rc:[['Os objetos estão em fila, por data.'],['Falta um objeto na caixa. O vão entre as vigas continua aberto.'],['A caixa está fechada, com tudo dentro.']]});
def('SI-01a','attic','paper',{lab:'Etiqueta entre as vigas',if:['f:cl_attic'],closet:'attic',t:['Entre as vigas há um bolsão estreito.','Dentro, uma etiqueta: “guardar”. Está dobrada ao contrário.']});
def('SI-02','attic','chair',{lab:'Cadeira suspensa',if:['z:mirror_hall'],
 t:['A cadeira balança sem vento.','O assento está marcado como se alguém tivesse acabado de se levantar.'],
 rf:(g,n)=>[n.f.photo_kept?'Um pequeno laço repousa no assento.':n.f.photo_rejected?'A cadeira está virada para a parede.':n.f.photo_sheltered?'Há um tecido dobrado no assento.':'O assento está marcado.']});
def('SI-03','attic','thing',{lab:'Relógio desmontado',if:['d:BM-01'],
 t:['As peças estão limpas.','Não há sinal de ferrugem nas engrenagens.','Alguém desmontou o relógio com cuidado.'],
 c:[{t:'Recolher uma engrenagem.',s:['has_gear'],out:['Você guarda uma engrenagem. Ela está quente.']},{t:'Deixar as peças.',again:1}]});
def('SI-04','attic','box',{lab:'Caixa lacrada',mem:1,if:['f:note_found'],
 t:['A caixa não tem fechadura.','O lacre parece ter sido colocado para impedir que alguém a abrisse sem se sentir culpado.'],
 c:[{t:'Abrir.',s:['box_open'],out:['O lacre cede. Por dentro, só um cheiro de gaveta.']},{t:'Preservar lacrada.',s:['box_kept'],out:['Você a deixa como estava.']},{t:'Abandonar.',s:['box_left'],out:['Você se afasta. O lacre parece mais apertado.']}],
 rc:[['A caixa está aberta. Algo no Jardim mudou.'],['A caixa permanece lacrada.'],['A caixa ficou para trás.']]});
def('SI-05','attic','paper',{lab:'Bilhete entre as vigas',if:['f:author_search'],t:['Um bilhete preso entre as vigas.','“Quem escreve sobre o luto sempre deixa a luz acesa.”'],s:['note_found']});
// ---------- TORRE DO RELÓGIO ----------
def('TR-01','clock_tower','thing',{lab:'Relógio central',t:['Todos os relógios estão parados.','O mecanismo central continua funcionando.'],s:['clock_seen']});
def('TR-02','clock_tower','thing',{lab:'Engrenagem ausente',if:['f:has_gear'],t:['A peça encaixa perfeitamente.','O relógio não volta a funcionar.','Em algum lugar da torre, uma trava se solta.'],s:['gear_placed']});
def('TR-02a','clock_tower','paper',{lab:'Placa metálica',if:['f:gear_placed'],pf:1,t:['“O horário foi mantido.','A ocorrência, não.”']});
def('TR-03','clock_tower','frame',{lab:'Vitrais das três figuras',if:['ch>=2'],t:['Três figuras.','O mesmo contorno.','Nenhuma olha na mesma direção.'],s:['tr03'],
 v:{m:['A figura que investiga tem mais detalhes: dedos, fios, marcas.'],k:['A figura que se afasta tem mais detalhes: bordas quebradas.'],a:['A figura que permanece tem mais detalhes: dobras de tecido e flores.']}});
def('TR-04','clock_tower','paper',{lab:'Placa de horário',if:['f:q_return'],t:['“O horário registrado não corresponde ao horário observado.”'],s:['tr04']});
def('TR-05','clock_tower','paper',{lab:'Anotação',if:['f:o03_done'],t:['Anotação a lápis: “o ponteiro mede distância.','Quando perguntam sobre tempo, ele se move.”']});
// ---------- SALÃO AFUNDADO ----------
def('SA-01','sunken_hall','water',{lab:'Espelho d’água',mem:1,t:['A água está imóvel.','Seu reflexo não está olhando para você.'],s:['water_reflection_seen','found_flower'],
 v:{m:['O reflexo examina um objeto no chão.'],k:['O reflexo está de costas.'],a:['O reflexo estende a mão para a superfície.']}});
def('SA-02','sunken_hall','paper',{lab:'Objeto submerso',mem:1,if:['d:SA-01',['or','f:photo_rejected','f:photo_kept']],
 t:['Há algo sob a água.','A forma lembra uma fotografia, mas o papel não deveria resistir tanto tempo submerso.'],
 c:[{t:'Retirar o objeto.',s:['sub_taken','sa_choice'],out:['O papel está seco. A imagem aparece na Galeria.']},{t:'Deixar submerso.',s:['sub_left','sa_choice'],out:['Você o deixa afundar de novo. O reflexo do Corredor dos Espelhos vai mudar.']},{t:'Cobrir com tecido.',s:['sub_covered','sa_choice'],out:['Você o cobre. Algo muda no Jardim Interno.']}],
 rc:[['A água está vazia. A imagem foi para a Galeria.'],['O objeto continua sob a água.'],['O tecido flutua sobre algo que não aparece.']]});
def('SA-03','sunken_hall','thing',{lab:'Lustre caído',if:['z:clock_tower'],t:['Entre os cristais há uma pequena peça metálica.','Ela tem o mesmo formato da placa da torre.'],s:['got_plate']});
def('SA-04','sunken_hall','mirror',{lab:'Porta refletida',if:['d:SA-01','mz:dead_library'],t:['A porta existe apenas na água.','No reflexo, está entreaberta.'],
 c:[{t:'Atravessar o reflexo.',cl:'sunken_hall',out:['A água se parte. Uma passagem lateral se abre.']},{t:'Afastar-se.',again:1}]});
def('SA-04a','sunken_hall','paper',{lab:'Compartimento lateral',if:['f:cl_sunken_hall'],closet:'sunken_hall',t:['Uma cadeira virada para a água.','No chão, uma marca circular, como a de um copo.']});
// ---------- PASSAGEM DO PORÃO ----------
def('PP-01','cellar_path','screen',{lab:'Quadro de distribuição',mon:1,t:['CIRCUITO DOMÉSTICO','SETOR A — QUARTOS','SETOR B — ARQUIVO','SETOR C — INDEFINIDO','SETOR C: SEM PLANTA'],
 c:[{t:'Examinar o circuito C.',s:['unknown_circuit','pp01'],out:['O fio continua para dentro da parede.','A planta da casa não mostra o que existe do outro lado.']},{t:'Afastar-se.',again:1}]});
def('PP-02','cellar_path','mark',{lab:'Parede marcada',if:['f:unknown_circuit','mz:basement'],t:['As marcas parecem arranhões.','Quando observadas de perto, formam linhas que se cruzam como um mapa.'],s:['marks_found']});
def('PP-03','cellar_path','pipe',{lab:'Tubulação rompida',if:['f:sa_choice'],t:['A água percorre o cano na direção errada.','O som vem de uma parede seca.'],s:['pp03']});
def('PP-04','cellar_path','mark',{lab:'Porta de manutenção',if:['d:PP-02','f:symbol_found'],t:['Não há maçaneta.','Há apenas uma marca circular na altura da mão.'],
 c:[{t:'Pressionar a marca circular.',cl:'cellar_path',out:['A porta cede. Um compartimento pequeno se abre.']},{t:'Afastar-se.',again:1}]});
def('M-01','cellar_path','screen',{lab:'Monitor de manutenção',mon:1,rep:1,if:['f:cl_cellar_path'],closet:'cellar_path',
 t:['SISTEMA DE MANUTENÇÃO','CASA / SETOR C','CONEXÃO: ATIVA','ORIGEM: NÃO IDENTIFICADA','','ÚLTIMA ALTERAÇÃO:','“A parede foi construída ao redor do acesso.”'],
 c:[{t:'[1] VER PLANTA',out:['Planta indisponível.','O espaço consta como vazio.','A conexão permanece ativa.'],again:1,s:['m01_seen']},{t:'[2] VER REGISTRO',out:['Registro anterior à instalação do monitor.','Usuário: [sem identificação].','Mensagem: “Não fechem a passagem outra vez.”'],again:1,s:['m01_seen']},{t:'[3] SAIR',again:1,quiet:1}]});
// ---------- POÇO DAS ESCADAS ----------
def('PE-01','stairwell','window',{lab:'Janela vertical',t:['A janela mostra o Quarto Desfeito.','A cama está em outro lugar.','A porta está aberta.'],s:['shaft_window_seen']});
def('PE-02','stairwell','paper',{lab:'Patamar intermediário',if:['or','d:BM-02','f:pp01'],pf:1,t:['Inscrição no patamar:','“Não desça para encontrar o começo.','O começo não está abaixo.”']});
def('PE-03','stairwell','mark',{lab:'Porta lateral',mem:1,if:['d:PE-02','mzn>=2'],t:['A porta não tem dobradiças.','A parede ao redor parece ter sido construída depois dela.'],
 c:[{t:'Empurrar a porta.',cl:'stairwell',out:['A porta gira para dentro. Uma sala pequena se abre.']},{t:'Afastar-se.',again:1}]});
def('M-05','stairwell','device',{lab:'Gravador do Poço',mem:1,if:['f:cl_stairwell'],closet:'stairwell',s:['m05_heard'],t:['“Eu pedi que não voltassem a falar disso.','Depois, pedi que não esquecessem.','Não sei qual pedido foi atendido.”']});
def('PE-04','stairwell','thing',{lab:'Fios suspensos',if:['d:PC-01'],t:['Os fios não estão presos ao teto.','Eles continuam para cima, além do que a luz alcança.'],s:['pe04']});
def('PE-05','stairwell','paper',{lab:'Ponto de inspeção',if:['f:m01_seen'],t:['Um registro de manutenção colado na parede:','“Setor C: aberto.”']});
// ---------- PORÃO DE COSTURAS ----------
def('PC-01','basement','loom',{lab:'Grande tear',mem:1,t:['Os fios estão separados por cor.','Alguns foram cortados.','Outros parecem ter sido unidos muitas vezes.'],
 c:[{t:'“Seguir os fios intactos.”',r:'m1',s:['loom_followed'],out:['Você segue os fios. Cada um termina num objeto de outra sala.']},{t:'“Cortar os fios tensionados.”',r:'k1',cl:'basement',out:['Os fios estalam. Atrás do tear, a parede se abre.']},{t:'“Unir os fios soltos.”',r:'a1',s:['loom_joined'],out:['Você une os fios. Em algum lugar, uma estrutura se refaz.']}],
 rc:[['Os fios intactos guiam até objetos de outras salas.'],['Os fios cortados pendem. A abertura continua atrás do tear.'],['Os fios unidos formam um desenho que se repete.']]});
def('PC-01a','basement','paper',{lab:'Câmara atrás do tear',if:['f:cl_basement'],closet:'basement',t:['Uma câmara de linha atrás do tear.','Um carretel vazio e uma etiqueta: “sem ponta”.']});
def('PC-02','basement','mannequin',{lab:'Manequim central',if:['d:PC-01'],t:['O manequim tem suas proporções.','As roupas não são suas.','O rosto está coberto por tecido.'],
 c:[{t:'Retirar o tecido.',s:['mannequin_open'],out:['O rosto embaixo do tecido é liso. O tecido parece mais leve.']},{t:'Costurá-lo novamente.',s:['mannequin_sewn'],out:['Você refaz a costura. A linha vermelha não acaba.']},{t:'Deixá-lo como está.',s:['mannequin_left'],out:['Você o deixa coberto.']}],
 rc:[['O manequim está sem tecido no rosto.'],['O rosto do manequim está recosturado.'],['O manequim continua coberto.']]});
def('PC-03','basement','spool',{lab:'Carretel sem ponta',mem:1,if:['d:QD-01','d:PC-01'],t:['O fio termina dentro do carretel.','Não há ponta para puxar.','Ainda assim, o carretel está mais leve de um lado.'],s:['pc03']});
def('PC-04','basement','paper',{lab:'Tecido bordado',if:['chz>=2'],t:['“A casa não esquece.','Apenas muda o lugar onde guarda.”'],s:['stitched_phrase'],
 v:{m:['Talvez seja possível encontrar o que foi guardado.'],k:['Guardar também é uma forma de esconder.'],a:['Nem tudo precisa ser aberto para continuar existindo.']}});
// ---------- GALERIAS INFERIORES ----------
def('GI-01','sewers','box',{lab:'Depósito de objetos',t:(g,n)=>['Os objetos foram separados por material.','Papel. Madeira. Tecido. Metal.','Nenhum deles foi separado por dono.',
 ...(n.f.photo_kept||n.f.photo_sheltered?['Entre o papel, uma fotografia com a borda dobrada.']:[]),...(n.f.sub_covered||n.f.mannequin_open?['Entre os tecidos, uma dobra que você reconhece.']:[]),...(n.f.frag_kept?['Entre o papel, uma flor dobrada.']:[]),...(n.f.got_plate?['Entre os metais, uma peça com o formato de uma placa.']:[])]});
def('GI-02','sewers','plant',{lab:'Raiz principal',if:['or','d:PC-01','f:photo_sheltered','f:frag_kept','f:loom_joined','f:flowerbox'],t:['A raiz atravessa o cano e continua pela parede.','Não parece procurar água.','Parece procurar alguma coisa do outro lado.'],s:['gi02']});
def('JI-05','garden','paper',{lab:'Plataforma de raízes',if:['f:gi02'],pf:1,t:['Raízes alcançam uma plataforma de pedra.','Ela leva a um nicho opcional do jardim.']});
def('GI-03','sewers','nest',{lab:'Ninho de fragmentos',mem:1,if:['m>=2'],t:['O ninho foi construído com papel, fios e pequenas fotografias.','Nenhum fragmento está inteiro.'],
 c:[{t:'Recolher um fragmento.',s:['nest_collect'],out:['Você recolhe um fragmento. Uma pista aparece na Galeria.']},{t:'Não tocar.',s:['nest_untouched'],out:['Você o deixa em paz.']},{t:'Reorganizar.',s:['nest_reorg'],out:['Você reorganiza os pedaços. Uma inscrição aparece na Biblioteca.']}],
 rc:[['Falta um fragmento no ninho.'],['O ninho mudou de posição desde a última vez.'],['Os fragmentos estão em nova ordem.']]});
def('GI-04','sewers','mark',{lab:'Parede de drenagem',if:['d:GI-02',['or','f:ji02','d:SA-01','d:SA-02']],t:['A água deixa uma linha limpa na parede.','Sob a sujeira, há uma porta desenhada.'],
 c:[{t:'Limpar a linha na parede.',cl:'sewers',out:['A sujeira sai. A porta existe de verdade.']},{t:'Afastar-se.',again:1}]});
def('GI-04a','sewers','paper',{lab:'Compartimento de manutenção',if:['f:cl_sewers'],closet:'sewers',t:['Um compartimento de manutenção.','No chão, uma lista: “drenar / não drenar”. Um risco passa por cima das duas.']});
def('GI-05','sewers','paper',{lab:'Pistas pelo cano',if:['or','f:pp03','f:pipes_clue'],t:(g,n)=>[...(n.f.pp03?['Um símbolo foi gravado no concreto, junto ao cano.']:[]),...(n.f.pipes_clue?['O cano sobe pela parede, na direção do Jardim.']:[])]});
// ---------- CAPELA DESATIVADA ----------
def('CD-01','chapel','altar',{lab:'Altar',rep:1,t:(g,n)=>['O altar está vazio.','Há uma marca retangular no tecido, como se um objeto tivesse permanecido ali por muito tempo.',...(n.f.altar_item?['O objeto que você deixou continua no centro do altar.']:[])],
 copts:(g,n)=>n.f.altar_item?[]:[
  ...(n.f.photo_kept?[{t:'Deixar a fotografia.',s:['altar_photo','altar_item'],out:['Você deixa a fotografia. No Corredor, um retrato vai mudar.']}]:[]),
  ...(n.f.frag_kept?[{t:'Deixar a flor de papel.',s:['altar_flower','altar_item'],out:['Você deixa a flor. O Jardim vai mudar.']}]:[]),
  ...(n.f.mannequin_open?[{t:'Deixar o fragmento de tecido.',s:['altar_cloth','altar_item'],out:['Você deixa o tecido. O tear vai mudar.']}]:[]),
  {t:'Não deixar nada.',again:1}]});
def('CD-02','chapel','book',{lab:'Livro de cerimônias',mem:1,if:['d:BM-02'],t:['“Não foi possível registrar a presença de todos.','A cerimônia começou no horário previsto.','O lugar reservado permaneceu vazio.”'],
 c:[{t:'“Quem deveria estar aqui?”',s:['ask_who'],out:['Uma pergunta aparece no Observatório.']},{t:'“Por que o lugar ficou vazio?”',s:['ask_why'],out:['Uma inscrição aparece na Antecâmara.']},{t:'“Fechar o livro.”',s:['cd02_close'],out:['As velas da capela mudam.']}]});
def('CD-03','chapel','frame',{lab:'Vitrais',if:['d:TR-03'],t:['A luz atravessa três figuras.','Uma procura.','Uma se afasta.','Uma permanece.'],s:['chapel_three_figures']});
def('CD-04','chapel','chair',{lab:'Banco vazio',if:['f:altar_item'],t:['Há uma inscrição na madeira:','“Este lugar não foi esquecido. Foi reservado.”'],s:['cd04']});
def('M-06','chapel','device',{lab:'Rádio da Capela',rep:1,if:['or','d:CD-02','mzc:dead_library>=2'],
 t:(g,n)=>{const k=n.s.M06=(n.s.M06||0)+1;if(k>=2){n.f.m06_full=1;return['“A cerimônia foi registrada.','A presença não foi confirmada.','O registro não será corrigido.”']}return['...horário previsto...','...lugar reservado...','...não foi possível confirmar...']}});
def('CD-05','chapel','paper',{lab:'Inscrições da capela',if:['or','f:date_search','f:got_plate','f:q_absence'],t:(g,n)=>[...(n.f.date_search?['Inscrição: o ano raspado do livro.']:[]),...(n.f.got_plate?['Inscrição: o formato da placa da torre, riscado na pedra.']:[]),...(n.f.q_absence?['Inscrição: “o espaço reservado foi mantido”.']:[])]});
// ---------- JARDIM INTERNO ----------
def('JI-01','garden','plant',{lab:'Flor central',t:['A flor cresce em um vaso sem terra.','Suas raízes atravessam o fundo e desaparecem no piso.'],s:['central_flower_seen'],
 v:{m:['Há uma etiqueta escondida entre as raízes.'],k:['O vaso está rachado. A flor continua presa.'],a:['Alguém troca a água. Não há água no vaso.']}});
def('JI-02','garden','fountain',{lab:'Fonte seca',mem:1,if:['or','d:SA-02','d:SA-03'],t:['A fonte não tem rachaduras.','Parece ter sido esvaziada de propósito.'],
 c:[{t:'“Tentar devolver a água.”',s:['ji02'],out:(g,n)=>n.f.mz_sunken_hall?['A água sobe devagar. O reflexo da fonte não é o seu.']:['A fonte não responde. Falta algo do Salão.'],keepopen:(g,n)=>!n.f.mz_sunken_hall},
    {t:'“Deixar vazia.”',s:['fountain_dried'],out:['Pequenas flores secas surgem ao redor.']},{t:'“Procurar o encanamento.”',s:['pipes_clue'],out:['O cano sobe pela parede. Uma pista aparece nas Galerias.']}]});
def('JI-03','garden','plant',{lab:'Canteiro vazio',if:['or','f:photo_sheltered','f:frag_kept','f:altar_flower','f:loom_joined','f:flowerbox'],t:['A terra foi revolvida recentemente.','Não há pegadas ao redor.'],
 copts:(g,n)=>n.f.planted?[]:[...(n.f.frag_kept?[{t:'Plantar a flor de papel.',s:['planted'],out:['A flor de papel cria raiz. A paleta do jardim muda.']}]:[]),...(n.f.found_flower?[{t:'Plantar a flor do Salão.',s:['planted'],out:['A flor do Salão cria raiz. A paleta do jardim muda.']}]:[]),{t:'Deixar a terra descansar.',again:1}]});
def('JI-04','garden','paper',{lab:'Placa botânica',if:['d:JI-01'],t:['“Espécime sem classificação.','Não remover.','Não transplantar.','Aguardar.”'],rf:(g,n)=>['“Espécime sem classificação.','Não remover.','Não transplantar.','Aguardar.”',...(n.f.mon_any?['Uma segunda linha, a lápis: “Aguardar quem?”']:[])]});
// ---------- CORREDOR DOS ESPELHOS ----------
def('CE-01','mirror_hall','mirror',{lab:'Espelho principal',t:['O espelho não mostra uma pessoa diferente.','Mostra a mesma pessoa em um momento que não aconteceu.'],s:['main_mirror_seen'],
 v:{m:['O reflexo olha para um objeto fora do quadro.'],k:['O reflexo está de costas.'],a:['O reflexo tem uma das mãos estendida.']}});
def('CE-02','mirror_hall','mirror',{lab:'Espelho rachado',mem:1,if:['or','d:QD-03','d:SA-01'],t:['A rachadura divide o reflexo em três partes.','Nenhuma delas parece acompanhar as outras.'],
 c:[{t:'Tocar uma das partes.',s:['ce_touched'],out:(g,n)=>{const d=dom(g.player);return[d==='kaim'?'“Não precisa olhar. Você já sabe o que vai encontrar.”':d==='kami'?'“Podemos deixar assim. Não precisamos decidir agora.”':'“Se eu olhar com atenção, talvez consiga reconhecer o que mudou.”',...(n.f.m04_heard?['“Eu reconheço a letra. Não reconheço a intenção.”']:[])]}},
    {t:'Cobrir o espelho.',s:['mirror_covered'],cl:'mirror_hall',out:['Você o cobre com um pano. Atrás, uma abertura rasa.']},{t:'Não interferir.',s:['mirror_free'],out:['Três reflexos passam a se mover cada um por conta própria.']}],
 rc:[['O reflexo fala só quando você não olha.'],['O pano cobre o espelho. Algo respira atrás dele.'],['Os três reflexos se movem sozinhos.']]});
def('CE-02a','mirror_hall','paper',{lab:'Abertura atrás do pano',if:['f:cl_mirror_hall'],closet:'mirror_hall',t:['Atrás do tecido há uma abertura rasa.','Dentro, três marcas de mão no mesmo lugar.']});
def('CE-03','mirror_hall','mirror',{lab:'Espelho coberto',if:['or','f:mirror_covered','f:photo_rejected','f:empty_frame_covered'],t:['O tecido se move como se houvesse alguém respirando atrás dele.'],
 c:[{t:'Descobrir.',s:['mirror_uncovered'],out:['Você descobre o espelho. O Quarto Desfeito vai mudar.']},{t:'Manter coberto.',s:['mirror_keptcovered'],out:['Você mantém o tecido. O Quarto Desfeito vai mudar.']}]});
def('CE-04','mirror_hall','mirror',{lab:'Espelhos menores',if:['mzn>=2'],rep:1,t:['Cada espelho mostra um cômodo.','Nenhum mostra o cômodo em que você está.'],
 c:[{t:'Olhar o espelho do quarto.',s:['clue_room'],again:1,out:['O reflexo mostra uma luz acesa numa janela.']},{t:'Olhar o espelho da biblioteca.',s:['clue_lib'],again:1,out:['O reflexo mostra uma gaveta entreaberta.']},{t:'Olhar o espelho da capela.',s:['clue_chapel'],again:1,out:['O reflexo mostra um banco com uma inscrição.']},{t:'Afastar-se.',again:1,quiet:1}]});
// ---------- OBSERVATÓRIO ----------
def('O-01','observatory','paper',{lab:'Mapa celeste',t:['As estrelas estão ligadas por linhas muito finas.','As linhas formam a planta de uma casa.'],s:['star_map_seen'],rf:(g,n)=>['As estrelas formam a planta de uma casa.',...(n.f.tr03?['Três constelações novas apareceram.']:[])]});
def('O-02','observatory','thing',{lab:'Telescópio',if:['d:O-01'],t:['A lente mostra a fachada da casa.','Uma janela está iluminada.','Você não consegue determinar em qual andar ela fica.'],s:['o02_seen'],
 rf:(g,n)=>['A lente mostra a fachada da casa.',n.f.window_seen?'A janela iluminada corresponde à janela do Quarto Desfeito.':'Uma janela está iluminada.']});
def('O-03','observatory','thing',{lab:'Instrumentos de observação',if:['q>=2'],t:['Os instrumentos estão calibrados para medir distância.','O ponteiro se move quando você pergunta sobre tempo.'],s:['o03_done']});
def('O-04','observatory','paper',{lab:'Mesa de mapas',if:['d:O-01','d:BM-01'],t:(g,n)=>['Há três mapas sobre a mesa.','Todos representam a mesma casa.','Nenhum apresenta as mesmas portas.',...(Object.keys(n.f).filter(k=>k.startsWith('cl_')||k.startsWith('pfb_')).length>=3?['Um dos mapas tem uma passagem marcada a tinta.']:[]),...(n.f.order_ok?['Uma ordem de consulta está anotada na margem.']:[])]});
def('O-05','observatory','paper',{lab:'Inscrições do observatório',if:['or','f:tr03','f:ask_who','f:m06_full','f:chapel_three_figures','f:order_ok'],t:(g,n)=>[...(n.f.tr03?['Inscrição: três contornos iguais.']:[]),...(n.f.ask_who?['Pergunta: “Quem deveria estar aqui?”']:[]),...(n.f.m06_full?['Inscrição: “a presença não foi confirmada”.']:[]),...(n.f.chapel_three_figures?['Símbolo: três figuras e uma luz.']:[])]});
// ---------- ANTECÂMARA ----------
def('A-01','antechamber','chair',{lab:'Cadeira vazia',t:(g,n)=>['A cadeira está voltada para a porta.','O assento está limpo.','O chão ao redor guarda marcas de pés.',...(n.f.photo_kept?['Sobre o assento, um pequeno laço.']:[]),...(n.f.altar_flower?['Sobre o assento, uma flor seca.']:[]),...(n.f.m05_heard?['A cadeira está ligeiramente virada, como quem pediu para não esquecer.']:[]),...(n.f.cd04?['Alguém reservou esse lugar.']:[])]});
def('A-02','antechamber','mark',{lab:'Porta principal',if:['m>=3','z:chapel'],t:['Há três marcas na porta.','Uma foi gravada.','Outra foi riscada.','A terceira foi coberta com tecido.'],s:['a02_seen'],
 v:{m:['A marca gravada é a mais funda.'],k:['A marca riscada é a mais funda.'],a:['A marca coberta é a mais cuidada.']}});
def('A-03','antechamber','paper',{lab:'Inscrição na parede',if:['d:BM-02','d:CD-02'],t:['“Uma lembrança pode ser guardada.','Uma lembrança pode ser recusada.','Uma lembrança pode ser contada de novo.”'],s:['a03_seen'],rf:(g,n)=>['“Uma lembrança pode ser guardada.','Uma lembrança pode ser recusada.','Uma lembrança pode ser contada de novo.”',...(n.f.ask_why?['Embaixo, a lápis: “o lugar não ficou vazio por acaso”.']:[])]});
def('A-04','antechamber','mark',{lab:'Cortina lateral',if:['d:A-01',['or','d:CE-02','d:CE-03']],t:['Atrás da cortina, a parede parece mais nova.','Há uma abertura estreita, escondida pelo tecido.'],
 c:[{t:'Afastar a cortina.',cl:'antechamber',out:['A cortina se afasta. O nicho está seco.']},{t:'Deixar a cortina.',again:1}]});
def('A-04a','antechamber','device',{lab:'Gravação do nicho',if:['f:cl_antechamber'],closet:'antechamber',t:['“Não sei se estou esperando alguém chegar','ou se estou tentando impedir alguém de partir.”']});
// ---------- variações visuais entre ambientes (interações cruzadas) ----------
const DR=[
 {z:'portrait_hall',if:['f:photo_kept'],k:'frame'},{z:'portrait_hall',if:['f:altar_photo'],k:'frame'},{z:'portrait_hall',if:['f:empty_frame_covered'],k:'curtain'},{z:'portrait_hall',if:['f:bm01_done'],k:'insc'},
 {z:'gallery',if:['f:empty_frame_preserved'],k:'emptyframe'},{z:'gallery',if:['f:sub_taken'],k:'frame'},{z:'gallery',if:['f:nest_collect'],k:'insc'},
 {z:'garden',if:['f:photo_sheltered'],k:'flower'},{z:'garden',if:['f:frag_kept'],k:'pflower'},{z:'garden',if:['f:flowerbox'],k:'box'},{z:'garden',if:['f:sub_covered'],k:'cloth'},
 {z:'garden',if:['f:altar_flower'],k:'flower'},{z:'garden',if:['f:planted'],k:'plant'},{z:'garden',if:['f:fountain_dried'],k:'dried'},{z:'garden',if:['f:loom_joined'],k:'plant'},{z:'garden',if:['f:box_open'],k:'pflower'},
 {z:'bedroom',if:['f:pencil_mark'],k:'insc'},{z:'bedroom',if:['f:shaft_window_seen'],k:'doorajar'},{z:'bedroom',if:['f:facade_light'],k:'lightw'},{z:'bedroom',if:['f:mirror_uncovered'],k:'lightw'},
 {z:'mirror_hall',if:['f:sub_left'],k:'crack'},{z:'mirror_hall',if:['f:mannequin_open'],k:'crack'},{z:'mirror_hall',if:['f:mannequin_sewn'],k:'cloth'},{z:'mirror_hall',if:['f:box_kept'],k:'insc'},
 {z:'sewers',if:['f:pp03'],k:'symbol'},{z:'sewers',if:['f:gi02'],k:'roots'},{z:'dead_library',if:['f:tag_ok'],k:'insc'},
 {z:'basement',if:['f:altar_cloth'],k:'threads'},{z:'basement',if:['f:loom_joined'],k:'threads'},{z:'stairwell',if:['f:pe04'],k:'threads'},{z:'clock_tower',if:['f:o03_done'],k:'insc'}];
const LM=[{z:'bedroom',if:['f:bedroom_dim'],a:.24},{z:'chapel',if:['f:mourning_book_closed'],a:.22},{z:'chapel',if:['f:cd02_close'],a:.12},{z:'bedroom',if:['f:mirror_keptcovered'],a:.14}];
const drawDR=(c,x,y,k,t)=>{
  if(k==='flower'||k==='pflower'||k==='plant'||k==='dried'){R(c,x+7,y-10,1,10,k==='dried'?'#6a5a3a':'#3a6a3a');R(c,x+5,y-14,5,4,k==='flower'?'#D8A0B0':k==='dried'?'#8a7a5a':k==='plant'?'#B8A0D8':'#E6DCC6');R(c,x+3,y-3,10,3,'#5a3a28')}
  else if(k==='cloth'){R(c,x+2,y-6,12,6,'#8a7a8a');R(c,x+4,y-9,8,3,'#a898a8')}
  else if(k==='box'){R(c,x+1,y-9,14,9,'#5a3a28');R(c,x+3,y-12,3,3,'#D8A0B0');R(c,x+9,y-12,3,3,'#E6DCC6')}
  else if(k==='frame'){R(c,x+2,y-26,12,14,'#a98a5a');R(c,x+3,y-25,10,12,'#241608');R(c,x+6,y-22,4,5,'#8a7a8a')}
  else if(k==='emptyframe'){c.strokeStyle='#a98a5a';c.lineWidth=2;c.strokeRect(x+3,y-27,10,13);c.lineWidth=1}
  else if(k==='curtain'){R(c,x+1,y-42,14,42,'#5a2a3a');for(let i=0;i<14;i+=3)R(c,x+1+i,y-42,1,42,'#3a1a2a')}
  else if(k==='insc'){c.strokeStyle='rgba(216,200,176,.55)';c.beginPath();c.moveTo(x+2,y-24);c.lineTo(x+6,y-27);c.lineTo(x+9,y-24);c.lineTo(x+13,y-27);c.stroke();R(c,x+3,y-20,9,1,'rgba(216,200,176,.4)')}
  else if(k==='crack'){c.strokeStyle='#8a1c2e';c.beginPath();c.moveTo(x+8,y-40);c.lineTo(x+4,y-28);c.lineTo(x+10,y-18);c.lineTo(x+6,y-8);c.stroke()}
  else if(k==='doorajar'){R(c,x+2,y-34,12,34,'#2a1a14');R(c,x+3,y-33,5,32,'#e8d090')}
  else if(k==='lightw'){c.fillStyle='rgba(255,215,140,.18)';c.beginPath();c.arc(x+8,y-24,16+Math.sin(t*2)*1.5,0,TAU);c.fill();R(c,x+6,y-26,4,4,'#ffd78a')}
  else if(k==='symbol'){c.strokeStyle='#B8A0D8';c.beginPath();c.arc(x+8,y-24,5,0,TAU);c.moveTo(x+8,y-29);c.lineTo(x+8,y-19);c.stroke()}
  else if(k==='roots'){c.strokeStyle='#4a5a3a';c.lineWidth=2;c.beginPath();c.moveTo(x+8,y-36);c.quadraticCurveTo(x+2,y-20,x+9,y-4);c.stroke();c.lineWidth=1}
  else if(k==='threads'){c.strokeStyle='rgba(216,160,176,.7)';for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+3+i*4,y-48);c.lineTo(x+3+i*4+Math.sin(t*2+i)*2,y-20);c.stroke()}}};
// ---------- mundo: compartimentos secretos e plataformas ----------
const CLO={},PF={};let GRID=null;const rep={sem_espaco:[],sem_plat:[],sem_armario:[],placed:0};
const baseBI=buildInteractives,baseBH=buildHazards;
const _bw=buildWorld;
buildWorld=function(){
  const g=_bw();GRID=g;const bi=baseBI(),bh=baseBH(),zs=ZONES;
  const busy=(x0,x1,y0,y1)=>bi.some(o=>o.type!=='painting'&&o.x/T<x1+1&&(o.x+o.w)/T>x0-1&&o.y/T<y1+1&&(o.y+o.h)/T>y0-1)||bh.some(h=>h.x/T<x1+1&&(h.x+h.w)/T>x0&&h.y/T<y1+1&&(h.y+h.h)/T>y0);
  const zc=[...new Set(ORD.map(i=>NODE[i].closet).filter(Boolean).concat(ORD.map(i=>NODE[i]).filter(n=>n.c&&n.c.some(o=>o.cl)).map(n=>n.z)))];
  for(const zid of zc){const z=zs.find(q=>q.id===zid);CLO[zid]=null;if(!z)continue;const fr=z.y+z.h-1;let best=null;
    for(let x0=z.x+z.w-7;x0>=z.x+2&&!best;x0--){let ok=true;
      for(let x=x0;x<=x0+4&&ok;x++){if(g[fr][x]!==1)ok=false;for(let y=fr-4;y<=fr-1;y++)if(g[y][x]!==0)ok=false}
      if(ok&&busy(x0,x0+4,fr-4,fr))ok=false;if(ok)best={x0,px:x0+4,fr,xa:x0+1,xb:x0+3}}
    if(best){for(let x=best.x0;x<=best.x0+4;x++)g[fr-4][x]=1;for(let y=fr-3;y<=fr-1;y++){g[y][best.x0]=1;g[y][best.px]=1}CLO[zid]=best}else rep.sem_armario.push(zid)}
  for(const id of ORD){const n=NODE[id];if(!n.pf)continue;const z=zs.find(q=>q.id===n.z);if(!z)continue;const fr=z.y+z.h-1;let found=null;
    for(let x=z.x+z.w-6;x>=z.x+3&&!found;x--){let ok=true;for(let i=0;i<3&&ok;i++){if(g[fr][x+i]!==1)ok=false;for(let y=fr-7;y<=fr-1;y++)if(g[y][x+i]!==0)ok=false}
      const cl=CLO[n.z];if(ok&&cl&&x+2>=Math.min(cl.xa,cl.px)-1&&x<=Math.max(cl.xb,cl.px)+1)ok=false;
      if(ok&&busy(x,x+2,fr-7,fr))ok=false;if(ok)found={x,fr}}
    PF[id]=found;if(!found)rep.sem_plat.push(id)}
  return g};
const openCl=(g,zid,anim)=>{const n=NS(g.player);n.f['cl_'+zid]=1;const c=CLO[zid];if(!c)return;
  for(let y=c.fr-3;y<=c.fr-1;y++){if(g.grid[y][c.px]===1&&anim)shard(g,c.px*T+8,y*T+8,6);g.grid[y][c.px]=0}};
const buildPf=(g,id)=>{const f=PF[id];if(!f)return;for(let i=0;i<3;i++){if(!g.grid[f.fr-3][f.x+i])g.grid[f.fr-3][f.x+i]=2}};
const shard=(g,x,y,k)=>{const S=g._sh4||(g._sh4=[]);for(let i=0;i<k;i++)S.push({x:x+Math.random()*12-6,y:y+Math.random()*12-6,vx:Math.random()*2-1,vy:-Math.random()*1.6,l:1+Math.random()*.6})};
// ---------- pontos no mapa ----------
const _bi=buildInteractives;
buildInteractives=function(){
  const a=_bi().filter(i=>!['ev_photo','ev_tv','ev_mirror','ev_jar','term_lib'].includes(i.id));const zs=ZONES,g=GRID,bh=baseBH();
  const byZ={};for(const id of ORD){const n=NODE[id];const fx=n.closet&&CLO[n.closet]?'c':n.pf&&PF[id]?'p':null;
    if(fx==='c'){const c=CLO[n.closet];n._pos=[(c.xa+c.xb)/2|0,c.fr-1]}else if(fx==='p'){const f=PF[id];n._pos=[f.x+1,f.fr-4]}else(byZ[n.z]=byZ[n.z]||[]).push(n)}
  for(const zid in byZ){const z=zs.find(q=>q.id===zid);const L=byZ[zid];if(!z){L.forEach(n=>rep.sem_espaco.push(n.id));continue}
    const cl=CLO[zid],cand=[];
    for(let x=z.x+2;x<=z.x+z.w-3;x++)for(let y=z.y+2;y<z.y+z.h-1;y++){const b=g[y+1][x];if(!(b===1||b===2)||g[y][x]!==0||g[y-1][x]!==0)continue;
      if(cl&&x>=cl.x0-1&&x<=cl.px+1&&y>=cl.fr-6)continue;
      if(a.some(o=>o.type!=='painting'&&Math.abs(o.x/T+o.w/T/2-x-.5)<1.5&&Math.abs(o.y/T-y)<2.5))continue;
      if(bh.some(h=>h.x/T<x+1&&(h.x+h.w)/T>x&&h.y/T>y-2&&h.y/T<=y+2))continue;cand.push([x,y])}
    cand.sort((p,q)=>p[0]-q[0]||q[1]-p[1]);
    const spaced=sp=>{const r=[];for(const k of cand)if(!r.length||k[0]-r[r.length-1][0]>=sp)r.push(k);return r};
    let sl=[];for(const sp of [3,2,1]){sl=spaced(sp);if(sl.length>=L.length)break}
    if(sl.length<L.length){sl=cand.slice()}
    L.forEach((n,i)=>{if(sl.length<L.length&&i>=sl.length){rep.sem_espaco.push(n.id);return}const k=Math.min(sl.length-1,Math.floor((i+.5)*sl.length/L.length));n._pos=[sl[k][0],sl[k][1]]})}
  for(const id of ORD){const n=NODE[id];if(!n._pos)continue;rep.placed++;a.push({type:'nar',nid:id,x:n._pos[0]*T,y:n._pos[1]*T,w:T,h:T,id:'nar_'+id,collected:true,_s:1})}
  window.NARR_REPORT=rep;return a};
// ---------- fluxo de leitura e escolhas ----------
const addRec=(p,t,s)=>{p.records=p.records||[];if(!p.records.some(r=>r[0]===t))p.records.push([t,s])};
const L0=(g,n)=>typeof n.t==='function'?n.t(g,NS(g.player)):n.t.slice();
const VAR=(g,n)=>{const d=dom(g.player);return(n.v&&d&&n.v[DK[d]])?n.v[DK[d]].slice():[]};
function textFor(g,n){const st=NS(g.player),first=st.c[n.id]===undefined;if(first||n.rep)return L0(g,n).concat(VAR(g,n));
  const ci=st.c[n.id];if(n.rc&&n.rc[ci])return n.rc[ci].slice();if(n.rf)return n.rf(g,st);if(n.v)return L0(g,n).slice(0,1).concat(VAR(g,n));return L0(g,n)}
function optsFor(g,n){const st=NS(g.player),first=st.c[n.id]===undefined;if(!first&&!n.rep&&!n.copts)return[];
  const arr=n.copts?n.copts(g,st):(n.c||[]);return arr.map((o,i)=>Object.assign({_i:i},o)).filter(o=>!o.if||ev(g,o.if))}
function complete(g,n,idx){const p=g.player,st=NS(p);if(st.c[n.id]!==undefined)return;st.c[n.id]=idx;
  if(n.mem){st.f['m_'+n.id]=1;st.f['mz_'+n.z]=1;st.f['mc_'+n.z]=(st.f['mc_'+n.z]||0)+1;const t0=L0(g,n);addRec(p,n.lab,Array.isArray(t0)&&t0[0]?String(t0[0]).slice(0,80):n.lab);g.showMsg('Registro: '+n.lab)}
  if(n.s)n.s.forEach(k=>st.f[k]=1);
  if(n.id==='O-04'&&Object.keys(st.f).filter(k=>k.startsWith('cl_')||k.startsWith('pfb_')).length>=3)st.f.plan_marked=1;
  window.glitchFx&&window.glitchFx(g,.18)}
function applyOpt(g,n,o){const p=g.player,st=NS(p);if(o.s)o.s.forEach(k=>st.f[k]=1);
  if(o.r){const k={m:'mika',k:'kaim',a:'kami'}[o.r[0]];RES(p)[k]+=+o.r.slice(1)}
  if(o.cl){openCl(g,o.cl,true);window.glitchFx&&window.glitchFx(g,.3)}}
function openNode(g,it){const n=NODE[it.nid],st=NS(g.player);if(n.mon){st.f.mon_any=1;window.glitchFx&&window.glitchFx(g,.15)}
  const lines=textFor(g,n),opts=optsFor(g,n);g._nar={n,it,lines,opts,sel:0,mode:'read',menu:n.rep?{lines,opts}:null};window.ALB&&window.ALB.reg(g,n,lines)}
function narInput(g){const S=g._nar,inp=g.input,n=S.n;
  if(S.mode==='read'&&S.opts.length){const k=S.opts.length;if(inp.wasPressed('ArrowUp')||inp.wasPressed('KeyW'))S.sel=(S.sel+k-1)%k;if(inp.wasPressed('ArrowDown')||inp.wasPressed('KeyS'))S.sel=(S.sel+1)%k;
    if(inp.interact()||inp.confirm()){const o=S.opts[S.sel];if(o.quiet&&o.again){g._nar=null;return}
      applyOpt(g,n,o);const st=NS(g.player);const keep=o.again||(o.keepopen&&o.keepopen(g,st));
      if(!keep)complete(g,n,o._i);
      const out=typeof o.out==='function'?o.out(g,st,o):(o.out||[]);
      if(out.length){S.mode='out';S.lines=out.slice();S.opts=[]}else g._nar=null}}
  else if(inp.interact()||inp.confirm()){
    if(S.mode==='out'&&S.menu){S.mode='read';S.lines=S.menu.lines;S.opts=S.menu.opts;S.sel=0;return}
    if(S.mode==='read'&&!n.c&&!n.copts&&!n.rep)complete(g,n,0);
    g._nar=null}}
// ---------- atualização ----------
const oHI=G.handleInteractions;
G.handleInteractions=function(){
  if(!this._nar&&!this._choice&&!this._conn&&this.input.interact()){const hb=this.player.hitbox,cx=hb.x+hb.w/2,cy=hb.y+hb.h/2,cs=this.interactives.filter(i=>i.type==='nar'&&!i.collected&&rectOverlap({x:hb.x-10,y:hb.y-10,w:hb.w+20,h:hb.h+20},i)).sort((p,q)=>Math.hypot(p.x+8-cx,p.y+8-cy)-Math.hypot(q.x+8-cx,q.y+8-cy));if(cs[0]){openNode(this,cs[0]);return}}
  return oHI.call(this)};
const oU=G.update;
G.update=function(dt){
  const s=dt>1?dt/1000:dt;
  if(this._nar){narInput(this);return}
  oU.call(this,dt);const p=this.player;if(!p||this.state==='title'||!this.interactives||!this.grid)return;const st=NS(p);
  for(const it of this.interactives)if(it.type==='nar')it.collected=!vis(this,NODE[it.nid]);
  for(const id of ORD){const n=NODE[id];if(!n.pf)continue;if(!st.f['pfb_'+id]&&vis(this,n)){st.f['pfb_'+id]=1;const f=PF[id];if(f)shard(this,(f.x+1)*T,(f.fr-3)*T,12)}if(st.f['pfb_'+id])buildPf(this,id)}
  for(const zid in CLO){const c=CLO[zid];if(c&&st.f['cl_'+zid])for(let y=c.fr-3;y<=c.fr-1;y++)if(this.grid[y][c.px]===1)this.grid[y][c.px]=0}
  const S=this._sh4;if(S){for(const q of S){q.x+=q.vx;q.y+=q.vy;q.vy+=.04;q.l-=s}this._sh4=S.filter(q=>q.l>0)}};
// ---------- desenho dos pontos ----------
let DRS=null;
const oW=G.drawWorld;
G.drawWorld=function(ctx){
  oW.call(this,ctx);const c=this.camera,t=performance.now()/1000,p=this.player,st=NS(p),d=dom(p),g=this.grid;
  if(!DRS||DRS.__g!==g){DRS=[];DRS.__g=g;const pr=window.PROPS_DBG||[];
    for(const zid of [...new Set(DR.map(e=>e.z))]){const z=ZONES.find(q=>q.id===zid);if(!z)continue;const fr=z.y+z.h-1,es=DR.filter(e=>e.z===zid),cl=CLO[zid],cand=[];
      for(let x=z.x+2;x<=z.x+z.w-3;x++){if(g[fr][x]!==1||g[fr-1][x]!==0||g[fr-2][x]!==0)continue;if(cl&&x>=cl.x0-1&&x<=cl.px+1)continue;
        if(pr.some(q=>q.z===zid&&x*T>=q.x-8&&x*T<=q.x+q.w+8))continue;if(this.interactives.some(o=>o.type!=='painting'&&Math.abs(o.x/T-x)<1.8&&o.y/T>fr-4&&o.y/T<=fr))continue;cand.push(x)}
      const sl=[];for(const x of cand)if(!sl.length||x-sl[sl.length-1]>=2)sl.push(x);
      es.forEach((e,i)=>{if(sl.length){const k=Math.min(sl.length-1,Math.floor((i+.5)*sl.length/es.length));DRS.push({e,x:sl[k]*T,y:fr*T})}})}}
  const DC2=window.decoBegin(ctx);for(const q of DRS){if(!ev(this,q.e.if))continue;const x=q.x-c.x,y=q.y-c.y;if(x<-30||x>670)continue;drawDR(DC2,x,y,q.e.k,t)}
  for(const it of this.interactives){if(it.type!=='nar'||it.collected)continue;const x=it.x-c.x,y=it.y-c.y;if(x<-30||x>670||y<-60||y>420)continue;const n=NODE[it.nid];window.nodeObj(DC2,x,y,n,t,st.c[n.id]!==undefined,d)}window.decoEnd(ctx);
  for(const zid in CLO){const cl=CLO[zid];if(!cl||st.f['cl_'+zid])continue;if(!ORD.some(id=>NODE[id].z===zid&&NODE[id].c&&NODE[id].c.some(o=>o.cl===zid)&&vis(this,NODE[id])))continue;
    const x=cl.px*T-c.x,y=(cl.fr-3)*T-c.y;if(x<-20||x>660)continue;ctx.strokeStyle='rgba(184,160,216,'+(.25+.15*Math.sin(t*2))+')';ctx.strokeRect(x+2.5,y+1.5,T-5,3*T-3)}
  if(this._sh4)for(const q of this._sh4){const a=Math.min(1,q.l);ctx.fillStyle='rgba(184,160,216,'+a+')';ctx.fillRect(q.x-c.x,q.y-c.y,2,2)}
};
// ---------- interface, variações de luz e mapa ----------
function wrap(ctx,text,w){const out=[];for(const para of String(text).split('\n')){let line='';for(const word of para.split(' ')){const tst=line?line+' '+word:word;if(ctx.measureText(tst).width>w&&line){out.push(line);line=word}else line=tst}out.push(line)}return out}
const oH=G.drawHUD;
G.drawHUD=function(ctx){
  const p=this.player,st=NS(p),z=zoneAt(Math.floor((p.x+14)/T),Math.floor((p.y+20)/T));
  if(z)for(const m of LM)if(m.z===z.id&&ev(this,m.if)){ctx.fillStyle='rgba(4,2,8,'+m.a+')';ctx.fillRect(0,0,640,360)}
  oH.call(this,ctx);const S=this._nar;if(!S)return;const n=S.n,mon=!!n.mon,fnt=mon?'12px Courier New, monospace':'13px Georgia';
  ctx.fillStyle='rgba(4,2,8,.6)';ctx.fillRect(0,0,640,360);ctx.font=fnt;
  const body=[];S.lines.forEach(l=>wrap(ctx,l,500).forEach(w=>body.push(w)));const opts=S.opts.map(o=>wrap(ctx,o.t,470));
  const lh=mon?17:18,h=40+body.length*lh+(opts.length?10+opts.reduce((a,o)=>a+o.length*20,0):0)+28,y0=Math.max(8,352-h);
  window.COL.panel(ctx,40,y0,560,h,mon?'mon':'ink',(n.lab||'').length);
  ctx.fillStyle=mon?'#D8A0B0':'#D8A0B0';ctx.font=mon?'11px Courier New, monospace':'italic 13px Georgia';ctx.fillText(mon?'[ '+n.lab+' ]':'— '+n.lab+' —',56,y0+24);
  ctx.font=fnt;let y=y0+46;body.forEach(l=>{ctx.fillStyle=mon?'#B8A0D8':'#E6DCC6';ctx.fillText(l,56,y);y+=lh});
  if(opts.length){y+=6;opts.forEach((o,i)=>{const s=i===S.sel;if(s){ctx.fillStyle='rgba(130,24,56,.8)';ctx.fillRect(52,y-14,536,o.length*20+2)}
    o.forEach((l,k)=>{ctx.fillStyle=s?'#ffffff':'#B9ABB9';ctx.fillText((k?'   ':(s?'▸ ':'  '))+l,60,y+k*20)});y+=o.length*20})}
  ctx.fillStyle='#7A6B8B';ctx.font='10px Georgia';ctx.fillText(S.opts.length?'W/S escolher  ·  E confirmar':'E — continuar',56,y0+h-12)};
const oM=G.drawMap;
G.drawMap=function(ctx){oM.call(this,ctx);const st=NS(this.player);if(!st.f.plan_marked)return;
  ctx.font='bold 10px Georgia';for(const zid in CLO){const c=CLO[zid];if(!c||st.f['cl_'+zid])continue;ctx.fillStyle='#c8284a';ctx.fillText('?',20+c.px*1.5-2,46+c.fr*1.5+3)}
  ctx.fillStyle='#8a1c36';ctx.font='italic 9px "Segoe Script","Comic Sans MS",cursive';ctx.fillText('? passagem marcada a tinta',488,322)};
const oSG=G.saveGame;
G.saveGame=function(){oSG.call(this);try{const k=CONFIG.SAVE_KEY,d=JSON.parse(localStorage.getItem(k));if(d){d.nar=NS(this.player);localStorage.setItem(k,JSON.stringify(d))}}catch(e){}};
const oCG=G.continueGame;
G.continueGame=function(){oCG.call(this);try{const d=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));if(d&&d.nar&&this.player)this.player.nar=d.nar}catch(e){}};
window.NARR={NODE,ORD,CLO,PF,ev,NS};
})();
