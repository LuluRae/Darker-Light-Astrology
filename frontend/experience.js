(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const guide=`<svg class="guide-svg" viewBox="0 0 120 180" aria-hidden="true"><g class="guide-ear"><path d="M48 66Q20 25 38 6Q58 33 56 61" fill="#e8dfcb"/><path d="M63 62Q61 29 83 8Q94 39 75 70" fill="#e8dfcb"/><path d="M44 26L49 51M78 28L70 53" stroke="#bfa9a4" stroke-width="5" stroke-linecap="round"/></g><ellipse cx="60" cy="100" rx="28" ry="43" fill="#e8dfcb"/><circle cx="31" cy="121" r="12" fill="#f6efdf"/><path d="M38 88L59 100L80 87L88 137L61 129L35 140Z" fill="#352238" stroke="#caab69"/><path d="M46 137L37 165M72 138L83 164" stroke="#e8dfcb" stroke-width="10" stroke-linecap="round"/><path d="M37 166L24 169M84 166L98 170" stroke="#b8a18b" stroke-width="8" stroke-linecap="round"/><ellipse cx="61" cy="73" rx="21" ry="24" fill="#e8dfcb"/><circle cx="72" cy="72" r="2.5" fill="#231923"/><path d="M78 81L83 80L79 85" fill="#ab8585"/><path d="M51 96L65 92L66 101Z" fill="#caab69"/><path d="M76 108Q94 101 88 126" stroke="#caab69" fill="none"/><g class="guide-watch"><circle cx="88" cy="131" r="10" fill="#251a2c" stroke="#e3bc68" stroke-width="2"/><path d="M88 125V131L93 134" stroke="#e3bc68" fill="none"/></g></svg>`;
  // One guide appears in the invitation and follows the visitor into the chart world.
  document.querySelector('.hero').insertAdjacentHTML('beforeend',`<div class="threshold"><div class="threshold-hole"></div>${guide}<span class="threshold-caption">“There you are. I was beginning to wonder.”</span></div>`);
  document.querySelector('header').insertAdjacentHTML('beforeend','<button type="button" id="motionToggle" class="motion-button" aria-pressed="false">Pause motion</button>');
  document.querySelector('header > .eyebrow').remove();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  function setMotion(){document.body.classList.toggle('motion-paused',paused);$('motionToggle').setAttribute('aria-pressed',String(paused));$('motionToggle').textContent=paused?'Motion paused':'Pause motion'}
  setMotion();$('motionToggle').onclick=()=>{paused=!paused;setMotion()};
  reduced.addEventListener('change',()=>{paused=reduced.matches;setMotion()});
  const scene=`<div class="scene-topline"><p id="sceneCaption">The rabbit has found your sky.</p><span class="scene-counter" id="sceneCounter">01 / 05 · WHAT</span></div><div class="world" id="world" data-stage="0" role="group" aria-label="Animated Rabbit Hole scene"><div class="scene-stars" aria-hidden="true"></div><div class="rings" aria-hidden="true"><i></i></div><div class="scene-emblem" id="sceneEmblem" aria-hidden="true">☉</div><div class="scene-orbit-label" id="scenePlacement"></div><div class="scene-doors" id="sceneDoors" aria-label="Explore the twelve houses"></div><div class="scene-dust" aria-hidden="true"></div><div class="scene-guide">${guide}<span class="guide-speech" id="guideSpeech">“Start with a little light.”</span></div><span class="explore-note" id="exploreNote">Choose a thread below.<br>This sky belongs to you.</span></div>`;
  $('deeper').insertAdjacentHTML('afterbegin',scene);
  const stars=document.querySelector('.scene-stars');
  for(let i=0;i<65;i++){const s=document.createElement('i');s.className='scene-star';s.style.cssText=`left:${(i*61.8)%100}%;top:${(i*37.3)%100}%;--duration:${3+i%7}s;--delay:-${i%8}s`;stars.append(s)}
  const rooms=['Self','Values','Communication','Home','Creativity','Daily life','Partnerships','Shared resources','Exploration','Public life','Community','Reflection'];
  for(let i=1;i<=12;i++){const b=document.createElement('button');b.type='button';b.className='house-door';b.textContent=String(i).padStart(2,'0');b.setAttribute('aria-label',`Explore House ${i}: ${rooms[i-1]}`);b.setAttribute('aria-pressed','false');b.onclick=()=>{document.querySelectorAll('.house-door').forEach(d=>d.setAttribute('aria-pressed',String(d===b)));$('guideSpeech').textContent=`“House ${i}: ${rooms[i-1].toLowerCase()}. Take a look.”`;$('exploreNote').textContent=b.dataset.active==='true'?'Your selected placement lives here.':'An exploration stop — your placement stays in its calculated house.'};$('sceneDoors').append(b)}
  document.querySelector('.rabbit').insertAdjacentHTML('beforeend','<nav class="layer-nav" id="layerNav" aria-label="Journey layers"></nav>');
  const labels=['What','How','Where','Wait','Deeper'];
  labels.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Go to ${label}`);b.onclick=()=>document.dispatchEvent(new CustomEvent('dla-layer',{detail:i}));$('layerNav').append(b)});
  document.body.insertAdjacentHTML('beforeend','<div class="descent-veil" id="descentVeil" aria-hidden="true"></div>');
  const captions=['A character steps into the light.','Every character has a way of moving.','A story needs a room.','The rabbit stops. So can you.','There is always another doorway.'];
  const whispers=['“First, meet the character.”','“Now watch how it moves.”','“The glowing door is yours.”','“Slow down. Let it connect.”','“Oh. You want to go deeper?”'];
  const colors=['#594235','#384a59','#473453','#50405c','#29233f'];
  const glyphs=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const signs=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  function animate(el,className){el.classList.remove(className);void el.offsetWidth;if(!paused)el.classList.add(className)}
  window.DLAExperience={
    loading(value){document.body.classList.toggle('world-loading',value)},
    reset(){document.body.classList.remove('world-ready');document.querySelector('.threshold').hidden=false},
    arrive(){document.body.classList.add('world-ready');document.querySelector('.threshold').hidden=true;animate($('descentVeil'),'falling');$('deeper').scrollIntoView({behavior:paused?'instant':'smooth',block:'start'})},
    show(chart,choice,step){
      const p=[...chart.list,chart.node,chart.south].find(p=>p.name===choice);
      const world=$('world');world.dataset.stage=String(step);world.style.setProperty('--scene-color',colors[step]);
      $('sceneCounter').textContent=`0${step+1} / 05 · ${labels[step].toUpperCase()}`;
      $('sceneCaption').textContent=captions[step];$('guideSpeech').textContent=whispers[step];
      $('sceneEmblem').textContent=step===1?glyphs[signs.indexOf(p.sign)]+'︎':step===3?'?':step===4?'☊':p.symbol;
      $('scenePlacement').textContent=step===0?p.name:step===1?`${p.degree} ${p.sign}`:step===4?'Follow the thread':`${p.name} · ${p.sign} · House ${p.house}`;
      $('exploreNote').textContent=step===2?'Open any door. The glowing one holds your selected placement.':'Choose a thread below. This sky belongs to you.';
      [...$('sceneDoors').children].forEach((b,i)=>{b.dataset.active=String(i+1===p.house);b.setAttribute('aria-pressed','false');b.tabIndex=step===2?0:-1});
      $('sceneDoors').inert=step!==2;
      [...$('layerNav').children].forEach((b,i)=>{if(i===step)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
      animate(world,'scene-transition');
    }
  };
})();
