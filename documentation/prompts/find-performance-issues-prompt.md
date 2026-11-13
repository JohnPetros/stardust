
---
description: Prompt to find performance issues in a codebase and propose prioritized fixes.
---

# Prompt: Find Performance Issues

**Objective:**
- Given a codebase and a usage context, identify performance bottlenecks and risks (frontend, backend, build, database, integrations) with evidence, expected impact and a prioritized fix plan.
- Deliver an actionable diagnosis: what is slow, why it is probably slow, where in the code this occurs, and how to validate the improvement.

**Input:**

- **Main task/topic (required):** `{TASK}`
  - E.g.: "find performance issues in the login flow", "reduce the dashboard's TTFB", "optimize page X", "reduce memory usage in job Y".
- **Target and scope (required):** `{TARGET}`
  - Paths/packages/apps to inspect, routes, features, or "entire repo".
- **Product and problem context (required):** `{CONTEXT}`
  - Affected flow(s), environment (dev/stage/prod), users, volume, and symptoms.
- **Observed signals and metrics (optional, but recommended):** `{SIGNALS}`
  - E.g.: timings (p95/p99), TTFB/LCP/INP, CPU/memory, errors, logs, traces, flamegraphs, bundle size.
- **Stack and constraints (optional):** `{STACK}`
  - Frameworks, runtime, DB, queues, cache, providers, limits (SLA, cost, compatibility).
- **Restrictions and preferences (required):** `{CONSTRAINTS}`
  - E.g.: "do not change the schema", "do not change behavior", "do not add a dependency", "use Markdown", "no premature optimization".
- **Available sources (required):** `{SOURCES}`
  - PRDs/specs, internal guidelines, links, observability, tickets, and access to the codebase.

Expected format for `{SOURCES}`:
- Links (bullets) and/or file paths.
- Relevant excerpts (copied/pasted) if you do not have access to the repository.

**Applicable Rules:**

Before proposing fixes, read:

- `documentation/rules/rules.md` — index for selecting rules by layer.
- `documentation/rules/code-conventions-rules.md` — when the recommendation involves refactoring, naming or code organization.
- Specific rules of the layers affected by the bottleneck (`ui`, `web`, `server`, `rest`, `rpc`, `database`, `queue`, `provision`, `realtime`, `ai`, `validation`, etc.).

Do not recommend optimizations that violate the layer rules. If the best optimization requires changing a rule, flag it as an architectural decision and not as an automatic fix.

**Execution Guidelines:**

1. **Understanding and validation of inputs**
   - Rewrite `{TASK}` in one objective sentence and define the type of performance in focus (e.g., frontend runtime, API, DB, build, job, cold start).
   - Define measurable success criteria (even if by hypothesis), and note the critical constraints from `{CONSTRAINTS}`.
   - If something essential is missing (e.g., which route/flow or which symptom), record it under "Open items" and proceed with safe (explicit) defaults.

2. **Survey of what already exists (before inspecting code)**
   - First read the relevant rules/architecture/guidelines in `{SOURCES}`.
   - Look for similar implementations (similar features, equivalent endpoints, pages with the same pattern) to compare approaches.
   - Identify where the system should measure performance (logs/metrics/traces) and whether instrumentation already exists.

3. **Investigation in the codebase (collect evidence, not just guesses)**
   - Map the path of the request/user action:
     - Entry (UI/route) -> call (RPC/REST) -> domain/service -> repository/DB -> return -> rendering.
   - Find hotspots by signals and by common patterns, for example:
     - **Frontend:** excessive re-rendering, poorly partitioned global state, lists without virtualization, heavy computations in render, large images/JS, duplicate requests, waterfalls, incorrect use of suspense/caching.
     - **Backend/API:** N+1, queries without index/without filter, heavy serialization, synchronous loops, lack of pagination, improper use of cache, low concurrency.
     - **DB:** queries with heavy joins, missing indexes, scans, incorrect pagination, long transactions.
     - **Jobs/queues:** batch processing without chunking, exploding retries, concurrency/limits, growing memory.
     - **Build/bundle:** large dependencies, improper imports, missing code splitting, bundler configuration.
   - For each suspicion, note at least one verifiable piece of evidence:
     - File path(s) and symbols; a minimal code excerpt; or a profiling command/output; or a metric/log.
   - Clearly differentiate:
     - **Observed fact** (evidence)
     - **Hypothesis** (probable cause)
     - **Experiment** (how to confirm)

4. **Generation of the final output (prioritized and actionable)**
   - Group issues by area (frontend, api, db, infra, build) and prioritize by:
     - Impact on the user/cost
     - Probability
     - Effort
     - Regression risk
   - For each issue, propose a fix:
     - "Quick win" (low risk/effort)
     - "Robust solution" (if any)
   - Include how to validate (before/after metrics, reproduction script, commands).

**Use of Auxiliary Tools (if available):**

- **Repository search:** use search tools (e.g., glob/grep/CodeGraph) to locate hotspots, similar implementations, and references.
- **File reading:** read only the files necessary to support the evidence.
- **Official documentation:** if there is doubt about the behavior of a library/framework, consult the official docs (e.g., via Context7) and cite what changes in the recommendation.
- **No-tools mode:** if you do not have access to the repository, ask the user for:
  - Folder structure (tree), target files, and excerpts of the relevant routes/components/queries;
  - Logs/metrics (p95/p99, LCP/INP, TTFB) and reproduction steps.

**Output Template (Mandatory Structure):**

# Scope
- `{TASK}`
- `{TARGET}`
- Success criteria: `{SUCCESS_CRITERIA}`
- Constraints: `{CONSTRAINTS}`

# Assumptions and Open Items
- Assumptions adopted (defaults) and why they are safe
- Open items to close the diagnosis (objective questions)

# Flow Map (where the time may be going)
- Summarized user/request flow (entry -> layers -> output)
- I/O points (network, DB, queues) and CPU points (parse, serialization, render)

# Evidence Collected
- Observed metrics/signals (with source)
- References in the code (file paths and symbols) with minimal excerpts

# Performance Issues (Priority)
For each item, fill in the fields:
- **ID:** `{ISSUE_ID}`
- **Area:** `{AREA}` (frontend/api/db/infra/build/other)
- **Symptom:** `{SYMPTOM}`
- **Probable cause:** `{CAUSE}`
- **Evidence:** `{EVIDENCE}` (file/line, metric, log, output)
- **Impact:** `{IMPACT}` (user/cost/SLA)
- **Risk:** `{RISK}` (low/medium/high) + possible regression
- **Fix (quick win):** `{FIX_QUICK}`
- **Fix (robust):** `{FIX_ROBUST}` (optional)
- **How to validate:** `{VALIDATION}` (metrics, steps, commands)
- **Estimate:** `{EFFORT}` (S/M/L) and dependencies

# Recommendations (Phased Plan)
- Phase 1: quick wins + minimal instrumentation
- Phase 2: structural fixes
- Phase 3: hardening (limits, caching, guardrails)

# Instrumentation and Measurement
- What to measure (KPIs) and where to instrument
- How to collect (logs/metrics/traces/profiler)
- Baseline and comparison criterion (before/after)

# Verification Checklist
- Did not change functional behavior
- Did not degrade accessibility/SEO (if applicable)
- Did not increase bundle/build time without justification
- Validation in relevant environments (dev/stage/prod)

# References
- `{SOURCES}` (links, files, tickets)

**Rules:**
- Do not invent file paths, APIs, module names or metrics; if you cannot find them, flag them as open items.
- Do not expose step-by-step reasoning; keep the detailed thinking internal and present only conclusions, evidence and actions.
- Always separate fact vs hypothesis vs experiment.
- Be specific: cite files/symbols/commands and describe how to reproduce/measure.
- Do not propose "optimizations" without a clear symptom/risk or a target measurement.
- Respect `{CONSTRAINTS}`; if a recommendation violates them, offer a compatible alternative.
