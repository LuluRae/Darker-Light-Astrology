(function () {
  'use strict';
  const sky = document.querySelector('.entry-sky');
  const ns = 'http://www.w3.org/2000/svg';
  const wheel = document.createElementNS(ns, 'svg');
  wheel.setAttribute('viewBox', '0 0 800 800'); wheel.classList.add('entry-zodiac');
  // Decorative entrance scenery, not the visitor's calculated chart.
  for (const radius of [285, 345, 380]) {
    const ring = document.createElementNS(ns, 'circle');
    ring.setAttribute('cx', '400'); ring.setAttribute('cy', '400'); ring.setAttribute('r', radius); wheel.append(ring);
  }
  ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].forEach((glyph, index) => {
    const angle = (index * 30 - 90) * Math.PI / 180;
    const symbol = document.createElementNS(ns, 'text');
    symbol.setAttribute('x', 400 + Math.cos(angle) * 315); symbol.setAttribute('y', 400 + Math.sin(angle) * 315 + 11);
    symbol.textContent = glyph + '\uFE0E'; wheel.append(symbol);
    const ray = document.createElementNS(ns, 'path'), edge = angle + Math.PI / 12;
    ray.setAttribute('d', `M ${400+285*Math.cos(edge)} ${400+285*Math.sin(edge)} L ${400+380*Math.cos(edge)} ${400+380*Math.sin(edge)}`); wheel.append(ray);
  });
  sky.append(wheel);
})();
