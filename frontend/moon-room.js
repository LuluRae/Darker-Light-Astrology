(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const room = $('destinationRoom'), world = $('world');
  const chapter = document.createElement('section');
  chapter.className = 'moon-chapter'; chapter.hidden = true;
  chapter.setAttribute('aria-label', 'The Moonlit Conservatory');
  chapter.innerHTML = `
    <div class="moon-heading"><p class="eyebrow">The Moonlit Conservatory</p><h4>The room that knows you<br>after midnight.</h4><p>Beyond the hurry. Beneath the brave face.<br>What helps you feel at home in yourself?</p></div>
    <div class="moon-scene" aria-label="Explore the mirror, door, and teacup">
      <div class="moon-scenery" aria-hidden="true"></div><div class="moon-water" aria-hidden="true"></div>
      <div class="moon-motes" aria-hidden="true"></div>
      <img class="moon-rabbit illustrated-rabbit" src="assets/rabbit-guide.png" width="1024" height="1536" alt="" aria-hidden="true" draggable="false">
      <button type="button" class="moon-object moon-mirror" data-moon-stop="mirror" aria-label="Explore the silver mirror: your Moon sign" aria-controls="moonDiscovery"><span aria-hidden="true">✧</span><b>The silver mirror</b><small>Your Moon sign</small></button>
      <button type="button" class="moon-object moon-door" data-moon-stop="door" aria-label="Explore the little door: your Moon house" aria-controls="moonDiscovery"><span aria-hidden="true" id="moonDoorNumber"></span><b>The little door</b><small>Your Moon house</small></button>
      <button type="button" class="moon-object moon-cup" data-moon-stop="cup" aria-label="Explore the teacup: a moment of care" aria-controls="moonDiscovery"><span aria-hidden="true">♡</span><b>A cup of moonlight</b><small>A moment of care</small></button>
      <p class="moon-scene-caption">Three small discoveries. Follow your curiosity.</p>
    </div>
    <div class="moon-story">
      <div class="moon-trail"><p id="moonProgress" role="status"></p><button type="button" id="moonRestart">Revisit the entrance</button></div>
      <div id="moonDiscovery" class="moon-discovery">
        <div><p class="eyebrow" id="moonDiscoveryLabel"></p><h4 id="moonDiscoveryTitle" tabindex="-1"></h4><p id="moonDiscoveryText"></p><p class="moon-fact" id="moonFact"></p></div>
        <aside class="moon-question"><span aria-hidden="true">“</span><p id="moonQuestion"></p><p id="moonWhisper" class="moon-whisper"></p></aside>
      </div>
      <div id="moonCare" class="moon-care" hidden>
        <p class="moon-practice" id="moonPractice"></p>
        <label for="moonReflection">A note to yourself <small>Optional · stays in this tab until you change the birth details or close the page.</small></label>
        <textarea id="moonReflection" rows="3" maxlength="1200" placeholder="Today, I could give myself permission to…"></textarea>
      </div>
      <div id="moonKeepsake" class="moon-keepsake" hidden>
        <div class="eyebrow">A little moonlight to take with you</div><h4 tabindex="-1" id="moonKeepsakeTitle">You can be a work in progress<br>and still deserve care.</h4>
        <p class="moon-fact" id="moonKeepsakePlacement"></p><p id="moonTakeaway"></p><p id="moonTakeawayPractice"></p><blockquote id="moonSavedNote" hidden></blockquote>
        <div class="moon-ending-actions"><button type="button" id="moonDownload">Save my Moon note ↓</button><button type="button" id="moonToVenus">Follow Venus →</button></div>
        <p class="moon-whisper">“Late? Yes. But some things are worth stopping for.”</p><p class="moon-ending-hint">Venus opens the next question: what draws you close? Or return to the chart and choose any door.</p>
      </div>
      <div class="moon-next-row"><p id="moonGuideLine"></p><button type="button" id="moonContinue"></button></div>
      <p class="moon-footnote">Your sign and house come from your calculated chart. The story is an invitation to reflect. The painted Moon is scenery, not your birth Moon’s phase.</p>
    </div>`;
  $('roomDetail').before(chapter);
  const stops = [...chapter.querySelectorAll('[data-moon-stop]')];
  const motes = chapter.querySelector('.moon-motes');
  for (let i = 0; i < 15; i++) {
    const mote = document.createElement('i');
    mote.style.cssText = `left:${(i*37+9)%96}%;top:${(i*23+12)%87}%;--delay:-${i}s;--drift:${5+i%6}s`;
    motes.append(mote);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rabbit = chapter.querySelector('.moon-rabbit');
  const order = ['mirror', 'door', 'cup'];
  let source = null, story = null, active = 'welcome', visited = new Set(), note = '', movement = null;
  function stopMovement() { if (movement) { movement.cancel(); movement = null; } }
  $('motionToggle').addEventListener('click', stopMovement);
  reduced.addEventListener('change', stopMovement);
  function moveRabbit(key) {
    const before = rabbit.getBoundingClientRect();
    stopMovement(); chapter.dataset.discovery = key;
    const after = rabbit.getBoundingClientRect();
    if (reduced.matches || document.body.classList.contains('motion-paused')) return;
    movement = rabbit.animate([
      {transform: `translate(${before.left-after.left}px,${before.top-after.top}px) rotate(-6deg)`},
      {transform: `translate(${(before.left-after.left)*.5}px,${(before.top-after.top)*.5-35}px) rotate(5deg)`, offset: .5},
      {transform: 'translate(0,0) rotate(0)'}
    ], {duration: 650, easing: 'ease-in-out'});
  }
  function render(focus = false) {
    const summary = active === 'keepsake', welcome = active === 'welcome';
    $('moonDiscovery').hidden = summary;
    $('moonCare').hidden = active !== 'cup';
    $('moonKeepsake').hidden = !summary;
    $('moonContinue').hidden = summary;
    $('moonReflection').value = note;
    $('moonProgress').textContent = `${visited.size} of 3 discoveries found · explore in any order`;
    stops.forEach(button => {
      const key = button.dataset.moonStop;
      button.setAttribute('aria-pressed', String(active === key));
      button.dataset.found = String(visited.has(key));
    });
    if (summary) {
      $('moonKeepsakePlacement').textContent = story.placement;
      $('moonTakeaway').textContent = story.takeaway;
      $('moonTakeawayPractice').textContent = story.practice;
      $('moonSavedNote').textContent = note;
      $('moonSavedNote').hidden = !note.trim();
      $('moonGuideLine').textContent = 'The chart is still here. So are all its other doors.';
    } else if (welcome) {
      $('moonDiscoveryLabel').textContent = 'You have arrived';
      $('moonDiscoveryTitle').textContent = 'What if you did not have to earn a softer landing?';
      $('moonDiscoveryText').textContent = 'The rabbit finally stops checking his watch. In astrology, the Moon gives us a language for emotional needs, familiar responses, and the things we reach for when the day gets loud. This room asks what care could look like for you.';
      $('moonFact').textContent = story.placement;
      $('moonQuestion').textContent = 'When the brave face comes off, what do you find yourself needing?';
      $('moonWhisper').textContent = 'You can hold the question without answering it yet.';
      $('moonGuideLine').textContent = '“A mirror, a door, and tea. Finally, a sensible delay.”';
    } else {
      const discovery = story[active];
      $('moonDiscoveryLabel').textContent = {mirror: '01 · The sign / how', door: '02 · The house / where', cup: '03 · Bring it into your day'}[active];
      $('moonDiscoveryTitle').textContent = discovery.title;
      $('moonDiscoveryText').textContent = discovery.text;
      $('moonFact').textContent = discovery.fact;
      $('moonQuestion').textContent = discovery.question;
      $('moonWhisper').textContent = {mirror: 'A mirror offers an angle. It does not tell the whole story.', door: 'A room to explore, not a prediction of what must happen.', cup: 'One small response is enough. There is no correct answer.'}[active];
      $('moonPractice').textContent = story.practice;
      $('moonGuideLine').textContent = {mirror: '“Look properly. There is more to you than the first reflection.”', door: '“Your door. I checked the number twice. We are that late.”', cup: '“Yes, there is time for tea. I shall panic after.”'}[active];
    }
    const next = order.find(key => !visited.has(key));
    $('moonContinue').textContent = next ? {mirror: 'Look in the silver mirror →', door: `Open door ${story.house} →`, cup: 'Sit down for moonlight tea →'}[next] : 'Gather my discoveries →';
    if (focus) {
      const heading = $(summary ? 'moonKeepsakeTitle' : 'moonDiscoveryTitle');
      heading.focus({preventScroll:true});
      heading.scrollIntoView({block:'nearest', behavior:'instant'});
    }
  }
  function discover(key) {
    if (!story) return;
    active = key; if (order.includes(key)) visited.add(key);
    moveRabbit(key); render(true);
  }
  stops.forEach(button => button.onclick = () => discover(button.dataset.moonStop));
  $('moonContinue').onclick = () => discover(order.find(key => !visited.has(key)) || 'keepsake');
  $('moonRestart').onclick = () => discover('welcome');
  $('moonReflection').addEventListener('input', e => { note = e.target.value; });
  $('moonToVenus').onclick = () => {
    document.dispatchEvent(new CustomEvent('dla-planet', {detail:'Venus'}));
    world.scrollIntoView({block:'start', behavior:'instant'});
  };
  $('moonDownload').onclick = () => {
    if (!story) return;
    const text = ['Darker Light Astrology — My Moon Note', story.placement, '', story.takeaway, '', 'A small invitation', story.practice, '', 'A question to return to', story.mirror.question, story.door.question, ...(note.trim() ? ['', 'My own words', note] : []), '', 'Astrological reflection, not a prediction. Tropical zodiac; whole-sign houses.'].join('\n');
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'my-moon-note.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  window.DLAMoonRoom = {
    open(chart) {
      if (source !== chart) {
        source = chart; story = DLAMoonJourney.chapter(chart); active = 'welcome'; visited = new Set(); note = '';
      }
      room.classList.add('moon-room'); world.classList.add('moon-open'); chapter.hidden = false;
      chapter.dataset.discovery = active; $('moonDoorNumber').textContent = String(story.house).padStart(2,'0');
      render();
    },
    close() {
      stopMovement(); room.classList.remove('moon-room'); world.classList.remove('moon-open'); chapter.hidden = true;
    },
    reset() {
      this.close(); source = null; story = null; active = 'welcome'; visited.clear(); note = '';
      $('moonReflection').value = ''; $('moonSavedNote').textContent = '';
    }
  };
})();
