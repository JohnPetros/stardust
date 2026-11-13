# Commit Rules

This document defines the rules for creating commits in the repository. It replaces
the use of commit-specific prompts as the main source of decision.

## Goal

Every commit must:

- represent a single semantic responsibility
- make the history easier to read and the changes easier to review
- make clear the type of change made
- avoid ambiguous, generic or mixed commits

## Mandatory preconditions

Before creating any commit, the following must be validated:

- there are no previously staged files that are not part of the current commit
- there are real changes in the worktree
- the files of the group to be committed were analyzed through the diff, not just by path

If there are already staged files with no direct relation to the intended commit, the
process must stop until the stage is cleaned or reorganized.

## Grouping rule

Commits must be grouped by semantic responsibility, not by folder.

### Must

- group files that implement the same functional change
- separate independent changes into different commits
- separate fixes, refactors, tests, docs and config when they are distinct responsibilities

### Must not

- mix a bugfix with an unnecessary refactor
- mix a documentation change with a runtime change without a clear relation
- mix changes from different layers just because they are in the same PR

> ⚠️ If a file touches more than one responsibility, the decision must be made
> by the content of the diff. The file path alone is not enough.

## Analysis rule

Before classifying a commit, the following must be analyzed:

- the file path
- the actual content of the diff
- the impact of the change
- whether the change is a new feature, fix, refactor, test, docs or config

Ambiguous files must be classified by the predominant intent of the change.

## Mandatory message format

Every commit message must follow exactly this format:

```text
emoji prefix(optional scope): concise description in English
```

Valid examples:

```text
🐛 fix(server): align Inngest local discovery port
📚 docs: document server commit rules
🧪 test(web): cover notes drawer manual close flow
⚙️ config: restore default server port
```

## Message rules

### Must

- write the description in English
- use a short, direct and specific description
- use a verb in the imperative or an objective description of the action
- use only approved prefixes
- include a `scope` when it increases clarity

### Must not

- use vague messages such as `update code`, `fix stuff`, `changes`
- use Portuguese in the description
- invent prefixes outside the approved table
- describe more than one semantic change in the same message

## Table of approved prefixes

| Type of change | Prefix | Emoji |
| --- | --- | --- |
| Domain | `domain` | `🌐` |
| REST | `rest` | `📶` |
| UI | `ui` | `🖥️` |
| Database | `db` | `💾` |
| Work in progress | `wip` | `🚧` |
| Artificial intelligence | `ai` | `🤖` |
| RPC | `rpc` | `📟` |
| Use case | `use case` | `✨` |
| Interfaces | `interface` | `📑` |
| Types | `type` | `🏷️` |
| Documentation | `docs` | `📚` |
| Fix | `fix` | `🐛` |
| Refactor | `refactor` | `♻️` |
| Tests | `test` | `🧪` |
| Configuration / infra | `config` | `⚙️` |
| Dependencies | `deps` | `📦` |
| Folder structure | `ftree` | `🗃️` |
| Providers / provision | `provision` | `🧰` |
| Response | `response` | `📤` |
| Design | `design` | `🎨` |
| Certificates / licenses | `cert` | `📜` |
| Validation | `validation` | `📮` |
| Hotfix | `hotfix` | `🚑` |
| Continuous delivery | `cd` | `🚚` |
| Continuous integration | `ci` | `🏎️` |
| Release | `release` | `🔖` |
| Docker | `docker` | `🐳` |

## When to use `scope`

The `scope` is optional, but must be used when:

- the change affects a specific workspace such as `web`, `server`, `backoffice` or `core`
- the change affects a clear domain such as `auth`, `notes`, `space` or `challenge`
- the prefix alone does not make clear where the change happened

Examples:

- `🐛 fix(server): restore default port`
- `📚 docs(rules): add commit message policy`
- `🧪 test(profile): cover user absence controller`

## Recommended order of execution

For each commit:

1. analyze `git diff --stat`
2. analyze the `git diff` of the candidate files
3. select only the correct semantic group
4. add only the files of the group
5. create the commit with a message in the standard format
6. repeat until no pending changes remain

## Quality criteria

Before running the commit, confirm that:

- the message correctly represents the diff
- there are no files of another responsibility in the same stage
- the chosen prefix is consistent with the change
- the commit improves, rather than worsens, the readability of the history

## Cases that require extra attention

### Ambiguous changes

If a file can be classified in more than one category:

- the category must be chosen based on the content of the diff
- the main responsibility delivered by the file must be prioritized

### Large changes

If the worktree has extensive changes:

- splitting into multiple small, coherent commits is preferred
- a single "umbrella" commit must not be used

### Dirty worktree

If there are unrelated changes:

- committing them together must be avoided
- the scope of the current change must be isolated

## What is forbidden

- creating a commit without reviewing the diff
- creating a commit with a previously contaminated stage
- mixing independent responsibilities
- using a generic message
- using a prefix outside the table
- doing an `amend` without an explicit request

## Relationship with other rules

When preparing a commit, the following must also be respected:

- `documentation/rules/code-conventions-rules.md`
- `documentation/rules/rules.md`

If the change involves a specific layer, that layer's rules must also
be consulted before defining the final message.
