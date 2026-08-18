(()=>{const $=id=>document.getElementById(id);const teacherModal=$('teacherModal');if(!teacherModal)return;
$('teacherBtn').onclick=()=>teacherModal.classList.remove('hidden');
$('closeTeacher').onclick=()=>teacherModal.classList.add('hidden');
teacherModal.onclick=e=>{if(e.target===teacherModal)teacherModal.classList.add('hidden')};
$('randomLetterBtn').onclick=()=>{teacherModal.classList.add('hidden');const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';const l=alphabet[Math.floor(Math.random()*alphabet.length)];if(typeof openLetter==='function')openLetter(l)};
$('alphabetStartBtn').onclick=()=>{teacherModal.classList.add('hidden');if(typeof page!=='undefined')page=0;if(typeof renderSelector==='function')renderSelector();$('letterScreen').classList.add('hidden');$('selectorScreen').classList.remove('hidden');$('gamesSection').scrollIntoView({behavior:'smooth'})};
$('showProgressBtn').onclick=()=>{teacherModal.classList.add('hidden');$('achievementsBtn').click()};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){teacherModal.classList.add('hidden');const pm=$('progressModal');if(pm)pm.classList.add('hidden');return}if(!$('selectorScreen').classList.contains('hidden')&&!e.altKey&&!e.ctrlKey&&!e.metaKey){if(e.key==='ArrowRight')$('nextSelector').click();if(e.key==='ArrowLeft')$('prevSelector').click()}});
})();