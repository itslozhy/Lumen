const canvas=document.getElementById('game-canvas');
const loading=document.getElementById('loading-screen');
const fill=document.getElementById('loading-fill');
const loadingText=document.getElementById('loading-text');
async function boot(){
  const steps=['Parkour...','Muros e plataformas...','Pronto'];
  for(let i=0;i<steps.length;i++){loadingText.textContent=steps[i];fill.style.width=((i+1)/steps.length*100)+'%';await new Promise(r=>setTimeout(r,90))}
  const game=new Game(canvas); game.start();
  const wait=setInterval(()=>{if(game.state!=='loading'){clearInterval(wait);loading.classList.add('hidden');setTimeout(()=>loading.style.display='none',500)}},80);
}
boot().catch(e=>{console.error(e);loadingText.textContent='Erro.';});
