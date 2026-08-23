(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
if(!stage||!hotspots||!img)return;

const BASE='/Adventure-Alphabet/';
const PAGES=[
 {key:'AF',label:'A–F',letters:[['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]]},
 {key:'GM',label:'G–M',letters:[['G',.112,.395,.185,.245],['H',.305,.395,.185,.245],['I',.497,.395,.175,.245],['J',.678,.395,.175,.245],['K',.112,.655,.215,.225],['L',.335,.655,.205,.225],['M',.545,.655,.195,.225]]},
 {key:'NS',label:'N–S',letters:[['N',.140,.395,.225,.235],['O',.375,.395,.210,.235],['P',.590,.395,.210,.235],['Q',.105,.655,.220,.225],['R',.330,.655,.205,.225],['S',.535,.655,.205,.225]]},
 {key:'TZ',label:'T–Z',letters:[['T',.120,.395,.175,.245],['U',.300,.395,.175,.245],['V',.480,.395,.175,.245],['W',.660,.395,.175,.245],['X',.120,.655,.185,.225],['Y',.305,.655,.185,.225],['Z',.495,.655,.185,.225]]}
];

function asset(path){return BASE+path.replace(/^\/+/, '');}
function fallbackSrc(key){
 if(key==='AF') return asset('assets/selector-AF.jpg?v=20260823-af-jpg-1');
 return asset(`assets/selector-${key}.webp?v=20260823-direct-2`);
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
function renderExactSelector(){
 const def=PAGES[page]||PAGES[0];
 selectorScreen.classList.add('mockup-mode');
 stage.classList.remove('hidden','is-loading');
 drawHotspots(def);
 img.alt=`Учимся с Ларисой Коротаевой — выбор букв ${def.label}`;
 img.style.opacity='1';
 img.src=fallbackSrc(def.key);
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
