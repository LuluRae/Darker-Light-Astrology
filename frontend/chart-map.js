(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const cartoon = `<img class="guide-svg illustrated-rabbit" src="assets/rabbit-guide.png" width="1024" height="1536" alt="" aria-hidden="true" draggable="false">`;
  document.querySelectorAll('.guide-svg').forEach(svg => { svg.outerHTML = cartoon; });
  document.querySelector('.threshold-caption').textContent = '“Finally! Do you know what time it is? Neither do I. Come on.”';
  const world = $('world');
  world.classList.add('map-world');
  world.insertAdjacentHTML('afterbegin', '<div class="chart-map" id="chartMap" aria-label="Whole-sign chart map"><div class="map-sectors" aria-hidden="true"></div><div id="planetStops"></div><div class="map-center" aria-hidden="true">✦<small>YOUR SKY</small></div></div>');
  const map = $('chartMap'), guide = document.querySelector('.scene-guide');
  map.append($('sceneDoors')); map.append(guide); world.append($('guideSpeech'));
  let chart = null, hop = null, diveVersion = 0, lastStop = null;
  const roomNames = ['Self', 'Values', 'Communication', 'Home', 'Creativity', 'Daily life', 'Partnerships', 'Shared resources', 'Exploration', 'Public life', 'Community', 'Reflection'];
  world.classList.add('vortex-world');
  // Cartoon spiral scenery is illustrative. Placements still use the calculated houses.
  const spiral = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  spiral.setAttribute('viewBox', '0 0 600 600'); spiral.setAttribute('aria-hidden', 'true'); spiral.classList.add('vortex-spiral');
  ['#9064bf', '#507e99', '#bb739b', '#c19a62'].forEach((color, arm) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = '';
    for (let n = 0; n <= 210; n++) {
      const t = n/210, radius = 280-268*t, angle = t*Math.PI*5 + arm*Math.PI/2;
      d += (n ? 'L' : 'M') + (300+radius*Math.cos(angle)).toFixed(2) + ' ' + (300+radius*Math.sin(angle)).toFixed(2) + ' ';
    }
    path.setAttribute('d', d); path.setAttribute('stroke', color); spiral.append(path);
  });
  map.prepend(spiral);
  $('mapHint')?.remove();
  world.insertAdjacentHTML('beforeend', `<section id="destinationRoom" class="destination-room" hidden aria-label="Inside your chosen rabbit hole"><div class="room-wonder" aria-hidden="true"><div class="room-whirlpool"></div>${cartoon}<span id="roomGlyph"></span></div><div class="eyebrow">Down the rabbit hole</div><h3 id="roomTitle" tabindex="-1"></h3><p id="roomDetail"></p><p class="room-aside">“Well? Was it worth being late for?”</p><button type="button" id="returnToVortex">Back to the swirling chart ↗</button></section>`);
  $('sceneCaption').textContent = 'Choose a rabbit hole. He knows the way down.';
  function leaveRoom(focus = false) {
    const leavingMoon = world.classList.contains('moon-open');
    window.DLAMoonRoom?.close();
    ++diveVersion; if (hop) { hop.cancel(); hop = null; }
    world.classList.remove('diving', 'inside-hole'); $('destinationRoom').hidden = true; map.inert = false;
    document.querySelectorAll('.portal-selected').forEach(el=>el.classList.remove('portal-selected'));
    if (focus && lastStop?.isConnected) {
      lastStop.focus({preventScroll:true});
      if (leavingMoon) lastStop.scrollIntoView({block:'center', behavior:'instant'});
    }
  }
  $('returnToVortex').onclick = () => leaveRoom(true);
  world.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('destinationRoom').hidden) {e.preventDefault(); leaveRoom(true);} });
  const originalReset = DLAExperience.reset;
  DLAExperience.reset = function () { leaveRoom(); window.DLAMoonRoom?.reset(); originalReset(); };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function stopHop() { if (hop) hop.finish(); }
  $('motionToggle').addEventListener('click', stopHop);
  reduced.addEventListener('change', stopHop);
  function position(el, angle, radius) {
    const rad = angle * Math.PI / 180;
    el.style.left = (50 + Math.cos(rad) * radius) + '%';
    el.style.top = (50 + Math.sin(rad) * radius) + '%';
  }
  function jump(target) {
    const before = guide.getBoundingClientRect(); leaveRoom();
    lastStop = target;
    guide.style.left = target.style.left; guide.style.top = target.style.top;
    guide.dataset.destination = target.dataset.destination;
    const after = guide.getBoundingClientRect(), dx = before.left - after.left, dy = before.top - after.top;
    if (!world.getClientRects().length) return;
    const version = diveVersion;
    target.classList.add('portal-selected'); world.classList.add('diving');
    function arrive() {
      if (version !== diveVersion) return;
      world.classList.remove('diving'); world.classList.add('inside-hole'); map.inert = true;
      const destination = target.dataset.destination;
      const placement = [...chart.list,chart.node,chart.south].find(p=>p.name===destination);
      if (placement) {
        $('roomGlyph').textContent = placement.symbol+'\uFE0E';
        $('roomTitle').textContent = placement.name + ' in ' + placement.sign;
        $('roomDetail').textContent = placement.degree + ' · House ' + placement.house + '. ' + placement.meaning + '. The rabbit has brought you to this placement in your own chart.';
      } else {
        const number = Number(destination.slice(6));
        const residents = [...chart.list,chart.node,chart.south].filter(p=>p.house===number).map(p=>p.name);
        $('roomGlyph').textContent = String(number).padStart(2,'0');
        $('roomTitle').textContent = destination + ' · ' + roomNames[number-1];
        $('roomDetail').textContent = residents.length ? 'You found ' + residents.join(', ') + ' here in your chart.' : 'No calculated planets or nodes occupy this house. Its theme is still part of your chart.';
      }
      $('destinationRoom').hidden = false;
      if (placement?.name === 'Moon') window.DLAMoonRoom?.open(chart);
      $('roomTitle').focus({preventScroll:true});
    }
    if (!reduced.matches && !document.body.classList.contains('motion-paused')) {
      hop = guide.animate([
        {transform: `translate(${dx}px,${dy}px) rotate(-8deg) scale(1.16,.84)`, opacity:1},
        {transform: `translate(${dx*.45}px,${dy*.45-85}px) rotate(12deg) scale(.9,1.16)`, offset: .4, opacity:1},
        {transform: 'translate(0,-10px) rotate(35deg) scale(.7)', offset: .65, opacity:1},
        {transform: 'translate(0,0) rotate(210deg) scale(.02)', opacity:0}
      ], {duration: 1050, easing: 'ease-in-out', fill:'forwards'});
      hop.finished.then(arrive).catch(()=>{});
    } else arrive();
  }
  [...$('sceneDoors').children].forEach((door, index) => {
    door.dataset.destination = 'House ' + (index+1);
    position(door, 180 - (index+.5)*30, 43);
    const explore = door.onclick;
    door.onclick = () => {
      explore(); jump(door);
      const residents = [...chart.list, chart.node, chart.south].filter(p => p.house === index+1).map(p=>p.name);
      $('guideSpeech').textContent = `“House ${index+1}. Quick peek. We are spectacularly late.”`;
      $('exploreNote').textContent = residents.length ? 'Here in your chart: ' + residents.join(', ') : 'No calculated planets or nodes here. Still a room you can explore.';
    };
  });
  const originalShow = DLAExperience.show;
  DLAExperience.show = function (nextChart, choice, step) {
    if (chart !== nextChart) {
      chart = nextChart; $('planetStops').replaceChildren();
      const placements = [...chart.list, chart.node, chart.south];
      placements.forEach(p => {
        const siblings = placements.filter(other=>other.house===p.house), index = siblings.indexOf(p);
        const angle = 180-(p.house-.5)*30 + (index-(siblings.length-1)/2)*Math.min(8,22/Math.max(1,siblings.length-1));
        const stop = document.createElement('button'); stop.type='button'; stop.className='planet-stop';
        stop.dataset.destination=p.name; stop.textContent=p.symbol+'\uFE0E';
        stop.setAttribute('aria-label',`Visit ${p.name} in ${p.sign}, House ${p.house}`);
        stop.title=`${p.name} · ${p.sign} · House ${p.house}`;
        position(stop,angle,siblings.length>2?(index%2===0?24:33):29);
        stop.onclick=()=>document.dispatchEvent(new CustomEvent('dla-planet',{detail:p.name}));
        $('planetStops').append(stop);
      });
    }
    originalShow(nextChart,choice,step);
    world.classList.remove('scene-transition');
    $('sceneDoors').inert=false;
    [...$('sceneDoors').children].forEach(b=>{b.tabIndex=0});
    [...$('planetStops').children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.destination===choice)));
    const p=[...chart.list,chart.node,chart.south].find(p=>p.name===choice);
    jump(step===2?$('sceneDoors').children[p.house-1]:[...$('planetStops').children].find(b=>b.dataset.destination===choice));
    $('guideSpeech').textContent = [
      `“${choice}! There you are. Do try to keep up.”`,
      `“${p.sign}. Lovely. Admire it while walking.”`,
      `“House ${p.house}! This way. Watch the ears.”`,
      '“Yes, yes. A revelation. Take your time. I shall panic quietly.”',
      '“Another rabbit hole? Fine. We were already late.”'
    ][step];
    $('sceneCaption').textContent='Pick a planet or a house. Down he goes.';
    $('exploreNote').textContent='Choose a glowing rabbit hole. Your real placements are tucked inside.';
  };
})();
