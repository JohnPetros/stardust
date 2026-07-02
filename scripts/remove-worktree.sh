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
Uso: ./scripts/remove-worktree.sh <nome-da-worktree/branch>

Exemplos:
  ./scripts/remove-worktree.sh feature/auth
  ./scripts/remove-worktree.sh fix/payment
EOF
}

require_worktree_name() {
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
  local worktree_name="$1"
  printf "%s\n" "${worktree_name//\//-}"
}

ensure_target_is_not_current_worktree() {
  local current_root="$1"
  local target_path="$2"

  if [[ "$current_root" == "$target_path" ]]; then
    fail "nao remova a worktree a partir dela mesma. Execute o comando pelo repositorio principal ou por outra worktree."
  fi
}

ensure_worktree_exists() {
  local target_path="$1"

  if [[ ! -d "$target_path" ]]; then
    fail "worktree nao encontrada em: $target_path"
  fi

  git worktree list --porcelain | awk '
    $1 == "worktree" {
      print substr($0, index($0, $2))
    }
  ' | grep -Fx -- "$target_path" >/dev/null \
    || fail "a pasta existe, mas nao esta registrada como Git worktree: $target_path"
}

remove_worktree() {
  local target_path="$1"

  log "Removendo worktree em: $target_path"
  git worktree remove "$target_path" \
    || fail "falha ao remover a worktree. Verifique se existem alteracoes nao commitadas."
}

prune_worktree_metadata() {
  log "Limpando metadados obsoletos de worktrees..."
  git worktree prune
}

main() {
  require_worktree_name "$@"
  ensure_git_repository

  local worktree_name="$1"
  local current_root
  local repo_root
  local worktree_parent
  local worktree_dir_name
  local target_path

  current_root="$(current_worktree_root)"
  repo_root="$(primary_worktree_root)"
  worktree_parent="$repo_root/.worktree"
  worktree_dir_name="$(sanitize_worktree_name "$worktree_name")"
  target_path="$worktree_parent/$worktree_dir_name"

  log "Repositorio atual: $current_root"
  log "Repositorio principal: $repo_root"
  log "Worktree informada: $worktree_name"
  log "Destino esperado: $target_path"

  ensure_target_is_not_current_worktree "$current_root" "$target_path"
  ensure_worktree_exists "$target_path"
  remove_worktree "$target_path"
  prune_worktree_metadata

  log "Worktree removida com sucesso."
  log "A branch local nao foi removida automaticamente."
}

main "$@"
