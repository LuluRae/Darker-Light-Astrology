# Darker Light Astrology — Rabbit Hole v1

This branch contains the first GitHub-native Rabbit Hole prototype.

## Experience
- One rabbit guide only.
- Progressive **What → How → Where → Deeper** learning.
- “WAIT… WHAT DOES THAT MEAN?” as the curiosity breakpoint.
- Pluto / Nodes / aspects framed as deeper threads rather than verdicts.
- Dark, sophisticated cosmic styling with a mischievous tone.

## Chart integration

Open `chart-rabbit.html` directly. The birth form is immediately available, and a successful calculation shows the chart map. There is no preliminary story screen or automatic room entry. The persistent **My chart** button returns from any room without recalculating or discarding Moon notes. **Planet placements** opens the full chart ledger, and **Edit birth details** returns to the form. Visitors can choose a planet or house to enter, including the Moonlit Conservatory. The **What → How → Where → WAIT… → Deeper** layers all read the same calculated chart. Changing birth details clears the previous result and hides the chart shortcut. The older educational prototype remains in `rabbit-hole-v1.html`, but the chart page's brand link now returns to its own birth form.

`chart-engine.js` extracts the existing browser calculator behind a DOM-free interface: `birthInstant(date, time, utcOffset)` and `calculate(utcDate, latitude, longitude)`. `rabbit-journey.js` consumes its placements without calculating or substituting example placements. Both pages remain static files; deploy `chart-engine.js`, `rabbit-journey.js`, `experience.js`, and `experience.css` beside the HTML.

The PHP plugin only exposes status routes. `fast API` is a directory sketch; `main fast` imports an absent Python router, and `API endpoint` sketches a moon-phase response. None is a runnable natal-chart service. The browser calculator is therefore the usable integration point in this merged branch. A future backend adapter must preserve this chart contract rather than treat a moon phase as a natal chart.

### Calculation conventions and limits

- Astronomy Engine stays pinned to 2.1.19. Sun/Moon use its geocentric routines; planets use `GeoVector` plus `Ecliptic`, not the heliocentric `EclipticLongitude` call.
- Tropical zodiac, whole-sign houses starting at the rising sign boundary, and explicitly mean lunar nodes.
- Visitors enter the local birth time only. The Open-Meteo birthplace timezone and browser Intl historical timezone rules convert it to UTC, including daylight saving. Missing timezones and skipped times fail visibly; repeated times require choosing before or after the clocks went back. Historical accuracy depends on the browser timezone database. No current-offset guess is used.
- The inherited rising calculation uses fixed obliquity, so its degree is approximate. Locations at or beyond 66° latitude are rejected in this version. No placeholder Midheaven or uncalculated aspects are returned.
- The first Open-Meteo place match is displayed with its region/country. City disambiguation remains future work; verify that the displayed place is the intended one.
- Birth details and charts remain in browser memory. Only the place query goes to Open-Meteo. There is no chart storage or new WordPress route.

### Verification

Run `pnpm install --frozen-lockfile` and `pnpm test` from the repository root. Tests use the real pinned engine, J2000 Sun/Moon reference positions, an equinox boundary, timezone variants, house boundaries, validation failures, and the journey's unchanged chart data.

Astronomy Engine API reference: https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md

## Animated experience

The chart page now leads with five illustrated scenes: planet, sign, house doors, a curiosity pause, and the deeper doorway. The rabbit guides scene transitions, while thread buttons and layer navigation allow free exploration. House doors are exploratory: the highlighted door always comes from the selected calculated placement. The full chart is available under an expandable summary. Scene graphics are illustrative, not an orbital diagram.

The animation uses local SVG and CSS, with no new third-party media dependency. Pause motion is always available, and reduced-motion preferences suppress animation. Errors and input edits invalidate the displayed chart and reset the journey.

Browser verification: with Playwright and Edge installed, run `node tests/browser-smoke.cjs`. It checks scene progression, house exploration, chart results, retries, mobile overflow, and motion controls. Optional screenshots are written under `tests/` and ignored by Git.

### Chart destinations and the late rabbit

`chart-map.js` and `chart-map.css` extend the scene into a circular whole-sign map. Each calculated planet and node is a keyboard-accessible destination in its actual house. Stops are spread within the house for readability; the map does not claim exact degree positioning. House doors report their actual residents, including empty houses. Clicking a stop changes the selected thread and makes the rabbit hop to it. The Where layer takes him to that placement’s house.

The local SVG cartoon has expressive eyes, oversized ears, a pocket watch, and a tapping foot. Hops use squash-and-stretch; rapid selections cancel the preceding hop. Pausing motion or enabling reduced motion finishes movement immediately at the selected destination. Deploy the two chart-map assets beside the existing experience assets.

### Direct entry and vortex descent

The former opening story has been removed from the active page. Birth details appear immediately, without a start/skip step. The scene becomes visible before the chart map is rendered; room entry waits for a visitor's choice and no longer depends on the old opening script.

The chart is illustrated as a rotating cartoon vortex. Selecting a stop sends the red-waistcoated, bespectacled rabbit into it, then opens a destination scene with the actual placement or house residents. Return and Escape restore the vortex and focus. New selections cancel old dives, input edits invalidate pending arrivals, and reduced motion or Pause motion completes entry without a dive. Exact degrees remain in the full chart; decorative spiral positions are not an astronomical projection.

Deploy `vortex.css` alongside the previously documented chart assets. `opening.js`, `opening.css`, and `wonderland.js` are legacy opening assets and are no longer loaded. Browser checks cover immediate form access, chart-first arrival, chart and placement shortcuts, dive/return, rapid choices, pause during a dive, empty/populated houses, and mobile destinations.

### Illustrated Wonderland setting

`wonderland.css` adds the painted environment in `assets/wonderland-rabbit-hole.png` to the chart vortex and destination rooms. The red-waistcoated rabbit animates separately from the scenery. Motion pause and reduced-motion preferences remain supported. The Moon chapter has its own scenery, light, and water effects.

Deploy `wonderland.css` and the `assets/` directory with the other frontend assets. The artwork was generated with the built-in image tool; its complete prompt is saved in `assets/ARTWORK.md`. The browser checks still cover the full chart flow and both desktop and mobile layouts.

### Approved illustrated rabbit

The character selected by the user is now `assets/rabbit-guide.png`. It replaces the old inline vector in the entrance, map, and destination room while retaining the existing character movement and dive controls. The PNG has an alpha channel; no background-removal service is required. Generate attribution and the final prompt are recorded in `assets/RABBIT.md`. Deploy the PNG with the rest of the assets.

### The Threshold Reading

The user-provided React landing-page concept is integrated as `threshold-reading.html` with `threshold-reading.css`, under Darker Light Astrology branding. It includes the reading overview, four feature cards, planned purchase/intake/delivery journey, and a coming-soon booking section. The existing static-file experience needs no React build, Framer Motion, Tailwind, or component-library installation to open it.

Header and invitation links open this page separately so the current chart and birth details remain in their original tab. No chart data is passed to the reading page. The reading page does not collect intake data, accept payments, or imply that a booking was completed. To open bookings later, supply a real booking destination and confirm the price, delivery window, privacy/intake process, and available audio option.

### The Moonlit Conservatory

Selecting the calculated Moon now opens a full chapter in `moon-room.js` and `moon-room.css`. The silver mirror explores the Moon sign, the numbered door explores its whole-sign house, and the teacup offers a reflection and a small practice. Visitors can follow the guided buttons or explore the three objects in any order. `moon-journey.js` supplies distinct interpretive content for all twelve signs and houses directly from the engine's Moon placement; it never changes the chart. The painted Moon is scenery, not a calculation of birth phase.

The approved rabbit hops between discoveries over `assets/moon-conservatory.png`; light and water effects honor Pause motion and reduced motion. The chapter flows with the page on mobile. Escape or Back returns to the map with focus restored. Revisiting the same calculated chart retains discovery progress and the optional reflection only in tab memory. Editing birth details or recalculating clears it. No personal note is uploaded or stored in browser storage. **Save my Moon note** explicitly downloads a plain text keepsake containing the calculated placement, prompts, suggested practice, and any note the visitor wrote.

Deploy the three Moon files and the new PNG alongside the other assets. Its built-in image-tool prompt and provenance are in `assets/MOON.md`. `node --test tests/*.test.cjs` covers real chart coverage across all signs and houses and preservation of calculations. `node tests/moon-browser.cjs` checks guided and free discovery, focus, downloading literal user text, state reset, movement controls, mobile layout, and absence of extra network requests during exploration. The existing `tests/browser-smoke.cjs` remains the full chart regression check.

### Voice, tone, and the entrance

After calculating a chart, **Listen** enables opt-in narration for the map, planet/house rooms, and the Moon discoveries. Pause, Resume, Replay, Voice off, device-voice selection, and three pacing options are in the voice controls. Text is initially reduced in listening mode; **Show text** restores it and displays the current spoken line. Any speech failure restores the written content. Leaving a scene cancels its narration, switching tabs pauses it, and editing birth details turns it off. Resume repeats the interrupted line. Narration never includes the visitor's private reflection or birth form values.

`voice-engine.js` only selects voices that the browser reports as local device services. No paid voice provider, API key, microphone, or cloud speech default is used. Device voice availability and quality vary; this is synthesized narration, not performed character dialogue. Browsers with no device voices retain the written journey. `voice.js` connects the controller to the UI; `voice.css` supplies controls and optional text. Speech API reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis . The seven controller tests cover consent, interrupted/late callbacks, pause/resume across navigation, replay, local voice selection, pacing, and failure fallback. Audible playback still needs checking in the user's browser.

The birth form remains the first screen. `entry-sky.js` and `entry-sky.css` add a decorative zodiac ring and rotating vortex over the existing Wonderland artwork behind it. They add no input gate, external dependency, or new chart calculation. Motion pause and reduced-motion settings apply. The Rabbit Hole, twelve Moon sign reflections, and Threshold Reading copy now use a mischievous, lightly sarcastic tone, with jokes aimed at cosmic bureaucracy rather than the visitor. The Threshold Reading remains coming soon.
