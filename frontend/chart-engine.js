/* Shared browser/Node boundary: calculations have no DOM or network access. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.DLAChart = factory(root.Astronomy);
})(typeof globalThis !== "undefined" ? globalThis : this, function (Astronomy) {
  "use strict";
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const bodies = [
    ["Sun", "☉", "what you center your life around"], ["Moon", "☽", "emotional needs and instinct"],
    ["Mercury", "☿", "thinking and communication"], ["Venus", "♀", "attraction, values, and relating"],
    ["Mars", "♂", "drive, action, and desire"], ["Jupiter", "♃", "growth, meaning, and expansion"],
    ["Saturn", "♄", "structure, limits, and responsibility"], ["Uranus", "♅", "change, freedom, and disruption"],
    ["Neptune", "♆", "imagination, ideals, and sensitivity"], ["Pluto", "♇", "deep change, power, vulnerability, and renewal"]
  ];
  const norm = x => ((x % 360) + 360) % 360;
  const sign = lon => signs[Math.floor(norm(lon) / 30)];
  const deg = lon => (Math.floor((norm(lon) % 30) * 10) / 10).toFixed(1) + "°";
  function birthInstant(date, time, offset) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) ||
        offset === "" || offset == null || !Number.isFinite(Number(offset)) || Number(offset) < -12 || Number(offset) > 14) {
      throw new Error("Please enter a birth date, time, and UTC offset between -12 and +14.");
    }
    // Parse wall-clock fields as UTC first, never in the visitor's computer timezone.
    const local = new Date(date + "T" + time + ":00Z");
    if (!Number.isFinite(local.getTime()) || local.toISOString().slice(0, 16) !== date + "T" + time) {
      throw new Error("Please check your birth date and time.");
    }
    return new Date(local.getTime() - Number(offset) * 3600000);
  }
  function birthInstantsInZone(date, time, timeZone) {
    const wall = birthInstant(date, time, 0).getTime();
    if (!timeZone) throw new Error("I couldn't find the time zone for that birthplace. Please try a nearby city.");
    let formatter;
    try {
      formatter = new Intl.DateTimeFormat('en-GB', {timeZone, calendar:'iso8601', numberingSystem:'latn', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'});
    } catch {
      throw new Error("This browser couldn't read the birthplace's time zone. Please try an updated browser.");
    }
    function localStamp(instant) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p => [p.type, p.value]));
      return new Date(`${parts.year.padStart(4,'0')}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`).getTime();
    }
    // Collect offsets on both sides of a clock change, then round-trip each candidate.
    // Never silently normalize a skipped time or pick one occurrence of a repeated time.
    const offsets = new Set();
    for (let hours = -48; hours <= 48; hours += 6) {
      const probe = wall + hours * 3600000;
      offsets.add(localStamp(probe) - probe);
    }
    const matches = [...offsets].map(offset => wall - offset)
      .filter(instant => localStamp(instant) === wall).sort((a,b) => a-b);
    if (!matches.length) throw new Error("The clocks changed at that birthplace and this time was skipped. Please double-check the time on your birth record.");
    return matches.map(instant => new Date(instant));
  }
  function meanNode(date) {
    const T = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 31557600000;
    return norm(125.044555 - 1934.1361849*T + 0.0020762*T*T + T*T*T/467410 - T*T*T*T/60616000);
  }
  function ascendant(date, lat, lon) {
    const radians = Math.PI / 180;
    const th = (Astronomy.SiderealTime(date) * 15 + lon) * radians;
    const phi = lat * radians;
    const eps = 23.439291 * radians;
    return norm(Math.atan2(-Math.cos(th), Math.sin(th)*Math.cos(eps) + Math.tan(phi)*Math.sin(eps)) / radians + 180);
  }
  function wholeSignHouse(lon, asc) {
    return (Math.floor(norm(lon)/30) - Math.floor(norm(asc)/30) + 12) % 12 + 1;
  }
  function calculate(date, lat, lon) {
    if (!Astronomy) throw new Error("The chart engine did not load. Please reconnect and reload this page.");
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new Error("Invalid birth instant.");
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) >= 66 || Math.abs(lon) > 180) {
      throw new Error("This first chart calculator needs a location below 66° latitude and a valid longitude.");
    }
    const asc = ascendant(date, lat, lon);
    function placement(name, symbol, meaning, longitude) {
      const value = norm(longitude);
      if (!Number.isFinite(value)) throw new Error("The chart engine returned an invalid placement.");
      return {name, symbol, meaning, lon: value, sign: sign(value), degree: deg(value), house: wholeSignHouse(value, asc)};
    }
    const list = bodies.map(([name, symbol, meaning]) => {
      // EclipticLongitude is heliocentric and cannot calculate the Sun's natal position.
      const longitude = name === "Sun" ? Astronomy.SunPosition(date).elon
        : name === "Moon" ? Astronomy.EclipticGeoMoon(date).lon
        : Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[name], date, true)).elon;
      return placement(name, symbol, meaning, longitude);
    });
    const node = meanNode(date);
    return {
      list, asc,
      node: placement("North Node", "☊", "the direction of growth and the thread you keep following", node),
      south: placement("South Node", "☋", "familiar patterns, instincts, and what you already know", node + 180),
      metadata: {zodiac: "tropical", houses: "whole-sign", nodes: "mean", ascendant: "fixed-obliquity approximation", utc: date.toISOString()}
    };
  }
  return {birthInstant, birthInstantsInZone, calculate, sign, deg, wholeSignHouse};
});
