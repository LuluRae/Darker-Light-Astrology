/* Story content reads the engine's Moon placement. No new chart calculations. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./shadow-journey.js'));
  else root.DLAMoonJourney = factory(root.DLAShadow);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (shadow) {
  'use strict';
  const signs = {
    Aries: ['Emotions, with a launch button', 'Aries is the spark: direct, responsive, and keen to get moving. Apparently the feeling has already put its shoes on. Explore whether a little movement helps you understand a reaction before acting on all of it.', 'Would a small action help, or does this decision need five minutes?', 'Try a short walk before deciding what a strong feeling is asking of you.'],
    Taurus: ['Comfort has standards', 'Taurus is the garden: steady, sensory, and fond of a reliable rhythm. The comfort department has requested better biscuits. Explore which familiar pleasures restore you, and when a routine could use a small update.', 'Which comfort helps me recharge, and which habit is just very well upholstered?', 'Choose one simple comfort and give it your full attention for a few minutes.'],
    Gemini: ['Several tabs open. All talking.', 'Gemini is the open window: curious, conversational, and ready for another angle. The feeling would like to discuss the feeling. Explore whether words help you untangle a mood, without requiring an instant explanation.', 'Could I describe this feeling without immediately launching a debate?', 'Write three unfinished sentences beginning with “Right now, I notice…”'],
    Cancer: ['The unofficial comfort committee', 'Cancer is the shelter: protective, remembering, and attentive to belonging. Someone has packed snacks for the entire emotional journey. Explore how you give and receive care; membership of the committee includes you.', 'Can I ask for a little care instead of organising everyone else’s?', 'Make one small request for the kind of care you would usually offer someone else.'],
    Leo: ['Feelings deserve decent lighting', 'Leo is the hearth: warm, expressive, and keen on a little play. Naturally, the hearth has excellent stage presence. Explore the pleasure of being seen, and what you enjoy even when nobody is applauding.', 'What would I enjoy if it did not need an audience?', 'Spend a few minutes making or enjoying something just because you like it.'],
    Virgo: ['A spreadsheet is not a nap', 'Virgo is the careful pair of hands: observant, practical, and interested in what helps. The comfort department has colour-coded its concerns. Explore the difference between one useful adjustment and making yourself a never-ending project.', 'What would be helpful enough, without a twelve-point improvement plan?', 'Choose one helpful task, keep it small, and let finishing it be enough.'],
    Libra: ['The committee would like harmony', 'Libra is the shared table: responsive, relational, and drawn to balance. Every chair has been consulted. Explore what makes connection feel fair, including giving your own preference a seat.', 'What do I want, before I poll the entire tea party?', 'Say one honest preference gently, without turning it into an argument or apology.'],
    Scorpio: ['The feelings have a password', 'Scorpio is deep water: private, intense, and interested in what is underneath. The mirror has signed a confidentiality agreement. Explore what makes trust possible, at your own pace. You choose how much to share.', 'What helps me be honest with myself without handing everyone the password?', 'Name one feeling privately. You get to choose whether, when, and with whom to share it.'],
    Sagittarius: ['A feeling, then a field trip', 'Sagittarius is the horizon: searching, spacious, and curious about possibilities. The feeling appears to have booked a ticket. Explore how a wider view helps, while giving the present moment its turn first.', 'Can I notice the feeling before turning it into a grand adventure?', 'Give a feeling a sentence of its own, then choose one small thing that widens your day.'],
    Capricorn: ['Rest has not met its targets', 'Capricorn is the mountain shelter: dependable, structured, and built for the long haul. Even the teapot has a five-year plan. Explore which responsibilities support you, and where a break belongs on the schedule.', 'Could I take a break without submitting a business case?', 'Put a short, unproductive pause on your schedule and let it count as care.'],
    Aquarius: ['An independent satellite', 'Aquarius is the constellation: distinct points connected across space. The committee is meeting from a different dimension. Explore how independence and company can work together, with room for your own way of being.', 'Who can I spend time with without needing to translate my entire personality?', 'Reach toward a person or community where you can relax and be yourself.'],
    Pisces: ['An ocean with office hours', 'Pisces is the tide: imaginative, receptive, and fluid. The feelings have become a weather system. Explore what you take in, what brings you back to the present, and where a useful boundary might go.', 'What can I set down before I become everyone else’s emotional umbrella?', 'Choose a quiet sensory anchor, then give yourself permission to leave one demand unanswered for now.']
  };
  const houses = [
    ['The doorway of self', 'self, presence, and first impressions', 'What do I notice in my body before I try to explain how I feel?'],
    ['The room of enough', 'values, possessions, and resources', 'What helps me feel supported beyond acquiring or proving more?'],
    ['The room of everyday words', 'learning, communication, and familiar surroundings', 'Which everyday conversation leaves me feeling more understood?'],
    ['The room of roots', 'home, family, and private foundations', 'What makes a place feel like mine, including things I can choose for myself?'],
    ['The room of play', 'creativity, pleasure, and self-expression', 'Where can I let enjoyment matter without making it productive?'],
    ['The room of small rituals', 'daily routines, work, and care', 'Which small change would make an ordinary day more supportive?'],
    ['The room of meeting', 'one-to-one relationships and partnership', 'What kind of support can I ask for clearly in a relationship?'],
    ['The room of trust', 'shared resources, intimacy, and vulnerability', 'Where would a clearer boundary help trust grow at my own pace?'],
    ['The room of horizons', 'beliefs, study, and exploration', 'What question gives me room to grow without needing an immediate answer?'],
    ['The room of direction', 'public life, responsibilities, and vocation', 'How can my private needs have a place beside what the world expects of me?'],
    ['The room of belonging', 'friendships, communities, and hopes', 'Where do I feel included without having to become someone else?'],
    ['The quiet room', 'solitude, reflection, and life behind the scenes', 'What kind of time alone restores me, and when would reaching out help?']
  ];
  function chapter(chart) {
    const moon = chart.list.find(p => p.name === 'Moon');
    if (!moon || !signs[moon.sign] || !Number.isInteger(moon.house) || moon.house < 1 || moon.house > 12) {
      throw new Error('A calculated Moon sign and house are needed for this journey.');
    }
    const [title, text, question, practice] = signs[moon.sign];
    const [houseTitle, theme, houseQuestion] = houses[moon.house - 1];
    const reflection = shadow.reflection(chart,'Moon');
    return {
      placement: `Moon in ${moon.sign} · ${moon.degree} · House ${moon.house}`,
      sign: moon.sign, house: moon.house,
      mirror: {title, text:text+' '+reflection.style, question, fact: `Your calculated Moon is ${moon.degree} ${moon.sign}.`},
      door: {title: houseTitle, text: `Your whole-sign chart places the Moon in House ${moon.house}, the area of ${theme}. The sign is the style; the house is the setting. Finally, an address. The rabbit appears to have left without forwarding his mail. Think of a recent, ordinary moment in this part of life. What made you feel supported, unsettled, or in need of a different response? Notice what happened separately from what you assumed it meant. A house is a place to explore these questions, not a claim that something particular must happen to you. Your circumstances and choices remain part of the story.`, question: houseQuestion, fact: `Moon · House ${moon.house} · ${theme}`},
      cup: {title: 'Tea first. Revelations can queue.', text: `Put the two together: Moon in ${moon.sign}, in the setting of ${theme}. Try one small idea and see whether it fits your life. We are conducting an experiment, not issuing a royal decree. Choose a situation that feels manageable, then notice a need, your usual response, and one alternative you might try. Perhaps that means asking clearly, pausing before answering, or making room for a simple comfort. Afterwards, ask whether the choice helped. You can keep it, adjust it, or decide it was not useful; the teacup does not issue grades.`, question: 'What is one useful thing I could try today?', fact: 'One small experiment', practice},
      takeaway: `Explore “${title.toLowerCase()}” in the part of life connected with ${theme}.`,
      practice
    };
  }
  return {chapter};
});
