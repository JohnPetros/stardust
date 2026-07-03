#!/usr/bin/env bash
set -euo pipefail

PROMPTS_DIR="documentation/prompts"
OUT_DIRS=(
  ".cursor/commands"
  ".claude/commands"
  ".opencode/commands"
)
SKILLS_DIR=".agents/skills"

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

mkdir -p "$SKILLS_DIR"

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

extract_description() {
  local src="$1"
  local description

  description="$(sed -n 's/^description:[[:space:]]*//p' "$src" | head -n 1)"

  if [[ -z "$description" ]]; then
    echo "Missing description in '$src'" >&2
    exit 1
  fi

  printf '%s\n' "$description"
}

sync_skill() {
  local src="$1"
  local name="$2"
  local skill_dir="$SKILLS_DIR/$name"
  local skill_file="$skill_dir/SKILL.md"
  local description="$3"

  mkdir -p "$skill_dir"

  {
    printf '%s\n' '---'
    printf 'name: %s\n' "$name"
    printf 'description: %s\n' "$description"
    printf '%s\n\n' '---'
    printf '<!-- Auto-generated from %s -->\n\n' "$src"
    cat "$src"
  } > "$skill_file"

  echo "synced:  $skill_file <- $src"
}

for src in "${PROMPTS[@]}"; do
  filename="$(basename "$src")"
  name="${filename%.md}"

  # Remove "-prompt" do final (se existir)
  if [[ "$name" == *-prompt ]]; then
    name="${name%-prompt}"
  fi

  description="$(extract_description "$src")"

  for dir in "${OUT_DIRS[@]}"; do
    dest="$dir/$name.md"
    link_or_copy "$src" "$dest"
  done

  sync_skill "$src" "$name" "$description"
done
