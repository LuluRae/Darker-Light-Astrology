(function () {
  'use strict';
  document.body.classList.add('wonderland-mode');
  const hero = document.querySelector('.dream-opening');
  hero.insertAdjacentHTML('afterbegin', `<div class="painted-world" aria-hidden="true"><div class="painted-scenery"></div><div class="painted-shade"></div><div class="wonder-card wonder-card-one"><span>A</span>♥</div><div class="wonder-card wonder-card-two"><span>Q</span>♠</div><div class="wonder-card wonder-card-three"><span>3</span>♦</div><div class="wonder-fireflies"></div></div>`);
  const fireflies = document.querySelector('.wonder-fireflies');
  for (let i=0;i<22;i++) {
    const light=document.createElement('i');
    light.style.cssText=`left:${(i*37+11)%100}%;top:${(i*23+15)%100}%;--delay:-${i%9}s;--duration:${4+i%7}s`;
    fireflies.append(light);
  }
  // Small camera drift complements animated foreground props; target controls stay still.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  hero.addEventListener('pointermove', event=>{
    if(event.pointerType==='touch'||reduced.matches||document.body.classList.contains('motion-paused'))return;
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const bounds=hero.getBoundingClientRect();
      hero.style.setProperty('--camera-x',((event.clientX-bounds.left)/bounds.width-.5)*9+'px');
      hero.style.setProperty('--camera-y',((event.clientY-bounds.top)/bounds.height-.5)*6+'px');
    });
  });
  function centerCamera(){cancelAnimationFrame(frame);hero.style.setProperty('--camera-x','0px');hero.style.setProperty('--camera-y','0px')}
  hero.addEventListener('pointerleave',centerCamera);
  document.getElementById('motionToggle').addEventListener('click',centerCamera);
  reduced.addEventListener('change',centerCamera);
  document.getElementById('followOpening').addEventListener('click',()=>{
    hero.classList.remove('wonder-fall');void hero.offsetWidth;hero.classList.add('wonder-fall');
  });
  // Hovering or focusing a curiosity illuminates the corresponding doorway in the story.
  document.querySelectorAll('[data-opening-thread]').forEach(button=>{
    const glyph={Moon:'☾',Venus:'♀',Pluto:'♇'}[button.dataset.openingThread];
    const emblem=document.createElement('span');emblem.className='curiosity-glyph';emblem.setAttribute('aria-hidden','true');emblem.textContent=glyph+'\uFE0E';
    button.prepend(emblem);
  });
})();
