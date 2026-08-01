#!/bin/sh

# Carrega as variáveis privadas do Playwright do .env.development na raiz.
# Use: source ./scripts/export-studio-app-e2e-env.sh

studio_app_e2e_env_error() {
  printf '%s\n' "Erro: $1" >&2
  return 1
}

studio_app_e2e_env_read() {
  studio_app_e2e_key="$1"
  studio_app_e2e_value="$(awk -v key="$studio_app_e2e_key" '
    /^[[:space:]]*#/ || /^[[:space:]]*$/ { next }
    {
      line = $0
      sub(/^[[:space:]]*/, "", line)
      split(line, fields, "=")
      name = fields[1]
      sub(/[[:space:]]*$/, "", name)
      if (name == key) {
        sub(/^[^=]*=[[:space:]]*/, "", line)
        print line
        exit
      }
    }
  ' "$STUDIO_APP_E2E_ENV_FILE")"

  if [ -z "$studio_app_e2e_value" ]; then
    studio_app_e2e_env_error "$studio_app_e2e_key não encontrado em $STUDIO_APP_E2E_ENV_FILE"
    return 1
  fi

  studio_app_e2e_value="$(printf '%s' "$studio_app_e2e_value" | sed \
    -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  printf '%s' "$studio_app_e2e_value"
}

studio_app_e2e_env_main() {
  STUDIO_APP_E2E_ENV_FILE="$(git rev-parse --show-toplevel 2>/dev/null)/.env.development"

  [ -f "$STUDIO_APP_E2E_ENV_FILE" ] ||
    studio_app_e2e_env_error "arquivo $STUDIO_APP_E2E_ENV_FILE não encontrado"

  STUDIO_APP_E2E_EMAIL="$(studio_app_e2e_env_read STUDIO_APP_E2E_EMAIL)" || return 1
  STUDIO_APP_E2E_PASSWORD="$(studio_app_e2e_env_read STUDIO_APP_E2E_PASSWORD)" || return 1
  export STUDIO_APP_E2E_EMAIL
  export STUDIO_APP_E2E_PASSWORD

  printf '%s\n' 'Variáveis STUDIO_APP_E2E_* exportadas.' >&2
}

if studio_app_e2e_env_main; then
  :
else
  studio_app_e2e_env_status=$?
  return "$studio_app_e2e_env_status" 2>/dev/null || exit "$studio_app_e2e_env_status"
fi
