#!/usr/bin/env bash
set -euo pipefail

DEFAULT_BASE_BRANCH="origin/main"

log() {
  printf "==> %s\n" "$1"
}

warn() {
  printf "Aviso: %s\n" "$1" >&2
}

fail() {
  printf "Erro: %s\n" "$1" >&2
  exit 1
}

usage() {
  cat <<EOF
Uso: ./scripts/create-worktree.sh <nome-da-worktree/branch> [branch-base]

Exemplos:
  ./scripts/create-worktree.sh feature/auth
  ./scripts/create-worktree.sh fix/payment origin/develop
EOF
}

require_branch_name() {
  if [[ $# -lt 1 || -z "${1:-}" ]]; then
    usage
    fail "informe o nome da worktree/branch como primeiro parametro."
  fi
}

ensure_git_repository() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || fail "este comando deve ser executado dentro de um repositorio Git."
}

current_worktree_root() {
  git rev-parse --show-toplevel
}

primary_worktree_root() {
  local root

  root="$(git worktree list --porcelain | awk '
    $1 == "worktree" {
      print substr($0, index($0, $2))
      exit
    }
  ')"

  if [[ -z "$root" ]]; then
    current_worktree_root
    return
  fi

  printf "%s\n" "$root"
}

sanitize_worktree_name() {
  local branch_name="$1"
  printf "%s\n" "${branch_name//\//-}"
}

ensure_valid_branch_name() {
  local branch_name="$1"

  git check-ref-format --branch "$branch_name" >/dev/null 2>&1 \
    || fail "nome de branch invalido: $branch_name"
}

ensure_branch_does_not_exist() {
  local branch_name="$1"

  if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    fail "a branch local '$branch_name' ja existe. Nenhuma alteracao foi feita."
  fi
}

ensure_worktree_path_available() {
  local worktree_path="$1"

  if [[ -e "$worktree_path" ]]; then
    fail "a pasta da worktree ja existe: $worktree_path"
  fi
}

ensure_base_branch_exists() {
  local base_branch="$1"

  git rev-parse --verify --quiet "${base_branch}^{commit}" >/dev/null \
    || fail "branch base nao encontrada ou invalida: $base_branch"
}

copy_env_files() {
  local source_root="$1"
  local target_root="$2"
  local worktree_parent="$3"
  local copied_count=0
  local skipped_tracked_count=0

  log "Copiando arquivos .env* locais do projeto original..."

  while IFS= read -r -d '' env_file; do
    local relative_path
    local target_file

    relative_path="${env_file#"$source_root"/}"

    if git -C "$source_root" ls-files --error-unmatch -- "$relative_path" >/dev/null 2>&1; then
      skipped_tracked_count=$((skipped_tracked_count + 1))
      continue
    fi

    target_file="$target_root/$relative_path"

    mkdir -p "$(dirname "$target_file")"
    cp -p "$env_file" "$target_file"
    printf "    %s\n" "$relative_path"
    copied_count=$((copied_count + 1))
  done < <(
    find "$source_root" \
      \( -path "$source_root/.git" -o \
         -path "$source_root/node_modules" -o \
         -path "$worktree_parent" \) -prune -o \
      -type f -name ".env*" -print0
  )

  if [[ "$copied_count" -eq 0 ]]; then
    warn "nenhum arquivo .env* local foi encontrado. Continuando sem copiar envs."
  else
    log "$copied_count arquivo(s) .env* copiado(s)."
  fi

  if [[ "$skipped_tracked_count" -gt 0 ]]; then
    log "$skipped_tracked_count arquivo(s) .env* rastreado(s) pelo Git foram ignorado(s)."
  fi
}

detect_package_manager() {
  local worktree_path="$1"

  if [[ -f "$worktree_path/pnpm-lock.yaml" ]]; then
    printf "pnpm\n"
  elif [[ -f "$worktree_path/package-lock.json" ]]; then
    printf "npm\n"
  elif [[ -f "$worktree_path/yarn.lock" ]]; then
    printf "yarn\n"
  elif [[ -f "$worktree_path/bun.lock" || -f "$worktree_path/bun.lockb" ]]; then
    printf "bun\n"
  fi
}

install_dependencies() {
  local worktree_path="$1"
  local package_manager

  if [[ ! -f "$worktree_path/package.json" ]]; then
    warn "package.json nao encontrado na raiz da worktree. Instalacao de dependencias ignorada."
    return
  fi

  package_manager="$(detect_package_manager "$worktree_path")"

  if [[ -z "$package_manager" ]]; then
    warn "nenhum lockfile conhecido foi encontrado. Instalacao de dependencias ignorada."
    return
  fi

  command -v "$package_manager" >/dev/null 2>&1 \
    || fail "gerenciador de pacotes '$package_manager' nao encontrado no PATH."

  log "Instalando dependencias com $package_manager install..."

  (
    cd "$worktree_path"
    "$package_manager" install
  ) || fail "falha ao instalar dependencias com $package_manager."
}

main() {
  require_branch_name "$@"
  ensure_git_repository

  local branch_name="$1"
  local base_branch="${2:-$DEFAULT_BASE_BRANCH}"
  local source_root
  local repo_root
  local worktree_parent
  local worktree_dir_name
  local worktree_path

  ensure_valid_branch_name "$branch_name"

  source_root="$(current_worktree_root)"
  repo_root="$(primary_worktree_root)"
  worktree_parent="$repo_root/.worktree"
  worktree_dir_name="$(sanitize_worktree_name "$branch_name")"
  worktree_path="$worktree_parent/$worktree_dir_name"

  log "Repositorio atual: $source_root"
  log "Repositorio principal: $repo_root"
  log "Branch nova: $branch_name"
  log "Branch base: $base_branch"
  log "Destino da worktree: $worktree_path"

  ensure_branch_does_not_exist "$branch_name"
  ensure_worktree_path_available "$worktree_path"

  log "Criando pasta de worktrees em $worktree_parent..."
  mkdir -p "$worktree_parent"

  log "Atualizando referencias remotas com git fetch..."
  git fetch

  ensure_base_branch_exists "$base_branch"

  log "Criando worktree e branch local..."
  git worktree add -b "$branch_name" "$worktree_path" "$base_branch" \
    || fail "falha ao criar a worktree."

  copy_env_files "$source_root" "$worktree_path" "$worktree_parent"
  install_dependencies "$worktree_path"

  log "Worktree criada com sucesso em: $worktree_path"
}

main "$@"
