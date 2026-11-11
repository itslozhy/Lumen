class Game {
  constructor(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.ctx.imageSmoothingEnabled=false;
    this.input=new Input(); this.assets=new Assets(); this.particles=new Particles();
    this.state='loading'; this.grid=buildWorld(); this.interactives=buildInteractives();
    this.movers=buildMovers(); this.hazards=buildHazards();
    this.player=null; this.enemies=[]; this.boss=null; this.camera={x:0,y:0};
    this.message=null; this.messageTimer=0; this.dialog=null; this.dialogIndex=0;
    this.titleSelect=0; this.titleOptions=['NOVO JOGO','CONTINUAR','CREDITOS'];
    this.hasSave=!!localStorage.getItem(CONFIG.SAVE_KEY); this.scale=1; this.bossDefeated=false;
    this.lastRest={x:6*T,y:(18+UPR)*T}; this.doorUnlocked=false;
    this.ambientTimer=0; this.time=0;
  }
  async init(){await this.assets.load(); this.state='title'}
  startNewGame(){
    this.grid=buildWorld();
    this.movers=buildMovers(); this.hazards=buildHazards();
    this.player=new Player(this.assets);
    this.enemies=buildEnemies().map(e=>new Enemy(e,this.assets));
    this.boss=new Boss(204*T,(16+UPR)*T,this.assets);
    this.bossDefeated=false; this.doorUnlocked=false;
    this.interactives=buildInteractives(); this.state='playing';
    this.message='Desperte na Casa Desfeita...'; this.messageTimer=2.5;
  }
  continueGame(){
    try{
      const data=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY));
      if(!data||data.version!==3)throw new Error('bad');
      this.startNewGame();
      Object.assign(this.player,{x:data.x,y:data.y,hp:data.hp,energy:data.energy,hasStitch:data.hasStitch,memories:data.memories||[],keys:data.keys||[],healItems:data.healItems??2});
      this.player.visitedZones=new Set(data.visitedZones||['bedroom']);
      this.bossDefeated=!!data.bossDefeated; if(this.bossDefeated)this.boss.alive=false;
      this.doorUnlocked=!!data.doorUnlocked;
      if(this.doorUnlocked)this.unlockBossDoor(false);
      for(const it of this.interactives){if(data.collected&&data.collected.includes(it.id)){if('collected' in it)it.collected=true;if('looted' in it)it.looted=true;if(it.type==='door_lock')it.locked=false}}
      this.lastRest={x:data.x,y:data.y};
    }catch(e){this.startNewGame()}
  }
  unlockBossDoor(showMsg=true){
    this.doorUnlocked=true;
    // open tiles at x=193, y=17..21
    for(let y=17+UPR;y<=21+UPR;y++){if(y<WORLD_H)this.grid[y][193]=0;}
    const door=this.interactives.find(i=>i.id==='boss_door');
    if(door)door.locked=false;
    if(showMsg)this.showMsg('A porta da Camara se abre com um gemido...');
  }
  saveGame(){
    const collected=this.interactives.filter(i=>i.collected||i.looted||(i.type==='door_lock'&&!i.locked)).map(i=>i.id);
    localStorage.setItem(CONFIG.SAVE_KEY,JSON.stringify({
      version:3,x:this.player.x,y:this.player.y,hp:this.player.hp,energy:this.player.energy,
      hasStitch:this.player.hasStitch,memories:this.player.memories,keys:this.player.keys,
      healItems:this.player.healItems,visitedZones:[...this.player.visitedZones],
      bossDefeated:this.bossDefeated,doorUnlocked:this.doorUnlocked,collected
    }));
    this.hasSave=true; this.showMsg('Progresso salvo.');
  }
  showMsg(t){this.message=t;this.messageTimer=2.4}
  update(dt){
    if(this.state==='loading')return;
    if(this.messageTimer>0){this.messageTimer-=dt;if(this.messageTimer<=0)this.message=null}
    if(this.state==='title'){
      if(this.input.wasPressed('ArrowDown')||this.input.wasPressed('KeyS'))this.titleSelect=(this.titleSelect+1)%this.titleOptions.length;
      if(this.input.wasPressed('ArrowUp')||this.input.wasPressed('KeyW'))this.titleSelect=(this.titleSelect-1+this.titleOptions.length)%this.titleOptions.length;
      if(this.input.confirm()){
        if(this.titleSelect===0)this.startNewGame();
        else if(this.titleSelect===1&&this.hasSave)this.continueGame();
        else if(this.titleSelect===2)this.showMsg('LUMEN v3 — mapa expandido · chave do chefe · pulo duplo');
      }
      return;
    }
    if(this.state==='dialog'){
      if(this.input.interact()||this.input.confirm()){this.dialogIndex++;if(this.dialogIndex>=this.dialog.lines.length){this.dialog=null;this.state='playing'}}
      return;
    }
    if(this.state==='pause'||this.state==='map'){
      if(this.input.pause()||(this.state==='map'&&this.input.map()))this.state='playing';
      if(this.state==='pause'&&this.input.map())this.state='map';
      return;
    }
    if(this.state==='dead'){
      if(this.input.confirm()){this.player.dead=false;this.player.hp=CONFIG.PLAYER.MAX_HP;this.player.energy=CONFIG.PLAYER.MAX_ENERGY;this.player.x=this.lastRest.x;this.player.y=this.lastRest.y;this.player.stains=[];this.player.jumpsLeft=2;this.state='playing'}
      return;
    }
    if(this.state==='win'){if(this.input.confirm())this.state='title';return}
    if(this.input.pause()){this.state='pause';return}
    if(this.input.map()){this.state='map';return}
    this.player.update(dt,this.input,this.grid);
    if(this.player.dead){this.state='dead';return}
    const targetX=this.player.x-CONFIG.INTERNAL_W/2+14, targetY=this.player.y-CONFIG.INTERNAL_H/2+10;
    this.camera.x+=(targetX-this.camera.x)*0.12; this.camera.y+=(targetY-this.camera.y)*0.12;
    this.camera.x=clamp(this.camera.x,0,WORLD_W*T-CONFIG.INTERNAL_W);
    this.camera.y=clamp(this.camera.y,0,WORLD_H*T-CONFIG.INTERNAL_H);
    for(const e of this.enemies){
      e.update(dt,this.player,this.grid);
      const ab=this.player.getAttackBox();
      if(ab&&e.alive&&rectOverlap(ab,e.hitbox)){
        e.takeDamage(CONFIG.PLAYER.ATTACK_DAMAGE);
        this.particles.emit(e.x+10,e.y+10,e.stainColor==='black'?'black':'impact',10);
        if(ab.pogo){ this.player.pogoBounce(); this.particles.emit(this.player.x+10,this.player.y+20,'impact',8); if(e.alive)e.stunTimer=2000; }
      }
    }
    if(this.boss){
      this.boss.update(dt,this.player,this.particles);
      if(this.boss.alive){
        const ab=this.player.getAttackBox();
        if(ab&&rectOverlap(ab,this.boss.hitbox)){
          this.boss.takeDamage(CONFIG.PLAYER.ATTACK_DAMAGE);
          this.particles.emit(this.boss.x+30,this.boss.y+30,'impact',14);
          if(ab.pogo){ this.player.pogoBounce(); this.particles.emit(this.player.x+10,this.player.y+20,'impact',10); }
          if(!this.boss.alive){this.bossDefeated=true;this.player.memories.push('mem_boss');this.showMsg('A Costureira Vazia foi desfeita...');setTimeout(()=>{this.state='win'},2200)}
        }
      }
    }
    // Moving platforms
    for(const m of this.movers){
      const prev= m.axis==='x'?m.x:m.y;
      if(m.axis==='x'){
        m.x+=m.speed*m.dir;
        if(m.x>m.max){m.x=m.max;m.dir=-1}
        if(m.x<m.min){m.x=m.min;m.dir=1}
      } else {
        m.y+=m.speed*m.dir;
        if(m.y>m.max){m.y=m.max;m.dir=-1}
        if(m.y<m.min){m.y=m.min;m.dir=1}
      }
      // carry player if standing on top
      const hb=this.player.hitbox;
      const top=m.y, left=m.x, right=m.x+m.w;
      if(this.player.vy>=0 && hb.x+hb.w>left && hb.x<right &&
         hb.y+hb.h>=top-2 && hb.y+hb.h<=top+12){
        this.player.y=top-hb.h-6;
        this.player.vy=0; this.player.onGround=true;
        this.player.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS;
        if(m.axis==='x') this.player.x += (m.x-prev);
        // vertical platforms already snap y to top each frame
      }
    }

    // Hazards (spikes)
    if(this.player.invuln<=0 && this.player.knockbackTimer<=0){
      for(const h of this.hazards){
        if(rectOverlap(this.player.hitbox,h)){
          this.player.takeDamage(12,'purple',h.x);
          break;
        }
      }
    }

    // Ambient particles by zone
    this.time+=dt;
    this.ambientTimer-=dt;
    if(this.ambientTimer<=0){
      this.ambientTimer=0.35+Math.random()*0.5;
      const z=this.player.currentZone||'';
      const cx=this.player.x+(Math.random()-0.5)*200;
      const cy=this.player.y-40-Math.random()*80;
      if(z.includes('Jardim')||z.includes('Galerias')) this.particles.emit(cx,cy,'spore',2);
      else if(z.includes('Capela')||z.includes('Camara')) this.particles.emit(cx,cy,'ember',2);
      else if(z.includes('Biblioteca')||z.includes('Sotao')) this.particles.emit(cx,cy,'paper',2);
      else this.particles.emit(cx,cy,'dust',3);
    }

    this.particles.update(dt);
    this.handleInteractions();
  }
  handleInteractions(){
    if(!this.input.interact())return;
    const hb=this.player.hitbox, range={x:hb.x-12,y:hb.y-12,w:hb.w+24,h:hb.h+24};
    for(const it of this.interactives){
      if(!rectOverlap(range,it))continue;
      if(it.type==='rest'){this.player.hp=CONFIG.PLAYER.MAX_HP;this.player.energy=CONFIG.PLAYER.MAX_ENERGY;this.lastRest={x:this.player.x,y:this.player.y};this.saveGame();this.showMsg('Voce descansa. Progresso salvo.');return}
      if(it.type==='cabinet'&&!it.looted){it.looted=true;window.cabLoot(this,it);return}
      if(it.type==='memory'&&!it.collected){it.collected=true;this.player.memories.push(it.id);
        const texts={mem1:'Uma voz: "Voce ja esteve aqui antes..."',mem2:'Paginas falam de costuras no tempo.',mem3:'O sotao guarda o que caiu para cima.',mem_gallery:'Quadros que nunca secaram.',mem_clock:'O relogio anda para tras.',mem_sunken:'Algo afunda e sobe ao mesmo tempo.',mem_base:'Fios atravessam as paredes.',mem_sewer:'A chave espera nas galerias profundas.',mem_deep:'Mais fundo do que a casa admite.',mem_garden:'Flores que nao existem.',mem_obs:'Estrelas costuradas no teto.',mem_boss:'Eu mesma costurei esta casa.',mem_ante:'A porta exige o que as profundezas escondem.'};
        this.showMsg(texts[it.id]||'Fragmento de memoria.');window.ALB&&window.ALB.regFrag(this.player,it.id,it);return}
      if(it.type==='item'&&!it.collected){it.collected=true;
        if(it.item==='heal'){this.player.healItems++;this.showMsg('Elixir de Vida (tecla 1).')}if(it.item==='mana'){this.player.manaItems=(this.player.manaItems||0)+1;this.showMsg('Elixir de Mana (tecla 2).')}
        if(it.item==='energy'){this.player.energy=CONFIG.PLAYER.MAX_ENERGY;this.showMsg('Energia magica restaurada.')}
        if(it.item==='flame'){this.player.hasFlame=true;this.showMsg('Chama de Lúmen! Ela queima fios selados.')}
        if(it.item==='boss_key'){this.player.keys.push('boss_key');this.showMsg('Chave da Camara da Lacuna! Leve-a a leste.');}
        return}
      if(it.type==='ability'&&!it.collected){it.collected=true;this.player.hasStitch=true;this.showMsg('Costura Astral desbloqueada! (C / Shift)');return}
      if(it.type==='door_lock'){
        if(!it.locked){this.showMsg('A porta ja esta aberta.');return}
        if(this.player.keys.includes('boss_key')){this.unlockBossDoor(true);return}
        this.showMsg('O quarto da Governanta esta trancado. A chave dorme nas profundezas, presa em fios que so o fogo desfaz...');return}
      if(it.type==='book'){
        const lines={
          book_bed:['"Desperte. Ou continue sonhando."'],
          book1:['"As paredes lembram o que as pessoas esquecem."'],
          book2:['"A passagem ao leste so abre com a chave das profundezas."'],
          book3:['"Pulo duas vezes. O ar tambem e chao, se voce insistir."'],
          book_cellar:['"Desca. Sempre ha outro andar abaixo."'],
          book_chapel:['"A Costureira puxa os fios — e voce com eles."'],
          book_obs:['"Do alto, a casa parece um corpo deitado."'],
          book_ante:['"Sem a chave das Galerias, a Costureira nao te recebe."']
        };
        this.dialog={name:'Livro',lines:lines[it.id]||['Paginas em branco... ou apagadas.']};window.ALB&&window.ALB.regBook(this.player,it.id,this.dialog.lines,it);this.dialogIndex=0;this.state='dialog';return}
      if(it.type==='painting'){this.showMsg('O retrato parece observar voce.');return}
      if(it.type==='npc'){
        if(it.id==='echo_girl'||it.id==='echo_garden')this.dialog={name:'Eco da Menina',lines:['Voce voltou... ou chegou pela primeira vez?','A chave da Camara nao esta neste andar.','Desca as escadas. Passe o porao. As galerias guardam o metal.']};
        else if(it.id==='guard_ante')this.dialog={name:'Vulto da Antecâmara',lines:['Sem a chave, a Costureira nao te recebe.','Ou melhor: ela te recebe — mas voce nao entra.']};
        else this.dialog={name:'Guardiao da Moldura',lines:['A Casa Desfeita nao tem um unico caminho.','Suba, desca, atravesse as molduras.','A chave dorme no extremo das Galerias Inferiores.']};
        this.dialogIndex=0;this.state='dialog';return;
      }
    }
  }
  draw(){
    const ctx=this.ctx; ctx.imageSmoothingEnabled=false;
    ctx.fillStyle=C.bg; ctx.fillRect(0,0,CONFIG.INTERNAL_W,CONFIG.INTERNAL_H);
    if(this.state==='loading'){ctx.fillStyle=C.ivory;ctx.font='14px Georgia';ctx.fillText('Carregando...',240,180);return}
    if(this.state==='title'){this.drawTitle(ctx);return}
    this.drawWorld(ctx);
    for(const e of this.enemies)e.draw(ctx,this.camera);
    if(this.boss)this.boss.draw(ctx,this.camera);
    this.player.draw(ctx,this.camera);
    this.particles.draw(ctx,this.camera);
    this.drawInteractHints(ctx); this.drawHUD(ctx);
    this.drawToast(ctx);
    if(this.state==='pause')this.drawPause(ctx);
    if(this.state==='map')this.drawMap(ctx);
    if(this.state==='dialog')this.drawDialog(ctx);
    if(this.state==='dead')this.drawDeath(ctx);
    if(this.state==='win')this.drawWin(ctx);
  }
  drawWorld(ctx){
    const cam=this.camera;
    const startTX=Math.max(0,Math.floor(cam.x/T)-1), endTX=Math.min(WORLD_W,Math.ceil((cam.x+CONFIG.INTERNAL_W)/T)+1);
    const startTY=Math.max(0,Math.floor(cam.y/T)-1), endTY=Math.min(WORLD_H,Math.ceil((cam.y+CONFIG.INTERNAL_H)/T)+1);

    // Background wash from current zone
    let bg='#14101a';
    const pz=zoneAt(Math.floor((this.player.x+14)/T), Math.floor((this.player.y+20)/T));
    if(pz&&pz.bg) bg=pz.bg;
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,CONFIG.INTERNAL_W,CONFIG.INTERNAL_H);

    // Subtle parallax vignette / depth bands
    ctx.fillStyle='rgba(0,0,0,0.15)';
    ctx.fillRect(0,0,CONFIG.INTERNAL_W,40);
    ctx.fillStyle='rgba(126,53,184,0.03)';
    ctx.fillRect(0,CONFIG.INTERNAL_H-50,CONFIG.INTERNAL_W,50);

    // Distant silhouettes (parallax-ish)
    ctx.globalAlpha=0.12;
    ctx.fillStyle=C.violetDark;
    for(let i=0;i<6;i++){
      const sx=Math.floor((i*140 - cam.x*0.15)%700)-20;
      ctx.fillRect(sx, 80+(i%3)*30, 40+i*8, 180);
    }
    ctx.globalAlpha=1;

    for(let ty=startTY;ty<endTY;ty++)for(let tx=startTX;tx<endTX;tx++){
      const cell=this.grid[ty][tx]; if(cell===0)continue;
      const px=Math.floor(tx*T-cam.x), py=Math.floor(ty*T-cam.y);
      const z=zoneAt(tx,ty);
      const wallCol=z?z.wall:C.wall;
      const floorCol=z?z.floor:C.wood;
      const accent=z?z.accent:C.roseOld;

      if(cell===1){
        ctx.fillStyle=wallCol;
        ctx.fillRect(px,py,T,T);
        // edge highlight
        ctx.fillStyle='rgba(255,255,255,0.04)';
        ctx.fillRect(px,py,T,2);
        ctx.fillRect(px,py,2,T);
        // floor surface on top of solid when open above
        if(ty>0&&this.grid[ty-1][tx]===0){
          ctx.fillStyle=floorCol;
          ctx.fillRect(px,py,T,5);
          ctx.fillStyle=accent;
          ctx.globalAlpha=0.35;
          ctx.fillRect(px+2,py+1,3,2);
          ctx.globalAlpha=1;
          // wood plank lines
          ctx.strokeStyle='rgba(0,0,0,0.25)';
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(px,py+5); ctx.lineTo(px+T,py+5); ctx.stroke();
        }
        // occasional brick detail
        if(((tx+ty*3)%7)===0){
          ctx.fillStyle='rgba(0,0,0,0.12)';
          ctx.fillRect(px+4,py+6,8,4);
        }
      } else if(cell===2){
        ctx.fillStyle=wallCol;
        ctx.fillRect(px,py,T,6);
        ctx.fillStyle=accent;
        ctx.fillRect(px,py,T,2);
        ctx.fillStyle='rgba(255,255,255,0.08)';
        ctx.fillRect(px+1,py+1,T-2,1);
      }
    }

    // Windows / wall decorations in open air near walls
    for(let ty=startTY;ty<endTY;ty++){
      for(let tx=startTX;tx<endTX;tx++){
        if(this.grid[ty][tx]!==0) continue;
        // window pattern on left of solid wall
        if(tx+1<WORLD_W && this.grid[ty][tx+1]===1 && ((tx+ty)%11===0) && ty>2){
          const px=Math.floor(tx*T-cam.x), py=Math.floor(ty*T-cam.y);
          const z=zoneAt(tx,ty);
          ctx.fillStyle=z&&z.theme==='stars'?'#1a2040':'#1a2838';
          ctx.fillRect(px+4,py+2,10,12);
          ctx.strokeStyle=z?z.accent:C.ivory;
          ctx.globalAlpha=0.5;
          ctx.strokeRect(px+4,py+2,10,12);
          ctx.globalAlpha=0.25;
          ctx.fillStyle=C.light;
          ctx.fillRect(px+6,py+4,3,3);
          ctx.globalAlpha=1;
        }
      }
    }

    // Moving platforms
    for(const m of this.movers){
      const px=Math.floor(m.x-cam.x), py=Math.floor(m.y-cam.y);
      if(px<-40||px>680) continue;
      ctx.fillStyle='#4a3a50';
      ctx.fillRect(px,py,m.w,m.h);
      ctx.fillStyle=C.roseOld;
      ctx.fillRect(px,py,m.w,2);
      ctx.fillStyle=C.magicPurple;
      ctx.globalAlpha=0.5;
      ctx.fillRect(px+2,py+2,4,2);
      ctx.fillRect(px+m.w-6,py+2,4,2);
      ctx.globalAlpha=1;
    }

    // Hazards (spikes)
    for(const h of this.hazards){
      const px=Math.floor(h.x-cam.x), py=Math.floor(h.y-cam.y);
      if(px<-20||px>660) continue;
      ctx.fillStyle='#3a2030';
      const spikes=Math.max(1,Math.floor(h.w/6));
      for(let i=0;i<spikes;i++){
        ctx.beginPath();
        ctx.moveTo(px+i*6, py+h.h);
        ctx.lineTo(px+i*6+3, py);
        ctx.lineTo(px+i*6+6, py+h.h);
        ctx.fill();
      }
      ctx.fillStyle=C.roseIntense;
      ctx.globalAlpha=0.4;
      for(let i=0;i<spikes;i++) ctx.fillRect(px+i*6+2,py+2,2,2);
      ctx.globalAlpha=1;
    }

    // Interactives
    for(const it of this.interactives){
      const px=Math.floor(it.x-cam.x), py=Math.floor(it.y-cam.y);
      if(px<-50||px>700)continue;
      if(it.type==='rest'){
        ctx.fillStyle=C.ivory; ctx.fillRect(px,py,it.w,4);
        ctx.fillStyle=C.magicPurple;
        ctx.beginPath(); ctx.arc(px+it.w/2,py-4,4+Math.sin(this.time*3),0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=0.3;
        ctx.beginPath(); ctx.arc(px+it.w/2,py-4,8+Math.sin(this.time*2)*2,0,Math.PI*2); ctx.stroke();
        ctx.globalAlpha=1;
      }
      else if(it.type==='memory'&&!it.collected){
        ctx.fillStyle=C.magicPurple;
        ctx.globalAlpha=0.6+Math.sin(this.time*4+it.x)*0.35;
        ctx.fillRect(px,py,10,10);
        ctx.strokeStyle=C.light; ctx.strokeRect(px-1,py-1,12,12);
        ctx.globalAlpha=1;
      }
      else if(it.type==='item'&&!it.collected){
        if(it.item==='boss_key'){
          ctx.fillStyle='#e8d080'; ctx.fillRect(px+2,py+2,12,8);
          ctx.fillStyle=C.roseIntense; ctx.fillRect(px+12,py+4,4,4);
          ctx.globalAlpha=0.4+Math.sin(this.time*5)*0.3;
          ctx.strokeStyle='#e8d080'; ctx.strokeRect(px,py,16,12);
          ctx.globalAlpha=1;
        } else {
          ctx.fillStyle=it.item==='heal'?C.roseIntense:C.blueGray;
          ctx.fillRect(px+2,py+2,10,10);
        }
      }
      else if(it.type==='ability'&&!it.collected){
        ctx.fillStyle=C.magicPurple;
        ctx.beginPath(); ctx.arc(px+12,py+12,10+Math.sin(this.time*4),0,Math.PI*2); ctx.fill();
        ctx.fillStyle=C.light; ctx.font='10px Georgia'; ctx.fillText('*',px+8,py+16);
      }
      else if(it.type==='cabinet'){
        ctx.fillStyle=C.wood; ctx.fillRect(px,py,it.w,it.h);
        ctx.strokeStyle=C.woodLight; ctx.strokeRect(px,py,it.w,it.h);
        ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(px+4,py+6,it.w-8,4);
      }
      else if(it.type==='book'){window.drawBook(ctx,px,py)}
      else if(it.type==='painting'){
        ctx.fillStyle='#3a2a20'; ctx.fillRect(px,py,it.w,it.h);
        ctx.strokeStyle=C.ivory; ctx.strokeRect(px,py,it.w,it.h);
        ctx.fillStyle=C.violetMid; ctx.fillRect(px+4,py+4,it.w-8,it.h-8);
      }
      else if(it.type==='npc'){
        // idle bob
        const bob=Math.sin(this.time*2+it.x)*2;
        ctx.fillStyle='#6a5a70'; ctx.fillRect(px+4,py+8+bob,16,24);
        ctx.fillStyle=C.ivory; ctx.fillRect(px+6,py+bob,12,12);
        ctx.fillStyle=C.magicPurple; ctx.globalAlpha=0.4;
        ctx.beginPath(); ctx.arc(px+12,py-4+bob,3,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
      }
      else if(it.type==='door_lock'){
        if(it.locked){
          ctx.fillStyle='#4a2030'; ctx.fillRect(px,py,it.w,it.h);
          ctx.fillStyle='#e8d080'; ctx.font='10px Georgia'; ctx.fillText('TRANCADA',px-8,py-4);
          ctx.strokeStyle='#e8d080'; ctx.strokeRect(px,py,it.w,it.h);
        } else {
          ctx.fillStyle='rgba(126,53,184,0.25)'; ctx.fillRect(px,py,it.w,it.h);
          ctx.fillStyle=C.light; ctx.font='9px Georgia'; ctx.fillText('aberta',px,py-4);
        }
      }
    }
  }

  drawTitle(ctx){
    ctx.fillStyle='#0c0a12';ctx.fillRect(0,0,640,360);
    ctx.fillStyle=C.magicPurple;ctx.globalAlpha=0.15;
    for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(80+i*50,60+(i%3)*80,20+i*3,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1;
    const por=this.assets.get('characters_mika_portrait_png');
    if(por){ctx.globalAlpha=0.85;ctx.drawImage(por,400,80,200,200);ctx.globalAlpha=1}
    ctx.fillStyle=C.light;ctx.font='bold 42px Georgia';ctx.fillText('LUMEN',60,100);
    ctx.font='14px Georgia';ctx.fillStyle=C.roseOld;ctx.fillText('O JARDIM DO FIM',62,124);
    ctx.fillStyle=C.violetMid;ctx.font='11px Georgia';ctx.fillText('"Tudo o que voce lembra tambem e uma mentira."',62,150);
    this.titleOptions.forEach((opt,i)=>{
      const sel=i===this.titleSelect, locked=i===1&&!this.hasSave;
      ctx.fillStyle=locked?'#3a3040':(sel?C.roseIntense:C.ivory);
      ctx.font=sel?'bold 16px Georgia':'14px Georgia';
      ctx.fillText((sel?'> ':'  ')+opt,70,200+i*28);
    });
    ctx.font='11px Georgia';ctx.fillStyle=C.violetMid;ctx.fillText('Parkour: muro+pulo | coyote | pogo S+X | dash C',60,340);
  }
  drawDialog(ctx){
    ctx.fillStyle='rgba(16,16,25,0.92)';ctx.fillRect(40,250,560,90);ctx.strokeStyle=C.roseOld;ctx.strokeRect(40,250,560,90);
    ctx.fillStyle=C.roseIntense;ctx.font='13px Georgia';ctx.fillText(this.dialog.name,56,272);
    ctx.fillStyle=C.light;ctx.font='14px Georgia';ctx.fillText(this.dialog.lines[this.dialogIndex]||'',56,298);
    ctx.fillStyle=C.violetMid;ctx.font='11px Georgia';ctx.fillText('E / Espaco — continuar',56,328);
  }
  resize(){
    const maxW=window.innerWidth-20,maxH=window.innerHeight-20;
    this.scale=Math.max(1,Math.min(Math.floor(maxW/CONFIG.INTERNAL_W),Math.floor(maxH/CONFIG.INTERNAL_H)));
    this.canvas.style.width=(CONFIG.INTERNAL_W*this.scale)+'px';
    this.canvas.style.height=(CONFIG.INTERNAL_H*this.scale)+'px';
  }
  loop(ts){
    const dt=Math.min((ts-this.lastTime)/1000,0.05); this.lastTime=ts;
    this.update(dt); this.draw(); this.input.update();
    requestAnimationFrame(t=>this.loop(t));
  }
  start(){
    this.resize(); window.addEventListener('resize',()=>this.resize());
    this.lastTime=performance.now();
    this.init().then(()=>requestAnimationFrame(t=>this.loop(t)));
  }
}
