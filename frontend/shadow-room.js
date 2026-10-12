(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const panel = document.createElement('section');
  panel.id = 'shadowReflections'; panel.className = 'shadow-reflections'; panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'shadowHeading');
  panel.innerHTML = `<div class="shadow-heading"><div><p class="eyebrow">The shadow study</p><h2 id="shadowHeading" tabindex="-1">Even the shadow gets a seat.</h2><p>Patterns, possibilities, and the occasional overqualified defence mechanism. Bring curiosity. The rabbit left a note. Naturally, the handwriting is rushed.</p></div><span class="shadow-trail" aria-hidden="true">⌚</span></div>
    <div class="shadow-controls"><label for="shadowChoice">Choose a chart thread</label><select id="shadowChoice"></select><button type="button" id="shadowListen">Listen to this reflection</button><button type="button" id="shadowBack">Back to my chart ↗</button></div>
    <article class="shadow-card"><p class="eyebrow" id="shadowPlacement"></p><h3 id="shadowTitle"></h3><div class="shadow-copy"><h4>The theme</h4><p id="shadowTheme"></p><h4>How it can show up</h4><p id="shadowStyle"></p><h4>The setting in your chart</h4><p id="shadowSetting"></p><h4>A question worth a pause</h4><blockquote id="shadowQuestion"></blockquote><h4>Try something small</h4><p id="shadowPractice"></p></div><p class="shadow-footnote" id="shadowNote"></p></article>
    <article class="shadow-card shadow-together"><p class="eyebrow">From your Luna Door reflections</p><h3 id="shadowTogetherTitle"></h3><p id="shadowTogetherPlacements" class="shadow-fact"></p><div class="shadow-copy"><p id="shadowTogetherText"></p><blockquote id="shadowTogetherQuestion"></blockquote></div><p class="shadow-footnote" id="shadowTogetherNote"></p></article>`;
  $('chartLedger').after(panel);
  const roomButton = document.createElement('button');
  roomButton.type = 'button'; roomButton.id = 'roomShadow'; roomButton.hidden = true;
  roomButton.textContent = 'Explore the shadow side →';
  $('roomDetail').after(roomButton);
  let chart = null, offered = 'Moon', story = null, pairing = null;
  const choice = $('shadowChoice');
  function narrate() {
    if (!story) return;
    DLAVoice.scene(story.title, [
      {speaker:'Rabbit',text:'The shadow study. No villain audition required. Let’s have a look.'},
      ...[story.placement,story.theme,story.style,story.setting,story.question,story.practice,story.note,pairing.title,...pairing.placements,pairing.text,pairing.question,pairing.note].map(text=>({text}))
    ]);
  }
  function render() {
    story = DLAShadow.reflection(chart, choice.value); pairing = DLAShadow.together(chart);
    for (const key of ['placement','title','theme','style','setting','question','practice','note']) $('shadow'+key[0].toUpperCase()+key.slice(1)).textContent = story[key];
    for (const key of ['title','text','question','note']) $('shadowTogether'+key[0].toUpperCase()+key.slice(1)).textContent = pairing[key];
    $('shadowTogetherPlacements').textContent = pairing.placements.join(' · ');
    narrate();
  }
  choice.onchange = render;
  $('shadowListen').onclick = () => { narrate(); DLAVoice.listen(); };
  $('shadowBack').onclick = () => { panel.hidden = true; DLAExperience.showMap(); };
  roomButton.onclick = () => window.DLAShadowRoom.open(offered);
  $('showShadowReflections').onclick = () => window.DLAShadowRoom.open('Moon');
  window.DLAShadowRoom = {
    setChart(next) {
      chart = next; story = null; pairing = null; panel.hidden = true; roomButton.hidden = true;
      choice.replaceChildren();
      // Remove the previous visitor's derived content on invalidation.
      panel.querySelectorAll('[id^="shadow"]:not(select):not(button):not(#shadowHeading)').forEach(el => { if (/^(shadow(Placement|Title|Theme|Style|Setting|Question|Practice|Note)|shadowTogether)/.test(el.id)) el.textContent = ''; });
      if (!chart) return;
      for (const name of [...chart.list.map(p=>p.name),'Rising',chart.node.name,chart.south.name]) {
        const option = document.createElement('option'); option.value = name; option.textContent = name; choice.append(option);
      }
      choice.value = 'Moon';
    },
    offer(name) { offered = name; roomButton.hidden = !name; },
    open(name = 'Moon') {
      if (!chart) return;
      DLAExperience.leaveRoom();
      choice.value = name; panel.hidden = false; render();
      $('shadowHeading').focus({preventScroll:true}); panel.scrollIntoView({block:'start',behavior:'instant'});
    }
  };
})();
