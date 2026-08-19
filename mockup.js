(()=>{
const stage=document.getElementById('mockupStage');
const hotspots=document.getElementById('mockupHotspots');
const img=document.getElementById('mockupImage');
if(!stage||!hotspots||!img)return;
const originalRender=renderSelector;
const AF=[
 ['A',.14,.405,.225,.245],['B',.375,.405,.205,.245],['C',.59,.405,.21,.245],
 ['D',.105,.655,.22,.235],['E',.335,.655,.195,.235],['F',.54,.655,.195,.235]
];
function drawHotspots(){
  hotspots.innerHTML='';
  AF.forEach(([l,x,y,w,h])=>{
    const b=document.createElement('button');
    b.className='mock-hotspot';
    b.setAttribute('aria-label',`Открыть букву ${l}`);
    b.style.left=x*100+'%';b.style.top=y*100+'%';b.style.width=w*100+'%';b.style.height=h*100+'%';
    b.onclick=()=>openLetter(l);
    hotspots.appendChild(b);
  });
}
renderSelector=function(){
  if(page===0){
    selectorScreen.classList.add('mockup-mode');
    stage.classList.remove('hidden');
    img.src='assets/selector-AF.webp';
    drawHotspots();
  }else{
    selectorScreen.classList.remove('mockup-mode');
    stage.classList.add('hidden');
    originalRender();
  }
};
document.getElementById('mockPrev').onclick=()=>{page=(page+3)%4;renderSelector()};
document.getElementById('mockNext').onclick=()=>{page=(page+1)%4;renderSelector()};
renderSelector();
})();
