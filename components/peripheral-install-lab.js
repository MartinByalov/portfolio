// Interactive Peripheral Installation Lab - IT 8, lesson 2.6
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

export function render(comp){
 const id=comp.id||'peripheral-install-lab';
 const cards=(comp.devices||[]).map((d,i)=>`<button type="button" class="pil-device" data-index="${i}" aria-pressed="false"><i aria-hidden="true" class="${esc(d.icon||'fa-solid fa-plug')}"></i><span>${esc(d.name)}</span></button>`).join('');
 return `<section id="${esc(id)}" class="component pil-card">
 <h3>${esc(comp.title)}</h3><p class="pil-desc">${esc(comp.description)}</p>
 <div class="pil-devices" aria-label="Избор на устройство">${cards}</div><div class="pil-stage"><div class="pil-progress" aria-label="Напредък"><span>1. Порт</span><span>2. PnP</span><span>3. Драйвер</span><span>4. Проверка</span></div>
 <div class="pil-question"></div><div class="pil-options"></div><div class="pil-feedback" aria-live="polite"></div><button type="button" class="pil-reset">Нов сценарий</button></div></section>`;
}

export function init(comp){
 const root=document.getElementById(comp.id||'peripheral-install-lab'); if(!root)return;
 const devices=comp.devices||[],cards=[...root.querySelectorAll('.pil-device')],stage=root.querySelector('.pil-stage'),q=root.querySelector('.pil-question'),opts=root.querySelector('.pil-options'),fb=root.querySelector('.pil-feedback'),prog=[...root.querySelectorAll('.pil-progress span')],reset=root.querySelector('.pil-reset');
 let device=null,step=0;
 function feedback(ok,text){fb.className='pil-feedback '+(ok?'ok':'bad');fb.innerHTML=(ok?'<i class="fa-solid fa-circle-check"></i> ':'<i class="fa-solid fa-circle-xmark"></i> ')+text;}
  function ask(text,choices,correct,success){q.textContent=text;opts.innerHTML='';fb.className='pil-feedback';choices.forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='pil-option';b.textContent=choice;b.onclick=()=>{if(choice!==correct){feedback(false,'Това действие не е подходящо. Проверете последователността и опитайте отново.');return;}feedback(true,success);[...opts.children].forEach(x=>x.disabled=true);setTimeout(()=>{step++;renderStep();},600);};opts.appendChild(b);});}
 function renderStep(){prog.forEach((p,i)=>p.classList.toggle('on',i<=Math.min(step,3)));reset.style.display='none';
  if(step===0)ask(`Към кой порт е най-подходящо да свържете: ${device.name}?`,['USB / USB-C','HDMI / DisplayPort','RJ-45','3.5 mm аудио жак'],device.port,'Избран е подходящият физически порт.');
  else if(step===1)ask('Какво е правилното следващо действие след физическото свързване?',['Изключваме компютъра веднага','Изчакваме операционната система да разпознае устройството','Сваляме произволен драйвер от интернет'],'Изчакваме операционната система да разпознае устройството','Windows използва Plug and Play, за да идентифицира и конфигурира устройството.');
  else if(step===2){const correct=device.needsDriver?'При нужда използваме драйвер от официалния сайт на производителя':'Проверяваме дали устройството вече работи с автоматично заредения драйвер';ask(device.needsDriver?'Устройството е разпознато, но част от функциите липсват. Как действаме?':'Устройството е разпознато автоматично. Как действаме?',['При нужда използваме драйвер от официалния сайт на производителя','Проверяваме дали устройството вече работи с автоматично заредения драйвер','Инсталираме първия намерен пакет от неофициален сайт'],correct,device.needsDriver?'Използваме официалния драйвер за пълна функционалност.':'Не е нужен допълнителен драйвер, ако устройството работи правилно.');}
  else if(step===3)ask('Къде проверяваме състоянието на хардуера и драйвера в Windows?',['Device Manager','Calculator','Recycle Bin'],'Device Manager','Device Manager показва устройствата, състоянието им и информация за драйвера.');
  else{q.textContent='Сценарият е завършен.';opts.innerHTML='';feedback(true,`Успешно: ${device.name} → порт → Plug and Play → драйвер → проверка.`);reset.style.display='inline-flex';}}
  cards.forEach((c,i)=>c.onclick=()=>{cards.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');});c.classList.add('active');c.setAttribute('aria-pressed','true');device=devices[i];step=0;stage.classList.add('show');renderStep();});
  reset.onclick=()=>{cards.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');});stage.classList.remove('show');device=null;step=0;};
}
