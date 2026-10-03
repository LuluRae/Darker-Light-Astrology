const {test} = require('node:test');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const Astronomy = require('astronomy-engine');
const engine = require('../frontend/chart-engine.js')(Astronomy);
const journey = require('../frontend/rabbit-journey.js');

test('birth instant is independent of computer timezone, including fractional offsets', () => {
  for (const TZ of ['UTC', 'America/Chicago', 'Asia/Kathmandu']) {
    const output = execFileSync(process.execPath, ['-e', `const e=require('./frontend/chart-engine.js')(); console.log(e.birthInstant('2000-01-01','12:00','5.75').toISOString())`], {cwd: require('node:path').resolve(__dirname, '..'), env: {...process.env, TZ}, encoding:'utf8'});
    assert.equal(output.trim(), '2000-01-01T06:15:00.000Z');
  }
  assert.equal(engine.birthInstant('2000-01-01','23:30',-5).toISOString(), '2000-01-02T04:30:00.000Z');
});
test('missing, invalid, or rolled-over birth input is rejected', () => {
  for (const args of [['2024-02-30','12:00',0], ['2000-01-01','24:00',0], ['2000-01-01','',0], ['2000-01-01','12:00',''], ['2000-01-01','12:00',15]]) {
    assert.throws(() => engine.birthInstant(...args));
  }
});
test('whole-sign houses begin at the sign boundary, with zodiac wraparound', () => {
  assert.equal(engine.wholeSignHouse(31, 59), 1);
  assert.equal(engine.wholeSignHouse(60, 59), 2);
  assert.equal(engine.wholeSignHouse(359, 5), 12);
  assert.equal(engine.wholeSignHouse(0, 359), 2);
});
test('real geocentric calculations at J2000 produce all ten bodies and opposing mean nodes', () => {
  const chart = engine.calculate(new Date('2000-01-01T12:00:00Z'), 40.7128, -74.006);
  assert.equal(chart.list.length, 10);
  const sun = chart.list.find(p => p.name === 'Sun');
  const moon = chart.list.find(p => p.name === 'Moon');
  // Broad astronomical reference checks at J2000, not a duplicate of the implementation.
  assert.ok(Math.abs(sun.lon - 280.37) < 0.1);
  assert.ok(Math.abs(moon.lon - 223.32) < 0.1);
  assert.equal(sun.sign, 'Capricorn');
  assert.equal(moon.sign, 'Scorpio');
  for (const p of [...chart.list, chart.node, chart.south]) {
    assert.ok(p.lon >= 0 && p.lon < 360);
    assert.ok(p.house >= 1 && p.house <= 12);
  }
  assert.ok(Math.abs((chart.south.lon-chart.node.lon+360)%360 - 180) < 1e-10);
  assert.equal(chart.metadata.houses, 'whole-sign');
  assert.equal(chart.metadata.nodes, 'mean');
  assert.ok(!('mc' in chart)); // Do not expose the old sidereal-angle-as-MC placeholder.
});
test('Sun crosses the tropical Aries boundary at the March equinox', () => {
  const c = engine.calculate(new Date('2024-03-20T03:06:00Z'), 0, 0);
  const sun = c.list.find(p=>p.name==='Sun');
  assert.ok(Math.min(sun.lon, 360-sun.lon) < 0.02);
});
test('journey reads the same chart and preserves its calculations through every layer', () => {
  const c = engine.calculate(new Date('1990-07-15T18:00:00Z'), 34.05, -118.24);
  const before = JSON.stringify(c);
  for (const name of ['Sun','Moon','North Node','Pluto']) {
    const layers = journey.steps(c, name);
    const p = [...c.list,c.node].find(p=>p.name===name);
    assert.deepEqual(layers.map(p=>p.label), ['WHAT','HOW','WHERE','WAIT… WHAT DOES THAT MEAN?','DEEPER']);
    assert.ok(layers[1].title.includes(p.sign));
    assert.ok(layers[2].title.includes('House '+p.house));
  }
  assert.equal(JSON.stringify(c), before);
  assert.throws(()=>journey.steps(c, 'Invented Planet'));
});
test('unavailable engine or unsupported coordinates fail without fabricated placements', () => {
  assert.throws(()=>require('../frontend/chart-engine.js')().calculate(new Date(), 0, 0), /did not load/);
  for (const coords of [[NaN,0], [90,0], [0,181]]) assert.throws(()=>engine.calculate(new Date(), ...coords));
});

test('birthplace time zone handles seasons, fractional offsets, and historical rule changes', () => {
  const utc=(d,t,z)=>engine.birthInstantsInZone(d,t,z).map(d=>d.toISOString());
  assert.deepEqual(utc('2000-01-01','07:00','America/New_York'),['2000-01-01T12:00:00.000Z']);
  assert.deepEqual(utc('2000-07-01','07:00','America/New_York'),['2000-07-01T11:00:00.000Z']);
  assert.deepEqual(utc('2000-01-01','12:00','Asia/Kathmandu'),['2000-01-01T06:15:00.000Z']);
  assert.deepEqual(utc('2006-03-20','12:00','America/New_York'),['2006-03-20T17:00:00.000Z']);
  assert.deepEqual(utc('2007-03-20','12:00','America/New_York'),['2007-03-20T16:00:00.000Z']);
});
test('clock changes never silently shift birth times or guess repeated times', () => {
  assert.throws(()=>engine.birthInstantsInZone('2024-03-10','02:30','America/New_York'),/skipped/);
  assert.deepEqual(engine.birthInstantsInZone('2024-11-03','01:30','America/New_York').map(d=>d.toISOString()), ['2024-11-03T05:30:00.000Z','2024-11-03T06:30:00.000Z']);
  assert.throws(()=>engine.birthInstantsInZone('2000-01-01','12:00',undefined),/time zone/);
});
