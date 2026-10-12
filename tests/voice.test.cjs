const {test} = require('node:test');
const assert = require('node:assert/strict');
const {create, chunks} = require('../frontend/voice-engine.js');

function fixture(options = {}) {
  const utterances = [], states = [];
  class Utterance { constructor(text) { this.text = text; } }
  const voices = [
    {voiceURI:'remote',lang:'en-US',localService:false},
    {voiceURI:'local-en',lang:'en-US',localService:true},
    {voiceURI:'local-two',lang:'en-GB',localService:true}
  ];
  let current = null;
  const synthesis = {
    getVoices: () => options.noVoices ? [] : voices,
    cancel() { const old = current; current = null; old?.onerror?.({error:'interrupted'}); },
    speak(utterance) { current = utterance; utterances.push(utterance); }
  };
  const engine = create({synthesis,Utterance,onChange:s=>states.push(s)});
  return {engine,utterances,states,synthesis};
}
const scene = [{speaker:'Rabbit',text:'We are late.'},{speaker:'Story',text:'Choose the mirror or the door.'}];

test('speech requires opting in and uses a device voice, never a remote default', () => {
  const {engine,utterances} = fixture();
  engine.scene('Moon',scene); assert.equal(utterances.length,0);
  engine.enable(); assert.equal(utterances[0].text,'We are late.');
  assert.equal(utterances[0].voice.voiceURI,'local-two');
  utterances[0].onend(); assert.equal(utterances[1].text,'Choose the mirror or the door.');
  assert.equal(utterances[0].voice,utterances[1].voice);
  assert.equal(utterances[0].pitch,utterances[1].pitch);
  utterances[1].onend(); assert.equal(engine.state().status,'finished');
});
test('changing rooms cancels speech and ignores delayed callbacks from the previous room', () => {
  const {engine,utterances} = fixture();
  engine.scene('Moon',scene); engine.enable(); const old = utterances[0];
  engine.scene('Venus',[{text:'This is Venus.'}]);
  old.onend(); old.onerror({error:'interrupted'});
  assert.equal(utterances.length,2); assert.equal(engine.state().title,'Venus');
  assert.equal(engine.state().status,'speaking'); assert.equal(utterances[1].text,'This is Venus.');
});
test('pause survives a scene change and resume starts the current line', () => {
  const {engine,utterances} = fixture();
  engine.scene('Moon',scene); engine.enable(); engine.pause();
  const old = utterances[0]; engine.scene('Door',[{text:'House eleven.'}]); old.onend();
  assert.equal(utterances.length,1); assert.equal(engine.state().paused,true);
  engine.resume(); assert.equal(utterances[1].text,'House eleven.');
  engine.pause(); engine.resume(); assert.equal(utterances[2].text,'House eleven.');
});
test('turning voice off and clearing a scene cannot leave stale speech running', () => {
  const {engine,utterances} = fixture();
  engine.scene('Moon',scene); engine.enable(); const old = utterances[0]; engine.disable(); old.onend();
  assert.equal(utterances.length,1); assert.equal(engine.state().enabled,false);
  engine.scene('',[]); engine.replay(); assert.equal(utterances.length,1); assert.equal(engine.state().status,'ready');
});
test('replay keeps the same single narrator and fixed storybook pace', () => {
  const {engine,utterances} = fixture();
  engine.scene('Moon',scene); engine.enable(); utterances[0].onend(); engine.replay();
  assert.equal(utterances[2].text,'We are late.');
  assert.equal(utterances.at(-1).voice.voiceURI,'local-two');
  assert.equal(utterances.at(-1).rate,0.96);
  assert.equal(engine.selectVoice,undefined);
  assert.equal(engine.setRate,undefined);
});
test('missing or blocked speech has an explicit error state for the text fallback', () => {
  const unsupported = create({}); unsupported.scene('Moon',scene); unsupported.enable();
  assert.equal(unsupported.state().status,'error'); assert.match(unsupported.state().error,/unavailable/);
  const {engine,utterances} = fixture({noVoices:true}); engine.scene('Moon',scene); engine.enable();
  assert.equal(utterances.length,0); assert.equal(engine.state().status,'error');
  const allowed = fixture(); allowed.engine.scene('Moon',scene); allowed.engine.enable();
  allowed.utterances[0].onerror({error:'not-allowed'});
  assert.match(allowed.engine.state().error,/Replay/);
});
test('spoken chunks expand chart punctuation without losing decimal degrees', () => {
  const parts = chunks('Moon in Scorpio · 13.3°. ' + 'A useful sentence to listen to. '.repeat(20));
  assert.ok(parts.join(' ').includes('13.3 degrees'));
  assert.ok(parts.every(part=>part.length<=210));
  assert.deepEqual(chunks(''),[]);
});
