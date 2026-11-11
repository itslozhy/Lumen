/* ===== SEM BAÚS VAZIOS ===== */
(function(){
const _bi=buildInteractives;
buildInteractives=function(){return _bi().filter(i=>!(i.type==='cabinet'&&window.cabHash(i.id)>=.58))};
})();
