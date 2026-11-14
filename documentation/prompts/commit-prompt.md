---
description: Prompt to analyze changes and execute real commits with a defined message standard.
---

# Prompt: Make Commits in the Code

**Main Objective**

Create **and execute real commits** in the repository for all the detected changes,
with highly descriptive and standardized messages, strictly following the
project's contribution guidelines.

You **must run git commands**, not just suggest messages.

---

## Applicable Rules

Before grouping or creating commits, read:

- `documentation/rules/commit-rules.md` — normative source for grouping, prefixes, emojis and message format.
- `documentation/rules/code-conventions-rules.md` — use only when the diff requires understanding general naming or organization conventions.

If there is a divergence between this prompt and `commit-rules.md`, follow `commit-rules.md` and update this prompt afterwards.

---

## 🚨 MANDATORY PRECONDITIONS

Run these checks **before anything else**. If any
condition fails, **stop immediately** and report the reason.

### 1. Check the staging area
```bash
git diff --cached --name-only
```

- If there are staged files → **ABORT**
- Report: `⛔ Aborted: there are already staged files. Run 'git reset HEAD' to
  unstage them before proceeding.`

### 2. Check whether there are changes
```bash
git status --porcelain
```

- If empty → respond: `✅ No changes to commit` and stop.
- If there are changes → continue to the next step.

---

## 🔍 Analysis of the Changes

### Analysis rule

For each changed file, analyze **both the path and the content of the
diff** to determine the real nature of the change:
```bash
git diff --stat
git diff -- <file>
```

Do not rely only on the file name. A `user.service.ts` may contain
a bugfix, a refactor or a new use case — the path alone is not
enough to classify it.

### Grouping rule

Group files by **semantic responsibility**, not by folder. Criteria:

- Files that implement the same functionality → same commit
- Files in different layers (e.g., domain + REST) → separate commits per
  layer

### Rule for ambiguous files

If a file could belong to more than one group:

1. Flag the ambiguity explicitly in the output:
   `⚠️ Ambiguous: <file> could be '<prefix-a>' or '<prefix-b>'. Classifying
   as '<chosen-prefix>' based on diff content.`
2. Make the decision and proceed with the commit.

---

## 📋 Prefix Table

| Type                          | Prefix     | Emoji |
| :---------------------------- | :--------- | :---- |
| Domain layer                  | domain     | 🌐    |
| REST API layer                | rest       | 📶    |
| UI layer                      | ui         | 🖥️    |
| Database layer                | db         | 💾    |
| Work in progress              | wip        | 🚧    |
| Artificial intelligence layer | ai         | 🤖    |
| RPC layer                     | rpc        | 📟    |
| Use cases                     | use case   | ✨    |
| Interfaces                    | interface  | 📑    |
| Typings                       | type       | 🏷️    |
| Documentation                 | docs       | 📚    |
| Bug fix                       | fix        | 🐛    |
| Refactoring                   | refactor   | ♻️    |
| Test                          | test       | 🧪    |
| Config/Infrastructure         | config     | ⚙️    |
| Dependencies                  | deps       | 📦    |
| Folder structure              | ftree      | 🗃️    |
| Provision layer               | provision  | 🧰    |
| Response                      | response   | 📤    |
| Design                        | design     | 🎨    |
| Certificates/Licensing        | cert       | 📜    |
| Validation schema             | validation | 📮    |
| Emergency hotfix              | hotfix     | 🚑    |
| Continuous delivery           | cd         | 🚚    |
| Continuous integration        | ci         | 🏎️    |
| New release                   | release    | 🔖    |
| Docker files                  | docker     | 🐳    |

---

## 📝 Message Standard (Strict)
```
emoji prefix: concise description in English
```

- Message **must be in English**
- Use only prefixes from the table above
- One commit per semantic responsibility
- Short, direct description, in the imperative (e.g., `add`, `fix`, `remove`)

---

## ⚙️ Mandatory Execution

For each identified group of files, execute in order:
```bash
git add <group-files>
git commit -m "emoji prefix: concise description in English"
```

**Do not ask for confirmation. Do not explain beforehand. Execute.**

Repeat until `git status --porcelain` returns empty.

---

## ✅ Per-Commit Verification (Internal Checklist)

Before running each `git commit`, mentally validate:

- [ ] I analyzed the diff, not just the file name
- [ ] The message is in English
- [ ] The emoji matches the prefix
- [ ] The prefix is in the table
- [ ] The description correctly represents the group
- [ ] Ambiguous files were flagged

---

## 📤 Mandatory Output Format
```
[PRE-CHECK] Staging area: clean ✅
[PRE-CHECK] Pending changes: 4 files ✅

EXECUTING:
git add src/domain/user.ts src/domain/user.repository.ts
git commit -m "🌐 domain: add user aggregate and repository interface"

⚠️ Ambiguous: src/services/auth.service.ts could be 'use case' or 'rest'.
   Classifying as 'use case' based on diff content (no HTTP handlers found).

EXECUTING:
git add src/services/auth.service.ts
git commit -m "✨ use case: add authentication flow"

[DONE] All changes committed. ✅
```

---

## 🚫 Prohibited Behaviors

- Committing with a previously dirty staging area
- Classifying files only by path, without analyzing the diff
- Generating only suggestions without running the commands
- Stopping midway without committing all the changes
- Inventing prefixes outside the table
