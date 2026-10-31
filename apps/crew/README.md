# StarDust Crew

Standalone engineering tooling adapted from HMS Crew, using Mastra and **direct
Anthropic API calls**. It runs security, requirements, architecture, regression and
performance reviewers in parallel, then deterministically merges their findings.
It uses an independent PostgreSQL database and never imports the product apps.

## Models and review behavior

Models are pinned in `src/mastra/agents/pr-reviewer/constants/`:
`anthropic/claude-haiku-5-5` first (one retry), then
`anthropic/claude-sonnet-5-5` (no retry). `ANTHROPIC_API_KEY` is the only inference
credential; Crew does not use OpenRouter. Reviewers use adaptive thinking at low
effort; requirements uses medium effort. Structuring uses native Anthropic output
format at low effort, with the same model fallback.

Each reviewer first reads its skill, the applicable StarDust Rules at `base_sha`
and relevant changed files at `head_sha`, returning plain text. A separate model
call converts only that answer into a strict schema, then domain validation checks
it. Findings cite changed lines, use P1/P2/P3 and are written in Brazilian Portuguese.
The canonical review policy is
[`pr-review-rules.md`](../../documentation/rules/pr-review-rules.md).

The workflow retains HMS's safeguards: 12 steps and eight minutes per reviewer,
20 findings per merged review, deduplication against existing review comments,
partial reviews when some reviewers fail, and explicit blocked/failed outcomes.
GitHub access goes through read-only Composio tools restricted to
`JohnPetros/stardust`, fixed in code. File results are decoded from base64, with
bounded/truncated output.

## Run locally

Copy the variable names in [.env.example](.env.example) into the **root `.env.local`**
and fill the Anthropic and Composio credentials plus a random `PR_REVIEWER_API_KEY`
of at least 32 characters. Local values stay in that ignored file. The dedicated
`CREW_DATABASE_URL` must point to Crew's database, never the product Supabase.

```sh
docker compose --env-file .env.local --profile crew up -d --wait crew-db
npm run crew
```

The default local database uses port 5433; match `CREW_DATABASE_PASSWORD` and
`CREW_DATABASE_PORT` if overriding the local defaults. `npm run crew` loads root
`.env.local`, applies generated migrations and recovers interrupted runs before
serving on port 4111. `GET /health` checks the database. `npm run dev` excludes Crew
so normal product development does not need its credentials. Node 24.11 or newer
is recommended for the Mastra build toolchain.

The root pins Zod 4 alongside Crew so Mastra's development API schema serializer
uses the same version. Product workspaces keep their own Zod 3 dependencies.

## Run API

All reviewer endpoints require `Authorization: Bearer <PR_REVIEWER_API_KEY>`:

- `POST /pr-reviewer/v1/runs`, with `Idempotency-Key`, accepts the strict
  `reviewInputSchema`: repository, PR number, base/head/range SHAs, full/incremental
  mode, trusted `agents_md` and `review_md`, changed files and lines, bounded diff,
  and regression facts. It returns `202 { run_id, status }`.
- `GET /pr-reviewer/v1/runs/:runId` returns persisted status/output.
- `GET /pr-reviewer/v1/last-review?repository=JohnPetros/stardust&pull_number=...`
  returns the last completed review for the PR.

Callers must read `AGENTS.md` and `documentation/rules/pr-review-rules.md` from the
trusted base commit and provide them as `agents_md` and `review_md`. Never execute
PR code in a secret-bearing caller. Crew returns findings; it does not publish
GitHub comments. As in the HMS reference, no automatic PR caller is installed.
The existing Hermes workflow remains a separate caller of its existing service.

Runs are idempotent, limited to three concurrent reviews, expire after 20 minutes,
heartbeat every 15 seconds and retain history for 30 days. Production mode hides
Mastra's built-in API and Studio, exposing only health and the authenticated run
API. Production deployments supply environment variables directly.

## Validation

Run these from the repository root:

```sh
npm run check:code -w @stardust/crew
npm run check:types -w @stardust/crew
npm run check:architecture -w @stardust/crew
npm run test:unit -w @stardust/crew
npm run test:integration -w @stardust/crew
npm run build:crew
npm run eval -w @stardust/crew
```

Unit tests use scripted models and fake Composio tools without network calls.
Integration tests use a real Mastra route registry and disposable Testcontainers
PostgreSQL (Docker required). The separate eval command calls Anthropic and
Composio, needs full git history and fails early when credentials are absent.

The initial live dataset is the documentation-only slice of merged StarDust PR
#595, with no expected findings. It validates output and location contracts, but
does **not** prove defect recall; add reviewed StarDust PR cases with known findings
to measure that. HMS historical cases were removed because their commits and paths are not
in this repository. Deterministic workflow tests cover positive findings in all
five areas, deduplication, partial failures, timeouts and output validation.

Cost reports are estimates, not bills. Haiku uses its higher prompt-length tier
conservatively; prompt cache writes and mixed-model retries may differ from the
estimate. See [Haiku pricing](https://platform.claude.com/docs/en/models/haiku-5-5/overview)
and [Sonnet pricing](https://platform.claude.com/docs/en/models/sonnet-5-5/overview).

[`Dockerfile.crew`](../../Dockerfile.crew) packages the standalone server; CI checks
lint, types, architecture, unit and integration tests, and the build. It does not
run paid evals on untrusted PR code or deploy the service automatically.
