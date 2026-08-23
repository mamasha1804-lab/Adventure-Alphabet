(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
if(!stage||!hotspots||!img)return;
const PAGES=[
 {key:'AF',label:'A–F',letters:[['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]]},
 {key:'GM',label:'G–M',letters:[['G',.112,.395,.185,.245],['H',.305,.395,.185,.245],['I',.497,.395,.175,.245],['J',.678,.395,.175,.245],['K',.112,.655,.215,.225],['L',.335,.655,.205,.225],['M',.545,.655,.195,.225]]},
 {key:'NS',label:'N–S',letters:[['N',.140,.395,.225,.235],['O',.375,.395,.210,.235],['P',.590,.395,.210,.235],['Q',.105,.655,.220,.225],['R',.330,.655,.205,.225],['S',.535,.655,.205,.225]]},
 {key:'TZ',label:'T–Z',letters:[['T',.120,.395,.175,.245],['U',.300,.395,.175,.245],['V',.480,.395,.175,.245],['W',.660,.395,.175,.245],['X',.120,.655,.185,.225],['Y',.305,.655,.185,.225],['Z',.495,.655,.185,.225]]}
];
const HQ={
 AF:{dir:'assets/hq40',parts:['AF.00','AF.01','AF.02','AF.03'],mime:'image/avif'},
 GM:{dir:'assets/hq40',parts:['GM.00','GM.01','GM.02'],mime:'image/avif'},
 NS:{dir:'assets/hq35',parts:['NS.00','NS.01','NS.02','NS.03','NS.04','NS.05','NS.06'],mime:'image/avif'},
 TZ:{dir:'assets/hq70',parts:['TZ.00','TZ.01','TZ.02','TZ.03'],mime:'image/avif'}
};
const cache={};let renderToken=0;
async function assembledSource(key){
 if(cache[key])return cache[key];
 const spec=HQ[key];
 if(!spec)return cache[key]=`assets/selector-${key}.webp?v=20260823-final-fallback`;
 try{
  const chunks=await Promise.all(spec.parts.map(p=>fetch(`${spec.dir}/${p}?v=20260823-final-hq`).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()})));
  const b64=chunks.join('').replace(/\s+/g,'');
  if(b64.length<30000)throw new Error('HQ asset incomplete');
  return cache[key]=`data:${spec.mime||'image/avif'};base64,${b64}`;
 }catch(e){console.warn('HQ selector fallback',key,e);return cache[key]=`assets/selector-${key}.webp?v=20260823-final-fallback`}
}
function addHotspot(action,x,y,w,h,label,extra=''){const b=document.createElement('button');b.className='mock-hotspot '+extra;b.setAttribute('aria-label',label);Object.assign(b.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});b.onclick=action;hotspots.appendChild(b)}
function drawHotspots(def){hotspots.innerHTML='';def.letters.forEach(([l,x,y,w,h])=>addHotspot(()=>openLetter(l),x,y,w,h,`Открыть букву ${l}`,'letter-hit'));addHotspot(()=>document.getElementById('teacherBtn')?.click(),.018,.905,.185,.075,'Для учителей','utility-hit');addHotspot(()=>document.getElementById('achievementsBtn')?.click(),.790,.905,.190,.075,'Достижения','utility-hit')}
async function renderExactSelector(){const token=++renderToken,def=PAGES[page]||PAGES[0];selectorScreen.classList.add('mockup-mode');stage.classList.remove('hidden');stage.classList.add('is-loading');img.style.opacity='0';img.alt=`Учимся с Ларисой Коротаевой — выбор букв ${def.label}`;drawHotspots(def);const src=await assembledSource(def.key);if(token!==renderToken)return;img.onload=()=>{stage.classList.remove('is-loading');img.style.opacity='1'};img.onerror=()=>{stage.classList.remove('is-loading');img.src=`assets/selector-${def.key}.webp?v=20260823-last-resort`;img.style.opacity='1'};img.src=src;if(img.complete&&img.naturalWidth){stage.classList.remove('is-loading');img.style.opacity='1'}}
renderSelector=renderExactSelector;
for(const [id,delta] of [['mockPrev',3],['mockNext',1],['prevSelector',3],['nextSelector',1]]){const el=document.getElementById(id);if(el)el.onclick=()=>{page=(page+delta)%4;renderSelector()}}
const back=document.getElementById('backToSelector'),oldBack=back?.onclick;if(back)back.onclick=()=>{if(typeof currentLetter==='string'){const idx=GROUPS.findIndex(g=>g.includes(currentLetter));if(idx>=0)page=idx}if(oldBack)oldBack();requestAnimationFrame(renderSelector)};
document.addEventListener('keydown',e=>{if(!letterScreen.classList.contains('hidden'))return;if(e.key==='ArrowLeft'){page=(page+3)%4;renderSelector()}if(e.key==='ArrowRight'){page=(page+1)%4;renderSelector()}});
renderSelector();
})();