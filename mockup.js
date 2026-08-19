(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
if(!stage||!hotspots||!img)return;

const PAGES=[
 {key:'AF',label:'A–F',letters:[
  ['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],
  ['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]
 ]},
 {key:'GM',label:'G–M',letters:[
  ['G',.112,.395,.185,.245],['H',.305,.395,.185,.245],['I',.497,.395,.175,.245],['J',.678,.395,.175,.245],
  ['K',.112,.655,.215,.225],['L',.335,.655,.205,.225],['M',.545,.655,.195,.225]
 ]},
 {key:'NS',label:'N–S',letters:[
  ['N',.140,.395,.225,.235],['O',.375,.395,.210,.235],['P',.590,.395,.210,.235],
  ['Q',.105,.655,.220,.225],['R',.330,.655,.205,.225],['S',.535,.655,.205,.225]
 ]},
 {key:'TZ',label:'T–Z',letters:[
  ['T',.120,.395,.175,.245],['U',.300,.395,.175,.245],['V',.480,.395,.175,.245],['W',.660,.395,.175,.245],
  ['X',.120,.655,.185,.225],['Y',.305,.655,.185,.225],['Z',.495,.655,.185,.225]
 ]}
];
const imageCache={};
let renderToken=0;

async function imageFor(key){
 if(imageCache[key]) return imageCache[key];
 const parts=await Promise.all([0,1,2].map(i=>fetch(`assets/b64v2/${key}.${String(i).padStart(2,'0')}`,{cache:'force-cache'}).then(r=>{
   if(!r.ok) throw new Error(`Не загружен ${key}.${i}`);
   return r.text();
 })));
 return imageCache[key]='data:image/webp;base64,'+parts.join('').replace(/\s+/g,'');
}

function addHotspot(action,x,y,w,h,label,extra=''){
 const b=document.createElement('button');
 b.className='mock-hotspot '+extra;
 b.setAttribute('aria-label',label);
 b.style.left=x*100+'%';b.style.top=y*100+'%';b.style.width=w*100+'%';b.style.height=h*100+'%';
 b.onclick=action;
 hotspots.appendChild(b);
}

function drawHotspots(def){
 hotspots.innerHTML='';
 def.letters.forEach(([l,x,y,w,h])=>addHotspot(()=>openLetter(l),x,y,w,h,`Открыть букву ${l}`,'letter-hit'));
 // Нижние кнопки макета.
 addHotspot(()=>document.getElementById('teacherBtn')?.click(),.018,.905,.185,.075,'Для учителей','utility-hit');
 addHotspot(()=>document.getElementById('achievementsBtn')?.click(),.790,.905,.190,.075,'Достижения','utility-hit');
 // Верхнее меню на самом изображении.
 addHotspot(()=>{},.375,.035,.095,.060,'Главная','menu-hit');
 addHotspot(()=>{},.485,.035,.075,.060,'Игры','menu-hit');
 addHotspot(()=>document.getElementById('aboutSection')?.scrollIntoView({behavior:'smooth'}),.565,.035,.095,.060,'Обо мне','menu-hit');
 addHotspot(()=>document.getElementById('contactsSection')?.scrollIntoView({behavior:'smooth'}),.650,.035,.095,.060,'Контакты','menu-hit');
}

async function renderExactSelector(){
 const token=++renderToken;
 const def=PAGES[page]||PAGES[0];
 selectorScreen.classList.add('mockup-mode');
 stage.classList.remove('hidden');
 stage.classList.add('is-loading');
 img.style.opacity='0';
 img.alt=`Учимся с Ларисой Коротаевой — выбор букв ${def.label}`;
 drawHotspots(def);
 try{
   const src=await imageFor(def.key);
   if(token!==renderToken)return;
   img.onload=()=>{stage.classList.remove('is-loading');img.style.opacity='1'};
   img.src=src;
   if(img.complete){stage.classList.remove('is-loading');img.style.opacity='1'}
 }catch(err){
   console.error(err);
   stage.classList.remove('is-loading');
   img.style.opacity='0';
 }
}

renderSelector=function(){renderExactSelector()};

document.getElementById('mockPrev').onclick=()=>{page=(page+3)%4;renderSelector()};
document.getElementById('mockNext').onclick=()=>{page=(page+1)%4;renderSelector()};
// Старые стрелки остаются синхронизированы, даже если скрыты визуальным макетом.
document.getElementById('prevSelector').onclick=()=>{page=(page+3)%4;renderSelector()};
document.getElementById('nextSelector').onclick=()=>{page=(page+1)%4;renderSelector()};

// Возврат из игры всегда показывает ту группу, где находится текущая буква.
const oldBack=document.getElementById('backToSelector').onclick;
document.getElementById('backToSelector').onclick=()=>{
 if(typeof currentLetter==='string'){
   const idx=GROUPS.findIndex(g=>g.includes(currentLetter));
   if(idx>=0)page=idx;
 }
 if(oldBack)oldBack();
 requestAnimationFrame(renderSelector);
};

renderSelector();
})();
