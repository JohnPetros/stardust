---
name: interview
description: Run the interview protocol that resolves material decisions with the user in small rounds of lettered questions before a PRD, Spec, issue or other artifact is written.
---

# Interview protocol

This is the single protocol Stardust workflows use to ask the user questions in small
rounds. It is what the SDD workflows call the **Grilling gate**, and it is mandatory
before writing or changing an issue, a PRD or a Spec. A calling prompt links here and adds
only what is specific to it: the minimum coverage, the impact dimensions, and where
resolved decisions are recorded. Do not copy this protocol into another prompt or into
`sdd.md`. Change it here.

The purpose is to stress-test a proposal until the Orchestrator and the user share one
understanding. Questions replace guesses. They never replace research.

## What the caller must provide

Before the first round, the calling prompt must have defined:

- **Subject**: what is being decided (a product problem, a technical proposal, a feature
  contract).
- **Minimum coverage**: the topics to grill unless authority already resolves them.
- **Impact dimensions**: what each choice should be explained in terms of, such as scope,
  actors, ownership, behavior, compatibility or delivery risk.
- **Record**: the section where resolved decisions and accepted assumptions are written.
- **Gate**: the artifact that must not be created or changed until the interview is done.

When the caller is an issue workflow, the minimum coverage must include, for each item that
remains materially unresolved:

- actor and outcome;
- scope and exclusions;
- permissions;
- acceptance and failure behavior;
- technical boundary;
- validation expectations;
- whether an issue is the right decomposition;
- assignee, and sprint only when the calling prompt uses sprints.

PRDs and Specs go through the same decisions when applicable, plus the decisions specific
to the artifact. A calling prompt may narrow this list when a decision is not applicable;
it may not remove a material decision.

When the user invokes this prompt directly, ask for the subject first. Then derive the
other four from the nearest calling prompt, and say which one you used.

## Research before asking

Facts belong to the Orchestrator. Look up repository, authority, design, PRD, GitHub and
Jira facts, or dispatch bounded read-only research when there is an independent boundary.
Never ask the user for something that can be verified.

Ask only when an unresolved choice changes behavior, scope, permissions, ownership,
technology, a public contract, a consistency guarantee or required verification. Settle a
choice from the request and from repository authority whenever they already give one safe
answer. Do not ask the user to re-decide settled facts or re-confirm an authorization
they already gave. Routine, reversible implementation details stay with the implementer.

## Build the decision tree

List the unresolved material choices as a tree. Each decision branches into the decisions
that depend on it.

The **frontier** is every decision whose prerequisites are settled and that can be
answered without guessing at another open decision.

- Ask from the frontier only. Never ask a downstream question while a prerequisite is
  still open.
- A research task that is still running is an open prerequisite. Defer only the questions
  that depend on it and ask the rest.
- Put the most foundational decisions first.
- Keep researching while questions are pending.

## Rounds

Work in rounds.

- Ask at most **3 questions per round**. If the frontier is larger, ask the three most
  foundational and keep the rest for the next round.
- Number questions in one running sequence across rounds. Do not restart at Q1. A reopened
  decision gets a new number and says which question it reopens; a follow-up may use a
  suffix (`Q9a`).
- Ask directly in the conversation. Do not use a question tool, such as
  `request_user_input` or `request_user_input_async`, and do not hide a decision inside a
  draft of the artifact.
- Wait for the answers. Then settle the answered decisions and recompute the frontier
  before the next round.
- Send only what changed. Do not repeat earlier questions or long blocks, unless the
  calling prompt explicitly requires a full re-ask.

## Question format

Give every question its evidence, three or four materially different options, what each
option changes in the impact dimensions, and one marked recommendation. Use this exact
shape:

```md
❓ **Q1** - **<question title>**: <plain description of the decision and the evidence>

- **A.** <option> — <what it changes>
- **B.** <option> — <what it changes> **(Recommended)**
- **C.** <option> — <what it changes>

➡️ **Recommended: B** — <one or two sentences on why>

---

❓ **Q2** - **<question title>**: ...
```

Rules for the options:

- Use two options only when there are truly only two. Do not invent weak options to fill
  space. The user can always answer with something else.
- Mark exactly one option as recommended. Never present a question without one.
- Write each option and trade-off in short, plain sentences, in the language the user is
  writing in. Define an unavoidable technical term in a few words.
- One decision per question. If choosing an option opens another decision, split it and
  defer the dependent one to a later round.
- Write each question so it can be understood without scrolling: say what exists today,
  what changes and why the decision is open.
- Name a file, symbol or command only where it helps locate something. Otherwise, describe
  the idea.
- When you refer to an earlier question, check or identifier (Q1, CA-03), restate in a few
  words what it means.

## Handling answers

- A partial answer settles only the questions that were answered.
- Silence never approves a recommendation.
- An answer such as "B" or "go with your recommendation" settles that question. Restate
  the settled decision in one line so a misreading is caught early.
- Challenge contradictions and consequential assumptions respectfully.
- Ask a focused follow-up when an answer leaves a material ambiguity. The follow-up takes
  the next number and counts toward the round limit.
- If an answer changes an earlier decision, say which decisions it affects and reopen only
  those.
- If authority already settles every material choice, proceed without inventing questions
  and without asking for a generic confirmation.
- Do not turn the absence of evidence into an implicit decision.

## Stop condition

Do not create, update, publish or otherwise change the gated artifact while a material
branch of the decision tree is unresolved.

The interview is complete only when all of these are true:

- every branch has been visited or explicitly ruled out;
- the frontier is empty;
- you have summarized the shared understanding;
- the user has confirmed that the summary is complete, or has explicitly accepted each
  remaining recommendation.

Never silently assume a decision that was not visited. An accepted assumption must be
explicit and bounded. A decision may stay open only when the calling prompt allows it and
the user explicitly accepts it as non-blocking.

The gate also covers external authorities: do not mutate Jira, GitHub or another external
authority while a material branch is unresolved. The interview does not replace factual
research, the approval of the exact version to be published, or an authority-change
decision.

If a new material decision appears while writing, during the integrity check or during
review, stop, reopen the interview, and continue only after the new frontier is resolved
and confirmed.

## Recording the result

Write resolved decisions, discarded alternatives and accepted assumptions into the section
the caller named. Do not keep an interview transcript or a separate decision-tree file.
