class Enemy {
  constructor(def,assets){
    this.assets=assets; this.type=def.type; this.spawnX=def.x; this.spawnY=def.y;
    this.x=def.x; this.y=def.y; this.vx=0; this.vy=0; this.facing=-1;
    this.hp=def.type==='broken_marionette'?60:def.type==='specter_rat'?35:40;
    this.maxHp=this.hp; this.alive=true; this.respawnTimer=0; this.permanentlyDead=false;
    this.attackCooldown=0; this.animFrame=0; this.animTimer=0;
    this.w=def.type==='broken_marionette'?28:24; this.h=def.type==='broken_marionette'?32:24;
    this.stainColor=def.type==='specter_rat'?'black':'purple';
    this.damage=def.type==='broken_marionette'?18:def.type==='specter_rat'?11:12;
    // ranged vs melee
    this.ranged = def.type==='specter_rat';
    this.aggroRange = this.ranged ? 160 : 95;
    this.attackRange = this.ranged ? 140 : 36;  // shoot from farther
    this.preferredMin = this.ranged ? 55 : 0;   // ranged keeps distance
    this.freezeTimer=0;
    this.atkPhase='idle';
    this.atkTimer=0;
    this.atkLunge=0;
    this.didHit=false;
    this.projectiles=[]; // own shots for ranged
  }
  get hitbox(){return{x:this.x,y:this.y,w:this.w,h:this.h}}
  startAttack(){
    this.atkPhase='windup';
    this.atkTimer = this.ranged ? 320 : 220;
    this.didHit=false;
    this.vx=0;
    this.attackCooldown = this.ranged ? 1400 : 1000;
  }
  update(dt,player,grid){
    if(this.permanentlyDead)return;
    if(!this.alive){
      this.respawnTimer-=dt*1000;
      // update leftover projectiles even when dead
      for(const p of this.projectiles) p.update(dt);
      this.projectiles=this.projectiles.filter(p=>p.life>0);
      if(this.respawnTimer<=0){
        this.alive=true; this.hp=this.maxHp; this.x=this.spawnX; this.y=this.spawnY;
        this.atkPhase='idle'; this.atkTimer=0; this.atkLunge=0; this.projectiles=[];
      }
      return;
    }
    this.attackCooldown=Math.max(0,this.attackCooldown-dt*1000);
    this.freezeTimer=Math.max(0,this.freezeTimer-dt*1000);
    this.animTimer+=dt;
    if(this.animTimer>0.12){this.animTimer=0;this.animFrame=(this.animFrame+1)%4}

    const ms=dt*1000;
    const dx=player.x-this.x, dy=player.y-this.y, d=Math.hypot(dx,dy);

    // --- Attack phase machine ---
    if(this.atkPhase!=='idle'){
      this.atkTimer-=ms;
      this.vx=0;
      if(d>0)this.facing=dx>0?1:-1;

      if(this.atkPhase==='windup'){
        if(this.ranged){
          // charged crouch / glow build-up
          this.atkLunge = -2 * (1 - Math.max(0,this.atkTimer)/320);
        } else {
          this.atkLunge = -3 * (1 - Math.max(0,this.atkTimer)/220);
        }
        if(this.atkTimer<=0){
          this.atkPhase='strike';
          this.atkTimer = this.ranged ? 200 : 180;
        }
      } else if(this.atkPhase==='strike'){
        const dur = this.ranged ? 200 : 180;
        const p=1-Math.max(0,this.atkTimer)/dur;
        if(this.ranged){
          this.atkLunge = 4 * Math.sin(p*Math.PI); // small forward bob when shooting
          // fire projectile once at start of strike
          if(!this.didHit && p>0.05){
            this.didHit=true;
            const cx=this.x + this.w/2 + this.facing*8;
            const cy=this.y + this.h*0.4;
            const ang=Math.atan2((player.y+14)-cy, (player.x+14)-cx);
            const spd=2.4;
            const shot=new Projectile(cx, cy, Math.cos(ang)*spd, Math.sin(ang)*spd);
            shot.life=1.6;
            shot.r=5;
            shot.color = this.stainColor==='black' ? '#2a2038' : C.magicPurple;
            shot.fromEnemy=true;
            this.projectiles.push(shot);
          }
        } else {
          this.atkLunge = 10 * Math.sin(p*Math.PI);
          if(!this.didHit && p>0.25 && p<0.85){
            const hitbox={
              x:this.facing>0 ? this.x+this.w-4 : this.x-16,
              y:this.y+4, w:20, h:this.h-6
            };
            if(rectOverlap(hitbox, player.hitbox)){
              this.didHit=true;
              const hit=player.takeDamage(this.damage,this.stainColor,this.x+this.w/2);
              if(hit) this.freezeTimer=280;
            }
          }
        }
        if(this.atkTimer<=0){
          this.atkPhase='recover';
          this.atkTimer = this.ranged ? 280 : 200;
        }
      } else if(this.atkPhase==='recover'){
        this.atkLunge *= 0.75;
        if(this.atkTimer<=0){
          this.atkPhase='idle';
          this.atkLunge=0;
        }
      }
    }

    if(this.freezeTimer>0 && this.atkPhase==='idle'){
      this.vx=0; this.atkLunge=0;
    }

    // Movement
    if(this.atkPhase==='idle' && this.freezeTimer<=0){
      if(this.ranged){
        // keep preferred distance: back away if too close, approach if too far but in aggro
        if(d < this.preferredMin && d > 8){
          this.facing = dx>0?1:-1;
          this.vx = -this.facing * 1.2; // back off
        } else if(d > this.attackRange * 0.55 && d < this.aggroRange){
          this.facing = dx>0?1:-1;
          this.vx = this.facing * 1.1;
        } else {
          this.vx=0;
          if(d>0)this.facing=dx>0?1:-1;
        }
        // shoot when in range and line roughly clear
        if(this.attackCooldown<=0 && d<=this.attackRange && d>=this.preferredMin*0.6){
          this.startAttack();
        }
      } else {
        if(d<this.aggroRange&&d>this.attackRange){
          this.facing=dx>0?1:-1;
          this.vx=this.facing*1.0;
        } else {
          this.vx=0;
          if(d<=this.attackRange)this.facing=dx>0?1:-1;
        }
        if(this.attackCooldown<=0 && d<=this.attackRange){
          this.startAttack();
        }
      }
    }

    this.vy+=CONFIG.GRAVITY; this.vy=Math.min(this.vy,CONFIG.MAX_FALL);
    if(this.atkPhase==='idle') this.x+=this.vx;
    this.y+=this.vy;
    const ty=Math.floor((this.y+this.h)/T), tx=Math.floor((this.x+this.w/2)/T);
    if(ty>=0&&ty<WORLD_H&&tx>=0&&tx<WORLD_W){
      if(grid[ty][tx]===1||grid[ty][tx]===2){this.y=ty*T-this.h;this.vy=0}
    }

    // Update own projectiles + hit player
    for(const pr of this.projectiles){
      pr.update(dt);
      if(pr.life>0 && rectOverlap(pr.hitbox, player.hitbox)){
        const hit=player.takeDamage(this.damage, this.stainColor, pr.x);
        pr.life=0;
        if(hit) this.freezeTimer=200;
      }
    }
    this.projectiles=this.projectiles.filter(pr=>pr.life>0);
  }
  takeDamage(amount){
    if(!this.alive)return;
    this.hp-=amount;
    if(this.atkPhase!=='idle'){ this.atkPhase='idle'; this.atkTimer=0; this.atkLunge=0; }
    if(this.hp<=0){this.alive=false;this.respawnTimer=CONFIG.RESPAWN_TIME}
  }
  draw(ctx,cam){
    // draw projectiles first (behind or over — over is fine)
    for(const pr of this.projectiles){
      const qx=Math.floor(pr.x-cam.x), qy=Math.floor(pr.y-cam.y);
      ctx.fillStyle = pr.color || '#2a2038';
      ctx.beginPath(); ctx.arc(qx,qy,pr.r||5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = C.magicPurple;
      ctx.globalAlpha=0.7;
      ctx.beginPath(); ctx.arc(qx,qy,2,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
      // trail
      ctx.fillStyle='rgba(126,53,184,0.35)';
      ctx.fillRect(qx-pr.vx*2, qy-pr.vy*2, 3, 3);
    }

    if(this.permanentlyDead)return;
    const lunge = (this.atkLunge||0) * this.facing;
    const px=Math.floor(this.x-cam.x + lunge), py=Math.floor(this.y-cam.y);
    if(px<-50||px>700||py<-40||py>400)return;

    if(!this.alive){
      const t=1-this.respawnTimer/CONFIG.RESPAWN_TIME;
      ctx.globalAlpha=0.3+t*0.4;
      ctx.fillStyle=this.stainColor==='black'?'#1a1420':C.magicPurple;
      ctx.fillRect(px+4,py+8,12,12); ctx.globalAlpha=1; return;
    }

    let imgKey=null;
    if(this.type==='paper_doll')imgKey='enemies_paper_doll_png';
    else if(this.type==='specter_rat')imgKey='enemies_specter_rat_png';
    else if(this.type==='broken_marionette')imgKey='enemies_marionette_png';
    const img=imgKey?this.assets.get(imgKey):null;

    ctx.save();
    if(this.facing<0){
      ctx.translate(px+this.w,0); ctx.scale(-1,1); ctx.translate(-px,0);
    }

    if(this.atkPhase==='windup'){
      if(this.ranged){
        // rear up / inflate for ranged charge
        ctx.translate(px+this.w/2, py+this.h);
        ctx.scale(0.95, 1.08);
        ctx.translate(-(px+this.w/2), -(py+this.h));
      } else {
        ctx.translate(px+this.w/2, py+this.h);
        ctx.scale(1.05, 0.92);
        ctx.translate(-(px+this.w/2), -(py+this.h));
      }
    }
    if(this.atkPhase==='strike' && !this.ranged){
      ctx.translate(px+this.w/2, py+this.h/2);
      ctx.scale(1.12, 0.95);
      ctx.translate(-(px+this.w/2), -(py+this.h/2));
    }

    if(img){
      ctx.imageSmoothingEnabled=false;
      ctx.drawImage(img,px,py,this.w+4,this.h+4);
    } else {
      ctx.fillStyle=this.type==='specter_rat'?'#2a2030':'#4a3050';
      ctx.fillRect(px,py,this.w,this.h);
    }

    // === Melee VFX ===
    if(!this.ranged && this.atkPhase==='windup'){
      ctx.globalAlpha=0.55;
      ctx.fillStyle=C.magicPurple;
      const wob=Math.sin(performance.now()/40)*2;
      ctx.beginPath(); ctx.arc(px-4+wob, py+this.h*0.45, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle=C.roseIntense; ctx.fillRect(px-2, py+this.h*0.35, 3, 10);
      ctx.globalAlpha=1;
    }
    if(!this.ranged && this.atkPhase==='strike'){
      const progress=1-Math.max(0,this.atkTimer)/180;
      ctx.strokeStyle=C.roseIntense; ctx.lineWidth=2.5; ctx.globalAlpha=0.85;
      ctx.beginPath();
      const ax=px+this.w+2, ay=py+this.h*0.3, reach=6+progress*18;
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(ax+reach, ay+this.h*0.15, ax+reach*0.7, ay+this.h*0.45);
      ctx.stroke();
      ctx.strokeStyle=C.magicPurple; ctx.lineWidth=1.5; ctx.globalAlpha=0.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay+4);
      ctx.quadraticCurveTo(ax+reach*0.8, ay+this.h*0.25, ax+reach*0.5, ay+this.h*0.5);
      ctx.stroke();
      if(progress>0.3&&progress<0.7){
        ctx.fillStyle=C.light; ctx.globalAlpha=0.9;
        ctx.fillRect(ax+reach-2, ay+this.h*0.2, 3, 3);
      }
      ctx.globalAlpha=1;
    }

    // === Ranged VFX ===
    if(this.ranged && this.atkPhase==='windup'){
      // glowing orb forming in mouth / front
      const charge=1-Math.max(0,this.atkTimer)/320;
      const pulse=0.6+Math.sin(performance.now()/50)*0.3;
      ctx.globalAlpha=0.4+charge*0.55;
      ctx.fillStyle='#1a1028';
      const ox=px+this.w+2, oy=py+this.h*0.38;
      ctx.beginPath(); ctx.arc(ox, oy, 3+charge*5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle=C.magicPurple;
      ctx.beginPath(); ctx.arc(ox, oy, 2+charge*3*pulse, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle=C.roseIntense;
      ctx.globalAlpha=0.5*charge;
      ctx.beginPath(); ctx.arc(ox, oy, 1+charge*2, 0, Math.PI*2); ctx.fill();
      // charge rings
      ctx.strokeStyle=C.magicPurple;
      ctx.lineWidth=1;
      ctx.globalAlpha=0.3+charge*0.4;
      ctx.beginPath(); ctx.arc(ox, oy, 6+charge*4, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha=1;
    }
    if(this.ranged && this.atkPhase==='strike'){
      // muzzle flash / spit burst
      const progress=1-Math.max(0,this.atkTimer)/200;
      if(progress<0.45){
        ctx.globalAlpha=1-progress*2;
        ctx.fillStyle=C.light;
        const ox=px+this.w+4, oy=py+this.h*0.38;
        ctx.beginPath(); ctx.arc(ox, oy, 6-progress*8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle=C.magicPurple;
        ctx.fillRect(ox+2, oy-2, 8-progress*10, 4);
        ctx.globalAlpha=1;
      }
      // recoil lines
      ctx.strokeStyle='rgba(126,53,184,0.5)';
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(px+this.w, py+this.h*0.35);
      ctx.lineTo(px+this.w+10*(1-progress), py+this.h*0.3);
      ctx.stroke();
    }
    if(this.ranged && this.atkPhase==='recover'){
      ctx.globalAlpha=0.3;
      ctx.fillStyle=C.violetMid;
      ctx.fillRect(px+this.w, py+this.h*0.4, 4, 2);
      ctx.globalAlpha=1;
    }

    if(!this.ranged && this.atkPhase==='recover'){
      ctx.globalAlpha=0.35;
      ctx.strokeStyle=C.violetMid; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(px+this.w, py+this.h*0.4);
      ctx.lineTo(px+this.w+6, py+this.h*0.45);
      ctx.stroke();
      ctx.globalAlpha=1;
    }

    ctx.restore();
  }
}
