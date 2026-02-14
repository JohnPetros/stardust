#!/usr/bin/env bash
set -euo pipefail

PROMPTS_DIR="documentation/prompts"
OUT_DIRS=(
  ".cursor/commands"
  ".opencode/commands"
)

# Garante que existem prompts
shopt -s nullglob
PROMPTS=( "$PROMPTS_DIR"/*.md )
if (( ${#PROMPTS[@]} == 0 )); then
  echo "No prompts found in '$PROMPTS_DIR/*.md'"
  exit 1
fi

# Cria pastas de saída
for dir in "${OUT_DIRS[@]}"; do
  mkdir -p "$dir"
done

# Função: tenta criar symlink; se não der, copia
link_or_copy() {
  local src="$1"
  local dest="$2"

  # Caminho relativo do dest -> src (assumindo repo root)
  # dest fica em .cursor/commands ou .opencode/commands (2 níveis)
  local rel_src="../../$src"

  # Remove arquivo antigo (ou symlink) pra não dar conflito
  rm -f "$dest"

  # Tenta symlink (Linux/macOS/Git Bash). Se falhar, copia.
  if ln -s "$rel_src" "$dest" 2>/dev/null; then
    echo "linked:  $dest -> $rel_src"
  else
    # Fallback: copia conteúdo
    {
      echo "<!-- Auto-generated from $src (symlink not available) -->"
      echo
      cat "$src"
    } > "$dest"
    echo "copied:  $dest <- $src"
  fi
}

for src in "${PROMPTS[@]}"; do
  filename="$(basename "$src")"
  name="${filename%.md}"

  # Remove "-prompt" do final (se existir)
  if [[ "$name" == *-prompt ]]; then
    name="${name%-prompt}"
  fi

  for dir in "${OUT_DIRS[@]}"; do
    dest="$dir/$name.md"
    link_or_copy "$src" "$dest"
  done
done
