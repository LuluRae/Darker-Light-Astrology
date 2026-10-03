/* Interpretation consumes calculated placements; it never invents or recalculates them. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DLARabbit = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const rooms = ["self and first impressions", "values and resources", "learning and communication", "home and roots", "creativity and play", "daily routines and care", "partnerships", "shared resources and vulnerability", "beliefs and exploration", "public life and direction", "community and hopes", "solitude and reflection"];
  function steps(chart, choice) {
    const p = [...chart.list, chart.node, chart.south].find(item => item.name === choice);
    if (!p) throw new Error("That thread is not available in this chart.");
    const title = p.name + " in " + p.sign + " · House " + p.house;
    return [
      {label: "WHAT", title: p.name, text: "The rabbit pauses here: " + p.meaning + ". This is the character in your story."},
      {label: "HOW", title: p.name + " in " + p.sign, text: "Your calculated placement is " + p.degree + " " + p.sign + ". The sign is the style this character takes on. What do you notice about that style?"},
      {label: "WHERE", title, text: "Your whole-sign chart places this thread in House " + p.house + ": " + rooms[p.house - 1] + ". Where do you notice this theme in your life?"},
      {label: "WAIT… WHAT DOES THAT MEAN?", title, text: "Read it one layer at a time: " + p.meaning + ", expressed through " + p.sign + ", in the room of " + rooms[p.house - 1] + ". This is a reflection prompt, not a verdict."},
      {label: "DEEPER", title: "Follow another thread", text: "Your North Node is in " + chart.node.sign + " · House " + chart.node.house + "; Pluto is in " + chart.list.find(item => item.name === "Pluto").sign + " · House " + chart.list.find(item => item.name === "Pluto").house + ". Choose a thread below to explore its layers. These placements alone do not establish an aspect."}
    ];
  }
  return {steps};
});
