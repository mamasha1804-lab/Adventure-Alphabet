(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
if(!stage||!hotspots||!img)return;

const BASE='/Adventure-Alphabet/';
const AF_RAW='https://raw.githubusercontent.com/mamasha1804-lab/Adventure-Alphabet/main/assets/selector-AF.webp?v=20260823-af-raw-2';
const PAGES=[
 {key:'AF',label:'A–F',letters:[['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]]},
 {key:'GM',label:'G–M',letters:[['G',.112,.395,.185,.245],['H',.305,.395,.185,.245],['I',.497,.395,.175,.245],['J',.678,.395,.175,.245],['K',.112,.655,.215,.225],['L',.335,.655,.205,.225],['M',.545,.655,.195,.225]]},
 {key:'NS',label:'N–S',letters:[['N',.140,.395,.225,.235],['O',.375,.395,.210,.235],['P',.590,.395,.210,.235],['Q',.105,.655,.220,.225],['R',.330,.655,.205,.225],['S',.535,.655,.205,.225]]},
 {key:'TZ',label:'T–Z',letters:[['T',.120,.395,.175,.245],['U',.300,.395,.175,.245],['V',.480,.395,.175,.245],['W',.660,.395,.175,.245],['X',.120,.655,.185,.225],['Y',.305,.655,.185,.225],['Z',.495,.655,.185,.225]]}
];

const HQ={
 GM:{dir:'assets/hq40',parts:['GM.00','GM.01','GM.02'],mime:'image/avif'},
 NS:{dir:'assets/hq35',parts:['NS.00','NS.01','NS.02','NS.03','NS.04','NS.05','NS.06'],mime:'image/avif'},
 TZ:{dir:'assets/hq70',parts:['TZ.00','TZ.01','TZ.02','TZ.03'],mime:'image/avif'}
};
const cache={};
let renderToken=0;
function asset(path){return BASE+path.replace(/^\/+/, '');}
function fallbackSrc(key){
 if(key==='AF') return AF_RAW;
 return asset(`assets/selector-${key}.webp?v=20260823-direct-2`);
}
async function assembledBlobSource(key){
 const spec=HQ[key];
 if(!spec)throw new Error('No HQ source');
 if(cache[key])return cache[key];
 const chunks=[];
 for(const part of spec.parts){
  const response=await fetch(asset(`${spec.dir}/${part}?v=20260823-direct-2`),{cache:'no-store'});
  if(!response.ok)throw new Error(`${part}: ${response.status}`);
  chunks.push(await response.text());
 }
 const b64=chunks.join('').replace(/\s+/g,'');
 if(b64.length<30000)throw new Error('HQ asset incomplete');
 const binary=atob(b64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 const url=URL.createObjectURL(new Blob([bytes],{type:spec.mime||'image/avif'}));
 cache[key]=url;
 return url;
}
function addHotspot(action,x,y,w,h,label,extra=''){
 const b=document.createElement('button');
 b.className='mock-hotspot '+extra;
 b.setAttribute('aria-label',label);
 Object.assign(b.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});
 b.onclick=action;hotspots.appendChild(b);
}
function drawHotspots(def){
 hotspots.innerHTML='';
 def.letters.forEach(([l,x,y,w,h])=>addHotspot(()=>openLetter(l),x,y,w,h,`Открыть букву ${l}`,'letter-hit'));
 addHotspot(()=>document.getElementById('teacherBtn')?.click(),.018,.905,.185,.075,'Для учителей','utility-hit');
 addHotspot(()=>document.getElementById('achievementsBtn')?.click(),.790,.905,.190,.075,'Достижения','utility-hit');
}
async function renderExactSelector(){
 const token=++renderToken,def=PAGES[page]||PAGES[0];
 selectorScreen.classList.add('mockup-mode');
 stage.classList.remove('hidden','is-loading');
 drawHotspots(def);
 img.alt=`Учимся с Ларисой Коротаевой — выбор букв ${def.label}`;
 img.style.opacity='1';
 const fallback=fallbackSrc(def.key);
 img.onload=()=>stage.classList.remove('is-loading');
 img.onerror=()=>{stage.classList.remove('is-loading');console.error('Selector image failed',fallback);};
 img.src=fallback;
 if(def.key==='AF')return;
 try{
  const hq=await assembledBlobSource(def.key);
  if(token!==renderToken)return;
  const probe=new Image();
  probe.onload=()=>{if(token!==renderToken)return;img.src=hq;};
  probe.onerror=()=>console.warn('HQ decode failed, fallback stays visible',def.key);
  probe.src=hq;
 }catch(e){console.warn('HQ unavailable, fallback stays visible',def.key,e);}
}
renderSelector=renderExactSelector;
for(const [id,delta] of [['mockPrev',3],['mockNext',1],['prevSelector',3],['nextSelector',1]]){
 const el=document.getElementById(id);if(el)el.onclick=()=>{page=(page+delta)%4;renderSelector()};
}
const back=document.getElementById('backToSelector'),oldBack=back?.onclick;
if(back)back.onclick=()=>{if(typeof currentLetter==='string'){const idx=GROUPS.findIndex(g=>g.includes(currentLetter));if(idx>=0)page=idx;}if(oldBack)oldBack();requestAnimationFrame(renderSelector);};
document.addEventListener('keydown',e=>{if(!letterScreen.classList.contains('hidden'))return;if(e.key==='ArrowLeft'){page=(page+3)%4;renderSelector();}if(e.key==='ArrowRight'){page=(page+1)%4;renderSelector();}});
renderSelector();
})();