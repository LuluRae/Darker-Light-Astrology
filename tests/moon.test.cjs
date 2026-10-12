const {test} = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../frontend/chart-engine.js')(require('astronomy-engine'));
const moonJourney = require('../frontend/moon-journey.js');

test('Moon chapter follows real changing placements without mutating the chart', () => {
  const signs = new Set(), titles = new Set(), houses = new Set();
  const charts = [];
  for (let day = 1; day <= 30; day++) charts.push(engine.calculate(new Date(Date.UTC(2000,0,day,12)), 40.7, -74));
  for (let lon = -180; lon < 180; lon += 30) charts.push(engine.calculate(new Date('2000-01-01T12:00:00Z'), 0, lon));
  for (const chart of charts) {
    const before = JSON.stringify(chart), moon = chart.list.find(p => p.name === 'Moon');
    const chapter = moonJourney.chapter(chart);
    signs.add(chapter.sign); titles.add(chapter.mirror.title); houses.add(chapter.house);
    assert.equal(chapter.sign, moon.sign);
    assert.equal(chapter.house, moon.house);
    assert.ok(chapter.placement.includes(moon.degree));
    assert.ok(chapter.mirror.fact.includes(moon.sign));
    assert.ok(chapter.door.text.includes(`House ${moon.house},`));
    assert.equal(JSON.stringify(chart), before);
  }
  assert.equal(signs.size, 12); assert.equal(titles.size, 12); assert.equal(houses.size, 12);
});

test('Moon story does not substitute sample data for a missing or invalid placement', () => {
  for (const list of [[], [{name:'Moon',sign:'Unknown',house:1}], [{name:'Moon',sign:'Aries',house:0}], [{name:'Moon',sign:'Aries',house:13}], [{name:'Moon',sign:'Aries',house:1.5}]]) {
    assert.throws(() => moonJourney.chapter({list}), /calculated Moon/);
  }
});
