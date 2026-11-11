class Player {
  constructor(assets){
    this.assets=assets; this.x=6*T; this.y=(18+UPR)*T; this.vx=0; this.vy=0; this.facing=1;
    this.onGround=false; this.hp=CONFIG.PLAYER.MAX_HP; this.energy=CONFIG.PLAYER.MAX_ENERGY;
    this.invuln=0; this.attackTimer=0; this.attacking=false; this.dashTimer=0;
    this.stains=[]; this.hasStitch=false; this.anim='idle'; this.animFrame=0; this.animTimer=0;
    this.dead=false; this.healItems=1; this.manaItems=0; this.keys=[]; this.memories=[]; this.collectibles=0;
    this.visitedZones=new Set(['bedroom']); this.currentZone='Quarto Desfeito';
    this.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS;
    this.knockbackTimer=0; this.knockbackVx=0;
    this.pogoing=false; this.pogoTimer=0;
    // Parkour state
    this.coyoteTimer=0;
    this.jumpBuffer=0;
    this.wasOnGround=false;
    this.onWall=0; // -1 left, 1 right, 0 none
    this.wallJumpLock=0; // brief lock after wall jump
    this.jumpHeld=false;
    this.canVariableCut=false;
  }
  get hitbox(){return{x:this.x+6,y:this.y+6,w:CONFIG.PLAYER.W,h:CONFIG.PLAYER.H}}

  tryJump(){
    // Ground / coyote
    if(this.onGround || this.coyoteTimer>0){
      this.vy=CONFIG.PLAYER.JUMP;
      this.onGround=false;
      this.coyoteTimer=0;
      this.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS-1;
      this.canVariableCut=true;
      this.jumpBuffer=0;
      return true;
    }
    // Wall jump
    if(this.onWall!==0 && this.wallJumpLock<=0){
      this.vy=CONFIG.PLAYER.WALL_JUMP_VY;
      this.vx=-this.onWall*CONFIG.PLAYER.WALL_JUMP_VX;
      this.facing=-this.onWall;
      this.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS-1;
      this.wallJumpLock=140;
      this.canVariableCut=true;
      this.jumpBuffer=0;
      this.onWall=0;
      return true;
    }
    // Air double jump
    if(this.jumpsLeft>0){
      this.vy=CONFIG.PLAYER.JUMP;
      this.jumpsLeft--;
      this.canVariableCut=true;
      this.jumpBuffer=0;
      return true;
    }
    return false;
  }

  update(dt,input,grid){
    if(this.dead)return;
    const ms=dt*1000;
    this.invuln=Math.max(0,this.invuln-ms);
    this.attackTimer=Math.max(0,this.attackTimer-ms);
    this.dashTimer=Math.max(0,this.dashTimer-ms);
    this.pogoTimer=Math.max(0,this.pogoTimer-ms);
    this.wallJumpLock=Math.max(0,this.wallJumpLock-ms);
    if(this.pogoTimer<=0)this.pogoing=false;

    // Knockback
    if(this.knockbackTimer>0){
      this.knockbackTimer-=ms;
      this.vx=this.knockbackVx;
      this.vy+=CONFIG.GRAVITY*0.5;
      this.vy=Math.min(this.vy,CONFIG.MAX_FALL);
      this.x+=this.vx; this.resolve(grid,true);
      this.y+=this.vy; this.onGround=false; this.onWall=0; this.resolve(grid,false);
      if(this.onGround){this.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS; this.coyoteTimer=0;}
      this.anim='hurt';
      return;
    }

    // Jump buffer
    if(input.jump()) this.jumpBuffer=CONFIG.PLAYER.JUMP_BUFFER_MS;
    else this.jumpBuffer=Math.max(0,this.jumpBuffer-ms);

    // Horizontal move
    let move=0;
    if(input.left()){move=-1; this.facing=-1}
    if(input.right()){move=1; this.facing=1}

    const airCtrl = this.onGround ? 1 : CONFIG.PLAYER.AIR_CONTROL;
    if(this.wallJumpLock>0){
      // preserve wall-jump push, slight air steer
      this.vx += move * CONFIG.PLAYER.SPEED * 0.15;
      this.vx = clamp(this.vx, -CONFIG.PLAYER.SPEED*1.4, CONFIG.PLAYER.SPEED*1.4);
    } else if(this.dashTimer>0){
      this.vx = this.facing * CONFIG.PLAYER.DASH_SPEED;
    } else {
      this.vx = this.pogoing ? (move||this.facing) * CONFIG.PLAYER.SPEED * 1.15 : move * CONFIG.PLAYER.SPEED * airCtrl;
    }

    // Jump execution (buffered)
    if(this.jumpBuffer>0){
      if(this.tryJump()) this.jumpHeld=true;
    }
    // Variable jump height: release cut
    const jumpDown = input.isDown('Space')||input.isDown('KeyZ')||input.isDown('ArrowUp')||input.isDown('KeyW');
    if(this.canVariableCut && !jumpDown && this.vy<0){
      this.vy *= CONFIG.PLAYER.VARIABLE_JUMP_CUT;
      this.canVariableCut=false;
    }
    if(!jumpDown) this.jumpHeld=false;

    // Gravity + wall slide + fast fall
    let grav=CONFIG.GRAVITY;
    if(this.onWall!==0 && this.vy>0 && move===this.onWall){
      // holding into wall while falling → slide
      this.vy = Math.min(this.vy, CONFIG.PLAYER.WALL_SLIDE_SPEED);
      grav = 0.08;
    }
    this.vy += grav;
    // fast fall
    if(!this.onGround && input.down() && this.vy>0 && !this.pogoing){
      this.vy = Math.min(CONFIG.MAX_FALL, this.vy + CONFIG.PLAYER.FAST_FALL*0.5);
    }
    this.vy = Math.min(this.vy, CONFIG.MAX_FALL);

    // Attack / Pogo
    if(input.attack()&&this.attackTimer<=0){
      this.attackTimer=CONFIG.PLAYER.ATTACK_COOLDOWN;
      if(!this.onGround && input.down()){
        this.pogoing=true; this.pogoTimer=340; this.attacking=true;
        this.vy=Math.max(this.vy, 5.2);
        setTimeout(()=>{this.attacking=false},320);
      } else {
        this.pogoing=false; this.attacking=true;
        setTimeout(()=>{this.attacking=false},160);
      }
    }

    // Air / ground dash (Costura Astral)
    if(input.dash()&&this.hasStitch&&this.energy>=15&&this.dashTimer<=0){
      this.dashTimer=CONFIG.PLAYER.DASH_DURATION;
      this.energy-=15;
      this.invuln=Math.max(this.invuln,200);
      this.vy *= 0.35; // kill vertical momentum for clean air dash
      this.coyoteTimer=0;
    }
    if(input.heal()&&this.healItems>0&&this.hp<CONFIG.PLAYER.MAX_HP){
      this.healItems--; this.hp=Math.min(CONFIG.PLAYER.MAX_HP,this.hp+CONFIG.PLAYER.MAX_HP*.2);
    }

    // Integrate + collide
    this.wasOnGround=this.onGround;
    this.x+=this.vx; this.resolve(grid,true);
    this.y+=this.vy; this.onGround=false; this.onWall=0; this.resolve(grid,false);

    // Coyote time
    if(this.onGround){
      this.jumpsLeft=CONFIG.PLAYER.MAX_JUMPS;
      this.coyoteTimer=0;
      this.pogoing=false;
      this.wallJumpLock=0;
    } else if(this.wasOnGround && !this.onGround){
      this.coyoteTimer=CONFIG.PLAYER.COYOTE_MS;
    } else {
      this.coyoteTimer=Math.max(0,this.coyoteTimer-ms);
    }

    // Anim
    this.animTimer+=dt;
    if(this.animTimer>0.12){this.animTimer=0;this.animFrame=(this.animFrame+1)%4}
    if(this.pogoing)this.anim='pogo';
    else if(this.dashTimer>0)this.anim='dash';
    else if(this.attacking)this.anim='attack';
    else if(this.onWall!==0 && this.vy>0)this.anim='wall';
    else if(!this.onGround)this.anim=this.vy<0?'jump':'fall';
    else if(Math.abs(this.vx)>0.1)this.anim='walk';
    else this.anim='idle';

    for(let i=this.stains.length-1;i>=0;i--){
      this.stains[i].life-=dt; if(this.stains[i].life<=0)this.stains.splice(i,1);
    }
    const tx=Math.floor((this.x+14)/T),ty=Math.floor((this.y+20)/T);
    for(const z of ZONES){
      if(z.w<=0)continue;
      if(tx>=z.x&&tx<z.x+z.w&&ty>=z.y&&ty<z.y+z.h){
        this.visitedZones.add(z.id); this.currentZone=z.name;
      }
    }
  }

  resolve(grid,horizontal){
    const hb=this.hitbox;
    const minTX=Math.floor(hb.x/T),maxTX=Math.floor((hb.x+hb.w-0.1)/T);
    const minTY=Math.floor(hb.y/T),maxTY=Math.floor((hb.y+hb.h-0.1)/T);
    let hitWall=0;
    for(let ty=minTY;ty<=maxTY;ty++)for(let tx=minTX;tx<=maxTX;tx++){
      if(ty<0||tx<0||ty>=WORLD_H||tx>=WORLD_W)continue;
      const cell=grid[ty][tx]; if(cell!==1&&cell!==2)continue;
      const sx=tx*T,sy=ty*T;
      if(!(hb.x<sx+T&&hb.x+hb.w>sx&&hb.y<sy+T&&hb.y+hb.h>sy))continue;
      if(cell===2){
        if(horizontal||this.vy<0)continue;
        if(hb.y+hb.h-this.vy>sy+4)continue;
      }
      if(horizontal){
        if(this.vx>0){ this.x=sx-hb.w-6; hitWall=1; }
        else if(this.vx<0){ this.x=sx+T-6; hitWall=-1; }
        this.vx=0;
      } else {
        if(this.vy>0){ this.y=sy-hb.h-6; this.vy=0; this.onGround=true; }
        else if(this.vy<0){
          this.y=sy+T-6; this.vy=0;
          // corner correction: if mostly past the ceiling block, nudge sideways
          const overlapL = (sx+T) - hb.x;
          const overlapR = (hb.x+hb.w) - sx;
          if(overlapL>0 && overlapL<8) this.x += overlapL+1;
          else if(overlapR>0 && overlapR<8) this.x -= overlapR+1;
        }
      }
    }
    // Detect wall contact for wall-slide (probe sides while airborne)
    if(!horizontal && !this.onGround){
      const probe=3;
      const leftBox={x:hb.x-probe,y:hb.y+4,w:probe,h:hb.h-8};
      const rightBox={x:hb.x+hb.w,y:hb.y+4,w:probe,h:hb.h-8};
      for(let ty=minTY;ty<=maxTY;ty++){
        for(let tx=Math.max(0,minTX-1);tx<=Math.min(WORLD_W-1,maxTX+1);tx++){
          if(grid[ty][tx]!==1) continue;
          const sx=tx*T,sy=ty*T, block={x:sx,y:sy,w:T,h:T};
          if(rectOverlap(leftBox,block)) hitWall=-1;
          if(rectOverlap(rightBox,block)) hitWall=1;
        }
      }
      this.onWall=hitWall;
    }
    this.x=clamp(this.x,T,(WORLD_W-2)*T); this.y=clamp(this.y,0,(WORLD_H-2)*T);
  }

  takeDamage(amount,stainColor,fromX){
    if(this.invuln>0||this.dead||this.knockbackTimer>0)return false;
    this.hp-=amount;
    this.invuln=CONFIG.PLAYER.I_FRAMES;
    const dir = (fromX!=null && fromX > this.x+14) ? -1 : 1;
    this.knockbackVx = dir * 4.2;
    this.knockbackTimer = 280;
    this.vy = -2.8;
    this.pogoing=false; this.coyoteTimer=0;
    if(stainColor)this.stains.push({color:stainColor,life:5+Math.random()*3});
    if(this.hp<=0){this.hp=0;this.dead=true}
    return true;
  }
  pogoBounce(){
    this.vy = CONFIG.PLAYER.JUMP * 1.05;
    this.pogoing=false; this.pogoTimer=0;
    this.jumpsLeft=Math.max(this.jumpsLeft,1);
    this.invuln=Math.max(this.invuln,120);
    this.canVariableCut=true;
  }
  getAttackBox(){
    if(!this.attacking && !this.pogoing)return null;
    const hb=this.hitbox;
    if(this.pogoing) return{x:hb.x-6,y:hb.y+hb.h-6,w:hb.w+12,h:24,pogo:true};
    return{x:this.facing>0?hb.x+hb.w:hb.x-24,y:hb.y+2,w:26,h:22,pogo:false};
  }
  draw(ctx,cam){
    const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y);
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(px+14,py+38,10,3,0,0,Math.PI*2); ctx.fill();
    ctx.save();
    if(this.facing<0){ctx.translate(px+28,0);ctx.scale(-1,1);ctx.translate(-px,0)}
    if(this.knockbackTimer>0)ctx.globalAlpha=0.7+Math.sin(this.knockbackTimer/20)*0.3;
    let img=null;
    if(this.anim==='walk')img=this.assets.get(this.animFrame%2===0?'characters_mika_walk_0_png':'characters_mika_walk_1_png');
    else if(this.anim==='idle')img=this.assets.get(this.animFrame%2===0?'characters_mika_idle_0_png':'characters_mika_idle_1_png');
    if(!img)img=this.assets.get('characters_mika_stand_png')||this.assets.get('characters_mika_base_png');
    if(img){ctx.imageSmoothingEnabled=false;ctx.drawImage(img,px-2,py-4,32,40)}
    else{
      ctx.fillStyle='#2a1f28';ctx.fillRect(px+8,py+14,12,16);
      ctx.fillStyle='#c9b9b9';ctx.fillRect(px+9,py+4,10,10);
      ctx.fillStyle='#d0d0d8';ctx.fillRect(px+7,py+2,14,6);
    }
    // wall-slide dust
    if(this.anim==='wall'){
      ctx.globalAlpha=0.5;
      ctx.fillStyle=C.violetMid;
      ctx.fillRect(px+(this.facing>0?26:-2), py+20+this.animFrame*2, 3, 3);
      ctx.globalAlpha=1;
    }
    // dash trail
    if(this.dashTimer>0){
      ctx.globalAlpha=0.35;
      ctx.fillStyle=C.magicPurple;
      ctx.fillRect(px-this.facing*8, py+10, 10, 16);
      ctx.globalAlpha=1;
    }
    if(this.attacking||this.pogoing){
      ctx.strokeStyle=C.roseIntense; ctx.lineWidth=2; ctx.beginPath();
      if(this.pogoing){ctx.moveTo(px+10,py+30);ctx.lineTo(px+16,py+46);ctx.lineTo(px+22,py+30)}
      else{ctx.moveTo(px+22,py+16);ctx.lineTo(px+38,py+10);ctx.lineTo(px+36,py+22)}
      ctx.stroke();
    }
    for(const s of this.stains){
      ctx.globalAlpha=clamp(s.life/6,0,0.55);
      ctx.fillStyle=s.color==='black'?'#1a1420':C.magicPurple;
      ctx.fillRect(px+8,py+16,6,8); ctx.fillRect(px+14,py+22,8,6);
    }
    ctx.globalAlpha=1; ctx.restore();
  }
}
