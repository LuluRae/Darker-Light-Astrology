# Darker Light Astrology — Rabbit Hole v1

This branch contains the first GitHub-native Rabbit Hole prototype.

## Experience
- One rabbit guide only.
- Progressive **What → How → Where → Deeper** learning.
- “WAIT… WHAT DOES THAT MEAN?” as the curiosity breakpoint.
- Pluto / Nodes / aspects framed as deeper threads rather than verdicts.
- Dark, sophisticated cosmic styling with a mischievous tone.

## Chart integration

Open `rabbit-hole-v1.html` and choose **Use my actual chart**. After entering birth details in `chart-rabbit.html`, choose Sun, Moon, Nodes, or Pluto and follow **What → How → Where → WAIT… → Deeper**. Each layer reads the same calculated chart; selecting another thread resets the journey. Changing birth details clears the previous result.

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

### Story opening and vortex descent

The opening now asks about recurring patterns, offers Moon/Venus/Pluto curiosities, and explains the selected theme before inviting birth details. These are general reflection prompts; the selection chooses a thread only after the real chart succeeds. A direct-to-chart option skips the prologue.

The chart is illustrated as a rotating cartoon vortex. Selecting a stop sends the red-waistcoated, bespectacled rabbit into it, then opens a destination scene with the actual placement or house residents. Return and Escape restore the vortex and focus. New selections cancel old dives, input edits invalidate pending arrivals, and reduced motion or Pause motion completes entry without a dive. Exact degrees remain in the full chart; decorative spiral positions are not an astronomical projection.

Deploy `opening.js`, `opening.css`, and `vortex.css` alongside the previously documented assets. Browser checks cover the prologue, chosen starting thread, skip route, dive/arrival/return, rapid choices, pause during a dive, empty/populated houses, and mobile destinations.

### Illustrated Wonderland setting

`wonderland.js` and `wonderland.css` add the painted environment in `assets/wonderland-rabbit-hole.png` to the entrance, chart vortex, and destination rooms. Foreground playing cards, fireflies, camera drift, and the red-waistcoated rabbit animate separately from the scenery. The curiosity choices appear as small doorways. Motion pause and reduced-motion preferences remain supported.

Deploy both Wonderland files and the `assets/` directory with the other frontend assets. The artwork was generated with the built-in image tool; its complete prompt is saved in `assets/ARTWORK.md`. The browser checks still cover the full chart flow and both desktop and mobile layouts.

### Approved illustrated rabbit

The character selected by the user is now `assets/rabbit-guide.png`. It replaces the old inline vector in the entrance, map, and destination room while retaining the existing character movement and dive controls. The PNG has an alpha channel; no background-removal service is required. Generate attribution and the final prompt are recorded in `assets/RABBIT.md`. Deploy the PNG with the rest of the assets.

### The Threshold Reading

The user-provided React landing-page concept is integrated as `threshold-reading.html` with `threshold-reading.css`, under Darker Light Astrology branding. It includes the reading overview, four feature cards, planned purchase/intake/delivery journey, and a coming-soon booking section. The existing static-file experience needs no React build, Framer Motion, Tailwind, or component-library installation to open it.

Header and invitation links open this page separately so the current chart and birth details remain in their original tab. No chart data is passed to the reading page. The reading page does not collect intake data, accept payments, or imply that a booking was completed. To open bookings later, supply a real booking destination and confirm the price, delivery window, privacy/intake process, and available audio option.
