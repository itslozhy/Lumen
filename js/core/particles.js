class Particles {
  constructor(){this.list=[]; this.cap=180}
  emit(x,y,type,count=8){
    for(let i=0;i<count;i++){
      if(this.list.length>=this.cap) break;
      const a=Math.random()*Math.PI*2,s=0.4+Math.random()*2.2;
      let color=C.magicPurple, grav=0.08, life=0.4+Math.random()*0.5, size=1+Math.random()*2.5;
      let vx=Math.cos(a)*s, vy=Math.sin(a)*s-1;
      if(type==='black')color='#1a1420';
      if(type==='impact')color=Math.random()>0.5?C.roseIntense:C.magicPurple;
      if(type==='pull')color='#c060e0';
      if(type==='dust'){color=Math.random()>0.5?'#6B5A6A':'#8A7A8A'; vx=(Math.random()-0.5)*0.4; vy=-0.15-Math.random()*0.3; grav=0.01; life=2+Math.random()*3; size=1+Math.random()*1.5}
      if(type==='paper'){color=Math.random()>0.5?'#C9B9B9':'#A76E7F'; vx=(Math.random()-0.5)*0.8; vy=-0.2-Math.random()*0.4; grav=0.02; life=3+Math.random()*4; size=2+Math.random()*2}
      if(type==='spore'){color='#7E35B8'; vx=(Math.random()-0.5)*0.5; vy=-0.3-Math.random()*0.5; grav=0.005; life=2.5+Math.random()*2; size=1.5+Math.random()}
      if(type==='ember'){color=Math.random()>0.5?C.roseIntense:'#e8a070'; vx=(Math.random()-0.5)*0.6; vy=-0.5-Math.random()*0.8; grav=-0.01; life=1.5+Math.random()*2; size=1+Math.random()*1.5}
      this.list.push({x,y,vx,vy,life,maxLife:life,size,color,grav,type});
    }
  }
  update(dt){
    for(let i=this.list.length-1;i>=0;i--){
      const p=this.list[i];
      p.x+=p.vx; p.y+=p.vy; p.vy+=(p.grav!=null?p.grav:0.08);
      if(p.type==='paper') p.vx+=Math.sin(p.life*3)*0.02;
      p.life-=dt;
      if(p.life<=0) this.list.splice(i,1);
    }
  }
  draw(ctx,cam){
    for(const p of this.list){
      ctx.globalAlpha=clamp(p.life/p.maxLife,0,1)*0.9;
      ctx.fillStyle=p.color;
      if(p.type==='paper'){
        ctx.save();
        ctx.translate(Math.floor(p.x-cam.x), Math.floor(p.y-cam.y));
        ctx.rotate(p.life);
        ctx.fillRect(-p.size/2,-1,p.size,1.5);
        ctx.restore();
      } else {
        ctx.fillRect(Math.floor(p.x-cam.x), Math.floor(p.y-cam.y), p.size, p.size);
      }
    }
    ctx.globalAlpha=1;
  }
}
