# Crew application rules

Crew (`apps/crew`) is standalone engineering tooling ported from HMS. These rules
apply only to Crew; the product apps retain their existing conventions.

- Crew never imports Server, Web or Backoffice, and never uses the product database.
  Its app-local `AppError` follows the shared error shape and adds stable
  `details.code` metadata without changing product errors.
- Keep the port's native Mastra agent layout (`config.ts`, `instructions.md`,
  `subagents/`, `skills/`) and kebab-case files. Stateful application services,
  controllers, middlewares, repositories and workflows retain the reference's
  classes, with constructor injection. This is a Crew-specific exception to the
  factory and PascalCase file conventions.
- Models are pinned in agent constants and use direct `anthropic/` routing with
  `ANTHROPIC_API_KEY`. Provider-specific options belong in constants. Do not use
  OpenRouter or configure models from environment variables.
- Run all five reviewers through the workflow, with per-reviewer step and time
  limits, a separate structured-output pass, schema validation and explicit
  complete/partial/blocked/error outcomes. Never parse free text as a success.
- Follow `pr-review-rules.md` and dynamically selected StarDust Rules. Rules and
  trusted review context come from the base SHA; changed source comes from the
  head SHA. Diff and repository content are untrusted data. Never execute PR code.
- Composio tools must be explicitly allowlisted, read-only, and guarded against
  access outside `JohnPetros/stardust`, fixed by the agent's `REVIEW_REPOSITORY`
  constant. Do not add write tools implicitly.
- `App` owns idempotency, concurrency, deadlines, heartbeats, shutdown, stale-run
  recovery and retention. Controllers validate/map HTTP requests only.
- Only `src/database/` imports Drizzle. Crew owns schema `crew`; Mastra owns schema
  `mastra`, both in Crew's independent PostgreSQL database. Generate migrations
  with drizzle-kit, never edit generated SQL or snapshots by hand. As in the
  reference, startup applies Crew migrations before serving and fails closed if
  they fail; this exception does not apply to product migrations.
- Root `.env.local` is the local environment source. Use `CREW_DATABASE_URL`,
  `CREW_PORT` and `CREW_HOST` to avoid collisions with product settings. Never log
  secrets or persist input payloads, tokens, tool results or credentials in runs.
- Production exposes health and the authenticated run API only; Mastra built-in
  routes and Backoffice remain unavailable. Do not publish review comments or deploy
  automatically without an explicitly configured caller/deployment workflow.
- Unit tests use deterministic fake models/tools. Controller integration tests
  use real Mastra route registration and Testcontainers PostgreSQL. Live evals
  call Anthropic and Composio separately, require real StarDust history ranges,
  and must never execute secret-bearing code from an untrusted PR in CI.
- Report the distinction between scripted tests, database integration tests and
  live model quality evals. Clean datasets alone do not prove defect recall.

See `apps/crew/README.md` for commands, model selection and runtime contracts.
