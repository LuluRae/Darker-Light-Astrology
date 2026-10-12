(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.id = 'voiceToggle'; toggle.textContent = 'Cheshire voice';
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'voicePanel');
  $('openMoonCalendar').after(toggle);

  const panel = document.createElement('section');
  panel.id = 'voicePanel'; panel.className = 'voice-panel'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Cheshire narrator');
  panel.innerHTML = `<div class="voice-top"><div><span class="voice-eyebrow">Your Cheshire narrator</span><p id="voiceStatus" role="status">The chosen purring, smug performance.</p></div><button type="button" id="voiceOff">Close</button></div>
    <div class="cheshire-preview"><label for="cheshirePreview">Meet the Cheshire narrator</label><audio id="cheshirePreview" controls preload="metadata" src="assets/darker-light-cheshire-preview.mp3"></audio><small>This is the only voice used on the site. Personalized chart details remain written until this same character voice is connected securely.</small></div>`;
  document.body.append(panel);

  const preview = $('cheshirePreview');
  let expanded = false;
  function stopPreview() { preview.pause(); preview.currentTime = 0; }
  function render() {
    toggle.textContent = expanded ? 'Close voice' : 'Cheshire voice';
    toggle.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
  }
  function open(play = false) {
    expanded = true; render();
    if (play) preview.play().catch(() => { $('voiceStatus').textContent = 'Press play to meet the Cheshire narrator.'; });
  }
  function close() { stopPreview(); expanded = false; render(); }

  toggle.onclick = () => expanded ? close() : open(true);
  $('voiceOff').onclick = () => { close(); toggle.focus({preventScroll:true}); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) preview.pause(); });
  window.addEventListener('pagehide', close);

  // This facade keeps the journey controls simple without invoking browser speech synthesis.
  window.DLAVoice = {
    listen() { open(true); },
    scene() { if (!preview.paused) stopPreview(); },
    clear() { stopPreview(); },
    reset() { close(); },
    pause() { preview.pause(); }
  };
  render();
})();
