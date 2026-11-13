---
description: Prompt to conduct a security review of the StarDust project, returning a report with findings classified by severity and fix recommendations aligned with the project conventions.
---

# Prompt: Create Security Report

## Objective

Conduct an architecture-oriented security review of StarDust, identifying vulnerabilities, bad practices and risks across all layers of the system (UI, RPC, REST, Core, Database, Provision, Queue). The result must be a report with findings classified by severity and fix recommendations aligned with the project conventions.

---

## Inputs

  - Target application `{APP}` (e.g. `web`, `server`, `backoffice`)
  - Review scope `{SCOPE}` (e.g. module `auth`, layer `rest`, feature `challenging`, or `full`)
  - Target files or paths `{TARGETS}` (e.g. `apps/server/src/rest/controllers/auth/`, `packages/core/src/auth/`)
  - Context of what was recently changed `{CHANGE_CONTEXT}` (e.g. "new social login feature", "refactoring of authActionClient")
  - Priority criteria `{FOCUS}` (e.g. authentication, authorization, data exposure, input validation)

---

## Applicable Rules

Before the review, read:

- `documentation/rules/rules.md` — index to select rules by layer.
- `documentation/rules/code-conventions-rules.md` — general conventions that influence security, such as names, errors and factories.
- Rules of the layers included in the scope, according to the table below.

Findings and recommendations must cite the most specific rule possible. If the fix requires a new security pattern, record the need to update the corresponding rule.

---

## Layer Map for Review

Before starting, consult the rules documents of each layer involved in the scope:

| Layer | Rules File | Typical Risks |
|--------|-------------------|----------------|
| **UI / Widgets** | `documentation/rules/ui-layer-rules.md` | Exposure of sensitive data in state, authorization logic on the client |
| **RPC / Actions** | `documentation/rules/rpc-layer-rules.md` | Missing Zod validation in the composition root, business logic in actions |
| **REST / Controllers** | `documentation/rules/rest-layer-rules.md` | Missing auth middleware, missing `accountId` check, status codes that leak information |
| **Core / Use Cases** | `documentation/rules/core-package-rules.md` | Missing authorization rules in the domain, entities without contract validation |
| **Database / Repositories** | `documentation/rules/database-rules.md` | Queries without `accountId` scope, mappers that do not normalize types before the domain |
| **Provision / Providers** | `documentation/rules/provision-layer-rules.md` | Hardcoded secrets, SDK errors exposed without handling, SDK types leaking |
| **Queue / Jobs** | `documentation/rules/queue-layer-rules.md` | Jobs without idempotency, missing validation of the input payload |
| **Validation / Schemas** | `documentation/rules/validation-layer-rules.md` | Permissive schemas, inconsistent messages, external input without explicit normalization |
| **Realtime / Channels** | `documentation/rules/realtime-rules.md` | External events exposed directly to the UI, listeners without cleanup, payload not translated to the domain |
| **AI / Tools** | `documentation/rules/ai-layer-rules.md` | Tool without internal contract, prompt leaking business rule, external output without validation |
| **Web App** | `documentation/rules/web-application-rules.md` | Inconsistent public/protected routes, sensitive data at the server/client boundary |
| **Server App** | `documentation/rules/server-application-rules.md` | Missing middlewares, insecure Hono composition, integration without validation |
| **Backoffice App** | `documentation/rules/backoffice-application-rules.md` | Administrative flows without authorization or with insufficient error states |

---

## Review Checklist by Layer

### 🔐 Authentication and Authorization

- [ ] **Auth middleware** is applied on all protected routes in Hono (`verifyAuthentication`, `verifyGodAccount`)
- [ ] **`VerifyAuthRoutesController`** only calls `fetchAccount()` after confirming the route is not public (see ISSUE-03 of the performance report)
- [ ] **`authActionClient`** does not make unnecessary calls for routes that do not require an authenticated user
- [ ] Administrative routes (e.g. `GET /profile/users/xlsx`) apply `verifyGodAccount` in addition to `verifyAuthentication`
- [ ] Editor/god permissions in `challenging` follow the `author || god` pattern (ref: `god-user-permission-for-challenge-editor-spec.md`)
- [ ] `InsigniaRole` is verified by the domain, not only by the UI
- [ ] Authorization errors return **404** (existence masking) instead of 403 where applicable

### 🧹 Input Validation

- [ ] Every **Action (RPC)** has a Zod schema in the composition root (`apps/web/src/rpc/next-safe-action/`)
- [ ] **REST Controllers** extract body/params via `Http` without trusting unvalidated data
- [ ] **Core entities** reject DTOs with invalid contracts (e.g. `Integer.create` rejects `string | null`)
- [ ] **Database mappers** normalize types before passing them to the Core (e.g. `Number(value)` on numeric Supabase fields — ref: bug `SupabasePlanetMapper`)
- [ ] No `any` or unsafe cast (`as unknown as X`) at external data entry points

### 🔑 Secrets and Environment Variables

- [ ] No hardcoded credentials — all configs use `ENV` (ref: `documentation/rules/provision-layer-rules.md`)
- [ ] Providers (`SupabaseFileStorageProvider`, etc.) do not expose SDK keys or clients externally
- [ ] `.env.example` files do not contain real values
- [ ] Environment variables are validated via Zod at boot (`envSchema` pattern)

### 🚪 Data Exposure

- [ ] Controllers do not return data beyond what is necessary (no dump of the whole entity when only the ID is enough)
- [ ] Domain errors (`AppError`) do not expose stack traces or internal details to the client
- [ ] Providers map SDK errors to `AppError` before propagating (no Supabase/SDK `error.message` exposed directly)
- [ ] Debug `console.log` does not exist in production (e.g. `Planet.create` with `console.log(dto)` — ref: space bug report)

### 🏗️ Architectural Integrity (Security by Design)

- [ ] `@stardust/core` does not import any package from `apps/` (violation of the hexagonal architecture)
- [ ] RPC Actions do not import `next/*` directly (ref: RPC layer rule)
- [ ] Providers do not return external SDK types outside the `provision` layer
- [ ] Session cookies are set via `call.setCookie` with an explicit `durationInISSUEods`

### 🔄 Jobs and Queues (Inngest)

- [ ] Jobs are idempotent (reprocessing does not cause duplicate effects)
- [ ] Job input payloads are validated before execution
- [ ] Job failures do not silence critical errors

---

## Execution Guidelines

### Step 1: Scope Mapping

- Identify which layers and modules are in the `{SCOPE}`.
- Consult `documentation/rules/rules.md` to locate the relevant rule files.
- If the scope includes a feature domain, consult `documentation/features/<domain>/` to understand the business context.

### Step 2: Evidence Collection

- Read only the files needed to support the evidence — do not read the whole project.
- For each suspected vulnerability, locate the specific file and line.
- If in doubt about lib behavior (e.g. Supabase, Hono, next-safe-action), consult the official documentation before classifying it as a finding.

### Step 3: Finding Classification

Use the severity table below:

| Severity | Criterion |
|------------|----------|
| 🔴 **Critical** | Authentication/authorization bypass, direct credential exposure, RCE |
| 🟠 **High** | Missing authorization on a protected route, sensitive data exposed in the response, completely missing input validation |
| 🟡 **Medium** | Insufficient error masking, mapper without type normalization breaking the core contract, cookie without expiration |
| 🟢 **Low** | `console.log` in production, `any` at an entry point, environment variable without schema validation |
| ℹ️ **Info** | Defensive improvement suggestion, alignment with a pattern that already exists in the codebase |

### Step 4: Report

Produce the report following the template below.

---

## Output Template (Mandatory Structure)

```
---
app: {APP}
status: open|closed 
last_updated_at: {DATE}
---

## Executive Summary

- Total findings: X (Critical: X | High: X | Medium: X | Low: X | Info: X)
- Highest-risk area: {AREA}
- Recommended immediate action: {CRITICAL_ACTION}

---

## Findings

### [ISSUE-01] Finding Title

- **Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low / ℹ️ Info
- **Layer:** ui | rpc | rest | core | database | provision | queue
- **File:** `path/to/file.ts` (line X)
- **Description:** What is wrong and why it is a risk.
- **Evidence:**
  ```ts
  // problematic code excerpt
  ```
- **Impact:** What can happen if exploited.
- **Recommendation:** How to fix it, aligned with the StarDust rules.
- **Reference:** `documentation/rules/<relevant-file>.md`

---

## Prioritized Recommendations

| # | Action | Finding(s) | Severity | Effort |
|---|------|------------|------------|---------|
| 1 | ... | ISSUE-01 | Critical | S |
| 2 | ... | ISSUE-02 | High | M |

---

## Post-Fix Verification Checklist

- [ ] `pnpm run check:code` passes (monorepo root)
- [ ] `pnpm run check:types` passes in the affected workspace
- [ ] `pnpm run test` passes in the affected workspace
- [ ] No real environment variable exposed
- [ ] No debug `console.log` in production code
- [ ] Auth middleware applied on all affected routes

---

## References

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `{OTHER_CONSULTED_FILES}`
```

---

## Constraints

- **Do not invent** file paths, methods or contracts without evidence in the codebase.
- When information is missing to classify a finding, mark it as a **pending item** with an objective question.
- Always cite the file and line of the problem — no generic findings without a location.
- Recommendations must be **aligned with the project conventions** (naming, layer pattern, use of `AppError`, etc.).
- Do not propose fixes that violate the contracts between layers defined in `documentation/rules/`.
- Separate fact (evidence found) from hypothesis (suspicion without code confirmation).
