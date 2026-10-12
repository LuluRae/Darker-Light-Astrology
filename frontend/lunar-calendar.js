(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const panel = document.createElement('section');
  panel.id = 'moonCalendar'; panel.className = 'moon-calendar'; panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'calendarHeading');
  panel.innerHTML = `<div class="calendar-heading"><p class="eyebrow">Shadow · Moon · Wholeness</p><h2 id="calendarHeading" tabindex="-1">A little magic, one day at a time.</h2><p>Tear away the date. Find the Moon and a small invitation underneath. The universe has left you a note. How unusually organised of it.</p><button type="button" id="calendarClose">Close calendar</button></div>
    <p class="calendar-error" id="calendarError" role="alert"></p>
    <nav class="calendar-page-nav" aria-label="Calendar pages"><button type="button" id="calendarBackPage">← Previous day</button><button type="button" id="calendarToday">Today</button><button type="button" id="calendarForwardPage">Next day →</button></nav>
    <article id="calendarDiscovery" class="calendar-discovery calendar-paper" hidden>
      <div id="calendarCover" class="calendar-cover"><span class="paper-vine paper-vine-left" aria-hidden="true">❧</span><span class="paper-vine paper-vine-right" aria-hidden="true">❧</span><p class="paper-label">Darker Light Astrology</p><div class="paper-celestial" aria-hidden="true"><span>●</span><span>◐</span><i>✦</i><span>○</span><span>◑</span></div><p id="calendarCoverMonth" class="paper-month"></p><div class="paper-date-medallion"><p id="calendarCoverNumber" class="paper-number"></p></div><p id="calendarCoverWeekday" class="paper-weekday"></p><p class="paper-invitation">Something is waiting beneath this page.</p><button type="button" id="calendarTear" aria-controls="calendarReveal" aria-expanded="false">Tear off the page <span aria-hidden="true">↘</span></button><span class="paper-corner" aria-hidden="true"></span></div>
      <div id="calendarReveal" hidden><div class="paper-reveal-ornament" aria-hidden="true"><span>☾</span><i>✦</i><span>☽</span></div><div class="calendar-facts"><span id="calendarGlyph" aria-hidden="true"></span><div><p class="eyebrow" id="calendarDate"></p><h3 id="calendarPhase"></h3><p id="calendarSky"></p></div></div><button type="button" id="calendarKeepReading" class="calendar-scroll-cue">Keep reading—your full reflection continues below <span aria-hidden="true">↓</span></button>
      <h3 id="calendarTitle" tabindex="-1"></h3><div class="calendar-copy"><p id="calendarText"></p><blockquote id="calendarQuestion"></blockquote><h4>One small practice</h4><p id="calendarPractice"></p></div>
      <div id="calendarNatal" class="calendar-natal"></div><div class="calendar-page-actions"><button type="button" id="calendarListen">Hear the Cheshire narrator</button><button type="button" id="calendarNextPage">Next page →</button></div>
      <div class="calendar-private"><label for="calendarNote">A note to yourself <small>Optional. Stays in this tab; cleared if you change birth details or close the page.</small></label><textarea id="calendarNote" maxlength="2000" rows="3" placeholder="Something you noticed. No lunar paperwork required."></textarea><button type="button" id="calendarDownload">Save this day’s note ↓</button></div>
      <p class="calendar-footnote">Daily sky positions are calculated for local noon in your device’s time zone, not your birthplace. The Moon can change signs during the day. Phase names group the cycle into eight equal angular sectors; the lit percentage is calculated separately. Reflections are invitations, not forecasts.</p><div class="paper-signature" aria-hidden="true">Darker Light · Moon &amp; Shadow</div></div>
    </article>
    <p class="calendar-clock" id="calendarClock"></p>
    <details id="calendarDateChooser" class="calendar-date-chooser"><summary>Choose another date</summary><p>Any page is yours to open. The calendar police have the day off.</p>
      <div class="calendar-toolbar"><label for="calendarMonth">Explore a month</label><input type="month" id="calendarMonth" min="1900-01" max="2199-12"><button type="button" id="calendarPrev" aria-label="Previous month">←</button><button type="button" id="calendarNext" aria-label="Next month">→</button></div>
      <div class="calendar-weekdays" aria-hidden="true"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
      <div class="calendar-grid" id="calendarDays" role="group" aria-label="Choose a calendar date"></div>
    </details>
    <aside class="calendar-membership" aria-labelledby="calendarMembershipTitle"><p class="eyebrow">Moon &amp; Shadow · Membership coming soon</p><h3 id="calendarMembershipTitle">A little ritual to return to.</h3><p>We’re planning a personalized daily Moon reading and a fresh shadow reflection inside these pages, with a weekly audio companion along the path.</p><a href="tea-party.html" target="_blank" rel="noopener" aria-label="Preview the Moon and Shadow membership (opens in a new tab)">Join the Tea Party ↗</a><p class="calendar-footnote">For now, this free calendar offers general Moon-phase reflections. Membership pricing and subscriptions aren’t open yet.</p></aside>`;
  $('shadowReflections').after(panel);
  let zone = '', chart = null, days = [], selected = null, guidance = null;
  const notes = new Map(), opened = new Set();
  let pageVersion = 0, tearing = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function cancelTear() {
    ++pageVersion;
    if (tearing) { tearing.cancel(); tearing = null; }
    clearTearLayout();
    const alreadyOpen = opened.has(selected?.iso);
    $('calendarCover').hidden = alreadyOpen;
    $('calendarReveal').hidden = !alreadyOpen;
    $('calendarTear').disabled = false;
  }
  function clearTearLayout() {
    $('calendarDiscovery').classList.remove('tearing');
    $('calendarDiscovery').style.removeProperty('--paper-height');
    $('calendarReveal').inert = false;
    $('calendarReveal').removeAttribute('aria-hidden');
  }
  function finishMotion() { if (tearing) tearing.finish(); }
  reduced.addEventListener('change', finishMotion);
  const readable = iso => new Intl.DateTimeFormat(undefined, {dateStyle:'full',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
  function today() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }
  function natal() {
    const target = $('calendarNatal'); target.replaceChildren();
    if (!chart) {
      const text = document.createElement('p'); text.textContent = 'This is the daily sky. Add your birth details to explore your own Moon beside it.';
      const link = document.createElement('a'); link.href = '#chartForm'; link.textContent = 'Open my birth chart ↑'; link.onclick = () => DLAVoice.clear();
      target.append(text,link); return;
    }
    const moon = chart.list.find(p=>p.name==='Moon'), birth = DLALunar.at(new Date(chart.metadata.utc));
    const heading = document.createElement('h4'); heading.textContent = 'Your birth Moon stays your birth Moon.';
    const detail = document.createElement('p'); detail.textContent = `Moon in ${moon.sign} · ${moon.degree} · House ${moon.house}. Birth phase: ${birth.phaseLabel}, ${birth.illumination.toFixed(1)}% lit. Today’s sky does not replace these placements.`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Explore my Moon’s shadow →'; button.onclick = () => DLAShadowRoom.open('Moon');
    target.append(heading,detail,button);
  }
  function narrate() {
    if (!selected || !guidance) return;
    DLAVoice.scene('Moon calendar · '+readable(selected.iso), [
      {text:'A door for this day. Astonishingly, the Moon has kept its appointment.'},
      {text:`${readable(selected.iso)}. At local noon in ${zone.replaceAll('_',' ')}, ${selected.phaseLabel}, ${selected.illumination.toFixed(1)} percent lit. Moon in ${selected.moonSign}, ${selected.moonDegree}. This is the daily sky, not your birth chart.`},
      ...[guidance.title,guidance.text,guidance.question,guidance.practice].map(text=>({text})),
      {text:'You can keep a private note, or choose another day. These are reflection prompts, not predictions.'}
    ]);
  }
  function selectDay(iso, focus = false) {
    cancelTear(); DLAVoice.clear();
    selected = days.find(day=>day.iso===iso); guidance = null;
    $('calendarBackPage').disabled = !selected || !!selected.unavailable || iso === '1900-01-01';
    $('calendarForwardPage').disabled = !selected || !!selected.unavailable || iso === '2199-12-31';
    $('calendarDiscovery').hidden = !selected || !!selected.unavailable;
    $('calendarError').textContent = selected?.error || '';
    [...$('calendarDays').children].forEach(button => button.setAttribute('aria-pressed',String(button.dataset.date===iso)));
    if (!selected || selected.unavailable) { selected = null; return; }
    guidance = DLALunar.guidance(selected);
    const alreadyOpen = opened.has(iso);
    $('calendarCover').hidden = alreadyOpen; $('calendarReveal').hidden = !alreadyOpen;
    $('calendarTear').setAttribute('aria-expanded',String(alreadyOpen));
    $('calendarCoverNumber').textContent = String(Number(iso.slice(-2)));
    $('calendarCoverMonth').textContent = new Intl.DateTimeFormat(undefined,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
    $('calendarCoverWeekday').textContent = new Intl.DateTimeFormat(undefined,{weekday:'long',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
    $('calendarTear').setAttribute('aria-label','Tear off the page for '+readable(iso));
    $('calendarNextPage').disabled = iso === '2199-12-31';
    $('calendarDate').textContent = readable(iso); $('calendarGlyph').textContent = selected.glyph;
    $('calendarPhase').textContent = selected.phaseLabel;
    $('calendarSky').textContent = `${selected.illumination.toFixed(1)}% lit · Moon in ${selected.moonSign} ${selected.moonDegree}`;
    for (const key of ['title','text','question','practice']) $('calendar'+key[0].toUpperCase()+key.slice(1)).textContent = guidance[key];
    $('calendarNote').value = notes.get(iso) || ''; natal();
    if (alreadyOpen) narrate();
    else DLAVoice.scene('An unopened Moon page',[{text:`A page for ${readable(iso)}. Tear it away to discover the Moon and a reflection underneath.`}]);
    if (focus) { $(alreadyOpen ? 'calendarTitle' : 'calendarTear').focus({preventScroll:true}); $('calendarDiscovery').scrollIntoView({block:'start',behavior:'instant'}); }
  }
  $('calendarTear').onclick = () => {
    if (!selected || tearing || $('calendarCover').hidden) return;
    DLAVoice.clear();
    const version = ++pageVersion, iso = selected.iso;
    $('calendarTear').disabled = true;
    function reveal() {
      if (version !== pageVersion || selected?.iso !== iso) return;
      tearing?.cancel(); tearing = null; opened.add(iso);
      clearTearLayout();
      $('calendarCover').hidden = true; $('calendarReveal').hidden = false;
      $('calendarTear').disabled = false; $('calendarTear').setAttribute('aria-expanded','true');
      const tile = [...$('calendarDays').children].find(button=>button.dataset.date===iso);
      if (tile) { tile.dataset.opened = 'true'; tile.querySelector('small').textContent = 'Opened'; tile.querySelector('span').textContent = selected.glyph; }
      $('calendarTitle').focus({preventScroll:true}); narrate();
    }
    if (reduced.matches || document.body.classList.contains('motion-paused') || !$('calendarCover').animate) { reveal(); return; }
    // Let the next sheet show underneath, but keep it out of keyboard/screen-reader focus until the tear finishes.
    $('calendarDiscovery').style.setProperty('--paper-height', $('calendarDiscovery').getBoundingClientRect().height+'px');
    $('calendarDiscovery').classList.add('tearing');
    $('calendarReveal').hidden = false; $('calendarReveal').inert = true;
    $('calendarReveal').setAttribute('aria-hidden','true');
    tearing = $('calendarCover').animate([
      {transform:'perspective(800px) rotateX(0) rotate(0)',opacity:1,offset:0},
      {transform:'perspective(800px) rotateX(-18deg) rotate(-3deg) translateY(10px)',opacity:1,offset:.3},
      {transform:'perspective(800px) rotateX(-42deg) rotate(9deg) translate(35px,95px)',opacity:.9,offset:.7},
      {transform:'perspective(800px) rotateX(-65deg) rotate(18deg) translate(70px,220px)',opacity:0,offset:1}
    ],{duration:1050,easing:'ease-in',fill:'forwards'});
    tearing.finished.then(reveal).catch(()=>{});
  };
  $('calendarKeepReading').onclick = () => {
    $('calendarTitle').scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
    $('calendarTitle').focus({preventScroll:true});
  };
  function loadMonth(preferred) {
    cancelTear(); DLAVoice.clear(); selected = null; guidance = null;
    $('calendarDays').replaceChildren(); $('calendarDiscovery').hidden = true; $('calendarError').textContent = '';
    try {
      const value = $('calendarMonth').value;
      days = DLALunar.month(value,zone);
      const firstWeekday = new Date(value+'-01T12:00:00Z').getUTCDay(), now = today();
      $('calendarPrev').disabled = value === '1900-01'; $('calendarNext').disabled = value === '2199-12';
      days.forEach((day,index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'calendar-door'; button.dataset.date = day.iso;
        if (!index) button.style.gridColumnStart = String(firstWeekday+1);
        button.setAttribute('aria-label', `${readable(day.iso)}: ${day.unavailable ? 'snapshot unavailable' : day.phaseLabel+', Moon in '+day.moonSign}`);
        if (day.iso === now) button.setAttribute('aria-current','date');
        button.dataset.opened = String(opened.has(day.iso));
        const number = document.createElement('b'); number.textContent = String(index+1);
        const glyph = document.createElement('span'); glyph.setAttribute('aria-hidden','true'); glyph.textContent = opened.has(day.iso) ? day.glyph || '·' : '✦';
        const label = document.createElement('small'); label.textContent = day.unavailable ? 'Unavailable' : opened.has(day.iso) ? 'Opened' : 'Lift a page';
        button.append(number,glyph,label); button.onclick = () => {
          if (!day.unavailable) $('calendarDateChooser').open = false;
          selectDay(day.iso,true);
        }; $('calendarDays').append(button);
      });
      selectDay(days.some(day=>day.iso===preferred) ? preferred : days.some(day=>day.iso===now) ? now : days[0].iso);
    } catch (error) {
      days = []; $('calendarError').textContent = error.message;
      $('calendarBackPage').disabled = true; $('calendarForwardPage').disabled = true;
    }
  }
  function shift(amount) {
    if (!/^\d{4}-\d{2}$/.test($('calendarMonth').value)) return;
    const [year,month] = $('calendarMonth').value.split('-').map(Number);
    const date = new Date(Date.UTC(year,month-1+amount,1));
    if (date.getUTCFullYear()<1900 || date.getUTCFullYear()>2199) return;
    $('calendarMonth').value = date.toISOString().slice(0,7); loadMonth();
  }
  $('calendarMonth').onchange = () => loadMonth();
  function turnPage(amount) {
    if (!selected) return;
    const date = new Date(selected.iso+'T12:00:00Z'); date.setUTCDate(date.getUTCDate()+amount);
    const iso = date.toISOString().slice(0,10);
    if (Number(iso.slice(0,4))<1900 || Number(iso.slice(0,4))>2199) return;
    $('calendarDateChooser').open = false;
    if (iso.slice(0,7) !== $('calendarMonth').value) { $('calendarMonth').value = iso.slice(0,7); loadMonth(iso); }
    selectDay(iso,true);
  }
  $('calendarNextPage').onclick = () => turnPage(1);
  $('calendarBackPage').onclick = () => turnPage(-1);
  $('calendarForwardPage').onclick = () => turnPage(1);
  $('calendarPrev').onclick = () => shift(-1); $('calendarNext').onclick = () => shift(1);
  $('calendarToday').onclick = () => {
    $('calendarDateChooser').open = false;
    $('calendarMonth').value = today().slice(0,7); loadMonth(today()); selectDay(today(),true);
  };
  $('calendarNote').oninput = event => { if (selected) notes.set(selected.iso,event.target.value); };
  $('calendarListen').onclick = () => { narrate(); DLAVoice.listen(); };
  $('calendarDownload').onclick = () => {
    if (!selected || !guidance) return;
    const text = ['Darker Light Astrology — My Moon Calendar',readable(selected.iso),`Local noon · ${zone}`,`${selected.phaseLabel} · ${selected.illumination.toFixed(1)}% lit · Moon in ${selected.moonSign} ${selected.moonDegree}`,'',guidance.title,guidance.text,'',guidance.question,guidance.practice,'','My own words',notes.get(selected.iso)||'','Daily sky, not a birth placement. Astrological reflection, not a prediction.'].join('\n');
    const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = `my-moon-note-${selected.iso}.txt`; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('calendarClose').onclick = () => { cancelTear(); DLAVoice.clear(); panel.hidden = true; document.body.classList.remove('calendar-ready'); $('openMoonCalendar').focus(); };
  $('openMoonCalendar').onclick = () => {
    DLAExperience.leaveRoom(); panel.hidden = false; document.body.classList.add('calendar-ready');
    $('calendarDateChooser').open = false;
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!zone) throw new Error('Your device time zone is unavailable. Please check your device settings.');
      $('calendarClock').textContent = `Daily snapshots at noon · ${zone.replaceAll('_',' ')} · your device’s time zone`;
      $('calendarMonth').value = today().slice(0,7);
      loadMonth(today());
    } catch (error) { $('calendarError').textContent = error.message; }
    $('calendarHeading').focus({preventScroll:true}); panel.scrollIntoView({block:'start',behavior:'instant'});
  };
  window.DLACalendar = {
    cancelReveal:cancelTear,
    setChart(next) {
      chart = next;
      if (!chart) { notes.clear(); $('calendarNote').value = ''; }
      if (selected && !selected.unavailable) natal();
    }
  };
  function openFromLink() {
    if (window.location.hash === '#moonCalendar') $('openMoonCalendar').click();
  }
  window.addEventListener('hashchange', openFromLink);
  openFromLink();
})();
