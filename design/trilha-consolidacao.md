# Consolidation — redesign of the Stardust path

Session record, consolidated on 2026-10-11. It gathers product, behavior and
design decisions; it serves as the basis for the next review of the PRDs and
for a future Spec. The drawings do not constitute an implementation in the application.

References: [canvas](stardust.pen), [design tokens](../documentation/design.md),
[story editor PRD](../documentation/features/lesson/story-editor/prd.md).

## 1. Vocabulary and path organization

| Interface name | Pedagogical meaning | Content |
| --- | --- | --- |
| Planet | Theme, such as variables, conditionals or loops | A sequence of stars |
| Star | Learning step | Story or code challenge in the final worked design |
| Story | Guided, interactive experience | A sequence of story blocks |
| Story block | Item of the sequence | Text, image, animation, example or question |
| Block programming question | Activity with Blockly | Assembly with the blocks selected for that question |
| Code programming question | Delégua writing activity | Write or complete code |

- Planets have a completion order. Completing a planet unlocks the next one.
- Stars also have a completion order. The previous one must be completed
  to advance to the next.
- The interface uses **planet** and **star**, instead of theme and step.
- Multiple choice remains inside the stories. Standalone quizzes were
  removed: the stars contain stories or code challenges.

## 2. Stories and storytelling

The story presents concepts in Stardust's narrative context, with the Panda
guiding the student and with situations that give purpose to the examples and activities.
The redesign will be done in parts: planet organization, storytelling and
the content of each story. The complete script and the definitive list of planets
need to be recovered or produced in a dedicated artifact; they are not inferred
from the illustrative names used in the frames.

### Available blocks

| Block | Behavior |
| --- | --- |
| Text | Speech, explanation, tip or warning |
| Image | Static illustration, with the possibility of highlighting |
| Animation | Can be a Lottie; can react to the events of an activity |
| Code example | Read-only Delégua, with execution when applicable |
| Block programming example | Read-only Blockly; can present only the assembly or allow execution |
| Multiple choice question | Choose an option and check the answer |
| Block programming question | Assemble a solution with Blockly and check the answer |
| Code programming question | Write or complete Delégua, run it and submit it for analysis |

### Text blocks

- Character and type belong to the same block.
- The student is also a character, with their own appearance.
- The avatar is defined per block: the same character can appear with
  different images or expressions.
- It is not necessary to repeat the name “Panda” in the bubble.
- The colors of the common blocks are stable per character/type, regardless
  of the current planet. The Panda's speech keeps the purple identity that was worked out.
- Tips and warnings keep the yellow identification; informational blocks may
  preserve their blue identity.

## 3. Story layout and progress

- The layout changes according to progress and the highlighted block.
- Text and visual element can sit side by side, alternating sides when
  it makes sense for the composition.
- Speeches are always part of the history. A highlighted image or example
  does not create a separate sequence of speeches.
- Only the highlighted visual element is sticky: code, Blockly,
  image or animation. No speech is pinned outside the story history's scroll.
- The history remains scrollable, with shading on the top overflow.
- The point at which a block enters or leaves the highlight is determined by the story's
  content. When it leaves the highlight, it becomes part of the normal history.
- The highlighted block can have larger dimensions than its representation in the history.
- Layout changes are animated. The entrance starts at `opacity: 0` and ends
  visible. This rule was decided; the animation was not implemented in this session.

During a question, the side history stops appearing. The statement sits
above the activity, as a text block. Reading examples and questions are
distinct states of the story.

When a question is completed, the approved answer can remain in the history
for reference, without further editing or a new attempt in that review state.

## 4. Questions, evaluation and lives

### Multiple choice

- Remains for interpreting and understanding concepts.
- The statement can include read-only code.
- Options do not use letters such as A, B or C.
- A selection not yet evaluated has a blue marking.
- Correct and incorrect answers have their own visual states.
- When wrong, the student tries again until correct, as long as they have lives.

### Block programming — Blockly

- Each question makes available only the blocks chosen by the author.
- The block bank uses the real appearance of the blocks, instead of just a generic
  list of commands.
- The **Blocos** (Blocks) tab presents the assembly; **Código** (Code) shows the generated Delégua
  in read mode, with no padlock on the tab.
- There is no two-way editing between Delégua and Blockly defined in this proposal.
- Blockly can appear as a reading example or as a question.

| Modality | Evaluation | Actions |
| --- | --- | --- |
| Execution question | Result of the execution, deterministically | Run and Check answer |
| Assembly question | Structure and organization of the assembly, deterministically | Check answer |
| Executable example | No answer evaluation | Run |
| Assembly example | No answer evaluation | Reading of the assembly and the generated code |

- **Jev does not take part in the evaluation of Blockly.**
- The criteria from the previous proposal were removed from the Blockly UI.
- A separate evaluation result tab is not necessary in this proposal.
  Feedback belongs to the activity state; program output is something else.
- The terminal follows Stardust's current appearance: “Saída” (Output) section,
  collapsible, integrated into the editor.
- Whether a single assembly or equivalent assemblies are accepted depends on the
  question. The restriction of the block bank simplifies this decision, but does not
  demonstrate that every question must require a single assembly.

### Writing code in the stories

- The student also writes code during the story, in smaller, guided
  activities, before facing the challenges.
- The activity can ask for writing from scratch or completing a snippet.
- It must be possible to run the code and then submit it for analysis.
- Code and execution context help Jev evaluate the answer.
- The proposal converged on executable code before analysis; the old rule of
  accepting syntax errors that prevent execution was abandoned.
- The editor is frozen during Jev's analysis.
- All requirements must be met to advance.
- Requirements and their correct/incorrect states are visible. In the worked frame,
  this section occupies the left side and replaces the activity's image.

### Lives and new attempts

- The student starts the story with **10 lives**.
- A wrong answer costs one life.
- Running to experiment is not the same as submitting a wrong answer.
- The student can try again until answering correctly.
- When all lives are lost, the entire story restarts, with 10 lives;
  not just the question where they stopped.

## 5. Code challenges

- They are stars of their own on the path.
- They contain only code writing; Blockly was not included in the challenges.
- They keep the current test-based evaluation. The inclusion of Jev was removed for now.
- Writing code within the story works as guided practice;
  the challenge requires a more independent solution.
- The current static playback did not motivate replacing the challenges with Blockly.

## 6. Scenes and animations

- The chosen direction was **scenes by event**: the visual presentation can
  react to the events of the activity.
- Static images per state and Lotties are possibilities for these blocks.
- A Blockly question can interact with a Lottie.
- Remotion was discussed, but was not adopted as a dependency or requirement.
- The catalog is persisted remotely. The event contract, scene configuration
  and storage strategy still need technical design.
- In this session, the star drawings represent static frames of the
  assets; they do not reproduce the running Lottie inside the canvas.

## 7. XP, StarCoins and result page

- XP and StarCoins are completion rewards, configured for the story.
- The reward is granted once; reviewing a completed story does not generate
  a new reward.
- Mistakes affect lives, with no additional reward deduction in this proposal.
- The values **60 XP** and **20 StarCoins** used in the drawings are examples,
  not a general scoring formula.
- The result highlights “História concluída!” (Story completed!) and the rewards.
- No time or accuracy metrics were added to the result.
- The main action returns to **Espaço** (Space), instead of directly opening the
  next star. Reviewing the story is a secondary action.
- When there is a streak celebration, the flow goes through rewards,
  “Continuar” (Continue), streak celebration and return to Space.
- The existing level celebration remains a possibility of the current flow.
- The streak visualization in the result is weekly; the profile's monthly
  visualization has a different context. This session's refactoring stayed in the result.

## 8. Space page

- Planets represent themes; numbered stars represent progress.
- The trail between the stars is **dotted**: unlocked stretch yellow and
  locked stretch gray.
- The unlocked star preserves the application's `unlocked-star` asset.
- The locked star preserves the current drawing, which in the codebase is an SVG,
  not a second Lottie.
- The locked planet keeps the illustration with reduced opacity; in the current frame
  **35%** was used, replacing the padlock circle.
- Star labels distinguish type and state with icons and text hierarchy:
  completed in green, available in yellow and locked with a discreet appearance.
- On desktop, the details of available and completed stars appear on the
  side on hover; keyboard focus must offer equivalent access.
- Completed stars allow review. Locked stars remain without
  navigation, with the unlock condition indicated on the map.
- Entering Space and the FAB take as reference the first star not yet
  completed, as long as there is content left to complete.
- A loading failure presents a message with “Tentar novamente” (Try again) and must not
  be confused with a path without content.
- Repositioning uses the existing FAB, with an up arrow; the additional
  “Minha posição” (My position) button was removed.
- The current sidebar was turned into a reusable component.
- Inactive navigation icons remain clear and legible; only the
  active item gets a green background.

### Mobile — canonical reference

The user defined `jIgbf` as the canonical mobile version, at 390 × 844.
Tapping the star presents the details in a bottom panel. The sidebar
is accessed through the menu in the header and the trail remains dotted.
`iqvkE` records the map without the open panel. The alternative `FlYnP`, with details
below the star on the map, was drawn for evaluation and discarded in favor of
`jIgbf`.

## 9. Visual system

- The components created use the project's canonical tokens, as per
  `documentation/design.md`.
- Poppins is the interface font; Roboto Mono is the reference for code.
- Syntax colors follow the Monaco tokens that were worked out.
- Narrative and Blockly category colors preserve their identities;
  they are not automatically replaced by the planet color.
- Original colors of illustrations and assets are preserved.
- The editor actions live in the header of the activity container.
- The final adjustment requested for the header controls was a height of 32;
  earlier requests of 24 need to be reconciled per component in the Spec.

## 10. Inventory of the session's drawings

IDs recorded during the session in the canvas `design/stardust.pen`.
The active canvas was in another project at the time of this consolidation;
this inventory does not claim a new inspection of the frames on 2026-10-11.
Some IDs cited initially in the conversation changed after the transfer
of the drawing; the table uses the IDs recorded in the Stardust file.

| Reference | Node ID | State |
| --- | --- | --- |
| Story with text and image | `fglWW` | Reference drawn |
| Story with highlighted code | `NZaJd` | Reference drawn |
| Blockly question | `m5G9I` | Reference drawn |
| Blockly with correct and incorrect answers | `oZyQS` | Adjusted after the removal of the criteria |
| Blockly with Code tab active | `sWPk3` | Reference drawn |
| Highlighted Blockly reading example | `W9JlW` | Reference drawn |
| Block bank and categories | `YYidd` | Catalog drawn |
| Code writing question | `GV68P` | Reference drawn |
| Code writing with correct and incorrect answers | `mty3Q` | Reference drawn |
| Multiple choice — correct answer | `L4ZLNb` | With code in the statement |
| Multiple choice — neutral selection | `n4OPA` | Blue selection |
| Multiple choice — wrong answer | `TADST` | Reference drawn |
| Story with full history | `HDJcy` | Review of examples and answers |
| Story result | `W6mTMv` | Return to Space |
| Rewards before the streak celebration | `H0W1KQ` | Continue action |
| Streak celebration in the result | `uSana` | Weekly visualization |
| Weekly component used in the result | `dz8qE` | Reference drawn |
| Compact sidebar | `h4jv5` | Reusable component |
| Desktop Space | `kryQ0` | 1440 × 1100 |
| Mobile Space — map | `iqvkE` | State without open panel |
| Mobile Space — selected star | `jIgbf` | Canonical mobile reference |
| Mobile Space — details below the star | `FlYnP` | Discarded alternative |

## 11. Pending items for the next definition

1. Consolidate the final list of planets and the story scripts,
   starting with the first planet; the frame names do not replace this work.
2. Incorporate into the PRDs the removal of standalone quizzes and the split by
   question modalities, each with its reading version; authoring is
   out of scope for this delivery.
3. Define, per assembly question, which equivalent solutions are accepted.
4. Detail the code execution and analysis contract, including what happens
   when execution fails and when the analysis service is unavailable.
5. Define events and configuration of the scenes/Lotties in the remote catalog.
6. Define progress persistence, resumption after leaving and restart when lives reach zero.
7. Define reward values and integration with the current streak and level flows.
8. Specify the entrance animations from opacity zero and use `jIgbf`
   as the canonical mobile reference.
9. Reconcile final control dimensions and review accessibility in the future implementation.

The next product artifact must incorporate these decisions into the affected PRDs;
technical planning and implementation depend on a dedicated Spec.
