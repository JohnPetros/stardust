#!/usr/bin/env bash
set -euo pipefail

# Publica o relatório da catraca como um comentário "sticky" no PR: um único
# comentário por workspace, atualizado a cada run (em vez de empilhar novos).
#
# Uso:  comment-pr.sh <workspace> <report-file>
# Requer no ambiente: GH_TOKEN, REPO (owner/repo), PR_NUMBER.

WORKSPACE="${1:?uso: comment-pr.sh <workspace> <report-file>}"
REPORT_FILE="${2:?uso: comment-pr.sh <workspace> <report-file>}"

: "${REPO:?REPO não setado}"
: "${PR_NUMBER:?PR_NUMBER não setado}"

if [[ ! -f "$REPORT_FILE" ]]; then
  echo "Relatório não encontrado em '$REPORT_FILE' — pulando comentário." >&2
  exit 0
fi

# Marcador HTML oculto que identifica o comentário deste workspace.
MARKER="<!-- quality-gate:${WORKSPACE} -->"

BODY_FILE="$(mktemp)"
trap 'rm -f "$BODY_FILE"' EXIT
{
  echo "$MARKER"
  echo
  cat "$REPORT_FILE"
} >"$BODY_FILE"

# Procura um comentário já existente com o marcador deste workspace.
COMMENT_ID="$(gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
  --jq "[.[] | select(.body | contains(\"${MARKER}\"))][0].id // empty")"

if [[ -n "$COMMENT_ID" ]]; then
  jq -Rs '{body: .}' "$BODY_FILE" |
    gh api -X PATCH "repos/${REPO}/issues/comments/${COMMENT_ID}" --input - >/dev/null
  echo "Comentário da catraca atualizado para ${WORKSPACE} (id ${COMMENT_ID})."
else
  jq -Rs '{body: .}' "$BODY_FILE" |
    gh api -X POST "repos/${REPO}/issues/${PR_NUMBER}/comments" --input - >/dev/null
  echo "Comentário da catraca criado para ${WORKSPACE}."
fi
