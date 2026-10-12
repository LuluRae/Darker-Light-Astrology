# Darker Light Astrology — the Rabbit Hole

Open chart-rabbit.html. The homepage welcomes visitors with **Let your shadow shine.** Birth details are immediately available; there is no preliminary story gate. The enchanted forest, fireflies, zodiac ring and tunnel are decorative scenery. A successful calculation opens the visitor's actual chart map. **My chart**, **Planet placements**, **Shadow reflections** and **Moon calendar** provide direct access.

## Chart calculations

chart-engine.js is the DOM-free calculation boundary, consumed by every interpretation layer. Astronomy Engine is pinned to 2.1.19; the static page loads it from jsDelivr. Tests use the same package locally.

- Sun uses SunPosition().elon; Moon uses EclipticGeoMoon().lon; other planets use geocentric GeoVector plus Ecliptic.
- Tropical zodiac, whole-sign houses beginning at the rising sign boundary, explicitly mean lunar nodes.
- Visitors enter local birth time. Open-Meteo supplies birthplace coordinates and timezone; browser Intl rules handle the birth date's offset and daylight saving. Skipped times fail visibly; repeated times require choosing an occurrence. No current-offset guess or unknown-time noon chart is substituted.
- Rising uses the inherited fixed-obliquity approximation. Locations at or beyond 66° latitude are rejected. No Midheaven or uncalculated aspects are claimed.
- Geocoding takes the first match and displays its region/country. Place disambiguation remains future work. Historical timezone accuracy depends on the browser database.
- Only the place query goes to Open-Meteo. Birth date, time, chart and private notes are not sent to the Darker Light API.

The merged PHP plugin exposes status routes; fast API is a directory sketch, main fast imports an absent router, and API endpoint sketches a moon-phase response. The browser calculator is the runnable integration point. A future backend must preserve the chart contract.

## Follow the trail

experience.js, chart-map.js and their styles create a whole-sign chart map. Stops are distributed within their actual houses for readability, not plotted at exact degrees. Exact degrees remain in the ledger. House doors list actual residents, including empty houses.

A compact symbol key sits beside the spiral on wide screens and underneath it on smaller screens. The planet/node symbols, names, and meanings come from the same calculated chart entries as the map stops. Expand **01–12 · The houses** for all twelve life areas. The key leaves the view when entering a destination.

The rabbit is a quiet visual guide along the path. Brief red-coat traces and golden glints lead the visitor onward; he has no dialogue or impatient, late-for-an-appointment persona. A selection sends the trace ahead while the view descends. Path captions replace speech bubbles, and all spoken lines belong to the single narrator. The original portrait stays saved in assets/rabbit-guide.png, but the active journey does not render it. chase.css supplies the trail and descent treatment. Rapid selections, leaving for the calendar/study, and form edits cancel pending arrivals. Motion pause and reduced-motion preferences apply.

The forest painting is assets/enchanted-forest-rabbit-hole.png; its final built-in image-generation prompt is in assets/FOREST.md. The original Wonderland painting is preserved. The Moon chapter keeps its own conservatory scenery. Deploy the complete frontend assets together.

## Moon chapter and shadow study

Selecting Moon opens the Moonlit Conservatory. Mirror, door and teacup provide guided or free exploration of sign, house and a practical reflection. The longer descriptions read the exact calculated Moon. The painted Moon is scenery, not a birth-phase calculation.

The shadow study adapts the user's earlier Shadow Astrology and Luna Door materials to the same chart: ten planets, rising, mean nodes and a Moon/Pluto reflection explored together. It adds strengths, possible patterns, setting, questions and practical choices, with a lightly sarcastic tone. It never asserts a Moon–Pluto aspect. SHADOW-INTEGRATION.md records sources and fingerprints.

The Shadow Reflections heading is the user's chosen quote: **“If you can’t find the light, I’ll sit in the dark with you.”** It belongs to this section, not the homepage.

Moon discovery progress and notes stay in tab memory for the current chart. Input edits/recalculation reset them. **Save my Moon note** downloads a plain-text keepsake only on an explicit click. No private note is included in narration.

## Daily Moon calendar

**Moon calendar** works before or after birth-chart calculation and opens on today's large paper sheet. Tear it away to reveal the real daily geocentric Moon phase, lit percentage, tropical sign and degree at **local noon in the device's current timezone**. Previous/next day and Today controls sit above the paper. The month board is below it, collapsed under **Choose another date**. The timezone is shown in plain text, separately from the birthplace timezone used for the natal chart. Date controls cover 1900–2199. Historically skipped dates show an unavailable state instead of inventing a snapshot.

The eight phase names are 45° sectors around the cycle, not exact New/Full Moon event times. Illumination comes from Astronomy Engine independently. The Moon can change signs within a day. Editorial prompts repeat for matching phases; no predictive personal horoscope is claimed. With an existing chart, a separate birth-Moon summary includes its calculated birth phase and links to its shadow reflection. It does not change the birth chart.

Daily notes remain in a memory map keyed by local date. They can be downloaded explicitly, are never narrated or uploaded, and clear when birth details change or the page closes. No browser storage is used.

## One narrator

Listen is opt-in, with Pause/Resume, Replay, Voice off and Show/Hide text. There are no voice or pace selectors. The controller chooses one browser-reported local voice, preferring British English when available, and keeps it across the narration at a fixed gentle pace. Device sound varies; this is synthesized storytelling, not a performed Cheshire character voice.

Navigation cancels old speech and ignores late callbacks. Switching tabs pauses narration. Resume repeats the interrupted line; editing birth details turns narration off. Speech failure restores written content. No microphone, API key, paid voice service or cloud voice default is used. Direct Listen buttons are available in the calendar and study.

The selected voice direction is a warm, mischievous Cheshire-style narrator with affectionate dry humor. The saved ElevenLabs MP3 appears in the voice panel as a single preview, and CHESHIRE-VOICE.md records its brief, script, and integration notes. Live calculated narration still uses the current device voice because no character-voice service is connected.

## The Threshold Reading

threshold-reading.html and its stylesheet adapt the user-provided page concept under Darker Light Astrology branding. Links open separately to preserve the chart tab. The page includes the reading overview, planned process, keepsakes and **optional extra: a personalized daily Moon-phase horoscope paired with a unique shadow-style reflection prompt**. Personal audio is also a planned option.

The optional **Moon & Shadow** monthly membership is presented as coming soon, with the tear-off calendar as its daily home: a planned chart-tailored Moon reading, fresh shadow prompt/practice, and weekly narrator audio. It is separate from the deeper personal Threshold Reading. Calendar and membership sections link to each other, and `chart-rabbit.html#moonCalendar` opens the free calendar directly. Current general phase prompts and future member personalization are explicitly distinguished. No price or working subscription is implied.

Bookings remain coming soon. There are no payments, intake submission, daily delivery, subscriptions or prices enabled. Opening bookings requires a real destination, scope, price, delivery window and intake/privacy details. The optional personalized service is distinct from the free calendar's repeating editorial phase prompts.

## Verification

Run pnpm install --frozen-lockfile and pnpm test from the repository root. The 25 automated checks cover real natal positions, timezone/DST boundaries, houses, lunar eclipse/full-Moon reference times, leap months, skipped local dates, all signs/houses, interpretation immutability, voice consent, the single local narrator, interruption, pause/replay and error fallback.

JavaScript and inline-script syntax, local asset references, duplicate static HTML IDs and diff formatting are checked. The current calendar/study/chase UI and audible narration have **not** been browser-verified: automation blocks the local file preview. Earlier chart-first and Moon browser flows passed before these changes. tests/browser-smoke.cjs and tests/moon-browser.cjs remain available for a permitted browser environment; they are not evidence for the latest UI.

The old educational rabbit-hole-v1.html and opening scripts are retained, but the active page loads no preliminary opening sequence. This branch is a draft, not a deployment.

## Tear-away advent pages

The large paper calendar comes before the optional month board. **Tear off the page** curls and drops the date cover, showing the calculated phase and reflection underneath as it falls. The underlying content stays inert and hidden from screen readers until the tear finishes. Previous/next day and **Next page** advance across month boundaries. Opened sheets are remembered only in tab memory, independently of private notes. Any date can be opened; there are no payment or date locks. Switching dates/months, closing the calendar, or leaving the chart room cancels an unfinished tear and restores the unopened cover so it cannot reveal or narrate an old day. Pause motion/reduced motion reveal the page immediately. The reveal UI has not yet been browser-verified.
