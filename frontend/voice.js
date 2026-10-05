(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.id = 'voiceToggle'; toggle.textContent = 'Listen';
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'voicePanel');
  $('myChartButton').after(toggle);
  const panel = document.createElement('section');
  panel.id = 'voicePanel'; panel.className = 'voice-panel'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Journey voice controls');
  panel.innerHTML = `<div class="voice-top"><div><span class="voice-eyebrow">Listen to the journey</span><p id="voiceStatus" role="status"></p></div><button type="button" id="voiceOff">Voice off</button></div>
    <div class="voice-controls"><button type="button" id="voicePause">Pause</button><button type="button" id="voiceReplay">Replay</button><button type="button" id="voiceText" aria-pressed="false">Show text</button><details class="voice-settings"><summary>Voice &amp; pace</summary><div><label for="voiceChoice">Device voice</label><select id="voiceChoice"></select><label for="voiceRate">Pace</label><select id="voiceRate"><option value="0.85">Unhurried</option><option value="1" selected>Normal</option><option value="1.15">Lively</option></select><small>Available voices depend on your device.</small></div></details></div>
    <p id="voiceCaption" class="voice-caption" hidden></p>`;
  document.body.append(panel);
  let expanded = false, textVisible = false;
  const narrator = DLAVoiceEngine.create({synthesis:window.speechSynthesis, Utterance:window.SpeechSynthesisUtterance, onChange:update});
  function update(state) {
    const active = expanded && state.enabled && state.status !== 'error';
    document.body.classList.toggle('voice-reading', expanded);
    document.body.classList.toggle('voice-hide-text', active && !textVisible);
    toggle.textContent = expanded ? 'Voice on' : 'Listen';
    toggle.setAttribute('aria-expanded', String(expanded)); panel.hidden = !expanded;
    $('voicePause').textContent = state.paused ? 'Resume' : 'Pause';
    $('voicePause').disabled = !state.enabled || !['speaking','paused'].includes(state.status);
    $('voiceReplay').disabled = !state.supported;
    $('voiceText').disabled = !active;
    $('voiceText').textContent = textVisible ? 'Hide text' : 'Show text';
    $('voiceText').setAttribute('aria-pressed', String(textVisible));
    $('voiceStatus').textContent = state.error || ({off:'Voice is off', ready:'Choose a place to explore', paused:'Paused — take your time', speaking:`${state.line?.speaker || 'Story'} · ${state.title}`, finished:'Your turn. Explore when you’re ready.'}[state.status]);
    $('voiceCaption').hidden = !textVisible || !state.line;
    $('voiceCaption').textContent = state.line ? `${state.line.speaker}: ${state.line.text}` : '';
    // Spoken lines have visible optional captions, without a second live announcement.
    document.querySelectorAll('.rabbit[aria-live]').forEach(el => el.setAttribute('aria-live', active ? 'off' : 'polite'));
  }
  function populateVoices() {
    const selection = $('voiceChoice'), previous = selection.value;
    selection.replaceChildren();
    const voices = narrator.voices();
    voices.forEach(voice => {
      const option = document.createElement('option'); option.value = voice.voiceURI;
      option.textContent = `${voice.name} (${voice.lang})`; selection.append(option);
    });
    if (!voices.length) {
      const option = document.createElement('option'); option.textContent = 'No device voices available yet'; selection.append(option);
    } else selection.value = voices.some(v => v.voiceURI === previous) ? previous : (voices.find(v => /^en\b/i.test(v.lang)) || voices[0]).voiceURI;
    selection.disabled = !voices.length;
  }
  function off() { expanded = false; narrator.disable(); }
  toggle.onclick = () => {
    if (expanded) { off(); return; }
    expanded = true; populateVoices(); narrator.enable();
  };
  $('voiceOff').onclick = () => { off(); toggle.focus({preventScroll:true}); };
  $('voicePause').onclick = () => narrator.state().paused ? narrator.resume() : narrator.pause();
  $('voiceReplay').onclick = () => { populateVoices(); narrator.replay(); };
  $('voiceText').onclick = () => { textVisible = !textVisible; update(narrator.state()); };
  $('voiceChoice').onchange = event => narrator.selectVoice(event.target.value);
  $('voiceRate').onchange = event => narrator.setRate(Number(event.target.value));
  window.speechSynthesis?.addEventListener('voiceschanged', populateVoices);
  document.addEventListener('visibilitychange', () => { if (document.hidden) narrator.pause(); });
  window.addEventListener('pagehide', off);
  window.DLAVoice = {
    scene(title, lines) { narrator.scene(title, lines); },
    clear() { narrator.scene('', []); },
    reset() { off(); narrator.scene('', []); },
    pause() { narrator.pause(); }
  };
  populateVoices(); update(narrator.state());
})();
