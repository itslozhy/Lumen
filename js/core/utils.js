const C = CONFIG.COLORS;
const T = CONFIG.TILE;
const UPR=24,DNR=96;const WORLD_W = 220, WORLD_H = 72+UPR+DNR;

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function rectOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function dist(ax,ay,bx,by){return Math.hypot(bx-ax,by-ay)}
