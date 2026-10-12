/* Adapted from the user's natalShadow.js and Luna Door Moon/Pluto reflections.
   Interpretive content only: the existing chart remains the source of placements. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DLAShadow = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const styles = {
    Aries: ['The emergency meeting can wait', 'Courage can become a rush to react. If that fits, leave a little room for the feeling underneath the action.', 'What might I notice if I paused before responding?', 'Give one reply a breath before sending it.'],
    Taurus: ['Comfort is not a binding contract', 'Steadiness can turn into holding on after something stops helping. Familiar and nourishing are allowed to be different things.', 'Which comfort supports me, and which simply keeps everything familiar?', 'Try one small change without dismantling your whole routine.'],
    Gemini: ['The feelings have requested fewer tabs', 'Curiosity can produce plenty of explanations before a feeling gets a word in. You can understand something and still need to feel it.', 'What do I feel before I explain it?', 'Name one feeling in a short sentence. No footnotes.'],
    Cancer: ['Care does not require a committee', 'Care and memory can be strengths. They can also make it hard to let other people choose their own responses.', 'Am I offering care, asking for care, or hoping someone will guess?', 'Make one clear request instead of another helpful hint.'],
    Leo: ['The spotlight is not a receipt', 'Warmth and expression can get tangled with needing a response. Your enjoyment is allowed to count before the applause arrives.', 'What would I enjoy creating if nobody rated it?', 'Make something small just because it pleases you.'],
    Virgo: ['Perfection has missed its deadline', 'Discernment can become endless editing. A useful adjustment and a moving finish line are not always the same thing.', 'What am I still fixing that could already be enough?', 'Choose one reasonable stopping point and honour it.'],
    Libra: ['Your preference has a seat at the table', 'Consideration can become agreement before you have checked what you want. Harmony has room for an honest preference.', 'Where have I said “anything is fine” when something matters to me?', 'State one preference kindly, without presenting a legal defence.'],
    Scorpio: ['Trust has misplaced its clipboard', 'Depth can invite closeness; trying to control every unknown can make closeness harder. Notice the difference if this theme feels familiar.', 'What is mine to choose, and what am I trying to guarantee?', 'Name one boundary you can set instead of one outcome you cannot control.'],
    Sagittarius: ['The exit is not the whole itinerary', 'Perspective and possibility can be generous gifts. Sometimes the next adventure also offers a convenient way around a present feeling.', 'What is worth staying with for one more honest minute?', 'Finish one small conversation or task before opening the next door.'],
    Capricorn: ['Rest has passed the interview', 'Responsibility can turn into earning every pause. Achievement and personal worth do not have to share a timesheet.', 'What would enough look like if I did not have to prove it?', 'Take one ordinary break without making it productive.'],
    Aquarius: ['The balcony is not the only seating', 'Perspective can help you see a pattern. It can also keep a feeling at a safe distance when some company might help.', 'Can I name a personal need without turning it into a theory?', 'Tell someone you trust one specific thing that would help.'],
    Pisces: ['Even an ocean gets a shoreline', 'Sensitivity and imagination can blur the line between understanding someone and carrying everything for them.', 'What belongs to me, and what am I taking on without being asked?', 'Choose one gentle limit that leaves room for your own needs.']
  };
  const themes = {
    Sun: 'Identity, pride, and the wish to matter. What stays true when you put the performance down?',
    Moon: 'Needs, habits, and private feelings. What need have you been keeping quiet to feel accepted?',
    Mercury: 'Thought and communication. When is a clever explanation helping, and when is it doing all the talking?',
    Venus: 'Connection, pleasure, and values. Where might pleasing someone cost you a preference of your own?',
    Mars: 'Desire, action, and anger. What could a clear request express before frustration takes over?',
    Jupiter: 'Belief, growth, and possibility. Is this expansion generous, or have you promised more than you can carry?',
    Saturn: 'Rules, responsibility, and limits. Which standard helps you, and which one needs a sensible revision?',
    Uranus: 'Freedom and change. Are you making space for something true, or changing things just to escape being pinned down?',
    Neptune: 'Imagination, ideals, and sensitivity. What becomes clearer when hope and what you actually know each get a sentence?',
    Pluto: 'Power, vulnerability, and renewal. Where do you want certainty, and what small choice remains yours without it?',
    'North Node': 'Growth and unfamiliar territory. What small experiment would feel useful without becoming a demand to reinvent yourself?',
    'South Node': 'Familiar instincts and practiced responses. Which old skill still helps, and when does it run on autopilot?',
    Rising: 'First impressions and the way you enter a room. What might people learn about you after the opening act?'
  };
  const strengths = {
    Aries:'The strength underneath this is initiative: being willing to begin, protect something important, or say what others hesitate to name. The question is whether speed is serving your choice or making the choice for you. For example, a delayed reply might invite a direct question rather than an immediate conclusion. You do not have to become less brave; you can let bravery include a moment of uncertainty.',
    Taurus:'The strength underneath this is the ability to build something dependable and appreciate what is already here. The tension may appear when a routine, possession, or agreement stays in place simply because changing it feels disruptive. Try distinguishing what truly supports you from what only looks reassuring. A small experiment can give you information without requiring you to abandon everything familiar.',
    Gemini:'The strength underneath this is curiosity and the ability to see more than one side. That flexibility can be especially helpful in a difficult conversation. It can also produce so many interpretations that your own response gets lost among them. You might notice yourself explaining why a situation makes sense while never saying that it disappointed you. Both the explanation and the feeling are allowed to exist.',
    Cancer:'The strength underneath this is attention to care, belonging, and what people remember. A possible sticking point is assuming that remembering someone’s needs means they will automatically notice yours. They may need an actual sentence. If this fits, separate a freely offered kindness from an unspoken agreement. You can care about someone and still tell them what you need or what you cannot offer today.',
    Leo:'The strength underneath this is wholehearted expression: bringing warmth, courage, or delight into a room. The difficulty can arise when the response becomes the only evidence that the expression mattered. A quiet audience is not always a rejection. Consider the difference between sharing something because it feels alive and reshaping yourself until it receives the right reaction. Your own experience gets a vote.',
    Virgo:'The strength underneath this is noticing details and turning care into something useful. That gift can become tiring when every imperfection feels like an instruction. For example, improving a project may be easier than admitting that you want help or reassurance. Ask what the situation actually needs, rather than what could theoretically be improved forever. The cosmic quality-control department does occasionally close.',
    Libra:'The strength underneath this is considering another perspective and helping people find common ground. The cost can appear when an agreement is reached before your own preference has been included. Notice whether you are choosing compromise or silently hoping someone will guess what you gave up. A small, clear disagreement can sometimes make a relationship more honest rather than less harmonious.',
    Scorpio:'The strength underneath this is a willingness to look beneath appearances and take trust seriously. The tension may show up as testing a situation repeatedly in the hope of making uncertainty disappear. More information does not always create more safety. Consider what a clear boundary or an honest conversation could do that another round of checking cannot. Trust can grow gradually, without requiring either total exposure or total control.',
    Sagittarius:'The strength underneath this is perspective, honesty, and the ability to imagine a life beyond the current problem. That wider view can bring relief. It can also skip over a detail that still deserves attention. You might notice the impulse to turn discomfort into a lesson before acknowledging that something hurt or disappointed you. Staying with one specific experience need not take away your freedom.',
    Capricorn:'The strength underneath this is commitment: making something real, keeping a promise, and thinking beyond the immediate moment. Trouble can begin when being capable becomes a rule against needing anything. Notice whether you would expect the same relentless standard from someone you care about. Sharing a task, adjusting a deadline, or accepting care can be responsible choices too. Your worth is not a quarterly performance review.',
    Aquarius:'The strength underneath this is independent thought and the ability to question an arrangement that everyone else accepts. Perspective can open a useful possibility. It can also become a comfortable viewing platform above your own needs. You might describe what people generally experience while avoiding what you personally want. Try moving from “people need support” to one concrete request that starts with “I.”',
    Pisces:'The strength underneath this is imagination, empathy, and sensitivity to what is not always said aloud. The challenge can arise when noticing another person’s feelings becomes a duty to resolve them. Ask whether you have freely chosen to help, or simply drifted into responsibility. A clear limit does not cancel your kindness. It can give that kindness a shape you can actually sustain.'
  };
  const bodyDepth = {
    Sun:'Notice the difference between expressing yourself and maintaining an image of yourself. A role that once gave you confidence can become restrictive when you feel obliged to play it in every room. You might ask what you enjoy, value, or believe when there is no audience to impress. The aim is a little more room to be a person, not a perfectly consistent brand.',
    Moon:'Look for familiar responses when you are tired, disappointed, or looking for comfort. Do you ask for what helps, go quiet, become useful, or hope someone will notice? These are possibilities to explore, not conclusions drawn from a sign. Start with an ordinary recent moment and identify the need beneath your reaction. Meeting one need directly may be more useful than judging the reaction.',
    Mercury:'Pay attention to the story you repeat about a situation and the words you leave out of a conversation. Reasoning can clarify a feeling without replacing it. Try separating what happened, what you assumed it meant, and what you actually want to say. That small distinction can turn a convincing inner monologue into a conversation someone else can join.',
    Venus:'Explore the difference between what you genuinely value and what seems likely to keep a connection comfortable. This can concern affection, money, pleasure, or everyday preferences. Notice a moment when saying yes felt easier than checking whether you meant it. A truthful preference gives another person something real to meet; it does not have to become a demand.',
    Mars:'Consider what happens between wanting something and taking action. There may be a clear request available before impatience, avoidance, or an argument steps in. Anger can point to a limit or frustration, but it does not have to choose your next move. Identify the wish or boundary in a specific situation, then decide how to express it proportionately.',
    Jupiter:'Enthusiasm can make possibilities visible and give you courage to try. It can also make a limit look like an insult when it is simply useful information. Look at one commitment: what resources, time, or support would make it realistic? Letting an idea become smaller and more workable is sometimes how it gets a chance to grow.',
    Saturn:'Look at a rule you apply to yourself and ask where it came from, what it protects, and what it costs. Some limits provide real support. Others remain long after the circumstances that shaped them have changed. You can keep the useful structure while questioning the severity. Responsibility may include a reasonable adjustment rather than another round of self-criticism.',
    Uranus:'Notice where a wish for freedom is asking for a specific change. Breaking a pattern can be useful; breaking every agreement at once can make it harder to discover what you wanted. Try naming the restriction and one experiment that would test an alternative. This slow-moving planet’s sign is shared by many people, so use the house as an additional setting rather than treating the sign as a personal verdict.',
    Neptune:'Consider where an ideal makes a situation beautiful and where it makes the details harder to see. You can value a dream while checking what has actually been promised or done. Naming one practical fact need not spoil the magic. This slow-moving planet’s sign is shared across a generation; it offers a broad theme, with the house providing more individual chart context.',
    Pluto:'Try a small example rather than your entire life story. Perhaps a changed plan, a shared decision, or an uncertain answer makes you want to tighten your grip. What are you hoping to protect? Separate the part you can choose from the part you cannot guarantee. A boundary, a request, or permission to wait may give you more agency than trying to control the whole outcome.',
    'North Node':'In this interpretation, the node is a direction to experiment with, not an assignment you can fail. New territory may feel awkward precisely because it is less practiced. Choose something small enough to learn from: a different response, a modest request, or a change in emphasis. Growth can include keeping strengths you already have rather than rejecting your past.',
    'South Node':'A familiar response may contain real skill and still be the wrong tool for a particular moment. Notice when you use it automatically, especially before you have checked what the situation needs. Ask what you want to keep, what could soften, and what other response is available. Experience is useful; it does not have to become a script you must repeat.',
    Rising:'Think about the impression you tend to offer when entering an unfamiliar situation, then compare it with what close friends learn later. A capable, friendly, confident, or quiet opening can be authentic without being the whole story. Where might you allow one more part of yourself to appear? This reflection uses your calculated rising sign; its degree remains approximate in this version.'
  };
  const rooms = ['self and first impressions','values and resources','learning and communication','home and roots','creativity and play','daily routines and care','partnerships','shared resources and vulnerability','beliefs and exploration','public life and direction','community and hopes','solitude and reflection'];
  function reflection(chart, choice) {
    let p;
    if (choice === 'Rising' && Number.isFinite(chart?.asc)) {
      const lon = ((chart.asc % 360) + 360) % 360;
      p = {name:'Rising', sign:signs[Math.floor(lon/30)], degree:(Math.floor(lon%30*10)/10).toFixed(1)+'°', house:1};
    } else p = [...(chart?.list || []), chart?.node, chart?.south].find(item => item?.name === choice);
    if (!p || !styles[p.sign] || !themes[choice] || !Number.isInteger(p.house) || p.house < 1 || p.house > 12) throw new Error('Calculate your chart before opening this shadow reflection.');
    const [title, style, question, practice] = styles[p.sign];
    return {
      choice, title, sign:p.sign, house:p.house,
      placement:`${p.name} in ${p.sign} · ${p.degree} · House ${p.house}${choice === 'Rising' ? ' · approximate rising degree' : ''}`,
      theme:themes[choice]+' '+bodyDepth[choice], style:style+' '+strengths[p.sign],
      setting:`In your whole-sign chart, this belongs to House ${p.house}: ${rooms[p.house-1]}. Use that setting only where it fits your experience.`,
      question, practice,
      note:choice === 'Pluto' ? 'Pluto moves slowly, so its sign is shared by many people. Its house adds context in your chart; neither defines your personality.' : 'An invitation to notice a pattern, not a verdict about who you are.'
    };
  }
  function together(chart) {
    const moon = reflection(chart, 'Moon'), pluto = reflection(chart, 'Pluto');
    return {
      title:'Moon + Pluto: a very small peace treaty',
      placements:[moon.placement, pluto.placement],
      text:'Notice one emotional need and one habit around control or change. What small, safe choice could honour the need while loosening the habit? For example, needing reassurance does not always require securing a promise about every possible outcome. You might ask one direct question, set one clear limit, or give yourself time before deciding. Start with a recent, manageable situation and separate the feeling, the protective response, and the choice available now. The rabbit suggests starting smaller than a complete personality renovation.',
      question:`With your Moon in ${moon.sign}, what kind of care feels useful? In the House ${pluto.house} setting of your Pluto, what is actually yours to choose?`,
      note:'These are two reflection themes explored together. This does not claim a calculated Moon–Pluto aspect.'
    };
  }
  return {reflection, together};
});
