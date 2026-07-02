#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "==> %s\n" "$1"
}

fail() {
  printf "Erro: %s\n" "$1" >&2
  exit 1
}

usage() {
  cat <<EOF
Uso: ./scripts/merge-worktree.sh <branch-da-worktree-destino>

Exemplos:
  ./scripts/merge-worktree.sh main
  ./scripts/merge-worktree.sh feature/auth
EOF
}

require_target_branch() {
  if [[ $# -lt 1 || -z "${1:-}" ]]; then
    usage
    fail "informe a branch da worktree de destino como primeiro parametro."
  fi
}

ensure_git_repository() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || fail "este comando deve ser executado dentro de um repositorio Git."
}

current_worktree_root() {
  git rev-parse --show-toplevel
}

current_branch_name() {
  git symbolic-ref --quiet --short HEAD \
    || fail "HEAD destacado nao e suportado. Faça checkout de uma branch antes de continuar."
}

ensure_branch_exists() {
  local branch_name="$1"

  git show-ref --verify --quiet "refs/heads/$branch_name" \
    || fail "branch local nao encontrada: $branch_name"
}

ensure_worktree_is_clean() {
  local worktree_path="$1"
  local label="$2"

  if [[ -n "$(git -C "$worktree_path" status --porcelain)" ]]; then
    fail "$label possui alteracoes nao commitadas: $worktree_path"
  fi
}

resolve_worktree_path_by_branch() {
  local branch_name="$1"

  git worktree list --porcelain | awk -v expected_branch="refs/heads/$branch_name" '
    $1 == "worktree" {
      current_worktree = substr($0, index($0, $2))
    }

    $1 == "branch" && $2 == expected_branch {
      print current_worktree
      exit
    }
  '
}

ensure_target_worktree_exists() {
  local target_branch="$1"
  local target_path="$2"

  if [[ -z "$target_path" ]]; then
    fail "nenhuma worktree registrada foi encontrada para a branch '$target_branch'."
  fi
}

ensure_target_is_not_source_branch() {
  local source_branch="$1"
  local target_branch="$2"

  if [[ "$source_branch" == "$target_branch" ]]; then
    fail "a branch atual e a branch de destino sao a mesma: $source_branch"
  fi
}

merge_current_branch_into_target() {
  local target_path="$1"
  local source_branch="$2"

  git -C "$target_path" merge "$source_branch" \
    || fail "falha ao fazer merge de '$source_branch' em '$target_path'. Resolva o conflito manualmente."
}

main() {
  require_target_branch "$@"
  ensure_git_repository

  local target_branch="$1"
  local source_root
  local source_branch
  local target_path

  source_root="$(current_worktree_root)"
  source_branch="$(current_branch_name)"

  ensure_branch_exists "$target_branch"
  ensure_target_is_not_source_branch "$source_branch" "$target_branch"
  ensure_worktree_is_clean "$source_root" "A worktree atual"

  target_path="$(resolve_worktree_path_by_branch "$target_branch")"

  ensure_target_worktree_exists "$target_branch" "$target_path"
  ensure_worktree_is_clean "$target_path" "A worktree de destino"

  log "Worktree atual: $source_root"
  log "Branch atual: $source_branch"
  log "Branch destino: $target_branch"
  log "Worktree destino: $target_path"
  log "Executando merge da branch atual na worktree de destino..."

  merge_current_branch_into_target "$target_path" "$source_branch"

  log "Merge concluido com sucesso."
}

main "$@"
