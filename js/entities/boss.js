class Boss {
  constructor(x,y,assets){
    this.assets=assets; this.x=x; this.y=y; this.homeX=x; this.homeY=y;
    this.w=80; this.h=88;
    this.hp=380; this.maxHp=380; this.alive=true; this.phase=1;
    this.attackCooldown=0; this.facing=-1; this.timer=0;
    this.projectiles=[]; this.pullTimer=0; this.pullActive=false; this.mode='idle';
    this.modeTimer=0;
    // Arena bounds (chamber interior) — boss never leaves this box
    this.minX=196*T; this.maxX=214*T; this.minY=(12+UPR)*T; this.maxY=(22+UPR)*T;
    this.engageRange=130; // only act when player is this close
  }
  get hitbox(){return{x:this.x+10,y:this.y+12,w:this.w-20,h:this.h-16}}
  clampToArena(){
    this.x=clamp(this.x,this.minX,this.maxX);
    this.y=clamp(this.y,this.minY,this.maxY);
  }
  update(dt,player,particles){
    if(!this.alive){for(const p of this.projectiles)p.life-=dt;this.projectiles=this.projectiles.filter(p=>p.life>0);return}
    this.timer+=dt;
    this.attackCooldown=Math.max(0,this.attackCooldown-dt*1000);
    this.facing=player.x<this.x?-1:1;
    if(this.hp<this.maxHp*0.55)this.phase=2;
    if(this.hp<this.maxHp*0.25)this.phase=3;

    const d=dist(player.x,player.y,this.x+this.w/2,this.y+this.h/2);
    // Far away: idle in place, expire old projectiles, do not chase or attack
    if(d>this.engageRange){
      this.mode='idle'; this.pullActive=false; this.modeTimer=0;
      // slowly return toward home
      if(Math.abs(this.x-this.homeX)>4)this.x+=Math.sign(this.homeX-this.x)*0.6;
      this.clampToArena();
      for(const p of this.projectiles)p.update(dt);
      this.projectiles=this.projectiles.filter(p=>p.life>0);
      return;
    }

    this.modeTimer-=dt;
    if(this.modeTimer<=0){
      const roll=Math.random();
      if(roll<0.35){this.mode='pull'; this.modeTimer=1.1+Math.random()*0.3; this.pullActive=true;}
      else if(roll<0.7){this.mode='shoot'; this.modeTimer=1.5; this.pullActive=false;}
      else{this.mode='chase'; this.modeTimer=1.6; this.pullActive=false;}
    }

    if(this.mode==='pull'&&this.pullActive){
      // short pull range only
      if(d<85&&d>20){
        const ang=Math.atan2((this.y+this.h/2)-(player.y+14),(this.x+this.w/2)-(player.x+14));
        const force=this.phase>=2?1.6:1.2;
        player.x+=Math.cos(ang)*force;
        player.y+=Math.sin(ang)*force*0.45;
        if(Math.random()<0.25)particles.emit(player.x+10,player.y+10,'pull',2);
      }
      if(this.attackCooldown<=0&&rectOverlap(this.hitbox,player.hitbox)){
        player.takeDamage(this.phase>=2?20:14,'purple',this.x+this.w/2); this.attackCooldown=700;
      }
    } else if(this.mode==='shoot'){
      // only shoot at short-medium range; slow short-lived shots
      if(this.attackCooldown<=0&&d<110){
        const cx=this.x+this.w/2, cy=this.y+this.h/2;
        const ang=Math.atan2(player.y+14-cy,player.x+14-cx);
        const spd=this.phase>=3?2.4:this.phase>=2?2.0:1.7;
        const shot=new Projectile(cx,cy,Math.cos(ang)*spd,Math.sin(ang)*spd);
        shot.life=1.1; // short range
        this.projectiles.push(shot);
        if(this.phase>=2&&d<90){
          const s2=new Projectile(cx,cy,Math.cos(ang+0.2)*spd*0.9,Math.sin(ang+0.2)*spd*0.9); s2.life=1.0;
          const s3=new Projectile(cx,cy,Math.cos(ang-0.2)*spd*0.9,Math.sin(ang-0.2)*spd*0.9); s3.life=1.0;
          this.projectiles.push(s2,s3);
        }
        this.attackCooldown=this.phase>=3?900:this.phase>=2?1100:1300;
        particles.emit(cx,cy,'impact',5);
      }
    } else {
      // chase only when reasonably close, stay in arena
      if(d>40&&d<this.engageRange){
        const dx=player.x-this.x;
        this.x+=Math.sign(dx)*(this.phase>=2?1.2:0.9);
      }
      if(this.attackCooldown<=0&&rectOverlap(this.hitbox,player.hitbox)){
        player.takeDamage(this.phase>=2?24:18,'purple',this.x+this.w/2); this.attackCooldown=700;
      }
    }

    this.clampToArena();

    for(const p of this.projectiles){
      p.update(dt);
      if(p.life>0&&rectOverlap(p.hitbox,player.hitbox)){
        player.takeDamage(this.phase>=2?14:10,'purple',this.x+this.w/2);
        p.life=0;
        particles.emit(p.x,p.y,'impact',4);
      }
    }
    this.projectiles=this.projectiles.filter(p=>p.life>0);
  }
  takeDamage(amount){if(!this.alive)return;this.hp-=amount;if(this.hp<=0){this.hp=0;this.alive=false;this.projectiles=[]}}
  draw(ctx,cam){
    for(const p of this.projectiles)p.draw(ctx,cam);
    if(!this.alive)return;
    const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y);
    // pull aura
    if(this.mode==='pull'&&this.pullActive){
      ctx.strokeStyle='rgba(192,96,224,0.35)';
      ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(px+this.w/2,py+this.h/2,40+Math.sin(this.timer*6)*8,0,Math.PI*2);ctx.stroke();
    }
    const img=this.assets.get('enemies_boss_png')||this.assets.get('enemies_boss_tall_png');
    ctx.save();
    if(this.facing<0){ctx.translate(px+this.w,0);ctx.scale(-1,1);ctx.translate(-px,0)}
    if(img){ctx.imageSmoothingEnabled=false;ctx.drawImage(img,px,py,this.w,this.h)}
    else{ctx.fillStyle='#2a1830';ctx.fillRect(px,py,this.w,this.h);ctx.fillStyle=C.magicPurple;ctx.fillRect(px+20,py+20,40,50)}
    ctx.restore();
    // HP
    const bw=100;
    ctx.fillStyle='#1a1420';ctx.fillRect(px-10,py-14,bw,7);
    ctx.fillStyle=this.phase>=3?C.roseIntense:C.magicPurple;
    ctx.fillRect(px-10,py-14,bw*(this.hp/this.maxHp),7);
    ctx.fillStyle=C.light;ctx.font='9px Georgia';ctx.fillText('Costureira Vazia',px-10,py-18);
  }
}
