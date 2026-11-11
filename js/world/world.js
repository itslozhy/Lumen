const ZONES=[
  {id:'bedroom',name:'Quarto Desfeito',x:2,y:10,w:24,h:14, theme:'home', wall:'#2a2228', floor:'#3a2a28', accent:'#A76E7F', bg:'#141018'},
  {id:'portrait_hall',name:'Corredor das Molduras',x:26,y:10,w:32,h:14, theme:'gallery', wall:'#2c2430', floor:'#3a2a28', accent:'#7A6B8B', bg:'#12101a'},
  {id:'gallery',name:'Galeria Quebrada',x:58,y:10,w:28,h:14, theme:'gallery', wall:'#2e2532', floor:'#3d2e2c', accent:'#D27A8A', bg:'#130f1a'},
  {id:'dead_library',name:'Biblioteca Morta',x:86,y:10,w:30,h:14, theme:'library', wall:'#252038', floor:'#2a2230', accent:'#6B8CA5', bg:'#0e0c18'},
  {id:'attic',name:'Sotao Invertido',x:26,y:1,w:40,h:10, theme:'attic', wall:'#2a2018', floor:'#3a3020', accent:'#C9B9B9', bg:'#100e14'},
  {id:'clock_tower',name:'Torre do Relogio',x:66,y:1,w:18,h:10, theme:'tower', wall:'#282430', floor:'#383040', accent:'#e8d080', bg:'#0c0a14'},
  {id:'sunken_hall',name:'Salao Afundado',x:2,y:24,w:30,h:16, theme:'sunken', wall:'#1e2430', floor:'#2a3040', accent:'#6B8CA5', bg:'#0a0e14'},
  {id:'cellar_path',name:'Passagem do Porao',x:32,y:24,w:20,h:16, theme:'cellar', wall:'#222018', floor:'#322820', accent:'#A76E7F', bg:'#0c0a10'},
  {id:'stairwell',name:'Poco das Escadas',x:52,y:24,w:16,h:28, theme:'shaft', wall:'#1a1820', floor:'#2a2830', accent:'#7E35B8', bg:'#08060e'},
  {id:'basement',name:'Porao de Costuras',x:68,y:42,w:34,h:16, theme:'stitch', wall:'#241828', floor:'#301e30', accent:'#7E35B8', bg:'#0c0812'},
  {id:'sewers',name:'Galerias Inferiores',x:102,y:48,w:36,h:14, theme:'sewer', wall:'#1a2218', floor:'#243020', accent:'#5a8a50', bg:'#080c08'},
  {id:'chapel',name:'Capela Desativada',x:116,y:10,w:30,h:16, theme:'chapel', wall:'#282030', floor:'#322838', accent:'#C9B9B9', bg:'#100c16'},
  {id:'garden',name:'Jardim Interno',x:116,y:26,w:30,h:16, theme:'garden', wall:'#1e2820', floor:'#283828', accent:'#D27A8A', bg:'#0a100c'},
  {id:'mirror_hall',name:'Corredor dos Espelhos',x:146,y:10,w:28,h:14, theme:'mirror', wall:'#2a2838', floor:'#343040', accent:'#6B8CA5', bg:'#0e0c18'},
  {id:'observatory',name:'Observatorio',x:146,y:1,w:24,h:10, theme:'stars', wall:'#1a1830', floor:'#242040', accent:'#E6DCC6', bg:'#060510'},
  {id:'antechamber',name:'Antecâmara',x:174,y:10,w:20,h:14, theme:'ante', wall:'#2c2030', floor:'#3a2838', accent:'#e8d080', bg:'#100c14'},
  {id:'chamber',name:'Camara da Lacuna',x:194,y:8,w:24,h:18, theme:'boss', wall:'#2a1830', floor:'#3a2040', accent:'#7E35B8', bg:'#0a0612'},
];

function zoneAt(tx,ty){
  for(const z of ZONES){
    if(z.w>0 && tx>=z.x && tx<z.x+z.w && ty>=z.y && ty<z.y+z.h) return z;
  }
  return null;
}


function buildWorld(){
  const grid=Array.from({length:WORLD_H},()=>new Uint8Array(WORLD_W));
  const fill=(x,y,w,h,v)=>{for(let j=y;j<y+h&&j<WORLD_H;j++)for(let i=x;i<x+w&&i<WORLD_W;i++)if(i>=0&&j>=0)grid[j][i]=v};
  const hLine=(x,y,w,v=1)=>fill(x,y,w,1,v);
  const vLine=(x,y,h,v=1)=>fill(x,y,1,h,v);
  const open=(x,y,h=3)=>{for(let j=0;j<h;j++)if(y+j<WORLD_H&&x>=0&&x<WORLD_W)grid[y+j][x]=0};
  const room=(x,y,w,h)=>{hLine(x,y+h-1,w);hLine(x,y,w);vLine(x,y,h);vLine(x+w-1,y,h)};

  // === MAIN HORIZONTAL SPINE (y floors around 22) ===
  // Bedroom
  room(2,10,24,14); open(25,19,3);
  // Portrait hall
  room(26,10,32,14); open(26,19,3); open(57,19,3);
  for(let y=2;y<=10;y++){grid[y][40]=0;grid[y][41]=0;grid[y][42]=0;} // up to attic
  hLine(32,16,5,2); hLine(44,15,5,2); hLine(50,17,4,2);
  // Gallery
  room(58,10,28,14); open(58,19,3); open(85,19,3);
  hLine(64,16,4,2); hLine(72,14,5,2); hLine(78,16,4,2);
  // hole up to clock tower
  for(let y=2;y<=10;y++){grid[y][72]=0;grid[y][73]=0;}
  // Library
  room(86,10,30,14); open(86,19,3); open(115,19,3);
  for(let i=0;i<5;i++)fill(90+i*5,18,2,4,1);
  hLine(94,15,4,2); hLine(104,14,5,2);
  // Chapel
  room(116,10,30,16); open(116,19,3); open(145,19,3);
  hLine(122,16,4,2); hLine(130,13,5,2); hLine(138,16,4,2);
  // hole down to garden
  for(let x=128;x<=131;x++){grid[25][x]=0;grid[26][x]=0;}
  // Mirror hall
  room(146,10,28,14); open(146,19,3); open(173,19,3);
  hLine(152,16,4,2); hLine(160,14,5,2); hLine(166,16,4,2);
  // up to observatory
  for(let y=2;y<=10;y++){grid[y][158]=0;grid[y][159]=0;}
  // Antechamber
  room(174,10,20,14); open(174,19,3);
  // LOCKED door to chamber at x=193 — solid until unlocked (we'll keep wall; unlock removes cells)
  vLine(193,10,14); // locked wall/door
  hLine(174,10,20); hLine(174,23,20);
  // Chamber (boss arena) — exists but sealed
  room(194,8,24,18);
  // door opening position (blocked until key)
  // platforms in arena
  hLine(198,18,5,2); hLine(208,18,5,2); hLine(202,14,6,2);

  // === ATTIC / UPPER ===
  room(26,1,40,10);
  for(let x=40;x<=42;x++)grid[10][x]=0;
  hLine(30,7,5,2); hLine(40,5,6,2); hLine(50,6,5,2); hLine(56,4,4,2);
  // Clock tower
  room(66,1,18,10);
  for(let x=72;x<=73;x++)grid[10][x]=0;
  hLine(68,6,4,2); hLine(74,4,5,2); hLine(78,7,3,2);
  // Observatory
  room(146,1,24,10);
  for(let x=158;x<=159;x++)grid[10][x]=0;
  hLine(150,6,5,2); hLine(158,4,6,2); hLine(164,6,4,2);

  // === LOWER AREAS (fully linked corridors) ===
  // helper: open a 2-tile-wide doorway and clear floor blocking
  const doorway=(x0,y,h=3,w=2)=>{
    for(let dx=0;dx<w;dx++){
      for(let j=0;j<h;j++){
        const yy=y+j, xx=x0+dx;
        if(yy>=0&&yy<WORLD_H&&xx>=0&&xx<WORLD_W) grid[yy][xx]=0;
      }
    }
  };

  // Sunken hall under bedroom
  room(2,24,30,16);
  for(let x=12;x<=15;x++){grid[22][x]=0;grid[23][x]=0;grid[24][x]=0;}
  hLine(6,32,5,2); hLine(14,29,5,2); hLine(20,26,5,2); hLine(8,35,4,2); hLine(22,34,4,2);
  // floor strip so player can walk to east exit
  hLine(24,37,8,2);
  doorway(30,35,3,2); // -> cellar path

  // Cellar path (links sunken <-> stairwell)
  room(32,24,20,16);
  doorway(32,35,3,2); doorway(50,35,3,2);
  hLine(36,30,5,2); hLine(42,28,5,2); hLine(38,34,4,2);
  hLine(34,37,16,2); // continuous walkway at door height

  // Stairwell deep — platforms from top to bottom + side exits
  room(52,24,16,28);
  // entrance from main floor above (gallery area): vertical shaft
  for(let y=20;y<=25;y++){grid[y][58]=0;grid[y][59]=0;grid[y][60]=0;}
  // open ceiling of stairwell under the shaft
  grid[24][58]=0; grid[24][59]=0; grid[24][60]=0;
  // platforms descending the shaft
  hLine(54,28,5,2); hLine(58,31,5,2); hLine(54,34,5,2);
  doorway(52,35,3,2); // west -> cellar (already linked)
  hLine(56,37,5,2); hLine(54,40,5,2); hLine(58,43,5,2); hLine(54,46,5,2);
  hLine(56,49,5,2);
  // bottom walkway to basement (east)
  hLine(54,52,14,2);
  doorway(66,50,3,3); // wide opening stairwell -> basement

  // Basement (Porão de Costuras)
  room(68,42,34,16);
  doorway(68,50,3,3); // west -> stairwell
  // internal platforms / floor access
  hLine(70,52,30,2);
  hLine(74,48,5,2); hLine(84,46,6,2); hLine(94,49,5,2); hLine(78,52,4,2);
  // east exit to sewers
  doorway(100,53,3,3);
  hLine(96,55,8,2);

  // Sewers / Galerias Inferiores (boss key)
  room(102,48,36,14);
  doorway(102,53,3,3);
  hLine(104,55,32,2);
  hLine(108,54,5,2); hLine(118,52,6,2); hLine(128,54,5,2); hLine(112,56,4,2); hLine(124,57,4,2);

  // Garden under chapel
  room(116,26,30,16);
  for(let x=128;x<=131;x++){grid[25][x]=0;grid[26][x]=0;}
  hLine(120,34,5,2); hLine(128,32,5,2); hLine(136,35,5,2); hLine(124,38,4,2);
  // corridor west from garden toward mid-map / stairwell topside
  doorway(116,37,3,2);
  // elevated bridge y=37 from garden to above basement / stairwell region
  hLine(68,37,48,2);
  // drop shafts from bridge into basement and stairwell
  for(let y=38;y<=46;y++){grid[y][72]=0;grid[y][73]=0;}
  for(let y=38;y<=50;y++){grid[y][62]=0;grid[y][63]=0;}
  hLine(70,44,5,2); hLine(60,44,5,2); hLine(60,48,5,2);

  // Extra vertical connectors / secret shafts
  for(let y=22;y<=28;y++){grid[y][5]=0;grid[y][6]=0;}
  hLine(4,28,4,2);
  // east shaft mirror hall -> deep sewers
  for(let y=24;y<=54;y++){grid[y][170]=0;grid[y][171]=0;}
  hLine(168,28,6,2); hLine(168,36,6,2); hLine(168,44,6,2); hLine(168,52,6,2);
  // sewers east extension
  room(138,55,40,7);
  doorway(170,55,2,2);
  hLine(140,58,36,2); hLine(145,58,5,2); hLine(155,57,5,2); hLine(165,58,5,2);

  // Outer bounds
  for(let x=0;x<WORLD_W;x++){grid[0][x]=1;grid[WORLD_H-1][x]=1}
  for(let y=0;y<WORLD_H;y++){grid[y][0]=1;grid[y][WORLD_W-1]=1}

  // Extra mid-room platforms for parkour variety
  hLine(28,18,4,2); hLine(62,18,3,2); hLine(100,17,4,2);
  hLine(120,18,3,2); hLine(148,18,4,2); hLine(180,18,3,2);
  hLine(10,34,3,2); hLine(44,32,3,2);
  hLine(76,50,3,2); hLine(92,51,3,2);
  hLine(130,36,3,2); hLine(140,33,3,2);
  // secret alcove platforms attic
  hLine(34,3,3,2); hLine(52,3,3,2);

  // === PARKOUR CHALLENGE SECTIONS ===
  // Stairwell vertical route (tight wall-jump friendly ledges)
  hLine(53,26,2,2); hLine(63,27,2,2); hLine(53,29,2,2); hLine(63,32,2,2);
  hLine(53,35,2,2); hLine(63,38,2,2); hLine(53,41,2,2); hLine(63,44,2,2);
  hLine(53,47,2,2); hLine(63,49,2,2);
  // Attic gap sequence
  hLine(30,6,2,2); hLine(36,5,2,2); hLine(42,6,2,2); hLine(48,4,2,2); hLine(54,5,2,2);
  // Clock tower climb
  hLine(67,8,2,2); hLine(80,7,2,2); hLine(67,5,2,2); hLine(80,3,2,2);
  // Sunken floating steps
  hLine(8,31,2,2); hLine(14,28,2,2); hLine(22,25,2,2); hLine(26,28,2,2);
  // Garden canopy parkour
  hLine(118,31,2,2); hLine(124,29,2,2); hLine(132,28,2,2); hLine(138,30,2,2);
  // Mirror hall floating
  hLine(150,17,2,2); hLine(158,15,2,2); hLine(166,17,2,2);
  // Observatory rails
  hLine(148,5,2,2); hLine(156,3,2,2); hLine(164,5,2,2);
  // Sewer pipe platforms
  hLine(106,53,2,2); hLine(116,51,2,2); hLine(126,53,2,2); hLine(134,52,2,2);

  return grid;
}

function buildInteractives(){
  return [
    // Bedroom
    {type:'rest',x:5*T,y:21*T,w:2*T,h:T,id:'rest_bed'},
    {type:'cabinet',x:8*T,y:20*T,w:2*T,h:2*T,id:'cab1',looted:false},
    {type:'cabinet',x:18*T,y:20*T,w:2*T,h:2*T,id:'cab2',looted:false},
    {type:'memory',x:14*T,y:18*T,w:T,h:T,id:'mem1',collected:false},
    {type:'painting',x:10*T,y:14*T,w:2*T,h:3*T,id:'paint_bed'},
    {type:'book',x:20*T,y:21*T,w:T,h:T,id:'book_bed'},
    // Portrait hall
    {type:'painting',x:32*T,y:13*T,w:2*T,h:3*T,id:'paint1'},
    {type:'painting',x:40*T,y:12*T,w:2*T,h:3*T,id:'paint2'},
    {type:'painting',x:48*T,y:13*T,w:2*T,h:3*T,id:'paint3'},
    {type:'rest',x:52*T,y:21*T,w:2*T,h:T,id:'rest_hall'},
    {type:'item',x:46*T,y:14*T,w:T,h:T,id:'heal_hall',item:'heal',collected:false},
    // Gallery
    {type:'painting',x:64*T,y:13*T,w:2*T,h:3*T,id:'paint_g1'},
    {type:'painting',x:74*T,y:12*T,w:2*T,h:3*T,id:'paint_g2'},
    {type:'cabinet',x:68*T,y:20*T,w:2*T,h:2*T,id:'cab_g',looted:false},
    {type:'memory',x:80*T,y:15*T,w:T,h:T,id:'mem_gallery',collected:false},
    {type:'npc',x:70*T,y:19*T,w:2*T,h:3*T,id:'echo_girl'},
    // Library
    {type:'book',x:92*T,y:21*T,w:T,h:T,id:'book1'},
    {type:'book',x:98*T,y:21*T,w:T,h:T,id:'book2'},
    {type:'book',x:106*T,y:21*T,w:T,h:T,id:'book3'},
    {type:'rest',x:88*T,y:21*T,w:2*T,h:T,id:'rest_lib'},
    {type:'memory',x:100*T,y:13*T,w:T,h:T,id:'mem2',collected:false},
    {type:'cabinet',x:94*T,y:20*T,w:2*T,h:2*T,id:'cab_lib',looted:false},
    // Attic
    {type:'item',x:54*T,y:5*T,w:T,h:T,id:'energy1',item:'energy',collected:false},
    {type:'memory',x:44*T,y:4*T,w:T,h:T,id:'mem3',collected:false},
    {type:'cabinet',x:32*T,y:8*T,w:2*T,h:2*T,id:'cab_attic',looted:false},
    {type:'item',x:58*T,y:3*T,w:T,h:T,id:'heal_attic',item:'heal',collected:false},
    // Clock tower
    {type:'item',x:78*T,y:3*T,w:T,h:T,id:'energy_clock',item:'energy',collected:false},
    {type:'memory',x:70*T,y:5*T,w:T,h:T,id:'mem_clock',collected:false},
    // Sunken
    {type:'item',x:22*T,y:25*T,w:T,h:T,id:'heal1',item:'heal',collected:false},
    {type:'cabinet',x:8*T,y:34*T,w:2*T,h:2*T,id:'cab_sunken',looted:false},
    {type:'memory',x:16*T,y:28*T,w:T,h:T,id:'mem_sunken',collected:false},
    // Cellar path
    {type:'item',x:42*T,y:27*T,w:T,h:T,id:'heal_cellar',item:'heal',collected:false},
    {type:'book',x:38*T,y:35*T,w:T,h:T,id:'book_cellar'},
    // Basement — ability
    {type:'ability',x:96*T,y:54*T,w:2*T,h:2*T,id:'stitch_orb',collected:false},
    {type:'rest',x:70*T,y:55*T,w:2*T,h:T,id:'rest_base'},
    {type:'cabinet',x:80*T,y:54*T,w:2*T,h:2*T,id:'cab_base',looted:false},
    {type:'memory',x:88*T,y:45*T,w:T,h:T,id:'mem_base',collected:false},
    // Sewers — BOSS KEY far away
    {type:'item',x:132*T,y:53*T,w:T,h:T,id:'boss_key',item:'boss_key',collected:false},
    {type:'item',x:120*T,y:51*T,w:T,h:T,id:'heal_sewer',item:'heal',collected:false},
    {type:'memory',x:110*T,y:53*T,w:T,h:T,id:'mem_sewer',collected:false},
    {type:'cabinet',x:126*T,y:54*T,w:2*T,h:2*T,id:'cab_sewer',looted:false},
    // Deep sewers east
    {type:'item',x:160*T,y:56*T,w:T,h:T,id:'energy_deep',item:'energy',collected:false},
    {type:'memory',x:168*T,y:57*T,w:T,h:T,id:'mem_deep',collected:false},
    // Chapel
    {type:'rest',x:130*T,y:23*T,w:2*T,h:T,id:'rest_chapel'},
    {type:'npc',x:122*T,y:21*T,w:2*T,h:3*T,id:'frame_guardian'},
    {type:'painting',x:136*T,y:14*T,w:2*T,h:3*T,id:'paint_chapel'},
    {type:'book',x:140*T,y:23*T,w:T,h:T,id:'book_chapel'},
    // Garden
    {type:'npc',x:134*T,y:35*T,w:2*T,h:3*T,id:'echo_garden'},
    {type:'item',x:126*T,y:31*T,w:T,h:T,id:'heal2',item:'heal',collected:false},
    {type:'memory',x:138*T,y:34*T,w:T,h:T,id:'mem_garden',collected:false},
    {type:'cabinet',x:120*T,y:36*T,w:2*T,h:2*T,id:'cab_garden',looted:false},
    // Mirror hall
    {type:'painting',x:152*T,y:13*T,w:2*T,h:3*T,id:'paint_m1'},
    {type:'painting',x:162*T,y:12*T,w:2*T,h:3*T,id:'paint_m2'},
    {type:'rest',x:166*T,y:21*T,w:2*T,h:T,id:'rest_mirror'},
    {type:'item',x:156*T,y:15*T,w:T,h:T,id:'heal_mirror',item:'heal',collected:false},
    // Observatory
    {type:'memory',x:160*T,y:3*T,w:T,h:T,id:'mem_obs',collected:false},
    {type:'item',x:166*T,y:5*T,w:T,h:T,id:'energy_obs',item:'energy',collected:false},
    {type:'book',x:152*T,y:9*T,w:T,h:T,id:'book_obs'},
    // Antechamber — locked door interaction
    {type:'door_lock',x:192*T,y:19*T,w:2*T,h:3*T,id:'boss_door',locked:true},
    {type:'rest',x:178*T,y:21*T,w:2*T,h:T,id:'rest_ante'},
    {type:'npc',x:182*T,y:19*T,w:2*T,h:3*T,id:'guard_ante'},
    // Chamber
    {type:'memory',x:206*T,y:16*T,w:T,h:T,id:'mem_boss',collected:false},
    {type:'rest',x:196*T,y:23*T,w:2*T,h:T,id:'rest_chamber'},
    // extra secrets & flavor
    {type:'cabinet',x:50*T,y:20*T,w:2*T,h:2*T,id:'cab_secret1',looted:false},
    {type:'item',x:35*T,y:3*T,w:T,h:T,id:'heal_secret_attic',item:'heal',collected:false},
    {type:'memory',x:180*T,y:18*T,w:T,h:T,id:'mem_ante',collected:false},
    {type:'book',x:176*T,y:21*T,w:T,h:T,id:'book_ante'},
    {type:'painting',x:178*T,y:14*T,w:2*T,h:3*T,id:'paint_ante'},
  ];
}

function buildEnemies(){
  return [
    {type:'paper_doll',x:18*T,y:20*T},{type:'paper_doll',x:36*T,y:20*T},
    {type:'specter_rat',x:48*T,y:20*T},{type:'paper_doll',x:66*T,y:20*T},
    {type:'specter_rat',x:78*T,y:20*T},{type:'paper_doll',x:96*T,y:20*T},
    {type:'specter_rat',x:108*T,y:20*T},{type:'broken_marionette',x:128*T,y:22*T},
    {type:'paper_doll',x:14*T,y:36*T},{type:'specter_rat',x:24*T,y:34*T},
    {type:'paper_doll',x:40*T,y:36*T},{type:'specter_rat',x:56*T,y:40*T},
    {type:'broken_marionette',x:82*T,y:54*T},{type:'paper_doll',x:90*T,y:54*T},
    {type:'specter_rat',x:112*T,y:54*T},{type:'paper_doll',x:124*T,y:54*T},
    {type:'specter_rat',x:150*T,y:56*T},{type:'paper_doll',x:154*T,y:20*T},
    {type:'specter_rat',x:164*T,y:20*T},{type:'broken_marionette',x:180*T,y:20*T},
    {type:'paper_doll',x:134*T,y:36*T},{type:'specter_rat',x:72*T,y:8*T},
    {type:'paper_doll',x:156*T,y:8*T},
  ];
}


// Moving platforms (world pixel coords, horizontal or vertical)
function buildMovers(){
  return [
    {x:38*T, y:30*T, w:3*T, h:6, min:36*T, max:48*T, axis:'x', speed:0.7, dir:1},
    {x:56*T, y:40*T, w:3*T, h:6, min:36*T, max:48*T, axis:'y', speed:0.55, dir:1},
    {x:88*T, y:50*T, w:4*T, h:6, min:86*T, max:98*T, axis:'x', speed:0.8, dir:1},
    {x:124*T, y:34*T, w:3*T, h:6, min:30*T, max:38*T, axis:'y', speed:0.6, dir:1},
    {x:152*T, y:16*T, w:3*T, h:6, min:150*T, max:164*T, axis:'x', speed:0.9, dir:1},
    {x:70*T, y:8*T, w:3*T, h:6, min:4*T, max:9*T, axis:'y', speed:0.45, dir:1},
  ];
}

// Hazard spikes (tile coords) — cell type 4 in grid, or separate list
function buildHazards(){
  const h=[];
  // sewery spikes
  for(let x=110;x<=114;x++) h.push({x:x*T,y:55*T,w:T,h:8});
  for(let x=122;x<=125;x++) h.push({x:x*T,y:55*T,w:T,h:8});
  // stairwell bottom edges
  for(let x=54;x<=56;x++) h.push({x:x*T,y:52*T,w:T,h:8});
  // sunken pit spikes
  for(let x=16;x<=18;x++) h.push({x:x*T,y:37*T,w:T,h:8});
  // chamber edge
  for(let x=200;x<=202;x++) h.push({x:x*T,y:24*T,w:T,h:8});
  return h;
}
