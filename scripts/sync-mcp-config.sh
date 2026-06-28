#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_CONFIG="${SOURCE_CONFIG:-$ROOT_DIR/.codex/config.toml}"
OPENCODE_OUTPUT="${OPENCODE_OUTPUT:-$ROOT_DIR/opencode.json}"
CODEX_OUTPUT="${CODEX_OUTPUT:-$HOME/.codex/config.toml}"

if [[ ! -f "$SOURCE_CONFIG" ]]; then
  echo "Source config not found: $SOURCE_CONFIG" >&2
  exit 1
fi

mkdir -p "$(dirname "$OPENCODE_OUTPUT")"
mkdir -p "$(dirname "$CODEX_OUTPUT")"

python3 - "$SOURCE_CONFIG" "$OPENCODE_OUTPUT" <<'PY'
import json
import sys
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:  # Python < 3.11
    import tomli as tomllib

source_path = Path(sys.argv[1])
opencode_path = Path(sys.argv[2])

with source_path.open("rb") as fh:
    config = tomllib.load(fh)

servers = config.get("mcp_servers")
if not isinstance(servers, dict) or not servers:
    raise SystemExit("Expected a non-empty [mcp_servers] table in the source config.")

output = {"$schema": "https://opencode.ai/config.json", "mcp": {}}

for name, server in servers.items():
    if not isinstance(server, dict):
        raise SystemExit(f"Server '{name}' must be a table.")

    if "url" in server:
        item = {
            "type": "remote",
            "url": server["url"],
            "enabled": True,
        }
        headers = server.get("http_headers")
        if headers:
            item["headers"] = headers
    elif "command" in server:
        args = server.get("args", [])
        item = {
            "type": "local",
            "command": [server["command"], *args],
            "enabled": True,
        }
        timeout = server.get("startup_timeout_ms")
        if timeout is not None:
            item["timeout"] = timeout
    else:
        raise SystemExit(f"Server '{name}' must define either 'url' or 'command'.")

    output["mcp"][name] = item

opencode_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
PY

tmp_file="$(mktemp)"
cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

if [[ -f "$CODEX_OUTPUT" ]]; then
  awk '
    BEGIN { skipping = 0 }
    /^\[mcp_servers(\.|])/{ skipping = 1; next }
    skipping && /^\[/ && $0 !~ /^\[mcp_servers(\.|])/{ skipping = 0 }
    !skipping { print }
  ' "$CODEX_OUTPUT" > "$tmp_file"
else
  : > "$tmp_file"
fi

if [[ -s "$tmp_file" ]]; then
  printf '\n' >> "$tmp_file"
fi

cat "$SOURCE_CONFIG" >> "$tmp_file"
mv "$tmp_file" "$CODEX_OUTPUT"
trap - EXIT

echo "Wrote $OPENCODE_OUTPUT"
echo "Synced $CODEX_OUTPUT"
