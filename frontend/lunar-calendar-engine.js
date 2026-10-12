/* The user's Moon calendar, adapted to the active chart engine and local-date rules. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.DLALunar = factory(root.Astronomy, root.DLAChart);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Astronomy, chartEngine) {
  'use strict';
  const phases = [
    ['new','New Moon','🌑'], ['waxing-crescent','Waxing Crescent','🌒'],
    ['first-quarter','First Quarter','🌓'], ['waxing-gibbous','Waxing Gibbous','🌔'],
    ['full','Full Moon','🌕'], ['waning-gibbous','Waning Gibbous','🌖'],
    ['last-quarter','Last Quarter','🌗'], ['waning-crescent','Waning Crescent','🌘']
  ];
  const copy = {
    new:['A beginning without a launch party','A quiet start still counts. Pick one intention small enough to live outside a vision board.','What beginning feels honest when I remove the pressure to make it impressive?','Write one small next step. The grand announcement can wait.'],
    'waxing-crescent':['A tiny spark. Please do not micromanage it.','Curiosity needs a little room before it becomes a plan. Give a new idea one practical bit of support.','What new interest deserves a little patience?','Spend five minutes on something you want to grow.'],
    'first-quarter':['A decision has entered the chat','A little friction can show you a choice. It does not automatically require a dramatic subplot.','Where could one clear decision help more than another debate?','Choose one manageable action and leave the rest for later.'],
    'waxing-gibbous':['Perfection would like another extension','Refinement is useful until it becomes a way to postpone being seen. Notice where enough might already be enough.','What am I still editing because finishing feels more vulnerable?','Make one useful adjustment, then choose a stopping point.'],
    full:['The spotlight has terrible timing','Use this phase as a reminder to notice what has become visible. A strong feeling can be heard without being appointed director.','What feeling needs an honest name before I decide what to do with it?','Name it privately, then choose a response at your own pace.'],
    'waning-gibbous':['The meeting could have been a lesson','After the big moment, there may be something useful to keep. You do not have to turn every experience into a sequel.','What did I learn, and what can I stop replaying?','Keep one useful lesson in a single sentence.'],
    'last-quarter':['The committee can release one task','Releasing a habit can be ordinary. No ceremonial thunderstorm is required.','Which familiar obligation could I reconsider?','Set down one small task that is no longer yours to carry.'],
    'waning-crescent':['Rest has no application form','Quiet can be part of the cycle. You can pause without presenting evidence that you have earned it.','What can become quieter today?','Notice the surface supporting you and take three easy breaths.']
  };
  const depth = {
    new:'In the reflection tradition used here, the New Moon marks a beginning with little visible light. Think of it as a chance to make room, rather than an instruction to know exactly what comes next. Notice the difference between something you want and something you think would look impressive. One honest intention can be more useful than twelve ambitious promises competing for the same Tuesday. You can revisit it as you learn; beginning does not require a binding contract with your future self.',
    'waxing-crescent':'The waxing crescent offers a symbol for early growth: visible enough to notice, still small enough to need patience. Consider a new interest, conversation, or habit. What would give it practical support without demanding immediate results? A little time, a useful tool, or permission to be inexperienced may help more than a grand declaration. Watch for the temptation to judge the whole possibility by its first attempt. The seed has not failed because it has yet to produce a dining table.',
    'first-quarter':'The quarter Moon gives this reflection its image of two visible halves. You might use it to examine a choice where two needs are both real: rest and progress, honesty and consideration, security and change. Instead of appointing one need the villain, ask what proportionate next step could acknowledge both. This is not a prediction of conflict or a demand to act today. It is a chance to distinguish a practical decision from the elaborate debate your mind may have organised around it.',
    'waxing-gibbous':'With more of the lunar disc lit, this phase becomes a metaphor for refinement. Look at something already underway and distinguish the adjustment that would genuinely help from the one that only delays finishing. Perhaps a project needs a clearer sentence, while you are trying to redesign your entire identity. Feedback can be information without becoming a verdict on your worth. Name what works already, choose one useful improvement, and decide how you will recognise enough. Perfection remains unavailable for comment.',
    full:'The Full Moon is used here as a symbol of visibility, not evidence that everyone must feel a certain way. What has become easier to see in a recent situation? You might notice satisfaction, disappointment, a need you have minimised, or a result you have not acknowledged. Give it a clear name before turning it into a conclusion about your future. A feeling can matter without being permanent, and something good can be enjoyed without immediately raising the target. The spotlight does not require a performance.',
    'waning-gibbous':'As the visible light begins to decrease, this reflection turns toward making sense of experience. Think of a recent event and separate what happened from the story you now tell about it. What would you like to repeat, change, or simply remember? You do not have to produce a profound lesson from everything. Sometimes “I needed more time” is enough. Keep something useful without carrying every detail forward. The rabbit has enough baggage and appears unwilling to check another suitcase.',
    'last-quarter':'This phase offers an image for reviewing what remains useful after a period of effort. Consider a habit, expectation, or commitment at a manageable scale. Is it still serving the reason you began it, and what would a reasonable revision look like? Release does not have to mean a dramatic ending or a rushed decision about a relationship. It might mean changing a routine, asking to renegotiate a task, or no longer treating an old preference as a permanent rule. Start with something ordinary and reversible.',
    'waning-crescent':'The thinning crescent is used as a symbol of completion and recovery before another cycle. You might notice what can be left unfinished for now and what genuinely needs a small closing action. Rest is not proof that momentum has disappeared; it can be part of how you sustain it. If quiet brings up a feeling, you can acknowledge it without solving everything at once. Choose a simple grounding action that feels comfortable. The universe has not requested a detailed productivity report from your sofa.'
  };
  function phaseAt(angle) {
    if (!Number.isFinite(angle)) throw new Error('Invalid Moon phase angle.');
    return phases[Math.floor((((angle%360)+360)%360+22.5)/45)%8];
  }
  function at(instant) {
    if (!Astronomy) throw new Error('The Moon calculator did not load. Reconnect and reload the page.');
    if (!(instant instanceof Date) || !Number.isFinite(+instant)) throw new Error('Invalid Moon calculation time.');
    const angle = Astronomy.MoonPhase(instant), lon = Astronomy.EclipticGeoMoon(instant).lon;
    const fraction = Astronomy.Illumination(Astronomy.Body.Moon, instant).phase_fraction;
    if (![angle,lon,fraction].every(Number.isFinite)) throw new Error('The Moon calculator returned an invalid result.');
    const [phaseId,phaseLabel,glyph] = phaseAt(angle);
    return {angle, lon, illumination:fraction*100, phaseId, phaseLabel, glyph, moonSign:chartEngine.sign(lon), moonDegree:chartEngine.deg(lon), instant:instant.toISOString()};
  }
  function day(iso, timeZone) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error('Choose a valid calendar date.');
    const candidates = chartEngine.birthInstantsInZone(iso, '12:00', timeZone);
    if (candidates.length !== 1) throw new Error('Local noon is repeated on this date; a daily snapshot is unavailable.');
    return {iso, timeZone, ...at(candidates[0])};
  }
  function month(value, timeZone) {
    if (!Astronomy) throw new Error('The Moon calculator did not load. Reconnect and reload the page.');
    if (!/^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.test(value)) throw new Error('Choose a month from 1900 through 2199.');
    // Validate the zone before producing individual unavailable-day cells.
    new Intl.DateTimeFormat('en', {timeZone}).format(new Date());
    if (!timeZone) throw new Error('Your device time zone is unavailable.');
    const [year,number] = value.split('-').map(Number), count = new Date(Date.UTC(year, number, 0)).getUTCDate();
    return Array.from({length:count}, (_,i) => {
      const iso = `${value}-${String(i+1).padStart(2,'0')}`;
      try { return day(iso, timeZone); }
      catch (error) { return {iso, unavailable:true, error:'A local-noon Moon snapshot is unavailable for this date. '+error.message}; }
    });
  }
  function guidance(snapshot) {
    if (!copy[snapshot?.phaseId]) throw new Error('A calculated Moon phase is needed for this reflection.');
    const [title,text,question,practice] = copy[snapshot.phaseId];
    return {title,text:text+' '+depth[snapshot.phaseId],question,practice};
  }
  return {at, day, month, phaseAt, guidance};
});
