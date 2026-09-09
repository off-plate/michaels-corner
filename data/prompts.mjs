/* Michael's Corner, the prompt library data.
   Consumed by build.mjs, which generates packs/, prompts/ and data/prompts-index.js.
   app.js holds a second, shorter copy of the pack list for the /library page. Change both.

   Rebuilt from scratch 2026-09-09 against what people on Reddit said they actually use AI
   for, and what they said made prompt lists worthless. The house rules that came out of it:

   1. No persona openings. "You are an expert analyst" is the most copied prompt habit
      there is, and there is peer-reviewed work saying it makes answers worse rather than
      better (Michigan / DeepMind, 162 persona variants tested). Say the task, not the costume.
   2. Never let the model invent the facts. Every prompt either supplies them through a
      [bracket] slot or makes the model ask for them before it answers.
   3. Name the thing instead of describing it with an adjective. "Make it professional"
      means nothing. Bad output is usually human ambiguity, not a badly engineered prompt.
   4. Say what to do when it does not know. An answer with a gap marked beats a complete
      answer that is quietly wrong.
   5. Michael's voice: plain B2 English, no em dashes, no hype, short sentences.

   Keep the [bracket] slots and the honest-limit lines. They are why these work. */

export const UPDATED = "09/2026";

export const PACKS = [
  {
    id: "beginners",
    desc: "The prompts to learn first, for anyone who has heard of AI but never really used it.",
    chip: "Start here",
    name: "Best prompts for beginners",
    blurb: [
      "The prompts to learn first, for anyone who has heard of AI but never really used it. None of them need any setup. Copy one, fill in the brackets, paste it in."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "interview-me-first",
        title: "Make it ask before it answers",
        when: "Use this first, on anything that matters. It is the habit that separates people who get useful answers from people who get generic ones.",
        prompt: `I want help with this: [describe what you want, roughly, in a sentence or two].

Do not answer yet. First tell me what you would need to know to do this well, then ask me the three to five questions that would actually change your answer. Ask them one at a time and wait for my reply before the next one.

While you are interviewing me:
- Ask about things that would change what you produce. Skip background that would not.
- If an answer of mine is vague, push once for something concrete before moving on.
- Do not start solving it while we are still talking.

When you have enough, say "Ready" and give me your answer. If something is still missing, name it and say what you assumed instead of quietly guessing.`,
        tip: "Ten seconds of this beats twenty minutes spent fixing an answer built on a guess. If you take one prompt from this whole site, take this one."
      },
      {
        id: "fix-my-question",
        title: "Rewrite my question before you answer it",
        when: "Use this when you can feel that your question is vague but you are not sure how to sharpen it.",
        prompt: `Here is the question I was about to send you:

[paste your question exactly as you first wrote it]

Before answering, do this:
1. Tell me what is ambiguous in it. Point at the specific words that could mean more than one thing.
2. Tell me what context you are missing that I probably have.
3. Rewrite it as the question I should have asked, and show me the rewrite.

Then wait. Do not answer the rewritten question until I say go, because I may want to correct your version first.`,
        tip: "Most bad answers are bad questions. Run this a few times and you will start writing the sharper version yourself."
      },
      {
        id: "only-this-source",
        title: "Answer only from what I gave you",
        when: "Use this whenever the answer has to be right: a contract, a policy, a report, anything you would be embarrassed to get wrong.",
        prompt: `Here is the source material:

[paste the document, email, article or notes]

My question is: [what you want to know]

Rules for your answer:
- Use only what is in the text above. Do not add anything you know from elsewhere.
- Quote the exact words you based each part of your answer on.
- If the text does not settle my question, say "not in the source" and say what would settle it.
- Do not smooth over a gap by guessing what the document probably means.`,
        tip: "This is the difference between a summary you can act on and one you have to check line by line. The quoting requirement is what makes it work."
      },
      {
        id: "what-did-you-assume",
        title: "Show me what you assumed",
        when: "Use this on the answer you just got, before you act on any of it.",
        prompt: `Look back at the answer you just gave me.

1. List everything you assumed that I did not actually tell you.
2. For each one, say what your answer would change to if the assumption were wrong.
3. Mark anything in your answer you are not confident about, and say why.
4. Tell me the one thing I could check that would most change whether your answer holds.

Do not defend the answer. I want the weak points, not a summary of it.`,
        tip: "It sounds equally certain whether or not it is right. Asking what it assumed gets a straighter answer than asking if it is sure."
      },
      {
        id: "explain-like-new",
        title: "Explain it like I am new",
        when: "Use this when someone used a word or an idea you did not follow and you would rather not pretend you did.",
        prompt: `I am new to [topic or term]. Explain it without jargon.

Here is where I met it, so you know which meaning I need:
[paste the sentence, email or article where it came up, or write "no context, just curious"]

Do this:
1. Say what it is in two or three plain sentences.
2. Say why people care about it, with one everyday example I would recognise.
3. Tell me the one thing beginners most often get wrong about it.
4. If the word means different things in different fields, give me the meaning that fits what I pasted.

Rules:
- Short sentences, everyday words.
- If you must use a technical word, put its plain meaning in brackets straight after it.
- If my context is not enough to be sure which meaning I need, ask me one question instead of picking.`,
        tip: "If a part is still foggy, reply \"explain that bit again to a ten year old\". It works more often than it should."
      },
      {
        id: "say-it-back",
        title: "Say my request back to me",
        when: "Use this before a long job, when you want to catch a misunderstanding while it is still cheap.",
        prompt: `Here is what I am asking you to do:

[paste or describe the task]

Before you do any of it, say back to me:
1. What you think I am asking for, in your own words.
2. What the finished thing will look like: how long, what format, who it is for.
3. Anything in my request you found unclear.

Then stop and wait for me to correct you. If I have contradicted myself anywhere, point at it rather than picking whichever version you prefer.`,
        tip: "Catching a wrong assumption here costs one message. Catching it after two thousand words costs the two thousand words."
      },
      {
        id: "smallest-first-step",
        title: "Break down the thing I keep avoiding",
        when: "Use this on the task that has been moving down your list all week.",
        prompt: `I have been putting this off: [name the task, honestly].

Here is what I know about it: [any detail, deadline, or reason it is stuck. If you do not know why it is stuck, say so.]

Do this:
1. Ask me two questions to work out what is actually blocking it. Waiting on someone, missing information, unclear goal, or just dread.
2. Then give me the smallest first step, something I could finish in ten minutes today.
3. Then the next three steps after that, in order.
4. Tell me which step is the one I am really avoiding, and why you think so.

Keep it to one screen. No pep talk.`,
        tip: "The ten minute step is the point. If the first thing on the list still feels heavy, tell it to go smaller."
      },
      {
        id: "where-ai-fits",
        title: "Work out what to hand over",
        when: "Use this in your first week, once you have a rough sense of what it can do.",
        prompt: `Here is what my week actually looks like:

[list the things you do repeatedly, however roughly. Include the boring ones.]

For each item, tell me honestly which of these it is:
- Worth handing over now, and what you would need from me to do it well.
- Worth handing over only with my material pasted in each time.
- Not worth it, because checking your work would take longer than doing it myself.
- A bad fit, because it needs live information, exact arithmetic, or a judgement only I can make.

Be blunt in the last two categories. I would rather find out now than after a wasted fortnight.`,
        tip: "Run it again after a month. The answer changes as you get better at asking, and the last two categories are the useful ones."
      }
    ]
  },
  {
    id: "jobs",
    desc: "For anyone applying for work, from tailoring the CV to the reply when the number is too low.",
    chip: "For applicants",
    name: "Job hunting",
    blurb: [
      "Tailoring a CV to one specific posting is the job people reach for AI to do most often. It is also where it most often writes in things you never did. Every prompt here is built to stop that."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "tailor-my-cv",
        title: "Tailor my CV to this one posting",
        when: "Use this per application. It is the twenty minutes of rewriting you do for every job, done in two.",
        prompt: `Here is the job posting:
[paste the whole posting, including the boring requirements section]

Here is my CV:
[paste your CV as it stands]

Rewrite my CV bullets so they answer this specific posting.

Hard rules, and these matter more than the rewrite:
- Use only things already in my CV. Do not add a skill, a tool, a number or a responsibility I did not list.
- If the posting asks for something I do not have, do not paper over it. Put it in a separate list called "gaps they will notice".
- Keep my job titles, employers and dates exactly as I wrote them.
- Where you reword a bullet, keep the fact and change only the framing.

Then show me what you changed and why, line by line, so I can check each one.`,
        tip: "Read every rewritten line before you send it. The quickest way to lose an interview is being asked about a skill the AI gave you."
      },
      {
        id: "decode-the-posting",
        title: "What is this posting actually asking for",
        when: "Use this before you decide whether to apply at all.",
        prompt: `Here is a job posting:
[paste the posting]

Tell me:
1. The five things they will really screen on, in order. Separate the genuine requirements from the wish list.
2. What the posting suggests about why the role is open. Growth, someone left, a problem they need fixed.
3. Which phrases are standard boilerplate and which look specific to this team.
4. What the posting does not say that I would want to know.

If the posting is too vague to read this way, say so instead of inventing a reading.`,
        tip: "The wish list versus requirement split is the useful part. Most people rule themselves out on the wish list."
      },
      {
        id: "honest-gap-check",
        title: "Where am I genuinely under-qualified",
        when: "Use this when you are torn about applying and want a straight answer rather than encouragement.",
        prompt: `Job posting:
[paste it]

My background:
[paste your CV, or describe your experience honestly]

Be blunt with me:
1. Where am I genuinely short of what they asked for? Separate "can be learned on the job" from "they will not shortlist me without it".
2. Where am I stronger than the posting expects?
3. If I apply, what is the one objection a recruiter will have, and what is the honest answer to it? Not a spin, an honest one.
4. Given all that, is this a reasonable application or a long shot? Say which.

Do not be encouraging. I want the read.`,
        tip: "Ask for blunt and you get blunt. Left alone it will tell you that you are a strong candidate for almost anything."
      },
      {
        id: "duties-to-results",
        title: "Turn my duties into results",
        when: "Use this when your CV reads like a job description and you know it.",
        prompt: `Here are the things I did in this role:
[paste your current bullets, however dull]

Turn each one into a result rather than a duty. But:
- You do not know my numbers, so do not invent any. Where a bullet would be stronger with a figure, ask me for it instead of writing one in.
- Ask me up to six questions in total, the ones most likely to turn a duty into something measurable.
- After I answer, rewrite the bullets using only what I gave you.
- If I do not have a number for something, write the bullet without one rather than reaching for a word like "significantly".`,
        tip: "The questions are the value here. Most people have the numbers somewhere and have never thought to put them on the page."
      },
      {
        id: "not-a-cover-letter",
        title: "A note instead of a cover letter",
        when: "Use this when a cover letter is expected but you know the usual template reads as filler.",
        prompt: `Job posting: [paste it]
My relevant background: [paste or summarise]
Why this one actually interests me: [one honest line. If the honest answer is that you need a job, write that and I will work with what is true.]

Write a short note, under 200 words.

Rules:
- Do not open with "I am writing to express my interest". Open with something specific about them or about the work.
- One concrete thing I have done that maps to their problem, taken from my background only.
- No adjectives about me. No passionate, driven, results-oriented.
- Plain sentences. It should read like I typed it.
- End with a simple next step, not a flourish.`,
        tip: "Cover letters became easy to generate, so they became easy to spot. Short and specific now beats polished."
      },
      {
        id: "tired-recruiter",
        title: "Read this as a tired recruiter",
        when: "Use this on your finished application, before you send it.",
        prompt: `Here is my CV and cover note:
[paste both]
Here is the posting: [paste it]

Read it as a recruiter with 200 of these to get through today, skimming rather than reading.

1. Where exactly do you stop reading, and why?
2. What do you learn in the first six seconds?
3. What is the one line that makes you keep going, if any?
4. What would put it in the no pile before you finish it?

Be harsh. I would rather hear it from you.`,
        tip: "\"Where do you stop reading\" gets you more than any general request for feedback."
      },
      {
        id: "interview-rehearsal",
        title: "Rehearse the interview for this job",
        when: "Use this the evening before, out loud if you can.",
        prompt: `Job posting: [paste it]
My background: [paste it]

Interview me. Ask the eight questions this posting most likely leads to, one at a time, and wait for my answer before the next.

After each answer:
- Say what was strong in it.
- Say what a sceptical interviewer would follow up on.
- If I waffled, say so, and tell me what the tighter version would be.

Include at least one question about the weakest part of my background. Do not go easy on me because I am practising.`,
        tip: "Answer out loud, not in your head. The gap between what you think you would say and what comes out is the whole point."
      },
      {
        id: "silence-and-salary",
        title: "Reply to silence, and to a low offer",
        when: "Use this when you are staring at the message box, rewriting the first line for the fifth time.",
        prompt: `Situation: [pick one and fill it in]
- They have not replied in [number] days since [what happened last].
- They offered [amount or terms], which is below what I need, and what I need is [your number and the reason].

Here is the last message in the thread:
[paste it]

Write my reply.

Rules:
- Short, under 120 words.
- Do not apologise for following up.
- For a follow-up: give them an easy way to answer, including an honest "not moving forward" option.
- For a salary reply: state my number once, give the reason in one line, then stop. Do not undercut it in the next sentence.
- Do not use "just", "quickly", or "I was wondering if".`,
        tip: "Send the follow-up. Plenty of people assume silence means no and find out later it meant the hiring manager was on leave."
      }
    ]
  },
  {
    id: "study",
    desc: "For students at any level. Make it test you rather than summarise for you.",
    chip: "For students",
    name: "Study smarter",
    blurb: [
      "For students at any level. The pattern that keeps coming up from people who actually learn this way is the same: make it test you instead of summarising for you, then make it explain what you got wrong."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "quiz-me-from-notes",
        title: "Quiz me from my own notes",
        when: "Use this instead of rereading. Rereading feels like studying and is mostly not.",
        prompt: `Here are my notes:

[paste your lecture notes, chapter summary, or slides]

Ask me questions on this material. One at a time, waiting for my answer.

Rules:
- Questions come only from what I pasted. Do not test me on things that are not in there.
- Mix recall questions with ones that make me apply the idea to a new case.
- After each answer, tell me if I was right, and if I was partly right say exactly which part was wrong.
- Do not give me the answer before I have tried.
- Every fifth question, ask one that connects back to something earlier.

Start with question one.`,
        tip: "Answer before you look. The struggle to remember is the thing that makes it stick, and skipping it is why rereading does not work."
      },
      {
        id: "test-until-i-fail",
        title: "Test me until I get one wrong",
        when: "Use this when you think you know a topic and want to find out whether you do.",
        prompt: `Topic: [name the topic]
My material: [paste your notes, or say "use standard coverage of this topic"]

Ask me progressively harder questions on this, one at a time, until I get one wrong.

When I get one wrong:
1. Stop the escalation.
2. Tell me what the gap actually is. Not just the right answer, the misunderstanding behind my wrong one.
3. Explain that specific gap.
4. Ask me two more questions on that same gap to check it has closed.
5. Then carry on getting harder.

If I am getting everything right, get harder faster.`,
        tip: "The point is finding the edge of what you know. Getting everything right means the questions were too easy, so say so."
      },
      {
        id: "why-was-i-wrong",
        title: "Why did I get this wrong",
        when: "Use this on a returned test or practice paper, on the questions you lost marks on.",
        prompt: `Here is the question: [paste it]
Here is my answer: [paste exactly what you wrote, mistakes included]
Here is the correct answer, if I have it: [paste it, or write "not given"]

Do not just tell me the right answer. Tell me:
1. What I appear to have misunderstood, based on what I actually wrote.
2. Whether this is a knowledge gap, a misread question, or a careless slip. Say which, and how you can tell.
3. What the general version of this mistake is, so I can spot it next time.
4. Two practice questions that would catch this same mistake again.

If my answer is closer to right than it looks, say that too.`,
        tip: "Wrong answers are more useful than right ones. The diagnosis of the mistake is the part that stops it happening again."
      },
      {
        id: "explain-it-back",
        title: "Let me explain it and find my holes",
        when: "Use this when you can follow the material while reading but cannot reproduce it afterwards.",
        prompt: `I am going to explain [topic] to you in my own words. I will probably get parts wrong.

After I finish:
1. Tell me which parts are correct.
2. Tell me which parts are wrong, and what the correct version is.
3. Tell me what I left out that matters.
4. Point at anything I said that was vague, where I might be hiding a gap behind a phrase I do not really understand.

Then ask me one question about the weakest part.

Here is my explanation:
[write it out, badly if necessary, without looking at your notes]`,
        tip: "Writing it without looking is the whole exercise. If you cannot start, that is your answer about how well you know it."
      },
      {
        id: "decode-hard-reading",
        title: "Decode a paragraph I cannot get through",
        when: "Use this on dense academic reading, when you have read the same three lines four times.",
        prompt: `Here is a passage I am stuck on:

[paste the one paragraph you are stuck on]

Do this:
1. Say what it means in plain language, one short paragraph.
2. List every term in it that carries a technical meaning, with a plain definition of each.
3. Show me the structure of the argument: what it claims, what it uses as support.
4. Tell me what I would need to already know for this to make sense, and whether the passage assumes it.

Work only from this passage. If it depends on something earlier in the text I have not given you, say so.`,
        tip: "Paste one paragraph. It works far better on a small piece, and you will actually read the answer."
      },
      {
        id: "flashcards-from-material",
        title: "Turn this into flashcards",
        when: "Use this when card-making is eating the time you meant to spend studying.",
        prompt: `Here is my material:

[paste notes, a chapter, or a set of slides]

Turn it into flashcards.

Rules:
- One fact or idea per card. If a card needs the word "and", split it.
- Front is a question, not a topic heading.
- Back is as short as it can be and still be correct.
- Only from what I pasted. Do not add cards from your own knowledge of the subject.
- Skip anything that is only a heading or an example with no fact in it.
- Mark any card where the material was too vague for you to be sure, rather than guessing.

Give them as a plain list I can paste into a card app: question, then answer, one per line.`,
        tip: "Check the cards before you drill them. A wrong card drilled twenty times is worse than no card."
      },
      {
        id: "am-i-ready",
        title: "Am I actually ready for this exam",
        when: "Use this a week out, when you want a real answer instead of a feeling.",
        prompt: `Exam: [what it covers, the format, and the date]
Syllabus or topic list: [paste it]

Do not tell me I am ready or not yet. First find out.

1. Ask me to rate my confidence on each topic, one line each.
2. Then pick the three topics I rated highest and test me on them, because that is where overconfidence hides.
3. Then test me on the three I rated lowest.
4. Then tell me where I actually stand versus where I think I stand, topic by topic.
5. Give me a plan for the days I have left, weighted to the real gaps rather than my ratings.

Be honest, including if the honest answer is that a week is not enough for a topic.`,
        tip: "Testing the topics you feel best about is the useful bit. That is where the surprises are."
      },
      {
        id: "week-before-plan",
        title: "Plan the week before the exam",
        when: "Use this when you know what is coming and have no idea how to fit it in.",
        prompt: `Exam date: [date]
Topics still to cover: [list them]
Time I actually have: [be honest. Hours per day, and which days are already gone.]
How I study best: [what has worked before, or "no idea"]

Build me a plan.

Rules:
- Fit the time I actually said, not an ideal week. If it does not fit, say what will not get covered rather than squeezing everything in.
- Put active recall and practice questions in, not just reading.
- Leave the day before the exam for review only.
- Tell me which topic to drop if I fall behind, and why that one.
- No motivational filler. Just the plan.`,
        tip: "The \"what to drop\" line is the one worth reading. You will fall behind, and deciding now beats panicking later."
      }
    ]
  },
  {
    id: "human",
    desc: "Stop it sounding like AI, and stop your own writing getting flattened into the same voice.",
    chip: "For writing",
    name: "Sounding like a human",
    blurb: [
      "People spot AI writing now, and they think less of you for sending it. These strip the tells, keep your own voice, and cut the padding that gets added when you ask for something to be made better."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "match-my-voice",
        title: "Write in my voice, from samples",
        when: "Use this instead of asking for a friendly tone. Adjectives make it guess, examples do not.",
        prompt: `Here are three things I wrote myself:

[paste sample one]

[paste sample two]

[paste sample three]

Study how I write. Look at sentence length and how much it varies, the words I reach for, how formal I am, whether I use contractions, how I open and close, and what I never do.

Before writing anything, tell me what you noticed about my voice in five bullets, so I can correct you if you have read me wrong.

Then write this in my voice: [what you want written]

Do not smooth me out. If I write short blunt sentences, keep them short and blunt.`,
        tip: "Use real samples, including a scrappy one. Three of your best polished pieces teach it to write like your best polished pieces, which is not how you actually sound."
      },
      {
        id: "strip-the-tells",
        title: "Strip the AI tells out of this",
        when: "Use this on anything generated that you are about to put your name on.",
        prompt: `Here is the text:

[paste it]

Remove the things that make it read as machine written:
- Em dashes. Use commas, full stops or a rewrite.
- The three-item list where all three items are the same shape.
- Openers like "In today's fast-paced world" and "It's important to note that".
- "Not just X, but Y" and every other manufactured contrast.
- Words like leverage, robust, seamless, delve, landscape, foster, underscore, testament.
- Sentences that all run to the same length.
- A closing line that restates the whole thing.

Keep every fact and every point. Change only how it sounds.

Then list what you removed, so I can see the pattern and stop writing it myself.`,
        tip: "The list at the end is the part that trains you. After a few runs you will start hearing the tells before you write them."
      },
      {
        id: "cut-in-half",
        title: "Cut this in half",
        when: "Use this on anything that felt long while you were writing it.",
        prompt: `Here is my text:

[paste it]

Cut it to half the words.

Rules:
- Keep every fact, name, number and commitment.
- Cut throat-clearing, restatement, and hedges like "I think that maybe we could possibly".
- If two sentences make one point, keep the better one.
- Do not replace a long simple word with a short complicated one.
- Do not turn it into notes. It should still read as prose.

Show me the cut version, then tell me the three things you removed that you were least sure about, in case I wanted them.`,
        tip: "Ask for half even when you want a third off. Aiming at half and landing at 40% is better than aiming at 10% and cutting nothing."
      },
      {
        id: "would-this-get-flagged",
        title: "Would this get read as AI, and why",
        when: "Use this when something you wrote yourself has started to feel machine written to you.",
        prompt: `Here is the text:

[paste it]

Tell me whether a reader would suspect this was AI written, and be specific.

1. Quote the exact lines that would trigger the suspicion, and say what about each one does it.
2. Separate the ones that are genuinely AI habits from the ones that are just plain writing.
3. Say what is missing that a person would usually put in.
4. Give me a score out of ten for how machine written it reads, and explain the score.

Do not rewrite it. I want to know what to fix, not have it fixed.`,
        tip: "Worth running on your own unassisted writing too. A lot of ordinary business English reads as AI now, which is its own problem."
      },
      {
        id: "grammar-only",
        title: "Fix my grammar and nothing else",
        when: "Use this when you want the errors gone but the writing left alone.",
        prompt: `Here is my text:

[paste it]

Fix only:
- Spelling
- Grammar
- Punctuation
- Sentences that are genuinely unclear about who did what

Do not:
- Change my word choices for better ones
- Reorder my sentences
- Make it more formal or less formal
- Add anything
- Remove repetition if I did it on purpose

If a sentence is wrong but I might have meant it, leave it and flag it at the bottom rather than fixing it.

Show me the corrected text, then list the changes you made.`,
        tip: "This is the one to use on writing in a language you are still learning. It corrects you without quietly replacing your voice with its own."
      },
      {
        id: "one-text-three-readers",
        title: "Same message, three readers",
        when: "Use this when the same news has to go to your boss, your team and a client.",
        prompt: `Here is what I need to say:

[paste your draft, or the facts]

Write three versions.

1. For my manager: [what they care about]
2. For my team: [what they need to do differently]
3. For the client or outside reader: [what they should take away]

Rules:
- The facts stay identical in all three. Only emphasis, length and detail change.
- Do not tell one audience something the others would be upset to learn was left out.
- Mark anything that should not go in the outside version at all.
- Keep each one under [number] words.`,
        tip: "The \"should not go outside\" list is the useful bit. It catches the internal detail you would have pasted without thinking."
      },
      {
        id: "un-corporate",
        title: "Take the corporate out of this",
        when: "Use this when your own draft has gone stiff and you cannot hear it any more.",
        prompt: `Here is my draft:

[paste it]

Rewrite it the way I would say it out loud to one person across a table.

- Cut the hedging. If I mean no, it should say no.
- Cut throat-clearing openers and get to the point in the first line.
- Replace passive constructions where a person actually did the thing.
- Keep it polite, but stop it being deferential.
- Contractions are fine.

Keep every fact and every commitment exactly as I have them. Then show me the two lines that changed the most, so I can check you have not changed my meaning along with my tone.`,
        tip: "Read the result out loud. If you would not say it to someone's face in those words, it still needs work."
      },
      {
        id: "titles-worth-keeping",
        title: "Titles that are not clickbait",
        when: "Use this when you need a subject line, a heading or a title and every option sounds either dull or oversold.",
        prompt: `Here is the thing that needs a title:

[paste the text, or describe it in three lines]

Who it is for: [audience]
Where it appears: [email subject, page heading, document title, video title]

Give me ten options.

Rules:
- Every one has to be true to what the piece actually says. No promise the text does not keep.
- No "You won't believe", no "The secret to", no numbered-list bait unless the piece really is a numbered list.
- Vary the shape: some plain and descriptive, some with a specific detail from the text, some a direct question.
- Under [number] characters.

Then tell me which two you would pick and why, and which one is the most dishonest of the ten.`,
        tip: "The most dishonest one is worth looking at. It is usually the most tempting, and it is usually the one that loses trust the second time."
      }
    ]
  },
  {
    id: "business",
    desc: "For people running a small business, from the follow-up you keep not sending to the price you keep not raising.",
    chip: "For owners",
    name: "Running a small business",
    blurb: [
      "For people running a small business on their own or with a few staff. Owners rarely say the tools are bad. They say they never knew what to actually type. These are the things worth typing."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "skeptical-customer",
        title: "Read my website as a sceptical customer",
        when: "Use this when your site has been the same for a year and you can no longer see it.",
        prompt: `Here is the text from my website:

[paste your home page, and your services or about page]

Read it as someone who needs what I sell, is comparing me against two competitors, and has no patience.

1. After ten seconds, what do you think this business does, and who for?
2. What do you still not know that you would need to know before contacting me?
3. Where exactly do you lose interest? Quote the line.
4. What makes you doubt them? Quote it.
5. What would make you pick a competitor instead?

Do not suggest improvements yet. I want the read first.`,
        tip: "The line where they lose interest is usually about you and not about them. That is the tell."
      },
      {
        id: "month-of-posts",
        title: "A month of posts for my business",
        when: "Use this when the social account has gone quiet again and you need a run of things to say.",
        prompt: `My business: [what you do, who for, and where]
What makes people choose me over the next one: [be specific, not "quality and service"]
Things I have actually done recently: [jobs, wins, problems solved, anything real from the last month]
Where these go: [platform]

Plan me [number] posts.

Mix them: something useful I can teach, something about what I offer, a real customer situation from the list above, and a question worth answering.

Rules:
- Build the customer-story posts only from the real things I listed. Do not invent a customer.
- Where a post needs a detail I have not given you, leave a [bracket] for me to fill.
- No hashtag walls, no emoji every line.
- Each one short enough to read on a phone without tapping more.`,
        tip: "The real-things list is what makes this work. Without it you get generic industry filler that could belong to anyone."
      },
      {
        id: "second-opinion",
        title: "Second opinion on a real decision",
        when: "Use this on an actual business decision, the kind that has been on your mind for a fortnight.",
        prompt: `The decision: [raise prices, hire versus outsource, sign a lease, add a service, drop a client. Say which.]

What I know: [the numbers, the constraints, the deadline. Include what you are unsure of.]
What I am leaning towards: [and why]

Do this:
1. Ask me the questions you need before you can have a view. Wait for my answers.
2. Then give me the strongest case for my leaning, and the strongest case against it.
3. Tell me what I appear to be assuming without evidence.
4. Tell me what would have to be true for the other option to be the right one.
5. Say what you would want to know that I do not seem to have.

Do not tell me it depends and stop there. Take a position, and say what would change it.`,
        tip: "Answer its questions honestly, including the ones about numbers you have been avoiding looking at. That part is usually the actual blocker."
      },
      {
        id: "quote-follow-up",
        title: "Follow up on the quote they never answered",
        when: "Use this on the quote you sent two weeks ago that has been sitting there since.",
        prompt: `What I quoted: [the job and the price]
When I sent it: [date]
What was said at the time: [paste the last message, or describe the conversation]
What I know about why they have gone quiet: [or write "no idea"]

Write the follow-up.

Rules:
- Under 100 words.
- No apology for following up and no "just checking in".
- Give them an easy way to say no. A dead lead I know about is worth more than one I keep wondering about.
- One clear next step.
- If price was likely the issue, make it easy to say so without embarrassment.

Then give me a second version I could send two weeks after that one, if this gets no reply either.`,
        tip: "Include the easy no. Most people are silent because saying no feels rude, and letting them off the hook gets you an answer."
      },
      {
        id: "price-this",
        title: "Price this without underselling it",
        when: "Use this when you catch yourself about to quote low because you are afraid of the silence.",
        prompt: `The job: [what it involves, in detail]
Time it will really take me: [including the parts you always forget, like revisions and admin]
My costs on it: [materials, subcontractors, anything you pay out]
What I usually charge for something like this: [and how it usually feels afterwards]
What I know about this customer: [budget signals, urgency, how they found me]

Do this:
1. Ask me anything you need to price this properly.
2. Walk me to a number, showing the working.
3. Tell me where I am likely underselling, based on what I said about how it usually feels afterwards.
4. Give me the sentence I say when I give them the number, and the sentence I say if they push back.
5. Tell me the walk-away number and how to say no politely.

Do not tell me to charge what I am worth. Give me a figure and the reasoning.`,
        tip: "Say the number then stop talking. The urge to fill the silence with a discount is the thing that costs you."
      },
      {
        id: "notes-to-summary",
        title: "Turn my job notes into something a customer can read",
        when: "Use this at the end of a job, when your notes are scribble and the customer wants an update.",
        prompt: `Here are my notes from the job:

[paste them exactly as they are, shorthand and all]

Turn them into a short summary for the customer.

Rules:
- Only what is in my notes. If something is ambiguous in my shorthand, ask me rather than guessing what I meant.
- Explain any trade or technical term in plain words, in brackets.
- Say what was done, anything I found that they should know about, and anything that needs watching.
- No selling. If a follow-up job is needed, state it as a fact.
- Short enough to read on a phone.

Flag anything in my notes you think I would not want the customer to see.`,
        tip: "The flag at the end matters. Job notes often carry a line about the customer that was never meant to leave your phone."
      },
      {
        id: "leave-behind",
        title: "The one-pager I leave behind",
        when: "Use this once, then reuse it for every job of the same kind.",
        prompt: `The kind of job: [what you did]
What the customer should do now: [aftercare, settling in, what is normal]
What is not normal, and when to call me: [the warning signs]
What is covered, and for how long: [guarantee terms]
How to reach me: [and what counts as urgent]

Write me a one-page leave-behind.

Rules:
- Plain language. Assume no knowledge of my trade.
- The "call me now" list has to be unmissable.
- No marketing. This is the document that stops the 9pm phone call about something normal.
- It must fit on one side of A4 when printed.
- Where I have not given you enough, leave a [bracket] rather than writing something plausible.`,
        tip: "This is the highest-value thing on this page for anyone doing physical work. Write it once, hand it over on every job, and watch the pointless calls stop."
      },
      {
        id: "what-am-i-not-seeing",
        title: "Ten questions about my own business",
        when: "Use this when things are fine but you have a feeling something is off and cannot name it.",
        prompt: `My business: [what you do, how long, roughly how big]
How it is going: [honestly, including the bits that are not working]
What worries me: [or "nothing specific, just a feeling"]

Ask me ten questions, one at a time, designed to surface the constraint I am not seeing. Wait for each answer.

Rules for your questions:
- Ask about what actually happens, not about my goals.
- Follow the thread when an answer sounds evasive or too quick.
- Ask at least two about money and at least one about where my time really goes.
- Do not offer advice while we are still going.

At the end, tell me what you think the real constraint is, what evidence in my answers points at it, and what you would look at first.`,
        tip: "The questions land harder than the conclusion. Be honest in the answers, since nobody is reading them but you."
      }
    ]
  },
  {
    id: "work",
    desc: "The messages you rewrite five times before sending: the no, the chase, the bad news, the disagreement.",
    chip: "For office work",
    name: "Awkward work messages",
    blurb: [
      "The messages you rewrite five times and still do not send. Saying no, chasing for the third time, disagreeing with your manager, delivering news nobody wants. Each of these keeps your facts and fixes only the wording."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "make-it-neutral",
        title: "Make this professionally neutral",
        when: "Use this when what you wrote is accurate but says out loud what you actually think of someone.",
        prompt: `Here is what I want to say:

[write it exactly as you feel it, unfiltered. Nobody sees this but you.]

Rewrite it in neutral professional language.

Rules:
- Keep every fact and every consequence. Neutral does not mean softer.
- Turn judgements about a person into descriptions of what happened. "He is impossible to work with" becomes something like "we have had repeated communication problems", and so on for anything similar.
- Remove anything that reads as blame while keeping the account of events.
- Keep it short. Long is how anger leaks through.
- If any part of what I wrote could not be said at all in a professional setting, tell me rather than translating it.

Then tell me which line is still most likely to cause a reaction.`,
        tip: "Write the raw version first. Trying to be professional and truthful at the same time is what makes you stare at the box for twenty minutes."
      },
      {
        id: "say-no-keep-them",
        title: "Say no without burning it",
        when: "Use this on the request you should decline and have been avoiding for three days.",
        prompt: `What they asked for: [paste the request]
Why I am saying no: [the real reason]
What I want to protect: [the relationship, future work, my week]
What I can offer instead, if anything: [or "nothing"]

Write my reply.

Rules:
- The no has to be unmistakable. No wording they could read as a maybe.
- No lengthy justification. One clear reason, then stop.
- Do not apologise more than once.
- If I have an alternative, offer it once, plainly, without overselling it.
- Do not say "unfortunately" more than once, and do not say "at this time".

Under 100 words.`,
        tip: "The vague no is the expensive one. It reads as a maybe, so they come back, and you have the same conversation again next week."
      },
      {
        id: "third-follow-up",
        title: "Chase without nagging",
        when: "Use this on the third follow-up, when polite is starting to feel like a lie.",
        prompt: `What I need: [the thing, and why it matters]
When I asked: [dates of previous messages]
What I have already sent: [paste your last message]
Who they are to me: [colleague, client, supplier, my manager]
What happens if this keeps slipping: [the real consequence, including to them]

Write the next message.

Rules:
- Name it as the third time without making it an accusation.
- State the consequence plainly. Not a threat, a fact.
- Give a specific date, not "as soon as possible".
- Make replying take them ten seconds. Yes, no, or a date.
- Short. Long chasing messages get read last.`,
        tip: "Stating the real consequence is what changes the outcome. People deprioritise things when they cannot see the cost of the delay."
      },
      {
        id: "deliver-bad-news",
        title: "Deliver the bad news",
        when: "Use this on the message you keep starting and deleting.",
        prompt: `What happened: [the facts]
Who I am telling: [and what it costs them]
What I did about it: [or am doing]
What I need from them: [if anything]

Write the message.

Rules:
- The bad news goes in the first two sentences. Do not bury it under context.
- No softening it into ambiguity. They must know exactly how bad it is.
- Own what is mine to own. Do not over-apologise for what is not.
- Facts, then what happens next, then what I need. In that order.
- No "I wanted to reach out" and no passive voice hiding who did what.

Then tell me the question they will ask first, so I can answer it before they have to.`,
        tip: "Leading with the bad news feels wrong and reads as respect. Burying it in paragraph four is what people actually resent."
      },
      {
        id: "disagree-upward",
        title: "Push back on my manager, in writing",
        when: "Use this when you think a decision is wrong and it needs to be on record.",
        prompt: `The decision: [what has been decided]
Why I think it is wrong: [your reasoning and any evidence]
What I would do instead: [and what it would cost]
My standing here: [new, established, already disagreed once about this]
What I want: [reconsideration, or my objection recorded, or a specific change]

Write it.

Rules:
- Lead with the shared goal, not with the disagreement.
- Argue the decision, never the person who made it.
- Be concrete about the risk. No vague "concerns".
- Offer the alternative with its cost stated honestly, including that it may not be worth it.
- Make it easy for them to change course without losing face.
- End by making clear I will get behind the decision either way, if that is true.

Then tell me how this reads if they are already defensive.`,
        tip: "The last line is what makes disagreeing safe. Being clear you will follow the call is what earns you a hearing on the next one."
      },
      {
        id: "meeting-to-actions",
        title: "Forty minutes of meeting into five lines",
        when: "Use this straight after the call, while you still remember who meant what.",
        prompt: `Here are my notes or the transcript:

[paste them, messy is fine]

Give me:
1. What was decided. Decisions only, not discussion.
2. What is still open, and who is deciding it.
3. Actions: what, who, by when. If a name or a date was not actually said, write [unassigned] or [no date] rather than guessing.
4. Anything said that contradicts something else said.

Rules:
- Only what is in my notes.
- Do not turn a maybe into a commitment. If someone said they would try, write that they would try.
- Under one screen.`,
        tip: "The [unassigned] markers are the point. Actions with nobody's name on them are the ones that quietly do not happen."
      },
      {
        id: "difficult-feedback",
        title: "Write feedback that is specific, not personal",
        when: "Use this before a review conversation you are dreading.",
        prompt: `Who: [their role and how we work together]
What needs to change: [describe it honestly, including how it makes you feel]
Specific examples: [what happened, when. If you have none, say so.]
What good would look like: [concretely]
What I have already said about this: [if anything]

Turn it into feedback I can actually give.

Rules:
- Behaviour and effect, never character. Not "careless", but what happened and what it caused.
- Every point needs an example. If I have not given you one, tell me to find one rather than writing a general criticism.
- Say what good looks like in terms they could act on tomorrow.
- Do not sandwich it in praise. Say the praise if it is true, separately.
- Give me the opening sentence, because that is the one I will fumble.`,
        tip: "If you cannot supply an example, you are not ready to give the feedback. That is the useful thing this catches."
      },
      {
        id: "angry-draft",
        title: "The version I can actually send",
        when: "Use this when you have written the honest reply and know you must not send it.",
        prompt: `Here is what I want to send:

[paste it, all of it]

Here is what actually happened:
[the facts, without the feelings]

Here is what I need to happen next:
[the outcome you want]

Do three things:
1. Tell me what in my draft would damage this relationship, and what it would cost me.
2. Write the version that gets me the outcome I asked for.
3. Tell me what in my draft was a legitimate point that the calm version should keep, because I do not want to lose the substance along with the tone.

Do not tell me to calm down or wait a day. I know. Give me the message.`,
        tip: "Point 3 is why this is not just softening. The angry draft usually contains the real issue, and the polite rewrite tends to lose it."
      }
    ]
  },
  {
    id: "freelance",
    desc: "For solo operators. Quoting, scope, silence and the money conversation you dread.",
    chip: "For solo operators",
    name: "Freelance client handling",
    blurb: [
      "For people who are the whole business. The recurring theme from freelancers is the conversations around the work: quoting, scope creep, silence and chasing money. These are for those."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "client-gone-quiet",
        title: "The client has gone quiet",
        when: "Use this five days into silence, when you are not sure if you are being ignored or forgotten.",
        prompt: `The client: [who they are and what stage we are at]
Last contact: [what was said, and how many days ago]
What I am waiting for: [an approval, a file, a decision, payment]
What is blocked by it: [and what it costs me or them]

Here is the last message in the thread:
[paste it]

Write my follow-up.

Rules:
- Under 90 words.
- No "just following up" and no apology for writing.
- Say plainly what is waiting and what it holds up.
- Give them a one-tap reply: a date, a yes, or an honest "we have paused this".
- Do not offer a discount or extra work to restart the conversation.

Then write the version I send a week after that, if this one also gets nothing.`,
        tip: "Silence is usually their chaos, not your work. Assuming the worst and going quiet back is how projects die that did not need to."
      },
      {
        id: "quote-this-job",
        title: "Talk me to a number before I lowball it",
        when: "Use this before you send a price, especially if you have a habit of going in low.",
        prompt: `The job: [what they want, in as much detail as you have]
What I think it will take: [hours or days, honestly]
What I always forget to count: [revisions, meetings, admin, the last 10% that takes 30% of the time]
My usual rate or last similar quote: [and whether it felt right afterwards]
What I know about this client: [budget signals, how they found me, how they talk about money]

Do this:
1. Ask me what you still need to price it properly. Wait for my answers.
2. Give me a number with the working shown.
3. Tell me where I have probably underestimated, using what I said about what I forget.
4. Give me the exact sentence for delivering the number.
5. Give me my walk-away figure and the polite decline.

Do not tell me to value myself. Give me a figure and the reasoning behind it.`,
        tip: "Include the parts you always forget. That list is usually the whole difference between a job that pays and one that does not."
      },
      {
        id: "out-of-scope",
        title: "This is out of scope, said kindly",
        when: "Use this on the third small favour that was never in the agreement.",
        prompt: `What we agreed: [the original scope]
What they are now asking for: [the new request]
What it would actually cost me: [time, and what it delays]
How many times this has happened: [be honest]
What I want: [to charge for it, to trade it against something, or to decline]

Write my reply.

Rules:
- Do not make them feel caught out. Most scope creep is not deliberate.
- Say clearly that it sits outside what we agreed, and why that matters.
- Give them a real choice: add it for [price and timeline], swap it for something already in scope, or leave it for later.
- No passive aggression and no listing everything else I have already absorbed for free.
- If I have let several go already, give me one line that resets the pattern without relitigating them.`,
        tip: "The reset line is the important one. A single favour rarely hurts. The precedent that you always say yes does."
      },
      {
        id: "brief-to-spec",
        title: "Turn their vague brief into a specification",
        when: "Use this before you quote on anything described in a paragraph or less.",
        prompt: `Here is what the client sent me:

[paste their brief, however thin]

Turn it into something I could be held to.

1. List what they have actually specified.
2. List what they have implied but not stated, and mark each as an assumption I need confirmed.
3. List what is missing entirely and would change the price.
4. Write the questions I should send back, in the order that gets me the most useful answers first. No more than six.
5. Draft the scope paragraph I would put in the proposal, with [brackets] wherever an answer is still needed.

Do not fill any gap with a sensible default. That is how the argument starts later.`,
        tip: "Point 2 is where projects go wrong. What the client assumed was obvious is never in the brief, and it is never what you assumed."
      },
      {
        id: "chase-the-invoice",
        title: "Chase the invoice",
        when: "Use this when payment is overdue and you have started rehearsing the message in the shower.",
        prompt: `Invoice: [amount, number, date sent, date due]
How overdue: [days]
What I have sent already: [paste previous reminders, or say "none"]
The relationship: [ongoing work, one-off, want to keep them or not]
My terms: [late fees, interest, whatever the agreement says]

Write the message for stage [1, 2 or 3].
1 is a first friendly nudge. 2 is firm with the terms named. 3 is the last message before I stop work or escalate.

Rules:
- State the amount, the invoice number and the due date every time.
- No apology, no "sorry to be a pain".
- Make paying easy: restate the details rather than pointing at an attachment.
- At stage 2 and 3, name what happens next as a fact, not a threat.
- Never suggest a discount for prompt payment on an invoice that is already late.`,
        tip: "Send stage 1 on day one overdue, not day fourteen. Chasing early is normal business and reads as organised, not aggressive."
      },
      {
        id: "unasked-update",
        title: "The update they did not ask for",
        when: "Use this mid-project, on a Friday, on anything running longer than a fortnight.",
        prompt: `The project: [what it is and how long it runs]
Where it actually stands: [including anything behind or worrying you]
What I need from them: [or nothing]
What they are probably wondering: [and whether they have asked]

Write a short update.

Rules:
- Under 150 words.
- Lead with where it stands against the plan, including bad news if there is any.
- Anything I need from them goes in its own line with a date.
- Do not pad it to look busy. If a quiet week was a quiet week, say so and why.
- No "circling back", no "touching base".`,
        tip: "This is the cheapest thing on this page. Clients who hear from you unprompted do not chase, do not panic, and do not go quiet."
      },
      {
        id: "rehearse-the-price",
        title: "Rehearse the price conversation",
        when: "Use this before a call where you have to say a number out loud.",
        prompt: `What I am quoting: [the job and the price]
How I arrived at it: [the reasoning]
What I am afraid they will say: [the actual fear]

Play the client. Be the difficult but realistic version: someone who likes the work, thinks the price is high, and is going to push.

Rules for you:
- Push back the way a real client does. "That is more than we budgeted", "what would it cost without X", "our last supplier charged half".
- Do not fold when I hold my ground, and do not become a caricature.
- After each of my answers, stay in character.
- When I say "stop", come out of character and tell me: where I discounted without being asked, where I over-explained, and the one line that would have ended the objection cleanly.

Start when I say go.`,
        tip: "Do this out loud. The price conversation goes badly because you have never said the number to anyone before."
      },
      {
        id: "decline-bad-fit",
        title: "Turn down the wrong project",
        when: "Use this on the job you know you should not take and are talking yourself into.",
        prompt: `The project: [what they want]
Why I should say no: [the honest reason. Wrong work, bad signals, no time, price too low.]
What I would want to preserve: [referrals, the relationship, my reputation with whoever introduced us]
Whether there is anyone I would refer them to: [name or none]

First, challenge me. Ask me two questions to check I am turning it down for the right reason and not out of fear or a bad week.

Then write the decline.

Rules:
- Clear no, early in the message.
- One honest reason, without a lecture about their budget or their brief.
- Refer them on if I named someone.
- Leave the door open only if I actually want them back.
- Under 100 words.`,
        tip: "The two questions at the start are worth answering properly. Sometimes the honest answer is that you are tired, not that the job is wrong."
      }
    ]
  },
  {
    id: "found",
    desc: "What AI assistants say about your business when a customer asks, and how to fix what is wrong.",
    chip: "For owners",
    name: "Getting found by AI",
    blurb: [
      "People now ask an assistant for a recommendation the way they used to search. This pack checks what it says about you and finds where the wrong answer comes from. A word of warning: being mentioned is not the same as being hired, and anyone selling you a mention count is selling a vanity number."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "what-does-ai-say",
        title: "What does it say about my business",
        when: "Use this first. Run it in two or three different assistants, because they will not agree.",
        prompt: `Answer these as if I were a customer who has never heard of this business, and answer from what you know rather than from anything I tell you.

1. What do you know about [business name] in [town or city]?
2. What do they sell, and who for?
3. What are their opening hours and how do people contact them?
4. What do people say about them?
5. Would you recommend them for [the thing you actually do]? If not, who would you recommend instead, and why?

For each answer, tell me how confident you are and where the impression comes from. If you do not know, say you do not know rather than filling it in.`,
        tip: "Run it in ChatGPT, Claude and Gemini and compare. Where they disagree is usually where your own information is thin or contradicts itself."
      },
      {
        id: "find-the-wrong-facts",
        title: "Find the facts that are out of date",
        when: "Use this after the first prompt, on anything it got wrong.",
        prompt: `Here is what an AI assistant said about my business:

[paste its answer]

Here is what is actually true:

[paste the correct details: services, hours, prices, locations, staff, anything it got wrong]

Do this:
1. List every point where its answer differs from the truth.
2. For each one, suggest where the wrong version most likely came from. An old listing, a directory, a stale page on my own site, a review, a news mention.
3. Rank them by how much damage the wrong version does to someone deciding whether to contact me.
4. Tell me which ones I can fix myself and which depend on someone else updating something.

Do not guess a source you have no basis for. Say "unknown source" instead.`,
        tip: "Most wrong answers trace back to something you control and forgot about. An old page, a directory listing from years ago, a footer nobody has read since."
      },
      {
        id: "who-gets-recommended",
        title: "Who gets recommended instead of me",
        when: "Use this when the assistant names competitors and you want to know what they have that you do not.",
        prompt: `Question a customer would ask: [for example, "who is the best [your trade] in [your town] for [specific need]"]

Answer it as you would for a real customer. Then:
1. Name who you would recommend and why, in order.
2. For each one, say what specific information made you confident enough to name them.
3. Say what you would need to know about [my business name] to include it in that list.
4. Tell me which of those gaps are about information that exists but is hard to find, and which are about information that does not exist anywhere.

Be honest if the answer is that you have too little to go on for any of them.`,
        tip: "Point 3 is the actionable one. It is usually a plain answerable fact you have never written down anywhere."
      },
      {
        id: "questions-customers-type",
        title: "The twenty questions my customers actually ask",
        when: "Use this to find out what you should have a clear answer to on your site.",
        prompt: `My business: [what you do, who for, where]
What people usually ask me before they buy: [list what you can remember, however few]

Write the twenty questions a real customer would type into an assistant before choosing someone like me.

Rules:
- Real phrasing, the way a person types when they are in a hurry and not an expert.
- Include the awkward ones about price, timing, and what happens when something goes wrong.
- Include the ones where they do not yet know the right word for what they need.
- Mark which of these my own answers would settle, based on what I told you, and which I have never answered anywhere.

Do not write questions that are really adverts for me.`,
        tip: "The questions you have never answered are the list. Answer them plainly on your own site and you have done most of the work."
      },
      {
        id: "who-this-is-not-for",
        title: "Write the who this is not for section",
        when: "Use this when you are trying to be right for everyone and ending up specific to nobody.",
        prompt: `What I do: [describe it]
Who it is genuinely right for: [be specific]
Who keeps contacting me that I am wrong for: [the enquiries you turn down or regret taking]
What I do not do: [the adjacent things people assume you do]

Write two short sections:
1. "This is for you if" with three or four concrete situations.
2. "This is not for you if" with three or four, stated plainly and without insult.

Rules:
- Situations, not adjectives. Not "businesses that value quality", but the actual circumstance they would recognise.
- The second section has to genuinely rule people out. If it does not lose me anyone, it is not doing anything.
- No apology for what I do not do.`,
        tip: "The second list is what makes a recommendation possible. Being clearly wrong for some people is what makes you obviously right for others."
      },
      {
        id: "plain-answerable-sentences",
        title: "Turn my services into plain answerable facts",
        when: "Use this on service pages that describe what you do without ever quite saying it.",
        prompt: `Here is my current services page:

[paste it]

The problem: this is written to sound good, not to answer a question.

1. Pull out every actual fact in it. What is done, for whom, where, how long it takes, what it costs.
2. Show me what is left once the facts are removed. That is the filler.
3. Rewrite it as plain statements a person or an assistant could quote as an answer.
4. List the facts a customer would want that are simply not on the page.

Rules for the rewrite: no adjectives about quality, no "we pride ourselves", one fact per sentence.`,
        tip: "Step 2 is uncomfortable and useful. Most service pages are 80% filler and the owner cannot see it because they wrote it."
      },
      {
        id: "faq-from-real-questions",
        title: "An FAQ from questions people really asked",
        when: "Use this when you have a pile of enquiry emails and no FAQ.",
        prompt: `Here are real questions people have sent me:

[paste enquiry emails, messages, or just the questions you remember being asked]

Turn them into an FAQ.

Rules:
- Keep the customer's phrasing in the question. Do not translate it into industry language.
- Group the ones that are really the same question, and say which you merged.
- Answer only from what I give you. Where you need a fact I have not supplied, leave a [bracket].
- Answer the price question with a real structure, even if it is a range or "it depends on X and Y". Do not write "contact us for a quote" as an answer.
- Short answers. Two or three sentences each.`,
        tip: "Never translate the question into your own jargon. People search using the words they already have."
      },
      {
        id: "does-my-page-answer",
        title: "Does my page answer before it sells",
        when: "Use this on any page you expect a stranger to land on.",
        prompt: `Here is the page:

[paste the text]

The question a visitor arrived with: [what they typed or wanted to know]

1. Does the page answer that question? Quote where, or say it does not.
2. How far down does the answer sit? Count the sentences before it.
3. What does the page do instead in that space?
4. Rewrite the opening so the answer comes first and the selling follows.

Do not touch anything below the opening. I only want to know what happens in the first ten seconds.`,
        tip: "Answer first, sell second. A page that makes someone scroll to find out whether you do the thing usually loses them before they get there."
      }
    ]
  },
  {
    id: "money",
    desc: "Personal money decisions, with every prompt built to make it ask for your numbers instead of inventing them.",
    chip: "Personal",
    name: "Money decisions",
    blurb: [
      "Personal money, where a confident wrong answer costs you something real. Every prompt here forces it to work from your numbers and to show the arithmetic, because getting sums wrong in a certain voice is the thing it does most reliably."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "where-money-goes",
        title: "Where is my money actually going",
        when: "Use this when the month ends and you genuinely do not know where it went.",
        prompt: `Here is a month of my spending:

[paste your transactions, or a rough list. Bank exports work fine.]

Do this:
1. Group it into categories that reflect how I actually live, not standard budget headings.
2. Show what each category came to and what share of the total it was.
3. Point out anything that surprised you about the shape of it.
4. Separate what is fixed and hard to change from what is genuinely discretionary.
5. Flag anything that looks like a subscription I may have forgotten.

Rules:
- Add up only what I gave you. Show your arithmetic for each category total so I can check it.
- If a transaction is ambiguous, ask rather than filing it somewhere.
- Do not tell me what to cut yet, and do not comment on my choices. Just show me the shape.`,
        tip: "Check the totals yourself. Adding up a list is exactly the kind of thing it does confidently and sometimes wrongly, so the visible arithmetic is not optional."
      },
      {
        id: "which-debt-first",
        title: "Which debt do I pay first",
        when: "Use this when you have several and are paying a bit off each with no plan.",
        prompt: `Here is every debt I have:

[for each one: what it is, the balance, the interest rate, the minimum payment, and any fees or deadlines]

What I can put towards debt each month, beyond the minimums: [amount]

Do this:
1. Order them for paying off by cost, highest interest first, and show the total interest that path costs.
2. Order them smallest balance first, and show what that path costs.
3. Show the difference between the two in money and in months.
4. Say which you would pick and why, and be explicit that the second path costs more but is easier to stick to.
5. Flag anything with a deadline, a penalty or a rate that is about to change, since those may outrank both orders.

Show the arithmetic. If I have left out a rate you need, ask instead of assuming one.`,
        tip: "Both orders are valid. Cheapest on paper is worthless if you abandon it in month three, so pick the one you will actually finish."
      },
      {
        id: "check-my-plan",
        title: "Second opinion on my plan",
        when: "Use this when you have decided something and want it stress-tested before you act.",
        prompt: `Here is my plan: [describe it, with the numbers]
Here is my situation: [income, obligations, what a bad month looks like]
Here is what I am assuming: [list what you are taking for granted]

Do this:
1. List every assumption you can see in my plan, including the ones I did not name.
2. For each, say what happens to the plan if it turns out wrong.
3. Tell me which single assumption breaking would hurt most.
4. Tell me what I have not accounted for. Irregular costs, annual bills, the things that only show up once a year.
5. Say what you would want to know that I have not told you.

Do not reassure me. If the plan is fragile, say where.`,
        tip: "Point 4 catches most people. Annual and irregular costs are what turn a plan that works on paper into one that fails in March."
      },
      {
        id: "compare-two-options",
        title: "Compare these two options properly",
        when: "Use this on any either-or with numbers: two insurance plans, two loans, buy against rent, two contracts.",
        prompt: `Option A: [all the terms, costs and conditions]
Option B: [same]
My situation: [what you would actually use, how long you would keep it, what would make you switch]

Do this:
1. Put them side by side on the things that matter to my situation, not on every feature.
2. Work out the real cost of each over [time period], showing the arithmetic.
3. Say at what point one becomes better than the other, and what would have to change.
4. Name what is not in the comparison because neither document says.
5. Say which you would pick given what I told you, and what would flip it.

Only use figures I have given you. Where a term is unclear in what I pasted, say so instead of assuming the usual.`,
        tip: "Point 3 is the answer you actually want. Most of these decisions turn on one number, and it is usually how long you keep the thing."
      },
      {
        id: "what-am-i-missing",
        title: "What have I forgotten to count",
        when: "Use this before committing to anything with an ongoing cost.",
        prompt: `What I am about to commit to: [the thing]
The cost I have budgeted: [what you think it costs]
How I worked that out: [what you included]

Tell me what I have left out.

1. Costs that appear later: setup, insurance, maintenance, renewal, the thing that always needs replacing.
2. Costs that appear annually rather than monthly, which people forget when they budget in months.
3. What it stops me doing, in money terms.
4. What happens to the cost if my circumstances change in the obvious ways.

For each, say whether it is certain, likely or possible. Do not invent figures for my country or my situation. Where a number depends on where I am or who I am, ask me.`,
        tip: "The annual costs are the trap. Anything budgeted monthly quietly ignores the bills that arrive once a year, and those are the ones that break the month."
      },
      {
        id: "explain-this-document",
        title: "Explain this document in plain words",
        when: "Use this on an insurance policy, a contract, a statement, anything you signed without fully reading.",
        prompt: `Here is the document:

[paste it, or the relevant sections]

What I want to know: [your specific question, or "what am I agreeing to"]

Do this:
1. Explain what it actually says, in plain language, section by section.
2. Pull out every obligation on me: what I must do, by when, or lose something.
3. Pull out every situation where they do not have to pay or perform.
4. Flag anything unusual compared to what documents of this kind normally say, and mark that comparison clearly as your general knowledge rather than something in the text.
5. List the questions I should ask before signing.

Work only from the text for points 1 to 3. Quote the wording each point rests on. If something is genuinely ambiguous, say so rather than picking a reading.`,
        tip: "The exclusions in point 3 are the whole document. Everything else is what you assumed you were buying anyway."
      },
      {
        id: "build-the-buffer",
        title: "Build a buffer from nothing",
        when: "Use this when every unexpected bill becomes a small crisis.",
        prompt: `My situation: [income, when it arrives, how regular it is]
What I have set aside now: [including if it is nothing]
What a bad month costs me: [the unexpected bills you actually get]
What I could put aside without it failing in week two: [be pessimistic]

Build me a plan to get to one month of essential costs.

1. Ask me what you need to work out what my essential costs actually are. Wait for my answers.
2. Show me the target figure and how you got there.
3. Show how long it takes at the amount I said, with the arithmetic.
4. Tell me what to do when something goes wrong mid-plan, since it will.
5. Tell me the one change that would most shorten the timeline, and be honest if it is not realistic for me.

No motivational language. If the timeline is long, say the number.`,
        tip: "Be pessimistic about what you can set aside. A plan built on your best month fails in your average one."
      },
      {
        id: "rehearse-money-talk",
        title: "Rehearse the money conversation",
        when: "Use this before talking to a partner, a bank, or someone you owe.",
        prompt: `Who I am talking to: [and what our relationship is]
What I need to say: [the honest version, including anything I have been hiding or delaying]
What I want out of it: [the outcome]
What I am afraid of: [the real fear]

First, help me prepare:
1. What are the facts I need at hand before I start?
2. What is the first sentence? That is the one I will fumble.
3. What will they most likely say, and what is my honest answer to each?

Then play them. Be realistic, including uncomfortable, and stay in character until I say stop.

When I say stop, tell me where I got defensive, where I over-explained, and what I left out that they needed to hear.`,
        tip: "Lead with the number. Every version of this conversation that starts with context and works up to the figure goes worse than the one that starts with the figure."
      }
    ]
  },
  {
    id: "health",
    desc: "Habits, food and follow-through, with prompts that make it ask what is really stopping you.",
    chip: "Personal",
    name: "Health and habits",
    blurb: [
      "Habits, food and follow-through. These do not replace a doctor and they will not know your body, so the prompts are built to make it question you rather than prescribe at you. Anything with a symptom in it belongs in front of a professional."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "ten-questions-constraint",
        title: "Ten questions to find what is really stopping me",
        when: "Use this when you know what you should be doing and are somehow not doing it.",
        prompt: `What I am trying to do: [the goal]
How long I have been trying: [honestly]
What I have already tried: [and how each one ended]

Ask me ten questions, one at a time, to find the constraint I cannot see. Wait for each answer before the next.

Rules for your questions:
- Ask about what actually happened, not about what I intend.
- If an answer sounds rehearsed or too quick, follow it rather than moving on.
- At least three should be about my circumstances rather than my motivation. Time, money, other people, sleep.
- Do not give advice while we are still going.

At the end: tell me what you think is really in the way, quote the answers that led you there, and name the smallest change that would test it.`,
        tip: "The questions about circumstances are the ones that land. Most stuck habits are a logistics problem wearing a motivation costume."
      },
      {
        id: "meals-from-fridge",
        title: "Meals from what is actually in the fridge",
        when: "Use this at 6pm when you are about to order in for the third time this week.",
        prompt: `Here is what I have in:

[list what is in the fridge, the freezer and the cupboard. Be exhaustive and unglamorous.]

Time I have: [minutes]
Equipment: [what you actually own and will wash up]
Things I will not eat: [and any allergies or restrictions, which are not negotiable]

Give me three options I can make from this list.

Rules:
- Only ingredients I listed, plus salt, pepper, oil and water. If something needs one thing I do not have, say so and put it separately.
- Real timings, including prep, and say which parts overlap.
- Tell me which option is the most nutritionally useful of the three and why, in one line.
- No recipes that need a technique I did not say I could do.`,
        tip: "List the boring items too, and the things nearly out of date. That is where the useful suggestions come from."
      },
      {
        id: "smallest-habit",
        title: "The smallest version of this habit",
        when: "Use this when you have started the same habit four times and quit it four times.",
        prompt: `The habit I want: [what you want to do, and how often]
How I have tried before: [what you attempted, and where each attempt died]
My actual week: [when you are free, when you are wrecked, what is fixed]

Do this:
1. Ask me two questions about the failures, aimed at what happened rather than at willpower.
2. Then give me the smallest version that is still worth doing. Small enough that a bad day does not break it.
3. Tell me exactly when in my week it goes, based on what I told you.
4. Tell me what to do on the day I miss it, because I will.
5. Tell me what to look at in four weeks to decide whether to make it bigger.

Do not motivate me. Give me the smallest thing and where it goes.`,
        tip: "Make it embarrassingly small. Whatever you think is the minimum, halve it, because the one that survives a bad week is the only one that counts."
      },
      {
        id: "sanity-check-advice",
        title: "Sanity check something I read online",
        when: "Use this on any confident health claim you saw on a video or a forum.",
        prompt: `Here is the claim:

[paste it, or describe it as it was told to you]

Where I saw it: [platform, and whether the person was selling something]

Do this:
1. Say what part of this is broadly accepted, what is contested, and what is simply wrong.
2. For each, say how confident you are and why.
3. Tell me what the claim leaves out that changes the picture.
4. Tell me who this could be actively bad for.
5. Tell me what a person would need to know about me before saying whether it applies.

Be explicit about the limits of your own knowledge, including where your information may be out of date. If this is something that needs a doctor rather than a chatbot, say that plainly and stop.`,
        tip: "Point 4 is the one to read. Advice that is fine for most people can be genuinely bad for a few, and those few are never mentioned in the video."
      },
      {
        id: "why-did-i-stop",
        title: "Why did I stop, without the lecture",
        when: "Use this after a streak breaks, instead of starting again from scratch on Monday.",
        prompt: `What I was doing: [the habit and how long it ran]
When it stopped: [and what was happening in my life that week]
What I told myself at the time: [the reason you gave yourself]

Do this:
1. Ask me three questions about the week it stopped. Facts, not feelings.
2. Then tell me what most likely broke it, distinguishing between the trigger and the underlying cause.
3. Tell me whether the habit was badly designed for my life, rather than assuming I failed it.
4. Tell me what would have to be different for the next attempt to survive the same week.

Do not tell me to be kind to myself and do not tell me to try harder. Diagnose it.`,
        tip: "Usually the habit was wrong for the week. A fixed daily slot fails the first week your schedule moves, and that is a design fault."
      },
      {
        id: "goal-with-a-number",
        title: "Turn a vague goal into a weekly plan",
        when: "Use this when your goal is a feeling rather than something you could measure.",
        prompt: `My goal: [say it however vague. "Get fitter", "eat better", "sleep properly" are all fine.]
Why it matters to me: [the real reason]
Where I am now: [honestly, with any numbers you have]
What I have available: [time per week, equipment, money, and who else this has to fit around]

Do this:
1. Ask me what you need to turn this into something measurable. Wait for my answers.
2. Turn it into a specific target with a number and a date, and say why that target rather than a more ambitious one.
3. Give me the weekly plan that fits the time I actually have, not an ideal week.
4. Tell me the leading indicator to watch, the thing that moves before the goal does.
5. Tell me what you would expect to go wrong first.

If my target is unrealistic for the time I have, say so and give me the realistic one instead.`,
        tip: "Watch the leading indicator. Weight, fitness and sleep quality lag weeks behind the behaviour, and that gap is where people quit."
      },
      {
        id: "hold-me-to-it",
        title: "Check in on me honestly",
        when: "Use this weekly, in the same chat, once a plan is running.",
        prompt: `Here is what I said I would do this week:

[paste your plan]

Ask me what actually happened, one question at a time.

Rules:
- Ask about what I did, not how I feel about what I did.
- If I am vague, ask again more specifically. "Most days" is not an answer.
- Do not congratulate me for a plan I did not follow.
- Do not scold me either. I want a straight record, not a mood.
- If I missed things, ask what was happening rather than why I did not push through.

At the end: tell me what the week actually shows, what to change for next week, and whether the plan needs adjusting to my life rather than the other way round.`,
        tip: "Run it in the same conversation each week so it can see the pattern. One week is noise, four weeks is information."
      },
      {
        id: "what-would-need-true",
        title: "What would need to be true for this to work",
        when: "Use this before starting something big, while quitting is still cheap.",
        prompt: `What I am about to start: [the plan]
What I am assuming will happen: [including the things you have not said out loud]
How long I expect it to take: [and where that estimate comes from]

Do this:
1. List everything that would have to be true for this to work. Include the ones I have not mentioned.
2. Mark each as within my control, partly in my control, or not in my control at all.
3. Tell me which one is most likely to fail.
4. Tell me what the plan looks like if that one does fail, and whether it is still worth doing.
5. Tell me the cheapest test I could run this week to find out about the riskiest assumption before I commit.

Be blunt. I would rather hear it now.`,
        tip: "The cheap test in point 5 is the whole value. Most big plans rest on one assumption you could check in an afternoon."
      }
    ]
  }
];
