# Story Writing Rules

# Overview

A story is the content of a lesson star: an ordered sequence of text blocks,
visuals, read-only examples and questions. These rules define how a story must
be written so that the student spends more time practicing than reading.

## Goal

Standardize the pacing, the question mix and the structure of every story, so
that each star teaches one concept through explanation followed immediately by
practice.

## Responsibilities

- Limit continuous reading and interleave it with questions.
- Order the questions of a star from recognition to writing.
- Reuse earlier concepts so they are not forgotten.
- Open and close every star with a narrative hook.
- Keep the mechanics inside the fiction: ship energy, hints spoken by Faísca,
  answers that read as actions of the student.
- Keep every story consistent with the approved narrative.

## Boundaries

- These rules cover the **content** of a story. The behavior of the lesson page
  (lives, progress, resume, highlight, history) belongs to the PRDs under
  `documentation/prds/lesson/`.
- The plot, the cast and what each planet reveals belong to
  [Narrativa e universo das histórias](../prds/lesson/story-narrative.md). A
  story must not contradict or anticipate it.
- Every Delégua snippet in a story also follows the
  [Delegua Language Rules](delegua-rules.md).
- The planet videos are watched in the Space, not in the story, and belong to
  [Trilha e Espaço](../prds/space/space-page.md). The student can skip them, so
  a story must stand without them.
- These rules do not cover challenge stars, which are evaluated independently.
- Student-facing content is written in PT-BR. This document is in English, like
  the other rules, and quotes PT-BR product terms literally.

# Global Directory Structure

Story content and its authorities live in:

- `documentation/prds/lesson/story-narrative.md`: plot, cast, planets, twists
  and the story code.
- `documentation/prds/lesson/lesson-page.md`: block sequence, questions, lives,
  history and highlight.
- `documentation/prds/lesson/multiple-choice.md`,
  `documentation/prds/lesson/block-programming.md` and
  `documentation/prds/lesson/code-writing.md`: the three question types.
- `documentation/prds/lesson/text-blocks-and-narration.md` and
  `documentation/prds/lesson/visual-blocks.md`: text block types and visuals.
- `documentation/prds/space/space-page.md`: planet opening, the presentation
  video of each planet and the closing video of the trail.
- `apps/web/src/mocks/lesson/planets/planet<N>/star<N>/`: `texts.ts` and
  `questions.ts` of each star.
- `apps/server/src/database/seeders/data/seed-catalog.json`: the catalog
  snapshot that seeds planets and stars locally.

## Organization

- One star teaches one concept. A second concept belongs to another star.
- The star order inside a planet follows the pedagogical progression, not the
  order of the plot.
- A story is written for the block types and question types the PRDs define. A
  rule here must not require a capability the PRDs do not provide.

# Core Principles

## Must contain

### At most five consecutive text blocks

A story must not present more than five text blocks in a row before a
question.

- Only text blocks count. Read-only examples and visuals neither count nor
  reset the count.
- The count resets at every question.
- A story that needs more than five text blocks to explain something must be
  split by a question about what was just explained.

### Predict before running

Before the student can run a read-only example whose output teaches the
concept, the story must ask what the code will print.

- Use a multiple-choice question in prediction mode (`modo previsão`), which
  keeps `Executar` unavailable until the question is approved.
- After approval, the student runs the code to confirm the prediction.
- The alternatives must be plausible outputs, including the outputs produced by
  common misreadings of the code.

### A ladder in every star

The questions of a star must follow this order of difficulty:

1. **Predict**: multiple choice about what a snippet does.
2. **Assemble**: block programming with a curated set of blocks.
3. **Complete**: code writing that starts from an initial snippet.
4. **Write**: code writing from scratch.

A star may skip a step that does not fit its concept, but it must not reorder
the steps, and it must end with a code-writing question.

**Exception:** a star that teaches no syntax is exempt from the code-writing
requirement. Today the only one is the programming-logic star of the first
planet. A new exception must be added to this list before the star is written.

### Fix-the-bug questions

Each planet must contain at least one code-writing question whose initial
snippet is broken code that the student repairs.

- In the fiction, the broken code is something Faísca ran without thinking.
- The snippet must contain exactly one kind of mistake, and that mistake must
  be a common one for the concept of the star.
- Use the completion modality of code writing. The whole editor stays editable.

### Embedded review

- The first question of every star, except the first star of the trail, must
  be about the concept of the previous star.
- The challenge star that closes a planet must require at least one concept
  from an earlier planet.

### Wrong alternatives with a purpose

- Every incorrect alternative of a multiple-choice question must represent a
  specific, common beginner mistake. An alternative that no student would
  choose must be replaced.
- Every incorrect alternative must have its own hint (`dica`). The hint
  addresses the mistake behind that alternative and must not reveal or point to
  the correct one.
- The success feedback explains why the correct alternative is correct.

### A visible consequence after written code

After a code-writing question, the next block must be a highlighted visual
that shows what the approved code caused in the story: the rocket takes off,
the door opens, the ship rejoins the convoy.

### A summary at the end

The last block of every story must be a text block of type `informação` with
at most three lines stating what the student learned in the star.

### A hook at both ends

Every star must open and close with a narrative hook, written as text blocks.

- **Opening hook.** The first blocks of the star, before the first question,
  state what is happening in the planet right now and what is at stake. They
  count toward the five-block limit.
- **Closing hook.** The block immediately before the summary leaves an open
  question about what comes next, so the student has a reason to return.
- A hook must not recap the plot. It moves the story forward.
- A hook must not repeat what the planet video shows, and must not depend on
  the student having watched it.

### Hints in Faísca's voice

Every hint of a question must be a line spoken by Faísca, in a block of type
`dica`.

- Faísca is impulsive: her hints are short and direct, never a lecture.
- The rules of [Wrong alternatives with a purpose](#wrong-alternatives-with-a-purpose)
  still apply: the hint addresses the mistake and does not reveal the answer.

### Ship energy, never lives

In the fiction, a wrong answer is a wrong command that the ship runs, and it
costs ship energy. Without energy, the ship falls back to the orbit of the
planet and the story restarts.

- Story text must say `energia` or `energia da nave`, never `vidas`.
- Running a read-only example or testing code costs no energy, and the story
  must not suggest that it does.

### Sound effects that mark events

A block may have one optional sound effect, chosen from the shared library.

- Use a sound effect only on a block where something happens in the story: an
  alarm, a door, a takeoff, an arrival.
- Use the same effect for the same event or character across the trail. The
  presence of the Nulo always uses its own effect.
- The text or the visual of the block must convey the event on its own: the
  student may have sound turned off.

### Mood changes at turning points

Every story starts with the base ambient sound of its planet, which is a
soundscape of the place, not music. A block may mark a change of mood
(`clima`), chosen from the set shared by all stories. A mood is discreet
music.

- Change the mood only when the scene turns: a threat arrives, a danger
  passes, something is revealed.
- A mood lasts until the next change or the end of the star. Return to the
  base sound of the planet when the turn is over.
- Use each mood for the same kind of moment across the trail, so the student
  learns what it means.
- The mood is sound only, and ambient sound is off by default: the text or the
  visual must carry the turn without it.

## Must not contain

- More than five consecutive text blocks.
- A read-only example whose output is the point of the lesson, shown without a
  prediction question before it.
- A star that ends on a multiple-choice or block-programming question, unless
  it is a listed exception.
- A multiple-choice question that can only be answered by elimination because
  its wrong alternatives are implausible.
- A hint that states the correct answer or excludes all but one alternative.
- A question whose answer depends on a concept the trail has not taught yet.
- A character, place or revelation that contradicts the narrative PRD, or a
  twist revealed before its planet.
- A question whose correct answer is who ran the function that erased Lira.
  The narrative keeps that open.
- A star that begins with a question or ends without a closing hook.
- A story that depends on something shown only in a planet video.
- A hint spoken by a character other than Faísca, or written as interface text
  with no character.
- The word `vidas` in story text.
- A sound effect on an ordinary line of dialogue, or an event that only the
  sound conveys.
- A mood that is not in the shared set, or a mood change every few blocks.
- Delégua code that was not validated in the project interpreter.

# Design Patterns

## Star skeleton

Use this skeleton as the starting point of a story. Text runs between
questions stay within the five-block limit.

1. Opening hook: what is happening in the planet right now.
2. Review question about the previous star, set in that situation.
3. Explanation of the concept, with one read-only example.
4. Prediction question about that example, then the student runs it.
5. Block-programming question that assembles the same idea.
6. Code-writing question from an initial snippet. When the planet still lacks
   one, make it a fix-the-bug question.
7. Code-writing question from scratch.
8. Highlighted visual with the consequence in the story.
9. Closing hook: the question that the next star answers.
10. Summary block of type `informação`.

Avoid stretching the skeleton with extra explanation steps. When a concept
needs a second example, give it its own prediction question.

## Prediction question

- The statement asks what the code prints or which value a variable holds at
  the end.
- The reference code is the same read-only example the story has just
  presented, or a small variation of it.
- Keep the snippet short enough to be traced mentally.

Avoid prediction questions for code whose output depends on input the student
cannot see.

## Fix-the-bug question

- The statement says what the code was supposed to do and what happened
  instead. It does not say where the mistake is.
- The requirements describe the expected behavior, not the specific edit.

Avoid snippets with several unrelated mistakes: the student cannot tell which
one the star is about.

## Question as an action

After approval, the answer appears in the history as an action of the student
character.

- Write the statement so that the answer is something the student does in the
  story: the command sent to the ship, the choice made at a fork, the program
  that opens a door.
- Prefer statements spoken by a character who needs that action over
  statements that address the student as a test-taker.

Avoid statements such as "Marque a alternativa correta", which make the answer
read as a test item in the history.

# Applied Usage Patterns

## Counting text blocks

| Sequence | Valid | Reason |
| --- | --- | --- |
| text, text, text, example, text, text, question | Yes | Five text blocks; the example does not count. |
| text ×5, visual, text, question | No | Six text blocks; the visual does not reset the count. |
| text ×5, question, text ×5, question | Yes | The count resets at each question. |

## Writing a hint

For a question that asks what `escreva("2" + 2)` prints, an alternative of `4`
comes from treating the text `"2"` as a number.

- Correct hint: "Observe as aspas em volta do primeiro valor."
- Incorrect hint: "O resultado é um texto, não um número." It reveals the
  answer category and excludes the other alternatives.

The correct hint also fits Faísca: one short, direct line.

## Choosing a sound effect

| Block | Sound effect | Reason |
| --- | --- | --- |
| The ship alarm goes off while Panda is talking | Yes | An event happens in this block. |
| The Nulo appears at the end of a corridor | Yes, the Nulo effect | The same effect marks the Nulo in every planet. |
| Panda explains what a variable is | No | Nothing happens; it is ordinary speech. |
| A door opens, and the text only says "Ouça." | No | Only the sound conveys the event. Rewrite the text first. |

## Common mistakes

- **Explaining twice before asking once.** Ask after the first explanation and
  explain the rest in the success feedback.
- **Using multiple choice as the only question type.** The student ends the
  star recognizing code without having written any.
- **Reviewing with the same question.** A review question must apply the
  earlier concept to a new situation, not repeat a question the student already
  answered.
- **Decorative visuals.** A highlighted visual after written code must show the
  effect of that code, not an unrelated scene.
- **A recap instead of a hook.** An opening that retells the previous star
  spends text blocks without moving the story.
- **Sound everywhere.** When most blocks have an effect, the effect stops
  meaning that something happened.
- **A mood that never ends.** A tension mood left on through the explanation
  and the questions stops reading as tension. Return to the base sound.

# Integration Rules with Other Layers

- **Lesson page PRDs.** A story uses only the blocks, question types and states
  those PRDs define. When a rule here needs a new capability, change the PRD
  first, through the SDD workflow.
- **Lives and ship energy.** The PRDs use `vida` for the rule and present it to
  the student as `energia da nave`, as defined in `lesson-page.md`. Story text
  uses only the second.
- **Sound.** System effects and the optional effect of a block are defined in
  `lesson-page.md`. A block effect plays once, when the block is revealed, and
  never in the history. The base ambient sound belongs to the planet; a block
  can only switch it to a mood of the shared set. The student controls
  narration, effects and ambient sound from the audio dialog of the story.
- **Planet videos.** Their content is defined in `story-narrative.md` and their
  playback in `space-page.md`. A story neither plays nor references them.
- **Multiple choice.** Prediction mode and per-alternative hints are defined in
  `multiple-choice.md`. Every multiple-choice question provides the statement,
  the ordered alternatives, one correct alternative, the success feedback and a
  hint for each incorrect alternative, spoken by Faísca.
- **Code writing.** Fix-the-bug questions use the completion modality defined
  in `code-writing.md`. Running code never costs a life; only an evaluated,
  failed answer does.
- **Block programming.** Each question offers only the blocks selected for the
  activity, as defined in `block-programming.md`.
- **Visuals.** A highlighted visual is always a Lottie, as defined in
  `visual-blocks.md`.
- **Narrative.** The cast, the planet identity, the clues and the twists come
  from `story-narrative.md`.
- **Delégua.** Reserved words, logical values and identifiers follow
  `delegua-rules.md`.

# Quick Checklist for New Features in the Layer

- [ ] No run of text blocks is longer than five.
- [ ] Every example whose output matters is preceded by a prediction question.
- [ ] The questions follow the ladder, in order.
- [ ] The star ends with a code-writing question, or is a listed exception.
- [ ] The planet has at least one fix-the-bug question.
- [ ] The first question reviews the previous star.
- [ ] Every incorrect alternative is a plausible mistake and has its own hint.
- [ ] No hint reveals or points to the correct alternative.
- [ ] A highlighted visual follows each code-writing question.
- [ ] The last block is an `informação` summary of at most three lines.
- [ ] The star opens with a hook and has a closing hook right before the
      summary.
- [ ] Nothing in the story depends on the planet video.
- [ ] Every hint is a short line spoken by Faísca.
- [ ] Story text says `energia`, never `vidas`.
- [ ] Each sound effect marks an event that the text or the visual also
      conveys.
- [ ] Each mood change marks a turn of the scene, uses the shared set and
      returns to the base sound when the turn is over.
- [ ] Each statement makes the answer read as an action of the student.
- [ ] Nothing contradicts or anticipates the narrative PRD.
- [ ] All Delégua code was validated in the project interpreter.

# Notes and Pending Items

- **Existing content does not comply.** The stories in the current catalog were
  written before these rules and have between 34 and 59 blocks each. They must
  be rewritten, not patched.
- **AI explanation in prediction questions.** The PRDs keep `explicar com IA`
  available on reference code, including in prediction mode, where it can
  describe the output before the student answers. The feature is planned to be
  disabled in code for now. The rule must be revisited before it is enabled
  again.
- **Closing hook before the summary.** The summary stays as the last block, as
  approved, so the closing hook is the block before it. Placing the hook last
  would end the star on the open question; that order was not approved.
- **Sound library.** The shared library of story effects and the shared set of
  moods do not exist yet. Until they do, a story records the intended event of
  each effect and the intended kind of mood, not a file.
- **Hints outside multiple choice.** Only multiple choice defines a hint today.
  If another question type gains one, it follows the same rule.
- **Measurement.** `lesson-page.md` defines the events that measure a story. No
  numeric targets were approved, so these rules set no threshold for time per
  star or error rate.
- **Authoring tools.** These rules do not depend on how a story is authored.
  When the Backoffice validates a story, the checklist above is the reference.
- **Exceptions list.** The only exception to the code-writing requirement is
  the programming-logic star. The trail is being rewritten, so the list must be
  reviewed when the new stars are defined.
