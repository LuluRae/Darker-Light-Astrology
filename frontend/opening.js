(function () {
  'use strict';
  const hero = document.querySelector('.hero'), birth = document.querySelector('.birth-panel');
  const headline = hero.querySelector('h1'), intro = hero.querySelector('p'), eyebrow = hero.querySelector('.eyebrow');
  const threshold = hero.querySelector('.threshold');
  const ring = document.querySelector('.vortex-spiral').cloneNode(true);
  ring.classList.add('opening-spiral'); threshold.prepend(ring);
  threshold.insertAdjacentHTML('afterbegin','<span class="dream-object dream-key" aria-hidden="true">⚿</span><span class="dream-object dream-star" aria-hidden="true">✦</span><span class="dream-object dream-moon" aria-hidden="true">☾</span>');
  hero.insertAdjacentHTML('beforeend', '<div class="opening-actions"><button type="button" id="followOpening">Follow the rabbit ↓</button><div id="openingChoices" class="opening-choices" hidden><button type="button" data-opening-thread="Moon">What I need</button><button type="button" data-opening-thread="Venus">How I connect</button><button type="button" data-opening-thread="Pluto">What keeps changing</button></div><p id="openingHint" class="mini">A question first. Your chart when you’re ready.</p><button type="button" id="skipOpening" class="skip-opening">Go straight to my chart →</button></div>');
  headline.textContent = 'Some patterns keep finding you.';
  eyebrow.textContent = 'A little curiosity. A very deep hole.';
  intro.textContent = 'The same pull. A familiar reaction. A part of you that never quite fits the explanation. What if you could look at the pattern from another angle?';
  headline.tabIndex = -1;
  hero.classList.add('dream-opening'); birth.hidden = true;
  let selected = 'Sun';
  const follow = document.getElementById('followOpening'), choices = document.getElementById('openingChoices');
  function transition() {
    hero.classList.remove('opening-shift'); void hero.offsetWidth; hero.classList.add('opening-shift');
    headline.focus({preventScroll:true});
  }
  function invite() {
    hero.classList.add('opening-complete'); birth.hidden = false;
    headline.textContent = 'Let’s find your thread.';
    intro.textContent = 'Your birth chart gives us the places to explore. The rabbit will follow one theme through its planet, sign, and house, then help you notice how the pieces connect.';
    eyebrow.textContent = 'Your own sky. Your own way down.';
    document.querySelector('.opening-actions').hidden = true;
    threshold.querySelector('.threshold-caption').textContent = '“At last. A proper starting point. Mind the drop.”';
    birth.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused')?'instant':'smooth',block:'center'});
    document.getElementById('date').focus({preventScroll:true});
  }
  follow.onclick = () => {
    hero.classList.add('opening-deeper');
    headline.textContent = 'Which thread pulls at you?';
    intro.textContent = 'You can need comfort and still crave change. Want closeness and still protect your space. A chart gives us more than one character to follow. Where shall we start?';
    eyebrow.textContent = 'The first turn in the tunnel';
    threshold.querySelector('.threshold-caption').textContent = '“Oh, good. A complicated question. Those have the best doors.”';
    follow.hidden = true; choices.hidden = false;
    document.getElementById('openingHint').textContent = 'Choose a curiosity. We’ll explore it, not turn it into a verdict.';
    transition();
  };
  const hooks = {
    Moon: ['What helps you feel at home?', 'The Moon gives us a language for needs and instinct. We’ll look at its sign and house together: how those needs might be expressed, and where you could explore them in everyday life.'],
    Venus: ['What draws you close?', 'Venus opens questions about attraction, values, and connection. Its sign and house add different layers. We’ll follow the combination, rather than reduce the story to one label.'],
    Pluto: ['What is asking to change?', 'Pluto is one way into questions of power, vulnerability, and renewal. We’ll start with its place in your chart and explore it as a reflection prompt, not a prediction.']
  };
  choices.querySelectorAll('button').forEach(button => button.onclick = () => {
    selected = button.dataset.openingThread;
    [headline.textContent,intro.textContent] = hooks[selected];
    eyebrow.textContent = selected + ' · a doorway, not the whole story';
    choices.hidden = true; follow.hidden = false; follow.textContent = 'Take me into my chart ↓'; follow.onclick = invite;
    threshold.querySelector('.threshold-caption').textContent = '“There. That’s a thread worth being late for.”';
    document.getElementById('openingHint').textContent = 'Next: your birth details. Then we follow your calculated placements.';
    transition();
  });
  document.getElementById('skipOpening').onclick = invite;
  const arrive = DLAExperience.arrive;
  DLAExperience.arrive = function () {
    // Use the visitor's curiosity to choose a thread only after calculation succeeds.
    document.dispatchEvent(new CustomEvent('dla-planet',{detail:selected}));
    arrive();
  };
})();
