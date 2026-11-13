---
name: resolve-pr-feedback
description: Resolve CI checks and review conversations until the PR is mergeable.
---

# Resolve PR feedback

Work in the current session and always against the latest `HEAD`.

1. Inspect mergeable status, checks and unresolved conversations.
2. Classify each pending item as a deterministic failure, test, build, environment,
   review feedback or conflict with Spec/Architecture.
3. Reproduce locally using the same scripts as CI:
   `check:code`, `check:types`, `test:unit`, `check:architecture` and
   `test:integration` when applicable.
4. Fix the cause in the smallest safe scope; do not disable rules or add
   exclusions to hide regressions.
5. Apply `format`, rerun the invalidated sensors and review the diff.
6. Reply to/resolve conversations only after the fix exists on the branch.
7. Push and wait again for the checks, tests and build of the new `HEAD`.

A product, Contract, architecture or security change must update the normative
sources before proceeding. Finish only with green checks,
blocking conversations resolved and a mergeable PR.
