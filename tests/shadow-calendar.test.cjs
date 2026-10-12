const {test} = require('node:test');
const assert = require('node:assert/strict');
const Astronomy = require('astronomy-engine');
const chartEngine = require('../frontend/chart-engine.js')(Astronomy);
const lunar = require('../frontend/lunar-calendar-engine.js')(Astronomy,chartEngine);
const shadow = require('../frontend/shadow-journey.js');

test('daily snapshots follow the selected local date across DST and fractional zones', () => {
  assert.equal(lunar.day('2024-03-09','America/Chicago').instant,'2024-03-09T18:00:00.000Z');
  assert.equal(lunar.day('2024-03-10','America/Chicago').instant,'2024-03-10T17:00:00.000Z');
  assert.equal(lunar.day('2024-11-03','America/Chicago').instant,'2024-11-03T18:00:00.000Z');
  assert.equal(lunar.day('2024-03-10','Asia/Kathmandu').instant,'2024-03-10T06:15:00.000Z');
  assert.equal(lunar.day('2024-03-10','Pacific/Kiritimati').instant,'2024-03-09T22:00:00.000Z');
});

test('known eclipse and full-Moon instants produce real phase and illumination values', () => {
  const eclipse = lunar.at(new Date('2024-04-08T18:21:00Z'));
  assert.equal(eclipse.phaseId,'new'); assert.equal(eclipse.moonSign,'Aries');
  assert.ok(eclipse.illumination < 0.02);
  const full = lunar.at(new Date('2024-03-25T07:00:00Z'));
  assert.equal(full.phaseId,'full'); assert.equal(full.moonSign,'Libra');
  assert.ok(full.illumination > 99.9);
  assert.equal(lunar.phaseAt(359)[0],'new'); assert.equal(lunar.phaseAt(22.5)[0],'waxing-crescent');
});

test('calendar handles leap years, month boundaries and historically skipped local dates', () => {
  assert.equal(lunar.month('2024-02','America/Chicago').length,29);
  assert.equal(lunar.month('2025-02','America/Chicago').length,28);
  assert.equal(lunar.month('2026-12','America/Chicago').at(-1).iso,'2026-12-31');
  const samoa = lunar.month('2011-12','Pacific/Apia');
  assert.equal(samoa[29].unavailable,true); assert.ok(!samoa[28].unavailable); assert.ok(!samoa[30].unavailable);
});

test('invalid dates, zones and missing engines never receive sample Moon data', () => {
  assert.throws(()=>lunar.day('2024-02-30','UTC'));
  assert.throws(()=>lunar.day('2024-04-08','made/up'));
  assert.throws(()=>lunar.month('2026-13','UTC'));
  assert.throws(()=>lunar.month('2026-10',''));
  assert.throws(()=>require('../frontend/lunar-calendar-engine.js')(null,chartEngine).month('2026-10','UTC'),/did not load/);
  assert.throws(()=>lunar.at(new Date('invalid')));
  assert.throws(()=>lunar.guidance({phaseId:'made-up'}));
});

test('all daily phase reflections include detailed guidance without replacing astronomical values', () => {
  const phases = new Set();
  for (const day of lunar.month('2026-10','America/Chicago')) {
    const before = JSON.stringify(day), guide = lunar.guidance(day);
    assert.ok(guide.text.split(/\s+/).length > 75);
    assert.ok(guide.question && guide.practice);
    assert.equal(JSON.stringify(day),before); phases.add(day.phaseId);
  }
  assert.equal(phases.size,8);
});

test('shadow reflections read real placements across every sign and house without mutation', () => {
  const signs = new Set(), houses = new Set();
  for (let day = 1; day <= 31; day++) {
    const chart = chartEngine.calculate(new Date(Date.UTC(2026,9,day,12)),40.7,-74);
    const before = JSON.stringify(chart);
    for (const p of [...chart.list,chart.node,chart.south]) {
      const story = shadow.reflection(chart,p.name);
      assert.equal(story.sign,p.sign); assert.equal(story.house,p.house);
      assert.ok(story.placement.includes(p.degree));
      assert.ok(story.theme.split(/\s+/).length > 50);
      assert.ok(story.style.split(/\s+/).length > 50);
      signs.add(story.sign); houses.add(story.house);
    }
    const rising = shadow.reflection(chart,'Rising'); assert.equal(rising.sign,chartEngine.sign(chart.asc));
    assert.match(rising.placement,/approximate/);
    const pairing = shadow.together(chart);
    assert.equal(pairing.placements[0],shadow.reflection(chart,'Moon').placement);
    assert.equal(pairing.placements[1],shadow.reflection(chart,'Pluto').placement);
    assert.match(pairing.note,/does not claim.*aspect/);
    assert.equal(JSON.stringify(chart),before);
  }
  assert.equal(signs.size,12); assert.equal(houses.size,12);
});

test('shadow study refuses missing or invented placements', () => {
  assert.throws(()=>shadow.reflection(null,'Moon'));
  assert.throws(()=>shadow.reflection({list:[]},'Pluto'));
  assert.throws(()=>shadow.together({list:[]}));
  assert.throws(()=>shadow.reflection({list:[{name:'Moon',sign:'Nope',house:1}]},'Moon'));
});
