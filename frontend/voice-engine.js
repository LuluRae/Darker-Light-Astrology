/* Device speech only. Scene changes invalidate old callbacks and queued speech. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DLAVoiceEngine = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function chunks(text) {
    const words = String(text || '').replace(/°/g, ' degrees ').replace(/·/g, ', ').replace(/\s+/g, ' ').trim().split(' ');
    const result = []; let line = '';
    for (const word of words) {
      if (line && line.length + word.length > 210) { result.push(line); line = ''; }
      line += (line ? ' ' : '') + word;
      if (/[.!?]$/.test(word) && line.length > 35) { result.push(line); line = ''; }
    }
    if (line) result.push(line);
    return result;
  }
  function create({synthesis, Utterance, onChange = () => {}}) {
    const supported = !!(synthesis && Utterance);
    let enabled = false, paused = false, status = 'off', title = '', lines = [], index = 0;
    let generation = 0, current = null, voiceURI = '', rate = 1, error = '';
    const voices = () => supported ? synthesis.getVoices().filter(v => v.localService === true) : [];
    function state() { return {supported, enabled, paused, status, title, error, voiceURI, rate, line:lines[index] || null}; }
    function emit() { onChange(state()); }
    function cancel() {
      ++generation; current = null;
      if (supported) synthesis.cancel();
    }
    function fail(message) { cancel(); status = 'error'; paused = false; error = message; emit(); }
    function next() {
      if (!enabled || paused) return;
      if (index >= lines.length) { current = null; status = lines.length ? 'finished' : 'ready'; emit(); return; }
      const options = voices();
      const voice = options.find(v => v.voiceURI === voiceURI) || options.find(v => /^en\b/i.test(v.lang)) || options[0];
      if (!voice) { fail('No device voice is available yet. Try Replay in a moment, or continue with text.'); return; }
      const token = generation, utterance = new Utterance(lines[index].text);
      current = utterance; // Retain it while the browser is speaking.
      utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = rate;
      utterance.pitch = lines[index].speaker === 'Rabbit' ? 1.1 : 1;
      status = 'speaking'; error = ''; emit();
      utterance.onend = () => {
        if (token !== generation || current !== utterance) return;
        current = null; ++index; next();
      };
      utterance.onerror = event => {
        if (token !== generation || current !== utterance) return;
        fail(event.error === 'not-allowed' ? 'Tap Replay to start the voice here.' : 'The voice stopped. Try Replay, choose another voice, or continue with text.');
      };
      try { synthesis.speak(utterance); } catch (_) { fail('This browser could not start the voice. The written journey is still available.'); }
    }
    return {
      state, voices,
      scene(nextTitle, segments) {
        cancel(); title = nextTitle;
        lines = segments.flatMap(segment => chunks(segment.text).map(text => ({speaker:segment.speaker || 'Story', text})));
        index = 0; error = '';
        status = enabled ? (paused ? 'paused' : 'ready') : 'off';
        if (enabled && !paused) next(); else emit();
      },
      enable() {
        if (!supported) { error = 'Voice is unavailable in this browser. You can still explore with text.'; status = 'error'; emit(); return; }
        cancel(); enabled = true; paused = false; index = 0; next();
      },
      disable() { cancel(); enabled = false; paused = false; status = 'off'; error = ''; index = 0; emit(); },
      pause() {
        if (!enabled || status !== 'speaking') return;
        cancel(); paused = true; status = 'paused'; emit();
      },
      resume() { if (enabled && paused) { paused = false; next(); } },
      replay() { if (enabled) { cancel(); paused = false; index = 0; next(); } else this.enable(); },
      selectVoice(uri) {
        if (!voices().some(v => v.voiceURI === uri)) return;
        voiceURI = uri;
        if (enabled && !paused) this.replay(); else emit();
      },
      setRate(value) {
        if (![0.85, 1, 1.15].includes(value)) return;
        rate = value;
        if (enabled && !paused) this.replay(); else emit();
      }
    };
  }
  return {create, chunks};
});
