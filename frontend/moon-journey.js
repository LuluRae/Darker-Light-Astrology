/* Story content reads the engine's Moon placement. No new chart calculations. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DLAMoonJourney = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const signs = {
    Aries: ['Room for a first spark', 'Aries brings the image of a spark: direct, quick to respond, and eager for movement. As a Moon reflection, it invites you to notice whether naming a feeling or taking one small action helps it move.', 'When do I need permission to act, and when do I need a moment before I do?', 'Try a short walk before deciding what a strong feeling is asking of you.'],
    Taurus: ['Something steady to return to', 'Taurus brings the image of a garden: sensory, steady, and nourished by time. As a Moon reflection, it invites you to explore familiar rhythms and tangible comforts without assuming that everything must stay the same.', 'Which familiar comfort restores me, and which routine am I ready to loosen?', 'Choose one simple comfort and give it your full attention for a few minutes.'],
    Gemini: ['Words with room to wander', 'Gemini brings the image of an open window: curious, conversational, and ready for another perspective. As a Moon reflection, it invites you to give feelings language while leaving room for feelings you cannot explain yet.', 'What changes when I describe a feeling without having to solve it?', 'Write three unfinished sentences beginning with “Right now, I notice…”'],
    Cancer: ['A place to put down the shell', 'Cancer brings the image of a shelter: protective, remembering, and attentive to belonging. As a Moon reflection, it invites you to consider what makes care feel mutual, and where you can receive it as well as offer it.', 'Where can I receive care without first making myself useful?', 'Make one small request for the kind of care you would usually offer someone else.'],
    Leo: ['Warmth without a performance', 'Leo brings the image of a hearth: warm, expressive, and alive with play. As a Moon reflection, it invites you to notice where being seen feels nourishing and where you can enjoy something without an audience.', 'What would I enjoy if I did not have to make it impressive?', 'Spend a few minutes making or enjoying something just because you like it.'],
    Virgo: ['Care that does not need perfecting', 'Virgo brings the image of careful hands: observant, practical, and attentive to what might help. As a Moon reflection, it invites you to separate a useful act of care from the feeling that you must fix everything first.', 'What would “cared for enough” look like today?', 'Choose one helpful task, keep it small, and let finishing it be enough.'],
    Libra: ['A seat for your own feelings', 'Libra brings the image of a shared table: responsive, relational, and sensitive to balance. As a Moon reflection, it invites you to make room for your preferences alongside the wish for harmony.', 'Can I name what I want before deciding what would please everyone?', 'Say one honest preference gently, without turning it into an argument or apology.'],
    Scorpio: ['Depth with a door you control', 'Scorpio brings the image of deep water: private, intense, and interested in what lies beneath. As a Moon reflection, it invites you to explore trust at your own pace; depth does not require revealing everything.', 'What helps me feel safe enough to be honest, even just with myself?', 'Name one feeling privately. You get to choose whether, when, and with whom to share it.'],
    Sagittarius: ['A little more sky', 'Sagittarius brings the image of a horizon: searching, spacious, and drawn to possibility. As a Moon reflection, it invites you to notice how perspective can help without needing to leap past the feeling in front of you.', 'What needs to be felt before I look for its larger meaning?', 'Give a feeling a sentence of its own, then choose one small thing that widens your day.'],
    Capricorn: ['Rest without earning it', 'Capricorn brings the image of a mountain shelter: dependable, structured, and built to last. As a Moon reflection, it invites you to consider which responsibilities support you and whether rest can belong in the plan.', 'Who am I allowed to be when I am not holding everything together?', 'Put a short, unproductive pause on your schedule and let it count as care.'],
    Aquarius: ['Belonging with breathing room', 'Aquarius brings the image of a constellation: distinct points connected across space. As a Moon reflection, it invites you to explore the balance between independence and companionship, ideas and immediate feeling.', 'What kind of company lets me stay myself?', 'Reach toward a person or community where you do not need to edit your whole self.'],
    Pisces: ['Softness with a shore', 'Pisces brings the image of a tide: imaginative, receptive, and fluid. As a Moon reflection, it invites you to notice what you take in, what helps you return to yourself, and where a gentle boundary could help.', 'What is mine to hold, and what can I gently set down?', 'Choose a quiet sensory anchor, then give yourself permission to leave one demand unanswered for now.']
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
    return {
      placement: `Moon in ${moon.sign} · ${moon.degree} · House ${moon.house}`,
      sign: moon.sign, house: moon.house,
      mirror: {title, text, question, fact: `Your calculated Moon is ${moon.degree} ${moon.sign}.`},
      door: {title: houseTitle, text: `Your whole-sign chart places the Moon in House ${moon.house}, the area of ${theme}. If the sign describes a style of responding, the house offers a setting in which to explore it.`, question: houseQuestion, fact: `Moon · House ${moon.house} · ${theme}`},
      cup: {title: 'What would care look like today?', text: `Bring the two discoveries together: the ${moon.sign} image, in the setting of ${theme}. You do not have to recognise yourself in every line. Keep what helps you ask a better question.`, question: 'What is one small thing I could give myself permission to need?', fact: 'A suggestion to try', practice},
      takeaway: `Explore “${title.toLowerCase()}” in the part of life connected with ${theme}.`,
      practice
    };
  }
  return {chapter};
});
