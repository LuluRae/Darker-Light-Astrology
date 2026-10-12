# Shadow Astrology integration

The user requested the missing daily Moon calendar and shadow reflections, with longer descriptions and a playful tone. The original files remain unchanged. Their features and writing themes are adapted into the active static frontend rather than adding a second birth form or a second chart calculator.

## Sources and use

- The older application’s `backend/logic/moon.js` supplied the phase-sector and daily-noon approach. `shadow.js` and `natalShadow.js` supplied phase, planetary, sign, and rising reflection themes. Copy has been expanded and rewritten as optional questions rather than claims about a visitor’s wounds or behaviour.
- The Shadow Moon Wholeness prototypes supplied daily doors, grounding questions, and a private note/keepsake idea. Their January 2027 values and fixed Balsamic tester profile are not imported as live calculations.
- `lunadoor (1).zip` → `chart.html` supplied Moon, Pluto, and combined reflection sections. Its separate timezone form, noon substitution for unknown birth times, aspects, pricing, and storage are not imported.

## Current implementation

- `lunar-calendar-engine.js`: real geocentric phase angle, illumination, and tropical Moon longitude from pinned Astronomy Engine 2.1.19. Converts each local noon using the existing date/zone round-trip routine. Eight phase names are angular sectors, not exact event timestamps.
- `lunar-calendar.js`: header shortcut, monthly doors, local-date navigation, detailed daily prompts, optional in-memory notes, explicit text download, and a clearly separate birth-Moon summary when a chart exists. No localStorage, sessionStorage, account, or note upload. Notes clear when birth details change or the page closes.
- `shadow-journey.js`: detailed reflections for ten planets, rising, and mean nodes. Reads the same chart object and exposes Moon/Pluto themes together without claiming an aspect.
- `shadow-room.js`: chart shortcut and destination links to the shadow study, plus opt-in narration. Reset hides the study and clears derived content.
- Existing Moon chapter and What/How/Where/Deeper layers reuse the expanded interpretation. No new backend is required.

The calendar’s astronomical values vary with the date; its editorial phase prompts repeat across matching phases. It is not the planned individually personalized daily horoscope add-on described on The Threshold Reading. That offering remains coming soon.

## Source fingerprints (SHA-256)

- Older application / moon.js: `667abac6a499281140e9ac3a5c7af848228dd30efdd86bc191dc7d55aa6fe9d2`
- Older application / shadow.js: `58d831be4599705687c74ed3bf851d8690fe3c343affea36af66cb3241af17b1`
- Older application / natalShadow.js: `52e94f5247a0403f76fd308b9bc51d2435ca0f614c45e3e91a0ed75048e5a66d`
- Downloads / Shadow_Moon_Wholeness_Website_Prototype.html: `0bbcf4dc92e6c05fcb04833e7340623ddbe8fd38cf009925bafaa5b4a2334aed`
- Downloads / Shadow_Moon_Wholeness_14_Day_Tester_Mobile_Optimized.html: `26668ccf3266f5fd5e77ebd013c3ad353300f33188f6a54d5551d6e7d0dcd405`
- Downloads / lunadoor (1).zip: `fca819aa13fb702d56bd70981a6ca97ff17e574e8dd08c0133a4228e90d785ed`

## Tear-away advent pages

The Moon calendar opens on today's large paper sheet. **Choose another date** expands the month board underneath. Use **Tear off the page** to curl and drop the cover, revealing the calculated phase and detailed reflection beneath it. Previous/next day and **Next page** advance across month boundaries. Opened sheets are remembered only in tab memory, independently of private notes. Any date can be opened; there are no payment or date locks. Switching dates/months, closing the calendar, or leaving the chart room cancels an unfinished tear and restores the cover so it cannot reveal or narrate an old day. Pause motion/reduced motion reveal the page immediately. The reveal UI has not yet been browser-verified.
