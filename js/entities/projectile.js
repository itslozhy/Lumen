class Projectile {
  constructor(x,y,vx,vy){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.life=1.2;this.r=5}
  get hitbox(){return{x:this.x-this.r,y:this.y-this.r,w:this.r*2,h:this.r*2}}
  update(dt){this.x+=this.vx;this.y+=this.vy;this.life-=dt}
  draw(ctx,cam){
    const px=Math.floor(this.x-cam.x),py=Math.floor(this.y-cam.y);
    ctx.fillStyle=C.magicPurple;
    ctx.beginPath();ctx.arc(px,py,this.r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=C.roseIntense;
    ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();
  }
}
