---
name: security-review
description: "Use when reviewing security risks in a StarDust pull request: authentication, authorization, account ownership and God Account authorization, secrets, untrusted input and the browser."
---

# How to review: security

Read these repository documents at `base_sha` with
`GITHUB_GET_REPOSITORY_CONTENT` (`ref` equal to `base_sha`), never at `head_sha`, so
that the pull request cannot weaken the rule that reviews it. Start with
`documentation/rules/rules.md`, the Rules router, and read only the Rules that match
the changed paths:

- `documentation/rules/rest-layer-rules.md`: routes, authentication and error mapping;
- `documentation/rules/database-rules.md`: repositories and query scope;
- `documentation/rules/provision-layer-rules.md`: environment and provider access;
- `documentation/architecture.md` and `documentation/architecture.md`: module boundaries;
- `documentation/rules/crew-app-rules.md` when the diff changes `apps/crew`.

## Principles

Adapted from the Cloudflare security-audit skill (commit `c1c8a8c`, MIT License,
Copyright (c) 2025-2026 Cloudflare, Inc.), reduced to what a pull-request review can use.

- **A finding needs a boundary and a result.** Name the lower-trust actor, the input or action
  it controls, the control that should stop it, the boundary that is crossed and the concrete
  damage to another user, tenant or resource. A missing best practice, a guessed deployment
  behavior, a generic crash or an effect only on the caller's own data is not a finding.
- **Defense in depth is not a vulnerability.** If another layer already blocks the attack, the
  missing second layer is at most a hint; do not report it.
- **Do not guess what the diff does not show.** Proxy, provider, identity-policy or deployment
  controls that are not in the repository are neither present nor absent: skip a finding that
  depends on them.
- **Severity follows demonstrated impact, in the scale of `pr-review-rules.md`.** Cross-tenant read or
  write, authentication or authorization bypass, takeover of accounts, code execution and
  stored script that runs for other users are the top of the scale. A real violation with a
  narrow blast radius or unusual preconditions is lower. If you cannot state the concrete
  damage, the severity is lower than it feels.
- **Recommend the smallest source fix:** the invariant the code must enforce, enforced at the
  last trusted decision point, with the regression test that would pin it.

## Where to look in the changed lines

- **Access control:** a different, weaker path to the same state change; a request field that
  overrides what the permission was meant to restrict; authentication without authorization;
  bulk, batch, import and export operations that skip per-item permission; account ownership missing from a new query, cache key, search or export.
- **Injection and untrusted input:** follow input from its entry point to a dangerous sink (SQL,
  HTML, shell, template, file path, redirect, deserialization), including data stored safely and
  used elsewhere, and keys, field names, headers and metadata, not only values.
- **Files and requests:** path traversal, server-side request forgery through user-supplied URLs
  and redirects, unsafe deserialization, archive extraction.
- **Secrets and cryptography:** weak randomness for tokens, hard-coded secrets, secrets in logs,
  errors, URLs or client-visible responses, non-constant-time comparison of secrets.
- **Sessions and identity:** token and session handling, CSRF on state changes, JWT, OAuth or
  OIDC validation, API keys, account recovery and account linking.
- **Data lifecycle:** deletion, revocation, export, backup, restore and migration that leave data
  reachable by the wrong tenant or user.
- **Browser code:** DOM injection with user data, `postMessage` without an origin check, secrets
  or tokens in browser storage, redirects and links built from user input.

## Procedure

1. For each changed route, controller, repository or job, confirm that authorization and account ownership are still applied.
2. Look for sensitive values that start being logged, returned or persisted.
3. Follow data that comes from outside the system to where it is used.
4. Confirm with the layer's Rule that the required authentication pattern was kept.
5. Before reporting, check the two things the principles ask for: the crossed boundary with its concrete result, and that no other layer already stops it.
6. Respect the tool budget of the shared process: at most 10 tool calls, each file read once, at most 6 files besides the skill's Rules, and at most 8 findings grouped by root cause.

Use the text of the Rules as the authority. This guide points to where to look and does
not replace or summarize any Rule.
