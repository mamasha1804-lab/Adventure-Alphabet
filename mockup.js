(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
const prevBtn=document.getElementById('mockPrev');
const nextBtn=document.getElementById('mockNext');
if(!stage||!hotspots||!img)return;
const BASE='/Adventure-Alphabet/';
const PAGES=[
 {key:'AF',label:'A–F',file:'ChatGPT Image 24 авг. 2026 г., 10_56_52.png',letters:[['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]]},
 {key:'GM',label:'G–M',file:'ChatGPT Image 18 авг. 2026 г., 21_59_00.png',letters:[['G',.112,.395,.185,.245],['H',.305,.395,.185,.245],['I',.497,.395,.175,.245],['J',.678,.395,.175,.245],['K',.112,.655,.215,.225],['L',.335,.655,.205,.225],['M',.545,.655,.195,.225]]},
 {key:'NS',label:'N–S',file:'ChatGPT Image 18 авг. 2026 г., 21_59_32.png',letters:[['N',.140,.395,.225,.235],['O',.375,.395,.210,.235],['P',.590,.395,.210,.235],['Q',.105,.655,.220,.225],['R',.330,.655,.205,.225],['S',.535,.655,.205,.225]]},
 {key:'TZ',label:'T–Z',file:'ChatGPT Image 18 авг. 2026 г., 21_59_51.png',letters:[['T',.120,.395,.175,.245],['U',.300,.395,.175,.245],['V',.480,.395,.175,.245],['W',.660,.395,.175,.245],['X',.120,.655,.185,.225],['Y',.305,.655,.185,.225],['Z',.495,.655,.185,.225]]}
];
let activeIndex=0;
try{if(Number.isInteger(page))activeIndex=((page%4)+4)%4;}catch(e){}
function assetFile(name){return BASE+'assets/'+encodeURIComponent(name)+'?v=20260824-navfix';}
function syncPage(){try{page=activeIndex;}catch(e){}}
function addHotspot(action,x,y,w,h,label,extra=''){const b=document.createElement('button');b.type='button';b.className='mock-hotspot '+extra;b.setAttribute('aria-label',label);Object.assign(b.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();action();});hotspots.appendChild(b);}
function drawHotspots(def){hotspots.innerHTML='';def.letters.forEach(([l,x,y,w,h])=>addHotspot(()=>openLetter(l),x,y,w,h,`Открыть букву ${l}`,'letter-hit'));addHotspot(()=>document.getElementById('teacherBtn')?.click(),.018,.905,.185,.075,'Для учителей','utility-hit');addHotspot(()=>document.getElementById('achievementsBtn')?.click(),.790,.905,.190,.075,'Достижения','utility-hit');}
function renderExactSelector(){const def=PAGES[activeIndex];syncPage();selectorScreen.classList.add('mockup-mode');stage.classList.remove('hidden','is-loading');drawHotspots(def);img.alt=`Учимся с Ларисой Коротаевой — выбор букв ${def.label}`;img.style.opacity='1';img.src=assetFile(def.file);const indicator=document.getElementById('selectorIndicator');if(indicator)indicator.textContent=`${def.label} · ${activeIndex+1} / 4`;}
function move(delta){activeIndex=(activeIndex+delta+PAGES.length)%PAGES.length;renderExactSelector();}
try{renderSelector=renderExactSelector;}catch(e){}
if(prevBtn){prevBtn.onclick=null;prevBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();move(-1);});}
if(nextBtn){nextBtn.onclick=null;nextBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();move(1);});}
for(const [id,delta] of [['prevSelector',-1],['nextSelector',1]]){const el=document.getElementById(id);if(el){el.onclick=null;el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();move(delta);});}}
const back=document.getElementById('backToSelector');if(back){const oldBack=back.onclick;back.onclick=null;back.addEventListener('click',()=>{try{const idx=GROUPS.findIndex(g=>g.includes(currentLetter));if(idx>=0)activeIndex=idx;}catch(e){}if(typeof oldBack==='function')oldBack();requestAnimationFrame(renderExactSelector);});}
document.addEventListener('keydown',e=>{if(!letterScreen.classList.contains('hidden'))return;if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
renderExactSelector();
})();