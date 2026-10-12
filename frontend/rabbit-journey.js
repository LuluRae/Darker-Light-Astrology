/* Interpretation consumes calculated placements; it never invents or recalculates them. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require('./shadow-journey.js'));
  else root.DLARabbit = factory(root.DLAShadow);
})(typeof globalThis !== "undefined" ? globalThis : this, function (shadow) {
  "use strict";
  const rooms = ["self and first impressions", "values and resources", "learning and communication", "home and roots", "creativity and play", "daily routines and care", "partnerships", "shared resources and vulnerability", "beliefs and exploration", "public life and direction", "community and hopes", "solitude and reflection"];
  function steps(chart, choice) {
    const p = [...chart.list, chart.node, chart.south].find(item => item.name === choice);
    if (!p) throw new Error("That thread is not available in this chart.");
    const title = p.name + " in " + p.sign + " · House " + p.house;
    const deeper = shadow.reflection(chart, choice);
    return [
      {label: "WHAT", title: p.name, text: "A clue left on the path: " + p.meaning + ". " + deeper.theme},
      {label: "HOW", title: p.name + " in " + p.sign, text: "Your calculated placement is " + p.degree + " " + p.sign + ". The sign suggests a style for this theme. " + deeper.style},
      {label: "WHERE", title, text: deeper.setting + " Consider an ordinary moment in this part of life: what happened, what mattered to you, and how did you respond? The same planetary theme can look different at home, in a friendship, or around work. A house gives us a place to ask a better question, not proof of a particular event. " + deeper.question},
      {label: "WAIT… WHAT DOES THAT MEAN?", title, text: "Read it one layer at a time: " + p.meaning + ", expressed through " + p.sign + ", in the room of " + rooms[p.house - 1] + ". This is a reflection prompt, not a verdict."},
      {label: "DEEPER", title: deeper.title, text: deeper.theme + ' ' + deeper.style + ' ' + deeper.question + ' Open Shadow reflections to explore the full setting and a small practice.'}
    ];
  }
  return {steps};
});
