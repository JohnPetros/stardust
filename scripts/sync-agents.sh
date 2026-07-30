#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/documentation/agents"
CODEX_DIR="$ROOT_DIR/.codex"
OPENCODE_DIR="$ROOT_DIR/.opencode/agents"
CLAUDE_DIR="$ROOT_DIR/.claude/agents"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Agent source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$CODEX_DIR/agents" "$OPENCODE_DIR" "$CLAUDE_DIR"

python3 - "$ROOT_DIR" <<'PY'
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1]).resolve()
source_dir = root / "documentation" / "agents"
codex_dir = root / ".codex"
codex_agents_dir = codex_dir / "agents"
opencode_agents_dir = root / ".opencode" / "agents"
claude_agents_dir = root / ".claude" / "agents"
codex_config = codex_dir / "config.toml"

begin_marker = "# BEGIN GENERATED AGENTS - scripts/sync-agents.sh"
end_marker = "# END GENERATED AGENTS - scripts/sync-agents.sh"
name_pattern = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def parse_agent(path: Path) -> tuple[str, str, str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        raise SystemExit(f"Missing YAML frontmatter in {path.relative_to(root)}")

    try:
        frontmatter_end = next(
            index for index, line in enumerate(lines[1:], start=1) if line.strip() == "---"
        )
    except StopIteration as error:
        raise SystemExit(f"Unclosed YAML frontmatter in {path.relative_to(root)}") from error

    metadata: dict[str, str] = {}
    for line in lines[1:frontmatter_end]:
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"').strip("'")

    name = metadata.get("name", "")
    description = metadata.get("description", "")
    expected_name = path.stem

    if not name:
        raise SystemExit(f"Missing name in {path.relative_to(root)}")
    if not description:
        raise SystemExit(f"Missing description in {path.relative_to(root)}")
    if name != expected_name:
        raise SystemExit(
            f"Agent name '{name}' must match filename '{expected_name}' in {path.relative_to(root)}"
        )
    if not name_pattern.fullmatch(name):
        raise SystemExit(f"Invalid agent name '{name}' in {path.relative_to(root)}")

    body = "\n".join(lines[frontmatter_end + 1 :]).strip() + "\n"
    if not body.strip():
        raise SystemExit(f"Missing agent instructions in {path.relative_to(root)}")

    return name, description, body


def is_judge(name: str) -> bool:
    return name.startswith("judge-")


def generated_marker(source: Path) -> str:
    return f"<!-- Auto-generated from {source.relative_to(root).as_posix()} -->"


def write_if_changed(path: Path, content: str, managed_token: str | None = None) -> None:
    if path.exists():
        existing = path.read_text(encoding="utf-8")
        if existing == content:
            print(f"unchanged: {path.relative_to(root)}")
            return
        if managed_token and managed_token not in existing:
            raise SystemExit(
                f"Refusing to overwrite unmanaged file: {path.relative_to(root)}"
            )
    path.write_text(content, encoding="utf-8")
    print(f"synced:    {path.relative_to(root)}")


def cleanup_stale(directory: Path, suffix: str, valid_names: set[str]) -> None:
    for path in directory.glob(f"*{suffix}"):
        if path.stem in valid_names:
            continue
        try:
            sample = path.read_text(encoding="utf-8")[:2048]
        except OSError:
            continue
        if "Auto-generated from documentation/agents/" not in sample:
            continue
        path.unlink()
        print(f"removed:   {path.relative_to(root)}")


agents = [parse_agent(path) + (path,) for path in sorted(source_dir.glob("*-agent.md"))]
if not agents:
    raise SystemExit("No agent definitions found in documentation/agents/*-agent.md")

valid_names = {name for name, _, _, _ in agents}
cleanup_stale(codex_agents_dir, ".toml", valid_names)
cleanup_stale(opencode_agents_dir, ".md", valid_names)
cleanup_stale(claude_agents_dir, ".md", valid_names)

codex_roles: list[str] = [begin_marker]

for name, description, body, source in agents:
    source_relative = source.relative_to(root).as_posix()
    codex_prompt_relative = Path("../..") / source_relative
    sandbox_mode = "read-only" if is_judge(name) else "workspace-write"

    codex_role = (
        f"# Auto-generated from {source_relative}\n"
        f"model_instructions_file = {json.dumps(codex_prompt_relative.as_posix(), ensure_ascii=False)}\n"
        f"sandbox_mode = {json.dumps(sandbox_mode)}\n"
    )
    write_if_changed(
        codex_agents_dir / f"{name}.toml",
        codex_role,
        "Auto-generated from documentation/agents/",
    )

    codex_roles.extend(
        [
            "",
            f"[agents.{json.dumps(name)}]",
            f"description = {json.dumps(description, ensure_ascii=False)}",
            f"config_file = {json.dumps(f'agents/{name}.toml')}",
        ]
    )

    if name == "orchestrator-agent":
        opencode_mode = "primary"
        opencode_permissions = "  edit: allow\n  bash: allow\n  task: allow"
    elif is_judge(name):
        opencode_mode = "subagent"
        opencode_permissions = "  edit: deny\n  bash: deny\n  task: deny"
    elif name == "builder-agent":
        opencode_mode = "subagent"
        opencode_permissions = "  edit: allow\n  bash: allow\n  task: deny"
    else:
        opencode_mode = "subagent"
        opencode_permissions = "  edit: allow\n  bash: allow\n  task: allow"

    opencode_agent = (
        "---\n"
        f"description: {json.dumps(description, ensure_ascii=False)}\n"
        f"mode: {opencode_mode}\n"
        "permission:\n"
        f"{opencode_permissions}\n"
        "---\n\n"
        f"{generated_marker(source)}\n\n"
        f"{body}"
    )
    write_if_changed(
        opencode_agents_dir / f"{name}.md",
        opencode_agent,
        "Auto-generated from documentation/agents/",
    )

    claude_fields = [
        "---",
        f"name: {name}",
        f"description: {json.dumps(description, ensure_ascii=False)}",
    ]
    if is_judge(name):
        claude_fields.extend(["tools: Read, Glob, Grep", "permissionMode: plan"])
    elif name == "builder-agent":
        claude_fields.append("disallowedTools: Agent")
    claude_fields.extend(["---", "", generated_marker(source), "", body.rstrip(), ""])
    write_if_changed(
        claude_agents_dir / f"{name}.md",
        "\n".join(claude_fields),
        "Auto-generated from documentation/agents/",
    )

codex_roles.extend(["", end_marker])
managed_block = "\n".join(codex_roles) + "\n"

existing_config = codex_config.read_text(encoding="utf-8") if codex_config.exists() else ""
if existing_config.count(begin_marker) != existing_config.count(end_marker):
    raise SystemExit(f"Unbalanced generated-agent markers in {codex_config.relative_to(root)}")

if begin_marker in existing_config:
    before, remainder = existing_config.split(begin_marker, 1)
    _, after = remainder.split(end_marker, 1)
    existing_config = before.rstrip() + after.lstrip("\n")

new_config = existing_config.rstrip()
if new_config:
    new_config += "\n\n"
new_config += managed_block
write_if_changed(codex_config, new_config)
PY

echo "Configured agents for Codex, OpenCode and Claude Code."
