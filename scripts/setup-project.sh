#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

"$ROOT_DIR/scripts/install-skills.sh"
"$ROOT_DIR/scripts/sync-commands.sh"
"$ROOT_DIR/scripts/sync-mcp-config.sh"
