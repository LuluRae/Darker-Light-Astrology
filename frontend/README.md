# Darker Light Astrology — the Rabbit Hole

Open chart-rabbit.html. Birth details are immediately available; there is no preliminary story gate. The enchanted forest, fireflies, zodiac ring and tunnel are decorative scenery. A successful calculation opens the visitor's actual chart map. **My chart**, **Planet placements**, **Shadow reflections** and **Moon calendar** provide direct access.

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

The chase treatment uses brief red-coat traces and golden glints rather than large front-facing rabbit portraits. A selection sends the trace ahead while the view descends; destination clues suggest the rabbit has just moved on. The original portrait stays saved in assets/rabbit-guide.png, but the active journey does not render it. chase.css supplies the trail and descent treatment. Rapid selections, leaving for the calendar/study, and form edits cancel pending arrivals. Motion pause and reduced-motion preferences apply.

The forest painting is assets/enchanted-forest-rabbit-hole.png; its final built-in image-generation prompt is in assets/FOREST.md. The original Wonderland painting is preserved. The Moon chapter keeps its own conservatory scenery. Deploy the complete frontend assets together.

## Moon chapter and shadow study

Selecting Moon opens the Moonlit Conservatory. Mirror, door and teacup provide guided or free exploration of sign, house and a practical reflection. The longer descriptions read the exact calculated Moon. The painted Moon is scenery, not a birth-phase calculation.

The shadow study adapts the user's earlier Shadow Astrology and Luna Door materials to the same chart: ten planets, rising, mean nodes and a Moon/Pluto reflection explored together. It adds strengths, possible patterns, setting, questions and practical choices, with a lightly sarcastic tone. It never asserts a Moon–Pluto aspect. SHADOW-INTEGRATION.md records sources and fingerprints.

Moon discovery progress and notes stay in tab memory for the current chart. Input edits/recalculation reset them. **Save my Moon note** downloads a plain-text keepsake only on an explicit click. No private note is included in narration.

## Daily Moon calendar

**Moon calendar** works before or after birth-chart calculation. Monthly doors show real daily geocentric Moon phase, lit percentage, tropical sign and degree at **local noon in the device's current timezone**. The timezone is shown in plain text, separately from the birthplace timezone used for the natal chart. Today and previous/next month controls cover 1900–2199. Historically skipped dates show an unavailable state instead of inventing a snapshot.

The eight phase names are 45° sectors around the cycle, not exact New/Full Moon event times. Illumination comes from Astronomy Engine independently. The Moon can change signs within a day. Editorial prompts repeat for matching phases; no predictive personal horoscope is claimed. With an existing chart, a separate birth-Moon summary includes its calculated birth phase and links to its shadow reflection. It does not change the birth chart.

Daily notes remain in a memory map keyed by local date. They can be downloaded explicitly, are never narrated or uploaded, and clear when birth details change or the page closes. No browser storage is used.

## One narrator

Listen is opt-in, with Pause/Resume, Replay, Voice off and Show/Hide text. There are no voice or pace selectors. The controller chooses one browser-reported local voice, preferring British English when available, and keeps it across story and quoted rabbit lines at a fixed gentle pace. Device sound varies; this is synthesized storytelling, not a performed Alice or Cheshire character voice.

Navigation cancels old speech and ignores late callbacks. Switching tabs pauses narration. Resume repeats the interrupted line; editing birth details turns narration off. Speech failure restores written content. No microphone, API key, paid voice service or cloud voice default is used. Direct Listen buttons are available in the calendar and study.

## The Threshold Reading

threshold-reading.html and its stylesheet adapt the user-provided page concept under Darker Light Astrology branding. Links open separately to preserve the chart tab. The page includes the reading overview, planned process, keepsakes and **optional extra: a personalized daily Moon-phase horoscope paired with a unique shadow-style reflection prompt**. Personal audio is also a planned option.

Bookings remain coming soon. There are no payments, intake submission, daily delivery, subscriptions or prices enabled. Opening bookings requires a real destination, scope, price, delivery window and intake/privacy details. The optional personalized service is distinct from the free calendar's repeating editorial phase prompts.

## Verification

Run pnpm install --frozen-lockfile and pnpm test from the repository root. The 25 automated checks cover real natal positions, timezone/DST boundaries, houses, lunar eclipse/full-Moon reference times, leap months, skipped local dates, all signs/houses, interpretation immutability, voice consent, the single local narrator, interruption, pause/replay and error fallback.

JavaScript and inline-script syntax, local asset references, duplicate static HTML IDs and diff formatting are checked. The current calendar/study/chase UI and audible narration have **not** been browser-verified: automation blocks the local file preview. Earlier chart-first and Moon browser flows passed before these changes. tests/browser-smoke.cjs and tests/moon-browser.cjs remain available for a permitted browser environment; they are not evidence for the latest UI.

The old educational rabbit-hole-v1.html and opening scripts are retained, but the active page loads no preliminary opening sequence. This branch is a draft, not a deployment.

## Tear-away advent pages

The Moon calendar presents numbered paper sheets on a forest board. Choose a date, then use **Tear off the page** to curl and drop the cover, revealing the calculated phase and detailed reflection. **Next page** advances across month boundaries. Opened sheets are remembered only in tab memory, independently of private notes. Any date can be opened; there are no payment or date locks. Switching dates/months, closing the calendar, or leaving the chart room cancels an unfinished tear so it cannot reveal or narrate an old day. Pause motion/reduced motion reveal the page immediately. The reveal UI has not yet been browser-verified.
