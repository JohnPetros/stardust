---
name: grilling
description: Conduct the decision gate before writing or mutating an SDD artifact.
---

# Grilling gate

After the factual research and before writing or creating the artifact, apply this protocol.
It is mandatory for tickets, PRDs, Specs and Plans; adapt the questions to the artifact type
without removing material decisions.

## Design tree and frontier

1. Research the facts first in the repository, the authorities, the design, GitHub/Jira and the
   other applicable sources. Use bounded read-only research when there is an
   independent boundary. Never ask the user for facts that can be verified.
2. Model the still-open decisions as a **design tree**. Each decision must declare the
   decisions that depend on it, the relevant alternatives, the impact and the available evidence.
3. Compute the round's **frontier**: all materially necessary decisions whose prerequisites
   are already resolved. Do not guess a pending decision to unlock a descendant question.
4. Ask the entire current frontier in a single numbered round. After each answer, record the
   decision, discarded alternatives, dependencies and contradictions; recompute the tree and the next
   frontier. Questions that depend on answers from the current round are left for the next round.

## Question format

Write the round directly in Markdown in the conversation (not inside a code block), using
this structure without exception:

```md
## Grilling — round <n> (<k> questions)

❓ **Q<n> — <decision in a few words>**
<Context: the verified fact that opens the decision, with evidence (`path:line`, issue, doc), in up to
three lines. Depends on: <Qx = answer> or "none".>

- **(a) <option>** — <consequence or trade-off of this option>
- **(b) <option>** — <consequence or trade-off of this option>

➡️ **I recommend (a)** — <one-sentence justification>.

---

❓ **Q<n+1> — ...**

---

**Deferred:** Q<m> — <decision> (depends on Q<n>).
**How to answer:** `Q<n>: a` per line; free text is also fine. An unanswered question remains open.
```

Format rules:

- **One decision per question.** If choosing an option opens another decision (for example,
  renaming and also changing the contract), split it into two questions and defer the dependent one.
- **Self-sufficient context.** The user must understand the question without scrolling the conversation: say
  what exists today, what changes and why the decision is open. Do not presuppose terms not defined
  in the round or in earlier rounds.
- **Explicit options.** Two to four mutually exclusive options, labeled `(a)`, `(b)`…,
  each with its consequence. Do not hide options inside a paragraph. Do not invent an option
  just to fill out the list; when there is only one viable path, ask for confirmation.
- **Referenced recommendation.** The `➡️` line cites the recommended letter and the main reason;
  impact and evidence are already in the context and in the options.
- **Stable IDs.** Number the questions sequentially across the whole session (`Q1`, `Q2`…), without restarting
  per round. A reopened decision gets a new ID with `Reopens Qx` in the context; a follow-up from
  an answer may use a suffix (`Q9a`).
- **Ambiguous answers.** Do not infer. If the answer does not identify the question or the option, or only
  answers part of the round, confirm the interpretation in one line and repeat, in short form, only
  the questions still open.
- **Round record.** After the answers, list the decisions made (`Qx → option`) before
  opening the next round or the design review.

Challenge contradictions and risks; do not turn the absence of evidence into an implicit decision.

## Minimum frontier for tickets

In tickets, ask questions about each item below that remains materially unresolved:

- actor and outcome;
- scope and exclusions;
- permissions;
- acceptance and failure behavior;
- technical boundary;
- validation expectations;
- whether a ticket is the right decomposition;
- sprint;
- assignee.

For PRDs, Specs and Plans, go through the same decisions when applicable and add the
decisions specific to the artifact. Grilling does not replace factual research, issue approval,
publication approval or an authority-change decision.

## Writing gate and confirmation

Do not write the ticket or any artifact, nor mutate Jira/GitHub or another external authority,
while a material unresolved branch exists. When the frontier is empty, present the
shared understanding and obtain explicit confirmation from the user before creating, updating
or publishing the artifact.

Record the resolved decisions, discarded alternatives and accepted assumptions in the final artifact;
do not copy the interview transcript. If a new material decision arises during writing,
integrity checking or review, stop, reopen Grilling and only continue after resolving the new
frontier and obtaining the necessary confirmation.
