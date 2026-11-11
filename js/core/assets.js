class Assets {
  constructor(){this.images={};this.ready=false}
  async load(){
    await Promise.all(Object.entries(ASSET_DATA).map(([k,src])=>new Promise(res=>{
      const img=new Image();
      img.onload=()=>{this.images[k]=img;res()};
      img.onerror=()=>res();
      img.src=src;
    })));
    this.ready=true;
  }
  get(k){return this.images[k]||null}
}
